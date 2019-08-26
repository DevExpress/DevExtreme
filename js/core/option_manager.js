import coreDataUtils from "./utils/data";
import typeUtils from "./utils/type";
import domAdapter from "./dom_adapter";

export class OptionManager {
    constructor(
        getOptionsByReference,
        deprecatedOptions,
        notifyOptionChanged,
        logWarningIfDeprecated,
        optionChanging) {
        this._getOptionsByReference = getOptionsByReference;
        this._deprecatedOptions = deprecatedOptions;
        this._notifyOptionChanged = notifyOptionChanged;
        this._logWarningIfDeprecated = logWarningIfDeprecated;
        this._optionChanging = optionChanging;
        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    _valuesEqual(name, oldValue, newValue) {
        oldValue = coreDataUtils.toComparable(oldValue, true);
        newValue = coreDataUtils.toComparable(newValue, true);

        if(oldValue && newValue && typeUtils.isRenderer(oldValue) && typeUtils.isRenderer(newValue)) {
            return newValue.is(oldValue);
        }

        var oldValueIsNaN = oldValue !== oldValue,
            newValueIsNaN = newValue !== newValue;
        if(oldValueIsNaN && newValueIsNaN) {
            return true;
        }

        if(oldValue === 0 && newValue === 0) {
            return (1 / oldValue) === (1 / newValue);
        }

        if(oldValue === null || typeof oldValue !== "object" || domAdapter.isElementNode(oldValue)) {
            return oldValue === newValue;
        }

        return false;
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = this._getParentName(name);
        const fieldName = this._getFieldName(name);
        const fieldObject = previousFieldName ? this.getValue(options, previousFieldName, false) : options;

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
            fieldObject = fullName ? this.getValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setValue(name, value, widgetOptions, merge) {
        if(!this.cachedSetters[name]) {
            this.cachedSetters[name] = coreDataUtils.compileSetter(name);
        }

        const path = name.split(/[.[]/);
        merge = typeUtils.isDefined(merge) ? merge : !this._getOptionsByReference()[name];

        this.cachedSetters[name](widgetOptions, value, {
            functionsAsIs: true,
            merge,
            unwrapObservables: path.length > 1 && !!this._getOptionsByReference()[path[0]]
        });
    }

    _setNormalizeValue(name, value, widgetOptions, merge) {
        const previousValue = this.getValue(widgetOptions, name, false);

        if(this._valuesEqual(name, previousValue, value)) {
            return;
        }

        this._optionChanging(name, previousValue, value);

        this._setValue(name, value, widgetOptions, merge);
        this._notifyOptionChanged(name, value, previousValue);
    }

    _normalizePrimitiveValue(options, name, value) {
        if(name) {
            const alias = this.normalizeName(name);

            if(alias && alias !== name) {
                this._setField(options, alias, value);
                this._clearField(options, name);
            }
        }
    }

    getValue(options, name, unwrapObservables) {
        let getter = this.cachedGetters[name];
        if(!getter) {
            getter = this.cachedGetters[name] = coreDataUtils.compileGetter(name);
        }

        return getter(options, { functionsAsIs: true, unwrapObservables });
    }

    setValue(options, value, widgetOptions) {
        let name = options;
        if(typeof name === "string") {
            options = {};
            options[name] = value;
        }
        let optionName;
        for(optionName in options) {
            this.normalizeValue(options, optionName, options[optionName]);
        }
        for(optionName in options) {
            this._setNormalizeValue(optionName, options[optionName], widgetOptions);
        }
    }

    normalizeValue(options, name, value) {
        if(typeUtils.isPlainObject(value)) {
            for(const valueName in value) {
                this.normalizeValue(options, name + "." + valueName, value[valueName]);
            }
        }

        this._normalizePrimitiveValue(options, name, value);
    }

    normalizeName(name) {
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
}
