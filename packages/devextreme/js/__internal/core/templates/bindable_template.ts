import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isPrimitive } from '@js/core/utils/type';
import type { TemplateRenderOptions } from '@ts/core/templates/template_base';
import { TemplateBase } from '@ts/core/templates/template_base';

type WatchDispose = () => void;

type WatchCallback = (value: unknown) => void;

type WatchMethod = (fn: () => unknown, callback: WatchCallback) => WatchDispose;

const watchChanges = (function () {
  const globalWatch = (
    data: unknown,
    watchMethod: WatchMethod,
    callback: WatchCallback,
  ): WatchDispose => watchMethod(() => data, callback);

  const fieldsWatch = function (
    data: unknown,
    watchMethod: WatchMethod,
    fields: string[],
    fieldsMap: Record<string, unknown>,
    callback: WatchCallback,
  ): WatchDispose {
    const resolvedData: Record<string, unknown> = {};
    const missedFields = fields.slice();

    const watchHandlers = fields.map((name) => {
      const fieldGetter = fieldsMap[name];

      return watchMethod(
        // @ts-expect-error fieldGetter is not callable and data is of type unknown
        fieldGetter ? (): unknown => fieldGetter(data) : (): unknown => data[name],
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

    return function (): void {
      watchHandlers.forEach((dispose) => dispose());
    };
  };

  return function (
    rawData: unknown,
    watchMethod: WatchMethod,
    fields: string[],
    fieldsMap: Record<string, unknown>,
    callback: WatchCallback,
  ): WatchDispose {
    let fieldsDispose: WatchDispose | null = null;

    const globalDispose = globalWatch(rawData, watchMethod, (dataWithRawFields) => {
      if (fieldsDispose) {
        fieldsDispose();
      }

      if (isPrimitive(dataWithRawFields)) {
        callback(dataWithRawFields);
        return;
      }

      fieldsDispose = fieldsWatch(dataWithRawFields, watchMethod, fields, fieldsMap, callback);
    });

    return function (): void {
      if (fieldsDispose) {
        fieldsDispose();
      }
      if (globalDispose) {
        globalDispose();
      }
    };
  };
}());

export class BindableTemplate extends TemplateBase {
  _render: Function;

  _fields: string[];

  _fieldsMap: Record<string, unknown>;

  _watchMethod: WatchMethod;

  constructor(
    render: Function,
    fields: string[],
    watchMethod: unknown,
    fieldsMap?: Record<string, unknown>,
  ) {
    super();
    this._render = render;
    this._fields = fields;
    this._fieldsMap = fieldsMap || {};
    // @ts-expect-error unknown watchMethod is not assignable to WatchMethod
    this._watchMethod = watchMethod;
  }

  _renderCore(options: TemplateRenderOptions): dxElementWrapper {
    const $container = $(options.container);

    const dispose = watchChanges(
      options.model,
      this._watchMethod,
      this._fields,
      this._fieldsMap,
      (data) => {
        $container.empty();
        this._render($container, data, options.model);
      },
    );
    eventsEngine.on($container, removeEvent, dispose);

    return $container.contents();
  }
}
