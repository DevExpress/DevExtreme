/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.rangeSelector {

    export interface dxRangeSelectorOptions extends viz.core.BaseWidgetOptions, viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        

        /** Specifies the options for the range selector's background. */
        background?: {

            /** Specifies the background color for the RangeSelector. */
            color?: string;

            /** Specifies image options. */
            image?: {

                /** Specifies a location for the image in the background of a range selector. */
                location?: string;

                /** Specifies the image's URL. */
                url?: string;
            };

            /** Indicates whether or not the background (background color and/or image) is visible. */
            visible?: boolean;
        };

        /** Specifies the RangeSelector's behavior options. */
        behavior?: {

            /** Indicates whether or not you can swap sliders. */
            allowSlidersSwap?: boolean;

            /** Indicates whether or not animation is enabled. */
            animationEnabled?: boolean;

            /**
            * Specifies when to call the onSelectedRangeChanged function.
            * @deprecated Use the callValueChanged option instead.
            */
            callSelectedRangeChanged?: string;

            /** Specifies when to call the onValueChanged function. */
            callValueChanged?: string;

            /** Indicates whether or not an end user can specify the range using a mouse, without the use of sliders. */
            manualRangeSelectionEnabled?: boolean;

            /** Indicates whether or not an end user can shift the selected range to the required location on a scale by clicking. */
            moveSelectedRangeByClick?: boolean;

            /** Indicates whether to snap a slider to ticks. */
            snapToTicks?: boolean;
        };

        /** Specifies the options required to display a chart as the range selector's background. */
        chart?: {

            /** Specifies a coefficient for determining an indent from the bottom background boundary to the lowest chart point. */
            bottomIndent?: number;

            /** An object defining the common configuration options for the chart’s series. */
            commonSeriesSettings?: viz.charts.CommonSeriesSettings;

            /** An object providing options for managing data from a data source. */
            dataPrepareSettings?: {

                /** Specifies whether or not to validate values from a data source. */
                checkTypeForAllData?: boolean;

                /** Specifies whether or not to convert the values from a data source into the data type of an axis. */
                convertToAxisDataType?: boolean;

                /** Specifies how to sort series points. */
                sortingMethod?: any;
            };

            /** Specifies whether all bars in a series must have the same width, or may have different widths if any points in other series are missing. */
            equalBarWidth?: boolean;

            /** Specifies a common bar width as a percentage from 0 to 1. */
            barWidth?: number;

            /** Forces the widget to treat negative values as zeroes. Applies to stacked-like series only. */
            negativesAsZeroes?: boolean;

            /** Sets the name of the palette to be used in the range selector's chart. Alternatively, an array of colors can be set as a custom palette to be used within this chart. */
            palette?: any;

            /** An object defining the chart’s series. */
            series?: Array<viz.charts.SeriesConfig>;

            /** Defines options for the series template. */
            seriesTemplate?: viz.charts.SeriesTemplate;

            /** Specifies a coefficient for determining an indent from the background's top boundary to the topmost chart point. */
            topIndent?: number;

            /** Specifies whether or not to filter the series points depending on their quantity. */
            useAggregation?: boolean;

            /** Configures the chart value axis. */
            valueAxis?: {

                /** Indicates whether or not the chart's value axis must be inverted. */
                inverted?: boolean;

                /** Specifies the value to be raised to a power when generating ticks for a logarithmic value axis. */
                logarithmBase?: number;

                /** Specifies the maximum value of the chart's value axis. */
                max?: number;

                /** Specifies the minimum value of the chart's value axis. */
                min?: number;

                /** Specifies the type of the value axis. */
                type?: string;

                /** Specifies the desired type of axis values. */
                valueType?: string;
            };
        };

        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;

        /** Specifies a data source for the scale values and for the chart at the background. */
        dataSource?: any;

        /** Specifies the data source field that provides data for the scale. */
        dataSourceField?: string;

        /** Specifies options of the range selector's scale. */
        scale?: {

            /** Specifies the scale's end value. */
            endValue?: any;

            /** Specifies common options for scale labels. */
            label?: {

                /** Specifies a callback function that returns the text to be displayed in scale labels. */
                customizeText?: (scaleValue: { value: any; valueText: string; }) => string;

                /** Specifies font options for the text displayed in the range selector's scale labels. */
                font?: viz.core.Font;

                /** Specifies a format for the text displayed in scale labels. */
                format?: any;

                /**
                 * Specifies a precision for the formatted value displayed in the scale labels.
                 * @deprecated Use the scale.label.format.precision option instead.
                 */
                precision?: number;

                /** Specifies a spacing between scale labels and the background bottom edge. */
                topIndent?: number;

                /** Specifies whether or not the scale's labels are visible. */
                visible?: boolean;

                /** Decides how to arrange scale labels when there is not enough space to keep all of them. */
                overlappingBehavior?: string;
            };

            /** Specifies the value to be raised to a power when generating ticks for a logarithmic scale. */
            logarithmBase?: number;

            /**
            * Specifies an interval between major ticks.
            * @deprecated Use the tickInterval option instead.
            */
            majorTickInterval?: any;

            
            /** Specifies an interval between axis ticks. */
            tickInterval?: any;

            /** Specifies options for the date-time scale's markers. */
            marker?: {

                /** Defines the options that can be set for the text that is displayed by the scale markers. */
                label?: {

                    /** Specifies a callback function that returns the text to be displayed in scale markers. */
                    customizeText?: (markerValue: { value: any; valueText: string }) => string;

                    /** Specifies a format for the text displayed in scale markers. */
                    format?: any;
                };

                /** Specifies the height of the marker's separator. */
                separatorHeight?: number;

                /** Specifies the space between the marker label and the marker separator. */
                textLeftIndent?: number;

                /** Specifies the space between the marker's label and the top edge of the marker's separator. */
                textTopIndent?: number;

                /** Specified the indent between the marker and the scale labels. */
                topIndent?: number;

                /** Indicates whether scale markers are visible. */
                visible?: boolean;
            };

            /** Specifies the maximum range that can be selected. */
            maxRange?: any;

            /** Specifies the number of minor ticks between neighboring major ticks. */
            minorTickCount?: number;

            /** Specifies an interval between minor ticks. */
            minorTickInterval?: any;

            /** Specifies the minimum range that can be selected. */
            minRange?: any;

            /** Specifies the height of the space reserved for the scale in pixels. */
            placeholderHeight?: number;

            /** Indicates whether or not to set ticks of a date-time scale at the beginning of each date-time interval. */
            setTicksAtUnitBeginning?: boolean;

            /** Specifies whether or not to show ticks for the boundary scale values, when neither major ticks nor minor ticks are created for these values. */
            showCustomBoundaryTicks?: boolean;

            /**
             * Indicates whether or not to show minor ticks on the scale.
             * @deprecated Use the minorTick.visible option instead.
             */
            showMinorTicks?: boolean;

            /** Specifies the scale's start value. */
            startValue?: any;

            /** Specifies options defining the appearance of scale ticks. */
            tick?: {

                /** Specifies the color of scale ticks (both major and minor ticks). */
                color?: string;

                /** Specifies the opacity of scale ticks (both major and minor ticks). */
                opacity?: number;

                /** Specifies the width of the scale's ticks (both major and minor ticks). */
                width?: number;
            };

            /** Specifies options of the range selector's minor ticks. */
            minorTick?: {

                /** Specifies the color of the scale's minor ticks. */
                color?: string;

                /** Specifies the opacity of the scale's minor ticks. */
                opacity?: number;

                /** Specifies the width of the scale's minor ticks. */
                width?: number;

                /** Indicates whether scale minor ticks are visible or not. */
                visible?: boolean;
            };

            /** Specifies the type of the scale. */
            type?: string;

            /**
            * Specifies whether or not to expand the current tick interval if labels overlap each other.
            * @deprecated Use the overlappingBehavior option instead.
            */
            useTicksAutoArrangement?: boolean;

            /** Specifies the type of values on the scale. */
            valueType?: string;

            /** Specifies the order of arguments on a discrete scale. */
            categories?: Array<any>;
        };

        /**
         * Specifies the range to be selected when displaying the RangeSelector.
         * @deprecated Use the value option instead.
         */
        selectedRange?: {

            /** Specifies the start value of the range to be selected when displaying the RangeSelector widget on a page. */
            startValue?: any;

            /** Specifies the end value of the range to be selected when displaying the RangeSelector widget on a page. */
            endValue?: any;
        };

        /** The selected range, initial or current. */
        value?: Array<any>;

        /** Specifies the color of the selected range. */
        selectedRangeColor?: string;

        /** Range selector's indent options. */
        indent?: {
            /** Specifies range selector's left indent. */
            left?: number;

            /** Specifies range selector's right indent. */
            right?: number;
        };

        /**
        * A handler for the selectedRangeChanged event.
        * @deprecated Use the onValueChanged option instead.
        */
        onSelectedRangeChanged?: (e: {
            startValue: any;
            endValue: any;
            component: dxRangeSelector;
            element: Element;
        }) => void;

        /** A handler for the valueChanged event. */
        onValueChanged?: (e: {
            value: Array<any>;
            previousValue: Array<any>;
            component: dxRangeSelector;
            element: Element;
        }) => void;

        /** Specifies range selector shutter options. */
        shutter?: {

            /** Specifies shutter color. */
            color?: string;

            /** Specifies the opacity of the color of shutters. */
            opacity?: number;
        };

        /** Specifies the appearance of the range selector's slider handles. */
        sliderHandle?: {

            /** Specifies the color of the slider handles. */
            color?: string;

            /** Specifies the opacity of the slider handles. */
            opacity?: number;

            /** Specifies the width of the slider handles. */
            width?: number;
        };

        /** Defines the options of the range selector slider markers. */
        sliderMarker?: {

            /** Specifies the color of the slider markers. */
            color?: string;

            /** Specifies a callback function that returns the text to be displayed by slider markers. */
            customizeText?: (scaleValue: { value: any; valueText: any; }) => string;

            /** Specifies font options for the text displayed by the range selector slider markers. */
            font?: viz.core.Font;

            /** Specifies a format for the text displayed in slider markers. */
            format?: any;

            /** Specifies the color used for the slider marker text when the currently selected range does not match the minRange and maxRange values. */
            invalidRangeColor?: string;

            /**
             * Specifies the empty space between the marker's border and the marker’s text.
             * @deprecated Use the paddingTopBottom and paddingLeftRight options instead.
             */
            padding?: number;

            /** Specifies the empty space between the marker's top and bottom borders and the marker's text. */
            paddingTopBottom?: number;

            /** Specifies the empty space between the marker's left and right borders and the marker's text. */
            paddingLeftRight?: number;

            /** Specifies the placeholder height of the slider marker. */
            placeholderHeight?: number;

            /**
            * Specifies in pixels the height and width of the space reserved for the range selector slider markers.
            * @deprecated Use the placeholderHeight and indent options instead.
            */
            placeholderSize?: {

                /** Specifies the height of the placeholder for the left and right slider markers. */
                height?: number;

                /** Specifies the width of the placeholder for the left and right slider markers. */
                width?: {

                    /** Specifies the width of the left slider marker's placeholder. */
                    left?: number;

                    /** Specifies the width of the right slider marker's placeholder. */
                    right?: number;
                };
            };

            /**
             * Specifies a precision for the formatted value displayed in slider markers.
             * @deprecated Use the sliderMarker.format.precision option instead.
             */
            precision?: number;

            /** Indicates whether or not the slider markers are visible. */
            visible?: boolean;
        };

    }

}

declare module DevExpress.viz {
    /** The RangeSelector is a widget that allows a user to select a range of values on a scale. */
    export class dxRangeSelector extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions);
        constructor(element: Element, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Redraws a widget. */
        render(skipChartAnimation?: boolean): void;

        /**
        * Returns the currently selected range.
        * @deprecated Use the getValue() method instead.
        */
        getSelectedRange(): { startValue: any; endValue: any; };

        /**
         * Sets a specified range.
         * @deprecated Use the setValue(value) method instead.
         */
        setSelectedRange(selectedRange: { startValue: any; endValue: any; }): void;

        /** Gets the currently selected range. */
        getValue(): Array<any>;

        /** Selects a specific range. */
        setValue(value: Array<any>): void;

        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
}
