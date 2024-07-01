import { HorizontalAlignment } from '../common';
import { Format } from '../localization';
import { BaseLegendItem } from '../viz/common';
import { baseSeriesObject } from '../viz/chart';

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
export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

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
 * @docid
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

/**
 * @docid
 * @namespace DevExpress.common.charts
 * @public
 */
export type Font = {
  /**
   * @docid
   * @public
   */
  color?: string;
  /**
   * @docid
   * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
   * @public
   */
  family?: string;
  /**
   * @docid
   * @default 1
   * @public
   */
  opacity?: number;
  /**
   * @docid
   * @default 12
   * @public
   */
  size?: string | number;
  /**
   * @docid
   * @default 400
   * @public
   */
  weight?: number;
};

/**
 * @namespace DevExpress.common.charts
 * @public
 */
export interface SeriesPoint {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.border
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    border?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.visible
       * @default false
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      visible?: boolean;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.border.width
       * @default 1
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      width?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.color
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    color?: string | ChartsColor;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    hoverMode?: PointInteractionMode;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    hoverStyle?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      border?: {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.color
         * @default undefined
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        color?: string;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.visible
         * @default true
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        visible?: boolean;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.width
         * @default 4
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        width?: number;
      };
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string | ChartsColor;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.hoverStyle.size
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      size?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.image
     * @default undefined
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    image?: string | {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.height
       * @default 30
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      height?: number | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: number;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.height.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: number;
      };
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.url
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      url?: string | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: string;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.url.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: string;
      };
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.image.width
       * @default 30
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      width?: number | {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMaxPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMaxPoint?: number;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.image.width.rangeMinPoint
         * @default undefined
         * @propertyOf dxChartSeriesTypes.RangeAreaSeries
         */
        rangeMinPoint?: number;
      };
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionMode
     * @default 'onlyPoint'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    selectionMode?: PointInteractionMode;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    selectionStyle?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      border?: {
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.color
         * @default undefined
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        color?: string;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.visible
         * @default true
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        visible?: boolean;
        /**
         * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.width
         * @default 4
         * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
         */
        width?: number;
      };
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      color?: string | ChartsColor;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.point.selectionStyle.size
       * @default undefined
       * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
       */
      size?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.size
     * @default 12
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    size?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.symbol
     * @default 'circle'
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    symbol?: PointSymbol;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.point.visible
     * @default true
     * @propertyOf dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StepLineSeries,dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.ScatterSeries
     * @public
     */
    visible?: boolean;
}

/**
 * @namespace DevExpress.common.charts
 * @public
*/
export interface SeriesLabel {
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.alignment
     * @default 'center'
     * @public
     */
    alignment?: HorizontalAlignment;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.argumentFormat
     * @default undefined
     * @public
     */
    argumentFormat?: Format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.backgroundColor
     * @default undefined
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.border
     * @public
     */
    border?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.color
       * @default  '#d3d3d3'
       */
      color?: string;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.dashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyle;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.visible
       * @default false
       */
      visible?: boolean;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.border.width
       * @default 1
       */
      width?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.connector
     * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
     * @public
     */
    connector?: {
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.color
       * @default undefined
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      color?: string;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.visible
       * @default false
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      visible?: boolean;
      /**
       * @docid dxChartSeriesTypes.CommonSeries.label.connector.width
       * @default 1
       * @propertyOf dxChartSeriesTypes.AreaSeries,dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.BubbleSeries,dxChartSeriesTypes.FullStackedAreaSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.FullStackedLineSeries,dxChartSeriesTypes.LineSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.ScatterSeries,dxChartSeriesTypes.SplineAreaSeries,dxChartSeriesTypes.SplineSeries,dxChartSeriesTypes.StackedAreaSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.StackedLineSeries,dxChartSeriesTypes.StepAreaSeries,dxChartSeriesTypes.StackedSplineAreaSeries,dxChartSeriesTypes.FullStackedSplineAreaSeries,dxChartSeriesTypes.StackedSplineSeries,dxChartSeriesTypes.FullStackedSplineSeries,dxChartSeriesTypes.StepLineSeries
       */
      width?: number;
    };
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.customizeText
     * @type_function_param1 pointInfo:object
     * @notUsedInTheme
     * @public
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.font
     * @default '#FFFFFF' &prop(color)
     * @default 14 &prop(size)
     * @public
     */
    font?: Font;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.format
     * @default undefined
     * @public
     */
    format?: Format;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.horizontalOffset
     * @default 0
     * @public
     */
    horizontalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.position
     * @default 'outside'
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries,dxChartSeriesTypes.RangeAreaSeries,dxChartSeriesTypes.BubbleSeries
     * @public
     */
    position?: RelativePosition;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.rotationAngle
     * @default 0
     * @public
     */
    rotationAngle?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.showForZeroValues
     * @default true
     * @propertyOf dxChartSeriesTypes.BarSeries,dxChartSeriesTypes.StackedBarSeries,dxChartSeriesTypes.FullStackedBarSeries,dxChartSeriesTypes.RangeBarSeries
     * @public
     */
    showForZeroValues?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.verticalOffset
     * @default 0
     * @public
     */
    verticalOffset?: number;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.visible
     * @default false
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxChartSeriesTypes.CommonSeries.label.displayFormat
     * @default undefined
     * @public
     */
     displayFormat?: string;
}

/**
 * @public
 * @docid
 * @type object
 * @inherits BaseLegendItem
 * @namespace DevExpress.common.charts
 */
export interface LegendItem extends BaseLegendItem {
  /**
   * @docid
   * @public
   */
  series?: baseSeriesObject;
}
