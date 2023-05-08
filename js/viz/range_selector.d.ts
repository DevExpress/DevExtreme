import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
  Format,
} from '../localization';

import {
    dxChartCommonSeriesSettings,
} from './chart';

import {
    ChartSeries,
} from './common';

import BaseWidget, {
    BaseWidgetOptions,
    BaseWidgetTooltip,
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ChartsDataType,
    DiscreteAxisDivisionMode,
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ScaleBreak,
    ScaleBreakLineStyle,
    TimeIntervalConfig,
    VisualRange,
    VisualRangeUpdateMode,
} from '../common/charts';

import { SliderValueChangeMode } from '../common';

export {
    ChartsDataType,
    DiscreteAxisDivisionMode,
    LabelOverlap,
    Palette,
    PaletteExtensionMode,
    ScaleBreakLineStyle,
    VisualRangeUpdateMode,
};

/** @public */
export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';
/** @public */
export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';
/** @public */
export type AxisScale = 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';
/** @public */
export type ChartAxisScale = 'continuous' | 'logarithmic';

/** @public */
export type DisposingEvent = EventInfo<dxRangeSelector>;

/** @public */
export type DrawnEvent = EventInfo<dxRangeSelector>;

/** @public */
export type ExportedEvent = EventInfo<dxRangeSelector>;

/** @public */
export type ExportingEvent = EventInfo<dxRangeSelector> & ExportInfo;

/** @public */
export type FileSavingEvent = FileSavingEventInfo<dxRangeSelector>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxRangeSelector> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxRangeSelector>;

