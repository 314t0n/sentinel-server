var com = require('./common/communication/communication.factory');
	
var actCom = com({
	type: 'http',
	port: '8000',
	host: 'localhost'
});

var COMMAND = "asd";

actCom.on(COMMAND, function(params, response){
	response(null, {'vaz': 'app'});
});

actCom.command(COMMAND,{}, function(err, msg){
	console.log('ez gyött: ', msg);
});