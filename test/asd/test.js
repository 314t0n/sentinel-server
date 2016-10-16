var seneca = require('seneca')();

seneca.client();

seneca.act({ cmd:'ping'}, function(err, item) {
  console.log('ez gyutt:', err, item);
});