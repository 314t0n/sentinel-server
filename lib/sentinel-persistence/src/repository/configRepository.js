'use strict';

var CrudRepo = require('./crudRepository').clazz;

function ConfigRepository(opt){
    this.entityName = 'config';
    this.databaseProvider = opt.databaseProvider;
    this.responseHandler = opt.responseHandler;
}

ConfigRepository.prototype = Object.create(CrudRepo.prototype);

module.exports = function(opt) {
    return new ConfigRepository(opt);
};