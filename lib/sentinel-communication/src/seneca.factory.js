var Seneca = require('seneca');
/**
 * Creates new Seneca instance.
 * 
 * @param  {Object}
 * @return {Seneca}
 */
 module.exports = function(opt, logLevel){
 	var seneca = Seneca({log: logLevel || 'test'});
 	seneca.use('mesh', opt);
 	return seneca;
 }