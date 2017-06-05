"use strict";

var $ = require("jquery"),
    config = {
        rtlEnabled: false,
        defaultCurrency: "USD",
        designMode: false,
        serverDecimalSeparator: ".",
        forceIsoDateParsing: false,
        wrapActionsBeforeExecute: false
    };

/**
 * @name config
 * @publicName config()
 * @type method
 * @return object
 * @module core/config
 * @export default
 */
/**
 * @name config
 * @publicName config(config)
 * @param1 config:object
 * @module core/config
 * @export default
 */
module.exports = function() {
    if(!arguments.length) {
        return config;
    }

    $.extend(config, arguments[0]);
};
