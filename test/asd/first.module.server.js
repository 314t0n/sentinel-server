var seneca = require('seneca')();

seneca.use(require('./first.module.js'));

seneca.listen();