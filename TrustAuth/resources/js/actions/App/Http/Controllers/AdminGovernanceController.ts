import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::index
* @see app/Http/Controllers/AdminGovernanceController.php:26
* @route '/admin/governance'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleClientStatus
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
export const toggleClientStatus = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleClientStatus.url(args, options),
    method: 'post',
})

toggleClientStatus.definition = {
    methods: ["post"],
    url: '/admin/governance/clients/{client}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleClientStatus
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggleClientStatus.url = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleClientStatus.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleClientStatus
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggleClientStatus.post = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleClientStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleClientStatus
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
const toggleClientStatusForm = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleClientStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleClientStatus
* @see app/Http/Controllers/AdminGovernanceController.php:146
* @route '/admin/governance/clients/{client}/toggle-status'
*/
toggleClientStatusForm.post = (args: { client: string | number } | [client: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleClientStatus.url(args, options),
    method: 'post',
})

toggleClientStatus.form = toggleClientStatusForm

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleUserIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
export const toggleUserIal = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleUserIal.url(args, options),
    method: 'post',
})

toggleUserIal.definition = {
    methods: ["post"],
    url: '/admin/governance/users/{user}/toggle-ial',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleUserIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleUserIal.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleUserIal.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleUserIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleUserIal.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleUserIal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleUserIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
const toggleUserIalForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleUserIal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::toggleUserIal
* @see app/Http/Controllers/AdminGovernanceController.php:179
* @route '/admin/governance/users/{user}/toggle-ial'
*/
toggleUserIalForm.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleUserIal.url(args, options),
    method: 'post',
})

toggleUserIal.form = toggleUserIalForm

/**
* @see \App\Http\Controllers\AdminGovernanceController::retryErasureWebhook
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
export const retryErasureWebhook = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryErasureWebhook.url(args, options),
    method: 'post',
})

retryErasureWebhook.definition = {
    methods: ["post"],
    url: '/admin/governance/erasures/{erasure}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminGovernanceController::retryErasureWebhook
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retryErasureWebhook.url = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return retryErasureWebhook.definition.url
            .replace('{erasure}', parsedArgs.erasure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminGovernanceController::retryErasureWebhook
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retryErasureWebhook.post = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryErasureWebhook.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::retryErasureWebhook
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
const retryErasureWebhookForm = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryErasureWebhook.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminGovernanceController::retryErasureWebhook
* @see app/Http/Controllers/AdminGovernanceController.php:206
* @route '/admin/governance/erasures/{erasure}/retry'
*/
retryErasureWebhookForm.post = (args: { erasure: string | number } | [erasure: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryErasureWebhook.url(args, options),
    method: 'post',
})

retryErasureWebhook.form = retryErasureWebhookForm

const AdminGovernanceController = { index, toggleClientStatus, toggleUserIal, retryErasureWebhook }

export default AdminGovernanceController