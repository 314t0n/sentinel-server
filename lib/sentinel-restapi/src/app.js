// Module dependencies -----------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var utils = require('sentinel-utils').utils;
var logger = require('sentinel-utils').logger.app;

// set args in global config object
//argumentHandler.setConfig(config);

function setupViewVariables(config) {
    app.locals.baseUrl = "http://" + config.host + ":" + config.port + "/";
    ;
}

function setupViewEngine() {
    app.set('views', path.join(__dirname, './public/views'));
    app.set('view engine', 'jade');
    app.set('view cache', 'disable');
}

function setupParsers() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
}

function setupStaticContent() {
    app.use(express.static(path.join(__dirname, './public')));
    app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
    app.use('/js/bower', express.static(path.join(__dirname, '../bower_components')));
}
// TODO cross origin * ???
function setupHeaders() {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        next();
    });
}

function setupRouting() {
    var routes = require('./controller.config').routes;
    routes.forEach(function (el) {
        logger.info('Registered endpoint: ' + el.endpoint);
        app.use(el.endpoint, el.router);
    });
}

function setupErrorHandlers() {
    app.use(function (err, req, res, next) {
        if (err.status !== undefined) {
            res.status(err.status).send({
                code: err.code,
                message: err.message
            });
        } else {
            next(err);
        }
    });

    // 404 and forward to error handler

    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

}

function setPort(config){
    app.set('port', process.env.PORT || config.port);
}

function createServer(config) {
    var server;
    return {
        start: function (done) {
            server = app.listen(app.get('port'), config.host, function () {
                logger.log('info', 'Running on ' + config.host + ':' + server.address().port);
                done && done();
            });
        },
        stop: function (done) {
            if (server) {
                server.close(done);
            }
        }
    }
}

function setupServer(config) {
    setupViewVariables(config);
    setupViewEngine();
    setupParsers();
    setupStaticContent();
    setupHeaders();
    setupRouting();
    setupErrorHandlers();
    setPort(config);
    return createServer(config);
}

process.on('uncaughtException', function (err) {
    logger.log("error", err);
});

module.exports = function (config) {
    if (config === undefined) {
        throw new TypeError('Config is missing!');
    }
    return setupServer(config);
};