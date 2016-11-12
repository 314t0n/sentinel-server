'use strict';

var CrudRepo = require('./crudRepository').clazz;

function UserRepository(opt){
    this.entityName = 'user';
    this.databaseProvider = opt.databaseProvider;
    this.responseHandler = opt.responseHandler;
}

UserRepository.prototype = Object.create(CrudRepo.prototype);

UserRepository.prototype.findUsersByEmail = function findUsersByEmail(email, response){
    var query = this.databaseProvider
        .query(this.entityName)
        .filter({
            email: String(email)
        }).first();

    this.responseHandler.handleResponse(query, response);
};

module.exports = function(opt) {
    return new UserRepository(opt);
};