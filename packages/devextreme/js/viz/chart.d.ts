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
    template,
    SingleOrMultiple,
    HorizontalAlignment,
    Position,
    VerticalAlignment,
} from '../common';

import {
    BaseChart,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig,
    PointInteractionInfo,
    TooltipInfo,
} from './chart_components/base_chart';

import {
    ChartSeries,
} from './common';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsAxisLabelOverlap,
    ChartsDataType,
    ChartsLabelOverlap,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    RelativePosition,
    ScaleBreak,
    ScaleBreakLineStyle,
    SeriesHoverMode,
    SeriesSelectionMode,
    SeriesType,
    TextOverflow,
    TimeIntervalConfig,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    VisualRange,
    VisualRangeUpdateMode,
    WordWrap,
    ZoomPanAction,
    ChartsColor,
    SeriesPoint,
    SeriesLabel,
    Font,
} from '../common/charts';

/**
 * @docid _viz_chart_SeriesInteractionInfo
 * @hidden
 */
export interface SeriesInteractionInfo {
    /** @docid _viz_chart_SeriesInteractionInfo.target */
    target: chartSeriesObject;
}

export {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsAxisLabelOverlap,
    ChartsLabelOverlap,
    ChartsDataType,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    HorizontalAlignment,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    Position,
    RelativePosition,
    ScaleBreakLineStyle,
    SeriesHoverMode,
    SeriesSelectionMode,
    SeriesType,
    TextOverflow,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    VerticalAlignment,
    VisualRangeUpdateMode,
    WordWrap,
    ZoomPanAction,
};

/** @public */
export type AggregatedPointsPosition = 'betweenTicks' | 'crossTicks';
/** @public */
export type ChartBubbleSeriesAggregationMethod = 'avg' | 'custom';
/** @public */
export type ChartFinancialSeriesAggregationMethod = 'ohlc' | 'custom';
/** @public */
export type ChartLabelDisplayMode = 'rotate' | 'stagger' | 'standard';
/** @public */
export type ChartRangeSeriesAggregationMethod = 'range' | 'custom';
/** @public */
export type ChartSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
/** @public */
export type ChartSingleValueSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
/** @public */
export type ChartTooltipLocation = 'center' | 'edge';
/** @public */
export type ChartZoomAndPanMode = 'both' | 'none' | 'pan' | 'zoom';
/** @public */
export type EventKeyModifier = 'alt' | 'ctrl' | 'meta' | 'shift';
/** @public */
export type FinancialChartReductionLevel = 'close' | 'high' | 'low' | 'open';

/**
 * @docid _viz_chart_ArgumentAxisClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ArgumentAxisClickEvent = NativeEventInfo<dxChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_chart_ArgumentAxisClickEvent.argument */
    readonly argument: Date | number | string;
};

/**
 * @docid _viz_chart_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxChart>;

/**
 * @docid _viz_chart_DoneEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DoneEvent = EventInfo<dxChart>;

/**
 * @docid _viz_chart_DrawnEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DrawnEvent = EventInfo<dxChart>;

/**
 * @docid _viz_chart_ExportedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ExportedEvent = EventInfo<dxChart>;

/**
 * @docid _viz_chart_ExportingEvent
 * @public
 * @type object
 * @inherits EventInfo,ExportInfo
 */
export type ExportingEvent = EventInfo<dxChart> & ExportInfo;

/**
 * @docid _viz_chart_FileSavingEvent
 * @public
 * @type object
 * @inherits FileSavingEventInfo
 */
export type FileSavingEvent = FileSavingEventInfo<dxChart>;

/**
 * @docid _viz_chart_IncidentOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,IncidentInfo
 */
export type IncidentOccurredEvent = EventInfo<dxChart> & IncidentInfo;

/**
 * @docid _viz_chart_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxChart>;

/**
 * @docid _viz_chart_LegendClickEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type LegendClickEvent = Cancelable & NativeEventInfo<dxChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_chart_LegendClickEvent.target */
    readonly target: chartSeriesObject;
};

/**
 * @docid _viz_chart_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxChart> & ChangedOptionInfo;

/**
 * @docid _viz_chart_PointClickEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,PointInteractionInfo
 */
export type PointClickEvent = Cancelable & NativeEventInfo<dxChart, MouseEvent | PointerEvent> & PointInteractionInfo;

/**
 * @docid _viz_chart_PointHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,PointInteractionInfo
 */
export type PointHoverChangedEvent = EventInfo<dxChart> & PointInteractionInfo;

/**
 * @docid _viz_chart_PointSelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,PointInteractionInfo
 */
export type PointSelectionChangedEvent = EventInfo<dxChart> & PointInteractionInfo;

/**
 * @docid _viz_chart_SeriesClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type SeriesClickEvent = NativeEventInfo<dxChart, MouseEvent | PointerEvent> & {
    /** @docid _viz_chart_SeriesClickEvent.target */
    readonly target: chartSeriesObject;
};

/**
 * @docid _viz_chart_SeriesHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_SeriesInteractionInfo
 */
export type SeriesHoverChangedEvent = EventInfo<dxChart> & SeriesInteractionInfo;

/**
 * @docid _viz_chart_SeriesSelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_SeriesInteractionInfo
 */
export type SeriesSelectionChangedEvent = EventInfo<dxChart> & SeriesInteractionInfo;

/**
 * @docid _viz_chart_TooltipHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_components_base_chart_TooltipInfo
 */
export type TooltipHiddenEvent = EventInfo<dxChart> & TooltipInfo;

/**
 * @docid _viz_chart_TooltipShownEvent
 * @public
 * @type object
 * @inherits EventInfo,_viz_chart_components_base_chart_TooltipInfo
 */
export type TooltipShownEvent = EventInfo<dxChart> & TooltipInfo;

/**
 * @docid _viz_chart_ZoomEndEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type ZoomEndEvent = Cancelable & NativeEventInfo<dxChart, MouseEvent | TouchEvent> & {
    /** @docid _viz_chart_ZoomEndEvent.rangeStart */
    readonly rangeStart: Date | number;
    /** @docid _viz_chart_ZoomEndEvent.rangeEnd */
    readonly rangeEnd: Date | number;
    /** @docid _viz_chart_ZoomEndEvent.axis */
    readonly axis: chartAxisObject;
    /** @docid _viz_chart_ZoomEndEvent.range */
    readonly range: VisualRange;
    /** @docid _viz_chart_ZoomEndEvent.previousRange */
    readonly previousRange: VisualRange;
    /**
     * @docid _viz_chart_ZoomEndEvent.actionType
     * @type Enums.ZoomPanAction
     */
    readonly actionType: ZoomPanAction;
    /** @docid _viz_chart_ZoomEndEvent.zoomFactor */
    readonly zoomFactor: number;
    /** @docid _viz_chart_ZoomEndEvent.shift */
    readonly shift: number;
};

