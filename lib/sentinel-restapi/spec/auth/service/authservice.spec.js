var proxyquire = require('proxyquire');
var moduleToTest = '../../../src/auth/service/authservice';
var EVENTS = require('sentinel-communication').EVENTS;
var Promise = require('bluebird');

// fake promise 
var promiseStub = function (cbParam) {
    return function () {
        return {
            then: function (cb) {
                return cb(cbParam);
            }
        };
    };
};

describe("AuthService", function () {

    var loginService;
    var tokenService;
    var communication;
    var AuthService;
    var utilsStub;
    var servicelocator;
    var underTest;

    beforeEach(function () {
        loginService = jasmine.createSpyObj('loginService', ['verifyPassword']);
        tokenService = jasmine.createSpyObj('tokenService', ['sign']);
        communication = jasmine.createSpyObj('communication', ['command', 'responseHandler']);
        servicelocator = jasmine.createSpyObj('locator', ['get']);

        utilsStub = jasmine.createSpyObj('utilsStub', ['assertUndefined', 'isFunction', 'assertFunction']);
        AuthService = proxyquire(moduleToTest, {
            'sentinel-utils': utilsStub,
            './loginservice': function () {
                return loginService;
            },
            './tokenservice': function () {
                return tokenService;
            },
            'servicelocator': servicelocator
        });

        servicelocator.get.and.callFake(function () {
            return communication;
        });

        underTest = AuthService();
    });

    describe("dependencies", function () {
        it("should throw typeerror when communication is missing", function () {
            // GIVEN
            var msg = 'Communication is missing!';
            utilsStub.assertUndefined.and.callFake(function () {
                throw new TypeError(msg);
            });

            // WHEN			
            var methodToTest = function () {
                AuthService();
            };
            // THEN		
            expect(methodToTest).toThrowError(TypeError, msg);
        });
    });

    describe(".login()", function () {
        it("should call dependencies", function (done) {
            // GIVEN
            var user = {
                email: 'john@doe.com',
                password: 'hunter'
            };

            var result = {user: user};

            communication.command.and.callFake(promiseStub(result));
            loginService.verifyPassword.and.callFake(promiseStub(user));
            tokenService.sign.and.callFake(promiseStub(user));

            // WHEN
            underTest.login(user).then(done);

            // THEN	
            expect(communication.command).toHaveBeenCalledWith(EVENTS.DB.USERS.FINDBYEMAIL, user.email);
            expect(loginService.verifyPassword).toHaveBeenCalledWith(user.password, user);
            expect(tokenService.sign).toHaveBeenCalledWith(user);
        });

        describe("error handling", function () {
            var error;
            var reject;
            var result;
            var user;
            beforeEach(function () {
                error = new Error('error');
                reject = jasmine.createSpy().and.callFake(function (result) {
                    expect(result).toBe(error);
                });
                user = {
                    email: 'john@doe.com',
                    password: 'hunter'
                };
                result = {user: user};
            });

            it("should catch when communication throws error", function (done) {
                // GIVEN
                communication.command.and.callFake(function () {
                    throw error;
                });

                // WHEN
                underTest.login(user).then(done).catch(function (e) {
                    reject(e);
                    done();
                });

                // THEN	
                expect(communication.command).toHaveBeenCalledWith(EVENTS.DB.USERS.FINDBYEMAIL, user.email);
            });

            it("should catch when loginService throws error", function (done) {
                // GIVEN
                communication.command.and.callFake(promiseStub(result));
                loginService.verifyPassword.and.callFake(function () {
                    throw error;
                });

                // WHEN
                underTest.login(user).then(done).catch(function (e) {
                    reject(e);
                    done();
                });

                // THEN	
                expect(communication.command).toHaveBeenCalledWith(EVENTS.DB.USERS.FINDBYEMAIL, user.email);
                expect(loginService.verifyPassword).toHaveBeenCalledWith(user.password, user);
            });

            it("should catch when tokenService throws error", function (done) {
                // GIVEN
                communication.command.and.callFake(promiseStub(result));
                loginService.verifyPassword.and.callFake(promiseStub(user));
                tokenService.sign.and.callFake(function () {
                    throw error;
                });

                // WHEN
                underTest.login(user).then(done).catch(function (e) {
                    reject(e);
                    done();
                });

                // THEN	
                expect(communication.command).toHaveBeenCalledWith(EVENTS.DB.USERS.FINDBYEMAIL, user.email);
                expect(loginService.verifyPassword).toHaveBeenCalledWith(user.password, user);
                expect(tokenService.sign).toHaveBeenCalledWith(user);
            });

            afterEach(function () {
                expect(reject).toHaveBeenCalledWith(error);
            });
        });

    });
});