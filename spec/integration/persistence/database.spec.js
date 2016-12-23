var PersistenceService = require('sentinel-persistence')();
var EVENTS = require('sentinel-communication').EVENTS;
var models = require('sentinel-communication').models;
var communicationFactory = require('sentinel-communication').communicationFactory();
var Logger = require('sentinel-utils').logger.app;

var COMMUNICATION_OPTIONS = {
    type: 'http',
    port: '8001',
    host: 'localhost',
    role: 'test',
    isbase: true
};

describe("Database Integration Test", function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10 * 2;

    var underTest; // communication

    beforeAll(function (done) {
        Logger.debug('Setup services for test suite.');
        communicationFactory.create(COMMUNICATION_OPTIONS)
                .then(function (communication) {
                    underTest = communication;
                    PersistenceService.start({role: 'db'}, {})
                            .then(done);
                });
    });

    afterAll(function (done) {
        Logger.debug('Teardown services for test suite.');
        Promise.all([underTest.close(), PersistenceService.close()])
                .then(done).catch(done);
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
            command.then(resolve).catch(Logger.error);
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