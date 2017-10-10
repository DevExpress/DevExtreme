/**
* @name dxtreemap
* @publicName dxTreeMap
* @inherits BaseWidget
* @groupName TreeMap
* @module viz/tree_map
* @export default
*/
var dxTreeMap = {
    /**
    * @name dxtreemap_options
    * @publicName Options
    * @namespace DevExpress.viz.treeMap
    * @hidden
    */        
    /**
    * @name dxtreemapoptions_margin
    * @publicName margin
    * @hidden
    * @extend_doc
    */
    margin: undefined,
    /**
    * @name dxtreemapoptions_datasource
    * @publicName dataSource
    * @extends CommonVizDataSource
    */
    dataSource: undefined,
    /**
    * @name dxtreemapoptions_childrenfield
    * @publicName childrenField
    * @type string
    * @default 'items'
    */
    childrenField: "items",
    /**
    * @name dxtreemapoptions_valuefield
    * @publicName valueField
    * @type string
    * @default 'value'
    */
    valueField: "value",
    /**
    * @name dxtreemapoptions_colorfield
    * @publicName colorField
    * @type string
    * @default 'color'
    */
    colorField: "color",
    /**
    * @name dxtreemapoptions_labelfield
    * @publicName labelField
    * @type string
    * @default 'name'
    */
    labelField: "name",
    /**
    * @name dxtreemapoptions_idfield
    * @publicName idField
    * @type string
    * @default undefined
    */
    idField: undefined,
    /**
    * @name dxtreemapoptions_parentfield
    * @publicName parentField
    * @type string
    * @default undefined
    */
    parentField: undefined,
    /**
    * @name dxtreemapoptions_layoutalgorithm
    * @publicName layoutAlgorithm
    * @type string | function
    * @type_function_param1 e:object
    * @type_function_param1_field1 rect:Array<number>
    * @type_function_param1_field2 sum:number
    * @type_function_param1_field3 items:Array<any>
    * @default 'squarified'
    * @acceptValues 'squarified' | 'strip' | 'sliceanddice'
    */
    layoutAlgorithm: "squarified",
    /**
    * @name dxtreemapoptions_layoutdirection
    * @publicName layoutDirection
    * @type string
    * @default 'leftTopRightBottom'
    * @acceptValues 'leftTopRightBottom' | 'leftBottomRightTop' | 'rightTopLeftBottom' | 'rightBottomLeftTop'
    */
    layoutDirection: "leftTopRightBottom",
    /**
     * @name dxtreemapoptions_resolvelabeloverflow
     * @publicName resolveLabelOverflow
     * @type string
     * @default 'hide'
     * @acceptValues 'hide' | 'ellipsis'
     */
    resolveLabelOverflow: 'hide',
    /**
    * @name dxtreemapoptions_tile
    * @publicName tile
    * @type object
    */
    tile: {
        /**
        * @name dxtreemapoptions_tile_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxtreemapoptions_tile_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxtreemapoptions_tile_border_color
            * @publicName color
            * @type string
            * @default "#000000"
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_tile_color
        * @publicName color
        * @type string
        * @default "#$5f8b95"
        */
        color: undefined,
        /**
        * @name dxtreemapoptions_tile_hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxtreemapoptions_tile_hoverstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions_tile_hoverstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions_tile_hoverstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions_tile_hoverstyle_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_tile_selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxtreemapoptions_tile_selectionstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions_tile_selectionstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions_tile_selectionstyle_border_color
                * @publicName color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions_tile_selectionstyle_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_tile_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxtreemapoptions_tile_label_visible
            * @publicName visible
            * @type boolean
            * @defaultValue true
            */
            visible: true,
            /**
            * @name dxtreemapoptions_tile_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxtreemapoptions_tile_label_font_family
                * @publicName family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxtreemapoptions_tile_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: undefined,
                /**
                * @name dxtreemapoptions_tile_label_font_color
                * @publicName color
                * @type string
                * @default "#ffffff"
                */
                color: undefined,
                /**
                * @name dxtreemapoptions_tile_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined,
                /**
                * @name dxtreemapoptions_tile_label_font_weight
                * @publicName weight
                * @type number
                * @default 300
                */
                weight: undefined
            }
        }
    },
    /**
    * @name dxtreemapoptions_group
    * @publicName group
    * @type object
    */
    group: {
        /**
        * @name dxtreemapoptions_group_headerheight
        * @publicName headerHeight
        * @type number
        * @default undefined
        */
        headerHeight: undefined,
        /**
        * @name dxtreemapoptions_group_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxtreemapoptions_group_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: undefined,
            /**
            * @name dxtreemapoptions_group_border_color
            * @publicName color
            * @type string
            * @default "#d3d3d3"
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_group_color
        * @publicName color
        * @type string
        * @default "#eeeeee"
        */
        color: undefined,
        /**
        * @name dxtreemapoptions_group_hoverstyle
        * @publicName hoverStyle
        * @type object
        */
        hoverStyle: {
            /**
            * @name dxtreemapoptions_group_hoverstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions_group_hoverstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions_group_hoverstyle_border_color
                * @publicName color
                * @type string
                * @default undefined
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions_group_hoverstyle_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_group_selectionstyle
        * @publicName selectionStyle
        * @type object
        */
        selectionStyle: {
            /**
            * @name dxtreemapoptions_group_selectionstyle_border
            * @publicName border
            * @type object
            */
            border: {
                /**
                * @name dxtreemapoptions_group_selectionstyle_border_width
                * @publicName width
                * @type number
                * @default undefined
                */
                width: undefined,
                /**
                * @name dxtreemapoptions_group_selectionstyle_border_color
                * @publicName color
                * @type string
                * @default "#232323"
                */
                color: undefined
            },
            /**
            * @name dxtreemapoptions_group_selectionstyle_color
            * @publicName color
            * @type string
            * @default undefined
            */
            color: undefined
        },
        /**
        * @name dxtreemapoptions_group_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxtreemapoptions_group_label_visible
            * @publicName visible
            * @type boolean
            * @default true
            */
            visible: undefined,
            /**
            * @name dxtreemapoptions_group_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxtreemapoptions_group_label_font_family
                * @publicName family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxtreemapoptions_group_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: undefined,
                /**
                * @name dxtreemapoptions_group_label_font_color
                * @publicName color
                * @type string
                * @default "#767676"
                */
                color: undefined,
                /**
                * @name dxtreemapoptions_group_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined,
                /**
                * @name dxtreemapoptions_group_label_font_weight
                * @publicName weight
                * @type number
                * @default 600
                */
                weight: undefined
            }
        },
        /**
        * @name dxtreemapoptions_group_hoverenabled
        * @publicName hoverEnabled
        * @type boolean
        * @default undefined
        */
        hoverEnabled: undefined
    },
    /**
    * @name dxtreemapoptions_colorizer
    * @publicName colorizer
    * @type object
    */
    colorizer: {
        /**
        * @name dxtreemapoptions_colorizer_type
        * @publicName type
        * @type string
        * @default undefined
        * @acceptValues "discrete" | "gradient" | "range" | "none"
        */
        type: undefined,
        /**
        * @name dxtreemapoptions_colorizer_palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: undefined,
        /**
        * @name dxtreemapoptions_colorizer_colorizegroups
        * @publicName colorizeGroups
        * @type boolean
        * @default false
        */
        colorizeGroups: undefined,
        /**
        * @name dxtreemapoptions_colorizer_range
        * @publicName range
        * @type Array<number>
        * @default undefined
        */
        range: undefined,
        /**
        * @name dxtreemapoptions_colorizer_colorcodefield
        * @publicName colorCodeField
        * @type string
        * @default undefined
        */
        colorCodeField: undefined
    },
    /**
    * @name dxtreemapoptions_maxdepth
    * @publicName maxDepth
    * @type number
    * @default undefined
    */
    maxDepth: undefined,
    /**
    * @name dxtreemapoptions_interactwithgroup
    * @publicName interactWithGroup
    * @type boolean
    * @default false
    */
    interactWithGroup: undefined,
    /**
    * @name dxtreemapoptions_hoverenabled
    * @publicName hoverEnabled
    * @type boolean
    * @default undefined
    */
    hoverEnabled: undefined,
    /**
    * @name dxtreemapoptions_selectionmode
    * @publicName selectionMode
    * @type string
    * @acceptValues "single" | "multiple" | "none"
    * @default undefined
    */
    selectionMode: undefined,
    /**
    * @name dxtreemapoptions_tooltip
    * @publicName tooltip
    * @type object
    * @extend_doc
    */
    tooltip: {
        /**
        * @name dxtreemapoptions_tooltip_customizetooltip
        * @publicName customizeTooltip
        * @default undefined
        * @type function(info)
        * @type_function_param1 info:object
        * @type_function_param1_field1 value:Number
        * @type_function_param1_field2 valueText:string
        * @type_function_param1_field3 node:dxtreemapnode
        * @type_function_return object
        */
        customizeTooltip: undefined
    },
    /**
    * @name dxtreemapoptions_onnodesinitialized
    * @publicName onNodesInitialized
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 root:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onNodesInitialized: function() { },
    /**
    * @name dxtreemapoptions_onnodesrendering
    * @publicName onNodesRendering
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 node:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onNodesRendering: function() { },
    /**
    * @name dxtreemapoptions_onclick
    * @publicName onClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQueryEvent
    * @type_function_param1_field4 node:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onClick: function() { },
    /**
    * @name dxtreemapoptions_onhoverchanged
    * @publicName onHoverChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 node:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onHoverChanged: function() { },
    /**
    * @name dxtreemapoptions_onselectionchanged
    * @publicName onSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 node:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxtreemapoptions_ondrill
    * @publicName onDrill
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 node:dxtreemapnode
    * @notUsedInTheme
    * @action
    */
    onDrill: function() { },
    /**
    * @name dxtreemapmethods_getrootnode
    * @publicName getRootNode()
    * @return dxtreemapnode
    */
    getRootNode: function() { },
    /**
    * @name dxtreemapmethods_clearselection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxtreemapmethods_hidetooltip
    * @publicName hideTooltip()
    */
    hideTooltip: function() { },
    /**
    * @name dxtreemapmethods_drillup
    * @publicName drillUp()
    */
    drillUp: function() { },
    /**
    * @name dxtreemapmethods_resetdrilldown
    * @publicName resetDrillDown()
    */
    resetDrillDown: function() { },
    /**
    * @name dxtreemapmethods_getcurrentnode
    * @publicName getCurrentNode()
    * @return dxtreemapnode
    */
    getCurrentNode: function() { },
    /**
    * @name dxtreemapmethods_getdatasource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
