var proxyquire = require('proxyquire');

var moduleToTest = '../../../src/auth/service/loginservice';

describe("LoginService", function() {

	var bcrypt;
	var underTest;
	var emptyFunction = function(){};

	beforeEach(function() {
		bcrypt = jasmine.createSpyObj('bcrypt', ['compare']);
		var LoginService = proxyquire(moduleToTest, {
			'bcrypt': bcrypt
		});
		underTest = LoginService();
	});

	describe(".verifyPassword()", function() {

		it("should resolve when passwords are match", function() {
			// GIVEN
			var requestPassword = 'password';
			var user = {
				password: 'password'
			};
			var resolve = function(result){
				expect(result).toBe(user);
			};

			bcrypt.compare.and.callFake(function(password, user, cb){
				cb(user);
			});

			// WHEN
			underTest.verifyPassword(requestPassword, user, resolve, emptyFunction);	

			// THEN	
		});

		it("should reject when passwords are not match", function() {
			// GIVEN
			var errMsg = 'Passwords did not match!';
			var requestPassword = 'hunter56';
			var user = {
				password: 'password'
			};
			var reject = function(result){
				expect(result).toBe(errMsg);
			};

			bcrypt.compare.and.callFake(function(password, user, cb){
				cb(null, false);
			});

			// WHEN
			underTest.verifyPassword(requestPassword, user, emptyFunction, reject);

			// THEN
		});

		it("should reject when error occurs", function() {
			// GIVEN
			var error = new Error('error');
			var reject = function(result){
				expect(result).toBe(error);
			};

			bcrypt.compare.and.callFake(function(password, user, cb){
				cb(error, false);
			});

			// WHEN
			underTest.verifyPassword('', {}, emptyFunction, reject);

			// THEN
		});
	});

});