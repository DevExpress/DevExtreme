/* global DevExpress */

var extendUtils = require("./utils/extend");
/**
* @name globalConfig
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/config
* @export default
*/
var config = {
    /**
    * @name globalConfig.rtlEnabled
    * @type boolean
    * @default false
    */
    rtlEnabled: false,
    /**
    * @name globalConfig.defaultCurrency
    * @default "USD"
    * @type string
    */
    defaultCurrency: "USD",
    /**
    * @name globalConfig.oDataFilterToLower
    * @default true
    * @type boolean
    */
    oDataFilterToLower: true,
    designMode: false,
    /**
    * @name globalConfig.serverDecimalSeparator
    * @type string
    * @default "."
    */
    serverDecimalSeparator: ".",
    /**
    * @name globalConfig.decimalSeparator
    * @type string
    * @default "."
    */
    decimalSeparator: ".",
    /**
    * @name globalConfig.thousandsSeparator
    * @type string
    * @default ","
    */
    thousandsSeparator: ",",
    /**
    * @name globalConfig.forceIsoDateParsing
    * @type boolean
    * @default true
    */
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    /**
    * @name globalConfig.useLegacyStoreResult
    * @type boolean
    * @default false
    */
    useLegacyStoreResult: false,
    /**
    * @name globalConfig.useJQuery
    * @type boolean
    * @hidden
    */
    useJQuery: undefined,
    /**
    * @name globalConfig.editorStylingMode
    * @type Enums.EditorStylingMode
    * @default undefined
    */
    editorStylingMode: undefined,
    /**
    * @name globalConfig.useLegacyVisibleIndex
    * @type boolean
    * @default false
    */
    useLegacyVisibleIndex: false
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
