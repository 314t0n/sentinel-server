'use strict';

var EVENTS = require('sentinel-communication').EVENTS;

function Database(opt) {
    this.userRepo = opt.userRepo;
    this.cameraRepo = opt.cameraRepo;
    this.communication = opt.communication;
    this.registerEvents();
}

Database.prototype.registerEvents = function () {
    // user repo
    registerMethod.call(this, EVENTS.DB.USERS.FIND, this.userRepo, 'findUsersByEmail');
    registerMethod.call(this, EVENTS.DB.USERS.ADD, this.userRepo, 'add');
    // camera repo
    registerMethod.call(this, EVENTS.DB.CAMERA.ADD, this.cameraRepo, 'add');
    registerMethod.call(this, EVENTS.DB.CAMERA.FIND, this.cameraRepo, 'findById');
    registerMethod.call(this, EVENTS.DB.CAMERA.FINDALL, this.cameraRepo, 'findAll');
    registerMethod.call(this, EVENTS.DB.CAMERA.UPDATE, this.cameraRepo, 'update');
    registerMethod.call(this, EVENTS.DB.CAMERA.REMOVE, this.cameraRepo, 'remove');
};

function registerMethod(event, repo, method) {
    this.communication.on(event, repo[method].bind(repo));
}

Database.prototype.close = function (cb) {
    this.communication.close(cb);
}

module.exports = function (opt) {
    return new Database(opt);
};