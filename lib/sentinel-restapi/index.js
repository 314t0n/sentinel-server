var Server = require('./src/server');

// for command line testing
process.argv.forEach(function (val, index, array) {
    if(val === '--start'){
        Server().start();
    }
});

module.exports = Server;