import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    Cancelable,
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
    chartAxisObject,
} from './chart';

import {
    BaseChart,
    BaseChartAdaptiveLayout,
    BaseChartLegend,
    BaseChartOptions,
    BaseChartTooltip,
    BaseChartAnnotationConfig,
    PointInteractionInfo,
    TooltipInfo,
} from './chart_components/base_chart';

import {
    template,
    SingleOrMultiple,
} from '../common';

import {
    FileSavingEventInfo,
    ExportInfo,
    IncidentInfo,
} from './core/base_widget';

import {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsDataType,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    LabelOverlap,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    RelativePosition,
    SeriesHoverMode,
    SeriesSelectionMode,
    TimeIntervalConfig,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    VisualRange,
    ZoomPanAction,
    ChartsColor,
    Font,
} from '../common/charts';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SeriesInteractionInfo {
    /**
     * 
     */
    target: polarChartSeriesObject;
}

export {
    ArgumentAxisHoverMode,
    AxisScaleType,
    ChartsDataType,
    DashStyle,
    DiscreteAxisDivisionMode,
    HatchDirection,
    LabelOverlap,
    LegendHoverMode,
    PointInteractionMode,
    PointSymbol,
    RelativePosition,
    SeriesHoverMode,
    SeriesSelectionMode,
    ValueErrorBarDisplayMode,
    ValueErrorBarType,
    ZoomPanAction,
};

export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
export type ValueAxisVisualRangeUpdateMode = 'auto' | 'keep' | 'reset';

/**
 * The type of the argumentAxisClick event handler&apos;s argument.
 */
export type ArgumentAxisClickEvent = NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly argument: Date | number | string;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxPolarChart>;

/**
 * The type of the done event handler&apos;s argument.
 */
export type DoneEvent = EventInfo<dxPolarChart>;

/**
 * The type of the drawn event handler&apos;s argument.
 */
export type DrawnEvent = EventInfo<dxPolarChart>;

/**
 * The type of the exported event handler&apos;s argument.
 */
export type ExportedEvent = EventInfo<dxPolarChart>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = EventInfo<dxPolarChart> & ExportInfo;

/**
 * The type of the fileSaving event handler&apos;s argument.
 */
export type FileSavingEvent = FileSavingEventInfo<dxPolarChart>;

/**
 * The type of the incidentOccurred event handler&apos;s argument.
 */
export type IncidentOccurredEvent = EventInfo<dxPolarChart> & IncidentInfo;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxPolarChart>;

/**
 * The type of the legendClick event handler&apos;s argument.
 */
export type LegendClickEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly target: polarChartSeriesObject;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxPolarChart> & ChangedOptionInfo;

/**
 * The type of the pointClick event handler&apos;s argument.
 */
export type PointClickEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & PointInteractionInfo;

/**
 * The type of the pointHoverChanged event handler&apos;s argument.
 */
export type PointHoverChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/**
 * The type of the pointSelectionChanged event handler&apos;s argument.
 */
export type PointSelectionChangedEvent = EventInfo<dxPolarChart> & PointInteractionInfo;

/**
 * The type of the seriesClick event handler&apos;s argument.
 */
export type SeriesClickEvent = NativeEventInfo<dxPolarChart, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly target: polarChartSeriesObject;
};

/**
 * The type of the seriesHoverChanged event handler&apos;s argument.
 */
export type SeriesHoverChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/**
 * The type of the seriesSelectionChanged event handler&apos;s argument.
 */
export type SeriesSelectionChangedEvent = EventInfo<dxPolarChart> & SeriesInteractionInfo;

/**
 * The type of the tooltipHidden event handler&apos;s argument.
 */
export type TooltipHiddenEvent = EventInfo<dxPolarChart> & TooltipInfo;

/**
 * The type of the tooltipShown event handler&apos;s argument.
 */
export type TooltipShownEvent = EventInfo<dxPolarChart> & TooltipInfo;

/**
 * The type of the zoomEnd event handler&apos;s argument.
 */
export type ZoomEndEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly axis: chartAxisObject;
    /**
     * 
     */
    readonly range: VisualRange;
    /**
     * 
     */
    readonly previousRange: VisualRange;
    /**
     * 
     */
    readonly actionType: ZoomPanAction;
    /**
     * 
     */
    readonly zoomFactor: number;
    /**
     * 
     */
    readonly shift: number;
};
/**
 * The type of the zoomStart event handler&apos;s argument.
 */
export type ZoomStartEvent = Cancelable & NativeEventInfo<dxPolarChart, MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly axis: chartAxisObject;
    /**
     * 
     */
    readonly range: VisualRange;
    /**
     * 
     */
    readonly actionType: ZoomPanAction;
};

