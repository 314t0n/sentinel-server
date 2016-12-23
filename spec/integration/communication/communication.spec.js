var communicationFactory = require('sentinel-communication').communicationFactory();

describe("Commnuication Integration Test", function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10 * 2;

    var ROLES = {
        A: 'testA',
        B: 'testB'
    };

    var underTestA;
    var underTestB;

    beforeEach(function (done) {
        communicationFactory.create({role: ROLES.A, isbase: true}).then(function (communication) {
            underTestA = communication;
            communicationFactory.create({role: ROLES.B}).then(function (communication) {
                underTestB = communication;
                done();
            });
        });
    });

    afterEach(function (done) {
        underTestA.close(function () {
            underTestB.close(function () {
                done();
            });
        });
    });

    describe("sending and receving messages", function () {
        it("A should ping B", function (done) {
            // GIVEN
            var ping = 'ping';
            var pong = 'pong';

            // WHEN
            underTestB.on('test', ROLES.B, function (params, response) {
                expect(params.message).toBe(ping);
                response(null, {response: pong});
            });

            // THEN

            underTestA.command('test', {message: ping}, ROLES.B)
                .then(function (result) {
                    expect(result.response).toBe(pong);
                    done();
                });
        });

        it("A and B should able to send and receive message from each other", function (done) {
            // GIVEN
            var fromAtoB = 'hello B';
            var fromBtoA = 'hello A';
            var EVENTS = {
                TO: {
                    A: 'toA',
                    B: 'toB'
                }
            };

            // WHEN
            underTestA.on(EVENTS.TO.A, ROLES.A, function (params, response) {
                expect(params.message).toBe(fromBtoA);
                response(null, params);
            });

            underTestB.on(EVENTS.TO.B, ROLES.B, function (params, response) {
                expect(params.message).toBe(fromAtoB);
                response(null, params);
            });

            // THEN

            underTestA.command(EVENTS.TO.B, {message: fromAtoB}, ROLES.B)
                .then(function (result) {
                    expect(result.message).toBe(fromAtoB);

                    underTestB.command(EVENTS.TO.A, {message: fromBtoA}, ROLES.A)
                        .then(function (result) {
                            expect(result.message).toBe(fromBtoA);
                            done();
                        });
                });
        });
    });
});