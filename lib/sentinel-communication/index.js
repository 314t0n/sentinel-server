'use strict';
var communication = require('./src/communication');
var communicationFactory = require('./src/communication.factory');
var senecaFactory = require('./src/seneca.factory');
var events = require('./src/events').EVENTS;

exports.communication = communication;
exports.communicationFactory = communicationFactory;
exports.senecaFactory = senecaFactory;
exports.EVENTS = events;