"use strict";

var typeUtils = require("../../core/utils/type"),
    graphModule = require('./graph'),
    _isArray = Array.isArray,
    _isString = typeUtils.isString,
    _isNumber = typeUtils.isNumeric;

let validator = {
    validate: function(data, incidentOccurred) {
        var result = null;
        if(this._isInvalid(data)) {
            incidentOccurred("E2402");
            result = 'Provided data can not be displayed';
        } else if(this._hasCycle(data)) {
            result = 'A cycle detected in data that you provided';
            incidentOccurred("E2401");
        }
        return result;
    },
    _hasCycle: function(data) {
        return graphModule.struct.hasCycle(data);
    },
    _isInvalid: function(data) {
        if(!_isArray(data)) {
            return true;
        } else {
            var result = null;
            for(let link of data) {
                if(!(_isArray(link) &&
                    link.length >= 2 &&
                    _isString(link[0]) &&
                    _isString(link[1]) &&
                    _isNumber(link[2]) &&
                    link[2] > 0)) {
                    result = true;
                }
            }
            return result;
        }
    }
};

module.exports = validator;
