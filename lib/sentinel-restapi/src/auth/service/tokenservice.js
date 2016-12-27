'use strict';
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

function TokenService(secretKey) {
    this.secretKey = secretKey;
}
/**
 * Verify given token.
 * @param  {String} token   to verify
 * @param  {Function} resolve success callback
 * @param  {Function} reject  error callback
 * @return {bluebird}         
 */
TokenService.prototype.verify = function (token) {
    var key = this.secretKey;
    return new Promise(function (resolve, reject) {
        jwt.verify(token, key, function (err, decoded) {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve(decoded);
        });
    });
};
/**
 * Creates a token from the given data
 * @param  {Object} data   data to sign
 * @param  {Object} [optional] see jwt doc
 * @return {bluebird}        
 */
TokenService.prototype.sign = function (data, params) {
    var secretKey = this.secretKey;
    return new Promise(function (resolve, reject) {
        try {
            jwt.sign(data, secretKey, params, resolve);
        } catch (e) {
            reject(e);
        }
    });
};
/**
 * Factory method
 * @param  {String} secretKey   Private key used for encryption
 * @return {TokenService}
 */
module.exports = function (secretKey) {
    return new TokenService(secretKey);
}