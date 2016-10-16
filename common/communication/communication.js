var logger = require('../logger').app;

function Communication(seneca){
	this.seneca = seneca;
}

Communication.prototype = Object.create(null);
/**
 * Publish to specific command.
 * 
 * @param  {String}
 * @param  {Object}
 * @return {Void}
 */
Communication.prototype.command = function command(cmd, params){
	this.seneca.act({cmd: cmd, params: params}, logger.error);
}
/**
 * Subscribe to specific command.
 * 
 * @param  {String}
 * @param  {Function}
 * @return {Void}
 */
Communication.prototype.on = function on(cmd, handler){
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
module.exports = function(seneca){

	if(seneca === undefined){
		throw new TypeError("Seneca is missing!");
	}

	return new Communication(seneca);
}