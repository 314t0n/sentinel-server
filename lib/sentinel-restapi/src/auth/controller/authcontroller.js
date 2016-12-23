'use strict';
var express = require('express');
var url = require('url');
var utils = require('sentinel-utils');
var logger = utils.logger.app;
var authService = require('../service/authservice');

function AuthController(dependencies) {
    var router = express.Router();
    var authInterceptor = dependencies.authInterceptor;
    router.post('/login', this.login.bind(this));
    //router.post('/authenticate', authInterceptor, authService.authenticate);
    //router.get('/authenticate', authInterceptor, authService.authenticate);
    //router.put('/me', authorizationHelper, verifyToken(req, res, updateUser));
    return router;
}

AuthController.prototype.login = function (req, res) {
    authService.login(req.user)
        .then(function (msg) {
            res.json({
                user: msg.user,
                token: msg.token
            });
        })
        .catch(createResponseStatus(req, res, 401));
};

function createResponseStatus(req, res, status) {
    return function () {
        res.sendStatus(status);
    }
}

module.exports = function (dependencies) {
    utils.assertUndefined(dependencies.authInterceptor, 'AuthInterceptor is missing!');
    return new AuthController(dependencies);
};