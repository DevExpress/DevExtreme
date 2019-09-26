/* global DevExpress */

import extendUtils from "./utils/extend";
import errors from "./errors";

/**
* @name globalConfig
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/config
* @export default
*/
const config = {
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
    * @deprecated
    */
    decimalSeparator: ".",
    /**
    * @name globalConfig.thousandsSeparator
    * @type string
    * @default ","
    * @deprecated
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
    useLegacyVisibleIndex: false,

    /**
    * @name globalConfig.floatingActionButtonConfig
    * @type object
    */
    floatingActionButtonConfig: {
        /**
        * @name globalConfig.floatingActionButtonConfig.icon
        * @type string
        * @default "add"
        */
        icon: "add",

        /**
        * @name globalConfig.floatingActionButtonConfig.closeIcon
        * @type string
        * @default "close"
        */
        closeIcon: "close",

        /**
        * @name globalConfig.floatingActionButtonConfig.label
        * @type string
        * @default ""
        */
        label: "",

        /**
        * @name globalConfig.floatingActionButtonConfig.position
        * @type Enums.PositionAlignment|positionConfig|function
        * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
        */
        position: {
            at: "right bottom",
            my: "right bottom",
            offset: {
                x: -16,
                y: -16
            }
        },

        /**
        * @name globalConfig.floatingActionButtonConfig.maxSpeedDialActionCount
        * @type number
        * @default 5
        */
        maxSpeedDialActionCount: 5,

        /**
        * @name globalConfig.floatingActionButtonConfig.shading
        * @type boolean
        * @default false
        */
        shading: false,

        /**
        * @name globalConfig.floatingActionButtonConfig.direction
        * @type Enums.floatingActionButtonDirection
        * @default "auto"
        */
        direction: "auto"
    },

    optionsParser: (optionsString) => {
        if(optionsString.trim().charAt(0) !== "{") {
            optionsString = "{" + optionsString + "}";
        }
        try {
            // eslint-disable-next-line no-new-func
            return (new Function("return " + optionsString))();
        } catch(ex) {
            throw errors.Error("E3018", ex, optionsString);
        }
    }
};

const deprecatedFields = [ "decimalSeparator", "thousandsSeparator" ];

const configMethod = (...args) => {
    if(!args.length) {
        return config;
    }

    const newConfig = args[0];

    deprecatedFields.forEach((deprecatedField) => {
        if(newConfig[deprecatedField]) {
            const message = `Now, the ${deprecatedField} is selected based on the specified locale.`;
            errors.log("W0003", "config", deprecatedField, "19.2", message);
        }
    });

    extendUtils.extend(config, newConfig);
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
