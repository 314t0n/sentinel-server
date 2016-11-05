var Database = require('../../../persistence/api/database');
var EVENTS = require('../../../common/events').EVENTS;

describe("Database", function() {

	var provider = jasmine.createSpyObj('provider', ['add']);
	var communication = jasmine.createSpyObj('communication', ['on']);
	var emptyFunction = function(){};

	var underTest = Database({
		provider: provider,
		communication: communication
	});

	describe("constructor", function() {
		it("should call communication .on()", function() {
			// GIVEN
			// WHEN
			var underTest = Database({
				communication: communication
			});
			// THEN		
			expect( communication.on ).toHaveBeenCalledWith(EVENTS.DB.USERS.FIND, jasmine.any(Function));
		});
	});


/*	describe("-findUsersByEmail()", function() {
		it("should call provider methods", function() {
			// GIVEN
			var response = jasmine.createSpy().and.callFake(function(result) {
				expect(result).toBe(expected);
			});

			// WHEN
			underTest.findUsersByEmail({email:'test@test.com'}, response);
			// THEN		
			expect( provider.query ).toHaveBeenCalledWith('users');
			expect( provider.query.filter ).toHaveBeenCalledWith({email:'test@test.com'});
		});
	});*/

});