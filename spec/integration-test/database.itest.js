var PersistenceServiceFactory = require('sentinel-persistence');
var EVENTS = require('sentinel-communication').EVENTS;
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

    describe("add users", function () {

        var user = {
            email: 'test@test.com',
            name: 'test',
            password: 'hunter'
        };

        it("should add new user", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                delete result._id;
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.ADD, {user: user}, 'db');

            // THEN
            command.then(resolve);
        });

        it("should find newly added user by email", function (done) {
            // GIVEN
            var resolve = jasmine.createSpy().and.callFake(function (result) {
                delete result._id;
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            var command = underTest.command(EVENTS.DB.USERS.FIND, user.email, 'db');

            // THEN
            command.then(resolve);
        });
    });

});