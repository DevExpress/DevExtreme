import createCallBack from './utils/callbacks';
import devices from './devices';
import { clone } from './utils/object';
import { compileGetter, compileSetter } from './utils/data';
import { equals } from './utils/comparator';
import { equalByValue, findBestMatches } from './utils/common';
import { extend } from './utils/extend';
import { isDefined, isEmptyObject, isFunction, isObject, isPlainObject, type } from './utils/type';

const deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;
const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));
const normalizeOptions = (options, value) => typeof options !== 'string' ? options : { [options]: value };

export class OptionManager {
    constructor(options, optionRules, optionsByReference, deprecatedOptions) {
        this._options = options;
        this._defaultOptions = clone(options);
        this._optionsByReference = optionsByReference;
        this._deprecatedOptions = deprecatedOptions;
        this._changingCallbacks = createCallBack({ syncStrategy: true });
        this._changedCallbacks = createCallBack({ syncStrategy: true });
        this._deprecatedCallbacks = createCallBack({ syncStrategy: true });
        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {};

        this._rulesAppliedOptions = null;
        this._optionRules = optionRules;
    }

    static convertRulesToOptions(rules) {
        const opts = {};
        const currentDevice = devices.current();

        rules.forEach(({ device, options }) => {
            const deviceFilter = device || {};
            const match = isFunction(deviceFilter) ? deviceFilter(currentDevice) : deviceMatch(currentDevice, deviceFilter);

            if(match) {
                extend(opts, options);
            }
        });

        return opts;
    }

    _notifyDeprecated(option) {
        const info = this._deprecatedOptions[option];

        if(info) {
            this._deprecatedCallbacks.fire(option, info);
        }
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = getParentName(name);
        const fieldObject = previousFieldName ? this._getValue(options, previousFieldName, false) : options;

        if(fieldObject) {
            delete fieldObject[getFieldName(name)];
        }
    }

    _setField(options, fullName, value) {
        let fieldName = '';
        let fieldObject = null;

        do {
            if(fieldName) {
                fieldName = '.' + fieldName;
            }

            fieldName = getFieldName(fullName) + fieldName;
            fullName = getParentName(fullName);
            fieldObject = fullName ? this._getValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this._getValue(this._options, name, false);

        if(!equals(previousValue, value)) {
            const path = name.split(/[.[]/);
            const unwrapObservables = path.length > 1 && !!this._optionsByReference[path[0]];

            this._changingCallbacks.fire(name, previousValue, value);

            if(!this.cachedSetters[name]) {
                this.cachedSetters[name] = compileSetter(name);
            }

            merge = isDefined(merge) ? merge : !this._optionsByReference[name];

            this.cachedSetters[name](this._options, value, {
                functionsAsIs: true,
                merge,
                unwrapObservables
            });

            this._changedCallbacks.fire(name, value, previousValue);
        }
    }

    _setRelevantNames(options, name, value) {
        if(name) {
            const normalizedName = this._normalizeName(name);

            if(normalizedName && normalizedName !== name) {
                this._setField(options, normalizedName, value);
                this._clearField(options, name);
            }
        }
    }

    _normalizeName(name) {
        if(!name) {
            return;
        }

        if(!this._cachedDeprecateNames.length) {
            for(const optionName in this._deprecatedOptions) {
                this._cachedDeprecateNames.push(optionName);
            }
        }

        for(let cachedName of this._cachedDeprecateNames) {
            if(cachedName === name) {
                const deprecate = this._deprecatedOptions[name];

                if(deprecate) {
                    this._notifyDeprecated(name);
                    name = deprecate.alias || name;
                }

                break;
            }
        }

        return name;
    }

    _prepareRelevantNames(options, name, value) {
        if(isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
            }
        }

        this._setRelevantNames(options, name, value);
    }

    _getValue(options, name, unwrapObservables) {
        this.cachedGetters[name] = this.cachedGetters[name] || compileGetter(name);

        return this.cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    onChanging(callBack) {
        this._changingCallbacks.add(callBack);
    }

    onChanged(callBack) {
        this._changedCallbacks.add(callBack);
    }

    onDeprecated(callBack) {
        this._deprecatedCallbacks.add(callBack);
    }

    _setValueByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    _setValue(options, value, merge) {
        options = normalizeOptions(options, value);

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

    setValueSilently(options, value) {
        this._setValueByReference(this._options, normalizeOptions(options, value));
    }

    resetOption(name) {
        if(name) {
            const defaultValue = this.initialOption(name);

            this._setValue(name, defaultValue, false);
        }
    }

    isOptionDeprecated(name) {
        return Object.prototype.hasOwnProperty.call(this._deprecatedOptions, name);
    }

    isInitialOptionValue(name) {
        const value = this.option(name);
        const initialValue = this.initialOption(name);
        const areFunctions = isFunction(value) && isFunction(initialValue);

        return areFunctions ? value.toString() === initialValue.toString() : equalByValue(value, initialValue);
    }

    setOptionsByDevice(rules) {
        const rulesOptions = this._getOptionByRules(rules);

        this.setValueSilently(rulesOptions);
    }

    _getOptionByRules(rules) {
        rules = Array.isArray(rules) ? this._optionRules.concat(rules) : clone(this._optionRules);

        return OptionManager.convertRulesToOptions(rules);
    }

    initialOption(name) {
        if(!this._rulesAppliedOptions) {
            const rulesOptions = this._getOptionByRules(this._options.defaultOptionsRules);

            this._rulesAppliedOptions = this._defaultOptions;
            this._setValueByReference(this._rulesAppliedOptions, rulesOptions);
        }

        const fullPath = name.replace(/\[([^\]])\]/g, '.$1').split('.');
        const value = fullPath.reduce(
            (value, field) => value ? value[field] : this._rulesAppliedOptions[field], null
        );

        return isObject(value) ? clone(value) : value;
    }

    option(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._getValue(this._options, this._normalizeName(options));
        } else {
            this._setValue(options, value);
        }
    }

    dispose() {
        this._changingCallbacks.empty();
        this._changedCallbacks.empty();
        this._deprecatedCallbacks.empty();
    }
}
