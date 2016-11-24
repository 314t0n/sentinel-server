'use strict';

var CrudRepo = require('./crudRepository').clazz;

function CameraRepository(opt){
    CrudRepo.call(this, 'camera', opt);
}

CameraRepository.prototype = Object.create(CrudRepo.prototype);

module.exports = function(opt) {
    return new CameraRepository(opt);
};