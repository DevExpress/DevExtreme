import {
    TElement
} from '../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from './palette';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    Cancelable,
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import {
    dxChartCommonSeriesSettings
} from './chart';

import {
    ChartSeries,
    ScaleBreak,
    VizRange,
    TimeIntervalType
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    ComponentFileSavingEvent,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

/** @public */
export type DisposingEvent = ComponentEvent<dxRangeSelector>;

/** @public */
export type DrawnEvent = ComponentEvent<dxRangeSelector>;

/** @public */
export type ExportedEvent = ComponentEvent<dxRangeSelector>;

/** @public */
export type ExportingEvent = ComponentEvent<dxRangeSelector> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & ComponentFileSavingEvent<dxRangeSelector>;

/** @public */
export type IncidentOccurredEvent = ComponentEvent<dxRangeSelector> & IncidentInfo;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxRangeSelector>;

/** @public */
export type OptionChangedEvent = ComponentEvent<dxRangeSelector> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = ComponentNativeEvent<dxRangeSelector> & {
  readonly value: Array<number | string | Date>,
  readonly previousValue: Array<number | string | Date>,
}

export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    background?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#C0BAE1'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      image?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type Enums.BackgroundImageLocation
         * @default 'full'
         */
        location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop',
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        url?: string
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    behavior?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      allowSlidersSwap?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      animationEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.ValueChangedCallMode
       * @default 'onMovingComplete'
       */
      callValueChanged?: 'onMoving' | 'onMovingComplete',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      manualRangeSelectionEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      moveSelectedRangeByClick?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      snapToTicks?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    chart?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.3
       * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
       */
      barGroupPadding?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
       */
      barGroupWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      bottomIndent?: number,
      /**
       * @docid
       * @type dxChartOptions.commonSeriesSettings
       * @prevFileNamespace DevExpress.viz
       */
      commonSeriesSettings?: dxChartCommonSeriesSettings,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      dataPrepareSettings?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        checkTypeForAllData?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default true
         */
        convertToAxisDataType?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type_function_param1 a:object
         * @type_function_param1_field1 arg:Date|Number|string
         * @type_function_param1_field2 val:Date|Number|string
         * @type_function_param2 b:object
         * @type_function_param2_field1 arg:Date|Number|string
         * @type_function_param2_field2 val:Date|Number|string
         * @type_function_return Number
         * @default true
         */
        sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number)
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.2
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      maxBubbleSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 12
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      minBubbleSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      negativesAsZeroes?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @extends CommonVizPalette
       * @type Array<string>|Enums.VizPalette
       */
      palette?: Array<string> | PaletteType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VizPaletteExtensionMode
       * @default 'blend'
       */
      paletteExtensionMode?: PaletteExtensionModeType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type ChartSeries|Array<ChartSeries>
       * @default undefined
       * @notUsedInTheme
       */
      series?: ChartSeries | Array<ChartSeries>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      seriesTemplate?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type_function_param1 seriesName:any
         * @type_function_return ChartSeries
         */
        customizeSeries?: ((seriesName: any) => ChartSeries),
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 'series'
         */
        nameField?: string
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.1
       */
      topIndent?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      valueAxis?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        inverted?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 10
         */
        logarithmBase?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        max?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        min?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type Enums.RangeSelectorChartAxisScaleType
         * @default undefined
         */
        type?: 'continuous' | 'logarithmic',
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type Enums.ChartDataType
         * @default undefined
         */
        valueType?: 'datetime' | 'numeric' | 'string'
      }
    };
    /**
     * @docid
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSource?: Array<any> | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataSourceField?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indent?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @notUsedInTheme
       */
      left?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @notUsedInTheme
       */
      right?: number
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxRangeSelector
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:Array<number,string,Date>
     * @type_function_param1_field5 previousValue:Array<number,string,Date>
     * @type_function_param1_field6 event:event
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scale?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      aggregateByCategory?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      aggregationGroupWidth?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      aggregationInterval?: number | any | TimeIntervalType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      allowDecimals?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      breakStyle?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default "#ababab"
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type Enums.ScaleBreakLineStyle
         * @default "waved"
         */
        line?: 'straight' | 'waved',
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 5
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits ScaleBreak
       * @default undefined
       * @notUsedInTheme
       */
      breaks?: Array<ScaleBreak>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      categories?: Array<number | string | Date>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      endOnTick?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @notUsedInTheme
       */
      endValue?: number | Date | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      holidays?: Array<Date | string> | Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      label?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @type_function_param1 scaleValue:object
         * @type_function_param1_field1 value:Date|Number|string
         * @type_function_param1_field2 valueText:string
         * @type_function_return string
         * @notUsedInTheme
         */
        customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string),
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#767676' [prop](color)
         * @default 11 [prop](size)
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
         * @type Enums.ScaleLabelOverlappingBehavior
         * @default "hide"
         */
        overlappingBehavior?: 'hide' | 'none',
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 7
         */
        topIndent?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default true
         */
        visible?: boolean
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      linearThreshold?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      logarithmBase?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      marker?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         */
        label?: {
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @type_function_param1 markerValue:object
           * @type_function_param1_field1 value:Date|Number
           * @type_function_param1_field2 valueText:string
           * @type_function_return string
           * @notUsedInTheme
           */
          customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string),
          /**
           * @docid
           * @prevFileNamespace DevExpress.viz
           * @extends CommonVizFormat
           */
          format?: format
        },
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 33
         */
        separatorHeight?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 7
         */
        textLeftIndent?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 11
         */
        textTopIndent?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 10
         */
        topIndent?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default true
         */
        visible?: boolean
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      maxRange?: number | any | TimeIntervalType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      minRange?: number | any | TimeIntervalType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      minorTick?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#000000'
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0.06
         */
        opacity?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default true
         */
        visible?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      minorTickCount?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      minorTickInterval?: number | any | TimeIntervalType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      placeholderHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      showCustomBoundaryTicks?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      singleWorkdays?: Array<Date | string> | Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @notUsedInTheme
       */
      startValue?: number | Date | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      tick?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#000000'
         */
        color?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0.1
         */
        opacity?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      tickInterval?: number | any | TimeIntervalType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.RangeSelectorAxisScaleType
       * @default undefined
       */
      type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.ChartDataType
       * @default undefined
       */
      valueType?: 'datetime' | 'numeric' | 'string',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default [1, 2, 3, 4, 5]
       */
      workWeek?: Array<number>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      workdaysOnly?: boolean
    };
    /**
     * @docid
     * @default "#606060"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectedRangeColor?: string;
    /**
     * @docid
     * @type Enums.VisualRangeUpdateMode
     * @default "reset"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shutter?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.75
       */
      opacity?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sliderHandle?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#000000'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0.2
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sliderMarker?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#9B9B9B'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type_function_param1 scaleValue:object
       * @type_function_param1_field1 value:Date|Number|string
       * @type_function_param1_field2 valueText:string
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string),
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#FFFFFF' [prop](color)
       * @default 14 [prop](size)
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
       * @default 'red'
       */
      invalidRangeColor?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 4
       */
      paddingLeftRight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      paddingTopBottom?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @notUsedInTheme
       */
      placeholderHeight?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @hidden
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * @docid
     * @fires dxRangeSelectorOptions.onValueChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: Array<number | string | Date> | VizRange;
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/range_selector
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxRangeSelector extends BaseWidget {
    constructor(element: TElement, options?: dxRangeSelectorOptions)
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getValue()
     * @return Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValue(): Array<number | string | Date>;
    render(): void;
    /**
     * @docid
     * @publicName render(skipChartAnimation)
     * @param1 skipChartAnimation:boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    render(skipChartAnimation: boolean): void;
    /**
     * @docid
     * @publicName setValue(value)
     * @param1 value:Array<number,string,Date> | VizRange
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    setValue(value: Array<number | string | Date> | VizRange): void;
}

export type Options = dxRangeSelectorOptions;

/** @deprecated use Options instead */
export type IOptions = dxRangeSelectorOptions;
