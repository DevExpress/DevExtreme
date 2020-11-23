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

export interface BaseLegend {
    /**
     * @docid BaseLegend.backgroundColor
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    backgroundColor?: string;
    /**
     * @docid BaseLegend.border
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    border?: { color?: string, cornerRadius?: number, dashStyle?: DashStyleType, opacity?: number, visible?: boolean, width?: number };
    /**
     * @docid BaseLegend.columnCount
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnCount?: number;
    /**
     * @docid BaseLegend.columnItemSpacing
     * @default 20
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    columnItemSpacing?: number;
    /**
     * @docid BaseLegend.font
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
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
    /**
     * @docid BaseLegend.markerSize
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
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingLeftRight?: number;
    /**
     * @docid BaseLegend.paddingTopBottom
     * @default 10
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    paddingTopBottom?: number;
    /**
     * @docid BaseLegend.rowCount
     * @default 0
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowCount?: number;
    /**
     * @docid BaseLegend.rowItemSpacing
     * @default 8
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    rowItemSpacing?: number;
    /**
     * @docid BaseLegend.title
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
     * @default true
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

export interface BaseLegendItem {
    /**
     * @docid BaseLegendItem.marker
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    marker?: { fill?: string, opacity?: number, size?: number, state?: 'normal' | 'hovered' | 'selected' };
    /**
     * @docid BaseLegendItem.text
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    text?: string;
    /**
     * @docid BaseLegendItem.visible
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    visible?: boolean;
}

export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
    /**
     * @docid ChartSeries.name
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    name?: string;
    /**
     * @docid ChartSeries.tag
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
    type?: ChartSeriesType;
}

export interface ScaleBreak {
    /**
     * @docid ScaleBreak.endValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    endValue?: number | Date | string;
    /**
     * @docid ScaleBreak.startValue
     * @default undefined
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}

export interface VizRange {
    /**
     * @docid VizRange.endValue
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
    length?: number | any | TimeIntervalType;
    /**
     * @docid VizRange.startValue
     * @default undefined
     * @fires BaseWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.viz
     * @public
     */
    startValue?: number | Date | string;
}
