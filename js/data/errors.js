"use strict";

var errorUtils = require("../core/utils/error"),
    coreErrors = require("../core/errors"),
    handlers = {};

/**
* @docid
* @name Errors and Warnings
* @publicName Errors and Warnings
*/
var errors = errorUtils(coreErrors.ERROR_MESSAGES, {

    /**
    * @name Errors and Warnings_E4000
    * @publicName E4000
    */
    E4000: "[DevExpress.data]: {0}",

    /**
      * @name Errors and Warnings_E4001
      * @publicName E4001
      */
    E4001: "Unknown aggregating function is detected: '{0}'",

    /**
    * @name Errors and Warnings_E4002
    * @publicName E4002
    */
    E4002: "Unsupported OData protocol version is used",

    /**
    * @name Errors and Warnings_E4003
    * @publicName E4003
    */
    E4003: "Unknown filter operation is used: {0}",

    /**
    * @name Errors and Warnings_E4004
    * @publicName E4004
    */
    E4004: "The thenby() method is called before the sortby() method",

    /**
    * @name Errors and Warnings_E4005
    * @publicName E4005
    */
    E4005: "Store requires a key expression for this operation",

    /**
    * @name Errors and Warnings_E4006
    * @publicName E4006
    */
    E4006: "ArrayStore 'data' option must be an array",

    /**
    * @name Errors and Warnings_E4007
    * @publicName E4007
    */
    E4007: "Compound keys cannot be auto-generated",

    /**
    * @name Errors and Warnings_E4008
    * @publicName E4008
    */
    E4008: "Attempt to insert an item with the a duplicated key",

    /**
    * @name Errors and Warnings_E4009
    * @publicName E4009
    */
    E4009: "Data item cannot be found",

    /**
    * @name Errors and Warnings_E4010
    * @publicName E4010
    */
    E4010: "CustomStore does not support creating queries",

    /**
    * @name Errors and Warnings_E4011
    * @publicName E4011
    */
    E4011: "Custom Store method is not implemented or is not a function: {0}",

    /**
    * @name Errors and Warnings_E4012
    * @publicName E4012
    */
    E4012: "Custom Store method returns an invalid value: {0}",

    /**
    * @name Errors and Warnings_E4013
    * @publicName E4013
    */
    E4013: "Local Store requires the 'name' configuration option is specified",

    /**
    * @name Errors and Warnings_E4014
    * @publicName E4014
    */
    E4014: "Unknown key type is detected: {0}",

    /**
    * @name Errors and Warnings_E4015
    * @publicName E4015
    */
    E4015: "Unknown entity name or alias is used: {0}",

    /**
    * @name Errors and Warnings_E4017
    * @publicName E4017
    */
    E4017: "Keys cannot be modified",

    /**
    * @name Errors and Warnings_E4018
    * @publicName E4018
    */
    E4018: "The server has returned a non-numeric value in a response to an item count request",

    /**
    * @name Errors and Warnings_E4019
    * @publicName E4019
    */
    E4019: "Mixing of group operators inside a single group of filter expression is not allowed",

    /**
    * @name Errors and Warnings_E4020
    * @publicName E4020
    */
    E4020: "Unknown store type is detected: {0}",

    /**
    * @name Errors and Warnings_E4021
    * @publicName E4021
    */
    E4021: "The server response does not provide the totalCount value",

    /**
    * @name Errors and Warnings_E4022
    * @publicName E4022
    */
    E4022: "The server response does not provide the groupCount value",

    /**
    * @name Errors and Warnings_W4000
    * @publicName W4000
    */
    W4000: "Data returned from the server has an incorrect structure",

    /**
    * @name Errors and Warnings_W4002
    * @publicName W4002
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
* @name Utils_errorHandler
* @publicName errorHandler
* @type function
* @module data/errors
* @export errorHandler
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
