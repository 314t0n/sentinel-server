'use strict';
var _ = require('underscore');
var Promise = require('bluebird');
var DatabaseInterface = require('../abstract/database');

function DBProviderFactory() {

}
//add default interface methods
function applyDefaultMethods(dbProvider) {
    return  _.defaults(dbProvider || {}, DatabaseInterface);
}

DBProviderFactory.prototype.create = function (dbImplementation, databaseOptions) {
    return new Promise(function (resolve, reject) {
        dbImplementation({
            url: databaseOptions.url
        }).then(function (dbProvider) {
            resolve(applyDefaultMethods(dbProvider));
        }).catch(reject);
    });
};

module.exports = function () {
    return new DBProviderFactory();
};