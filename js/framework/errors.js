"use strict";

var errorUtils = require("../core/utils/error"),
    errors = require("../core/errors");

/**
* @docid
* @name Errors and Warnings
* @publicName Errors and Warnings
*/
module.exports = errorUtils(errors.ERROR_MESSAGES, {

    /**
    * @name Errors and Warnings_E3001
    * @publicName E3001
    */
    E3001: "Routing rule is not found for the '{0}' URI.",

    /**
    * @name Errors and Warnings_E3002
    * @publicName E3002
    */
    E3002: "The passed object cannot be formatted into a URI string by the application's router. An appropriate route should be registered.",

    /**
    * @name Errors and Warnings_E3003
    * @publicName E3003
    */
    E3003: "Unable to navigate. Application is being initialized.",

    /**
    * @name Errors and Warnings_E3004
    * @publicName E3004
    */
    E3004: "Cannot execute the command: {0}.",

    /**
    * @name Errors and Warnings_E3005
    * @publicName E3005
    */
    E3005: "The '{0}' command {1} is not registered in the application's command mapping. Go to http://dxpr.es/1bTjfj1 for more details.",

    /**
    * @name Errors and Warnings_E3006
    * @publicName E3006
    */
    E3006: "Unknown navigation target: '{0}'. Use the 'current', 'back' or 'blank' values.",

    /**
    * @name Errors and Warnings_E3007
    * @publicName E3007
    */
    E3007: "Error while restoring the application state. The state has been cleared. Refresh the page.",

    /**
    * @name Errors and Warnings_E3008
    * @publicName E3008
    */
    E3008: "Unable to go back.",

    /**
    * @name Errors and Warnings_E3009
    * @publicName E3009
    */
    E3009: "Unable to go forward.",

    /**
    * @name Errors and Warnings_E3010
    * @publicName E3010
    */
    E3010: "The command's 'id' option should be specified.\r\nProcessed markup: {0}\n",

    /**
    * @name Errors and Warnings_E3011
    * @publicName E3011
    */
    E3011: "Layout controller cannot be resolved. There are no appropriate layout controllers for the current context. Check browser console for details.",

    /**
    * @name Errors and Warnings_E3012
    * @publicName E3012
    */
    E3012: "Layout controller cannot be resolved. Two or more layout controllers suit the current context. Check browser console for details.",

    /**
    * @name Errors and Warnings_E3013
    * @publicName E3013
    */
    E3013: "The '{0}' template with the '{1}' name is not found. Make sure the case is correct in the specified view name and the template fits the current context.",


    /**
    * @name Errors and Warnings_E3014
    * @publicName E3014
    */
    E3014: "All the children of the dxView element should be either of the dxCommand or dxContent type.\r\nProcessed markup: {0}",

    /**
    * @name Errors and Warnings_E3015
    * @publicName E3015
    */
    E3015: "The 'exec' method should be called before the 'finalize' method.",

    /**
    * @name Errors and Warnings_E3016
    * @publicName E3016
    */
    E3016: "Unknown transition type '{0}'.",

    /**
    * @name Errors and Warnings_E3018
    * @publicName E3018
    */
    E3018: "Unable to parse options.\nMessage: {0};\nOptions value: {1}.",

    /**
    * @name Errors and Warnings_E3019
    * @publicName E3019
    */
    E3019: "View templates should be updated according to the 13.1 changes. Go to http://dxpr.es/15ikrJA for more details.",

    /**
    * @name Errors and Warnings_E3020
    * @publicName E3020
    */
    E3020: "Concurrent templates are found:\r\n{0}Target device:\r\n{1}.",

    /**
    * @name Errors and Warnings_E3021
    * @publicName E3021
    */
    E3021: "Remote template cannot be loaded.\r\nUrl:{0}\r\nError:{1}.",

    /**
    * @name Errors and Warnings_E3022
    * @publicName E3022
    */
    E3022: "Cannot initialize the HtmlApplication component.",

    /**
    * @name Errors and Warnings_E3023
    * @publicName E3023
    */
    E3023: "Navigation item is not found",

    /**
    * @name Errors and Warnings_E3024
    * @publicName E3024
    */
    E3024: "Layout controller is not initialized",

    /**
    * @name Errors and Warnings_W3001
    * @publicName W3001
    */
    W3001: "A view with the '{0}' key doesn't exist.",

    /**
    * @name Errors and Warnings_W3002
    * @publicName W3002
    */
    W3002: "A view with the '{0}' key has already been released.",

    /**
    * @name Errors and Warnings_W3003
    * @publicName W3003
    */
    W3003: "Layout resolving context:\n{0}\nAvailable layout controller registrations:\n{1}\n",

    /**
    * @name Errors and Warnings_W3004
    * @publicName W3004
    */
    W3004: "Layout resolving context:\n{0}\nConcurent layout controller registrations for the context:\n{1}\n",

    /**
    * @name Errors and Warnings_W3005
    * @publicName W3005
    */
    W3005: "Direct hash-based navigation is detected in a mobile application. Use data-bind=\"dxAction: url\" instead of href=\"#url\" to avoid navigation issues.\nFound markup:\n{0}\n"

});
