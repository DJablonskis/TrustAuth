import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PersonaController::add
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
export const add = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/personas/{persona}/claims',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PersonaController::add
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
add.url = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return add.definition.url
            .replace('{persona}', parsedArgs.persona.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PersonaController::add
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
add.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::add
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
const addForm = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: add.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PersonaController::add
* @see app/Http/Controllers/PersonaController.php:342
* @route '/personas/{persona}/claims'
*/
addForm.post = (args: { persona: number | { id: number } } | [persona: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: add.url(args, options),
    method: 'post',
})

add.form = addForm

const claims = {
    add: Object.assign(add, add),
}

export default claims