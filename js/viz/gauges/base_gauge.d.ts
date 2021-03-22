import {
    TElement
} from '../../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from '../palette';

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
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: BaseGaugeAnimation;
    /**
     * @docid
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseGaugeLoadingIndicator;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipHidden?: ((e: { component?: T, element?: TElement, model?: any, target?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:object
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onTooltipShown?: ((e: { component?: T, element?: TElement, model?: any, target?: any }) => void);
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: BaseGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: BaseGaugeScale;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues?: Array<number>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseGaugeTooltip;
    /**
     * @docid
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
}
export interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    /**
    * @docid BaseGaugeOptions.loadingIndicator.enabled
    * @prevFileNamespace DevExpress.viz
    * @hidden
    */
    enabled?: boolean;
}
export interface BaseGaugeRangeContainer {
    /**
     * @docid BaseGaugeOptions.rangeContainer.backgroundColor
     * @default '#808080'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseGaugeOptions.rangeContainer.offset
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
    /**
     * @docid BaseGaugeOptions.rangeContainer.palette
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid BaseGaugeOptions.rangeContainer.paletteExtensionMode
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid BaseGaugeOptions.rangeContainer.ranges
     * @default []
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ranges?: Array<{
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.color
       * @prevFileNamespace DevExpress.viz
       *
       */
      color?: string,
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.endValue
       * @prevFileNamespace DevExpress.viz
       */
      endValue?: number,
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.startValue
       * @prevFileNamespace DevExpress.viz
       */
      startValue?: number
    }>;
}
export interface BaseGaugeScale {
    /**
     * @docid BaseGaugeOptions.scale.allowDecimals
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid BaseGaugeOptions.scale.customMinorTicks
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customMinorTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.customTicks
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.endValue
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: {
      /**
       * @docid BaseGaugeOptions.scale.minorTick.color
       * @prevFileNamespace DevExpress.viz
       * @default '#FFFFFF'
       */
      color?: string,
    /**
       * @docid BaseGaugeOptions.scale.minorTick.length
       * @prevFileNamespace DevExpress.viz
       * @default 3
       */
      length?: number,
      /**
       * @docid BaseGaugeOptions.scale.minorTick.opacity
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      opacity?: number,
      /**
       * @docid BaseGaugeOptions.scale.minorTick.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      visible?: boolean,
      /**
       * @docid BaseGaugeOptions.scale.minorTick.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid BaseGaugeOptions.scale.minorTickInterval
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number;
    /**
     * @docid BaseGaugeOptions.scale.scaleDivisionFactor
     * @default 17
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid BaseGaugeOptions.scale.startValue
     * @default 0
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number;
    /**
     * @docid BaseGaugeOptions.scale.tick
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: {
    /**
       * @docid BaseGaugeOptions.scale.tick.color
       * @prevFileNamespace DevExpress.viz
       * @default '#FFFFFF'
       */
      color?: string,
      /**
       * @docid BaseGaugeOptions.scale.tick.length
       * @prevFileNamespace DevExpress.viz
       * @default 5
       */
      length?: number,
      /**
       * @docid BaseGaugeOptions.scale.tick.opacity
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      opacity?: number,
      /**
       * @docid BaseGaugeOptions.scale.tick.visible
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid BaseGaugeOptions.scale.tick.width
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      width?: number
    };
    /**
     * @docid BaseGaugeOptions.scale.tickInterval
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number;
}
export interface BaseGaugeScaleLabel {
    /**
     * @docid BaseGaugeOptions.scale.label.customizeText
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
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useRangeColors?: boolean;
    /**
     * @docid BaseGaugeOptions.scale.label.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface BaseGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseGaugeOptions.tooltip.contentTemplate
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string }, element: TElement) => string | TElement);
    /**
     * @docid BaseGaugeOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_return object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
    /**
     * @docid BaseGaugeOptions.tooltip.interactive
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export class BaseGauge extends BaseWidget {
    constructor(element: TElement, options?: BaseGaugeOptions)
    /**
     * @docid
     * @publicName subvalues()
     * @return Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues(): Array<number>;
    /**
     * @docid
     * @publicName subvalues(subvalues)
     * @param1 subvalues:Array<number>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues(subvalues: Array<number>): void;
    /**
     * @docid
     * @publicName value()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value(): number;
    /**
     * @docid
     * @publicName value(value)
     * @param1 value:number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value(value: number): void;
}

/**
* @docid
* @section CommonIndicators
* @type object
* @hidden
*/
export interface CommonIndicator {
    /**
     * @docid
     * @default 5
     * @propertyOf circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @default 'none'
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid
     * @default 50
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    beginAdaptingAtRadius?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.HorizontalEdge
     * @default 'right' [for](value_indicators)
     * @default 'left' [for](subvalue_indicators)
     * @propertyOf linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalOrientation?: 'left' | 'right';
    /**
     * @docid
     * @default 0
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromCenter?: number;
    /**
     * @docid
     * @default 15
     * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    offset?: number;
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
     * @default '#E18E92'
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondColor?: string;
    /**
     * @docid
     * @default 0.4
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondFraction?: number;
    /**
     * @docid
     * @default 10
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid
     * @default 10
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleGapSize?: number;
    /**
     * @docid
     * @default 14
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleSize?: number;
    /**
     * @docid
     * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @type_function_param1 indicatedValue:object
      * @type_function_param1_field1 value:Number
      * @type_function_param1_field2 valueText:string
      * @type_function_return string
      * @notUsedInTheme
      * @default undefined
      * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
      */
      customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string),
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
      * @default 14 [prop](size)
      */
      font?: Font,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @extends CommonVizFormat
      * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
      */
      format?: format,
      /**
      * @docid
      * @prevFileNamespace DevExpress.viz
      * @default 0
      * @propertyOf circularRangeBar,linearRangeBar
      */
      indent?: number
    };
    /**
     * @docid
     * @type Enums.VerticalEdge
     * @default 'bottom' [for](value_indicators)
     * @default 'top' [for](subvalue_indicators)
     * @propertyOf linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalOrientation?: 'bottom' | 'top';
    /**
     * @docid
     * @default 2
     * @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export type GaugeIndicatorType = 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';

/**
 * @docid
 * @inherits CommonIndicator
 * @hidden
 */
export interface GaugeIndicator extends CommonIndicator {
    /**
     * @docid
     * @type string
     * @acceptValues 'circle'|'rangeBar'|'rectangle'|'rectangleNeedle'|'rhombus'|'textCloud'|'triangleMarker'|'triangleNeedle'|'twoColorNeedle'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: GaugeIndicatorType;
}
