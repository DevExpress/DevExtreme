import { HorizontalAlignment } from '../common';
import { Format } from '../localization';
import { BaseLegendItem } from '../viz/common';
import { baseSeriesObject } from '../viz/chart';

export type AnimationEaseMode = 'easeOutCubic' | 'linear';

export type AnnotationType = 'text' | 'image' | 'custom';

export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';

export type ChartsAxisLabelOverlap = 'rotate' | 'stagger' | 'none' | 'hide';

export type ChartsLabelOverlap = 'hide' | 'none' | 'stack';

export type ChartsDataType = 'datetime' | 'numeric' | 'string';

export type DashStyle = 'dash' | 'dot' | 'longDash' | 'solid';

export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';

export type HatchDirection = 'left' | 'none' | 'right';

export type LabelOverlap = 'hide' | 'none';

export type ShiftLabelOverlap = 'hide' | 'none' | 'shift';

export type LabelPosition = 'columns' | 'inside' | 'outside';

export type LegendHoverMode = 'excludePoints' | 'includePoints' | 'none';

export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

export type Palette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';

export type PaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';

export type PaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';

export type PointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle' | 'triangleDown' | 'triangleUp';

export type RelativePosition = 'inside' | 'outside';

/**
 * A class describing a scale break range. Inherited by scale breaks in the Chart and RangeSelector.
 */
export type ScaleBreak = {
    /**
     * Along with the startValue property, limits the scale break.
     */
    endValue?: number | Date | string | undefined;
    /**
     * Along with the endValue property, limits the scale break.
     */
    startValue?: number | Date | string | undefined;
};

export type ScaleBreakLineStyle = 'straight' | 'waved';

export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

export type SeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';

export type SeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';

export type TextOverflow = 'ellipsis' | 'hide' | 'none';

export type Theme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';

export type TimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';

/**
 * A class describing various time intervals. Inherited by tick intervals in Chart and RangeSelector.
 */
export type TimeIntervalConfig = number | {
    /**
     * Specifies the time interval measured in days. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    days?: number;
    /**
     * Specifies the time interval measured in hours. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    hours?: number;
    /**
     * Specifies the time interval measured in milliseconds. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    milliseconds?: number;
    /**
     * Specifies the time interval measured in minutes. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    minutes?: number;
    /**
     * Specifies the time interval measured in months. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    months?: number;
    /**
     * Specifies the time interval measured in quarters. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    quarters?: number;
    /**
     * Specifies the time interval measured in seconds. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    seconds?: number;
    /**
     * Specifies the time interval measured in weeks. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    weeks?: number;
    /**
     * Specifies the time interval measured in years. Accepts integer values. Available only for an axis/scale that displays date-time values.
     */
    years?: number;
} | TimeInterval | undefined;

export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

/**
 * 
 */
export type VisualRange = {
    /**
     * The range&apos;s end value.
     */
    endValue?: number | Date | string | undefined;
    /**
     * The range&apos;s length.
     */
    length?: TimeIntervalConfig;
    /**
     * The range&apos;s start value.
     */
    startValue?: number | Date | string | undefined;
};

export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

export type WordWrap = 'normal' | 'breakWord' | 'none';

export type ZoomPanAction = 'zoom' | 'pan';

/**
 * Specifies the chart&apos;s color.
 */
export type ChartsColor = {
    /**
     * Specifies the base color for series, points and labels.
     */
    base?: string | undefined;
    /**
     * Specifies the id of the gradient or pattern.
     */
    fillId?: string | undefined;
};

/**
 * Registers a new gradient.
 */
export function registerGradient(type: string, options: { rotationAngle?: number; colors: Array<GradientColor> }): string;
/**
 * Registers a new pattern.
 */
export function registerPattern(options: { width: number | string; height: number | string; template: (container: SVGGElement) => void }): string;
/**
 * Specifies colors on which gradient is based.
 */
export type GradientColor = {
   /**
     * Specifies the starting point of a color.
     */
    offset: number | string | undefined;
   /**
     * Specifies one of the gradient colors.
     */
    color: string | undefined;
};

/**
 * Font properties.
 */
export type Font = {
  /**
   * Specifies font color.
   */
  color?: string;
  /**
   * Specifies font family.
   */
  family?: string;
  /**
   * Specifies font opacity.
   */
  opacity?: number;
  /**
   * Specifies font size.
   */
  size?: string | number;
  /**
   * Specifies font weight. Accepts values from 100 to 900 in increments of 100. Higher values increase boldness.
   */
  weight?: number;
};

