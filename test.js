var com = require('./common/communication/communication.factory');
	
var actCom = com({
	type: 'http',
	port: '8000',
	host: 'localhost'
});

var COMMAND = "asd";

actCom.on(COMMAND, function(params){
	console.log(params);
	setTimeout(function(){
		actCom.command(COMMAND, {"tset":"gset"});
	}, 1000);
});

actCom.command(COMMAND, {"szav":"asd"});