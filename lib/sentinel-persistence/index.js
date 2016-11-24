var _ = require('underscore');

var CommunicationFactory = require('sentinel-communication').communicationFactory();
var DatabaseApiFactory = require('./src/api/database');
var DbProviderFactory = require('./src/concrete/mongo');
var PersistenceService = require('./src/persistence.service').PersistenceService;
var ResponseHandler = require('./src/communication/responseHandler');
var DatabaseInterface = require('./src/abstract/database');
// const
var DEFAULT_HOST_TYPE = 'http';
var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = '8001';
var DEFAULT_MONGO_URL = 'localhost:27017';

function createPersistenceService(dependencies, databaseOptions) {
    return new PersistenceService({
        dbProvider: createDbProvider(dependencies.dbProvider || DbProviderFactory, databaseOptions),
        databaseApiFactory: dependencies.databaseApiFactory || DatabaseApiFactory,
        responseHandler: dependencies.responseHandler || ResponseHandler
    });
}

function createDbProvider(dbProviderFactory, opt) {
    var dbProvider = dbProviderFactory({
        url: opt.url
    });
    //add default interface methods
    dbProvider = _.defaults(dbProvider || {}, DatabaseInterface);
    return dbProvider;
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
/**
 * Creates new Persistence Service instance
 * @param opt Database and Communication options
 * @param dependencies modules
 * @param done callback with the new service instance
 */
// TODO promisify
exports.createService = function (opt, dependencies, done) {
    var databaseOptions = createDatabaseOptions(opt);
    var communicationOptions = createCommunicationOptions(opt);
    var service = createPersistenceService(dependencies, databaseOptions);
    CommunicationFactory.createAsync(communicationOptions, function (error, communication) {
        if(error){
            throw new Error(error);
        }
        service.start(communication);
        if (_.isFunction(done)) {
            done(service);
        }
    });
}