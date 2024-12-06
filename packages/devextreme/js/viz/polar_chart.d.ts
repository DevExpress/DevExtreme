import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    Format,
} from '../localization';

import {
    basePointObject,
    baseSeriesObject,
    chartAxisObject,
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig,
    PointInteractionInfo,
    TooltipInfo,
} from './chart_components/base_chart';

import {
    template,
    SingleOrMultiple,
} from '../common';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsDataType,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    LabelOverlap,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    RelativePosition,
    SeriesHoverMode,
    SeriesSelectionMode,
    TimeIntervalConfig,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    VisualRange,
    ZoomPanAction,
    ChartsColor,
    Font,
} from '../common/charts';

/**
 * @docid _viz_polar_chart_SeriesInteractionInfo
 * @hidden
 */
export interface SeriesInteractionInfo {
    /** @docid _viz_polar_chart_SeriesInteractionInfo.target */
    target: polarChartSeriesObject;
}

export {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsDataType,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    LabelOverlap,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    RelativePosition,
    SeriesHoverMode,
    SeriesSelectionMode,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    ZoomPanAction,
};

/** @public */
export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
/** @public */
export type ValueAxisVisualRangeUpdateMode = 'auto' | 'keep' | 'reset';

/**
 * @docid _viz_polar_chart_ArgumentAxisClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ArgumentAxisClickEvent = NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_polar_chart_ArgumentAxisClickEvent.argument */
    readonly argument: Date | number | string;
};

/**
 * @docid _viz_polar_chart_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_DoneEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DoneEvent = EventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxPolarChart> & ExportInfo;

/**
 * @docid _viz_polar_chart_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxPolarChart> & IncidentInfo;

/**
 * @docid _viz_polar_chart_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxPolarChart>;

/**
 * @docid _viz_polar_chart_LegendClickEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type LegendClickEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_polar_chart_LegendClickEvent.target */
    readonly target: polarChartSeriesObject;
};

/**
 * @docid _viz_polar_chart_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxPolarChart> & ChangedOptionInfo;

/**
 * @docid _viz_polar_chart_PointClickEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,PointInteractionInfo
 */
export type PointClickEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & PointInteractionInfo;

/**
 * @docid _viz_polar_chart_PointHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,PointInteractionInfo
 */
export type PointHoverChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/**
 * @docid _viz_polar_chart_PointSelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,PointInteractionInfo
 */
export type PointSelectionChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/**
 * @docid _viz_polar_chart_SeriesClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type SeriesClickEvent = NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_polar_chart_SeriesClickEvent.target */
    readonly target: polarChartSeriesObject;
};

/**
 * @docid _viz_polar_chart_SeriesHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_polar_chart_SeriesInteractionInfo
 */
export type SeriesHoverChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/**
 * @docid _viz_polar_chart_SeriesSelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_polar_chart_SeriesInteractionInfo
 */
export type SeriesSelectionChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/**
 * @docid _viz_polar_chart_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_components_base_chart_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxPolarChart> & TooltipInfo;

/**
 * @docid _viz_polar_chart_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_components_base_chart_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxPolarChart> & TooltipInfo;

/**
 * @docid _viz_polar_chart_ZoomEndEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type ZoomEndEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | TouchEvent> & {
    /** @docid _viz_polar_chart_ZoomEndEvent.axis */
    readonly axis: chartAxisObject;
    /** @docid _viz_polar_chart_ZoomEndEvent.range */
    readonly range: VisualRange;
    /** @docid _viz_polar_chart_ZoomEndEvent.previousRange */
    readonly previousRange: VisualRange;
    /**
     * @docid _viz_polar_chart_ZoomEndEvent.actionType
     * @type Enums.ZoomPanAction
     */
    readonly actionType: ZoomPanAction;
    /** @docid _viz_polar_chart_ZoomEndEvent.zoomFactor */
    readonly zoomFactor: number;
    /** @docid _viz_polar_chart_ZoomEndEvent.shift */
    readonly shift: number;
};
/**
 * @docid _viz_polar_chart_ZoomStartEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type ZoomStartEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | TouchEvent> & {
    /** @docid _viz_polar_chart_ZoomStartEvent.axis */
    readonly axis: chartAxisObject;
    /** @docid _viz_polar_chart_ZoomStartEvent.range */
    readonly range: VisualRange;
    /**
     * @docid _viz_polar_chart_ZoomStartEvent.actionType
     * @type Enums.ZoomPanAction
     */
    readonly actionType: ZoomPanAction;
};

