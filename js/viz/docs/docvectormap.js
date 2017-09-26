/**
* @name dxvectormap
* @publicName dxVectorMap
* @inherits BaseWidget
* @groupName Maps
* @module viz/vector_map
* @export default
*/
var dxVectorMap = {
    /**
    * @name dxvectormapoptions_margin
    * @publicName margin
    * @hidden
    * @extend_doc
    */
    margin: undefined,
    /**
    * @name dxvectormapoptions_background
    * @publicName background
    * @type object
    */
    background: {
        /**
        * @name dxvectormapoptions_background_borderColor
        * @publicName borderColor
        * @type string
        * @default '#cacaca'
        */
        borderColor: '#cacaca',
        /**
        * @name dxvectormapoptions_background_color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff'
    },
    /**
    * @name dxvectormapoptions_layers
    * @publicName layers
    * @type Array<Object>|Object
    * @default undefined
    * @notUsedInTheme
    */
    layers: [{
        /**
        * @name dxvectormapoptions_layers_name
        * @publicName name
        * @type string
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxvectormapoptions_layers_dataSource
        * @publicName dataSource
        * @type object|DataSource|DataSourceOptions|string
        * @extends CommonVizDataSource
        */
        dataSource: undefined,
        /**
        * @name dxvectormapoptions_layers_data
        * @publicName data
        * @type object|DataSource|DataSourceOptions
        * @deprecated dxvectormapoptions_layers_dataSource
        * @notUsedInTheme
        */
        data: undefined,
        /**
        * @name dxvectormapoptions_layers_type
        * @publicName type
        * @type string
        * @acceptValues 'area' | 'line' | 'marker'
        * @notUsedInTheme
        */
        type: undefined,
        /**
        * @name dxvectormapoptions_layers_elementType
        * @publicName elementType
        * @type string
        * @acceptValues 'dot' | 'bubble' | 'pie' | 'image'
        * @notUsedInTheme
        */
        elementType: undefined,
        /**
        * @name dxvectormapoptions_layers_borderWidth
        * @publicName borderWidth
        * @type number
        * @default 1
        */
        borderWidth: 1,
        /**
        * @name dxvectormapoptions_layers_borderColor
        * @publicName borderColor
        * @type string
        * @default '#9d9d9d'
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxvectormapoptions_layers_color
        * @publicName color
        * @type string
        * @default '#d2d2d2'
        */
        color: '#d2d2d2',
        /**
        * @name dxvectormapoptions_layers_hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 1
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxvectormapoptions_layers_hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#303030'
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxvectormapoptions_layers_hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#d2d2d2'
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions_layers_selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions_layers_selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#303030'
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxvectormapoptions_layers_selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#d2d2d2'
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions_layers_opacity
        * @publicName opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxvectormapoptions_layers_size
        * @publicName size
        * @type number
        * @default 8
        */
        size: 8,
        /**
        * @name dxvectormapoptions_layers_minSize
        * @publicName minSize
        * @type number
        * @default 20
        */
        minSize: 20,
        /**
        * @name dxvectormapoptions_layers_maxSize
        * @publicName maxSize
        * @type number
        * @default 50
        */
        maxSize: 50,
        /**
        * @name dxvectormapoptions_layers_hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions_layers_selectionMode
        * @publicName selectionMode
        * @type string
        * @default 'single'
        * @acceptValues 'single' | 'multiple' | 'none'
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions_layers_palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions_layers_paletteSize
        * @publicName paletteSize
        * @type number
        * @default 0
        */
        paletteSize: 0,
        /**
        * @name dxvectormapoptions_layers_colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions_layers_colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions_layers_sizeGroups
        * @publicName sizeGroups
        * @type Array<number>
        * @default undefined
        */
        sizeGroups: undefined,
        /**
        * @name dxvectormapoptions_layers_sizeGroupingField
        * @publicName sizeGroupingField
        * @type string
        * @default undefined
        */
        sizeGroupingField: undefined,
        /**
        * @name dxvectormapoptions_layers_dataField
        * @publicName dataField
        * @type string
        * @default undefined
        */
        dataField: undefined,
        /**
        * @name dxvectormapoptions_layers_customize
        * @publicName customize
        * @type function(elements)
        * @type_function_param1 elements:Array<any>
        * @notUsedInTheme
        */
        customize: function() { },
        /**
        * @name dxvectormapoptions_layers_label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxvectormapoptions_layers_label_enabled
            * @publicName enabled
            * @type boolean
            * @default <i>true</i> for markers; <i>false</i> for areas
            */
            enabled: false,
            /**
            * @name dxvectormapoptions_layers_label_dataField
            * @publicName dataField
            * @type string
            */
            dataField: undefined,
            /**
            * @name dxvectormapoptions_layers_label_font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxvectormapoptions_layers_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions_layers_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxvectormapoptions_layers_label_font_color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions_layers_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxvectormapoptions_layers_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
    }],
    /**
    * @name dxvectormapoptions_mapData
    * @publicName mapData
    * @type Array<string>|string
    * @default undefined
    * @deprecated
    * @notUsedInTheme
    */
    mapData: undefined,
    /**
    * @name dxvectormapoptions_areaSettings
    * @publicName areaSettings
    * @type object
    * @deprecated
    */
    areaSettings: {
        /**
        * @name dxvectormapoptions_areaSettings_borderWidth
        * @publicName borderWidth
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions_layers_borderWidth
        */
        borderWidth: 1,
        /**
        * @name dxvectormapoptions_areaSettings_borderColor
        * @publicName borderColor
        * @type string
        * @default '#9d9d9d'
        * @deprecated dxvectormapoptions_layers_borderColor
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxvectormapoptions_areaSettings_color
        * @publicName color
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions_layers_color
        */
        color: '#d2d2d2',
        /**
        * @name dxvectormapoptions_areaSettings_hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions_layers_hoveredBorderWidth
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxvectormapoptions_areaSettings_hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxvectormapoptions_layers_hoveredBorderColor
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxvectormapoptions_areaSettings_hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions_layers_hoveredColor
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions_areaSettings_selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions_layers_selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions_areaSettings_selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxvectormapoptions_layers_selectedBorderColor
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxvectormapoptions_areaSettings_selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions_layers_selectedColor
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions_areaSettings_hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxvectormapoptions_layers_hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions_areaSettings_selectionMode
        * @publicName selectionMode
        * @type string
        * @default 'single'
        * @acceptValues 'single' | 'multiple' | 'none'
        * @deprecated dxvectormapoptions_layers_selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions_areaSettings_palette
        * @publicName palette
        * @extends CommonVizPalette
        * @deprecated dxvectormapoptions_layers_palette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions_areaSettings_paletteSize
        * @publicName paletteSize
        * @type number
        * @default 0
        * @deprecated dxvectormapoptions_layers_paletteSize
        */
        paletteSize: 0,
        /**
        * @name dxvectormapoptions_areaSettings_colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxvectormapoptions_layers_colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions_areaSettings_colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions_layers_colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions_areaSettings_label
        * @publicName label
        * @type object
        * @deprecated dxvectormapoptions_layers_label
        */
        label: {
            /**
            * @name dxvectormapoptions_areaSettings_label_enabled
            * @publicName enabled
            * @type boolean
            * @deprecated dxvectormapoptions_layers_label_enabled
            */
            enabled: false,
            /**
            * @name dxvectormapoptions_areaSettings_label_dataField
            * @publicName dataField
            * @type string
            * @deprecated dxvectormapoptions_layers_label_dataField
            */
            dataField: undefined,
            /**
            * @name dxvectormapoptions_areaSettings_label_font
            * @publicName font
            * @type object
            * @deprecated dxvectormapoptions_layers_label_font
            */
            font: {
                /**
                * @name dxvectormapoptions_areaSettings_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                * @deprecated dxvectormapoptions_layers_label_font_family
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions_areaSettings_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                * @deprecated dxvectormapoptions_layers_label_font_weight
                */
                weight: 400,
                /**
                * @name dxvectormapoptions_areaSettings_label_font_color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxvectormapoptions_layers_label_font_color
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions_areaSettings_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                * @deprecated dxvectormapoptions_layers_label_font_size
                */
                size: 12,
                /**
                * @name dxvectormapoptions_areaSettings_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                * @deprecated dxvectormapoptions_layers_label_font_opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxvectormapoptions_areaSettings_customize
        * @publicName customize
        * @type function(area)
        * @type_function_param1 area:areaObjects
        * @type_function_return dxVectorMapOptions_areaSettings
        * @deprecated dxvectormapoptions_layers_customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxvectormapoptions_markers
    * @publicName markers
    * @type Array<Object>|string
    * @default undefined
    * @deprecated
    * @notUsedInTheme
    */
    /**
    * @name dxvectormapoptions_markers_coordinates
    * @publicName coordinates
    * @type Array<any>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions_markers_attributes
    * @publicName attributes
    * @type object
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions_markers_text
    * @publicName text
    * @type string
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions_markers_value
    * @publicName value
    * @type number
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions_markers_values
    * @publicName values
    * @type Array<any>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions_markers_url
    * @publicName url
    * @type string
    * @default undefined
    * @deprecated
    */
    markers: undefined,
    /**
    * @name dxvectormapoptions_markerSettings
    * @publicName markerSettings
    * @type object
    * @deprecated
    */
    markerSettings: {
        /**
        * @name dxvectormapoptions_markerSettings_type
        * @publicName type
        * @type string
        * @default 'dot'
        * @acceptValues 'dot' | 'bubble' | 'pie' | 'image'
        * @deprecated dxvectormapoptions_layers_elementType
        */
        type: 'dot',
        /**
        * @name dxvectormapoptions_markerSettings_size
        * @publicName size
        * @type number
        * @default 8
        * @deprecated dxvectormapoptions_layers_size
        */
        size: 8,
        /**
        * @name dxvectormapoptions_markerSettings_minSize
        * @publicName minSize
        * @type number
        * @default 20
        * @deprecated dxvectormapoptions_layers_minSize
        */
        minSize: 20,
        /**
        * @name dxvectormapoptions_markerSettings_maxSize
        * @publicName maxSize
        * @type number
        * @default 50
        * @deprecated dxvectormapoptions_layers_maxSize
        */
        maxSize: 50,
        /**
        * @name dxvectormapoptions_markerSettings_borderWidth
        * @publicName borderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions_layers_borderWidth
        */
        borderWidth: 2,
        /**
        * @name dxvectormapoptions_markerSettings_borderColor
        * @publicName borderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions_layers_borderColor
        */
        borderColor: '#ffffff',
        /**
        * @name dxvectormapoptions_markerSettings_color
        * @publicName color
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions_layers_color
        */
        color: '#ba4d51',
        /**
        * @name dxvectormapoptions_markerSettings_hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions_layers_hoveredBorderWidth
        */
        hoveredBorderWidth: 2,
        /**
        * @name dxvectormapoptions_markerSettings_hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions_layers_hoveredBorderColor
        */
        hoveredBorderColor: '#ffffff',
        /**
        * @name dxvectormapoptions_markerSettings_hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions_layers_hoveredColor
        */
        hoveredColor: '#ba4d51',
        /**
        * @name dxvectormapoptions_markerSettings_selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions_layers_selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions_markerSettings_selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions_layers_selectedBorderColor
        */
        selectedBorderColor: '#ffffff',
        /**
        * @name dxvectormapoptions_markerSettings_selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions_layers_selectedColor
        */
        selectedColor: '#ba4d51',
        /**
        * @name dxvectormapoptions_markerSettings_opacity
        * @publicName opacity
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions_layers_opacity
        */
        opacity: 1,
        /**
        * @name dxvectormapoptions_markerSettings_palette
        * @publicName palette
        * @extends CommonVizPalette
        * @deprecated dxvectormapoptions_layers_palette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions_markerSettings_colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxvectormapoptions_layers_colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions_markerSettings_colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions_layers_colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions_markerSettings_sizeGroups
        * @publicName sizeGroups
        * @type Array<any>
        * @default undefined
        * @deprecated dxvectormapoptions_layers_sizeGroups
        */
        sizeGroups: undefined,
        /**
        * @name dxvectormapoptions_markerSettings_sizeGroupingField
        * @publicName sizeGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions_layers_sizeGroupingField
        */
        sizeGroupingField: undefined,
        /**
        * @name dxvectormapoptions_markerSettings_label
        * @publicName label
        * @type object
        * @deprecated dxvectormapoptions_layers_label
        */
        label: {
            /**
            * @name dxvectormapoptions_markerSettings_label_enabled
            * @publicName enabled
            * @type boolean
            * @default true
            * @deprecated dxvectormapoptions_layers_label_enabled
            */
            enabled: true,
            /**
            * @name dxvectormapoptions_markerSettings_label_font
            * @publicName font
            * @type object
            * @deprecated dxvectormapoptions_layers_label_font
            */
            font: {
                /**
                * @name dxvectormapoptions_markerSettings_label_font_family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                * @deprecated dxvectormapoptions_layers_label_font_family
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions_markerSettings_label_font_weight
                * @publicName weight
                * @type number
                * @default 400
                * @deprecated dxvectormapoptions_layers_label_font_weight
                */
                weight: 400,
                /**
                * @name dxvectormapoptions_markerSettings_label_font_color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxvectormapoptions_layers_label_font_color
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions_markerSettings_label_font_size
                * @publicName size
                * @type number|string
                * @default 12
                * @deprecated dxvectormapoptions_layers_label_font_size
                */
                size: 12,
                /**
                * @name dxvectormapoptions_markerSettings_label_font_opacity
                * @publicName opacity
                * @type number
                * @default undefined
                * @deprecated dxvectormapoptions_layers_label_font_opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxvectormapoptions_markerSettings_hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxvectormapoptions_layers_hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions_markerSettings_selectionMode
        * @publicName selectionMode
        * @type string
        * @default 'single'
        * @acceptValues 'single' | 'multiple' | 'none'
        * @deprecated dxvectormapoptions_layers_selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions_markerSettings_customize
        * @publicName customize
        * @type function(marker)
        * @type_function_param1 marker:markerObjects
        * @type_function_return dxVectorMapOptions_markerSettings
        * @deprecated dxvectormapoptions_layers_customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxvectormapoptions_controlbar
    * @publicName controlBar
    * @type object
    */
    controlBar: {
        /**
        * @name dxvectormapoptions_controlbar_enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name dxvectormapoptions_controlbar_borderColor
        * @publicName borderColor
        * @type string
        * @default '#5d5d5d'
        */
        borderColor: '#5d5d5d',
        /**
        * @name dxvectormapoptions_controlbar_color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name dxvectormapoptions_controlbar_margin
        * @publicName margin
        * @type number
        * @default 20
        */
        margin: 20,
        /**
        * @name dxvectormapoptions_controlbar_horizontalAlignment
        * @publicName horizontalAlignment
        * @type string
        * @acceptValues 'left'|'center'|'right'
        * @default 'left'
        */
        horizontalAlignment: 'left',
        /**
        * @name dxvectormapoptions_controlbar_verticalAlignment
        * @publicName verticalAlignment
        * @type string
        * @acceptValues 'top'|'bottom'
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name dxvectormapoptions_controlbar_opacity
        * @publicName opacity
        * @type number
        * @default 0.3
        */
        opacity: 0.3
    },
    /**
    * @name dxvectormapoptions_tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxvectormapoptions_tooltip_customizetooltip
        * @publicName customizeTooltip
        * @type function(info)
        * @type_function_param1 info:areaObjects|markerObjects
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined,
        /**
        * @name dxvectormapoptions_tooltip_format
        * @publicName format
        * @hidden
        * @extend_doc
        */
        format: undefined,
        /**
        * @name dxvectormapoptions_tooltip_precision
        * @publicName precision
        * @hidden
        * @extend_doc
        */
        precision: undefined
    },
    /**
    * @name dxvectormapoptions_ontooltipshown
    * @publicName onTooltipShown
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxvectormapoptions_ontooltiphidden
    * @publicName onTooltipHidden
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:object
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name dxvectormapoptions_legends
    * @publicName legends
    * @type Array<Object>
    * @default undefined
    */
    legends: [{
        /**
        * @name dxvectormapoptions_legends_source
        * @publicName source
        * @type object
        * @notUsedInTheme
        */
        source: {
            /**
            * @name dxvectormapoptions_legends_source_layer
            * @publicName layer
            * @type string
            * @notUsedInTheme
            */
            layer: undefined,
            /**
            * @name dxvectormapoptions_legends_source_grouping
            * @publicName grouping
            * @type string
            * @notUsedInTheme
            */
            grouping: undefined
        },
        /**
        * @name dxvectormapoptions_legends_customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 start:number
        * @type_function_param1_field2 end:number
        * @type_function_param1_field3 index:number
        * @type_function_param1_field4 color:string|undefined
        * @type_function_param1_field5 size:number|undefined
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxvectormapoptions_legends_customizehint
        * @publicName customizeHint
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 start:number
        * @type_function_param1_field2 end:number
        * @type_function_param1_field3 index:number
        * @type_function_param1_field4 color:string|undefined
        * @type_function_param1_field5 size:number|undefined
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeHint: undefined,
        /**
        * @name dxvectormapoptions_legends_verticalalignment
        * @publicName verticalAlignment
        * @type string
        * @default 'bottom'
        * @acceptValues 'top' | 'bottom'
        */
        verticalAlignment: 'bottom',
        /**
        * @name dxvectormapoptions_legends_horizontalalignment
        * @publicName horizontalAlignment
        * @type string
        * @default 'right'
        * @acceptValues 'right' | 'center' | 'left'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxvectormapoptions_legends_orientation
        * @publicName orientation
        * @type string
        * @default undefined
        * @acceptValues 'vertical' | 'horizontal'
        */
        orientation: undefined,
        /**
        * @name dxvectormapoptions_legends_itemtextposition
        * @publicName itemTextPosition
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'left' | 'top' | 'bottom'
        */
        itemTextPosition: undefined,
        /**
        * @name dxvectormapoptions_legends_itemsalignment
        * @publicName itemsAlignment
        * @type string
        * @default undefined
        * @acceptValues 'right' | 'center' | 'left'
        */
        itemsAlignment: undefined,
        /**
        * @name dxvectormapoptions_legends_font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxvectormapoptions_legends_font_color
            * @publicName color
            * @type string
            * @default '#2b2b2b'
            */
            color: '#2b2b2b',
            /**
            * @name dxvectormapoptions_legends_font_family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxvectormapoptions_legends_font_weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxvectormapoptions_legends_font_size
            * @publicName size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name dxvectormapoptions_legends_font_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxvectormapoptions_legends_visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxvectormapoptions_legends_margin
        * @publicName margin
        * @type number|object
        * @default 10
        */
        margin: {
            /**
            * @name dxvectormapoptions_legends_margin_top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxvectormapoptions_legends_margin_bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxvectormapoptions_legends_margin_left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxvectormapoptions_legends_margin_right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxvectormapoptions_legends_markerSize
        * @publicName markerSize
        * @type number
        * @default 12
        */
        markerSize: 12,
        /**
        * @name dxvectormapoptions_legends_markerColor
        * @publicName markerColor
        * @type string
        * @default "#ba4d51"
        */
        markerColor: "#ba4d51",
        /**
        * @name dxvectormapoptions_legends_markerShape
        * @publicName markerShape
        * @type string
        * @acceptValues "square" | "circle"
        * @default "square"
        */
        markerShape: "square",
        /**
        * @name dxvectormapoptions_legends_backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxvectormapoptions_legends_border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxvectormapoptions_legends_border_visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxvectormapoptions_legends_border_width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxvectormapoptions_legends_border_color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxvectormapoptions_legends_border_cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxvectormapoptions_legends_border_opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxvectormapoptions_legends_border_dashstyle
            * @publicName dashStyle
            * @type string
            * @default 'solid'
            * @acceptValues 'solid'|'longDash'|'dash'|'dot'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxvectormapoptions_legends_paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxvectormapoptions_legends_paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxvectormapoptions_legends_columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name dxvectormapoptions_legends_rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name dxvectormapoptions_legends_columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 8
        */
        columnItemSpacing: 8,
        /**
        * @name dxvectormapoptions_legends_rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8
    }],
    /**
    * @name dxvectormapoptions_projection
    * @publicName projection
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    projection: undefined,
    /**
    * @name dxvectormapoptions_bounds
    * @publicName bounds
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
    */
    bounds: undefined,
    /**
    * @name dxvectormapoptions_touchEnabled
    * @publicName touchEnabled
    * @type boolean
    * @default true
    */
    touchEnabled: true,
    /**
    * @name dxvectormapoptions_wheelEnabled
    * @publicName wheelEnabled
    * @type boolean
    * @default true
    */
    wheelEnabled: true,
    /**
    * @name dxvectormapoptions_panningEnabled
    * @publicName panningEnabled
    * @type boolean
    * @default true
    */
    panningEnabled: true,
    /**
    * @name dxvectormapoptions_zoomingEnabled
    * @publicName zoomingEnabled
    * @type boolean
    * @default true
    */
    zoomingEnabled: true,
    /**
    * @name dxvectormapoptions_center
    * @publicName center
    * @type Array<number>
    * @default [0, 0]
    * @notUsedInTheme
    */
    center: [0, 0],
    /**
    * @name dxvectormapoptions_zoomFactor
    * @publicName zoomFactor
    * @type number
    * @default 1
    * @notUsedInTheme
    */
    zoomFactor: 1,
    /**
    * @name dxvectormapoptions_maxZoomFactor
    * @publicName maxZoomFactor
    * @type number
    * @default 256
    * @notUsedInTheme
    */
    maxZoomFactor: 256,
    /**
    * @name dxvectormapoptions_onClick
    * @publicName onClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery-event object
    * @type_function_param1_field4 target:MapLayerElement object
    * @notUsedInTheme
    * @action
    */
    onClick: function() { },
    /**
    * @name dxvectormapoptions_onCenterChanged
    * @publicName onCenterChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 center:Array<number>
    * @notUsedInTheme
    * @action
    */
    onCenterChanged: function() { },
    /**
    * @name dxvectormapoptions_onZoomFactorChanged
    * @publicName onZoomFactorChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 zoomFactor:number
    * @notUsedInTheme
    * @action
    */
    onZoomFactorChanged: function() { },
    /**
    * @name dxvectormapoptions_onSelectionChanged
    * @publicName onSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:MapLayerElement object
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxvectormapoptions_onAreaClick
    * @publicName onAreaClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQueryEvent
    * @type_function_param1_field4 target:areaObjects
    * @notUsedInTheme
    * @deprecated
    * @action
    */
    onAreaClick: function() { },
    /**
    * @name dxvectormapoptions_onAreaSelectionChanged
    * @publicName onAreaSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:areaObjects
    * @notUsedInTheme
    * @deprecated
    * @action
    */
    onAreaSelectionChanged: function() { },
    /**
    * @name dxvectormapoptions_onMarkerClick
    * @publicName onMarkerClick
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 jQueryEvent:jQuery-event object
    * @type_function_param1_field4 target:Marker object
    * @notUsedInTheme
    * @deprecated
    * @action
    */
    onMarkerClick: function() { },
    /**
    * @name dxvectormapoptions_onMarkerSelectionChanged
    * @publicName onMarkerSelectionChanged
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:object
    * @type_function_param1_field3 target:Marker object
    * @notUsedInTheme
    * @deprecated
    * @action
    */
    onMarkerSelectionChanged: function() { },
    /**
    * @name dxvectormapmethods_getLayers
    * @publicName getLayers()
    * @return Array<MapLayer>
    */
    getLayers: function() { },
    /**
    * @name dxvectormapmethods_getLayerByIndex
    * @publicName getLayerByIndex(index)
    * @return MapLayer
    * @param1 index:number
    */
    getLayerByIndex: function() { },
    /**
    * @name dxvectormapmethods_getLayerByName
    * @publicName getLayerByName(name)
    * @return MapLayer
    * @param1 name:string
    */
    getLayerByName: function() { },
    /**
    * @name dxvectormapmethods_getAreas
    * @publicName getAreas()
    * @return Array<areaObjects>
    * @deprecated
    */
    getAreas: function() { },
    /**
    * @name dxvectormapmethods_getMarkers
    * @publicName getMarkers()
    * @return Array<markerObjects>
    * @deprecated
    */
    getMarkers: function() { },
    /**
    * @name dxvectormapmethods_clearAreaSelection
    * @publicName clearAreaSelection()
    * @deprecated
    */
    clearAreaSelection: function() { },
    /**
    * @name dxvectormapmethods_clearMarkerSelection
    * @publicName clearMarkerSelection()
    * @deprecated
    */
    clearMarkerSelection: function() { },
    /**
    * @name dxvectormapmethods_clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxvectormapmethods_center
    * @publicName center()
    * @return Array<number>
    */
    center: function() { },
    /**
    * @name dxvectormapmethods_center
    * @publicName center(centerCoordinates)
    * @param1 centerCoordinates:Array<number>
    */
    center: function() { },
    /**
    * @name dxvectormapmethods_zoomFactor
    * @publicName zoomFactor()
    * @return number
    */
    zoomFactor: function() { },
    /**
    * @name dxvectormapmethods_zoomFactor
    * @publicName zoomFactor(zoomFactor)
    * @param1 zoomFactor:number
    */
    zoomFactor: function() { },
    /**
    * @name dxvectormapmethods_viewport
    * @publicName viewport()
    * @return Array<number>
    */
    viewport: function() { },
    /**
    * @name dxvectormapmethods_viewport
    * @publicName viewport(viewportCoordinates)
    * @param1 viewportCoordinates:Array<number>
    */
    viewport: function() { },
    /**
    * @name dxvectormapmethods_convertCoordinates
    * @publicName convertCoordinates(x, y)
    * @param1 x:number
    * @param2 y:number
    * @return Array<number>
    */
    convertCoordinates: function() { }
};