/**
 * Specifies properties for PolarChart UI component series.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies the name that identifies the series.
     */
    name?: string | undefined;
    /**
     * Specifies data about a series.
     */
    tag?: any | undefined;
    /**
     * Sets the series type.
     */
    type?: PolarChartSeriesType;
}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * Specifies adaptive layout properties.
     */
    adaptiveLayout?: AdaptiveLayout;
    /**
     * Specifies the annotation collection.
     */
    annotations?: Array<dxPolarChartAnnotationConfig | any>;
    /**
     * Specifies argument axis properties for the PolarChart UI component.
     */
    argumentAxis?: ArgumentAxis;
    /**
     * Controls the padding and consequently the angular width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth property is set.
     */
    barGroupPadding?: number;
    /**
     * Specifies a fixed angular width for groups of bars with the same argument, measured in degrees. Takes precedence over the barGroupPadding property.
     */
    barGroupWidth?: number | undefined;
    /**
     * Specifies settings common for all annotations in the PolarChart.
     */
    commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
    /**
     * An object defining the configuration properties that are common for all axes of the PolarChart UI component.
     */
    commonAxisSettings?: CommonAxisSettings;
    /**
     * An object defining the configuration properties that are common for all series of the PolarChart UI component.
     */
    commonSeriesSettings?: CommonSeriesSettings;
    /**
     * Specifies the color of the parent page element.
     */
    containerBackgroundColor?: string;
    /**
     * Customizes an individual annotation.
     */
    customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig) | undefined;
    /**
     * An object providing properties for managing data from a data source.
     */
    dataPrepareSettings?: {
      /**
       * Specifies whether or not to validate the values from a data source.
       */
      checkTypeForAllData?: boolean;
      /**
       * Specifies whether or not to convert the values from a data source into the data type of an axis.
       */
      convertToAxisDataType?: boolean;
      /**
       * Specifies how to sort the series points.
       */
      sortingMethod?: boolean | ((a: { arg?: Date | number | string; val?: Date | number | string }, b: { arg?: Date | number | string; val?: Date | number | string }) => number);
    };
    /**
     * Specifies the properties of a chart&apos;s legend.
     */
    legend?: Legend;
    /**
     * Forces the UI component to treat negative values as zeroes. Applies to stacked-like series only.
     */
    negativesAsZeroes?: boolean;
    /**
     * A function that is executed when a label on the argument axis is clicked or tapped.
     */
    onArgumentAxisClick?: ((e: ArgumentAxisClickEvent) => void) | string;
    /**
     * A function that is executed when a legend item is clicked or tapped.
     */
    onLegendClick?: ((e: LegendClickEvent) => void) | string;
    /**
     * A function that is executed when a series is clicked or tapped.
     */
    onSeriesClick?: ((e: SeriesClickEvent) => void) | string;
    /**
     * A function that is executed after the pointer enters or leaves a series.
     */
    onSeriesHoverChanged?: ((e: SeriesHoverChangedEvent) => void);
    /**
     * A function that is executed when a series is selected or selection is canceled.
     */
    onSeriesSelectionChanged?: ((e: SeriesSelectionChangedEvent) => void);
    /**
     * A function that is executed when zooming or panning ends.
     */
    onZoomEnd?: ((e: ZoomEndEvent) => void);
    /**
     * A function that is executed when zooming or panning begins.
     */
    onZoomStart?: ((e: ZoomStartEvent) => void);
    /**
     * Specifies how the chart must behave when series point labels overlap.
     */
    resolveLabelOverlapping?: LabelOverlap;
    /**
     * Specifies properties for PolarChart UI component series.
     */
    series?: PolarChartSeries | Array<PolarChartSeries> | undefined;
    /**
     * Specifies whether a single series or multiple series can be selected in the chart.
     */
    seriesSelectionMode?: SingleOrMultiple;
    /**
     * Defines properties for the series template.
     */
    seriesTemplate?: {
      /**
       * Specifies a callback function that returns a series object with individual series settings.
       */
      customizeSeries?: ((seriesName: any) => PolarChartSeries);
      /**
       * Specifies a data source field that represents the series name.
       */
      nameField?: string;
    };
    /**
     * Configures tooltips.
     */
    tooltip?: Tooltip;
    /**
     * Indicates whether to display a &apos;spider web&apos;.
     */
    useSpiderWeb?: boolean;
    /**
     * Specifies value axis properties for the PolarChart UI component.
     */
    valueAxis?: ValueAxis;
}
/**
 * Specifies adaptive layout properties.
 */
export type AdaptiveLayout = BaseChartAdaptiveLayout & {
    /**
     * Specifies the minimum container height at which the layout begins to adapt.
     */
    height?: number;
    /**
     * Specifies the minimum container width at which the layout begins to adapt.
     */
    width?: number;
};
/**
 * Specifies argument axis properties for the PolarChart UI component.
 */
export type ArgumentAxis = CommonAxisSettings & {
    /**
     * Specifies the desired type of axis values.
     */
    argumentType?: ChartsDataType | undefined;
    /**
     * Specifies the minimum distance between two neighboring major ticks in pixels. Applies only to the axes of the &apos;continuous&apos; and &apos;logarithmic&apos; types.
     */
    axisDivisionFactor?: number;
    /**
     * Specifies the order of categories on an axis of the &apos;discrete&apos; type.
     */
    categories?: Array<number | string | Date>;
    /**
     * Defines an array of the argument axis constant lines.
     */
    constantLines?: Array<ArgumentAxisConstantLines>;
    /**
     * Specifies whether or not to display the first point at the angle specified by the startAngle property.
     */
    firstPointOnStartAngle?: boolean;
    /**
     * Specifies the elements that will be highlighted when the argument axis is hovered over.
     */
    hoverMode?: ArgumentAxisHoverMode;
    /**
     * Specifies properties for argument axis labels.
     */
    label?: ArgumentAxisLabel;
    /**
     * Specifies a value used to calculate the range on a logarithmic axis within which the axis should be linear. Applies only if the data source contains negative values or zeroes.
     */
    linearThreshold?: number | undefined;
    /**
     * Specifies the value to be raised to a power when generating ticks for a logarithmic axis.
     */
    logarithmBase?: number;
    /**
     * Specifies the properties of the minor ticks.
     */
    minorTick?: ArgumentAxisMinorTick;
    /**
     * Specifies the number of minor ticks between two neighboring major ticks.
     */
    minorTickCount?: number | undefined;
    /**
     * Specifies the interval between minor ticks.
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * Specifies the value to be used as the origin for the argument axis.
     */
    originValue?: number | undefined;
    /**
     * Specifies the period of the argument values in the data source.
     */
    period?: number | undefined;
    /**
     * Specifies the angle in arc degrees to which the argument axis should be rotated. The positive values rotate the axis clockwise.
     */
    startAngle?: number;
    /**
     * Specifies properties for argument axis strips.
     */
    strips?: Array<ArgumentAxisStrips>;
    /**
     * An object defining the configuration properties for axis ticks.
     */
    tick?: ArgumentAxisTick;
    /**
     * Specifies an interval between axis ticks/grid lines.
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * Specifies the required type of the argument axis.
     */
    type?: AxisScaleType | undefined;
};
/**
 * Defines an array of the argument axis constant lines.
 */
