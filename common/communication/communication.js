'use strict';

var utils = require('../utils');

function Communication(seneca, logger){
	this.seneca = seneca;
	this.logger = logger;
}

Communication.prototype = Object.create(null);
/**
 * Publish to specific command.
 * 
 * @param  {String} command to publish.
 * @param  {Object} [optional] params added to the command.
 * @param  {Function} [optional] success callback function called with return params.
 * @param  {Function} [optional] error callback function called with error object.
 * @return {Void}
 */
 Communication.prototype.command = function command(cmd, params, resolve, reject){
 	utils.assertUndefined(cmd, 'Command is missing!');
 	this.seneca.act({cmd: cmd, params: params}, responseHandler(resolve, reject));
 }

 function responseHandler(resolve, reject){
 	return function(err, msg){
 		if(err){
 			reject && reject(err);
 			return;
 		}
 		resolve && resolve(msg);
 	}
 }
/**
 * Subscribe to specific command.
 * 
 * @param  {String} command to subscribe.
 * @param  {Function} handler function called with return params.
 * @return {Void}
 */
 Communication.prototype.on = function on(cmd, handler){
 	utils.assertUndefined(cmd, 'Command is missing!');
 	utils.assertUndefined(handler, 'Handler is missing!');
 	utils.assertFunction(handler, 'Handler is not a function!');

 	this.seneca.add({cmd: cmd}, function(msg, response){
 		handler(msg.params, response);
 	});
 }
/**
 * Resolve/Reject commands	
 * @param  {Function} resolve success callback
 * @param  {Function} reject  error callback
 * @return {Function}         command response handler
 */
 Communication.prototype.responseHandler = function responseHandler(resolve, reject){
 	return function(err, msg){
 		if(err){
 			reject(err);
 			return;
 		}
 		resolve(msg);
 	}
 }
/**
 * Creates new Communication instance.
 * 
 * @param  {Seneca}
 * @return {Communication}
 */
 module.exports = function(seneca, logger){
 	utils.assertUndefined(seneca, "Seneca is missing!");
 	utils.assertUndefined(logger, "Logger is missing!");

 	return new Communication(seneca, logger);
 }