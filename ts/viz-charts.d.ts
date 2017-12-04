/// <reference path="vendor/jquery.d.ts" />
/// <reference path="core.d.ts" />
/// <reference path="viz-core.d.ts" />

declare module DevExpress.viz.charts {

    // Chart Elements

    /** This section describes the Series object, which represents a series. */
    export interface BaseSeries {
        /** Provides information about the state of the series object. */
        fullState: number;

        /** Returns the type of the series. */
        type: string;

        /** Unselects all the selected points of the series. The points are displayed in an initial style. */
        clearSelection(): void;

        /** Gets the color of a particular series. */
        getColor(): string;

        /** Gets points from the series point collection based on the specified argument. */
        getPointsByArg(pointArg: any): Array<BasePoint>;

        /** Gets a point from the series point collection based on the specified point position. */
        getPointByPos(positionIndex: number): Object;

        /** Selects the series. The series is displayed in a 'selected' style until another series is selected or the current series is deselected programmatically. */
        select(): void;

        /** Selects the specified point. The point is displayed in a 'selected' style. */
        selectPoint(point: BasePoint): void;

        /** Deselects the specified point. The point is displayed in an initial style. */
        deselectPoint(point: BasePoint): void;

        /** Returns an array of all points in the series. */
        getAllPoints(): Array<BasePoint>;

        /** Returns visible series points. */
        getVisiblePoints(): Array<BasePoint>;

        /** Returns the name of the series. */
        name: any;

        /** Returns the tag of the series. */
        tag: any;

        /** Hides a series. */
        hide(): void;

        /** Provides information about the hover state of a series. */
        isHovered(): boolean;

        /** Provides information about the selection state of a series. */
        isSelected(): boolean;

        /** Provides information about the visibility state of a series. */
        isVisible(): boolean;

        /** Makes a particular series visible. */
        show(): void;
    }

    /** This section describes the Point object, which represents a series point. */
    export interface BasePoint {
        /** Provides information about the state of the point object. */
        fullState: number;

        /** Returns the point's argument value that was set in the data source. */
        originalArgument: any;

        /** Returns the point's value that was set in the data source. */
        originalValue: any;

        /** Returns the tag of the point. */
        tag: any;

        /** Deselects the point. */
        clearSelection(): void;

        /** Gets the color of a particular point. */
        getColor(): string;

        /** Hides the tooltip of the point. */
        hideTooltip(): void;

        /** Provides information about the hover state of a point. */
        isHovered(): boolean;

        /** Provides information about the selection state of a point. */
        isSelected(): boolean;

        /** Selects the point. The point is displayed in a 'selected' style until another point is selected or the current point is deselected programmatically. */
        select(): void;

        /** Shows the tooltip of the point. */
        showTooltip(): void;

        /** Allows you to obtain the label(s) of the series point. */
        getLabel(): any;

        /** Returns the series object to which the point belongs. */
        series: BaseSeries;
    }

    /** This section describes the Series object, which represents a series. */
    export interface ChartSeries extends BaseSeries {
        /** Returns the name of the series pane. */
        pane: string;

        /** Returns the name of the value axis of the series. */
        axis: string;

        selectPoint(point: ChartPoint): void;
        deselectPoint(point: ChartPoint): void;
        getAllPoints(): Array<ChartPoint>;
        getVisiblePoints(): Array<ChartPoint>;
    }

    /** This section describes the Point object, which represents a series point. */
    export interface ChartPoint extends BasePoint {
        /** Contains the close value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalCloseValue: any;

        /** Contains the high value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalHighValue: any;

        /** Contains the low value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalLowValue: any;

        /** Contains the first value of the point. This field is useful for points belonging to a series of the range area or range bar type only. */
        originalMinValue: any;

        /** Contains the open value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalOpenValue: any;

        /** Contains the size of the bubble as it was set in the data source. This field is useful for points belonging to a series of the bubble type only. */
        size: any;

        /** Gets the parameters of the point's minimum bounding rectangle (MBR). */
        getBoundingRect(): { x: number; y: number; width: number; height: number; };

        series: ChartSeries;
    }

    /** This section describes the Label object, which represents a point label. */
    export interface Label {
        /** Gets the parameters of the label's minimum bounding rectangle (MBR). */
        getBoundingRect(): { x: number; y: number; width: number; height: number; };

        
        hide(): void;

        
        show(): void;
    }

    export interface PieSeries extends BaseSeries {
        selectPoint(point: PiePoint): void;
        deselectPoint(point: PiePoint): void;
        getAllPoints(): Array<PiePoint>;
        getVisiblePoints(): Array<PiePoint>;
    }

    /** This section describes the Point object, which represents a series point. */
    export interface PiePoint extends BasePoint {
        /** Gets the percentage value of the specific point. */
        percent: any;

        /** Provides information about the visibility state of a point. */
        isVisible(): boolean;

        /** Makes a specific point visible. */
        show(): void;

        /** Hides a specific point. */
        hide(): void;

        series: PieSeries;
    }

    /** This section describes the Series object, which represents a series. */
    export interface PolarSeries extends BaseSeries {
        /** Returns the name of the value axis of the series. */
        axis: string;

        selectPoint(point: PolarPoint): void;
        deselectPoint(point: PolarPoint): void;
        getAllPoints(): Array<PolarPoint>;
        getVisiblePoints(): Array<PolarPoint>;
    }

    /** This section describes the Point object, which represents a series point. */
    export interface PolarPoint extends BasePoint {
        

        series: PolarSeries;
    }

    export interface Strip {
        /** Specifies a color for a strip. */
        color?: string;

        /** An object that defines the label configuration options of a strip. */
        label?: {

            /** Specifies the text displayed in a strip. */
            text?: string;
        };

        /** Specifies a start value for a strip. */
        startValue?: any;

        /** Specifies an end value for a strip. */
        endValue?: any;
    }


    // Series

    export interface BaseSeriesConfigLabel {
        /** Specifies a format for arguments displayed by point labels. */
        argumentFormat?: any;

        /**
               * Specifies a precision for formatted point arguments displayed in point labels.
               * @deprecated Use the series.label.argumentFormat.precision instead.
               */
        argumentPrecision?: number;

        /** Specifies a background color for point labels. */
        backgroundColor?: string;

        /** Specifies border options for point labels. */
        border?: viz.core.DashedBorder;

