'use strict';

var Database = require('../../src/api/database');
var EVENTS = require('sentinel-communication').EVENTS;

describe("Database", function () {

    var userRepo = jasmine.createSpyObj('userRepo', ['findUsersByEmail', 'addUser']);
    var communication = jasmine.createSpyObj('communication', ['on', 'close']);
    var cameraRepo = jasmine.createSpyObj('cameraRepo', ['add', 'remove', 'findById', 'findAll', 'update']);
    var underTest;

    beforeEach(function () {
        underTest = Database({
            userRepo: userRepo,
            communication: communication,
            cameraRepo: cameraRepo
        });
    });

    describe("registerEvents()", function () {
        it("should call communication .on() with correct event id\'s", function () {
            // GIVEN
            var communication = jasmine.createSpyObj('communication', ['on']);
            var accepted = [
                EVENTS.DB.USERS.FIND,
                EVENTS.DB.USERS.ADD,
                EVENTS.DB.CAMERA.ADD,
                EVENTS.DB.CAMERA.FIND,
                EVENTS.DB.CAMERA.FINDALL,
                EVENTS.DB.CAMERA.UPDATE,
                EVENTS.DB.CAMERA.REMOVE
            ];

            communication.on.and.callFake(function (param) {
                expect(accepted.indexOf(param) > -1).toBe(true);
            });

            // WHEN
            Database({
                userRepo: userRepo,
                communication: communication,
                cameraRepo: cameraRepo
            });

            // THEN
            expect(communication.on.calls.count()).toEqual(accepted.length);
        });
    });

    describe("close()", function () {
        it("should call communication .close()", function () {
            // GIVEN

            // WHEN
            underTest.close();

            // THEN
            expect(communication.close).toHaveBeenCalled();
        });
    });

})
;