var Communication = require('./communication');
var SenecaFactory = require('./seneca.factory');
var logger = require('sentinel-utils').logger.app;
var DEFAULT_ROLE = 'undefined';
var Promise = require('bluebird');

function createSeneca(opt) {
    return SenecaFactory({
        pin: 'role:' + getRole(opt),
        isbase: opt.isbase
    });
}

function getRole(opt) {
    return opt.role || DEFAULT_ROLE;
}
/**
 * Factory method for Communication with Seneca injected.
 *
 * @param  {Object}
 * @return {Object}
 */
module.exports = function () {
    return {
        /**
         * Creates Communication instance without waiting for seneca to join to the network
         * @param  {Object} opt params to seneca
         * @return {Communication}
         */
        createSync: function (opt) {
            return Communication(createSeneca(opt), logger, getRole(opt));
        },
        /**
         * Creates Communication instance and waits for seneca to join to the network
         * @param  {Object} opt params to seneca
         * @param  {Function} done callback with newly created Communication instance
         */
        create: function (opt) {
            var seneca = createSeneca(opt);
            var dependencies = {
                seneca: seneca,
                logger: logger
            };
            return new Promise(function(resolve, reject){
                seneca.ready(function () {
                    resolve(Communication(getRole(opt), dependencies));
                });
            });
        }
    }
};

