'use strict';
var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var url = require('url');
var logger = require('sentinel-utils').logger.app;
var utils = require('sentinel-utils').utils;

function AuthController(dependencies){
	var router = express.Router();
	this.authService = dependencies.authService;
	var authInterceptor = dependencies.authInterceptor;
	router.post('/login', this.login);
	router.post('/authenticate', authInterceptor, authService.authenticate);
	router.get('/authenticate', authInterceptor, authService.authenticate);
    //router.put('/me', authorizationHelper, verifyToken(req, res, updateUser));
    return router;
}

AuthController.prototype.login = function(req, res) {
	var badRequest = createResponseStatus(req, res, 401);		
	if(utils.isUndefined(req.user)){
		badRequest();
		return;
	}

	// todo check? biznisz logika? empty email, password...

	this.authService.login(req.user, function(msg){
		res.json({
			user: msg.user,
			token: msg.token
		});
	}, badRequest);
};

function createResponseStatus(req,res, status){
	return function(){
		res.sendStatus(status);
	}
}

module.exports = function(dependencies){ 
	utils.assertUndefined(dependencies.authService, 'AuthService is missing!');
	utils.assertUndefined(dependencies.authInterceptor, 'AuthInterceptor is missing!');
	return new AuthController(dependencies);
}