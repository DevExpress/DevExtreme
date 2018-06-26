/**
* @name dxSankey
* @inherits BaseWidget
* @module viz/sankey
* @export default
*/
var dxSankey = {
    /**
    * @name dxSankey.Options
    * @namespace DevExpress.viz.sankey
    * @hidden
    */
    /**
    * @name dxSankeyOptions.hoverEnabled
    * @type boolean
    * @default true
    */
    hoverEnabled: true,
    /**
    * @name dxSankeyOptions.palette
    * @extends CommonVizPalette
    */
    palette: [],
    /**
    * @name dxSankeyOptions.paletteExtensionMode
    * @type Enums.VizPaletteExtensionMode
    * @default 'blend'
    */
    paletteExtensionMode: 'blend',
    /**
    * @name dxSankeyOptions.align
    * @type Enums.VerticalAlignment|Array<Enums.VerticalAlignment>
    * @default 'center'
    */
    align: 'center',
    /**
    * @name dxSankeyOptions.adaptiveLayout
    * @type object
    */
    adaptiveLayout: {
        /**
        * @name dxSankeyOptions.adaptiveLayout.width
        * @type number
        * @default 80
        */
        width: 80,
        /**
        * @name dxSankeyOptions.adaptiveLayout.height
        * @type number
        * @default 80
        */
        height: 80,
        /**
        * @name dxSankeyOptions.adaptiveLayout.keepLabels
        * @type boolean
        * @default true
        */
        keepLabels: true
    },
    /**
    * @name dxSankeyOptions.dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxSankeyOptions.sortData
    * @type object
    * @default undefined
    */
    sortData: undefined,
    /**
    * @name dxSankeyOptions.label
    * @type object
    */
    label: {
        /**
        * @name dxSankeyOptions.label.overlapingBehavior
        * @type Enums.SankeyLabelOverlappingBehavior
        * @default 'ellipsis'
        */
        overlappingBehavior: 'ellipsis',
        /**
        * @name dxSankeyOptions.label.colorMode
        * @type Enums.SankeyColorMode
        * @default 'none'
        */
        colorMode: 'none',
        /**
        * @name dxSankeyOptions.label.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name  dxSankeyOptions.label.horizontalOffset
        * @type number
        * @default 5
        */
        horizontalOffset: 5,
        /**
        * @name  dxSankeyOptions.label.verticalOffset
        * @type number
        * @default 0
        */
        verticalOffset: 0,
        /**
        * @name dxSankeyOptions.label.stroke
        * @type string
        * @default "#000000"
        */
        stroke: "#000000",
        /**
        * @name dxSankeyOptions.label.font
        * @type object
        */
        font: {
            /**
            * @name dxSankeyOptions.label.font.color
            * @type string
            * @default '#ffffff'
            */
            color: '#ffffff',
            /**
            * @name dxSankeyOptions.label.font.family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxSankeyOptions.label.font.weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxSankeyOptions.label.font.size
            * @type number|string
            * @default undefined
            */
            size: undefined,
            /**
            * @name dxSankeyOptions.label.font.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxSankeyOptions.label.shadow
        * @type object
        */
        shadow: {
            /**
            * @name dxSankeyOptions.label.shadow.color
            * @type string
            * @default '#000000'
            */
            color: '#000000',
            /**
            * @name dxSankeyOptions.label.shadow.blur
            * @type number
            * @default 1
            */
            blur: 1,
            /**
            * @name dxSankeyOptions.label.shadow.opacity
            * @type number
            * @default 0.8
            */
            opacity: 0.8,
            /**
            * @name dxSankeyOptions.label.shadow.offsetX
            * @type number
            * @default 0
            */
            offsetX: 0,
            /**
            * @name dxSankeyOptions.label.shadow.offsetY
            * @type number
            * @default 1
            */
            offsetY: 1,
        },
        /**
        * @name dxSankeyOptions.label.customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo: dxSankeyNode
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined
    },
    /**
    * @name dxSankeyOptions.tooltip
    * @type object
    * @inheritdoc
    */
    tooltip: {
        /**
        * @name dxSankeyOptions.tooltip.enabled
        * @type boolean
        * @default true
        * @inheritdoc
        */
        enabled: true,
        /**
        * @name  dxSankeyOptions.tooltip.customizeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 type:string
        * @type_function_param1_field2 from:string
        * @type_function_param1_field3 to:string
        * @type_function_param1_field4 weight:Number
        * @type_function_param1_field5 title:string
        * @type_function_param1_field6 weightIn:Number
        * @type_function_param1_field7 weightOut:Number
        * @type_function_return object
        */
        customizeTooltip: undefined
    },
    /**
    * @name dxSankeyOptions.nodes
    * @type object
    */
    nodes: {
        /**
        * @name dxSankeyOptions.nodes.color
        * @type number
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxSankeyOptions.nodes.width
        * @type number
        * @default 15
        */
        width: 15,
        /**
        * @name dxSankeyOptions.nodes.padding
        * @type number
        * @default 30
        */
        padding: 30,
        /**
        * @name dxSankeyOptions.nodes.opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxSankeyOptions.nodes.colorMode
        * @type Enums.SankeyColorMode
        * @default 'none'
        */
        colorMode: 'none',
        /**
        * @name dxSankeyOptions.nodes.border
        * @type object
        */
        border: {
            /**
            * @name dxSankeyOptions.nodes.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxSankeyOptions.nodes.border.width
            * @type number
            * @default 2
            */
            width: 1,
            /**
            * @name dxSankeyOptions.nodes.border.color
            * @type string
            * @default #000000
            */
            color: '#000000'
        },
        /**
        * @name dxSankeyOptions.nodes.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxSankeyOptions.nodes.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxSankeyOptions.nodes.hoverStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.hatching.opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxSankeyOptions.nodes.hoverStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },
    },
    /**
    * @name dxSankeyOptions.links
    * @type object
    */
    links: {
        /**
        * @name dxSankeyOptions.links.color
        * @type number
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxSankeyOptions.links.opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxSankeyOptions.links.border
        * @type object
        */
        border: {
            /**
            * @name dxSankeyOptions.links.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxSankeyOptions.links.border.width
            * @type number
            * @default 2
            */
            width: 1,
            /**
            * @name dxSankeyOptions.links.border.color
            * @type string
            * @default #000000
            */
            color: '#000000'
        },
        /**
        * @name dxSankeyOptions.links.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxSankeyOptions.links.hoverStyle.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5,
            /**
            * @name dxSankeyOptions.links.hoverStyle.color
            * @type number
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxSankeyOptions.links.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxSankeyOptions.links.hoverStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxSankeyOptions.links.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxSankeyOptions.links.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxSankeyOptions.links.hoverStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxSankeyOptions.links.hoverStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxSankeyOptions.links.hoverStyle.hatching.opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxSankeyOptions.links.hoverStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxSankeyOptions.links.hoverStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },
    },
    /**
    * @name dxSankeyOptions.onItemClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 event:event
    * @type_function_param1_field5 item:dxSankeyNode|dxSankeyLink
    * @notUsedInTheme
    * @action
    */
    onItemClick: function() { },
    /**
    * @name dxSankeyOptions.onHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 item:dxSankeyNode|dxSankeyLink
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxSankeyMethods.getAllNodes
    * @publicName getAllNodes()
    * @return Array<dxSankeyNode>
    */
    getAllNodes: function() { },
    /**
    * @name dxSankeyMethods.getAllLinks
    * @publicName getAllLinks()
    * @return Array<dxSankeyLink>
    */
    getAllLinks: function() { }
}
