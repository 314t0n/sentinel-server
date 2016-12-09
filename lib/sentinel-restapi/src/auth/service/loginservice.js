'use strict';
var bcrypt = require('bcrypt');

function LoginService(){
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
			reject && reject(err);
 			return;
 		}
 		if (!isPassed) {
			reject && reject('Passwords did not match!');
 			return;
 		}
		resolve && resolve(user);
 	});
 };
/**
 * Factory method
 * @return {LoginService}
 */
 module.exports = function(){
 	return new LoginService();
 };