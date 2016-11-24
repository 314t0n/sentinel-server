'use strict';

function successResponse(response) {
    return function (result) {
        response(null, result);
    }
}

function errorResponse(response) {
    return function (err) {
        response(err);
    }
}

function handleResponse(query, response) {
    query
        .then(successResponse(response))
        .catch(errorResponse(response));
}

exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.handleResponse = handleResponse;