 'use strict';

 function AuthInterceptor(){ 	
 }
/**
 * Interceptor to check if BearerToken is set
 * @param  {Request}  req  
 * @param  {Response} res  
 * @param  {Function} next 
 * @return {Void}        
 */
 AuthInterceptor.prototype.checkBearerToken = function(req, res, next) {
 	var bearerHeader = req.headers["authorization"];
 	if (typeof bearerHeader === 'undefined') {
 		res.sendStatus(403);
 		return;
 	}
 	var bearer = bearerHeader.split(" ");
 	var bearerToken = bearer[1];
 	req.token = bearerToken;        
 	next();
 };

 module.exports = function(){ 
 	return new AuthInterceptor();
 }