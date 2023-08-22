import {
  Injectable,
} from '@angular/core';

import { equalByValue } from 'devextreme/core/utils/common';

@Injectable()
export class WatcherHelper {
  private readonly _watchers: any[] = [];

  getWatchMethod() {
    const watchMethod = (valueGetter, valueChangeCallback, options) => {
      let oldValue = valueGetter();
      options = options || {};

      if (!options.skipImmediate) {
        valueChangeCallback(oldValue);
      }

      const watcher = () => {
        const newValue = valueGetter();

        if (this._isDifferentValues(oldValue, newValue, options.deep)) {
          valueChangeCallback(newValue);
          oldValue = newValue;
        }
      };

      this._watchers.push(watcher);

      return () => {
        const index = this._watchers.indexOf(watcher);

        if (index !== -1) {
          this._watchers.splice(index, 1);
        }
      };
    };

    return watchMethod;
  }

  private _isDifferentValues(oldValue: any, newValue: any, deepCheck: boolean) {
    const comparableNewValue = this._toComparable(newValue);
    const comparableOldValue = this._toComparable(oldValue);
    const isObjectValues = comparableNewValue instanceof Object && comparableOldValue instanceof Object;

    if (deepCheck && isObjectValues) {
      return this._checkObjectsFields(newValue, oldValue);
    }
    return comparableNewValue !== comparableOldValue;
  }

  private _toComparable(value) {
    if (value instanceof Date) {
      return value.getTime();
    }

    return value;
  }

  private _checkObjectsFields(checkingFromObject: Object, checkingToObject: Object) {
    for (const field in checkingFromObject) {
      const oldValue = this._toComparable(checkingFromObject[field]);
      const newValue = this._toComparable(checkingToObject[field]);
      let isEqualObjects = false;

      if (typeof oldValue === 'object' && typeof newValue === 'object') {
        isEqualObjects = equalByValue(oldValue, newValue);
      }
      if (oldValue !== newValue && !isEqualObjects) {
        return true;
      }
    }
  }

  checkWatchers() {
    for (const watcher of this._watchers) {
      watcher();
    }
  }
}
