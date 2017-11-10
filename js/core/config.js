"use strict";

var extendUtils = require("./utils/extend"),
    config = {
        rtlEnabled: false,
        defaultCurrency: "USD",
        designMode: false,
        serverDecimalSeparator: ".",
        forceIsoDateParsing: true,
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

    extendUtils.extend(config, arguments[0]);
};
