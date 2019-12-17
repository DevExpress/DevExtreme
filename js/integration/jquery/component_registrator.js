var jQuery = require('jquery');
var componentRegistratorCallbacks = require('../../core/component_registrator_callbacks');
var errors = require('../../core/errors');

if(jQuery) {
    var registerJQueryComponent = function(name, componentClass) {
        jQuery.fn[name] = function(options) {
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

    componentRegistratorCallbacks.add(registerJQueryComponent);
}
