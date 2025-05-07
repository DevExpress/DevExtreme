import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
    HorizontalEdge,
    VerticalEdge,
} from '../../common';

import {
    EventInfo,
} from '../../common/core/events';

import {
    Format,
} from '../../common/core/localization';

import BaseWidget, {
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTooltip,
} from '../core/base_widget';

import {
    AnimationEaseMode,
    Palette,
    PaletteExtensionMode,
    LabelOverlap,
    ChartsColor,
    Font,
} from '../../common/charts';

/**
 * @docid _viz_base_gauge_TooltipInfo
 * @hidden
 */
export interface TooltipInfo {
    /**
     * @docid _viz_base_gauge_TooltipInfo.target
     * @type object
     */
    target: any;
}

/**
 * @namespace DevExpress.viz
 * @docid
 * @hidden
 */
export interface BaseGaugeOptions<TComponent> extends BaseWidgetOptions<TComponent> {
    /**
     * @docid
     * @type object
     * @public
     */
    animation?: BaseGaugeAnimation;
    /**
     * @docid
     * @default 'none'
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type object
     * @public
     */
    loadingIndicator?: BaseGaugeLoadingIndicator;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field target:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field target:object
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: EventInfo<TComponent> & TooltipInfo) => void);
    /**
     * @docid
     * @type object
     * @public
     */
    rangeContainer?: BaseGaugeRangeContainer;
    /**
     * @docid
     * @type object
     * @public
     */
    scale?: BaseGaugeScale;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    subvalues?: Array<number>;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: BaseGaugeTooltip;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    value?: number | undefined;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeAnimation {
    /**
     * @docid BaseGaugeOptions.animation.duration
     * @default 1000
     * @public
     */
    duration?: number;
    /**
     * @docid BaseGaugeOptions.animation.easing
     * @default 'easeOutCubic'
     * @public
     */
    easing?: AnimationEaseMode;
    /**
     * @docid BaseGaugeOptions.animation.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    /**
     * @docid BaseGaugeOptions.loadingIndicator.enabled
     * @hidden
     */
    enabled?: boolean;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeRangeContainer {
    /**
     * @docid BaseGaugeOptions.rangeContainer.backgroundColor
     * @default '#808080'
     * @public
     */
    backgroundColor?: string | ChartsColor;
    /**
     * @docid BaseGaugeOptions.rangeContainer.offset
     * @default 0
     * @public
     */
    offset?: number;
    /**
     * @docid BaseGaugeOptions.rangeContainer.palette
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid BaseGaugeOptions.rangeContainer.paletteExtensionMode
     * @default 'blend'
     * @public
     */
    paletteExtensionMode?: PaletteExtensionMode;
    /**
     * @docid BaseGaugeOptions.rangeContainer.ranges
     * @default []
     * @notUsedInTheme
     * @public
     */
    ranges?: Array<{
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.color
       */
      color?: string | ChartsColor;
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.endValue
       */
      endValue?: number;
      /**
       * @docid BaseGaugeOptions.rangeContainer.ranges.startValue
       */
      startValue?: number;
    }>;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeScale {
    /**
     * @docid BaseGaugeOptions.scale.allowDecimals
     * @default undefined
     * @public
     */
    allowDecimals?: boolean | undefined;
    /**
     * @docid BaseGaugeOptions.scale.customMinorTicks
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customMinorTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.customTicks
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customTicks?: Array<number>;
    /**
     * @docid BaseGaugeOptions.scale.endValue
     * @default 100
     * @notUsedInTheme
     * @public
     */
    endValue?: number;
    /**
     * @docid BaseGaugeOptions.scale.label
     * @type object
     * @public
     */
    label?: BaseGaugeScaleLabel;
    /**
     * @docid BaseGaugeOptions.scale.minorTick
     * @public
     */
    minorTick?: {
      /**
       * @docid BaseGaugeOptions.scale.minorTick.color
       * @default '#FFFFFF'
       */
      color?: string;
      /**
       * @docid BaseGaugeOptions.scale.minorTick.length
       * @default 3
       */
      length?: number;
      /**
       * @docid BaseGaugeOptions.scale.minorTick.opacity
       * @default 1
       */
      opacity?: number;
      /**
       * @docid BaseGaugeOptions.scale.minorTick.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid BaseGaugeOptions.scale.minorTick.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid BaseGaugeOptions.scale.minorTickInterval
     * @default undefined
     * @public
     */
    minorTickInterval?: number | undefined;
    /**
     * @docid BaseGaugeOptions.scale.scaleDivisionFactor
     * @default 17
     * @public
     */
    scaleDivisionFactor?: number;
    /**
     * @docid BaseGaugeOptions.scale.startValue
     * @default 0
     * @notUsedInTheme
     * @public
     */
    startValue?: number;
    /**
     * @docid BaseGaugeOptions.scale.tick
     * @public
     */
    tick?: {
      /**
       * @docid BaseGaugeOptions.scale.tick.color
       * @default '#FFFFFF'
       */
      color?: string;
      /**
       * @docid BaseGaugeOptions.scale.tick.length
       * @default 5
       */
      length?: number;
      /**
       * @docid BaseGaugeOptions.scale.tick.opacity
       * @default 1
       */
      opacity?: number;
      /**
       * @docid BaseGaugeOptions.scale.tick.visible
       * @default true
       */
      visible?: boolean;
      /**
       * @docid BaseGaugeOptions.scale.tick.width
       * @default 2
       */
      width?: number;
    };
    /**
     * @docid BaseGaugeOptions.scale.tickInterval
     * @default undefined
     * @public
     */
    tickInterval?: number | undefined;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeScaleLabel {
    /**
     * @docid BaseGaugeOptions.scale.label.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((scaleValue: { value?: number; valueText?: string }) => string);
    /**
     * @docid BaseGaugeOptions.scale.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid BaseGaugeOptions.scale.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
    /**
     * @docid BaseGaugeOptions.scale.label.overlappingBehavior
     * @default 'hide'
     * @public
     */
    overlappingBehavior?: LabelOverlap;
    /**
     * @docid BaseGaugeOptions.scale.label.useRangeColors
     * @default false
     * @public
     */
    useRangeColors?: boolean;
    /**
     * @docid BaseGaugeOptions.scale.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseGaugeOptions.tooltip.contentTemplate
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number; valueText?: string }, element: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * @docid BaseGaugeOptions.tooltip.customizeTooltip
     * @default undefined
     * @type_function_return object
     * @public
     */
    customizeTooltip?: ((scaleValue: { value?: number; valueText?: string }) => any) | undefined;
    /**
     * @docid BaseGaugeOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @namespace DevExpress.viz
 * @options BaseGaugeOptions
 */
export class BaseGauge<TProperties> extends BaseWidget<TProperties> {
    /**
     * @docid
     * @publicName subvalues()
     * @public
     */
    subvalues(): Array<number>;
    /**
     * @docid
     * @publicName subvalues(subvalues)
     * @public
     */
    subvalues(subvalues: Array<number>): void;
    /**
     * @docid
     * @publicName value()
     * @public
     */
    value(): number;
    /**
     * @docid
     * @publicName value(value)
     * @public
     */
    value(value: number): void;
}

/**
 * @docid
 * @section CommonIndicators
 * @type object
 * @namespace DevExpress.viz
 * @hidden
 */
export interface CommonIndicator {
    /**
     * @docid
     * @default 5
     * @propertyOf circularTextCloud,linearTextCloud
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @default 'none'
     * @propertyOf circularRangeBar,linearRangeBar
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @propertyOf circularRangeBar,linearRangeBar
     * @public
     */
    baseValue?: number | undefined;
    /**
     * @docid
     * @default 50
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @public
     */
    beginAdaptingAtRadius?: number;
    /**
     * @docid
     * @public
     */
    color?: string | ChartsColor;
    /**
     * @docid
     * @default 'right' &for(value_indicators)
     * @default 'left' &for(subvalue_indicators)
     * @propertyOf linearRangeBar
     * @public
     */
    horizontalOrientation?: HorizontalEdge;
    /**
     * @docid
     * @default 0
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @public
     */
    indentFromCenter?: number;
    /**
     * @docid
     * @default 15
     * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
     * @public
     */
    length?: number;
    /**
     * @docid
     * @public
     */
    offset?: number;
    /**
     * @docid
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid
     * @default '#E18E92'
     * @propertyOf circularTwoColorNeedle
     * @public
     */
    secondColor?: string;
    /**
     * @docid
     * @default 0.4
     * @propertyOf circularTwoColorNeedle
     * @public
     */
    secondFraction?: number;
    /**
     * @docid
     * @default 10
     * @propertyOf circularRangeBar,linearRangeBar
     * @public
     */
    size?: number;
    /**
     * @docid
     * @default 10
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @public
     */
    spindleGapSize?: number;
    /**
     * @docid
     * @default 14
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @public
     */
    spindleSize?: number;
    /**
     * @docid
     * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
     * @public
     */
    text?: {
      /**
       * @docid
       * @notUsedInTheme
       * @default undefined
       * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
       */
      customizeText?: ((indicatedValue: { value?: number; valueText?: string }) => string) | undefined;
      /**
       * @docid
       * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
       * @default 14 &prop(size)
       */
      font?: Font;
      /**
       * @docid
       * @default undefined
       * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
       */
      format?: Format | undefined;
      /**
       * @docid
       * @default 0
       * @propertyOf circularRangeBar,linearRangeBar
       */
      indent?: number;
    };
    /**
     * @docid
     * @default 'bottom' &for(value_indicators)
     * @default 'top' &for(subvalue_indicators)
     * @propertyOf linearRangeBar
     * @public
     */
    verticalOrientation?: VerticalEdge;
    /**
     * @docid
     * @default 2
     * @propertyOf circularTriangleMarker,circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle,linearRectangle,linearTriangleMarker,linearRhombus
     * @public
     */
    width?: number;
}
/** @public */
export type GaugeIndicatorType = 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';

/**
 * @docid
 * @inherits CommonIndicator
 * @namespace DevExpress.viz
 * @hidden
 */
export interface GaugeIndicator extends CommonIndicator {
    /**
     * @docid
     * @type string
     * @acceptValues 'circle'|'rangeBar'|'rectangle'|'rectangleNeedle'|'rhombus'|'textCloud'|'triangleMarker'|'triangleNeedle'|'twoColorNeedle'
     * @public
     */
    type?: GaugeIndicatorType;
}
