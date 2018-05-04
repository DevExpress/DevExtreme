/**
* @name dxvectormap
* @publicName dxVectorMap
* @inherits BaseWidget
* @module viz/vector_map
* @export default
*/
var dxVectorMap = {
    /**
    * @name dxvectormap.options
    * @publicName Options
    * @namespace DevExpress.viz.map
    * @hidden
    */
    /**
    * @name dxvectormapoptions.margin
    * @publicName margin
    * @hidden
    * @inheritdoc
    */
    margin: undefined,
    /**
    * @name dxvectormapoptions.background
    * @publicName background
    * @type object
    */
    background: {
        /**
        * @name dxvectormapoptions.background.borderColor
        * @publicName borderColor
        * @type string
        * @default '#cacaca'
        */
        borderColor: '#cacaca',
        /**
        * @name dxvectormapoptions.background.color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff'
    },
    /**
    * @name dxvectormapoptions.layers
    * @publicName layers
    * @type Array<Object>|Object
    * @default undefined
    * @notUsedInTheme
    */
    layers: [{
        /**
        * @name dxvectormapoptions.layers.name
        * @publicName name
        * @type string
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxvectormapoptions.layers.dataSource
        * @publicName dataSource
        * @type object|DataSource|DataSourceOptions|string
        * @extends CommonVizDataSource
        */
        dataSource: undefined,
        /**
        * @name dxvectormapoptions.layers.data
        * @publicName data
        * @type object|DataSource|DataSourceOptions
        * @deprecated dxvectormapoptions.layers.dataSource
        * @notUsedInTheme
        */
        data: undefined,
        /**
        * @name dxvectormapoptions.layers.type
        * @publicName type
        * @type Enums.VectorMapLayerType
        * @notUsedInTheme
        */
        type: undefined,
        /**
        * @name dxvectormapoptions.layers.elementType
        * @publicName elementType
        * @type Enums.VectorMapMarkerType
        * @notUsedInTheme
        */
        elementType: undefined,
        /**
        * @name dxvectormapoptions.layers.borderWidth
        * @publicName borderWidth
        * @type number
        * @default 1
        */
        borderWidth: 1,
        /**
        * @name dxvectormapoptions.layers.borderColor
        * @publicName borderColor
        * @type string
        * @default '#9d9d9d'
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxvectormapoptions.layers.color
        * @publicName color
        * @type string
        * @default '#d2d2d2'
        */
        color: '#d2d2d2',
        /**
        * @name dxvectormapoptions.layers.hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 1
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxvectormapoptions.layers.hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#303030'
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxvectormapoptions.layers.hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#d2d2d2'
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions.layers.selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions.layers.selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#303030'
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxvectormapoptions.layers.selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#d2d2d2'
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions.layers.opacity
        * @publicName opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxvectormapoptions.layers.size
        * @publicName size
        * @type number
        * @default 8
        */
        size: 8,
        /**
        * @name dxvectormapoptions.layers.minSize
        * @publicName minSize
        * @type number
        * @default 20
        */
        minSize: 20,
        /**
        * @name dxvectormapoptions.layers.maxSize
        * @publicName maxSize
        * @type number
        * @default 50
        */
        maxSize: 50,
        /**
        * @name dxvectormapoptions.layers.hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions.layers.selectionMode
        * @publicName selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions.layers.palette
        * @publicName palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions.layers.paletteSize
        * @publicName paletteSize
        * @type number
        * @default 0
        */
        paletteSize: 0,
        /**
        * @name dxvectormapoptions.layers.colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions.layers.colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions.layers.sizeGroups
        * @publicName sizeGroups
        * @type Array<number>
        * @default undefined
        */
        sizeGroups: undefined,
        /**
        * @name dxvectormapoptions.layers.sizeGroupingField
        * @publicName sizeGroupingField
        * @type string
        * @default undefined
        */
        sizeGroupingField: undefined,
        /**
        * @name dxvectormapoptions.layers.dataField
        * @publicName dataField
        * @type string
        * @default undefined
        */
        dataField: undefined,
        /**
        * @name dxvectormapoptions.layers.customize
        * @publicName customize
        * @type function(elements)
        * @type_function_param1 elements:Array<MapLayerElement>
        * @notUsedInTheme
        */
        customize: function() { },
        /**
        * @name dxvectormapoptions.layers.label
        * @publicName label
        * @type object
        */
        label: {
            /**
            * @name dxvectormapoptions.layers.label.enabled
            * @publicName enabled
            * @type boolean
            * @default <i>true</i> for markers; <i>false</i> for areas
            */
            enabled: false,
            /**
            * @name dxvectormapoptions.layers.label.dataField
            * @publicName dataField
            * @type string
            */
            dataField: undefined,
            /**
            * @name dxvectormapoptions.layers.label.font
            * @publicName font
            * @type object
            */
            font: {
                /**
                * @name dxvectormapoptions.layers.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions.layers.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxvectormapoptions.layers.label.font.color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions.layers.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxvectormapoptions.layers.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
    }],
    /**
    * @name dxvectormapoptions.mapData
    * @publicName mapData
    * @type Array<string>|string
    * @default undefined
    * @deprecated dxvectormapoptions.layers.dataSource
    * @notUsedInTheme
    */
    mapData: undefined,
    /**
    * @name dxvectormapoptions.areaSettings
    * @publicName areaSettings
    * @type object
    * @deprecated dxvectormapoptions.layers
    */
    areaSettings: {
        /**
        * @name dxvectormapoptions.areaSettings.borderWidth
        * @publicName borderWidth
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions.layers.borderWidth
        */
        borderWidth: 1,
        /**
        * @name dxvectormapoptions.areaSettings.borderColor
        * @publicName borderColor
        * @type string
        * @default '#9d9d9d'
        * @deprecated dxvectormapoptions.layers.borderColor
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxvectormapoptions.areaSettings.color
        * @publicName color
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions.layers.color
        */
        color: '#d2d2d2',
        /**
        * @name dxvectormapoptions.areaSettings.hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions.layers.hoveredBorderWidth
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxvectormapoptions.areaSettings.hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxvectormapoptions.layers.hoveredBorderColor
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxvectormapoptions.areaSettings.hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions.layers.hoveredColor
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions.areaSettings.selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions.layers.selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions.areaSettings.selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxvectormapoptions.layers.selectedBorderColor
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxvectormapoptions.areaSettings.selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxvectormapoptions.layers.selectedColor
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxvectormapoptions.areaSettings.hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxvectormapoptions.layers.hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions.areaSettings.selectionMode
        * @publicName selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        * @deprecated dxvectormapoptions.layers.selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions.areaSettings.palette
        * @publicName palette
        * @extends CommonVizPalette
        * @deprecated dxvectormapoptions.layers.palette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions.areaSettings.paletteSize
        * @publicName paletteSize
        * @type number
        * @default 0
        * @deprecated dxvectormapoptions.layers.paletteSize
        */
        paletteSize: 0,
        /**
        * @name dxvectormapoptions.areaSettings.colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxvectormapoptions.layers.colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions.areaSettings.colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions.layers.colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions.areaSettings.label
        * @publicName label
        * @type object
        * @deprecated dxvectormapoptions.layers.label
        */
        label: {
            /**
            * @name dxvectormapoptions.areaSettings.label.enabled
            * @publicName enabled
            * @type boolean
            * @deprecated dxvectormapoptions.layers.label.enabled
            */
            enabled: false,
            /**
            * @name dxvectormapoptions.areaSettings.label.dataField
            * @publicName dataField
            * @type string
            * @deprecated dxvectormapoptions.layers.label.dataField
            */
            dataField: undefined,
            /**
            * @name dxvectormapoptions.areaSettings.label.font
            * @publicName font
            * @type object
            * @deprecated dxvectormapoptions.layers.label.font
            */
            font: {
                /**
                * @name dxvectormapoptions.areaSettings.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                * @deprecated dxvectormapoptions.layers.label.font.family
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions.areaSettings.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                * @deprecated dxvectormapoptions.layers.label.font.weight
                */
                weight: 400,
                /**
                * @name dxvectormapoptions.areaSettings.label.font.color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxvectormapoptions.layers.label.font.color
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions.areaSettings.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                * @deprecated dxvectormapoptions.layers.label.font.size
                */
                size: 12,
                /**
                * @name dxvectormapoptions.areaSettings.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                * @deprecated dxvectormapoptions.layers.label.font.opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxvectormapoptions.areaSettings.customize
        * @publicName customize
        * @type function(area)
        * @type_function_param1 area:areaObjects
        * @type_function_return dxVectorMapOptions.areaSettings
        * @deprecated dxvectormapoptions.layers.customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxvectormapoptions.markers
    * @publicName markers
    * @type Array<Object>|string
    * @default undefined
    * @deprecated dxvectormapoptions.layers.dataSource
    * @notUsedInTheme
    */
    /**
    * @name dxvectormapoptions.markers.coordinates
    * @publicName coordinates
    * @type Array<number>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions.markers.attributes
    * @publicName attributes
    * @type object
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions.markers.text
    * @publicName text
    * @type string
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions.markers.value
    * @publicName value
    * @type number
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions.markers.values
    * @publicName values
    * @type Array<number>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxvectormapoptions.markers.url
    * @publicName url
    * @type string
    * @default undefined
    * @deprecated
    */
    markers: undefined,
    /**
    * @name dxvectormapoptions.markerSettings
    * @publicName markerSettings
    * @type object
    * @deprecated dxvectormapoptions.layers
    */
    markerSettings: {
        /**
        * @name dxvectormapoptions.markerSettings.type
        * @publicName type
        * @type Enums.VectorMapMarkerType
        * @default 'dot'
        * @deprecated dxvectormapoptions.layers.elementType
        */
        type: 'dot',
        /**
        * @name dxvectormapoptions.markerSettings.size
        * @publicName size
        * @type number
        * @default 8
        * @deprecated dxvectormapoptions.layers.size
        */
        size: 8,
        /**
        * @name dxvectormapoptions.markerSettings.minSize
        * @publicName minSize
        * @type number
        * @default 20
        * @deprecated dxvectormapoptions.layers.minSize
        */
        minSize: 20,
        /**
        * @name dxvectormapoptions.markerSettings.maxSize
        * @publicName maxSize
        * @type number
        * @default 50
        * @deprecated dxvectormapoptions.layers.maxSize
        */
        maxSize: 50,
        /**
        * @name dxvectormapoptions.markerSettings.borderWidth
        * @publicName borderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions.layers.borderWidth
        */
        borderWidth: 2,
        /**
        * @name dxvectormapoptions.markerSettings.borderColor
        * @publicName borderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions.layers.borderColor
        */
        borderColor: '#ffffff',
        /**
        * @name dxvectormapoptions.markerSettings.color
        * @publicName color
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions.layers.color
        */
        color: '#ba4d51',
        /**
        * @name dxvectormapoptions.markerSettings.hoveredBorderWidth
        * @publicName hoveredBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions.layers.hoveredBorderWidth
        */
        hoveredBorderWidth: 2,
        /**
        * @name dxvectormapoptions.markerSettings.hoveredBorderColor
        * @publicName hoveredBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions.layers.hoveredBorderColor
        */
        hoveredBorderColor: '#ffffff',
        /**
        * @name dxvectormapoptions.markerSettings.hoveredColor
        * @publicName hoveredColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions.layers.hoveredColor
        */
        hoveredColor: '#ba4d51',
        /**
        * @name dxvectormapoptions.markerSettings.selectedBorderWidth
        * @publicName selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxvectormapoptions.layers.selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxvectormapoptions.markerSettings.selectedBorderColor
        * @publicName selectedBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxvectormapoptions.layers.selectedBorderColor
        */
        selectedBorderColor: '#ffffff',
        /**
        * @name dxvectormapoptions.markerSettings.selectedColor
        * @publicName selectedColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxvectormapoptions.layers.selectedColor
        */
        selectedColor: '#ba4d51',
        /**
        * @name dxvectormapoptions.markerSettings.opacity
        * @publicName opacity
        * @type number
        * @default 1
        * @deprecated dxvectormapoptions.layers.opacity
        */
        opacity: 1,
        /**
        * @name dxvectormapoptions.markerSettings.palette
        * @publicName palette
        * @extends CommonVizPalette
        * @deprecated dxvectormapoptions.layers.palette
        */
        palette: 'default',
        /**
        * @name dxvectormapoptions.markerSettings.colorGroups
        * @publicName colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxvectormapoptions.layers.colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxvectormapoptions.markerSettings.colorGroupingField
        * @publicName colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions.layers.colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxvectormapoptions.markerSettings.sizeGroups
        * @publicName sizeGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxvectormapoptions.layers.sizeGroups
        */
        sizeGroups: undefined,
        /**
        * @name dxvectormapoptions.markerSettings.sizeGroupingField
        * @publicName sizeGroupingField
        * @type string
        * @default undefined
        * @deprecated dxvectormapoptions.layers.sizeGroupingField
        */
        sizeGroupingField: undefined,
        /**
        * @name dxvectormapoptions.markerSettings.label
        * @publicName label
        * @type object
        * @deprecated dxvectormapoptions.layers.label
        */
        label: {
            /**
            * @name dxvectormapoptions.markerSettings.label.enabled
            * @publicName enabled
            * @type boolean
            * @default true
            * @deprecated dxvectormapoptions.layers.label.enabled
            */
            enabled: true,
            /**
            * @name dxvectormapoptions.markerSettings.label.font
            * @publicName font
            * @type object
            * @deprecated dxvectormapoptions.layers.label.font
            */
            font: {
                /**
                * @name dxvectormapoptions.markerSettings.label.font.family
                * @publicName family
                * @type string
                * @default "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana"
                * @deprecated dxvectormapoptions.layers.label.font.family
                */
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                /**
                * @name dxvectormapoptions.markerSettings.label.font.weight
                * @publicName weight
                * @type number
                * @default 400
                * @deprecated dxvectormapoptions.layers.label.font.weight
                */
                weight: 400,
                /**
                * @name dxvectormapoptions.markerSettings.label.font.color
                * @publicName color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxvectormapoptions.layers.label.font.color
                */
                color: '#2b2b2b',
                /**
                * @name dxvectormapoptions.markerSettings.label.font.size
                * @publicName size
                * @type number|string
                * @default 12
                * @deprecated dxvectormapoptions.layers.label.font.size
                */
                size: 12,
                /**
                * @name dxvectormapoptions.markerSettings.label.font.opacity
                * @publicName opacity
                * @type number
                * @default undefined
                * @deprecated dxvectormapoptions.layers.label.font.opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxvectormapoptions.markerSettings.hoverEnabled
        * @publicName hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxvectormapoptions.layers.hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxvectormapoptions.markerSettings.selectionMode
        * @publicName selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        * @deprecated dxvectormapoptions.layers.selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxvectormapoptions.markerSettings.customize
        * @publicName customize
        * @type function(marker)
        * @type_function_param1 marker:markerObjects
        * @type_function_return dxVectorMapOptions.markerSettings
        * @deprecated dxvectormapoptions.layers.customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxvectormapoptions.controlbar
    * @publicName controlBar
    * @type object
    */
    controlBar: {
        /**
        * @name dxvectormapoptions.controlbar.enabled
        * @publicName enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name dxvectormapoptions.controlbar.borderColor
        * @publicName borderColor
        * @type string
        * @default '#5d5d5d'
        */
        borderColor: '#5d5d5d',
        /**
        * @name dxvectormapoptions.controlbar.color
        * @publicName color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name dxvectormapoptions.controlbar.margin
        * @publicName margin
        * @type number
        * @default 20
        */
        margin: 20,
        /**
        * @name dxvectormapoptions.controlbar.horizontalAlignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'left'
        */
        horizontalAlignment: 'left',
        /**
        * @name dxvectormapoptions.controlbar.verticalAlignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name dxvectormapoptions.controlbar.opacity
        * @publicName opacity
        * @type number
        * @default 0.3
        */
        opacity: 0.3
    },
    /**
    * @name dxvectormapoptions.tooltip
    * @publicName tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxvectormapoptions.tooltip.customizetooltip
        * @publicName customizeTooltip
        * @type function(info)
        * @type_function_param1 info:areaObjects|markerObjects
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined,
        /**
        * @name dxvectormapoptions.tooltip.format
        * @publicName format
        * @hidden
        * @inheritdoc
        */
        format: undefined,
        /**
        * @name dxvectormapoptions.tooltip.precision
        * @publicName precision
        * @hidden
        * @inheritdoc
        */
        precision: undefined
    },
    /**
    * @name dxvectormapoptions.ontooltipshown
    * @publicName onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxvectormapoptions.ontooltiphidden
    * @publicName onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name dxvectormapoptions.legends
    * @publicName legends
    * @type Array<Object>
    * @default undefined
    */
    legends: [{
        /**
        * @name dxvectormapoptions.legends.source
        * @publicName source
        * @type object
        * @notUsedInTheme
        */
        source: {
            /**
            * @name dxvectormapoptions.legends.source.layer
            * @publicName layer
            * @type string
            * @notUsedInTheme
            */
            layer: undefined,
            /**
            * @name dxvectormapoptions.legends.source.grouping
            * @publicName grouping
            * @type string
            * @notUsedInTheme
            */
            grouping: undefined
        },
        /**
        * @name dxvectormapoptions.legends.customizetext
        * @publicName customizeText
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 start:number
        * @type_function_param1_field2 end:number
        * @type_function_param1_field3 index:number
        * @type_function_param1_field4 color:string
        * @type_function_param1_field5 size:number
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeText: undefined,
        /**
        * @name dxvectormapoptions.legends.customizehint
        * @publicName customizeHint
        * @type function(itemInfo)
        * @type_function_param1 itemInfo:object
        * @type_function_param1_field1 start:number
        * @type_function_param1_field2 end:number
        * @type_function_param1_field3 index:number
        * @type_function_param1_field4 color:string
        * @type_function_param1_field5 size:number
        * @type_function_return string
        * @notUsedInTheme
        */
        customizeHint: undefined,
        /**
        * @name dxvectormapoptions.legends.verticalalignment
        * @publicName verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'bottom'
        */
        verticalAlignment: 'bottom',
        /**
        * @name dxvectormapoptions.legends.horizontalalignment
        * @publicName horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxvectormapoptions.legends.orientation
        * @publicName orientation
        * @type Enums.Orientation
        * @default undefined
        */
        orientation: undefined,
        /**
        * @name dxvectormapoptions.legends.itemtextposition
        * @publicName itemTextPosition
        * @type Enums.Position
        * @default undefined
        */
        itemTextPosition: undefined,
        /**
        * @name dxvectormapoptions.legends.itemsalignment
        * @publicName itemsAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        itemsAlignment: undefined,
        /**
        * @name dxvectormapoptions.legends.font
        * @publicName font
        * @type object
        */
        font: {
            /**
            * @name dxvectormapoptions.legends.font.color
            * @publicName color
            * @type string
            * @default '#2b2b2b'
            */
            color: '#2b2b2b',
            /**
            * @name dxvectormapoptions.legends.font.family
            * @publicName family
            * @type string
            * @default undefined
            */
            family: undefined,
            /**
            * @name dxvectormapoptions.legends.font.weight
            * @publicName weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxvectormapoptions.legends.font.size
            * @publicName size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name dxvectormapoptions.legends.font.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxvectormapoptions.legends.visible
        * @publicName visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxvectormapoptions.legends.margin
        * @publicName margin
        * @type number|object
        * @default 10
        */
        margin: {
            /**
            * @name dxvectormapoptions.legends.margin.top
            * @publicName top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxvectormapoptions.legends.margin.bottom
            * @publicName bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxvectormapoptions.legends.margin.left
            * @publicName left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxvectormapoptions.legends.margin.right
            * @publicName right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxvectormapoptions.legends.markerSize
        * @publicName markerSize
        * @type number
        * @default 12
        */
        markerSize: 12,
        /**
        * @name dxvectormapoptions.legends.markerColor
        * @publicName markerColor
        * @type string
        * @default "#ba4d51"
        */
        markerColor: "#ba4d51",
        /**
        * @name dxvectormapoptions.legends.markerShape
        * @publicName markerShape
        * @type Enums.VectorMapMarkerShape
        * @default "square"
        */
        markerShape: "square",
        /**
        * @name dxvectormapoptions.legends.backgroundcolor
        * @publicName backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxvectormapoptions.legends.border
        * @publicName border
        * @type object
        */
        border: {
            /**
            * @name dxvectormapoptions.legends.border.visible
            * @publicName visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxvectormapoptions.legends.border.width
            * @publicName width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxvectormapoptions.legends.border.color
            * @publicName color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxvectormapoptions.legends.border.cornerradius
            * @publicName cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxvectormapoptions.legends.border.opacity
            * @publicName opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxvectormapoptions.legends.border.dashstyle
            * @publicName dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxvectormapoptions.legends.paddingleftright
        * @publicName paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxvectormapoptions.legends.paddingtopbottom
        * @publicName paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxvectormapoptions.legends.columncount
        * @publicName columnCount
        * @type number
        * @default 0
        */
        columnsCount: 0,
        /**
        * @name dxvectormapoptions.legends.rowcount
        * @publicName rowCount
        * @type number
        * @default 0
        */
        rowsCount: 0,
        /**
        * @name dxvectormapoptions.legends.columnitemspacing
        * @publicName columnItemSpacing
        * @type number
        * @default 20
        */
        columnItemSpacing: 20,
        /**
        * @name dxvectormapoptions.legends.rowitemspacing
        * @publicName rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8
    }],
    /**
    * @name dxvectormapoptions.projection
    * @publicName projection
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    projection: undefined,
    /**
    * @name dxvectormapoptions.bounds
    * @publicName bounds
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
    */
    bounds: undefined,
    /**
    * @name dxvectormapoptions.touchEnabled
    * @publicName touchEnabled
    * @type boolean
    * @default true
    */
    touchEnabled: true,
    /**
    * @name dxvectormapoptions.wheelEnabled
    * @publicName wheelEnabled
    * @type boolean
    * @default true
    */
    wheelEnabled: true,
    /**
    * @name dxvectormapoptions.panningEnabled
    * @publicName panningEnabled
    * @type boolean
    * @default true
    */
    panningEnabled: true,
    /**
    * @name dxvectormapoptions.zoomingEnabled
    * @publicName zoomingEnabled
    * @type boolean
    * @default true
    */
    zoomingEnabled: true,
    /**
    * @name dxvectormapoptions.center
    * @publicName center
    * @type Array<number>
    * @default [0, 0]
    * @notUsedInTheme
    */
    center: [0, 0],
    /**
    * @name dxvectormapoptions.zoomFactor
    * @publicName zoomFactor
    * @type number
    * @default 1
    * @notUsedInTheme
    */
    zoomFactor: 1,
    /**
    * @name dxvectormapoptions.maxZoomFactor
    * @publicName maxZoomFactor
    * @type number
    * @default 256
    * @notUsedInTheme
    */
    maxZoomFactor: 256,
    /**
    * @name dxvectormapoptions.onClick
    * @publicName onClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onClick: function() { },
    /**
    * @name dxvectormapoptions.onCenterChanged
    * @publicName onCenterChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 center:Array<number>
    * @notUsedInTheme
    * @action
    */
    onCenterChanged: function() { },
    /**
    * @name dxvectormapoptions.onZoomFactorChanged
    * @publicName onZoomFactorChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 zoomFactor:number
    * @notUsedInTheme
    * @action
    */
    onZoomFactorChanged: function() { },
    /**
    * @name dxvectormapoptions.onSelectionChanged
    * @publicName onSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxvectormapoptions.onAreaClick
    * @publicName onAreaClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:areaObjects
    * @notUsedInTheme
    * @deprecated dxvectormapoptions.onClick
    * @action
    */
    onAreaClick: function() { },
    /**
    * @name dxvectormapoptions.onAreaSelectionChanged
    * @publicName onAreaSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:areaObjects
    * @notUsedInTheme
    * @deprecated dxvectormapoptions.onSelectionChanged
    * @action
    */
    onAreaSelectionChanged: function() { },
    /**
    * @name dxvectormapoptions.onMarkerClick
    * @publicName onMarkerClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:markerObjects
    * @notUsedInTheme
    * @deprecated dxvectormapoptions.onClick
    * @action
    */
    onMarkerClick: function() { },
    /**
    * @name dxvectormapoptions.onMarkerSelectionChanged
    * @publicName onMarkerSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:markerObjects
    * @notUsedInTheme
    * @deprecated dxvectormapoptions.onSelectionChanged
    * @action
    */
    onMarkerSelectionChanged: function() { },
    /**
    * @name dxvectormapmethods.getLayers
    * @publicName getLayers()
    * @return Array<MapLayer>
    */
    getLayers: function() { },
    /**
    * @name dxvectormapmethods.getLayerByIndex
    * @publicName getLayerByIndex(index)
    * @return MapLayer
    * @param1 index:number
    */
    getLayerByIndex: function() { },
    /**
    * @name dxvectormapmethods.getLayerByName
    * @publicName getLayerByName(name)
    * @return MapLayer
    * @param1 name:string
    */
    getLayerByName: function() { },
    /**
    * @name dxvectormapmethods.getAreas
    * @publicName getAreas()
    * @return Array<areaObjects>
    * @deprecated dxvectormapmethods.getLayers
    */
    getAreas: function() { },
    /**
    * @name dxvectormapmethods.getMarkers
    * @publicName getMarkers()
    * @return Array<markerObjects>
    * @deprecated dxvectormapmethods.getLayers
    */
    getMarkers: function() { },
    /**
    * @name dxvectormapmethods.clearAreaSelection
    * @publicName clearAreaSelection()
    * @deprecated dxvectormapmethods.clearSelection
    */
    clearAreaSelection: function() { },
    /**
    * @name dxvectormapmethods.clearMarkerSelection
    * @publicName clearMarkerSelection()
    * @deprecated dxvectormapmethods.clearSelection
    */
    clearMarkerSelection: function() { },
    /**
    * @name dxvectormapmethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxvectormapmethods.center
    * @publicName center()
    * @return Array<number>
    */
    center: function() { },
    /**
    * @name dxvectormapmethods.center
    * @publicName center(centerCoordinates)
    * @param1 centerCoordinates:Array<number>
    */
    center: function() { },
    /**
    * @name dxvectormapmethods.zoomFactor
    * @publicName zoomFactor()
    * @return number
    */
    zoomFactor: function() { },
    /**
    * @name dxvectormapmethods.zoomFactor
    * @publicName zoomFactor(zoomFactor)
    * @param1 zoomFactor:number
    */
    zoomFactor: function() { },
    /**
    * @name dxvectormapmethods.viewport
    * @publicName viewport()
    * @return Array<number>
    */
    viewport: function() { },
    /**
    * @name dxvectormapmethods.viewport
    * @publicName viewport(viewportCoordinates)
    * @param1 viewportCoordinates:Array<number>
    */
    viewport: function() { },
    /**
    * @name dxvectormapmethods.convertCoordinates
    * @publicName convertCoordinates(x, y)
    * @param1 x:number
    * @param2 y:number
    * @return Array<number>
    */
    convertCoordinates: function() { }
};