/**
 * @docid _viz_chart_ZoomStartEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type ZoomStartEvent = Cancelable & NativeEventInfo<dxChart, MouseEvent | TouchEvent> & {
    /** @docid _viz_chart_ZoomStartEvent.axis */
    readonly axis: chartAxisObject;
    /** @docid _viz_chart_ZoomStartEvent.range */
    readonly range: VisualRange;
    /**
     * @docid _viz_chart_ZoomStartEvent.actionType
     * @type Enums.ZoomPanAction
     */
    readonly actionType?: ZoomPanAction;
};

/**
 * @docid
 * @publicName Label
 * @type object
 * @namespace DevExpress.viz
 */
export interface baseLabelObject {
    /**
     * @docid
     * @publicName getBoundingRect()
     * @return object
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid
     * @publicName shift(x, y)
     * @return object
     * @public
     */
    shift(x: number, y: number): this;
    /**
     * @docid
     * @publicName hide()
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName hide(holdInvisible)
     * @public
     */
    hide(holdInvisible: boolean): void;
    /**
     * @docid
     * @publicName isVisible()
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid
     * @publicName show()
     * @public
     */
    show(): void;
    /**
     * @docid
     * @publicName show(holdVisible)
     * @public
     */
    show(holdVisible: boolean): void;
}

/**
 * @docid
 * @publicName Point
 * @type object
 * @namespace DevExpress.viz
 */
export interface basePointObject {
    /**
     * @docid
     * @publicName clearHover()
     * @public
     */
    clearHover(): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid basePointObject.fullState
     * @public
     */
    fullState?: number;
    /**
     * @docid
     * @publicName getColor()
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getLabel()
     * @public
     */
    getLabel(): baseLabelObject & Array<baseLabelObject>;
    /**
     * @docid
     * @publicName hideTooltip()
     * @public
     */
    hideTooltip(): void;
    /**
     * @docid
     * @publicName hover()
     * @public
     */
    hover(): void;
    /**
     * @docid
     * @publicName isHovered()
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @public
     */
    originalArgument?: string | number | Date;
    /**
     * @docid
     * @public
     */
    originalValue?: string | number | Date;
    /**
     * @docid
     * @publicName select()
     * @public
     */
    select(): void;
    /**
     * @docid
     * @public
     */
    series?: any;
    /**
     * @docid
     * @publicName showTooltip()
     * @public
     */
    showTooltip(): void;
    /**
     * @docid
     * @public
     */
    tag?: any;
}

/**
 * @docid
 * @publicName Series
 * @type object
 * @namespace DevExpress.viz
 */
