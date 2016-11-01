var Communication = require('../../common/communication/communication');

describe("Communication", function() {

	var seneca = jasmine.createSpyObj('seneca', ['add', 'act']);
	var logger = jasmine.createSpyObj('logger', ['error']);
	var emptyFunction = function(){};

	var underTest = Communication(seneca, logger);

	describe(".on()", function() {
		it("should call seneca .add()", function() {
			// GIVEN
			var cmd = "test";		

			// WHEN
			underTest.on(cmd, emptyFunction);	

			// THEN		
			expect( seneca.add ).toHaveBeenCalledWith(jasmine.objectContaining({cmd: cmd}), jasmine.any(Function));
		});

		it("should throw error when command is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Command is missing!');
		});

		it("should throw error when callback is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on('testCommand');
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is missing!');
		});

		it("should throw error when callback is not a function", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on('testCommand', {});
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is not a function!');
		});
	});

	describe(".command()", function() {

		it("should call seneca .act()", function() {
			// GIVEN
			var cmd = "test";		
			var params = {};
			// WHEN
			underTest.command(cmd, params, emptyFunction);	

			// THEN		
			expect( seneca.act ).toHaveBeenCalledWith(jasmine.objectContaining({cmd: cmd, params: params}), jasmine.any(Function));
		});

		it("should call resolve", function() {
			// GIVEN
			var cmd = "test";		
			var params = {};
			var expected = 'expected';
			var resolve = jasmine.createSpy().and.callFake(function(result) {
				expect(result).toBe(expected);
			});

			seneca.act.and.callFake(function(params, callback){
				callback(null, expected); // err, msg
			});

			// WHEN
			underTest.command(cmd, params, resolve);	

			// THEN	
			expect(resolve).toHaveBeenCalledWith(expected);	
		});

		it("should call reject when error occurs in seneca", function() {
			// GIVEN
			var cmd = "test";		
			var params = {};
			var expected = 'error';
			var reject = jasmine.createSpy().and.callFake(function(result) {
				expect(result).toBe(expected);
			});

			seneca.act.and.callFake(function(params, callback){
				callback(expected, {}); // err, msg
			});

			// WHEN
			underTest.command(cmd, params, emptyFunction, reject);	

			// THEN	
			expect(reject).toHaveBeenCalledWith(expected);	
		});


		it("should throw error when command is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.command();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Command is missing!');
		});	

	});
});