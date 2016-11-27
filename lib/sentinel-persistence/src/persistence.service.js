var _ = require('underscore');
var logger = require('sentinel-utils').logger.app;

var UserRepoFactory = require('./repository/userRepository');
var CameraRepoFactory = require('./repository/cameraRepository');
var ConfigRepoFactory = require('./repository/configRepository');
/**
 * Persistence Service
 * @param opt
 *  @required database provider
 *  @required database api factory
 *  @required responseHandler
 * @constructor
 */
function PersistenceService(opt) {
    this.dbProvider = opt.dbProvider;
    this.databaseApiFactory = opt.databaseApiFactory;
    this.responseHandler = opt.responseHandler;
}

/**
 * Register Repositories for Database API
 * @param [Communication] communication
 */
PersistenceService.prototype.start = function (communication) {
    var me = this;
    this.communication = communication;
    // register services
    me.databaseApi = me.databaseApiFactory({
        userRepo: createService.call(me, UserRepoFactory),
        cameraRepo: createService.call(me, CameraRepoFactory),
        configRepo: createService.call(me, ConfigRepoFactory),
        communication: communication
    });
};

function createService(serviceType) {
    return new serviceType({
        databaseProvider: this.dbProvider,
        responseHandler: this.responseHandler
    });
}
/**
 * Close persistence layer
 * @param cb
 */
PersistenceService.prototype.close = function (cb) {
    try {
        if (!_.isUndefined(this.dbProvider)) {
            this.dbProvider.close();
        }
        if (!_.isUndefined(this.communication)) {
            this.communication.close(cb);
        }
    } catch (e) {
        logger.error(e);
    }
};

exports.PersistenceService = PersistenceService;