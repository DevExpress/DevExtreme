import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

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
    basePointObject,
    baseSeriesObject
} from './chart';

import {
    PaletteType
} from './palette';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    PointInteractionInfo,
    TooltipInfo
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
    BaseWidgetAnnotationConfig,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo
} from './core/base_widget';

export type PieSeriesType = 'donut' | 'doughnut' | 'pie';
export type SegmentsDirectionType = 'anticlockwise' | 'clockwise';


/** @public */
export type DisposingEvent = EventInfo<dxPieChart>;

/** @public */
export type DoneEvent = EventInfo<dxPieChart>;

/** @public */
export type DrawnEvent = EventInfo<dxPieChart>;

/** @public */
export type ExportedEvent = EventInfo<dxPieChart>;

/** @public */
export type ExportingEvent = EventInfo<dxPieChart> & ExportInfo;

/** @public */
export type FileSavingEvent = Cancelable & FileSavingEventInfo<dxPieChart>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxPieChart> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPieChart>;

/** @public */
export type LegendClickEvent = NativeEventInfo<dxPieChart> & {
  readonly target: string | number;
  readonly points: Array<piePointObject>;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxPieChart> & ChangedOptionInfo;

/** @public */
export type PointClickEvent = NativeEventInfo<dxPieChart> & PointInteractionInfo;

/** @public */
export type PointHoverChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/** @public */
export type PointSelectionChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxPieChart> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxPieChart> & TooltipInfo;

/**
 * @docid
 * @type object
 * @inherits BaseLegendItem
 * @namespace DevExpress.viz
 */
export interface PieChartLegendItem extends BaseLegendItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argumentIndex?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    points?: Array<piePointObject>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: any;
}

/**
 * @docid
 * @type object
 * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
 * @hidden
 * @namespace DevExpress.viz
 */
export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
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
}
/**
 * @deprecated use Properties instead
 * @namespace DevExpress.viz
 */
export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    adaptiveLayout?: dxPieChartAdaptiveLayout;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 component:dxPieChart
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    centerTemplate?: template | ((component: dxPieChart, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonSeriesSettings?: any;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    diameter?: number;
    /**
     * @docid
     * @default 0.5
     * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    innerRadius?: number;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    legend?: dxPieChartLegend;
    /**
     * @docid
     * @default 0.5
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    minDiameter?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxPieChart
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 target:String|Number
     * @type_function_param1_field6 points:Array<piePointObject>
     * @notUsedInTheme
     * @action
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
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
     * @default undefined
     * @hideDefaults true
     * @inheritAll
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: PieChartSeries | Array<PieChartSeries>;
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
       * @type_function_return PieChartSeries
       */
      customizeSeries?: ((seriesName: any) => PieChartSeries),
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 'series'
       */
      nameField?: string
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    sizeGroup?: string;
    /**
     * @docid
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
     * @inherits dxPieChartOptions.commonAnnotationSettings
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * @docid
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
 * @namespace DevExpress.viz
 */
export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
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
 * @inherits BaseWidgetAnnotationConfig
 * @namespace DevExpress.viz
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
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    series?: string;
    /**
     * @docid
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
     * @default undefined
     * @type_function_param1 annotation:dxPieChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}
/** @namespace DevExpress.viz */
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPieChartOptions.adaptiveLayout.keepLabels
     * @default false
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    keepLabels?: boolean;
}
/** @namespace DevExpress.viz */
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
    markerTemplate?: template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
}
/**
 * @docid
 * @inherits BaseChart
 * @module viz/pie_chart
 * @export default
 * @prevFileNamespace DevExpress.viz
 * @namespace DevExpress.viz
 * @public
 */
