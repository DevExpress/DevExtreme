import DataSource, { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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
    Font,
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

/**
 * @docid _viz_range_selector_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxRangeSelector>;

/**
 * @docid _viz_range_selector_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxRangeSelector>;

/**
 * @docid _viz_range_selector_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxRangeSelector>;

/**
 * @docid _viz_range_selector_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxRangeSelector> & ExportInfo;

/**
 * @docid _viz_range_selector_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxRangeSelector>;

/**
 * @docid _viz_range_selector_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxRangeSelector> & IncidentInfo;

/**
 * @docid _viz_range_selector_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxRangeSelector>;

/**
 * @docid _viz_range_selector_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxRangeSelector> & ChangedOptionInfo;

/**
 * @docid _viz_range_selector_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxRangeSelector, MouseEvent | TouchEvent> & {
  /** @docid _viz_range_selector_ValueChangedEvent.value */
  readonly value: Array<number | string | Date>;
  /** @docid _viz_range_selector_ValueChangedEvent.previousValue */
  readonly previousValue: Array<number | string | Date>;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
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
        url?: string | undefined;
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
      barGroupWidth?: number | undefined;
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
      series?: ChartSeries | Array<ChartSeries> | undefined;
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
        max?: number | undefined;
        /**
         * @docid
         * @default undefined
         */
        min?: number | undefined;
        /**
         * @docid
         * @default undefined
         */
        type?: ChartAxisScale | undefined;
        /**
         * @docid
         * @default undefined
         */
        valueType?: ChartsDataType | undefined;
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
      left?: number | undefined;
      /**
       * @docid
       * @default undefined
       * @notUsedInTheme
       */
      right?: number | undefined;
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/range_selector:ValueChangedEvent}
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
      aggregationGroupWidth?: number | undefined;
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
      allowDecimals?: boolean | undefined;
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
      endValue?: number | Date | string | undefined;
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
        format?: Format | undefined;
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
          format?: Format | undefined;
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
      minorTickCount?: number | undefined;
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
      placeholderHeight?: number | undefined;
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
      startValue?: number | Date | string | undefined;
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
      type?: AxisScale | undefined;
      /**
       * @docid
       * @default undefined
       */
      valueType?: ChartsDataType | undefined;
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
      color?: string | undefined;
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
      format?: Format | undefined;
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
      placeholderHeight?: number | undefined;
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxRangeSelectorOptions.onDisposing
 * @type_function_param1 e:{viz/range_selector:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onDrawn
 * @type_function_param1 e:{viz/range_selector:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onExported
 * @type_function_param1 e:{viz/range_selector:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onExporting
 * @type_function_param1 e:{viz/range_selector:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onFileSaving
 * @type_function_param1 e:{viz/range_selector:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/range_selector:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onInitialized
 * @type_function_param1 e:{viz/range_selector:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxRangeSelectorOptions.onOptionChanged
 * @type_function_param1 e:{viz/range_selector:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
