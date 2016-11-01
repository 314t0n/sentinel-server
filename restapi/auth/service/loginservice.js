'use strict';
var utils = require('../../../common/utils');

function LoginService(dependencies){
	this.bcrypt = dependencies.bcrypt;
}

/**
 * Verify given passwords
 * @param  {String} requestPassword given by the user
 * @param  {Object} user            user from persistence
 * @param  {Function} resolve       success callback
 * @param  {Function} reject        error callback
 * @return {Void}                   
 */
 LoginService.prototype.verifyPassword = function(requestPassword, user, resolve, reject) {
 	bcrypt.compare(requestPassword, user.password, function(err, isPassed) {
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
 };
/**
 * Factory method
 * @param  {Object} dependencies dependencies map
 * @return {LoginService}              
 */
 module.exports = function(dependencies){ 
 	utils.assertUndefined(dependencies.bcrypt, 'BCrypt is missing!');
 	return new LoginService(dependencies);
 }