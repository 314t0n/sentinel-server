'use strict';

var EVENTS = require('sentinel-communication').EVENTS;

function Database(opt) {
    this.userRepo = opt.userRepo;
    this.cameraRepo = opt.cameraRepo;
    this.configRepo = opt.configRepo;
    this.communication = opt.communication;
    this.registerEvents();
}

Database.prototype.registerEvents = function () {
    // user repo
    registerMethod.call(this, EVENTS.DB.USERS.ADD, this.userRepo, 'add');
    registerMethod.call(this, EVENTS.DB.USERS.FIND, this.userRepo, 'findById');
    registerMethod.call(this, EVENTS.DB.USERS.FINDBYEMAIL, this.userRepo, 'findUsersByEmail');
    registerMethod.call(this, EVENTS.DB.USERS.FINDALL, this.userRepo, 'findAll');
    registerMethod.call(this, EVENTS.DB.USERS.UPDATE, this.userRepo, 'update');
    registerMethod.call(this, EVENTS.DB.USERS.REMOVE, this.userRepo, 'remove');
    // camera repo
    registerMethod.call(this, EVENTS.DB.CAMERA.ADD, this.cameraRepo, 'add');
    registerMethod.call(this, EVENTS.DB.CAMERA.FIND, this.cameraRepo, 'findById');
    registerMethod.call(this, EVENTS.DB.CAMERA.FINDALL, this.cameraRepo, 'findAll');
    registerMethod.call(this, EVENTS.DB.CAMERA.UPDATE, this.cameraRepo, 'update');
    registerMethod.call(this, EVENTS.DB.CAMERA.REMOVE, this.cameraRepo, 'remove');
    // config repo
    registerMethod.call(this, EVENTS.DB.CONFIG.ADD, this.configRepo, 'add');
    registerMethod.call(this, EVENTS.DB.CONFIG.FIND, this.configRepo, 'findById');
    registerMethod.call(this, EVENTS.DB.CONFIG.FINDALL, this.configRepo, 'findAll');
    registerMethod.call(this, EVENTS.DB.CONFIG.UPDATE, this.configRepo, 'update');
    registerMethod.call(this, EVENTS.DB.CONFIG.REMOVE, this.configRepo, 'remove');
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