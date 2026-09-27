import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
export const toggleIal = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleIal.url(args, options),
    method: 'post',
})

toggleIal.definition = {
    methods: ["post"],
    url: '/admin/governance/users/{user}/toggle-ial',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleIal.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: args.user,
    }

    return toggleIal.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleIal.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleIal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
const toggleIalForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleIal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleIalForm.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleIal.url(args, options),
    method: 'post',
})

toggleIal.form = toggleIalForm

const user = {
    toggleIal: Object.assign(toggleIal, toggleIal),
}

export default user