const $ = require('../../core/renderer');
const TemplateBase = require('./ui.template_base');
const eventsEngine = require('../../events/core/events_engine');
const removeEvent = require('../../core/remove_event');
const iteratorUtils = require('../../core/utils/iterator');
const isPrimitive = require('../../core/utils/type').isPrimitive;

const watchChanges = (function() {

    const start = function(rawData, watchMethod, fields, fieldsMap, callback) {
        let fieldsDispose;

        const globalDispose = globalWatch(rawData, watchMethod, function(dataWithRawFields) {
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
        const resolvedData = {};
        const missedFields = fields.slice();

        const watchHandlers = iteratorUtils.map(fields, function(name) {
            const fieldGetter = fieldsMap[name];

            return watchMethod(
                fieldGetter ?
                    function() { return fieldGetter(data); } :
                    function() { return data[name]; },
                function(value) {
                    resolvedData[name] = value;

                    if(missedFields.length) {
                        const index = missedFields.indexOf(name);
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
        const $container = $(options.container);

        const dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, function(data) {
            $container.empty();
            this._render($container, data, options.model);
        }.bind(this));
        eventsEngine.on($container, removeEvent, dispose);

        return $container.contents();
    }

});
