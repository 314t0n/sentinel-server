'use strict';

var PersistenceFactory = require('../index');

describe("Persistence", function () {

    describe("createService()", function () {
        var originalTimeout;
        // GIVEN
        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        // WHEN
        it("should create new service and close it", function (done) {
            PersistenceFactory.createService({
                role: 'persistence-integration-test',
                isbase: true
            }, {}, function(service){
                service.close();
                done();
            });
        });

        // THEN
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

    });

});