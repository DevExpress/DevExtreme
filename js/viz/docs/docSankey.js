
var dxSankey = {
    hoverEnabled: true,
    palette: [],
    paletteExtensionMode: 'blend',
    alignment: 'center',
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
    dataSource: undefined,
    sortData: undefined,
    sourceField: 'source',
    sourceField: 'target',
    weightField: 'weight',
    label: {
        /**
        * @name dxSankeyOptions.label.overlappingBehavior
        * @type Enums.SankeyLabelOverlappingBehavior
        * @default 'ellipsis'
        */
        overlappingBehavior: 'ellipsis',
        /**
        * @name dxSankeyOptions.label.useNodeColors
        * @type boolean
        * @default false
        */
        useNodeColors: false,
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
        * @name dxSankeyOptions.label.font
        * @type Font
        * @default '#FFFFFF' @prop color
        */
        font: {
            color: '#ffffff',
            family: undefined,
            weight: undefined,
            size: undefined,
            opacity: undefined
        },
        /**
        * @name dxSankeyOptions.label.border
        * @type object
        */
        border: {
            /**
            * @name dxSankeyOptions.label.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxSankeyOptions.label.border.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxSankeyOptions.label.border.color
            * @type string
            * @default '#000000'
            */
            color: '#000000'
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
            * @default 0
            */
            opacity: 0,
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
    tooltip: {
        enabled: true,
        customizeNodeTooltip: undefined,
        customizeLinkTooltip: undefined,
        linkTooltipTemplate: undefined,
        nodeTooltipTemplate: undefined
    },
    node: {
        /**
        * @name dxSankeyOptions.node.color
        * @type string
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
            * @default 1
            */
            width: 1,
            /**
            * @name dxSankeyOptions.node.border.color
            * @type string
            * @default '#000000'
            */
            color: '#000000'
        },
        /**
        * @name dxSankeyOptions.node.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxSankeyOptions.node.hoverStyle.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxSankeyOptions.node.hoverStyle.color
            * @type string
            * @default undefined
            */
            color: undefined,
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
    link: {
        /**
        * @name dxSankeyOptions.link.colorMode
        * @type Enums.SankeyColorMode
        * @default 'none'
        */
        colorMode: 'none',
        /**
        * @name dxSankeyOptions.link.color
        * @type string
        * @default '#000000'
        */
        color: '#000000',
        /**
        * @name dxSankeyOptions.link.opacity
        * @type number
        * @default 0.3
        */
        opacity: 0.3,
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
            * @default '#000000'
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
            * @type string
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
    onNodeClick: function() { },
    onLinkClick: function() { },
    onNodeHoverChanged: function() { },
    onLinkHoverChanged: function() { },
    getAllNodes: function() { },
    getAllLinks: function() { },
    hideTooltip: function() { }
}
