"use strict";

var $ = require("../../core/renderer"),
    WeakMap = require("../polyfills/weak_map"),
    isDefined = require("./type").isDefined,
    removeEvent = require("../remove_event");

var COMPONENT_NAMES_DATA_KEY = "dxComponents",
    ANONYMOUS_COMPONENT_DATA_KEY = "dxPrivateComponent";

var componentNames = new WeakMap(),
    nextAnonymousComponent = 0;

var getName = exports.name = function(componentClass, newName) {
    if(isDefined(newName)) {
        componentNames.set(componentClass, newName);
        return;
    }

    if(!componentNames.has(componentClass)) {
        var generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
        componentNames.set(componentClass, generatedName);
        return generatedName;
    }

    return componentNames.get(componentClass);
};

exports.attachInstanceToElement = function($element, componentInstance, disposeFn) {
    var data = $.data($element.get(0)),
        name = getName(componentInstance.constructor);

    data[name] = componentInstance;

    if(disposeFn) {
        $element.one(removeEvent, function() {
            disposeFn.call(componentInstance);
        });
    }

    if(!data[COMPONENT_NAMES_DATA_KEY]) {
        data[COMPONENT_NAMES_DATA_KEY] = [];
    }

    data[COMPONENT_NAMES_DATA_KEY].push(name);
};

exports.getInstanceByElement = function($element, componentClass) {
    var name = getName(componentClass);

    return $.data($element.get(0), name);
};
