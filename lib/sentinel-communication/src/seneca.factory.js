var Seneca = require('seneca');
/**
 * Creates new Seneca instance.
 * 
 * @param  {Object}
 * @return {Seneca}
 */
 module.exports = function(opt, logLevel){
 	var seneca = Seneca({
		log: {level: logLevel || 'none'}
	});
 	seneca.use('mesh', opt);
 	return seneca;
 }