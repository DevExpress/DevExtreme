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
    * @pseudo CommonVizFontFamily
    * @type string
    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
    */

    /**
    * @pseudo CommonVizLightFontFamily
    * @type string
    * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif"
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
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.title.font.family
            * @extends CommonVizLightFontFamily
            */
            family: undefined,
            /**
            * @name BaseWidgetOptions.title.font.weight
            * @type number
            * @default 200
            */
            weight: 200,
            /**
            * @name BaseWidgetOptions.title.font.color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions.title.font.size
            * @type number|string
            * @default 28
            */
            size: 28,
            /**
            * @name BaseWidgetOptions.title.font.opacity
            * @type number
            * @default undefined
            */
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
            * @type object
            */
            font: {
                /**
                * @name BaseWidgetOptions.title.subtitle.font.family
                * @extends CommonVizLightFontFamily
                */
                family: undefined,
                /**
                * @name BaseWidgetOptions.title.subtitle.font.weight
                * @type number
                * @default 200
                */
                weight: 200,
                /**
                * @name BaseWidgetOptions.title.subtitle.font.color
                * @type string
                * @default '#232323'
                */
                color: '#232323',
                /**
                * @name BaseWidgetOptions.title.subtitle.font.size
                * @type number|string
                * @default 16
                */
                size: 16,
                /**
                * @name BaseWidgetOptions.title.subtitle.font.opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
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
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.tooltip.font.color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions.tooltip.font.size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name BaseWidgetOptions.tooltip.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name BaseWidgetOptions.tooltip.font.weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name BaseWidgetOptions.tooltip.font.opacity
            * @type number
            * @default undefined
            */
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
       */
        show: false,
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
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.loadingIndicator.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name BaseWidgetOptions.loadingIndicator.font.weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name BaseWidgetOptions.loadingIndicator.font.color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name BaseWidgetOptions.loadingIndicator.font.size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name BaseWidgetOptions.loadingIndicator.font.opacity
            * @type number
            * @default undefined
            */
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
