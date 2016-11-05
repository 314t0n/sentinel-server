var db = require('../../persistence/persistence');
var EVENTS = require('../../common/events').EVENTS;
var communicationFactory = require('../../common/communication/communication.factory');

var connection = {
	type: 'http',
	port: '8001',
	host: 'localhost'
};

/*describe("Database Integration Test", function() {

	db.start(connection);
	var underTest = communicationFactory(connection);

	describe("add users", function() {
		it("should call ", function() {
			// GIVEN
			var user = {
				email: 'test@test.com',
				name: 'test',
				password: 'hunter'
			};

			var resolve = jasmine.createSpy().and.callFake(function(result) {
				console.log(result)
				expect(result).toBe(expected);
			});	


			// WHEN
			underTest.command(EVENTS.DB.USERS.ADD, {user: user}, resolve);

			// THEN		
			expect(resolve).toHaveBeenCalledWith(user);	
		});
	});

});*/