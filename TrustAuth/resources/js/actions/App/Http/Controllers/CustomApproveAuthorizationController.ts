import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomApproveAuthorizationController::approve
* @see app/Http/Controllers/CustomApproveAuthorizationController.php:21
* @route '/oauth/authorize'
*/
export const approve = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/oauth/authorize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomApproveAuthorizationController::approve
* @see app/Http/Controllers/CustomApproveAuthorizationController.php:21
* @route '/oauth/authorize'
*/
approve.url = (options?: RouteQueryOptions) => {
    return approve.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomApproveAuthorizationController::approve
* @see app/Http/Controllers/CustomApproveAuthorizationController.php:21
* @route '/oauth/authorize'
*/
approve.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomApproveAuthorizationController::approve
* @see app/Http/Controllers/CustomApproveAuthorizationController.php:21
* @route '/oauth/authorize'
*/
const approveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomApproveAuthorizationController::approve
* @see app/Http/Controllers/CustomApproveAuthorizationController.php:21
* @route '/oauth/authorize'
*/
approveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(options),
    method: 'post',
})

approve.form = approveForm

const CustomApproveAuthorizationController = { approve }

export default CustomApproveAuthorizationController