export type ArgumentAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * Specifies whether to display the constant line behind or in front of the series.
     */
    displayBehindSeries?: boolean;
    /**
     * Specifies whether to extend the axis to display the constant line.
     */
    extendAxis?: boolean;
    /**
     * An object defining constant line label properties.
     */
    label?: ArgumentAxisConstantLinesLabel;
    /**
     * Specifies a value to be displayed by a constant line.
     */
    value?: number | Date | string | undefined;
};
/**
 * An object defining constant line label properties.
 */
export type ArgumentAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * Specifies the text to be displayed in a constant line label.
     */
    text?: string | undefined;
};
/**
 * Specifies properties for argument axis labels.
 */
export type ArgumentAxisLabel = CommonAxisSettingsLabel & {
    /**
     * Specifies the text for a hint that appears when a user hovers the mouse pointer over a label on the argument axis.
     */
    customizeHint?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * Specifies a callback function that returns the text to be displayed by argument axis labels.
     */
    customizeText?: ((argument: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * Formats a value before it is displayed in an axis label.
     */
    format?: Format | undefined;
};
/**
 * 
 */
export type ArgumentAxisMinorTick = CommonAxisSettingsMinorTick & {
    /**
     * Shifts minor ticks from the reference position.
     */
    shift?: number;
};
/**
 * Specifies properties for argument axis strips.
 */
export type ArgumentAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * Specifies a color for a strip.
     */
    color?: string | undefined;
    /**
     * Specifies an end value for a strip.
     */
    endValue?: number | Date | string | undefined;
    /**
     * An object that defines the label configuration properties of a strip.
     */
    label?: ArgumentAxisStripsLabel;
    /**
     * Specifies a start value for a strip.
     */
    startValue?: number | Date | string | undefined;
};
/**
 * An object that defines the label configuration properties of a strip.
 */
export type ArgumentAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * Specifies the text displayed in a strip.
     */
    text?: string | undefined;
};
/**
 * 
 */
export type ArgumentAxisTick = CommonAxisSettingsTick & {
    /**
     * Shifts ticks from the reference position.
     */
    shift?: number;
};
/**
 * An object defining the configuration properties that are common for all axes of the PolarChart UI component.
 */
export type CommonAxisSettings = {
    /**
     * Specifies whether to allow decimal values on the axis. When false, the axis contains integer values only.
     */
    allowDecimals?: boolean | undefined;
    /**
     * Specifies the color of the line that represents an axis.
     */
    color?: string;
    /**
     * Specifies the appearance of all the UI component&apos;s constant lines.
     */
    constantLineStyle?: CommonAxisSettingsConstantLineStyle;
    /**
     * Specifies whether ticks/grid lines of a discrete axis are located between labels or cross the labels.
     */
    discreteAxisDivisionMode?: DiscreteAxisDivisionMode;
    /**
     * Specifies whether to force the axis to start and end on ticks.
     */
    endOnTick?: boolean | undefined;
    /**
     * An object defining the configuration properties for the grid lines of an axis in the PolarChart UI component.
     */
    grid?: {
      /**
       * Specifies a color for grid lines.
       */
      color?: string;
      /**
       * Specifies an opacity for grid lines.
       */
      opacity?: number | undefined;
      /**
       * Indicates whether or not the grid lines of an axis are visible.
       */
      visible?: boolean;
      /**
       * Specifies the width of grid lines.
       */
      width?: number;
    };
    /**
     * Indicates whether or not an axis is inverted.
     */
    inverted?: boolean;
    /**
     * An object defining the label configuration properties that are common for all axes in the PolarChart UI component.
     */
    label?: CommonAxisSettingsLabel;
    /**
     * Specifies the properties of the minor grid.
     */
    minorGrid?: {
      /**
       * Specifies a color for the lines of the minor grid.
       */
      color?: string;
      /**
       * Specifies an opacity for the lines of the minor grid.
       */
      opacity?: number | undefined;
      /**
       * Indicates whether the minor grid is visible or not.
       */
      visible?: boolean;
      /**
       * Specifies a width for the lines of the minor grid.
       */
      width?: number;
    };
    /**
     * Specifies the properties of the minor ticks.
     */
    minorTick?: CommonAxisSettingsMinorTick;
    /**
     * Specifies the opacity of the line that represents an axis.
     */
    opacity?: number | undefined;
    /**
     * An object defining configuration properties for strip style.
     */
    stripStyle?: CommonAxisSettingsStripStyle;
    /**
     * An object defining the configuration properties for axis ticks.
     */
    tick?: CommonAxisSettingsTick;
    /**
     * Indicates whether or not the line that represents an axis in a chart is visible.
     */
    visible?: boolean;
    /**
     * Specifies the width of the line that represents an axis in the chart.
     */
    width?: number;
};
/**
 * Specifies the appearance of all the UI component&apos;s constant lines.
 */
