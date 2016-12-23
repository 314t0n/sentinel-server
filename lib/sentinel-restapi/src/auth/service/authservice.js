'use strict';
var utils = require('sentinel-utils');
var EVENTS = require('sentinel-communication').EVENTS;
var Promise = require('bluebird');
var RestError = require('rest-api-errors');
var LoginService = require('./loginservice')();
var TokenService = require('./tokenService')();
var Locator = require('servicelocator');
var Communication = Locator.get('communication');

function AuthService() {
}
/**
 *
 * @param  {Object} credentials
 * @return {bluebird}
 */
AuthService.prototype.login = function (user) {
    if(user === undefined){
        throw new RestError.UnprocessableEntity('Entity is missing.');
    }
    return new Promise(function (resolve, reject) {
        Communication.command(EVENTS.DB.USERS.FINDBYEMAIL, user.email)
            .then(this.verifyPassword(user.password, resolve, reject))
            .catch(reject);
    });
};

AuthService.prototype.verifyPassword = function (password, resolve, reject) {
    return function (result) {
        LoginService.verifyPassword(password, result.user, resolve, reject);
    }
};
/**
 * Factory method
 * @return {AuthService}
 */
module.exports = function () {
    utils.assertUndefined(Communication, 'Communication is missing!');
    return new AuthService();
}