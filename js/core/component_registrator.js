"use strict";

var $ = require("../core/renderer"),
    jQuery = require("jquery"),
    errors = require("./errors"),
    MemorizedCallbacks = require("./memorized_callbacks"),
    publicComponentUtils = require("./utils/public_component");

var callbacks = new MemorizedCallbacks();

/**
 * @name registerComponent
 * @publicName registerComponent(name, class)
 * @param1 name:string
 * @param2 class:object
 * @module core/component_registrator
 * @hidden
 */
/**
 * @name registerComponent
 * @publicName registerComponent(name, namespace, class)
 * @param1 name:string
 * @param2 namespace:object
 * @param3 class:object
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
registerComponent.callbacks = callbacks;


var registerJQueryComponent = function(name, componentClass) {
    $.fn[name] = jQuery.fn[name] = function(options) {
        var isMemberInvoke = typeof options === "string",
            result;

        if(isMemberInvoke) {
            var memberName = options,
                memberArgs = $.makeArray(arguments).slice(1);

            this.each(function() {
                var instance = componentClass.getInstance(this);

                if(!instance) {
                    throw errors.Error("E0009", name);
                }

                var member = instance[memberName],
                    memberValue = member.apply(instance, memberArgs);

                if(result === undefined) {
                    result = memberValue;
                }
            });
        } else {
            this.each(function() {
                var instance = componentClass.getInstance(this);
                if(instance) {
                    instance.option(options);
                } else {
                    new componentClass(this, options);
                }
            });

            result = this;
        }

        return result;
    };
};
callbacks.add(registerJQueryComponent);

module.exports = registerComponent;
