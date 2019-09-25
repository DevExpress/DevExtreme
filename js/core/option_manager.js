import coreDataUtils from "./utils/data";
import typeUtils from "./utils/type";
import compareUtils from "./utils/compare";
import CallBacks from "./utils/callbacks";
import { extend } from "./utils/extend";

export class OptionManager {
    constructor(options, optionsByReference, deprecatedOptions) {
        this._options = options;
        this._optionsByReference = optionsByReference;
        this._deprecatedOptions = deprecatedOptions;
        this._changingCallbacks = CallBacks({ syncStrategy: true });
        this._changedCallbacks = CallBacks({ syncStrategy: true });
        this._logWarningCallbacks = CallBacks({ syncStrategy: true });
        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    _logWarningIfDeprecated(option) {
        const info = this._deprecatedOptions[option];
        if(info) {
            this._logWarningCallbacks.fire(option, info);
        }
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = this._getParentName(name);
        const fieldName = this._getFieldName(name);
        const fieldObject = previousFieldName ? this._getValue(options, previousFieldName, false) : options;

        if(fieldObject) {
            delete fieldObject[fieldName];
        }
    }

    _getParentName(fullName) {
        const splitNames = fullName.split('.');
        splitNames.pop();
        return splitNames.join('.');
    }

    _getFieldName(fullName) {
        const splitNames = fullName.split('.');
        return splitNames[splitNames.length - 1];
    }

    _setField(options, fullName, value) {
        let fieldName = "";
        let fieldObject;

        do {
            if(fieldName) {
                fieldName = "." + fieldName;
            }

            fieldName = this._getFieldName(fullName) + fieldName;
            fullName = this._getParentName(fullName);
            fieldObject = fullName ? this._getValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setValue(name, value, merge) {
        if(!this.cachedSetters[name]) {
            this.cachedSetters[name] = coreDataUtils.compileSetter(name);
        }

        const path = name.split(/[.[]/);
        merge = typeUtils.isDefined(merge) ? merge : !this._optionsByReference[name];

        this.cachedSetters[name](this._options, value, {
            functionsAsIs: true,
            merge,
            unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
        });
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this._getValue(this._options, name, false);

        if(compareUtils.valuesEqual(previousValue, value)) {
            return;
        }

        this._changingCallbacks.fire(name, previousValue, value);

        this._setValue(name, value, merge);
        this._changedCallbacks.fire(name, value, previousValue);
    }

    _setRelevantNames(options, name, value) {
        if(name) {
            const alias = this._normalizeName(name);

            if(alias && alias !== name) {
                this._setField(options, alias, value);
                this._clearField(options, name);
            }
        }
    }

    _normalizeName(name) {
        if(name) {
            let deprecate;
            if(!this._cachedDeprecateNames.length) {
                for(const optionName in this._deprecatedOptions) {
                    this._cachedDeprecateNames.push(optionName);
                }
            }
            for(let i = 0; i < this._cachedDeprecateNames.length; i++) {
                if(this._cachedDeprecateNames[i] === name) {
                    deprecate = this._deprecatedOptions[name];
                    break;
                }
            }
            if(deprecate) {
                this._logWarningIfDeprecated(name);
                const alias = deprecate.alias;

                if(alias) {
                    name = alias;
                }
            }
        }

        return name;
    }

    _prepareRelevantNames(options, name, value) {
        if(typeUtils.isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, name + "." + valueName, value[valueName]);
            }
        }

        this._setRelevantNames(options, name, value);
    }

    _ensureObject(options, value) {
        let name = options;
        if(typeof name === "string") {
            options = {};
            options[name] = value;
        }

        return options;
    }

    _getValue(options, name, unwrapObservables) {
        let getter = this.cachedGetters[name];
        if(!getter) {
            getter = this.cachedGetters[name] = coreDataUtils.compileGetter(name);
        }

        return getter(options, { functionsAsIs: true, unwrapObservables });
    }

    _setSilent(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    onChanging(callBack) {
        this._changingCallbacks.add(callBack);
    }

    onChanged(callBack) {
        this._changedCallbacks.add(callBack);
    }

    onDeprecated(callBack) {
        this._logWarningCallbacks.add(callBack);
    }

    getValue(name) {
        const normalizedName = this._normalizeName(name);
        return this._getValue(this._options, normalizedName);
    }

    setSilent(options, value) {
        options = this._ensureObject(options, value);

        this._setSilent(this._options, options);
    }

    getSilent(name) {
        return this._options[name];
    }

    setValue(options, value) {
        options = this._ensureObject(options, value);
        for(const optionName in options) {
            this._prepareRelevantNames(options, optionName, options[optionName]);
        }
        for(const optionName in options) {
            this._setPreparedValue(optionName, options[optionName]);
        }
    }

    dispose() {
        this._changingCallbacks.empty();
        this._changedCallbacks.empty();
        this._logWarningCallbacks.empty();
    }
}
