import {
    dxElement
} from '../core/element';

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

export interface BarGaugeBarInfo {
    /**
     * @docid BarGaugeBarInfo.color
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid BarGaugeBarInfo.index
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    index?: number;
    /**
     * @docid BarGaugeBarInfo.value
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}

export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * @docid BarGaugeLegendItem.item
     * @type BarGaugeBarInfo
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    item?: BarGaugeBarInfo;
}

export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * @docid dxBarGaugeOptions.animation
     * @type object
     * @inherits BaseGaugeOptions.animation
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: any;
    /**
     * @docid dxBarGaugeOptions.backgroundColor
     * @type string
     * @default '#e0e0e0'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxBarGaugeOptions.barSpacing
     * @type number
     * @default 4
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barSpacing?: number;
    /**
     * @docid dxBarGaugeOptions.baseValue
     * @type number
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid dxBarGaugeOptions.endValue
     * @type number
     * @default 100
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number;
    /**
     * @docid dxBarGaugeOptions.geometry
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    geometry?: { endAngle?: number, startAngle?: number };
    /**
     * @docid dxBarGaugeOptions.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value?: number, valueText?: string }) => string), font?: Font, format?: format, indent?: number, visible?: boolean };
    /**
     * @docid dxBarGaugeOptions.legend
     * @inherits BaseLegend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxBarGaugeLegend;
    /**
     * @docid dxBarGaugeOptions.loadingIndicator
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: dxBarGaugeLoadingIndicator;
    /**
     * @docid dxBarGaugeOptions.onTooltipHidden
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
     * @docid dxBarGaugeOptions.onTooltipShown
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
     * @docid dxBarGaugeOptions.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
    /**
     * @docid dxBarGaugeOptions.paletteExtensionMode
     * @default 'blend'
     * @type Enums.VizPaletteExtensionMode
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
    /**
     * @docid dxBarGaugeOptions.relativeInnerRadius
     * @type number
     * @default 0.3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    relativeInnerRadius?: number;
    /**
     * @docid dxBarGaugeOptions.resolveLabelOverlapping
     * @type Enums.BarGaugeResolveLabelOverlapping
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * @docid dxBarGaugeOptions.startValue
     * @type number
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number;
    /**
     * @docid dxBarGaugeOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxBarGaugeTooltip;
    /**
     * @docid dxBarGaugeOptions.values
     * @type Array<number>
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
     * @docid dxBarGaugeOptions.legend.customizeItems
     * @type function(items)
     * @type_function_param1 items:Array<BarGaugeLegendItem>
     * @type_function_return Array<BarGaugeLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
    /**
     * @docid dxBarGaugeOptions.legend.customizeText
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
     * @docid dxBarGaugeOptions.legend.itemTextFormat
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemTextFormat?: format;
    /**
     * @docid dxBarGaugeOptions.legend.markerTemplate
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
     * @docid dxBarGaugeOptions.legend.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
}
export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid dxBarGaugeOptions.tooltip.contentTemplate
     * @type template|function(scaleValue, element)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 index:number
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid dxBarGaugeOptions.tooltip.customizeTooltip
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
}
/**
 * @docid dxBarGauge
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
     * @docid dxbargaugemethods.values
     * @publicName values()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    values(): Array<number>;
    /**
     * @docid dxbargaugemethods.values
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