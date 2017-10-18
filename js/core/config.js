"use strict";

var extendUtils = require("./utils/extend");
/**
* @name globalConfig
* @section commonObjectStructures
* @publicName GlobalConfig
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
    */
    useJQuery: true
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
 * @return GlobalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 */
/**
 * @name config
 * @publicName config(config)
 * @param1 config:GlobalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 */
module.exports = configMethod;
