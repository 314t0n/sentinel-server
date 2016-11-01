'use strict';
var utils = require('../../../common/utils');

function AuthService(dependencies){
	this.loginService = dependencies.loginService;
	this.tokenService = dependencies.tokenService;
	this.communication = dependencies.communication;
}
/**
 * Creates a token from the given data
 * @param  {Object} data   data to sign
 * @param  {Object} params see jwt doc
 * @return {String}        
 */
 AuthService.prototype.login = function(user, resolve, reject) {
 	var params = {
 		email: user.email
 	};
 	
 	this.communication.command(
 		'db:users:find', 
 		params,
 		this.verifyPassword(user.password, resolve, reject), 
 		reject
 	);
 };

 AuthService.prototype.verifyPassword = function(password, resolve, reject){
 	var me = this;
 	return function(result){
 		me.loginService.verifyPassword(password, result.user, resolve, reject);
 	}
 }

/**
 * Factory method
 * @param  {Object} dependencies dependencies map
 * @return {AuthService}              
 */
 module.exports = function(dependencies){ 
 	utils.assertUndefined(dependencies.loginService, 'LoginService is missing!');
 	utils.assertUndefined(dependencies.tokenService, 'TokenService is missing!');
 	utils.assertUndefined(dependencies.communication, 'Communication is missing!');
 	return new AuthService(dependencies);
 }