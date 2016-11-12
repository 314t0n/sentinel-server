var communicationFactory = require('../common/communication/communication.factory');
var database = require('./api/database');
var _ = require('underscore');
var databaseInterface = require('../abstract/database');

exports.start = function(opt){

	var opt = opt || {};

	var persistenceCommunication = communicationFactory({
		type: 'http',
		port: opt.port || '8001',
		host: opt.host ||'localhost'
	});

	var dbProvider = require('./concrete/mongo')({
		url: 'localhost:27017'
	});

	//add default interface methods
	dbProvider = _.defaults(dbProvider || {}, databaseInterface);

	database({
		provider:dbProvider,
		communication: persistenceCommunication
	});
}