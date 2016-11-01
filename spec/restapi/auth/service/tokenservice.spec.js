var TokenService = require('../../../../restapi/auth/service/tokenservice');

describe("TokenService", function() {

	var secretKey = 'testkey';
	var jwt;
	var underTest;
	var emptyFunction = function(){};

	beforeEach(function() {
		jwt = jasmine.createSpyObj('jwt', ['verify', 'sign']);
		underTest = TokenService(secretKey, {
			'jwt':jwt
		});
	});

	describe("dependencies", function() {
		it("should throw typeerror when jwt is missing", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				TokenService(secretKey, {});
			}
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'JWT is missing!');

		});
	});

	describe(".verify()", function() {
		it("should return with decoded token when no error occured in jwt", function() {
			// GIVEN
			var decoded = 'decoded';
			var resolve = function(result){
				expect(result).toBe(decoded);
			};

			jwt.verify.and.callFake(function(token, key, success){
				success(null, decoded);
			});

			// WHEN
			underTest.verify(secretKey, resolve, emptyFunction);	

			// THEN	
		});

		it("should return error when error occured in jwt", function() {
			// GIVEN
			var token = 'token';
			var decoded = 'decoded';
			var errorMessage = 'error';
			var reject = function(error){
				expect(error).toBe(errorMessage);
			};

			jwt.verify.and.callFake(function(token, key, success){
				success(errorMessage, decoded);
			});

			// WHEN
			underTest.verify(secretKey, emptyFunction, reject);	

			// THEN	
		});
	});

	describe(".sign()", function() {
		it("should return token", function() {
			// GIVEN
			var token = 'token';

			jwt.sign.and.callFake(function(data, params){
				return token;
			});

			// WHEN
			var result = underTest.sign({}, {});	

			// THEN	
			expect(result).toBe(token);
		});
	});

});