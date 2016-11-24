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
        it("should call ", function (done) {
            // GIVEN
            var user = {
                email: 'test@test.com',
                name: 'test',
                password: 'hunter'
            };

            var resolve = jasmine.createSpy().and.callFake(function (result) {
                delete result._id;
                expect(result).toEqual(user);
                done();
            });

            // WHEN
            underTest.command({cmd: EVENTS.DB.USERS.ADD, params: { user: user }, role: 'db'}, resolve);

            // THEN
        });
    });

});