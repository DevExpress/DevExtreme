/**
 * @name MapLayer
 * @publicName Layer
 */
var Layer = {
    /**
     * @name MapLayerfields_name
     * @publicName name
     * @type string
     */
    name: undefined,
    /**
     * @name MapLayerfields_index
     * @publicName index
     * @type number
     */
    index: undefined,
    /**
     * @name MapLayerfields_type
     * @publicName type
     * @type string
     */
    type: undefined,
    /**
     * @name MapLayerfields_elementType
     * @publicName elementType
     * @type string
     */
    elementType: undefined,
    /**
     * @name MapLayermethods_getElements
     * @publicName getElements()
     * @return Array<MapLayerElement>
     */
    getElements: function() { },
    /**
     * @name MapLayermethods_clearSelection
     * @publicName clearSelection()
     */
    clearSelection: function() { },
    /**
    * @name MapLayermethods_getDataSource
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
     * @name MapLayerElementfields_layer
     * @publicName layer
     * @type object
     */
    layer: undefined,
    /**
    * @name MapLayerElementmethods_coordinates
    * @publicName coordinates()
    * @return object
    */
    coordinates: function() { },
    /**
    * @name MapLayerElementmethods_attribute
    * @publicName attribute(name)
    * @return any
    * @param1 name:string
    */
    attribute: function() { },
    /**
    * @name MapLayerElementmethods_attribute
    * @publicName attribute(name, value)
    * @param1 name:string
    * @param2 value:any
    */
    attribute: function() { },
    /**
    * @name MapLayerElementmethods_selected
    * @publicName selected(state)
    * @param1 state:boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementmethods_selected
    * @publicName selected()
    * @return boolean
    */
    selected: function() { },
    /**
    * @name MapLayerElementmethods_applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    */
    applySettings: function() { }
};
/**
* @name areaObjects
* @publicName Area
* @deprecated
*/
var AreaObjects = {
    /**
    * @name areaObjectsfields_type
    * @publicName type
    * @type string
    * @deprecated MapLayerfields_type
    */
    type: null,
    /**
    * @name areaObjectsmethods_attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementmethods_attribute
    */
    attribute: function() { },
    /**
    * @name areaObjectsmethods_selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated
    */
    selected: function() { },
    /**
    * @name areaObjectsmethods_selected
    * @publicName selected()
    * @return boolean
    * @deprecated
    */
    selected: function() { },
    /**
    * @name areaObjectsmethods_applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementmethods_applySettings
    */
    applySettings: function() { }
};

/**
* @name markerObjects
* @publicName Marker
* @deprecated
*/
var MarkerObjects = {
    /**
    * @name markerObjectsfields_type
    * @publicName type
    * @type string
    * @deprecated MapLayerfields_type
    */
    type: null,
    /**
    * @name markerObjectsmethods_attribute
    * @publicName attribute(name)
    * @return object | Array<any> | number | string | boolean
    * @param1 name:string
    * @deprecated MapLayerElementmethods_attribute
    */
    attribute: function() { },
    /**
    * @name markerObjectsmethods_selected
    * @publicName selected(state)
    * @param1 state:boolean
    * @deprecated
    */
    selected: function() { },
    /**
    * @name markerObjectsmethods_selected
    * @publicName selected()
    * @return boolean
    * @deprecated
    */
    selected: function() { },
    /**
    * @name markerObjectsmethods_applySettings
    * @publicName applySettings(settings)
    * @param1 settings:object
    * @deprecated MapLayerElementmethods_applySettings
    */
    applySettings: function() { },
    /**
    * @name markerObjectsmethods_coordinates
    * @publicName coordinates()
    * @return Array<number>
    * @deprecated MapLayerElementmethods_coordinates
    */
    coordinates: function() { },
    /**
    * @name markerObjectsfields_text
    * @publicName text
    * @type string
    * @deprecated
    */
    text: null,
    /**
   * @name markerObjectsfields_value
   * @publicName value
   * @type number
   * @deprecated
   */
    value: null,
    /**
   * @name markerObjectsfields_values
   * @publicName values
   * @type Array<number>
   * @deprecated
   */
    values: null,
    /**
   * @name markerObjectsfields_url
   * @publicName url
   * @type string
   * @deprecated
   */
    url: null
};
