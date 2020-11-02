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

/**
* @docid
* @type object
* @inherits BaseLegendItem
*/
export interface PieChartLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @type string|Date|number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentIndex?: number;
    /**
     * @docid
     * @type Array<piePointObject>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    points?: Array<piePointObject>;
    /**
     * @docid
     * @type any
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: any;
}

/**
 * @docid
 * @type object
 * @inherits dxPieChartSeriesTypesCommonPieChartSeries
 * @hidden
 */
export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
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
}
export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPieChartAdaptiveLayout;
    /**
     * @docid
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
     * @docid
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: any;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    diameter?: number;
    /**
     * @docid
     * @type number
     * @default 0.5
     * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    innerRadius?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPieChartLegend;
    /**
     * @docid
     * @type number
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minDiameter?: number;
    /**
     * @docid
     * @extends Action
     * @type function(e)|string
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
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.PieChartResolveLabelOverlapping
     * @default "none"
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * @docid
     * @type Enums.PieChartSegmentsDirection
     * @default 'clockwise'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    segmentsDirection?: SegmentsDirectionType;
    /**
     * @docid
     * @type PieChartSeries|Array<PieChartSeries>
     * @default undefined
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: PieChartSeries | Array<PieChartSeries>;
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
      * @type_function_return PieChartSeries
      */
      customizeSeries?: ((seriesName: any) => PieChartSeries),
      /**
      * @docid
      * @default 'series'
      */
      nameField?: string
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeGroup?: string;
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
     * @type Enums.PieChartType
     * @default 'pie'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: PieSeriesType;
    /**
     * @docid
     * @type Array<dxPieChartAnnotationConfig,object>
     * @inherits dxPieChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * @docid
     * @type dxPieChartCommonAnnotationConfig
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * @docid
     * @type function(annotation)
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return dxPieChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeAnnotation?: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig);
}

/**
* @docid
* @type object
* @inherits dxPieChartCommonAnnotationConfig
*/
export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
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
* @inherits BaseWidgetAnnotationConfig
*/
export interface dxPieChartCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * @docid
     * @type Enums.PieChartAnnotationLocation
     * @default 'center'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    location?: 'center' | 'edge';
    /**
     * @docid
     * @type number | datetime | string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: string;
    /**
     * @docid
     * @type function(annotation)
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @type template|function
     * @default undefined
     * @type_function_param1 annotation:dxPieChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
    /**
     * @docid
     * @type template|function(annotation, element)
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_param2 element:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: dxElement) => string | Element | JQuery);
}
/**
 * @docid
 * @inherits BaseChartAdaptiveLayout
 * @hidden
 */
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseChartLegend
 * @type object
 */
export interface dxPieChartLegend extends BaseChartLegend {
    /**
     * @docid
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
     * @docid
     * @type function(items)
     * @type_function_param1 items:Array<PieChartLegendItem>
     * @type_function_return Array<PieChartLegendItem>
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
    /**
     * @docid
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
     * @docid
     * @type Enums.PieChartLegendHoverMode
     * @default 'allArgumentPoints'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'none' | 'allArgumentPoints';
    /**
     * @docid
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
 * @docid
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
     * @docid
     * @publicName getInnerRadius()
     * @return number
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    getInnerRadius(): number;
}

/**
 * @docid
 * @type object
 */
export interface dxPieChartSeriesTypes {
    /**
     * @docid
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
    /**
     * @docid
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    DoughnutSeries?: any;
    /**
     * @docid
     * @type object
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    PieSeries?: any;
}
/**
 * @docid
 * @type object
 * @hidden
 */
export interface dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid
     * @type string
     * @default 'arg'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentField?: string;
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
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
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
       * @default undefined
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
       * @default 2
       */
      width?: number
    };
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
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverMode?: 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hoverStyle?: {
      /**
       * @docid
       * @type object
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
         * @default undefined
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
       * @type object
       */
      hatching?: {
        /**
         * @docid
         * @type Enums.HatchingDirection
         * @default 'right'
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
         * @default 10
         */
        step?: number,
        /**
         * @docid
         * @type number
         * @default 4
         */
        width?: number
      }
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
       * @docid
       * @extends CommonVizFormat
       */
      argumentFormat?: format,
      /**
       * @docid
       * @type string
       * @default undefined
       */
      backgroundColor?: string,
      /**
       * @docid
       * @type object
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
      },
      /**
       * @docid
       * @type object
       */
      connector?: {
        /**
         * @docid
         * @type string
         * @default undefined
         */
        color?: string,
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
      },
      /**
       * @docid
       * @type function(pointInfo)
       * @type_function_param1 pointInfo:object
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((pointInfo: any) => string),
      /**
       * @docid
       * @type Font
       * @default '#FFFFFF' [prop](color)
       * @default 14 [prop](size)
       */
      font?: Font,
      /**
       * @docid
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid
       * @type Enums.PieChartLabelPosition
       * @default 'outside'
       */
      position?: 'columns' | 'inside' | 'outside',
      /**
       * @docid
       * @type number
       * @default 0
       */
      radialOffset?: number,
      /**
       * @docid
       * @type number
       * @default 0
       */
      rotationAngle?: number,
      /**
       * @docid
       * @default 'ellipsis'
       * @type Enums.VizTextOverflow
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid
       * @type boolean
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @default 'normal'
       * @type Enums.VizWordWrap
       */
      wordWrap?: WordWrapType
    };
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minSegmentSize?: number;
    /**
     * @docid
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionMode?: 'none' | 'onlyPoint';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    selectionStyle?: {
      /**
       * @docid
       * @type object
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
         * @default undefined
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
       * @type object
       */
      hatching?: {
        /**
         * @docid
         * @type Enums.HatchingDirection
         * @default 'right'
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
         * @default 10
         */
        step?: number,
        /**
         * @docid
         * @type number
         * @default 4
         */
        width?: number
      }
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    smallValuesGrouping?: {
      /**
       * @docid
       * @type string
       * @default 'others'
       */
      groupName?: string,
      /**
       * @docid
       * @type Enums.SmallValuesGroupingMode
       * @default 'none'
       */
      mode?: 'none' | 'smallValueThreshold' | 'topN',
      /**
       * @docid
       * @type number
       * @default undefined
       */
      threshold?: number,
      /**
       * @docid
       * @type number
       * @default undefined
       */
      topCount?: number
    };
    /**
     * @docid
     * @type string
     * @default 'tag'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tagField?: string;
    /**
     * @docid
     * @type string
     * @default 'val'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    valueField?: string;
}

/**
* @docid
* @publicName Point
* @type object
* @inherits basePointObject
*/
export interface piePointObject extends basePointObject {
    /**
     * @docid
     * @publicName hide()
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    hide(): void;
    /**
     * @docid
     * @publicName isVisible()
     * @return boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    isVisible(): boolean;
    /**
     * @docid
     * @type string|number|date
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    percent?: string | number | Date;
    /**
     * @docid
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
