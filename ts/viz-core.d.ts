/** @docid_ignore viz_coremethods_currentTheme#currentTheme(theme) */
/** @docid_ignore viz_coremethods_currentTheme#currentTheme(platform, colorScheme) */
/** @docid_ignore viz_coremethods_registerTheme */
/** @docid_ignore viz_coremethods_currentPalette */
/** @docid_ignore viz_coremethods_getPalette */
/** @docid_ignore viz_coremethods_registerPalette */

declare module DevExpress.viz.core {
    /** @docid_ignore viz_core */

    export interface Border {

        /**
          * @docid dxChartSeriesTypes_CommonSeries_border_color
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_border_color
          * @docid dxChartSeriesTypes_CommonSeries_label_border_color
          * @docid dxChartSeriesTypes_CommonSeries_point_border_color
          * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_color
          * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_color
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_border_color
          * @docid basechartoptions_legend_border_color
          * @docid dxvectormapoptions_legends_border_color
          * @docid BaseWidgetOptions_tooltip_border_color
          * @docid dxchartoptions_commonpanesettings_border_color
          * @docid dxchartoptions_crosshair_horizontalline_color
          * @docid dxchartoptions_crosshair_verticalline_color
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_border_color
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_color
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_border_color
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_color
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_color
          */
        color?: string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_label_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_point_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_visible
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_border_visible
          * @docid basechartoptions_legend_border_visible
          * @docid dxvectormapoptions_legends_border_visible
          * @docid BaseWidgetOptions_tooltip_border_visible
          * @docid dxchartoptions_commonpanesettings_border_visible
          * @docid dxchartoptions_crosshair_horizontalline_visible
          * @docid dxchartoptions_crosshair_verticalline_visible
          * @docid dxChartSeriesTypes_stepareaseries_selectionstyle_border_visible
          * @docid dxChartSeriesTypes_stepareaseries_hoverstyle_border_visible
          * @docid dxChartSeriesTypes_stepareaseries_border_visible
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_border_visible
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_visible
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_border_visible
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_visible
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_visible
          */
        visible?: boolean;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_border_width
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_border_width
          * @docid dxChartSeriesTypes_CommonSeries_label_border_width
          * @docid dxChartSeriesTypes_CommonSeries_point_border_width
          * @docid dxChartSeriesTypes_CommonSeries_point_hoverstyle_border_width
          * @docid dxChartSeriesTypes_CommonSeries_point_selectionstyle_border_width
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_border_width
          * @docid basechartoptions_legend_border_width
          * @docid dxvectormapoptions_legends_border_width
          * @docid BaseWidgetOptions_tooltip_border_width
          * @docid dxchartoptions_commonpanesettings_border_width
          * @docid dxchartoptions_crosshair_horizontalline_width
          * @docid dxchartoptions_crosshair_verticalline_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_border_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_border_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_hoverstyle_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_point_selectionstyle_border_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_width
          */
        width?: number;
    }

    export interface DashedBorder extends Border {

        /**
          * @docid dxChartSeriesTypes_CommonSeries_border_dashstyle
          * @docid dxChartSeriesTypes_CommonSeries_label_border_dashstyle
          * @docid basechartoptions_legend_border_dashstyle
          * @docid dxvectormapoptions_legends_border_dashstyle
          * @docid BaseWidgetOptions_tooltip_border_dashstyle
          * @docid dxchartoptions_commonpanesettings_border_dashstyle
          * @docid dxchartoptions_crosshair_horizontalline_dashstyle
          * @docid dxchartoptions_crosshair_verticalline_dashstyle
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_label_border_dashstyle
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_border_dashstyle
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_border_dashstyle
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_border_dashstyle
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_label_border_dashstyle
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_border_dashstyle
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_border_dashstyle
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_border_dashstyle
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_border_dashstyle
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_border_dashstyle
          */
        dashStyle?: string;
    }

    export interface DashedBorderWithOpacity extends DashedBorder {
        /**
          * @docid basechartoptions_legend_border_opacity
          * @docid dxvectormapoptions_legends_border_opacity
          * @docid dxchartoptions_commonpanesettings_border_opacity
          * @docid BaseWidgetOptions_tooltip_border_opacity
          * @docid dxchartoptions_crosshair_horizontalline_opacity
          * @docid dxchartoptions_crosshair_verticalline_opacity
          */
        opacity?: number;
    }

    export interface Font {

        /** @docid Font_color */
        color?: string;

        /** @docid Font_family */
        family?: string;

        /** @docid Font_opacity */
        opacity?: number;

