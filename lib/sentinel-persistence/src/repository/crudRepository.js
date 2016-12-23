'use strict';
/**
 * CRUD methods
 * @param entityName table name
 * @param opt   dependencies
 * @constructor
 */
function CrudRepository(entityName, opt) {
    this.entityName = entityName;
    this.databaseProvider = opt.databaseProvider;
    this.responseHandler = opt.responseHandler;
}

CrudRepository.prototype.findAll = function findAll(response) {
    var query = this.databaseProvider
        .query(this.entityName)
        .filter({
            isDeleted: {
                $ne: true
            }
        }).all();

    this.responseHandler.handleResponse(query, response);
};

CrudRepository.prototype.findById = function findById(id, response) {
    var query = this.databaseProvider
        .query(this.entityName)
        .filter({
            _id: id
        }).first();

    this.responseHandler.handleResponse(query, response);
};

CrudRepository.prototype.update = function update(entity, response) {
    try {
        var query = this.databaseProvider.update(this.entityName, {
            _id: entity._id
        }, entity);
        this.responseHandler.handleResponse(query, response);
    } catch (e) {
        response(e);
    }
};

CrudRepository.prototype.add = function add(entity, response) {
    try {
        var query = this.databaseProvider.save(this.entityName, entity);
        this.responseHandler.handleResponse(query, response);
    } catch (e) {  
        response(e);
    }
};

CrudRepository.prototype.remove = function remove(entity, response) {
    try {
        var query = this.databaseProvider.remove(this.entityName, entity);
        this.responseHandler.handleResponse(query, response);
    } catch (e) {
        response(e);
    }
};

exports.factory = function (name, opt) {
    if (name === undefined) {
        throw new TypeError('Entity name is missing!');
    }
    return new CrudRepository(name, opt);
}

exports.clazz = CrudRepository;