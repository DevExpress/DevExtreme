






declare module DevExpress.viz.core {
    

    export interface Border {

        /** Colors the selected funnel item's border. */
        color?: string;

        /** Shows the selected funnel item's border. */
        visible?: boolean;

        /** Thickens the selected funnel item's border. */
        width?: number;
    }

    export interface DashedBorder extends Border {

        /** Sets a dash style for the legend's border. */
        dashStyle?: string;
    }

    export interface DashedBorderWithOpacity extends DashedBorder {
        /** Specifies the transparency of the legend's border. */
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

        /** Specifies hatching line direction. */
        direction?: string;

        /** Specifies hatching line transparency. */
        opacity?: number;

        /** Specifies the distance between two side-by-side hatching lines in pixels. */
        step?: number;

        /** Specifies hatching line width in pixels. */
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
        /** Configures the widget's title. */
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
        /** Shows the loading indicator. */
        showLoadingIndicator(): void;

        /** Hides the loading indicator. */
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

        /** Specifies the title's text. */
        text?: string;

        /** Configures the widget's subtitle. */
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
        /** Specifies the length of a tooltip's arrow in pixels. */
        arrowLength?: number;

        /** Configures a tooltip's border. */
        border?: DashedBorderWithOpacity;

        /** Colors all tooltips. */
        color?: string;

        /** Specifies a tooltip's z-index. */
        zIndex?: number;

        /** Specifies the container in which to draw tooltips. The default container is the HTML DOM `<body>` element. */
        container?: any;

        /** Customizes a specific tooltip's appearance. */
        customizeTooltip?: (arg: any) => {
            color?: string;
            text?: string;
            html?: string;
            fontColor?: string;
            borderColor?: string;
        };

        
        enabled?: boolean;

        /** Specifies tooltips' font options. */
        font?: Font;

        /** Specifies the format of the value a tooltip displays. */
        format?: any;

        /** Specifies tooltips' transparency. */
        opacity?: number;

        /** Generates an empty space, measured in pixels, between a tooltip's left/right border and its text. */
        paddingLeftRight?: number;

        /** Generates an empty space, measured in pixels, between a tooltip's top/bottom border and its text. */
        paddingTopBottom?: number;

        /**
 * Specifies the precision of formatted values in a tooltip.
 * @deprecated Use the tooltip.format.precision option instead.
 */
        precision?: number;

        /** Configures a tooltip's shadow. */
        shadow?: {

            /** Specifies the blur distance of a tooltip's shadow. The larger the value, the blurrier the shadow's edge. */
            blur?: number;

            /** Colors a tooltip's shadow. */
            color?: string;

            /** Specifies the horizontal offset of a tooltip's shadow relative to the tooltip itself. Measured in pixels. */
            offsetX?: number;

            /** Specifies the vertical offset of a tooltip's shadow relative to the tooltip itself. Measured in pixels. */
            offsetY?: number;

            /** Specifies the transparency of a tooltip's shadow. */
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
        /** Makes all the legend's corners rounded. */
        cornerRadius?: number;
    }

    export interface BreakStyle {

        
        width?: number;
        
        color?: string;

        
        line?: string;
    }

    export interface ScaleBreak {
        
        startValue?: any;

        
        endValue?: any;
    }

    export interface BaseLegend {
        /** Colors the legend's background. */
        backgroundColor?: string;

        /** Configures the legend's border. */
        border?: viz.core.LegendBorder;

        /** Arranges legend items into several columns. */
        columnCount?: number;

        /** Specifies an empty space between item columns in pixels. */
        columnItemSpacing?: number;

        /** Specifies the legend items' font options. */
        font?: viz.core.Font;

        /** Along with verticalAlignment, specifies the legend's position. */
        horizontalAlignment?: string;

        /** Aligns items in the last column or row (depending on the legend's orientation). Applies when legend items are not divided into columns or rows equally. */
        itemsAlignment?: string;

        /** Specifies the text's position relative to the marker in a legend item. */
        itemTextPosition?: string;

        /** Generates an empty space, measured in pixels, around the legend. */
        margin?: viz.core.Margins;

        /** Specifies the marker's size in a legend item in pixels. */
        markerSize?: number;

        /** Arranges legend items vertically (in a column) or horizontally (in a row). The default value is "horizontal" if the legend.horizontalAlignment is "center". Otherwise, it is "vertical". */
        orientation?: string;

        /** Generates an empty space, measured in pixels, between the legend's left/right border and its items. */
        paddingLeftRight?: number;

        /** Generates an empty space, measured in pixels, between the legend's top/bottom border and its items. */
        paddingTopBottom?: number;

        /** Arranges legend items in several rows. */
        rowCount?: number;

        /** Specifies an empty space between item rows in pixels. */
        rowItemSpacing?: number;

        /** Along with horizontalAlignment, specifies the legend's position. */
        verticalAlignment?: string;

        /** Specifies the legend's visibility. */
        visible?: boolean;
    }

    export interface BaseWidgetOptions extends DOMComponentOptionsBase {
        
        

        

        /** Specifies the widget's size in pixels. */
        size?: Size;

        /** A handler for the drawn event. Executed when the widget has finished drawing itself. */
        onDrawn?: (e: {
            component: BaseWidget;
            element: Element;
        }) => void;

        /** A handler for the incidentOccurred event. Executed when an error or warning appears in the widget. */
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

        /** A handler for the exporting event. Executed before data from the widget is exported. */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
            format: string;
        }) => void;

        /** A handler for the fileSaving event. Executed before a file with exported data is saved on the user's local storage. */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** A handler for the exported event. Executed after data from the widget is exported. */
        onExported?: (e: any) => void;

        /** Notifies the widget that it is embedded into an HTML page that uses a tag modifying the path. */
        pathModified?: boolean;

        /** Switches the widget to a right-to-left representation. */
        rtlEnabled?: boolean;

        /** Sets the name of the theme the widget uses. */
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


