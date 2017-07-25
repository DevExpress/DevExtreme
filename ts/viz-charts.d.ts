/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.charts {

    // Chart Elements

    /** @docid baseSeriesObject*/
    export interface BaseSeries {
        /** @docid baseSeriesObjectFields_fullstate */
        fullState: number;

        /** @docid baseSeriesObjectFields_type */
        type: string;

        /** @docid baseSeriesObjectmethods_clearselection */
        clearSelection(): void;

        /** @docid baseSeriesObjectmethods_getcolor */
        getColor(): string;

        /** @docid baseSeriesObjectmethods_getpointsbyarg */
        getPointsByArg(pointArg: any): Array<BasePoint>;

        /** @docid baseSeriesObjectmethods_getpointbypos */
        getPointByPos(positionIndex: number): Object;

        /** @docid baseSeriesObjectmethods_select */
        select(): void;

        /** @docid baseSeriesObjectmethods_selectpoint */
        selectPoint(point: BasePoint): void;

        /** @docid baseSeriesObjectmethods_deselectpoint */
        deselectPoint(point: BasePoint): void;

        /** @docid baseSeriesObjectmethods_getallpoints */
        getAllPoints(): Array<BasePoint>;

        /** @docid baseSeriesObjectmethods_getvisiblepoints */
        getVisiblePoints(): Array<BasePoint>;

        /** @docid baseSeriesObjectFields_name */
        name: any;

        /** @docid baseSeriesObjectFields_tag */
        tag: any;

        /** @docid baseSeriesObjectmethods_hide */
        hide(): void;

        /** @docid baseSeriesObjectmethods_isHovered */
        isHovered(): boolean;

        /** @docid baseSeriesObjectmethods_isSelected */
        isSelected(): boolean;

        /** @docid baseSeriesObjectmethods_isvisible */
        isVisible(): boolean;

        /** @docid baseSeriesObjectmethods_show */
        show(): void;
    }

    /** @docid basePointObject */
    export interface BasePoint {
        /** @docid basePointObjectFields_fullstate */
        fullState: number;

        /** @docid basePointObjectFields_originalArgument */
        originalArgument: any;

        /** @docid basePointObjectFields_originalValue */
        originalValue: any;

        /** @docid basePointObjectFields_tag */
        tag: any;

        /** @docid basePointObjectmethods_clearselection */
        clearSelection(): void;

        /** @docid basePointObjectmethods_getcolor */
        getColor(): string;

        /** @docid basePointObjectmethods_hideTooltip */
        hideTooltip(): void;

        /** @docid basePointObjectmethods_isHovered */
        isHovered(): boolean;

        /** @docid basePointObjectmethods_isSelected */
        isSelected(): boolean;

        /** @docid basePointObjectmethods_select */
        select(): void;

        /** @docid basePointObjectmethods_showTooltip */
        showTooltip(): void;

        /** @docid basePointObjectmethods_getlabel */
        getLabel(): any;

        /** @docid basePointObjectFields_series */
        series: BaseSeries;
    }

    /** @docid chartSeriesObject */
    export interface ChartSeries extends BaseSeries {
        /** @docid chartSeriesObjectFields_pane */
        pane: string;

        /** @docid chartSeriesObjectFields_axis */
        axis: string;

        selectPoint(point: ChartPoint): void;
        deselectPoint(point: ChartPoint): void;
        getAllPoints(): Array<ChartPoint>;
        getVisiblePoints(): Array<ChartPoint>;
    }

    /** @docid chartPointObject */
    export interface ChartPoint extends BasePoint {
        /** @docid chartPointObjectFields_originalCloseValue */
        originalCloseValue: any;

        /** @docid chartPointObjectFields_originalHighValue */
        originalHighValue: any;

        /** @docid chartPointObjectFields_originalLowValue */
        originalLowValue: any;

        /** @docid chartPointObjectFields_originalMinValue */
        originalMinValue: any;

        /** @docid chartPointObjectFields_originalOpenValue */
        originalOpenValue: any;

        /** @docid chartPointObjectFields_size */
        size: any;

        /** @docid chartPointObjectmethods_getboundingrect */
        getBoundingRect(): { x: number; y: number; width: number; height: number; };

        series: ChartSeries;
    }

    /** @docid baseLabelObject */
    export interface Label {
        /** @docid baseLabelObjectmethods_getboundingrect*/
        getBoundingRect(): { x: number; y: number; width: number; height: number; };

        /** @docid baseLabelObjectmethods_hide */
        hide(): void;

        /** @docid baseLabelObjectmethods_show */
        show(): void;
    }

    export interface PieSeries extends BaseSeries {
        selectPoint(point: PiePoint): void;
        deselectPoint(point: PiePoint): void;
        getAllPoints(): Array<PiePoint>;
        getVisiblePoints(): Array<PiePoint>;
    }

    /** @docid piePointObject */
    export interface PiePoint extends BasePoint {
        /** @docid piePointObjectFields_percent */
        percent: any;

        /** @docid piePointObjectmethods_isvisible */
        isVisible(): boolean;

        /** @docid piePointObjectmethods_show */
        show(): void;

        /** @docid piePointObjectmethods_hide */
        hide(): void;

        series: PieSeries;
    }

    /** @docid polarChartSeriesObject */
    export interface PolarSeries extends BaseSeries {
        /** @docid polarChartSeriesObjectFields_axis */
        axis: string;

        selectPoint(point: PolarPoint): void;
        deselectPoint(point: PolarPoint): void;
        getAllPoints(): Array<PolarPoint>;
        getVisiblePoints(): Array<PolarPoint>;
    }

    /** @docid polarPointObject */
    export interface PolarPoint extends BasePoint {
        /** @docid_ignore polarPointObjectmethods_getboundingrect */

        series: PolarSeries;
    }

    export interface Strip {
        /**
          * @docid dxchartoptions_argumentaxis_strips_color
          * @docid dxchartoptions_valueaxis_strips_color
          * @docid dxpolarchartoptions_argumentaxis_strips_color
          * @docid dxpolarchartoptions_valueaxis_strips_color
          */
        color?: string;

        /**
          * @docid dxchartoptions_argumentaxis_strips_label
          * @docid dxchartoptions_valueaxis_strips_label
          * @docid dxpolarchartoptions_argumentaxis_strips_label
          * @docid dxpolarchartoptions_valueaxis_strips_label
          */
        label?: {

            /**
              * @docid dxchartoptions_argumentaxis_strips_label_text
              * @docid dxchartoptions_valueaxis_strips_label_text
              * @docid dxpolarchartoptions_argumentaxis_strips_label_text
              * @docid dxpolarchartoptions_valueaxis_strips_label_text
              */
            text?: string;
        };

        /**
          * @docid dxchartoptions_argumentaxis_strips_startvalue
          * @docid dxchartoptions_valueaxis_strips_startvalue
          * @docid dxpolarchartoptions_argumentaxis_strips_startvalue
          * @docid dxpolarchartoptions_valueaxis_strips_startvalue
          */
        startValue?: any;

        /**
          * @docid dxchartoptions_argumentaxis_strips_endvalue
          * @docid dxchartoptions_valueaxis_strips_endvalue
          * @docid dxpolarchartoptions_argumentaxis_strips_endvalue
          * @docid dxpolarchartoptions_valueaxis_strips_endvalue
          */
        endValue?: any;
    }


    // Series

    export interface BaseSeriesConfigLabel {
        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_argumentFormat
        * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_argumentFormat
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_argumentFormat
        */
        argumentFormat?: any;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_argumentprecision
        * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_argumentprecision
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_argumentprecision
        */
        argumentPrecision?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_backgroundcolor
        * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_backgroundcolor
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_backgroundcolor
        */
        backgroundColor?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_border
        * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_border
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border
        */
        border?: viz.core.DashedBorder;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_connector
        * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_connector
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector
        */
        connector?: {

            /**
            * @docid dxChartSeriesTypes_CommonSeries_label_connector_color
            * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_label_connector_visible
            * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_visible
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_visible
            */
            visible?: boolean;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_label_connector_width
            * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_connector_width
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_connector_width
            */
            width?: number;
        };

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_customizetext
          * @docid dxChartSeriesTypes_areaseries_label_customizetext
          * @docid dxChartSeriesTypes_barseries_label_customizetext
          * @docid dxChartSeriesTypes_bubbleseries_label_customizetext
          * @docid dxChartSeriesTypes_candlestickseries_label_customizetext
          * @docid dxChartSeriesTypes_fullstackedareaseries_label_customizetext
          * @docid dxChartSeriesTypes_fullstackedbarseries_label_customizetext
          * @docid dxChartSeriesTypes_fullstackedlineseries_label_customizetext
          * @docid dxChartSeriesTypes_fullstackedsplineareaseries_label_customizetext
          * @docid dxChartSeriesTypes_fullstackedsplineseries_label_customizetext
          * @docid dxChartSeriesTypes_lineseries_label_customizetext
          * @docid dxChartSeriesTypes_rangeareaseries_label_customizetext
          * @docid dxChartSeriesTypes_rangebarseries_label_customizetext
          * @docid dxChartSeriesTypes_scatterseries_label_customizetext
          * @docid dxChartSeriesTypes_splineareaseries_label_customizetext
          * @docid dxChartSeriesTypes_splineseries_label_customizetext
          * @docid dxChartSeriesTypes_stackedareaseries_label_customizetext
          * @docid dxChartSeriesTypes_stackedbarseries_label_customizetext
          * @docid dxChartSeriesTypes_stackedlineseries_label_customizetext
          * @docid dxChartSeriesTypes_stackedsplineareaseries_label_customizetext
          * @docid dxChartSeriesTypes_stackedsplineseries_label_customizetext
          * @docid dxChartSeriesTypes_stepareaseries_label_customizetext
          * @docid dxChartSeriesTypes_steplineseries_label_customizetext
          * @docid dxChartSeriesTypes_stockseries_label_customizetext
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_customizetext
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_customizetext
          */
        customizeText?: (pointInfo: Object) => string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_font
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_font
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_font
          */
        font?: viz.core.Font;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_format
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_format
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_format
          */
        format?: any;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_position
          * @docid dxChartSeriesTypes_fullstackedbarseries_label_position
          * @docid dxChartSeriesTypes_stackedbarseries_label_position
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_position
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_position
          * @docid dxPolarChartSeriesTypes_stackedbarpolarseries_label_position
          */
        position?: string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_precision
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_precision
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_precision
          */
        precision?: number;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_rotationangle
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_rotationangle
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_rotationangle
          */
        rotationAngle?: number;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_label_visible
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_visible
          */
        visible?: boolean;
    }

    export interface SeriesConfigLabel extends BaseSeriesConfigLabel {
        /**
         * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_showforzerovalues
         * @docid dxChartSeriesTypes_CommonSeries_label_showforzerovalues
         */
        showForZeroValues?: boolean;
    }

    export interface ChartSeriesConfigLabel extends SeriesConfigLabel {
        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_alignment
        */
        alignment?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_horizontaloffset
        */
        horizontalOffset?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label_verticaloffset
        */
        verticalOffset?: number;

        /** * @docid dxChartSeriesTypes_CommonSeries_label_percentprecision */
        percentPrecision?: number;
    }

    export interface BaseCommonSeriesConfig {
        /**
          * @docid dxChartSeriesTypes_CommonSeries_argumentfield
          * @docid dxChartSeriesTypes_candlestickseries_argumentfield
          * @docid dxChartSeriesTypes_stockseries_argumentfield
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_argumentfield
          */
        argumentField?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_axis
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_axis
        */
        axis?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_label
        * @docid dxChartSeriesTypes_areaseries_label
        * @docid dxChartSeriesTypes_barseries_label
        * @docid dxChartSeriesTypes_bubbleseries_label
        * @docid dxChartSeriesTypes_candlestickseries_label
        * @docid dxChartSeriesTypes_fullstackedareaseries_label
        * @docid dxChartSeriesTypes_fullstackedbarseries_label
        * @docid dxChartSeriesTypes_fullstackedlineseries_label
        * @docid dxChartSeriesTypes_fullstackedsplineareaseries_label
        * @docid dxChartSeriesTypes_fullstackedsplineseries_label
        * @docid dxChartSeriesTypes_lineseries_label
        * @docid dxChartSeriesTypes_rangeareaseries_label
        * @docid dxChartSeriesTypes_rangebarseries_label
        * @docid dxChartSeriesTypes_scatterseries_label
        * @docid dxChartSeriesTypes_splineareaseries_label
        * @docid dxChartSeriesTypes_splineseries_label
        * @docid dxChartSeriesTypes_stackedareaseries_label
        * @docid dxChartSeriesTypes_stackedbarseries_label
        * @docid dxChartSeriesTypes_stackedlineseries_label
        * @docid dxChartSeriesTypes_stackedsplineareaseries_label
        * @docid dxChartSeriesTypes_stackedsplineseries_label
        * @docid dxChartSeriesTypes_stepareaseries_label
        * @docid dxChartSeriesTypes_steplineseries_label
        * @docid dxChartSeriesTypes_stockseries_label
        */
        label?: ChartSeriesConfigLabel;
        /**
        * @docid dxChartSeriesTypes_CommonSeries_border
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_border
        * @docid dxChartSeriesTypes_stepareaseries_border
        */
        border?: viz.core.DashedBorder;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_color
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_color
        */
        color?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_dashstyle
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_dashstyle
        */
        dashStyle?: string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_hovermode
          * @docid dxChartSeriesTypes_areaseries_hovermode
          * @docid dxChartSeriesTypes_barseries_hovermode
          * @docid dxChartSeriesTypes_bubbleseries_hovermode
          * @docid dxChartSeriesTypes_candlestickseries_hovermode
          * @docid dxChartSeriesTypes_fullstackedareaseries_hovermode
          * @docid dxChartSeriesTypes_fullstackedbarseries_hovermode
          * @docid dxChartSeriesTypes_fullstackedlineseries_hovermode
          * @docid dxChartSeriesTypes_fullstackedsplineareaseries_hovermode
          * @docid dxChartSeriesTypes_fullstackedsplineseries_hovermode
          * @docid dxChartSeriesTypes_lineseries_hovermode
          * @docid dxChartSeriesTypes_rangeareaseries_hovermode
          * @docid dxChartSeriesTypes_rangebarseries_hovermode
          * @docid dxChartSeriesTypes_splineareaseries_hovermode
          * @docid dxChartSeriesTypes_splineseries_hovermode
          * @docid dxChartSeriesTypes_stackedareaseries_hovermode
          * @docid dxChartSeriesTypes_stackedbarseries_hovermode
          * @docid dxChartSeriesTypes_stackedlineseries_hovermode
          * @docid dxChartSeriesTypes_stackedsplineareaseries_hovermode
          * @docid dxChartSeriesTypes_stackedsplineseries_hovermode
          * @docid dxChartSeriesTypes_stepareaseries_hovermode
          * @docid dxChartSeriesTypes_steplineseries_hovermode
          * @docid dxChartSeriesTypes_stockseries_hovermode
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hovermode
          * @docid dxPolarChartSeriesTypes_areapolarseries_hovermode
          * @docid dxPolarChartSeriesTypes_barpolarseries_hovermode
          * @docid dxPolarChartSeriesTypes_linepolarseries_hovermode
          * @docid dxPolarChartSeriesTypes_stackedbarpolarseries_hovermode
          */
        hoverMode?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_hoverstyle
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle
        * @docid dxChartSeriesTypes_stepareaseries_hoverstyle
        * @docid dxChartSeriesTypes_candlestickseries_hoverstyle
        */
        hoverStyle?: {

            /**
            * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_border
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border
            * @docid dxChartSeriesTypes_stepareaseries_hoverstyle_border
            */
            border?: viz.core.DashedBorder;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_dashstyle
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_dashstyle
            */
            dashStyle?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_hatching
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching
            * @docid dxChartSeriesTypes_candlestickseries_hoverstyle_hatching
            */
            hatching?: viz.core.Hatching;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_width
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_width
            */
            width?: number;
        };

        /**
        * @docid dxChartSeriesTypes_CommonSeries_ignoreemptypoints
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_ignoreemptypoints
        */
        ignoreEmptyPoints?: boolean;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_maxlabelcount
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_maxlabelcount
        */
        maxLabelCount?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_minbarsize
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_minbarsize
        */
        minBarSize?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_opacity
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_opacity
        */
        opacity?: number;

        /**
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionmode
          * @docid dxPolarChartSeriesTypes_areapolarseries_selectionmode
          * @docid dxPolarChartSeriesTypes_barpolarseries_selectionmode
          * @docid dxPolarChartSeriesTypes_linepolarseries_selectionmode
          * @docid dxPolarChartSeriesTypes_stackedbarpolarseries_selectionmode
          * @docid dxChartSeriesTypes_CommonSeries_selectionmode
          * @docid dxChartSeriesTypes_areaseries_selectionmode
          * @docid dxChartSeriesTypes_barseries_selectionmode
          * @docid dxChartSeriesTypes_bubbleseries_selectionmode
          * @docid dxChartSeriesTypes_candlestickseries_selectionmode
          * @docid dxChartSeriesTypes_fullstackedareaseries_selectionmode
          * @docid dxChartSeriesTypes_fullstackedbarseries_selectionmode
          * @docid dxChartSeriesTypes_fullstackedlineseries_selectionmode
          * @docid dxChartSeriesTypes_fullstackedsplineareaseries_selectionmode
          * @docid dxChartSeriesTypes_fullstackedsplineseries_selectionmode
          * @docid dxChartSeriesTypes_lineseries_selectionmode
          * @docid dxChartSeriesTypes_rangeareaseries_selectionmode
          * @docid dxChartSeriesTypes_rangebarseries_selectionmode
          * @docid dxChartSeriesTypes_splineareaseries_selectionmode
          * @docid dxChartSeriesTypes_splineseries_selectionmode
          * @docid dxChartSeriesTypes_stackedareaseries_selectionmode
          * @docid dxChartSeriesTypes_stackedbarseries_selectionmode
          * @docid dxChartSeriesTypes_stackedlineseries_selectionmode
          * @docid dxChartSeriesTypes_stackedsplineareaseries_selectionmode
          * @docid dxChartSeriesTypes_stackedsplineseries_selectionmode
          * @docid dxChartSeriesTypes_stepareaseries_selectionmode
          * @docid dxChartSeriesTypes_steplineseries_selectionmode
          * @docid dxChartSeriesTypes_stockseries_selectionmode
          */
        selectionMode?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_selectionstyle
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle
        * @docid dxChartSeriesTypes_stepareaseries_selectionStyle
        * @docid dxChartSeriesTypes_candlestickseries_selectionstyle
        */
        selectionStyle?: {

            /**
            * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_border
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border
            * @docid dxChartSeriesTypes_stepareaseries_selectionStyle_border
            */
            border?: viz.core.DashedBorder;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_dashstyle
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_dashstyle
            */
            dashStyle?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_hatching
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching
            * @docid dxChartSeriesTypes_candlestickseries_selectionstyle_hatching
            */
            hatching?: viz.core.Hatching;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_width
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_width
            */
            width?: number;
        };

        /**
        * @docid dxChartSeriesTypes_CommonSeries_showinlegend
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_showinlegend
        */
        showInLegend?: boolean;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_stack
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_stack
        */
        stack?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_tagfield
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_tagfield
        */
        tagField?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_valuefield
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valuefield
        */
        valueField?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_visible
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_visible
        */
        visible?: boolean;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_width
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_width
        */
        width?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar
        */
        valueErrorBar?: {
            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_displaymode
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_displaymode
            */
            displayMode?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_lowvaluefield
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_lowvaluefield
            */
            lowValueField?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_highvaluefield
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_highvaluefield
            */
            highValueField?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_type
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_type
            */
            type?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_value
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_value
            */
            value?: number;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_opacity
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_opacity
            */
            opacity?: number;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_edgelength
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_edgelength
            */
            edgeLength?: number;
            /**
            * @docid dxChartSeriesTypes_CommonSeries_valueerrorbar_linewidth
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_valueerrorbar_linewidth
            */
            lineWidth?: number;
        };
    }

    export interface CommonPointOptions {
        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_border
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border
        */
        border?: viz.core.Border;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_color
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_color
        */
        color?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_hovermode
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hovermode
        */
        hoverMode?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle
        */
        hoverStyle?: {

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_border
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border
            */
            border?: viz.core.Border;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_size
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_size
            */
            size?: number;
        };

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_selectionmode
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionmode
        */
        selectionMode?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle
        */
        selectionStyle?: {

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_border
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border
            */
            border?: viz.core.Border;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_color
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_color
            */
            color?: string;

            /**
            * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_size
            * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_size
            */
            size?: number;
        };

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_size
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_size
        */
        size?: number;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point_symbol
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_symbol
        */
        symbol?: string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_point_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_visible
          * @docid dxChartSeriesTypes_areaseries_point_visible
          * @docid dxChartSeriesTypes_fullstackedareaseries_point_visible
          * @docid dxChartSeriesTypes_fullstackedsplineareaseries_point_visible
          * @docid dxChartSeriesTypes_rangeareaseries_point_visible
          * @docid dxChartSeriesTypes_splineareaseries_point_visible
          * @docid dxChartSeriesTypes_stackedareaseries_point_visible
          * @docid dxChartSeriesTypes_stackedsplineareaseries_point_visible
          * @docid dxChartSeriesTypes_stepareaseries_point_visible
          * @docid dxPolarChartSeriesTypes_areapolarseries_point_visible
          */
        visible?: boolean;
    }

    export interface ChartCommonPointOptions extends CommonPointOptions {
        /** @docid dxChartSeriesTypes_CommonSeries_point_image */
        image?: {

            /** @docid dxChartSeriesTypes_CommonSeries_point_image_height */
            height?: any;

            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_height_rangemaxpoint */
            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_height_rangeminpoint */

            /** @docid dxChartSeriesTypes_CommonSeries_point_image_url */
            url?: any;

            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_url_rangemaxpoint */
            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_url_rangeminpoint */

            /** @docid dxChartSeriesTypes_CommonSeries_point_image_width */
            width?: any;

            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_width_rangemaxpoint */
            /** @docid_ignore dxChartSeriesTypes_CommonSeries_point_image_width_rangeminpoint */
        };
    }

    export interface PolarCommonPointOptions extends CommonPointOptions {
        /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image */
        image?: {

            /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_height */
            height?: number;

            /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_url */
            url?: string;

            /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_image_width */
            width?: number;
        };
    }

    /** @docid dxChartSeriesTypes_CommonSeries */
    export interface CommonSeriesConfig extends BaseCommonSeriesConfig {

        /** @docid dxChartSeriesTypes_CommonSeries_closevaluefield */
        closeValueField?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_cornerradius */
        cornerRadius?: number;

        /** @docid dxChartSeriesTypes_CommonSeries_highvaluefield */
        highValueField?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_innercolor */
        innerColor?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_lowvaluefield */
        lowValueField?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_openvaluefield */
        openValueField?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_pane */
        pane?: string;

        /**
        * @docid dxChartSeriesTypes_CommonSeries_point
        * @docid dxChartSeriesTypes_fullstackedareaseries_point
        * @docid dxChartSeriesTypes_fullstackedsplineareaseries_point
        * @docid dxChartSeriesTypes_rangeareaseries_point
        * @docid dxChartSeriesTypes_splineareaseries_point
        * @docid dxChartSeriesTypes_stackedareaseries_point
        * @docid dxChartSeriesTypes_stackedsplineareaseries_point
        * @docid dxChartSeriesTypes_stepareaseries_point
        * @docid dxChartSeriesTypes_areaseries_point
        */
        point?: ChartCommonPointOptions;

        /** @docid dxChartSeriesTypes_CommonSeries_rangevalue1field */
        rangeValue1Field?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_rangevalue2field */
        rangeValue2Field?: string;

        /** @docid dxChartSeriesTypes_CommonSeries_reduction */
        reduction?: {

            /** @docid dxChartSeriesTypes_CommonSeries_reduction_color */
            color?: string;

            /** @docid dxChartSeriesTypes_CommonSeries_reduction_level */
            level?: string;
        };

        /** @docid dxChartSeriesTypes_CommonSeries_sizefield */
        sizeField?: string;
    }

    export interface CommonSeriesSettings extends CommonSeriesConfig {
        /** @docid dxchartoptions_commonseriessettings_area */
        area?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_bar */
        bar?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_bubble */
        bubble?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_candlestick */
        candlestick?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_fullstackedarea */
        fullstackedarea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_fullstackedsplinearea */
        fullstackedsplinearea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_fullstackedbar */
        fullstackedbar?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_fullstackedline */
        fullstackedline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_fullstackedspline */
        fullstackedspline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_line */
        line?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_rangearea */
        rangearea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_rangebar */
        rangebar?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_scatter */
        scatter?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_spline */
        spline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_splinearea */
        splinearea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stackedarea */
        stackedarea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stackedsplinearea */
        stackedsplinearea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stackedbar */
        stackedbar?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stackedline */
        stackedline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stackedspline */
        stackedspline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_steparea */
        steparea?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stepline */
        stepline?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_stock */
        stock?: CommonSeriesConfig;

        /** @docid dxchartoptions_commonseriessettings_type */
        type?: string;
    }

    export interface SeriesConfig extends CommonSeriesConfig {
        /** @docid dxchartoptions_series_name */
        name?: string;

        /** @docid dxchartoptions_series_tag */
        tag?: any;

        /** @docid dxchartoptions_series_type */
        type?: string;
    }



    /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries */
    export interface CommonPolarSeriesConfig extends BaseCommonSeriesConfig {
        /** @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_closed */
        closed?: boolean;

        /**
         * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label
         * @docid dxPolarChartSeriesTypes_stackedbarpolarseries_label
         */
        label?: SeriesConfigLabel;

        /**
        * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point
        * @docid dxPolarChartSeriesTypes_areapolarseries_point
        */
        point?: PolarCommonPointOptions;
    }

    export interface CommonPolarSeriesSettings extends CommonPolarSeriesConfig {
        /** @docid dxpolarchartoptions_commonseriessettings_area */
        area?: CommonPolarSeriesConfig;

        /** @docid dxpolarchartoptions_commonseriessettings_bar */
        bar?: CommonPolarSeriesConfig;

        /** @docid dxpolarchartoptions_commonseriessettings_line */
        line?: CommonPolarSeriesConfig;

        /** @docid dxpolarchartoptions_commonseriessettings_scatter */
        scatter?: CommonPolarSeriesConfig;

        /** @docid dxpolarchartoptions_commonseriessettings_stackedbar */
        stackedbar?: CommonPolarSeriesConfig;

        /** @docid dxpolarchartoptions_commonseriessettings_type */
        type?: string;
    }

    export interface PolarSeriesConfig extends CommonPolarSeriesConfig {
        /** @docid dxpolarchartoptions_series_name */
        name?: string;

        /** @docid dxpolarchartoptions_series_tag */
        tag?: any;

        /** @docid dxpolarchartoptions_series_type */
        type?: string;
    }

    /** @docid_ignore dxChartSeriesTypes_areaseries */
    /** @docid_ignore dxChartSeriesTypes_barseries */
    /** @docid_ignore dxChartSeriesTypes_bubbleseries */
    /** @docid_ignore dxChartSeriesTypes_candlestickseries */
    /** @docid_ignore dxChartSeriesTypes_fullstackedareaseries */
    /** @docid_ignore dxChartSeriesTypes_fullstackedbarseries */
    /** @docid_ignore dxChartSeriesTypes_fullstackedlineseries */
    /** @docid_ignore dxChartSeriesTypes_fullstackedsplineareaseries */
    /** @docid_ignore dxChartSeriesTypes_fullstackedsplineseries */
    /** @docid_ignore dxChartSeriesTypes_lineseries */
    /** @docid_ignore dxChartSeriesTypes_rangeareaseries */
    /** @docid_ignore dxChartSeriesTypes_rangebarseries */
    /** @docid_ignore dxChartSeriesTypes_scatterseries */
    /** @docid_ignore dxChartSeriesTypes_splineareaseries */
    /** @docid_ignore dxChartSeriesTypes_splineseries */
    /** @docid_ignore dxChartSeriesTypes_stackedareaseries */
    /** @docid_ignore dxChartSeriesTypes_stackedbarseries */
    /** @docid_ignore dxChartSeriesTypes_stackedlineseries */
    /** @docid_ignore dxChartSeriesTypes_stackedsplineareaseries */
    /** @docid_ignore dxChartSeriesTypes_stackedsplineseries */
    /** @docid_ignore dxChartSeriesTypes_stepareaseries */
    /** @docid_ignore dxChartSeriesTypes_steplineseries */
    /** @docid_ignore dxChartSeriesTypes_stockseries */
    /** @docid_ignore dxPolarChartSeriesTypes_areapolarseries */
    /** @docid_ignore dxPolarChartSeriesTypes_barpolarseries */
    /** @docid_ignore dxPolarChartSeriesTypes_linepolarseries */
    /** @docid_ignore dxPolarChartSeriesTypes_scatterpolarseries */
    /** @docid_ignore dxPolarChartSeriesTypes_stackedbarpolarseries */

    export interface PieSeriesConfigLabel extends BaseSeriesConfigLabel {
        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_radialoffset */
        radialOffset?: number;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_percentprecision */
        percentPrecision?: number;
    }

    /** @docid dxPieChartSeriesTypes_CommonPieChartSeries */
    export interface CommonPieSeriesConfig {
        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_argumentfield */
        argumentField?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_argumentType */
        argumentType?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_border */
        border?: viz.core.DashedBorder;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_color */
        color?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_hovermode */
        hoverMode?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle */
        hoverStyle?: {

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border */
            border?: viz.core.DashedBorder;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_color */
            color?: string;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching */
            hatching?: viz.core.Hatching;
        };

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_innerradius */
        innerRadius?: number;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_label */
        label?: PieSeriesConfigLabel;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_maxlabelcount */
        maxLabelCount?: number;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_minsegmentsize */
        minSegmentSize?: number;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_segmentsdirection */
        segmentsDirection?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionmode */
        selectionMode?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle */
        selectionStyle?: {

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border */
            border?: viz.core.DashedBorder;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_color */
            color?: string;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching */
            hatching?: viz.core.Hatching;
        };

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping */
        smallValuesGrouping?: {

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_groupname */
            groupName?: string;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_mode */
            mode?: string;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_threshold */
            threshold?: number;

            /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_smallvaluesgrouping_topcount */
            topCount?: number;
        };

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_startangle */
        startAngle?: number;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_tagfield */
        tagField?: string;

        /** @docid dxPieChartSeriesTypes_CommonPieChartSeries_valuefield */
        valueField?: string;
    }

    export interface CommonPieSeriesSettings extends CommonPieSeriesConfig {
        /** @docid dxpiechartoptions_commonseriessettings_type */
        type?: string;
    }

    export interface PieSeriesConfig extends CommonPieSeriesConfig {
        /** @docid dxpiechartoptions_series_type */
        type?: string;

        /** @docid dxpiechartoptions_series_name */
        name?: string;

        /** @docid dxpiechartoptions_series_tag */
        tag?: any;
    }

    /** @docid_ignore dxPieChartSeriesTypes_PieSeries */
    /** @docid_ignore dxPieChartSeriesTypes_DoughnutSeries */

    export interface SeriesTemplate {
        /**
          * @docid dxchartoptions_seriestemplate_customizeSeries
          * @docid dxrangeselectoroptions_chart_seriestemplate_customizeSeries
          */
        customizeSeries?: (seriesName: any) => SeriesConfig;

        /**
          * @docid dxchartoptions_seriestemplate_nameField
          * @docid dxrangeselectoroptions_chart_seriestemplate_nameField
          */
        nameField?: string;
    }

    export interface PolarSeriesTemplate {
        /** @docid dxpolarchartoptions_seriestemplate_customizeSeries */
        customizeSeries?: (seriesName: any) => PolarSeriesConfig;

        /** @docid dxpolarchartoptions_seriestemplate_nameField */
        nameField?: string;
    }

    export interface PieSeriesTemplate {
        /** @docid dxpiechartoptions_seriestemplate_customizeSeries */
        customizeSeries?: (seriesName: any) => PieSeriesConfig;

        /** @docid dxpiechartoptions_seriestemplate_nameField */
        nameField?: string;
    }

    // Axes

    export interface ChartCommonConstantLineLabel {
        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_label_font */
        font?: viz.core.Font;

        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_label_position */
        position?: string;
        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_label_visible */
        visible?: boolean;
    }

    export interface PolarCommonConstantLineLabel {
        /** @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_label_visible */
        visible?: boolean;
        /** @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_label_font */
        font?: viz.core.Font;
    }

    export interface ConstantLineStyle {
        /**
        * @docid dxchartoptions_commonaxissettings_constantlinestyle_color
        * @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_color
        */
        color?: string;

        /**
        * @docid dxchartoptions_commonaxissettings_constantlinestyle_dashstyle
        * @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_dashstyle
        */
        dashStyle?: string;

        /**
        * @docid dxchartoptions_commonaxissettings_constantlinestyle_width
        * @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_width
        */
        width?: number;
    }

    export interface ChartCommonConstantLineStyle extends ConstantLineStyle {
        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_label */
        label?: ChartCommonConstantLineLabel;

        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_paddingleftright */
        paddingLeftRight?: number;

        /** @docid dxchartoptions_commonaxissettings_constantlinestyle_paddingtopbottom */
        paddingTopBottom?: number;
    }

    export interface PolarCommonConstantLineStyle extends ConstantLineStyle {
        /** @docid dxpolarchartoptions_commonaxissettings_constantlinestyle_label */
        label?: PolarCommonConstantLineLabel;
    }

    export interface CommonAxisLabel {
        /**
        * @docid dxchartoptions_commonaxissettings_label_font
        * @docid dxpolarchartoptions_commonaxissettings_label_font
        */
        font?: viz.core.Font;

        /**
        * @docid dxchartoptions_commonaxissettings_label_indentfromaxis
        * @docid dxpolarchartoptions_commonaxissettings_label_indentfromaxis
        */
        indentFromAxis?: number;

        /**
        * @docid dxchartoptions_commonaxissettings_label_visible
        * @docid dxpolarchartoptions_commonaxissettings_label_visible
        */
        visible?: boolean;
    }

    export interface ChartCommonAxisLabel extends CommonAxisLabel {
        /** @docid dxchartoptions_commonaxissettings_label_alignment */
        alignment?: string;

        /** @docid_ignore dxchartoptions_commonaxissettings_label_overlappingBehavior_mode */
        /** @docid_ignore dxchartoptions_commonaxissettings_label_overlappingBehavior_rotationangle */
        /** @docid_ignore dxchartoptions_commonaxissettings_label_overlappingBehavior_staggeringSpacing */
        /** @docid dxchartoptions_commonaxissettings_label_overlappingBehavior */
        overlappingBehavior?: any;
    }

    export interface PolarCommonAxisLabel extends CommonAxisLabel {
        /** @docid dxpolarchartoptions_commonaxissettings_label_overlappingBehavior */
        overlappingBehavior?: string;
    }

    export interface CommonAxisTitle {
        /** @docid dxchartoptions_commonaxissettings_title_font */
        font?: viz.core.Font;

        /** @docid dxchartoptions_commonaxissettings_title_margin */
        margin?: number;
    }

    export interface BaseCommonAxisSettings {
        /**
        * @docid dxchartoptions_commonaxissettings_color
        * @docid dxpolarchartoptions_commonaxissettings_color
        */
        color?: string;

        /**
        * @docid dxchartoptions_commonaxissettings_discreteaxisdivisionMode
        * @docid dxpolarchartoptions_commonaxissettings_discreteaxisdivisionMode
        */
        discreteAxisDivisionMode?: string;

        /**
        * @docid dxchartoptions_commonaxissettings_grid
        * @docid dxpolarchartoptions_commonaxissettings_grid
        */
        grid?: {

            /**
            * @docid dxchartoptions_commonaxissettings_grid_color
            * @docid dxpolarchartoptions_commonaxissettings_grid_color
            */
            color?: string;

            /**
            * @docid dxchartoptions_commonaxissettings_grid_opacity
            * @docid dxpolarchartoptions_commonaxissettings_grid_opacity
            */
            opacity?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_grid_visible
            * @docid dxpolarchartoptions_commonaxissettings_grid_visible
            */
            visible?: boolean;

            /**
            * @docid dxchartoptions_commonaxissettings_grid_width
            * @docid dxpolarchartoptions_commonaxissettings_grid_width
            */
            width?: number;
        };

        /**
        * @docid dxchartoptions_commonaxissettings_minorgrid
        * @docid dxpolarchartoptions_commonaxissettings_minorgrid
        */
        minorGrid?: {

            /**
            * @docid dxchartoptions_commonaxissettings_minorgrid_color
            * @docid dxpolarchartoptions_commonaxissettings_minorgrid_color
            */
            color?: string;

            /**
            * @docid dxchartoptions_commonaxissettings_minorgrid_opacity
            * @docid dxpolarchartoptions_commonaxissettings_minorgrid_opacity
            */
            opacity?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_minorgrid_visible
            * @docid dxpolarchartoptions_commonaxissettings_minorgrid_visible
            */
            visible?: boolean;

            /**
            * @docid dxchartoptions_commonaxissettings_minorgrid_width
            * @docid dxpolarchartoptions_commonaxissettings_minorgrid_width
            */
            width?: number;
        };

        /**
        * @docid dxchartoptions_commonaxissettings_inverted
        * @docid dxpolarchartoptions_commonaxissettings_inverted
        */
        inverted?: boolean;

        /**
        * @docid dxchartoptions_commonaxissettings_opacity
        * @docid dxpolarchartoptions_commonaxissettings_opacity
        */
        opacity?: number;

        /**
        * @docid dxchartoptions_commonaxissettings_setticksatunitbeginning
        * @docid dxpolarchartoptions_commonaxissettings_setticksatunitbeginning
        */
        setTicksAtUnitBeginning?: boolean;

        /**
        * @docid dxchartoptions_commonaxissettings_tick
        * @docid dxpolarchartoptions_commonaxissettings_tick
        */
        tick?: {

            /**
            * @docid dxchartoptions_commonaxissettings_tick_color
            * @docid dxpolarchartoptions_commonaxissettings_tick_color
            */
            color?: string;

            /**
            * @docid dxchartoptions_commonaxissettings_tick_opacity
            * @docid dxpolarchartoptions_commonaxissettings_tick_opacity
            */
            opacity?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_tick_visible
            * @docid dxpolarchartoptions_commonaxissettings_tick_visible
            */
            visible?: boolean;

            /**
            * @docid dxchartoptions_commonaxissettings_tick_width
            * @docid dxpolarchartoptions_commonaxissettings_tick_width
            */
            width?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_tick_length
            * @docid dxpolarchartoptions_commonaxissettings_tick_length
            */
            length?: number;
        };

        /**
        * @docid dxchartoptions_commonaxissettings_minortick
        * @docid dxpolarchartoptions_commonaxissettings_minortick
        */
        minorTick?: {

            /**
            * @docid dxchartoptions_commonaxissettings_minortick_color
            * @docid dxpolarchartoptions_commonaxissettings_minortick_color
            */
            color?: string;

            /**
            * @docid dxchartoptions_commonaxissettings_minortick_opacity
            * @docid dxpolarchartoptions_commonaxissettings_minortick_opacity
            */
            opacity?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_minortick_visible
            * @docid dxpolarchartoptions_commonaxissettings_minortick_visible
            */
            visible?: boolean;

            /**
            * @docid dxchartoptions_commonaxissettings_minortick_width
            * @docid dxpolarchartoptions_commonaxissettings_minortick_width
            */
            width?: number;

            /**
            * @docid dxchartoptions_commonaxissettings_minortick_length
            * @docid dxpolarchartoptions_commonaxissettings_minortick_length
            */
            length?: number;
        };

        /**
        * @docid dxchartoptions_commonaxissettings_visible
        * @docid dxpolarchartoptions_commonaxissettings_visible
        */
        visible?: boolean;

        /**
        * @docid dxchartoptions_commonaxissettings_width
        * @docid dxpolarchartoptions_commonaxissettings_width
        */
        width?: number;
    }

    export interface ChartCommonAxisSettings extends BaseCommonAxisSettings {
        /** @docid dxchartoptions_commonaxissettings_constantlinestyle */
        constantLineStyle?: ChartCommonConstantLineStyle;

        /** @docid dxchartoptions_commonaxissettings_label */
        label?: ChartCommonAxisLabel;

        /** @docid dxchartoptions_commonaxissettings_maxvaluemargin */
        maxValueMargin?: number;

        /** @docid dxchartoptions_commonaxissettings_minvaluemargin */
        minValueMargin?: number;

        /** @docid dxchartoptions_commonaxissettings_placeholdersize */
        placeholderSize?: number;

        /** @docid dxchartoptions_commonaxissettings_stripstyle */
        stripStyle?: {

            /** @docid dxchartoptions_commonaxissettings_stripstyle_label */
            label?: {
                /** @docid dxchartoptions_commonaxissettings_stripstyle_label_font */
                font?: viz.core.Font;

                /** @docid dxchartoptions_commonaxissettings_stripstyle_label_horizontalalignment */
                horizontalAlignment?: string;

                /** @docid dxchartoptions_commonaxissettings_stripstyle_label_verticalalignment */
                verticalAlignment?: string;
            };

            /** @docid dxchartoptions_commonaxissettings_stripstyle_paddingleftright */
            paddingLeftRight?: number;

            /** @docid dxchartoptions_commonaxissettings_stripstyle_paddingtopbottom */
            paddingTopBottom?: number;
        };

        /** @docid dxchartoptions_commonaxissettings_title */
        title?: CommonAxisTitle;

        /** @docid dxchartoptions_commonaxissettings_valuemarginsenabled */
        valueMarginsEnabled?: boolean;
    }

    export interface PolarCommonAxisSettings extends BaseCommonAxisSettings {
        /** @docid dxpolarchartoptions_commonaxissettings_constantlinestyle */
        constantLineStyle?: PolarCommonConstantLineStyle;

        /** @docid dxpolarchartoptions_commonaxissettings_label */
        label?: PolarCommonAxisLabel;

        /** @docid dxpolarchartoptions_commonaxissettings_stripstyle */
        stripStyle?: {

            /** @docid dxpolarchartoptions_commonaxissettings_stripstyle_label */
            label?: {
                /** @docid dxpolarchartoptions_commonaxissettings_stripstyle_label_font */
                font?: viz.core.Font;
            };
        };
    }

    export interface ChartConstantLineLabel extends ChartCommonConstantLineLabel {
        /**
        * @docid dxchartoptions_argumentaxis_constantlinestyle_label_horizontalalignment
        * @docid dxchartoptions_argumentaxis_constantlines_label_horizontalalignment
        * @docid dxchartoptions_valueaxis_constantlinestyle_label_horizontalalignment
        * @docid dxchartoptions_valueaxis_constantlines_label_horizontalalignment
        */
        horizontalAlignment?: string;

        /**
        * @docid dxchartoptions_argumentaxis_constantlinestyle_label_verticalalignment
        * @docid dxchartoptions_argumentaxis_constantlines_label_verticalalignment
        * @docid dxchartoptions_valueaxis_constantlinestyle_label_verticalalignment
        * @docid dxchartoptions_valueaxis_constantlines_label_verticalalignment
        */
        verticalAlignment?: string;

        /**
        * @docid dxchartoptions_argumentaxis_constantlines_label_text
        * @docid dxchartoptions_valueaxis_constantlines_label_text
        */
        text?: string;
    }

    export interface PolarConstantLineLabel extends PolarCommonConstantLineLabel {
        /**
        * @docid dxpolarchartoptions_argumentaxis_constantlines_label_text
        * @docid dxpolarchartoptions_valueaxis_constantlines_label_text
        */
        text?: string;
    }

    export interface AxisLabel {
        /**
        * @docid dxchartoptions_argumentaxis_label_customizehint
        * @docid dxchartoptions_valueaxis_label_customizehint
        * @docid dxpolarchartoptions_argumentaxis_label_customizehint
        * @docid dxpolarchartoptions_valueaxis_label_customizehint
        */
        customizeHint?: (argument: { value: any; valueText: string }) => string;

        /**
        * @docid dxchartoptions_argumentaxis_label_customizetext
        * @docid dxchartoptions_valueaxis_label_customizetext
        * @docid dxpolarchartoptions_argumentaxis_label_customizetext
        * @docid dxpolarchartoptions_valueaxis_label_customizetext
        */
        customizeText?: (argument: { value: any; valueText: string }) => string;

        /**
        * @docid dxchartoptions_argumentaxis_label_format
        * @docid dxchartoptions_valueaxis_label_format
        * @docid dxpolarchartoptions_argumentaxis_label_format
        * @docid dxpolarchartoptions_valueaxis_label_format
        */
        format?: any;

        /**
        * @docid dxchartoptions_argumentaxis_label_precision
        * @docid dxchartoptions_valueaxis_label_precision
        * @docid dxpolarchartoptions_argumentaxis_label_precision
        * @docid dxpolarchartoptions_valueaxis_label_precision
        */
        precision?: number;
    }

    export interface ChartAxisLabel extends ChartCommonAxisLabel, AxisLabel { }

    export interface PolarAxisLabel extends PolarCommonAxisLabel, AxisLabel { }

    export interface AxisTitle extends CommonAxisTitle {
        /**
        * @docid dxchartoptions_argumentaxis_title_text
        * @docid dxchartoptions_valueaxis_title_text
        */
        text?: string;
    }

    export interface ChartConstantLineStyle extends ChartCommonConstantLineStyle {
        /**
        * @docid dxchartoptions_argumentaxis_constantlinestyle_label
        * @docid dxchartoptions_valueaxis_constantlinestyle_label
        */
        label?: ChartConstantLineLabel;
    }

    export interface ChartConstantLine extends ChartConstantLineStyle {
        /**
        * @docid dxchartoptions_argumentaxis_constantlines_label
        * @docid dxchartoptions_valueaxis_constantlines_label
        */
        label?: ChartConstantLineLabel;

        /**
        * @docid dxchartoptions_argumentaxis_constantlines_value
        * @docid dxchartoptions_valueaxis_constantlines_value
        */
        value?: any;
    }

    export interface PolarConstantLine extends PolarCommonConstantLineStyle {
        /**
            * @docid dxpolarchartoptions_argumentaxis_constantlines_label
            * @docid dxpolarchartoptions_valueaxis_constantlines_label
            */
        label?: PolarConstantLineLabel;

        /**
        * @docid dxpolarchartoptions_argumentaxis_constantlines_value
        * @docid dxpolarchartoptions_valueaxis_constantlines_value
        */
        value?: any;
    }

    export interface Axis {
        /**
        * @docid dxchartoptions_argumentaxis_axisdivisionfactor
        * @docid dxchartoptions_valueaxis_axisdivisionfactor
        * @docid dxpolarchartoptions_argumentaxis_axisdivisionfactor
        * @docid dxpolarchartoptions_valueaxis_axisdivisionfactor
        */
        axisDivisionFactor?: number;

        /**
        * @docid dxchartoptions_argumentaxis_categories
        * @docid dxchartoptions_valueaxis_categories
        * @docid dxpolarchartoptions_argumentaxis_categories
        * @docid dxpolarchartoptions_valueaxis_categories
        */
        categories?: Array<any>;

        /**
        * @docid dxchartoptions_argumentaxis_logarithmbase
        * @docid dxchartoptions_valueaxis_logarithmbase
        * @docid dxpolarchartoptions_argumentaxis_logarithmbase
        * @docid dxpolarchartoptions_valueaxis_logarithmbase
        */
        logarithmBase?: number;

        /**
        * @docid dxchartoptions_argumentaxis_tickInterval
        * @docid dxchartoptions_valueaxis_tickInterval
        * @docid dxpolarchartoptions_argumentaxis_tickInterval
        * @docid dxpolarchartoptions_valueaxis_tickInterval
        */
        tickInterval?: any;

        /**
          * @docid dxchartoptions_argumentaxis_minortickinterval
          * @docid dxchartoptions_valueaxis_minortickinterval
          * @docid dxpolarchartoptions_argumentaxis_minortickinterval
          * @docid dxpolarchartoptions_valueaxis_minortickinterval
          */
        minorTickInterval?: any;

        /**
        * @docid dxchartoptions_argumentaxis_minortickcount
        * @docid dxchartoptions_valueaxis_minortickcount
        * @docid dxpolarchartoptions_argumentaxis_minortickcount
        * @docid dxpolarchartoptions_valueaxis_minortickcount
        */
        minorTickCount?: number;

        /**
          * @docid dxchartoptions_argumentaxis_type
          * @docid dxchartoptions_valueaxis_type
          * @docid dxpolarchartoptions_argumentaxis_type
          * @docid dxpolarchartoptions_valueaxis_type
          */
        type?: string;

        /**
          * @docid dxchartoptions_valueaxis_pane
          */
        pane?: string;

        /**
        * @docid dxchartoptions_argumentaxis_strips
        * @docid dxchartoptions_valueaxis_strips
        * @docid dxpolarchartoptions_argumentaxis_strips
        * @docid dxpolarchartoptions_valueaxis_strips
        */
        strips?: Array<Strip>;
    }

    export interface ChartAxis extends ChartCommonAxisSettings, Axis {
        /**
          * @docid dxchartoptions_argumentaxis_constantlines
          * @docid dxchartoptions_valueaxis_constantlines
          */
        constantLines?: Array<ChartConstantLine>;

        /**
          * @docid dxchartoptions_argumentaxis_constantlinestyle
          * @docid dxchartoptions_valueaxis_constantlinestyle
          */
        constantLineStyle?: ChartCommonConstantLineStyle;

        /**
          * @docid dxchartoptions_argumentaxis_label
          * @docid dxchartoptions_valueaxis_label
          */
        label?: ChartAxisLabel;

        /**
          * @docid dxchartoptions_argumentaxis_max
          * @docid dxchartoptions_valueaxis_max
          */
        max?: any;

        /**
          * @docid dxchartoptions_argumentaxis_min
          * @docid dxchartoptions_valueaxis_min
          */
        min?: any;

        /**
          * @docid dxchartoptions_argumentaxis_position
          * @docid dxchartoptions_valueaxis_position
          */
        position?: string;

        /**
          * @docid dxchartoptions_argumentaxis_title
          * @docid dxchartoptions_valueaxis_title
          */
        title?: any;
    }

    export interface PolarAxis extends PolarCommonAxisSettings, Axis {
        /**
          * @docid dxpolarchartoptions_argumentaxis_constantlines
          * @docid dxpolarchartoptions_valueaxis_constantlines
          */
        constantLines?: Array<PolarConstantLine>;

        /**
          * @docid dxpolarchartoptions_argumentaxis_label
          * @docid dxpolarchartoptions_valueaxis_label
          */
        label?: PolarAxisLabel;
    }

    export interface ArgumentAxis {
        /**
        * @docid dxchartoptions_argumentaxis_argumenttype
        * @docid dxpolarchartoptions_argumentaxis_argumenttype
        */
        argumentType?: string;

        /**
        * @docid dxchartoptions_argumentaxis_hovermode
        * @docid dxpolarchartoptions_argumentaxis_hovermode
        */
        hoverMode?: string;
    }

    export interface ChartArgumentAxis extends ChartAxis, ArgumentAxis { }
    export interface PolarArgumentAxis extends PolarAxis, ArgumentAxis {
        /** @docid dxpolarchartoptions_argumentaxis_startangle */
        startAngle?: number;

        /** @docid dxpolarchartoptions_argumentaxis_firstpointonstartangle */
        firstPointOnStartAngle?: boolean;

        /** @docid dxpolarchartoptions_argumentaxis_originvalue */
        originValue?: number;

        /** @docid dxpolarchartoptions_argumentaxis_period */
        period?: number;
    }

    export interface ValueAxis {
        /** @docid dxchartoptions_valueaxis_name */
        name?: string;

        /**
        * @docid dxchartoptions_valueaxis_showZero
        * @docid dxpolarchartoptions_valueaxis_showZero
        */
        showZero?: boolean;

        /**
        * @docid dxchartoptions_valueaxis_valuetype
        * @docid dxpolarchartoptions_valueaxis_valuetype
        */
        valueType?: string;
    }

    export interface ChartValueAxis extends ChartAxis, ValueAxis {
        /** @docid dxchartoptions_valueaxis_multipleaxesspacing */
        multipleAxesSpacing?: number;

        /** @docid dxchartoptions_valueaxis_synchronizedvalue */
        synchronizedValue?: number;
    }

    export interface PolarValueAxis extends PolarAxis, ValueAxis {
        /** @docid dxpolarchartoptions_valueaxis_valuemarginsenabled */
        valueMarginsEnabled?: boolean;

        /** @docid dxpolarchartoptions_valueaxis_maxvaluemargin */
        maxValueMargin?: number;

        /** @docid dxpolarchartoptions_valueaxis_minvaluemargin */
        minValueMargin?: number;

        /** @docid dxpolarchartoptions_valueaxis_tick */
        tick?: {
            /** @docid dxpolarchartoptions_valueaxis_tick_visible */
            visible?: boolean;
        }
    }


    // Panes

    export interface CommonPane {
        /** @docid dxchartoptions_commonpanesettings_backgroundcolor */
        backgroundColor?: string;

        /** @docid dxchartoptions_commonpanesettings_border */
        border?: PaneBorder;
    }

    export interface Pane extends CommonPane {
        /** @docid dxchartoptions_panes_name */
        name?: string;
    }


    // Misc code re-use

    export interface PaneBorder extends viz.core.DashedBorderWithOpacity {
        /** @docid dxchartoptions_commonpanesettings_border_bottom */
        bottom?: boolean;

        /** @docid dxchartoptions_commonpanesettings_border_left */
        left?: boolean;

        /** @docid dxchartoptions_commonpanesettings_border_right */
        right?: boolean;

        /** @docid dxchartoptions_commonpanesettings_border_top */
        top?: boolean;
    }

    export interface ChartAnimation extends viz.core.Animation {
        /** @docid basechartoptions_animation_maxpointcountsupported */
        maxPointCountSupported?: number;
    }


    // BaseChart

    export interface BaseChartTooltip extends viz.core.Tooltip {
        /** @docid basechartoptions_tooltip_argumentformat */
        argumentFormat?: any;

        /** @docid basechartoptions_tooltip_argumentprecision */
        argumentPrecision?: number;

        /** @docid basechartoptions_tooltip_percentprecision */
        percentPrecision?: number;
    }

    export interface BaseChartOptions<TPoint> extends viz.core.BaseWidgetOptions, viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid basechartoptions_adaptiveLayout */
        adaptiveLayout?: {
            /** @docid basechartoptions_adaptiveLayout_width */
            width?: number;

            /** @docid basechartoptions_adaptiveLayout_height */
            height?: number;

            /** @docid basechartoptions_adaptiveLayout_keepLabels */
            keepLabels?: boolean;
        };

        /** @docid basechartoptions_animation */
        animation?: ChartAnimation;

        /** @docid basechartoptions_customizelabel */
        customizeLabel?: (pointInfo: Object) => Object;

        /** @docid basechartoptions_customizepoint */
        customizePoint?: (pointInfo: Object) => Object;

        /** @docid basechartoptions_datasource */
        dataSource?: any;

        /** @docid basechartoptions_legend */
        legend?: core.BaseLegend;

        /**
          * @docid basechartoptions_palette
          * @docid dxpiechartoptions_palette
          */
        palette?: any;

        /** @docid basechartoptions_ondone */
        onDone?: (e: {
            component: BaseChart;
            element: Element;
        }) => void;

        /** @docid basechartoptions_onpointclick */
        onPointClick?: any;

        /** @docid basechartoptions_onpointhoverchanged */
        onPointHoverChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TPoint;
        }) => void;

        /** @docid basechartoptions_onpointselectionchanged */
        onPointSelectionChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TPoint;
        }) => void;

        /** @docid basechartoptions_pointSelectionMode */
        pointSelectionMode?: string;

        /** @docid basechartoptions_series */
        series?: any;

        /** @docid basechartoptions_tooltip */
        tooltip?: BaseChartTooltip;

        /** @docid basechartoptions_ontooltipshown */
        onTooltipShown?: (e: {
            component: BaseChart;
            element: Element;
            target: BasePoint;
        }) => void;

        /** @docid basechartoptions_ontooltiphidden */
        onTooltipHidden?: (e: {
            component: BaseChart;
            element: Element;
            target: BasePoint;
        }) => void;
    }

    /** @docid basechart **/
    export class BaseChart extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {

        /** @docid basechartmethods_clearselection */
        clearSelection(): void;

        /** @docid basechartmethods_getsize */
        getSize(): { width: number; height: number };

        /** @docid basechartmethods_getallseries */
        getAllSeries(): Array<BaseSeries>;

        /** @docid basechartmethods_getseriesbyname */
        getSeriesByName(seriesName: any): BaseSeries;

        /** @docid basechartmethods_getseriesbypos */
        getSeriesByPos(seriesIndex: number): BaseSeries;

        /** @docid basechartmethods_getdatasource */
        getDataSource(): DevExpress.data.DataSource;

        /** @docid basechartmethods_hideTooltip */
        hideTooltip(): void;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid basechartmethods_render */
        render(renderOptions?: {
            force?: boolean;
            animate?: boolean;
            asyncSeriesRendering?: boolean;
        }): void;
    }

    //AdvancedChart
    export interface AdvancedLegend extends core.BaseLegend {
        /**
        * @docid dxchartoptions_legend_customizehint
        * @docid dxpolarchartoptions_legend_customizehint
        */
        customizeHint?: (seriesInfo: { seriesName: any; seriesIndex: number; seriesColor: string; }) => string;

        /**
        * @docid dxchartoptions_legend_customizetext
        * @docid dxpolarchartoptions_legend_customizetext
        */
        customizeText?: (seriesInfo: { seriesName: any; seriesIndex: number; seriesColor: string; }) => string;

        /**
        * @docid dxchartoptions_legend_hovermode
        * @docid dxpolarchartoptions_legend_hovermode
        */
        hoverMode?: string;
    }

    export interface AdvancedOptions<TPoint, TSeries> extends BaseChartOptions<TPoint> {
        /**
        * @docid dxchartoptions_onargumentaxisclick
        * @docid dxpolarchartoptions_onargumentaxisclick
        */
        onArgumentAxisClick?: any;

        /**
        *  @docid dxchartoptions_containerbackgroundcolor
        *  @docid dxpolarchartoptions_containerbackgroundcolor
        */
        containerBackgroundColor?: string;

        /**
        * @docid dxchartoptions_dataPrepareSettings
        * @docid dxpolarchartoptions_dataPrepareSettings
        */
        dataPrepareSettings?: {

            /**
            * @docid dxchartoptions_dataPrepareSettings_checkTypeForAllData
            * @docid dxpolarchartoptions_dataPrepareSettings_checkTypeForAllData
            */
            checkTypeForAllData?: boolean;

            /**
            * @docid dxchartoptions_dataPrepareSettings_convertToAxisDataType
            * @docid dxpolarchartoptions_dataPrepareSettings_convertToAxisDataType
            */
            convertToAxisDataType?: boolean;

            /**
            * @docid dxchartoptions_dataPrepareSettings_sortingMethod
            * @docid dxpolarchartoptions_dataPrepareSettings_sortingMethod
            */
            sortingMethod?: any;
        };

        /**
        * @docid dxchartoptions_onlegendclick
        * @docid dxpolarchartoptions_onlegendclick
        */
        onLegendClick?: any;

        /**
        * @docid dxchartoptions_onseriesclick
        * @docid dxpolarchartoptions_onseriesclick
        */
        onSeriesClick?: any;

        /**
        * @docid dxchartoptions_onserieshoverchanged
        * @docid dxpolarchartoptions_onserieshoverchanged
        */
        onSeriesHoverChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TSeries;
        }) => void;

        /**
        * @docid dxchartoptions_onseriesselectionchanged
        * @docid dxpolarchartoptions_onseriesselectionchanged
        */
        onSeriesSelectionChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TSeries;
        }) => void;

        /**
        * @docid dxchartoptions_seriesSelectionMode
        * @docid dxpolarchartoptions_seriesSelectionMode
        */
        seriesSelectionMode?: string;
        /**
        * @docid dxchartoptions_resolvelabeloverlapping
        * @docid dxpolarchartoptions_resolvelabeloverlapping
        */
        resolveLabelOverlapping?: string;

        /**
        * @docid dxchartoptions_equalbarwidth
        * @docid dxpolarchartoptions_equalbarwidth
        */
        equalBarWidth?: boolean;

        /**
        * @docid dxchartoptions_barwidth
        * @docid dxpolarchartoptions_barwidth
        */
        barWidth?: number;

        /**
        * @docid dxchartoptions_negativesaszeroes
        * @docid dxpolarchartoptions_negativesaszeroes
        */
        negativesAsZeroes?: boolean;
    }

    // Chart

    export interface Legend extends AdvancedLegend {
        /** @docid dxchartoptions_legend_position */
        position?: string;
    }

    export interface ChartTooltip extends BaseChartTooltip {
        /** @docid dxchartoptions_tooltip_location */
        location?: string;

        /** @docid dxchartoptions_tooltip_shared */
        shared?: boolean;
    }

    export interface dxChartOptions extends AdvancedOptions<ChartPoint, ChartSeries> {
        /** @docid dxchartoptions_synchronizemultiaxes */
        synchronizeMultiAxes?: boolean;

        /** @docid dxchartoptions_useAggregation */
        useAggregation?: boolean;

        /** @docid dxchartoptions_adjustonzoom */
        adjustOnZoom?: boolean;

        /** @docid dxchartoptions_argumentaxis */
        argumentAxis?: ChartArgumentAxis;

        /** @docid dxchartoptions_commonaxissettings */
        commonAxisSettings?: ChartCommonAxisSettings;

        /** @docid dxchartoptions_commonpanesettings */
        commonPaneSettings?: CommonPane;

        /** @docid dxchartoptions_commonseriessettings */
        commonSeriesSettings?: CommonSeriesSettings;

        /** @docid dxchartoptions_crosshair */
        crosshair?: {

            /** @docid dxchartoptions_crosshair_color */
            color?: string;

            /** @docid dxchartoptions_crosshair_dashstyle */
            dashStyle?: string;

            /** @docid dxchartoptions_crosshair_enabled */
            enabled?: boolean;

            /** @docid dxchartoptions_crosshair_opacity */
            opacity?: number;

            /** @docid dxchartoptions_crosshair_width */
            width?: number;

            /** @docid dxchartoptions_crosshair_horizontalline */
            horizontalLine?: CrosshairWithLabel;

            /** @docid dxchartoptions_crosshair_verticalline */
            verticalLine?: CrosshairWithLabel;

            /** @docid dxchartoptions_crosshair_label */
            label?: {
                /** @docid dxchartoptions_crosshair_label_backgroundcolor */
                backgroundColor?: string;

                /** @docid dxchartoptions_crosshair_label_visible */
                visible?: boolean;

                /** @docid dxchartoptions_crosshair_label_font */
                font?: viz.core.Font;

                /** @docid dxchartoptions_crosshair_label_format */
                format?: any;

                /** @docid dxchartoptions_crosshair_label_precision */
                precision?: number;

                /** @docid dxchartoptions_crosshair_label_customizetext */
                customizeText?: (info: { value: any; valueText: string; point: ChartPoint; }) => string;
            }
        };

        /** @docid dxchartoptions_defaultpane */
        defaultPane?: string;

        /** @docid dxchartoptions_maxbubblesize */
        maxBubbleSize?: number;

        /** @docid dxchartoptions_minbubblesize */
        minBubbleSize?: number;

        /** @docid dxchartoptions_panes */
        panes?: Array<Pane>;

        /** @docid dxchartoptions_rotated */
        rotated?: boolean;

        /** @docid dxchartoptions_legend */
        legend?: Legend;

        /** @docid dxchartoptions_onzoomstart */
        onZoomStart?: (e: {
            component: BaseChart;
            element: Element;
        }) => void;

        /** @docid dxchartoptions_onzoomend */
        onZoomEnd?: (e: {
            component: BaseChart;
            element: Element;
            rangeStart: any;
            rangeEnd: any;
        }) => void;


        /** @docid dxchartoptions_series */
        series?: Array<SeriesConfig>;

        /** @docid dxchartoptions_seriestemplate */
        seriesTemplate?: SeriesTemplate;

        /** @docid dxchartoptions_tooltip */
        tooltip?: ChartTooltip;

        /** @docid dxchartoptions_valueaxis */
        valueAxis?: Array<ChartValueAxis>;

        /** @docid dxchartoptions_scrollingmode */
        scrollingMode?: string;

        /** @docid dxchartoptions_zoomingmode */
        zoomingMode?: string;

        /** @docid dxchartoptions_scrollbar */
        scrollBar?: {
            /** @docid dxchartoptions_scrollbar_visible */
            visible?: boolean;

            /** @docid dxchartoptions_scrollbar_offset */
            offset?: number;

            /** @docid dxchartoptions_scrollbar_color */
            color?: string;

            /** @docid dxchartoptions_scrollbar_width */
            width?: number;

            /** @docid dxchartoptions_scrollbar_opacity */
            opacity?: number;

            /** @docid dxchartoptions_scrollbar_position */
            position?: string;
        };
    }



    interface CrosshairWithLabel extends viz.core.DashedBorderWithOpacity {
        /**
        * @docid dxchartoptions_crosshair_verticalline_label
        * @docid dxchartoptions_crosshair_horizontalline_label
        */
        label?: {
            /**
            * @docid dxchartoptions_crosshair_verticalline_label_backgroundcolor
            * @docid dxchartoptions_crosshair_horizontalline_label_backgroundcolor
            */
            backgroundColor?: string;

            /**
            * @docid dxchartoptions_crosshair_verticalline_label_visible
            * @docid dxchartoptions_crosshair_horizontalline_label_visible
            */
            visible?: boolean;

            /**
            * @docid dxchartoptions_crosshair_verticalline_label_font
            * @docid dxchartoptions_crosshair_horizontalline_label_font
            */
            font?: viz.core.Font;

            /**
            * @docid dxchartoptions_crosshair_verticalline_label_format
            * @docid dxchartoptions_crosshair_horizontalline_label_format
            */
            format?: any;

            /**
            * @docid dxchartoptions_crosshair_verticalline_label_precision
            * @docid dxchartoptions_crosshair_horizontalline_label_precision
            */
            precision?: number;

            /**
            * @docid dxchartoptions_crosshair_verticalline_label_customizetext
            * @docid dxchartoptions_crosshair_horizontalline_label_customizetext
            */
            customizeText?: (info: { value: any; valueText: string; point: ChartPoint; }) => string;
        }
    }

    // PolarChart

    export interface PolarChartTooltip extends BaseChartTooltip {
        /** @docid dxpolarchartoptions_tooltip_shared */
        shared?: boolean;

    }

    export interface dxPolarChartOptions extends AdvancedOptions<PolarPoint, PolarSeries> {
        /** @docid dxpolarchartoptions_adaptiveLayout */
        adaptiveLayout?: {
            /** @docid dxpolarchartoptions_adaptiveLayout_width */
            width?: number;

            /** @docid dxpolarchartoptions_adaptiveLayout_height */
            height?: number;
        };
        /** @docid dxpolarchartoptions_usespiderweb */
        useSpiderWeb?: boolean;

        /** @docid dxpolarchartoptions_argumentaxis */
        argumentAxis?: PolarArgumentAxis;

        /** @docid dxpolarchartoptions_commonaxissettings */
        commonAxisSettings?: PolarCommonAxisSettings;

        /** @docid dxpolarchartoptions_commonseriessettings */
        commonSeriesSettings?: CommonPolarSeriesSettings;

        /** @docid dxpolarchartoptions_legend */
        legend?: AdvancedLegend;

        /** @docid dxpolarchartoptions_series */
        series?: Array<PolarSeriesConfig>;

        /** @docid dxpolarchartoptions_seriestemplate */
        seriesTemplate?: PolarSeriesTemplate;

        /** @docid dxpolarchartoptions_tooltip */
        tooltip?: PolarChartTooltip;

        /** @docid dxpolarchartoptions_valueaxis */
        valueAxis?: PolarValueAxis;
    }



    // PieChart

    export interface PieLegend extends core.BaseLegend {
        /** @docid dxpiechartoptions_legend_hovermode */
        hoverMode?: string;

        /** @docid dxpiechartoptions_legend_customizehint */
        customizeHint?: (pointInfo: { pointName: any; pointIndex: number; pointColor: string; }) => string;

        /** @docid dxpiechartoptions_legend_customizetext */
        customizeText?: (pointInfo: { pointName: any; pointIndex: number; pointColor: string; }) => string;
    }

    export interface dxPieChartOptions extends BaseChartOptions<PiePoint> {
        /** @docid dxpiechartoptions_adaptiveLayout */
        adaptiveLayout?: {
            /** @docid dxpiechartoptions_adaptiveLayout_keepLabels */
            keepLabels?: boolean;
        };
        /** @docid dxpiechartoptions_legend */
        legend?: PieLegend;

        /** @docid dxpiechartoptions_series */
        series?: Array<PieSeriesConfig>;

        /** @docid dxpiechartoptions_diameter */
        diameter?: number;

        /** @docid dxpiechartoptions_mindiameter */
        minDiameter?: number;

        /** @docid dxpiechartoptions_segmentsdirection */
        segmentsDirection?: string;

        /** @docid dxpiechartoptions_startangle */
        startAngle?: number;

        /** @docid dxpiechartoptions_innerradius */
        innerRadius?: number;

        /** @docid dxpiechartoptions_onlegendclick */
        onLegendClick?: any;

        /** @docid dxpiechartoptions_resolvelabeloverlapping */
        resolveLabelOverlapping?: string;

        /** @docid dxpiechartoptions_commonseriessettings */
        commonSeriesSettings?: CommonPieSeriesSettings;

        /** @docid dxpiechartoptions_seriestemplate */
        seriesTemplate?: PieSeriesTemplate;

        /** @docid dxpiechartoptions_type */
        type?: string;
    }



}

declare module DevExpress.viz {
    /** @docid dxchart */
    export class dxChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxChartOptions);

        /** @docid dxchartmethods_zoomargument */
        zoomArgument(startValue: any, endValue: any): void;
    }

    /** @docid dxpiechart */
    export class dxPieChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPieChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxPieChartOptions);

        /** @docid dxpiechartmethods_getseries */
        getSeries(): DevExpress.viz.charts.PieSeries;
    }

    /** @docid dxpolarchart */
    export class dxPolarChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPolarChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxPolarChartOptions);
    }
}
