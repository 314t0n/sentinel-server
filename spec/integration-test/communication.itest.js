var db = require('../../persistence/persistence');
var EVENTS = require('../../common/events').EVENTS;
var communicationFactory = require('../../common/communication/communication.factory')();

describe("Commnuication Integration Test", function() {

	jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10 * 2;

	var underTestA;
	var underTestB; 
	// setup undertest objects asynchronously
	beforeEach(function(done) {
		communicationFactory.createAsync({role: 'testA', isbase: true}, function(err, communication){
			underTestA = communication;

			communicationFactory.createAsync({role: 'testB'}, function(err, communication){
				underTestB = communication;
				done();
			});
		});
	});
	// close undertest objects asynchronously
	afterEach(function(done) {
		underTestA.close(function(){
			underTestB.close(function(){
				done();
			});
		});
	});

	describe("sending and receving messages", function() {
		it("A should ping B", function(done) {
			// GIVEN
			var ping = 'ping';
			var pong = 'pong';

			// WHEN
			underTestB.on({cmd: 'test', role:'testB'}, function(params, response){
				expect(params.message).toBe(ping);
				response(null, {response:pong});
			});

			// THEN	
			
			underTestA.command({cmd: 'test', params: {message: ping}, role:'testB'}, function(result){
				expect(result.response).toBe(pong);
				done();
			});
		});

		it("A and B should able to send and receive message from each other", function(done) {
			// GIVEN
			var fromAtoB = 'hello B';
			var fromBtoA = 'hello A';

			// WHEN
			underTestA.on({cmd: 'toA', role:'testA'}, function(params, response){
				expect(params.message).toBe(fromBtoA);
				response(null, params);
			});	

			underTestB.on({cmd: 'toB', role:'testB'}, function(params, response){
				expect(params.message).toBe(fromAtoB);
				response(null, params);
			});

			// THEN	
			
			underTestA.command({cmd: 'toB', params: {message: fromAtoB}, role:'testB'}, function(result){
				expect(result.message).toBe(fromAtoB);

				underTestB.command({cmd: 'toA', params: {message: fromBtoA}, role:'testA'}, function(result){
					expect(result.message).toBe(fromBtoA);
					done();
				});
			});
		});
	});
});