        /** Specifies connector options for series point labels. */
        connector?: {

            /** Specifies the color of label connectors. */
            color?: string;

            /** Indicates whether or not label connectors are visible. */
            visible?: boolean;

            /** Specifies the width of label connectors. */
            width?: number;
        };

        /** Specifies a callback function that returns the text to be displayed by point labels. */
        customizeText?: (pointInfo: Object) => string;

        /** Specifies font options for the text displayed in point labels. */
        font?: viz.core.Font;

        /** Specifies a format for the text displayed by point labels. */
        format?: any;

        
        position?: string;

        /**
              * Specifies a precision for formatted point values displayed in point labels.
              * @deprecated Use the series.label.format.precision option instead.
              */
        precision?: number;

        /** Specifies the angle used to rotate point labels from their initial position. */
        rotationAngle?: number;

        /** Specifies the visibility of point labels. */
        visible?: boolean;
    }

    export interface SeriesConfigLabel extends BaseSeriesConfigLabel {
        /** Specifies whether or not to show labels for points with zero value. Applies only to bar-like series. */
        showForZeroValues?: boolean;
    }

    export interface ChartSeriesConfigLabel extends SeriesConfigLabel {
        /** Aligns point labels in relation to their points. */
        alignment?: string;

        /** Along with verticalOffset, shifts point labels from their initial positions. */
        horizontalOffset?: number;

        /** Along with horizontalOffset, shifts point labels from their initial positions. */
        verticalOffset?: number;

        /**
             * Specifies a precision for the percentage values displayed in the labels of a full-stacked-like series.
             * @deprecated Use the series.label.format.percentPrecision instead.
             */
        percentPrecision?: number;
    }

    export interface BaseCommonSeriesConfig {
        /** Specifies the data source field that provides arguments for series points. */
        argumentField?: string;

        
        axis?: string;

        
        label?: ChartSeriesConfigLabel;
        
        border?: viz.core.DashedBorder;

        /** Specifies a series color. */
        color?: string;

        /** Specifies the dash style of the series' line. */
        dashStyle?: string;

        /** Specifies series elements to be highlighted when a user points to the series. */
        hoverMode?: string;

        
        hoverStyle?: {

            
            border?: viz.core.DashedBorder;

            /** <p>Sets a color for a series when it is hovered over.</p> */
            color?: string;

            /** Specifies the dash style for the line in a hovered series. */
            dashStyle?: string;

            
            hatching?: viz.core.Hatching;

            /** Specifies the width of a line in a hovered series. */
            width?: number;
        };

        /** Specifies whether a chart ignores null data points or not. */
        ignoreEmptyPoints?: boolean;

        /** Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed. */
        maxLabelCount?: number;

        /** Specifies the minimal length of a displayed bar in pixels. */
        minBarSize?: number;

        /** Specifies opacity for a series. */
        opacity?: number;

        /** Specifies series elements to be highlighted when a user selects a point. */
        selectionMode?: string;

        
        selectionStyle?: {

            
            border?: viz.core.DashedBorder;

            /** Sets a color for a series when it is selected. */
            color?: string;

            /** Specifies the dash style for the line in a selected series. */
            dashStyle?: string;

            
            hatching?: viz.core.Hatching;

            /** Specifies the width of a line in a selected series. */
            width?: number;
        };

        /** Specifies whether or not to show the series in the chart's legend. */
        showInLegend?: boolean;

        /** Specifies the name of the stack where the values of the _stackedBar_ series must be located. */
        stack?: string;

        /** Specifies the name of the data source field that provides data about a point. */
        tagField?: string;

        /** Specifies the data source field that provides values for series points. */
        valueField?: string;

        /** Specifies the visibility of a series. */
        visible?: boolean;

        /** Specifies a line width. */
        width?: number;

        /** Configures error bars. */
        valueErrorBar?: {
            /** Specifies whether error bars must be displayed in full or partially. */
            displayMode?: string;

            /** Specifies the data field that provides data for low error values. */
            lowValueField?: string;

            /** Specifies the data field that provides data for high error values. */
            highValueField?: string;

            /** Specifies how error bar values must be calculated. */
            type?: string;

            /** Specifies the value to be used for generating error bars. */
            value?: number;

            /** Specifies the color of error bars. */
            color?: string;

            /** Specifies the opacity of error bars. */
            opacity?: number;

            /** Specifies the length of the lines that indicate the error bar edges. */
            edgeLength?: number;
            /** Specifies the width of the error bar line. */
            lineWidth?: number;
        };
    }

    export interface CommonPointOptions {
        /** Specifies border options for points in the line and area series. */
        border?: viz.core.Border;

        /** Specifies the points color. */
        color?: string;

        /** Specifies what series points to highlight when a point is hovered over. */
        hoverMode?: string;

        /** An object defining configuration options for a hovered point. */
        hoverStyle?: {

            /** An object defining the border options for a hovered point. */
            border?: viz.core.Border;

            /** Sets a color for a point when it is hovered over. */
            color?: string;

            /** Specifies the diameter of a hovered point in the series that represents data points as symbols (not as bars for instance). */
            size?: number;
        };

        /** Specifies what series points to highlight when a point is selected. */
        selectionMode?: string;

        /** An object defining configuration options for a selected point. */
        selectionStyle?: {

            /** An object defining the border options for a selected point. */
            border?: viz.core.Border;

            /** <p>Sets a color for a point when it is selected.</p> */
            color?: string;

            /** Specifies the diameter of a selected point in the series that represents data points as symbols (not as bars for instance). */
            size?: number;
        };

        /** Specifies the point diameter in pixels for those series that represent data points as symbols (not as bars for instance). */
        size?: number;

        /** Specifies a symbol for presenting points of the line and area series. */
        symbol?: string;

        
        visible?: boolean;
    }

    export interface ChartCommonPointOptions extends CommonPointOptions {
        /** Substitutes the standard point symbols with an image. */
        image?: {

            /** Specifies the height of the image used instead of a point marker. */
            height?: any;

            
            

            /** Specifies the URL of the image to be used as a point marker. */
            url?: any;

            
            

            /** Specifies the width of an image that is used as a point marker. */
            width?: any;

            
            
        };
    }

    export interface PolarCommonPointOptions extends CommonPointOptions {
        /** An object specifying the parameters of an image that is used as a point marker. */
        image?: {

            /** Specifies the height of an image that is used as a point marker. */
            height?: number;

            /** Specifies a URL leading to the image to be used as a point marker. */
            url?: string;

            /** Specifies the width of an image that is used as a point marker. */
            width?: number;
        };
    }

