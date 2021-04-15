import {
    positionConfig
} from '../animation/position';

/**
 * @docid
 * @publicName config()
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
 * @namespace DevExpress
 * @module core/config
 * @export default
 * @type object
 */
export interface globalConfig {
    /**
     * @docid
     * @default "."
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    decimalSeparator?: string;
    /**
     * @docid
     * @default "USD"
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
     * @prevFileNamespace DevExpress.core
     * @public
     */
    floatingActionButtonConfig?: {
      /**
       * @docid
       * @default "close"
       * @prevFileNamespace DevExpress.core
       */
      closeIcon?: string,
      /**
       * @docid
       * @type Enums.floatingActionButtonDirection
       * @default "auto"
       * @prevFileNamespace DevExpress.core
       */
      direction?: 'auto' | 'up' | 'down',
      /**
       * @docid
       * @default "add"
       * @prevFileNamespace DevExpress.core
       */
      icon?: string,
      /**
       * @docid
       * @default ""
       * @prevFileNamespace DevExpress.core
       */
      label?: string,
      /**
       * @docid
       * @default 5
       * @prevFileNamespace DevExpress.core
       */
      maxSpeedDialActionCount?: number,
      /**
       * @docid
       * @type Enums.PositionAlignment|positionConfig|function
       * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
       * @prevFileNamespace DevExpress.core
       */
      position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function,
      /**
       * @docid
       * @default false
       * @prevFileNamespace DevExpress.core
       */
      shading?: boolean
    };
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.core
     * @public
     */
    forceIsoDateParsing?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.core
     * @public
     */
    oDataFilterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default "."
     * @prevFileNamespace DevExpress.core
     * @public
     */
    serverDecimalSeparator?: string;
    /**
     * @docid
     * @default ","
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    thousandsSeparator?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyStoreResult?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyVisibleIndex?: boolean;
}


export default config;
