import {
    positionConfig
} from '../animation/position';

/**
 * @docid
 * @publicName config()
 * @type method
 * @return globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function config(): globalConfig;

/**
 * @docid
 * @publicName config(config)
 * @param1 config:globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function config(config: globalConfig): void;

/**
* @docid
* @section commonObjectStructures
* @type object
* @namespace DevExpress
* @module core/config
* @export default
*/
export interface globalConfig {
    /**
     * @docid
     * @type string
     * @default "."
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    decimalSeparator?: string;
    /**
     * @docid
     * @default "USD"
     * @type string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    defaultCurrency?: string;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default undefined
     * @prevFileNamespace DevExpress.core
     * @public
     */
    editorStylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.core
     * @public
     */
    floatingActionButtonConfig?: {
      /**
      * @docid
      * @default "close"
      */
      closeIcon?: string,
      /**
      * @docid
      * @type Enums.floatingActionButtonDirection
      * @default "auto"
      */
      direction?: 'auto' | 'up' | 'down',
      /**
      * @docid
      * @default "add"
      */
      icon?: string,
      /**
      * @docid
      * @default ""
      */
      label?: string,
      /**
      * @docid
      * @default 5
      */
      maxSpeedDialActionCount?: number,
      /**
      * @docid
      * @type Enums.PositionAlignment|positionConfig|function
      * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
      */
      position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function,
      /**
      * @docid
      * @default false
      */
      shading?: boolean
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.core
     * @public
     */
    forceIsoDateParsing?: boolean;
    /**
     * @docid
     * @default true
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    oDataFilterToLower?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @default "."
     * @prevFileNamespace DevExpress.core
     * @public
     */
    serverDecimalSeparator?: string;
    /**
     * @docid
     * @type string
     * @default ","
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    thousandsSeparator?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyStoreResult?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyVisibleIndex?: boolean;
}


export default config;
