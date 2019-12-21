/**
 * @name MapLayer
 * @publicName Layer
 */
var Layer = {
    name: undefined,
    index: undefined,
    type: undefined,
    elementType: undefined,
    getElements: function() { },
    clearSelection: function() { },
    getDataSource: function() { },
};
/**
 * @name MapLayerElement
 * @publicName Layer Element
 */
var LayerElement = {
    layer: undefined,
    coordinates: function() { },
    attribute: function() { },
    attribute: function() { },
    selected: function() { },
    selected: function() { },
    applySettings: function() { }
};

/**
* @name VectorMapLegendItem
* @type object
* @inherits BaseLegendItem
*/
var legendItem = {
    start: undefined,
    end: undefined,
    color: undefined,
    size: 10
};

/**
* @name VectorMapProjectionConfig
* @type object
*/
