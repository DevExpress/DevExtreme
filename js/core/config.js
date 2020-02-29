/* global DevExpress */

import extendUtils from './utils/extend';
import errors from './errors';

/**
* @name globalConfig
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/config
* @export default
*/
const config = {
    rtlEnabled: false,
    defaultCurrency: 'USD',
    oDataFilterToLower: true,
    serverDecimalSeparator: '.',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    useLegacyStoreResult: false,
    /**
    * @name globalConfig.useJQuery
    * @type boolean
    * @hidden
    */
    useJQuery: undefined,
    editorStylingMode: undefined,
    useLegacyVisibleIndex: false,

    floatingActionButtonConfig: {
        /**
        * @name globalConfig.floatingActionButtonConfig.icon
        * @type string
        * @default "add"
        */
        icon: 'add',

        /**
        * @name globalConfig.floatingActionButtonConfig.closeIcon
        * @type string
        * @default "close"
        */
        closeIcon: 'close',

        /**
        * @name globalConfig.floatingActionButtonConfig.label
        * @type string
        * @default ""
        */
        label: '',

        /**
        * @name globalConfig.floatingActionButtonConfig.position
        * @type Enums.PositionAlignment|positionConfig|function
        * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
        */
        position: {
            at: 'right bottom',
            my: 'right bottom',
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
        direction: 'auto'
    },

    optionsParser: (optionsString) => {
        if(optionsString.trim().charAt(0) !== '{') {
            optionsString = '{' + optionsString + '}';
        }
        try {
            // eslint-disable-next-line no-new-func
            return (new Function('return ' + optionsString))();
        } catch(ex) {
            throw errors.Error('E3018', ex, optionsString);
        }
    }
};

const deprecatedFields = [ 'decimalSeparator', 'thousandsSeparator' ];

const configMethod = (...args) => {
    if(!args.length) {
        return config;
    }

    const newConfig = args[0];

    deprecatedFields.forEach((deprecatedField) => {
        if(newConfig[deprecatedField]) {
            const message = `Now, the ${deprecatedField} is selected based on the specified locale.`;
            errors.log('W0003', 'config', deprecatedField, '19.2', message);
        }
    });

    extendUtils.extend(config, newConfig);
};

if(typeof DevExpress !== 'undefined' && DevExpress.config) {
    configMethod(DevExpress.config);
}

module.exports = configMethod;
