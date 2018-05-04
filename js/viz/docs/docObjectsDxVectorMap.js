/**
 * @name MapLayer
 * @publicName Layer
 */
var Layer = {
    /**
     * @name MapLayerfields.name
     * @publicName name
     * @type string
     */
    name: undefined,
    /**
     * @name MapLayerfields.index
     * @publicName index
     * @type number
     */
    index: undefined,
    /**
     * @name MapLayerfields.type
     * @publicName type
     * @type string
     */
    type: undefined,
    /**
     * @name MapLayerfields.elementType
     * @publicName elementType
     * @type string
     */
    elementType: undefined,
    /**
     * @name MapLayermethods.getElements
     * @publicName getElements()
     * @return Array<MapLayerElement>
     */
    getElements: function() { },
    /**
     * @name MapLayermethods.clearSelection
     * @publicName clearSelection()
     */
    clearSelection: function() { },
    /**
    * @name MapLayermethods.getDataSource
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
     * @name MapLayerElementfields.layer
     * @publicName layer
     * @type object
     */
    layer: undefined,
    /**
    * @name MapLayerElementmethods.coordinates
    * @publicName coordinates()
    * @return object
    */
    coordinates: function() { },
    /**
    * @name MapLayerElementmethods.attribute
    * @publicName attribute(name)
    * @return any
    * @param1 name:string
    */
    attribute: function() { },
    /**
    * @name MapLayerElementmethods.attribute
    * @publicName attribute(name, value)
    * @param1 name:string
    * @param2 value:any
    */
    attribute: function() { },
    /**
    * @name MapLayerElementmethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementmethods.selected
    * @publicName selected()
    * @return boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementmethods.applySettings
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
    * @name areaObjectsfields.type
    * @publicName type
    * @type string
    * @deprecated MapLayerfields.type
    */
    type: null,
    /**
    * @name areaObjectsmethods.attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementmethods.attribute
    */
    attribute: function() { },
    /**
    * @name areaObjectsmethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated MapLayerElementmethods.selected
    */
    selected: function() { },
    /**
    * @name areaObjectsmethods.selected
    * @publicName selected()
    * @return boolean
    * @deprecated MapLayerElementmethods.selected
    */
    selected: function() { },
    /**
    * @name areaObjectsmethods.applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementmethods.applySettings
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
    * @name markerObjectsfields.type
    * @publicName type
    * @type string
    * @deprecated MapLayerfields.type
    */
    type: null,
    /**
    * @name markerObjectsmethods.attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementmethods.attribute
    */
    attribute: function() { },
    /**
    * @name markerObjectsmethods.selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated MapLayerElementmethods.selected
    */
    selected: function() { },
    /**
    * @name markerObjectsmethods.selected
    * @publicName selected()
    * @return boolean
    * @deprecated MapLayerElementmethods.selected
    */
    selected: function() { },
    /**
    * @name markerObjectsmethods.applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementmethods.applySettings
    */
    applySettings: function() { },
    /**
    * @name markerObjectsmethods.coordinates
    * @publicName coordinates()
    * @return Array<number>
    * @deprecated MapLayerElementmethods.coordinates
    */
    coordinates: function() { },
    /**
    * @name markerObjectsfields.text
    * @publicName text
    * @type string
    * @deprecated
    */
    text: null,
    /**
   * @name markerObjectsfields.value
   * @publicName value
   * @type number
   * @deprecated
   */
    value: null,
    /**
   * @name markerObjectsfields.values
   * @publicName values
   * @type Array<number>
   * @deprecated
   */
    values: null,
    /**
   * @name markerObjectsfields.url
   * @publicName url
   * @type string
   * @deprecated
   */
    url: null
};
