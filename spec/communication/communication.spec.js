var Communication = require('../../common/communication/communication');

describe("Communication", function() {

	var seneca = jasmine.createSpyObj('seneca', ['add', 'act']);
	var logger = jasmine.createSpyObj('logger', ['error']);
	var emptyFunction = function(){};

	var underTest = Communication(seneca, logger);

	describe(".on()", function() {
		it("Should call seneca .add()", function() {
			// GIVEN
			var cmd = "test";		

			// WHEN
			underTest.on(cmd, emptyFunction);	

			// THEN		
			expect( seneca.add ).toHaveBeenCalledWith(jasmine.objectContaining({cmd: cmd}), jasmine.any(Function));
		});
	});

	describe(".on()", function() {
		it("Should throw error when command is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Command is missing!');
		});
	});

	describe(".on()", function() {
		it("Should throw error when callback is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.on('testCommand');
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is missing!');
		});
	});

	describe(".on()", function() {
		it("Should throw error when callback is not a function", function() {
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
		it("Should call seneca .act()", function() {
			// GIVEN
			var cmd = "test";		
			var params = {};
			// WHEN
			underTest.command(cmd, params, emptyFunction);	

			// THEN		
			expect( seneca.act ).toHaveBeenCalledWith(jasmine.objectContaining({cmd: cmd, params: params}), emptyFunction);
		});
	});

	describe(".command()", function() {
		it("Should throw error when command is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.command();
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Command is missing!');
		});	
	});	

	describe(".command()", function() {
		it("Should throw error when callback function is not provided", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				underTest.command('cmd', {});
			}

			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Handler is not a function!');
		});
	});
});