
var dxVectorMap = {
    /**
    * @name dxVectorMapOptions.margin
    * @hidden
    */
    margin: undefined,
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
    tooltip: {
        customizeTooltip: undefined,
        contentTemplate: undefined,
        /**
        * @name dxVectorMapOptions.tooltip.format
        * @hidden
        */
        format: undefined
    },
    onTooltipShown: function() { },
    onTooltipHidden: function() { },
    legends: [{
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
        customizeText: undefined,
        customizeHint: undefined,
        customizeItems: undefined,
        markerTemplate: undefined,
        font: {
            color: '#2b2b2b'
        },
        markerSize: 12,
        markerColor: undefined,
        markerShape: "square"
    }],
    projection: "mercator",
    bounds: undefined,
    touchEnabled: true,
    wheelEnabled: true,
    panningEnabled: true,
    zoomingEnabled: true,
    center: [0, 0],
    zoomFactor: 1,
    maxZoomFactor: 256,
    onClick: function() { },
    onCenterChanged: function() { },
    onZoomFactorChanged: function() { },
    onSelectionChanged: function() { },
    getLayers: function() { },
    getLayerByIndex: function() { },
    getLayerByName: function() { },
    clearSelection: function() { },
    center: function() { },
    center: function() { },
    zoomFactor: function() { },
    zoomFactor: function() { },
    viewport: function() { },
    viewport: function() { },
    convertCoordinates: function() { },
    convertToGeo: function() { },
    convertToXY: function() { }
};
