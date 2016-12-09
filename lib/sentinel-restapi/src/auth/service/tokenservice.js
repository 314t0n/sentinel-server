'use strict';
var jwt = require('jsonwebtoken');

function TokenService(secretKey){
	this.secretKey = secretKey;
}
/**
 * Verify given token.
 * @param  {String} token   to verify
 * @param  {Function} resolve success callback
 * @param  {Function} reject  error callback
 * @return {Void}         
 */
TokenService.prototype.verify = function(token, resolve, reject) {
	jwt.verify(token, this.secretKey, function(err, decoded) {
		if (err !== null) {
			reject(err);
			return;
		}
		resolve(decoded);
	});
};
/**
 * Creates a token from the given data
 * @param  {Object} data   data to sign
 * @param  {Object} params see jwt doc
 * @return {String}        
 */
TokenService.prototype.sign = function(data, params) {
	return jwt.sign(data, this.secretKey, params);
};
/**
 * Factory method
 * @param  {String} secretKey   Private key used for encryption
 * @return {TokenService}
 */
module.exports = function(secretKey){
	return new TokenService(secretKey);
}