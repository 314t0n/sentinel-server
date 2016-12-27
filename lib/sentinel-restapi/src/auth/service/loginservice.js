'use strict';
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

function LoginService() {
}

/**
 * Verify given passwords
 * @param  {String} requestPassword given by the user
 * @param  {Object} user            user from persistence
 * @param  {Function} resolve       success callback
 * @param  {Function} reject        error callback
 * @return {bluebird}                   
 */
LoginService.prototype.verifyPassword = function (requestPassword, user) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(requestPassword, user.password, function (err, isPassed) {
            if (err !== null) {
                reject(err);
                return;
            }
            if (!isPassed) {
                reject('Passwords did not match!');
                return;
            }
            resolve(user);
        });
    });
};
/**
 * Factory method
 * @return {LoginService}
 */
module.exports = function () {
    return new LoginService();
};