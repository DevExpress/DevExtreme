import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    Format,
} from '../localization';

import {
    basePointObject,
    baseSeriesObject,
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    PointInteractionInfo,
    TooltipInfo,
} from './chart_components/base_chart';

import {
    BaseLegendItem,
} from './common';

import {
    Font,
    BaseWidgetAnnotationConfig,
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ChartsDataType,
    DashStyle,
    HatchDirection,
    LabelPosition,
    Palette,
    ShiftLabelOverlap,
    TextOverflow,
    WordWrap,
    ChartsColor,
} from '../common/charts';

export {
    ChartsDataType,
    DashStyle,
    HatchDirection,
    LabelPosition,
    Palette,
    TextOverflow,
    WordWrap,
    ShiftLabelOverlap,
};

/** @public */
export type PieChartAnnotationLocation = 'center' | 'edge';
/** @public */
export type PieChartLegendHoverMode = 'none' | 'allArgumentPoints';
/**
 * @deprecated Use ShiftLabelOverlap from 'devextreme/common/charts' instead
 */
export type PieChartLabelOverlap = ShiftLabelOverlap;
/** @public */
export type PieChartSegmentDirection = 'anticlockwise' | 'clockwise';
/** @public */
export type PieChartSeriesInteractionMode = 'none' | 'onlyPoint';
/** @public */
export type PieChartType = 'donut' | 'doughnut' | 'pie';
/** @public */
export type SmallValuesGroupingMode = 'none' | 'smallValueThreshold' | 'topN';

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
export type FileSavingEvent = FileSavingEventInfo<dxPieChart>;

/** @public */
export type IncidentOccurredEvent = EventInfo<dxPieChart> & IncidentInfo;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPieChart>;

/** @public */
export type LegendClickEvent = NativeEventInfo<dxPieChart, MouseEvent | PointerEvent> & {
  readonly target: string | number;
  readonly points: Array<piePointObject>;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxPieChart> & ChangedOptionInfo;

/** @public */
export type PointClickEvent = NativeEventInfo<dxPieChart, MouseEvent | PointerEvent> & PointInteractionInfo;

/** @public */
export type PointHoverChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/** @public */
export type PointSelectionChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/** @public */
export type TooltipHiddenEvent = EventInfo<dxPieChart> & TooltipInfo;

/** @public */
export type TooltipShownEvent = EventInfo<dxPieChart> & TooltipInfo;

/**
 * @public
 * @docid PieChartLegendItem
 * @namespace DevExpress.viz.dxPieChart
 * @inherits BaseLegendItem
 * @type object
 */
export type LegendItem = PieChartLegendItem;

/**
 * @deprecated Use LegendItem instead
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
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxPieChart
     * @type_function_param1_field event:event
     * @type_function_param1_field points:Array<piePointObject>
     * @notUsedInTheme
     * @action
     * @public
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * @docid
     * @default "Material"
     * @public
     */
    palette?: Array<string> | Palette;
    /**
     * @docid
     * @default "none"
     * @public
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * @docid
     * @default 'clockwise'
     * @public
     */
    segmentsDirection?: PieChartSegmentDirection;
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
       */
      customizeSeries?: ((seriesName: any) => PieChartSeries);
      /**
       * @docid
       * @default 'series'
       */
      nameField?: string;
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
     * @default 'pie'
     * @public
     */
    type?: PieChartType;
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
     * @default 'center'
     * @public
     */
    location?: PieChartAnnotationLocation;
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
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement);
}
/**
 * @docid
 * @namespace DevExpress.viz
 */
export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * @docid dxPieChartOptions.adaptiveLayout.keepLabels
     * @default false
     * @public
     */
    keepLabels?: boolean;
}
/**
 * @docid
 * @namespace DevExpress.viz
 * */
