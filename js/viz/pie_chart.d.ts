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
     * @public
     */
    argument?: string | Date | number;
    /**
     * @docid
     * @public
     */
    argumentIndex?: number;
    /**
     * @docid
     * @public
     */
    points?: Array<piePointObject>;
    /**
     * @docid
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
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
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
     * @public
     */
    adaptiveLayout?: dxPieChartAdaptiveLayout;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 component:dxPieChart
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    centerTemplate?: template | ((component: dxPieChart, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @hideDefaults true
     * @inheritAll
     * @public
     */
    commonSeriesSettings?: any;
    /**
     * @docid
     * @default undefined
     * @public
     */
    diameter?: number;
    /**
     * @docid
     * @default 0.5
     * @propertyOf dxPieChartSeriesTypes.DoughnutSeries
     * @public
     */
    innerRadius?: number;
    /**
     * @docid
     * @type object
     * @public
     */
    legend?: dxPieChartLegend;
    /**
     * @docid
     * @default 0.5
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
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @extends CommonVizPalette
     * @type Array<string>|Enums.VizPalette
     * @public
     */
    palette?: Array<string> | PaletteType;
    /**
     * @docid
     * @type Enums.PieChartResolveLabelOverlapping
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * @docid
     * @type Enums.PieChartSegmentsDirection
     * @default 'clockwise'
     * @public
     */
    segmentsDirection?: SegmentsDirectionType;
    /**
     * @docid
     * @default undefined
     * @hideDefaults true
     * @inheritAll
     * @public
     */
    series?: PieChartSeries | Array<PieChartSeries>;
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
     * @default undefined
     * @public
     */
    sizeGroup?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    startAngle?: number;
    /**
     * @docid
     * @type Enums.PieChartType
     * @default 'pie'
     * @public
     */
    type?: PieSeriesType;
    /**
     * @docid
     * @inherits dxPieChartOptions.commonAnnotationSettings
     * @public
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * @docid
     * @public
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * @docid
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return dxPieChartAnnotationConfig
     * @default undefined
     * @notUsedInTheme
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
     * @public
     */
    location?: 'center' | 'edge';
    /**
     * @docid
     * @default undefined
     * @public
     */
    argument?: number | Date | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    series?: string;
    /**
     * @docid
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any);
    /**
     * @docid
     * @default undefined
     * @type_function_param1 annotation:dxPieChartCommonAnnotationConfig|any
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_param1 annotation:dxPieChartAnnotationConfig|any
     * @type_function_param2 element:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}
/** @namespace DevExpress.viz */
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPieChartOptions.adaptiveLayout.keepLabels
     * @default false
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
     * @public
     */
    customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.customizeItems
     * @type_function_param1 items:Array<PieChartLegendItem>
     * @type_function_return Array<PieChartLegendItem>
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
     * @public
     */
    customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.hoverMode
     * @type Enums.PieChartLegendHoverMode
     * @default 'allArgumentPoints'
     * @public
     */
    hoverMode?: 'none' | 'allArgumentPoints';
    /**
     * @docid dxPieChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:PieChartLegendItem
     * @type_function_param2 element:SVGGElement
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
}
/**
 * @docid
 * @inherits BaseChart
 * @module viz/pie_chart
 * @export default
 * @namespace DevExpress.viz
 * @public
 */
export default class dxPieChart extends BaseChart<dxPieChartOptions> {
    /**
     * @docid
     * @publicName getInnerRadius()
     * @return number
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
     */
    CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @public
     */
    DoughnutSeries?: any;
    /**
     * @docid
     * @inherits dxPieChartSeriesTypes.CommonPieChartSeries
     * @public
     */
    PieSeries?: any;
}
/** @namespace DevExpress.viz */
export interface dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.argumentField
     * @default 'arg'
     * @public
     */
    argumentField?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.argumentType
     * @type Enums.ChartDataType
     * @default undefined
     * @public
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border
     * @public
     */
    border?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.color
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.dashStyle
       * @type Enums.DashStyle
       * @default undefined
       */
      dashStyle?: DashStyleType,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.width
       * @default 2
       */
      width?: number
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.color
     * @default undefined
     * @public
     */
    color?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: 'none' | 'onlyPoint';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.color
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.dashStyle
           * @type Enums.DashStyle
           * @default undefined
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.visible
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.width
           * @default 3
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.color
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.direction
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.opacity
           * @default 0.75
           */
          opacity?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.step
           * @default 10
           */
          step?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.width
           * @default 4
           */
          width?: number
      }
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label
     * @public
     */
    label?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
       * @extends CommonVizFormat
       */
      argumentFormat?: format,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundColor
       * @default undefined
       */
      backgroundColor?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color
           * @default  '#d3d3d3'
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashStyle
           * @type Enums.DashStyle
           * @default 'solid'
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width
           * @default 1
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector
       */
      connector?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width
           * @default 1
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.customizeText
       * @type_function_param1 pointInfo:object
       * @type_function_return string
       * @notUsedInTheme
       */
      customizeText?: ((pointInfo: any) => string),
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.font
       * @default '#FFFFFF' [prop](color)
       * @default 14 [prop](size)
       */
      font?: Font,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.format
       * @extends CommonVizFormat
       */
      format?: format,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.position
       * @type Enums.PieChartLabelPosition
       * @default 'outside'
       */
      position?: 'columns' | 'inside' | 'outside',
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.radialOffset
       * @default 0
       */
      radialOffset?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationAngle
       * @default 0
       */
      rotationAngle?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.textOverflow
       * @default 'ellipsis'
       * @type Enums.VizTextOverflow
       */
      textOverflow?: VizTextOverflowType,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.visible
       * @default false
       */
      visible?: boolean,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.wordWrap
       * @default 'normal'
       * @type Enums.VizWordWrap
       */
      wordWrap?: WordWrapType
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount
     * @default undefined
     * @public
     */
    maxLabelCount?: number;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize
     * @default undefined
     * @public
     */
    minSegmentSize?: number;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode
     * @type Enums.PieChartSeriesInteractionMode
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: 'none' | 'onlyPoint';
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.color
           * @default undefined
           */
          color?: string,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.dashStyle
           * @type Enums.DashStyle
           * @default undefined
           */
          dashStyle?: DashStyleType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.visible
           * @default false
           */
          visible?: boolean,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.width
           * @default 3
           */
          width?: number
      },
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.color
       * @default undefined
       */
      color?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.direction
           * @type Enums.HatchingDirection
           * @default 'right'
           */
          direction?: HatchingDirectionType,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.opacity
           * @default 0.5
           */
          opacity?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.step
           * @default 10
           */
          step?: number,
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.width
           * @default 4
           */
          width?: number
      }
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping
     * @public
     */
    smallValuesGrouping?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.groupName
       * @default 'others'
       */
      groupName?: string,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.mode
       * @type Enums.SmallValuesGroupingMode
       * @default 'none'
       */
      mode?: 'none' | 'smallValueThreshold' | 'topN',
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.threshold
       * @default undefined
       */
      threshold?: number,
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.topCount
       * @default undefined
       */
      topCount?: number
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.tagField
     * @default 'tag'
     * @public
     */
    tagField?: string;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.valueField
     * @default 'val'
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
     * @public
     */
    hide(): void;
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
    percent?: string | number | Date;
    /**
     * @docid
     * @publicName show()
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
   * @publicName hover()
   * @hidden
   */
  hover(): void;
  /**
   * @docid
   * @publicName clearHover()
   * @hidden
   */
  clearHover(): void;
  /**
   * @docid
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
