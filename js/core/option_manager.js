import coreDataUtils from './utils/data';
import { equals } from './utils/comparator';
import typeUtils from './utils/type';
import { noop } from './utils/common';
import { extend } from './utils/extend';

let cachedDeprecateNames = [];
let cachedGetters = {};
let cachedSetters = {};

export class OptionManager {
    constructor(options, optionsByReference, deprecatedOptions) {
        this._options = options;
        this._optionsByReference = optionsByReference;
        this._deprecatedOptions = deprecatedOptions;
        this._changingCallback;
        this._changedCallback;
        this._deprecatedCallback;
    }

    _notifyDeprecated(option) {
        const info = this._deprecatedOptions[option];
        if(info) {
            this._deprecatedCallback(option, info);
        }
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = this._getParentName(name);
        const fieldObject = previousFieldName ? this._getValue(options, previousFieldName, false) : options;

        if(fieldObject) {
            delete fieldObject[this._getFieldName(name)];
        }
    }

    _getParentName(fullName) {
        return fullName.substr(0, fullName.lastIndexOf('.'));
    }

    _getFieldName(fullName) {
        return fullName.substr(fullName.lastIndexOf('.') + 1);
    }

    _setField(options, fullName, value) {
        let fieldName = '';
        let fieldObject;

        do {
            if(fieldName) {
                fieldName = '.' + fieldName;
            }

            fieldName = this._getFieldName(fullName) + fieldName;
            fullName = this._getParentName(fullName);
            fieldObject = fullName ? this._getValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setValue(name, value, merge) {
        if(!cachedSetters[name]) {
            cachedSetters[name] = coreDataUtils.compileSetter(name);
        }

        const path = name.split(/[.[]/);
        merge = typeUtils.isDefined(merge) ? merge : !this._optionsByReference[name];

        cachedSetters[name](this._options, value, {
            functionsAsIs: true,
            merge,
            unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
        });
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this._getValue(this._options, name, false);

        if(equals(previousValue, value)) {
            return;
        }

        this._changingCallback(name, previousValue, value);

        this._setValue(name, value, merge);
        this._changedCallback(name, value, previousValue);
    }

    _setRelevantNames(options, name, value) {
        if(!name) return;
        const normalizedName = this._normalizeName(name);

        if(normalizedName && normalizedName !== name) {
            this._setField(options, normalizedName, value);
            this._clearField(options, name);
        }
    }

    _normalizeName(name) {
        if(!name) return;
        let deprecate;
        if(!cachedDeprecateNames.length) {
            for(const optionName in this._deprecatedOptions) {
                cachedDeprecateNames.push(optionName);
            }
        }
        for(let i = 0; i < cachedDeprecateNames.length; i++) {
            if(cachedDeprecateNames[i] === name) {
                deprecate = this._deprecatedOptions[name];
                break;
            }
        }
        if(deprecate) {
            this._notifyDeprecated(name);

            if(deprecate.alias) {
                name = deprecate.alias;
            }
        }

        return name;
    }

    _prepareRelevantNames(options, name, value) {
        if(typeUtils.isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, name + '.' + valueName, value[valueName]);
            }
        }

        this._setRelevantNames(options, name, value);
    }

    _getValue(options, name, unwrapObservables) {
        let getter = cachedGetters[name];
        if(!getter) {
            getter = cachedGetters[name] = coreDataUtils.compileGetter(name);
        }

        return getter(options, { functionsAsIs: true, unwrapObservables });
    }

    onChanging(callBack) {
        this._changingCallback = callBack;
    }

    onChanged(callBack) {
        this._changedCallback = callBack;
    }

    onDeprecated(callBack) {
        this._deprecatedCallback = callBack;
    }

    setValueByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    getValue(name) {
        return this._getValue(this._options, this._normalizeName(name));
    }

    setValue(options, merge) {
        for(const optionName in options) {
            this._prepareRelevantNames(options, optionName, options[optionName]);
        }
        for(const optionName in options) {
            this._setPreparedValue(optionName, options[optionName], merge);
        }
    }

    getValueSilently(name) {
        return this._options[name];
    }

    setValueSilently(options) {
        this.setValueByReference(this._options, options);
    }

    dispose() {
        this._changingCallback = noop;
        this._changedCallback = noop;
        this._deprecatedCallback = noop;
    }
}
