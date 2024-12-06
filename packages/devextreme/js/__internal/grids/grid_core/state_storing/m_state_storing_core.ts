import eventsEngine from '@js/common/core/events/core/events_engine';
// @ts-expect-error
import { fromPromise } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { sessionStorage } from '@js/core/utils/storage';
import { isDefined, isEmptyObject, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';
import type { ExportController } from '@ts/grids/data_grid/export/m_export';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';

import modules from '../m_modules';

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const parseDates = function (state) {
  if (!state) return;
  each(state, (key, value) => {
    if (isPlainObject(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      const date = DATE_REGEX.exec(value);
      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};

const getStorage = function (options) {
  const storage = options.type === 'sessionStorage' ? sessionStorage() : getWindow().localStorage;

  if (!storage) {
    throw new Error('E1007');
  }

  return storage;
};

const getUniqueStorageKey = function (options) {
  return isDefined(options.storageKey) ? options.storageKey : 'storage';
};

export class StateStoringController extends modules.ViewController {
  protected _state: any;

  private _isLoaded: any;

  private _isLoading: any;

  private _windowUnloadHandler: any;

  private _savingTimeoutID: any;

  // TODO getController
  // NOTE: sometimes fields empty in the runtime
  // getter here is a temporary solution
  protected getDataController(): DataController {
    return this.getController('data');
  }

  protected getExportController(): ExportController {
    return this.getController('export');
  }

  protected getColumnsController(): ColumnsController {
    return this.getController('columns');
  }

  public init() {
    this._state = {};
    this._isLoaded = false;
    this._isLoading = false;

    this._windowUnloadHandler = () => {
      if (this._savingTimeoutID !== undefined) {
        this._saveState(this.state());
      }
    };

    eventsEngine.on(getWindow(), 'visibilitychange', this._windowUnloadHandler);

    return this; // needed by pivotGrid mocks
  }

  public optionChanged(args) {
    const that = this;

    switch (args.name) {
      case 'stateStoring':
        if (that.isEnabled() && !that.isLoading()) {
          that.load();
        }

        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public dispose() {
    clearTimeout(this._savingTimeoutID);
    eventsEngine.off(getWindow(), 'visibilitychange', this._windowUnloadHandler);
  }

  private _loadState() {
    const options = this.option('stateStoring')!;

    if (options.type === 'custom') {
      return options.customLoad && options.customLoad();
    }
    try {
      return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
    } catch (e: any) {
      errors.log('W1022', 'State storing', e.message);
    }
  }

  private _saveState(state) {
    const options = this.option('stateStoring')!;

    if (options.type === 'custom') {
      options.customSave && options.customSave(state);
      return;
    }
    try {
      getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
    } catch (e: any) {
      errors.log(e.message);
    }
  }

  public publicMethods() {
    return ['state'];
  }

  public isEnabled() {
    return this.option('stateStoring.enabled');
  }

  public isLoaded() {
    return this._isLoaded;
  }

  public isLoading() {
    return this._isLoading;
  }

  public load() {
    this._isLoading = true;
    const loadResult = fromPromise(this._loadState());
    loadResult.always(() => {
      this._isLoaded = true;
      this._isLoading = false;
    }).done((state) => {
      if (state !== null && !isEmptyObject(state)) {
        this.state(state);
      }
    });
    return loadResult;
  }

  protected state(state?) {
    const that = this;

    if (!arguments.length) {
      return extend(true, {}, that._state);
    }
    that._state = extend({}, state);
    parseDates(that._state);
  }

  protected save() {
    const that = this;

    clearTimeout(that._savingTimeoutID);
    that._savingTimeoutID = setTimeout(() => {
      that._saveState(that.state());
      that._savingTimeoutID = undefined;
    }, that.option('stateStoring.savingTimeout'));
  }
}

export default { StateStoringController };
