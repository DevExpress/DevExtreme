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
    * @type array|DataSource|DataSource configuration|string
    * @notUsedInTheme
    */

    /**
    * @pseudo CommonVizPalette
    * @type array|string
    * @default "Default"
    * @acceptValues "Default" | "Soft Pastel" | "Harmony Light" | "Pastel" | "Bright" | "Soft" | "Ocean" | "Vintage" | "Violet"
    */

    /**
    * @name BaseWidgetOptions_pathmodified
    * @publicName pathModified
    * @type boolean
    * @default false
    * @notUsedInTheme
    */
    pathModified: false,
    /**
    * @name BaseWidgetOptions_rtlEnabled
    * @publicName rtlEnabled
    * @type boolean
    * @notUsedInTheme
    * @default false
    */
    rtlEnabled: DX.rtlEnabled,
    /**
    * @name BaseWidgetOptions_size
    * @publicName size
    * @type object
    * @default undefined
    */
    size: {
        /**
        * @name BaseWidgetOptions_size_width
        * @publicName width
        * @type number
        * @default undefined
        */
        width: undefined,
        /**
        * @name BaseWidgetOptions_size_height
        * @publicName height
        * @type number
        * @default undefined
        */
        height: undefined
    },
    /**
    * @name BaseWidgetOptions_margin
    * @publicName margin
    * @type object
    */
    margin: {
        /**
        * @name BaseWidgetOptions_margin_left
        * @publicName left
        * @type number
        * @default 0
        */
        left: 0,
        /**
        * @name BaseWidgetOptions_margin_right
        * @publicName right
        * @type number
        * @default 0
        */
        right: 0,
        /**
        * @name BaseWidgetOptions_margin_top
        * @publicName top
        * @type number
        * @default 0
        */
        top: 0,
        /**
        * @name BaseWidgetOptions_margin_bottom
        * @publicName bottom
        * @type number
        * @default 0
        */
        bottom: 0
    },
    /**
    * @name BaseWidgetOptions_redrawonresize
    * @publicName redrawOnResize
    * @type boolean
    * @default true
    * @notUsedInTheme
    */
    redrawOnResize: true,
    /**
    * @name BaseWidgetOptions_onIncidentoccurred
    * @publicName onIncidentOccurred
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @action
    */
    onIncidentOccurred: function() { },
    /**
    * @name BaseWidgetMethods_svg
    * @publicName svg()
    * @return string
    */
    svg: function() { },
    /**
    * @name BaseWidgetMethods_render
    * @publicName render()
    */
    render: function() { },
    /**
    * @name BaseWidgetMethods_showLoadingIndicator
    * @publicName showLoadingIndicator()
    */
    showLoadingIndicator: function() { },
    /**
    * @name BaseWidgetMethods_hideLoadingIndicator
    * @publicName hideLoadingIndicator()
    */
    hideLoadingIndicator: function() { },
    /**
    * @name BaseWidgetMethods_exportTo
    * @publicName exportTo(fileName, format)
    * @param1 fileName:string
    * @param2 format:string
    */
    exportTo: function() { },
    /**
    * @name BaseWidgetMethods_print
    * @publicName print()
    */
    print: function() { },
    /**
    * @name BaseWidgetOptions_onDrawn
    * @publicName onDrawn
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @notUsedInTheme
    * @action
    */
    onDrawn: function() { },
    /**
     * @name BaseWidgetMethods_defaultOptions
     * @publicName defaultOptions(rule)
     * @hidden
     */
    defaultOptions: function() { },
    /**
    * @name BaseWidgetOptions_width
    * @publicName width
    * @type number|string|function
    * @hidden
    */
    width: undefined,
    /**
    * @name BaseWidgetOptions_height
    * @publicName height
    * @type number|string|function
    * @hidden
    */
    height: undefined,
    /**
    * @name BaseWidgetOptions_theme
    * @publicName theme
    * @type string
    * @default 'generic.light'
    * @acceptValues 'generic.light'|'generic.dark'|'generic.contrast'|'android5.light'|'ios7.default'|'win10.black'|'win10.white'
    * @deprecatedAcceptValues 'win8.black'|'win8.white'
    */
    theme: 'generic.light',
    /**
    * @name BaseWidgetOptions_title
    * @publicName title
    * @type object|string
    */
    title: {
        /**
        * @name BaseWidgetOptions_title_verticalalignment
        * @publicName verticalAlignment
        * @type string
        * @default 'top'
        * @acceptValues 'top' | 'bottom'
        */
        verticalAlignment: 'top',
        /**
        * @name BaseWidgetOptions_title_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @default 'center'
        * @acceptValues 'right' | 'center' | 'left'
        */
        horizontalAlignment: 'center',
        /**
        * @name BaseWidgetOptions_title_text
        * @publicName text
        * @type string
        * @default null
        */
        text: null,
        /**
        * @name BaseWidgetOptions_title_margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name BaseWidgetOptions_title_margin_top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name BaseWidgetOptions_title_margin_bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name BaseWidgetOptions_title_margin_left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name BaseWidgetOptions_title_margin_right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name BaseWidgetOptions_title_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions_title_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana",
            /**
            * @name BaseWidgetOptions_title_font_weight
            * @publicName weight
            * @type number
            * @default 200
            */
            weight: 200,
            /**
            * @name BaseWidgetOptions_title_font_color
            * @publicName color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions_title_font_size
            * @publicName size
            * @type number|string
            * @default 28
            */
            size: 28,
            /**
            * @name BaseWidgetOptions_title_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions_title_placeholdersize
        * @publicName placeholderSize
        * @type number
        * @default undefined
        */
        placeholderSize: undefined,
        /**
        * @name BaseWidgetOptions_title_subtitle
        * @publicName subtitle
        * @type object|string
        */
        subtitle: {
            /**
            * @name BaseWidgetOptions_title_subtitle_text
            * @publicName text
            * @type string
            * @default null
            */
            text: null,
            /**
            * @name BaseWidgetOptions_title_subtitle_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name BaseWidgetOptions_title_subtitle_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI Light', 'Helvetica Neue Light', 'Trebuchet MS', Verdana",
                /**
                * @name BaseWidgetOptions_title_subtitle_font_weight
                * @publicName weight
                * @type number
                * @default 200
                */
                weight: 200,
                /**
                * @name BaseWidgetOptions_title_subtitle_font_color
                * @publicName color
                * @type string
                * @default '#232323'
                */
                color: '#232323',
                /**
                * @name BaseWidgetOptions_title_subtitle_font_size
                * @publicName size
                * @type number|string
                * @default 16
                */
                size: 16,
                /**
                * @name BaseWidgetOptions_title_subtitle_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
    },
    /**
    * @name BaseWidgetOptions_export
    * @publicName export
    * @type object
    */
    'export': {
        /**
        * @name BaseWidgetOptions_export_enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions_export_printingenabled
        * @publicName printingEnabled
        * @type boolean
        * @default true
        */
        printingEnabled: true,
        /**
        * @name BaseWidgetOptions_export_formats
        * @publicName formats
        * @type array
        * @default ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF']
        */
        formats: ['PNG', 'PDF', 'JPEG', 'SVG', 'GIF'],
        /**
        * @name BaseWidgetOptions_export_filename
        * @publicName fileName
        * @type string
        * @default 'file'
        */
        fileName: 'file',
        /**
        * @name BaseWidgetOptions_export_proxyurl
        * @publicName proxyUrl
        * @type string
        * @default undefined
        */
        proxyUrl: undefined,
        /**
        * @name BaseWidgetOptions_export_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default '#ffffff'
        */
        backgroundColor: '#ffffff'
    },
    /**
    * @name BaseWidgetOptions_onexporting
    * @publicName onExporting
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 fileName:string
    * @type_function_param1_field5 cancel:boolean
    * @extends Action
    * @action
    */
    onExporting: function() { },
    /**
    * @name BaseWidgetOptions_onexported
    * @publicName onExported
    * @type function(e)
    * @type_function_param1 e:object
    * @extends Action
    * @action
    */
    onExported: function() { },
    /**
    * @name BaseWidgetOptions_onfilesaving
    * @publicName onFileSaving
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field3 fileName:string
    * @type_function_param1_field4 format:string
    * @type_function_param1_field5 data:blob
    * @type_function_param1_field6 cancel:boolean
    * @extends Action
    * @action
    */
    onFileSaving: function() { },
    /**
    * @name BaseWidgetOptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name BaseWidgetOptions_tooltip_enabled
        * @publicName enabled
        * @type boolean
        * @default false
        */
        enabled: false,
        /**
        * @name BaseWidgetOptions_tooltip_format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: undefined,
        /**
        * @name BaseWidgetOptions_tooltip_precision
        * @publicName precision
        * @extends CommonVizPrecision
        */
        precision: undefined,
        /**
        * @name BaseWidgetOptions_tooltip_color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name BaseWidgetOptions_tooltip_zindex
        * @publicName zIndex
        * @type number
        * @default undefined
        */
        zIndex: undefined,
        /**
        * @name BaseWidgetOptions_tooltip_container
        * @publicName container
        * @type string|Node|jQuery
        * @default undefined
        */
        container: undefined,
        /**
        * @name BaseWidgetOptions_tooltip_opacity
        * @publicName opacity
        * @type number
        * @default undefined
        */
        opacity: undefined,
        /**
       * @name BaseWidgetOptions_tooltip_border
       * @publicName border
       * @type object
       */
        border: {
            /**
            * @name BaseWidgetOptions_tooltip_border_width
            * @publicName width
            * @default 1
            * @type number
            */
            width: 1,
            /**
            * @name BaseWidgetOptions_tooltip_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name BaseWidgetOptions_tooltip_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid',
            /**
            * @name BaseWidgetOptions_tooltip_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name BaseWidgetOptions_tooltip_border_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true
        },
        /**
        * @name BaseWidgetOptions_tooltip_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions_tooltip_font_color
            * @publicName color
            * @type string
            * @default '#232323'
            */
            color: '#232323',
            /**
            * @name BaseWidgetOptions_tooltip_font_size
            * @publicName size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name BaseWidgetOptions_tooltip_font_family
            * @publicName family
            * @type string
            * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
            */
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            /**
            * @name BaseWidgetOptions_tooltip_font_weight
            * @publicName weight
            * @type number
            * @default 400
            */
            weight: 400,
            /**
            * @name BaseWidgetOptions_tooltip_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name BaseWidgetOptions_tooltip_arrowlength
        * @publicName arrowLength
        * @type number
        * @default 10
        */
        arrowLength: 10,
        /**
        * @name BaseWidgetOptions_tooltip_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 18
        */
        paddingLeftRight: 18,
        /**
        * @name BaseWidgetOptions_tooltip_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 15
        */
        paddingTopBottom: 15,
        /**
       * @name BaseWidgetOptions_tooltip_shadow
       * @publicName shadow
       * @type object
       */
        shadow: {
            /**
            * @name BaseWidgetOptions_tooltip_shadow_opacity
            * @publicName opacity
            * @type number
            * @default 0.4
            */
            opacity: 0.4,
            /**
            * @name BaseWidgetOptions_tooltip_shadow_color
            * @publicName color
            * @type string
            * @default #000000
            */
            color: '#000000',
            /**
            * @name BaseWidgetOptions_tooltip_shadow_offsetx
            * @publicName offsetX
            * @type number
            * @default 0
            */
            offsetX: 0,
            /**
            * @name BaseWidgetOptions_tooltip_shadow_offsety
            * @publicName offsetY
            * @type number
            * @default 4
            */
            offsetY: 4,
            /**
            * @name BaseWidgetOptions_tooltip_shadow_blur
            * @publicName blur
            * @type number
            * @default 2
            */
            blur: 2
        }
    },
    /**
    * @name BaseWidgetOptions_loadingindicator
    * @publicName loadingIndicator
    * @type object
    */
    loadingIndicator: {
        /**
       * @name BaseWidgetOptions_loadingindicator_show
       * @publicName show
       * @type boolean
       * @default false
       */
        show: false,
        /**
        * @name BaseWidgetOptions_loadingindicator_text
        * @publicName text
        * @type string
        * @default 'Loading...'
        */
        text: 'Loading...',
        /**
        * @name BaseWidgetOptions_loadingindicator_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default '#FFFFFF'
        */
        backgroundColor: '#FFFFFF',
        /**
        * @name BaseWidgetOptions_loadingindicator_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name BaseWidgetOptions_loadingindicator_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name BaseWidgetOptions_loadingindicator_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name BaseWidgetOptions_loadingindicator_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name BaseWidgetOptions_loadingindicator_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name BaseWidgetOptions_loadingindicator_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        }
    }
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
    * @name VizTimeInterval_years
    * @publicName years
    * @type number
    */
    years: undefined,
    /**
    * @name VizTimeInterval_quarters
    * @publicName quarters
    * @type number
    */
    quarters: undefined,
    /**
    * @name VizTimeInterval_months
    * @publicName months
    * @type number
    */
    months: undefined,
    /**
    * @name VizTimeInterval_weeks
    * @publicName weeks
    * @type number
    */
    weeks: undefined,
    /**
    * @name VizTimeInterval_days
    * @publicName days
    * @type number
    */
    days: undefined,
    /**
    * @name VizTimeInterval_hours
    * @publicName hours
    * @type number
    */
    hours: undefined,
    /**
    * @name VizTimeInterval_minutes
    * @publicName minutes
    * @type number
    */
    minutes: undefined,
    /**
    * @name VizTimeInterval_seconds
    * @publicName seconds
    * @type number
    */
    seconds: undefined,
    /**
    * @name VizTimeInterval_milliseconds
    * @publicName milliseconds
    * @type number
    */
    milliseconds: undefined
};
