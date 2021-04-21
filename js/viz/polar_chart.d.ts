import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    TEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import { HatchingDirectionType } from './common';

import {
    basePointObject,
    baseSeriesObject,
    chartAxisObject
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig,
    PointInteractionInfo,
    TooltipInfo
} from './chart_components/base_chart';

import {
    template
} from '../core/templates/template';

import {
    VizRange,
    DashStyleType,
    TimeIntervalType
} from './common';

import {
    Font,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';

interface SeriesInteractionInfo {
    target: polarChartSeriesObject
}

/** @public */
export type ArgumentAxisClickEvent = NativeEventInfo<dxPolarChart> & {
    readonly argument: Date | number | string;
}

/** @public */
export type DisposingEvent = EventInfo<dxPolarChart>;

/** @public */
export type DoneEvent = EventInfo<dxPolarChart>;

/** @public */
export type DrawnEvent = EventInfo<dxPolarChart>;

/** @public */
export type ExportedEvent = EventInfo<dxPolarChart>;

/** @public */
export type ExportingEvent = EventInfo<dxPolarChart> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxPolarChart>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxPolarChart> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPolarChart>;

/** @public */
export type LegendClickEvent = NativeEventInfo<dxPolarChart> & {
    readonly target: polarChartSeriesObject;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxPolarChart> & ChangedOptionInfo;

/** @public */
export type PointClickEvent = NativeEventInfo<dxPolarChart> & PointInteractionInfo;

/** @public */
export type PointHoverChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/** @public */
export type PointSelectionChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/** @public */
export type SeriesClickEvent = NativeEventInfo<dxPolarChart> & {
    readonly target: polarChartSeriesObject;
}

/** @public */
export type SeriesHoverChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/** @public */
export type SeriesSelectionChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxPolarChart> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxPolarChart> & TooltipInfo;

/** @public */
export type ZoomEndEvent = Cancelable & NativeEventInfo<dxPolarChart> & {
    readonly axis: chartAxisObject;
    readonly range: VizRange;
    readonly previousRange: VizRange;
    readonly actionType: 'zoom' | 'pan';
    readonly zoomFactor: number;
    readonly shift: number;
}
/** @public */
export type ZoomStartEvent = Cancelable & NativeEventInfo<dxPolarChart> & {
    readonly axis: chartAxisObject;
    readonly range: VizRange;
    readonly actionType: 'zoom' | 'pan';
}

/**
 * @docid
 * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
 * @type object
 */
export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: PolarChartSeriesType;
}

export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPolarChartAdaptiveLayout;
    /**
     * @docid
     * @inherits dxPolarChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxPolarChartAnnotationConfig | any>;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxPolarChartArgumentAxis;
    /**
     * @docid
     * @default 0.3
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupWidth?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxPolarChartCommonAxisSettings;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
    /**
     * @docid
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_return dxPolarChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig);
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
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
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPolarChartLegend;
    /**
     * @docid
     * @default false
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DxElement, model?: any, event?: TEvent, argument?: Date | number | string }) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: SeriesClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesHoverChanged?: ((e: SeriesHoverChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesSelectionChanged?: ((e: SeriesSelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 axis:chartAxisObject
     * @type_function_param1_field6 range:VizRange
     * @type_function_param1_field7 previousRange:VizRange
     * @type_function_param1_field8 cancel:boolean
     * @type_function_param1_field9 actionType:Enums.ChartZoomPanActionType
     * @type_function_param1_field10 zoomFactor:Number
     * @type_function_param1_field11 shift:Number
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomEnd?: ((e: ZoomEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPolarChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 axis:chartAxisObject
     * @type_function_param1_field6 range:VizRange
     * @type_function_param1_field7 cancel:boolean
     * @type_function_param1_field8 actionType:Enums.ChartZoomPanActionType
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onZoomStart?: ((e: ZoomStartEvent) => void);
    /**
     * @docid
     * @type Enums.PolarChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: PolarChartSeries | Array<PolarChartSeries>;
    /**
     * @docid
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type_function_param1 seriesName:any
       * @type_function_return PolarChartSeries
       */
      customizeSeries?: ((seriesName: any) => PolarChartSeries),
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 'series'
       */
      nameField?: string
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxPolarChartTooltip;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useSpiderWeb?: boolean;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueAxis?: dxPolarChartValueAxis;
}
export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPolarChartOptions.adaptiveLayout.height
     * @default 170
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid dxPolarChartOptions.adaptiveLayout.width
     * @default 170
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.argumentAxis.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxPolarChartOptions.argumentAxis.axisDivisionFactor
     * @default 50
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.categories
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines
     * @type Array<Object>
     * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.firstPointOnStartAngle
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    firstPointOnStartAngle?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.hoverMode
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartOptions.argumentAxis.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.linearThreshold
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.logarithmBase
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: dxPolarChartArgumentAxisMinorTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxPolarChartOptions.argumentAxis.originValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originValue?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.period
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    period?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.startAngle
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startAngle?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxPolarChartArgumentAxisStrips>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartArgumentAxisTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxPolarChartOptions.argumentAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
}
export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.displayBehindSeries
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.extendAxis
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.value
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeHint
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeText
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTick.shift
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.color
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.endValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.startValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick.shift
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
export interface dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.color
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.endOnTick
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.grid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.color
       * @prevFileNamespace DevExpress.viz
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.opacity
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.visible
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.inverted
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorGrid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.color
       * @prevFileNamespace DevExpress.viz
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.opacity
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.visible
       * @prevFileNamespace DevExpress.viz
       * @default true
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartCommonAxisSettingsTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.color
     * @default '#000000'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.indentFromAxis
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.overlappingBehavior
     * @type Enums.PolarChartOverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'none' | 'hide';
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.color
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.length
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.opacity
     * @default 0.3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
}
export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label.font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
}
export interface dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.color
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.length
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.opacity
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.width
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.area
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.bar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.line
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.scatter
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.stackedbar
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbar?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.type
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: PolarChartSeriesType;
}
export interface dxPolarChartLegend extends BaseChartLegend {
    /**
     * @docid dxPolarChartOptions.legend.customizeHint
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxPolarChartOptions.legend.customizeText
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxPolarChartOptions.legend.hoverMode
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
}
export interface dxPolarChartTooltip extends BaseChartTooltip {
    /**
     * @docid dxPolarChartOptions.tooltip.shared
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shared?: boolean;
}
export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.valueAxis.axisDivisionFactor
     * @default 30
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.categories
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.constantLineStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxPolarChartValueAxisConstantLines>;
    /**
     * @docid dxPolarChartOptions.valueAxis.endOnTick
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.linearThreshold
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.logarithmBase
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.maxValueMargin
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minValueMargin
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxPolarChartOptions.valueAxis.showZero
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showZero?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxPolarChartValueAxisStrips>;
    /**
     * @docid dxPolarChartOptions.valueAxis.tick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartValueAxisTick;
    /**
     * @docid dxPolarChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid dxPolarChartOptions.valueAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxPolarChartOptions.valueAxis.valueMarginsEnabled
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.valueType
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRangeUpdateMode
     * @type Enums.ValueAxisVisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
    /**
     * @docid dxPolarChartOptions.valueAxis.wholeRange
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.displayBehindSeries
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.extendAxis
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.value
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeHint
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeText
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.valueAxis.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.color
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.endValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.startValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.valueAxis.tick.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid dxPolarChart
 * @inherits BaseChart
 * @module viz/polar_chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxPolarChart extends BaseChart {
    constructor(element: UserDefinedElement, options?: dxPolarChartOptions)
    /**
     * @docid dxPolarChart.getValueAxis
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid dxPolarChart.resetVisualRange
     * @publicName resetVisualRange()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetVisualRange(): void;
}

/**
 * @docid
 * @type object
 * @inherits dxPolarChartCommonAnnotationConfig
 */
export interface dxPolarChartAnnotationConfig extends dxPolarChartCommonAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}

