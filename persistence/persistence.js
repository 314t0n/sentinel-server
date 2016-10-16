module.exports = function(options) {
	var seneca = this;

	seneca.add({cmd:'save'}, handlers.save);

}

var handlers = (function(){

	return {

		save: function(args, done){
			done(null, { msg: 'ponged'})
		}

	}

})();