/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.funnel {

    export interface Legend extends viz.core.BaseLegend {
        /** Specifies the hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: (itemInfo: { item: funnelItem; text: string; }) => string;

        /** Customizes the text displayed by legend items. */
        customizeText?: (itemInfo: { item: funnelItem; text: string; }) => string;
    }

    /** This section describes the Item object, which represents a funnel item. */
    export interface funnelItem {

    /** The item's original data object. */
        data: Object;

        /** The item's argument. */
        argument: any;

        /** The item's calculated percentage value. */
        percent: number;

        /** The item's value. */
        value: number;

        /** Selects or cancels the funnel item's selection. */
        select(state: boolean): void;

        /** Changes the funnel item's hover state. */
        hover(state: boolean): void;

        /** Gets the funnel item's color specified in the data source or palette. */
        getColor(): string;

        /** Indicates whether the funnel item is in the hover state. */
        isHovered(): boolean;

        /** Indicates whether the funnel item is selected. */
        isSelected(): boolean;

        /** Shows the funnel item's tooltip. */
        showTooltip(): void;
    }
    
    export interface dxFunnelOptions extends viz.core.BaseWidgetOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: {
            /** Specifies the widget's width small enough for the layout to begin adapting. */
            width?: number;
            /** Specifies the widget's height small enough for the layout to begin adapting. */
            height?: number;
            /** Specifies whether item labels should be kept when the layout is adapting. */
            keepLabels?: boolean;
        };

        /** Specifies the widget's data origin. */
        dataSource?: any;

        /** Specifies which data source field provides values for funnel items. The value defines a funnel item's area. */
        valueField?: string;

        /** Specifies which data source field provides colors for funnel items. If this field is absent, the palette provides the colors. */
        colorField?: string;

        /** Specifies whether funnel items change their style when a user pauses on them. */
        hoverEnabled?: boolean;

        /** Specifies which data source field provides arguments for funnel items. The argument identifies a funnel item and represents it on the legend. */
        argumentField?: string;

        /** Specifies whether a single or multiple funnel items can be in the selected state at a time. Assigning "none" disables the selection feature. */
        selectionMode?: string;

        /** Sets the palette to be used for colorizing funnel items. */
        palette?: any;

        /** Specifies the algorithm for building the funnel. */
        algorithm?: string;

        /** Specifies the ratio between the height of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is "dynamicHeight". */
        neckHeight?: number;

        /** Specifies the ratio between the width of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is "dynamicHeight". */
        neckWidth?: number;

        /** Turns the funnel upside down. */
        inverted?: boolean;

        /** Specifies whether to sort funnel items. */
        sortData?: boolean;

        
        item?: {

            /** Configures a funnel item's border. */
            border?: viz.core.Border;

            /** Configures a funnel item's appearance when a user presses the item or hovers the mouse pointer over it. */
            hoverStyle?: {
                /** Configures a funnel item's border appearance when a user presses the item or hovers the mouse pointer over it. */
                border?: viz.core.Border;

                /** Applies hatching to a funnel item when a user presses the item or hovers the mouse pointer over it. */
                hatching?: viz.core.Hatching;
            };

            /** Configures a funnel item's appearance when a user selects it. */
            selectionStyle?: {

                /** Configures a funnel item's border appearance when a user selects this item. */
                border?: viz.core.Border;

                /** Applies hatching to a selected funnel item. */
                hatching?: viz.core.Hatching;
            };
        };

        /** Configures funnel item labels. */
        label?: {
            /** Specifies labels' font options. */
            font?: viz.core.Font;

            /** Specifies whether to display labels inside or outside funnel items or arrange them in columns. */
            position?: string;

            /** Moves labels from their initial positions. */
            horizontalOffset?: number;

            /** Specifies labels' position in relation to the funnel items. */
            horizontalAlignment?: string;

            /** Configures label connectors. */
            connector?: {
                /** Colors label connectors. */
                color?: string;

                /** Shows label connectors. */
                visible?: boolean;

                /** Specifies the label connector width in pixels. */
                width?: number;

                /** Specifies the transparency of label connectors. */
                opacity?: number;
            };

            /** Colors the labels' background. Inherits the funnel item's color by default. */
            backgroundColor?: string;

            /** Configures the label borders. */
            border?: viz.core.DashedBorder;

            /** Controls the labels' visibility. */
            visible?: boolean;

            /** Specifies whether to show labels for items with zero value. */
            showForZeroValues?: boolean;

            /** Customizes labels' text. */
            customizeText?: (itemInfo: {
                item: funnelItem;
                valueText: string;
                value: number;
                percent: number;
                percentText: string;
            }) => string;

            /** Formats the item value before displaying it in the label. */
            format?: any;
        };
        /** Configures the legend. */
        legend?: Legend;

        /** A handler for the itemClick event. Executed when a user clicks a funnel item. */
        onItemClick?: any;

        /** A handler for the legendClick event. Executed when a user clicks a legend item. */
        onLegendClick?: any;

        /** A handler for the hoverChanged event. Executed after a funnel item's hover state is changed in the UI or programmatically. */
        onHoverChanged?: (e: {
            component: dxFunnel;
            element: Element;
            node: funnelItem;
        }) => void;

        /** A handler for the selectionChanged event. Executed after a funnel item's selection state is changed in the UI or programmatically. */
        onSelectionChanged?: (e: {
            component: dxFunnel;
            element: Element;
            node: funnelItem;
        }) => void;

        
        tooltip?: viz.core.Tooltip;
    }
}

declare module DevExpress.viz {
    
    export class dxFunnel extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.funnel.dxFunnelOptions);
        constructor(element: Element, options?: DevExpress.viz.funnel.dxFunnelOptions);

        /** Cancels the selection of all funnel items. */
        clearSelection(): void;

        /** Provides access to all funnel items. */
        getAllItems(): Array<DevExpress.viz.funnel.funnelItem>;

        /** Hides all widget tooltips. */
        hideTooltip(): void;

        /** Provides access to the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;
    }
}