export interface baseSeriesObject {
    /**
     * @docid
     * @publicName clearHover()
     * @public
     */
    clearHover(): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName deselectPoint(point)
     * @public
     */
    deselectPoint(point: basePointObject): void;
    /**
     * @docid
     * @public
     */
    fullState?: number;
    /**
     * @docid
     * @publicName getAllPoints()
     * @public
     */
    getAllPoints(): Array<basePointObject>;
    /**
     * @docid
     * @publicName getColor()
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getPointByPos(positionIndex)
     * @public
     */
    getPointByPos(positionIndex: number): basePointObject;
    /**
     * @docid
     * @publicName getPointsByArg(pointArg)
     * @public
     */
    getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
    /**
     * @docid
     * @publicName getVisiblePoints()
     * @public
     */
    getVisiblePoints(): Array<basePointObject>;
    /**
     * @docid
     * @publicName hide()
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName hover()
     * @public
     */
    hover(): void;
    /**
     * @docid
     * @publicName isHovered()
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName isVisible()
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid
     * @public
     */
    name?: any;
    /**
     * @docid
     * @publicName select()
     * @public
     */
    select(): void;
    /**
     * @docid
     * @publicName selectPoint(point)
     * @public
     */
    selectPoint(point: basePointObject): void;
    /**
     * @docid
     * @publicName show()
     * @public
     */
    show(): void;
    /**
     * @docid
     * @public
     */
    tag?: any;
    /**
     * @docid
     * @public
     */
    type?: string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 */
export interface chartAxisObject {
    /**
     * @docid
     * @publicName visualRange()
     * @public
     */
    visualRange(): VisualRange;
    /**
     * @docid
     * @publicName visualRange(visualRange)
     * @public
     */
    visualRange(visualRange: Array<number | string | Date> | VisualRange): void;
}

/**
 * @docid
 * @publicName aggregationInfo
 * @type object
 * @namespace DevExpress.viz
 */
export interface chartPointAggregationInfoObject {
    /**
     * @docid
     * @public
     */
    aggregationInterval?: any;
    /**
     * @docid
     * @public
     */
    data?: Array<any>;
    /**
     * @docid
     * @public
     */
    intervalEnd?: any;
    /**
     * @docid
     * @public
     */
    intervalStart?: any;
}

/**
 * @docid
 * @publicName Point
 * @type object
 * @inherits basePointObject
 * @namespace DevExpress.viz
 */
export interface chartPointObject extends basePointObject {
    /**
     * @docid
     * @public
     */
    aggregationInfo?: chartPointAggregationInfoObject;
    /**
     * @docid
     * @publicName getBoundingRect()
     * @return object
     * @public
     */
    getBoundingRect(): any;
    /**
     * @docid
     * @public
     */
    originalCloseValue?: number | string;
    /**
     * @docid
     * @public
     */
    originalHighValue?: number | string;
    /**
     * @docid
     * @public
     */
    originalLowValue?: number | string;
    /**
     * @docid
     * @public
     */
    originalMinValue?: string | number | Date;
    /**
     * @docid
     * @public
     */
    originalOpenValue?: number | string;
    /**
     * @docid
     * @public
     */
    size?: number | string;
}
/**
 * @docid
 * @publicName Series
 * @type object
 * @inherits baseSeriesObject
 * @namespace DevExpress.viz
 */
export interface chartSeriesObject extends baseSeriesObject {
    /**
     * @docid
     * @public
     */
    axis?: string;
    /**
     * @docid
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid
     * @publicName getArgumentAxis()
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
     * @public
     */
    pane?: string;
    /**
     * @docid
     * @public
     */
    stack?: string;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 * @docid
 */
export interface dxChartOptions extends BaseChartOptions<dxChart> {
    /**
     * @docid
     * @default true
     * @public
     */
    adjustOnZoom?: boolean;
    /**
     * @docid
     * @inherits dxChartOptions.commonAnnotationSettings
     * @public
     */
    annotations?: Array<dxChartAnnotationConfig | any>;
    /**
     * @docid
     * @type object
     * @inherits dxChartOptions.commonAxisSettings
     * @public
     */
    argumentAxis?: ArgumentAxis;
    /**
     * @docid
     * @default true
     * @public
     */
    autoHidePointMarkers?: boolean;
    /**
     * @docid
     * @default 0.3
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barGroupWidth?: number | undefined;
    /**
     * @docid
     * @public
     */
    commonAnnotationSettings?: dxChartCommonAnnotationConfig;
    /**
     * @docid
     * @type object
     * @public
     */
    commonAxisSettings?: CommonAxisSettings;
    /**
     * @docid
     * @type object
     * @public
     */
    commonPaneSettings?: CommonPaneSettings;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
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
     * @public
     */
    crosshair?: {
      /**
       * @docid
       * @default '#f05b41'
       */
      color?: string;
      /**
       * @docid
       * @default 'solid'
       */
      dashStyle?: DashStyle;
      /**
       * @docid
       * @default false
       */
      enabled?: boolean;
      /**
       * @docid
       */
      horizontalLine?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        color?: string;
        /**
         * @docid
         * @default 'solid'
         */
        dashStyle?: DashStyle;
        /**
         * @docid
         */
        label?: {
          /**
           * @docid
           * @default "#f05b41"
           */
          backgroundColor?: string;
          /**
           * @docid
           * @notUsedInTheme
           */
          customizeText?: ((info: { value?: Date | number | string; valueText?: string; point?: chartPointObject }) => string);
          /**
           * @docid
           * @default '#FFFFFF' &prop(color)
           */
          font?: Font;
          /**
           * @docid
           * @default undefined
           */
          format?: Format | undefined;
          /**
           * @docid
           * @default false
           */
          visible?: boolean;
        };
        /**
         * @docid
         * @default undefined
         */
        opacity?: number | undefined;
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
      } | boolean;
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        backgroundColor?: string;
        /**
         * @docid
         * @notUsedInTheme
         */
        customizeText?: ((info: { value?: Date | number | string; valueText?: string; point?: chartPointObject }) => string);
        /**
         * @docid
         * @default '#FFFFFF' &prop(color)
         */
        font?: Font;
        /**
         * @docid
         * @default undefined
         */
        format?: Format | undefined;
        /**
         * @docid
         * @default false
         */
        visible?: boolean;
      };
      /**
       * @docid
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid
       */
      verticalLine?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        color?: string;
        /**
         * @docid
         * @default 'solid'
         */
        dashStyle?: DashStyle;
        /**
         * @docid
         */
        label?: {
          /**
           * @docid
           * @default "#f05b41"
           */
          backgroundColor?: string;
          /**
           * @docid
           * @notUsedInTheme
           */
          customizeText?: ((info: { value?: Date | number | string; valueText?: string; point?: chartPointObject }) => string);
          /**
           * @docid
           * @default '#FFFFFF' &prop(color)
           */
          font?: Font;
          /**
           * @docid
           * @default undefined
           */
          format?: Format | undefined;
          /**
           * @docid
           * @default false
           */
          visible?: boolean;
        };
        /**
         * @docid
         * @default undefined
         */
        opacity?: number | undefined;
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
      } | boolean;
      /**
       * @docid
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig) | undefined;
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
       * @type_function_param1 a:object
       * @type_function_param2 b:object
       * @default true
       */
      sortingMethod?: boolean | ((a: any, b: any) => number);
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    defaultPane?: string | undefined;
    /**
     * @docid
     * @type object
     * @public
     */
    legend?: Legend;
    /**
     * @docid
     * @default 0.2
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @public
     */
    maxBubbleSize?: number;
    /**
     * @docid
     * @default 12
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @public
     */
    minBubbleSize?: number;
    /**
     * @docid
     * @default false
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/chart:ArgumentAxisClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onArgumentAxisClick?: ((e: ArgumentAxisClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/chart:LegendClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{viz/chart:SeriesClickEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesClick?: ((e: SeriesClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/chart:SeriesHoverChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesHoverChanged?: ((e: SeriesHoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/chart:SeriesSelectionChangedEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesSelectionChanged?: ((e: SeriesSelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/chart:ZoomEndEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomEnd?: ((e: ZoomEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{viz/chart:ZoomStartEvent}
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomStart?: ((e: ZoomStartEvent) => void);
    /**
     * @docid
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonPaneSettings
     * @notUsedInTheme
     * @public
     */
    panes?: Panes | Array<Panes>;
    /**
     * @docid
     * @default false
     * @public
     */
    resizePanesOnZoom?: boolean;
    /**
     * @docid
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: ChartsLabelOverlap;
    /**
     * @docid
     * @default false
     * @public
     */
    rotated?: boolean;
    /**
     * @docid
     * @public
     */
    scrollBar?: {
      /**
       * @docid
       * @default 'gray'
       */
      color?: string;
      /**
       * @docid
       * @default 5
       */
      offset?: number;
      /**
       * @docid
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid
       * @default 'top'
       */
      position?: Position;
      /**
       * @docid
       * @default false
       */
      visible?: boolean;
      /**
       * @docid
       * @default 10
       */
      width?: number;
    };
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @public
     */
    series?: ChartSeries | Array<ChartSeries> | undefined;
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
      customizeSeries?: ((seriesName: any) => ChartSeries);
      /**
       * @docid
       * @default 'series'
       */
      nameField?: string;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    stickyHovering?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    synchronizeMultiAxes?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: Tooltip;
    /**
     * @docid
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonAxisSettings
     * @public
     */
    valueAxis?: ValueAxis | Array<ValueAxis>;
    /**
     * @docid
     * @public
     */
    zoomAndPan?: {
      /**
       * @docid
       * @default true
       */
      allowMouseWheel?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTouchGestures?: boolean;
      /**
       * @docid
       * @default 'none'
       */
      argumentAxis?: ChartZoomAndPanMode;
      /**
       * @docid
       */
      dragBoxStyle?: {
        /**
         * @docid
         * @default undefined
         */
        color?: string | undefined;
        /**
         * @docid
         * @default undefined
         */
        opacity?: number | undefined;
      };
      /**
       * @docid
       * @default false
       */
      dragToZoom?: boolean;
      /**
       * @docid
       * @default 'shift'
       */
      panKey?: EventKeyModifier;
      /**
       * @docid
       * @default 'none'
       */
      valueAxis?: ChartZoomAndPanMode;
    };
}
/**
 * @public
 * @docid dxChartArgumentAxis
 * @type object
 */
