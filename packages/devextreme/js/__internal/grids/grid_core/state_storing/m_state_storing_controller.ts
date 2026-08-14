import eventsEngine from '@js/common/core/events/core/events_engine';
import type { StateStoring } from '@js/common/grids';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { sessionStorage } from '@js/core/utils/storage';
import { isDefined, isEmptyObject, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type { ExportController } from '@ts/grids/data_grid/export/m_export';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import modules from '@ts/grids/grid_core/m_modules';
import type { OptionChanged } from '@ts/grids/grid_core/m_types';

import type { PersistentState } from './types';

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const parseDates = (state): void => {
  if (!state) {
    return;
  }

  each(state, (key, value) => {
    if (isPlainObject(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      const dateParts = DATE_REGEX.exec(value);
      if (dateParts) {
        const [, year, month, day, hours, minutes, seconds] = dateParts;
        state[key] = new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes, +seconds));
      }
    }
  });
};

const getStorage = (options: StateStoring): Storage | undefined => {
  const storage = options.type === 'sessionStorage'
    ? sessionStorage()
    : getWindow().localStorage;

  if (!storage) {
    throw new Error('E1007');
  }

  return storage;
};

const getUniqueStorageKey = (
  options: { storageKey?: string },
): string => (isDefined(options.storageKey) ? options.storageKey : 'storage');

export class StateStoringController<
  TState extends object = PersistentState,
> extends modules.ViewController {
  protected _state!: TState;

  private _isLoaded!: boolean;

  private _isLoading!: boolean;

  private _windowUnloadHandler!: () => void;

  private _savingTimeoutID?: ReturnType<typeof setTimeout>;

  // TODO getController
  // NOTE: sometimes fields empty in the runtime, getter here is a temporary solution
  protected getDataController(): DataController {
    return this.getController('data');
  }

  protected getExportController(): ExportController {
    return this.getController('export');
  }

  protected getColumnsController(): ColumnsController {
    return this.getController('columns');
  }

  public init(): this {
    this._state = {} as TState;
    this._isLoaded = false;
    this._isLoading = false;

    this._windowUnloadHandler = (): void => {
      if (this._savingTimeoutID !== undefined) {
        this._saveState(this.state());
      }
    };

    eventsEngine.on(getWindow(), 'visibilitychange', this._windowUnloadHandler);

    return this; // needed by pivotGrid mocks
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'stateStoring':
        if (this.isEnabled() && !this.isLoading()) {
          this.load();
        }

        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public dispose(): void {
    clearTimeout(this._savingTimeoutID);
    eventsEngine.off(getWindow(), 'visibilitychange', this._windowUnloadHandler);
  }

  private _loadState(): TState | PromiseLike<TState> | undefined {
    const options = this.option('stateStoring');

    if (!options) {
      return undefined;
    }

    if (options.type === 'custom' && options.customLoad) {
      return options.customLoad();
    }

    try {
      const storedState = getStorage(options)?.getItem(getUniqueStorageKey(options));

      return storedState ? JSON.parse(storedState) as TState : undefined;
    } catch (e: unknown) {
      errors.log('W1022', 'State storing', (e as Error).message);

      return undefined;
    }
  }

  private _saveState(state: TState): void {
    const options = this.option('stateStoring');

    if (!options) {
      return;
    }

    if (options.type === 'custom') {
      options.customSave?.(state);
      return;
    }

    try {
      getStorage(options)?.setItem(getUniqueStorageKey(options), JSON.stringify(state));
    } catch (e: unknown) {
      errors.log((e as Error).message);
    }
  }

  public publicMethods(): string[] {
    return ['state'];
  }

  public isEnabled(): boolean {
    return !!this.option('stateStoring.enabled');
  }

  public isLoaded(): boolean {
    return this._isLoaded;
  }

  public isLoading(): boolean {
    return this._isLoading;
  }

  public load(): DeferredObj<TState | undefined> {
    this._isLoading = true;
    const loadResult: DeferredObj<TState | undefined> = fromPromise(this._loadState());

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

  protected state(): TState;
  protected state(state: TState | undefined): void;
  protected state(...args: [state?: TState]): TState | void {
    if (!args.length) {
      return extend(true, {}, this._state) as TState;
    }

    this._state = extend({}, args[0]) as TState;
    parseDates(this._state);

    return undefined;
  }

  protected save(): void {
    clearTimeout(this._savingTimeoutID);

    // eslint-disable-next-line no-restricted-globals
    this._savingTimeoutID = setTimeout(() => {
      this._saveState(this.state());
      this._savingTimeoutID = undefined;
    }, this.option('stateStoring.savingTimeout'));
  }
}

export default { StateStoringController };
