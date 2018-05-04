/**
* @name BaseWidget
* @publicName BaseWidget
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

    // DEPRECATED_16_1
    /**
    * @pseudo CommonVizPrecision
    * @type number
    * @default undefined
    * @deprecated
    */

    /**
    * @pseudo CommonVizFontFamily
    * @type string
    * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
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
    * @name BaseWidgetOptions.pathmodified
    * @publicName pathModified
    * @type boolean
    * @default false
    * @notUsedInTheme
    */
    pathModified: false,
    /**
    * @name BaseWidgetOptions.rtlEnabled
    * @publicName rtlEnabled
    * @type boolean
    * @notUsedInTheme
    * @default false
    */
    rtlEnabled: DX.rtlEnabled,
    /**
    * @name BaseWidgetOptions.size
    * @publicName size
    * @type object
    * @default undefined
    */
    size: {
        /**
        * @name BaseWidgetOptions.size.width
        * @publicName width
        * @type number
        * @default undefined
        */
        width: undefined,
        /**
        * @name BaseWidgetOptions.size.height
        * @publicName height
        * @type number
        * @default undefined
        */
        height: undefined
    },
    /**
    * @name BaseWidgetOptions.margin
    * @publicName margin
    * @type object
    */
    margin: {
        /**
        * @name BaseWidgetOptions.margin.left
        * @publicName left
        * @type number
        * @default 0
        */
        left: 0,
        /**
        * @name BaseWidgetOptions.margin.right
        * @publicName right
        * @type number
        * @default 0
        */
        right: 0,
        /**
        * @name BaseWidgetOptions.margin.top
        * @publicName top
        * @type number
        * @default 0
        */
        top: 0,
        /**
        * @name BaseWidgetOptions.margin.bottom
        * @publicName bottom
        * @type number
        * @default 0
        */
        bottom: 0
    },
    /**
    * @name BaseWidgetOptions.redrawonresize
    * @publicName redrawOnResize
    * @type boolean
    * @default true
    * @notUsedInTheme
    */
    redrawOnResize: true,
    /**
    * @name BaseWidgetOptions.onIncidentoccurred
    * @publicName onIncidentOccurred
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
    * @publicName onDrawn
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
    * @publicName width
    * @type number|string|function
    * @hidden
    */
    width: undefined,
    /**
    * @name BaseWidgetOptions.height
    * @publicName height
    * @type number|string|function
    * @hidden
    */
    height: undefined,
    /**
    * @name BaseWidgetOptions.theme
    * @publicName theme
    * @type Enums.VizTheme
    * @default 'generic.light'
    */
    theme: 'generic.light',
    /**
    * @name BaseWidgetOptions.title
    * @publicName title
    * @type object|string
    */
    title: {
        /**
        * @name BaseWidgetOptions.title.verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name BaseWidgetOptions.title.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'center'
        */
        horizontalAlignment: 'center',
        /**
        * @name BaseWidgetOptions.title.text
        * @publicName text
        * @type string
        * @default null
        */
        text: null,
        /**
        * @name BaseWidgetOptions.title.margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name BaseWidgetOptions.title.margin.top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name BaseWidgetOptions.title.margin.bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name BaseWidgetOptions.title.margin.left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name BaseWidgetOptions.title.margin.right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name BaseWidgetOptions.title.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.title.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana",
            /**
            * @name BaseWidgetOptions.title.font.weight
            * @publicName weight
            * @type number
            * @default 200
            */
            weight: 200,
            /**
            * @name BaseWidgetOptions.title.font.color
            * @publicName color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions.title.font.size
            * @publicName size
            * @type number|string
            * @default 28
            */
            size: 28,
            /**
            * @name BaseWidgetOptions.title.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions.title.placeholdersize
        * @publicName placeholderSize
        * @type number
        * @default undefined
        */
        placeholderSize: undefined,
        /**
        * @name BaseWidgetOptions.title.subtitle
        * @publicName subtitle
        * @type object|string
        */
        subtitle: {
            /**
            * @name BaseWidgetOptions.title.subtitle.text
            * @publicName text
            * @type string
            * @default null
            */
            text: null,
            /**
            * @name BaseWidgetOptions.title.subtitle.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name BaseWidgetOptions.title.subtitle.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana",
                /**
                * @name BaseWidgetOptions.title.subtitle.font.weight
                * @publicName weight
                * @type number
                * @default 200
                */
                weight: 200,
                /**
                * @name BaseWidgetOptions.title.subtitle.font.color
                * @publicName color
                * @type string
                * @default '#232323'
                */
                color: '#232323',
                /**
                * @name BaseWidgetOptions.title.subtitle.font.size
                * @publicName size
                * @type number|string
                * @default 16
                */
                size: 16,
                /**
                * @name BaseWidgetOptions.title.subtitle.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
    },
    /**
    * @name BaseWidgetOptions.export
    * @publicName export
    * @type object
    */
    'export': {
        /**
        * @name BaseWidgetOptions.export.enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions.export.printingenabled
        * @publicName printingEnabled
        * @type boolean
        * @default true
        */
        printingEnabled: true,
        /**
        * @name BaseWidgetOptions.export.formats
        * @publicName formats
        * @type Array<string>
        * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
        */
        formats: ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF'],
        /**
        * @name BaseWidgetOptions.export.filename
        * @publicName fileName
        * @type string
        * @default 'file'
        */
        fileName: 'file',
        /**
        * @name BaseWidgetOptions.export.proxyurl
        * @publicName proxyUrl
        * @type string
        * @default undefined
        */
        proxyUrl: undefined,
        /**
        * @name BaseWidgetOptions.export.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default '#ffffff'
        */
        backgroundColor: '#ffffff',
        /**
        * @name BaseWidgetOptions.export.margin
        * @publicName margin
        * @type number
        * @default 10
        */
        margin: 10
    },
    /**
    * @name BaseWidgetOptions.onexporting
    * @publicName onExporting
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
    * @name BaseWidgetOptions.onexported
    * @publicName onExported
    * @extends Action
    * @action
    */
    onExported: function() { },
    /**
    * @name BaseWidgetOptions.onfilesaving
    * @publicName onFileSaving
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
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseWidgetOptions.tooltip.enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions.tooltip.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name BaseWidgetOptions.tooltip.zindex
        * @publicName zIndex
        * @type number
        * @default undefined
        */
        zIndex: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.container
        * @publicName container
        * @type string|Node|jQuery
        * @default undefined
        */
        container: undefined,
        /**
        * @name BaseWidgetOptions.tooltip.opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
       * @name BaseWidgetOptions.tooltip.border
       * @publicName border
       * @type object
       */
        border: {
            /**
            * @name BaseWidgetOptions.tooltip.border.width
            * @publicName width
            * @default 1
            * @type number
            */
            width: 1,
            /**
            * @name BaseWidgetOptions.tooltip.border.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name BaseWidgetOptions.tooltip.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid',
            /**
            * @name BaseWidgetOptions.tooltip.border.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name BaseWidgetOptions.tooltip.border.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name BaseWidgetOptions.tooltip.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.tooltip.font.color
            * @publicName color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions.tooltip.font.size
            * @publicName size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name BaseWidgetOptions.tooltip.font.family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name BaseWidgetOptions.tooltip.font.weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name BaseWidgetOptions.tooltip.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions.tooltip.arrowlength
        * @publicName arrowLength
        * @type number
        * @default 10
        */
        arrowLength: 10,
        /**
        * @name BaseWidgetOptions.tooltip.paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 18
        */
        paddingLeftRight: 18,
        /**
        * @name BaseWidgetOptions.tooltip.paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 15
        */
        paddingTopBottom: 15,
        /**
       * @name BaseWidgetOptions.tooltip.shadow
       * @publicName shadow
       * @type object
       */
        shadow: {
            /**
            * @name BaseWidgetOptions.tooltip.shadow.opacity
            * @publicName opacity
            * @type number
            * @default 0.4
            */
            opacity: 0.4,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.color
            * @publicName color
            * @type string
            * @default #000000
            */
            color: '#000000',
            /**
            * @name BaseWidgetOptions.tooltip.shadow.offsetx
            * @publicName offsetX
            * @type number
            * @default 0
            */
            offsetX: 0,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.offsety
            * @publicName offsetY
            * @type number
            * @default 4
            */
            offsetY: 4,
            /**
            * @name BaseWidgetOptions.tooltip.shadow.blur
            * @publicName blur
            * @type number
            * @default 2
            */
            blur: 2
        }
    },
    /**
    * @name BaseWidgetOptions.loadingindicator
    * @publicName loadingIndicator
    * @type object
    */
    loadingIndicator: {
        /**
       * @name BaseWidgetOptions.loadingindicator.show
       * @publicName show
       * @type boolean
       * @default false
       */
        show: false,
        /**
        * @name BaseWidgetOptions.loadingindicator.text
        * @publicName text
        * @type string
        * @default 'Loading...'
        */
        text: 'Loading...',
        /**
        * @name BaseWidgetOptions.loadingindicator.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default '#FFFFFF'
        */
        backgroundColor: '#FFFFFF',
        /**
        * @name BaseWidgetOptions.loadingindicator.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions.loadingindicator.font.family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name BaseWidgetOptions.loadingindicator.font.weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name BaseWidgetOptions.loadingindicator.font.color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name BaseWidgetOptions.loadingindicator.font.size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name BaseWidgetOptions.loadingindicator.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    }
};

/**
* @name ScaleBreak
* @publicName ScaleBreak
* @hidden
* @type object
*/
var ScaleBreak = {
    /**
    * @name ScaleBreak.startvalue
    * @publicName startValue
    * @type number|date|string
    * @default undefined
    */
    startValue: undefined,
    /**
    * @name ScaleBreak.endValue
    * @publicName endValue
    * @type number|date|string
    * @default undefined
    */
    endValue: undefined
};

/**
* @name VizTimeInterval
* @publicName VizTimeInterval
* @type object
* @hidden
*/
var tickInterval = {
    /**
    * @pseudo VizTimeIntervalEnum
    * @type number|object|string
    * @default undefined
    * @acceptValues 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
    */

    /**
    * @name VizTimeInterval.years
    * @publicName years
    * @type number
    */
    years: undefined,
    /**
    * @name VizTimeInterval.quarters
    * @publicName quarters
    * @type number
    */
    quarters: undefined,
    /**
    * @name VizTimeInterval.months
    * @publicName months
    * @type number
    */
    months: undefined,
    /**
    * @name VizTimeInterval.weeks
    * @publicName weeks
    * @type number
    */
    weeks: undefined,
    /**
    * @name VizTimeInterval.days
    * @publicName days
    * @type number
    */
    days: undefined,
    /**
    * @name VizTimeInterval.hours
    * @publicName hours
    * @type number
    */
    hours: undefined,
    /**
    * @name VizTimeInterval.minutes
    * @publicName minutes
    * @type number
    */
    minutes: undefined,
    /**
    * @name VizTimeInterval.seconds
    * @publicName seconds
    * @type number
    */
    seconds: undefined,
    /**
    * @name VizTimeInterval.milliseconds
    * @publicName milliseconds
    * @type number
    */
    milliseconds: undefined
};