/**
 * @docid
 * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
 * @type object
 * @namespace DevExpress.viz
 */
export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    tag?: any | undefined;
    /**
     * @docid
     * @default 'scatter'
     * @public
     */
    type?: PolarChartSeriesType;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * @docid
     * @type object
     * @public
     */
    adaptiveLayout?: AdaptiveLayout;
    /**
     * @docid
     * @inherits dxPolarChartOptions.commonAnnotationSettings
     * @public
     */
    annotations?: Array<dxPolarChartAnnotationConfig | any>;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @public
     */
    argumentAxis?: ArgumentAxis;
    /**
     * @docid
     * @default 0.3
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    barGroupWidth?: number | undefined;
    /**
     * @docid
     * @public
     */
    commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
    /**
     * @docid
     * @type object
     * @public
     */
    commonAxisSettings?: CommonAxisSettings;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @hideDefaults true
     * @inheritAll
     * @public
     */
    commonSeriesSettings?: CommonSeriesSettings;
    /**
     * @docid
     * @default '#FFFFFF'
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig) | undefined;
    /**
     * @docid
     * @public
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
     * @type object
     * @public
     */
    legend?: Legend;
    /**
     * @docid
     * @default false
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/polar_chart:ArgumentAxisClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onArgumentAxisClick?: ((e: ArgumentAxisClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/polar_chart:LegendClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/polar_chart:SeriesClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesClick?: ((e: SeriesClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/polar_chart:SeriesHoverChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesHoverChanged?: ((e: SeriesHoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/polar_chart:SeriesSelectionChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesSelectionChanged?: ((e: SeriesSelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/polar_chart:ZoomEndEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomEnd?: ((e: ZoomEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/polar_chart:ZoomStartEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomStart?: ((e: ZoomStartEvent) => void);
    /**
     * @docid
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: LabelOverlap;
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @public
     */
    series?: PolarChartSeries | Array<PolarChartSeries> | undefined;
    /**
     * @docid
     * @default 'single'
     * @public
     */
    seriesSelectionMode?: SingleOrMultiple;
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    seriesTemplate?: {
      /**
       * @docid
       */
      customizeSeries?: ((seriesName: any) => PolarChartSeries);
      /**
       * @docid
       * @default 'series'
       */
      nameField?: string;
    };
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: Tooltip;
    /**
     * @docid
     * @default false
     * @public
     */
    useSpiderWeb?: boolean;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @public
     */
    valueAxis?: ValueAxis;
}
/**
 * @public
 * @docid dxPolarChartAdaptiveLayout
 */