export type CommonAxisSettingsConstantLineStyle = {
    /**
     * Specifies a color for a constant line.
     */
    color?: string;
    /**
     * Specifies a dash style for a constant line.
     */
    dashStyle?: DashStyle;
    /**
     * An object defining constant line label properties.
     */
    label?: CommonAxisSettingsConstantLineStyleLabel;
    /**
     * Specifies a constant line width in pixels.
     */
    width?: number;
};
/**
 * An object defining constant line label properties.
 */
export type CommonAxisSettingsConstantLineStyleLabel = {
    /**
     * Specifies font properties for a constant line label.
     */
    font?: Font;
    /**
     * Indicates whether or not to display labels for the axis constant lines.
     */
    visible?: boolean;
};
/**
 * An object defining the label configuration properties that are common for all axes in the PolarChart UI component.
 */
export type CommonAxisSettingsLabel = {
    /**
     * Specifies font properties for axis labels.
     */
    font?: Font;
    /**
     * Specifies the spacing between an axis and its labels in pixels.
     */
    indentFromAxis?: number;
    /**
     * Decides how to arrange axis labels when there is not enough space to keep all of them.
     */
    overlappingBehavior?: LabelOverlap;
    /**
     * Indicates whether or not axis labels are visible.
     */
    visible?: boolean;
};
/**
 * Specifies the properties of the minor ticks.
 */
export type CommonAxisSettingsMinorTick = {
    /**
     * Specifies a color for the minor ticks.
     */
    color?: string;
    /**
     * Specifies minor tick length.
     */
    length?: number;
    /**
     * Specifies an opacity for the minor ticks.
     */
    opacity?: number;
    /**
     * Indicates whether or not the minor ticks are displayed on an axis.
     */
    visible?: boolean;
    /**
     * Specifies minor tick width.
     */
    width?: number;
};
/**
 * An object defining configuration properties for strip style.
 */
export type CommonAxisSettingsStripStyle = {
    /**
     * An object defining the configuration properties for a strip label style.
     */
    label?: CommonAxisSettingsStripStyleLabel;
};
/**
 * An object defining the configuration properties for a strip label style.
 */
export type CommonAxisSettingsStripStyleLabel = {
    /**
     * Specifies font properties for a strip label.
     */
    font?: Font;
};
/**
 * An object defining the configuration properties for axis ticks.
 */
export type CommonAxisSettingsTick = {
    /**
     * Specifies ticks color.
     */
    color?: string;
    /**
     * Specifies tick length.
     */
    length?: number;
    /**
     * Specifies tick opacity.
     */
    opacity?: number | undefined;
    /**
     * Indicates whether or not ticks are visible on an axis.
     */
    visible?: boolean;
    /**
     * Specifies tick width.
     */
    width?: number;
};
/**
 * An object defining the configuration properties that are common for all series of the PolarChart UI component.
 */
export type CommonSeriesSettings = dxPolarChartSeriesTypesCommonPolarChartSeries & {
    /**
     * An object that specifies configuration properties for all series of the area type in the chart.
     */
    area?: any;
    /**
     * An object that specifies configuration properties for all series of the &apos;bar&apos; type in the chart.
     */
    bar?: any;
    /**
     * An object that specifies configuration properties for all series of the &apos;line&apos; type in the chart.
     */
    line?: any;
    /**
     * An object that specifies configuration properties for all series of the &apos;scatter&apos; type in the chart.
     */
    scatter?: any;
    /**
     * An object that specifies configuration properties for all series of the &apos;stackedBar&apos; type in the chart.
     */
    stackedbar?: any;
    /**
     * Sets a series type.
     */
    type?: PolarChartSeriesType;
};
/**
 * Specifies the properties of a chart&apos;s legend.
 */
export type Legend = BaseChartLegend & {
    /**
     * Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item.
     */
    customizeHint?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * Specifies a callback function that returns the text to be displayed by legend items.
     */
    customizeText?: ((seriesInfo: { seriesName?: any; seriesIndex?: number; seriesColor?: string }) => string);
    /**
     * Specifies what series elements to highlight when a corresponding item in the legend is hovered over.
     */
    hoverMode?: LegendHoverMode;
};
/**
 * 
 */
export type Tooltip = BaseChartTooltip & {
    /**
     * Specifies whether the tooltip is shared across all series points with the same argument.
     */
    shared?: boolean;
};
/**
 * Specifies value axis properties for the PolarChart UI component.
 */