    /** An object that defines configuration options for chart series. */
    export interface CommonSeriesConfig extends BaseCommonSeriesConfig {

        /** Specifies which data source field provides close values for points of a financial series. */
        closeValueField?: string;

        /** Makes bars look rounded. Applies only to bar-like series. */
        cornerRadius?: number;

        /** Specifies which data source field provides high values for points of a financial series. */
        highValueField?: string;

        /** Specifies a filling color for the body of a series point that visualizes a non-reduced value. Applies only to candlestick series. */
        innerColor?: string;

        /** Specifies which data source field provides low values for points of a financial series. */
        lowValueField?: string;

        /** Specifies which data source field provides open values for points of a financial series. */
        openValueField?: string;

        /** Specifies which pane the series should belong to. Accepts the name of the pane. */
        pane?: string;

        
        point?: ChartCommonPointOptions;

        /** Coupled with the rangeValue2Field option, specifies which data source field provides values for a range-like series. */
        rangeValue1Field?: string;

        /** Coupled with the rangeValue1Field option, specifies which data source field provides values for a range-like series. */
        rangeValue2Field?: string;

        /** Specifies reduction options for financial series. */
        reduction?: {

            /** Specifies a color for the points whose price has decreased in comparison to the price of the previous point. */
            color?: string;

            /** Specifies whether high, low, open or close prices of points should be compared. */
            level?: string;
        };

        /** Specifies which data source field provides size values for bubbles. Required by and applies only to bubble series. */
        sizeField?: string;
    }

    export interface CommonSeriesSettings extends CommonSeriesConfig {
        /** Defines common settings for all area series. */
        area?: CommonSeriesConfig;

        /** Defines common settings for all bar series. */
        bar?: CommonSeriesConfig;

        /** Defines common settings for all bubble series. */
        bubble?: CommonSeriesConfig;

        /** Defines common settings for all candlestick series. */
        candlestick?: CommonSeriesConfig;

        /** Defines common settings for all full-stacked area series. */
        fullstackedarea?: CommonSeriesConfig;

        /** Defines common settings for all full-stacked spline area series. */
        fullstackedsplinearea?: CommonSeriesConfig;

        /** Defines common settings for all full-stacked bar series. */
        fullstackedbar?: CommonSeriesConfig;

        /** Defines common settings for all full-stacked line series. */
        fullstackedline?: CommonSeriesConfig;

        /** Defines common settings for all full-stacked spline series. */
        fullstackedspline?: CommonSeriesConfig;

        /** Defines common settings for all line series. */
        line?: CommonSeriesConfig;

        /** Defines common settings for all range area series. */
        rangearea?: CommonSeriesConfig;

        /** Defines common settings for all range bar series. */
        rangebar?: CommonSeriesConfig;

        /** Defines common settings for all scatter series. */
        scatter?: CommonSeriesConfig;

        /** Defines common settings for all spline series. */
        spline?: CommonSeriesConfig;

        /** Defines common settings for all spline area series. */
        splinearea?: CommonSeriesConfig;

        /** Defines common settings for all stacked area series. */
        stackedarea?: CommonSeriesConfig;

        /** Defines common settings for all stacked spline area series. */
        stackedsplinearea?: CommonSeriesConfig;

        /** Defines common settings for all stacked bar series. */
        stackedbar?: CommonSeriesConfig;

        /** Defines common settings for all stacked line series. */
        stackedline?: CommonSeriesConfig;

        /** Defines common settings for all stacked spline series. */
        stackedspline?: CommonSeriesConfig;

        /** Defines common settings for all step area series. */
        steparea?: CommonSeriesConfig;

        /** Defines common settings for all step line series. */
        stepline?: CommonSeriesConfig;

        /** Defines common settings for all stock series. */
        stock?: CommonSeriesConfig;

        /** Specifies the type of the series. */
        type?: string;
    }

    export interface SeriesConfig extends CommonSeriesConfig {
        /** Specifies the name that identifies the series. */
        name?: string;

        /** Specifies data about a series. */
        tag?: any;

        /** Sets the series type. */
        type?: string;
    }



    /** An object that defines configuration options for polar chart series. */
    export interface CommonPolarSeriesConfig extends BaseCommonSeriesConfig {
        /** Specifies whether or not to close the chart by joining the end point with the first point. */
        closed?: boolean;

        
        label?: SeriesConfigLabel;

        
        point?: PolarCommonPointOptions;
    }

    export interface CommonPolarSeriesSettings extends CommonPolarSeriesConfig {
        /** An object that specifies configuration options for all series of the area type in the chart. */
        area?: CommonPolarSeriesConfig;

        /** An object that specifies configuration options for all series of the _bar_ type in the chart. */
        bar?: CommonPolarSeriesConfig;

        /** An object that specifies configuration options for all series of the _line_ type in the chart. */
        line?: CommonPolarSeriesConfig;

        /** An object that specifies configuration options for all series of the _scatter_ type in the chart. */
        scatter?: CommonPolarSeriesConfig;

        /** An object that specifies configuration options for all series of the _stackedBar_ type in the chart. */
        stackedbar?: CommonPolarSeriesConfig;

        /** Sets a series type. */
        type?: string;
    }

    export interface PolarSeriesConfig extends CommonPolarSeriesConfig {
        /** Specifies the name that identifies the series. */
        name?: string;

        /** Specifies data about a series. */
        tag?: any;

        /** Sets the series type. */
        type?: string;
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    export interface PieSeriesConfigLabel extends BaseSeriesConfigLabel {
        /** Specifies how to shift labels from their initial position in a radial direction in pixels. */
        radialOffset?: number;

        /**
            * Specifies a precision for the percentage values displayed in labels.
            * @deprecated Use the series.label.format.percentPrecision instead.
            */
        percentPrecision?: number;
    }

    /** An object that defines configuration options for chart series. */
    export interface CommonPieSeriesConfig {
        /** Specifies the data source field that provides arguments for series points. */
        argumentField?: string;

        /** Specifies the required type for series arguments. */
        argumentType?: string;

        /** An object defining the series border configuration options. */
        border?: viz.core.DashedBorder;

        /** Specifies a series color. */
        color?: string;

        /** Specifies the chart elements to highlight when a series is hovered over. */
        hoverMode?: string;

