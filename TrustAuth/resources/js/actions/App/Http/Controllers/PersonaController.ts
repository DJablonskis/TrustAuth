import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
const index9658b896891d4cda20de1ee41156a4e1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'get',
})

index9658b896891d4cda20de1ee41156a4e1.definition = {
    methods: ["get","head"],
    url: '/api/v1/personas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index9658b896891d4cda20de1ee41156a4e1.url = (options?: RouteQueryOptions) => {
    return index9658b896891d4cda20de1ee41156a4e1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index9658b896891d4cda20de1ee41156a4e1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index9658b896891d4cda20de1ee41156a4e1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
const index9658b896891d4cda20de1ee41156a4e1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index9658b896891d4cda20de1ee41156a4e1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/api/v1/personas'
*/
index9658b896891d4cda20de1ee41156a4e1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9658b896891d4cda20de1ee41156a4e1.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index9658b896891d4cda20de1ee41156a4e1.form = index9658b896891d4cda20de1ee41156a4e1Form
/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
const index42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

index42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
index42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return index42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
index42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
index42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
const index42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
index42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::index
* @see app/Http/Controllers/PersonaController.php:27
* @route '/dashboard'
*/
index42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index42a740574ecbfbac32f8cc353fc32db9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index42a740574ecbfbac32f8cc353fc32db9.form = index42a740574ecbfbac32f8cc353fc32db9Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/api/v1/personas': index9658b896891d4cda20de1ee41156a4e1,
    '/dashboard': index42a740574ecbfbac32f8cc353fc32db9,
}

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
const store9658b896891d4cda20de1ee41156a4e1 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'post',
})

store9658b896891d4cda20de1ee41156a4e1.definition = {
    methods: ["post"],
    url: '/api/v1/personas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
store9658b896891d4cda20de1ee41156a4e1.url = (options?: RouteQueryOptions) => {
    return store9658b896891d4cda20de1ee41156a4e1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
store9658b896891d4cda20de1ee41156a4e1.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
const store9658b896891d4cda20de1ee41156a4e1Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/api/v1/personas'
*/
store9658b896891d4cda20de1ee41156a4e1Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store9658b896891d4cda20de1ee41156a4e1.url(options),
    method: 'post',
})

store9658b896891d4cda20de1ee41156a4e1.form = store9658b896891d4cda20de1ee41156a4e1Form
/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
const store92cf4b641ae77b3def4d4581fcf47044 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store92cf4b641ae77b3def4d4581fcf47044.url(options),
    method: 'post',
})

store92cf4b641ae77b3def4d4581fcf47044.definition = {
    methods: ["post"],
    url: '/personas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
store92cf4b641ae77b3def4d4581fcf47044.url = (options?: RouteQueryOptions) => {
    return store92cf4b641ae77b3def4d4581fcf47044.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
store92cf4b641ae77b3def4d4581fcf47044.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store92cf4b641ae77b3def4d4581fcf47044.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
const store92cf4b641ae77b3def4d4581fcf47044Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store92cf4b641ae77b3def4d4581fcf47044.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::store
* @see app/Http/Controllers/PersonaController.php:70
* @route '/personas'
*/
store92cf4b641ae77b3def4d4581fcf47044Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store92cf4b641ae77b3def4d4581fcf47044.url(options),
    method: 'post',
})

