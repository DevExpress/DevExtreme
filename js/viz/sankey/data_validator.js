"use strict";

var typeUtils = require("../../core/utils/type"),
    graphModule = require('./graph'),
    _isArray = Array.isArray,
    _isString = typeUtils.isString,
    _isNumber = typeUtils.isNumeric;

let validator = {
    validate: function(data, incidentOccurred) {
        var result = null, validationCode = this._isInvalid(data);
        if(validationCode !== null) {
            result = validationCode;
            incidentOccurred(validationCode);
        } else if(this._hasCycle(data)) {
            result = 'E2006';
            incidentOccurred('E2006');
        }
        return result;
    },
    _hasCycle: function(data) {
        return graphModule.struct.hasCycle(data);
    },
    _isInvalid: function(data) {
        var result = null;
        if(!_isArray(data)) {
            result = 'E2007';
        } else {
            for(let link of data) {
                if(!_isArray(link)) {
                    result = 'E2008';
                } else if(link.length !== 3) {
                    result = 'E2009';
                } else if(!(_isString(link[0]) && _isString(link[1]) && _isNumber(link[2]))) {
                    result = 'E2010';
                } else if(link[2] <= 0) {
                    result = 'E2011';
                }
            }
            return result;
        }
    }
};

module.exports = validator;
