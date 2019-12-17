var $ = require('./renderer');
var callbacks = require('./component_registrator_callbacks');
var errors = require('./errors');
var publicComponentUtils = require('./utils/public_component');

/**
 * @name registerComponent
 * @publicName registerComponent(name, componentClass)
 * @param1 name:string
 * @param2 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
 * @hidden
 */
/**
 * @name registerComponent
 * @publicName registerComponent(name, namespace, componentClass)
 * @param1 name:string
 * @param2 namespace:object
 * @param3 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
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

var registerRendererComponent = function(name, componentClass) {
    $.fn[name] = function(options) {
        var isMemberInvoke = typeof options === 'string',
            result;

        if(isMemberInvoke) {
            var memberName = options,
                memberArgs = [].slice.call(arguments).slice(1);

            this.each(function() {
                var instance = componentClass.getInstance(this);

                if(!instance) {
                    throw errors.Error('E0009', name);
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

callbacks.add(registerRendererComponent);

module.exports = registerComponent;
