"use strict";

/* global DevExpress */

var extendUtils = require("./utils/extend");
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
    * @name globalConfig.rtlEnabled
    * @publicName rtlEnabled
    * @type boolean
    * @default false
    */
    rtlEnabled: false,
    /**
    * @name globalConfig.defaultCurrency
    * @publicName defaultCurrency
    * @default "USD"
    * @type string
    */
    defaultCurrency: "USD",
    designMode: false,
    /**
    * @name globalConfig.serverDecimalSeparator
    * @publicName serverDecimalSeparator
    * @type string
    * @default "."
    */
    serverDecimalSeparator: ".",
    /**
    * @name globalConfig.decimalSeparator
    * @publicName decimalSeparator
    * @type string
    * @default "."
    */
    decimalSeparator: ".",
    /**
    * @name globalConfig.thousandsSeparator
    * @publicName thousandsSeparator
    * @type string
    * @default ","
    */
    thousandsSeparator: ",",
    /**
    * @name globalConfig.forceIsoDateParsing
    * @publicName forceIsoDateParsing
    * @type boolean
    * @default true
    */
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    /**
    * @name globalConfig.useJQuery
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

if(typeof DevExpress !== "undefined" && DevExpress.config) {
    configMethod(DevExpress.config);
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
