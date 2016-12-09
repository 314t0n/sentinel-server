var request = require("request");
var baseUrl = 'http://localhost:3000/api/v2/auth/';

describe("/api/v2/auth/ Endpoint Test Suite", function () {

    describe("login", function () {

        it('GET should return Not Found', function (done) {
            request.get(baseUrl + 'login/', function (error, response, body) {
                expect(error).toBe(null);
                expect(response.statusCode).toBe(404);
                done();
            });
        });

    });

});