export interface SeriesPoint {
    /**
     * Configures the appearance of the series point border in scatter, line- and area-like series.
     */
    border?: {
      /**
       * Colors the border.
       */
      color?: string | undefined;
      /**
       * Makes the border visible.
       */
      visible?: boolean;
      /**
       * Sets the width of the border in pixels.
       */
      width?: number;
    };
    /**
     * Colors the series points.
     */
    color?: string | ChartsColor | undefined;
    /**
     * Specifies series elements to be highlighted when a user pauses on a series point.
     */
    hoverMode?: PointInteractionMode;
    /**
     * Configures the appearance adopted by a series point when a user pauses on it.
     */
    hoverStyle?: {
      /**
       * Configures the appearance of the point border when a user pauses on the point.
       */
      border?: {
        /**
         * Specifies the color of the point border when the point is in the hovered state.
         */
        color?: string | undefined;
        /**
         * Makes the border visible when a user pauses on the series point.
         */
        visible?: boolean;
        /**
         * Specifies the width of the point border when the point is in the hovered state.
         */
        width?: number;
      };
      /**
       * Specifies the color of series points in the hovered state.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specfies the diameter of series points in the hovered state.
       */
      size?: number | undefined;
    };
    /**
     * Substitutes the standard point symbols with an image.
     */
    image?: string | undefined | {
      /**
       * Specifies the height of the image used instead of a point marker.
       */
      height?: number | {
        /**
         * Specifies the height of the image that represents the maximum point in a range area series.
         */
        rangeMaxPoint?: number | undefined;
        /**
         * Specifies the height of the image that represents the minimum point in a range area series.
         */
        rangeMinPoint?: number | undefined;
      };
      /**
       * Specifies the URL of the image to be used as a point marker.
       */
      url?: string | undefined | {
        /**
         * Specifies the URL of the image to be used as a maximum point marker.
         */
        rangeMaxPoint?: string | undefined;
        /**
         * Specifies the URL of the image to be used as a maximum point marker.
         */
        rangeMinPoint?: string | undefined;
      };
      /**
       * Specifies the width of an image that is used as a point marker.
       */
      width?: number | {
        /**
         * Specifies the width of the image that represents the maximum point in a range area series.
         */
        rangeMaxPoint?: number | undefined;
        /**
         * Specifies the width of the image that represents the minimum point in a range area series.
         */
        rangeMinPoint?: number | undefined;
      };
    };
    /**
     * Specifies series elements to be highlighted when a user selects a series point.
     */
    selectionMode?: PointInteractionMode;
    /**
     * Configures the appearance of a selected series point.
     */
    selectionStyle?: {
      /**
       * Configures the border of a selected point.
       */
      border?: {
        /**
         * Specifies the color of the point border when the point is selected.
         */
        color?: string | undefined;
        /**
         * Makes the border of a selected point visible.
         */
        visible?: boolean;
        /**
         * Specifies the width of the point border when the point is selected.
         */
        width?: number;
      };
      /**
       * Specifies the color of series points in the selected state.
       */
      color?: string | ChartsColor | undefined;
      /**
       * Specfies the diameter of series points in the selected state.
       */
      size?: number | undefined;
    };
    /**
     * Specifies the diameter of series points in pixels.
     */
    size?: number;
    /**
     * Specifies which symbol should represent series points in scatter, line- and area-like series.
     */
    symbol?: PointSymbol;
    /**
     * Makes the series points visible.
     */
    visible?: boolean;
}

export interface SeriesLabel {
    /**
     * Aligns point labels in relation to their points.
     */
    alignment?: HorizontalAlignment;
    /**
     * Formats the point argument before it is displayed in the point label. To format the point value, use the format property.
     */
    argumentFormat?: Format | undefined;
    /**
     * Colors the point labels&apos; background. The default color is inherited from the points.
     */
    backgroundColor?: string | undefined;
    /**
     * Configures the borders of point labels.
     */
    border?: {
      /**
       * Colors the border.
       */
      color?: string | undefined;
      /**
       * Specifies the dash style of the border.
       */
      dashStyle?: DashStyle | undefined;
      /**
       * Makes the border visible.
       */
      visible?: boolean;
      /**
       * Specifies the width of the border in pixels.
       */
      width?: number;
    };
    /**
     * Configures the label connectors.
     */
    connector?: {
      /**
       * Colors the connectors.
       */
      color?: string | undefined;
      /**
       * Makes the connectors visible. Applies only if label.visible is set to true.
       */
      visible?: boolean;
      /**
       * Specifies the width of the connectors in pixels.
       */
      width?: number;
    };
    /**
     * Customizes text displayed by point labels.
     */
    customizeText?: ((pointInfo: any) => string);
    /**
     * Specifies font properties for point labels.
     */
    font?: Font;
    /**
     * Formats the point value before it is displayed in the point label.
     */
    format?: Format | undefined;
    /**
     * Along with verticalOffset, shifts point labels from their initial positions.
     */
    horizontalOffset?: number;
    /**
     * Specifies whether to display point labels inside or outside of series points. Applies only to bubble, range-like and bar-like series.
     */
    position?: RelativePosition;
    /**
     * Rotates point labels.
     */
    rotationAngle?: number;
    /**
     * Specifies whether or not to show labels for points with zero value. Applies only to bar-like series.
     */
    showForZeroValues?: boolean;
    /**
     * Along with horizontalOffset, shifts point labels from their initial positions.
     */
    verticalOffset?: number;
    /**
     * Makes the point labels visible.
     */
    visible?: boolean;
    /**
      * Specifies the label&apos;s text.
      */
     displayFormat?: string | undefined;
}

/**
 * An object that provides information about a legend item.
 */
export interface LegendItem extends BaseLegendItem {
  /**
   * The series that the item represents on the legend.
   */
  series?: baseSeriesObject;
}
