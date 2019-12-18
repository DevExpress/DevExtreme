var $ = require('../../core/renderer'),
    TemplateBase = require('./ui.template_base'),
    eventsEngine = require('../../events/core/events_engine'),
    removeEvent = require('../../core/remove_event'),
    iteratorUtils = require('../../core/utils/iterator'),
    isPrimitive = require('../../core/utils/type').isPrimitive;

var watchChanges = (function() {

    var start = function(rawData, watchMethod, fields, fieldsMap, callback) {
        var globalDispose,
            fieldsDispose;

        globalDispose = globalWatch(rawData, watchMethod, function(dataWithRawFields) {
            fieldsDispose && fieldsDispose();

            if(isPrimitive(dataWithRawFields)) {
                callback(dataWithRawFields);
                return;
            }

            fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, function(data) {
                callback(data);
            });
        });

        return function() {
            fieldsDispose && fieldsDispose();
            globalDispose && globalDispose();
        };
    };

    var globalWatch = function(data, watchMethod, callback) {
        return watchMethod(
            function() { return data; },
            callback
        );
    };

    var fieldsWatch = function(data, watchMethod, fields, fieldsMap, callback) {
        var resolvedData = {},
            missedFields = fields.slice();

        var watchHandlers = iteratorUtils.map(fields, function(name) {
            var fieldGetter = fieldsMap[name];

            return watchMethod(
                fieldGetter ?
                    function() { return fieldGetter(data); } :
                    function() { return data[name]; },
                function(value) {
                    resolvedData[name] = value;

                    if(missedFields.length) {
                        var index = missedFields.indexOf(name);
                        if(index >= 0) {
                            missedFields.splice(index, 1);
                        }
                    }

                    if(!missedFields.length) {
                        callback(resolvedData);
                    }
                }
            );
        });

        return function() {
            iteratorUtils.each(watchHandlers, function(_, dispose) {
                dispose();
            });
        };
    };

    return start;

})();

module.exports = TemplateBase.inherit({

    ctor: function(render, fields, watchMethod, fieldsMap) {
        this._render = render;
        this._fields = fields;
        this._fieldsMap = fieldsMap || {};
        this._watchMethod = watchMethod;
    },

    _renderCore: function(options) {
        var $container = $(options.container);

        var dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, function(data) {
            $container.empty();
            this._render($container, data, options.model);
        }.bind(this));
        eventsEngine.on($container, removeEvent, dispose);

        return $container.contents();
    }

});
