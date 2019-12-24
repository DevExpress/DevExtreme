import { compileGetter, compileSetter } from '../utils/data';
import { noop } from '../utils/common';
import { equals } from '../utils/comparator';
import { extend } from '../utils/extend';
import { isDefined, isPlainObject } from '../utils/type';
import { normalizeOptions } from './utils';

let cachedGetters = {};
let cachedSetters = {};

export class OptionManager {
    constructor(options, optionsByReference) {
        this._options = options;
        this._optionsByReference = optionsByReference;

        this._changingCallback;
        this._changedCallback;
        this._namePreparedCallbacks;
    }

    _setByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    _setPreparedValue(name, value, merge, silent) {
        const previousValue = this.get(this._options, name, false);

        if(!equals(previousValue, value)) {
            const path = name.split(/[.[]/);

            !silent && this._changingCallback(name, previousValue, value);
            cachedSetters[name] = cachedSetters[name] || compileSetter(name);
            cachedSetters[name](this._options, value, {
                functionsAsIs: true,
                merge: isDefined(merge) ? merge : !this._optionsByReference[name],
                unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
            });
            !silent && this._changedCallback(name, value, previousValue);
        }
    }

    _prepareRelevantNames(options, name, value, silent) {
        if(isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
            }
        }

        this._namePreparedCallbacks(options, name, value, silent);
    }

    get(options = this._options, name, unwrapObservables) {
        cachedGetters[name] = cachedGetters[name] || compileGetter(name);

        return cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    set(options, value, merge, silent) {
        options = normalizeOptions(options, value);

        for(const name in options) {
            this._prepareRelevantNames(options, name, options[name], silent);
        }

        for(const name in options) {
            this._setPreparedValue(name, options[name], merge, silent);
        }
    }

    onRelevantNamesPrepared(callBack) {
        this._namePreparedCallbacks = callBack;
    }

    onChanging(callBack) {
        this._changingCallback = callBack;
    }

    onChanged(callBack) {
        this._changedCallback = callBack;
    }

    dispose() {
        this._changingCallback = noop;
        this._changedCallback = noop;
    }
}
