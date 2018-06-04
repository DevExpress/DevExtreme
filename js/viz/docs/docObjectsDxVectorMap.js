/**
 * @name MapLayer
 * @publicName Layer
 */
var Layer = {
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
var LayerElement = {
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

