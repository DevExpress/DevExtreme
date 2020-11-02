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
* @hidden
* @type object
*/
export interface BaseLegend {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
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
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnCount?: number;
    /**
     * @docid
     * @type number
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnItemSpacing?: number;
    /**
     * @docid
     * @type Font
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
     * @type number | object
     * @default 10
     * @prevFileNamespace DevExpress.viz
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
     * @type number
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
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowCount?: number;
    /**
     * @docid
     * @type number
     * @default 8
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowItemSpacing?: number;
    /**
     * @docid
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: {
      /**
      * @docid
      * @type Font
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
      * @type object
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
      * @type object|string
      */
      subtitle?: {
        /**
        * @docid
        * @type Font
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
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

/**
* @docid
* @hidden
* @type object
*/
export interface BaseLegendItem {
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.viz
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
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

/**
 * @docid
 * @type object
 * @inherits dxChartSeriesTypesCommonSeries
 * @hidden
 */
export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type any
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
* @hidden
* @type object
*/
export interface ScaleBreak {
    /**
     * @docid
     * @type number|date|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid
     * @type number|date|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}

/**
* @docid
* @hidden
* @type object
*/
export interface VizRange {
    /**
     * @docid
     * @type number|date|string
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
    length?: number | any | TimeIntervalType;
    /**
     * @docid
     * @type number|date|string
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
