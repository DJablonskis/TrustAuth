import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/api/v1/user/verify-identity'
*/
const simulateIal2e5819e877c3b69f0eb0001e8e7130760 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2e5819e877c3b69f0eb0001e8e7130760.url(options),
    method: 'post',
})

simulateIal2e5819e877c3b69f0eb0001e8e7130760.definition = {
    methods: ["post"],
    url: '/api/v1/user/verify-identity',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/api/v1/user/verify-identity'
*/
simulateIal2e5819e877c3b69f0eb0001e8e7130760.url = (options?: RouteQueryOptions) => {
    return simulateIal2e5819e877c3b69f0eb0001e8e7130760.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/api/v1/user/verify-identity'
*/
simulateIal2e5819e877c3b69f0eb0001e8e7130760.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2e5819e877c3b69f0eb0001e8e7130760.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/api/v1/user/verify-identity'
*/
const simulateIal2e5819e877c3b69f0eb0001e8e7130760Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2e5819e877c3b69f0eb0001e8e7130760.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/api/v1/user/verify-identity'
*/
simulateIal2e5819e877c3b69f0eb0001e8e7130760Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2e5819e877c3b69f0eb0001e8e7130760.url(options),
    method: 'post',
})

simulateIal2e5819e877c3b69f0eb0001e8e7130760.form = simulateIal2e5819e877c3b69f0eb0001e8e7130760Form
/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
const simulateIal2be6752facca9c1a30967aaab939601fe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2be6752facca9c1a30967aaab939601fe.url(options),
    method: 'post',
})

simulateIal2be6752facca9c1a30967aaab939601fe.definition = {
    methods: ["post"],
    url: '/verification/simulate-ial2',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2be6752facca9c1a30967aaab939601fe.url = (options?: RouteQueryOptions) => {
    return simulateIal2be6752facca9c1a30967aaab939601fe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2be6752facca9c1a30967aaab939601fe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2be6752facca9c1a30967aaab939601fe.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
const simulateIal2be6752facca9c1a30967aaab939601feForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2be6752facca9c1a30967aaab939601fe.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2be6752facca9c1a30967aaab939601feForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2be6752facca9c1a30967aaab939601fe.url(options),
    method: 'post',
})

simulateIal2be6752facca9c1a30967aaab939601fe.form = simulateIal2be6752facca9c1a30967aaab939601feForm

/**
* Multiple routes resolve to \App\Http\Controllers\VerificationController::simulateIal2, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `simulateIal2['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const simulateIal2 = {
    '/api/v1/user/verify-identity': simulateIal2e5819e877c3b69f0eb0001e8e7130760,
    '/verification/simulate-ial2': simulateIal2be6752facca9c1a30967aaab939601fe,
}

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
export const getProviderStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProviderStatus.url(options),
    method: 'get',
})

getProviderStatus.definition = {
    methods: ["get","head"],
    url: '/verification/provider-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
getProviderStatus.url = (options?: RouteQueryOptions) => {
    return getProviderStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
getProviderStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProviderStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
getProviderStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProviderStatus.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
const getProviderStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProviderStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
getProviderStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProviderStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::getProviderStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
getProviderStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProviderStatus.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getProviderStatus.form = getProviderStatusForm

/**
* @see \App\Http\Controllers\VerificationController::initiateVerification
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
export const initiateVerification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiateVerification.url(options),
    method: 'post',
})

initiateVerification.definition = {
    methods: ["post"],
    url: '/verification/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::initiateVerification
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiateVerification.url = (options?: RouteQueryOptions) => {
    return initiateVerification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::initiateVerification
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiateVerification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiateVerification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::initiateVerification
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
const initiateVerificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiateVerification.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::initiateVerification
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiateVerificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiateVerification.url(options),
    method: 'post',
})

initiateVerification.form = initiateVerificationForm

/**
* @see \App\Http\Controllers\VerificationController::handleDiditWebhook
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
export const handleDiditWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleDiditWebhook.url(options),
    method: 'post',
})

handleDiditWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/didit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::handleDiditWebhook
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
handleDiditWebhook.url = (options?: RouteQueryOptions) => {
    return handleDiditWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::handleDiditWebhook
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
handleDiditWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleDiditWebhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::handleDiditWebhook
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
const handleDiditWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handleDiditWebhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::handleDiditWebhook
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
handleDiditWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handleDiditWebhook.url(options),
    method: 'post',
})

handleDiditWebhook.form = handleDiditWebhookForm

const VerificationController = { simulateIal2, getProviderStatus, initiateVerification, handleDiditWebhook }

export default VerificationController