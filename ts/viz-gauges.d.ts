/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.gauges {

    export interface BaseRangeContainer {
        /** @docid basegaugeoptions_rangeContainer_backgroundColor */
        backgroundColor?: string;

        /** @docid basegaugeoptions_rangeContainer_offset */
        offset?: number;

        /** @docid basegaugeoptions_rangeContainer_palette */
        palette?: any;

        /** @docid basegaugeoptions_rangeContainer_ranges */
        ranges?: Array<{ startValue: number; endValue: number; color: string }>;

        /** @docid basegaugeoptions_rangeContainer_ranges_color */
        color?: string;

        /** @docid basegaugeoptions_rangeContainer_ranges_endValue */
        endValue?: number;

        /** @docid basegaugeoptions_rangeContainer_ranges_startValue */
        startValue?: number;
    }

    export interface ScaleTick {
        /**
          * @docid basegaugeoptions_scale_majorTick_color
          * @docid basegaugeoptions_scale_minorTick_color
          */
        color?: string;

        /**
          * @docid basegaugeoptions_scale_majorTick_customTickValues
          * @docid basegaugeoptions_scale_minorTick_customTickValues
          */
        customTickValues?: Array<any>;

        /**
          * @docid basegaugeoptions_scale_majorTick_length
          * @docid basegaugeoptions_scale_minorTick_length
          */
        length?: number;

        /**
          * @docid basegaugeoptions_scale_majorTick_showCalculatedTicks
          * @docid basegaugeoptions_scale_minorTick_showCalculatedTicks
          */
        showCalculatedTicks?: boolean;

        /**
          * @docid basegaugeoptions_scale_majorTick_tickInterval
          * @docid basegaugeoptions_scale_minorTick_tickInterval
          */
        tickInterval?: number;

        /**
          * @docid basegaugeoptions_scale_majorTick_visible
          * @docid basegaugeoptions_scale_minorTick_visible
          */
        visible?: boolean;

        /**
          * @docid basegaugeoptions_scale_majorTick_width
          * @docid basegaugeoptions_scale_minorTick_width
          */
        width?: number;
    }

    export interface ScaleMajorTick extends ScaleTick {
        /** @docid basegaugeoptions_scale_majorTick_useTicksAutoArrangement */
        useTicksAutoArrangement?: boolean;
    }

    export interface ScaleMinorTick extends ScaleTick {
        /** @docid basegaugeoptions_scale_minorTick_opacity */
        opacity?: number;
    }

    export interface BaseScaleLabel {
        /** @docid basegaugeoptions_scale_label_useRangeColors */
        useRangeColors?: boolean;

        /** @docid basegaugeoptions_scale_label_customizeText */
        customizeText?: (scaleValue: { value: number; valueText: string }) => string;

        /** @docid basegaugeoptions_scale_label_overlappingBehavior */
        overlappingBehavior?: {
            /** @docid basegaugeoptions_scale_label_overlappingBehavior_useAutoArrangement */
            useAutoArrangement?: boolean;

            /** @docid basegaugeoptions_scale_label_overlappingBehavior_hideFirstOrLast */
            hideFirstOrLast?: string;
        };

        /** @docid basegaugeoptions_scale_label_font */
        font?: viz.core.Font;

        /** @docid basegaugeoptions_scale_label_format */
        format?: any;

        /** @docid basegaugeoptions_scale_label_precision */
        precision?: number;

        /** @docid basegaugeoptions_scale_label_visible */
        visible?: boolean;
    }

    export interface BaseScale {
        /** @docid basegaugeoptions_scale_endValue */
        endValue?: number;

        /** @docid basegaugeoptions_scale_hideFirstLabel */
        hideFirstLabel?: boolean;

        /** @docid basegaugeoptions_scale_hideFirstTick */
        hideFirstTick?: boolean;

        /** @docid basegaugeoptions_scale_hideLastLabel */
        hideLastLabel?: boolean;

        /** @docid basegaugeoptions_scale_hideLastTick */
        hideLastTick?: boolean;

        /** @docid basegaugeoptions_scale_tickInterval */
        tickInterval?: number;

        /** @docid basegaugeoptions_scale_minorTickInterval */
        minorTickInterval?: number;

        /** @docid basegaugeoptions_scale_customTicks */
        customTicks?: Array<any>;

        /** @docid basegaugeoptions_scale_customMinorTicks */
        customMinorTicks?: Array<any>;

        /**
          * @docid basegaugeoptions_scale_label
          * @docid dxlineargaugeoptions_scale_label
          * @docid dxcirculargaugeoptions_scale_label
          */
        label?: BaseScaleLabel;

        /** @docid basegaugeoptions_scale_majorTick */
        majorTick?: ScaleMajorTick;

        /** @docid basegaugeoptions_scale_tick */
        tick?: {
            /** @docid basegaugeoptions_scale_tick_color */
            color?: string;

            /** @docid basegaugeoptions_scale_tick_length */
            length?: number;

            /** @docid basegaugeoptions_scale_tick_visible */
            visible?: boolean;

            /** @docid basegaugeoptions_scale_tick_width */
            width?: number;

            /** @docid basegaugeoptions_scale_tick_opacity */
            opacity?: number;
        };

        /** @docid basegaugeoptions_scale_minorTick */
        minorTick?: ScaleMinorTick;

        /** @docid basegaugeoptions_scale_startValue */
        startValue?: number;
    }

    /**
      * @docid_ignore commonIndicator
      * @docid_ignore circularRectangleNeedle
      * @docid_ignore circularTriangleNeedle
      * @docid_ignore circularTwoColorNeedle
      * @docid_ignore circularRangeBar
      * @docid_ignore circularTriangleMarker
      * @docid_ignore circularTextCloud
      * @docid_ignore linearRectangle
      * @docid_ignore linearCircle
      * @docid_ignore linearRhombus
      * @docid_ignore linearRangeBar
      * @docid_ignore linearTriangleMarker
      * @docid_ignore linearTextCloud
      */

    export interface BaseValueIndicator {
        /**
          * @docid dxcirculargaugeoptions_valueIndicator_type
          * @docid dxcirculargaugeoptions_subvalueIndicator_type
          * @docid dxlineargaugeoptions_valueIndicator_type
          * @docid dxlineargaugeoptions_subvalueIndicator_type
          */
        type?: string;

        /** @docid commonIndicatoroptions_backgroundColor */
        backgroundColor?: string;

        /** @docid commonIndicatoroptions_baseValue */
        baseValue?: number;

        /** @docid commonIndicatoroptions_color */
        color?: string;

        /** @docid commonIndicatoroptions_size */
        size?: number;

        /**
          * @docid commonIndicatoroptions_text
          * @docid circularTextCloudoptions_text
          * @docid linearTextCloudoptions_text
          */
        text?: {

            /** @docid commonIndicatoroptions_text_customizeText */
            customizeText?: (indicatedValue: { value: number; valueText: string }) => string;

            /**
              * @docid commonIndicatoroptions_text_font
              * @docid linearTextCloudoptions_text_font
              * @docid circularTextCloudoptions_text_font
              */
            font?: viz.core.Font;

            /** @docid commonIndicatoroptions_text_format */
            format?: any;

            /** @docid commonIndicatoroptions_text_indent */
            indent?: number;

            /** @docid commonIndicatoroptions_text_precision */
            precision?: number;
        };

        /**
          * @docid commonIndicatoroptions_offset
          * @docid linearRectangleoptions_offset
          * @docid linearCircleoptions_offset
          * @docid linearRhombusoptions_offset
          * @docid linearRangeBaroptions_offset
          * @docid linearTriangleMarkeroptions_offset
          * @docid linearTextCloudoptions_offset
          */
        offset?: number;

        /**
          * @docid commonIndicatoroptions_length
          * @docid circularTriangleMarkeroptions_length
          * @docid linearTriangleMarkeroptions_length
          */
        length?: number;

        /**
          * @docid commonIndicatoroptions_width
          * @docid linearRectangleoptions_width
          * @docid linearRhombusoptions_width
          * @docid circularTriangleMarkeroptions_width
          * @docid linearTriangleMarkeroptions_width
          */
        width?: number;

        /** @docid commonIndicatoroptions_arrowLength */
        arrowLength?: number;

        /** @docid commonIndicatoroptions_palette */
        palette?: any;

        /** @docid commonIndicatoroptions_indentFromCenter */
        indentFromCenter?: number;

        /** @docid commonIndicatoroptions_secondColor */
        secondColor?: string;

        /** @docid commonIndicatoroptions_secondFraction */
        secondFraction?: number;

        /** @docid commonIndicatoroptions_spindleSize */
        spindleSize?: number;

        /** @docid commonIndicatoroptions_spindleGapSize */
        spindleGapSize?: number;

        /** @docid commonIndicatoroptions_horizontalOrientation */
        horizontalOrientation?: string;

        /** @docid commonIndicatoroptions_verticalOrientation */
        verticalOrientation?: string;
    }

    export interface SharedGaugeOptions extends viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /**
          * @docid_ignore basegaugeoptions_title
          * @docid_ignore dxbargaugeoptions_title
          * @docid_ignore basegaugeoptions_title_position
          * @docid_ignore dxbargaugeoptions_title_position
          */

        /**
          * @docid basegaugeoptions_animation
          * @docid dxbargaugeoptions_animation
          */
        animation?: viz.core.Animation;

        /**
          * @docid basegaugeoptions_subtitle
          * @docid dxbargaugeoptions_subtitle
          */
        subtitle?: {

            /** @docid basegaugeoptions_subtitle_font */
            font?: viz.core.Font;

            /** @docid basegaugeoptions_subtitle_text */
            text?: string;
        };

        /**
          * @docid basegaugeoptions_tooltip
          * @docid dxbargaugeoptions_tooltip
          */
        tooltip?: viz.core.Tooltip;

        /**
          * @docid basegaugeoptions_ontooltipshown
          * @docid dxbargaugeoptions_ontooltipshown
          */
        onTooltipShown?: (e: {
            component: dxBaseGauge;
            element: Element;
            target: {};
        }) => void;

        /**
          * @docid basegaugeoptions_ontooltiphidden
          * @docid dxbargaugeoptions_ontooltiphidden
          */
        onTooltipHidden?: (e: {
            component: dxBaseGauge;
            element: Element;
            target: {};
        }) => void;
    }

    export interface BaseGaugeOptions extends viz.core.BaseWidgetOptions, SharedGaugeOptions {
        /** @docid basegaugeoptions_containerBackgroundColor */
        containerBackgroundColor?: string;

        /** @docid basegaugeoptions_rangeContainer */
        rangeContainer?: BaseRangeContainer;

        /**
          * @docid basegaugeoptions_scale
          * @docid dxlineargaugeoptions_scale
          * @docid dxcirculargaugeoptions_scale
          */
        scale?: BaseScale;

        /**
          * @docid dxlineargaugeoptions_subvalueIndicator
          * @docid dxcirculargaugeoptions_subvalueIndicator
          */
        subvalueIndicator?: BaseValueIndicator;

        /** @docid basegaugeoptions_subvalues */
        subvalues?: Array<number>;

        /** @docid basegaugeoptions_value */
        value?: number;

        /**
          * @docid dxlineargaugeoptions_valueIndicator
          * @docid dxcirculargaugeoptions_valueIndicator
          */
        valueIndicator?: BaseValueIndicator;
    }

    /** @docid basegauge */
    export class dxBaseGauge extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid basegaugemethods_value#value() */
        value(): number;

        /** @docid basegaugemethods_value#value(value) */
        value(value: number): void;

        /** @docid basegaugemethods_subvalues#subvalues() */
        subvalues(): Array<number>;

        /** @docid basegaugemethods_subvalues#subvalues(subvalues) */
        subvalues(subvalues: Array<number>): void;
    }

    // LinearGauge

    export interface LinearRangeContainer extends BaseRangeContainer {
        /** @docid dxlineargaugeoptions_rangeContainer_horizontalOrientation */
        horizontalOrientation?: string;

        /** @docid dxlineargaugeoptions_rangeContainer_verticalOrientation */
        verticalOrientation?: string;

        /** @docid dxlineargaugeoptions_rangeContainer_width */
        width?: any;

        /** @docid dxlineargaugeoptions_rangeContainer_width_end */
        end?: number;

        /** @docid dxlineargaugeoptions_rangeContainer_width_start */
        start?: number;
    }

    export interface LinearScaleLabel extends BaseScaleLabel {
        /** @docid dxlineargaugeoptions_scale_label_indentFromTick */
        indentFromTick?: number;
    }

    export interface LinearScale extends BaseScale {

        /** @docid dxlineargaugeoptions_scale_horizontalOrientation */
        horizontalOrientation?: string;

        label?: LinearScaleLabel;

        /** @docid dxlineargaugeoptions_scale_verticalOrientation */
        verticalOrientation?: string;
    }

    export interface dxLinearGaugeOptions extends BaseGaugeOptions {
        /** @docid dxlineargaugeoptions_geometry */
        geometry?: {

            /** @docid dxlineargaugeoptions_geometry_orientation */
            orientation?: string;
        };

        /** @docid dxlineargaugeoptions_rangeContainer */
        rangeContainer?: LinearRangeContainer;

        scale?: LinearScale;
    }

    // CircularGauge

    export interface CircularRangeContainer extends BaseRangeContainer {
        /** @docid dxcirculargaugeoptions_rangeContainer_orientation */
        orientation?: string;

        /** @docid dxcirculargaugeoptions_rangeContainer_width */
        width?: number;
    }

    export interface CircularScaleLabel extends BaseScaleLabel {
        /** @docid dxcirculargaugeoptions_scale_label_indentFromTick */
        indentFromTick?: number;
    }

    export interface CircularScale extends BaseScale {
        label?: CircularScaleLabel;

        /** @docid dxcirculargaugeoptions_scale_orientation */
        orientation?: string;
    }

    export interface dxCircularGaugeOptions extends BaseGaugeOptions {
        /** @docid dxcirculargaugeoptions_geometry */
        geometry?: {

            /** @docid dxcirculargaugeoptions_geometry_endAngle */
            endAngle?: number;

            /** @docid dxcirculargaugeoptions_geometry_startAngle */
            startAngle?: number;
        };

        /** @docid dxcirculargaugeoptions_rangeContainer */
        rangeContainer?: CircularRangeContainer;

        scale?: CircularScale;
    }

    // dxBarGauge

    export interface dxBarGaugeOptions extends viz.core.BaseWidgetOptions, SharedGaugeOptions {
        /** @docid dxbargaugeoptions_backgroundColor */
        backgroundColor?: string;

        /** @docid dxbargaugeoptions_barSpacing */
        barSpacing?: number;

        /** @docid dxbargaugeoptions_baseValue */
        baseValue?: number;

        /** @docid dxbargaugeoptions_endValue */
        endValue?: number;

        /** @docid dxbargaugeoptions_geometry */
        geometry?: {

            /** @docid dxbargaugeoptions_geometry_endAngle */
            endAngle?: number;

            /** @docid dxbargaugeoptions_geometry_startAngle */
            startAngle?: number;
        };

        /** @docid dxbargaugeoptions_label */
        label?: {

            /** @docid dxbargaugeoptions_label_connectorColor */
            connectorColor?: string;

            /** @docid dxbargaugeoptions_label_connectorWidth */
            connectorWidth?: number;

            /** @docid dxbargaugeoptions_label_customizeText */
            customizeText?: (barValue: { value: number; valueText: string }) => string;

            /** @docid dxbargaugeoptions_label_font */
            font?: viz.core.Font;

            /** @docid dxbargaugeoptions_label_format */
            format?: any;

            /** @docid dxbargaugeoptions_label_indent */
            indent?: number;

            /** @docid dxbargaugeoptions_label_precision */
            precision?: number;

            /** @docid dxbargaugeoptions_label_visible */
            visible?: boolean;
        };

        /** @docid dxbargaugeoptions_palette */
        palette?: any;

        /** @docid dxbargaugeoptions_relativeInnerRadius */
        relativeInnerRadius?: number;

        /** @docid dxbargaugeoptions_startValue */
        startValue?: number;

        /** @docid dxbargaugeoptions_values */
        values?: Array<number>;
    }
}

declare module DevExpress.viz {
    /** @docid dxlineargauge */
    export class dxLinearGauge extends DevExpress.viz.gauges.dxBaseGauge {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxLinearGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxLinearGaugeOptions);
    }

    /** @docid dxcirculargauge */
    export class dxCircularGauge extends DevExpress.viz.gauges.dxBaseGauge {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxCircularGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxCircularGaugeOptions);
    }

    /** @docid dxbargauge */
    export class dxBarGauge extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxBarGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxBarGaugeOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** @docid dxbargaugemethods_values#values() */
        values(): Array<number>;

        /** @docid dxbargaugemethods_values#values(newValues) */
        values(values: Array<number>): void;
    }
}
