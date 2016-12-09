'use strict';

var proxyquire = require('proxyquire');
var moduleToTest = '../src/communication';

describe("Communication", function () {

    var seneca = jasmine.createSpyObj('seneca', ['add', 'act', 'close']);
    var promise = jasmine.createSpyObj('promise', ['then', 'catch']);
    var logger = jasmine.createSpyObj('logger', ['error']);
    var emptyFunction = jasmine.createSpy();
    var utilsStub;
    var underTest;

    beforeEach(function () {

        utilsStub = jasmine.createSpyObj('utilsStub', ['assertUndefined', 'isFunction', 'assertFunction']);
        var Communication = proxyquire(moduleToTest, {
            'sentinel-utils': utilsStub
        });

        underTest = Communication('test', {
            seneca: seneca,
            logger: logger
        });

    });

    describe(".on()", function () {
        it("should call seneca .add()", function () {
            // GIVEN
            var opt = {
                cmd: 'test',
                role: 'test'
            };

            // WHEN
            underTest.on(opt.cmd, opt.role, emptyFunction);

            // THEN
            expect(seneca.add).toHaveBeenCalledWith(jasmine.objectContaining(opt), jasmine.any(Function));
        });

        it("should throw error when command is not provided", function () {
            // GIVEN
            var msg = 'Command is missing!';
            utilsStub.assertUndefined.and.callFake(function () {
                throw new TypeError(msg);
            });

            // WHEN
            var methodToTest = function () {
                underTest.on();
            };

            // THEN
            expect(methodToTest).toThrowError(TypeError, msg);
        });

        it("should throw error when callback is not provided", function () {
            // GIVEN
            var msg = 'Handler is not a function!';
            utilsStub.assertFunction.and.callFake(function () {
                throw new TypeError(msg);
            });

            // WHEN
            var methodToTest = function () {
                underTest.on({cmd: 'testCommand'});
            }

            // THEN
            expect(methodToTest).toThrowError(TypeError, msg);
        });

        it("should throw error when callback is not a function", function () {
            // GIVEN
            var msg = 'Handler is not a function!';
            utilsStub.assertFunction.and.callFake(function () {
                throw new TypeError(msg);
            });

            // WHEN
            var methodToTest = function () {
                underTest.on({cmd: 'testCommand'}, {});
            }

            // THEN
            expect(methodToTest).toThrowError(TypeError, msg);
        });
    });

    describe(".command()", function () {

        it("should call seneca .act()", function () {
            // GIVEN
            var opt = {cmd: 'test', params: 'test', role: 'test'};
            // WHEN
            var result = underTest.command(opt.cmd, opt.params, opt.role);

            // THEN
            expect(seneca.act).toHaveBeenCalledWith(jasmine.objectContaining(opt), jasmine.any(Function));
        });

        it("should call resolve", function (done) {
            // GIVEN
            var opt = {cmd: 'act test', params: 'test', role: 'test'};
            var expected = 'expected';

            seneca.act.and.callFake(function (senecaOptions, response) {
                expect(senecaOptions).toEqual(opt);
                response(null, expected); //err msg
            });

            // WHEN
            var command = underTest.command(opt.cmd, opt.params, opt.role);

            // THEN
            command.then(function (result) {
                expect(result).toEqual(expected);
                done();
            });
        });

        it("should call reject when error occurs in seneca", function (done) {
            // GIVEN
            var opt = {cmd: 'test', params: 'test', role: 'test'};
            var expected = 'error';
            var reject = jasmine.createSpy().and.callFake(function (result) {
                expect(result).toBe(expected);
                done();
            });

            seneca.act.and.callFake(function (params, callback) {
                callback(expected, {}); // err, msg
            });

            // WHEN
            var command = underTest.command(opt.cmd, opt.params, opt.role);

            // THEN
            command.then(emptyFunction).catch(reject);
        });


        it("should throw error when command is not provided", function () {
            // GIVEN
            var msg = 'Command is missing!';
            utilsStub.assertUndefined.and.callFake(function () {
                throw new TypeError(msg);
            });

            // WHEN
            var methodToTest = function () {
                underTest.command();
            }

            // THEN
            expect(methodToTest).toThrowError(TypeError, msg);
        });

    });

    describe(".close()", function () {

        it("should call seneca .close()", function () {
            // GIVEN
            // WHEN
            underTest.close(emptyFunction);

            // THEN
            expect(seneca.close).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it("should call done when seneca close called", function () {
            // GIVEN
            var callback = jasmine.createSpy().and.callFake(function (result) {
            });

            seneca.close.and.callFake(function () {
                callback();
            });

            // WHEN
            underTest.close(callback);

            // THEN
            expect(callback).toHaveBeenCalled();
        });


    });
});