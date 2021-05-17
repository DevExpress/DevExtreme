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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#d3d3d3'
       */
      color?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 0
       */
      cornerRadius?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.DashStyle
       * @default 'solid'
       */
      dashStyle?: DashStyleType,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 1
       */
      width?: number
    };
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnCount?: number;
    /**
     * @docid
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnItemSpacing?: number;
    /**
     * @docid
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.Position
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemsAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      bottom?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      left?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      right?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default 10
       */
      top?: number
    };
    /**
     * @docid
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerSize?: number;
    /**
     * @docid
     * @type Enums.Orientation
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowCount?: number;
    /**
     * @docid
     * @default 8
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowItemSpacing?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default '#232323' [prop](color)
       * @default 18 [prop](size)
       * @default 200 [prop](weight)
       * @extends CommonVizLightFontFamily
       */
      font?: Font,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.HorizontalAlignment
       * @default undefined
       */
      horizontalAlignment?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      margin?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 9
         */
        bottom?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0
         */
        left?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0
         */
        right?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0
         */
        top?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default undefined
       */
      placeholderSize?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      subtitle?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default '#232323' [prop](color)
         * @default 14 [prop](size)
         * @default 200 [prop](weight)
         * @extends CommonVizLightFontFamily
         */
        font?: Font,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default 0
         */
        offset?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.viz
         * @default null
         */
        text?: string
      } | string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @default null
       */
      text?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.VerticalEdge
       * @default 'top'
       */
      verticalAlignment?: 'bottom' | 'top'
    } | string;
    /**
     * @docid
     * @type Enums.VerticalEdge
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.viz
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    marker?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      fill?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      opacity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       */
      size?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.viz
       * @type Enums.LegendMarkerState
       */
      state?: 'normal' | 'hovered' | 'selected'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.viz
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
    /**
     * @docid
     * @type Enums.SeriesType
     * @default 'line'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: ChartSeriesType;
}

/**
 * @docid
 * @type object
 * @hidden
 */
export interface ScaleBreak {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}

/**
 * @docid
 * @type object
 * @hidden
 */
export interface VizRange {
    /**
     * @docid
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @inherits VizTimeInterval
     * @type number|object|Enums.VizTimeInterval
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: VizTimeInterval;
    /**
     * @docid
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
