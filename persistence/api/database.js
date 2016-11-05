
var databaseInterface = require('../abstract/database');
var _ = require('underscore');
var EVENTS = require('../../common/events').EVENTS;

function Database(opt){
	this.provider = opt.provider;
	this.communication = opt.communication;
	this.registerEvents();
}

Database.prototype.registerEvents = function() {
	this.communication.on(EVENTS.DB.USERS.FIND, this.findUsersByEmail);
	this.communication.on(EVENTS.DB.USERS.ADD, this.addUser);
};

Database.prototype.findUsersByEmail = function(params, response) {
	var query = this.provider
		.query('users')
		.filter({
			email: String(params.email)
		}).first();

	query
		.on('success', successResposne(response))
		.on('error', errorResponse(response));
};

Database.prototype.addUser = function(params, response) {
	console.log(params)
	response(null, this.provider.save('users', params.user));
};

function successResposne(response){
	return function(result){
		response(null, result);
	}
}

function errorHandler(response){
	return function(err){
		response(err);
	}
}

module.exports = function(opt) {
 	//add default interface methods
 	opt.provider = _.defaults(opt.provider || {}, databaseInterface);
 	return new Database(opt);	
 };