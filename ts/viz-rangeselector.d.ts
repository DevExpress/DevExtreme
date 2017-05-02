/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.rangeSelector {

    export interface dxRangeSelectorOptions extends viz.core.BaseWidgetOptions, viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** @docid_ignore dxrangeselectoroptions_tooltip */

        /** @docid dxrangeselectoroptions_background */
        background?: {

            /** @docid dxrangeselectoroptions_background_color */
            color?: string;

            /** @docid dxrangeselectoroptions_background_image */
            image?: {

                /** @docid dxrangeselectoroptions_background_image_location */
                location?: string;

                /** @docid dxrangeselectoroptions_background_image_url */
                url?: string;
            };

            /** @docid dxrangeselectoroptions_background_visible */
            visible?: boolean;
        };

        /** @docid dxrangeselectoroptions_behavior */
        behavior?: {

            /** @docid dxrangeselectoroptions_behavior_allowslidersswap */
            allowSlidersSwap?: boolean;

            /** @docid dxrangeselectoroptions_behavior_animationenabled */
            animationEnabled?: boolean;

            /** @docid dxrangeselectoroptions_behavior_callselectedrangechanged */
            callSelectedRangeChanged?: string;

            /** @docid dxrangeselectoroptions_behavior_callvaluechanged */
            callValueChanged?: string;

            /** @docid dxrangeselectoroptions_behavior_manualrangeselectionenabled */
            manualRangeSelectionEnabled?: boolean;

            /** @docid dxrangeselectoroptions_behavior_moveselectedrangebyclick */
            moveSelectedRangeByClick?: boolean;

            /** @docid dxrangeselectoroptions_behavior_snaptoticks */
            snapToTicks?: boolean;
        };

        /** @docid dxrangeselectoroptions_chart */
        chart?: {

            /** @docid dxrangeselectoroptions_chart_bottomindent */
            bottomIndent?: number;

            /** @docid dxrangeselectoroptions_chart_commonseriessettings */
            commonSeriesSettings?: viz.charts.CommonSeriesSettings;

            /** @docid dxrangeselectoroptions_chart_dataPrepareSettings */
            dataPrepareSettings?: {

                /** @docid dxrangeselectoroptions_chart_dataPrepareSettings_checkTypeForAllData */
                checkTypeForAllData?: boolean;

                /** @docid dxrangeselectoroptions_chart_dataPrepareSettings_convertToAxisDataType */
                convertToAxisDataType?: boolean;

                /** @docid dxrangeselectoroptions_chart_dataPrepareSettings_sortingMethod */
                sortingMethod?: any;
            };

            /** @docid dxrangeselectoroptions_chart_equalbarwidth */
            equalBarWidth?: boolean;

            /** @docid dxrangeselectoroptions_chart_barwidth */
            barWidth?: number;

            /** @docid dxrangeselectoroptions_chart_negativesaszeroes */
            negativesAsZeroes?: boolean;

            /** @docid dxrangeselectoroptions_chart_palette */
            palette?: any;

            /** @docid dxrangeselectoroptions_chart_series */
            series?: Array<viz.charts.SeriesConfig>;

            /** @docid dxrangeselectoroptions_chart_seriestemplate */
            seriesTemplate?: viz.charts.SeriesTemplate;

            /** @docid dxrangeselectoroptions_chart_topindent */
            topIndent?: number;

            /** @docid dxrangeselectoroptions_chart_useAggregation */
            useAggregation?: boolean;

            /** @docid dxrangeselectoroptions_chart_valueaxis */
            valueAxis?: {

                /** @docid dxrangeselectoroptions_chart_valueaxis_inverted */
                inverted?: boolean;

                /** @docid dxrangeselectoroptions_chart_valueaxis_logarithmbase */
                logarithmBase?: number;

                /** @docid dxrangeselectoroptions_chart_valueaxis_max */
                max?: number;

                /** @docid dxrangeselectoroptions_chart_valueaxis_min */
                min?: number;

                /** @docid dxrangeselectoroptions_chart_valueaxis_type */
                type?: string;

                /** @docid dxrangeselectoroptions_chart_valueaxis_valuetype */
                valueType?: string;
            };
        };

        /** @docid dxrangeselectoroptions_containerbackgroundcolor */
        containerBackgroundColor?: string;

        /** @docid dxrangeselectoroptions_datasource */
        dataSource?: any;

        /** @docid dxrangeselectoroptions_datasourcefield */
        dataSourceField?: string;

        /** @docid dxrangeselectoroptions_scale */
        scale?: {

            /** @docid dxrangeselectoroptions_scale_endvalue */
            endValue?: any;

            /** @docid dxrangeselectoroptions_scale_label */
            label?: {

                /** @docid dxrangeselectoroptions_scale_label_customizetext */
                customizeText?: (scaleValue: { value: any; valueText: string; }) => string;

                /** @docid dxrangeselectoroptions_scale_label_font */
                font?: viz.core.Font;

                /** @docid dxrangeselectoroptions_scale_label_format */
                format?: any;

                /** @docid dxrangeselectoroptions_scale_label_precision */
                precision?: number;

                /** @docid dxrangeselectoroptions_scale_label_topindent */
                topIndent?: number;

                /** @docid dxrangeselectoroptions_scale_label_visible */
                visible?: boolean;

                /** @docid dxrangeselectoroptions_scale_label_overlappingbehavior */
                overlappingBehavior?: string;
            };

            /** @docid dxrangeselectoroptions_scale_logarithmbase */
            logarithmBase?: number;

            /** @docid dxrangeselectoroptions_scale_majortickinterval */
            majorTickInterval?: any;

            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_years */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_months */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_days */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_hours */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_minutes */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_seconds */
            /** @docid_ignore dxrangeselectoroptions_scale_majortickinterval_milliseconds */

            /** @docid dxrangeselectoroptions_scale_tickinterval */
            tickInterval?: any;

            /** @docid dxrangeselectoroptions_scale_marker */
            marker?: {

                /** @docid dxrangeselectoroptions_scale_marker_label */
                label?: {

                    /** @docid dxrangeselectoroptions_scale_marker_label_customizeText */
                    customizeText?: (markerValue: { value: any; valueText: string }) => string;

                    /** @docid dxrangeselectoroptions_scale_marker_label_format */
                    format?: any;
                };

                /** @docid dxrangeselectoroptions_scale_marker_separatorheight */
                separatorHeight?: number;

                /** @docid dxrangeselectoroptions_scale_marker_textleftindent */
                textLeftIndent?: number;

                /** @docid dxrangeselectoroptions_scale_marker_texttopindent */
                textTopIndent?: number;

                /** @docid dxrangeselectoroptions_scale_marker_topindent */
                topIndent?: number;

                /** @docid dxrangeselectoroptions_scale_marker_visible */
                visible?: boolean;
            };

            /** @docid dxrangeselectoroptions_scale_maxrange */
            maxRange?: any;

            /** @docid dxrangeselectoroptions_scale_minorTickCount */
            minorTickCount?: number;

            /** @docid dxrangeselectoroptions_scale_minortickinterval */
            minorTickInterval?: any;

            /** @docid dxrangeselectoroptions_scale_minrange */
            minRange?: any;

            /** @docid dxrangeselectoroptions_scale_placeholderheight */
            placeholderHeight?: number;

            /** @docid dxrangeselectoroptions_scale_setticksatunitbeginning */
            setTicksAtUnitBeginning?: boolean;

            /** @docid dxrangeselectoroptions_scale_showBoundaryTicks */
            showCustomBoundaryTicks?: boolean;

            /** @docid dxrangeselectoroptions_scale_showminorticks */
            showMinorTicks?: boolean;

            /** @docid dxrangeselectoroptions_scale_startvalue */
            startValue?: any;

            /** @docid dxrangeselectoroptions_scale_tick */
            tick?: {

                /** @docid dxrangeselectoroptions_scale_tick_color */
                color?: string;

                /** @docid dxrangeselectoroptions_scale_tick_opacity */
                opacity?: number;

                /** @docid dxrangeselectoroptions_scale_tick_width */
                width?: number;
            };

            /** @docid dxrangeselectoroptions_scale_minortick */
            minorTick?: {

                /** @docid dxrangeselectoroptions_scale_minortick_color */
                color?: string;

                /** @docid dxrangeselectoroptions_scale_minortick_opacity */
                opacity?: number;

                /** @docid dxrangeselectoroptions_scale_minortick_width */
                width?: number;

                /** @docid dxrangeselectoroptions_scale_minortick_visible */
                visible?: boolean;
            };

            /** @docid dxrangeselectoroptions_scale_type */
            type?: string;

            /** @docid dxrangeselectoroptions_scale_useticksautoarrangement */
            useTicksAutoArrangement?: boolean;

            /** @docid dxrangeselectoroptions_scale_valueType */
            valueType?: string;

            /** @docid dxrangeselectoroptions_scale_categories */
            categories?: Array<any>;
        };

        /** @docid dxrangeselectoroptions_selectedrange */
        selectedRange?: {

            /** @docid dxrangeselectoroptions_selectedrange_startvalue */
            startValue?: any;

            /** @docid dxrangeselectoroptions_selectedrange_endvalue */
            endValue?: any;
        };

        /** @docid dxrangeselectoroptions_value */
        value?: Array<any>;

        /** @docid dxrangeselectoroptions_selectedrangecolor */
        selectedRangeColor?: string;

        /** @docid dxrangeselectoroptions_indent */
        indent?: {
            /** @docid dxrangeselectoroptions_indent_left */
            left?: number;

            /** @docid dxrangeselectoroptions_indent_right */
            right?: number;
        };

        /** @docid dxrangeselectoroptions_onselectedrangechanged */
        onSelectedRangeChanged?: (e: {
            startValue: any;
            endValue: any;
            component: dxRangeSelector;
            element: Element;
        }) => void;

        /** @docid dxrangeselectoroptions_onvaluechanged */
        onValueChanged?: (e: {
            value: Array<any>;
            previousValue: Array<any>;
            component: dxRangeSelector;
            element: Element;
        }) => void;

        /** @docid dxrangeselectoroptions_shutter */
        shutter?: {

            /** @docid dxrangeselectoroptions_shutter_color */
            color?: string;

            /** @docid dxrangeselectoroptions_shutter_opacity */
            opacity?: number;
        };

        /** @docid dxrangeselectoroptions_sliderhandle */
        sliderHandle?: {

            /** @docid dxrangeselectoroptions_sliderhandle_color */
            color?: string;

            /** @docid dxrangeselectoroptions_sliderhandle_opacity */
            opacity?: number;

            /** @docid dxrangeselectoroptions_sliderhandle_width */
            width?: number;
        };

        /** @docid dxrangeselectoroptions_slidermarker */
        sliderMarker?: {

            /** @docid dxrangeselectoroptions_slidermarker_color */
            color?: string;

            /** @docid dxrangeselectoroptions_slidermarker_customizetext */
            customizeText?: (scaleValue: { value: any; valueText: any; }) => string;

            /** @docid dxrangeselectoroptions_slidermarker_font */
            font?: viz.core.Font;

            /** @docid dxrangeselectoroptions_slidermarker_format */
            format?: any;

            /** @docid dxrangeselectoroptions_slidermarker_invalidrangecolor */
            invalidRangeColor?: string;

            /** @docid dxrangeselectoroptions_slidermarker_padding */
            padding?: number;

            /** @docid dxrangeselectoroptions_slidermarker_paddingtopbottom */
            paddingTopBottom?: number;

            /** @docid dxrangeselectoroptions_slidermarker_paddingleftright */
            paddingLeftRight?: number;

            /** @docid dxrangeselectoroptions_slidermarker_placeholderHeight */
            placeholderHeight?: number;

            /** @docid dxrangeselectoroptions_slidermarker_placeholdersize */
            placeholderSize?: {

                /** @docid dxrangeselectoroptions_slidermarker_placeholdersize_height */
                height?: number;

                /** @docid dxrangeselectoroptions_slidermarker_placeholdersize_width */
                width?: {

                    /** @docid dxrangeselectoroptions_slidermarker_placeholdersize_width_left */
                    left?: number;

                    /** @docid dxrangeselectoroptions_slidermarker_placeholdersize_width_right */
                    right?: number;
                };
            };

            /** @docid dxrangeselectoroptions_slidermarker_precision */
            precision?: number;

            /** @docid dxrangeselectoroptions_slidermarker_visible */
            visible?: boolean;
        };

    }

}

declare module DevExpress.viz {
    /** @docid dxrangeselector */
    export class dxRangeSelector extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions);
        constructor(element: Element, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid dxrangeselectormethods_render */
        render(skipChartAnimation?: boolean): void;

        /** @docid dxrangeselectormethods_getSelectedRange */
        getSelectedRange(): { startValue: any; endValue: any; };

        /** @docid dxrangeselectormethods_setSelectedRange */
        setSelectedRange(selectedRange: { startValue: any; endValue: any; }): void;

        /** @docid dxrangeselectormethods_getValue */
        getValue(): Array<any>;

        /** @docid dxrangeselectormethods_setValue */
        setValue(value: Array<any>): void;

        /** @docid dxrangeselectormethods_getdatasource */
        getDataSource(): DevExpress.data.DataSource;
    }
}
