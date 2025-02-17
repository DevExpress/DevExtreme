import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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
    Font,
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

export type PieChartAnnotationLocation = 'center' | 'edge';
export type PieChartLegendHoverMode = 'none' | 'allArgumentPoints';
/**
 * @deprecated Use ShiftLabelOverlap from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type PieChartLabelOverlap = ShiftLabelOverlap;
export type PieChartSegmentDirection = 'anticlockwise' | 'clockwise';
export type PieChartSeriesInteractionMode = 'none' | 'onlyPoint';
export type PieChartType = 'donut' | 'doughnut' | 'pie';
export type SmallValuesGroupingMode = 'none' | 'smallValueThreshold' | 'topN';

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxPieChart>;

/**
 * The type of the done event handler&apos;s argument.
 */
export type DoneEvent = EventInfo<dxPieChart>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxPieChart>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxPieChart>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxPieChart> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxPieChart>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxPieChart> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxPieChart>;

/**
 * The type of the legendClick event handler&apos;s argument.
 */
export type LegendClickEvent = NativeEventInfo<dxPieChart, MouseEvent | PointerEvent> & {
  /**
   * 
   */
  readonly target: string | number;
  /**
   * 
   */
  readonly points: Array<piePointObject>;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxPieChart> & ChangedOptionInfo;

/**
 * The type of the pointClick event handler&apos;s argument.
 */
export type PointClickEvent = NativeEventInfo<dxPieChart, MouseEvent | PointerEvent> & PointInteractionInfo;

/**
 * The type of the pointHoverChanged event handler&apos;s argument.
 */
export type PointHoverChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/**
 * The type of the pointSelectionChanged event handler&apos;s argument.
 */
export type PointSelectionChangedEvent = EventInfo<dxPieChart> & PointInteractionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxPieChart> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxPieChart> & TooltipInfo;

/**
 * An object that provides information about a legend item in the PieChart UI component.
 */
export type LegendItem = PieChartLegendItem;

/**
 * @deprecated Use LegendItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PieChartLegendItem extends BaseLegendItem {
    /**
     * The argument of the point(s) that the legend item represents.
     */
    argument?: string | Date | number;
    /**
     * The zero-based index of the legend item used to identify the item among other legend items with the same argument.
     */
    argumentIndex?: number;
    /**
     * An array of points that the legend item represents. Can contain more than one point only in a multi-series PieChart.
     */
    points?: Array<piePointObject>;
    /**
     * The text that the legend item displays.
     */
    text?: any;
}

