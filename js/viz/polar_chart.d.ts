import {
    JQueryEventObject
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

import {
    format
} from '../ui/widget/ui.widget';

import {
    baseSeriesObject,
    chartAxisObject
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip
} from './chart_components/base_chart';

import {
    VizRange
} from './common';

import {
    Font
} from './core/base_widget';

export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid PolarChartSeries.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid PolarChartSeries.tag
     * @type any
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid PolarChartSeries.type
     * @type Enums.PolarChartSeriesType
     * @default 'scatter'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
}

export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * @docid dxPolarChartOptions.adaptiveLayout
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPolarChartAdaptiveLayout;
    /**
     * @docid dxPolarChartOptions.argumentAxis
     * @type object
     * @inherits dxPolarChartOptions.commonAxisSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentAxis?: dxPolarChartArgumentAxis;
    /**
     * @docid dxPolarChartOptions.barGroupPadding
     * @type number
     * @default 0.3
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupPadding?: number;
    /**
     * @docid dxPolarChartOptions.barGroupWidth
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barGroupWidth?: number;
    /**
     * @docid dxPolarChartOptions.barWidth
     * @type number
     * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAxisSettings?: dxPolarChartCommonAxisSettings;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
    /**
     * @docid dxPolarChartOptions.containerBackgroundColor
     * @type string
     * @default '#FFFFFF'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    containerBackgroundColor?: string;
    /**
     * @docid dxPolarChartOptions.dataPrepareSettings
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) };
    /**
     * @docid dxPolarChartOptions.equalBarWidth
     * @type boolean
     * @deprecated dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    equalBarWidth?: boolean;
    /**
     * @docid dxPolarChartOptions.legend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPolarChartLegend;
    /**
     * @docid dxPolarChartOptions.negativesAsZeroes
     * @type boolean
     * @default false
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    negativesAsZeroes?: boolean;
    /**
     * @docid dxPolarChartOptions.onArgumentAxisClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 argument:Date|Number|string
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
    /**
     * @docid dxPolarChartOptions.onLegendClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
    /**
     * @docid dxPolarChartOptions.onSeriesClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:polarChartSeriesObject
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onSeriesClick?: ((e: { component?: dxPolarChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
    /**
     * @docid dxPolarChartOptions.onSeriesHoverChanged
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
     * @docid dxPolarChartOptions.onSeriesSelectionChanged
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
     * @docid dxPolarChartOptions.onZoomEnd
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
     * @docid dxPolarChartOptions.onZoomStart
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
     * @docid dxPolarChartOptions.resolveLabelOverlapping
     * @type Enums.PolarChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * @docid dxPolarChartOptions.series
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
     * @docid dxPolarChartOptions.seriesSelectionMode
     * @type Enums.ChartElementSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * @docid dxPolarChartOptions.seriesTemplate
     * @type object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: { customizeSeries?: ((seriesName: any) => PolarChartSeries), nameField?: string };
    /**
     * @docid dxPolarChartOptions.tooltip
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltip?: dxPolarChartTooltip;
    /**
     * @docid dxPolarChartOptions.useSpiderWeb
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    useSpiderWeb?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis
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
     * @type number
     * @default 170
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    height?: number;
    /**
     * @docid dxPolarChartOptions.adaptiveLayout.width
     * @type number
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
     * @type number
     * @default 50
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.categories
     * @type Array<number,string,Date>
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
     * @type boolean
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
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.logarithmBase
     * @type number
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
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxPolarChartOptions.argumentAxis.originValue
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    originValue?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.period
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    period?: number;
    /**
     * @docid dxPolarChartOptions.argumentAxis.startAngle
     * @type number
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
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
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.extendAxis
     * @type boolean
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
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.constantLines.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.label.customizeHint
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
     * @docid dxPolarChartOptions.argumentAxis.label.customizeText
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
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.color
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.endValue
     * @type number | datetime | string
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
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.argumentAxis.strips.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.argumentAxis.tick.shift
     * @type number
     * @default 3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shift?: number;
}
export interface dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.allowDecimals
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    allowDecimals?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.color
     * @type string
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
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endOnTick?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.grid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.inverted
     * @type boolean
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.opacity
     * @type number
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.width
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.color
     * @type string
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
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.width
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.label.indentFromAxis
     * @type number
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.color
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.length
     * @type number
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.opacity
     * @type number
     * @default 0.3
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.minorTick.width
     * @type number
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
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
}
export interface dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.color
     * @type string
     * @default '#767676'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.length
     * @type number
     * @default 7
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.opacity
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    opacity?: number;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartOptions.commonAxisSettings.tick.width
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    width?: number;
}
export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.area
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    area?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.bar
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    bar?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.line
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    line?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.scatter
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatter?: any;
    /**
     * @docid dxPolarChartOptions.commonSeriesSettings.stackedbar
     * @type object
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
    type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
}
export interface dxPolarChartLegend extends BaseChartLegend {
    /**
     * @docid dxPolarChartOptions.legend.customizeHint
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
     * @docid dxPolarChartOptions.legend.customizeText
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
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    shared?: boolean;
}
export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
    /**
     * @docid dxPolarChartOptions.valueAxis.axisDivisionFactor
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    axisDivisionFactor?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.categories
     * @type Array<number,string,Date>
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
     * @type boolean
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
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linearThreshold?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.logarithmBase
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    logarithmBase?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.maxValueMargin
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minValueMargin
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minValueMargin?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minVisualRangeLength
     * @inherits VizTimeInterval
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickCount
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickCount?: number;
    /**
     * @docid dxPolarChartOptions.valueAxis.minorTickInterval
     * @inherits VizTimeInterval
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid dxPolarChartOptions.valueAxis.showZero
     * @type boolean
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
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
     * @type boolean
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
     * @type VizRange | Array<number,string,Date>
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
     * @type VizRange | Array<number,string,Date>
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    wholeRange?: VizRange | Array<number | string | Date>;
}
export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.displayBehindSeries
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    displayBehindSeries?: boolean;
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.extendAxis
     * @type boolean
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
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    value?: number | Date | string;
}
export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.constantLines.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.label.customizeHint
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
     * @docid dxPolarChartOptions.valueAxis.label.customizeText
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
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.endValue
     * @type number | datetime | string
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
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * @docid dxPolarChartOptions.valueAxis.strips.label.text
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
}
export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
    /**
     * @docid dxPolarChartOptions.valueAxis.tick.visible
     * @type boolean
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
    constructor(element: Element, options?: dxPolarChartOptions)
    constructor(element: JQuery, options?: dxPolarChartOptions)
    /**
     * @docid dxPolarChartMethods.getValueAxis
     * @publicName getValueAxis()
     * @return chartAxisObject
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getValueAxis(): chartAxisObject;
    /**
     * @docid dxPolarChartMethods.resetVisualRange
     * @publicName resetVisualRange()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resetVisualRange(): void;
}

export interface dxPolarChartSeriesTypes {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
    /**
     * @docid dxPolarChartSeriesTypes.areapolarseries
     * @publicName AreaSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
    /**
     * @docid dxPolarChartSeriesTypes.barpolarseries
     * @publicName BarSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
    /**
     * @docid dxPolarChartSeriesTypes.linepolarseries
     * @publicName LineSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
    /**
     * @docid dxPolarChartSeriesTypes.scatterpolarseries
     * @publicName ScatterSeries
     * @type object
     * @inherits dxPolarChartSeriesTypes.CommonPolarChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    scatterpolarseries?: any;
    /**
     * @docid dxPolarChartSeriesTypes.stackedbarpolarseries
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
     * @type string
     * @default 'arg'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barPadding?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    barWidth?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.border
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.closed
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.linepolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    closed?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.color
     * @type string
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
    dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints
     * @type boolean
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
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize
     * @type number
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries,dxPolarChartSeriesTypes.barpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minBarSize?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity
     * @type number
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showInLegend?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.stack
     * @type string
     * @default 'default'
     * @propertyOf dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    stack?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField
     * @type string
     * @default 'tag'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField
     * @type string
     * @default 'val'
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.width
     * @type number
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
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.scatterpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    connector?: { color?: string, visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText
     * @type function(pointInfo)
     * @type_function_param1 pointInfo:object
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font
     * @type Font
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
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues
     * @type boolean
     * @default true
     * @propertyOf dxPolarChartSeriesTypes.barpolarseries,dxPolarChartSeriesTypes.stackedbarpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, visible?: boolean, width?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color
     * @type string
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
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image
     * @type string|object
     * @default undefined
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    image?: string | { height?: number, url?: string, width?: number };
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
     * @type object
     * @propertyOf dxPolarChartSeriesTypes.linepolarseries,dxPolarChartSeriesTypes.areapolarseries,dxPolarChartSeriesTypes.scatterpolarseries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
    /**
     * @docid dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size
     * @type number
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
     * @type boolean
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
     * @type boolean
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