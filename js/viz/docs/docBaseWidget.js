/**
* @name BaseWidget
* @type object
* @hidden
* @inherits DOMComponent
*/
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

    /**
    * @name BaseWidgetOptions.pathModified
    * @type boolean
    * @default false
    * @notUsedInTheme
    */
    pathModified: false,
    /**
    * @name BaseWidgetOptions.rtlEnabled
    * @type boolean
    * @notUsedInTheme
    * @default false
    */
    rtlEnabled: DX.rtlEnabled,
    /**
    * @name BaseWidgetOptions.size
    * @type object
    * @default undefined
    */
    size: {
        /**
        * @name BaseWidgetOptions.size.width
        * @type number
        * @default undefined
        */
        width: undefined,
        /**
        * @name BaseWidgetOptions.size.height
        * @type number
        * @default undefined
        */
        height: undefined
    },
    /**
    * @name BaseWidgetOptions.margin
    * @type object
    */
    margin: {
        /**
        * @name BaseWidgetOptions.margin.left
        * @type number
        * @default 0
        */
        left: 0,
        /**
        * @name BaseWidgetOptions.margin.right
        * @type number
        * @default 0
        */
        right: 0,
        /**
        * @name BaseWidgetOptions.margin.top
        * @type number
        * @default 0
        */
        top: 0,
        /**
        * @name BaseWidgetOptions.margin.bottom
        * @type number
        * @default 0
        */
        bottom: 0
    },
    /**
    * @name BaseWidgetOptions.redrawOnResize
    * @type boolean
    * @default true
    * @notUsedInTheme
    */
    redrawOnResize: true,
    /**
    * @name BaseWidgetOptions.disabled
    * @type boolean
    * @default false
    * @notUsedInTheme
    */
    disabled: false,
    /**
    * @name BaseWidgetOptions.onIncidentOccurred
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:any
    * @action
    */
    onIncidentOccurred: function() { },
    /**
    * @name BaseWidgetMethods.svg
    * @publicName svg()
    * @return string
    */
    svg: function() { },
    /**
    * @name BaseWidgetMethods.getSize
    * @publicName getSize()
    * @return BaseWidgetOptions.size
    */
    getSize: function() { },
    /**
    * @name BaseWidgetMethods.render
    * @publicName render()
    */
    render: function() { },
    /**
    * @name BaseWidgetMethods.showLoadingIndicator
    * @publicName showLoadingIndicator()
    */
    showLoadingIndicator: function() { },
    /**
    * @name BaseWidgetMethods.hideLoadingIndicator
    * @publicName hideLoadingIndicator()
    */
    hideLoadingIndicator: function() { },
    /**
    * @name BaseWidgetMethods.exportTo
    * @publicName exportTo(fileName, format)
    * @param1 fileName:string
    * @param2 format:string
    */
    exportTo: function() { },
    /**
    * @name BaseWidgetMethods.print
    * @publicName print()
    */
    print: function() { },
    /**
    * @name BaseWidgetOptions.onDrawn
    * @extends Action
    * @notUsedInTheme
    * @action
    */
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
    /**
    * @name BaseWidgetOptions.theme
    * @type Enums.VizTheme
    * @default 'generic.light'
    */
    theme: 'generic.light',
    /**
    * @name BaseWidgetOptions.title
    * @type object|string
    */
    title: {
        /**
        * @name BaseWidgetOptions.title.verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name BaseWidgetOptions.title.horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'center'
        */
        horizontalAlignment: 'center',
        /**
        * @name BaseWidgetOptions.title.text
        * @type string
        * @default null
        */
        text: null,
        /**
        * @name BaseWidgetOptions.title.margin
        * @type number | object
        * @default 10
        */
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
        /**
        * @name BaseWidgetOptions.title.font
        * @type Font
        * @default '#232323' @prop color
        * @default 28 @prop size
        * @default 200 @prop weight
        * @extends CommonVizLightFontFamily
        */
        font: {
            family: undefined,
            weight: 200,
            color: '#232323',
            size: 28,
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions.title.placeholderSize
        * @type number
        * @default undefined
        */
        placeholderSize: undefined,
        /**
        * @name BaseWidgetOptions.title.subtitle
        * @type object|string
        */
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
        /**
        * @name BaseWidgetOptions.title.wordWrap
        * @type Enums.VizWordWrap
        * @default "normal"
        */
        wordWrap: "normal",
        /**
        * @name BaseWidgetOptions.title.textOverflow
        * @type Enums.VizTextOverflow
        * @default "ellipsis"
        */
        textOverflow: "ellipsis"
    },
    /**
    * @name BaseWidgetOptions.export
    * @type object
    */
    'export': {
        /**
        * @name BaseWidgetOptions.export.enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions.export.printingEnabled
        * @type boolean
        * @default true
        */
        printingEnabled: true,
        /**
        * @name BaseWidgetOptions.export.formats
        * @type Array<Enums.ExportFormat>
        * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
        */
        formats: ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF'],
        /**
        * @name BaseWidgetOptions.export.fileName
        * @type string
        * @default 'file'
        */
        fileName: 'file',
        /**
        * @name BaseWidgetOptions.export.proxyUrl
        * @type string
        * @default undefined
        */
        proxyUrl: undefined,
        /**
        * @name BaseWidgetOptions.export.backgroundColor
        * @type string
        * @default '#ffffff'
        */
        backgroundColor: '#ffffff',
        /**
        * @name BaseWidgetOptions.export.margin
        * @type number
        * @default 10
        */
        margin: 10
    },
    /**
    * @name BaseWidgetOptions.onExporting
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 fileName:string
    * @type_function_param1_field5 cancel:boolean
    * @type_function_param1_field6 format:string
    * @extends Action
    * @action
    */
    onExporting: function() { },
    /**
    * @name BaseWidgetOptions.onExported
    * @extends Action
    * @action
    */
    onExported: function() { },
    /**
    * @name BaseWidgetOptions.onFileSaving
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field3 fileName:string
    * @type_function_param1_field4 format:string
    * @type_function_param1_field5 data:BLOB
    * @type_function_param1_field6 cancel:boolean
    * @extends Action
    * @action
    */
    onFileSaving: function() { },
    /**
    * @name BaseWidgetOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseWidgetOptions.tooltip.enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions.tooltip.format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name BaseWidgetOptions.tooltip.zIndex
        * @type number
        * @default undefined
        */
        zIndex: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.container
        * @type string|Node|jQuery
        * @default undefined
        */
        container: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
       * @name BaseWidgetOptions.tooltip.border
       * @type object
       */
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
        /**
        * @name BaseWidgetOptions.tooltip.font
        * @type Font
        * @default '#232323' @prop color
        */
        font: {
            color: '#232323',
            size: 12,
            family: undefined,
            weight: 400,
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions.tooltip.arrowLength
        * @type number
        * @default 10
        */
        arrowLength: 10,
        /**
        * @name BaseWidgetOptions.tooltip.paddingLeftRight
        * @type number
        * @default 18
        */
        paddingLeftRight: 18,
        /**
        * @name BaseWidgetOptions.tooltip.paddingTopBottom
        * @type number
        * @default 15
        */
        paddingTopBottom: 15,
        /**
       * @name BaseWidgetOptions.tooltip.shadow
       * @type object
       */
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
        }
    },
    /**
    * @name BaseWidgetOptions.loadingIndicator
    * @type object
    */
    loadingIndicator: {
        /**
        * @name BaseWidgetOptions.loadingIndicator.show
        * @type boolean
        * @default false
        * @fires BaseWidgetOptions.onOptionChanged
        */
        show: false,
        /**
        * @name BaseWidgetOptions.loadingIndicator.enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions.loadingIndicator.text
        * @type string
        * @default 'Loading...'
        */
        text: 'Loading...',
        /**
        * @name BaseWidgetOptions.loadingIndicator.backgroundColor
        * @type string
        * @default '#FFFFFF'
        */
        backgroundColor: '#FFFFFF',
        /**
        * @name BaseWidgetOptions.loadingIndicator.font
        * @type Font
        * @default '#767676' @prop color
        */
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
    /**
    * @name ScaleBreak.startValue
    * @type number|date|string
    * @default undefined
    */
    startValue: undefined,
    /**
    * @name ScaleBreak.endValue
    * @type number|date|string
    * @default undefined
    */
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
    /**
    * @name VizRange.startValue
    * @type number|date|string
    * @default undefined
    */
    startValue: undefined,
    /**
    * @name VizRange.endValue
    * @type number|date|string
    * @default undefined
    */
    endValue: undefined,
    /**
    * @name VizRange.length
    * @inherits VizTimeInterval
    * @default undefined
    */
    length: undefined
};

