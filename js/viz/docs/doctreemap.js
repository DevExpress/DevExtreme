
var dxTreeMap = {
    /**
    * @name dxTreeMapOptions.margin
    * @hidden
    */
    margin: undefined,
    dataSource: undefined,
    childrenField: "items",
    valueField: "value",
    colorField: "color",
    labelField: "name",
    idField: undefined,
    parentField: undefined,
    layoutAlgorithm: "squarified",
    layoutDirection: "leftTopRightBottom",
    resolveLabelOverflow: 'hide',
    tile: {
        /**
        * @name dxTreeMapOptions.tile.border
        * @type object
        */
        border: {
            /**
            * @name dxTreeMapOptions.tile.border.width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxTreeMapOptions.tile.border.color
            * @type string
            * @default "#000000"
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.tile.color
        * @type string
        * @default "#$5f8b95"
        */
        color: undefined,
        /**
        * @name dxTreeMapOptions.tile.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxTreeMapOptions.tile.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxTreeMapOptions.tile.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxTreeMapOptions.tile.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxTreeMapOptions.tile.hoverStyle.color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.tile.selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxTreeMapOptions.tile.selectionStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxTreeMapOptions.tile.selectionStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxTreeMapOptions.tile.selectionStyle.border.color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxTreeMapOptions.tile.selectionStyle.color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.tile.label
        * @type object
        */
        label: {
            /**
            * @name dxTreeMapOptions.tile.label.visible
            * @type boolean
            * @defaultValue true
            */
            visible: true,
            /**
            * @name dxTreeMapOptions.tile.label.font
            * @type Font
            * @default '#FFFFFF' @prop color
            * @default 300 @prop weight
            */
            font: {
                family: undefined,
                size: undefined,
                color: undefined,
                opacity: undefined,
                weight: undefined
            },
            /**
            * @name dxTreeMapOptions.tile.label.wordWrap
            * @type Enums.VizWordWrap
            * @default "normal"
            */
            wordWrap: "normal",
            /**
            * @name dxTreeMapOptions.tile.label.textOverflow
            * @type Enums.VizTextOverflow
            * @default "ellipsis"
            */
           textOverflow: "ellipsis"
        }
    },
    group: {
        /**
        * @name dxTreeMapOptions.group.headerHeight
        * @type number
        * @default undefined
        */
        headerHeight: undefined,
        /**
        * @name dxTreeMapOptions.group.border
        * @type object
        */
        border: {
            /**
            * @name dxTreeMapOptions.group.border.width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxTreeMapOptions.group.border.color
            * @type string
            * @default "#d3d3d3"
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.group.color
        * @type string
        * @default "#eeeeee"
        */
        color: undefined,
        /**
        * @name dxTreeMapOptions.group.hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxTreeMapOptions.group.hoverStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxTreeMapOptions.group.hoverStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxTreeMapOptions.group.hoverStyle.border.color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxTreeMapOptions.group.hoverStyle.color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.group.selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxTreeMapOptions.group.selectionStyle.border
            * @type object
            */
            border: {
                /**
                * @name dxTreeMapOptions.group.selectionStyle.border.width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxTreeMapOptions.group.selectionStyle.border.color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxTreeMapOptions.group.selectionStyle.color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxTreeMapOptions.group.label
        * @type object
        */
        label: {
            /**
            * @name dxTreeMapOptions.group.label.visible
            * @type boolean
            * @default true
            */
            visible: undefined,
            /**
            * @name dxTreeMapOptions.group.label.font
            * @type Font
            * @default '#767676' @prop color
            * @default 600 @prop weight
            */
            font: {
                family: undefined,
                size: undefined,
                color: undefined,
                opacity: undefined,
                weight: undefined
            },
            /**
            * @name dxTreeMapOptions.group.label.textOverflow
            * @type Enums.VizTextOverflow
            * @default "ellipsis"
            */
           textOverflow: "ellipsis"
        },
        /**
        * @name dxTreeMapOptions.group.hoverEnabled
        * @type boolean
        * @default undefined
        */
        hoverEnabled: undefined
    },
    colorizer: {
        /**
        * @name dxTreeMapOptions.colorizer.type
        * @type Enums.TreeMapColorizerType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxTreeMapOptions.colorizer.palette
        * @extends CommonVizPalette
        */
        palette: undefined,
         /**
        * @name dxTreeMapOptions.colorizer.paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend',
        /**
        * @name dxTreeMapOptions.colorizer.colorizeGroups
        * @type boolean
        * @default false
        */
        colorizeGroups: undefined,
        /**
        * @name dxTreeMapOptions.colorizer.range
        * @type Array<number>
        * @default undefined
        */
        range: undefined,
        /**
        * @name dxTreeMapOptions.colorizer.colorCodeField
        * @type string
        * @default undefined
        */
        colorCodeField: undefined
    },
    maxDepth: undefined,
    interactWithGroup: undefined,
    hoverEnabled: undefined,
    selectionMode: undefined,
    tooltip: {
        customizeTooltip: undefined,
        contentTemplate: undefined
    },
    onNodesInitialized: function() { },
    onNodesRendering: function() { },
    onClick: function() { },
    onHoverChanged: function() { },
    onSelectionChanged: function() { },
    onDrill: function() { },
    getRootNode: function() { },
    clearSelection: function() { },
    hideTooltip: function() { },
    drillUp: function() { },
    resetDrillDown: function() { },
    getCurrentNode: function() { }
};
