import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import {
    format
} from '../../ui/widget/ui.widget';

import BaseWidget, {
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font
} from '../core/base_widget';

export interface BaseGaugeOptions<T = BaseGauge> extends BaseWidgetOptions<T> {
    /**
     * @docid BaseGaugeOptions.animation
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: BaseGaugeAnimation;
    /**
     * @docid BaseGaugeOptions.containerBackgroundColor
     * @type string
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid BaseGaugeOptions.loadingIndicator
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseGaugeLoadingIndicator;
    /**
     * @docid BaseGaugeOptions.onTooltipHidden
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: T, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid BaseGaugeOptions.onTooltipShown
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: T, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid BaseGaugeOptions.rangeContainer
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: BaseGaugeRangeContainer;
    /**
     * @docid BaseGaugeOptions.scale
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: BaseGaugeScale;
    /**
     * @docid BaseGaugeOptions.subvalues
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues?: Array<number>;
    /**
     * @docid BaseGaugeOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseGaugeTooltip;
    /**
     * @docid BaseGaugeOptions.value
     * @type number
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}
export interface BaseGaugeAnimation {
    /**
     * @docid BaseGaugeOptions.animation.duration
     * @type number
     * @default 1000
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    duration?: number;
    /**
     * @docid BaseGaugeOptions.animation.easing
     * @type Enums.VizAnimationEasing
     * @default 'easeOutCubic'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    easing?: 'easeOutCubic' | 'linear';
    /**
     * @docid BaseGaugeOptions.animation.enabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
}
export interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
}
export interface BaseGaugeRangeContainer {
    /**
     * @docid BaseGaugeOptions.rangeContainer.backgroundColor
     * @type string
     * @default '#808080'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseGaugeOptions.rangeContainer.offset
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid BaseGaugeOptions.rangeContainer.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
    /**
     * @docid BaseGaugeOptions.rangeContainer.paletteExtensionMode
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
    /**
     * @docid BaseGaugeOptions.rangeContainer.ranges
     * @type Array<Object>
     * @default []
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ranges?: Array<{ color?: string, endValue?: number, startValue?: number }>;
}
export interface BaseGaugeScale {
    /**
     * @docid BaseGaugeOptions.scale.allowDecimals
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid BaseGaugeOptions.scale.customMinorTicks
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customMinorTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.customTicks
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.endValue
     * @type number
     * @default 100
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number;
    /**
     * @docid BaseGaugeOptions.scale.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: BaseGaugeScaleLabel;
    /**
     * @docid BaseGaugeOptions.scale.minorTick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseGaugeOptions.scale.minorTickInterval
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number;
    /**
     * @docid BaseGaugeOptions.scale.scaleDivisionFactor
     * @type number
     * @default 17
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid BaseGaugeOptions.scale.startValue
     * @type number
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number;
    /**
     * @docid BaseGaugeOptions.scale.tick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseGaugeOptions.scale.tickInterval
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number;
}
export interface BaseGaugeScaleLabel {
    /**
     * @docid BaseGaugeOptions.scale.label.customizeText
     * @type function(scaleValue)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((scaleValue: { value?: number, valueText?: string }) => string);
    /**
     * @docid BaseGaugeOptions.scale.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseGaugeOptions.scale.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid BaseGaugeOptions.scale.label.overlappingBehavior
     * @type Enums.ScaleLabelOverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'hide' | 'none';
    /**
     * @docid BaseGaugeOptions.scale.label.useRangeColors
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useRangeColors?: boolean;
    /**
     * @docid BaseGaugeOptions.scale.label.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface BaseGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseGaugeOptions.tooltip.contentTemplate
     * @type template|function(scaleValue, element)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid BaseGaugeOptions.tooltip.customizeTooltip
     * @default undefined
     * @type function(scaleValue)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
}
/**
 * @docid BaseGauge
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export type BaseGauge = dxBaseGauge;
export class dxBaseGauge extends BaseWidget {
    constructor(element: Element, options?: BaseGaugeOptions)
    constructor(element: JQuery, options?: BaseGaugeOptions)
    /**
     * @docid BaseGaugeMethods.subvalues
     * @publicName subvalues()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues(): Array<number>;
    /**
     * @docid BaseGaugeMethods.subvalues
     * @publicName subvalues(subvalues)
     * @param1 subvalues:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues(subvalues: Array<number>): void;
    /**
     * @docid BaseGaugeMethods.value
     * @publicName value()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value(): number;
    /**
     * @docid BaseGaugeMethods.value
     * @publicName value(value)
     * @param1 value:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value(value: number): void;
}

export interface CommonIndicator {
    /**
     * @docid CommonIndicator.arrowLength
     * @type number
     * @default 5
     * @propertyOf circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid CommonIndicator.backgroundColor
     * @type string
     * @default 'none'
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid CommonIndicator.baseValue
     * @type number
     * @default undefined
     * @notUsedInTheme
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid CommonIndicator.beginAdaptingAtRadius
     * @type number
     * @default 50
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    beginAdaptingAtRadius?: number;
    /**
     * @docid CommonIndicator.color
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid CommonIndicator.horizontalOrientation
     * @type Enums.HorizontalEdge
     * @default 'right' [for](value_indicators)
     * @default 'left' [for](subvalue_indicators)
     * @propertyOf linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'left' | 'right';
    /**
     * @docid CommonIndicator.indentFromCenter
     * @type number
     * @default 0
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromCenter?: number;
    /**
     * @docid CommonIndicator.length
     * @type number
     * @default 15
     * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid CommonIndicator.offset
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid CommonIndicator.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
    /**
     * @docid CommonIndicator.secondColor
     * @type string
     * @default '#E18E92'
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondColor?: string;
    /**
     * @docid CommonIndicator.secondFraction
     * @type number
     * @default 0.4
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondFraction?: number;
    /**
     * @docid CommonIndicator.size
     * @type number
     * @default 10
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid CommonIndicator.spindleGapSize
     * @type number
     * @default 10
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleGapSize?: number;
    /**
     * @docid CommonIndicator.spindleSize
     * @type number
     * @default 14
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleSize?: number;
    /**
     * @docid CommonIndicator.text
     * @type object
     * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: { customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string), font?: Font, format?: format, indent?: number };
    /**
     * @docid CommonIndicator.verticalOrientation
     * @type Enums.VerticalEdge
     * @default 'bottom' [for](value_indicators)
     * @default 'top' [for](subvalue_indicators)
     * @propertyOf linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'top';
    /**
     * @docid CommonIndicator.width
     * @type number
     * @default 2
     * @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}

export interface GaugeIndicator extends CommonIndicator {
    /**
     * @docid GaugeIndicator.type
     * @type string
     * @acceptValues 'circle'|'rangeBar'|'rectangle'|'rectangleNeedle'|'rhombus'|'textCloud'|'triangleMarker'|'triangleNeedle'|'twoColorNeedle'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';
}
