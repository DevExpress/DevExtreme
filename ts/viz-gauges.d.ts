/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.gauges {

    export interface BaseRangeContainer {
        /** Specifies a range container's background color. */
        backgroundColor?: string;

        /** Specifies the offset of the range container from an invisible scale line in pixels. */
        offset?: number;

        /** Sets the name of the palette or an array of colors to be used for coloring the gauge range container. */
        palette?: any;

        /** An array of objects representing ranges contained in the range container. */
        ranges?: Array<{ startValue: number; endValue: number; color: string }>;

        /** Specifies a color of a range. */
        color?: string;

        /** Specifies an end value of a range. */
        endValue?: number;

        /** Specifies a start value of a range. */
        startValue?: number;
    }

    export interface ScaleTick {
        /** Specifies the color of the scale's minor ticks. */
        color?: string;

        /**
         * Specifies an array of custom minor ticks.
         * @deprecated Use the scale.customMinorTicks option instead.
         */
        customTickValues?: Array<any>;

        /** Specifies the length of the scale's minor ticks. */
        length?: number;

        /**
        * Indicates whether automatically calculated minor ticks are visible or not.
        * @deprecated This option will be removed in the near future. Its use is not recommended.
        */
        showCalculatedTicks?: boolean;

        /**
         * Specifies an interval between minor ticks.
         * @deprecated Use the scale.minorTickInterval option instead.
         */
        tickInterval?: number;

        /** Indicates whether scale minor ticks are visible or not. */
        visible?: boolean;

        /** Specifies the width of the scale's minor ticks. */
        width?: number;
    }

    export interface ScaleMajorTick extends ScaleTick {
        /**
        * Specifies whether or not to expand the current major tick interval if labels overlap each other.
        * @deprecated Use the overlappingBehavior option instead.
        */
        useTicksAutoArrangement?: boolean;
    }

    export interface ScaleMinorTick extends ScaleTick {
        /** Specifies the opacity of the scale's minor ticks. */
        opacity?: number;
    }

    export interface BaseScaleLabel {
        /** Specifies whether or not scale labels should be colored similarly to their corresponding ranges in the range container. */
        useRangeColors?: boolean;

        /** Specifies a callback function that returns the text to be displayed in scale labels. */
        customizeText?: (scaleValue: { value: number; valueText: string }) => string;

        
        /** Decides how to arrange scale labels when there is not enough space to keep all of them. */
        overlappingBehavior?: any;

        /** Specifies font options for the text displayed in the scale labels of the gauge. */
        font?: viz.core.Font;

        /** Specifies a format for the text displayed in scale labels. */
        format?: any;

        /**
           * Specifies a precision for the formatted value displayed in the scale labels.
           * @deprecated Use the scale.label.format.precision option instead.
           */
        precision?: number;

        /** Specifies whether or not scale labels are visible on the gauge. */
        visible?: boolean;
    }

    export interface BaseScale {
        /** Specifies the end value for the scale of the gauge. */
        endValue?: number;

        /**
          * Specifies whether or not to hide the first scale label.
          * @deprecated Use the scale.label.overlappingBehavior.hideFirstOrLast option instead.
          */
        hideFirstLabel?: boolean;

        /**
         * Specifies whether or not to hide the first major tick on the scale.
         * @deprecated Use the scale.label.overlappingBehavior.hideFirstOrLast option instead.
         */
        hideFirstTick?: boolean;

        /**
        * Specifies whether or not to hide the last scale label.
        * @deprecated Use the scale.label.overlappingBehavior.hideFirstOrLast option instead.
        */
        hideLastLabel?: boolean;

        /**
         * Specifies whether or not to hide the last major tick on the scale.
         * @deprecated Use the scale.label.overlappingBehavior.hideFirstOrLast option instead.
         */
        hideLastTick?: boolean;

        /** Specifies an interval between major ticks. */
        tickInterval?: number;

        /** Specifies an interval between minor ticks. */
        minorTickInterval?: number;

        /** Specifies an array of custom major ticks. */
        customTicks?: Array<any>;

        /** Specifies an array of custom minor ticks. */
        customMinorTicks?: Array<any>;

        /** Specifies common options for scale labels. */
        label?: BaseScaleLabel;

        /**
        * Specifies options of the gauge's major ticks.
        * @deprecated Use the tick option instead.
        */
        majorTick?: ScaleMajorTick;

        /** Specifies options of the gauge's major ticks. */
        tick?: {
            /** Specifies the color of the scale's major ticks. */
            color?: string;

            /** Specifies the length of the scale's major ticks. */
            length?: number;

            /** Indicates whether scale major ticks are visible or not. */
            visible?: boolean;

            /** Specifies the width of the scale's major ticks. */
            width?: number;

            /** Specifies the opacity of the scale's major ticks. */
            opacity?: number;
        };

        /** Specifies options of the gauge's minor ticks. */
        minorTick?: ScaleMinorTick;

        /** Specifies the start value for the scale of the gauge. */
        startValue?: number;
    }

    
    export interface BaseValueIndicator {
        /** Specifies the type of subvalue indicators. */
        type?: string;

        /** Specifies the background color for the indicator of the rangeBar type. */
        backgroundColor?: string;

        /** Specifies the base value for the indicator of the rangeBar type. */
        baseValue?: number;

        /** Specifies a color of the indicator. */
        color?: string;

        /** Specifies the range bar size for an indicator of the rangeBar type. */
        size?: number;

        
        text?: {

            /** Specifies a callback function that returns the text to be displayed in an indicator. */
            customizeText?: (indicatedValue: { value: number; valueText: string }) => string;

            /** Specifies font options for the text displayed by the indicator. */
            font?: viz.core.Font;

            /** Specifies a format for the text displayed in an indicator. */
            format?: any;

            /** Specifies the range bar's label indent in pixels. */
            indent?: number;

            /**
             * Specifies a precision for the formatted value displayed by an indicator.
             * @deprecated Use the text.format.precision option instead.
             */
            precision?: number;
        };

        offset?: number;

        length?: number;

        width?: number;

        /** Specifies the length of an arrow for the indicator of the textCloud type in pixels. */
        arrowLength?: number;

        /** Sets the array of colors to be used for coloring subvalue indicators. */
        palette?: any;

        /** Specifies the distance between the needle and the center of a gauge for the indicator of a needle-like type. */
        indentFromCenter?: number;

        /** Specifies the second color for the indicator of the twoColorNeedle type. */
        secondColor?: string;

        /** Specifies the length of a twoNeedleColor type indicator tip as a percentage. */
        secondFraction?: number;

        /** Specifies the spindle's diameter in pixels for the indicator of a needle-like type. */
        spindleSize?: number;

        /** Specifies the inner diameter in pixels, so that the spindle has the shape of a ring. */
        spindleGapSize?: number;

        /** Specifies the orientation of the rangeBar indicator. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: string;

        /** Specifies the orientation of the rangeBar indicator. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: string;
    }

    export interface SharedGaugeOptions extends viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        

        /** Specifies animation options. */
        animation?: viz.core.Animation;

        /**
        * Specifies a subtitle for the widget.
        * @deprecated Use the title.subtitle option instead.
        */
        subtitle?: {

            /**
             * Use the title.subtitle.font option instead.
             * @deprecated 
             */
            font?: viz.core.Font;

            /**
            * Specifies a text for the subtitle.
            * @deprecated Use the title.subtitle.text option instead.
            */
            text?: string;
        };

        /** Configures tooltips. */
        tooltip?: viz.core.Tooltip;

        /** A handler for the tooltipShown event. */
        onTooltipShown?: (e: {
            component: dxBaseGauge;
            element: Element;
            target: {};
        }) => void;

        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: (e: {
            component: dxBaseGauge;
            element: Element;
            target: {};
        }) => void;
    }

    export interface BaseGaugeOptions extends viz.core.BaseWidgetOptions, SharedGaugeOptions {
        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;

        /** Specifies options of the gauge's range container. */
        rangeContainer?: BaseRangeContainer;

        /** Specifies a gauge's scale options. */
        scale?: BaseScale;

        /** Specifies the appearance options of subvalue indicators. */
        subvalueIndicator?: BaseValueIndicator;

        /** Specifies a set of subvalues to be designated by the subvalue indicators. */
        subvalues?: Array<number>;

        /** Specifies the main value on a gauge. */
        value?: number;

        /** Specifies the appearance options of the value indicator. */
        valueIndicator?: BaseValueIndicator;
    }

    /** A gauge widget. */
    export class dxBaseGauge extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Returns the main gauge value. */
        value(): number;

        /** Updates a gauge value. */
        value(value: number): void;

        /** Returns an array of gauge subvalues. */
        subvalues(): Array<number>;

        /** Updates gauge subvalues. */
        subvalues(subvalues: Array<number>): void;
    }

    // LinearGauge

    export interface LinearRangeContainer extends BaseRangeContainer {
        /** Specifies the orientation of the range container. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: string;

        /** Specifies the orientation of the range container. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: string;

        /** Specifies the width of the range container's start and end boundaries in the LinearGauge widget. */
        width?: any;

        /** Specifies an end width of a range container. */
        end?: number;

        /** Specifies a start width of a range container. */
        start?: number;
    }

    export interface LinearScaleLabel extends BaseScaleLabel {
        /** Specifies the spacing between scale labels and ticks. */
        indentFromTick?: number;

        overlappingBehavior?: any;
    }

    export interface LinearScale extends BaseScale {

        /** Specifies the orientation of scale ticks. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: string;

        label?: LinearScaleLabel;

        /** Specifies the orientation of scale ticks. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: string;
    }

    export interface dxLinearGaugeOptions extends BaseGaugeOptions {
        /** Specifies the options required to set the geometry of the LinearGauge widget. */
        geometry?: {

            /** Indicates whether to display the LinearGauge widget vertically or horizontally. */
            orientation?: string;
        };

        /** Specifies gauge range container options. */
        rangeContainer?: LinearRangeContainer;

        scale?: LinearScale;
    }

    // CircularGauge

    export interface CircularRangeContainer extends BaseRangeContainer {
        /** Specifies the orientation of the range container in the CircularGauge widget. */
        orientation?: string;

        /** Specifies the range container's width in pixels. */
        width?: number;
    }

    export interface CircularScaleLabel extends BaseScaleLabel {
        /** Specifies the spacing between scale labels and ticks. */
        indentFromTick?: number;

        /** Specifies which label to hide in case of overlapping. */
        hideFirstOrLast?: string;

        overlappingBehavior?: any;
    }

    export interface CircularScale extends BaseScale {
        label?: CircularScaleLabel;

        /** Specifies the orientation of scale ticks. */
        orientation?: string;
    }

    export interface dxCircularGaugeOptions extends BaseGaugeOptions {
        /** Specifies the options required to set the geometry of the CircularGauge widget. */
        geometry?: {

            /** Specifies the end angle of the circular gauge's arc. */
            endAngle?: number;

            /** Specifies the start angle of the circular gauge's arc. */
            startAngle?: number;
        };

        /** Specifies gauge range container options. */
        rangeContainer?: CircularRangeContainer;

        scale?: CircularScale;
    }

    // dxBarGauge

    export interface dxBarGaugeOptions extends viz.core.BaseWidgetOptions, SharedGaugeOptions {
        /** Specifies a color for the remaining segment of the bar's track. */
        backgroundColor?: string;

        /** Specifies a distance between bars in pixels. */
        barSpacing?: number;

        /** Specifies a base value for bars. */
        baseValue?: number;

        /** Specifies an end value for the gauge's invisible scale. */
        endValue?: number;

        /** Defines the shape of the gauge's arc. */
        geometry?: {

            /** Specifies the end angle of the bar gauge's arc. */
            endAngle?: number;

            /** Specifies the start angle of the bar gauge's arc. */
            startAngle?: number;
        };

        /** Specifies the options of the labels that accompany gauge bars. */
        label?: {

            /** Specifies a color for the label connector text. */
            connectorColor?: string;

            /** Specifies the width of the label connector in pixels. */
            connectorWidth?: number;

            /** Specifies a callback function that returns a text for labels. */
            customizeText?: (barValue: { value: number; valueText: string }) => string;

            /** Specifies font options for bar labels. */
            font?: viz.core.Font;

            /** Specifies a format for bar labels. */
            format?: any;

            /** Specifies the distance between the upper bar and bar labels in pixels. */
            indent?: number;

            /**
             * Specifies a precision for the formatted value displayed by labels.
             * @deprecated Use the label.format.precision option instead.
             */
            precision?: number;

            /** Specifies whether bar labels appear on a gauge or not. */
            visible?: boolean;
        };

        /** Sets the name of the palette or an array of colors to be used for coloring the gauge range container. */
        palette?: any;

        /** Defines the radius of the bar that is closest to the center relatively to the radius of the topmost bar. */
        relativeInnerRadius?: number;

        /** Specifies a start value for the gauge's invisible scale. */
        startValue?: number;

        /** Specifies the array of values to be indicated on a bar gauge. */
        values?: Array<number>;
    }
}

declare module DevExpress.viz {
    /** The LinearGauge is a widget that indicates values on a linear numeric scale. */
    export class dxLinearGauge extends DevExpress.viz.gauges.dxBaseGauge {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxLinearGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxLinearGaugeOptions);
    }

    /** The CircularGauge is a widget that indicates values on a circular numeric scale. */
    export class dxCircularGauge extends DevExpress.viz.gauges.dxBaseGauge {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxCircularGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxCircularGaugeOptions);
    }

    /** The BarGauge widget contains several circular bars that each indicates a single value. */
    export class dxBarGauge extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxBarGaugeOptions);
        constructor(element: Element, options?: DevExpress.viz.gauges.dxBarGaugeOptions);

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Returns an array of gauge values. */
        values(): Array<number>;

        /** Updates the values displayed by a gauge. */
        values(values: Array<number>): void;
    }
}
