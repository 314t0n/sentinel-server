var exceptions = require('./model/exceptions');
/**
 * Function compose
 * @param  {[Function]} g
 * @return {[Function]}   [calls f with g: f( g(args) )]
 */
function compose(f, g) {
    return function() {
        return f.call(this, g.apply(this, arguments));
    };
};
/**
 * Simple undefined test
 * @param  {[Object]}  obj
 * @return {Boolean}
 */
function isUndefined(obj) {
    return obj === undefined;
}
/**
 * Simple function test
 * @param  {[Function]}  fn
 * @return {Boolean}
 */
function isFunction(fn) {
    return typeof fn === 'function';
}

function assertUndefined(obj, msg){
    if(isUndefined(obj)){
        throw new TypeError(msg);
    }
}

function assertFunction(obj, msg){
    if(!isFunction(obj)){
        throw new TypeError(msg);
    }
}
/**
 * check object keys
 * @param  {[Object]} obj
 * @param  {[Array]}  keys
 * @return {Boolean}  Whether object has all the keys
 */
function hasKeys(obj, keys) {
    var test = keys.map(function(key) {
        return obj.hasOwnProperty(key);
    });
    return test.indexOf(false) == -1;
}
var MissingParameterError = exceptions.MissingParameterError;
/**
 * For checking missing params 
 * @param  {[type]} param [description]
 * @param  {[type]} name  [description]
 * @return {[type]}       [description]
 */
function checkParam(param, name) {
    if (isUndefined(param)) {
        throw new MissingParameterError(name + ' is undefined!');
    }
}
/**
 * Check token
 * TODO this surely not belong here!
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function authorizationHelper(req, res, next) {

    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;        
        next();
    } else {
        res.sendStatus(403);
    }
}

exports.authorizationHelper = authorizationHelper;
exports.hasKeys = hasKeys;
exports.compose = compose;
exports.isUndefined = isUndefined;
exports.checkParam = checkParam;
exports.assertUndefined = assertUndefined;
exports.assertFunction = assertFunction;