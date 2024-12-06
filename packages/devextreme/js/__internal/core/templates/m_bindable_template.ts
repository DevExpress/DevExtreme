import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import $ from '@js/core/renderer';
import { TemplateBase } from '@js/core/templates/template_base';
import { isPrimitive } from '@js/core/utils/type';

const watchChanges = (function () {
  const globalWatch = (data, watchMethod, callback) => watchMethod(() => data, callback);

  const fieldsWatch = function (data, watchMethod, fields, fieldsMap, callback) {
    const resolvedData = {};
    const missedFields = fields.slice();

    const watchHandlers = fields.map((name) => {
      const fieldGetter = fieldsMap[name];

      return watchMethod(
        fieldGetter ? () => fieldGetter(data) : () => data[name],
        (value) => {
          resolvedData[name] = value;

          if (missedFields.length) {
            const index = missedFields.indexOf(name);
            if (index >= 0) {
              missedFields.splice(index, 1);
            }
          }

          if (!missedFields.length) {
            callback(resolvedData);
          }
        },
      );
    });

    return function () {
      watchHandlers.forEach((dispose) => dispose());
    };
  };

  return function (rawData, watchMethod, fields, fieldsMap, callback) {
    let fieldsDispose;

    const globalDispose = globalWatch(rawData, watchMethod, (dataWithRawFields) => {
      fieldsDispose && fieldsDispose();

      if (isPrimitive(dataWithRawFields)) {
        callback(dataWithRawFields);
        return;
      }

      fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback);
    });

    return function () {
      fieldsDispose && fieldsDispose();
      globalDispose && globalDispose();
    };
  };
}());

export class BindableTemplate extends TemplateBase {
  _render: any;

  _fields: any;

  _fieldsMap: any;

  _watchMethod: any;

  constructor(render, fields, watchMethod, fieldsMap?) {
    super();
    this._render = render;
    this._fields = fields;
    this._fieldsMap = fieldsMap || {};
    this._watchMethod = watchMethod;
  }

  // @ts-expect-error renderCore differs from baseTemplate
  _renderCore(options) {
    const $container = $(options.container);

    const dispose = watchChanges(options.model, this._watchMethod, this._fields, this._fieldsMap, (data) => {
      $container.empty();
      this._render($container, data, options.model);
    });
    eventsEngine.on($container, removeEvent, dispose);

    return $container.contents();
  }
}
