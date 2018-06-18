/**
* @name dxVectorMap
* @inherits BaseWidget
* @module viz/vector_map
* @export default
*/
var dxVectorMap = {
    /**
    * @name dxVectorMap.Options
    * @namespace DevExpress.viz.map
    * @hidden
    */
    /**
    * @name dxVectorMapOptions.margin
    * @hidden
    * @inheritdoc
    */
    margin: undefined,
    /**
    * @name dxVectorMapOptions.background
    * @type object
    */
    background: {
        /**
        * @name dxVectorMapOptions.background.borderColor
        * @type string
        * @default '#cacaca'
        */
        borderColor: '#cacaca',
        /**
        * @name dxVectorMapOptions.background.color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff'
    },
    /**
    * @name dxVectorMapOptions.layers
    * @type Array<Object>|Object
    * @default undefined
    * @notUsedInTheme
    */
    layers: [{
        /**
        * @name dxVectorMapOptions.layers.name
        * @type string
        * @notUsedInTheme
        */
        name: undefined,
        /**
        * @name dxVectorMapOptions.layers.dataSource
        * @type object|DataSource|DataSourceOptions|string
        * @extends CommonVizDataSource
        */
        dataSource: undefined,
        /**
        * @name dxVectorMapOptions.layers.data
        * @type object|DataSource|DataSourceOptions
        * @deprecated dxVectorMapOptions.layers.dataSource
        * @notUsedInTheme
        */
        data: undefined,
        /**
        * @name dxVectorMapOptions.layers.type
        * @type Enums.VectorMapLayerType
        * @notUsedInTheme
        */
        type: undefined,
        /**
        * @name dxVectorMapOptions.layers.elementType
        * @type Enums.VectorMapMarkerType
        * @notUsedInTheme
        */
        elementType: undefined,
        /**
        * @name dxVectorMapOptions.layers.borderWidth
        * @type number
        * @default 1
        */
        borderWidth: 1,
        /**
        * @name dxVectorMapOptions.layers.borderColor
        * @type string
        * @default '#9d9d9d'
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxVectorMapOptions.layers.color
        * @type string
        * @default '#d2d2d2'
        */
        color: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.layers.hoveredBorderWidth
        * @type number
        * @default 1
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxVectorMapOptions.layers.hoveredBorderColor
        * @type string
        * @default '#303030'
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxVectorMapOptions.layers.hoveredColor
        * @type string
        * @default '#d2d2d2'
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.layers.selectedBorderWidth
        * @type number
        * @default 2
        */
        selectedBorderWidth: 2,
        /**
        * @name dxVectorMapOptions.layers.selectedBorderColor
        * @type string
        * @default '#303030'
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxVectorMapOptions.layers.selectedColor
        * @type string
        * @default '#d2d2d2'
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.layers.opacity
        * @type number
        * @default 1
        */
        opacity: 1,
        /**
        * @name dxVectorMapOptions.layers.size
        * @type number
        * @default 8
        */
        size: 8,
        /**
        * @name dxVectorMapOptions.layers.minSize
        * @type number
        * @default 20
        */
        minSize: 20,
        /**
        * @name dxVectorMapOptions.layers.maxSize
        * @type number
        * @default 50
        */
        maxSize: 50,
        /**
        * @name dxVectorMapOptions.layers.hoverEnabled
        * @type boolean
        * @default true
        */
        hoverEnabled: true,
        /**
        * @name dxVectorMapOptions.layers.selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        */
        selectionMode: 'single',
        /**
        * @name dxVectorMapOptions.layers.palette
        * @extends CommonVizPalette
        */
        palette: 'default',
        /**
        * @name dxVectorMapOptions.layers.paletteSize
        * @type number
        * @default 0
        */
        paletteSize: 0,
        /**
        * @name dxVectorMapOptions.layers.colorGroups
        * @type Array<number>
        * @default undefined
        */
        colorGroups: undefined,
        /**
        * @name dxVectorMapOptions.layers.colorGroupingField
        * @type string
        * @default undefined
        */
        colorGroupingField: undefined,
        /**
        * @name dxVectorMapOptions.layers.sizeGroups
        * @type Array<number>
        * @default undefined
        */
        sizeGroups: undefined,
        /**
        * @name dxVectorMapOptions.layers.sizeGroupingField
        * @type string
        * @default undefined
        */
        sizeGroupingField: undefined,
        /**
        * @name dxVectorMapOptions.layers.dataField
        * @type string
        * @default undefined
        */
        dataField: undefined,
        /**
        * @name dxVectorMapOptions.layers.customize
        * @type function(elements)
        * @type_function_param1 elements:Array<MapLayerElement>
        * @notUsedInTheme
        */
        customize: function() { },
        /**
        * @name dxVectorMapOptions.layers.label
        * @type object
        */
        label: {
            /**
            * @name dxVectorMapOptions.layers.label.enabled
            * @type boolean
            * @default <i>true</i> for markers; <i>false</i> for areas
            */
            enabled: false,
            /**
            * @name dxVectorMapOptions.layers.label.dataField
            * @type string
            */
            dataField: undefined,
            /**
            * @name dxVectorMapOptions.layers.label.font
            * @type object
            */
            font: {
                /**
                * @name dxVectorMapOptions.layers.label.font.family
                * @extends CommonVizFontFamily
                */
                family: undefined,
                /**
                * @name dxVectorMapOptions.layers.label.font.weight
                * @type number
                * @default 400
                */
                weight: 400,
                /**
                * @name dxVectorMapOptions.layers.label.font.color
                * @type string
                * @default '#2b2b2b'
                */
                color: '#2b2b2b',
                /**
                * @name dxVectorMapOptions.layers.label.font.size
                * @type number|string
                * @default 12
                */
                size: 12,
                /**
                * @name dxVectorMapOptions.layers.label.font.opacity
                * @type number
                * @default undefined
                */
                opacity: undefined
            }
        }
    }],
    /**
    * @name dxVectorMapOptions.mapData
    * @type Array<string>|string
    * @default undefined
    * @deprecated dxVectorMapOptions.layers.dataSource
    * @notUsedInTheme
    */
    mapData: undefined,
    /**
    * @name dxVectorMapOptions.areaSettings
    * @type object
    * @deprecated dxVectorMapOptions.layers
    */
    areaSettings: {
        /**
        * @name dxVectorMapOptions.areaSettings.borderWidth
        * @type number
        * @default 1
        * @deprecated dxVectorMapOptions.layers.borderWidth
        */
        borderWidth: 1,
        /**
        * @name dxVectorMapOptions.areaSettings.borderColor
        * @type string
        * @default '#9d9d9d'
        * @deprecated dxVectorMapOptions.layers.borderColor
        */
        borderColor: '#9d9d9d',
        /**
        * @name dxVectorMapOptions.areaSettings.color
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxVectorMapOptions.layers.color
        */
        color: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.areaSettings.hoveredBorderWidth
        * @type number
        * @default 1
        * @deprecated dxVectorMapOptions.layers.hoveredBorderWidth
        */
        hoveredBorderWidth: 1,
        /**
        * @name dxVectorMapOptions.areaSettings.hoveredBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxVectorMapOptions.layers.hoveredBorderColor
        */
        hoveredBorderColor: '#303030',
        /**
        * @name dxVectorMapOptions.areaSettings.hoveredColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxVectorMapOptions.layers.hoveredColor
        */
        hoveredColor: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.areaSettings.selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxVectorMapOptions.layers.selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxVectorMapOptions.areaSettings.selectedBorderColor
        * @type string
        * @default '#303030'
        * @deprecated dxVectorMapOptions.layers.selectedBorderColor
        */
        selectedBorderColor: '#303030',
        /**
        * @name dxVectorMapOptions.areaSettings.selectedColor
        * @type string
        * @default '#d2d2d2'
        * @deprecated dxVectorMapOptions.layers.selectedColor
        */
        selectedColor: '#d2d2d2',
        /**
        * @name dxVectorMapOptions.areaSettings.hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxVectorMapOptions.layers.hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxVectorMapOptions.areaSettings.selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        * @deprecated dxVectorMapOptions.layers.selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxVectorMapOptions.areaSettings.palette
        * @extends CommonVizPalette
        * @deprecated dxVectorMapOptions.layers.palette
        */
        palette: 'default',
        /**
        * @name dxVectorMapOptions.areaSettings.paletteSize
        * @type number
        * @default 0
        * @deprecated dxVectorMapOptions.layers.paletteSize
        */
        paletteSize: 0,
        /**
        * @name dxVectorMapOptions.areaSettings.colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxVectorMapOptions.areaSettings.colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxVectorMapOptions.areaSettings.label
        * @type object
        * @deprecated dxVectorMapOptions.layers.label
        */
        label: {
            /**
            * @name dxVectorMapOptions.areaSettings.label.enabled
            * @type boolean
            * @deprecated dxVectorMapOptions.layers.label.enabled
            */
            enabled: false,
            /**
            * @name dxVectorMapOptions.areaSettings.label.dataField
            * @type string
            * @deprecated dxVectorMapOptions.layers.label.dataField
            */
            dataField: undefined,
            /**
            * @name dxVectorMapOptions.areaSettings.label.font
            * @type object
            * @deprecated dxVectorMapOptions.layers.label.font
            */
            font: {
                /**
                * @name dxVectorMapOptions.areaSettings.label.font.family
                * @extends CommonVizFontFamily
                * @deprecated dxVectorMapOptions.layers.label.font.family
                */
                family: undefined,
                /**
                * @name dxVectorMapOptions.areaSettings.label.font.weight
                * @type number
                * @default 400
                * @deprecated dxVectorMapOptions.layers.label.font.weight
                */
                weight: 400,
                /**
                * @name dxVectorMapOptions.areaSettings.label.font.color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxVectorMapOptions.layers.label.font.color
                */
                color: '#2b2b2b',
                /**
                * @name dxVectorMapOptions.areaSettings.label.font.size
                * @type number|string
                * @default 12
                * @deprecated dxVectorMapOptions.layers.label.font.size
                */
                size: 12,
                /**
                * @name dxVectorMapOptions.areaSettings.label.font.opacity
                * @type number
                * @default undefined
                * @deprecated dxVectorMapOptions.layers.label.font.opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxVectorMapOptions.areaSettings.customize
        * @type function(area)
        * @type_function_param1 area:areaObjects
        * @type_function_return dxVectorMapOptions.areaSettings
        * @deprecated dxVectorMapOptions.layers.customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxVectorMapOptions.markers
    * @type Array<Object>|string
    * @default undefined
    * @deprecated dxVectorMapOptions.layers.dataSource
    * @notUsedInTheme
    */
    /**
    * @name dxVectorMapOptions.markers.coordinates
    * @type Array<number>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxVectorMapOptions.markers.attributes
    * @type object
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxVectorMapOptions.markers.text
    * @type string
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxVectorMapOptions.markers.value
    * @type number
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxVectorMapOptions.markers.values
    * @type Array<number>
    * @default undefined
    * @deprecated
    */
    /**
    * @name dxVectorMapOptions.markers.url
    * @type string
    * @default undefined
    * @deprecated
    */
    markers: undefined,
    /**
    * @name dxVectorMapOptions.markerSettings
    * @type object
    * @deprecated dxVectorMapOptions.layers
    */
    markerSettings: {
        /**
        * @name dxVectorMapOptions.markerSettings.type
        * @type Enums.VectorMapMarkerType
        * @default 'dot'
        * @deprecated dxVectorMapOptions.layers.elementType
        */
        type: 'dot',
        /**
        * @name dxVectorMapOptions.markerSettings.size
        * @type number
        * @default 8
        * @deprecated dxVectorMapOptions.layers.size
        */
        size: 8,
        /**
        * @name dxVectorMapOptions.markerSettings.minSize
        * @type number
        * @default 20
        * @deprecated dxVectorMapOptions.layers.minSize
        */
        minSize: 20,
        /**
        * @name dxVectorMapOptions.markerSettings.maxSize
        * @type number
        * @default 50
        * @deprecated dxVectorMapOptions.layers.maxSize
        */
        maxSize: 50,
        /**
        * @name dxVectorMapOptions.markerSettings.borderWidth
        * @type number
        * @default 2
        * @deprecated dxVectorMapOptions.layers.borderWidth
        */
        borderWidth: 2,
        /**
        * @name dxVectorMapOptions.markerSettings.borderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxVectorMapOptions.layers.borderColor
        */
        borderColor: '#ffffff',
        /**
        * @name dxVectorMapOptions.markerSettings.color
        * @type string
        * @default '#ba4d51'
        * @deprecated dxVectorMapOptions.layers.color
        */
        color: '#ba4d51',
        /**
        * @name dxVectorMapOptions.markerSettings.hoveredBorderWidth
        * @type number
        * @default 2
        * @deprecated dxVectorMapOptions.layers.hoveredBorderWidth
        */
        hoveredBorderWidth: 2,
        /**
        * @name dxVectorMapOptions.markerSettings.hoveredBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxVectorMapOptions.layers.hoveredBorderColor
        */
        hoveredBorderColor: '#ffffff',
        /**
        * @name dxVectorMapOptions.markerSettings.hoveredColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxVectorMapOptions.layers.hoveredColor
        */
        hoveredColor: '#ba4d51',
        /**
        * @name dxVectorMapOptions.markerSettings.selectedBorderWidth
        * @type number
        * @default 2
        * @deprecated dxVectorMapOptions.layers.selectedBorderWidth
        */
        selectedBorderWidth: 2,
        /**
        * @name dxVectorMapOptions.markerSettings.selectedBorderColor
        * @type string
        * @default '#ffffff'
        * @deprecated dxVectorMapOptions.layers.selectedBorderColor
        */
        selectedBorderColor: '#ffffff',
        /**
        * @name dxVectorMapOptions.markerSettings.selectedColor
        * @type string
        * @default '#ba4d51'
        * @deprecated dxVectorMapOptions.layers.selectedColor
        */
        selectedColor: '#ba4d51',
        /**
        * @name dxVectorMapOptions.markerSettings.opacity
        * @type number
        * @default 1
        * @deprecated dxVectorMapOptions.layers.opacity
        */
        opacity: 1,
        /**
        * @name dxVectorMapOptions.markerSettings.palette
        * @extends CommonVizPalette
        * @deprecated dxVectorMapOptions.layers.palette
        */
        palette: 'default',
        /**
        * @name dxVectorMapOptions.markerSettings.colorGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.colorGroups
        */
        colorGroups: undefined,
        /**
        * @name dxVectorMapOptions.markerSettings.colorGroupingField
        * @type string
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.colorGroupingField
        */
        colorGroupingField: undefined,
        /**
        * @name dxVectorMapOptions.markerSettings.sizeGroups
        * @type Array<number>
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.sizeGroups
        */
        sizeGroups: undefined,
        /**
        * @name dxVectorMapOptions.markerSettings.sizeGroupingField
        * @type string
        * @default undefined
        * @deprecated dxVectorMapOptions.layers.sizeGroupingField
        */
        sizeGroupingField: undefined,
        /**
        * @name dxVectorMapOptions.markerSettings.label
        * @type object
        * @deprecated dxVectorMapOptions.layers.label
        */
        label: {
            /**
            * @name dxVectorMapOptions.markerSettings.label.enabled
            * @type boolean
            * @default true
            * @deprecated dxVectorMapOptions.layers.label.enabled
            */
            enabled: true,
            /**
            * @name dxVectorMapOptions.markerSettings.label.font
            * @type object
            * @deprecated dxVectorMapOptions.layers.label.font
            */
            font: {
                /**
                * @name dxVectorMapOptions.markerSettings.label.font.family
                * @extends CommonVizFontFamily
                * @deprecated dxVectorMapOptions.layers.label.font.family
                */
                family: undefined,
                /**
                * @name dxVectorMapOptions.markerSettings.label.font.weight
                * @type number
                * @default 400
                * @deprecated dxVectorMapOptions.layers.label.font.weight
                */
                weight: 400,
                /**
                * @name dxVectorMapOptions.markerSettings.label.font.color
                * @type string
                * @default '#2b2b2b'
                * @deprecated dxVectorMapOptions.layers.label.font.color
                */
                color: '#2b2b2b',
                /**
                * @name dxVectorMapOptions.markerSettings.label.font.size
                * @type number|string
                * @default 12
                * @deprecated dxVectorMapOptions.layers.label.font.size
                */
                size: 12,
                /**
                * @name dxVectorMapOptions.markerSettings.label.font.opacity
                * @type number
                * @default undefined
                * @deprecated dxVectorMapOptions.layers.label.font.opacity
                */
                opacity: undefined
            }
        },
        /**
        * @name dxVectorMapOptions.markerSettings.hoverEnabled
        * @type boolean
        * @default true
        * @deprecated dxVectorMapOptions.layers.hoverEnabled
        */
        hoverEnabled: true,
        /**
        * @name dxVectorMapOptions.markerSettings.selectionMode
        * @type Enums.SelectionMode
        * @default 'single'
        * @deprecated dxVectorMapOptions.layers.selectionMode
        */
        selectionMode: 'single',
        /**
        * @name dxVectorMapOptions.markerSettings.customize
        * @type function(marker)
        * @type_function_param1 marker:markerObjects
        * @type_function_return dxVectorMapOptions.markerSettings
        * @deprecated dxVectorMapOptions.layers.customize
        * @notUsedInTheme
        */
        customize: function() { }
    },
    /**
    * @name dxVectorMapOptions.controlBar
    * @type object
    */
    controlBar: {
        /**
        * @name dxVectorMapOptions.controlBar.enabled
        * @type boolean
        * @default true
        */
        enabled: true,
        /**
        * @name dxVectorMapOptions.controlBar.borderColor
        * @type string
        * @default '#5d5d5d'
        */
        borderColor: '#5d5d5d',
        /**
        * @name dxVectorMapOptions.controlBar.color
        * @type string
        * @default '#ffffff'
        */
        color: '#ffffff',
        /**
        * @name dxVectorMapOptions.controlBar.margin
        * @type number
        * @default 20
        */
        margin: 20,
        /**
        * @name dxVectorMapOptions.controlBar.horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'left'
        */
        horizontalAlignment: 'left',
        /**
        * @name dxVectorMapOptions.controlBar.verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'top'
        */
        verticalAlignment: 'top',
        /**
        * @name dxVectorMapOptions.controlBar.opacity
        * @type number
        * @default 0.3
        */
        opacity: 0.3
    },
    /**
    * @name dxVectorMapOptions.tooltip
    * @type object
    */
    tooltip: {
        /**
        * @name dxVectorMapOptions.tooltip.customizeTooltip
        * @type function(info)
        * @type_function_param1 info:areaObjects|markerObjects
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined,
        /**
        * @name dxVectorMapOptions.tooltip.format
        * @hidden
        * @inheritdoc
        */
        format: undefined,
        /**
        * @name dxVectorMapOptions.tooltip.precision
        * @hidden
        * @inheritdoc
        */
        precision: undefined
    },
    /**
    * @name dxVectorMapOptions.onTooltipShown
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onTooltipShown: function() { },
    /**
    * @name dxVectorMapOptions.onTooltipHidden
    * @extends Action
    * @type function(e)
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onTooltipHidden: function() { },
    /**
    * @name dxVectorMapOptions.legends
    * @type Array<Object>
    * @default undefined
    */
    legends: [{
        /**
        * @name dxVectorMapOptions.legends.source
        * @type object
        * @notUsedInTheme
        */
        source: {
            /**
            * @name dxVectorMapOptions.legends.source.layer
            * @type string
            * @notUsedInTheme
            */
            layer: undefined,
            /**
            * @name dxVectorMapOptions.legends.source.grouping
            * @type string
            * @notUsedInTheme
            */
            grouping: undefined
        },
        /**
        * @name dxVectorMapOptions.legends.customizeText
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
        * @name dxVectorMapOptions.legends.customizeHint
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
        * @name dxVectorMapOptions.legends.verticalAlignment
        * @type Enums.VerticalEdge
        * @default 'bottom'
        */
        verticalAlignment: 'bottom',
        /**
        * @name dxVectorMapOptions.legends.horizontalAlignment
        * @type Enums.HorizontalAlignment
        * @default 'right'
        */
        horizontalAlignment: 'right',
        /**
        * @name dxVectorMapOptions.legends.orientation
        * @type Enums.Orientation
        * @default undefined
        */
        orientation: undefined,
        /**
        * @name dxVectorMapOptions.legends.itemTextPosition
        * @type Enums.Position
        * @default undefined
        */
        itemTextPosition: undefined,
        /**
        * @name dxVectorMapOptions.legends.itemsAlignment
        * @type Enums.HorizontalAlignment
        * @default undefined
        */
        itemsAlignment: undefined,
        /**
        * @name dxVectorMapOptions.legends.font
        * @type object
        */
        font: {
            /**
            * @name dxVectorMapOptions.legends.font.color
            * @type string
            * @default '#2b2b2b'
            */
            color: '#2b2b2b',
            /**
            * @name dxVectorMapOptions.legends.font.family
            * @extends CommonVizFontFamily
            */
            family: undefined,
            /**
            * @name dxVectorMapOptions.legends.font.weight
            * @type number
            * @default undefined
            */
            weight: undefined,
            /**
            * @name dxVectorMapOptions.legends.font.size
            * @type number|string
            * @default 12
            */
            size: 12,
            /**
            * @name dxVectorMapOptions.legends.font.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined
        },
        /**
        * @name dxVectorMapOptions.legends.visible
        * @type boolean
        * @default true
        */
        visible: true,
        /**
        * @name dxVectorMapOptions.legends.margin
        * @type number|object
        * @default 10
        */
        margin: {
            /**
            * @name dxVectorMapOptions.legends.margin.top
            * @type number
            * @default 10
            */
            top: 10,
            /**
            * @name dxVectorMapOptions.legends.margin.bottom
            * @type number
            * @default 10
            */
            bottom: 10,
            /**
            * @name dxVectorMapOptions.legends.margin.left
            * @type number
            * @default 10
            */
            left: 10,
            /**
            * @name dxVectorMapOptions.legends.margin.right
            * @type number
            * @default 10
            */
            right: 10
        },
        /**
        * @name dxVectorMapOptions.legends.markerSize
        * @type number
        * @default 12
        */
        markerSize: 12,
        /**
        * @name dxVectorMapOptions.legends.markerColor
        * @type string
        * @default undefined
        */
        markerColor: undefined,
        /**
        * @name dxVectorMapOptions.legends.markerShape
        * @type Enums.VectorMapMarkerShape
        * @default "square"
        */
        markerShape: "square",
        /**
        * @name dxVectorMapOptions.legends.backgroundColor
        * @type string
        * @default undefined
        */
        backgroundColor: undefined,
        /**
        * @name dxVectorMapOptions.legends.border
        * @type object
        */
        border: {
            /**
            * @name dxVectorMapOptions.legends.border.visible
            * @type boolean
            * @default false
            */
            visible: false,
            /**
            * @name dxVectorMapOptions.legends.border.width
            * @type number
            * @default 1
            */
            width: 1,
            /**
            * @name dxVectorMapOptions.legends.border.color
            * @type string
            * @default '#d3d3d3'
            */
            color: '#d3d3d3',
            /**
            * @name dxVectorMapOptions.legends.border.cornerRadius
            * @type number
            * @default 0
            */
            cornerRadius: 0,
            /**
            * @name dxVectorMapOptions.legends.border.opacity
            * @type number
            * @default undefined
            */
            opacity: undefined,
            /**
            * @name dxVectorMapOptions.legends.border.dashStyle
            * @type Enums.DashStyle
            * @default 'solid'
            */
            dashStyle: 'solid'
        },
        /**
        * @name dxVectorMapOptions.legends.paddingLeftRight
        * @type number
        * @default 10
        */
        paddingLeftRight: 10,
        /**
        * @name dxVectorMapOptions.legends.paddingTopBottom
        * @type number
        * @default 10
        */
        paddingTopBottom: 10,
        /**
        * @name dxVectorMapOptions.legends.columnCount
        * @type number
        * @default 0
        */
        columnCount: 0,
        /**
        * @name dxVectorMapOptions.legends.rowCount
        * @type number
        * @default 0
        */
        rowCount: 0,
        /**
        * @name dxVectorMapOptions.legends.columnItemSpacing
        * @type number
        * @default 20
        */
        columnItemSpacing: 20,
        /**
        * @name dxVectorMapOptions.legends.rowItemSpacing
        * @type number
        * @default 8
        */
        rowItemSpacing: 8
    }],
    /**
    * @name dxVectorMapOptions.projection
    * @type object
    * @default undefined
    * @notUsedInTheme
    */
    projection: undefined,
    /**
    * @name dxVectorMapOptions.bounds
    * @type Array<number>
    * @default undefined
    * @notUsedInTheme
    */
    bounds: undefined,
    /**
    * @name dxVectorMapOptions.touchEnabled
    * @type boolean
    * @default true
    */
    touchEnabled: true,
    /**
    * @name dxVectorMapOptions.wheelEnabled
    * @type boolean
    * @default true
    */
    wheelEnabled: true,
    /**
    * @name dxVectorMapOptions.panningEnabled
    * @type boolean
    * @default true
    */
    panningEnabled: true,
    /**
    * @name dxVectorMapOptions.zoomingEnabled
    * @type boolean
    * @default true
    */
    zoomingEnabled: true,
    /**
    * @name dxVectorMapOptions.center
    * @type Array<number>
    * @default [0, 0]
    * @notUsedInTheme
    */
    center: [0, 0],
    /**
    * @name dxVectorMapOptions.zoomFactor
    * @type number
    * @default 1
    * @notUsedInTheme
    */
    zoomFactor: 1,
    /**
    * @name dxVectorMapOptions.maxZoomFactor
    * @type number
    * @default 256
    * @notUsedInTheme
    */
    maxZoomFactor: 256,
    /**
    * @name dxVectorMapOptions.onClick
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
    * @name dxVectorMapOptions.onCenterChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 center:Array<number>
    * @notUsedInTheme
    * @action
    */
    onCenterChanged: function() { },
    /**
    * @name dxVectorMapOptions.onZoomFactorChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 zoomFactor:number
    * @notUsedInTheme
    * @action
    */
    onZoomFactorChanged: function() { },
    /**
    * @name dxVectorMapOptions.onSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:MapLayerElement
    * @notUsedInTheme
    * @action
    */
    onSelectionChanged: function() { },
    /**
    * @name dxVectorMapOptions.onAreaClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:areaObjects
    * @notUsedInTheme
    * @deprecated dxVectorMapOptions.onClick
    * @action
    */
    onAreaClick: function() { },
    /**
    * @name dxVectorMapOptions.onAreaSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:areaObjects
    * @notUsedInTheme
    * @deprecated dxVectorMapOptions.onSelectionChanged
    * @action
    */
    onAreaSelectionChanged: function() { },
    /**
    * @name dxVectorMapOptions.onMarkerClick
    * @extends Action
    * @type function|string
    * @type_function_param1 e:object
    * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
    * @type_function_param1_field5 event:event
    * @type_function_param1_field6 target:markerObjects
    * @notUsedInTheme
    * @deprecated dxVectorMapOptions.onClick
    * @action
    */
    onMarkerClick: function() { },
    /**
    * @name dxVectorMapOptions.onMarkerSelectionChanged
    * @extends Action
    * @type function
    * @type_function_param1 e:object
    * @type_function_param1_field4 target:markerObjects
    * @notUsedInTheme
    * @deprecated dxVectorMapOptions.onSelectionChanged
    * @action
    */
    onMarkerSelectionChanged: function() { },
    /**
    * @name dxVectorMapMethods.getLayers
    * @publicName getLayers()
    * @return Array<MapLayer>
    */
    getLayers: function() { },
    /**
    * @name dxVectorMapMethods.getLayerByIndex
    * @publicName getLayerByIndex(index)
    * @return MapLayer
    * @param1 index:number
    */
    getLayerByIndex: function() { },
    /**
    * @name dxVectorMapMethods.getLayerByName
    * @publicName getLayerByName(name)
    * @return MapLayer
    * @param1 name:string
    */
    getLayerByName: function() { },
    /**
    * @name dxVectorMapMethods.getAreas
    * @publicName getAreas()
    * @return Array<areaObjects>
    * @deprecated dxVectorMapMethods.getLayers
    */
    getAreas: function() { },
    /**
    * @name dxVectorMapMethods.getMarkers
    * @publicName getMarkers()
    * @return Array<markerObjects>
    * @deprecated dxVectorMapMethods.getLayers
    */
    getMarkers: function() { },
    /**
    * @name dxVectorMapMethods.clearAreaSelection
    * @publicName clearAreaSelection()
    * @deprecated dxVectorMapMethods.clearSelection
    */
    clearAreaSelection: function() { },
    /**
    * @name dxVectorMapMethods.clearMarkerSelection
    * @publicName clearMarkerSelection()
    * @deprecated dxVectorMapMethods.clearSelection
    */
    clearMarkerSelection: function() { },
    /**
    * @name dxVectorMapMethods.clearSelection
    * @publicName clearSelection()
    */
    clearSelection: function() { },
    /**
    * @name dxVectorMapMethods.center
    * @publicName center()
    * @return Array<number>
    */
    center: function() { },
    /**
    * @name dxVectorMapMethods.center
    * @publicName center(centerCoordinates)
    * @param1 centerCoordinates:Array<number>
    */
    center: function() { },
    /**
    * @name dxVectorMapMethods.zoomFactor
    * @publicName zoomFactor()
    * @return number
    */
    zoomFactor: function() { },
    /**
    * @name dxVectorMapMethods.zoomFactor
    * @publicName zoomFactor(zoomFactor)
    * @param1 zoomFactor:number
    */
    zoomFactor: function() { },
    /**
    * @name dxVectorMapMethods.viewport
    * @publicName viewport()
    * @return Array<number>
    */
    viewport: function() { },
    /**
    * @name dxVectorMapMethods.viewport
    * @publicName viewport(viewportCoordinates)
    * @param1 viewportCoordinates:Array<number>
    */
    viewport: function() { },
    /**
    * @name dxVectorMapMethods.convertCoordinates
    * @publicName convertCoordinates(x, y)
    * @param1 x:number
    * @param2 y:number
    * @return Array<number>
    */
    convertCoordinates: function() { }
};