        /** An object defining configuration options for a hovered series. */
        hoverStyle?: {

            /** An object defining the border options for a hovered series. */
            border?: viz.core.DashedBorder;

            /** Sets a color for the series when it is hovered over. */
            color?: string;

            /** Specifies the hatching options to be applied when a point is hovered over. */
            hatching?: viz.core.Hatching;
        };

        /**
           * Specifies the fraction of the inner radius relative to the total radius in the series of the 'doughnut' type.
           * @deprecated Use the innerRadius option instead.
           */
        innerRadius?: number;

        /** An object defining the label configuration options. */
        label?: PieSeriesConfigLabel;

        /** Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed. */
        maxLabelCount?: number;

        /** Specifies a minimal size of a displayed pie segment. */
        minSegmentSize?: number;

        /**
          * Specifies the direction in which the PieChart series points are located.
          * @deprecated Use the segmentsDirection option instead.
          */
        segmentsDirection?: string;

        /** <p>Specifies the chart elements to highlight when the series is selected.</p> */
        selectionMode?: string;

        /** An object defining configuration options for the series when it is selected. */
        selectionStyle?: {

            /** An object defining the border options for a selected series. */
            border?: viz.core.DashedBorder;

            /** Sets a color for a series when it is selected. */
            color?: string;

            /** Specifies the hatching options to be applied when a point is selected. */
            hatching?: viz.core.Hatching;
        };

        /** Specifies chart segment grouping options. */
        smallValuesGrouping?: {

            /** Specifies the name of the grouped chart segment. This name represents the segment in the chart legend. */
            groupName?: string;

            /** Specifies the segment grouping mode. */
            mode?: string;

            /** Specifies a threshold for segment values. */
            threshold?: number;

            /** Specifies how many segments must not be grouped. */
            topCount?: number;
        };

        /**
         * Specifies a start angle for a pie chart in arc degrees.
         * @deprecated Use the startAngle option instead.
         */
        startAngle?: number;

        /** <p>Specifies the name of the data source field that provides data about a point.</p> */
        tagField?: string;

        /** Specifies the data source field that provides values for series points. */
        valueField?: string;
    }

    export interface CommonPieSeriesSettings extends CommonPieSeriesConfig {
        /**
        * Specifies the type of the pie chart series.
        * @deprecated Use the type option instead.
        */
        type?: string;
    }

    export interface PieSeriesConfig extends CommonPieSeriesConfig {
        /**
       * Sets the series type.
       * @deprecated Use the type option instead.
       */
        type?: string;

        /** Specifies the name that identifies the series. */
        name?: string;

        /** Specifies data about a series. */
        tag?: any;
    }

    
    

    export interface SeriesTemplate {
        /** Specifies a callback function that returns a series object with individual series settings. */
        customizeSeries?: (seriesName: any) => SeriesConfig;

        /** Specifies a data source field that represents the series name. */
        nameField?: string;
    }

    export interface PolarSeriesTemplate {
        /** Specifies a callback function that returns a series object with individual series settings. */
        customizeSeries?: (seriesName: any) => PolarSeriesConfig;

        /** Specifies a data source field that represents the series name. */
        nameField?: string;
    }

    export interface PieSeriesTemplate {
        /** Specifies a callback function that returns a series object with individual series settings. */
        customizeSeries?: (seriesName: any) => PieSeriesConfig;

        /** Specifies a data source field that represents the series name. */
        nameField?: string;
    }

    // Axes

    export interface ChartCommonConstantLineLabel {
        /** Specifies font options for constant line labels. */
        font?: viz.core.Font;

        /** Specifies the position of constant line labels on the chart plot. */
        position?: string;
        /** Makes constant line labels visible. */
        visible?: boolean;
    }

    export interface PolarCommonConstantLineLabel {
        /** Indicates whether or not to display labels for the axis constant lines. */
        visible?: boolean;
        /** Specifies font options for a constant line label. */
        font?: viz.core.Font;
    }

    export interface ConstantLineStyle {
        /** Specifies a color for a constant line. */
        color?: string;

        /** Specifies a dash style for a constant line. */
        dashStyle?: string;

        /** Specifies a constant line width in pixels. */
        width?: number;
    }

    export interface ChartCommonConstantLineStyle extends ConstantLineStyle {
        /** Configures constant line labels. */
        label?: ChartCommonConstantLineLabel;

        /** Generates a pixel-measured empty space between the left/right side of a constant line and the constant line label. */
        paddingLeftRight?: number;

        /** Generates a pixel-measured empty space between the top/bottom side of a constant line and the constant line label. */
        paddingTopBottom?: number;
    }

    export interface PolarCommonConstantLineStyle extends ConstantLineStyle {
        /** An object defining constant line label options. */
        label?: PolarCommonConstantLineLabel;
    }

    export interface CommonAxisLabel {
        /** Specifies font options for axis labels. */
        font?: viz.core.Font;

        /** Specifies the spacing between an axis and its labels in pixels. */
        indentFromAxis?: number;

        /** Indicates whether or not axis labels are visible. */
        visible?: boolean;
    }

    export interface ChartCommonAxisLabel extends CommonAxisLabel {
        /** Aligns axis labels in relation to ticks. */
        alignment?: string;

        
        
        
        /** Decides how to arrange axis labels when there is not enough space to keep all of them. */
        overlappingBehavior?: any;
    }

    export interface PolarCommonAxisLabel extends CommonAxisLabel {
        /** Decides how to arrange axis labels when there is not enough space to keep all of them. */
        overlappingBehavior?: string;
    }

    export interface CommonAxisTitle {
        /** Specifies font options for the axis title. */
        font?: viz.core.Font;

        /** Adds a pixel-measured empty space between the axis title and axis labels. */
        margin?: number;
    }

    export interface BaseCommonAxisSettings {
        /** Specifies the color of the line that represents an axis. */
        color?: string;

        /** Specifies whether ticks/grid lines of a discrete axis are located between labels or cross the labels. */
        discreteAxisDivisionMode?: string;

        /** An object defining the configuration options for the grid lines of an axis in the PolarChart widget. */
        grid?: {

            /** Specifies a color for grid lines. */
            color?: string;

            /** Specifies an opacity for grid lines. */
            opacity?: number;

            /** Indicates whether or not the grid lines of an axis are visible. */
            visible?: boolean;

            /** Specifies the width of grid lines. */
            width?: number;
        };

