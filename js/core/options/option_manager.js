import createCallBack from '../utils/callbacks';
import { compileGetter, compileSetter } from '../utils/data';
import { equals } from '../utils/comparator';
import { extend } from '../utils/extend';
import { isDefined, isPlainObject } from '../utils/type';
import { normalizeOptions } from './utils';

export class OptionManager {
    constructor(options, optionsByReference) {
        this._options = options;
        this._optionsByReference = optionsByReference;

        this._changingCallbacks = createCallBack({ syncStrategy: true });
        this._changedCallbacks = createCallBack({ syncStrategy: true });
        this._namePreparedCallbacks = createCallBack({ syncStrategy: true });

        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    _setByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this.get(this._options, name, false);

        if(!equals(previousValue, value)) {
            const path = name.split(/[.[]/);

            this._changingCallbacks.fire(name, previousValue, value);
            this.cachedSetters[name] = this.cachedSetters[name] || compileSetter(name);
            this.cachedSetters[name](this._options, value, {
                functionsAsIs: true,
                merge: isDefined(merge) ? merge : !this._optionsByReference[name],
                unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
            });
            this._changedCallbacks.fire(name, value, previousValue);
        }
    }

    _prepareRelevantNames(options, name, value) {
        if(isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
            }
        }

        this._namePreparedCallbacks.fire(options, name, value);
    }

    get(options = this._options, name, unwrapObservables, silent) {
        if(silent) {
            return this._options[name];
        }

        this.cachedGetters[name] = this.cachedGetters[name] || compileGetter(name);

        return this.cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    set(options, value, merge, silent) {
        options = normalizeOptions(options, value);

        if(silent) {
            this._setByReference(this._options, options);
        } else {
            for(const name in options) {
                this._prepareRelevantNames(options, name, options[name]);
            }

            for(const name in options) {
                this._setPreparedValue(name, options[name], merge);
            }
        }
    }

    onRelevantNamesPrepared(callback) {
        this._namePreparedCallbacks.add(callback);
    }

    onChanging(callBack) {
        this._changingCallbacks.add(callBack);
    }

    onChanged(callBack) {
        this._changedCallbacks.add(callBack);
    }

    dispose() {
        this._changingCallbacks.empty();
        this._changedCallbacks.empty();
    }
}
