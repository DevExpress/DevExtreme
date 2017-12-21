
declare module DevExpress.viz.core {
    
    export interface Border {

        /** Sets a border color for a selected series. */
        color?: string;

        /** Sets border visibility for a selected series. */
        visible?: boolean;

        /** Sets a border width for a selected series. */
        width?: number;
    }

    export interface DashedBorder extends Border {

        /** Specifies a dash style for the border of a selected series point. */
        dashStyle?: string;
    }

    export interface DashedBorderWithOpacity extends DashedBorder {
        /** Specifies how transparent the vertical crosshair line should be. */
        opacity?: number;
    }

    export interface Font {

        /** Specifies a font color. */
        color?: string;

        /** Specifies a font family. */
        family?: string;

        /** Specifies a font opacity. */
        opacity?: number;

        /** Specifies a font size. */
        size?: any;

        /** Specifies a font weight. */
        weight?: number;
    }

    export interface Hatching {

        
        direction?: string;

        /** Specifies the opacity of hatching lines. */
        opacity?: number;

        /** Specifies the distance between hatching lines in pixels. */
        step?: number;

        /** Specifies the width of hatching lines in pixels. */
        width?: number;
    }

    export interface Margins {
        /** Specifies the legend's bottom margin in pixels. */
        bottom?: number;

        /** Specifies the legend's left margin in pixels. */
        left?: number;

        /** Specifies the legend's right margin in pixels. */
        right?: number;

        /** Specifies the legend's bottom margin in pixels. */
        top?: number;
    }

    export interface MarginOptions {
        /** Generates space around the widget. */
        margin?: Margins;
    }

    export interface RedrawOnResizeOptions {
        /** Specifies whether to redraw the widget when the size of the parent browser window changes or a mobile device rotates. */
        redrawOnResize?: boolean;
    }

    export interface TitleOptions {
        /** Specifies the widget title. */
        title?: Title;
    }

    export interface ExportOptions {
        /** Configures the exporting and printing features. */
        export?: Export;
    }

    export interface LoadingIndicatorOptions {
        /** Configures the loading indicator. */
        loadingIndicator?: LoadingIndicator;
    }

    export interface LoadingIndicatorMethods {
        /** Displays the loading indicator. */
        showLoadingIndicator(): void;

        /** Conceals the loading indicator. */
        hideLoadingIndicator(): void;
    }

    export interface Size {
        /** Specifies the width of the widget in pixels. */
        width?: number;

        /** Specifies the height of the widget in pixels. */
        height?: number;
    }

    export interface Title {
        /** Specifies font options for the title. */
        font?: viz.core.Font;

        /** Specifies the title's alignment in a horizontal direction. */
        horizontalAlignment?: string;

       /** Specifies the title's alignment in a vertical direction. */
        verticalAlignment?: string;

        /** Generates space around the title. */
        margin?: Margins;

         /** Specifies the minimum height that the title occupies. */
        placeholderSize?: number;

        /** Specifies the title text. */
        text?: string;

        /** Specifies the widget subtitle. */
        subtitle?: {
            /** Specifies font options for the subtitle. */
            font?: viz.core.Font;

           /** Specifies text for the subtitle. */
            text?: string;
        }
    }

    export interface Export {
        /** Enables the client-side exporting in the widget. */
        enabled?: boolean;

        /** Enables the printing feature in the widget. Applies only if the export.enabled option is true. */
        printingEnabled?: boolean;

        /** Specifies a set of formats available for exporting into. */
        formats?: Array<string>;

        /** Specifies a default name for the file to which the widget will be exported. */
        fileName?: string;

        /** Specifies the URL of the server-side proxy that streams the resulting file to the end user to enable exporting in IE9 and Safari browsers. */
        proxyUrl?: string;

        /** Specifies the color that will fill transparent regions in the resulting file or document. */
        backgroundColor?: string;
    }

    export interface Tooltip {
        /** Specifies the length of the tooltip's arrow in pixels. */
        arrowLength?: number;

        /** Specifies the appearance of the tooltip's border. */
        border?: DashedBorderWithOpacity;

        /** Specifies the color of tooltips. */
        color?: string;

        /** Specifies the z-index of tooltips. */
        zIndex?: number;

        /** Specifies the container to draw tooltips inside of it. */
        container?: any;

        /** Allows you to change tooltip appearance. */
        customizeTooltip?: (arg: any) => {
            color?: string;
            text?: string;
            html?: string;
            fontColor?: string;
            borderColor?: string;
        };

        
        enabled?: boolean;

        /** Specifies the font of the text displayed by a tooltip. */
        font?: Font;

        /** Specifies the format of the value displayed by a tooltip. */
        format?: any;

