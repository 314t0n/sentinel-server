var Communication = require('../../common/communication/communication');

describe("Communication", function() {

	var seneca = jasmine.createSpyObj('seneca', ['add', 'act', 'close']);
	var logger = jasmine.createSpyObj('logger', ['error']);
	var emptyFunction = function(){};

	var underTest = Communication(seneca, logger, 'test');

	describe(".on()", function() {
		it("should call seneca .add()", function() {
			// GIVEN
			var opt = {cmd: 'test', role: 'test'};		

			// WHEN
			underTest.on(opt, emptyFunction);	

			// THEN		
			expect( seneca.add ).toHaveBeenCalledWith(jasmine.objectContaining(opt), jasmine.any(Function));
		});

		it("should throw error when options is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Options is missing!');
		});

		it("should throw error when callback is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on({cmd:'testCommand'});
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is missing!');
		});

		it("should throw error when callback is not a function", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on({cmd:'testCommand'}, {});
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is not a function!');
		});
	});

	describe(".command()", function() {

		it("should call seneca .act()", function() {
			// GIVEN
			var opt = {cmd:'test', params: 'test', role: 'test'};	
			// WHEN
			underTest.command(opt, emptyFunction);	

			// THEN		
			expect( seneca.act ).toHaveBeenCalledWith(jasmine.objectContaining(opt), jasmine.any(Function));
		});

		it("should call resolve", function() {
			// GIVEN
			var opt = {cmd:'test', params: 'test', role: 'test'};			
			var expected = 'expected';
			var resolve = jasmine.createSpy().and.callFake(function(result) {
				expect(result).toBe(expected);
			});

			seneca.act.and.callFake(function(params, callback){
				callback(null, expected); // err, msg
			});

			// WHEN
			underTest.command(opt, resolve);	

			// THEN	
			expect(resolve).toHaveBeenCalledWith(expected);	
		});

		it("should call reject when error occurs in seneca", function() {
			// GIVEN
			var opt = {cmd:'test', params: 'test', role: 'test'};			
			var expected = 'error';
			var reject = jasmine.createSpy().and.callFake(function(result) {
				expect(result).toBe(expected);
			});

			seneca.act.and.callFake(function(params, callback){
				callback(expected, {}); // err, msg
			});

			// WHEN
			underTest.command(opt, emptyFunction, reject);	

			// THEN	
			expect(reject).toHaveBeenCalledWith(expected);	
		});


		it("should throw error when options is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.command();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Options is missing!');
		});	

	});

	describe(".close()", function() {

		it("should call seneca .close()", function() {
			// GIVEN
			// WHEN
			underTest.close(emptyFunction);	

			// THEN		
			expect( seneca.close ).toHaveBeenCalledWith(jasmine.any(Function));
		});

		it("should call done when seneca close called", function() {
			// GIVEN
			var callback = jasmine.createSpy().and.callFake(function(result) {
			});

			seneca.close.and.callFake(function(){
				callback(); 
			});

			// WHEN
			underTest.close(callback);	

			// THEN	
			expect(callback).toHaveBeenCalled();	
		});


	});
});