/**
* @name dxfunnel
* @publicName dxFunnel
* @inherits BaseWidget
* @groupName Funnel
* @module viz/funnel
* @export default
*/
var dxFunnel = {
    /**
    * @name dxfunnel_options
    * @publicName Options
    * @namespace DevExpress.viz.funnel
    * @hidden
    */       
    /**
    * @name dxfunneloptions_adaptivelayout
    * @publicName adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name dxfunneloptions_adaptivelayout_width
        * @publicName width
        * @type number
        * @default 80
        */
        width: 80,
        /**
        * @name dxfunneloptions_adaptivelayout_height
        * @publicName height
        * @type number
        * @default 80
        */
        height: 80,
        /**
        * @name dxfunneloptions_adaptivelayout_keeplabels
        * @publicName keepLabels
        * @type boolean
        * @default true
        */
        keepLabels: true
    },
    /**
    * @name dxfunneloptions_datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxfunneloptions_valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    */
    valueField: "val",
    /**
    * @name dxfunneloptions_argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    */
    argumentField: "arg",
    /**
    * @name dxfunneloptions_colorfield
    * @publicName colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxfunneloptions_palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxfunneloptions_hoverenabled
    * @publicName hoverEnabled
    * @type boolean
    * @default true
    */
    hoverEnabled: true,
    /**
    * @name dxfunneloptions_selectionmode
    * @publicName selectionMode
    * @type string
    * @default 'single'
    * @acceptValues 'single'|'multiple'|'none'
    */
    selectionMode: 'single',
    /**
    * @name dxfunneloptions_algorithm
    * @publicName algorithm
    * @type string
    * @default 'dynamicSlope'
    * @acceptValues 'dynamicSlope'|'dynamicHeight'
    */
    algorithm: "dynamicSlope",
    /**
    * @name dxfunneloptions_neckheight
    * @publicName neckHeight
    * @type number
    * @default 0
    */
    neckHeight: 0,
    /**
    * @name dxfunneloptions_neckwidth
    * @publicName neckWidth
    * @type number
    * @default 0
    */
    neckWidth: 0,
    /**
    * @name dxfunneloptions_inverted
    * @publicName inverted
    * @type boolean
    * @default false
    */
    inverted: false,
    /**
    * @name dxfunneloptions_sortdata
    * @publicName sortData
    * @type boolean
    * @default true
    */
    sortData: true,
    /**
    * @name dxfunneloptions_item
    * @publicName item
    * @type object
    */
    item: {
        /**
        * @name dxfunneloptions_item_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxfunneloptions_item_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxfunneloptions_item_border_width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxfunneloptions_item_border_color
            * @publicName color
            * @type string
            * @default #ffffff
            */
            color: "#ffffff"
        },
        /**
        * @name dxfunneloptions_item_hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxfunneloptions_item_hoverstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxfunneloptions_item_hoverstyle_border_visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxfunneloptions_item_hoverstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxfunneloptions_item_hoverstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxfunneloptions_item_hoverstyle_hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxfunneloptions_item_hoverstyle_hatching_direction
                * @publicName direction
                * @type string
                * @default 'right'
                * @acceptValues 'none'|'right'|'left'
                */
                direction: "right",
                /**
                * @name dxfunneloptions_item_hoverstyle_hatching_opacity
                * @publicName opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxfunneloptions_item_hoverstyle_hatching_step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxfunneloptions_item_hoverstyle_hatching_width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },

        /**
        * @name dxfunneloptions_item_selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxfunneloptions_item_selectionstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxfunneloptions_item_selectionstyle_border_visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxfunneloptions_item_selectionstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxfunneloptions_item_selectionstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxfunneloptions_item_selectionstyle_hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxfunneloptions_item_selectionstyle_hatching_opacity
                * @publicName opacity
                * @type number
                * @default 0.5
                */
                opacity: 0.5,
                /**
                * @name dxfunneloptions_item_selectionstyle_hatching_step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxfunneloptions_item_selectionstyle_hatching_width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
                /**
                * @name dxfunneloptions_item_selectionstyle_hatching_direction
                * @publicName direction
                * @type string
                * @default "right"
                * @acceptValues 'none'|'right'|'left'
                */
                direction: "right"
            }
        }
    },

    /**
    * @name dxfunneloptions_label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxfunneloptions_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxfunneloptions_label_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxfunneloptions_label_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxfunneloptions_label_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxfunneloptions_label_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxfunneloptions_label_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxfunneloptions_label_position
        * @publicName position
        * @type string
        * @acceptValues 'inside'|'outside'|'columns'
        * @default 'columns'
        */
        position: "columns",
        /**
        * @name dxfunneloptions_label_horizontaloffset
        * @publicName horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxfunneloptions_label_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @acceptValues 'left'|'right'
        * @default 'right'
        */
        horizontalAlignment: "right",
        /**
        * @name dxfunneloptions_label_format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxfunneloptions_label_connector
        * @publicName connector
        * @type object
        */
        connector: {
            /**
            * @name dxfunneloptions_label_connector_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxfunneloptions_label_connector_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxfunneloptions_label_connector_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxfunneloptions_label_connector_opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },

        /**
        * @name  dxfunneloptions_label_backgroundcolor
        * @publicName backgroundColor
        * @type string
        */
        backgroundColor: undefined,
        /**
        * @name  dxfunneloptions_label_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name  dxfunneloptions_label_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name  dxfunneloptions_label_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name  dxfunneloptions_label_border_color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name  dxfunneloptions_label_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxfunneloptions_label_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxfunneloptions_label_showforzerovalues
        * @publicName showForZeroValues
        * @type boolean
        * @default false
        */
        showForZeroValues: false,
        /**
        * @name dxfunneloptions_label_customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxfunnelItem
        * @type_function_param1_field2 value:Number
        * @type_function_param1_field3 valueText:string
        * @type_function_param1_field4 percent:Number
        * @type_function_param1_field5 percentText:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxfunneloptions_legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxfunneloptions_legend_verticalalignment
        * @publicName verticalAlignment
        * @type string
        * @default 'top'
        * @acceptValues 'top' | 'bottom'
        */
        verticalAlignment: 'top',
        /**
        * @name dxfunneloptions_legend_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @default 'right'
        * @acceptValues 'right' | 'center' | 'left'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxfunneloptions_legend_orientation
        * @publicName orientation
        * @type string
        * @default undefined
        * @acceptValues 'vertical' | 'horizontal'
        */
        orientation: undefined,
        /**
        * @name dxfunneloptions_legend_itemtextposition
        * @publicName itemTextPosition
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'left' | 'top' | 'bottom'
        */
        itemTextPosition: undefined,
        /**
        * @name dxfunneloptions_legend_itemsalignment
        * @publicName itemsAlignment
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'center' | 'left'
        */
        itemsAlignment: undefined,
        /**
        * @name dxfunneloptions_legend_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxfunneloptions_legend_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxfunneloptions_legend_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxfunneloptions_legend_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxfunneloptions_legend_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxfunneloptions_legend_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxfunneloptions_legend_visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxfunneloptions_legend_margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name dxfunneloptions_legend_margin_top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxfunneloptions_legend_margin_bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxfunneloptions_legend_margin_left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxfunneloptions_legend_margin_right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxfunneloptions_legend_markersize
        * @publicName markerSize
        * @type number
        * @default 20
        */
        markerSize: 20,
        /**
        * @name dxfunneloptions_legend_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxfunneloptions_legend_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxfunneloptions_legend_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxfunneloptions_legend_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxfunneloptions_legend_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxfunneloptions_legend_border_cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxfunneloptions_legend_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxfunneloptions_legend_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxfunneloptions_legend_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxfunneloptions_legend_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxfunneloptions_legend_columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name dxfunneloptions_legend_rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name dxfunneloptions_legend_columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 8
        */
        columnItemSpacing: 8,
        /**
        * @name dxfunneloptions_legend_rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8,
        /**
        * @name dxfunneloptions_legend_customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxfunnelItem
        * @type_function_param1_field2 text:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxfunneloptions_legend_customizehint
        * @publicName customizeHint
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxfunnelItem
        * @type_function_param1_field2 text:string
        * @type_function_return string
        */
        customizeHint: undefined,
    },
   /**
    * @name dxfunneloptions_tooltip
    * @publicName tooltip
    * @type object
    * @extend_doc
    */
    tooltip: {
        /**
        * @name  dxfunneloptions_tooltip_customizetooltip
        * @publicName customizeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 item:dxfunnelItem
        * @type_function_param1_field2 value:Number
        * @type_function_param1_field3 valueText:string
        * @type_function_param1_field4 percent:Number
        * @type_function_param1_field5 percentText:string
        * @type_function_return object
        */
        customizeTooltip: undefined
    },
    /**
    * @name dxfunneloptions_onitemclick
    * @publicName onItemClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery.Event
    * @type_function_param1_field4 item:dxfunnelItem
    * @notUsedInTheme
    * @action
    */
    onItemClick: function() { },
    /**
    * @name dxfunneloptions_onlegendclick
    * @publicName onLegendClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery.Event
    * @type_function_param1_field4 item:dxfunnelItem
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxfunneloptions_onhoverchanged
    * @publicName onHoverChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 item:dxfunnelItem
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxfunneloptions_onselectionchanged
    * @publicName onSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 item:dxfunnelItem
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxfunnelmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function () { },
    /**
    * @name dxfunnelmethods_getallitems
    * @publicName getAllItems()
    * @return Array<dxfunnelItem>
    */
    getAllItems: function () { },
    /**
    * @name dxfunnelmethods_hidetooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxfunnelmethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { }
};
