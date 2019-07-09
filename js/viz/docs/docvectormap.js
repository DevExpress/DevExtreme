/**
* @name dxVectorMap
* @inherits BaseWidget
* @module viz/vector_map
* @export default
*/
var dxVectorMap = {
    /**
    * @name dxVectorMapOptions.margin
    * @hidden
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
            * @type Font
            * @default '#2b2b2b' @prop color
            */
            font: {
                family: undefined,
                weight: 400,
                color: '#2b2b2b',
                size: 12,
                opacity: undefined
            }
        }
    }],
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
        * @type_function_param1 info:MapLayerElement
        * @type_function_return object
        * @default undefined
        * @notUsedInTheme
        */
        customizeTooltip: undefined,
        /**
        * @name dxVectorMapOptions.tooltip.format
        * @hidden
        */
        format: undefined
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
    * @inherits BaseLegend
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
        * @name dxVectorMapOptions.legends.customizeItems
        * @type function(items)
        * @type_function_param1 items:Array<VectorMapLegendItem>
        * @type_function_return Array<VectorMapLegendItem>
        */
        customizeItems: undefined,
        /**
        * @name dxVectorMapOptions.legends.font
        * @type Font
        * @default '#2b2b2b' @prop color
        */
        font: {
            color: '#2b2b2b'
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
        markerShape: "square"
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
