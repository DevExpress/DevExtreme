/**
* @name dxTreeMap
* @inherits BaseWidget, DataHelperMixin
* @module viz/tree_map
* @export default
*/
var dxTreeMap = {
    /**
    * @name dxTreeMapOptions.margin
    * @hidden
    */
    margin: undefined,
    /**
    * @name dxTreeMapOptions.dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxTreeMapOptions.childrenField
    * @type string
    * @default 'items'
    */
    childrenField: "items",
    /**
    * @name dxTreeMapOptions.valueField
    * @type string
    * @default 'value'
    */
    valueField: "value",
    /**
    * @name dxTreeMapOptions.colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxTreeMapOptions.labelField
    * @type string
    * @default 'name'
    */
    labelField: "name",
    /**
    * @name dxTreeMapOptions.idField
    * @type string
    * @default undefined
    */
    idField: undefined,
    /**
    * @name dxTreeMapOptions.parentField
    * @type string
    * @default undefined
    */
    parentField: undefined,
    /**
    * @name dxTreeMapOptions.layoutAlgorithm
    * @type Enums.TreeMapLayoutAlgorithm | function
    * @type_function_param1 e:object
    * @type_function_param1_field1 rect:Array<number>
    * @type_function_param1_field2 sum:number
    * @type_function_param1_field3 items:Array<any>
    * @default 'squarified'
    */
    layoutAlgorithm: "squarified",
    /**
    * @name dxTreeMapOptions.layoutDirection
    * @type Enums.TreeMapLayoutDirection
    * @default 'leftTopRightBottom'
    */
    layoutDirection: "leftTopRightBottom",
    /**
     * @name dxTreeMapOptions.resolveLabelOverflow
     * @type Enums.TreeMapResolveLabelOverflow
     * @default 'hide'
     * @deprecated dxTreeMapOptions.tile.label.textOverflow
     */
    resolveLabelOverflow: 'hide',
    /**
    * @name dxTreeMapOptions.tile
    * @type object
    */
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
    /**
    * @name dxTreeMapOptions.group
    * @type object
    */
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
    /**
    * @name dxTreeMapOptions.colorizer
    * @type object
    */
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
    /**
    * @name dxTreeMapOptions.maxDepth
    * @type number
    * @default undefined
    */
    maxDepth: undefined,
    /**
    * @name dxTreeMapOptions.interactWithGroup
    * @type boolean
    * @default false
    */
    interactWithGroup: undefined,
    /**
    * @name dxTreeMapOptions.hoverEnabled
    * @type boolean
    * @default undefined
    */
    hoverEnabled: undefined,
    /**
    * @name dxTreeMapOptions.selectionMode
    * @type Enums.SelectionMode
    * @default undefined
    */
    selectionMode: undefined,
    /**
    * @name dxTreeMapOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxTreeMapOptions.tooltip.customizeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_param1_field3 node:dxTreeMapNode
        * @type_function_return object
        */
        customizeTooltip: undefined
    },
    /**
    * @name dxTreeMapOptions.onNodesInitialized
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 root:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onNodesInitialized: function() { },
    /**
    * @name dxTreeMapOptions.onNodesRendering
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onNodesRendering: function() { },
    /**
    * @name dxTreeMapOptions.onClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onClick: function() { },
    /**
    * @name dxTreeMapOptions.onHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxTreeMapOptions.onSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxTreeMapOptions.onDrill
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onDrill: function() { },
    /**
    * @name dxTreeMapMethods.getRootNode
    * @publicName getRootNode()
    * @return dxTreeMapNode
    */
    getRootNode: function() { },
    /**
    * @name dxTreeMapMethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxTreeMapMethods.hideTooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxTreeMapMethods.drillUp
    * @publicName drillUp()
    */
    drillUp: function() { },
    /**
    * @name dxTreeMapMethods.resetDrillDown
    * @publicName resetDrillDown()
    */
    resetDrillDown: function() { },
    /**
    * @name dxTreeMapMethods.getCurrentNode
    * @publicName getCurrentNode()
    * @return dxTreeMapNode
    */
    getCurrentNode: function() { }
};
