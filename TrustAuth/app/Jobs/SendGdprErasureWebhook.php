<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Passport\Client;

/**
 * Class SendGdprErasureWebhook
 *
 * This queued job simulates outbound GDPR Article 17 (Right to Erasure) webhook delivery
 * to third-party clients. It increments delivery attempts, dispatches HTTP POST requests,
 * and logs the outcome (status and HTTP response code) to the client_erasures database table.
 */
class SendGdprErasureWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The UUID of the client erasure record.
     */
    protected string $erasureId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $erasureId)
    {
        $this->erasureId = $erasureId;
    }

    /**
     * Execute the job.
     *
     * Retrieves the erasure record, increments the attempt count, dispatches the HTTP POST,
     * and logs the response status/code back to the database.
     *
     * @throws \Exception
     */
    public function handle(): void
    {
        // 1. Fetch the erasure record from the database.
        $erasure = DB::table('client_erasures')->where('id', $this->erasureId)->first();

        if (! $erasure) {
            Log::warning("SendGdprErasureWebhook: Erasure record with ID {$this->erasureId} not found.");

            return;
        }

        // 2. Increment the attempt counter and update the timestamp.
        $attempts = $erasure->attempts + 1;
        DB::table('client_erasures')->where('id', $this->erasureId)->update([
            'attempts' => $attempts,
            'last_attempt_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Resolve destination webhook endpoint and client pre-shared secret
        $client = Client::find($erasure->client_id);
        $clientSecret = ($client && ! empty($client->secret) && ! str_starts_with($client->secret, '$2y$'))
            ? $client->secret
            : config('services.gdpr.webhook_secret', 'mock-client-secret-12345');

        $endpoint = config('services.gdpr.webhook_url') ?: 'https://client.example.com/gdpr/erase';

        // 4. Construct payload with timestamp and cryptographic nonce for replay protection
        $timestamp = now()->timestamp;
        $nonce = (string) Str::uuid();

        $payload = [
            'event' => 'identity.erasure_request',
            'erasure_id' => $erasure->id,
            'user_id' => $erasure->user_id,
            'client_id' => $erasure->client_id,
            'client_name' => $erasure->client_name,
            'timestamp' => $timestamp,
            'nonce' => $nonce,
        ];

        $jsonPayload = json_encode($payload);
        $signature = hash_hmac('sha256', $jsonPayload, $clientSecret);

        try {
            // 5. Send the POST request with HMAC-SHA256 signature and replay prevention headers.
            $response = Http::timeout(10)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Signature-SHA256' => $signature,
                    'X-Timestamp' => (string) $timestamp,
                    'X-Nonce' => $nonce,
                ])
                ->withBody($jsonPayload, 'application/json')
                ->post($endpoint);

            $statusCode = $response->status();
            $status = $response->successful() ? 'completed' : 'failed';

            // 6. Update the database record with outcome.
            DB::table('client_erasures')->where('id', $this->erasureId)->update([
                'status' => $status,
                'response_code' => $statusCode,
                'updated_at' => now(),
            ]);

            if (! $response->successful()) {
                throw new \Exception("Webhook response failed with status {$statusCode}");
            }
        } catch (\Exception $exception) {
            // In case of request timeout, DNS failure, or other HTTP errors.
            $statusCode = isset($response) ? $response->status() : 500;

            DB::table('client_erasures')->where('id', $this->erasureId)->update([
                'status' => 'failed',
                'response_code' => $statusCode,
                'updated_at' => now(),
            ]);

            Log::error("SendGdprErasureWebhook failed for ID {$this->erasureId}: ".$exception->getMessage());

            // Re-throw exception so Laravel queue system handles retries if needed.
            throw $exception;
        }
    }
}