        /** Specifies the opacity of tooltips. */
        opacity?: number;

        /** Generates space on the left and the right of the text displayed by a tooltip. */
        paddingLeftRight?: number;

        /** Generates space above and below the text displayed by a tooltip. */
        paddingTopBottom?: number;

        /**
         * Specifies the precision of formatted values in a tooltip.
         * @deprecated Use the tooltip.format.precision option instead.
         */
        precision?: number;

        /** Specifies the appearance of the tooltip's shadow. */
        shadow?: {

            /** Specifies the blur distance of the tooltip's shadow. */
            blur?: number;

            /** Specifies the color of the tooltip's shadow. */
            color?: string;

            /** Specifies the horizontal offset of the tooltip's shadow relative to the tooltip itself measured in pixels. */
            offsetX?: number;

            /** Specifies the vertical offset of the tooltip's shadow relative to the tooltip itself measured in pixels. */
            offsetY?: number;

            /** Specifies the opacity of the tooltip's shadow. */
            opacity?: number;
        };
    }

    export interface Animation {
        /** Determines how long animation runs. */
        duration?: number;

        /** Specifies the animation easing mode. */
        easing?: string;

        /** Indicates whether or not animation is enabled. */
        enabled?: boolean;
    }

    export interface LoadingIndicator {
        /** Colors the background of the loading indicator. */
        backgroundColor?: string;

        /** Specifies font options for the loading indicator. */
        font?: viz.core.Font;

        /** Specifies whether to show the loading indicator or not. */
        show?: boolean;

        /** Specifies the text to be displayed by the loading indicator. */
        text?: string;
    }

    export interface LegendBorder extends viz.core.DashedBorderWithOpacity {
        /** Specifies a radius for the corners of the legend border. */
        cornerRadius?: number;
    }

    export interface BaseLegend {
        /** Specifies the color of the legend's background. */
        backgroundColor?: string;

        /** Specifies legend border settings. */
        border?: viz.core.LegendBorder;

        /** Specifies how many columns must be taken to arrange legend items. */
        columnCount?: number;

        /** Specifies the spacing between a pair of neighboring legend columns in pixels. */
        columnItemSpacing?: number;

        /** Specifies font options for legend items. */
        font?: viz.core.Font;

        /** Specifies the legend's position on the map. */
        horizontalAlignment?: string;

        /** Specifies the alignment of legend items. */
        itemsAlignment?: string;

        /** Specifies the position of text relative to the item marker. */
        itemTextPosition?: string;

        /** Specifies the distance between the legend and the container borders in pixels. */
        margin?: viz.core.Margins;

        /** Specifies the size of item markers in the legend in pixels. */
        markerSize?: number;

        /** Specifies whether to arrange legend items horizontally or vertically. */
        orientation?: string;

        /** Specifies the spacing between the legend left/right border and legend items in pixels. */
        paddingLeftRight?: number;

        /** Specifies the spacing between the legend top/bottom border and legend items in pixels. */
        paddingTopBottom?: number;

        /** Specifies how many rows must be taken to arrange legend items. */
        rowCount?: number;

        /** Specifies the spacing between a pair of neighboring legend rows in pixels. */
        rowItemSpacing?: number;

        /** Specifies the legend's position on the map. */
        verticalAlignment?: string;

        /** Specifies whether or not the legend is visible on the map. */
        visible?: boolean;
    }

    export interface BaseWidgetOptions extends DOMComponentOptionsBase {

        /** Specifies the size of the widget in pixels. */
        size?: Size;

        /** A handler for the drawn event. */
        onDrawn?: (e: {
            component: BaseWidget;
            element: Element;
        }) => void;

        /** A handler for the incidentOccurred event. */
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

        /** A handler for the exporting event. */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
            format: string;
        }) => void;

        /** A handler for the fileSaving event. */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** A handler for the exported event. */
        onExported?: (e: any) => void;

        /** Notifies the widget that it is embedded into an HTML page that uses a tag modifying the path. */
        pathModified?: boolean;

        /** Specifies whether or not the widget supports right-to-left representation. */
        rtlEnabled?: boolean;

        /** Sets the name of the theme to be used in the widget. */
        theme?: string;
    }

    /** This section describes options and methods that are common to all widgets. */
    export class BaseWidget extends DOMComponent {
        

        /** Returns the widget's SVG markup. */
        svg(): string;

        /** Gets the current size of the widget. */
        getSize(): { width: number; height: number };

        /** Exports the widget into a document with a specified name and format. */
        exportTo(fileName: string, format: string): void;

        /** Opens the browser's print window. */
        print(): void;

        /** Redraws the widget. */
        render(): void;
    }

}


