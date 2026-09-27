import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\VerificationController::didit
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
export const didit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: didit.url(options),
    method: 'post',
})

didit.definition = {
    methods: ["post"],
    url: '/webhooks/didit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::didit
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
didit.url = (options?: RouteQueryOptions) => {
    return didit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::didit
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
didit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: didit.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::didit
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
const diditForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: didit.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::didit
* @see app/Http/Controllers/VerificationController.php:101
* @route '/webhooks/didit'
*/
diditForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: didit.url(options),
    method: 'post',
})

didit.form = diditForm

const webhooks = {
    didit: Object.assign(didit, didit),
}

export default webhooks