/**
 * Specifies properties for the series of the PieChart UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * Specifies the name that identifies the series.
     */
    name?: string | undefined;
    /**
     * Specifies data about a series.
     */
    tag?: any | undefined;
}
/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
    /**
     * Specifies adaptive layout properties.
     */
    adaptiveLayout?: AdaptiveLayout;
    /**
     * Specifies a custom template for content in the pie&apos;s center.
     */
    centerTemplate?: template | ((component: dxPieChart, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * An object defining the configuration properties that are common for all series of the PieChart UI component.
     */
    commonSeriesSettings?: any;
    /**
     * Specifies the diameter of the pie.
     */
    diameter?: number | undefined;
    /**
     * Specifies the fraction of the inner radius relative to the total radius in the series of the &apos;doughnut&apos; type. The value should be between 0 and 1.
     */
    innerRadius?: number;
    /**
     * Specifies PieChart legend properties.
     */
    legend?: Legend;
    /**
     * Specifies the minimum diameter of the pie.
     */
    minDiameter?: number;
    /**
     * A function that is executed when a legend item is clicked or tapped.
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * Sets the palette to be used to colorize series and their elements.
     */
    palette?: Array<string> | Palette;
    /**
     * Specifies how a chart must behave when point labels overlap.
     */
    resolveLabelOverlapping?: ShiftLabelOverlap;
    /**
     * Specifies the direction that the pie chart segments will occupy.
     */
    segmentsDirection?: PieChartSegmentDirection;
    /**
     * Specifies properties for the series of the PieChart UI component.
     */
    series?: PieChartSeries | Array<PieChartSeries> | undefined;
    /**
     * Defines properties for the series template.
     */
    seriesTemplate?: {
      /**
       * Specifies a callback function that returns a series object with individual series settings.
       */
      customizeSeries?: ((seriesName: any) => PieChartSeries);
      /**
       * Specifies a data source field that represents the series name.
       */
      nameField?: string;
    };
    /**
     * Allows you to display several adjoining pies in the same size.
     */
    sizeGroup?: string | undefined;
    /**
     * Specifies the angle in arc degrees from which the first segment of a pie chart should start.
     */
    startAngle?: number;
    /**
     * Specifies the type of the pie chart series.
     */
    type?: PieChartType;
    /**
     * Specifies the annotation collection.
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * Specifies settings common for all annotations in the PieChart.
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * Customizes an individual annotation.
     */
    customizeAnnotation?: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig) | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
    /**
     * Specifies the annotation&apos;s name.
     */
    name?: string | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPieChartCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
    /**
     * Specifies an annotation&apos;s position on the surface of a specific argument.
     */
    location?: PieChartAnnotationLocation;
    /**
     * Positions the annotation relative to a specific argument.
     */
    argument?: number | Date | string | undefined;
    /**
     * Anchors the annotation to a series point. Accepts the name of the point&apos;s series.
     */
    series?: string | undefined;
    /**
     * Customizes the text and appearance of the annotation&apos;s tooltip.
     */
    customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any) | undefined;
    /**
     * Specifies a custom template for the annotation. Applies only if the type is &apos;custom&apos;.
     */
    template?: template | ((annotation: dxPieChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies a custom template for an annotation&apos;s tooltip.
     */
    tooltipTemplate?: template | ((annotation: dxPieChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}
/**
 * Specifies adaptive layout properties.
 */
export type AdaptiveLayout = BaseChartAdaptiveLayout & {
    /**
     * Specifies whether point labels should be kept when the UI component adapts the layout.
     */
    keepLabels?: boolean;
};
/**
 * Specifies PieChart legend properties.
 */
export type Legend = BaseChartLegend & {
    /**
     * Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item.
     */
    customizeHint?: ((pointInfo: { pointName?: any; pointIndex?: number; pointColor?: string }) => string);
    /**
     * Allows you to change the order, text, and visibility of legend items.
     */
    customizeItems?: ((items: Array<LegendItem>) => Array<LegendItem>);
    /**
     * Specifies a callback function that returns the text to be displayed by a legend item.
     */
    customizeText?: ((pointInfo: { pointName?: any; pointIndex?: number; pointColor?: string }) => string);
    /**
     * Specifies what chart elements to highlight when a corresponding item in the legend is hovered over.
     */
    hoverMode?: PieChartLegendHoverMode;
    /**
     * Specifies an SVG element that serves as a custom legend item marker.
     */
    markerTemplate?: template | ((legendItem: LegendItem, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
};
/**
 * The PieChart is a UI component that visualizes data as a circle divided into sectors that each represents a portion of the whole.
 */
export default class dxPieChart extends BaseChart<dxPieChartOptions> {
    /**
     * Gets the radius of the doughnut hole in pixels. Applies only when the type is &apos;doughnut&apos; or &apos;donut&apos;.
     */
    getInnerRadius(): number;
}

/**
 * This section lists the objects that define properties to be used to configure series of particular types.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPieChartSeriesTypes {
    /**
     * An object that defines configuration properties for chart series.
     */
    CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
    /**
     * An object defining a series of the doughnut type.
     */
    DoughnutSeries?: any;
    /**
     * An object defining a series of the pie type.
     */
    PieSeries?: any;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPieChartSeriesTypesCommonPieChartSeries {
    /**
     * Specifies the data source field that provides arguments for series points.
     */
    argumentField?: string;
    /**
     * Specifies the required type for series arguments.
     */
    argumentType?: ChartsDataType | undefined;
    /**
     * An object defining the series border configuration properties.
     */
    border?: {
      /**
       * Sets a border color for a series.
       */
      color?: string | undefined;
      /**
       * Specifies a dash style for the border of a series point.
       */
      dashStyle?: DashStyle | undefined;
      /**
       * Sets border visibility for a series.
       */
      visible?: boolean;
      /**
       * Sets a border width for a series in pixels.
       */
      width?: number;
    };
    /**
     * Specifies a series color.
     */
    color?: string | ChartsColor | undefined;
    /**
     * Specifies the chart elements to highlight when a series is hovered over.
     */
    hoverMode?: PieChartSeriesInteractionMode;
    /**
     * An object defining configuration properties for a hovered series.
     */
    hoverStyle?: {
      /**
       * An object defining the border properties for a hovered series.
       */
      border?: {
          /**
           * Sets a border color for the series when it is hovered over.
           */
          color?: string | undefined;
          /**
           * Specifies a dash style for the border of a series point when this point is hovered over.
           */
          dashStyle?: DashStyle | undefined;
          /**
           * Sets border visibility for a hovered series.
           */
          visible?: boolean;
          /**
           * Sets a border width for a hovered series.
           */
          width?: number;
      };
      /**
       * Sets the color for the series when it is hovered over.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the hatching properties to be applied when a point is hovered over.
       */
      hatching?: {
          /**
           * Specifies how to apply hatching to highlight the hovered point.
           */
          direction?: HatchDirection;
          /**
           * Specifies the opacity of hatching lines.
           */
          opacity?: number;
          /**
           * Specifies the distance between two hatching lines in pixels.
           */
          step?: number;
          /**
           * Specifies the width of hatching lines in pixels.
           */
          width?: number;
      };
      /**
       * Specifies whether to lighten the series when a user points to it.
       */
      highlight?: boolean;
    };
    /**
     * An object defining the label configuration properties.
     */
    label?: {
      /**
       * Formats the point argument before it is displayed in the point label. To format the point value, use the format property.
       */
      argumentFormat?: Format | undefined;
      /**
       * Colors the point labels&apos; background. The default color is inherited from the points.
       */
      backgroundColor?: string | undefined;
      /**
       * Specifies border properties for point labels.
       */
      border?: {
          /**
           * Specifies a border color for point labels.
           */
          color?: string | undefined;
          /**
           * Specifies a dash style for the borders of point labels.
           */
          dashStyle?: DashStyle | undefined;
          /**
           * Indicates whether or not borders are visible in point labels.
           */
          visible?: boolean;
          /**
           * Specifies the border width for point labels.
           */
          width?: number;
      };
      /**
       * Specifies connector properties for series point labels.
       */
      connector?: {
          /**
           * Specifies the color of label connectors.
           */
          color?: string | undefined;
          /**
           * Indicates whether or not label connectors are visible.
           */
          visible?: boolean;
          /**
           * Specifies the width of label connectors.
           */
          width?: number;
      };
      /**
       * Specifies a callback function that returns the text to be displayed by point labels.
       */
      customizeText?: ((pointInfo: any) => string);
      /**
       * Specifies font properties for the text displayed in point labels.
       */
      font?: Font;
      /**
       * Formats a value before it is displayed in a point label.
       */
      format?: Format | undefined;
      /**
       * Specifies a label position relative to the chart.
       */
      position?: LabelPosition;
      /**
       * Specifies how to shift labels from their initial position in a radial direction in pixels.
       */
      radialOffset?: number;
      /**
       * Specifies the angle used to rotate point labels from their initial position.
       */
      rotationAngle?: number;
      /**
       * Specifies what to do with label texts that overflow the allocated space after applying wordWrap: hide, truncate them and display an ellipsis, or do nothing.
       */
      textOverflow?: TextOverflow;
      /**
       * Specifies the visibility of point labels.
       */
      visible?: boolean;
      /**
       * Specifies how to wrap label texts if they do not fit into a single line.
       */
      wordWrap?: WordWrap;
      /**
        * Specifies the label&apos;s text.
        */
       displayFormat?: string | undefined;
    };
    /**
     * Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed.
     */
    maxLabelCount?: number | undefined;
    /**
     * Specifies a minimal size of a displayed pie segment.
     */
    minSegmentSize?: number | undefined;
    /**
     * Specifies the chart elements to highlight when the series is selected.
     */
    selectionMode?: PieChartSeriesInteractionMode;
    /**
     * An object defining configuration properties for the series when it is selected.
     */
    selectionStyle?: {
      /**
       * An object defining the border properties for a selected series.
       */
      border?: {
          /**
           * Sets a border color for a selected series.
           */
          color?: string | undefined;
          /**
           * Specifies a dash style for the border of a selected series point.
           */
          dashStyle?: DashStyle | undefined;
          /**
           * Sets a border visibility for a selected series.
           */
          visible?: boolean;
          /**
           * Sets a border width for a selected series.
           */
          width?: number;
      };
      /**
       * Sets the color for a series when it is selected.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the hatching properties to be applied when a point is selected.
       */
      hatching?: {
          /**
           * Specifies how to apply hatching to highlight the selected point.
           */
          direction?: HatchDirection;
          /**
           * Specifies the opacity of hatching lines.
           */
          opacity?: number;
          /**
           * Specifies the distance between two hatching lines in pixels.
           */
          step?: number;
          /**
           * Specifies the width of hatching lines in pixels.
           */
          width?: number;
      };
      /**
       * Specifies whether to lighten the series when a user selects it.
       */
      highlight?: boolean;
    };
    /**
     * Specifies chart segment grouping properties.
     */
    smallValuesGrouping?: {
      /**
       * Specifies the name of the grouped chart segment. This name represents the segment in the chart legend.
       */
      groupName?: string;
      /**
       * Specifies the segment grouping mode.
       */
      mode?: SmallValuesGroupingMode;
      /**
       * Specifies a threshold for segment values.
       */
      threshold?: number | undefined;
      /**
       * Specifies how many segments must not be grouped.
       */
      topCount?: number | undefined;
    };
    /**
     * Specifies the name of the data source field that provides data about a point.
     */
    tagField?: string;
    /**
     * Specifies the data source field that provides values for series points.
     */
    valueField?: string;
}

/**
 * This section describes the Point object, which represents a series point.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface piePointObject extends basePointObject {
    /**
     * Hides a specific point.
     */
    hide(): void;
    /**
     * Provides information about the visibility state of a point.
     */
    isVisible(): boolean;
    /**
     * Gets the percentage value of the specific point.
     */
    percent?: string | number | Date;
    /**
     * Makes a specific point visible.
     */
    show(): void;
}

/**
 * This section describes the Series object, which represents a series.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface pieChartSeriesObject extends baseSeriesObject {
  /**
   * Switches the series into the hover state, the same as when a user places the mouse pointer on it.
   */
  hover(): void;
  /**
   * Switches the series from the hover state back to normal.
   */
  clearHover(): void;
  /**
   * Provides information about the hover state of a series.
   */
  isHovered(): boolean;
}

export type Properties = dxPieChartOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxPieChartOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use AdaptiveLayout instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPieChartAdaptiveLayout = AdaptiveLayout;

/**
 * @deprecated Use Legend instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPieChartLegend = Legend;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onLegendClick'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPieChartOptions.onDisposing
 * @type_function_param1 e:{viz/pie_chart:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPieChartOptions.onDone
 * @type_function_param1 e:{viz/pie_chart:DoneEvent}
 */
onDone?: ((e: DoneEvent) => void);
/**
 * @docid dxPieChartOptions.onDrawn
 * @type_function_param1 e:{viz/pie_chart:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxPieChartOptions.onExported
 * @type_function_param1 e:{viz/pie_chart:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxPieChartOptions.onExporting
 * @type_function_param1 e:{viz/pie_chart:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxPieChartOptions.onFileSaving
 * @type_function_param1 e:{viz/pie_chart:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxPieChartOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/pie_chart:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxPieChartOptions.onInitialized
 * @type_function_param1 e:{viz/pie_chart:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPieChartOptions.onOptionChanged
 * @type_function_param1 e:{viz/pie_chart:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxPieChartOptions.onPointClick
 * @type_function_param1 e:{viz/pie_chart:PointClickEvent}
 */
onPointClick?: ((e: PointClickEvent) => void);
/**
 * @docid dxPieChartOptions.onPointHoverChanged
 * @type_function_param1 e:{viz/pie_chart:PointHoverChangedEvent}
 */
onPointHoverChanged?: ((e: PointHoverChangedEvent) => void);
/**
 * @docid dxPieChartOptions.onPointSelectionChanged
 * @type_function_param1 e:{viz/pie_chart:PointSelectionChangedEvent}
 */
onPointSelectionChanged?: ((e: PointSelectionChangedEvent) => void);
/**
 * @docid dxPieChartOptions.onTooltipHidden
 * @type_function_param1 e:{viz/pie_chart:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxPieChartOptions.onTooltipShown
 * @type_function_param1 e:{viz/pie_chart:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
