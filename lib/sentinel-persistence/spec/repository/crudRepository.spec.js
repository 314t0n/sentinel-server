'use strict';

var CrudRepo = require('../../src/repository/crudRepository').factory;

describe("Crud Repository", function () {

    var databaseProvider = jasmine.createSpyObj('databaseProvider', ['query', 'save', 'update', 'remove']);
    var responseHandler = jasmine.createSpyObj('responseHandler', ['handleResponse']);
    var entityName = 'test';
    var underTest = CrudRepo(entityName, {
        databaseProvider: databaseProvider,
        responseHandler: responseHandler
    });

    describe(".findAll()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var query = function () {
                return {
                    filter: filter
                }
            };
            var filter = function (filterParams) {
                expect(filterParams).toEqual({
                    isDeleted: {
                        $ne: true
                    }
                });
                return {
                    all: all
                }
            };
            var all = jasmine.createSpy();
            databaseProvider.query.and.callFake(query);

            // WHEN
            underTest.findAll();

            // THEN
            expect(databaseProvider.query).toHaveBeenCalledWith(entityName);
            expect(all).toHaveBeenCalled();
            expect(responseHandler.handleResponse).toHaveBeenCalled();
        });
    });

    describe(".findById()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var id = '1234';
            var query = function () {
                return {
                    filter: filter
                }
            };
            var filter = function (filterParams) {
                expect(filterParams).toEqual({id: id});
                return {
                    first: first
                }
            };
            var first = jasmine.createSpy();
            databaseProvider.query.and.callFake(query);

            // WHEN
            underTest.findById(id);

            // THEN
            expect(databaseProvider.query).toHaveBeenCalledWith(entityName);
            expect(first).toHaveBeenCalled();
            expect(responseHandler.handleResponse).toHaveBeenCalled();
        });
    });

    describe(".add()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var entity = {};
            var response = jasmine.createSpy();
            databaseProvider.save.and.callFake(function () {
                return entity;
            });

            // WHEN
            underTest.add(entity, response);

            // THEN
            expect(databaseProvider.save).toHaveBeenCalledWith(entityName, entity);
            expect(response).toHaveBeenCalledWith(null, entity);
        });

        it("should call response with error when error occured", function () {
            // GIVEN
            var error = new Error('db error');
            var response = jasmine.createSpy();
            databaseProvider.save.and.callFake(function () {
                throw error;
            });

            // WHEN
            underTest.add({}, response);

            // THEN
            expect(response).toHaveBeenCalledWith(error);
        });
    });

    describe(".update()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var entity = {
                id: 1234
            };
            var response = jasmine.createSpy();
            databaseProvider.update.and.callFake(function () {
                return entity;
            });

            // WHEN
            underTest.update(entity, response);

            // THEN
            expect(databaseProvider.update).toHaveBeenCalledWith(entityName, entity);
            expect(response).toHaveBeenCalledWith(null, entity);
        });

        it("should call response with error when error occured", function () {
            // GIVEN
            var error = new Error('db error');
            var response = jasmine.createSpy();
            databaseProvider.update.and.callFake(function () {
                throw error;
            });

            // WHEN
            underTest.update({}, response);

            // THEN
            expect(response).toHaveBeenCalledWith(error);
        });
    });

    describe(".remove()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var entity = {
                id: 1234
            };
            var response = jasmine.createSpy();
            databaseProvider.remove.and.callFake(function () {
                return true;
            });

            // WHEN
            underTest.remove(entity, response);

            // THEN
            expect(databaseProvider.remove).toHaveBeenCalledWith(entityName, {
                _id: entity.id
            });
            expect(response).toHaveBeenCalledWith(null, true);
        });

        it("should call response with error when error occured", function () {
            // GIVEN
            var entity = {
                id: 1234
            };
            var error = new Error('db error');
            var response = jasmine.createSpy();
            databaseProvider.remove.and.callFake(function () {
                throw error;
            });

            // WHEN
            underTest.remove(entity, response);

            // THEN
            expect(response).toHaveBeenCalledWith(error);
        });
    });


});