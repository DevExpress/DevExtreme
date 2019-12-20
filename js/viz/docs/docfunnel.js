
var dxFunnel = {
    adaptiveLayout: {
        /**
        * @name dxFunnelOptions.adaptiveLayout.width
        * @type number
        * @default 80
        */
        width: 80,
        /**
        * @name dxFunnelOptions.adaptiveLayout.height
        * @type number
        * @default 80
        */
        height: 80,
        /**
        * @name dxFunnelOptions.adaptiveLayout.keepLabels
        * @type boolean
        * @default true
        */
        keepLabels: true
    },
    dataSource: undefined,
    valueField: "val",
    argumentField: "arg",
    colorField: "color",
    palette: [],
    paletteExtensionMode: 'blend',
    hoverEnabled: true,
    selectionMode: 'single',
    algorithm: "dynamicSlope",
    neckHeight: 0,
    neckWidth: 0,
    inverted: false,
    sortData: true,
    item: {
        /**
        * @name dxFunnelOptions.item.border
        * @type object
        */
        border: {
            /**
            * @name dxFunnelOptions.item.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunnelOptions.item.border.width
            * @type number
            * @default 2
            */
            width: 2,
            /**
            * @name dxFunnelOptions.item.border.color
            * @type string
            * @default #ffffff
            */
            color: "#ffffff"
        },
        /**
        * @name dxFunnelOptions.item.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxFunnelOptions.item.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxFunnelOptions.item.hoverStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunnelOptions.item.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunnelOptions.item.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunnelOptions.item.hoverStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunnelOptions.item.hoverStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default 'right'
                */
                direction: "right",
                /**
                * @name dxFunnelOptions.item.hoverStyle.hatching.opacity
                * @type number
                * @default 0.75
                */
                opacity: 0.75,
                /**
                * @name dxFunnelOptions.item.hoverStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunnelOptions.item.hoverStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
            }
        },

        /**
        * @name dxFunnelOptions.item.selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxFunnelOptions.item.selectionStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxFunnelOptions.item.selectionStyle.border.visible
                * @type boolean
                * @default undefined
                */
                visible: undefined,
                /**
                * @name dxFunnelOptions.item.selectionStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxFunnelOptions.item.selectionStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxFunnelOptions.item.selectionStyle.hatching
            * @type object
            */
            hatching: {
                /**
                * @name dxFunnelOptions.item.selectionStyle.hatching.opacity
                * @type number
                * @default 0.5
                */
                opacity: 0.5,
                /**
                * @name dxFunnelOptions.item.selectionStyle.hatching.step
                * @type number
                * @default 6
                */
                step: 6,
                /**
                * @name dxFunnelOptions.item.selectionStyle.hatching.width
                * @type number
                * @default 2
                */
                width: 2,
                /**
                * @name dxFunnelOptions.item.selectionStyle.hatching.direction
                * @type Enums.HatchingDirection
                * @default "right"
                */
                direction: "right"
            }
        }
    },
    resolveLabelOverlapping: "shift",
    label: {
        /**
        * @name dxFunnelOptions.label.font
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
        * @name dxFunnelOptions.label.position
        * @type Enums.FunnelLabelPosition
        * @default 'columns'
        */
        position: "columns",
        /**
        * @name dxFunnelOptions.label.horizontalOffset
        * @type number
        * @default 0
        */
        horizontalOffset: 0,
        /**
        * @name dxFunnelOptions.label.horizontalAlignment
        * @type Enums.HorizontalEdge
        * @default 'right'
        */
        horizontalAlignment: "right",
        /**
        * @name dxFunnelOptions.label.format
        * @extends CommonVizFormat
        */
        format: '',
        /**
        * @name dxFunnelOptions.label.connector
        * @type object
        */
        connector: {
            /**
            * @name dxFunnelOptions.label.connector.visible
            * @type boolean
            * @default true
            */
            visible: true,
            /**
            * @name dxFunnelOptions.label.connector.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunnelOptions.label.connector.color
            * @type string
            * @default undefined
            */
            color: undefined,
            /**
            * @name dxFunnelOptions.label.connector.opacity
            * @type number
            * @default 0.5
            */
            opacity: 0.5
        },

        /**
        * @name dxFunnelOptions.label.backgroundColor
        * @type string
        */
        backgroundColor: undefined,
        /**
        * @name dxFunnelOptions.label.border
        * @type object
        */
        border: {
            /**
            * @name dxFunnelOptions.label.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxFunnelOptions.label.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxFunnelOptions.label.border.color
            * @type string
            * @default  '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxFunnelOptions.label.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxFunnelOptions.label.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxFunnelOptions.label.showForZeroValues
        * @type boolean
        * @default false
        */
        showForZeroValues: false,
        /**
        * @name dxFunnelOptions.label.customizeText
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
        customizeText: undefined,
        /**
        * @name dxFunnelOptions.label.textOverflow
        * @type Enums.VizTextOverflow
        * @default 'ellipsis'
        */
        textOverflow: 'ellipsis',
       /**
        * @name dxFunnelOptions.label.wordWrap
        * @type Enums.VizWordWrap
        * @default 'normal'
        */
       wordWrap: 'normal'
    },
    legend: {
        visible: false,
        customizeText: undefined,
        customizeHint: undefined,
        customizeItems: undefined,
        markerTemplate: undefined
    },
    tooltip: {
        customizeTooltip: undefined,
        contentTemplate: undefined
    },
    onItemClick: function() { },
    onLegendClick: function() { },
    onHoverChanged: function() { },
    onSelectionChanged: function() { },
    clearSelection: function () { },
    getAllItems: function () { },
    hideTooltip: function() { }
};
