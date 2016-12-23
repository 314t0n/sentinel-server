var Promise = require('bluebird');

var CommunicationFactory = require('sentinel-communication').communicationFactory();
var DatabaseApiFactory = require('./src/api/database');
var MongoDB = require('./src/concrete/mongo');
var DBProviderFactory = require('./src/service/dbprovider.factory')();

var PersistenceService = require('./src/service/persistence.service').PersistenceService;
var ResponseHandler = require('./src/communication/responseHandler');
var Logger = require('sentinel-utils').logger.app;
// const
var DEFAULT_HOST_TYPE = 'http';
var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = '8001';
var DEFAULT_MONGO_URL = 'localhost:27017';

var services = {};
services.databaseApiFactory = DatabaseApiFactory;
services.responseHandler = ResponseHandler;

function createDbProvider(databaseOptions) {
    return new Promise(function (resolve, reject) {
        DBProviderFactory.create(MongoDB, databaseOptions)
                .then(function (dbProvider) {
                    Logger.debug('Db provider created.');
                    services['dbProvider'] = dbProvider;
                    resolve();
                }).catch(reject);
    });
}

function createCommunication(communicationOptions) {
    return new Promise(function (resolve, reject) {
        CommunicationFactory.create(communicationOptions)
                .then(function (communication) {
                    Logger.debug('Communication created.');
                    services['communication'] = communication;
                    resolve();
                })
                .catch(reject);
    });
}
function createPersistenceService(services) {
    return new PersistenceService({
        dbProvider: services.dbProvider,
        databaseApiFactory: services.databaseApiFactory,
        responseHandler: services.responseHandler
    });
}

function createCommunicationOptions(opt) {
    var communicationOptions = opt || {};
    communicationOptions.type = opt.type || DEFAULT_HOST_TYPE;
    communicationOptions.port = opt.port || DEFAULT_PORT;
    communicationOptions.host = opt.host || DEFAULT_HOST;
    return communicationOptions;
}

function createDatabaseOptions(opt) {
    return {
        url: opt.databaseUrl || DEFAULT_MONGO_URL
    };
}

function Persistence() {
}

/**
 * Starts persistence service
 * @param {type} opt
 * @param {type} dependencies
 * @returns {Promise}
 */
Persistence.prototype.start = function (opt, dependencies) {
    return new Promise(function (resolve, reject) {
        Promise.all([createDbProvider(createDatabaseOptions(opt)), createCommunication(createCommunicationOptions(opt))])
                .then(function () {
                    var service = createPersistenceService(services);
                    Logger.debug('Persistence service created.');
                    services['presistence'] = service;
                    service.start(services['communication']);
                    resolve();
                }).catch(reject);
    });
};


Persistence.prototype.close = function () {
    var service = services['presistence'];
    return new Promise(function (resolve, reject) {
        if (!service) {
            reject('Service has not started!');
        }
        service.close(resolve);
    });
};

module.exports = function () {
    return new Persistence();
};