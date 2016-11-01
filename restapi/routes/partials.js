var express = require('express');

function PartialsRouter(authorizationHelper){
	var router = express.Router();

	router.get('/404', function(req, res) {
		res.render('partials/404');
	});

	router.get('/login', function(req, res) {
		res.render('partials/login');
	});

	router.get('/:name', authorizationHelper, function(req, res) {
		res.render('partials/' + req.params.name);
	});

	return router;
}

module.exports = function(params){
	return new PartialsRouter(params.authorizationHelper);
}