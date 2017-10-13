/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.sparklines {

    export interface SparklineTooltip extends viz.core.Tooltip {

        /** @docid basesparklineoptions_tooltip_horizontalalignment */
        horizontalAlignment?: string;

        /** @docid basesparklineoptions_tooltip_verticalalignment */
        verticalAlignment?: string;
    }

    /** @docid basesparkline_options */
    export interface BaseSparklineOptions extends viz.core.BaseWidgetOptions, viz.core.MarginOptions {
        /** @docid_ignore basesparklineoptions_redrawOnResize */
        /** @docid_ignore basesparklineoptions_title */
        /** @docid_ignore basesparklineoptions_export */
        /** @docid_ignore basesparklineoptions_loadingIndicator */

        /** @docid basesparklineoptions_tooltip */
        tooltip?: SparklineTooltip;

        /** @docid basesparklineoptions_ontooltipshown */
        onTooltipShown?: (e: {
            component: BaseSparkline;
            element: Element;
        }) => void;

        /** @docid basesparklineoptions_ontooltiphidden */
        onTooltipHidden?: (e: {
            component: BaseSparkline;
            element: Element;
        }) => void;
    }

    /** @docid_ignore basesparklinemethods_showLoadingIndicator */
    /** @docid_ignore basesparklinemethods_hideLoadingIndicator */

    /** @docid basesparkline */
    export class BaseSparkline extends viz.core.BaseWidget {
    }

    /** @docid dxbullet_options */
    export interface dxBulletOptions extends BaseSparklineOptions {
        /** @docid dxbulletoptions_color */
        color?: string;

        /** @docid dxbulletoptions_endscalevalue */
        endScaleValue?: number;

        /** @docid dxbulletoptions_showtarget */
        showTarget?: boolean;

        /** @docid dxbulletoptions_showzerolevel */
        showZeroLevel?: boolean;

        /** @docid dxbulletoptions_startscalevalue */
        startScaleValue?: number;

        /** @docid dxbulletoptions_target */
        target?: number;

        /** @docid dxbulletoptions_targetcolor */
        targetColor?: string;

        /** @docid dxbulletoptions_targetwidth */
        targetWidth?: number;

        /** @docid dxbulletoptions_value */
        value?: number;
    }

    /** @docid dxsparkline_options */
    export interface dxSparklineOptions extends BaseSparklineOptions {
        /** @docid dxsparklineoptions_argumentfield */
        argumentField?: string;

        /** @docid dxsparklineoptions_barnegativecolor */
        barNegativeColor?: string;

        /** @docid dxsparklineoptions_barpositivecolor */
        barPositiveColor?: string;

        /** @docid dxsparklineoptions_datasource */
        dataSource?: any;

        /** @docid dxsparklineoptions_firstlastcolor */
        firstLastColor?: string;

        /** @docid dxsparklineoptions_ignoreemptypoints */
        ignoreEmptyPoints?: boolean;

        /** @docid dxsparklineoptions_linecolor */
        lineColor?: string;

        /** @docid dxsparklineoptions_linewidth */
        lineWidth?: number;

        /** @docid dxsparklineoptions_losscolor */
        lossColor?: string;

        /** @docid dxsparklineoptions_maxcolor */
        maxColor?: string;

        /** @docid dxsparklineoptions_mincolor */
        minColor?: string;

        /** @docid dxsparklineoptions_pointcolor */
        pointColor?: string;

        /** @docid dxsparklineoptions_pointsize */
        pointSize?: number;

        /** @docid dxsparklineoptions_pointsymbol */
        pointSymbol?: string;

        /** @docid dxsparklineoptions_showfirstlast */
        showFirstLast?: boolean;

        /** @docid dxsparklineoptions_showminmax */
        showMinMax?: boolean;

        /** @docid dxsparklineoptions_type */
        type?: string;

        /** @docid dxsparklineoptions_valuefield */
        valueField?: string;

        /** @docid dxsparklineoptions_wincolor */
        winColor?: string;

        /** @docid dxsparklineoptions_winlossthreshold */
        winlossThreshold?: number;

        /** @docid dxsparklineoptions_minvalue*/
        minValue?: number;

        /** @docid dxsparklineoptions_maxvalue */
        maxValue?: number;
    }
}

declare module DevExpress.viz {
    /** @docid dxbullet */
    export class dxBullet extends DevExpress.viz.sparklines.BaseSparkline {
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxBulletOptions);
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxBulletOptions);
    }

    /** @docid dxsparkline */
    export class dxSparkline extends DevExpress.viz.sparklines.BaseSparkline {
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxSparklineOptions);
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxSparklineOptions);

        /** @docid dxsparklinemethods_getdatasource */
        getDataSource(): DevExpress.data.DataSource;
    }
}
