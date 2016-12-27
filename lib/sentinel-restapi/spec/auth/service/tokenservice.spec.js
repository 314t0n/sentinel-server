var proxyquire = require('proxyquire');
var moduleToTest = '../../../src/auth/service/tokenservice';
var Promise = require('bluebird');

describe("TokenService", function () {

    var secretKey = 'testkey';
    var jwt;
    var underTest;
    var emptyFunction = function () {
    };

    beforeEach(function () {
        jwt = jasmine.createSpyObj('jwt', ['verify', 'sign']);
        var TokenService = proxyquire(moduleToTest, {
            'jsonwebtoken': jwt
        });
        underTest = TokenService(secretKey);
    });

    describe(".verify()", function () {

        var resolve;

        beforeEach(function () {
            resolve = jasmine.createSpy();
        });

        it("should return with decoded token when no error occured in jwt", function (done) {
            // GIVEN
            var decoded = 'decoded';

            jwt.verify.and.callFake(function (token, key, success) {
                success(null, decoded);
            });

            // WHEN
            underTest.verify(secretKey).then(resolve);

            // THEN
            resolve.and.callFake(function (result) {
                expect(result).toBe(decoded);
                done();
            });
        });

        it("should return error when error occured in jwt", function (done) {
            // GIVEN
            var decoded = 'decoded';
            var errorMessage = 'error';

            jwt.verify.and.callFake(function (token, key, success) {
                success(errorMessage, decoded);
            });

            // WHEN
            underTest.verify(secretKey).then(done).catch(resolve);

            // THEN
            resolve.and.callFake(function (error) {
                expect(error).toBe(errorMessage);
                done();
            });
        });

        afterEach(function () {
            expect(resolve).toHaveBeenCalled();
        })
    });

    describe(".sign()", function () {

        var resolve;

        beforeEach(function () {
            resolve = jasmine.createSpy();
        });

        it("should return token", function (done) {
            // GIVEN
            var token = 'token';

            jwt.sign.and.callFake(function (data, key, params, cb) {
                cb(token);
            });

            // WHEN
            underTest.sign({}, {}).then(resolve);

            // THEN
            resolve.and.callFake(function (result) {
                expect(result).toBe(token);
                done();
            });
        });


        afterEach(function () {
            expect(resolve).toHaveBeenCalled();
        })
    });

});