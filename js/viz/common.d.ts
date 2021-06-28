import {
    dxChartSeriesTypesCommonSeries
} from './chart';

import {
    Font
} from './core/base_widget';

export type ChartSeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
export type DashStyleType = 'dash' | 'dot' | 'longDash' | 'solid';
export type TimeIntervalType = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
export type HatchingDirectionType = 'left' | 'none' | 'right';
/**
 * @docid
 * @type number|object|Enums.VizTimeInterval
 * @hidden
 * @default undefined
 */
export type VizTimeInterval = number | {
  /** @docid */
  days?: number,
  /** @docid */
  hours?: number,
  /** @docid */
  milliseconds?: number,
  /** @docid */
  minutes?: number,
  /** @docid */
  months?: number,
  /** @docid */
  quarters?: number,
  /** @docid */
  seconds?: number,
  /** @docid */
  weeks?: number,
  /** @docid */
  years?: number
} | TimeIntervalType;

/**
 * @docid
 * @type object
 * @hidden
 */
export interface BaseLegend {
    /**
     * @docid
     * @default undefined
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @public
     */
    border?: {
      /**
       * @docid
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid
       * @default 0
       */
      cornerRadius?: number,
      /**
       * @docid
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @default 0
     * @public
     */
    columnCount?: number;
    /**
     * @docid
     * @default 20
     * @public
     */
    columnItemSpacing?: number;
    /**
     * @docid
     * @default '#767676' [prop](color)
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.Position
     * @default undefined
     * @public
     */
    itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @public
     */
    itemsAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @default 10
     * @public
     */
    margin?: number | {
      /**
       * @docid
       * @default 10
       */
      bottom?: number,
      /**
       * @docid
       * @default 10
       */
      left?: number,
      /**
       * @docid
       * @default 10
       */
      right?: number,
      /**
       * @docid
       * @default 10
       */
      top?: number
    };
    /**
     * @docid
     * @default 20
     * @public
     */
    markerSize?: number;
    /**
     * @docid
     * @type Enums.Orientation
     * @default undefined
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default 10
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @default 10
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    rowCount?: number;
    /**
     * @docid
     * @default 8
     * @public
     */
    rowItemSpacing?: number;
    /**
     * @docid
     * @public
     */
    title?: {
      /**
       * @docid
       * @default '#232323' [prop](color)
       * @default 18 [prop](size)
       * @default 200 [prop](weight)
       * @extends CommonVizLightFontFamily
       */
      font?: Font,
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       * @default undefined
       */
      horizontalAlignment?: 'center' | 'left' | 'right',
      /**
       * @docid
       */
      margin?: {
        /**
         * @docid
         * @default 9
         */
        bottom?: number,
        /**
         * @docid
         * @default 0
         */
        left?: number,
        /**
         * @docid
         * @default 0
         */
        right?: number,
        /**
         * @docid
         * @default 0
         */
        top?: number
      },
      /**
       * @docid
       * @default undefined
       */
      placeholderSize?: number,
      /**
       * @docid
       */
      subtitle?: {
        /**
         * @docid
         * @default '#232323' [prop](color)
         * @default 14 [prop](size)
         * @default 200 [prop](weight)
         * @extends CommonVizLightFontFamily
         */
        font?: Font,
        /**
         * @docid
         * @default 0
         */
        offset?: number,
        /**
         * @docid
         * @default null
         */
        text?: string
      } | string,
      /**
       * @docid
       * @default null
       */
      text?: string,
      /**
       * @docid
       * @type Enums.VerticalEdge
       * @default 'top'
       */
      verticalAlignment?: 'bottom' | 'top'
    } | string;
    /**
     * @docid
     * @type Enums.VerticalEdge
     * @default 'top'
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}

/**
 * @docid
 * @type object
 * @hidden
 */
export interface BaseLegendItem {
    /**
     * @docid
     * @public
     */
    marker?: {
      /**
       * @docid
       */
      fill?: string,
      /**
       * @docid
       */
      opacity?: number,
      /**
       * @docid
       */
      size?: number,
      /**
       * @docid
       * @type Enums.LegendMarkerState
       */
      state?: 'normal' | 'hovered' | 'selected'
    };
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @public
     */
    visible?: boolean;
}

/**
 * @docid
 * @type object
 * @inherits dxChartSeriesTypes.CommonSeries
 * @hidden
 */
export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
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
    /**
     * @docid
     * @type Enums.SeriesType
     * @default 'line'
     * @public
     */
    type?: ChartSeriesType;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 * @hidden
 */
export interface ScaleBreak {
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
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.viz
 * @hidden
 */
export interface VizRange {
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
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @public
     */
    length?: VizTimeInterval;
    /**
     * @docid
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @public
     */
    startValue?: number | Date | string;
}
