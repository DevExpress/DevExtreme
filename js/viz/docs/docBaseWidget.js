
var BaseWidget = {
    /**
    * @pseudo CommonVizFormat
    * @type format
    * @default undefined
    */

    /**
    * @pseudo CommonVizLightFontFamily
    * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif" @prop family
    */

    /**
    * @pseudo CommonVizDataSource
    * @type Array<any>|DataSource|DataSourceOptions|string
    * @notUsedInTheme
    */

    /**
    * @pseudo CommonVizPalette
    * @type Array<string>|Enums.VizPalette
    * @default "Material"
    */

    pathModified: false,
    rtlEnabled: DX.rtlEnabled,
    size: {
        width: undefined,
        height: undefined
    },
    margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    redrawOnResize: true,
    disabled: false,
    onIncidentOccurred: function() { },
    svg: function() { },
    getSize: function() { },
    render: function() { },
    showLoadingIndicator: function() { },
    hideLoadingIndicator: function() { },
    exportTo: function() { },
    print: function() { },
    onDrawn: function() { },
    /**
     * @name BaseWidgetMethods.defaultOptions
     * @publicName defaultOptions(rule)
     * @hidden
     */
    defaultOptions: function() { },
    /**
    * @name BaseWidgetOptions.width
    * @type number|string|function
    * @hidden
    */
    width: undefined,
    /**
    * @name BaseWidgetOptions.height
    * @type number|string|function
    * @hidden
    */
    height: undefined,
    theme: 'generic.light',
    title: {
        verticalAlignment: 'top',
        horizontalAlignment: 'center',
        text: null,
        margin: {
            /**
            * @name BaseWidgetOptions.title.margin.top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name BaseWidgetOptions.title.margin.bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name BaseWidgetOptions.title.margin.left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name BaseWidgetOptions.title.margin.right
            * @type number
            * @default 10
            */
            right: 10
        },
        font: {
            family: undefined,
            weight: 200,
            color: '#232323',
            size: 28,
            opacity: undefined
        },
        placeholderSize: undefined,
        subtitle: {
            /**
            * @name BaseWidgetOptions.title.subtitle.text
            * @type string
            * @default null
            */
            text: null,
            /**
            * @name BaseWidgetOptions.title.subtitle.font
            * @type Font
            * @default '#232323' @prop color
            * @default 16 @prop size
            * @default 200 @prop weight
            * @extends CommonVizLightFontFamily
            */
            font: {
                family: undefined,
                weight: 200,
                color: '#232323',
                size: 16,
                opacity: undefined
            },
            /**
            * @name BaseWidgetOptions.title.subtitle.wordWrap
            * @type Enums.VizWordWrap
            * @default "normal"
            */
            wordWrap: "normal",
            /**
            * @name BaseWidgetOptions.title.subtitle.textOverflow
            * @type Enums.VizTextOverflow
            * @default "ellipsis"
            */
            textOverflow: "ellipsis",
            /**
            * @name BaseWidgetOptions.title.subtitle.offset
            * @type number
            * @default 0
            */
            offset: 0
        },
        wordWrap: "normal",
        textOverflow: "ellipsis"
    },
    'export': {
        enabled: false,
        printingEnabled: true,
        formats: ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF'],
        fileName: 'file',
        proxyUrl: undefined,
        backgroundColor: '#ffffff',
        margin: 10,
        svgToCanvas: function(svg, canvas) { }
    },
    onExporting: function() { },
    onExported: function() { },
    onFileSaving: function() { },
    tooltip: {
        enabled: false,
        format: undefined,
        color: '#ffffff',
        zIndex: undefined,
        container: undefined,
        opacity: undefined,
        border: {
            /**
            * @name BaseWidgetOptions.tooltip.border.width
            * @default 1
            * @type number
            */
            width: 1,
            /**
            * @name BaseWidgetOptions.tooltip.border.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name BaseWidgetOptions.tooltip.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name BaseWidgetOptions.tooltip.border.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name BaseWidgetOptions.tooltip.border.visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        font: {
            color: '#232323',
            size: 12,
            family: undefined,
            weight: 400,
            opacity: undefined
        },
        arrowLength: 10,
        paddingLeftRight: 18,
        paddingTopBottom: 15,
        shadow: {
            /**
            * @name BaseWidgetOptions.tooltip.shadow.opacity
            * @type number
            * @default 0.4
            */
            opacity: 0.4,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.color
            * @type string
            * @default #000000
            */
            color: '#000000',
            /**
            * @name BaseWidgetOptions.tooltip.shadow.offsetX
            * @type number
            * @default 0
            */
            offsetX: 0,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.offsetY
            * @type number
            * @default 4
            */
            offsetY: 4,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.blur
            * @type number
            * @default 2
            */
            blur: 2
        },
    },
    loadingIndicator: {
        show: false,
        enabled: false,
        text: 'Loading...',
        backgroundColor: '#FFFFFF',
        font: {
            family: undefined,
            weight: undefined,
            color: '#767676',
            size: undefined,
            opacity: undefined
        }
    }
};

/**
* @name ScaleBreak
* @hidden
* @type object
*/
var ScaleBreak = {
    startValue: undefined,
    endValue: undefined
};

