module.exports = function(options) {
  var seneca = this;

  seneca.add({cmd:'ping'}, pong);

  function pong(args, done) {
      done(null, { msg: 'ponged'})
  }


}