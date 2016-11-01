var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var url = require('url');
var logger = require('../../common/logger').app;

function errorResponse(res) {
    return function(err) {
        logger.log("error", err);

        res.json({
            status: "error",
            data: "Error occured: " + err
        });
    }
}

function loginResponse(res, user) {
    var token = jwt.sign({
        email: user.email
    }, 'secret', {
        expiresInMinutes: 5000
    });

    delete user.password;

    res.json({
        status: 'success',
        user: user,
        token: token
    });
}

function loginResponse(req, res, msg) {
    var user = msg.user;
    if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, isPassed) {
            if (isPassed) {
                loginResponse(res, user);
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
}

function authenticateResponse(req, res, msg) {
    var user = msg.user;
    delete user.password;
    res.json({
        status: 'success',
        user: user
    });
}

function responseHandlerFactory(req, res, successHandler){
    return function(err, msg){
        if(err){
            errorResponse(res);
            return;
        }
        successHandler(req, res, msg);
    }
}

function getQuery(req) {
    var url_parts = url.parse(req.url, true);
    return url_parts.query;
}

function verifyToken(req, res, fn) {
    return function(){
        jwt.verify(req.token, 'secret', function(err, decoded) {
            if (err !== null) {
                res.sendStatus(403);
                return;
            }
            fn(req, res, decoded);
        });
    }
}

function authenticate(req, res, decoded){
    communication.command('db:users', {email: decoded.email}, responseHandlerFactory(req, res, authenticateResponse));
}   

function login(req, res){
   communication.command('db:users', responseHandlerFactory(req, res, loginResponse));
}

function AuthRouter(authorizationHelper, logger, communication){
    var router = express.Router();

    router.post('/login', login);

    router.post('/authenticate', authorizationHelper, verifyToken(req, res, authenticate));

    router.get('/authenticate', authorizationHelper, verifyToken(req, res, authenticate));
    //todo
    //router.put('/me', authorizationHelper, verifyToken(req, res, updateUser));

    return router;
}

module.exports = function(params){

    return new AuthRouter(
        params.authorizationHelper,
        params.logger,
        params.communication);

}