/**
* @name dxFunnel
* @publicName dxFunnel
* @inherits BaseWidget
* @groupName Funnel
* @module viz/funnel
* @export default
*/
var dxFunnel = {
    /**
    * @name dxFunnel_options
    * @publicName Options
    * @namespace DevExpress.viz.funnel
    * @hidden
    */       
    /**
    * @name dxFunneloptions_adaptivelayout
    * @publicName adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name dxFunneloptions_adaptivelayout_width
        * @publicName width
        * @type number
        * @default 80
        */
        width: 80,
        /**
        * @name dxFunneloptions_adaptivelayout_height
        * @publicName height
        * @type number
        * @default 80
        */
        height: 80,
        /**
        * @name dxFunneloptions_adaptivelayout_keeplabels
        * @publicName keepLabels
        * @type boolean
        * @default true
        */
        keepLabels: true
    },
    /**
    * @name dxFunneloptions_datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxFunneloptions_valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    */
    valueField: "val",
    /**
    * @name dxFunneloptions_argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    */
    argumentField: "arg",
    /**
    * @name dxFunneloptions_colorfield
    * @publicName colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxFunneloptions_palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxFunneloptions_hoverenabled
    * @publicName hoverEnabled
    * @type boolean
    * @default true
    */
    hoverEnabled: true,
    /**
    * @name dxFunneloptions_selectionmode
    * @publicName selectionMode
    * @type string
    * @default 'single'
    * @acceptValues 'single'|'multiple'|'none'
    */
    selectionMode: 'single',
    /**
    * @name dxFunneloptions_algorithm
    * @publicName algorithm
    * @type string
    * @default 'dynamicSlope'
    * @acceptValues 'dynamicSlope'|'dynamicHeight'
    */
    algorithm: "dynamicSlope",
    /**
    * @name dxFunneloptions_neckheight
    * @publicName neckHeight
    * @type number
    * @default 0
    */
    neckHeight: 0,
    /**
    * @name dxFunneloptions_neckwidth
    * @publicName neckWidth
    * @type number
    * @default 0
    */
    neckWidth: 0,
    /**
    * @name dxFunneloptions_inverted
    * @publicName inverted
    * @type boolean
    * @default false
    */
    inverted: false,
    /**
    * @name dxFunneloptions_sortdata
    * @publicName sortData
    * @type boolean
    * @default true
    */
    sortData: true,
    /**
    * @name dxFunneloptions_item
    * @publicName item
    * @type object
    */
    item: {
        /**
        * @name dxFunneloptions_item_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxFunneloptions_item_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunneloptions_item_border_width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxFunneloptions_item_border_color
            * @publicName color
            * @type string
            * @default #ffffff
            */
            color: "#ffffff"
        },
        /**
        * @name dxFunneloptions_item_hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxFunneloptions_item_hoverstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxFunneloptions_item_hoverstyle_border_visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunneloptions_item_hoverstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunneloptions_item_hoverstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunneloptions_item_hoverstyle_hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunneloptions_item_hoverstyle_hatching_direction
                * @publicName direction
                * @type string
                * @default 'right'
                * @acceptValues 'none'|'right'|'left'
                */
                direction: "right",
                /**
                * @name dxFunneloptions_item_hoverstyle_hatching_opacity
                * @publicName opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxFunneloptions_item_hoverstyle_hatching_step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunneloptions_item_hoverstyle_hatching_width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },

        /**
        * @name dxFunneloptions_item_selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxFunneloptions_item_selectionstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxFunneloptions_item_selectionstyle_border_visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunneloptions_item_selectionstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunneloptions_item_selectionstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunneloptions_item_selectionstyle_hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunneloptions_item_selectionstyle_hatching_opacity
                * @publicName opacity
                * @type number
                * @default 0.5
                */
                opacity: 0.5,
                /**
                * @name dxFunneloptions_item_selectionstyle_hatching_step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunneloptions_item_selectionstyle_hatching_width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
                /**
                * @name dxFunneloptions_item_selectionstyle_hatching_direction
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
    * @name dxFunneloptions_label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxFunneloptions_label_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxFunneloptions_label_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxFunneloptions_label_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxFunneloptions_label_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxFunneloptions_label_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxFunneloptions_label_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxFunneloptions_label_position
        * @publicName position
        * @type string
        * @acceptValues 'inside'|'outside'|'columns'
        * @default 'columns'
        */
        position: "columns",
        /**
        * @name dxFunneloptions_label_horizontaloffset
        * @publicName horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxFunneloptions_label_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @acceptValues 'left'|'right'
        * @default 'right'
        */
        horizontalAlignment: "right",
        /**
        * @name dxFunneloptions_label_format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxFunneloptions_label_connector
        * @publicName connector
        * @type object
        */
        connector: {
            /**
            * @name dxFunneloptions_label_connector_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxFunneloptions_label_connector_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunneloptions_label_connector_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxFunneloptions_label_connector_opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },

        /**
        * @name  dxFunneloptions_label_backgroundcolor
        * @publicName backgroundColor
        * @type string
        */
        backgroundColor: undefined,
        /**
        * @name  dxFunneloptions_label_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name  dxFunneloptions_label_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name  dxFunneloptions_label_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name  dxFunneloptions_label_border_color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name  dxFunneloptions_label_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxFunneloptions_label_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxFunneloptions_label_showforzerovalues
        * @publicName showForZeroValues
        * @type boolean
        * @default false
        */
        showForZeroValues: false,
        /**
        * @name dxFunneloptions_label_customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxFunnelItem
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
    * @name dxFunneloptions_legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxFunneloptions_legend_verticalalignment
        * @publicName verticalAlignment
        * @type string
        * @default 'top'
        * @acceptValues 'top' | 'bottom'
        */
        verticalAlignment: 'top',
        /**
        * @name dxFunneloptions_legend_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @default 'right'
        * @acceptValues 'right' | 'center' | 'left'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxFunneloptions_legend_orientation
        * @publicName orientation
        * @type string
        * @default undefined
        * @acceptValues 'vertical' | 'horizontal'
        */
        orientation: undefined,
        /**
        * @name dxFunneloptions_legend_itemtextposition
        * @publicName itemTextPosition
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'left' | 'top' | 'bottom'
        */
        itemTextPosition: undefined,
        /**
        * @name dxFunneloptions_legend_itemsalignment
        * @publicName itemsAlignment
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'center' | 'left'
        */
        itemsAlignment: undefined,
        /**
        * @name dxFunneloptions_legend_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxFunneloptions_legend_font_color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxFunneloptions_legend_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxFunneloptions_legend_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxFunneloptions_legend_font_size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxFunneloptions_legend_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxFunneloptions_legend_visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxFunneloptions_legend_margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name dxFunneloptions_legend_margin_top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxFunneloptions_legend_margin_bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxFunneloptions_legend_margin_left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxFunneloptions_legend_margin_right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxFunneloptions_legend_markersize
        * @publicName markerSize
        * @type number
        * @default 20
        */
        markerSize: 20,
        /**
        * @name dxFunneloptions_legend_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxFunneloptions_legend_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxFunneloptions_legend_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunneloptions_legend_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunneloptions_legend_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxFunneloptions_legend_border_cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxFunneloptions_legend_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxFunneloptions_legend_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxFunneloptions_legend_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxFunneloptions_legend_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxFunneloptions_legend_columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name dxFunneloptions_legend_rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name dxFunneloptions_legend_columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 8
        */
        columnItemSpacing: 8,
        /**
        * @name dxFunneloptions_legend_rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8,
        /**
        * @name dxFunneloptions_legend_customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxFunnelItem
        * @type_function_param1_field2 text:string
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxFunneloptions_legend_customizehint
        * @publicName customizeHint
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 item:dxFunnelItem
        * @type_function_param1_field2 text:string
        * @type_function_return string
        */
        customizeHint: undefined,
    },
   /**
    * @name dxFunneloptions_tooltip
    * @publicName tooltip
    * @type object
    * @extend_doc
    */
    tooltip: {
        /**
        * @name  dxFunneloptions_tooltip_customizetooltip
        * @publicName customizeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 item:dxFunnelItem
        * @type_function_param1_field2 value:Number
        * @type_function_param1_field3 valueText:string
        * @type_function_param1_field4 percent:Number
        * @type_function_param1_field5 percentText:string
        * @type_function_return object
        */
        customizeTooltip: undefined
    },
    /**
    * @name dxFunneloptions_onitemclick
    * @publicName onItemClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery.Event
    * @type_function_param1_field4 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onItemClick: function() { },
    /**
    * @name dxFunneloptions_onlegendclick
    * @publicName onLegendClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery.Event
    * @type_function_param1_field4 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxFunneloptions_onhoverchanged
    * @publicName onHoverChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxFunneloptions_onselectionchanged
    * @publicName onSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxFunnelmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function () { },
    /**
    * @name dxFunnelmethods_getallitems
    * @publicName getAllItems()
    * @return Array<dxFunnelItem>
    */
    getAllItems: function () { },
    /**
    * @name dxFunnelmethods_hidetooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxFunnelmethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { }
};
