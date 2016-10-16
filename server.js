function startModule(modulePath, options){
	var seneca = require('seneca')();

	seneca.use(require(modulePath));

	seneca.listen(options);
}

var host = 'localhost';

startModule('./persistence/persistence.js', {
	type: 'http',
	port: '8000',
	host: host
});

startModule('./restapi/restapi.js', {
	type: 'http',
	port: '8001',
	host: host
});

startModule('./socketio/socketio.server.js', {
	type: 'http',
	port: '8002',
	host: host
});