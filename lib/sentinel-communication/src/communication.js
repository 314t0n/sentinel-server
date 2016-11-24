'use strict';

var utils = require('sentinel-utils').utils;
var Promise = require('bluebird');
/**
 * Communication constructor.
 *
 * @param {String} role Seneca module will be pinned to this role.
 * @param dependencies Seneca, Logger
 * @constructor
 */
function Communication(role, dependencies) {
    this.Seneca = dependencies.seneca;
    this.Logger = dependencies.logger;
    this.role = role;
}

Communication.prototype = Object.create(null);
/**
 * Publish to specific command.
 * @param {String} cmd Command id to publish.
 * @param {Object} params Paramters object.
 * @param {String} role Publish to specific role.
 * @returns {bluebird}
 */
Communication.prototype.command = function command(cmd, params, role) {
    utils.assertUndefined(cmd, 'Command is missing!');
    var seneca = this.Seneca;
    var senecaOptions = {
        cmd: cmd,
        params: params || {},
        role: role || this.role
    };
    return new Promise(function (resolve, reject) {
        seneca.act(senecaOptions, responseHandler(resolve, reject));
    });
}

function responseHandler(resolve, reject) {
    return function (err, msg) {
        if (err) {
            reject && reject(err);
            return;
        }
        resolve && resolve(msg);
    }
}
/**
 * Subscribe to specific command.
 *
 * @param {String} cmd Command to subscribe.
 * @param {String} role [Optional] Specific role to subscribe.
 * @param {Function} Callback function.
 * @return {Void}
 */
Communication.prototype.on = function on(cmd, role, handler) {
    utils.assertUndefined(cmd, 'Command is missing!');
    if (utils.isFunction(role)) {
        handler = role;
    }
    utils.assertFunction(handler, 'Handler is not a function!');

    this.Seneca.add({cmd: cmd, role: role || this.role}, function (msg, response) {
        handler(msg.params, response);
    });
}
/**
 * Resolve/Reject commands
 * @param  {Function} resolve success callback
 * @param  {Function} reject  error callback
 * @return {Function}         command response handler
 */
Communication.prototype.responseHandler = function responseHandler(resolve, reject) {
    return function (err, msg) {
        if (err) {
            reject(err);
            return;
        }
        resolve(msg);
    }
}
/**
 * Close underlying communication object.
 * @param  {Function} done called when Seneca closed
 */
Communication.prototype.close = function close(done) {
    this.Seneca.close(done);
}
/**
 * Creates new Communication instance.
 *
 * @param  {Seneca}
 * @return {Communication}
 */
module.exports = function (role, dependencies) {
    utils.assertUndefined(dependencies.seneca, "Seneca is missing!");
    utils.assertUndefined(dependencies.logger, "Logger is missing!");

    return new Communication(role, dependencies);
}