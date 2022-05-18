import {
    PositionConfig,
} from '../animation/position';

/**
 * @docid
 * @publicName config()
 * @namespace DevExpress
 * @public
 */
declare function config(): globalConfig;

/**
 * @docid
 * @publicName config(config)
 * @namespace DevExpress
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
declare function config(config: globalConfig): void;

/**
 * @docid
 * @section commonObjectStructures
 * @namespace DevExpress
 * @type object
 */
export interface globalConfig {
    /**
     * @docid
     * @default "."
     * @deprecated
     * @public
     */
    decimalSeparator?: string;
    /**
     * @docid
     * @default "USD"
     * @public
     */
    defaultCurrency?: string;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default undefined
     * @public
     */
    editorStylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid
     * @public
     */
    floatingActionButtonConfig?: {
      /**
       * @docid
       * @default "close"
       */
      closeIcon?: string;
      /**
       * @docid
       * @type Enums.floatingActionButtonDirection
       * @default "auto"
       */
      direction?: 'auto' | 'up' | 'down';
      /**
       * @docid
       * @default "add"
       */
      icon?: string;
      /**
       * @docid
       * @default ""
       */
      label?: string;
      /**
       * @docid
       * @default 5
       */
      maxSpeedDialActionCount?: number;
      /**
       * @docid
       * @type Enums.PositionAlignment|PositionConfig|function
       * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
       */
      position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | PositionConfig | Function;
      /**
       * @docid
       * @default false
       */
      shading?: boolean;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    forceIsoDateParsing?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @public
     */
    defaultUseCurrencyAccountingStyle?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    oDataFilterToLower?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default "."
     * @public
     */
    serverDecimalSeparator?: string;
    /**
     * @docid
     * @default ","
     * @deprecated
     * @public
     */
    thousandsSeparator?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    useLegacyStoreResult?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    useLegacyVisibleIndex?: boolean;
}

export default config;
