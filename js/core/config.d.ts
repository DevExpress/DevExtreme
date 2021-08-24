import {
    PositionConfig,
} from '../animation/position';

import {
  PositionAlignment,
  EditorStylingMode,
  floatingActionButtonDirection,
} from '../docEnums';

/**
 * @docid
 * @publicName config()
 * @return globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
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
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
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
     * @default undefined
     * @public
     */
    editorStylingMode?: EditorStylingMode;
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
      direction?: floatingActionButtonDirection;
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
