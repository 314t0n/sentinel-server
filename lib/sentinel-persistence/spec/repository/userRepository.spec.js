'use strict';

var UserRepo = require('../../src/repository/userRepository');

describe("User Repository", function () {

    var databaseProvider = jasmine.createSpyObj('databaseProvider', ['query', 'save']);
    var responseHandler = jasmine.createSpyObj('responseHandler', ['handleResponse']);

    var underTest = UserRepo({
        databaseProvider: databaseProvider,
        responseHandler: responseHandler
    });

    describe(".findUsersByEmail()", function () {
        it("should call correct database methods", function () {
            // GIVEN
            var email = 'test@test.com';
            var query = function () {
                return {
                    filter: filter
                }
            };
            var filter = function (filterParams) {
                expect(filterParams).toEqual({email: email});
                return {
                    first: first
                }
            };
            var first = jasmine.createSpy();
            databaseProvider.query.and.callFake(query);

            // WHEN
            underTest.findUsersByEmail(email);

            // THEN
            expect(databaseProvider.query).toHaveBeenCalledWith('user');
            expect(first).toHaveBeenCalled();
            expect(responseHandler.handleResponse).toHaveBeenCalled();
        });
    });

});