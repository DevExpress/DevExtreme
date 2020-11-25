import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events/index';

import {
    format
} from '../ui/widget/ui.widget';

import {
    basePointObject
} from './chart';

import {
    PaletteType
} from './palette';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions
} from './chart_components/base_chart';

import {
    BaseLegendItem,
    DashStyleType,
    HatchingDirectionType
} from './common';

import {
    Font,
    WordWrapType,
    VizTextOverflowType,
    BaseWidgetAnnotationConfig
} from './core/base_widget';

export type PieSeriesType = 'donut' | 'doughnut' | 'pie';
export type SegmentsDirectionType = 'anticlockwise' | 'clockwise';

export interface PieChartLegendItem extends BaseLegendItem {
    /**
     * @docid PieChartLegendItem.argument
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid PieChartLegendItem.argumentIndex
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentIndex?: number;
    /**
     * @docid PieChartLegendItem.points
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    points?: Array<piePointObject>;
    /**
     * @docid PieChartLegendItem.text
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: any;
}

export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid PieChartSeries.name
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid PieChartSeries.tag
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
}
export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
    /**
     * @docid dxPieChartOptions.adaptiveLayout
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPieChartAdaptiveLayout;
    /**
     * @docid dxPieChartOptions.centerTemplate
     * @default undefined
     * @type_function_param1 component:dxPieChart
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    centerTemplate?: template | ((component: dxPieChart, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid dxPieChartOptions.commonSeriesSettings
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: any;
    /**
     * @docid dxPieChartOptions.diameter
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    diameter?: number;
    /**
     * @docid dxPieChartOptions.innerRadius
     * @default 0.5
     * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    innerRadius?: number;
    /**
     * @docid dxPieChartOptions.legend
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPieChartLegend;
    /**
     * @docid dxPieChartOptions.minDiameter
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minDiameter?: number;
    /**
     * @docid dxPieChartOptions.onLegendClick
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:String|Number
     * @type_function_param1_field6 points:Array<piePointObject>
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxPieChart, element?: dxElement, model?: any, event?: event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
    /**
     * @docid dxPieChartOptions.palette
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid dxPieChartOptions.resolveLabelOverlapping
     * @type Enums.PieChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * @docid dxPieChartOptions.segmentsDirection
     * @type Enums.PieChartSegmentsDirection
     * @default 'clockwise'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    segmentsDirection?: SegmentsDirectionType;
    /**
     * @docid dxPieChartOptions.series
     * @default undefined
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: PieChartSeries | Array<PieChartSeries>;
    /**
     * @docid dxPieChartOptions.seriesTemplate
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: { customizeSeries?: ((seriesName: any) => PieChartSeries), nameField?: string };
    /**
     * @docid dxPieChartOptions.sizeGroup
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeGroup?: string;
    /**
     * @docid dxPieChartOptions.startAngle
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startAngle?: number;
    /**
     * @docid dxPieChartOptions.type
     * @type Enums.PieChartType
     * @default 'pie'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: PieSeriesType;
    /**
     * @docid dxPieChartOptions.annotations
     * @inherits dxPieChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * @docid dxPieChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * @docid dxPieChartOptions.customizeAnnotation
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return dxPieChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig);
}
export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
    /**
     * @docid dxPieChartAnnotationConfig.name
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
}

export interface dxPieChartCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid dxPieChartCommonAnnotationConfig.location
     * @type Enums.PieChartAnnotationLocation
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    location?: 'center' | 'edge';
    /**
     * @docid dxPieChartCommonAnnotationConfig.argument
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid dxPieChartCommonAnnotationConfig.series
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: string;
    /**
     * @docid dxPieChartCommonAnnotationConfig.customizeTooltip
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any);
    /**
     * @docid dxPieChartCommonAnnotationConfig.template
     * @default undefined
     * @type_function_param1 annotation:dxPieChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid dxPieChartCommonAnnotationConfig.tooltipTemplate
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: dxElement) => string | Element | JQuery);
}
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPieChartOptions.adaptiveLayout.keepLabels
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
}
export interface dxPieChartLegend extends BaseChartLegend {
    /**
     * @docid dxPieChartOptions.legend.customizeHint
     * @type_function_param1 pointInfo:object
     * @type_function_param1_field1 pointName:any
     * @type_function_param1_field2 pointIndex:Number
     * @type_function_param1_field3 pointColor:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.customizeItems
     * @type_function_param1 items:Array<PieChartLegendItem>
     * @type_function_return Array<PieChartLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
    /**
     * @docid dxPieChartOptions.legend.customizeText
     * @type_function_param1 pointInfo:object
     * @type_function_param1_field1 pointName:any
     * @type_function_param1_field2 pointIndex:Number
     * @type_function_param1_field3 pointColor:string
     * @type_function_return string
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.hoverMode
     * @type Enums.PieChartLegendHoverMode
     * @default 'allArgumentPoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'none' | 'allArgumentPoints';
    /**
     * @docid dxPieChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:PieChartLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerTemplate?: template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
}
/**
 * @docid dxPieChart
 * @inherits BaseChart
 * @module viz/pie_chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export default class dxPieChart extends BaseChart {
    constructor(element: Element, options?: dxPieChartOptions)
    constructor(element: JQuery, options?: dxPieChartOptions)
    /**
     * @docid dxPieChart.getInnerRadius
     * @publicName getInnerRadius()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getInnerRadius(): number;
}

export interface dxPieChartSeriesTypes {
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
    /**
     * @docid dxPieChartSeriesTypes.DoughnutSeries
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    DoughnutSeries?: any;
    /**
     * @docid dxPieChartSeriesTypes.PieSeries
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    PieSeries?: any;
}
export interface dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.argumentField
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: DashStyleType, visible?: boolean, width?: number };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.color
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    color?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'none' | 'onlyPoint';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: { border?: { color?: string, dashStyle?: DashStyleType, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: HatchingDirectionType, opacity?: number, step?: number, width?: number } };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: { argumentFormat?: format, backgroundColor?: string, border?: { color?: string, dashStyle?: DashStyleType, visible?: boolean, width?: number }, connector?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), font?: Font, format?: format, position?: 'columns' | 'inside' | 'outside', radialOffset?: number, rotationAngle?: number, textOverflow?: VizTextOverflowType, visible?: boolean, wordWrap?: WordWrapType };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minSegmentSize?: number;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'none' | 'onlyPoint';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: { border?: { color?: string, dashStyle?: DashStyleType, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: HatchingDirectionType, opacity?: number, step?: number, width?: number } };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    smallValuesGrouping?: { groupName?: string, mode?: 'none' | 'smallValueThreshold' | 'topN', threshold?: number, topCount?: number };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.tagField
     * @default 'tag'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.valueField
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}

export interface piePointObject extends basePointObject {
    /**
     * @docid piePointObject.hide
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid piePointObject.isVisible
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid piePointObject.percent
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    percent?: string | number | Date;
    /**
     * @docid piePointObject.show
     * @publicName show()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    show(): void;
}

declare global {
interface JQuery {
    dxPieChart(): JQuery;
    dxPieChart(options: "instance"): dxPieChart;
    dxPieChart(options: string): any;
    dxPieChart(options: string, ...params: any[]): any;
    dxPieChart(options: dxPieChartOptions): JQuery;
}
}
export type Options = dxPieChartOptions;

/** @deprecated use Options instead */
export type IOptions = dxPieChartOptions;