store92cf4b641ae77b3def4d4581fcf47044.form = store92cf4b641ae77b3def4d4581fcf47044Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::store, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `store['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const store = {
    '/api/v1/personas': store9658b896891d4cda20de1ee41156a4e1,
    '/personas': store92cf4b641ae77b3def4d4581fcf47044,
}

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
const update74d07cdd2b8c41e8a21fc2923da9c928 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, options),
    method: 'put',
})

update74d07cdd2b8c41e8a21fc2923da9c928.definition = {
    methods: ["put","patch"],
    url: '/api/v1/personas/{persona}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update74d07cdd2b8c41e8a21fc2923da9c928.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update74d07cdd2b8c41e8a21fc2923da9c928.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update74d07cdd2b8c41e8a21fc2923da9c928.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
update74d07cdd2b8c41e8a21fc2923da9c928.patch = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/api/v1/personas/{persona}'
*/
const update74d07cdd2b8c41e8a21fc2923da9c928Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, {
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
update74d07cdd2b8c41e8a21fc2923da9c928Form.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, {
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
update74d07cdd2b8c41e8a21fc2923da9c928Form.patch = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update74d07cdd2b8c41e8a21fc2923da9c928.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update74d07cdd2b8c41e8a21fc2923da9c928.form = update74d07cdd2b8c41e8a21fc2923da9c928Form
/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
const update82f5a93d8f24f93ef530c577b1e13552 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update82f5a93d8f24f93ef530c577b1e13552.url(args, options),
    method: 'put',
})

update82f5a93d8f24f93ef530c577b1e13552.definition = {
    methods: ["put"],
    url: '/personas/{persona}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
update82f5a93d8f24f93ef530c577b1e13552.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update82f5a93d8f24f93ef530c577b1e13552.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
update82f5a93d8f24f93ef530c577b1e13552.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update82f5a93d8f24f93ef530c577b1e13552.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PersonaController::update
* @see app/Http/Controllers/PersonaController.php:291
* @route '/personas/{persona}'
*/
const update82f5a93d8f24f93ef530c577b1e13552Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update82f5a93d8f24f93ef530c577b1e13552.url(args, {
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
update82f5a93d8f24f93ef530c577b1e13552Form.put = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update82f5a93d8f24f93ef530c577b1e13552.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update82f5a93d8f24f93ef530c577b1e13552.form = update82f5a93d8f24f93ef530c577b1e13552Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/api/v1/personas/{persona}': update74d07cdd2b8c41e8a21fc2923da9c928,
    '/personas/{persona}': update82f5a93d8f24f93ef530c577b1e13552,
}

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
const destroy74d07cdd2b8c41e8a21fc2923da9c928 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy74d07cdd2b8c41e8a21fc2923da9c928.url(args, options),
    method: 'delete',
})

destroy74d07cdd2b8c41e8a21fc2923da9c928.definition = {
    methods: ["delete"],
    url: '/api/v1/personas/{persona}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
destroy74d07cdd2b8c41e8a21fc2923da9c928.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy74d07cdd2b8c41e8a21fc2923da9c928.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
destroy74d07cdd2b8c41e8a21fc2923da9c928.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy74d07cdd2b8c41e8a21fc2923da9c928.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/api/v1/personas/{persona}'
*/
const destroy74d07cdd2b8c41e8a21fc2923da9c928Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy74d07cdd2b8c41e8a21fc2923da9c928.url(args, {
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
destroy74d07cdd2b8c41e8a21fc2923da9c928Form.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy74d07cdd2b8c41e8a21fc2923da9c928.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy74d07cdd2b8c41e8a21fc2923da9c928.form = destroy74d07cdd2b8c41e8a21fc2923da9c928Form
/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
const destroy82f5a93d8f24f93ef530c577b1e13552 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy82f5a93d8f24f93ef530c577b1e13552.url(args, options),
    method: 'delete',
})

destroy82f5a93d8f24f93ef530c577b1e13552.definition = {
    methods: ["delete"],
    url: '/personas/{persona}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
destroy82f5a93d8f24f93ef530c577b1e13552.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy82f5a93d8f24f93ef530c577b1e13552.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
destroy82f5a93d8f24f93ef530c577b1e13552.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy82f5a93d8f24f93ef530c577b1e13552.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PersonaController::destroy
* @see app/Http/Controllers/PersonaController.php:372
* @route '/personas/{persona}'
*/
const destroy82f5a93d8f24f93ef530c577b1e13552Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy82f5a93d8f24f93ef530c577b1e13552.url(args, {
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
destroy82f5a93d8f24f93ef530c577b1e13552Form.delete = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy82f5a93d8f24f93ef530c577b1e13552.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy82f5a93d8f24f93ef530c577b1e13552.form = destroy82f5a93d8f24f93ef530c577b1e13552Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::destroy, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `destroy['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const destroy = {
    '/api/v1/personas/{persona}': destroy74d07cdd2b8c41e8a21fc2923da9c928,
    '/personas/{persona}': destroy82f5a93d8f24f93ef530c577b1e13552,
}

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/api/v1/personas/{persona}/verify-age'
*/
const toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.url(args, options),
    method: 'post',
})

toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.definition = {
    methods: ["post"],
    url: '/api/v1/personas/{persona}/verify-age',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/api/v1/personas/{persona}/verify-age'
*/
toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/api/v1/personas/{persona}/verify-age'
*/
toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/api/v1/personas/{persona}/verify-age'
*/
const toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/api/v1/personas/{persona}/verify-age'
*/
toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9Form.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.url(args, options),
    method: 'post',
})

toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9.form = toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9Form
/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
const toggleAgeVerification15533bc0a1b985a043ceed387892d558 = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAgeVerification15533bc0a1b985a043ceed387892d558.url(args, options),
    method: 'post',
})

toggleAgeVerification15533bc0a1b985a043ceed387892d558.definition = {
    methods: ["post"],
    url: '/personas/{persona}/verify-age',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
toggleAgeVerification15533bc0a1b985a043ceed387892d558.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleAgeVerification15533bc0a1b985a043ceed387892d558.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
toggleAgeVerification15533bc0a1b985a043ceed387892d558.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleAgeVerification15533bc0a1b985a043ceed387892d558.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
const toggleAgeVerification15533bc0a1b985a043ceed387892d558Form = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAgeVerification15533bc0a1b985a043ceed387892d558.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::toggleAgeVerification
* @see app/Http/Controllers/PersonaController.php:402
* @route '/personas/{persona}/verify-age'
*/
toggleAgeVerification15533bc0a1b985a043ceed387892d558Form.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleAgeVerification15533bc0a1b985a043ceed387892d558.url(args, options),
    method: 'post',
})

toggleAgeVerification15533bc0a1b985a043ceed387892d558.form = toggleAgeVerification15533bc0a1b985a043ceed387892d558Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::toggleAgeVerification, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `toggleAgeVerification['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const toggleAgeVerification = {
    '/api/v1/personas/{persona}/verify-age': toggleAgeVerification9d910a0f97ccb10ee570bf00ee4940e9,
    '/personas/{persona}/verify-age': toggleAgeVerification15533bc0a1b985a043ceed387892d558,
}

/**
* @see \App\Http\Controllers\PersonaController::uploadAvatar
* @see app/Http/Controllers/PersonaController.php:441
* @route '/api/v1/personas/{persona}/avatar'
*/
export const uploadAvatar = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(args, options),
    method: 'post',
})

uploadAvatar.definition = {
    methods: ["post"],
    url: '/api/v1/personas/{persona}/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::uploadAvatar
* @see app/Http/Controllers/PersonaController.php:441
* @route '/api/v1/personas/{persona}/avatar'
*/
uploadAvatar.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadAvatar.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::uploadAvatar
* @see app/Http/Controllers/PersonaController.php:441
* @route '/api/v1/personas/{persona}/avatar'
*/
uploadAvatar.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::uploadAvatar
* @see app/Http/Controllers/PersonaController.php:441
* @route '/api/v1/personas/{persona}/avatar'
*/
const uploadAvatarForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::uploadAvatar
* @see app/Http/Controllers/PersonaController.php:441
* @route '/api/v1/personas/{persona}/avatar'
*/
uploadAvatarForm.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(args, options),
    method: 'post',
})

uploadAvatar.form = uploadAvatarForm

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
const userInfodfe15c408966b976148595e17fffa14b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userInfodfe15c408966b976148595e17fffa14b.url(options),
    method: 'get',
})

userInfodfe15c408966b976148595e17fffa14b.definition = {
    methods: ["get","head"],
    url: '/api/v1/userinfo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
userInfodfe15c408966b976148595e17fffa14b.url = (options?: RouteQueryOptions) => {
    return userInfodfe15c408966b976148595e17fffa14b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
userInfodfe15c408966b976148595e17fffa14b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userInfodfe15c408966b976148595e17fffa14b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
userInfodfe15c408966b976148595e17fffa14b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userInfodfe15c408966b976148595e17fffa14b.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
const userInfodfe15c408966b976148595e17fffa14bForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfodfe15c408966b976148595e17fffa14b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
userInfodfe15c408966b976148595e17fffa14bForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfodfe15c408966b976148595e17fffa14b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/v1/userinfo'
*/
userInfodfe15c408966b976148595e17fffa14bForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfodfe15c408966b976148595e17fffa14b.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userInfodfe15c408966b976148595e17fffa14b.form = userInfodfe15c408966b976148595e17fffa14bForm
/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
const userInfoad243cc33ba277250528a724481a6806 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userInfoad243cc33ba277250528a724481a6806.url(options),
    method: 'get',
})

userInfoad243cc33ba277250528a724481a6806.definition = {
    methods: ["get","head"],
    url: '/api/userinfo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
userInfoad243cc33ba277250528a724481a6806.url = (options?: RouteQueryOptions) => {
    return userInfoad243cc33ba277250528a724481a6806.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
userInfoad243cc33ba277250528a724481a6806.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userInfoad243cc33ba277250528a724481a6806.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
userInfoad243cc33ba277250528a724481a6806.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userInfoad243cc33ba277250528a724481a6806.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
const userInfoad243cc33ba277250528a724481a6806Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfoad243cc33ba277250528a724481a6806.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
userInfoad243cc33ba277250528a724481a6806Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfoad243cc33ba277250528a724481a6806.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PersonaController::userInfo
* @see app/Http/Controllers/PersonaController.php:150
* @route '/api/userinfo'
*/
userInfoad243cc33ba277250528a724481a6806Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userInfoad243cc33ba277250528a724481a6806.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userInfoad243cc33ba277250528a724481a6806.form = userInfoad243cc33ba277250528a724481a6806Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::userInfo, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `userInfo['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const userInfo = {
    '/api/v1/userinfo': userInfodfe15c408966b976148595e17fffa14b,
    '/api/userinfo': userInfoad243cc33ba277250528a724481a6806,
}

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/api/v1/personas/transliterate'
*/
const transliteratef1a23d67eb155e0ffaefa34f85d9ca13 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliteratef1a23d67eb155e0ffaefa34f85d9ca13.url(options),
    method: 'post',
})

