'use strict';

var Database = require('../../src/api/database');
var EVENTS = require('sentinel-communication').events;

describe("Database", function() {

	var userRepo = jasmine.createSpyObj('userRepo', ['findUsersByEmail', 'addUser']);
	var communication = jasmine.createSpyObj('communication', ['on']);

	var underTest = Database({
		userRepo: userRepo,
		communication: communication
	});

	describe("registerEvents()", function() {
		it("should call communication .on() with correct event id\'s", function() {
			// GIVEN
			// WHEN
			underTest.registerEvents();
			// THEN		
			expect( communication.on ).toHaveBeenCalledWith(EVENTS.DB.USERS.FIND, jasmine.any(Function));
			expect( communication.on ).toHaveBeenCalledWith(EVENTS.DB.USERS.ADD, jasmine.any(Function));
		});
	});

});