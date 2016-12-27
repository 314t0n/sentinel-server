'use strict';
var express = require('express');
var url = require('url');
var utils = require('sentinel-utils');
var Logger = utils.logger.app;
var authService = require('../service/authservice')();

function AuthController(dependencies) {
    var router = express.Router();
    var authInterceptor = dependencies.authInterceptor;
    router.post('/login', this.login);
    //router.post('/authenticate', authInterceptor, authService.authenticate);
    //router.get('/authenticate', authInterceptor, authService.authenticate);
    //router.put('/me', authorizationHelper, verifyToken(req, res, updateUser));
    return router;
}

AuthController.prototype.login = function (req, res) {
    authService.login(req.body.user)
            .then(function (msg) {
                res.json({
                    user: msg.user,
                    token: msg.token
                });
            })
            .catch(createResponseStatus(req, res, 400));
};

function createResponseStatus(req, res, status, msg) {
    return function () {
        res.status(status).json({
            code: status,
            message: msg || ''
        });
    }
}

module.exports = function (dependencies) {
    utils.assertUndefined(dependencies.authInterceptor, 'AuthInterceptor is missing!');
    return new AuthController(dependencies);
};