        /** @docid Font_size */
        size?: any;

        /** @docid Font_weight */
        weight?: number;
    }

    export interface Hatching {

        /**
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_direction
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_direction
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_direction
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_direction
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_direction
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_direction
          * @docid dxChartSeriesTypes_candlestickseries_hoverstyle_hatching_direction
          * @docid dxChartSeriesTypes_candlestickseries_selectionstyle_hatching_direction
          */
        direction?: string;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_opacity
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_opacity
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_opacity
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_opacity
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_opacity
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_opacity
          */
        opacity?: number;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_step
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_step
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_step
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_step
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_step
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_step
          */
        step?: number;

        /**
          * @docid dxChartSeriesTypes_CommonSeries_hoverstyle_hatching_width
          * @docid dxChartSeriesTypes_CommonSeries_selectionstyle_hatching_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_hoverstyle_hatching_width
          * @docid dxPieChartSeriesTypes_CommonPieChartSeries_selectionstyle_hatching_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_hoverstyle_hatching_width
          * @docid dxPolarChartSeriesTypes_CommonPolarChartSeries_selectionstyle_hatching_width
          */
        width?: number;
    }

    export interface Margins {
        /**
          * @docid BaseWidgetOptions_margin_bottom
          * @docid basechartoptions_legend_margin_bottom
          * @docid BaseWidgetOptions_title_margin_bottom
          * @docid dxvectormapoptions_legends_margin_bottom
          */
        bottom?: number;

        /**
          * @docid BaseWidgetOptions_margin_left
          * @docid basechartoptions_legend_margin_left
          * @docid BaseWidgetOptions_title_margin_left
          * @docid dxvectormapoptions_legends_margin_left
          */
        left?: number;

        /**
          * @docid BaseWidgetOptions_margin_right
          * @docid basechartoptions_legend_margin_right
          * @docid BaseWidgetOptions_title_margin_right
          * @docid dxvectormapoptions_legends_margin_right
          */
        right?: number;

        /**
          * @docid BaseWidgetOptions_margin_top
          * @docid basechartoptions_legend_margin_top
          * @docid BaseWidgetOptions_title_margin_top
          * @docid dxvectormapoptions_legends_margin_top
          */
        top?: number;
    }

    export interface MarginOptions {
        /** @docid BaseWidgetOptions_margin */
        margin?: Margins;
    }

    export interface RedrawOnResizeOptions {
        /** @docid BaseWidgetOptions_redrawonresize */
        redrawOnResize?: boolean;
    }

    export interface TitleOptions {
        /** @docid BaseWidgetOptions_title */
        title?: Title;
    }

    export interface ExportOptions {
        /** @docid BaseWidgetOptions_export */
        export?: Export;
    }

    export interface LoadingIndicatorOptions {
        /** @docid BaseWidgetOptions_loadingindicator */
        loadingIndicator?: LoadingIndicator;
    }

    export interface LoadingIndicatorMethods {
        /** @docid BaseWidgetMethods_showLoadingIndicator */
        showLoadingIndicator(): void;

        /** @docid BaseWidgetMethods_hideLoadingIndicator */
        hideLoadingIndicator(): void;
    }

    export interface Size {
        /** @docid BaseWidgetOptions_size_width */
        width?: number;

        /** @docid BaseWidgetOptions_size_height */
        height?: number;
    }

    export interface Title {
        /** @docid BaseWidgetOptions_title_font */
        font?: viz.core.Font;

        /** @docid BaseWidgetOptions_title_horizontalalignment */
        horizontalAlignment?: string;

       /** @docid BaseWidgetOptions_title_verticalalignment */
        verticalAlignment?: string;

        /** @docid BaseWidgetOptions_title_margin */
        margin?: Margins;

         /** @docid BaseWidgetOptions_title_placeholdersize */
        placeholderSize?: number;

        /** @docid BaseWidgetOptions_title_text */
        text?: string;

        /** @docid BaseWidgetOptions_title_subtitle */
        subtitle?: {
            /** @docid BaseWidgetOptions_title_subtitle_font */
            font?: viz.core.Font;

           /** @docid BaseWidgetOptions_title_subtitle_text */
            text?: string;
        }
    }

    export interface Export {
        /** @docid BaseWidgetOptions_export_enabled */
        enabled?: boolean;

        /** @docid BaseWidgetOptions_export_printingenabled */
        printingEnabled?: boolean;

        /** @docid BaseWidgetOptions_export_formats*/
        formats?: Array<string>;

