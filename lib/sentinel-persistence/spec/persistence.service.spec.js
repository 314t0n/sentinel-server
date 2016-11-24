'use strict';

var PersistenceService = require('../src/persistence.service').PersistenceService;

describe("Database", function () {

    var dbProvider;
    var communication;
    var databaseApiFactory;
    var responseHandler;
    var underTest;

    beforeEach(function () {
        // mocks
        dbProvider = jasmine.createSpyObj('dbProvider', ['close']);
        communication = jasmine.createSpyObj('communication', ['on', 'close']);
        databaseApiFactory = jasmine.createSpy();
        responseHandler = jasmine.createSpy();

        underTest = new PersistenceService({
            dbProvider: dbProvider,
            databaseApiFactory: databaseApiFactory,
            responseHandler: responseHandler
        });
    });

    describe("start()", function () {
        it("should call correct factory method", function () {
            // GIVEN
            // WHEN
            underTest.start(communication);

            // THEN
            expect(databaseApiFactory).toHaveBeenCalled();
        });
    });

    describe("close()", function () {
        it("should call correct close methods without start", function () {
            // GIVEN

            // WHEN
            underTest.close();

            // THEN
            expect(dbProvider.close).toHaveBeenCalled();
        });

        it("should call correct close methods and provided callback after start", function () {
            // GIVEN
            var callback = jasmine.createSpy();
            communication.close.and.callFake(function(cb){
                cb();
            });
            underTest.start(communication);

            // WHEN
            underTest.close(callback);

            // THEN
            expect(dbProvider.close).toHaveBeenCalled();
            expect(communication.close).toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();
        });
    });



})
;