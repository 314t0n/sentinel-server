var communicationFactory = require('./communication');
var senecaFactory = require('./seneca.factory');
/**
 * Factory method for Communication with Seneca injected.
 * 
 * @param  {Object}
 * @return {Communication}
 */
module.exports = function(options){

	return communicationFactory(senecaFactory(options));
}