        /** @docid BaseWidgetOptions_export_filename*/
        fileName?: string;

        /** @docid BaseWidgetOptions_export_proxyurl*/
        proxyUrl?: string;

        /** @docid BaseWidgetOptions_export_backgroundcolor*/
        backgroundColor?: string;
    }

    export interface Tooltip {
        /** @docid BaseWidgetOptions_tooltip_arrowlength */
        arrowLength?: number;

        /** @docid BaseWidgetOptions_tooltip_border */
        border?: DashedBorderWithOpacity;

        /** @docid BaseWidgetOptions_tooltip_color */
        color?: string;

        /** @docid BaseWidgetOptions_tooltip_zindex */
        zIndex?: number;

        /** @docid BaseWidgetOptions_tooltip_container */
        container?: any;

        /**
          * @docid basechartoptions_tooltip_customizetooltip
          * @docid basegaugeoptions_tooltip_customizetooltip
          * @docid dxbargaugeoptions_tooltip_customizetooltip
          * @docid basesparklineoptions_tooltip_customizetooltip
          * @docid dxvectormapoptions_tooltip_customizetooltip
          * @docid dxtreemapoptions_tooltip_customizetooltip
          */
        customizeTooltip?: (arg: any) => {
            color?: string;
            text?: string;
            html?: string;
            fontColor?: string;
            borderColor?: string;
        };

        /**
          * @docid BaseWidgetOptions_tooltip_enabled
          * @docid basesparklineoptions_tooltip_enabled
          */
        enabled?: boolean;

        /** @docid BaseWidgetOptions_tooltip_font */
        font?: Font;

        /** @docid BaseWidgetOptions_tooltip_format */
        format?: any;

        /** @docid BaseWidgetOptions_tooltip_opacity */
        opacity?: number;

        /** @docid BaseWidgetOptions_tooltip_paddingleftright */
        paddingLeftRight?: number;

        /** @docid BaseWidgetOptions_tooltip_paddingtopbottom */
        paddingTopBottom?: number;

        /** @docid BaseWidgetOptions_tooltip_precision */
        precision?: number;

        /** @docid BaseWidgetOptions_tooltip_shadow */
        shadow?: {

            /** @docid BaseWidgetOptions_tooltip_shadow_blur */
            blur?: number;

            /** @docid BaseWidgetOptions_tooltip_shadow_color */
            color?: string;

            /** @docid BaseWidgetOptions_tooltip_shadow_offsetx */
            offsetX?: number;

            /** @docid BaseWidgetOptions_tooltip_shadow_offsety */
            offsetY?: number;

            /** @docid BaseWidgetOptions_tooltip_shadow_opacity */
            opacity?: number;
        };
    }

    export interface Animation {
        /**
          * @docid basechartoptions_animation_duration
          * @docid basegaugeoptions_animation_duration
          */
        duration?: number;

        /**
          * @docid basechartoptions_animation_easing
          * @docid basegaugeoptions_animation_easing
          */
        easing?: string;

        /**
          * @docid basechartoptions_animation_enabled
          * @docid basegaugeoptions_animation_enabled
          */
        enabled?: boolean;
    }

    export interface LoadingIndicator {
        /** @docid BaseWidgetOptions_loadingindicator_backgroundcolor */
        backgroundColor?: string;

        /** @docid BaseWidgetOptions_loadingindicator_font */
        font?: viz.core.Font;

        /** @docid BaseWidgetOptions_loadingindicator_show */
        show?: boolean;

        /** @docid BaseWidgetOptions_loadingindicator_text */
        text?: string;
    }

    export interface LegendBorder extends viz.core.DashedBorderWithOpacity {
        /**
          * @docid basechartoptions_legend_border_cornerradius
          * @docid dxvectormapoptions_legends_border_cornerradius
          */
        cornerRadius?: number;
    }

    export interface BaseLegend {
        /**
          * @docid basechartoptions_legend_backgroundcolor
          * @docid dxvectormapoptions_legends_backgroundcolor
          */
        backgroundColor?: string;

        /**
          * @docid basechartoptions_legend_border
          * @docid dxvectormapoptions_legends_border
          */
        border?: viz.core.LegendBorder;

        /**
          * @docid basechartoptions_legend_columncount
          * @docid dxvectormapoptions_legends_columncount
          */
        columnCount?: number;

        /**
          * @docid basechartoptions_legend_columnitemspacing
          * @docid dxvectormapoptions_legends_columnitemspacing
          */
        columnItemSpacing?: number;