/**
* @name VizTimeInterval
* @type number|object|Enums.VizTimeInterval
* @default undefined
* @hidden
*/
var tickInterval = {
    /**
    * @name VizTimeInterval.years
    * @type number
    */
    years: undefined,
    /**
    * @name VizTimeInterval.quarters
    * @type number
    */
    quarters: undefined,
    /**
    * @name VizTimeInterval.months
    * @type number
    */
    months: undefined,
    /**
    * @name VizTimeInterval.weeks
    * @type number
    */
    weeks: undefined,
    /**
    * @name VizTimeInterval.days
    * @type number
    */
    days: undefined,
    /**
    * @name VizTimeInterval.hours
    * @type number
    */
    hours: undefined,
    /**
    * @name VizTimeInterval.minutes
    * @type number
    */
    minutes: undefined,
    /**
    * @name VizTimeInterval.seconds
    * @type number
    */
    seconds: undefined,
    /**
    * @name VizTimeInterval.milliseconds
    * @type number
    */
    milliseconds: undefined
};

/**
* @name VizRange
* @hidden
* @type object
*/
var VizRange = {
    startValue: undefined,
    endValue: undefined,
    length: undefined
};

/**
 * @name Font
 * @type object
 * @hidden
 */

/**
* @name BaseLegend
* @hidden
* @type object
*/
var BaseLegend = {
    horizontalAlignment: 'right',
    verticalAlignment: 'top',

    orientation: undefined,
    itemTextPosition: undefined,

    itemsAlignment: undefined,
    font: {
        color: '#767676',
        family: undefined,
        weight: undefined,
        size: undefined,
        opacity: undefined
    },
    visible: true,
    margin: {
        /**
        * @name BaseLegend.margin.top
        * @type number
        * @default 10
        */
        top: 10,
        /**
        * @name BaseLegend.margin.bottom
        * @type number
        * @default 10
        */
        bottom: 10,
        /**
        * @name BaseLegend.margin.left
        * @type number
        * @default 10
        */
        left: 10,
        /**
        * @name BaseLegend.margin.right
        * @type number
        * @default 10
        */
        right: 10
    },

    markerSize: 20,
    border: {
        /**
        * @name BaseLegend.border.visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name BaseLegend.border.width
        * @type number
        * @default 1
        */
        width: 1,
        /**
        * @name BaseLegend.border.color
        * @type string
        * @default '#d3d3d3'
        */
        color: '#d3d3d3',
        /**
        * @name BaseLegend.border.cornerRadius
        * @type number
        * @default 0
        */
        cornerRadius: 0,
        /**
        * @name BaseLegend.border.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
        * @name BaseLegend.border.dashStyle
        * @type Enums.DashStyle
        * @default 'solid'
        */
        dashStyle: 'solid'
    },
    backgroundColor: undefined,
    paddingLeftRight: 10,
    paddingTopBottom: 10,
    columnCount: 0,
    rowCount: 0,
    columnItemSpacing: 20,
    rowItemSpacing: 8,
    title: {
        /**
        * @name BaseLegend.title.horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        horizontalAlignment: undefined,
        /**
        * @name BaseLegend.title.verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name BaseLegend.title.text
        * @type string
        * @default null
        */
        text: null,
        /**
        * @name BaseLegend.title.margin
        * @type object
        */
        margin: {
            /**
            * @name BaseLegend.title.margin.top
            * @type number
            * @default 0
            */
            top: 0,
            /**
            * @name BaseLegend.title.margin.bottom
            * @type number
            * @default 9
            */
            bottom: 9,
            /**
            * @name BaseLegend.title.margin.left
            * @type number
            * @default 0
            */
            left: 0,
            /**
            * @name BaseLegend.title.margin.right
            * @type number
            * @default 0
            */
            right: 0
        },
        /**
        * @name BaseLegend.title.font
        * @type Font
        * @default '#232323' @prop color
        * @default 18 @prop size
        * @default 200 @prop weight
        * @extends CommonVizLightFontFamily
        */
        font: {
            family: undefined,
            weight: 200,
            color: '#232323',
            size: 18,
            opacity: undefined
        },
        /**
        * @name BaseLegend.title.placeholderSize
        * @type number
        * @default undefined
        */
        placeholderSize: undefined,
        /**
        * @name BaseLegend.title.subtitle
        * @type object|string
        */
        subtitle: {
            /**
            * @name BaseLegend.title.subtitle.text
            * @type string
            * @default null
            */
            text: null,
            /**
            * @name BaseLegend.title.subtitle.font
            * @type Font
            * @default '#232323' @prop color
            * @default 14 @prop size
            * @default 200 @prop weight
            * @extends CommonVizLightFontFamily
            */
            font: {
                family: undefined,
                weight: 200,
                color: '#232323',
                size: 14,
                opacity: undefined
            },
            /**
            * @name BaseLegend.title.subtitle.offset
            * @type number
            * @default 0
            */
            offset: 0
        }
    }
};

/**
* @name BaseLegendItem
* @hidden
* @type object
*/
var legendItem = {
    text: undefined,
    visible: true,
    marker: {
        /**
        * @name BaseLegendItem.marker.fill
        * @type string
        */
        fill: "#fff",
        /**
        * @name BaseLegendItem.marker.opacity
        * @type number
        */
        opacity: 1,
        /**
        * @name BaseLegendItem.marker.size
        * @type number
        */
        size: 10,
        /**
        * @name BaseLegendItem.marker.state
        * @type Enums.LegendMarkerState
        */
        state: "normal"
    }
};
