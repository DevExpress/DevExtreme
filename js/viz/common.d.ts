import {
    dxChartSeriesTypesCommonSeries
} from './chart';

import {
    Font
} from './core/base_widget';

export interface BaseLegend {
    /**
     * @docid BaseLegend.backgroundColor
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseLegend.border
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseLegend.columnCount
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnCount?: number;
    /**
     * @docid BaseLegend.columnItemSpacing
     * @type number
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnItemSpacing?: number;
    /**
     * @docid BaseLegend.font
     * @type Font
     * @default '#767676' [prop](color)
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    font?: Font;
    /**
     * @docid BaseLegend.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default 'right'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid BaseLegend.itemTextPosition
     * @type Enums.Position
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * @docid BaseLegend.itemsAlignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    itemsAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid BaseLegend.margin
     * @type number | object
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
    /**
     * @docid BaseLegend.markerSize
     * @type number
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    markerSize?: number;
    /**
     * @docid BaseLegend.orientation
     * @type Enums.Orientation
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid BaseLegend.paddingLeftRight
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseLegend.paddingTopBottom
     * @type number
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid BaseLegend.rowCount
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowCount?: number;
    /**
     * @docid BaseLegend.rowItemSpacing
     * @type number
     * @default 8
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowItemSpacing?: number;
    /**
     * @docid BaseLegend.title
     * @type object|string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    title?: { font?: Font, horizontalAlignment?: 'center' | 'left' | 'right', margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: { font?: Font, offset?: number, text?: string } | string, text?: string, verticalAlignment?: 'bottom' | 'top' } | string;
    /**
     * @docid BaseLegend.verticalAlignment
     * @type Enums.VerticalEdge
     * @default 'top'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * @docid BaseLegend.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

export interface BaseLegendItem {
    /**
     * @docid BaseLegendItem.marker
     * @type object
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    marker?: { fill?: string, opacity?: number, size?: number, state?: 'normal' | 'hovered' | 'selected' };
    /**
     * @docid BaseLegendItem.text
     * @type string
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid BaseLegendItem.visible
     * @type boolean
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid ChartSeries.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid ChartSeries.tag
     * @type any
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    tag?: any;
    /**
     * @docid ChartSeries.type
     * @type Enums.SeriesType
     * @default 'line'
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
}

export interface ScaleBreak {
    /**
     * @docid ScaleBreak.endValue
     * @type number|date|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid ScaleBreak.startValue
     * @type number|date|string
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}

export interface VizRange {
    /**
     * @docid VizRange.endValue
     * @type number|date|string
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid VizRange.length
     * @inherits VizTimeInterval
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    length?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * @docid VizRange.startValue
     * @type number|date|string
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