export type ValueAxis = CommonAxisSettings & {
    /**
     * Specifies a coefficient for dividing the value axis.
     */
    axisDivisionFactor?: number;
    /**
     * Specifies the order of categories on an axis of the &apos;discrete&apos; type.
     */
    categories?: Array<number | string | Date>;
    /**
     * Defines an array of the value axis constant lines.
     */
    constantLines?: Array<ValueAxisConstantLines>;
    /**
     * Specifies whether to force the axis to start and end on ticks.
     */
    endOnTick?: boolean;
    /**
     * Specifies properties for value axis labels.
     */
    label?: ValueAxisLabel;
    /**
     * Specifies a value used to calculate the range on a logarithmic axis within which the axis should be linear. Applies only if the data source contains negative values or zeroes.
     */
    linearThreshold?: number | undefined;
    /**
     * Specifies the value to be raised to a power when generating ticks for a logarithmic axis.
     */
    logarithmBase?: number;
    /**
     * Specifies a coefficient that determines the spacing between the maximum series point and the axis.
     */
    maxValueMargin?: number | undefined;
    /**
     * Specifies a coefficient that determines the spacing between the minimum series point and the axis.
     */
    minValueMargin?: number | undefined;
    /**
     * Specifies the minimum length of the visual range.
     */
    minVisualRangeLength?: TimeIntervalConfig;
    /**
     * Specifies the number of minor ticks between two neighboring major ticks.
     */
    minorTickCount?: number | undefined;
    /**
     * Specifies the interval between minor ticks.
     */
    minorTickInterval?: TimeIntervalConfig;
    /**
     * Specifies whether or not to indicate a zero value on the value axis.
     */
    showZero?: boolean | undefined;
    /**
     * Specifies properties for value axis strips.
     */
    strips?: Array<ValueAxisStrips>;
    /**
     * An object defining the configuration properties for axis ticks.
     */
    tick?: ValueAxisTick;
    /**
     * Specifies an interval between axis ticks/grid lines.
     */
    tickInterval?: TimeIntervalConfig;
    /**
     * Specifies the required type of the value axis.
     */
    type?: AxisScaleType | undefined;
    /**
     * Indicates whether to display series with indents from axis boundaries.
     */
    valueMarginsEnabled?: boolean;
    /**
     * Specifies the desired type of axis values.
     */
    valueType?: ChartsDataType | undefined;
    /**
     * Defines the axis&apos; displayed range. Cannot be wider than the wholeRange.
     */
    visualRange?: VisualRange | Array<number | string | Date>;
    /**
     * Specifies how the axis&apos;s visual range should behave when the PolarChart data is updated.
     */
    visualRangeUpdateMode?: ValueAxisVisualRangeUpdateMode;
    /**
     * Defines the range where the axis can be zoomed.
     */
    wholeRange?: VisualRange | Array<number | string | Date> | undefined;
};
/**
 * Defines an array of the value axis constant lines.
 */
export type ValueAxisConstantLines = CommonAxisSettingsConstantLineStyle & {
    /**
     * Specifies whether to display the constant line behind or in front of the series.
     */
    displayBehindSeries?: boolean;
    /**
     * Specifies whether to extend the axis to display the constant line.
     */
    extendAxis?: boolean;
    /**
     * An object defining constant line label properties.
     */
    label?: ValueAxisConstantLinesLabel;
    /**
     * Specifies a value to be displayed by a constant line.
     */
    value?: number | Date | string | undefined;
};
/**
 * An object defining constant line label properties.
 */
export type ValueAxisConstantLinesLabel = CommonAxisSettingsConstantLineStyleLabel & {
    /**
     * Specifies the text to be displayed in a constant line label.
     */
    text?: string | undefined;
};
/**
 * Specifies properties for value axis labels.
 */
export type ValueAxisLabel = CommonAxisSettingsLabel & {
    /**
     * Specifies the text for a hint that appears when a user hovers the mouse pointer over a label on the value axis.
     */
    customizeHint?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * Specifies a callback function that returns the text to be displayed in value axis labels.
     */
    customizeText?: ((axisValue: { value?: Date | number | string; valueText?: string }) => string);
    /**
     * Formats a value before it is displayed in an axis label.
     */
    format?: Format | undefined;
};
/**
 * Specifies properties for value axis strips.
 */
export type ValueAxisStrips = CommonAxisSettingsStripStyle & {
    /**
     * Specifies a color for a strip.
     */
    color?: string | undefined;
    /**
     * Specifies an end value for a strip.
     */
    endValue?: number | Date | string | undefined;
    /**
     * An object that defines the label configuration properties of a strip.
     */
    label?: ValueAxisStripsLabel;
    /**
     * Specifies a start value for a strip.
     */
    startValue?: number | Date | string | undefined;
};
/**
 * An object that defines the label configuration properties of a strip.
 */
export type ValueAxisStripsLabel = CommonAxisSettingsStripStyleLabel & {
    /**
     * Specifies the text displayed in a strip.
     */
    text?: string | undefined;
};
/**
 * 
 */
export type ValueAxisTick = CommonAxisSettingsTick & {
    /**
     * Indicates whether or not ticks are visible on an axis.
     */
    visible?: boolean;
};
/**
 * The PolarChart is a UI component that visualizes data in a polar coordinate system.
 */
export default class dxPolarChart extends BaseChart<dxPolarChartOptions> {
    /**
     * Gets a value axis.
     */
    getValueAxis(): chartAxisObject;
    /**
     * Resets the value axis&apos; visual range to the data range or to the whole range if it is within the data range.
     */
    resetVisualRange(): void;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartAnnotationConfig extends dxPolarChartCommonAnnotationConfig {
    /**
     * Specifies the annotation&apos;s name.
     */
    name?: string | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
    /**
     * Specifies the angle between the startAngle and the radius.
     */
    angle?: number | undefined;
    /**
     * Places an annotation at the specified distance from the center of the UI component.
     */
    radius?: number | undefined;
    /**
     * Customizes the text and appearance of the annotation&apos;s tooltip.
     */
    customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any) | undefined;
    /**
     * Specifies a custom template for the annotation. Applies only if the type is &apos;custom&apos;.
     */
    template?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: SVGGElement) => string | UserDefinedElement<SVGElement>) | undefined;
    /**
     * Specifies a custom template for an annotation&apos;s tooltip.
     */
    tooltipTemplate?: template | ((annotation: dxPolarChartAnnotationConfig | any, element: DxElement) => string | UserDefinedElement) | undefined;
}