        /**
          * @docid basechartoptions_legend_font
          * @docid dxvectormapoptions_legends_font
          */
        font?: viz.core.Font;

        /**
          * @docid basechartoptions_legend_horizontalalignment
          * @docid dxvectormapoptions_legends_horizontalalignment
          */
        horizontalAlignment?: string;

        /**
          * @docid basechartoptions_legend_itemsalignment
          * @docid dxvectormapoptions_legends_itemsalignment
          */
        itemsAlignment?: string;

        /**
          * @docid basechartoptions_legend_itemtextposition
          * @docid dxvectormapoptions_legends_itemtextposition
          */
        itemTextPosition?: string;

        /**
          * @docid basechartoptions_legend_margin
          * @docid dxvectormapoptions_legends_margin
          */
        margin?: viz.core.Margins;

        /**
          * @docid basechartoptions_legend_markersize
          * @docid dxvectormapoptions_legends_markerSize
          */
        markerSize?: number;

        /**
          * @docid basechartoptions_legend_orientation
          * @docid dxvectormapoptions_legends_orientation
          */
        orientation?: string;

        /**
          * @docid basechartoptions_legend_paddingleftright
          * @docid dxvectormapoptions_legends_paddingleftright
          */
        paddingLeftRight?: number;

        /**
          * @docid basechartoptions_legend_paddingtopbottom
          * @docid dxvectormapoptions_legends_paddingtopbottom
          */
        paddingTopBottom?: number;

        /**
          * @docid basechartoptions_legend_rowcount
          * @docid dxvectormapoptions_legends_rowcount
          */
        rowCount?: number;

        /**
          * @docid basechartoptions_legend_rowitemspacing
          * @docid dxvectormapoptions_legends_rowitemspacing
          */
        rowItemSpacing?: number;

        /**
          * @docid basechartoptions_legend_verticalalignment
          * @docid dxvectormapoptions_legends_verticalalignment
          */
        verticalAlignment?: string;

        /**
          * @docid basechartoptions_legend_visible
          * @docid dxvectormapoptions_legends_visible
          */
        visible?: boolean;
    }

    export interface BaseWidgetOptions extends DOMComponentOptionsBase {
        /** @docid_ignore BaseWidgetOptions_width */
        /** @docid_ignore BaseWidgetOptions_height */

        /** @docid_ignore BaseWidgetOptions_tooltip */

        /** @docid BaseWidgetOptions_size */
        size?: Size;

        /** @docid BaseWidgetOptions_onDrawn */
        onDrawn?: (e: {
            component: BaseWidget;
            element: Element;
        }) => void;

        /** @docid BaseWidgetOptions_onIncidentoccurred */
        onIncidentOccurred?: (
        component: BaseWidget,
        element: Element,
        target: {
            id: string;
            type: string;
            args: any;
            text: string;
            widget: string;
            version: string;
        }
        ) => void;

        /** @docid BaseWidgetOptions_onexporting */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
            format: string;
        }) => void;

        /** @docid BaseWidgetOptions_onfilesaving */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** @docid BaseWidgetOptions_onexported */
        onExported?: (e: any) => void;

        /** @docid BaseWidgetOptions_pathmodified */
        pathModified?: boolean;

        /** @docid BaseWidgetOptions_rtlEnabled */
        rtlEnabled?: boolean;

        /** @docid BaseWidgetOptions_theme */
        theme?: string;
    }

    /** @docid BaseWidget */
    export class BaseWidget extends DOMComponent {
        /** @docid_ignore BaseWidgetMethods_defaultOptions */

        /** @docid BaseWidgetMethods_svg */
        svg(): string;

        /** @docid BaseWidgetMethods_getSize */
        getSize(): { width: number; height: number };

        /** @docid BaseWidgetMethods_exportTo */
        exportTo(fileName: string, format: string): void;

        /** @docid BaseWidgetMethods_print */
        print(): void;

        /** @docid BaseWidgetMethods_render */
        render(): void;
    }

    /** @docid_ignore VizTimeInterval */
    /** @docid_ignore VizTimeInterval_years */
    /** @docid_ignore VizTimeInterval_quarters */
    /** @docid_ignore VizTimeInterval_months */
    /** @docid_ignore VizTimeInterval_weeks */
    /** @docid_ignore VizTimeInterval_days */
    /** @docid_ignore VizTimeInterval_hours */
    /** @docid_ignore VizTimeInterval_minutes */
    /** @docid_ignore VizTimeInterval_seconds */
    /** @docid_ignore VizTimeInterval_milliseconds */

}