        /** Specifies the options of the minor grid. */
        minorGrid?: {

            /** Specifies a color for the lines of the minor grid. */
            color?: string;

            /** Specifies an opacity for the lines of the minor grid. */
            opacity?: number;

            /** Indicates whether the minor grid is visible or not. */
            visible?: boolean;

            /** Specifies a width for the lines of the minor grid. */
            width?: number;
        };

        /** Indicates whether or not an axis is inverted. */
        inverted?: boolean;

        /** Specifies the opacity of the line that represents an axis. */
        opacity?: number;

        /** Indicates whether or not to set ticks/grid lines of a continuous axis of the 'date-time' type at the beginning of each date-time interval. */
        setTicksAtUnitBeginning?: boolean;

        /** An object defining the configuration options for axis ticks. */
        tick?: {

            /** Specifies ticks color. */
            color?: string;

            /** Specifies tick opacity. */
            opacity?: number;

            /** Indicates whether or not ticks are visible on an axis. */
            visible?: boolean;

            /** Specifies tick width. */
            width?: number;

            /** Specifies tick length. */
            length?: number;
        };

        /** Specifies the options of the minor ticks. */
        minorTick?: {

            /** Specifies a color for the minor ticks. */
            color?: string;

            /** Specifies an opacity for the minor ticks. */
            opacity?: number;

            /** Indicates whether or not the minor ticks are displayed on an axis. */
            visible?: boolean;

            /** Specifies minor tick width. */
            width?: number;

            /** Specifies minor tick length. */
            length?: number;
        };

        /** Indicates whether or not the line that represents an axis in a chart is visible. */
        visible?: boolean;

        /** Specifies the width of the line that represents an axis in the chart. */
        width?: number;
    }

    export interface ChartCommonAxisSettings extends BaseCommonAxisSettings {
        /** Configures the appearance of all constant lines in the widget. */
        constantLineStyle?: ChartCommonConstantLineStyle;

        /** Configures axis labels. */
        label?: ChartCommonAxisLabel;

        /** Controls the empty space between the maximum series points and the axis. Applies only to the axes of the "continuous" and "logarithmic" type. */
        maxValueMargin?: number;

        /** Controls the empty space between the minimum series points and the axis. Applies only to the axes of the "continuous" and "logarithmic" type. */
        minValueMargin?: number;

        /** Reserves a pixel-measured space for the axis. */
        placeholderSize?: number;

        /** Configures the appearance of strips. */
        stripStyle?: {

            /** Configures the appearance of strip labels. */
            label?: {
                /** Specifies font options for strip labels. */
                font?: viz.core.Font;

                /** Aligns strip labels in the horizontal direction. */
                horizontalAlignment?: string;

                /** Aligns strip labels in the vertical direction. */
                verticalAlignment?: string;
            };

            /** Generates a pixel-measured empty space between the left/right border of a strip and the strip label. */
            paddingLeftRight?: number;

            /** Generates a pixel-measured empty space between the top/bottom border of a strip and the strip label. */
            paddingTopBottom?: number;
        };

        /** Configures axis titles. */
        title?: CommonAxisTitle;

        /** Adds an empty space between the axis and the minimum and maximum series points. */
        valueMarginsEnabled?: boolean;
    }

    export interface PolarCommonAxisSettings extends BaseCommonAxisSettings {
        /** Specifies the appearance of all the widget's constant lines. */
        constantLineStyle?: PolarCommonConstantLineStyle;

        /** An object defining the label configuration options that are common for all axes in the PolarChart widget. */
        label?: PolarCommonAxisLabel;

        /** An object defining configuration options for strip style. */
        stripStyle?: {

            /** An object defining the configuration options for a strip label style. */
            label?: {
                /** Specifies font options for a strip label. */
                font?: viz.core.Font;
            };
        };
    }

    export interface ChartConstantLineLabel extends ChartCommonConstantLineLabel {
        /** Aligns constant line labels in the horizontal direction. */
        horizontalAlignment?: string;

        /** Aligns constant line labels in the vertical direction. */
        verticalAlignment?: string;

        /** Specifies the text of a constant line label. By default, equals to the value of the constant line. */
        text?: string;
    }

    export interface PolarConstantLineLabel extends PolarCommonConstantLineLabel {
        /** Specifies the text to be displayed in a constant line label. */
        text?: string;
    }

    export interface AxisLabel {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a label on the value axis. */
        customizeHint?: (argument: { value: any; valueText: string }) => string;

        /** Specifies a callback function that returns the text to be displayed in value axis labels. */
        customizeText?: (argument: { value: any; valueText: string }) => string;

        /** Specifies a format for the text displayed by axis labels. */
        format?: any;

        /**
      * Specifies a precision for the formatted value displayed in the axis labels.
      * @deprecated Use the valueAxis.label.format.precision option instead.
      */
        precision?: number;
    }

    export interface ChartAxisLabel extends ChartCommonAxisLabel, AxisLabel { }

    export interface PolarAxisLabel extends PolarCommonAxisLabel, AxisLabel { }

    export interface AxisTitle extends CommonAxisTitle {
        /** Specifies the text of the axis title. */
        text?: string;
    }

    export interface ChartConstantLineStyle extends ChartCommonConstantLineStyle {
        /** Specifies the appearance of the labels of those constant lines that belong to the value axis. */
        label?: ChartConstantLineLabel;
    }

    export interface ChartConstantLine extends ChartConstantLineStyle {
        /** Configures the constant line label. */
        label?: ChartConstantLineLabel;

        /** Specifies the value indicated by a constant line. Setting this option is necessary. */
        value?: any;
    }

    export interface PolarConstantLine extends PolarCommonConstantLineStyle {
        /** An object defining constant line label options. */
        label?: PolarConstantLineLabel;

        /** Specifies a value to be displayed by a constant line. */
        value?: any;
    }

    export interface Axis {
        /** Specifies a coefficient for dividing the value axis. */
        axisDivisionFactor?: number;

        /** Specifies the order in which discrete values are arranged on the value axis. */
        categories?: Array<any>;

        /** Specifies the value to be raised to a power when generating ticks for a logarithmic axis. */
        logarithmBase?: number;

        /** Specifies an interval between axis ticks/grid lines. */
        tickInterval?: any;

        /** Specifies the interval between minor ticks. */
        minorTickInterval?: any;

        /** Specifies the number of minor ticks between two neighboring major ticks. */
        minorTickCount?: number;

