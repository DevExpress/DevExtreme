/**
* @name dxFunnel
* @publicName dxFunnel
* @inherits BaseWidget
* @module viz/funnel
* @export default
*/
var dxFunnel = {
    /**
    * @name dxFunnel.options
    * @publicName Options
    * @namespace DevExpress.viz.funnel
    * @hidden
    */
    /**
    * @name dxFunneloptions.adaptivelayout
    * @publicName adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name dxFunneloptions.adaptivelayout.width
        * @publicName width
        * @type number
        * @default 80
        */
        width: 80,
        /**
        * @name dxFunneloptions.adaptivelayout.height
        * @publicName height
        * @type number
        * @default 80
        */
        height: 80,
        /**
        * @name dxFunneloptions.adaptivelayout.keeplabels
        * @publicName keepLabels
        * @type boolean
        * @default true
        */
        keepLabels: true
    },
    /**
    * @name dxFunneloptions.datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxFunneloptions.valuefield
    * @publicName valueField
    * @type string
    * @default 'val'
    */
    valueField: "val",
    /**
    * @name dxFunneloptions.argumentfield
    * @publicName argumentField
    * @type string
    * @default 'arg'
    */
    argumentField: "arg",
    /**
    * @name dxFunneloptions.colorfield
    * @publicName colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxFunneloptions.palette
    * @publicName palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxFunneloptions.paletteextensionmode
    * @publicName paletteExtensionMode
    * @type Enums.VizPaletteExtensionMode
    * @default 'blend'
    */
    paletteExtensionMode: 'blend',
    /**
    * @name dxFunneloptions.hoverenabled
    * @publicName hoverEnabled
    * @type boolean
    * @default true
    */
    hoverEnabled: true,
    /**
    * @name dxFunneloptions.selectionmode
    * @publicName selectionMode
    * @type Enums.SelectionMode
    * @default 'single'
    */
    selectionMode: 'single',
    /**
    * @name dxFunneloptions.algorithm
    * @publicName algorithm
    * @type Enums.FunnelAlgorithm
    * @default 'dynamicSlope'
    */
    algorithm: "dynamicSlope",
    /**
    * @name dxFunneloptions.neckheight
    * @publicName neckHeight
    * @type number
    * @default 0
    */
    neckHeight: 0,
    /**
    * @name dxFunneloptions.neckwidth
    * @publicName neckWidth
    * @type number
    * @default 0
    */
    neckWidth: 0,
    /**
    * @name dxFunneloptions.inverted
    * @publicName inverted
    * @type boolean
    * @default false
    */
    inverted: false,
    /**
    * @name dxFunneloptions.sortdata
    * @publicName sortData
    * @type boolean
    * @default true
    */
    sortData: true,
    /**
    * @name dxFunneloptions.item
    * @publicName item
    * @type object
    */
    item: {
        /**
        * @name dxFunneloptions.item.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxFunneloptions.item.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunneloptions.item.border.width
            * @publicName width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxFunneloptions.item.border.color
            * @publicName color
            * @type string
            * @default #ffffff
            */
            color: "#ffffff"
        },
        /**
        * @name dxFunneloptions.item.hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxFunneloptions.item.hoverstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxFunneloptions.item.hoverstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunneloptions.item.hoverstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunneloptions.item.hoverstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunneloptions.item.hoverstyle.hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunneloptions.item.hoverstyle.hatching.direction
                * @publicName direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxFunneloptions.item.hoverstyle.hatching.opacity
                * @publicName opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxFunneloptions.item.hoverstyle.hatching.step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunneloptions.item.hoverstyle.hatching.width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },

        /**
        * @name dxFunneloptions.item.selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxFunneloptions.item.selectionstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxFunneloptions.item.selectionstyle.border.visible
                * @publicName visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunneloptions.item.selectionstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunneloptions.item.selectionstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunneloptions.item.selectionstyle.hatching
            * @publicName hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunneloptions.item.selectionstyle.hatching.opacity
                * @publicName opacity
                * @type number
                * @default 0.5
                */
                opacity: 0.5,
                /**
                * @name dxFunneloptions.item.selectionstyle.hatching.step
                * @publicName step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunneloptions.item.selectionstyle.hatching.width
                * @publicName width
                * @type number
                * @default 2
                */
                width: 2,
                /**
                * @name dxFunneloptions.item.selectionstyle.hatching.direction
                * @publicName direction
                * @type Enums.HatchingDirection
                * @default "right"
                */
                direction: "right"
            }
        }
    },

    /**
    * @name dxFunneloptions.label
    * @publicName label
    * @type object
    */
    label: {
        /**
        * @name dxFunneloptions.label.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxFunneloptions.label.font.color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxFunneloptions.label.font.family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxFunneloptions.label.font.weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxFunneloptions.label.font.size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxFunneloptions.label.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxFunneloptions.label.position
        * @publicName position
        * @type Enums.FunnelLabelPosition
        * @default 'columns'
        */
        position: "columns",
        /**
        * @name dxFunneloptions.label.horizontaloffset
        * @publicName horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxFunneloptions.label.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalEdge
        * @default 'right'
        */
        horizontalAlignment: "right",
        /**
        * @name dxFunneloptions.label.format
        * @publicName format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxFunneloptions.label.connector
        * @publicName connector
        * @type object
        */
        connector: {
            /**
            * @name dxFunneloptions.label.connector.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxFunneloptions.label.connector.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunneloptions.label.connector.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxFunneloptions.label.connector.opacity
            * @publicName opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },

        /**
        * @name dxFunneloptions.label.backgroundcolor
        * @publicName backgroundColor
        * @type string
        */
        backgroundColor: undefined,
        /**
        * @name dxFunneloptions.label.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxFunneloptions.label.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunneloptions.label.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunneloptions.label.border.color
            * @publicName color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxFunneloptions.label.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxFunneloptions.label.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxFunneloptions.label.showforzerovalues
        * @publicName showForZeroValues
        * @type boolean
        * @default false
        */
        showForZeroValues: false,
        /**
        * @name dxFunneloptions.label.customizetext
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
    * @name dxFunneloptions.legend
    * @publicName legend
    * @type object
    */
    legend: {
        /**
        * @name dxFunneloptions.legend.verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name dxFunneloptions.legend.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxFunneloptions.legend.orientation
        * @publicName orientation
        * @type Enums.Orientation
        * @default undefined
        */
        orientation: undefined,
        /**
        * @name dxFunneloptions.legend.itemtextposition
        * @publicName itemTextPosition
        * @type Enums.Position
        * @default undefined
        */
        itemTextPosition: undefined,
        /**
        * @name dxFunneloptions.legend.itemsalignment
        * @publicName itemsAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        itemsAlignment: undefined,
        /**
        * @name dxFunneloptions.legend.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxFunneloptions.legend.font.color
            * @publicName color
            * @type string
            * @default '#767676'
            */
            color: '#767676',
            /**
            * @name dxFunneloptions.legend.font.family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxFunneloptions.legend.font.weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxFunneloptions.legend.font.size
            * @publicName size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxFunneloptions.legend.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxFunneloptions.legend.visible
        * @publicName visible
        * @type boolean
        * @default false
        */
        visible: false,
        /**
        * @name dxFunneloptions.legend.margin
        * @publicName margin
        * @type number | object
        * @default 10
        */
        margin: {
            /**
            * @name dxFunneloptions.legend.margin.top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxFunneloptions.legend.margin.bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxFunneloptions.legend.margin.left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxFunneloptions.legend.margin.right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxFunneloptions.legend.markersize
        * @publicName markerSize
        * @type number
        * @default 20
        */
        markerSize: 20,
        /**
        * @name dxFunneloptions.legend.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxFunneloptions.legend.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxFunneloptions.legend.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunneloptions.legend.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunneloptions.legend.border.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxFunneloptions.legend.border.cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxFunneloptions.legend.border.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxFunneloptions.legend.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxFunneloptions.legend.paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxFunneloptions.legend.paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxFunneloptions.legend.columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name dxFunneloptions.legend.rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name dxFunneloptions.legend.columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 20
        */
        columnItemSpacing: 20,
        /**
        * @name dxFunneloptions.legend.rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8,
        /**
        * @name dxFunneloptions.legend.customizetext
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
        * @name dxFunneloptions.legend.customizehint
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
    * @name dxFunneloptions.tooltip
    * @publicName tooltip
    * @type object
    * @inheritdoc
    */
    tooltip: {
        /**
        * @name dxFunneloptions.tooltip.customizetooltip
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
    * @name dxFunneloptions.onitemclick
    * @publicName onItemClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onItemClick: function() { },
    /**
    * @name dxFunneloptions.onlegendclick
    * @publicName onLegendClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onLegendClick: function() { },
    /**
    * @name dxFunneloptions.onhoverchanged
    * @publicName onHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxFunneloptions.onselectionchanged
    * @publicName onSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 item:dxFunnelItem
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxFunnelmethods.clearselection
    * @publicName clearSelection()
    */
    clearSelection: function () { },
    /**
    * @name dxFunnelmethods.getallitems
    * @publicName getAllItems()
    * @return Array<dxFunnelItem>
    */
    getAllItems: function () { },
    /**
    * @name dxFunnelmethods.hidetooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxFunnelmethods.getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { }
};