export default class dxPieChart extends BaseChart {
    constructor(element: UserDefinedElement, options?: dxPieChartOptions)
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
 * @namespace DevExpress.viz
 */
export interface dxPieChartSeriesTypes {
    /**
     * @docid
     * @type object
     * @hidden
     * @prevFileNamespace DevExpress.viz
     */
    CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    DoughnutSeries?: any;
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    PieSeries?: any;
}
/** @namespace DevExpress.viz */
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
    border?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.dashStyle
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default undefined
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.width
       * @prevFileNamespace DevExpress.viz
       * @default 2
       */
      width?: number
    };
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
    hoverStyle?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border
       * @prevFileNamespace DevExpress.viz
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.color
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.dashStyle
           * @prevFileNamespace DevExpress.viz
           * @type Enums.DashStyle
           * @default undefined
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.visible
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.width
           * @prevFileNamespace DevExpress.viz
           * @default 3
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching
       * @prevFileNamespace DevExpress.viz
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.direction
           * @prevFileNamespace DevExpress.viz
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.opacity
           * @prevFileNamespace DevExpress.viz
           * @default 0.75
           */
          opacity?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.step
           * @prevFileNamespace DevExpress.viz
           * @default 10
           */
          step?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.width
           * @prevFileNamespace DevExpress.viz
           * @default 4
           */
          width?: number
      }
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    label?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
       * @prevFileNamespace DevExpress.viz
       * @extends CommonVizFormat
       */
      argumentFormat?: format,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundColor
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      backgroundColor?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border
       * @prevFileNamespace DevExpress.viz
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color
           * @prevFileNamespace DevExpress.viz
           * @default  '#d3d3d3'
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashStyle
           * @prevFileNamespace DevExpress.viz
           * @type Enums.DashStyle
           * @default 'solid'
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width
           * @prevFileNamespace DevExpress.viz
           * @default 1
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector
       * @prevFileNamespace DevExpress.viz
       */
      connector?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width
           * @prevFileNamespace DevExpress.viz
           * @default 1
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.customizeText
       * @prevFileNamespace DevExpress.viz
       * @type_function_param1 pointInfo:object
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((pointInfo: any) => string),
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.font
       * @prevFileNamespace DevExpress.viz
       * @default '#FFFFFF' [prop](color)
       * @default 14 [prop](size)
       */
      font?: Font,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.format
       * @prevFileNamespace DevExpress.viz
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.position
       * @prevFileNamespace DevExpress.viz
       * @type Enums.PieChartLabelPosition
       * @default 'outside'
       */
      position?: 'columns' | 'inside' | 'outside',
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.radialOffset
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      radialOffset?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationAngle
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      rotationAngle?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.textOverflow
       * @prevFileNamespace DevExpress.viz
       * @default 'ellipsis'
       * @type Enums.VizTextOverflow
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.visible
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.wordWrap
       * @prevFileNamespace DevExpress.viz
       * @default 'normal'
       * @type Enums.VizWordWrap
       */
      wordWrap?: WordWrapType
    };
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
    selectionStyle?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border
       * @prevFileNamespace DevExpress.viz
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.color
           * @prevFileNamespace DevExpress.viz
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.dashStyle
           * @prevFileNamespace DevExpress.viz
           * @type Enums.DashStyle
           * @default undefined
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.visible
           * @prevFileNamespace DevExpress.viz
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.width
           * @prevFileNamespace DevExpress.viz
           * @default 3
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.color
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching
       * @prevFileNamespace DevExpress.viz
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.direction
           * @prevFileNamespace DevExpress.viz
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.opacity
           * @prevFileNamespace DevExpress.viz
           * @default 0.5
           */
          opacity?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.step
           * @prevFileNamespace DevExpress.viz
           * @default 10
           */
          step?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.width
           * @prevFileNamespace DevExpress.viz
           * @default 4
           */
          width?: number
      }
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    smallValuesGrouping?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.groupName
       * @prevFileNamespace DevExpress.viz
       * @default 'others'
       */
      groupName?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.mode
       * @prevFileNamespace DevExpress.viz
       * @type Enums.SmallValuesGroupingMode
       * @default 'none'
       */
      mode?: 'none' | 'smallValueThreshold' | 'topN',
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.threshold
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      threshold?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.topCount
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      topCount?: number
    };
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

/**
 * @docid
 * @publicName Point
 * @type object
 * @inherits basePointObject
 * @namespace DevExpress.viz
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

/**
 * @docid
 * @publicName Series
 * @type object
 * @inherits baseSeriesObject
 * @namespace DevExpress.viz
 */
export interface pieChartSeriesObject extends baseSeriesObject {
  /**
   * @docid
   * @prevFileNamespace DevExpress.viz
   * @publicName hover()
   * @hidden
   */
  hover(): void;
  /**
   * @docid
   * @prevFileNamespace DevExpress.viz
   * @publicName clearHover()
   * @hidden
   */
  clearHover(): void;
  /**
   * @docid
   * @prevFileNamespace DevExpress.viz
   * @publicName isHovered()
   * @hidden
   */
  isHovered(): boolean;
}

/** @public */
export type Properties = dxPieChartOptions;

/** @deprecated use Properties instead */
export type Options = dxPieChartOptions;

/** @deprecated use Properties instead */
export type IOptions = dxPieChartOptions;
