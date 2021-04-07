import {
    TElement
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}

/**
* @docid
* @inherits BaseLegendItem
* @type object
*/
export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    item?: BarGaugeBarInfo;
}
/**
 * @public
 */
export interface TooltipEvent {
    component?: dxBarGauge,
    element?: TElement,
    model?: any,
    target?: any
}
export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * @docid
     * @inherits BaseGaugeOptions.animation
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: any;
    /**
     * @docid
     * @default '#e0e0e0'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barSpacing?: number;
    /**
     * @docid
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid
     * @default 100
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 315
      */
      endAngle?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 225
      */
      startAngle?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default undefined
      */
      connectorColor?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 2
      */
      connectorWidth?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type_function_param1 barValue:object
      * @type_function_param1_field1 value:Number
      * @type_function_param1_field2 valueText:string
      * @type_function_return string
      * @notUsedInTheme
      */
      customizeText?: ((barValue: { value?: number, valueText?: string }) => string),
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 16 [prop](size)
      */
      font?: Font,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @extends CommonVizFormat
      */
      format?: format,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 20
      */
      indent?: number,
    /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default true
      */
      visible?: boolean
    };
    /**
     * @docid
     * @inherits BaseLegend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxBarGaugeLegend;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: dxBarGaugeLoadingIndicator;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxBarGauge
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: TooltipEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxBarGauge
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: TooltipEvent) => void);
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
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxBarGaugeTooltip;
    /**
     * @docid
     * @default []
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    values?: Array<number>;
}
export interface dxBarGaugeLegend extends BaseLegend {
    /**
     * @docid dxBarGaugeOptions.legend.customizeHint
     * @type_function_param1 arg:object
     * @type_function_param1_field1 item:BarGaugeBarInfo
     * @type_function_param1_field2 text:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
    /**
     * @docid dxBarGaugeOptions.legend.customizeItems
     * @type_function_param1 items:Array<BarGaugeLegendItem>
     * @type_function_return Array<BarGaugeLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
    /**
     * @docid dxBarGaugeOptions.legend.customizeText
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
     * @docid dxBarGaugeOptions.legend.itemTextFormat
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemTextFormat?: format;
    /**
     * @docid dxBarGaugeOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:BarGaugeLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | TElement<SVGElement>);
    /**
     * @docid dxBarGaugeOptions.legend.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    /**
    * @docid dxBarGaugeOptions.loadingIndicator.enabled
    * @prevFileNamespace DevExpress.viz
    * @hidden
    */
    enabled?: boolean
}
export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxBarGaugeOptions.tooltip.contentTemplate
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
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: TElement) => string | TElement);
    /**
     * @docid dxBarGaugeOptions.tooltip.customizeTooltip
     * @default undefined
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
     * @docid dxBarGaugeOptions.tooltip.interactive
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
    constructor(element: TElement, options?: dxBarGaugeOptions)
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

export type Options = dxBarGaugeOptions;

/** @deprecated use Options instead */
export type IOptions = dxBarGaugeOptions;
