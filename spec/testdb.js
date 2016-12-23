var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var Promise = require('bluebird');

function TestDB(opt) {
    var opt = opt || {};
    this.db = new Db(opt.name || 'test', new Server(opt.host || 'localhost', opt.port || 27017));
}

TestDB.prototype.start = function () {
    var db = this.db;
    return new Promise(function (resolve, reject) {
        db.open(function (err, db) {
            if (err)
                reject(err);
            resolve(db.admin());
        });
    });
};

TestDB.prototype.close = function (done) {
    var db = this.db;
    return new Promise(function (resolve, reject) {
        try {
            db.dropDatabase(function () {
                db.close(resolve);
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = function (opt) {
    return new TestDB(opt);
};