/**
 * @docid
 * @type object
 * @inherits BaseChartAnnotationConfig
 */
export interface dxPolarChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    angle?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    radius?: number;
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxPolarChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}

/**
 * @docid
 * @type object
 */
export interface dxPolarChartSeriesTypes {
    /**
     * @docid
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
    /**
     * @docid
     * @publicName AreaSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
    /**
     * @docid
     * @publicName BarSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
    /**
     * @docid
     * @publicName LineSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
    /**
     * @docid
     * @publicName ScatterSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatterpolarseries?: any;
    /**
     * @docid
     * @publicName StackedBarSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
}
export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width
       * @prevFileNamespace DevExpress.viz
       * @default 2
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.closed
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closed?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.color
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode
     * @type Enums.ChartSeriesHoverMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.color
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.dashStyle
         * @prevFileNamespace DevExpress.viz
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.visible
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.width
         * @prevFileNamespace DevExpress.viz
         * @default 3
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.direction
         * @prevFileNamespace DevExpress.viz
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.opacity
         * @prevFileNamespace DevExpress.viz
         * @default 0.75
         */
        opacity?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.step
         * @prevFileNamespace DevExpress.viz
         * @default 6
         */
        step?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.width
         * @prevFileNamespace DevExpress.viz
         * @default 2
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.width
       * @prevFileNamespace DevExpress.viz
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity
     * @default 0.5
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode
     * @type Enums.ChartSeriesSelectionMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.color
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         */
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.dashStyle
         * @prevFileNamespace DevExpress.viz
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.visible
         * @prevFileNamespace DevExpress.viz
         * @default false
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.width
         * @prevFileNamespace DevExpress.viz
         * @default 3
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.direction
         * @prevFileNamespace DevExpress.viz
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.opacity
         * @prevFileNamespace DevExpress.viz
         * @default 0.5
         */
        opacity?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.step
         * @prevFileNamespace DevExpress.viz
         * @default 6
         */
        step?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.width
         * @prevFileNamespace DevExpress.viz
         * @default 2
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.width
       * @prevFileNamespace DevExpress.viz
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.stack
     * @default 'default'
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.color
       * @prevFileNamespace DevExpress.viz
       * @default black
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.displayMode
       * @prevFileNamespace DevExpress.viz
       * @type Enums.ValueErrorBarDisplayMode
       * @default 'auto'
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.edgeLength
       * @prevFileNamespace DevExpress.viz
       * @default 8
       */
      edgeLength?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.highValueField
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      highValueField?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lineWidth
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      lineWidth?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lowValueField
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      lowValueField?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.opacity
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.type
       * @prevFileNamespace DevExpress.viz
       * @type Enums.ValueErrorBarType
       * @default undefined
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.value
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      value?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField
     * @default 'val'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.visible
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.width
     * @default 2
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color
       * @prevFileNamespace DevExpress.viz
       * @default  '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width
       * @prevFileNamespace DevExpress.viz
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.color
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.visible
         * @prevFileNamespace DevExpress.viz
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.width
         * @prevFileNamespace DevExpress.viz
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.size
       * @prevFileNamespace DevExpress.viz
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height
       * @prevFileNamespace DevExpress.viz
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      height?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      url?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width
       * @prevFileNamespace DevExpress.viz
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border
       * @prevFileNamespace DevExpress.viz
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.color
         * @prevFileNamespace DevExpress.viz
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.visible
         * @prevFileNamespace DevExpress.viz
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.width
         * @prevFileNamespace DevExpress.viz
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.size
       * @prevFileNamespace DevExpress.viz
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size
     * @default 12
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol
     * @type Enums.VizPointSymbol
     * @default 'circle'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.point
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries.point.visible
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
     * @default 'excludePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}

/**
 * @docid
 * @publicName Point
 * @type object
 * @inherits basePointObject
 */
export interface polarPointObject extends basePointObject {
}

/**
 * @docid
 * @publicName Series
 * @type object
 * @inherits baseSeriesObject
 */
export interface polarChartSeriesObject extends baseSeriesObject {
}

/** @public */
export type Options = dxPolarChartOptions;

/** @deprecated use Options instead */
export type IOptions = dxPolarChartOptions;
