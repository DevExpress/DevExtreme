import {
    dxElement
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    animation?: BaseGaugeAnimation;
    /**
     * @docid
     * @type string
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    loadingIndicator?: BaseGaugeLoadingIndicator;
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
    onTooltipHidden?: ((e: { component?: T, element?: dxElement, model?: any, target?: any }) => any);
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
    onTooltipShown?: ((e: { component?: T, element?: dxElement, model?: any, target?: any }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rangeContainer?: BaseGaugeRangeContainer;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: BaseGaugeScale;
    /**
     * @docid
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    subvalues?: Array<number>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: BaseGaugeTooltip;
    /**
     * @docid
     * @type number
     * @default undefined
     * @notUsedInTheme
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @hidden
 */
export interface BaseGaugeAnimation {
    /**
     * @docid
     * @type number
     * @default 1000
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    duration?: number;
    /**
     * @docid
     * @type Enums.VizAnimationEasing
     * @default 'easeOutCubic'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    easing?: 'easeOutCubic' | 'linear';
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    enabled?: boolean;
}

/**
 * @docid
 * @inherits BaseWidgetLoadingIndicator
 * @hidden
 * @type object
 * @prevFileNamespace DevExpress.viz
 */
export interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator { 
    /**
    * @docid
    * @hidden
    */
    enabled?: boolean;
}
/**
 * @docid
 * @hidden
 */
export interface BaseGaugeRangeContainer {
    /**
     * @docid
     * @type string
     * @default '#808080'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type number
     * @default 0
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
     * @type Enums.VizPaletteExtensionMode
     * @default 'blend'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * @docid
     * @type Array<Object>
     * @default []
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ranges?: Array<{
      /**
       * @docid
       */
      color?: string,
      /**
       * @docid
       */
      endValue?: number,
      /**
       * @docid
       */
      startValue?: number
    }>;
}
/**
 * @docid
 * @hidden
 */
export interface BaseGaugeScale {
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customMinorTicks?: Array<number>;
    /**
     * @docid
     * @type Array<number>
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customTicks?: Array<number>;
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: BaseGaugeScaleLabel;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: {
      /**
       * @docid
       * @type string
       * @default '#FFFFFF'
       */
      color?: string,
      /**
       * @docid
       * @type number
       * @default 3
       */
      length?: number,
      /**
       * @docid
       * @type number
       * @default 1
       */
      opacity?: number,
      /**
       * @docid
       * @type boolean
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @type number
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number;
    /**
     * @docid
     * @type number
     * @default 17
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scaleDivisionFactor?: number;
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: {
      /**
       * @docid
       * @type string
       * @default '#FFFFFF'
       */
      color?: string,
      /**
       * @docid
       * @type number
       * @default 5
       */
      length?: number,
      /**
       * @docid
       * @type number
       * @default 1
       */
      opacity?: number,
      /**
       * @docid
       * @type boolean
       * @default true
       */
      visible?: boolean,
      /**
       * @docid
       * @type number
       * @default 2
       */
      width?: number
    };
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number;
}
/**
 * @docid
 * @hidden
 */
export interface BaseGaugeScaleLabel {
    /**
     * @docid
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
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid
     * @type Enums.ScaleLabelOverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'hide' | 'none';
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useRangeColors?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidgetTooltip
 * @type object
 */
export interface BaseGaugeTooltip extends BaseWidgetTooltip {
    /**
     * @docid
     * @type template|function(scaleValue, element)
     * @type_function_param1 scaleValue:object
     * @type_function_param1_field1 value:Number
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    contentTemplate?: template | ((scaleValue: { value?: number, valueText?: string }, element: dxElement) => string | Element | JQuery);
    /**
     * @docid
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
 * @type object
 * @hidden
 * @inherits BaseWidget
 * @prevFileNamespace DevExpress.viz
 */
export class BaseGauge extends BaseWidget {
    constructor(element: Element, options?: BaseGaugeOptions)
    constructor(element: JQuery, options?: BaseGaugeOptions)
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
     * @type number
     * @default 5
     * @propertyOf circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    arrowLength?: number;
    /**
     * @docid
     * @type string
     * @default 'none'
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @notUsedInTheme
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    baseValue?: number;
    /**
     * @docid
     * @type number
     * @default 50
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    beginAdaptingAtRadius?: number;
    /**
     * @docid
     * @type string
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
     * @type number
     * @default 0
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromCenter?: number;
    /**
     * @docid
     * @type number
     * @default 15
     * @propertyOf circularTriangleMarker,linearRectangle,linearCircle,linearRhombus,linearTriangleMarker
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid
     * @type number
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
     * @type string
     * @default '#E18E92'
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondColor?: string;
    /**
     * @docid
     * @type number
     * @default 0.4
     * @propertyOf circularTwoColorNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    secondFraction?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @propertyOf circularRangeBar,linearRangeBar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleGapSize?: number;
    /**
     * @docid
     * @type number
     * @default 14
     * @propertyOf circularTwoColorNeedle,circularRectangleNeedle,circularTriangleNeedle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    spindleSize?: number;
    /**
     * @docid
     * @type object
     * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: {
      /**
      * @docid
      * @type function(indicatedValue)
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
      * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
      * @type Font
      * @default 14 [prop](size)
      */
      font?: Font,
      /**
      * @docid
      * @extends CommonVizFormat
      * @propertyOf circularRangeBar,linearRangeBar,circularTextCloud,linearTextCloud
      */
      format?: format,
      /**
      * @docid
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
     * @type number
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
