import {
    dxChartSeriesTypesCommonSeries,
} from './chart';

import {
    HorizontalAlignment,
    Orientation,
    Position,
    VerticalEdge,
} from '../common';

import {
    DashStyle,
    LegendMarkerState,
    SeriesType as CommonSeriesType,
    Font,
} from '../common/charts';

import type * as Common from '../common/charts';

/**
 * @deprecated Use SeriesType from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SeriesType = Common.SeriesType;

/**
 * @deprecated Use TimeIntervalConfig from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type VizTimeInterval = Common.TimeIntervalConfig;

/**
 * @deprecated Use ScaleBreak from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ScaleBreak = Common.ScaleBreak;

/**
 * @deprecated Use VisualRange from 'devextreme/common/charts' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type VisualRange = Common.VisualRange;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseLegend {
    /**
     * Colors the legend&apos;s background.
     */
    backgroundColor?: string | undefined;
    /**
     * Configures the legend&apos;s border.
     */
    border?: {
      /**
       * Colors the legend&apos;s border.
       */
      color?: string;
      /**
       * Makes all the legend&apos;s corners rounded.
       */
      cornerRadius?: number;
      /**
       * Sets a dash style for the legend&apos;s border.
       */
      dashStyle?: DashStyle;
      /**
       * Specifies the transparency of the legend&apos;s border.
       */
      opacity?: number | undefined;
      /**
       * Shows the legend&apos;s border.
       */
      visible?: boolean;
      /**
       * Specifies the width of the legend&apos;s border in pixels.
       */
      width?: number;
    };
    /**
     * Arranges legend items into several columns.
     */
    columnCount?: number;
    /**
     * Specifies an empty space between item columns in pixels.
     */
    columnItemSpacing?: number;
    /**
     * Specifies the legend items&apos; font properties.
     */
    font?: Font;
    /**
     * Along with verticalAlignment, specifies the legend&apos;s position.
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * Specifies the text&apos;s position relative to the marker in a legend item.
     */
    itemTextPosition?: Position | undefined;
    /**
     * Aligns items in the last column or row (depending on the legend&apos;s orientation). Applies when legend items are not divided into columns or rows equally.
     */
    itemsAlignment?: HorizontalAlignment | undefined;
    /**
     * Generates an empty space, measured in pixels, around the legend.
     */
    margin?: number | {
      /**
       * Specifies the legend&apos;s bottom margin in pixels.
       */
      bottom?: number;
      /**
       * Specifies the legend&apos;s left margin in pixels.
       */
      left?: number;
      /**
       * Specifies the legend&apos;s right margin in pixels.
       */
      right?: number;
      /**
       * Specifies the legend&apos;s top margin in pixels.
       */
      top?: number;
    };
    /**
     * Specifies the marker&apos;s size in a legend item in pixels.
     */
    markerSize?: number;
    /**
     * Arranges legend items vertically (in a column) or horizontally (in a row). The default value is &apos;horizontal&apos; if the legend.horizontalAlignment is &apos;center&apos;. Otherwise, it is &apos;vertical&apos;.
     */
    orientation?: Orientation | undefined;
    /**
     * Generates an empty space, measured in pixels, between the legend&apos;s left/right border and its items.
     */
    paddingLeftRight?: number;
    /**
     * Generates an empty space, measured in pixels, between the legend&apos;s top/bottom border and its items.
     */
    paddingTopBottom?: number;
    /**
     * Arranges legend items in several rows.
     */
    rowCount?: number;
    /**
     * Specifies an empty space between item rows in pixels.
     */
    rowItemSpacing?: number;
    /**
     * Configures the legend title.
     */
    title?: {
      /**
       * Specifies the legend title&apos;s font properties.
       */
      font?: Font;
      /**
       * Along with verticalAlignment, specifies the legend title&apos;s position.
       */
      horizontalAlignment?: HorizontalAlignment | undefined;
      /**
       * Generates space around the legend title.
       */
      margin?: {
        /**
         * Specifies the legend title&apos;s bottom margin.
         */
        bottom?: number;
        /**
         * Specifies the legend title&apos;s left margin.
         */
        left?: number;
        /**
         * Specifies the legend title&apos;s right margin.
         */
        right?: number;
        /**
         * Specifies the legend title&apos;s top margin.
         */
        top?: number;
      };
      /**
       * Reserves a pixel-measured space for the legend title.
       */
      placeholderSize?: number | undefined;
      /**
       * Configures the legend subtitle. The subtitle appears only if the title is specified.
       */
      subtitle?: {
        /**
         * Specifies the legend subtitle&apos;s font properties.
         */
        font?: Font;
        /**
         * Specifies the distance between the legend&apos;s title and subtitle in pixels.
         */
        offset?: number;
        /**
         * Specifies the subtitle&apos;s text.
         */
        text?: string;
      } | string;
      /**
       * Specifies the legend title&apos;s text.
       */
      text?: string;
      /**
       * Specifies the legend title&apos;s vertical alignment.
       */
      verticalAlignment?: VerticalEdge;
    } | string;
    /**
     * Along with horizontalAlignment, specifies the legend&apos;s position.
     */
    verticalAlignment?: VerticalEdge;
    /**
     * Specifies the legend&apos;s visibility.
     */
    visible?: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface BaseLegendItem {
    /**
     * A legend item marker.
     */
    marker?: {
      /**
       * The marker&apos;s color.
       */
      fill?: string;
      /**
       * The marker&apos;s opacity.
       */
      opacity?: number;
      /**
       * The markerSize in pixels.
       */
      size?: number;
      /**
       * The marker&apos;s state.
       */
      state?: LegendMarkerState;
    };
    /**
     * The text that the legend item displays.
     */
    text?: string;
    /**
     * Indicates and specifies whether the legend item is visible.
     */
    visible?: boolean;
}

/**
 * Specifies properties for Chart UI component series.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
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
    type?: CommonSeriesType;
}
