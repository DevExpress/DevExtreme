import {
    dxElement
} from '../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from './palette';

import {
    template
} from '../core/templates/template';

import {
    format
} from '../ui/widget/ui.widget';

import {
    BaseLegend,
    BaseLegendItem
} from './common';

import BaseWidget, {
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font
} from './core/base_widget';

/**
* @docid
* @type object
*/
export interface BarGaugeBarInfo {
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}

/**
* @docid
* @type object
* @inherits BaseLegendItem
*/
export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @type BarGaugeBarInfo
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    item?: BarGaugeBarInfo;
}

export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * @docid
     * @type object
     * @inherits BaseGaugeOptions.animation
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: any;
    /**
     * @docid
     * @type string
     * @default '#e0e0e0'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type number
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barSpacing?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid
     * @type number
     * @default 100
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
      * @docid
      * @default 315
      */
      endAngle?: number,
      /**
      * @docid
      * @default 225
      */
      startAngle?: number
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
      * @docid
      * @default undefined
      */
      connectorColor?: string,
      /**
      * @docid
      * @default 2
      */
      connectorWidth?: number,
      /**
      * @docid
      * @type function(barValue)
      * @type_function_param1 barValue:object
      * @type_function_param1_field1 value:Number
      * @type_function_param1_field2 valueText:string
      * @type_function_return string
      * @notUsedInTheme
      */
      customizeText?: ((barValue: { value?: number, valueText?: string }) => string),
      /**
      * @docid
      * @type Font
      * @default 16 [prop](size)
      */
      font?: Font,
      /**
      * @docid
      * @extends CommonVizFormat
      */
      format?: format,
      /**
      * @docid
      * @default 20
      */
      indent?: number,
      /**
      * @docid
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxBarGaugeLegend;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: dxBarGaugeLoadingIndicator;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: dxBarGauge, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: dxBarGauge, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @default 'blend'
     * @type Enums.VizPaletteExtensionMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type number
     * @default 0.3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    relativeInnerRadius?: number;
    /**
     * @docid
     * @type Enums.BarGaugeResolveLabelOverlapping
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * @docid
     * @type number
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxBarGaugeTooltip;
    /**
     * @docid
     * @type Array<number>
     * @default []
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    values?: Array<number>;
}
/**
 * @docid
 * @hidden
 * @inherits BaseLegend
 * @type object
 */
export interface dxBarGaugeLegend extends BaseLegend {
    /**
     * @docid
     * @type function(arg)
     * @type_function_param1 arg:object
     * @type_function_param1_field1 item:BarGaugeBarInfo
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
    /**
     * @docid
     * @type function(items)
     * @type_function_param1 items:Array<BarGaugeLegendItem>
     * @type_function_return Array<BarGaugeLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
    /**
     * @docid
     * @type function(arg)
     * @type_function_param1 arg:object
     * @type_function_param1_field1 item:BarGaugeBarInfo
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemTextFormat?: format;
    /**
     * @docid
     * @type template|function
     * @default undefined
     * @type_function_param1 legendItem:BarGaugeLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetLoadingIndicator
 * @type object
 * @prevFileNamespace DevExpress.viz
 */
export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    /**
    * @docid
    * @hidden
    */
    enabled?: boolean
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @type template|function(scaleValue, element)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 index:number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @default undefined
     * @type function(scaleValue)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 index:number
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @inherits BaseWidget
 * @module viz/bar_gauge
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxBarGauge extends BaseWidget {
    constructor(element: Element, options?: dxBarGaugeOptions)
    constructor(element: JQuery, options?: dxBarGaugeOptions)
    /**
     * @docid
     * @publicName values()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    values(): Array<number>;
    /**
     * @docid
     * @publicName values(newValues)
     * @param1 values:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    values(values: Array<number>): void;
}

declare global {
interface JQuery {
    dxBarGauge(): JQuery;
    dxBarGauge(options: "instance"): dxBarGauge;
    dxBarGauge(options: string): any;
    dxBarGauge(options: string, ...params: any[]): any;
    dxBarGauge(options: dxBarGaugeOptions): JQuery;
}
}
export type Options = dxBarGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = dxBarGaugeOptions;
