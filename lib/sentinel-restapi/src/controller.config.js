var API_PREFIX = 'api';
var API_VERSION = 'v2';
var SECRET_KEY = 'secretkey';

// local dependencies
var AuthControllerFactory = require('./auth/controller/authcontroller');
var AuthInterceptorFactory = require('./auth/interceptor/authinterceptor');
var AuthServiceFactory = require('./auth/service/authservice');

var routes = [];

routes.push(createEndpoint('auth', AuthControllerFactory({
    authService: AuthServiceFactory({
        communication: {}
    }),
    authInterceptor: AuthInterceptorFactory()
})));

function createEndpoint(endpoint, router) {
    return {
        endpoint: '/' + API_PREFIX + '/' + API_VERSION + '/' + endpoint,
        router: router
    };
}

exports.routes = routes;