export type AdaptiveLayout = BaseChartAdaptiveLayout & {
    /**
     * @docid dxPolarChartOptions.adaptiveLayout.height
     * @default 170
     * @public
     */
    height?: number;
    /**
     * @docid dxPolarChartOptions.adaptiveLayout.width
     * @default 170
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxis
 * @type object
 */
export type ArgumentAxis = CommonAxisSettings & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.argumentType
     * @default undefined
     * @public
     */
    argumentType?: ChartsDataType | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.axisDivisionFactor
     * @default 50
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.categories
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines
     * @type Array<Object>
     * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @public
     */
    constantLines?: Array<ArgumentAxisConstantLines>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.firstPointOnStartAngle
     * @default false
     * @public
     */
    firstPointOnStartAngle?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.hoverMode
     * @default 'none'
     * @public
     */
    hoverMode?: ArgumentAxisHoverMode;
    /**
     * @docid dxPolarChartOptions.argumentAxis.label
     * @type object
     * @public
     */
    label?: ArgumentAxisLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.logarithmBase
     * @default 10
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTick
     * @type object
     * @public
     */
    minorTick?: ArgumentAxisMinorTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * @docid dxPolarChartOptions.argumentAxis.originValue
     * @default undefined
     * @public
     */
    originValue?: number | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.period
     * @default undefined
     * @public
     */
    period?: number | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.startAngle
     * @default 0
     * @public
     */
    startAngle?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<ArgumentAxisStrips>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick
     * @type object
     * @public
     */
    tick?: ArgumentAxisTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * @docid dxPolarChartOptions.argumentAxis.type
     * @default undefined
     * @public
     */
    type?: AxisScaleType | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisConstantLines
 * @type object
 */
export type ArgumentAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.displayBehindSeries
     * @default false
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.extendAxis
     * @default false
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label
     * @type object
     * @public
     */
    label?: ArgumentAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisConstantLinesLabel
 * @type object
 */
export type ArgumentAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisLabel
 * @type object
 */
export type ArgumentAxisLabel = CommonAxisSettingsLabel & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeHint
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisMinorTick
 * @type object
 */
export type ArgumentAxisMinorTick = CommonAxisSettingsMinorTick & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTick.shift
     * @default 3
     * @public
     */
    shift?: number;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisStrips
 * @type object
 */
export type ArgumentAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string | undefined;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label
     * @type object
     * @public
     */
    label?: ArgumentAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisStripsLabel
 * @type object
 */
export type ArgumentAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxPolarChartArgumentAxisTick
 * @type object
 */
export type ArgumentAxisTick = CommonAxisSettingsTick & {
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick.shift
     * @default 3
     * @public
     */
    shift?: number;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettings
 */
export type CommonAxisSettings = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @public
     */
    allowDecimals?: boolean | undefined;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.color
     * @default '#767676'
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: CommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @default 'betweenLabels'
     * @public
     */
    discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean | undefined;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.grid
     * @public
     */
    grid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.visible
       * @default true
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.inverted
     * @default false
     * @public
     */
    inverted?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorGrid
     * @public
     */
    minorGrid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.visible
       * @default true
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick
     * @type object
     * @public
     */
    minorTick?: CommonAxisSettingsMinorTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @public
     */
    opacity?: number | undefined;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle
     * @type object
     * @public
     */
    stripStyle?: CommonAxisSettingsStripStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick
     * @type object
     * @public
     */
    tick?: CommonAxisSettingsTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsConstantLineStyle
 */
export type CommonAxisSettingsConstantLineStyle = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.color
     * @default '#000000'
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsConstantLineStyleLabel
 */
export type CommonAxisSettingsConstantLineStyleLabel = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsLabel
 */
export type CommonAxisSettingsLabel = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.indentFromAxis
     * @default 5
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.overlappingBehavior
     * @default 'hide'
     * @public
     */
    overlappingBehavior?: LabelOverlap;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsMinorTick
 */
export type CommonAxisSettingsMinorTick = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.color
     * @default '#767676'
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.length
     * @default 7
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.opacity
     * @default 0.3
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.visible
     * @default false
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsStripStyle
 */
export type CommonAxisSettingsStripStyle = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsStripStyleLabel;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsStripStyleLabel
 */
export type CommonAxisSettingsStripStyleLabel = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
};
/**
 * @public
 * @docid dxPolarChartCommonAxisSettingsTick
 */
export type CommonAxisSettingsTick = {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.color
     * @default '#767676'
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.length
     * @default 7
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.opacity
     * @default undefined
     * @public
     */
    opacity?: number | undefined;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxPolarChartCommonSeriesSetting
 * @type object
 */
export type CommonSeriesSettings = dxPolarChartSeriesTypesCommonPolarChartSeries & {
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.area
     * @public
     */
    area?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.bar
     * @public
     */
    bar?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.line
     * @public
     */
    line?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.scatter
     * @public
     */
    scatter?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.stackedbar
     * @public
     */
    stackedbar?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.type
     * @default 'scatter'
     * @public
     */
    type?: PolarChartSeriesType;
};
/**
 * @public
 * @docid dxPolarChartLegend
 */
export type Legend = BaseChartLegend & {
    /**
     * @docid dxPolarChartOptions.legend.customizeHint
     * @public
     */
    customizeHint?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * @docid dxPolarChartOptions.legend.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * @docid dxPolarChartOptions.legend.hoverMode
     * @default 'includePoints'
     * @public
     */
    hoverMode?: LegendHoverMode;
};
/**
 * @public
 * @docid dxPolarChartTooltip
 */
export type Tooltip = BaseChartTooltip & {
    /**
     * @docid dxPolarChartOptions.tooltip.shared
     * @default false
     * @public
     */
    shared?: boolean;
};
/**
 * @public
 * @docid dxPolarChartValueAxis
 * @type object
 */
export type ValueAxis = CommonAxisSettings & {
    /**
     * @docid dxPolarChartOptions.valueAxis.axisDivisionFactor
     * @default 30
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.categories
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @public
     */
    constantLines?: Array<ValueAxisConstantLines>;
    /**
     * @docid dxPolarChartOptions.valueAxis.endOnTick
     * @default false
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.label
     * @type object
     * @public
     */
    label?: ValueAxisLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.logarithmBase
     * @default 10
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.maxValueMargin
     * @default undefined
     * @public
     */
    maxValueMargin?: number | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.minValueMargin
     * @default undefined
     * @public
     */
    minValueMargin?: number | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval|undefined
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: TimeIntervalConfig;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * @docid dxPolarChartOptions.valueAxis.showZero
     * @default undefined
     * @public
     */
    showZero?: boolean | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<ValueAxisStrips>;
    /**
     * @docid dxPolarChartOptions.valueAxis.tick
     * @type object
     * @public
     */
    tick?: ValueAxisTick;
    /**
     * @docid dxPolarChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * @docid dxPolarChartOptions.valueAxis.type
     * @default undefined
     * @public
     */
    type?: AxisScaleType | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.valueMarginsEnabled
     * @default true
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.valueType
     * @default undefined
     * @public
     */
    valueType?: ChartsDataType | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VisualRange | Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode;
    /**
     * @docid dxPolarChartOptions.valueAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VisualRange | Array<number | string | Date> | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisConstantLines
 * @type object
 */
export type ValueAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.displayBehindSeries
     * @default false
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.extendAxis
     * @default false
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label
     * @type object
     * @public
     */
    label?: ValueAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisConstantLinesLabel
 * @type object
 */
export type ValueAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisLabel
 * @type object
 */
export type ValueAxisLabel = CommonAxisSettingsLabel & {
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeHint
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.valueAxis.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisStrips
 * @type object
 */
export type ValueAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string | undefined;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label
     * @type object
     * @public
     */
    label?: ValueAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisStripsLabel
 * @type object
 */
export type ValueAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxPolarChartValueAxisTick
 * @type object
 */
export type ValueAxisTick = CommonAxisSettingsTick & {
    /**
     * @docid dxPolarChartOptions.valueAxis.tick.visible
     * @default false
     * @public
     */
    visible?: boolean;
};
/**
 * @docid dxPolarChart
 * @inherits BaseChart
 * @namespace DevExpress.viz
 * @public
 */
export default class dxPolarChart extends BaseChart<dxPolarChartOptions> {
    /**
     * @docid dxPolarChart.getValueAxis
     * @publicName getValueAxis()
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid dxPolarChart.resetVisualRange
     * @publicName resetVisualRange()
     * @public
     */
    resetVisualRange(): void;
}

/**
 * @docid
 * @type object
 * @inherits dxPolarChartCommonAnnotationConfig
 * @namespace DevExpress.viz
 */
export interface dxPolarChartAnnotationConfig extends dxPolarChartCommonAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
}

/**
 * @docid
 * @type object
 * @inherits BaseChartAnnotationConfig
 * @namespace DevExpress.viz
 */
export interface dxPolarChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    angle?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    radius?: number | undefined;
    /**
     * @docid
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxPolarChartCommonAnnotationConfig|any
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 */
export interface dxPolarChartSeriesTypes {
    /**
     * @docid
     * @type object
     * @hidden
     */
    CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
    /**
     * @docid
     * @publicName AreaSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @public
     */
    areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
    /**
     * @docid
     * @publicName BarSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @public
     */
    barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
    /**
     * @docid
     * @publicName LineSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @public
     */
    linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
    /**
     * @docid
     * @publicName ScatterSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @public
     */
    scatterpolarseries?: any;
    /**
     * @docid
     * @publicName StackedBarSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @public
     */
    stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField
     * @default 'arg'
     * @notUsedInTheme
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    barPadding?: number | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    barWidth?: number | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashStyle
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      dashStyle?: DashStyle | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width
       * @default 2
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.closed
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    closed?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.color
     * @default undefined
     * @public
     */
    color?: string | ChartsColor | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle
     * @default 'solid'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    hoverMode?: SeriesHoverMode;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.color
         * @default undefined
         */
        color?: string | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.dashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyle | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.visible
         * @default false
         */
        visible?: boolean;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.width
         * @default 3
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.color
       * @default undefined
       */
      color?: string | ChartsColor | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.dashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyle;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.direction
         * @default 'none'
         */
        direction?: HatchDirection;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.opacity
         * @default 0.75
         */
        opacity?: number;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.step
         * @default 6
         */
        step?: number;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.width
         * @default 2
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.highlight
       * @default true
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      highlight?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.width
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
     * @default false
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label
     * @type object
     * @public
     */
    label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount
     * @default undefined
     * @public
     */
    maxLabelCount?: number | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
     * @public
     */
    minBarSize?: number | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity
     * @default 0.5
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    selectionMode?: SeriesSelectionMode;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.color
         * @default undefined
         */
        color?: string | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.dashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyle | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.visible
         * @default false
         */
        visible?: boolean;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.width
         * @default 3
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.color
       * @default undefined
       */
      color?: string | ChartsColor | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.dashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyle;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.direction
         * @default 'none'
         */
        direction?: HatchDirection;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.opacity
         * @default 0.5
         */
        opacity?: number;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.step
         * @default 6
         */
        step?: number;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.width
         * @default 2
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.highlight
       * @default true
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      highlight?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.width
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend
     * @default true
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.stack
     * @default 'default'
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    stack?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField
     * @default 'tag'
     * @notUsedInTheme
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    valueErrorBar?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.color
       * @default black
       */
      color?: string;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.displayMode
       * @default 'auto'
       */
      displayMode?: ValueErrorBarDisplayMode;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.edgeLength
       * @default 8
       */
      edgeLength?: number;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.highValueField
       * @default undefined
       */
      highValueField?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lineWidth
       * @default 2
       */
      lineWidth?: number;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lowValueField
       * @default undefined
       */
      lowValueField?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.type
       * @default undefined
       */
      type?: ValueErrorBarType | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.value
       * @default 1
       */
      value?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField
     * @default 'val'
     * @notUsedInTheme
     * @public
     */
    valueField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.width
     * @default 2
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat
     * @default undefined
     * @public
     */
    argumentFormat?: Format | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor
     * @default undefined
     * @public
     */
    backgroundColor?: string | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color
       * @default  '#d3d3d3'
       */
      color?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyle | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    connector?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
     * @default '#FFFFFF' &prop(color)
     * @default 14 &prop(size)
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position
     * @default 'outside'
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    position?: RelativePosition;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle
     * @default 0
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible
     * @default false
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.displayFormat
     * @default undefined
     * @public
     */
     displayFormat?: string | undefined;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      visible?: boolean;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    color?: string | ChartsColor | undefined;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    hoverMode?: PointInteractionMode;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.color
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.visible
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.width
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string | ChartsColor | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.size
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    image?: string | undefined | {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      height?: number;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      url?: string | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    selectionMode?: PointInteractionMode;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.color
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string | undefined;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.visible
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean;
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.width
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number;
      };
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string | ChartsColor | undefined;
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.size
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number;
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size
     * @default 12
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    size?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol
     * @default 'circle'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    symbol?: PointSymbol;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.point
     * @type object
     * @public
     */
    point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.hoverMode
     * @default 'excludePoints'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.label
     * @type object
     * @public
     */
    label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.label.position
     * @default 'inside'
     * @public
     */
    position?: RelativePosition;
}

/**
 * @docid
 * @publicName Point
 * @type object
 * @inherits basePointObject
 * @namespace DevExpress.viz
 */
export interface polarPointObject extends basePointObject {
}

/**
 * @docid
 * @publicName Series
 * @type object
 * @inherits baseSeriesObject
 * @namespace DevExpress.viz
 */
export interface polarChartSeriesObject extends baseSeriesObject {
}

/** @public */
export type Properties = dxPolarChartOptions;

/** @deprecated use Properties instead */
export type Options = dxPolarChartOptions;

// #region deprecated in v23.1

/** @deprecated Use AdaptiveLayout instead */
export type dxPolarChartAdaptiveLayout = AdaptiveLayout;

/** @deprecated Use ArgumentAxis instead */
export type dxPolarChartArgumentAxis = ArgumentAxis;

/** @deprecated Use ArgumentAxisConstantLines instead */
export type dxPolarChartArgumentAxisConstantLines = ArgumentAxisConstantLines;

/** @deprecated Use ArgumentAxisConstantLinesLabel instead */
export type dxPolarChartArgumentAxisConstantLinesLabel = ArgumentAxisConstantLinesLabel;

/** @deprecated Use ArgumentAxisLabel instead */
export type dxPolarChartArgumentAxisLabel = ArgumentAxisLabel;

/** @deprecated Use ArgumentAxisMinorTick instead */
export type dxPolarChartArgumentAxisMinorTick = ArgumentAxisMinorTick;

/** @deprecated Use ArgumentAxisStrips instead */
export type dxPolarChartArgumentAxisStrips = ArgumentAxisStrips;

/** @deprecated Use ArgumentAxisStripsLabel instead */
export type dxPolarChartArgumentAxisStripsLabel = ArgumentAxisStripsLabel;

/** @deprecated Use ArgumentAxisTick instead */
export type dxPolarChartArgumentAxisTick = ArgumentAxisTick;

/** @deprecated Use CommonAxisSettings instead */
export type dxPolarChartCommonAxisSettings = CommonAxisSettings;

/** @deprecated Use CommonAxisSettingsConstantLineStyle instead */
export type dxPolarChartCommonAxisSettingsConstantLineStyle = CommonAxisSettingsConstantLineStyle;

/** @deprecated Use CommonAxisSettingsConstantLineStyleLabel instead */
export type dxPolarChartCommonAxisSettingsConstantLineStyleLabel = CommonAxisSettingsConstantLineStyleLabel;

/** @deprecated Use CommonAxisSettingsLabel instead */
export type dxPolarChartCommonAxisSettingsLabel = CommonAxisSettingsLabel;

/** @deprecated Use CommonAxisSettingsMinorTick instead */
export type dxPolarChartCommonAxisSettingsMinorTick = CommonAxisSettingsMinorTick;

/** @deprecated Use CommonAxisSettingsStripStyle instead */
export type dxPolarChartCommonAxisSettingsStripStyle = CommonAxisSettingsStripStyle;

/** @deprecated Use CommonAxisSettingsStripStyleLabel instead */
export type dxPolarChartCommonAxisSettingsStripStyleLabel = CommonAxisSettingsStripStyleLabel;

/** @deprecated Use CommonAxisSettingsTick instead */
export type dxPolarChartCommonAxisSettingsTick = CommonAxisSettingsTick;

/** @deprecated Use CommonSeriesSettings instead */
export type dxPolarChartCommonSeriesSettings = CommonSeriesSettings;

/** @deprecated Use Legend instead */
export type dxPolarChartLegend = Legend;

/** @deprecated Use Tooltip instead */
export type dxPolarChartTooltip = Tooltip;

/** @deprecated Use ValueAxis instead */
export type dxPolarChartValueAxis = ValueAxis;

/** @deprecated Use ValueAxisConstantLines instead */
export type dxPolarChartValueAxisConstantLines = ValueAxisConstantLines;

/** @deprecated Use ValueAxisConstantLinesLabel instead */
export type dxPolarChartValueAxisConstantLinesLabel = ValueAxisConstantLinesLabel;

/** @deprecated Use ValueAxisLabel instead */
export type dxPolarChartValueAxisLabel = ValueAxisLabel;

/** @deprecated Use ValueAxisStrips instead */
export type dxPolarChartValueAxisStrips = ValueAxisStrips;

/** @deprecated Use ValueAxisStripsLabel instead */
export type dxPolarChartValueAxisStripsLabel = ValueAxisStripsLabel;

/** @deprecated Use ValueAxisTick instead */
export type dxPolarChartValueAxisTick = ValueAxisTick;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onArgumentAxisClick' | 'onLegendClick' | 'onSeriesClick' | 'onSeriesHoverChanged' | 'onSeriesSelectionChanged' | 'onZoomEnd' | 'onZoomStart'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPolarChartOptions.onDisposing
 * @type_function_param1 e:{viz/polar_chart:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPolarChartOptions.onDone
 * @type_function_param1 e:{viz/polar_chart:DoneEvent}
 */
onDone?: ((e: DoneEvent) => void);
/**
 * @docid dxPolarChartOptions.onDrawn
 * @type_function_param1 e:{viz/polar_chart:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxPolarChartOptions.onExported
 * @type_function_param1 e:{viz/polar_chart:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxPolarChartOptions.onExporting
 * @type_function_param1 e:{viz/polar_chart:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxPolarChartOptions.onFileSaving
 * @type_function_param1 e:{viz/polar_chart:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxPolarChartOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/polar_chart:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxPolarChartOptions.onInitialized
 * @type_function_param1 e:{viz/polar_chart:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPolarChartOptions.onOptionChanged
 * @type_function_param1 e:{viz/polar_chart:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointClick
 * @type_function_param1 e:{viz/polar_chart:PointClickEvent}
 */
onPointClick?: ((e: PointClickEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointHoverChanged
 * @type_function_param1 e:{viz/polar_chart:PointHoverChangedEvent}
 */
onPointHoverChanged?: ((e: PointHoverChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointSelectionChanged
 * @type_function_param1 e:{viz/polar_chart:PointSelectionChangedEvent}
 */
onPointSelectionChanged?: ((e: PointSelectionChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onTooltipHidden
 * @type_function_param1 e:{viz/polar_chart:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxPolarChartOptions.onTooltipShown
 * @type_function_param1 e:{viz/polar_chart:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
