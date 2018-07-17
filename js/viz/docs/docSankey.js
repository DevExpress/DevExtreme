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
    * @name dxSankeyOptions.alignment
    * @type Enums.VerticalAlignment|Array<Enums.VerticalAlignment>
    * @default 'center'
    */
    alignment: 'center',
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
        * @name  dxSankeyOptions.tooltip.customizeNodeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 title:string
        * @type_function_param1_field2 weightIn:Number
        * @type_function_param1_field3 weightOut:Number
        * @type_function_return object
        */
        customizeNodeTooltip: undefined,
        /**
        * @name  dxSankeyOptions.tooltip.customizeLinkTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 from:string
        * @type_function_param1_field2 to:string
        * @type_function_param1_field3 weight:Number
        * @type_function_return object
        */
        customizeLinkTooltip: undefined
    },
    /**
    * @name dxSankeyOptions.node
    * @type object
    */
    node: {
        /**
        * @name dxSankeyOptions.node.color
        * @type number
        * @default undefined
        */
        color: undefined,
        /**
        * @name dxSankeyOptions.node.width
        * @type number
        * @default 15
        */
        width: 15,
        /**
        * @name dxSankeyOptions.node.padding
        * @type number
        * @default 30
        */
        padding: 30,
        /**
        * @name dxSankeyOptions.node.opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxSankeyOptions.node.colorMode
        * @type Enums.SankeyColorMode
        * @default 'none'
        */
        colorMode: 'none',
        /**
        * @name dxSankeyOptions.node.border
        * @type object
        */
        border: {
            /**
            * @name dxSankeyOptions.node.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxSankeyOptions.node.border.width
            * @type number
            * @default 2
            */
            width: 1,
            /**
            * @name dxSankeyOptions.node.border.color
            * @type string
            * @default #000000
            */
            color: '#000000'
        },
        /**
        * @name dxSankeyOptions.node.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxSankeyOptions.node.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxSankeyOptions.node.hoverStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxSankeyOptions.node.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxSankeyOptions.node.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxSankeyOptions.node.hoverStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxSankeyOptions.node.hoverStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxSankeyOptions.node.hoverStyle.hatching.opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxSankeyOptions.node.hoverStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxSankeyOptions.node.hoverStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },
    },
    /**
    * @name dxSankeyOptions.link
    * @type object
    */
    link: {
        /**
        * @name dxSankeyOptions.link.color
        * @type number
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxSankeyOptions.link.opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxSankeyOptions.link.border
        * @type object
        */
        border: {
            /**
            * @name dxSankeyOptions.link.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxSankeyOptions.link.border.width
            * @type number
            * @default 2
            */
            width: 1,
            /**
            * @name dxSankeyOptions.link.border.color
            * @type string
            * @default #000000
            */
            color: '#000000'
        },
        /**
        * @name dxSankeyOptions.link.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxSankeyOptions.link.hoverStyle.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5,
            /**
            * @name dxSankeyOptions.link.hoverStyle.color
            * @type number
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxSankeyOptions.link.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxSankeyOptions.link.hoverStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxSankeyOptions.link.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxSankeyOptions.link.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxSankeyOptions.link.hoverStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxSankeyOptions.link.hoverStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxSankeyOptions.link.hoverStyle.hatching.opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxSankeyOptions.link.hoverStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxSankeyOptions.link.hoverStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },
    },
    /**
    * @name dxSankeyOptions.onNodeClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 event:event
    * @type_function_param1_field5 target:dxSankeyNode
    * @notUsedInTheme
    * @action
    */
    onNodeClick: function() { },
    /**
    * @name dxSankeyOptions.onLinkClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 event:event
    * @type_function_param1_field5 target:dxSankeyLink
    * @notUsedInTheme
    * @action
    */
    onLinkClick: function() { },
    /**
    * @name dxSankeyOptions.onNodeHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 item:dxSankeyNode
    * @notUsedInTheme
    * @action
    */
    onNodeHoverChanged: function() { },
    /**
    * @name dxSankeyOptions.onLinkHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 item:dxSankeyLink
    * @notUsedInTheme
    * @action
    */
    onLinkHoverChanged: function() { },
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
