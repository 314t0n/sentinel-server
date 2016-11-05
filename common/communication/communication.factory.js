var communicationFactory = require('./communication');
var senecaFactory = require('./seneca.factory');
var logger = require('../logger').app;
var DEFAULT_ROLE = 'undefined';

function createSeneca(opt){
	return senecaFactory({
		pin: 'role:' + getRole(opt),
		isbase: opt.isbase
	}); 	
}

function getRole(opt){
	return opt.role || DEFAULT_ROLE;
}
/**
 * Factory method for Communication with Seneca injected.
 * 
 * @param  {Object}
 * @return {Communication}
 */
 module.exports = function(){

 	return {
 		/**
 		 * Creates Communication instance without waiting for seneca to join to the network
 		 * @param  {Object} opt params to seneca
 		 * @return {Communication}  
 		 */
 		 create: function(opt){
 		 	return communicationFactory(createSeneca(opt), logger, getRole(opt));
 		 },
 		/**
 		 * Creates Communication instanceand waits for seneca to join to the network
 		 * @param  {Object} opt params to seneca
 		 * @param  {Function} done callback with newly created Communication instance
 		 */
 		 createAsync: function(opt, done){
 		 	var seneca = createSeneca(opt);
 		 	seneca.ready(function(){
 		 		done(null, communicationFactory(seneca, logger, getRole(opt)));
 		 	});
 		 }
 		}
 	}

