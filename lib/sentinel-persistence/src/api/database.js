'use strict';

var EVENTS = require('sentinel-communication').events;

function Database(opt){
	this.userRepo = opt.userRepo;
	this.communication = opt.communication;
	this.registerEvents();
}

Database.prototype.registerEvents = function() {
	this.communication.on(EVENTS.DB.USERS.FIND, this.userRepo.findUsersByEmail);
	this.communication.on(EVENTS.DB.USERS.ADD, this.userRepo.addUser);
};

module.exports = function(opt) {
	return new Database(opt);
 };