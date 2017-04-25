/**
 * @name mapLayer
 * @publicName Layer
 */
var Layer = {
    /**
     * @name mapLayerfields_name
     * @publicName name
     * @type string
     */
    name: undefined,
    /**
     * @name mapLayerfields_index
     * @publicName index
     * @type number
     */
    index: undefined,
    /**
     * @name mapLayerfields_type
     * @publicName type
     * @type string
     */
    type: undefined,
    /**
     * @name mapLayerfields_elementType
     * @publicName elementType
     * @type string
     */
    elementType: undefined,
    /**
     * @name mapLayermethods_getElements
     * @publicName getElements()
     * @return array
     */
    getElements: function() { },
    /**
     * @name mapLayermethods_clearSelection
     * @publicName clearSelection()
     */
    clearSelection: function() { },
    /**
    * @name mapLayermethods_getDataSource
    * @publicName getDataSource()
    * @return DataSource
    */
    getDataSource: function() { },
};
/**
 * @name mapLayerElement
 * @publicName Layer Element
 */
var LayerElement = {
    /**
     * @name mapLayerElementfields_layer
     * @publicName layer
     * @type object
     */
    layer: undefined,
    /**
    * @name mapLayerElementmethods_coordinates
    * @publicName coordinates()
    * @return object
    */
    coordinates: function() { },
    /**
    * @name mapLayerElementmethods_attribute
    * @publicName attribute(name)
    * @return any
    * @param1 name:string
    */
    attribute: function() { },
    /**
    * @name mapLayerElementmethods_attribute
    * @publicName attribute(name, value)
    * @param1 name:string
    * @param2 value:any
    */
    attribute: function() { },
    /**
    * @name mapLayerElementmethods_selected
    * @publicName selected(state)
    * @param1 state:boolean
    */
    selected: function() { },
    /**
    * @name mapLayerElementmethods_selected
    * @publicName selected()
    * @return boolean
    */
    selected: function() { },
    /**
    * @name mapLayerElementmethods_applySettings
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
    * @deprecated mapLayerfields_type
    */
    type: null,
    /**
    * @name areaObjectsmethods_attribute
    * @publicName attribute(name)
    * @return object | array | number | string | boolean
    * @param1 name:string
    * @deprecated mapLayerElementmethods_attribute
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
    * @deprecated mapLayerElementmethods_applySettings
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
    * @deprecated mapLayerfields_type
    */
    type: null,
    /**
    * @name markerObjectsmethods_attribute
    * @publicName attribute(name)
    * @return object | array | number | string | boolean
    * @param1 name:string
    * @deprecated mapLayerElementmethods_attribute
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
    * @deprecated mapLayerElementmethods_applySettings
    */
    applySettings: function() { },
    /**
    * @name markerObjectsmethods_coordinates
    * @publicName coordinates()
    * @return array
    * @deprecated mapLayerElementmethods_coordinates
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
   * @type array
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
