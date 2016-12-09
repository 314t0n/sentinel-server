var proxyquire = require('proxyquire');
var moduleToTest = '../../../src/auth/service/authservice';

describe("AuthService", function() {

	var loginService;
	var tokenService;
	var communication;
	var AuthService;
	var utilsStub;
	var underTest;
	var emptyFunction = function(){};

	beforeEach(function() {
		loginService = jasmine.createSpyObj('loginService', ['verifyPassword']);
		tokenService = jasmine.createSpyObj('tokenService', ['verifyPassword']);
		communication = jasmine.createSpyObj('communication', ['command','responseHandler']);

		utilsStub = jasmine.createSpyObj('utilsStub', ['assertUndefined', 'isFunction', 'assertFunction']);
		AuthService = proxyquire(moduleToTest, {
			'sentinel-utils': utilsStub,
			'loginService': loginService,
			'tokenService': tokenService
		});

		underTest = AuthService({
			'communication':communication
		});
	});

	describe("dependencies", function() {
		it("should throw typeerror when communication is missing", function() {
			// GIVEN
			var msg = 'Communication is missing!';
			utilsStub.assertUndefined.and.callFake(function () {
				throw new TypeError(msg);
			});

			// WHEN			
			var methodToTest = function() {
				AuthService();
			};
			// THEN		
			expect( methodToTest ).toThrowError(TypeError, msg);
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