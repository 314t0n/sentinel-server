/**
 * Creates new Seneca instance.
 * 
 * @param  {Object}
 * @return {Seneca}
 */
module.exports = function(options){
	var seneca = require('seneca')();
	seneca.listen(options);
	return seneca;
}