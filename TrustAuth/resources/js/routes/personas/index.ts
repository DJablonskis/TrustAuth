import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import claims from './claims'
/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/personas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
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
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/personas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/personas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
export const show = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/personas/{persona}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
show.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return show.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
show.get = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
show.head = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
const showForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
showForm.get = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::show
* @see app/Http/Controllers/PersonaController.php:115
* @route '/api/v1/personas/{persona}'
*/
showForm.head = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
export const update = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/personas/{persona}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return update.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update.patch = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
const updateForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
updateForm.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
updateForm.patch = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
export const update = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/personas/{persona}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
update.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return update.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
update.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
const updateForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
updateForm.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
export const destroy = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/personas/{persona}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
destroy.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return destroy.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
destroy.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
const destroyForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
destroyForm.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
export const destroy = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/personas/{persona}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
destroy.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return destroy.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
destroy.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
const destroyForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
destroyForm.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PersonaController::verifyAge
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
export const verifyAge = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyAge.url(args, options),
    method: 'post',
})

verifyAge.definition = {
    methods: ["post"],
    url: '/personas/{persona}/verify-age',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::verifyAge
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
verifyAge.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { persona: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { persona: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            persona: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        persona: typeof args.persona === 'object'
        ? args.persona.id
        : args.persona,
    }

    return verifyAge.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::verifyAge
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
verifyAge.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyAge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::verifyAge
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
const verifyAgeForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyAge.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::verifyAge
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
verifyAgeForm.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verifyAge.url(args, options),
    method: 'post',
})

verifyAge.form = verifyAgeForm

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
export const transliterate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliterate.url(options),
    method: 'post',
})

transliterate.definition = {
    methods: ["post"],
    url: '/personas/transliterate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterate.url = (options?: RouteQueryOptions) => {
    return transliterate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliterate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
const transliterateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliterate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliterate.url(options),
    method: 'post',
})

transliterate.form = transliterateForm

const personas = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    claims: Object.assign(claims, claims),
    verifyAge: Object.assign(verifyAge, verifyAge),
    transliterate: Object.assign(transliterate, transliterate),
}

export default personas