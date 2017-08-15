/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.funnel {

    export interface Legend extends viz.core.BaseLegend {
        /** @docid dxfunneloptions_legend_customizehint */
        customizeHint?: (itemsInfo: { item: funnelItem; text: string; }) => string;

        /** @docid dxfunneloptions_legend_customizetext */
        customizeText?: (itemsInfo: { item: funnelItem; text: string; }) => string;
    }

    /** @docid dxfunnelitem */
    export interface funnelItem {

    /** @docid dxfunnelitemfields_data */
        data?: Object;

        /** @docid dxfunnelitemfields_id */
        id?: number;

        /** @docid dxfunnelitemfields_percent */
        percent?: number;

        /** @docid dxfunnelitemmethods_select */
        select(state: boolean): void;

        /** @docid dxfunnelitemmethods_hover */
        hover(state: boolean): void;

        /** @docid dxfunnelitemmethods_getcolor */
        getColor(): string;

        /** @docid dxfunnelitemmethods_ishovered */
        isHovered(): boolean;

        /** @docid dxfunnelitemmethods_isselected */
        isSelected(): boolean;

        /** @docid dxfunnelitemmethods_showtooltip */
        showTooltip(): void;
    }

    export interface dxFunnelOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid dxfunneloptions_adaptivelayout */
        adaptiveLayout?: {
            /** @docid dxfunneloptions_adaptivelayout_width */
            width?: number;
            /** @docid dxfunneloptions_adaptivelayout_height */
            height?: number;
            /** @docid dxfunneloptions_adaptivelayout_keeplabels */
            keepLabels?: boolean;
        };

        /** @docid dxfunneloptions_valuefield */
        valueField?: string;

        /** @docid dxfunneloptions_colorfield */
        colorField?: string;

        /** @docid dxfunneloptions_hoverenabled */
        hoverEnabled?: boolean;

        /** @docid dxfunneloptions_argumentfield */
        argumentField?: string;

        /** @docid dxfunneloptions_selectionmode */
        selectionMode?: string;

        /** @docid dxfunneloptions_palette */
        palette?: any;

        /** @docid dxfunneloptions_algorithm */
        algorithm?: string;

        /** @docid dxfunneloptions_neckheight */
        neckHeight?: number;

        /** @docid dxfunneloptions_neckwidth */
        neckWidth?: number;

        /** @docid dxfunneloptions_inverted */
        inverted?: boolean;

        /** @docid dxfunneloptions_sortdata */
        sortData?: boolean;

        /** @docid dxfunneloptions_item */
        item?: {

            /** @docid dxfunneloptions_item_border */
            border: viz.core.Border;

            /** @docid dxfunneloptions_item_hoverstyle */
            hoverStyle?: {
                /** @docid dxfunneloptions_item_hoverstyle_border */
                border?: viz.core.Border;
                /** @docid dxfunneloptions_item_hoverstyle_hatching */
                hatching?: viz.core.Hatching;
            };

            /** @docid dxfunneloptions_item_selectionstyle */
            selectionStyle?: {
                /** @docid dxfunneloptions_item_selectionstyle_border */
                border?: viz.core.Border;

                /** @docid dxfunneloptions_item_selectionstyle_hatching */
                hatching?: viz.core.Hatching;
            };
        };

        /** @docid dxfunneloptions_label */
        label?: {
            /** @docid dxfunneloptions_label_font */
            font?: viz.core.Font;

            /** @docid dxfunneloptions_label_position */
            position?: string;

            /** @docid dxfunneloptions_label_horizontaloffset */
            horizontalOffset?: number;

            /** @docid dxfunneloptions_label_horizontalalignment */
            horizontalAlignment?: string;

            /** @docid dxfunneloptions_label_connector */
            connector?: {
                /** @docid dxfunneloptions_label_connector_color */
                color?: string;

                /** @docid dxfunneloptions_label_connector_visible */
                visible?: boolean;

                /** @docid dxfunneloptions_label_connector_width */
                width?: number;
            };

            /** @docid dxfunneloptions_label_backgroundcolor */
            backgroundColor?: string;

            /** @docid dxfunneloptions_label_border */
            border?: viz.core.DashedBorder;

            /** @docid dxfunneloptions_label_visible */
            visible?: boolean;

            /** @docid dxfunneloptions_label_showforzerovalues */
            showForZeroValues?: boolean;

            /** @docid dxfunneloptions_label_customizetext */
            customizeText?: (itemsInfo: { valueText: string; item: funnelItem; }) => string;

            /** @docid dxfunneloptions_label_format */
            format?: any;
        };
        /** @docid dxfunneloptions_legend */
        legend?: Legend;

        /** @docid  dxfunneloptions_onItemClick */
        onItemClick?: any;

        /** @docid  dxfunneloptions_onLegendClick */
        onLegendClick?: any;

        /** @docid  dxfunneloptions_onHoverChanged */
        onHoverChanged?: any;

        /** @docid  dxfunneloptions_selectionChanged */
        onSelectionChanged?: any;

        /** @docid dxfunneloptions_tooltip */
        tooltip?: viz.core.Tooltip;
    }
}

declare module DevExpress.viz {
    /** @docid dxfunnel */
    export class dxFunnel extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.funnel.dxFunnelOptions);
        constructor(element: Element, options?: DevExpress.viz.funnel.dxFunnelOptions);

        /** @docid dxfunnelmethods_clearselection */
        clearSelection(): void;

        /** @docid dxfunnelmethods_getallitems */
        getAllItems(): Array<DevExpress.viz.funnel.funnelItem>;

        /** @docid dxfunnelmethods_hidetooltip */
        hideTooltip(): void;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;
    }
}

