var AuthService = require('../../../../restapi/auth/service/authservice');

describe("AuthService", function() {

	var loginService;
	var tokenService;
	var communication;
	var underTest;
	var emptyFunction = function(){};

	beforeEach(function() {
		loginService = jasmine.createSpyObj('loginService', ['verifyPassword']);
		tokenService = jasmine.createSpyObj('tokenService', ['verifyPassword']);
		communication = jasmine.createSpyObj('communication', ['command','responseHandler']);
		underTest = AuthService({
			'loginService':loginService,
			'tokenService':tokenService,
			'communication':communication
		});
	});

	describe("dependencies", function() {
		it("should throw typeerror when loginService is missing", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				AuthService({});
			}
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'LoginService is missing!');
		});	
		it("should throw typeerror when loginService is missing", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				AuthService({
					'loginService':loginService
				});
			}
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'TokenService is missing!');
		});	
		it("should throw typeerror when loginService is missing", function() {
			// GIVEN
			// WHEN			
			var methodToTest = function() {
				AuthService({
					'loginService':loginService,
					'tokenService':tokenService
				});
			}
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, 'Communication is missing!');
		});
	});

	describe(".login()", function() {
		it("should return call resolve", function() {
			// GIVEN
			var user = {
				email: 'john@doe.com',
				password: 'hunter'
			};

			var resolve = function(result){
				expect(result).toBe(user);
			};

			communication.command.and.callFake(function(cmd, params, success){
				expect(params.email).toBe(user.email);
			});

			communication.responseHandler.and.callFake(function(resolve, reject){
				resolve({
					user: user
				});
			});

			loginService.verifyPassword.and.callFake(function(requestPassword, userObj, resolve, reject){
				resolve(user);
			});

			// WHEN
			underTest.login(user, resolve, emptyFunction);	

			// THEN	
		});
	});
});