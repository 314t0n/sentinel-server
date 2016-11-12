var express = require('express');
var router = express.Router();
var url = require('url');

var utils = require('../../utils/utils');
var filteredCollection = utils.filteredCollection;
var setDateFilter = utils.setDateFilter;
var isUndefined = utils.isUndefined;
var hasKeys = utils.hasKeys;

var logger = require('../../../common/logger').app;

var dbHelper = require('../../database/helpers/imagelog-helper');
var mongoHelper = require('../../database/helpers/query-helper');

var authorizationHelper = require('../../utils/utils').authorizationHelper;

router.get('/', authorizationHelper, function(req, res) {

    var db = req.elastic || req.db;
 
    var query = getQuery(req);

    var imagelogs = db.query('imagelogs')
        .filter(mongoHelper.getDateFilter(query))
        .filter(mongoHelper.getUnreadFilter(query))
        .filter(mongoHelper.getCameraFilter(query))
        .pagination({
            limit: mongoHelper.getLimitFilter(query),
            skip: mongoHelper.getOffsetFilter(query),
            sort: mongoHelper.getSortFilter(query),
        })
        .all();

    imagelogs
        .on('success', function(items) {         
            res.json({
                imagelogs: items
            });
        });

});

router.get('/count', authorizationHelper, function(req, res) {

    var db = req.elastic || req.db;
 
    var query = getQuery(req);

    var imagelogs = db.query('imagelogs')
        .filter(mongoHelper.getDateFilter(query))
        .filter(mongoHelper.getUnreadFilter(query))
        .filter(mongoHelper.getCameraFilter(query))
        .pagination({
            limit: mongoHelper.getLimitFilter(query),
            skip: mongoHelper.getOffsetFilter(query),
            sort: mongoHelper.getSortFilter(query),
        })
        .count();

    imagelogs
        .on('success', function(items) {         
            res.json({
                count: items
            });
        });

});


module.exports = router;

function getQuery(req) {
    var url_parts = url.parse(req.url, true);
    return url_parts.query;
}