        /** Specifies the required type of the value axis. */
        type?: string;

        /** Binds the value axis to a pane. */
        pane?: string;

        /** Specifies options for value axis strips. */
        strips?: Array<Strip>;
    }

    export interface ChartAxis extends ChartCommonAxisSettings, Axis {
        /** Declares a collection of constant lines belonging to the value axis. */
        constantLines?: Array<ChartConstantLine>;

        /** Specifies the appearance of those constant lines that belong to the value axis. */
        constantLineStyle?: ChartCommonConstantLineStyle;

        /** Configures the labels of the value axis. */
        label?: ChartAxisLabel;

        /** Coupled with the min option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        max?: any;

        /** Coupled with the max option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        min?: any;

        /** Relocates the value axis. */
        position?: string;

        /** Configures the axis title. */
        title?: any;
    }

    export interface PolarAxis extends PolarCommonAxisSettings, Axis {
        /** Defines an array of the value axis constant lines. */
        constantLines?: Array<PolarConstantLine>;

        /** Specifies options for value axis labels. */
        label?: PolarAxisLabel;
    }

    export interface ArgumentAxis {
        /** Specifies the desired type of axis values. */
        argumentType?: string;

        /** Specifies the elements that will be highlighted when the argument axis is hovered over. */
        hoverMode?: string;
    }

    export interface ChartArgumentAxis extends ChartAxis, ArgumentAxis { }
    export interface PolarArgumentAxis extends PolarAxis, ArgumentAxis {
        /** Specifies the angle in arc degrees to which the argument axis should be rotated. The positive values rotate the axis clockwise. */
        startAngle?: number;

        /** Specifies whether or not to display the first point at the angle specified by the startAngle option. */
        firstPointOnStartAngle?: boolean;

        /** Specifies the value to be used as the origin for the argument axis. */
        originValue?: number;

        /** Specifies the period of the argument values in the data source. */
        period?: number;
    }

    export interface ValueAxis {
        /** Specifies the name of the value axis. */
        name?: string;

        /** Specifies whether or not to indicate a zero value on the value axis. */
        showZero?: boolean;

        /** Specifies the desired type of axis values. */
        valueType?: string;
    }

    export interface ChartValueAxis extends ChartAxis, ValueAxis {
        /** Adds a pixel-measured empty space between two side-by-side value axes. Applies if several value axes are located on one side of the chart. */
        multipleAxesSpacing?: number;

        /** Synchronizes two or more value axes with each other at a specific value. */
        synchronizedValue?: number;
    }

    export interface PolarValueAxis extends PolarAxis, ValueAxis {
        /** Indicates whether to display series with indents from axis boundaries. */
        valueMarginsEnabled?: boolean;

        /** Specifies a coefficient that determines the spacing between the maximum series point and the axis. */
        maxValueMargin?: number;

        /** Specifies a coefficient that determines the spacing between the minimum series point and the axis. */
        minValueMargin?: number;

        
        tick?: {
            
            visible?: boolean;
        }
    }


    // Panes

    export interface CommonPane {
        /** Specifies the color of the pane's background. */
        backgroundColor?: string;

        /** Configures the pane border. */
        border?: PaneBorder;
    }

    export interface Pane extends CommonPane {
        /** Specifies the name of the pane. */
        name?: string;
    }


    // Misc code re-use

    export interface PaneBorder extends viz.core.DashedBorderWithOpacity {
        /** Shows/hides the bottom border of the pane. Applies only when the border.visible option is true. */
        bottom?: boolean;

        /** Shows/hides the left border of the pane. Applies only when the border.visible option is true. */
        left?: boolean;

        /** Shows/hides the right border of the pane. Applies only when the border.visible option is true. */
        right?: boolean;

        /** Shows/hides the top border of the pane. Applies only when the border.visible option is true. */
        top?: boolean;
    }

    export interface ChartAnimation extends viz.core.Animation {
        /** Specifies how many series points the widget should have before the animation will be disabled. */
        maxPointCountSupported?: number;
    }


    // BaseChart

    export interface BaseChartTooltip extends viz.core.Tooltip {
        /** Specifies a format for arguments of the chart's series points. */
        argumentFormat?: any;

        /**
     * Specifies a precision for formatted arguments displayed in tooltips.
     * @deprecated Use the tooltip.argumentFormat.precision option instead.
     */
        argumentPrecision?: number;

        /**
    * Specifies a precision for a percent value displayed in tooltips for stacked series and PieChart series.
    * @deprecated Use the tooltip.format.percentPrecision option instead.
    */
        percentPrecision?: number;
    }

    export interface BaseChartOptions<TPoint> extends viz.core.BaseWidgetOptions, viz.core.MarginOptions, viz.core.RedrawOnResizeOptions, viz.core.TitleOptions, viz.core.LoadingIndicatorOptions, viz.core.ExportOptions {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: {
            /** Specifies the widget's width small enough for the layout to begin adapting. */
            width?: number;

            /** Specifies the widget's height small enough for the layout to begin adapting. */
            height?: number;

            /** Specifies whether or not point labels should be kept when the layout is adapting. */
            keepLabels?: boolean;
        };

        /** Specifies animation options. */
        animation?: ChartAnimation;

        /** Customizes the appearance of an individual point label. */
        customizeLabel?: (pointInfo: Object) => Object;

        /** Customizes the appearance of an individual series point. */
        customizePoint?: (pointInfo: Object) => Object;

        /** Specifies the origin of data for the widget. */
        dataSource?: any;

        /** Specifies options of the legend. */
        legend?: core.BaseLegend;

        /** Sets the name of the palette to be used in the chart. Alternatively, an array of colors can be set as a custom palette to be used within this chart. */
        palette?: any;

        /** A handler for the done event. */
        onDone?: (e: {
            component: BaseChart;
            element: Element;
        }) => void;

        /** A handler for the pointClick event. */
        onPointClick?: any;

        /** A handler for the pointHoverChanged event. */
        onPointHoverChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TPoint;
        }) => void;

