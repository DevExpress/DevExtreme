/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type AnimationEaseMode = 'easeOutCubic' | 'linear';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type AnnotationType = 'text' | 'image' | 'custom';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ChartsAxisLabelOverlap = 'rotate' | 'stagger' | 'none' | 'hide';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ChartsLabelOverlap = 'hide' | 'none' | 'stack';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ChartsDataType = 'datetime' | 'numeric' | 'string';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type DashStyle = 'dash' | 'dot' | 'longDash' | 'solid';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type HatchDirection = 'left' | 'none' | 'right';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type LabelOverlap = 'hide' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ShiftLabelOverlap = 'hide' | 'none' | 'shift';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type LabelPosition = 'columns' | 'inside' | 'outside';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type LegendHoverMode = 'excludePoints' | 'includePoints' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type Palette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type PaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type PaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type PointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle' | 'triangleDown' | 'triangleUp';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type RelativePosition = 'inside' | 'outside';

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.charts
 * @hidden
 */
export type ScaleBreak = {
    /**
    * @docid
    * @default undefined
    * @public
    */
    endValue?: number | Date | string;
    /**
    * @docid
    * @default undefined
    * @public
    */
    startValue?: number | Date | string;
};

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ScaleBreakLineStyle = 'straight' | 'waved';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type SeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type SeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type TextOverflow = 'ellipsis' | 'hide' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type Theme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type TimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';

/**
 * @docid VizTimeInterval
 * @public
 * @namespace DevExpress.common.charts
 * @hidden
 * @default undefined
 */
export type TimeIntervalConfig = number | {
    /** @docid VizTimeInterval.days */
    days?: number;
    /** @docid VizTimeInterval.hours */
    hours?: number;
    /** @docid VizTimeInterval.milliseconds */
    milliseconds?: number;
    /** @docid VizTimeInterval.minutes */
    minutes?: number;
    /** @docid VizTimeInterval.months */
    months?: number;
    /** @docid VizTimeInterval.quarters */
    quarters?: number;
    /** @docid VizTimeInterval.seconds */
    seconds?: number;
    /** @docid VizTimeInterval.weeks */
    weeks?: number;
    /** @docid VizTimeInterval.years */
    years?: number;
} | TimeInterval;

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common.charts
 * @hidden
 */
export type VisualRange = {
    /**
    * @docid
    * @default undefined
    * @fires BaseWidgetOptions.onOptionChanged
    * @public
    */
    endValue?: number | Date | string;
    /**
    * @docid
    * @inherits VizTimeInterval
    * @type number|object|Enums.TimeInterval
    * @default undefined
    * @public
    */
    length?: TimeIntervalConfig;
    /**
    * @docid
    * @default undefined
    * @fires BaseWidgetOptions.onOptionChanged
    * @public
    */
    startValue?: number | Date | string;
};

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ValueAxisVisualRangeUpdateMode = 'auto' | 'keep' | 'reset';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type VisualRangeUpdateMode = ValueAxisVisualRangeUpdateMode | 'shift';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type WordWrap = 'normal' | 'breakWord' | 'none';

/**
 * @public
 * @namespace DevExpress.common.charts
 */
export type ZoomPanAction = 'zoom' | 'pan';

/**
 * @docid
 * @type object
 * @public
 * @namespace DevExpress.common.charts
 */
export type ChartsColor = {
    /**
     * @docid
     * @default undefined
     * @public
     */
    base?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    fillId?: string;
};

/**
 * @docid viz.registerGradient
 * @publicName registerGradient(type, options)
 * @namespace DevExpress.common.charts
 * @static
 * @public
 */
export function registerGradient(type: string, options: { rotationAngle?: number; colors: Array<GradientColor> }): string;
/**
 * @docid viz.registerPattern
 * @publicName registerPattern(options)
 * @namespace DevExpress.common.charts
 * @static
 * @public
 */
export function registerPattern(options: { width: number | string; height: number | string; template: (container: SVGGElement) => void }): string;
/**
 * @namespace DevExpress.common.charts
 * @public
 */
export type GradientColor = {
   /**
   * @docid
   * @default undefined
   * @public
   */
    offset: number | string;
   /**
   * @docid
   * @default undefined
   * @public
   */
    color: string;
};
