import {
    JQueryEventObject
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import {
    format
} from '../ui/widget/ui.widget';

import {
    basePointObject
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions
} from './chart_components/base_chart';

import {
    BaseLegendItem
} from './common';

import {
    Font
} from './core/base_widget';

export interface PieChartLegendItem extends BaseLegendItem {
    /**
     * @docid PieChartLegendItem.argument
     * @type string|Date|number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid PieChartLegendItem.argumentIndex
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentIndex?: number;
    /**
     * @docid PieChartLegendItem.points
     * @type Array<piePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    points?: Array<piePointObject>;
    /**
     * @docid PieChartLegendItem.text
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: any;
}

export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid PieChartSeries.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid PieChartSeries.tag
     * @type any
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
     * @type template|function
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
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: any;
    /**
     * @docid dxPieChartOptions.diameter
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    diameter?: number;
    /**
     * @docid dxPieChartOptions.innerRadius
     * @type number
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
     * @type number
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minDiameter?: number;
    /**
     * @docid dxPieChartOptions.onLegendClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 target:String|Number
     * @type_function_param1_field7 points:Array<piePointObject>
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: { component?: dxPieChart, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
    /**
     * @docid dxPieChartOptions.palette
     * @extends CommonVizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
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
    segmentsDirection?: 'anticlockwise' | 'clockwise';
    /**
     * @docid dxPieChartOptions.series
     * @type PieChartSeries|Array<PieChartSeries>
     * @default undefined
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: PieChartSeries | Array<PieChartSeries>;
    /**
     * @docid dxPieChartOptions.seriesTemplate
     * @type object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    seriesTemplate?: { customizeSeries?: ((seriesName: any) => PieChartSeries), nameField?: string };
    /**
     * @docid dxPieChartOptions.sizeGroup
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeGroup?: string;
    /**
     * @docid dxPieChartOptions.startAngle
     * @type number
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
    type?: 'donut' | 'doughnut' | 'pie';
}
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPieChartOptions.adaptiveLayout.keepLabels
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
}
export interface dxPieChartLegend extends BaseChartLegend {
    /**
     * @docid dxPieChartOptions.legend.customizeHint
     * @type function(pointInfo)
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
     * @type function(items)
     * @type_function_param1 items:Array<PieChartLegendItem>
     * @type_function_return Array<PieChartLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
    /**
     * @docid dxPieChartOptions.legend.customizeText
     * @type function(pointInfo)
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
     * @type template|function
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
     * @docid dxPieChartMethods.getInnerRadius
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
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    DoughnutSeries?: any;
    /**
     * @docid dxPieChartSeriesTypes.PieSeries
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    PieSeries?: any;
}
export interface dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.argumentField
     * @type string
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.color
     * @type string
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: { argumentFormat?: format, backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), font?: Font, format?: format, position?: 'columns' | 'inside' | 'outside', radialOffset?: number, rotationAngle?: number, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize
     * @type number
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    smallValuesGrouping?: { groupName?: string, mode?: 'none' | 'smallValueThreshold' | 'topN', threshold?: number, topCount?: number };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.tagField
     * @type string
     * @default 'tag'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.valueField
     * @type string
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}

export interface piePointObject extends basePointObject {
    /**
     * @docid piePointObjectMethods.hide
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid piePointObjectMethods.isVisible
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid piePointObjectFields.percent
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    percent?: string | number | Date;
    /**
     * @docid piePointObjectMethods.show
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