"use strict";

var errorUtils = require("../core/utils/error"),
    coreErrors = require("../core/errors"),
    handlers = {};

/**
* @docid
* @name ErrorsData
*/
var errors = errorUtils(coreErrors.ERROR_MESSAGES, {

    /**
    * @name ErrorsData.E4000
    */
    E4000: "[DevExpress.data]: {0}",

    /**
      * @name ErrorsData.E4001
      */
    E4001: "Unknown aggregating function is detected: '{0}'",

    /**
    * @name ErrorsData.E4002
    */
    E4002: "Unsupported OData protocol version is used",

    /**
    * @name ErrorsData.E4003
    */
    E4003: "Unknown filter operation is used: {0}",

    /**
    * @name ErrorsData.E4004
    */
    E4004: "The thenby() method is called before the sortby() method",

    /**
    * @name ErrorsData.E4005
    */
    E4005: "Store requires a key expression for this operation",

    /**
    * @name ErrorsData.E4006
    */
    E4006: "ArrayStore 'data' option must be an array",

    /**
    * @name ErrorsData.E4007
    */
    E4007: "Compound keys cannot be auto-generated",

    /**
    * @name ErrorsData.E4008
    */
    E4008: "Attempt to insert an item with the a duplicated key",

    /**
    * @name ErrorsData.E4009
    */
    E4009: "Data item cannot be found",

    /**
    * @name ErrorsData.E4010
    */
    E4010: "CustomStore does not support creating queries",

    /**
    * @name ErrorsData.E4011
    */
    E4011: "Custom Store method is not implemented or is not a function: {0}",

    /**
    * @name ErrorsData.E4012
    */
    E4012: "Custom Store method returns an invalid value: {0}",

    /**
    * @name ErrorsData.E4013
    */
    E4013: "Local Store requires the 'name' configuration option is specified",

    /**
    * @name ErrorsData.E4014
    */
    E4014: "Unknown data type is specified for ODataStore: {0}",

    /**
    * @name ErrorsData.E4015
    */
    E4015: "Unknown entity name or alias is used: {0}",

    /**
    * @name ErrorsData.E4016
    */
    E4016: "The compileSetter(expr) method is called with 'self' passed as a parameter",

    /**
    * @name ErrorsData.E4017
    */
    E4017: "Keys cannot be modified",

    /**
    * @name ErrorsData.E4018
    */
    E4018: "The server has returned a non-numeric value in a response to an item count request",

    /**
    * @name ErrorsData.E4019
    */
    E4019: "Mixing of group operators inside a single group of filter expression is not allowed",

    /**
    * @name ErrorsData.E4020
    */
    E4020: "Unknown store type is detected: {0}",

    /**
    * @name ErrorsData.E4021
    */
    E4021: "The server response does not provide the totalCount value",

    /**
    * @name ErrorsData.E4022
    */
    E4022: "The server response does not provide the groupCount value",

    /**
    * @name ErrorsData.E4023
    */
    E4023: "Could not parse the following XML: {0}",

    /**
    * @name ErrorsData.W4000
    */
    W4000: "Data returned from the server has an incorrect structure",

    /**
    * @name ErrorsData.W4001
    */
    W4001: "The {0} field is listed in both \"keyType\" and \"fieldTypes\". The value of \"fieldTypes\" is used.",

    /**
    * @name ErrorsData.W4002
    */
    W4002: "Data loading has failed for some cells due to the following error: {0}"
});

// todo: add some logic
function handleError(error) {
    var id = "E4000";
    if(error && "__id" in error) {
        id = error.__id;
    }

    errors.log(id, error);
}

/**
* @name Utils.errorHandler
* @type function
* @type_function_param1 e:Error
* @module data/errors
* @export errorHandler
* @namespace DevExpress.data
*/
var errorHandler = null;
var _errorHandler = function(error) {
    ///#DEBUG
    handleError(error);
    ///#ENDDEBUG

    if(handlers.errorHandler) {
        handlers.errorHandler(error);
    }
};

handlers = {
    errors: errors,
    errorHandler: errorHandler,
    _errorHandler: _errorHandler
};

module.exports = handlers;
