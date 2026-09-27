import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminGovernanceController::toggle
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
export const toggle = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/admin/governance/clients/{client}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggle
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggle.url = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

    if (Array.isArray(args)) {
        args = {
            client: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        client: args.client,
    }

    return toggle.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggle
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggle.post = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggle
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
const toggleForm = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggle
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggleForm.post = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

const client = {
    toggle: Object.assign(toggle, toggle),
}

export default client