/**
 * This section lists objects that define properties used to configure series of specific types.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypes {
    /**
     * An object that defines configuration properties for polar chart series.
     */
    CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
    /**
     * An object defining a series of the area type.
     */
    areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
    /**
     * An object defining a series of the bar type.
     */
    barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
    /**
     * An object defining a series of the line type.
     */
    linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
    /**
     * An object defining a series of the scatter type.
     */
    scatterpolarseries?: any;
    /**
     * An object defining a series of the stackedBar type.
     */
    stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies the data source field that provides arguments for series points.
     */
    argumentField?: string;
    /**
     * Controls the padding and consequently the angular width of all bars in a series using relative units. Ignored if the barWidth property is set.
     */
    barPadding?: number | undefined;
    /**
     * Specifies a fixed angular width for all bars in a series, measured in degrees. Takes precedence over the barPadding property.
     */
    barWidth?: number | undefined;
    /**
     * An object defining the series border configuration properties.
     */
    border?: {
      /**
       * Sets a border color for a series.
       */
      color?: string | undefined;
      /**
       * Specifies a dash style for the borders of series points.
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
     * Specifies whether or not to close the chart by joining the end point with the first point.
     */
    closed?: boolean;
    /**
     * Specifies a series color.
     */
    color?: string | ChartsColor | undefined;
    /**
     * Specifies the dash style of the series&apos; line.
     */
    dashStyle?: DashStyle;
    /**
     * Specifies the series elements to highlight when a series is hovered over.
     */
    hoverMode?: SeriesHoverMode;
    /**
     * An object defining configuration properties for a hovered series.
     */
    hoverStyle?: {
      /**
       * An object defining the border properties for a hovered series.
       */
      border?: {
        /**
         * Sets a border color for a hovered series.
         */
        color?: string | undefined;
        /**
         * Specifies a dash style for the borders of point labels.
         */
        dashStyle?: DashStyle | undefined;
        /**
         * Sets a border visibility for a hovered series.
         */
        visible?: boolean;
        /**
         * Sets a border width for a hovered series.
         */
        width?: number;
      };
      /**
       * Sets a color for a series when it is hovered over.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the dash style for the line in a hovered series.
       */
      dashStyle?: DashStyle;
      /**
       * Specifies the hatching properties to be applied when a series is hovered over.
       */
      hatching?: {
        /**
         * Specifies how to apply hatching to highlight the hovered series.
         */
        direction?: HatchDirection;
        /**
         * Specifies the opacity of hatching lines.
         */
        opacity?: number;
        /**
         * Specifies the distance between hatching lines in pixels.
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
      /**
       * Specifies the width of a line in a hovered series.
       */
      width?: number;
    };
    /**
     * Specifies whether the series should ignore null data points.
     */
    ignoreEmptyPoints?: boolean;
    /**
     * An object defining the label configuration properties.
     */
    label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
    /**
     * Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed.
     */
    maxLabelCount?: number | undefined;
    /**
     * Specifies the minimal length of a displayed bar in pixels.
     */
    minBarSize?: number | undefined;
    /**
     * Specifies opacity for a series.
     */
    opacity?: number;
    /**
     * An object defining configuration properties for points in line and area series.
     */
    point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
    /**
     * Specifies the series elements to highlight when the series is selected.
     */
    selectionMode?: SeriesSelectionMode;
    /**
     * An object defining configuration properties for a selected series.
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
         * Specifies a dash style for the borders of point labels.
         */
        dashStyle?: DashStyle | undefined;
        /**
         * Sets border visibility for a selected series.
         */
        visible?: boolean;
        /**
         * Sets a border width for a selected series.
         */
        width?: number;
      };
      /**
       * Sets a color for a series when it is selected.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the dash style for the line in a selected series.
       */
      dashStyle?: DashStyle;
      /**
       * Specifies the hatching properties to be applied when a series is selected.
       */
      hatching?: {
        /**
         * Specifies how to apply hatching to highlight a selected series.
         */
        direction?: HatchDirection;
        /**
         * Specifies the opacity of hatching lines.
         */
        opacity?: number;
        /**
         * Specifies the distance between hatching lines in pixels.
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
      /**
       * Specifies the width of a line in a selected series.
       */
      width?: number;
    };
    /**
     * Specifies whether or not to show the series in the chart&apos;s legend.
     */
    showInLegend?: boolean;
    /**
     * Specifies the name of the stack where the values of the &apos;stackedBar&apos; series must be located.
     */
    stack?: string;
    /**
     * Specifies the name of the data source field that provides data about a point.
     */
    tagField?: string;
    /**
     * Configures error bars.
     */
    valueErrorBar?: {
      /**
       * Specifies the color of error bars.
       */
      color?: string;
      /**
       * Specifies whether error bars must be displayed in full or partially.
       */
      displayMode?: ValueErrorBarDisplayMode;
      /**
       * Specifies the length of the lines that indicate error bar edges.
       */
      edgeLength?: number;
      /**
       * Specifies the data field that provides data for high error values.
       */
      highValueField?: string | undefined;
      /**
       * Specifies the width of the error bar line.
       */
      lineWidth?: number;
      /**
       * Specifies the data field that provides data for low error values.
       */
      lowValueField?: string | undefined;
      /**
       * Specifies the opacity of error bars.
       */
      opacity?: number | undefined;
      /**
       * Specifies how error bar values must be calculated.
       */
      type?: ValueErrorBarType | undefined;
      /**
       * Specifies the value to be used for generating error bars.
       */
      value?: number;
    };
    /**
     * Specifies the data source field that provides values for series points.
     */
    valueField?: string;
    /**
     * Specifies the visibility of a series.
     */
    visible?: boolean;
    /**
     * Specifies a line width.
     */
    width?: number;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
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
       * Indicates whether borders are visible in point labels.
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
     * Specifies a label position in bar-like series.
     */
    position?: RelativePosition;
    /**
     * Specifies the angle used to rotate point labels from their initial position.
     */
    rotationAngle?: number;
    /**
     * Specifies whether or not to show a label when the point has a zero value.
     */
    showForZeroValues?: boolean;
    /**
     * Specifies the visibility of point labels.
     */
    visible?: boolean;
    /**
      * Specifies the label&apos;s text.
      */
     displayFormat?: string | undefined;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * Specifies border properties for points in the line and area series.
     */
    border?: {
      /**
       * Sets a border color for points in the line and area series.
       */
      color?: string | undefined;
      /**
       * Sets border visibility for points in the line and area series.
       */
      visible?: boolean;
      /**
       * Sets a border width for points in the line or area series.
       */
      width?: number;
    };
    /**
     * Specifies the points color.
     */
    color?: string | ChartsColor | undefined;
    /**
     * Specifies what series points to highlight when a point is hovered over.
     */
    hoverMode?: PointInteractionMode;
    /**
     * An object defining configuration properties for a hovered point.
     */
    hoverStyle?: {
      /**
       * An object defining the border properties for a hovered point.
       */
      border?: {
        /**
         * Sets a border color for a hovered point.
         */
        color?: string | undefined;
        /**
         * Sets border visibility for a hovered point.
         */
        visible?: boolean;
        /**
         * Sets a border width for a hovered point.
         */
        width?: number;
      };
      /**
       * Sets a color for a point when it is hovered over.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the diameter of a hovered point in the series that represents data points as symbols (not as bars for instance).
       */
      size?: number;
    };
    /**
     * An object specifying the parameters of an image that is used as a point marker.
     */
    image?: string | undefined | {
      /**
       * Specifies the height of an image that is used as a point marker.
       */
      height?: number;
      /**
       * Specifies a URL leading to the image to be used as a point marker.
       */
      url?: string | undefined;
      /**
       * Specifies the width of an image that is used as a point marker.
       */
      width?: number;
    };
    /**
     * Specifies what series points to highlight when a point is selected.
     */
    selectionMode?: PointInteractionMode;
    /**
     * An object defining configuration properties for a selected point.
     */
    selectionStyle?: {
      /**
       * An object defining the border properties for a selected point.
       */
      border?: {
        /**
         * Sets a border color for a selected point.
         */
        color?: string | undefined;
        /**
         * Sets border visibility for a selected point.
         */
        visible?: boolean;
        /**
         * Sets a border width for a selected point.
         */
        width?: number;
      };
      /**
       * Sets a color for a point when it is selected.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specifies the diameter of a selected point in the series that represents data points as symbols (not as bars for instance).
       */
      size?: number;
    };
    /**
     * Specifies the point diameter in pixels for those series that represent data points as symbols (not as bars for instance).
     */
    size?: number;
    /**
     * Specifies a symbol for presenting points of the line and area series.
     */
    symbol?: PointSymbol;
    /**
     * Specifies the points visibility for a line and area series.
     */
    visible?: boolean;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies series elements to be highlighted when a user points to the series.
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * An object defining configuration properties for points in line and area series.
     */
    point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
    /**
     * Specifies series elements to be highlighted when a user selects the series.
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * Specifies the points visibility for a line and area series.
     */
    visible?: boolean;
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies series elements to be highlighted when a user points to the series.
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * Specifies series elements to be highlighted when a user selects the series.
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies series elements to be highlighted when a user points to the series.
     */
    hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
    /**
     * Specifies series elements to be highlighted when a user selects the series.
     */
    selectionMode?: 'includePoints' | 'excludePoints' | 'none';
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * Specifies series elements to be highlighted when a user points to the series.
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * An object defining the label configuration properties.
     */
    label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
    /**
     * Specifies series elements to be highlighted when a user selects the series.
     */
    selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * Specifies a label position in bar-like series.
     */
    position?: RelativePosition;
}

