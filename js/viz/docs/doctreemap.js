/**
* @name dxtreemap
* @publicName dxTreeMap
* @inherits BaseWidget
* @module viz/tree_map
* @export default
*/
var dxTreeMap = {
    /**
    * @name dxtreemap.options
    * @publicName Options
    * @namespace DevExpress.viz.treeMap
    * @hidden
    */
    /**
    * @name dxtreemapoptions.margin
    * @publicName margin
    * @hidden
    * @inheritdoc
    */
    margin: undefined,
    /**
    * @name dxtreemapoptions.datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxtreemapoptions.childrenfield
    * @publicName childrenField
    * @type string
    * @default 'items'
    */
    childrenField: "items",
    /**
    * @name dxtreemapoptions.valuefield
    * @publicName valueField
    * @type string
    * @default 'value'
    */
    valueField: "value",
    /**
    * @name dxtreemapoptions.colorfield
    * @publicName colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxtreemapoptions.labelfield
    * @publicName labelField
    * @type string
    * @default 'name'
    */
    labelField: "name",
    /**
    * @name dxtreemapoptions.idfield
    * @publicName idField
    * @type string
    * @default undefined
    */
    idField: undefined,
    /**
    * @name dxtreemapoptions.parentfield
    * @publicName parentField
    * @type string
    * @default undefined
    */
    parentField: undefined,
    /**
    * @name dxtreemapoptions.layoutalgorithm
    * @publicName layoutAlgorithm
    * @type Enums.TreeMapLayoutAlgorithm | function
    * @type_function_param1 e:object
    * @type_function_param1_field1 rect:Array<number>
    * @type_function_param1_field2 sum:number
    * @type_function_param1_field3 items:Array<any>
    * @default 'squarified'
    */
    layoutAlgorithm: "squarified",
    /**
    * @name dxtreemapoptions.layoutdirection
    * @publicName layoutDirection
    * @type Enums.TreeMapLayoutDirection
    * @default 'leftTopRightBottom'
    */
    layoutDirection: "leftTopRightBottom",
    /**
     * @name dxtreemapoptions.resolvelabeloverflow
     * @publicName resolveLabelOverflow
     * @type Enums.TreeMapResolveLabelOverflow
     * @default 'hide'
     */
    resolveLabelOverflow: 'hide',
    /**
    * @name dxtreemapoptions.tile
    * @publicName tile
    * @type object
    */
    tile: {
        /**
        * @name dxtreemapoptions.tile.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxtreemapoptions.tile.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxtreemapoptions.tile.border.color
            * @publicName color
            * @type string
            * @default "#000000"
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.tile.color
        * @publicName color
        * @type string
        * @default "#$5f8b95"
        */
        color: undefined,
        /**
        * @name dxtreemapoptions.tile.hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxtreemapoptions.tile.hoverstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions.tile.hoverstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions.tile.hoverstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions.tile.hoverstyle.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.tile.selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxtreemapoptions.tile.selectionstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions.tile.selectionstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions.tile.selectionstyle.border.color
                * @publicName color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions.tile.selectionstyle.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.tile.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxtreemapoptions.tile.label.visible
            * @publicName visible
            * @type boolean
            * @defaultValue true
            */
            visible: true,
            /**
            * @name dxtreemapoptions.tile.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxtreemapoptions.tile.label.font.family
                * @publicName family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxtreemapoptions.tile.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: undefined,
                /**
                * @name dxtreemapoptions.tile.label.font.color
                * @publicName color
                * @type string
                * @default "#ffffff"
                */
                color: undefined,
                /**
                * @name dxtreemapoptions.tile.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined,
                /**
                * @name dxtreemapoptions.tile.label.font.weight
                * @publicName weight
                * @type number
                * @default 300
                */
                weight: undefined
            }
        }
    },
    /**
    * @name dxtreemapoptions.group
    * @publicName group
    * @type object
    */
    group: {
        /**
        * @name dxtreemapoptions.group.headerheight
        * @publicName headerHeight
        * @type number
        * @default undefined
        */
        headerHeight: undefined,
        /**
        * @name dxtreemapoptions.group.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxtreemapoptions.group.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxtreemapoptions.group.border.color
            * @publicName color
            * @type string
            * @default "#d3d3d3"
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.group.color
        * @publicName color
        * @type string
        * @default "#eeeeee"
        */
        color: undefined,
        /**
        * @name dxtreemapoptions.group.hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxtreemapoptions.group.hoverstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions.group.hoverstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions.group.hoverstyle.border.color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions.group.hoverstyle.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.group.selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxtreemapoptions.group.selectionstyle.border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions.group.selectionstyle.border.width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions.group.selectionstyle.border.color
                * @publicName color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions.group.selectionstyle.color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions.group.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxtreemapoptions.group.label.visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: undefined,
            /**
            * @name dxtreemapoptions.group.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxtreemapoptions.group.label.font.family
                * @publicName family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxtreemapoptions.group.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: undefined,
                /**
                * @name dxtreemapoptions.group.label.font.color
                * @publicName color
                * @type string
                * @default "#767676"
                */
                color: undefined,
                /**
                * @name dxtreemapoptions.group.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined,
                /**
                * @name dxtreemapoptions.group.label.font.weight
                * @publicName weight
                * @type number
                * @default 600
                */
                weight: undefined
            }
        },
        /**
        * @name dxtreemapoptions.group.hoverenabled
        * @publicName hoverEnabled
        * @type boolean
        * @default undefined
        */
        hoverEnabled: undefined
    },
    /**
    * @name dxtreemapoptions.colorizer
    * @publicName colorizer
    * @type object
    */
    colorizer: {
        /**
        * @name dxtreemapoptions.colorizer.type
        * @publicName type
        * @type Enums.TreeMapColorizerType
        * @default undefined
        */
        type: undefined,
        /**
        * @name dxtreemapoptions.colorizer.palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: undefined,
         /**
        * @name dxtreemapoptions.colorizer.paletteextensionmode
        * @publicName paletteExtensionMode
        * @type Enums.VizPaletteExtensionMode
        * @default 'blend'
        */
        paletteExtensionMode: 'blend',
        /**
        * @name dxtreemapoptions.colorizer.colorizegroups
        * @publicName colorizeGroups
        * @type boolean
        * @default false
        */
        colorizeGroups: undefined,
        /**
        * @name dxtreemapoptions.colorizer.range
        * @publicName range
        * @type Array<number>
        * @default undefined
        */
        range: undefined,
        /**
        * @name dxtreemapoptions.colorizer.colorcodefield
        * @publicName colorCodeField
        * @type string
        * @default undefined
        */
        colorCodeField: undefined
    },
    /**
    * @name dxtreemapoptions.maxdepth
    * @publicName maxDepth
    * @type number
    * @default undefined
    */
    maxDepth: undefined,
    /**
    * @name dxtreemapoptions.interactwithgroup
    * @publicName interactWithGroup
    * @type boolean
    * @default false
    */
    interactWithGroup: undefined,
    /**
    * @name dxtreemapoptions.hoverenabled
    * @publicName hoverEnabled
    * @type boolean
    * @default undefined
    */
    hoverEnabled: undefined,
    /**
    * @name dxtreemapoptions.selectionmode
    * @publicName selectionMode
    * @type Enums.SelectionMode
    * @default undefined
    */
    selectionMode: undefined,
    /**
    * @name dxtreemapoptions.tooltip
    * @publicName tooltip
    * @type object
    * @inheritdoc
    */
    tooltip: {
        /**
        * @name dxtreemapoptions.tooltip.customizetooltip
        * @publicName customizeTooltip
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
    * @name dxtreemapoptions.onnodesinitialized
    * @publicName onNodesInitialized
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 root:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onNodesInitialized: function() { },
    /**
    * @name dxtreemapoptions.onnodesrendering
    * @publicName onNodesRendering
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onNodesRendering: function() { },
    /**
    * @name dxtreemapoptions.onclick
    * @publicName onClick
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
    * @name dxtreemapoptions.onhoverchanged
    * @publicName onHoverChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxtreemapoptions.onselectionchanged
    * @publicName onSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxtreemapoptions.ondrill
    * @publicName onDrill
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 node:dxTreeMapNode
    * @notUsedInTheme
    * @action
    */
    onDrill: function() { },
    /**
    * @name dxtreemapmethods.getrootnode
    * @publicName getRootNode()
    * @return dxTreeMapNode
    */
    getRootNode: function() { },
    /**
    * @name dxtreemapmethods.clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxtreemapmethods.hidetooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxtreemapmethods.drillup
    * @publicName drillUp()
    */
    drillUp: function() { },
    /**
    * @name dxtreemapmethods.resetdrilldown
    * @publicName resetDrillDown()
    */
    resetDrillDown: function() { },
    /**
    * @name dxtreemapmethods.getcurrentnode
    * @publicName getCurrentNode()
    * @return dxTreeMapNode
    */
    getCurrentNode: function() { },
    /**
    * @name dxtreemapmethods.getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
