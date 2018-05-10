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
/**
* @name areaObjects
* @publicName Area
* @deprecated MapLayerElement
*/
var AreaObjects = {
    /**
    * @name areaObjectsFields.type
    * @type string
    * @deprecated MapLayerFields.type
    */
    type: null,
    /**
    * @name areaObjectsMethods.attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementMethods.attribute
    */
    attribute: function() { },
    /**
    * @name areaObjectsMethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated MapLayerElementMethods.selected
    */
    selected: function() { },
    /**
    * @name areaObjectsMethods.selected
    * @publicName selected()
    * @return boolean
    * @deprecated MapLayerElementMethods.selected
    */
    selected: function() { },
    /**
    * @name areaObjectsMethods.applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementMethods.applySettings
    */
    applySettings: function() { }
};

/**
* @name markerObjects
* @publicName Marker
* @deprecated MapLayerElement
*/
var MarkerObjects = {
    /**
    * @name markerObjectsFields.type
    * @type string
    * @deprecated MapLayerFields.type
    */
    type: null,
    /**
    * @name markerObjectsMethods.attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementMethods.attribute
    */
    attribute: function() { },
    /**
    * @name markerObjectsMethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated MapLayerElementMethods.selected
    */
    selected: function() { },
    /**
    * @name markerObjectsMethods.selected
    * @publicName selected()
    * @return boolean
    * @deprecated MapLayerElementMethods.selected
    */
    selected: function() { },
    /**
    * @name markerObjectsMethods.applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementMethods.applySettings
    */
    applySettings: function() { },
    /**
    * @name markerObjectsMethods.coordinates
    * @publicName coordinates()
    * @return Array<number>
    * @deprecated MapLayerElementMethods.coordinates
    */
    coordinates: function() { },
    /**
    * @name markerObjectsFields.text
    * @type string
    * @deprecated
    */
    text: null,
    /**
   * @name markerObjectsFields.value
   * @type number
   * @deprecated
   */
    value: null,
    /**
   * @name markerObjectsFields.values
   * @type Array<number>
   * @deprecated
   */
    values: null,
    /**
   * @name markerObjectsFields.url
   * @type string
   * @deprecated
   */
    url: null
};
