'use strict';
var express = require('express');

var FALLBACK_URL =  'http://localhost:3000/';
var GET_PATH =  '/';
var GET_VIEW =  'index';

function IndexRouter(title, baseUrl){
	var router = express.Router();

	router.get(GET_PATH, function(req, res){
		res.render(GET_VIEW, {
			'title': title,
			'baseUrl':baseUrl
		});
	});
	
	return router;
}

module.exports = function(title, baseUrl){
	return new IndexRouter(title, baseUrl || FALLBACK_URL);
}
