var PersistenceServiceFactory = require('sentinel-persistence');
var EVENTS = require('sentinel-communication').EVENTS;
var models = require('sentinel-communication').models;
var communicationFactory = require('sentinel-communication').communicationFactory();

var connection = {
    type: 'http',
    port: '8001',
    host: 'localhost'
};

describe("Database Integration Test", function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10 * 2;

    var underTest; // communication
    var persistenceService;
    // setup undertest objects asynchronously
    beforeEach(function (done) {
        communicationFactory.createAsync({role: 'test', isbase: true}, function (err, communication) {
            underTest = communication;
            PersistenceServiceFactory.createService({role: 'db'}, {}, function (service) {
                persistenceService = service;
                done();
            });
        });
    });

    afterEach(function (done) {
        underTest.close(function () {
            persistenceService.close();
            done();
        });
    });

    describe("user managment", function () {

        var user = {
            email: 'test@test.com',
            name: 'test',
            password: 'hunter'
        };

        it("should add new user", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                user._id = result._id;
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.ADD, user, 'db');

            // THEN
            command.then(resolve);
        });

        it("should find newly added user by email", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.FINDBYEMAIL, user.email, 'db');

            // THEN
            command.then(resolve);
        });

        it("should modify newly added user", function (done) {
            // GIVEN
            user.name = "John Dope";
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toEqual({
                    ok: 1,
                    nModified: 1,
                    n: 1
                });
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.UPDATE, user, 'db');

            // THEN
            command.then(resolve);
        });

        it("should find newly added user by id", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.FIND, user._id, 'db');

            // THEN
            command.then(resolve);
        });

        it("should remove newly added user", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result.ok).toBe(1);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.REMOVE, user, 'db');

            // THEN
            command.then(resolve);
        });
    });

    describe("config managment", function () {

        var config = models.cameraFactory('test');

        it("should add new config", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                config._id = result._id;
                expect(result).toEqual(config);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.CONFIG.ADD, config, 'db');

            // THEN
            command.then(resolve);
        });

        it("should modify newly added config", function (done) {
            // GIVEN
            config.imagelog.status = true;
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toEqual({
                    ok: 1,
                    nModified: 1,
                    n: 1
                });
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.CONFIG.UPDATE, config, 'db');

            // THEN
            command.then(resolve);
        });

        it("should find newly added config by id", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toEqual(config);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.CONFIG.FIND, config._id, 'db');

            // THEN
            command.then(resolve);
        });

        it("should remove newly added config", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                expect(result.ok).toBe(1);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.CONFIG.REMOVE, config, 'db');

            // THEN
            command.then(resolve);
        });

    });

});