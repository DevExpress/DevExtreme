/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Callbacks } from '@ts/core/utils/callbacks';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

type DataCallback = (data: ThemeValue) => void;

interface DataItem {
  callbacks: ReturnType<typeof Callbacks>;
  data?: ThemeValue;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let DataExchanger = class DataExchanger {
  declare _store: Record<string, Record<string, DataItem>>;

  constructor() {
    this._store = {};
  }

  dispose(): this {
    // @ts-expect-error dispose releases the store, the instance is not used afterwards
    this._store = null;
    return this;
  }

  _get(category: string, name: string): DataItem {
    const store = this._store[category] || (this._store[category] = {});
    return store[name] || (store[name] = { callbacks: Callbacks() });
  }

  set(category: string, name: string, data: ThemeValue): this {
    const item = this._get(category, name);
    item.data = data;
    item.callbacks.fire(data);
    return this;
  }

  bind(category: string, name: string, callback: DataCallback): this {
    const item = this._get(category, name);
    item.callbacks.add(callback);
    item.data && callback(item.data);
    return this;
  }

  unbind(category: string, name: string, callback: DataCallback): this {
    const item = this._get(category, name);
    item.callbacks.remove(callback);
    return this;
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_DataExchanger(value: typeof DataExchanger): void {
  DataExchanger = value;
}
/// #ENDDEBUG
