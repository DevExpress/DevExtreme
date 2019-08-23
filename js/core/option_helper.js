import coreDataUtils from "./utils/data";
import typeUtils from "./utils/type";
import domAdapter from "./dom_adapter";

export class OptionHelper {
    constructor(
        getOptionsByReference,
        options,
        deprecatedOptions,
        notifyOptionChanged,
        logWarningIfDeprecated,
        optionChanging) {
        this._getOptionsByReference = getOptionsByReference;
        this._options = options;
        this._deprecatedOptions = deprecatedOptions;
        this._notifyOptionChanged = notifyOptionChanged;
        this._logWarningIfDeprecated = logWarningIfDeprecated;
        this._optionChanging = optionChanging;
        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    _optionValuesEqual(name, oldValue, newValue) {
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

    _clearOptionsField(options, name) {
        delete options[name];

        const previousFieldName = this._getParentName(name);
        const fieldName = this._getFieldName(name);
        const fieldObject = previousFieldName ? this.getOptionValue(options, previousFieldName, false) : options;

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

    _setOptionsField(options, fullName, value) {
        let fieldName = "";
        let fieldObject;

        do {
            if(fieldName) {
                fieldName = "." + fieldName;
            }

            fieldName = this._getFieldName(fullName) + fieldName;
            fullName = this._getParentName(fullName);
            fieldObject = fullName ? this.getOptionValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setOptionValue(name, value, merge) {
        if(!this.cachedSetters[name]) {
            this.cachedSetters[name] = coreDataUtils.compileSetter(name);
        }

        const path = name.split(/[.[]/);
        merge = typeUtils.isDefined(merge) ? merge : !this._getOptionsByReference()[name];

        this.cachedSetters[name](this._options, value, {
            functionsAsIs: true,
            merge,
            unwrapObservables: path.length > 1 && !!this._getOptionsByReference()[path[0]]
        });
    }

    _normalizePrimitiveOptionValue(options, name, value) {
        if(name) {
            const alias = this.normalizeOptionName(name);

            if(alias && alias !== name) {
                this._setOptionsField(options, alias, value);
                this._clearOptionsField(options, name);
            }
        }
    }

    getOptionValue(options, name, unwrapObservables) {
        let getter = this.cachedGetters[name];
        if(!getter) {
            getter = this.cachedGetters[name] = coreDataUtils.compileGetter(name);
        }

        return getter(options, { functionsAsIs: true, unwrapObservables });
    }

    setOption(name, value, merge) {
        const previousValue = this.getOptionValue(this._options, name, false);

        if(this._optionValuesEqual(name, previousValue, value)) {
            return;
        }

        this._optionChanging(name, previousValue, value);

        this._setOptionValue(name, value, merge);
        this._notifyOptionChanged(name, value, previousValue);
    }

    normalizeOptionValue(options, name, value) {
        if(typeUtils.isPlainObject(value)) {
            for(const valueName in value) {
                this.normalizeOptionValue(options, name + "." + valueName, value[valueName]);
            }
        }

        this._normalizePrimitiveOptionValue(options, name, value);
    }

    normalizeOptionName(name) {
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
