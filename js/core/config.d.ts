import {
    positionConfig
} from '../animation/position';

/**
 * @docid config
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
 * @docid config
 * @publicName config(config)
 * @param1 config:globalConfig
 * @namespace DevExpress
 * @module core/config
 * @export default
 * @prevFileNamespace DevExpress.core
 * @public
 */
declare function config(config: globalConfig): void;

export interface globalConfig {
    /**
     * @docid globalConfig.decimalSeparator
     * @type string
     * @default "."
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    decimalSeparator?: string;
    /**
     * @docid globalConfig.defaultCurrency
     * @default "USD"
     * @type string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    defaultCurrency?: string;
    /**
     * @docid globalConfig.editorStylingMode
     * @type Enums.EditorStylingMode
     * @default undefined
     * @prevFileNamespace DevExpress.core
     * @public
     */
    editorStylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * @docid globalConfig.floatingActionButtonConfig
     * @type object
     * @prevFileNamespace DevExpress.core
     * @public
     */
    floatingActionButtonConfig?: { closeIcon?: string, direction?: 'auto' | 'up' | 'down', icon?: string, label?: string, maxSpeedDialActionCount?: number, position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function, shading?: boolean };
    /**
     * @docid globalConfig.forceIsoDateParsing
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.core
     * @public
     */
    forceIsoDateParsing?: boolean;
    /**
     * @docid globalConfig.oDataFilterToLower
     * @default true
     * @type boolean
     * @prevFileNamespace DevExpress.core
     * @public
     */
    oDataFilterToLower?: boolean;
    /**
     * @docid globalConfig.rtlEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid globalConfig.serverDecimalSeparator
     * @type string
     * @default "."
     * @prevFileNamespace DevExpress.core
     * @public
     */
    serverDecimalSeparator?: string;
    /**
     * @docid globalConfig.thousandsSeparator
     * @type string
     * @default ","
     * @deprecated
     * @prevFileNamespace DevExpress.core
     * @public
     */
    thousandsSeparator?: string;
    /**
     * @docid globalConfig.useLegacyStoreResult
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyStoreResult?: boolean;
    /**
     * @docid globalConfig.useLegacyVisibleIndex
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    useLegacyVisibleIndex?: boolean;
}


export default config;
