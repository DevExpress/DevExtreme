import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import { HatchingDirectionType } from './common';

import {
    baseSeriesObject,
    chartAxisObject
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig
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
    Font
} from './core/base_widget';

export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';

/**
 * @docid
 * @type object
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 * @hidden
 */
export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type any
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPolarChartAdaptiveLayout;
    /**
     * @docid
     * @type Array<dxPolarChartAnnotationConfig,object>
     * @inherits dxPolarChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxPolarChartAnnotationConfig | any>;
    /**
     * @docid
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxPolarChartArgumentAxis;
    /**
     * @docid
     * @type number
     * @default 0.3
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupWidth?: number;
    /**
     * @docid
     * @type dxPolarChartCommonAnnotationConfig
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxPolarChartCommonAxisSettings;
    /**
     * @docid
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
    /**
     * @docid
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid
     * @type function(annotation)
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
     * @type object
     * @prevFileNamespace DevExpress.viz
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
      * @type boolean|function(a,b)
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPolarChartLegend;
    /**
     * @docid
     * @type boolean
     * @default false
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, event?: event, argument?: Date | number | string }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, event?: event, target?: polarChartSeriesObject }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, event?: event, target?: polarChartSeriesObject }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesHoverChanged?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, target?: polarChartSeriesObject }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesSelectionChanged?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, target?: polarChartSeriesObject }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
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
    onZoomEnd?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
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
    onZoomStart?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
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
     * @type PolarChartSeries|Array<PolarChartSeries>
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
     * @type object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: {
      /**
      * @docid
      * @type function(seriesName)
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxPolarChartTooltip;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useSpiderWeb?: boolean;
    /**
     * @docid
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueAxis?: dxPolarChartValueAxis;
}
/**
 * @docid
 * @inherits BaseChartAdaptiveLayout
 * @hidden
 */
export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid
     * @type number
     * @default 170
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid
     * @type number
     * @default 170
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettings
 * @hidden
 */
export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid
     * @type number
     * @default 50
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid
     * @inherits dxPolarChartCommonAxisSettings.constantLineStyle
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    firstPointOnStartAngle?: boolean;
    /**
     * @docid
     * @type Enums.ArgumentAxisHoverMode
     * @default 'none'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: dxPolarChartArgumentAxisMinorTick;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originValue?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    period?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startAngle?: number;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxPolarChartCommonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxPolarChartArgumentAxisStrips>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartArgumentAxisTick;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsConstantLineStyle
 * @hidden
 */
export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisConstantLinesLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsConstantLineStyleLabel
 * @hidden
 */
export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsLabel
 * @hidden
 */
export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid
     * @type function(argument)
     * @type_function_param1 argument:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid
     * @type function(argument)
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
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsMinorTick
 * @hidden
 */
export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsStripStyle
 * @hidden
 */
export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartArgumentAxisStripsLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsStripStyleLabel
 * @hidden
 */
export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsTick
 * @hidden
 */
