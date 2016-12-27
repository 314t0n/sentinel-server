'use strict';
var utils = require('sentinel-utils');
var EVENTS = require('sentinel-communication').EVENTS;
var Promise = require('bluebird');
var RestError = require('rest-api-errors');
var LoginService = require('./loginservice')();
var TokenService = require('./tokenservice')();
var Locator = require('servicelocator');
var Communication;
var Logger = utils.logger.app;

function AuthService() {
    Communication = Locator.get('communication');
}
/**
 *
 * @param  {Object} credentials
 * @return {bluebird}
 */
AuthService.prototype.login = function (user) {
    if (user === undefined) {
        throw new RestError.UnprocessableEntity('Entity is missing.');
    }
    return new Promise(function (resolve, reject) {
        getUser(user)
                .then(verifyCredentials(user))
                .then(generateToken)
                .then(resolve)
                .catch(reject);
    });
};

function getUser(user) {
    return Communication.command(EVENTS.DB.USERS.FINDBYEMAIL, user.email);
}

function generateToken(user){
    return TokenService.sign(user);
}

function verifyCredentials(user) {
    return function (result) { 
        checkEmptyUser(result);
        return verifyPassword(user.password, result.user);
    }
}

function checkEmptyUser(user) {
    if (user === undefined) {
        throw new RestError.BadRequest('Email or password did not match.');
    }
}

function verifyPassword(password, userFromDb) {
    return LoginService.verifyPassword(password, userFromDb);
}

/**
 * Factory method
 * @return {AuthService}
 */
module.exports = function () {
    utils.assertUndefined(Communication, 'Communication is missing!');
    return new AuthService();
}