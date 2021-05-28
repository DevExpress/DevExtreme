import {
    UserDefinedElement,
    DxElement
} from '../core/element';

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
    template
} from '../core/templates/template';

import {
    BaseChart,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig,
    PointInteractionInfo,
    TooltipInfo
} from './chart_components/base_chart';

import {
    ChartSeries,
    ScaleBreak,
    VizRange,
    ChartSeriesType,
    DashStyleType,
    HatchingDirectionType,
    VizTimeInterval
} from './common';

import {
    Font,
    WordWrapType,
    VizTextOverflowType,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

export type ChartSingleValueSeriesAggregationMethodType = 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';

interface SeriesInteractionInfo {
    target: chartSeriesObject;
}

/** @public */
export type ArgumentAxisClickEvent = NativeEventInfo<dxChart> & {
    readonly argument: Date | number | string;
}

/** @public */
export type DisposingEvent = EventInfo<dxChart>;

/** @public */
export type DoneEvent = EventInfo<dxChart>;

/** @public */
export type DrawnEvent = EventInfo<dxChart>;

/** @public */
export type ExportedEvent = EventInfo<dxChart>;

/** @public */
export type ExportingEvent = EventInfo<dxChart> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxChart>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxChart> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxChart>;

/** @public */
export type LegendClickEvent  = NativeEventInfo<dxChart> & {
    readonly target: chartSeriesObject;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxChart> & ChangedOptionInfo;

/** @public */
export type PointClickEvent = NativeEventInfo<dxChart> & PointInteractionInfo;

/** @public */
export type PointHoverChangedEvent = EventInfo<dxChart> & PointInteractionInfo;

/** @public */
export type PointSelectionChangedEvent = EventInfo<dxChart> & PointInteractionInfo;

/** @public */
export type SeriesClickEvent = NativeEventInfo<dxChart> & {
    readonly target: chartSeriesObject;
}

/** @public */
export type SeriesHoverChangedEvent = EventInfo<dxChart> & SeriesInteractionInfo;

/** @public */
export type SeriesSelectionChangedEvent = EventInfo<dxChart> & SeriesInteractionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxChart> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxChart> & TooltipInfo;

/** @public */
export type ZoomEndEvent = Cancelable & NativeEventInfo<dxChart> & {
    readonly rangeStart: Date | number;
    readonly rangeEnd: Date | number;
    readonly axis: chartAxisObject;
    readonly range: VizRange;
    readonly previousRange: VizRange;
    readonly actionType: 'zoom' | 'pan';
    readonly zoomFactor: number;
    readonly shift: number;
}

/** @public */
export type ZoomStartEvent = Cancelable & NativeEventInfo<dxChart> & {
    readonly axis: chartAxisObject;
    readonly range: VizRange;
    readonly actionType?: 'zoom' | 'pan';
}

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
     * @publicName hide()
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName hide(holdInvisible)
     * @param1 holdInvisible:boolean
     * @public
     */
    hide(holdInvisible: boolean): void;
    /**
     * @docid
     * @publicName isVisible()
     * @return boolean
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
     * @param1 holdVisible:boolean
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
     * @return string
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getLabel()
     * @return baseLabelObject|Array<baseLabelObject>
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
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
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
     * @param1 point:basePointObject
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
     * @return Array<basePointObject>
     * @public
     */
    getAllPoints(): Array<basePointObject>;
    /**
     * @docid
     * @publicName getColor()
     * @return string
     * @public
     */
    getColor(): string;
    /**
     * @docid
     * @publicName getPointByPos(positionIndex)
     * @param1 positionIndex:number
     * @return basePointObject
     * @public
     */
    getPointByPos(positionIndex: number): basePointObject;
    /**
     * @docid
     * @publicName getPointsByArg(pointArg)
     * @param1 pointArg:number|string|date
     * @return Array<basePointObject>
     * @public
     */
    getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
    /**
     * @docid
     * @publicName getVisiblePoints()
     * @return Array<basePointObject>
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
     * @return boolean
     * @public
     */
    isHovered(): boolean;
    /**
     * @docid
     * @publicName isSelected()
     * @return boolean
     * @public
     */
    isSelected(): boolean;
    /**
     * @docid
     * @publicName isVisible()
     * @return boolean
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
     * @param1 point:basePointObject
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
     * @return VizRange
     * @public
     */
    visualRange(): VizRange;
    /**
     * @docid
     * @publicName visualRange(visualRange)
     * @param1 visualRange:Array<number,string,Date> | VizRange
     * @public
     */
    visualRange(visualRange: Array<number | string | Date> | VizRange): void;
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
     * @return chartAxisObject
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @return chartAxisObject
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
    argumentAxis?: dxChartArgumentAxis;
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
    barGroupWidth?: number;
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
    commonAxisSettings?: dxChartCommonAxisSettings;
    /**
     * @docid
     * @type object
     * @public
     */
    commonPaneSettings?: dxChartCommonPaneSettings;
    /**
     * @docid
     * @type object
     * @inherits dxChartSeriesTypes.CommonSeries
     * @hideDefaults true
     * @inheritAll
     * @public
     */
    commonSeriesSettings?: dxChartCommonSeriesSettings;
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
      color?: string,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       */
      horizontalLine?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        color?: string,
        /**
         * @docid
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid
         */
        label?: {
          /**
           * @docid
           * @default "#f05b41"
           */
          backgroundColor?: string,
          /**
           * @docid
           * @type_function_param1 info:object
           * @type_function_param1_field1 value:Date|Number|string
           * @type_function_param1_field2 valueText:string
           * @type_function_param1_field3 point:chartPointObject
           * @type_function_return string
           * @notUsedInTheme
           */
          customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
          /**
           * @docid
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
           * @docid
           * @extends CommonVizFormat
           */
          format?: format,
          /**
           * @docid
           * @default false
           */
          visible?: boolean
        },
        /**
         * @docid
         * @default undefined
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
      } | boolean,
      /**
       * @docid
       */
      label?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        backgroundColor?: string,
        /**
         * @docid
         * @type_function_param1 info:object
         * @type_function_param1_field1 value:Date|Number|string
         * @type_function_param1_field2 valueText:string
         * @type_function_param1_field3 point:chartPointObject
         * @type_function_return string
         * @notUsedInTheme
         */
        customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
        /**
         * @docid
         * @default '#FFFFFF' [prop](color)
         */
        font?: Font,
        /**
         * @docid
         * @extends CommonVizFormat
         */
        format?: format,
        /**
         * @docid
         * @default false
         */
        visible?: boolean
      },
      /**
       * @docid
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       */
      verticalLine?: {
        /**
         * @docid
         * @default "#f05b41"
         */
        color?: string,
        /**
         * @docid
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid
         */
        label?: {
          /**
           * @docid
           * @default "#f05b41"
           */
          backgroundColor?: string,
          /**
           * @docid
           * @type_function_param1 info:object
           * @type_function_param1_field1 value:Date|Number|string
           * @type_function_param1_field2 valueText:string
           * @type_function_param1_field3 point:chartPointObject
           * @type_function_return string
           * @notUsedInTheme
           */
          customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string),
          /**
           * @docid
           * @default '#FFFFFF' [prop](color)
           */
          font?: Font,
          /**
           * @docid
           * @extends CommonVizFormat
           */
          format?: format,
          /**
           * @docid
           * @default false
           */
          visible?: boolean
        },
        /**
         * @docid
         * @default undefined
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
      } | boolean,
      /**
       * @docid
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return dxChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
    /**
     * @docid
     * @public
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
       * @type_function_param2 b:object
       * @type_function_return Number
       * @default true
       */
      sortingMethod?: boolean | ((a: any, b: any) => number)
    };
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    defaultPane?: string;
    /**
     * @docid
     * @type object
     * @public
     */
    legend?: dxChartLegend;
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
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @public
     */
    onArgumentAxisClick?: ((e: ArgumentAxisClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesClick?: ((e: SeriesClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesHoverChanged?: ((e: SeriesHoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:chartSeriesObject
     * @notUsedInTheme
     * @action
     * @public
     */
    onSeriesSelectionChanged?: ((e: SeriesSelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 rangeStart:Date|Number:deprecated(range)
     * @type_function_param1_field6 rangeEnd:Date|Number:deprecated(range)
     * @type_function_param1_field7 axis:chartAxisObject
     * @type_function_param1_field8 range:VizRange
     * @type_function_param1_field9 previousRange:VizRange
     * @type_function_param1_field10 cancel:boolean
     * @type_function_param1_field11 actionType:Enums.ChartZoomPanActionType
     * @type_function_param1_field12 zoomFactor:Number
     * @type_function_param1_field13 shift:Number
     * @notUsedInTheme
     * @action
     * @public
     */
    onZoomEnd?: ((e: ZoomEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 axis:chartAxisObject
     * @type_function_param1_field6 range:VizRange
     * @type_function_param1_field7 cancel:boolean
     * @type_function_param1_field8 actionType:Enums.ChartZoomPanActionType
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
    panes?: dxChartPanes | Array<dxChartPanes>;
    /**
     * @docid
     * @default false
     * @public
     */
    resizePanesOnZoom?: boolean;
    /**
     * @docid
     * @type Enums.ChartResolveLabelOverlapping
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
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
      color?: string,
      /**
       * @docid
       * @default 5
       */
      offset?: number,
      /**
       * @docid
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @type Enums.Position
       * @default 'top'
       */
      position?: 'bottom' | 'left' | 'right' | 'top',
      /**
       * @docid
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @default 10
       */
      width?: number
    };
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @public
     */
    series?: ChartSeries | Array<ChartSeries>;
    /**
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @public
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
    tooltip?: dxChartTooltip;
    /**
     * @docid
     * @type Object|Array<Object>
     * @inherits dxChartOptions.commonAxisSettings
     * @public
     */
    valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
    /**
     * @docid
     * @public
     */
    zoomAndPan?: {
      /**
       * @docid
       * @default true
       */
      allowMouseWheel?: boolean,
      /**
       * @docid
       * @default true
       */
      allowTouchGestures?: boolean,
      /**
       * @docid
       * @type Enums.ChartZoomAndPanMode
       * @default 'none'
       */
      argumentAxis?: 'both' | 'none' | 'pan' | 'zoom',
      /**
       * @docid
       */
      dragBoxStyle?: {
        /**
         * @docid
         * @default undefined
         */
        color?: string,
        /**
         * @docid
         * @default undefined
         */
        opacity?: number
      },
      /**
       * @docid
       * @default false
       */
      dragToZoom?: boolean,
      /**
       * @docid
       * @type Enums.EventKeyModifier
       * @default 'shift'
       */
      panKey?: 'alt' | 'ctrl' | 'meta' | 'shift',
      /**
       * @docid
       * @type Enums.ChartZoomAndPanMode
       * @default 'none'
       */
      valueAxis?: 'both' | 'none' | 'pan' | 'zoom'
    };
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.argumentAxis.aggregateByCategory
     * @default false
     * @public
     */
    aggregateByCategory?: boolean;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationGroupWidth
     * @default undefined
     * @public
     */
    aggregationGroupWidth?: number;
    /**
     * @docid dxChartOptions.argumentAxis.aggregationInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    aggregationInterval?: VizTimeInterval;
    /**
     * @docid dxChartOptions.argumentAxis.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
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
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines
     * @type Array<Object>
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @public
     */
    constantLines?: Array<dxChartArgumentAxisConstantLines>;
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
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid dxChartOptions.argumentAxis.label
     * @type object
     * @public
     */
    label?: dxChartArgumentAxisLabel;
    /**
     * @docid dxChartOptions.argumentAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxChartOptions.argumentAxis.logarithmBase
     * @default 10
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * @docid dxChartOptions.argumentAxis.position
     * @type Enums.Position
     * @default 'bottom'
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.argumentAxis.customPosition
     * @default undefined
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.customPositionAxis
     * @default undefined
     * @public
     */
    customPositionAxis?: string;
    /**
     * @docid dxChartOptions.argumentAxis.offset
     * @default undefined
     * @public
     */
    offset?: number;
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
    strips?: Array<dxChartArgumentAxisStrips>;
    /**
     * @docid dxChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    tickInterval?: VizTimeInterval;
    /**
     * @docid dxChartOptions.argumentAxis.title
     * @type string|object
     * @public
     */
    title?: dxChartArgumentAxisTitle;
    /**
     * @docid dxChartOptions.argumentAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxChartOptions.argumentAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.argumentAxis.visualRangeUpdateMode
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid dxChartOptions.argumentAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
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
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label
     * @type object
     * @public
     */
    label?: dxChartArgumentAxisConstantLineStyleLabel;
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.argumentAxis.constantLineStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
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
    label?: dxChartArgumentAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string;
    /**
     * @docid dxChartOptions.argumentAxis.constantLines.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeHint
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.customizeText
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.argumentAxis.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.argumentAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.argumentAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxChartOptions.argumentAxis.strips.label
     * @type object
     * @public
     */
    label?: dxChartArgumentAxisStripsLabel;
    /**
     * @docid dxChartOptions.argumentAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.argumentAxis.title.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettings {
    /**
     * @docid dxChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.breakStyle
     * @public
     */
    breakStyle?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.color
       * @default "#ababab"
       */
      color?: string,
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.line
       * @type Enums.ScaleBreakLineStyle
       * @default "waved"
       */
      line?: 'straight' | 'waved',
      /**
       * @docid dxChartOptions.commonAxisSettings.breakStyle.width
       * @default 5
       */
      width?: number
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
    constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid dxChartOptions.commonAxisSettings.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.grid
     * @public
     */
    grid?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.color
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxChartOptions.commonAxisSettings.grid.width
       * @default 1
       */
      width?: number
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
    label?: dxChartCommonAxisSettingsLabel;
    /**
     * @docid dxChartOptions.commonAxisSettings.maxValueMargin
     * @default undefined
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minValueMargin
     * @default undefined
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxChartOptions.commonAxisSettings.minorGrid
     * @public
     */
    minorGrid?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.color
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorGrid.width
       * @default 1
       */
      width?: number
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
      color?: string,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.length
       * @default 7
       */
      length?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.opacity
       * @default 0.3
       */
      opacity?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.shift
       * @default 3
       */
      shift?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxChartOptions.commonAxisSettings.minorTick.width
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @public
     */
    opacity?: number;
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
    stripStyle?: dxChartCommonAxisSettingsStripStyle;
    /**
     * @docid dxChartOptions.commonAxisSettings.tick
     * @public
     */
    tick?: {
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.color
       * @default '#767676'
       */
      color?: string,
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.length
       * @default 7
       */
      length?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.shift
       * @default 3
       */
      shift?: number,
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.visible
       * @default true
       */
      visible?: boolean,
      /**
       * @docid dxChartOptions.commonAxisSettings.tick.width
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxChartOptions.commonAxisSettings.title
     * @type object
     * @public
     */
    title?: dxChartCommonAxisSettingsTitle;
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
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.color
     * @default '#000000'
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @public
     */
    label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
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
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @default '#767676' [prop](color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid dxChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.label.template
     * @default undefined
     * @type_function_param1 data:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((data: object, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid dxChartOptions.commonAxisSettings.label.alignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.displayMode
     * @type Enums.ChartLabelDisplayMode
     * @default 'standard'
     * @public
     */
    displayMode?: 'rotate' | 'stagger' | 'standard';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.font
     * @default '#767676' [prop](color)
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
     * @type Enums.OverlappingBehavior
     * @default 'hide'
     * @public
     */
    overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
    /**
     * @docid dxChartOptions.commonAxisSettings.label.position
     * @type Enums.RelativePosition | Enums.Position
     * @default 'outside'
     * @public
     */
    position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
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
     * @type Enums.VizTextOverflow
     * @default "none"
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartOptions.commonAxisSettings.label.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrapType;
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @public
     */
    label?: dxChartCommonAxisSettingsStripStyleLabel;
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
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.font
     * @default '#767676' [prop](color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.stripStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'center'
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/** @namespace DevExpress.viz */
export interface dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.commonAxisSettings.title.alignment
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.commonAxisSettings.title.font
     * @default '#767676' [prop](color)
     * @default 16 [prop](size)
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
     * @type Enums.VizTextOverflow
     * @default "ellipsis"
     * @public
     */
    textOverflow?: VizTextOverflowType;
    /**
     * @docid dxChartOptions.commonAxisSettings.title.wordWrap
     * @type Enums.VizWordWrap
     * @default "normal"
     * @public
     */
    wordWrap?: WordWrapType;
}
/** @namespace DevExpress.viz */
export interface dxChartCommonPaneSettings {
    /**
     * @docid dxChartOptions.commonPaneSettings.backgroundColor
     * @default 'none'
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartOptions.commonPaneSettings.border
     * @public
     */
    border?: {
      /**
       * @docid dxChartOptions.commonPaneSettings.border.bottom
       * @default true
       */
      bottom?: boolean,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.color
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.dashStyle
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.left
       * @default true
       */
      left?: boolean,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.right
       * @default true
       */
      right?: boolean,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.top
       * @default true
       */
      top?: boolean,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxChartOptions.commonPaneSettings.border.width
       * @default 1
       */
      width?: number
    };
}
/** @namespace DevExpress.viz */
export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
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
     * @type Enums.SeriesType
     * @default 'line'
     * @public
     */
    type?: ChartSeriesType;
}
/** @namespace DevExpress.viz */
export interface dxChartLegend extends BaseChartLegend {
    /**
     * @docid dxChartOptions.legend.customizeHint
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @public
     */
    customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.customizeText
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxChartOptions.legend.hoverMode
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    /**
     * @docid dxChartOptions.legend.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @public
     */
    position?: 'inside' | 'outside';
}
/** @namespace DevExpress.viz */
export interface dxChartPanes extends dxChartCommonPaneSettings {
    /**
     * @docid dxChartOptions.panes.height
     * @default undefined
     * @public
     */
    height?: number | string;
    /**
     * @docid dxChartOptions.panes.name
     * @default undefined
     * @public
     */
    name?: string;
}
/** @namespace DevExpress.viz */
export interface dxChartTooltip extends BaseChartTooltip {
    /**
     * @docid dxChartOptions.tooltip.location
     * @type Enums.ChartTooltipLocation
     * @default 'center'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.StockSeries,dxChartSeriesTypes.CandleStickSeries
     * @public
     */
    location?: 'center' | 'edge';
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxis extends dxChartCommonAxisSettings {
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
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle
     * @type object
     * @public
     */
    constantLineStyle?: dxChartValueAxisConstantLineStyle;
    /**
     * @docid dxChartOptions.valueAxis.constantLines
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.constantLineStyle
     * @public
     */
    constantLines?: Array<dxChartValueAxisConstantLines>;
    /**
     * @docid dxChartOptions.valueAxis.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.label
     * @type object
     * @public
     */
    label?: dxChartValueAxisLabel;
    /**
     * @docid dxChartOptions.valueAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number;
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
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * @docid dxChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    minorTickInterval?: VizTimeInterval;
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
    name?: string;
    /**
     * @docid dxChartOptions.valueAxis.pane
     * @default undefined
     * @public
     */
    pane?: string;
    /**
     * @docid dxChartOptions.valueAxis.position
     * @type Enums.Position
     * @default 'left'
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid dxChartOptions.valueAxis.customPosition
     * @default undefined
     * @public
     */
    customPosition?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.offset
     * @default undefined
     * @public
     */
    offset?: number;
    /**
     * @docid dxChartOptions.valueAxis.showZero
     * @default undefined
     * @public
     */
    showZero?: boolean;
    /**
     * @docid dxChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<dxChartValueAxisStrips>;
    /**
     * @docid dxChartOptions.valueAxis.synchronizedValue
     * @default undefined
     * @public
     */
    synchronizedValue?: number;
    /**
     * @docid dxChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    tickInterval?: VizTimeInterval;
    /**
     * @docid dxChartOptions.valueAxis.title
     * @type string|object
     * @public
     */
    title?: dxChartValueAxisTitle;
    /**
     * @docid dxChartOptions.valueAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxChartOptions.valueAxis.valueType
     * @type Enums.ChartDataType
     * @default undefined
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxChartOptions.valueAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxChartOptions.valueAxis.visualRangeUpdateMode
     * @type Enums.VisualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * @docid dxChartOptions.valueAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label
     * @type object
     * @public
     */
    label?: dxChartValueAxisConstantLineStyleLabel;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.valueAxis.constantLineStyle.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
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
    label?: dxChartValueAxisConstantLinesLabel;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'left'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string;
    /**
     * @docid dxChartOptions.valueAxis.constantLines.label.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default 'top'
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
    /**
     * @docid dxChartOptions.valueAxis.label.customizeHint
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.customizeText
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxChartOptions.valueAxis.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxChartOptions.valueAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxChartOptions.valueAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxChartOptions.valueAxis.strips.label
     * @type object
     * @public
     */
    label?: dxChartValueAxisStripsLabel;
    /**
     * @docid dxChartOptions.valueAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
    /**
     * @docid dxChartOptions.valueAxis.title.text
     * @default undefined
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits BaseChart
 * @module viz/chart
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxChart extends BaseChart {
    constructor(element: UserDefinedElement, options?: dxChartOptions)
    /**
     * @docid
     * @publicName getArgumentAxis()
     * @return chartAxisObject
     * @public
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
     * @publicName getValueAxis(name)
     * @param1 name:string
     * @return chartAxisObject
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
     * @param1 startValue:Number|Date|string
     * @param2 endValue:Number|Date|string
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
    name?: string;
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
    axis?: string;
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxChartAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.AreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.aggregation.method
     * @type Enums.ChartBubbleSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: 'avg' | 'custom';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.BubbleSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @public
     */
    method?: 'ohlc' | 'custom';
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
     * @type Enums.HatchingDirection
     * @public
     */
    direction?: HatchingDirectionType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CandleStickSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type Enums.HatchingDirection
     * @public
     */
    direction?: HatchingDirectionType;
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
    axis?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barOverlapGroup
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barOverlapGroup?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barPadding
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barPadding?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.barWidth
     * @default undefined
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    barWidth?: number;
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
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.cornerRadius
     * @default 0
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    cornerRadius?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyleType;
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
     * @type Enums.ChartSeriesHoverMode
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
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
    label?: dxChartSeriesTypesCommonSeriesLabel;
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
    maxLabelCount?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.minBarSize
     * @default undefined
     * @propertyOf dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.BarSeries
     * @public
     */
    minBarSize?: number;
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
    point?: dxChartSeriesTypesCommonSeriesPoint;
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
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.reduction.level
       * @type Enums.FinancialChartReductionLevel
       * @default 'close'
       * @propertyOf dxChartSeriesTypes.CandleStickSeries,dxChartSeriesTypes.StockSeries
       */
      level?: 'close' | 'high' | 'low' | 'open'
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionMode
     * @type Enums.ChartSeriesSelectionMode
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
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
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.displayMode
       * @type Enums.ValueErrorBarDisplayMode
       * @default 'auto'
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.edgeLength
       * @default 8
       */
      edgeLength?: number,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.highValueField
       * @default undefined
       */
      highValueField?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lineWidth
       * @default 2
       */
      lineWidth?: number,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.lowValueField
       * @default undefined
       */
      lowValueField?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.type
       * @type Enums.ValueErrorBarType
       * @default undefined
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
       * @docid dxChartSeriesTypes.CommonSeries.valueErrorBar.value
       * @default 1
       */
      value?: number
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
     * @type_function_param1 aggregationInfo:chartPointAggregationInfoObject
     * @type_function_param2 series:chartSeriesObject
     * @type_function_return object|Array<object>
     * @default undefined
     * @public
     */
    calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.aggregation.method
     * @type Enums.ChartSeriesAggregationMethod
     * @public
     */
    method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.color
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.border.dashStyle
     * @type Enums.DashStyle
     * @default undefined
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    dashStyle?: DashStyleType;
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
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyleType;
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
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyleType;
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
     * @type Enums.HatchingDirection
     * @default 'right'
     * @public
     */
    direction?: HatchingDirectionType;
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
export interface dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.alignment
     * @type Enums.HorizontalAlignment
     * @default 'center'
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.argumentFormat
     * @extends CommonVizFormat
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.backgroundColor
     * @default undefined
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.border
     * @public
     */
    border?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.color
       * @default  '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.dashStyle
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.width
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.connector
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    connector?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.visible
       * @default false
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      visible?: boolean,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.width
       * @default 1
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.horizontalOffset
     * @default 0
     * @public
     */
    horizontalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.rotationAngle
     * @default 0
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.showForZeroValues
     * @default true
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.verticalOffset
     * @default 0
     * @public
     */
    verticalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesPoint {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.border
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    border?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.visible
       * @default false
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      visible?: boolean,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.width
       * @default 1
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      width?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.color
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      border?: {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.color
         * @default undefined
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        color?: string,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.visible
         * @default true
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        visible?: boolean,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.width
         * @default 4
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        width?: number
      },
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.size
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      size?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.image
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    image?: string | {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.height
       * @default 30
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      height?: number | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: number,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: number
      },
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.url
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      url?: string | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: string,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: string
      },
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.width
       * @default 30
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      width?: number | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: number,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: number
      }
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      border?: {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.color
         * @default undefined
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        color?: string,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.visible
         * @default true
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        visible?: boolean,
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.width
         * @default 4
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        width?: number
      },
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string,
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.size
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      size?: number
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.size
     * @default 12
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    size?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.symbol
     * @type Enums.PointSymbol
     * @default 'circle'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.visible
     * @default true
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    visible?: boolean;
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
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    dashStyle?: DashStyleType;
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
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyleType;
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
     * @type Enums.HatchingDirection
     * @default 'right'
     * @public
     */
    direction?: HatchingDirectionType;
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.FullStackedBarSeries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @public
     */
    position?: 'inside' | 'outside';
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.LineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.LineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.aggregation.method
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @public
     */
    method?: 'range' | 'custom';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.aggregation.method
     * @type Enums.ChartRangeSeriesAggregationMethod
     * @default 'range'
     * @public
     */
    method?: 'range' | 'custom';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.RangeBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.ScatterSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.SplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'sum'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.StackedBarSeries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @public
     */
    position?: 'inside' | 'outside';
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StackedSplineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
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
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
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
export interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepAreaSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
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
     * @type string
     * @acceptValues 'nearestPoint'|'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.aggregation.method
     * @type Enums.ChartSingleValueSeriesAggregationMethod
     * @default 'avg'
     * @public
     */
    method?: ChartSingleValueSeriesAggregationMethodType;
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StepLineSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * @docid dxChartSeriesTypes.StockSeries.aggregation.method
     * @type Enums.ChartFinancialSeriesAggregationMethod
     * @default 'ohlc'
     * @public
     */
    method?: 'ohlc' | 'custom';
}
/** @namespace DevExpress.viz */
export interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * @docid dxChartSeriesTypes.StockSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
}

/** @public */
export type Properties = dxChartOptions;

/** @deprecated use Properties instead */
export type Options = dxChartOptions;

/** @deprecated use Properties instead */
export type IOptions = dxChartOptions;
