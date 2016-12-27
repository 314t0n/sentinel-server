var proxyquire = require('proxyquire');

var moduleToTest = '../../../src/auth/service/loginservice';

describe("LoginService", function () {

    var bcrypt;
    var underTest;

    beforeEach(function () {
        bcrypt = jasmine.createSpyObj('bcrypt', ['compare']);
        var LoginService = proxyquire(moduleToTest, {
            'bcrypt': bcrypt
        });
        underTest = LoginService();
    });

    describe(".verifyPassword()", function () {

        var resolve;

        beforeEach(function () {
            resolve = jasmine.createSpy();
        });

        it("should resolve when passwords are match", function (done) {
            // GIVEN
            var requestPassword = 'password';
            var user = {
                password: 'password'
            };

            bcrypt.compare.and.callFake(function (password, user, cb) {
                cb(null, true);
            });

            // WHEN
            underTest.verifyPassword(requestPassword, user).then(resolve);

            // THEN	

            resolve.and.callFake(function (result) {
                expect(result).toBe(user);
                done();
            });
        });

        it("should reject when passwords are not match", function (done) {
            // GIVEN
            var errMsg = 'Passwords did not match!';
            var requestPassword = 'hunter56';
            var user = {
                password: 'password'
            };

            bcrypt.compare.and.callFake(function (password, user, cb) {
                cb(null, false);
            });

            // WHEN
            underTest.verifyPassword(requestPassword, user).then(done).catch(resolve);

            // THEN

            resolve.and.callFake(function (result) {
                expect(result).toBe(errMsg);
                done();
            });
        });

        it("should reject when error occurs", function (done) {
            // GIVEN
            var error = new Error('error');

            bcrypt.compare.and.callFake(function (password, user, cb) {
                cb(error, false);
            });

            // WHEN
            underTest.verifyPassword('', {}).then(done).catch(resolve);

            // THEN

            resolve.and.callFake(function (result) {
                expect(result).toBe(error);
                done();
            });
        });

        afterEach(function () {
            expect(resolve).toHaveBeenCalled();
        })
    });

});