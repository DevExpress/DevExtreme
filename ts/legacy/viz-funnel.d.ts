/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.funnel {

    export interface Legend extends viz.core.BaseLegend {
        /** @docid dxFunneloptions_legend_customizehint */
        customizeHint?: (itemInfo: { item: funnelItem; text: string; }) => string;

        /** @docid dxFunneloptions_legend_customizetext */
        customizeText?: (itemInfo: { item: funnelItem; text: string; }) => string;
    }

    /** @docid dxFunnelItem */
    export interface funnelItem {

    /** @docid dxFunnelItemfields_data */
        data: Object;

        /** @docid dxFunnelItemfields_argument */
        argument: any;

        /** @docid dxFunnelItemfields_percent */
        percent: number;

        /** @docid dxFunnelItemfields_value */
        value: number;

        /** @docid dxFunnelItemmethods_select */
        select(state: boolean): void;

        /** @docid dxFunnelItemmethods_hover */
        hover(state: boolean): void;

        /** @docid dxFunnelItemmethods_getcolor */
        getColor(): string;

        /** @docid dxFunnelItemmethods_ishovered */
        isHovered(): boolean;

        /** @docid dxFunnelItemmethods_isselected */
        isSelected(): boolean;

        /** @docid dxFunnelItemmethods_showtooltip */
        showTooltip(): void;
    }
    /** @docid dxFunnel_options */
    export interface dxFunnelOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid dxFunneloptions_adaptivelayout */
        adaptiveLayout?: {
            /** @docid dxFunneloptions_adaptivelayout_width */
            width?: number;
            /** @docid dxFunneloptions_adaptivelayout_height */
            height?: number;
            /** @docid dxFunneloptions_adaptivelayout_keeplabels */
            keepLabels?: boolean;
        };

        /** @docid dxFunneloptions_datasource */
        dataSource?: any;

        /** @docid dxFunneloptions_valuefield */
        valueField?: string;

        /** @docid dxFunneloptions_colorfield */
        colorField?: string;

        /** @docid dxFunneloptions_hoverenabled */
        hoverEnabled?: boolean;

        /** @docid dxFunneloptions_argumentfield */
        argumentField?: string;

        /** @docid dxFunneloptions_selectionmode */
        selectionMode?: string;

        /** @docid dxFunneloptions_palette */
        palette?: any;

        /** @docid dxFunneloptions_algorithm */
        algorithm?: string;

        /** @docid dxFunneloptions_neckheight */
        neckHeight?: number;

        /** @docid dxFunneloptions_neckwidth */
        neckWidth?: number;

        /** @docid dxFunneloptions_inverted */
        inverted?: boolean;

        /** @docid dxFunneloptions_sortdata */
        sortData?: boolean;

        /** @docid dxFunneloptions_item */
        item?: {

            /** @docid dxFunneloptions_item_border */
            border?: viz.core.Border;

            /** @docid dxFunneloptions_item_hoverstyle */
            hoverStyle?: {
                /** @docid dxFunneloptions_item_hoverstyle_border */
                border?: viz.core.Border;

                /** @docid dxFunneloptions_item_hoverstyle_hatching */
                hatching?: viz.core.Hatching;
            };

            /** @docid dxFunneloptions_item_selectionstyle */
            selectionStyle?: {

                /** @docid dxFunneloptions_item_selectionstyle_border */
                border?: viz.core.Border;

                /** @docid dxFunneloptions_item_selectionstyle_hatching */
                hatching?: viz.core.Hatching;
            };
        };

        /** @docid dxFunneloptions_label */
        label?: {
            /** @docid dxFunneloptions_label_font */
            font?: viz.core.Font;

            /** @docid dxFunneloptions_label_position */
            position?: string;

            /** @docid dxFunneloptions_label_horizontaloffset */
            horizontalOffset?: number;

            /** @docid dxFunneloptions_label_horizontalalignment */
            horizontalAlignment?: string;

            /** @docid dxFunneloptions_label_connector */
            connector?: {
                /** @docid dxFunneloptions_label_connector_color */
                color?: string;

                /** @docid dxFunneloptions_label_connector_visible */
                visible?: boolean;

                /** @docid dxFunneloptions_label_connector_width */
                width?: number;

                /** @docid dxFunneloptions_label_connector_opacity */
                opacity?: number;
            };

            /** @docid dxFunneloptions_label_backgroundcolor */
            backgroundColor?: string;

            /** @docid dxFunneloptions_label_border */
            border?: viz.core.DashedBorder;

            /** @docid dxFunneloptions_label_visible */
            visible?: boolean;

            /** @docid dxFunneloptions_label_showforzerovalues */
            showForZeroValues?: boolean;

            /** @docid dxFunneloptions_label_customizetext */
            customizeText?: (itemInfo: {
                item: funnelItem;
                valueText: string;
                value: number;
                percent: number;
                percentText: string;
            }) => string;

            /** @docid dxFunneloptions_label_format */
            format?: any;
        };
        /** @docid dxFunneloptions_legend */
        legend?: Legend;

        /** @docid  dxFunneloptions_onitemclick */
        onItemClick?: any;

        /** @docid  dxFunneloptions_onlegendclick */
        onLegendClick?: any;

        /** @docid  dxFunneloptions_onhoverchanged */
        onHoverChanged?: (e: {
            component: dxFunnel;
            element: Element;
            node: funnelItem;
        }) => void;

        /** @docid  dxFunneloptions_onselectionchanged */
        onSelectionChanged?: (e: {
            component: dxFunnel;
            element: Element;
            node: funnelItem;
        }) => void;

        /** @docid dxFunneloptions_tooltip */
        tooltip?: viz.core.Tooltip;
    }
}

declare module DevExpress.viz {
    /** @docid dxFunnel */
    export class dxFunnel extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.funnel.dxFunnelOptions);
        constructor(element: Element, options?: DevExpress.viz.funnel.dxFunnelOptions);

        /** @docid dxFunnelmethods_clearselection */
        clearSelection(): void;

        /** @docid dxFunnelmethods_getallitems */
        getAllItems(): Array<DevExpress.viz.funnel.funnelItem>;

        /** @docid dxFunnelmethods_hidetooltip */
        hideTooltip(): void;

        /** @docid dxFunnelmethods_getdatasource */
        getDataSource(): DevExpress.data.DataSource;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;
    }
}