/**
 * This section describes the Point object, which represents a series point.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface polarPointObject extends basePointObject {
}

/**
 * This section describes the Series object, which represents a series.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface polarChartSeriesObject extends baseSeriesObject {
}

export type Properties = dxPolarChartOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxPolarChartOptions;

// #region deprecated in v23.1

/**
 * @deprecated Use AdaptiveLayout instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartAdaptiveLayout = AdaptiveLayout;

/**
 * @deprecated Use ArgumentAxis instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxis = ArgumentAxis;

/**
 * @deprecated Use ArgumentAxisConstantLines instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisConstantLines = ArgumentAxisConstantLines;

/**
 * @deprecated Use ArgumentAxisConstantLinesLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisConstantLinesLabel = ArgumentAxisConstantLinesLabel;

/**
 * @deprecated Use ArgumentAxisLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisLabel = ArgumentAxisLabel;

/**
 * @deprecated Use ArgumentAxisMinorTick instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisMinorTick = ArgumentAxisMinorTick;

/**
 * @deprecated Use ArgumentAxisStrips instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisStrips = ArgumentAxisStrips;

/**
 * @deprecated Use ArgumentAxisStripsLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisStripsLabel = ArgumentAxisStripsLabel;

/**
 * @deprecated Use ArgumentAxisTick instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartArgumentAxisTick = ArgumentAxisTick;

/**
 * @deprecated Use CommonAxisSettings instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettings = CommonAxisSettings;

/**
 * @deprecated Use CommonAxisSettingsConstantLineStyle instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsConstantLineStyle = CommonAxisSettingsConstantLineStyle;

/**
 * @deprecated Use CommonAxisSettingsConstantLineStyleLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsConstantLineStyleLabel = CommonAxisSettingsConstantLineStyleLabel;

/**
 * @deprecated Use CommonAxisSettingsLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsLabel = CommonAxisSettingsLabel;

/**
 * @deprecated Use CommonAxisSettingsMinorTick instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsMinorTick = CommonAxisSettingsMinorTick;

/**
 * @deprecated Use CommonAxisSettingsStripStyle instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsStripStyle = CommonAxisSettingsStripStyle;

/**
 * @deprecated Use CommonAxisSettingsStripStyleLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsStripStyleLabel = CommonAxisSettingsStripStyleLabel;

/**
 * @deprecated Use CommonAxisSettingsTick instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonAxisSettingsTick = CommonAxisSettingsTick;

/**
 * @deprecated Use CommonSeriesSettings instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartCommonSeriesSettings = CommonSeriesSettings;

/**
 * @deprecated Use Legend instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartLegend = Legend;

/**
 * @deprecated Use Tooltip instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartTooltip = Tooltip;

/**
 * @deprecated Use ValueAxis instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxis = ValueAxis;

/**
 * @deprecated Use ValueAxisConstantLines instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisConstantLines = ValueAxisConstantLines;

/**
 * @deprecated Use ValueAxisConstantLinesLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisConstantLinesLabel = ValueAxisConstantLinesLabel;

/**
 * @deprecated Use ValueAxisLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisLabel = ValueAxisLabel;

/**
 * @deprecated Use ValueAxisStrips instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisStrips = ValueAxisStrips;

/**
 * @deprecated Use ValueAxisStripsLabel instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisStripsLabel = ValueAxisStripsLabel;

/**
 * @deprecated Use ValueAxisTick instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPolarChartValueAxisTick = ValueAxisTick;

// #endregion

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onArgumentAxisClick' | 'onLegendClick' | 'onSeriesClick' | 'onSeriesHoverChanged' | 'onSeriesSelectionChanged' | 'onZoomEnd' | 'onZoomStart'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPolarChartOptions.onDisposing
 * @type_function_param1 e:{viz/polar_chart:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPolarChartOptions.onDone
 * @type_function_param1 e:{viz/polar_chart:DoneEvent}
 */
