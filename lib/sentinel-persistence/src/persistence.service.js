var database = require('./api/database');
var _ = require('underscore');
var databaseInterface = require('./abstract/database');

var logger = require('sentinel-utils').logger.app;

var UserRepoFactory = require('./repository/userRepository');
var CameraRepoFactory = require('./repository/cameraRepository');
/**
 * Persistence Service
 * @param opt
 *  @required database provider
 *  @required communication
 *  @required responseHandler
 * @constructor
 */
function PersistenceFacade(opt) {
    this.dbProvider = opt.dbProvider;
    this.communication = opt.communication;
    this.responseHandler = opt.responseHandler;
}
/**
 * Register Repositories for Database API
 */
PersistenceFacade.prototype.start = function () {
    this.database = database({
        userRepo: createService.apply(this, UserRepoFactory),
        cameraRepo: createService.apply(this, CameraRepoFactory),
        communication: this.communication
    });
}

function createService(serviceFactory) {
    return serviceFactory({
        databaseProvider: this.dbProvider,
        responseHandler: this.responseHandler
    });
}
/**
 * Close persistence layer
 * @param cb
 */
PersistenceFacade.prototype.close = function (cb) {
    try {
        this.dbProvider.close();
        this.database.close(cb);
    } catch (e) {
        logger.error(e);
    }
}

var DEFAULT_MONGO_URL = 'localhost:27017';
/**
 * Persitence layer factory
 * @param opt
 *  @required Database provider factory
 * @constructor
 */
function PersistenceFacadeFactory(opt) {
    this.dbProviderFactory = opt.dbProviderFactory;
}
/**
 * Creates new Persistence  instance
 * @param opt
 *  @required communication
 *  @required responseHandler
 * @returns {Persistence}
 */
PersistenceFacadeFactory.prototype.create = function (opt) {
    return new Persistence({
        dbProvider: createDbProvider.apply(this),
        communication: opt.communication,
        responseHandler: opt.responseHandler
    });
}

function createDbProvider() {
    var dbProvider = this.dbProviderFactory({
        url: opt.url || DEFAULT_MONGO_URL
    });
    //add default interface methods
    dbProvider = _.defaults(dbProvider || {}, databaseInterface);
    return dbProvider;
}

exports.PersistenceFacade = PersistenceFacade;
exports.PersistenceFacadeFactory = PersistenceFacadeFactory;