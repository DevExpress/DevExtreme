import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxEvent,
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
    VizTimeInterval
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
 * @namespace DevExpress.viz
 */
export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    tag?: any;
    /**
     * @docid
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @public
     */
    type?: PolarChartSeriesType;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * @docid
     * @type object
     * @public
     */
    adaptiveLayout?: dxPolarChartAdaptiveLayout;
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
    argumentAxis?: dxPolarChartArgumentAxis;
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
    barGroupWidth?: number;
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
    commonAxisSettings?: dxPolarChartCommonAxisSettings;
    /**
     * @docid
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @hideDefaults true
     * @inheritAll
     * @public
     */
    commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
    /**
     * @docid
     * @default '#FFFFFF'
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_return dxPolarChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig);
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
     * @public
     */
    legend?: dxPolarChartLegend;
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
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DxElement, model?: any, event?: DxEvent, argument?: Date | number | string }) => void) | string;
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
     * @public
     */
    onZoomStart?: ((e: ZoomStartEvent) => void);
    /**
     * @docid
     * @type Enums.PolarChartResolveLabelOverlapping
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @notUsedInTheme
     * @inheritAll
     * @public
     */
    series?: PolarChartSeries | Array<PolarChartSeries>;
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
       * @type_function_return PolarChartSeries
       */
      customizeSeries?: ((seriesName: any) => PolarChartSeries),
      /**
       * @docid
       * @default 'series'
       */
      nameField?: string
    };
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: dxPolarChartTooltip;
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
    valueAxis?: dxPolarChartValueAxis;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
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
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.argumentAxis.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
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
    constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.firstPointOnStartAngle
     * @default false
     * @public
     */
    firstPointOnStartAngle?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.hoverMode
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartOptions.argumentAxis.label
     * @type object
     * @public
     */
    label?: dxPolarChartArgumentAxisLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number;
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
    minorTick?: dxPolarChartArgumentAxisMinorTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * @docid dxPolarChartOptions.argumentAxis.originValue
     * @default undefined
     * @public
     */
    originValue?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.period
     * @default undefined
     * @public
     */
    period?: number;
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
    strips?: Array<dxPolarChartArgumentAxisStrips>;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick
     * @type object
     * @public
     */
    tick?: dxPolarChartArgumentAxisTick;
    /**
     * @docid dxPolarChartOptions.argumentAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    tickInterval?: VizTimeInterval;
    /**
     * @docid dxPolarChartOptions.argumentAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
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
    label?: dxPolarChartArgumentAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeHint
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
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
     * @public
     */
    customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTick.shift
     * @default 3
     * @public
     */
    shift?: number;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label
     * @type object
     * @public
     */
    label?: dxPolarChartArgumentAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick.shift
     * @default 3
     * @public
     */
    shift?: number;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.allowDecimals
     * @default undefined
     * @public
     */
    allowDecimals?: boolean;
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
    constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.discreteAxisDivisionMode
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.endOnTick
     * @default undefined
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.grid
     * @public
     */
    grid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.color
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.visible
       * @default true
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.grid.width
       * @default 1
       */
      width?: number
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
    label?: dxPolarChartCommonAxisSettingsLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorGrid
     * @public
     */
    minorGrid?: {
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.color
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.visible
       * @default true
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartOptions.commonAxisSettings.minorGrid.width
       * @default 1
       */
      width?: number
    };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick
     * @type object
     * @public
     */
    minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.opacity
     * @default undefined
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle
     * @type object
     * @public
     */
    stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick
     * @type object
     * @public
     */
    tick?: dxPolarChartCommonAxisSettingsTick;
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
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.color
     * @default '#000000'
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.width
     * @default 1
     * @public
     */
    width?: number;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @default '#767676' [prop](color)
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.font
     * @default '#767676' [prop](color)
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
     * @type Enums.PolarChartOverlappingBehavior
     * @default 'hide'
     * @public
     */
    overlappingBehavior?: 'none' | 'hide';
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.visible
     * @default true
     * @public
     */
    visible?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsMinorTick {
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
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label
     * @type object
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.stripStyle.label.font
     * @default '#767676' [prop](color)
     * @public
     */
    font?: Font;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonAxisSettingsTick {
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
    opacity?: number;
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
}
/** @namespace DevExpress.viz */
export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
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
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @public
     */
    type?: PolarChartSeriesType;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartLegend extends BaseChartLegend {
    /**
     * @docid dxPolarChartOptions.legend.customizeHint
     * @type_function_param1 seriesInfo:object
     * @type_function_param1_field1 seriesName:any
     * @type_function_param1_field2 seriesIndex:Number
     * @type_function_param1_field3 seriesColor:string
     * @type_function_return string
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
     * @public
     */
    customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
    /**
     * @docid dxPolarChartOptions.legend.hoverMode
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartTooltip extends BaseChartTooltip {
    /**
     * @docid dxPolarChartOptions.tooltip.shared
     * @default false
     * @public
     */
    shared?: boolean;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
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
    constantLines?: Array<dxPolarChartValueAxisConstantLines>;
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
    label?: dxPolarChartValueAxisLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.linearThreshold
     * @default undefined
     * @public
     */
    linearThreshold?: number;
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
    maxValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minValueMargin
     * @default undefined
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickCount
     * @default undefined
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * @docid dxPolarChartOptions.valueAxis.showZero
     * @default undefined
     * @public
     */
    showZero?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips
     * @type Array<Object>
     * @notUsedInTheme
     * @inherits dxPolarChartOptions.commonAxisSettings.stripStyle
     * @public
     */
    strips?: Array<dxPolarChartValueAxisStrips>;
    /**
     * @docid dxPolarChartOptions.valueAxis.tick
     * @type object
     * @public
     */
    tick?: dxPolarChartValueAxisTick;
    /**
     * @docid dxPolarChartOptions.valueAxis.tickInterval
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @public
     */
    tickInterval?: VizTimeInterval;
    /**
     * @docid dxPolarChartOptions.valueAxis.type
     * @type Enums.AxisScaleType
     * @default undefined
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid dxPolarChartOptions.valueAxis.valueMarginsEnabled
     * @default true
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.valueType
     * @type Enums.ChartDataType
     * @default undefined
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRange
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid dxPolarChartOptions.valueAxis.visualRangeUpdateMode
     * @type Enums.ValueAxisVisualRangeUpdateMode
     * @default 'auto'
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
    /**
     * @docid dxPolarChartOptions.valueAxis.wholeRange
     * @default undefined
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
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
    label?: dxPolarChartValueAxisConstantLinesLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.value
     * @default undefined
     * @public
     */
    value?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeHint
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
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
     * @public
     */
    customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid dxPolarChartOptions.valueAxis.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.endValue
     * @default undefined
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label
     * @type object
     * @public
     */
    label?: dxPolarChartValueAxisStripsLabel;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.startValue
     * @default undefined
     * @public
     */
    startValue?: number | Date | string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label.text
     * @default undefined
     * @public
     */
    text?: string;
}
/** @namespace DevExpress.viz */
export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.valueAxis.tick.visible
     * @default false
     * @public
     */
    visible?: boolean;
}
/**
 * @docid dxPolarChart
 * @inherits BaseChart
 * @module viz/polar_chart
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxPolarChart extends BaseChart<dxPolarChartOptions> {
    /**
     * @docid dxPolarChart.getValueAxis
     * @publicName getValueAxis()
     * @return chartAxisObject
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
    name?: string;
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
    angle?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    radius?: number;
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxPolarChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
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
    barPadding?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    barWidth?: number;
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
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashStyle
       * @type Enums.DashStyle
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width
       * @default 2
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number
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
    color?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode
     * @type Enums.ChartSeriesHoverMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
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
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.dashStyle
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.visible
         * @default false
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.width
         * @default 3
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.color
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.dashStyle
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.direction
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.opacity
         * @default 0.75
         */
        opacity?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.step
         * @default 6
         */
        step?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.width
         * @default 2
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.width
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
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
    maxLabelCount?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
     * @public
     */
    minBarSize?: number;
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
     * @type Enums.ChartSeriesSelectionMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
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
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.dashStyle
         * @type Enums.DashStyle
         * @default 'solid'
         */
        dashStyle?: DashStyleType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.visible
         * @default false
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.width
         * @default 3
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.color
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.dashStyle
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.direction
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.opacity
         * @default 0.5
         */
        opacity?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.step
         * @default 6
         */
        step?: number,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.width
         * @default 2
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.width
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
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
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.displayMode
       * @type Enums.ValueErrorBarDisplayMode
       * @default 'auto'
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.edgeLength
       * @default 8
       */
      edgeLength?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.highValueField
       * @default undefined
       */
      highValueField?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lineWidth
       * @default 2
       */
      lineWidth?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lowValueField
       * @default undefined
       */
      lowValueField?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.opacity
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.type
       * @type Enums.ValueErrorBarType
       * @default undefined
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.value
       * @default 1
       */
      value?: number
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
     * @extends CommonVizFormat
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor
     * @default undefined
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
     * @public
     */
    border?: {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color
       * @default  '#d3d3d3'
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashStyle
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width
       * @default 1
       */
      width?: number
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
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width
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
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format
     * @extends CommonVizFormat
     * @public
     */
    format?: format;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @public
     */
    position?: 'inside' | 'outside';
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
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      visible?: boolean,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
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
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.visible
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.width
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.size
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
    };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    image?: string | {
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      height?: number,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      url?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width
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
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
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
        color?: string,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.visible
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.width
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.color
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.size
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
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
     * @type Enums.VizPointSymbol
     * @default 'circle'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
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
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries.selectionMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.hoverMode
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
     * @default 'excludePoints'
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries.selectionMode
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
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
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/** @namespace DevExpress.viz */
export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries.label.position
     * @type Enums.RelativePosition
     * @default 'inside'
     * @public
     */
    position?: 'inside' | 'outside';
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

/** @deprecated use Properties instead */
export type IOptions = dxPolarChartOptions;
