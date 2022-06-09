import {
    PositionConfig,
} from '../animation/position';

import {
  FloatingActionButtonDirection,
} from '../types/enums';

import {
    PositionAlignment,
    EditorStyle,
} from '../common';

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
     * @type boolean
     * @default true
     * @public
     */
    defaultUseCurrencyAccountingStyle?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    editorStylingMode?: EditorStyle;
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
       * @default "auto"
       */
      direction?: FloatingActionButtonDirection;
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
       * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
       */
      position?: PositionAlignment | PositionConfig | Function;
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