/**
 * @name Font
 * @type object
 * @hidden
 */
/**
 * @name Font.color
 * @type string
 */
 /**
 * @name Font.family
 * @type string
 * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
 */
 /**
 * @name Font.opacity
 * @type number
 * @default 1
 */
 /**
 * @name Font.size
 * @type string|number
 * @default 12
 */
 /**
 * @name Font.weight
 * @type number
 * @default 400
 */

/**
* @name BaseLegend
* @hidden
* @type object
*/
var BaseLegend = {
    /**
    * @name BaseLegend.horizontalAlignment
    * @type Enums.HorizontalAlignment
    * @default 'right'
    */
    horizontalAlignment: 'right',
    /**
    * @name BaseLegend.verticalAlignment
    * @type Enums.VerticalEdge
    * @default 'top'
    */
    verticalAlignment: 'top',

    /**
    * @name BaseLegend.orientation
    * @type Enums.Orientation
    * @default undefined
    */
    orientation: undefined,
    /**
    * @name BaseLegend.itemTextPosition
    * @type Enums.Position
    * @default undefined
    */
    itemTextPosition: undefined,

    /**
    * @name BaseLegend.itemsAlignment
    * @type Enums.HorizontalAlignment
    * @default undefined
    */
    itemsAlignment: undefined,
    /**
    * @name BaseLegend.font
    * @type Font
    * @default '#767676' @prop color
    */
    font: {
        color: '#767676',
        family: undefined,
        weight: undefined,
        size: undefined,
        opacity: undefined
    },
    /**
    * @name BaseLegend.visible
    * @type boolean
    * @default true
    */
    visible: true,
    /**
    * @name BaseLegend.margin
    * @type number | object
    * @default 10
    */
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

    /**
    * @name BaseLegend.markerSize
    * @type number
    * @default 20
    */
    markerSize: 20,
    /**
    * @name BaseLegend.border
    * @type object
    */
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
    /**
    * @name BaseLegend.backgroundColor
    * @type string
    * @default undefined
    */
    backgroundColor: undefined,
    /**
    * @name BaseLegend.paddingLeftRight
    * @type number
    * @default 10
    */
    paddingLeftRight: 10,
    /**
    * @name BaseLegend.paddingTopBottom
    * @type number
    * @default 10
    */
    paddingTopBottom: 10,
    /**
    * @name BaseLegend.columnCount
    * @type number
    * @default 0
    */
    columnCount: 0,
    /**
    * @name BaseLegend.rowCount
    * @type number
    * @default 0
    */
    rowCount: 0,
    /**
    * @name BaseLegend.columnItemSpacing
    * @type number
    * @default 20
    */
    columnItemSpacing: 20,
    /**
    * @name BaseLegend.rowItemSpacing
    * @type number
    * @default 8
    */
    rowItemSpacing: 8,
    /**
    * @name BaseLegend.title
    * @type object|string
    */
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
