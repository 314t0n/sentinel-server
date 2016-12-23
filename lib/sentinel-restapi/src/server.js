var Server = require('./app');
var Utils = require('sentinel-utils');
var Logger = Utils.logger.app;
var CommunicationFactory = require('sentinel-communication').communicationFactory();
var configs = require('./config');
var config = configs.dev;
var communicationSettings = {role: 'restapi', isbase:true};

var Locator = require('servicelocator');
var Promise = require('bluebird');

function startCommunicationModule() {
    return new Promise(function (resolve, reject) {
        CommunicationFactory.create(communicationSettings)
            .then(function (communication) {
                Locator.register('communication', communication);
                resolve();
            }).catch(reject);
    });
}

function closeCommunicationModule() {
    return new Promise(function (resolve, reject) {
        var communication = Locator.get('communication');
        if (communication) {
            communication.close(resolve);
        } else {
            resolve();
        }
    });
}

var server;

function SentinelServer(){
}

SentinelServer.prototype.start = function(){
    return new Promise(function (resolve, reject) {
        startCommunicationModule().then(function () {
            server = Server(config);
            server.start(resolve);
        });
    });
};

SentinelServer.prototype.stop = function(){
    return new Promise(function (resolve, reject) {
        closeCommunicationModule().then(function () {
            server.stop(resolve);
        });
    });
};

module.exports = function () {
    return new SentinelServer();
};