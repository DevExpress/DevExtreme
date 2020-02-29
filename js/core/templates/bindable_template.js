import $ from '../renderer';
import { TemplateBase } from './template_base';
import { on } from '../../events/core/events_engine';
import removeEvent from '../remove_event';
import { isPrimitive } from '../utils/type';

const watchChanges = (function() {
    const globalWatch = (data, watchMethod, callback) => watchMethod(() => data, callback);

    const fieldsWatch = function(data, watchMethod, fields, fieldsMap, callback) {
        const resolvedData = {};
        const missedFields = fields.slice();

        const watchHandlers = fields.map(function(name) {
            const fieldGetter = fieldsMap[name];

            return watchMethod(
                fieldGetter ? () => fieldGetter(data) : () => data[name],
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
            watchHandlers.forEach(dispose => dispose());
        };
    };

    return function(rawData, watchMethod, fields, fieldsMap, callback) {
        let fieldsDispose;

        const globalDispose = globalWatch(rawData, watchMethod, function(dataWithRawFields) {
            fieldsDispose && fieldsDispose();

            if(isPrimitive(dataWithRawFields)) {
                callback(dataWithRawFields);
                return;
            }

            fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback);
        });

        return function() {
            fieldsDispose && fieldsDispose();
            globalDispose && globalDispose();
        };
    };

})();

export class BindableTemplate extends TemplateBase {
    constructor(render, fields, watchMethod, fieldsMap) {
        super();
        this._render = render;
        this._fields = fields;
        this._fieldsMap = fieldsMap || {};
        this._watchMethod = watchMethod;
    }

    _renderCore(options) {
        const $container = $(options.container);

        const dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, data => {
            $container.empty();
            this._render($container, data, options.model);
        });
        on($container, removeEvent, dispose);

        return $container.contents();
    }
}