/** @public */
export type OptionChangedEvent = EventInfo<dxRangeSelector> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxRangeSelector, MouseEvent | TouchEvent> & {
  readonly value: Array<number | string | Date>;
  readonly previousValue: Array<number | string | Date>;
};

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
      color?: string;
      /**
       * @docid
       */
      image?: {
        /**
         * @docid
         * @default 'full'
         */
        location?: BackgroundImageLocation;
        /**
         * @docid
         * @default undefined
         */
        url?: string;
      };
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
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
      allowSlidersSwap?: boolean;
      /**
       * @docid
       * @default true
       */
      animationEnabled?: boolean;
      /**
       * @docid
       * @default 'onMovingComplete'
       * @deprecated
       */
      callValueChanged?: ValueChangedCallMode;
      /**
       * @docid
       * @default true
       */
      manualRangeSelectionEnabled?: boolean;
      /**
       * @docid
       * @default true
       */
      moveSelectedRangeByClick?: boolean;
      /**
       * @docid
       * @default true
       */
      snapToTicks?: boolean;
      /**
       * @docid
       * @default 'onHandleRelease'
       */
      valueChangeMode?: SliderValueChangeMode;
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
      barGroupPadding?: number;
      /**
       * @docid
       * @default undefined
       * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
       */
      barGroupWidth?: number;
      /**
       * @docid
       * @default 0
       */
      bottomIndent?: number;
      /**
       * @docid
       * @type dxChartOptions.commonSeriesSettings
       */
      commonSeriesSettings?: dxChartCommonSeriesSettings;
      /**
       * @docid
       */
      dataPrepareSettings?: {
        /**
         * @docid
         * @default false
         */
        checkTypeForAllData?: boolean;
        /**
         * @docid
         * @default true
         */
        convertToAxisDataType?: boolean;
        /**
         * @docid
         * @default true
         */
        sortingMethod?: boolean | ((a: { arg?: Date | number | string; val?: Date | number | string }, b: { arg?: Date | number | string; val?: Date | number | string }) => number);
      };
      /**
       * @docid
       * @default 0.2
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      maxBubbleSize?: number;
      /**
       * @docid
       * @default 12
       * @propertyOf dxChartSeriesTypes.BubbleSeries
       */
      minBubbleSize?: number;
      /**
       * @docid
       * @default false
       */
      negativesAsZeroes?: boolean;
      /**
       * @docid
       * @default "Material"
       */
      palette?: Array<string> | Palette;
      /**
       * @docid
       * @default 'blend'
       */
      paletteExtensionMode?: PaletteExtensionMode;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      series?: ChartSeries | Array<ChartSeries>;
      /**
       * @docid
       * @default undefined
       */
      seriesTemplate?: {
        /**
         * @docid
         */
        customizeSeries?: ((seriesName: any) => ChartSeries);
        /**
         * @docid
         * @default 'series'
         */
        nameField?: string;
      };
      /**
       * @docid
       * @default 0.1
       */
      topIndent?: number;
      /**
       * @docid
       */
      valueAxis?: {
        /**
         * @docid
         * @default false
         */
        inverted?: boolean;
        /**
         * @docid
         * @default 10
         */
        logarithmBase?: number;
        /**
         * @docid
         * @default undefined
         */
        max?: number;
        /**
         * @docid
         * @default undefined
         */
        min?: number;
        /**
         * @docid
         * @default undefined
         */
        type?: ChartAxisScale;
        /**
         * @docid
         * @default undefined
         */
        valueType?: ChartsDataType;
      };
    };
    /**
     * @docid
     * @default '#FFFFFF'
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @notUsedInTheme
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<any> | null;
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
      left?: number;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      right?: number;
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxRangeSelector
     * @type_function_param1_field event:event
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
       * @default true
       * @deprecated  dxChartSeriesTypes.CommonSeries.aggregation.enabled
       */
      aggregateByCategory?: boolean;
      /**
       * @docid
       * @default undefined
       */
      aggregationGroupWidth?: number;
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.TimeInterval
       */
      aggregationInterval?: TimeIntervalConfig;
      /**
       * @docid
       * @default 'betweenLabels'
       * @public
       */
      discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
      /**
       * @docid
       * @default undefined
       */
      allowDecimals?: boolean;
      /**
       * @docid
       */
      breakStyle?: {
        /**
         * @docid
         * @default "#ababab"
         */
        color?: string;
        /**
         * @docid
         * @default "waved"
         */
        line?: ScaleBreakLineStyle;
        /**
         * @docid
         * @default 5
         */
        width?: number;
      };
      /**
       * @docid
       * @inherits ScaleBreak
       * @default undefined
       * @notUsedInTheme
       */
      breaks?: Array<ScaleBreak>;
      /**
       * @docid
       */
      categories?: Array<number | string | Date>;
      /**
       * @docid
       * @default false
       */
      endOnTick?: boolean;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      endValue?: number | Date | string;
      /**
       * @docid
       * @default undefined
       */
      holidays?: Array<Date | string> | Array<number>;
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @notUsedInTheme
         */
        customizeText?: ((scaleValue: { value?: Date | number | string; valueText?: string }) => string);
        /**
         * @docid
         * @default '#767676' &prop(color)
         * @default 11 &prop(size)
         */
        font?: Font;
        /**
         * @docid
         * @default undefined
         */
        format?: Format;
        /**
         * @docid
         * @default "hide"
         */
        overlappingBehavior?: LabelOverlap;
        /**
         * @docid
         * @default 7
         */
        topIndent?: number;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
      };
      /**
       * @docid
       * @default 0
       */
      linearThreshold?: number;
      /**
       * @docid
       * @default 10
       */
      logarithmBase?: number;
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
           * @notUsedInTheme
           */
          customizeText?: ((markerValue: { value?: Date | number; valueText?: string }) => string);
          /**
           * @docid
           * @default undefined
           */
          format?: Format;
        };
        /**
         * @docid
         * @default 33
         */
        separatorHeight?: number;
        /**
         * @docid
         * @default 7
         */
        textLeftIndent?: number;
        /**
         * @docid
         * @default 11
         */
        textTopIndent?: number;
        /**
         * @docid
         * @default 10
         */
        topIndent?: number;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
      };
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.TimeInterval
       */
      maxRange?: TimeIntervalConfig;
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.TimeInterval
       */
      minRange?: TimeIntervalConfig;
      /**
       * @docid
       */
      minorTick?: {
        /**
         * @docid
         * @default '#000000'
         */
        color?: string;
        /**
         * @docid
         * @default 0.06
         */
        opacity?: number;
        /**
         * @docid
         * @default true
         */
        visible?: boolean;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @default undefined
       */
      minorTickCount?: number;
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.TimeInterval
       */
      minorTickInterval?: TimeIntervalConfig;
      /**
       * @docid
       * @default undefined
       */
      placeholderHeight?: number;
      /**
       * @docid
       * @default true
       */
      showCustomBoundaryTicks?: boolean;
      /**
       * @docid
       * @default undefined
       */
      singleWorkdays?: Array<Date | string> | Array<number>;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      startValue?: number | Date | string;
      /**
       * @docid
       */
      tick?: {
        /**
         * @docid
         * @default '#000000'
         */
        color?: string;
        /**
         * @docid
         * @default 0.1
         */
        opacity?: number;
        /**
         * @docid
         * @default 1
         */
        width?: number;
      };
      /**
       * @docid
       * @inherits VizTimeInterval
       * @type number|object|Enums.TimeInterval
       */
      tickInterval?: TimeIntervalConfig;
      /**
       * @docid
       * @default undefined
       */
      type?: AxisScale;
      /**
       * @docid
       * @default undefined
       */
      valueType?: ChartsDataType;
      /**
       * @docid
       * @default [1, 2, 3, 4, 5]
       */
      workWeek?: Array<number>;
      /**
       * @docid
       * @default false
       */
      workdaysOnly?: boolean;
    };
    /**
     * @docid
     * @default "#606060"
     * @public
     */
    selectedRangeColor?: string;
    /**
     * @docid
     * @default "reset"
     * @public
     */
    selectedRangeUpdateMode?: VisualRangeUpdateMode;
    /**
     * @docid
     * @public
     */
    shutter?: {
      /**
       * @docid
       * @default undefined
       */
      color?: string;
      /**
       * @docid
       * @default 0.75
       */
      opacity?: number;
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
      color?: string;
      /**
       * @docid
       * @default 0.2
       */
      opacity?: number;
      /**
       * @docid
       * @default 1
       */
      width?: number;
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
      color?: string;
      /**
       * @docid
       * @notUsedInTheme
       */
      customizeText?: ((scaleValue: { value?: Date | number | string; valueText?: string }) => string);
      /**
       * @docid
       * @default '#FFFFFF' &prop(color)
       * @default 14 &prop(size)
       */
      font?: Font;
      /**
       * @docid
       * @default undefined
       */
      format?: Format;
      /**
       * @docid
       * @default 'red'
       */
      invalidRangeColor?: string;
      /**
       * @docid
       * @default 4
       */
      paddingLeftRight?: number;
      /**
       * @docid
       * @default 2
       */
      paddingTopBottom?: number;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      placeholderHeight?: number;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
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
    value?: Array<number | string | Date> | VisualRange;
}
/**
 * @docid
 * @inherits BaseWidget, DataHelperMixin
 * @namespace DevExpress.viz
 * @public
 */
export default class dxRangeSelector extends BaseWidget<dxRangeSelectorOptions> {
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getValue()
     * @public
     */
    getValue(): Array<number | string | Date>;
    render(): void;
    /**
     * @docid
     * @publicName render(skipChartAnimation)
     * @public
     */
    render(skipChartAnimation: boolean): void;
    /**
     * @docid
     * @publicName setValue(value)
     * @public
     */
    setValue(value: Array<number | string | Date> | VisualRange): void;
}

/** @public */
export type Properties = dxRangeSelectorOptions;

/** @deprecated use Properties instead */
export type Options = dxRangeSelectorOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxRangeSelectorOptions.onDisposing
 * @type_function_param1 e:{viz/range_selector:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onDrawn
 * @type_function_param1 e:{viz/range_selector:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onExported
 * @type_function_param1 e:{viz/range_selector:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onExporting
 * @type_function_param1 e:{viz/range_selector:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onFileSaving
 * @type_function_param1 e:{viz/range_selector:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/range_selector:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onInitialized
 * @type_function_param1 e:{viz/range_selector:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onOptionChanged
 * @type_function_param1 e:{viz/range_selector:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxRangeSelectorOptions.onValueChanged
 * @type_function_param1 e:{viz/range_selector:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
