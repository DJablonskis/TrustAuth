import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
export const providerStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: providerStatus.url(options),
    method: 'get',
})

providerStatus.definition = {
    methods: ["get","head"],
    url: '/verification/provider-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
providerStatus.url = (options?: RouteQueryOptions) => {
    return providerStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
providerStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: providerStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
providerStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: providerStatus.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
const providerStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: providerStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
providerStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: providerStatus.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\VerificationController::providerStatus
* @see app/Http/Controllers/VerificationController.php:29
* @route '/verification/provider-status'
*/
providerStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: providerStatus.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

providerStatus.form = providerStatusForm

/**
* @see \App\Http\Controllers\VerificationController::initiate
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/verification/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::initiate
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::initiate
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::initiate
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
const initiateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::initiate
* @see app/Http/Controllers/VerificationController.php:59
* @route '/verification/initiate'
*/
initiateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

initiate.form = initiateForm

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
export const simulateIal2 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2.url(options),
    method: 'post',
})

simulateIal2.definition = {
    methods: ["post"],
    url: '/verification/simulate-ial2',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2.url = (options?: RouteQueryOptions) => {
    return simulateIal2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulateIal2.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
const simulateIal2Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VerificationController::simulateIal2
* @see app/Http/Controllers/VerificationController.php:201
* @route '/verification/simulate-ial2'
*/
simulateIal2Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulateIal2.url(options),
    method: 'post',
})

simulateIal2.form = simulateIal2Form

const verification = {
    providerStatus: Object.assign(providerStatus, providerStatus),
    initiate: Object.assign(initiate, initiate),
    simulateIal2: Object.assign(simulateIal2, simulateIal2),
}

export default verification