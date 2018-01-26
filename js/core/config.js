"use strict";

var extendUtils = require("./utils/extend"),
    window = require("./utils/window").getWindow();
/**
* @name globalConfig
* @section commonObjectStructures
* @publicName globalConfig
* @type object
* @namespace DevExpress
* @module core/config
* @export default
*/
var config = {
    /**
    * @name globalConfig_rtlEnabled
    * @publicName rtlEnabled
    * @type boolean
    * @default false
    */
    rtlEnabled: false,
    /**
    * @name globalConfig_defaultCurrency
    * @publicName defaultCurrency
    * @default "USD"
    * @type string
    */
    defaultCurrency: "USD",
    designMode: false,
    /**
    * @name globalConfig_serverDecimalSeparator
    * @publicName serverDecimalSeparator
    * @type string
    * @default "."
    */
    serverDecimalSeparator: ".",
    /**
    * @name globalConfig_decimalSeparator
    * @publicName decimalSeparator
    * @type string
    * @default "."
    */
    decimalSeparator: ".",
    /**
    * @name globalConfig_thousandsSeparator
    * @publicName thousandsSeparator
    * @type string
    * @default ","
    */
    thousandsSeparator: ",",
    /**
    * @name globalConfig_forceIsoDateParsing
    * @publicName forceIsoDateParsing
    * @type boolean
    * @default true
    */
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    /**
    * @name globalConfig_useJQuery
    * @publicName useJQuery
    * @type boolean
    * @hidden
    */
    useJQuery: undefined
};

var configMethod = function() {
    if(!arguments.length) {
        return config;
    }

    extendUtils.extend(config, arguments[0]);
};

if(window && window.DevExpress && window.DevExpress.config) {
    configMethod(window.DevExpress.config);
}

/**
 * @name config
 * @publicName config()
 * @type method
 * @return globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 */
/**
 * @name config
 * @publicName config(config)
 * @param1 config:globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 */
module.exports = configMethod;
