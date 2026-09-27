import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showLogin
* @see app/Http/Controllers/AuthController.php:19
* @route '/login'
*/
showLoginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showLogin.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showLogin.form = showLoginForm

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:31
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:31
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:31
* @route '/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:31
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:31
* @route '/login'
*/
loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

login.form = loginForm

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::showRegister
* @see app/Http/Controllers/AuthController.php:54
* @route '/register'
*/
showRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showRegister.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showRegister.form = showRegisterForm

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:66
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:66
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:66
* @route '/register'
*/
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:66
* @route '/register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::register
* @see app/Http/Controllers/AuthController.php:66
* @route '/register'
*/
registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: register.url(options),
    method: 'post',
})

register.form = registerForm

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:92
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:92
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:92
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:92
* @route '/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::logout
* @see app/Http/Controllers/AuthController.php:92
* @route '/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

const AuthController = { showLogin, login, showRegister, register, logout }

export default AuthController