transliteratef1a23d67eb155e0ffaefa34f85d9ca13.definition = {
    methods: ["post"],
    url: '/api/v1/personas/transliterate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/api/v1/personas/transliterate'
*/
transliteratef1a23d67eb155e0ffaefa34f85d9ca13.url = (options?: RouteQueryOptions) => {
    return transliteratef1a23d67eb155e0ffaefa34f85d9ca13.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/api/v1/personas/transliterate'
*/
transliteratef1a23d67eb155e0ffaefa34f85d9ca13.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliteratef1a23d67eb155e0ffaefa34f85d9ca13.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/api/v1/personas/transliterate'
*/
const transliteratef1a23d67eb155e0ffaefa34f85d9ca13Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliteratef1a23d67eb155e0ffaefa34f85d9ca13.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/api/v1/personas/transliterate'
*/
transliteratef1a23d67eb155e0ffaefa34f85d9ca13Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliteratef1a23d67eb155e0ffaefa34f85d9ca13.url(options),
    method: 'post',
})

transliteratef1a23d67eb155e0ffaefa34f85d9ca13.form = transliteratef1a23d67eb155e0ffaefa34f85d9ca13Form
/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
const transliterate6aa166b74f1858629ba65261518eafb8 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliterate6aa166b74f1858629ba65261518eafb8.url(options),
    method: 'post',
})

transliterate6aa166b74f1858629ba65261518eafb8.definition = {
    methods: ["post"],
    url: '/personas/transliterate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterate6aa166b74f1858629ba65261518eafb8.url = (options?: RouteQueryOptions) => {
    return transliterate6aa166b74f1858629ba65261518eafb8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterate6aa166b74f1858629ba65261518eafb8.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transliterate6aa166b74f1858629ba65261518eafb8.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
const transliterate6aa166b74f1858629ba65261518eafb8Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliterate6aa166b74f1858629ba65261518eafb8.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::transliterate
* @see app/Http/Controllers/PersonaController.php:266
* @route '/personas/transliterate'
*/
transliterate6aa166b74f1858629ba65261518eafb8Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: transliterate6aa166b74f1858629ba65261518eafb8.url(options),
    method: 'post',
})

transliterate6aa166b74f1858629ba65261518eafb8.form = transliterate6aa166b74f1858629ba65261518eafb8Form

/**
* Multiple routes resolve to \App\Http\Controllers\PersonaController::transliterate, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `transliterate['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const transliterate = {
    '/api/v1/personas/transliterate': transliteratef1a23d67eb155e0ffaefa34f85d9ca13,
    '/personas/transliterate': transliterate6aa166b74f1858629ba65261518eafb8,
}

/**
* @see \App\Http\Controllers\PersonaController::addClaim
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
export const addClaim = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addClaim.url(args, options),
    method: 'post',
})

addClaim.definition = {
    methods: ["post"],
    url: '/personas/{persona}/claims',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::addClaim
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
addClaim.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return addClaim.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::addClaim
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
addClaim.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addClaim.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::addClaim
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
const addClaimForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addClaim.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::addClaim
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
addClaimForm.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addClaim.url(args, options),
    method: 'post',
})

addClaim.form = addClaimForm

const PersonaController = { index, store, show, update, destroy, toggleAgeVerification, uploadAvatar, userInfo, transliterate, addClaim }

export default PersonaController