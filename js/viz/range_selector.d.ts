import {
    UserDefinedElement
} from '../core/element';

import {
    PaletteType,
    PaletteExtensionModeType
} from './palette';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
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
    VizTimeInterval
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

/** @public */
export type DisposingEvent = EventInfo<dxRangeSelector>;

/** @public */
export type DrawnEvent = EventInfo<dxRangeSelector>;

/** @public */
export type ExportedEvent = EventInfo<dxRangeSelector>;

/** @public */
export type ExportingEvent = EventInfo<dxRangeSelector> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxRangeSelector>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxRangeSelector> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxRangeSelector>;

/** @public */
export type OptionChangedEvent = EventInfo<dxRangeSelector> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxRangeSelector> & {
  readonly value: Array<number | string | Date>,
  readonly previousValue: Array<number | string | Date>,
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
    /**
     * @docid
     * @public
     */
    background?: {
      /**
       * @docid
       * @default '#C0BAE1'
       */
      color?: string,
      /**
       * @docid
       */
      image?: {
        /**
         * @docid
         * @type Enums.BackgroundImageLocation
         * @default 'full'
         */
        location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop',
        /**
         * @docid
         * @default undefined
         */
        url?: string
      },
      /**
       * @docid
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @public
     */
    behavior?: {
      /**
       * @docid
       * @default true
       */
      allowSlidersSwap?: boolean,
      /**
       * @docid
       * @default true
       */
      animationEnabled?: boolean,
      /**
       * @docid
       * @type Enums.ValueChangedCallMode
       * @default 'onMovingComplete'
       */
      callValueChanged?: 'onMoving' | 'onMovingComplete',
      /**
       * @docid
       * @default true
       */
      manualRangeSelectionEnabled?: boolean,
      /**
       * @docid
       * @default true
       */
      moveSelectedRangeByClick?: boolean,
      /**
       * @docid
       * @default true
       */
      snapToTicks?: boolean
    };
    /**
     * @docid
     * @public
     */
    chart?: {
      /**
       * @docid
       * @default 0.3
       * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
       */
      barGroupPadding?: number,
      /**
       * @docid
       * @default undefined
       * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
       */
      barGroupWidth?: number,
      /**
       * @docid
       * @default 0
       */
      bottomIndent?: number,
      /**
       * @docid
       * @type dxChartOptions.commonSeriesSettings
       */
      commonSeriesSettings?: dxChartCommonSeriesSettings,
      /**
       * @docid
       */
      dataPrepareSettings?: {
        /**
         * @docid
         * @default false
         */
        checkTypeForAllData?: boolean,
        /**
         * @docid
         * @default true
         */
        convertToAxisDataType?: boolean,
        /**
         * @docid
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
       * @default 0.2
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      maxBubbleSize?: number,
      /**
       * @docid
       * @default 12
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      minBubbleSize?: number,
      /**
       * @docid
       * @default false
       */
      negativesAsZeroes?: boolean,
      /**
       * @docid
       * @extends CommonVizPalette
       * @type Array<string>|Enums.VizPalette
       */
      palette?: Array<string> | PaletteType,
      /**
       * @docid
       * @type Enums.VizPaletteExtensionMode
       * @default 'blend'
       */
      paletteExtensionMode?: PaletteExtensionModeType,
      /**
       * @docid
       * @type ChartSeries|Array<ChartSeries>
       * @default undefined
       * @notUsedInTheme
       */
      series?: ChartSeries | Array<ChartSeries>,
      /**
       * @docid
       * @default undefined
       */
      seriesTemplate?: {
        /**
         * @docid
         * @type_function_param1 seriesName:any
         * @type_function_return ChartSeries
         */
        customizeSeries?: ((seriesName: any) => ChartSeries),
        /**
         * @docid
         * @default 'series'
         */
        nameField?: string
      },
      /**
       * @docid
       * @default 0.1
       */
      topIndent?: number,
      /**
       * @docid
       */
      valueAxis?: {
        /**
         * @docid
         * @default false
         */
        inverted?: boolean,
        /**
         * @docid
         * @default 10
         */
        logarithmBase?: number,
        /**
         * @docid
         * @default undefined
         */
        max?: number,
        /**
         * @docid
         * @default undefined
         */
        min?: number,
        /**
         * @docid
         * @type Enums.RangeSelectorChartAxisScaleType
         * @default undefined
         */
        type?: 'continuous' | 'logarithmic',
        /**
         * @docid
         * @type Enums.ChartDataType
         * @default undefined
         */
        valueType?: 'datetime' | 'numeric' | 'string'
      }
    };
    /**
     * @docid
     * @default '#FFFFFF'
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @extends CommonVizDataSource
     * @public
     */
    dataSource?: Array<any> | Store | DataSource | DataSourceOptions | string;
    /**
     * @docid
     * @default 'arg'
     * @public
     */
    dataSourceField?: string;
    /**
     * @docid
     * @public
     */
    indent?: {
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      left?: number,
      /**
       * @docid
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
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:Array<number,string,Date>
     * @type_function_param1_field5 previousValue:Array<number,string,Date>
     * @type_function_param1_field6 event:event
     * @notUsedInTheme
     * @action
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @public
     */
    scale?: {
      /**
       * @docid
       * @default false
       */
      aggregateByCategory?: boolean,
      /**
       * @docid
       * @default undefined
       */
      aggregationGroupWidth?: number,
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      aggregationInterval?: VizTimeInterval,
      /**
       * @docid
       * @default undefined
       */
      allowDecimals?: boolean,
      /**
       * @docid
       */
      breakStyle?: {
        /**
         * @docid
         * @default "#ababab"
         */
        color?: string,
        /**
         * @docid
         * @type Enums.ScaleBreakLineStyle
         * @default "waved"
         */
        line?: 'straight' | 'waved',
        /**
         * @docid
         * @default 5
         */
        width?: number
      },
      /**
       * @docid
       * @inherits ScaleBreak
       * @default undefined
       * @notUsedInTheme
       */
      breaks?: Array<ScaleBreak>,
      /**
       * @docid
       */
      categories?: Array<number | string | Date>,
      /**
       * @docid
       * @default false
       */
      endOnTick?: boolean,
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      endValue?: number | Date | string,
      /**
       * @docid
       * @default undefined
       */
      holidays?: Array<Date | string> | Array<number>,
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @type_function_param1 scaleValue:object
         * @type_function_param1_field1 value:Date|Number|string
         * @type_function_param1_field2 valueText:string
         * @type_function_return string
         * @notUsedInTheme
         */
        customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string),
        /**
         * @docid
         * @default '#767676' [prop](color)
         * @default 11 [prop](size)
         */
        font?: Font,
        /**
         * @docid
         * @extends CommonVizFormat
         */
        format?: format,
        /**
         * @docid
         * @type Enums.ScaleLabelOverlappingBehavior
         * @default "hide"
         */
        overlappingBehavior?: 'hide' | 'none',
        /**
         * @docid
         * @default 7
         */
        topIndent?: number,
        /**
         * @docid
         * @default true
         */
        visible?: boolean
      },
      /**
       * @docid
       * @default 0
       */
      linearThreshold?: number,
      /**
       * @docid
       * @default 10
       */
      logarithmBase?: number,
      /**
       * @docid
       */
      marker?: {
        /**
         * @docid
         */
        label?: {
          /**
           * @docid
           * @type_function_param1 markerValue:object
           * @type_function_param1_field1 value:Date|Number
           * @type_function_param1_field2 valueText:string
           * @type_function_return string
           * @notUsedInTheme
           */
          customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string),
          /**
           * @docid
           * @extends CommonVizFormat
           */
          format?: format
        },
        /**
         * @docid
         * @default 33
         */
        separatorHeight?: number,
        /**
         * @docid
         * @default 7
         */
        textLeftIndent?: number,
        /**
         * @docid
         * @default 11
         */
        textTopIndent?: number,
        /**
         * @docid
         * @default 10
         */
        topIndent?: number,
        /**
         * @docid
         * @default true
         */
        visible?: boolean
      },
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      maxRange?: VizTimeInterval,
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      minRange?: VizTimeInterval,
      /**
       * @docid
       */
      minorTick?: {
        /**
         * @docid
         * @default '#000000'
         */
        color?: string,
        /**
         * @docid
         * @default 0.06
         */
        opacity?: number,
        /**
         * @docid
         * @default true
         */
        visible?: boolean,
        /**
         * @docid
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @default undefined
       */
      minorTickCount?: number,
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      minorTickInterval?: VizTimeInterval,
      /**
       * @docid
       * @default undefined
       */
      placeholderHeight?: number,
      /**
       * @docid
       * @default true
       */
      showCustomBoundaryTicks?: boolean,
      /**
       * @docid
       * @default undefined
       */
      singleWorkdays?: Array<Date | string> | Array<number>,
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      startValue?: number | Date | string,
      /**
       * @docid
       */
      tick?: {
        /**
         * @docid
         * @default '#000000'
         */
        color?: string,
        /**
         * @docid
         * @default 0.1
         */
        opacity?: number,
        /**
         * @docid
         * @default 1
         */
        width?: number
      },
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.VizTimeInterval
       */
      tickInterval?: VizTimeInterval,
      /**
       * @docid
       * @type Enums.RangeSelectorAxisScaleType
       * @default undefined
       */
      type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete',
      /**
       * @docid
       * @type Enums.ChartDataType
       * @default undefined
       */
      valueType?: 'datetime' | 'numeric' | 'string',
      /**
       * @docid
       * @default [1, 2, 3, 4, 5]
       */
      workWeek?: Array<number>,
      /**
       * @docid
       * @default false
       */
      workdaysOnly?: boolean
    };
    /**
     * @docid
     * @default "#606060"
     * @public
     */
    selectedRangeColor?: string;
    /**
     * @docid
     * @type Enums.VisualRangeUpdateMode
     * @default "reset"
     * @public
     */
    selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid
     * @public
     */
    shutter?: {
      /**
       * @docid
       * @default undefined
       */
      color?: string,
      /**
       * @docid
       * @default 0.75
       */
      opacity?: number
    };
    /**
     * @docid
     * @public
     */
    sliderHandle?: {
      /**
       * @docid
       * @default '#000000'
       */
      color?: string,
      /**
       * @docid
       * @default 0.2
       */
      opacity?: number,
      /**
       * @docid
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @public
     */
    sliderMarker?: {
      /**
       * @docid
       * @default '#9B9B9B'
       */
      color?: string,
      /**
       * @docid
       * @type_function_param1 scaleValue:object
       * @type_function_param1_field1 value:Date|Number|string
       * @type_function_param1_field2 valueText:string
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string),
      /**
       * @docid
       * @default '#FFFFFF' [prop](color)
       * @default 14 [prop](size)
       */
      font?: Font,
      /**
       * @docid
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid
       * @default 'red'
       */
      invalidRangeColor?: string,
      /**
       * @docid
       * @default 4
       */
      paddingLeftRight?: number,
      /**
       * @docid
       * @default 2
       */
      paddingTopBottom?: number,
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      placeholderHeight?: number,
      /**
       * @docid
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @type object
     * @hidden
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * @docid
     * @fires dxRangeSelectorOptions.onValueChanged
     * @notUsedInTheme
     * @public
     */
    value?: Array<number | string | Date> | VizRange;
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @module viz/range_selector
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxRangeSelector extends BaseWidget {
    constructor(element: UserDefinedElement, options?: dxRangeSelectorOptions)
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getValue()
     * @return Array<number,string,Date>
     * @public
     */
    getValue(): Array<number | string | Date>;
    render(): void;
    /**
     * @docid
     * @publicName render(skipChartAnimation)
     * @param1 skipChartAnimation:boolean
     * @public
     */
    render(skipChartAnimation: boolean): void;
    /**
     * @docid
     * @publicName setValue(value)
     * @param1 value:Array<number,string,Date> | VizRange
     * @public
     */
    setValue(value: Array<number | string | Date> | VizRange): void;
}

/** @public */
export type Properties = dxRangeSelectorOptions;

/** @deprecated use Properties instead */
export type Options = dxRangeSelectorOptions;

/** @deprecated use Properties instead */
export type IOptions = dxRangeSelectorOptions;