export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettings {
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
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
    /**
     * @docid
     * @type Enums.DiscreteAxisDivisionMode
     * @default 'betweenLabels'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: {
      /**
      * @docid
      * @type string
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
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
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    inverted?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsLabel;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: {
      /**
      * @docid
      * @type string
      * @default '#d3d3d3'
      */
      color?: string,
      /**
      * @docid
      * @type number
      * @default undefined
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
      * @default 1
      */
      width?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartCommonAxisSettingsTick;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type string
     * @default '#000000'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
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
 */
export interface dxPolarChartCommonAxisSettingsLabel {
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
     * @type number
     * @default 5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    indentFromAxis?: number;
    /**
     * @docid
     * @type Enums.PolarChartOverlappingBehavior
     * @default 'hide'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    overlappingBehavior?: 'none' | 'hide';
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
 */
export interface dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid
     * @type number
     * @default 0.3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 * @hidden
 */
export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbar?: any;
    /**
     * @docid
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: PolarChartSeriesType;
}
/**
 * @docid
 * @hidden
 * @inherits BaseChartLegend
 * @type object
 */
export interface dxPolarChartLegend extends BaseChartLegend {
    /**
     * @docid
     * @type function(seriesInfo)
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
     * @docid
     * @type function(seriesInfo)
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
     * @docid
     * @type Enums.ChartLegendHoverMode
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits BaseChartTooltip
 * @type object
 */
export interface dxPolarChartTooltip extends BaseChartTooltip {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shared?: boolean;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettings
 * @hidden
 */
export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid
     * @type Array<number,string,Date>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    categories?: Array<number | string | Date>;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxPolarChartCommonAxisSettings.constantLineStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    constantLines?: Array<dxPolarChartValueAxisConstantLines>;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showZero?: boolean;
    /**
     * @docid
     * @notUsedInTheme
     * @inherits dxPolarChartCommonAxisSettings.stripStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    strips?: Array<dxPolarChartValueAxisStrips>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tick?: dxPolarChartValueAxisTick;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type Enums.AxisScaleType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueMarginsEnabled?: boolean;
    /**
     * @docid
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @fires BaseWidgetOptions.onOptionChanged
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * @docid
     * @type Enums.ValueAxisVisualRangeUpdateMode
     * @default 'auto'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
    /**
     * @docid
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsConstantLineStyle
 * @hidden
 */
export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    extendAxis?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisConstantLinesLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsConstantLineStyleLabel
 * @hidden
 */
export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsLabel
 * @hidden
 */
export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid
     * @type function(axisValue)
     * @type_function_param1 axisValue:object
     * @type_function_param1_field1 value:Date|Number|string
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
    /**
     * @docid
     * @type function(axisValue)
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
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    format?: format;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsStripStyle
 * @hidden
 */
export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartValueAxisStripsLabel;
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsStripStyleLabel
 * @hidden
 */
export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
/**
 * @docid
 * @inherits dxPolarChartCommonAxisSettingsTick
 * @hidden
 */
export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits BaseChart
 * @module viz/polar_chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxPolarChart extends BaseChart {
    constructor(element: Element, options?: dxPolarChartOptions)
    constructor(element: JQuery, options?: dxPolarChartOptions)
    /**
     * @docid
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid
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
     * @type string
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
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    angle?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    radius?: number;
    /**
     * @docid
     * @type function(annotation)
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
     * @type template|function
     * @default undefined
     * @type_function_param1 annotation:dxPolarChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid
     * @type template|function(annotation, element)
     * @type_function_param1 annotation:dxPolarChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: dxElement) => string | Element | JQuery);
}

/**
* @docid
* @type object
*/
export interface dxPolarChartSeriesTypes {
    /**
     * @docid
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
    /**
     * @docid
     * @publicName AreaSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
    /**
     * @docid
     * @publicName BarSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
    /**
     * @docid
     * @publicName LineSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
    /**
     * @docid
     * @publicName ScatterSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatterpolarseries?: any;
    /**
     * @docid
     * @publicName StackedBarSeries
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
}
/**
 * @docid
 * @type object
 * @hidden
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @type boolean
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid
       * @type number
       * @default 2
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closed?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.DashStyle
     * @default 'solid'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dashStyle?: DashStyleType;
    /**
     * @docid
     * @type Enums.ChartSeriesHoverMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid
         * @type string
         * @default undefined
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
         * @type boolean
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @type number
         * @default 3
         */
        width?: number
      },
      /**
       * @docid
       * @type string
       * @default undefined
       */
      color?: string,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid
         * @type number
         * @default 0.75
         */
        opacity?: number,
        /**
         * @docid
         * @type number
         * @default 6
         */
        step?: number,
        /**
         * @docid
         * @type number
         * @default 2
         */
        width?: number
      },
      /**
       * @docid
       * @type number
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    ignoreEmptyPoints?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid
     * @type number
     * @default 0.5
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
    /**
     * @docid
     * @type Enums.ChartSeriesSelectionMode
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      border?: {
        /**
         * @docid
         * @type string
         * @default undefined
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
         * @type boolean
         * @default false
         */
        visible?: boolean,
        /**
         * @docid
         * @type number
         * @default 3
         */
        width?: number
      },
      /**
       * @docid
       * @type string
       * @default undefined
       */
      color?: string,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default 'solid'
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      hatching?: {
        /**
         * @docid
         * @type Enums.HatchingDirection
         * @default 'none'
         */
        direction?: HatchingDirectionType,
        /**
         * @docid
         * @type number
         * @default 0.5
         */
        opacity?: number,
        /**
         * @docid
         * @type number
         * @default 6
         */
        step?: number,
        /**
         * @docid
         * @type number
         * @default 2
         */
        width?: number
      },
      /**
       * @docid
       * @type number
       * @default 3
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid
     * @type string
     * @default 'default'
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid
     * @type string
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: {
      /**
       * @docid
       * @type string
       * @default black
       */
      color?: string,
      /**
       * @docid
       * @type Enums.ValueErrorBarDisplayMode
       * @default 'auto'
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none',
      /**
       * @docid
       * @type number
       * @default 8
       */
      edgeLength?: number,
      /**
       * @docid
       * @type string
       * @default undefined
       */
      highValueField?: string,
      /**
       * @docid
       * @type number
       * @default 2
       */
      lineWidth?: number,
      /**
       * @docid
       * @type string
       * @default undefined
       */
      lowValueField?: string,
      /**
       * @docid
       * @type number
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @type Enums.ValueErrorBarType
       * @default undefined
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance',
      /**
       * @docid
       * @type number
       * @default 1
       */
      value?: number
    };
    /**
     * @docid
     * @type string
     * @default 'val'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default 2
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid
     * @extends CommonVizFormat
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentFormat?: format;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @type string
       * @default  '#d3d3d3'
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
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: {
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      color?: string,
      /**
       * @docid
       * @type boolean
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      visible?: boolean,
      /**
       * @docid
       * @type number
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid
     * @type Font
     * @default '#FFFFFF' [prop](color)
     * @default 14 [prop](size)
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
     * @type Enums.RelativePosition
     * @default 'outside'
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid
       * @type boolean
       * @default false
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      visible?: boolean,
      /**
       * @docid
       * @type number
       * @default 1
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid
         * @type string
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string,
        /**
         * @docid
         * @type boolean
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid
         * @type number
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid
       * @type number
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
    };
    /**
     * @docid
     * @type string|object
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | {
      /**
       * @docid
       * @type number
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      height?: number,
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      url?: string,
      /**
       * @docid
       * @type number
       * @default 30
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      width?: number
    };
    /**
     * @docid
     * @type Enums.ChartPointInteractionMode
     * @default 'onlyPoint'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
       * @docid
       * @type object
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      border?: {
        /**
         * @docid
         * @type string
         * @default undefined
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        color?: string,
        /**
         * @docid
         * @type boolean
         * @default true
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        visible?: boolean,
        /**
         * @docid
         * @type number
         * @default 4
         * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
         */
        width?: number
      },
      /**
       * @docid
       * @type string
       * @default undefined
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      color?: string,
      /**
       * @docid
       * @type number
       * @default 12
       * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
       */
      size?: number
    };
    /**
     * @docid
     * @type number
     * @default 12
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    size?: number;
    /**
     * @docid
     * @type Enums.VizPointSymbol
     * @default 'circle'
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
    /**
     * @docid
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 */
export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
     * @default 'nearestPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeriesPoint
 */
export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 */
export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 */
export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @acceptValues 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none'
     * @default 'excludePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * @docid
     * @type string
     * @acceptValues 'includePoints' | 'excludePoints' | 'none'
     * @default 'includePoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeries
 */
export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
    /**
     * @docid
     * @type string
     * @acceptValues 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none'
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @docid
 * @hidden
 * @inherits dxPolarChartSeriesTypesCommonPolarChartSeriesLabel
 */
export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * @docid
     * @type Enums.RelativePosition
     * @default 'inside'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    position?: 'inside' | 'outside';
}

/**
* @docid
* @publicName Series
* @type object
* @inherits baseSeriesObject
*/
export interface polarChartSeriesObject extends baseSeriesObject {
}

declare global {
interface JQuery {
    dxPolarChart(): JQuery;
    dxPolarChart(options: "instance"): dxPolarChart;
    dxPolarChart(options: string): any;
    dxPolarChart(options: string, ...params: any[]): any;
    dxPolarChart(options: dxPolarChartOptions): JQuery;
}
}
export type Options = dxPolarChartOptions;

/** @deprecated use Options instead */
export type IOptions = dxPolarChartOptions;
