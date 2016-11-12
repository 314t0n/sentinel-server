var LoginService = require('../../../src/auth/service/loginservice');

describe("LoginService", function() {

	var jwt;
	var underTest;
	var emptyFunction = function(){};

	beforeEach(function() {
		bcrypt = jasmine.createSpyObj('bcrypt', ['compare']);
		underTest = LoginService({
			'bcrypt':bcrypt
		});
	});

	describe("dependencies", function() {
		it("should throw typeerror when bcrypt is missing", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				LoginService({});
			}
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'BCrypt is missing!');

		});
	});

	describe(".verifyPassword()", function() {

		it("should return resolve when passwords are match", function() {
			// GIVEN
			var requestPassword = 'password';
			var user = {
				password: 'password'
			};
			var resolve = function(result){
				expect(result).toBe(user);
			};

			bcrypt.compare.and.callFake(function(password, user, success){
				success(user);
			});

			// WHEN
			underTest.verifyPassword(requestPassword, user, resolve, emptyFunction);	

			// THEN	
		});
	});


});