export type ArgumentAxis = CommonAxisSettings & {
    /**
     * @docid dxChartOptions.argumentAxis.aggregateByCategory
     * @default true
     * @deprecated dxChartSeriesTypes.CommonSeries.aggregation.enabled
     */
    aggregateByCategory?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationGroupWidth
     * @default undefined
     * @public
     */
    aggregationGroupWidth?: number | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    aggregationInterval?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.argumentAxis.argumentType
     * @default undefined
     * @public
     */
    argumentType?: ChartsDataType | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.axisDivisionFactor
     * @default 70
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.argumentAxis.breaks
     * @default undefined
     * @inherits ScaleBreak
     * @notUsedInTheme
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.argumentAxis.categories
     * @public
     * @fires BaseWidgetOptions.onOptionChanged
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: ArgumentAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines
     * @type Array<Object>
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @public
     */
    constantLines?: Array<ArgumentAxisConstantLines>;
    /**
     * @docid dxChartOptions.argumentAxis.endOnTick
     * @default false
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.holidays
     * @default undefined
     * @public
     */
    holidays?: Array<Date | string> | Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.hoverMode
     * @default 'none'
     * @public
     */
    hoverMode?: ArgumentAxisHoverMode;
    /**
     * @docid dxChartOptions.argumentAxis.label
     * @type object
     * @public
     */
    label?: ArgumentAxisLabel;
    /**
     * @docid dxChartOptions.argumentAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.logarithmBase
     * @default 10
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval|undefined
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.argumentAxis.position
     * @default 'bottom'
     * @public
     */
    position?: Position;
    /**
     * @docid dxChartOptions.argumentAxis.customPosition
     * @default undefined
     * @public
     */
    customPosition?: number | Date | string | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.customPositionAxis
     * @default undefined
     * @public
     */
    customPositionAxis?: string | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.offset
     * @default undefined
     * @public
     */
    offset?: number | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.singleWorkdays
     * @default undefined
     * @public
     */
    singleWorkdays?: Array<Date | string> | Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<ArgumentAxisStrips>;
    /**
     * @docid dxChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.argumentAxis.title
     * @type string|object
     * @public
     */
    title?: ArgumentAxisTitle;
    /**
     * @docid dxChartOptions.argumentAxis.type
     * @default undefined
     * @public
     */
    type?: AxisScaleType | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VisualRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.visualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: VisualRangeUpdateMode;
    /**
     * @docid dxChartOptions.argumentAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VisualRange | Array<number | string | Date> | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.workWeek
     * @default [1, 2, 3, 4, 5]
     * @public
     */
    workWeek?: Array<number>;
    /**
     * @docid dxChartOptions.argumentAxis.workdaysOnly
     * @default false
     * @public
     */
    workdaysOnly?: boolean;
};
/**
 * @public
 * @docid dxChartArgumentAxisConstantLineStyle
 * @type object
 */
export type ArgumentAxisConstantLineStyle = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label
     * @type object
     * @public
     */
    label?: ArgumentAxisConstantLineStyleLabel;
};
/**
 * @public
 * @docid dxChartArgumentAxisConstantLineStyleLabel
 * @type object
 */
export type ArgumentAxisConstantLineStyleLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.horizontalAlignment
     * @default 'right'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.verticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: VerticalAlignment;
};
/**
 * @public
 * @docid dxChartArgumentAxisConstantLines
 * @type object
 */
export type ArgumentAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.displayBehindSeries
     * @default false
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.extendAxis
     * @default false
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label
     * @type object
     * @public
     */
    label?: ArgumentAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxChartArgumentAxisConstantLinesLabel
 * @type object
 */
export type ArgumentAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.horizontalAlignment
     * @default 'right'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.verticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: VerticalAlignment;
};
/**
 * @public
 * @docid dxChartArgumentAxisLabel
 * @type object
 */
export type ArgumentAxisLabel = CommonAxisSettingsLabel & {
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeHint
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
};
/**
 * @public
 * @docid dxChartArgumentAxisStrips
 * @type object
 */
export type ArgumentAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * @docid dxChartOptions.argumentAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string | undefined;
    /**
     * @docid dxChartOptions.argumentAxis.strips.label
     * @type object
     * @public
     */
    label?: ArgumentAxisStripsLabel;
    /**
     * @docid dxChartOptions.argumentAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxChartArgumentAxisStripsLabel
 * @type object
 */
export type ArgumentAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * @docid dxChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxChartArgumentAxisTitle
 * @type object
 */
