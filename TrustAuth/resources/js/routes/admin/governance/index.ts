import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import client from './client'
import user from './user'
import erasure from './erasure'
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

const governance = {
    index: Object.assign(index, index),
    client: Object.assign(client, client),
    user: Object.assign(user, user),
    erasure: Object.assign(erasure, erasure),
}

export default governance