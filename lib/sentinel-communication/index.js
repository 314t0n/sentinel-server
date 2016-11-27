'use strict';
var communication = require('./src/communication');
var communicationFactory = require('./src/communication.factory');
var senecaFactory = require('./src/seneca.factory');
var events = require('./src/events').EVENTS;
var models = {
    cameraFactory: require('./src/model/camera').create
};

exports.communication = communication;
exports.communicationFactory = communicationFactory;
exports.senecaFactory = senecaFactory;
exports.EVENTS = events;
exports.models = models;