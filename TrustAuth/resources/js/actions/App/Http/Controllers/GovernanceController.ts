import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
const index35da6e3317611785241828455317e819 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index35da6e3317611785241828455317e819.url(options),
    method: 'get',
})

index35da6e3317611785241828455317e819.definition = {
    methods: ["get","head"],
    url: '/api/v1/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
index35da6e3317611785241828455317e819.url = (options?: RouteQueryOptions) => {
    return index35da6e3317611785241828455317e819.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
index35da6e3317611785241828455317e819.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index35da6e3317611785241828455317e819.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
index35da6e3317611785241828455317e819.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index35da6e3317611785241828455317e819.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
const index35da6e3317611785241828455317e819Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index35da6e3317611785241828455317e819.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
index35da6e3317611785241828455317e819Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index35da6e3317611785241828455317e819.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/api/v1/governance'
*/
index35da6e3317611785241828455317e819Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index35da6e3317611785241828455317e819.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index35da6e3317611785241828455317e819.form = index35da6e3317611785241828455317e819Form
/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
const index3809c7e3fcfad0876374cd06d118620d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3809c7e3fcfad0876374cd06d118620d.url(options),
    method: 'get',
})

index3809c7e3fcfad0876374cd06d118620d.definition = {
    methods: ["get","head"],
    url: '/governance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index3809c7e3fcfad0876374cd06d118620d.url = (options?: RouteQueryOptions) => {
    return index3809c7e3fcfad0876374cd06d118620d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index3809c7e3fcfad0876374cd06d118620d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index3809c7e3fcfad0876374cd06d118620d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index3809c7e3fcfad0876374cd06d118620d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index3809c7e3fcfad0876374cd06d118620d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
const index3809c7e3fcfad0876374cd06d118620dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3809c7e3fcfad0876374cd06d118620d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index3809c7e3fcfad0876374cd06d118620dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3809c7e3fcfad0876374cd06d118620d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GovernanceController::index
* @see app/Http/Controllers/GovernanceController.php:34
* @route '/governance'
*/
index3809c7e3fcfad0876374cd06d118620dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index3809c7e3fcfad0876374cd06d118620d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index3809c7e3fcfad0876374cd06d118620d.form = index3809c7e3fcfad0876374cd06d118620dForm

/**
* Multiple routes resolve to \App\Http\Controllers\GovernanceController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/api/v1/governance': index35da6e3317611785241828455317e819,
    '/governance': index3809c7e3fcfad0876374cd06d118620d,
}

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/api/v1/governance/revoke'
*/
const revokeAndErase880e0580b739eef0a2b9d7a129375fad = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAndErase880e0580b739eef0a2b9d7a129375fad.url(options),
    method: 'post',
})

revokeAndErase880e0580b739eef0a2b9d7a129375fad.definition = {
    methods: ["post"],
    url: '/api/v1/governance/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/api/v1/governance/revoke'
*/
revokeAndErase880e0580b739eef0a2b9d7a129375fad.url = (options?: RouteQueryOptions) => {
    return revokeAndErase880e0580b739eef0a2b9d7a129375fad.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/api/v1/governance/revoke'
*/
revokeAndErase880e0580b739eef0a2b9d7a129375fad.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAndErase880e0580b739eef0a2b9d7a129375fad.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/api/v1/governance/revoke'
*/
const revokeAndErase880e0580b739eef0a2b9d7a129375fadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeAndErase880e0580b739eef0a2b9d7a129375fad.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/api/v1/governance/revoke'
*/
revokeAndErase880e0580b739eef0a2b9d7a129375fadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeAndErase880e0580b739eef0a2b9d7a129375fad.url(options),
    method: 'post',
})

revokeAndErase880e0580b739eef0a2b9d7a129375fad.form = revokeAndErase880e0580b739eef0a2b9d7a129375fadForm
/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
const revokeAndErase3c9f3c365159a7a011bd24e897e2cc42 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.url(options),
    method: 'post',
})

revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.definition = {
    methods: ["post"],
    url: '/governance/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.url = (options?: RouteQueryOptions) => {
    return revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
const revokeAndErase3c9f3c365159a7a011bd24e897e2cc42Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GovernanceController::revokeAndErase
* @see app/Http/Controllers/GovernanceController.php:100
* @route '/governance/revoke'
*/
revokeAndErase3c9f3c365159a7a011bd24e897e2cc42Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.url(options),
    method: 'post',
})

revokeAndErase3c9f3c365159a7a011bd24e897e2cc42.form = revokeAndErase3c9f3c365159a7a011bd24e897e2cc42Form

/**
* Multiple routes resolve to \App\Http\Controllers\GovernanceController::revokeAndErase, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `revokeAndErase['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const revokeAndErase = {
    '/api/v1/governance/revoke': revokeAndErase880e0580b739eef0a2b9d7a129375fad,
    '/governance/revoke': revokeAndErase3c9f3c365159a7a011bd24e897e2cc42,
}

const GovernanceController = { index, revokeAndErase }

export default GovernanceController