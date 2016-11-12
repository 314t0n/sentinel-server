'use strict';
var utils = require('sentinel-utils').utils;

function TokenService(secretKey, dependencies){
	this.secretKey = secretKey;
	this.jwt = dependencies.jwt;
}
/**
 * Verify given token.
 * @param  {String} token   to verify
 * @param  {Function} resolve success callback
 * @param  {Function} reject  error callback
 * @return {Void}         
 */
TokenService.prototype.verify = function(token, resolve, reject) {
	this.jwt.verify(token, this.secretKey, function(err, decoded) {
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
	return this.jwt.sign(data, this.secretKey, params);
};
/**
 * Factory method
 * @param  {String} secretKey    encryption key
 * @param  {Object} dependencies dependencies map
 * @return {TokenService}              
 */
module.exports = function(secretKey, dependencies){ 
	utils.assertUndefined(dependencies.jwt, 'JWT is missing!');
	return new TokenService(secretKey, dependencies);
}