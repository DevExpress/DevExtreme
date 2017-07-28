"use strict";

var callbacks = require("./component_registrator_callbacks"),
    publicComponentUtils = require("./utils/public_component");

/**
 * @name registerComponent
 * @publicName registerComponent(name, class)
 * @param1 name:string
 * @param2 class:Class
 * @module core/component_registrator
 * @hidden
 */
/**
 * @name registerComponent
 * @publicName registerComponent(name, namespace, class)
 * @param1 name:string
 * @param2 namespace:object
 * @param3 class:Class
 * @module core/component_registrator
 * @hidden
 */
var registerComponent = function(name, namespace, componentClass) {
    if(!componentClass) {
        componentClass = namespace;
    } else {
        namespace[name] = componentClass;
    }

    publicComponentUtils.name(componentClass, name);
    callbacks.fire(name, componentClass);
};

module.exports = registerComponent;
