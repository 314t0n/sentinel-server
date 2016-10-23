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
 * @param  {Object} params added to the command.
 * @return {Void}
 */
 Communication.prototype.command = function command(cmd, params){
 	utils.assertUndefined(cmd, 'Command is missing!');

 	this.seneca.act({cmd: cmd, params: params}, this.logger.error);
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

 	this.seneca.add({cmd: cmd}, function(msg){
 		handler(msg.params);
 	});
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