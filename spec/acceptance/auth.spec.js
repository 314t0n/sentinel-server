var request = require("request");
var baseUrl = 'http://localhost:3000/api/v2/auth/';

describe("/api/v2/auth/ Endpoint Test Suite", function () {

    describe("login", function () {

        it('GET should return Not Found', function (done) {
            // GIVEN
            // WHEN
            // THEN
            request.get(baseUrl + 'login/', function (error, response, body) {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(404);
                done();
            });
        });

        it('GET should return Bad Request for wrong email', function (done) {
            // GIVEN
            var formData = {
                email: 'nope@not.ex',
                password: 'asd'
            };
            // WHEN
            // THEN
            request.post(baseUrl + 'login/', formData, function (error, response, body) {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(400);
                done();
            });
        });

    });

});