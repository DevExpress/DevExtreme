/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.sparklines {

    export interface SparklineTooltip extends viz.core.Tooltip {

        /**
  * Specifies how a tooltip is horizontally aligned relative to the graph.
  * @deprecated Tooltip alignment is no longer useful because the tooltips are aligned automatically.
  */
        horizontalAlignment?: string;

        /**
 * Specifies how a tooltip is vertically aligned relative to the graph.
 * @deprecated Tooltip alignment is no longer useful because the tooltips are aligned automatically.
 */
        verticalAlignment?: string;
    }

    
    export interface BaseSparklineOptions extends viz.core.BaseWidgetOptions, viz.core.MarginOptions {
        
        
        
        

        /** Configures the tooltip. */
        tooltip?: SparklineTooltip;

        /** A handler for the tooltipShown event. */
        onTooltipShown?: (e: {
            component: BaseSparkline;
            element: Element;
        }) => void;

        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: (e: {
            component: BaseSparkline;
            element: Element;
        }) => void;
    }

    
    

    /** Overridden by descriptions for particular widgets. */
    export class BaseSparkline extends viz.core.BaseWidget {
    }

    
    export interface dxBulletOptions extends BaseSparklineOptions {
        /** Specifies a color for the bullet bar. */
        color?: string;

        /** Specifies an end value for the invisible scale. */
        endScaleValue?: number;

        /** Specifies whether or not to show the target line. */
        showTarget?: boolean;

        /** Specifies whether or not to show the line indicating zero on the invisible scale. */
        showZeroLevel?: boolean;

        /** Specifies a start value for the invisible scale. */
        startScaleValue?: number;

        /** Specifies the value indicated by the target line. */
        target?: number;

        /** Specifies a color for both the target and zero level lines. */
        targetColor?: string;

        /** Specifies the width of the target line. */
        targetWidth?: number;

        /** Specifies the primary value indicated by the bullet bar. */
        value?: number;
    }

    
    export interface dxSparklineOptions extends BaseSparklineOptions {
        /** Specifies the data source field that provides arguments for a sparkline. */
        argumentField?: string;

        /** Sets a color for the bars indicating negative values. Available for a sparkline of the bar type only. */
        barNegativeColor?: string;

        /** Sets a color for the bars indicating positive values. Available for a sparkline of the bar type only. */
        barPositiveColor?: string;

        /** Specifies a data source for the sparkline. */
        dataSource?: any;

        /** Sets a color for the boundary of both the first and last points on a sparkline. */
        firstLastColor?: string;

        /** Specifies whether a sparkline ignores null data points or not. */
        ignoreEmptyPoints?: boolean;

        /** Sets a color for a line on a sparkline. Available for the sparklines of the line- and area-like types. */
        lineColor?: string;

        /** Specifies a width for a line on a sparkline. Available for the sparklines of the line- and area-like types. */
        lineWidth?: number;

        /** Sets a color for the bars indicating the values that are less than the winloss threshold. Available for a sparkline of the winloss type only. */
        lossColor?: string;

        /** Sets a color for the boundary of the maximum point on a sparkline. */
        maxColor?: string;

        /** Sets a color for the boundary of the minimum point on a sparkline. */
        minColor?: string;

        /** Sets a color for points on a sparkline. Available for the sparklines of the line- and area-like types. */
        pointColor?: string;

        /** Specifies the diameter of sparkline points in pixels. Available for the sparklines of line- and area-like types. */
        pointSize?: number;

        /** Specifies a symbol to use as a point marker on a sparkline. Available for the sparklines of the line- and area-like types. */
        pointSymbol?: string;

        /** Specifies whether or not to indicate both the first and last values on a sparkline. */
        showFirstLast?: boolean;

        /** Specifies whether or not to indicate both the minimum and maximum values on a sparkline. */
        showMinMax?: boolean;

        /** Determines the type of a sparkline. */
        type?: string;

        /** Specifies the data source field that provides values for a sparkline. */
        valueField?: string;

        /** Sets a color for the bars indicating the values greater than a winloss threshold. Available for a sparkline of the winloss type only. */
        winColor?: string;

        /** Specifies a value that serves as a threshold for the sparkline of the winloss type. */
        winlossThreshold?: number;

        /** Specifies the minimum value of the sparkline value axis. */
        minValue?: number;

        /** Specifies the maximum value of the sparkline's value axis. */
        maxValue?: number;
    }
}

declare module DevExpress.viz {
    /** The Bullet widget is useful when you need to compare a single measure to a target value. The widget comprises a horizontal bar indicating the measure and a vertical line indicating the target value. */
    export class dxBullet extends DevExpress.viz.sparklines.BaseSparkline {
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxBulletOptions);
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxBulletOptions);
    }

    /** The Sparkline widget is a compact chart that contains only one series. Owing to their size, sparklines occupy very little space and can be easily collected in a table or embedded straight in text. */
    export class dxSparkline extends DevExpress.viz.sparklines.BaseSparkline {
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxSparklineOptions);
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxSparklineOptions);

        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
}
