var API_PREFIX = 'api';
var API_VERSION = 'v2';
var SECRET_KEY = 'secretkey';
var routes = [];

// dependencies

var AuthControllerFactory = require('./auth/controller/authcontroller');
var AuthInterceptorFactory = require('./auth/interceptor/authinterceptor');
var AuthServiceFactory = require('./auth/service/authservice');

// setup modules

var authService = AuthServiceFactory();
var authInterceptor = AuthInterceptorFactory();

routes.push(createEndpoint('auth', AuthControllerFactory({
    'authService': authService,
    'authInterceptor': authInterceptor
})));

function createEndpoint(endpoint, router) {
    return {
        endpoint: '/' + API_PREFIX + '/' + API_VERSION + '/' + endpoint,
        router: router
    };
}

exports.routes = routes;