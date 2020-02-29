define(function(require) {
    const $ = require('jquery');

    return function(namespace, parent, excluded) {
        excluded = excluded || [];

        return function(callback) {
            $.each(namespace, function(componentName, componentClass) {
                const isWidget = $.fn[componentName] && namespace[componentName].subclassOf(parent);

                if(!isWidget) {
                    return;
                }

                if($.isFunction(excluded) ? !excluded(componentName) : $.inArray(componentName, excluded) > -1) {
                    return;
                }

                callback(componentName, componentClass);
            });
        };

    };
});