export type ArgumentAxisTitle = CommonAxisSettingsTitle & {
    /**
     * @docid dxChartOptions.argumentAxis.title.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxChartCommonAxisSettings
 * @type object
 */
export type CommonAxisSettings = {
    /**
     * @docid dxChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @public
     */
    allowDecimals?: boolean | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.breakStyle
     * @public
     */
    breakStyle?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.color
       * @default "#ababab"
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.line
       * @default "waved"
       */
      line?: ScaleBreakLineStyle;
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.width
       * @default 5
       */
      width?: number;
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.color
     * @default '#767676'
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: CommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @default 'betweenLabels'
     * @public
     */
    discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
    /**
     * @docid dxChartOptions.commonAxisSettings.aggregatedPointsPosition
     * @default 'betweenTicks'
     * @public
     */
     aggregatedPointsPosition?: AggregatedPointsPosition;
    /**
     * @docid dxChartOptions.commonAxisSettings.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.grid
     * @public
     */
    grid?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.inverted
     * @default false
     * @public
     */
    inverted?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.maxValueMargin
     * @default undefined
     * @public
     */
    maxValueMargin?: number | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.minValueMargin
     * @default undefined
     * @public
     */
    minValueMargin?: number | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.minorGrid
     * @public
     */
    minorGrid?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.minorTick
     * @public
     */
    minorTick?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.color
       * @default '#767676'
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.length
       * @default 7
       */
      length?: number;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.opacity
       * @default 0.3
       */
      opacity?: number;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.shift
       * @default 3
       */
      shift?: number;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @public
     */
    opacity?: number | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.placeholderSize
     * @default null
     * @public
     */
    placeholderSize?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle
     * @type object
     * @public
     */
    stripStyle?: CommonAxisSettingsStripStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.tick
     * @public
     */
    tick?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.color
       * @default '#767676'
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.length
       * @default 7
       */
      length?: number;
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.shift
       * @default 3
       */
      shift?: number;
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.visible
       * @default true
       */
      visible?: boolean;
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.title
     * @type object
     * @public
     */
    title?: CommonAxisSettingsTitle;
    /**
     * @docid dxChartOptions.commonAxisSettings.valueMarginsEnabled
     * @default true
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsConstantLineStyle
 */
export type CommonAxisSettingsConstantLineStyle = {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.color
     * @default '#000000'
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingLeftRight
     * @default 10
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.paddingTopBottom
     * @default 10
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.width
     * @default 1
     * @public
     */
    width?: number;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsConstantLineStyleLabel
 */
export type CommonAxisSettingsConstantLineStyleLabel = {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.position
     * @default 'inside'
     * @public
     */
    position?: RelativePosition;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsLabel
 */
export type CommonAxisSettingsLabel = {
    /**
     * @docid dxChartOptions.commonAxisSettings.label.template
     * @default undefined
     * @type_function_param1_field value:Date|Number|string
     * @type_function_param1_field valueText:string
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((data: object, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.alignment
     * @default undefined
     * @public
     */
    alignment?: HorizontalAlignment | undefined;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.displayMode
     * @default 'standard'
     * @public
     */
    displayMode?: ChartLabelDisplayMode;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.indentFromAxis
     * @default 10
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.overlappingBehavior
     * @default 'hide'
     * @public
     */
    overlappingBehavior?: ChartsAxisLabelOverlap;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.position
     * @default 'outside'
     * @public
     */
    position?: RelativePosition | Position;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.rotationAngle
     * @default 90
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.staggeringSpacing
     * @default 5
     * @public
     */
    staggeringSpacing?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.textOverflow
     * @default "none"
     * @public
     */
    textOverflow?: TextOverflow;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.wordWrap
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrap;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsStripStyle
 */
export type CommonAxisSettingsStripStyle = {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @public
     */
    label?: CommonAxisSettingsStripStyleLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.paddingLeftRight
     * @default 10
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.paddingTopBottom
     * @default 5
     * @public
     */
    paddingTopBottom?: number;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsStripStyleLabel
 */
export type CommonAxisSettingsStripStyleLabel = {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.font
     * @default '#767676' &prop(color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.horizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.verticalAlignment
     * @default 'center'
     * @public
     */
    verticalAlignment?: VerticalAlignment;
};
/**
 * @public
 * @docid dxChartCommonAxisSettingsTitle
 */
export type CommonAxisSettingsTitle = {
    /**
     * @docid dxChartOptions.commonAxisSettings.title.alignment
     * @default 'center'
     * @public
     */
    alignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.font
     * @default '#767676' &prop(color)
     * @default 16 &prop(size)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.margin
     * @default 6
     * @public
     */
    margin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.textOverflow
     * @default "ellipsis"
     * @public
     */
    textOverflow?: TextOverflow;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.wordWrap
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrap;
};
/**
 * @public
 * @docid dxChartCommonPaneSettings
 */
export type CommonPaneSettings = {
    /**
     * @docid dxChartOptions.commonPaneSettings.backgroundColor
     * @default 'none'
     * @public
     */
    backgroundColor?: string | ChartsColor;
    /**
     * @docid dxChartOptions.commonPaneSettings.border
     * @public
     */
    border?: {
      /**
       * @docid dxChartOptions.commonPaneSettings.border.bottom
       * @default true
       */
      bottom?: boolean;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.color
       * @default '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.dashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyle;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.left
       * @default true
       */
      left?: boolean;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.right
       * @default true
       */
      right?: boolean;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.top
       * @default true
       */
      top?: boolean;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxChartOptions.commonPaneSettings.border.width
       * @default 1
       */
      width?: number;
    };
};
/**
 * @public
 * @docid dxChartCommonSeriesSettings
 * @type object
 */
export type CommonSeriesSettings = dxChartSeriesTypesCommonSeries & {
    /**
     * @docid dxChartOptions.commonSeriesSettings.area
     * @public
     */
    area?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bar
     * @public
     */
    bar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.bubble
     * @public
     */
    bubble?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.candlestick
     * @public
     */
    candlestick?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedarea
     * @public
     */
    fullstackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedbar
     * @public
     */
    fullstackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedline
     * @public
     */
    fullstackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedspline
     * @public
     */
    fullstackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.fullstackedsplinearea
     * @public
     */
    fullstackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.line
     * @public
     */
    line?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangearea
     * @public
     */
    rangearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.rangebar
     * @public
     */
    rangebar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.scatter
     * @public
     */
    scatter?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.spline
     * @public
     */
    spline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.splinearea
     * @public
     */
    splinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedarea
     * @public
     */
    stackedarea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedbar
     * @public
     */
    stackedbar?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedline
     * @public
     */
    stackedline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedspline
     * @public
     */
    stackedspline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stackedsplinearea
     * @public
     */
    stackedsplinearea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.steparea
     * @public
     */
    steparea?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stepline
     * @public
     */
    stepline?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.stock
     * @public
     */
    stock?: any;
    /**
     * @docid dxChartOptions.commonSeriesSettings.type
     * @default 'line'
     * @type Enums.SeriesType
     * @public
     */
    type?: SeriesType;
};
/**
 * @public
 * @docid dxChartLegend
 */
export type Legend = BaseChartLegend & {
    /**
     * @docid dxChartOptions.legend.customizeHint
     * @public
     */
    customizeHint?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.hoverMode
     * @default 'includePoints'
     * @public
     */
    hoverMode?: LegendHoverMode;
    /**
     * @docid dxChartOptions.legend.position
     * @default 'outside'
     * @public
     */
    position?: RelativePosition;
};
/**
 * @public
 * @docid dxChartPanes
 * @type object
 */
export type Panes = CommonPaneSettings & {
    /**
     * @docid dxChartOptions.panes.height
     * @default undefined
     * @public
     */
    height?: number | string | undefined;
    /**
     * @docid dxChartOptions.panes.name
     * @default undefined
     * @public
     */
    name?: string | undefined;
};
/**
 * @bublic
 * @docid dxChartTooltip
 */
export type Tooltip = BaseChartTooltip & {
    /**
     * @docid dxChartOptions.tooltip.location
     * @default 'center'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @public
     */
    location?: ChartTooltipLocation;
};
/**
 * @public
 * @docid dxChartValueAxis
 * @type object
 */
export type ValueAxis = CommonAxisSettings & {
    /**
     * @docid dxChartOptions.valueAxis.autoBreaksEnabled
     * @default false
     * @public
     */
    autoBreaksEnabled?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.axisDivisionFactor
     * @default 40
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxChartOptions.valueAxis.breaks
     * @inherits ScaleBreak
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    breaks?: Array<ScaleBreak>;
    /**
     * @docid dxChartOptions.valueAxis.categories
     * @public
     * @fires BaseWidgetOptions.onOptionChanged
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: ValueAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.valueAxis.constantLines
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @public
     */
    constantLines?: Array<ValueAxisConstantLines>;
    /**
     * @docid dxChartOptions.valueAxis.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean | undefined;
    /**
     * @docid dxChartOptions.valueAxis.label
     * @type object
     * @public
     */
    label?: ValueAxisLabel;
    /**
     * @docid dxChartOptions.valueAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number | undefined;
    /**
     * @docid dxChartOptions.valueAxis.logarithmBase
     * @default 10
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.valueAxis.maxAutoBreakCount
     * @default 4
     * @public
     */
    maxAutoBreakCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval|undefined
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number | undefined;
    /**
     * @docid dxChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.valueAxis.multipleAxesSpacing
     * @default 5
     * @public
     */
    multipleAxesSpacing?: number;
    /**
     * @docid dxChartOptions.valueAxis.name
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    name?: string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.pane
     * @default undefined
     * @public
     */
    pane?: string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.position
     * @default 'left'
     * @public
     */
    position?: Position;
    /**
     * @docid dxChartOptions.valueAxis.customPosition
     * @default undefined
     * @public
     */
    customPosition?: number | Date | string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.offset
     * @default undefined
     * @public
     */
    offset?: number | undefined;
    /**
     * @docid dxChartOptions.valueAxis.showZero
     * @default undefined
     * @public
     */
    showZero?: boolean | undefined;
    /**
     * @docid dxChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<ValueAxisStrips>;
    /**
     * @docid dxChartOptions.valueAxis.synchronizedValue
     * @default undefined
     * @public
     */
    synchronizedValue?: number | undefined;
    /**
     * @docid dxChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.TimeInterval
     * @public
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * @docid dxChartOptions.valueAxis.title
     * @type string|object
     * @public
     */
    title?: ValueAxisTitle;
    /**
     * @docid dxChartOptions.valueAxis.type
     * @default undefined
     * @public
     */
    type?: AxisScaleType | undefined;
    /**
     * @docid dxChartOptions.valueAxis.valueType
     * @default undefined
     * @public
     */
    valueType?: ChartsDataType | undefined;
    /**
     * @docid dxChartOptions.valueAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VisualRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.visualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: VisualRangeUpdateMode;
    /**
     * @docid dxChartOptions.valueAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VisualRange | Array<number | string | Date> | undefined;
};
/**
 * @public
 * @docid dxChartValueAxisConstantLineStyle
 * @type object
 */
export type ValueAxisConstantLineStyle = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label
     * @type object
     * @public
     */
    label?: ValueAxisConstantLineStyleLabel;
};
/**
 * @public
 * @docid dxChartValueAxisConstantLineStyleLabel
 * @type object
 */
export type ValueAxisConstantLineStyleLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.horizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.verticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: VerticalAlignment;
};
/**
 * @public
 * @docid dxChartValueAxisConstantLines
 * @type object
 */
export type ValueAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * @docid dxChartOptions.valueAxis.constantLines.displayBehindSeries
     * @default false
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.extendAxis
     * @default false
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label
     * @type object
     * @public
     */
    label?: ValueAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxChartValueAxisConstantLinesLabel
 * @type object
 */
export type ValueAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.horizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.verticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: VerticalAlignment;
};
/**
 * @public
 * @docid dxChartValueAxisLabel
 * @type object
 */
export type ValueAxisLabel = CommonAxisSettingsLabel & {
    /**
     * @docid dxChartOptions.valueAxis.label.customizeHint
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.format
     * @default undefined
     * @public
     */
    format?: Format | undefined;
};
/**
 * @public
 * @docid dxChartValueAxisStrips
 * @type object
 */
export type ValueAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * @docid dxChartOptions.valueAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string | undefined;
    /**
     * @docid dxChartOptions.valueAxis.strips.label
     * @type object
     * @public
     */
    label?: ValueAxisStripsLabel;
    /**
     * @docid dxChartOptions.valueAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string | undefined;
};
/**
 * @public
 * @docid dxChartValueAxisStripsLabel
 * @type object
 */
export type ValueAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * @docid dxChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @public
 * @docid dxChartValueAxisTitle
 * @type object
 */
export type ValueAxisTitle = CommonAxisSettingsTitle & {
    /**
     * @docid dxChartOptions.valueAxis.title.text
     * @default undefined
     * @public
     */
    text?: string | undefined;
};
/**
 * @docid
 * @inherits BaseChart
 * @namespace DevExpress.viz
 * @public
 */
export default class dxChart extends BaseChart<dxChartOptions> {
    /**
     * @docid
     * @publicName getArgumentAxis()
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis(name)
     * @public
     */
    getValueAxis(name: string): chartAxisObject;
    /**
     * @docid
     * @publicName resetVisualRange()
     * @public
     */
    resetVisualRange(): void;
    /**
     * @docid
     * @publicName zoomArgument(startValue,endValue)
     * @public
     */
    zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
}

/**
 * @docid
 * @type object
 * @inherits dxChartCommonAnnotationConfig
 * @namespace DevExpress.viz
 */
export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
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
export interface dxChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @public
     */
    axis?: string | undefined;
    /**
     * @docid
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any) | undefined;
    /**
     * @docid
     * @default undefined
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 */
export interface dxChartSeriesTypes {
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    AreaSeries?: dxChartSeriesTypesAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    BarSeries?: dxChartSeriesTypesBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    BubbleSeries?: dxChartSeriesTypesBubbleSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
    /**
     * @docid
     * @type object
     * @hidden
     */
    CommonSeries?: dxChartSeriesTypesCommonSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    LineSeries?: dxChartSeriesTypesLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    ScatterSeries?: dxChartSeriesTypesScatterSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    SplineSeries?: dxChartSeriesTypesSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StepLineSeries?: dxChartSeriesTypesStepLineSeries;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @public
     */
    StockSeries?: dxChartSeriesTypesStockSeries;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.AreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.BarSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.BarSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.BarSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.BarSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BarSeries.aggregation.method
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBarSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesBubbleSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartBubbleSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBubbleSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.argumentField
     * @default 'date'
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle
     * @type object
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesCandleStickSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle
     * @type object
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.aggregation.method
     * @default 'ohlc'
     * @public
     */
    method?: ChartFinancialSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching
     * @type object
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction
     * @default 'none'
     * @public
     */
    direction?: HatchDirection;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching
     * @type object
     * @public
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction
     * @default 'none'
     * @public
     */
    direction?: HatchDirection;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.argumentField
     * @default 'arg'
     * @notUsedInTheme
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.axis
     * @default undefined
     * @public
     */
    axis?: string | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barOverlapGroup
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barOverlapGroup?: string | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barPadding
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barPadding?: number | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barWidth
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barWidth?: number | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.closeValueField
     * @default 'close'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @public
     */
    closeValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.color
     * @default undefined
     * @public
     */
    color?: string | ChartsColor | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.cornerRadius
     * @default 0
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.dashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.highValueField
     * @default 'high'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @public
     */
    highValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverMode
     * @public
     */
    hoverMode?: SeriesHoverMode;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle
     * @type object
     * @public
     */
    hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints
     * @default false
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.innerColor
     * @default '#ffffff'
     * @propertyOf dxChartSeriesTypes.CandleStickSeries
     * @public
     */
    innerColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label
     * @type object
     * @public
     */
    label?: SeriesLabel;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.lowValueField
     * @default 'low'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @public
     */
    lowValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.maxLabelCount
     * @default undefined
     * @public
     */
    maxLabelCount?: number | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.minBarSize
     * @default undefined
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    minBarSize?: number | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.opacity
     * @default 0.5
     * @propertyOf dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.openValueField
     * @default 'open'
     * @propertyOf dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @notUsedInTheme
     * @public
     */
    openValueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.pane
     * @default 'default'
     * @public
     */
    pane?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point
     * @type object
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    point?: SeriesPoint;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.rangeValue1Field
     * @default 'val1'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @public
     */
    rangeValue1Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.rangeValue2Field
     * @default 'val2'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries
     * @public
     */
    rangeValue2Field?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.reduction
     * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @public
     */
    reduction?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.reduction.color
       * @default '#ff0000'
       * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
       */
      color?: string;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.reduction.level
       * @default 'close'
       * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
       */
      level?: FinancialChartReductionLevel;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionMode
     * @public
     */
    selectionMode?: SeriesSelectionMode;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle
     * @type object
     * @public
     */
    selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.showInLegend
     * @default true
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.sizeField
     * @default 'size'
     * @propertyOf dxChartSeriesTypes.BubbleSeries
     * @public
     */
    sizeField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.stack
     * @default 'default'
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries
     * @public
     */
    stack?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.tagField
     * @default 'tag'
     * @notUsedInTheme
     * @public
     */
    tagField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    valueErrorBar?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.color
       * @default 'black'
       */
      color?: string;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.displayMode
       * @default 'auto'
       */
      displayMode?: ValueErrorBarDisplayMode;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.edgeLength
       * @default 8
       */
      edgeLength?: number;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.highValueField
       * @default undefined
       */
      highValueField?: string | undefined;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lineWidth
       * @default 2
       */
      lineWidth?: number;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lowValueField
       * @default undefined
       */
      lowValueField?: string | undefined;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.opacity
       * @default undefined
       */
      opacity?: number | undefined;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.type
       * @default undefined
       */
      type?: ValueErrorBarType | undefined;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.value
       * @default 1
       */
      value?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.valueField
     * @default 'val'
     * @notUsedInTheme
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    valueField?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.width
     * @default 2
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.calculate
     * @type_function_return object|Array<object>
     * @default undefined
     * @public
     */
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>) | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.method
     * @public
     */
    method?: ChartSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.color
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.dashStyle
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    dashStyle?: DashStyle | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.visible
     * @default false
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.width
     * @default 2
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.color
     * @default undefined
     * @public
     */
    color?: string | ChartsColor | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.width
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @public
     */
    width?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.highlight
     * @default true
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     */
    highlight?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyle | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible
     * @default false
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.width
     * @default 3
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction
     * @default 'right'
     * @public
     */
    direction?: HatchDirection;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity
     * @default 0.75
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step
     * @default 6
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width
     * @default 2
     * @public
     */
    width?: number;
}

/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.color
     * @default undefined
     * @public
     */
    color?: string | ChartsColor | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyle;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching
     * @type object
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.width
     * @default 3
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
     * @public
     */
    width?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.highlight
     * @default true
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     */
    highlight?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.color
     * @default undefined
     * @public
     */
    color?: string | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyle | undefined;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible
     * @default false
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.width
     * @default 3
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction
     * @default 'right'
     * @public
     */
    direction?: HatchDirection;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity
     * @default 0.5
     * @public
     */
    opacity?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step
     * @default 6
     * @public
     */
    step?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width
     * @default 2
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.aggregation.method
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedBarSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.position
     * @default 'inside'
     * @public
     */
    position?: RelativePosition;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedLineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.LineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.LineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.LineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.LineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.LineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesLineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.LineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesRangeAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesRangeAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.aggregation.method
     * @default 'range'
     * @public
     */
    method?: ChartRangeSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesRangeBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.aggregation.method
     * @default 'range'
     * @public
     */
    method?: ChartRangeSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeBarSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesScatterSeriesLabel;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesScatterSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.SplineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.SplineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStackedAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesStackedAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStackedBarSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.aggregation.method
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedBarSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.position
     * @default 'inside'
     * @public
     */
    position?: RelativePosition;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStackedLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedLineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStackedSplineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.border
     * @type object
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesBorder;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle
     * @type object
     * @public
     */
    hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStepAreaSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.point
     * @type object
     * @public
     */
    point?: dxChartSeriesTypesStepAreaSeriesPoint;
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle
     * @type object
     * @public
     */
    selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.border.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle.border
     * @type object
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesPoint extends SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.point.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle.border
     * @type object
     * @public
     */
    border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.hoverMode
     * @default 'nearestPoint'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStepLineSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.selectionMode
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.aggregation.method
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepLineSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid dxChartSeriesTypes.StockSeries.aggregation
     * @type object
     * @public
     */
    aggregation?: dxChartSeriesTypesStockSeriesAggregation;
    /**
     * @docid dxChartSeriesTypes.StockSeries.argumentField
     * @default 'date'
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxChartSeriesTypes.StockSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartSeriesTypes.StockSeries.label
     * @type object
     * @public
     */
    label?: dxChartSeriesTypesStockSeriesLabel;
    /**
     * @docid dxChartSeriesTypes.StockSeries.selectionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StockSeries.aggregation.method
     * @default 'ohlc'
     * @public
     */
    method?: ChartFinancialSeriesAggregationMethod;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStockSeriesLabel extends SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StockSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}

/** @public */
export type Properties = dxChartOptions;

/** @deprecated use Properties instead */
export type Options = dxChartOptions;

// #region deprecated in v23.1

    /** @deprecated Use ArgumentAxis instead */
    export type dxChartArgumentAxis = ArgumentAxis;

    /** @deprecated Use ArgumentAxisConstantLines instead */
    export type dxChartArgumentAxisConstantLines = ArgumentAxisConstantLines;

    /** @deprecated Use ArgumentAxisConstantLinesLabel instead */
    export type dxChartArgumentAxisConstantLinesLabel = ArgumentAxisConstantLinesLabel;

    /** @deprecated Use ArgumentAxisConstantLineStyle instead */
    export type dxChartArgumentAxisConstantLineStyle = ArgumentAxisConstantLineStyle;

    /** @deprecated Use ArgumentAxisConstantLineStyleLabel instead */
    export type dxChartArgumentAxisConstantLineStyleLabel = ArgumentAxisConstantLineStyleLabel;

    /** @deprecated Use ArgumentAxisLabel instead */
    export type dxChartArgumentAxisLabel = ArgumentAxisLabel;

    /** @deprecated Use ArgumentAxisStrips instead */
    export type dxChartArgumentAxisStrips = ArgumentAxisStrips;

    /** @deprecated Use ArgumentAxisStripsLabel instead */
    export type dxChartArgumentAxisStripsLabel = ArgumentAxisStripsLabel;

    /** @deprecated Use ArgumentAxisTitle instead */
    export type dxChartArgumentAxisTitle = ArgumentAxisTitle;

    /** @deprecated Use CommonAxisSettings instead */
    export type dxChartCommonAxisSettings = CommonAxisSettings;

    /** @deprecated Use CommonAxisSettingsConstantLineStyle instead */
    export type dxChartCommonAxisSettingsConstantLineStyle = CommonAxisSettingsConstantLineStyle;

    /** @deprecated Use CommonAxisSettingsConstantLineStyleLabel instead */
    export type dxChartCommonAxisSettingsConstantLineStyleLabel = CommonAxisSettingsConstantLineStyleLabel;

    /** @deprecated Use CommonAxisSettingsLabel instead */
    export type dxChartCommonAxisSettingsLabel = CommonAxisSettingsLabel;

    /** @deprecated Use CommonAxisSettingsStripStyle instead */
    export type dxChartCommonAxisSettingsStripStyle = CommonAxisSettingsStripStyle;

    /** @deprecated Use CommonAxisSettingsStripStyleLabel instead */
    export type dxChartCommonAxisSettingsStripStyleLabel = CommonAxisSettingsStripStyleLabel;

    /** @deprecated Use CommonAxisSettingsTitle instead */
    export type dxChartCommonAxisSettingsTitle = CommonAxisSettingsTitle;

    /** @deprecated Use CommonPaneSettings instead */
    export type dxChartCommonPaneSettings = CommonPaneSettings;

    /** @deprecated Use CommonSeriesSettings instead */
    export type dxChartCommonSeriesSettings = CommonSeriesSettings;

    /** @deprecated Use Legend instead */
    export type dxChartLegend = Legend;

    /** @deprecated Use Panes instead */
    export type dxChartPanes = Panes;

    /** @deprecated Use Tooltip instead */
    export type dxChartTooltip = Tooltip;

    /** @deprecated Use ValueAxis instead */
    export type dxChartValueAxis = ValueAxis;

    /** @deprecated Use ValueAxisConstantLines instead */
    export type dxChartValueAxisConstantLines = ValueAxisConstantLines;

    /** @deprecated Use ValueAxisConstantLinesLabel instead */
    export type dxChartValueAxisConstantLinesLabel = ValueAxisConstantLinesLabel;

    /** @deprecated Use ValueAxisConstantLineStyle instead */
    export type dxChartValueAxisConstantLineStyle = ValueAxisConstantLineStyle;

    /** @deprecated Use ValueAxisConstantLineStyleLabel instead */
    export type dxChartValueAxisConstantLineStyleLabel = ValueAxisConstantLineStyleLabel;

    /** @deprecated Use ValueAxisLabel instead */
    export type dxChartValueAxisLabel = ValueAxisLabel;

    /** @deprecated Use ValueAxisStrips instead */
    export type dxChartValueAxisStrips = ValueAxisStrips;

    /** @deprecated Use ValueAxisStripsLabel instead */
    export type dxChartValueAxisStripsLabel = ValueAxisStripsLabel;

    /** @deprecated Use ValueAxisTitle instead */
    export type dxChartValueAxisTitle = ValueAxisTitle;

// #endregion

// #region deprecated in 22.2

/**
 * @namespace DevExpress.viz
 * @deprecated Use SeriesPoint from common/charts instead
 */
export type dxChartSeriesTypesCommonSeriesPoint = SeriesPoint;
/**
 * @namespace DevExpress.viz
 * @deprecated Use SeriesLabel from common/charts instead
 */
export type dxChartSeriesTypesCommonSeriesLabel = SeriesLabel;

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
 * @docid dxChartOptions.onDisposing
 * @type_function_param1 e:{viz/chart:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxChartOptions.onDone
 * @type_function_param1 e:{viz/chart:DoneEvent}
 */
onDone?: ((e: DoneEvent) => void);
/**
 * @docid dxChartOptions.onDrawn
 * @type_function_param1 e:{viz/chart:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxChartOptions.onExported
 * @type_function_param1 e:{viz/chart:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxChartOptions.onExporting
 * @type_function_param1 e:{viz/chart:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxChartOptions.onFileSaving
 * @type_function_param1 e:{viz/chart:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxChartOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/chart:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxChartOptions.onInitialized
 * @type_function_param1 e:{viz/chart:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxChartOptions.onOptionChanged
 * @type_function_param1 e:{viz/chart:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxChartOptions.onPointClick
 * @type_function_param1 e:{viz/chart:PointClickEvent}
 */
onPointClick?: ((e: PointClickEvent) => void);
/**
 * @docid dxChartOptions.onPointHoverChanged
 * @type_function_param1 e:{viz/chart:PointHoverChangedEvent}
 */
onPointHoverChanged?: ((e: PointHoverChangedEvent) => void);
/**
 * @docid dxChartOptions.onPointSelectionChanged
 * @type_function_param1 e:{viz/chart:PointSelectionChangedEvent}
 */
onPointSelectionChanged?: ((e: PointSelectionChangedEvent) => void);
/**
 * @docid dxChartOptions.onTooltipHidden
 * @type_function_param1 e:{viz/chart:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxChartOptions.onTooltipShown
 * @type_function_param1 e:{viz/chart:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
