'use strict';
var utils = require('sentinel-utils');
var EVENTS = require('sentinel-communication').EVENTS;
var Promise = require('bluebird');
var RestError = require('rest-api-errors');
var loginService = require('./loginservice')();
var tokenService = require('./tokenService')();

function AuthService(dependencies) {
    this.communication = dependencies.communication;
}
/**
 * Creates a token from the given data
 * @param  {Object} data   data to sign
 * @param  {Object} params see jwt doc
 * @return {bluebird}
 */
AuthService.prototype.login = function (user) {
    if(user === undefined){
        throw new RestError.UnprocessableEntity('Entity is missing.');
    }
    return new Promise(function (resolve, reject) {
        this.communication.command(EVENTS.DB.USERS.FINDBYEMAIL, user.email)
            .then(this.verifyPassword(user.password, resolve, reject))
            .catch(reject);
    });
};

/**
 *
 * @param password
 * @param resolve
 * @param reject
 * @returns {Function}
 */
AuthService.prototype.verifyPassword = function (password, resolve, reject) {
    return function (result) {
        loginService.verifyPassword(password, result.user, resolve, reject);
    }
};

/**
 * Factory method
 * @param  {Object} dependencies dependencies map
 * @return {AuthService}
 */
module.exports = function (dependencies) {
    var deps = dependencies || {};
    utils.assertUndefined(deps.communication, 'Communication is missing!');
    return new AuthService(deps);
}