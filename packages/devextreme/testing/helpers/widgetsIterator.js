define(function(require) {
    const $ = require('jquery');
    const typeUtils = require('core/utils/type');

    return function(namespace, parent, excluded) {
        excluded = excluded || [];

        return function(callback) {
            $.each(namespace, function(componentName, componentClass) {
                const isWidget = $.fn[componentName] && namespace[componentName].subclassOf(parent);

                if(!isWidget) {
                    return;
                }

                if(typeUtils.isFunction(excluded) ? !excluded(componentName) : $.inArray(componentName, excluded) > -1) {
                    return;
                }

                callback(componentName, componentClass);
            });
        };

    };
});
