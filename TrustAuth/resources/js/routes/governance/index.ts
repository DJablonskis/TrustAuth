import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
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
* @see \App\Http\Controllers\GovernanceController::revoke
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
export const revoke = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/governance/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::revoke
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revoke.url = (options?: RouteQueryOptions) => {
    return revoke.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::revoke
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revoke.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revoke
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
const revokeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revoke
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revokeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revoke.url(options),
    method: 'post',
})

revoke.form = revokeForm

const governance = {
    index: Object.assign(index, index),
    revoke: Object.assign(revoke, revoke),
}

export default governance