onDone?: ((e: DoneEvent) => void);
/**
 * @docid dxPolarChartOptions.onDrawn
 * @type_function_param1 e:{viz/polar_chart:DrawnEvent}
 */
onDrawn?: ((e: DrawnEvent) => void);
/**
 * @docid dxPolarChartOptions.onExported
 * @type_function_param1 e:{viz/polar_chart:ExportedEvent}
 */
onExported?: ((e: ExportedEvent) => void);
/**
 * @docid dxPolarChartOptions.onExporting
 * @type_function_param1 e:{viz/polar_chart:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @docid dxPolarChartOptions.onFileSaving
 * @type_function_param1 e:{viz/polar_chart:FileSavingEvent}
 */
onFileSaving?: ((e: FileSavingEvent) => void);
/**
 * @docid dxPolarChartOptions.onIncidentOccurred
 * @type_function_param1 e:{viz/polar_chart:IncidentOccurredEvent}
 */
onIncidentOccurred?: ((e: IncidentOccurredEvent) => void);
/**
 * @docid dxPolarChartOptions.onInitialized
 * @type_function_param1 e:{viz/polar_chart:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPolarChartOptions.onOptionChanged
 * @type_function_param1 e:{viz/polar_chart:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointClick
 * @type_function_param1 e:{viz/polar_chart:PointClickEvent}
 */
onPointClick?: ((e: PointClickEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointHoverChanged
 * @type_function_param1 e:{viz/polar_chart:PointHoverChangedEvent}
 */
onPointHoverChanged?: ((e: PointHoverChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onPointSelectionChanged
 * @type_function_param1 e:{viz/polar_chart:PointSelectionChangedEvent}
 */
onPointSelectionChanged?: ((e: PointSelectionChangedEvent) => void);
/**
 * @docid dxPolarChartOptions.onTooltipHidden
 * @type_function_param1 e:{viz/polar_chart:TooltipHiddenEvent}
 */
onTooltipHidden?: ((e: TooltipHiddenEvent) => void);
/**
 * @docid dxPolarChartOptions.onTooltipShown
 * @type_function_param1 e:{viz/polar_chart:TooltipShownEvent}
 */
onTooltipShown?: ((e: TooltipShownEvent) => void);
};
///#ENDDEBUG
