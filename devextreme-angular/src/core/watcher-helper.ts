import {
    Injectable
} from '@angular/core';

import * as commonUtils from 'devextreme/core/utils/common';

@Injectable()
export class WatcherHelper {
    private _watchers: any[] = [];

    getWatchMethod() {
        let watchMethod = (valueGetter, valueChangeCallback, options) => {
            let oldValue = valueGetter();
            options = options || {};

            if (!options.skipImmediate) {
                valueChangeCallback(oldValue);
            }

            let watcher = () => {
                let newValue = valueGetter();

                if (this._isDifferentValues(oldValue, newValue, options.deep)) {
                    valueChangeCallback(newValue);
                    oldValue = newValue;
                }
            };

            this._watchers.push(watcher);

            return () => {
                let index = this._watchers.indexOf(watcher);

                if (index !== -1) {
                    this._watchers.splice(index, 1);
                }
            };
        };

        return watchMethod;
    }

    private _isDifferentValues(oldValue: any, newValue: any, deepCheck: boolean) {
        let comparableNewValue = this._toComparable(newValue);
        let comparableOldValue = this._toComparable(oldValue);
        let isObjectValues = comparableNewValue instanceof Object && comparableOldValue instanceof Object;

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
        for (let field in checkingFromObject) {
            let oldValue = this._toComparable(checkingFromObject[field]);
            let newValue = this._toComparable(checkingToObject[field]);
            let isEqualObjects = false;

            if (typeof oldValue === 'object' && typeof newValue === 'object') {
                isEqualObjects = commonUtils.equalByValue(oldValue, newValue);
            }
            if (oldValue !== newValue && !isEqualObjects) {
                return true;
            }
        }
    }

    checkWatchers() {
       for (let watcher of this._watchers) {
            watcher();
        }
    }
}
