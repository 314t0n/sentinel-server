'use strict';

var utils = require('sentinel-utils').utils;

function Communication(seneca, logger, role){
	this.seneca = seneca;
	this.logger = logger;
	this.role = role;
}

Communication.prototype = Object.create(null);
/**
 * Publish to specific command.
 * 
 * @param  {Object} options:
 *         cmd 		{String} command to publish.
 *         params 	{Object} [optional] parameters
 *         role 	{String} [optional] role to use
 * @param  {Function} [optional] success callback function called with return params.
 * @param  {Function} [optional] error callback function called with error object.
 * @return {Void}
 */
 Communication.prototype.command = function command(opt, resolve, reject){
 	utils.assertUndefined(opt, 'Options is missing!');
 	this.seneca.act({cmd: opt.cmd, role: opt.role || this.role, params: opt.params}, responseHandler(resolve, reject));
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
 * @param  {Object} options:
 *         cmd 		{String} command to publish.
 *         role 	{String} [optional] role to use
 * @param  {Function} handler function called with return params.
 * @return {Void}
 */
 Communication.prototype.on = function on(opt, handler){
 	utils.assertUndefined(opt, 'Options is missing!');
 	utils.assertUndefined(handler, 'Handler is missing!');
 	utils.assertFunction(handler, 'Handler is not a function!');

 	this.seneca.add({cmd: opt.cmd, role: opt.role || this.role}, function(msg, response){
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
 * Close underlying communication object.
 * @param  {Function} done called when closed
 */
 Communication.prototype.close = function close(done){
 	this.seneca.close(done);
 }
/**
 * Creates new Communication instance.
 * 
 * @param  {Seneca}
 * @return {Communication}
 */
 module.exports = function(seneca, logger, role){
 	utils.assertUndefined(seneca, "Seneca is missing!");
 	utils.assertUndefined(logger, "Logger is missing!");

 	return new Communication(seneca, logger, role);
 }