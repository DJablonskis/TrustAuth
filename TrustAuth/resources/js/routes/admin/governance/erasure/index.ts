import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminGovernanceController::retry
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
export const retry = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/governance/erasures/{erasure}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::retry
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retry.url = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { erasure: args }
    }

    if (Array.isArray(args)) {
        args = {
            erasure: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        erasure: args.erasure,
    }

    return retry.definition.url
            .replace('{erasure}', parsedArgs.erasure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::retry
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retry.post = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::retry
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
const retryForm = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::retry
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retryForm.post = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

retry.form = retryForm

const erasure = {
    retry: Object.assign(retry, retry),
}

export default erasure