// Module dependencies -----------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var configs = require('./config');
var utils = require('sentinel-utils').utils;
var config = configs.dev; // host/port config
var logger = require('sentinel-utils').logger.app;

// Bootstrap ---------------------------

// set args in global config object
//argumentHandler.setConfig(config);

var BASE_URL = "http://" + config.host + ":" + config.port + "/";

// global var for templates
app.locals.baseUrl = BASE_URL;

// View engine setup

app.set('views', path.join(__dirname, './public/views'));
app.set('view engine', 'jade');
app.set('view cache', 'disable');
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

// Public folders

app.use(express.static(path.join(__dirname, './public')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));
app.use('/js/bower', express.static(path.join(__dirname, '../bower_components')));

// Header settings

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    next();

});

// Router

var routes = require('./controller.config').routes;

var APP_TITLE = 'Sentinel';
//var indexRoute = require('./routes/index')(APP_TITLE, BASE_URL);
//var partialsRoute = require('./routes/partials')({
//    authorizationHelper: utils.authorizationHelper
//});

routes.forEach(function (el) {
    logger.info('Registered endpoint: ' + el.endpoint);
    app.use(el.endpoint, el.router);
});
/*
 var imagelogRoute = require('./routes/api/imagelog');
 var notificationRoute = require('./routes/api/notification');
 var configRoute = require('./routes/api/config');*/

// Api routing

/*app.use('/api/v1/imagelog', imagelogRoute);
 app.use('/api/v1/notification', notificationRoute);
 app.use('/api/v1/config', configRoute);
 app.use('/api/v1/auth', authRoute);*/

// partials

/*app.use('/partials', partialsRoute);*/

// catch everything else

//app.use('*', indexRoute);

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

// error handlers

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

app.set('port', process.env.PORT || config.port);

process.on('uncaughtException', function (err) {
    logger.log("error", err);
});

module.exports = function(){
    var server;
    return {
        start: function(done){
            server = app.listen(app.get('port'), config.host, function () {
                logger.log('info', 'Running on ' + config.host + ':' + server.address().port);
                done();
            });
        },
        stop: function(done){
            if(server){
                server.close(done);
            }
        }
    }
}