export interface dxPieChartLegend extends BaseChartLegend {
    /**
     * @docid dxPieChartOptions.legend.customizeHint
     * @public
     */
    customizeHint?: ((pointInfo: { pointName?: any; pointIndex?: number; pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.customizeItems
     * @type_function_param1 items:Array<PieChartLegendItem>
     * @type_function_return Array<PieChartLegendItem>
     * @public
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * @docid dxPieChartOptions.legend.customizeText
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: { pointName?: any; pointIndex?: number; pointColor?: string }) => string);
    /**
     * @docid dxPieChartOptions.legend.hoverMode
     * @default 'allArgumentPoints'
     * @public
     */
    hoverMode?: PieChartLegendHoverMode;
    /**
     * @docid dxPieChartOptions.legend.markerTemplate
     * @default undefined
     * @type_function_param1 legendItem:PieChartLegendItem
     * @type_function_return string|SVGElement|jQuery
     * @public
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>);
}
/**
 * @docid
 * @inherits BaseChart
 * @namespace DevExpress.viz
 * @public
 */
export default class dxPieChart extends BaseChart<dxPieChartOptions> {
    /**
     * @docid
     * @publicName getInnerRadius()
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
     * @default undefined
     * @public
     */
    argumentType?: ChartsDataType;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border
     * @public
     */
    border?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.color
       * @default undefined
       */
      color?: string;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.dashStyle
       * @default undefined
       */
      dashStyle?: DashStyle;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.border.width
       * @default 2
       */
      width?: number;
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.color
     * @default undefined
     * @public
     */
    color?: string | ChartsColor;
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode
     * @default 'onlyPoint'
     * @public
     */
    hoverMode?: PieChartSeriesInteractionMode;
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
          color?: string;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.dashStyle
           * @default undefined
           */
          dashStyle?: DashStyle;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.visible
           * @default false
           */
          visible?: boolean;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.width
           * @default 3
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.color
       * @default undefined
       */
      color?: string | ChartsColor;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.direction
           * @default 'right'
           */
          direction?: HatchDirection;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.opacity
           * @default 0.75
           */
          opacity?: number;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.step
           * @default 10
           */
          step?: number;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.width
           * @default 4
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.highlight
       * @default true
       */
      highlight?: boolean;
    };
    /**
     * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label
     * @public
     */
    label?: {
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat
       * @default undefined
       */
      argumentFormat?: Format;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundColor
       * @default undefined
       */
      backgroundColor?: string;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border
       */
      border?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color
           * @default  '#d3d3d3'
           */
          color?: string;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashStyle
           * @default 'solid'
           */
          dashStyle?: DashStyle;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible
           * @default false
           */
          visible?: boolean;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width
           * @default 1
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector
       */
      connector?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color
           * @default undefined
           */
          color?: string;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible
           * @default false
           */
          visible?: boolean;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width
           * @default 1
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.customizeText
       * @type_function_param1 pointInfo:object
       * @notUsedInTheme
       */
      customizeText?: ((pointInfo: any) => string);
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.font
       * @default '#FFFFFF' &prop(color)
       * @default 14 &prop(size)
       */
      font?: Font;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.format
       * @default undefined
       */
      format?: Format;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.position
       * @default 'outside'
       */
      position?: LabelPosition;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.radialOffset
       * @default 0
       */
      radialOffset?: number;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationAngle
       * @default 0
       */
      rotationAngle?: number;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.textOverflow
       * @default 'ellipsis'
       */
      textOverflow?: TextOverflow;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.wordWrap
       * @default 'normal'
       */
      wordWrap?: WordWrap;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.label.displayFormat
       * @default undefined
       * @public
       */
       displayFormat?: string;
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
     * @default 'onlyPoint'
     * @public
     */
    selectionMode?: PieChartSeriesInteractionMode;
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
          color?: string;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.dashStyle
           * @default undefined
           */
          dashStyle?: DashStyle;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.visible
           * @default false
           */
          visible?: boolean;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.width
           * @default 3
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.color
       * @default undefined
       */
      color?: string | ChartsColor;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching
       */
      hatching?: {
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.direction
           * @default 'right'
           */
          direction?: HatchDirection;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.opacity
           * @default 0.5
           */
          opacity?: number;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.step
           * @default 10
           */
          step?: number;
          /**
           * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.width
           * @default 4
           */
          width?: number;
      };
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.highlight
       * @default true
       */
      highlight?: boolean;
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
      groupName?: string;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.mode
       * @default 'none'
       */
      mode?: SmallValuesGroupingMode;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.threshold
       * @default undefined
       */
      threshold?: number;
      /**
       * @docid dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.topCount
       * @default undefined
       */
      topCount?: number;
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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxPieChartOptions.onDisposing
 * @type_function_param1 e:{viz/pie_chart:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onDone
 * @type_function_param1 e:{viz/pie_chart:DoneEvent}
 */
onDone?: ((e: DoneEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onDrawn
 * @type_function_param1 e:{viz/pie_chart:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onExported
 * @type_function_param1 e:{viz/pie_chart:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onExporting
 * @type_function_param1 e:{viz/pie_chart:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onFileSaving
 * @type_function_param1 e:{viz/pie_chart:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/pie_chart:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onInitialized
 * @type_function_param1 e:{viz/pie_chart:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onLegendClick
 * @type_function_param1 e:{viz/pie_chart:LegendClickEvent}
 */
onLegendClick?: ((e: LegendClickEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onOptionChanged
 * @type_function_param1 e:{viz/pie_chart:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onPointClick
 * @type_function_param1 e:{viz/pie_chart:PointClickEvent}
 */
onPointClick?: ((e: PointClickEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onPointHoverChanged
 * @type_function_param1 e:{viz/pie_chart:PointHoverChangedEvent}
 */
onPointHoverChanged?: ((e: PointHoverChangedEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onPointSelectionChanged
 * @type_function_param1 e:{viz/pie_chart:PointSelectionChangedEvent}
 */
onPointSelectionChanged?: ((e: PointSelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onTooltipHidden
 * @type_function_param1 e:{viz/pie_chart:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @skip
 * @docid dxPieChartOptions.onTooltipShown
 * @type_function_param1 e:{viz/pie_chart:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