        /** A handler for the pointSelectionChanged event. */
        onPointSelectionChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TPoint;
        }) => void;

        /** Specifies whether a single point or multiple points can be selected in the chart. */
        pointSelectionMode?: string;

        /** Specifies options for series. */
        series?: any;

        /** Configures tooltips. */
        tooltip?: BaseChartTooltip;

        /** A handler for the tooltipShown event. */
        onTooltipShown?: (e: {
            component: BaseChart;
            element: Element;
            target: BasePoint;
        }) => void;

        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: (e: {
            component: BaseChart;
            element: Element;
            target: BasePoint;
        }) => void;
    }

    /** A base class for all chart widgets included in the ChartJS library. */
    export class BaseChart extends viz.core.BaseWidget implements viz.core.LoadingIndicatorMethods {

        /** Deselects the chart's selected series. The series is displayed in an initial style. */
        clearSelection(): void;

        
        getSize(): { width: number; height: number };

        /** Returns an array of all series in the chart. */
        getAllSeries(): Array<BaseSeries>;

        /** Gets a series within the chart's series collection by the specified name (see the name option). */
        getSeriesByName(seriesName: any): BaseSeries;

        /** Gets a series within the chart's series collection by its position number. */
        getSeriesByPos(seriesIndex: number): BaseSeries;

        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;

        /** Hides all widget tooltips. */
        hideTooltip(): void;

        showLoadingIndicator(): void;

        hideLoadingIndicator(): void;

        /** Redraws a widget. */
        render(renderOptions?: {
            force?: boolean;
            animate?: boolean;
            asyncSeriesRendering?: boolean;
        }): void;
    }

    //AdvancedChart
    export interface AdvancedLegend extends core.BaseLegend {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: (seriesInfo: { seriesName: any; seriesIndex: number; seriesColor: string; }) => string;

        /** <p>Specifies a callback function that returns the text to be displayed by legend items.</p> */
        customizeText?: (seriesInfo: { seriesName: any; seriesIndex: number; seriesColor: string; }) => string;

        /** Specifies what series elements to highlight when a corresponding item in the legend is hovered over. */
        hoverMode?: string;
    }

    export interface AdvancedOptions<TPoint, TSeries> extends BaseChartOptions<TPoint> {
        /** A handler for the argumentAxisClick event. */
        onArgumentAxisClick?: any;

        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;

        /** An object providing options for managing data from a data source. */
        dataPrepareSettings?: {

            /** Specifies whether or not to validate the values from a data source. */
            checkTypeForAllData?: boolean;

            /** Specifies whether or not to convert the values from a data source into the data type of an axis. */
            convertToAxisDataType?: boolean;

            /** Specifies how to sort the series points. */
            sortingMethod?: any;
        };

        /** A handler for the legendClick event. */
        onLegendClick?: any;

        /** A handler for the seriesClick event. */
        onSeriesClick?: any;

        /** A handler for the seriesHoverChanged event. */
        onSeriesHoverChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TSeries;
        }) => void;

        /** A handler for the seriesSelectionChanged event. */
        onSeriesSelectionChanged?: (e: {
            component: BaseChart;
            element: Element;
            target: TSeries;
        }) => void;

        /** Specifies whether a single series or multiple series can be selected in the chart. */
        seriesSelectionMode?: string;
        /** Specifies how the chart must behave when series point labels overlap. */
        resolveLabelOverlapping?: string;

        /** Specifies whether or not all bars in a series must have the same angle, or may have different angles if any points in other series are missing. */
        equalBarWidth?: boolean;

        /** Specifies a common bar width as a percentage from 0 to 1. */
        barWidth?: number;

        /** Forces the widget to treat negative values as zeroes. Applies to stacked-like series only. */
        negativesAsZeroes?: boolean;
    }

    // Chart

    export interface Legend extends AdvancedLegend {
        /** Specifies whether the legend is located outside or inside the chart's plot. */
        position?: string;
    }

    export interface ChartTooltip extends BaseChartTooltip {
        /** Specifies whether the tooltip must be located in the center of a series point or on its edge. Applies to bar-like and bubble series only. */
        location?: string;

        /** Specifies the kind of information to display in a tooltip. */
        shared?: boolean;
    }

    export interface dxChartOptions extends AdvancedOptions<ChartPoint, ChartSeries> {
        /** Indicates whether or not to synchronize value axes when they are displayed on a single pane. */
        synchronizeMultiAxes?: boolean;

        /** Specifies whether or not to filter the series points depending on their quantity. */
        useAggregation?: boolean;

        /** Specifies whether or not to adjust the value axis when zooming the widget. */
        adjustOnZoom?: boolean;

        /** Configures the argument axis. */
        argumentAxis?: ChartArgumentAxis;

        /** Defines common settings for both the argument and value axis in a chart. */
        commonAxisSettings?: ChartCommonAxisSettings;

        /** Defines common settings for all panes in a chart. */
        commonPaneSettings?: CommonPane;

        /** Specifies settings common for all series in the chart. */
        commonSeriesSettings?: CommonSeriesSettings;

        /** Configures the crosshair feature. */
        crosshair?: {

            /** Specifies the color of the crosshair lines. */
            color?: string;

            /** Specifies the dash style of the crosshair lines. */
            dashStyle?: string;

            /** Enables the crosshair. */
            enabled?: boolean;

            /** Specifies how transparent the crosshair lines should be. */
            opacity?: number;

            /** Specifies the width of the crosshair lines. */
            width?: number;

            /** Configures the horizontal crosshair line individually. */
            horizontalLine?: CrosshairWithLabel;

            /** Configures the vertical crosshair line individually. */
            verticalLine?: CrosshairWithLabel;

            /** Configures the crosshair labels. */
            label?: {
                /** Paints the background of the crosshair labels. */
                backgroundColor?: string;

                /** Makes the crosshair labels visible. Applies only if the crosshair feature is enabled. */
                visible?: boolean;

                /** Specifies font options for the crosshair labels. */
                font?: viz.core.Font;

                /** Formats the point value/argument before it will be displayed in the crosshair label. */
                format?: any;

                /**
   * Specifies a precision for formatted values.
   * @deprecated Use the crosshair.label.format.precision option instead.
   */
                precision?: number;

                /** Customizes the text displayed by the crosshair labels. */
                customizeText?: (info: { value: any; valueText: string; point: ChartPoint; }) => string;
            }
        };

        /** Specifies which pane should be used by default. */
        defaultPane?: string;

        /** Specifies a coefficient determining the diameter of the largest bubble. */
        maxBubbleSize?: number;

        /** Specifies the diameter of the smallest bubble measured in pixels. */
        minBubbleSize?: number;

        /** Declares a collection of panes. */
        panes?: Array<Pane>;

        /** Swaps the axes around making the value axis horizontal and the argument axis vertical. */
        rotated?: boolean;

        /** Specifies the options of a chart's legend. */
        legend?: Legend;

        /** A handler for the zoomStart event. */
        onZoomStart?: (e: {
            component: BaseChart;
            element: Element;
        }) => void;

        /** A handler for the zoomEnd event. */
        onZoomEnd?: (e: {
            component: BaseChart;
            element: Element;
            rangeStart: any;
            rangeEnd: any;
        }) => void;


        /** Specifies options for Chart widget series. */
        series?: Array<SeriesConfig>;

        /** Defines options for the series template. */
        seriesTemplate?: SeriesTemplate;

        
        tooltip?: ChartTooltip;

        /** Configures the value axis. */
        valueAxis?: Array<ChartValueAxis>;

        /** Enables scrolling in your chart. */
        scrollingMode?: string;

        /** Enables zooming in your chart. */
        zoomingMode?: string;

        /** Specifies the settings of the scroll bar. */
        scrollBar?: {
            /** Specifies whether the scroll bar is visible or not. */
            visible?: boolean;

            /** Specifies the spacing between the scroll bar and the chart's plot in pixels. */
            offset?: number;

            /** Specifies the color of the scroll bar. */
            color?: string;

            /** Specifies the width of the scroll bar in pixels. */
            width?: number;

            /** Specifies the opacity of the scroll bar. */
            opacity?: number;

            /** Specifies the position of the scroll bar in the chart. */
            position?: string;
        };
    }



    interface CrosshairWithLabel extends viz.core.DashedBorderWithOpacity {
        /** Configures the label that belongs to the horizontal crosshair line. */
        label?: {
            /** Paints the background of the label that belongs to the horizontal crosshair line. */
            backgroundColor?: string;

            /** Makes the label of the horizontal crosshair line visible. Applies only if the crosshair feature is enabled and the horizontal line is visible. */
            visible?: boolean;

            /** Specifies font options for the label of the horizontal crosshair line. */
            font?: viz.core.Font;

            /** Formats the point value before it will be displayed in the crosshair label. */
            format?: any;

            /**
  * Specifies a precision for formatted values.
  * @deprecated Use the crosshair.horizontalLine.label.format.precision option instead.
  */
            precision?: number;

            /** Customizes the text displayed by the label that belongs to the horizontal crosshair line. */
            customizeText?: (info: { value: any; valueText: string; point: ChartPoint; }) => string;
        }
    }

    // PolarChart

    export interface PolarChartTooltip extends BaseChartTooltip {
        /** Specifies the kind of information to display in a tooltip. */
        shared?: boolean;

    }

    export interface dxPolarChartOptions extends AdvancedOptions<PolarPoint, PolarSeries> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: {
            
            width?: number;

            
            height?: number;
        };
        /** Indicates whether or not to display a "spider web". */
        useSpiderWeb?: boolean;

        /** Specifies argument axis options for the PolarChart widget. */
        argumentAxis?: PolarArgumentAxis;

        /** An object defining the configuration options that are common for all axes of the PolarChart widget. */
        commonAxisSettings?: PolarCommonAxisSettings;

        /** An object defining the configuration options that are common for all series of the PolarChart widget. */
        commonSeriesSettings?: CommonPolarSeriesSettings;

        /** Specifies the options of a chart's legend. */
        legend?: AdvancedLegend;

        /** Specifies options for PolarChart widget series. */
        series?: Array<PolarSeriesConfig>;

        /** Defines options for the series template. */
        seriesTemplate?: PolarSeriesTemplate;

        
        tooltip?: PolarChartTooltip;

        /** Specifies value axis options for the PolarChart widget. */
        valueAxis?: PolarValueAxis;
    }



    // PieChart

    export interface PieLegend extends core.BaseLegend {
        /** Specifies what chart elements to highlight when a corresponding item in the legend is hovered over. */
        hoverMode?: string;

        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: (pointInfo: { pointName: any; pointIndex: number; pointColor: string; }) => string;

        /** Specifies a callback function that returns the text to be displayed by a legend item. */
        customizeText?: (pointInfo: { pointName: any; pointIndex: number; pointColor: string; }) => string;
    }

    export interface dxPieChartOptions extends BaseChartOptions<PiePoint> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: {
            
            keepLabels?: boolean;
        };
        /** Specifies PieChart legend options. */
        legend?: PieLegend;

        /** Specifies options for the series of the PieChart widget. */
        series?: Array<PieSeriesConfig>;

        /** Specifies the diameter of the pie. */
        diameter?: number;

        /** Specifies the minimum diameter of the pie. */
        minDiameter?: number;

        /** Specifies the direction that the pie chart segments will occupy. */
        segmentsDirection?: string;

        /** Specifies the angle in arc degrees from which the first segment of a pie chart should start. */
        startAngle?: number;

        /** Specifies the fraction of the inner radius relative to the total radius in the series of the 'doughnut' type. The value should be between 0 and 1. */
        innerRadius?: number;

        /** A handler for the legendClick event. */
        onLegendClick?: any;

        /** Specifies how a chart must behave when point labels overlap. */
        resolveLabelOverlapping?: string;

        /** An object defining the configuration options that are common for all series of the PieChart widget. */
        commonSeriesSettings?: CommonPieSeriesSettings;

        /** Defines options for the series template. */
        seriesTemplate?: PieSeriesTemplate;

        /** Specifies the type of the pie chart series. */
        type?: string;
    }



}

declare module DevExpress.viz {
    /** The Chart is a widget that visualizes data from a local or remote storage using a great variety of series types along with different interactive elements, such as tooltips, crosshair pointer, legend, etc. */
    export class dxChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxChartOptions);

        /** Sets the specified start and end values for the chart's argument axis. */
        zoomArgument(startValue: any, endValue: any): void;
    }

    /** The PieChart is a widget that visualizes data as a circle divided into sectors that each represents a portion of the whole. */
    export class dxPieChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPieChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxPieChartOptions);

        /**
 * Provides access to the PieChart series.
 * @deprecated Use the getAllSeries() method instead.
 */
        getSeries(): DevExpress.viz.charts.PieSeries;
    }

    /** The PolarChart is a widget that visualizes data in a polar coordinate system. */
    export class dxPolarChart extends DevExpress.viz.charts.BaseChart {
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPolarChartOptions);
        constructor(element: Element, options?: DevExpress.viz.charts.dxPolarChartOptions);
    }
}
