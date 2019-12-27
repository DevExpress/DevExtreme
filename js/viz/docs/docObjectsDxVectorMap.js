/**
 * @name MapLayer
 * @publicName Layer
 */
const Layer = {
    /**
     * @name MapLayerFields.name
     * @type string
     */
    name: undefined,
    /**
     * @name MapLayerFields.index
     * @type number
     */
    index: undefined,
    /**
     * @name MapLayerFields.type
     * @type string
     */
    type: undefined,
    /**
     * @name MapLayerFields.elementType
     * @type string
     */
    elementType: undefined,
    /**
     * @name MapLayerMethods.getElements
     * @publicName getElements()
     * @return Array<MapLayerElement>
     */
    getElements: function() { },
    /**
     * @name MapLayerMethods.clearSelection
     * @publicName clearSelection()
     */
    clearSelection: function() { },
    /**
    * @name MapLayerMethods.getDataSource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
/**
 * @name MapLayerElement
 * @publicName Layer Element
 */
const LayerElement = {
    /**
     * @name MapLayerElementFields.layer
     * @type object
     */
    layer: undefined,
    /**
    * @name MapLayerElementMethods.coordinates
    * @publicName coordinates()
    * @return object
    */
    coordinates: function() { },
    /**
    * @name MapLayerElementMethods.attribute
    * @publicName attribute(name)
    * @return any
    * @param1 name:string
    */
    attribute: function() { },
    /**
    * @name MapLayerElementMethods.attribute
    * @publicName attribute(name, value)
    * @param1 name:string
    * @param2 value:any
    */
    attribute: function() { },
    /**
    * @name MapLayerElementMethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementMethods.selected
    * @publicName selected()
    * @return boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementMethods.applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    */
    applySettings: function() { }
};

/**
* @name VectorMapLegendItem
* @type object
* @inherits BaseLegendItem
*/
const legendItem = {
    /**
    * @name VectorMapLegendItem.start
    * @type number
    */
    start: undefined,
    /**
    * @name VectorMapLegendItem.end
    * @type number
    */
    end: undefined,
    /**
    * @name VectorMapLegendItem.color
    * @type string
    */
    color: undefined,
    /**
    * @name VectorMapLegendItem.size
    * @type number
    */
    size: 10
};

/**
* @name VectorMapProjectionConfig
* @type object
*/
/**
* @name VectorMapProjectionConfig.to
* @type function
* @type_function_param1 coordinates:Array<number>
* @type_function_return Array<number>
*/
/**
* @name VectorMapProjectionConfig.from
* @type function
* @type_function_param1 coordinates:Array<number>
* @type_function_return Array<number>
*/
/**
* @name VectorMapProjectionConfig.aspectRatio
* @type number
* @default 1
*/
