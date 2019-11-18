import createCallBack from './utils/callbacks';
import { clone } from './utils/object';
import { compileGetter, compileSetter } from './utils/data';
import { equals } from './utils/comparator';
import { equalByValue } from './utils/common';
import { extend } from './utils/extend';
import { isDefined, isFunction, isObject, isPlainObject, type } from './utils/type';
import { Options } from './options';

const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));
const normalizeOptions = (options, value) => typeof options !== 'string' ? options : { [options]: value };

export class OptionManager {
    constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
        this._options = new Options(options);
        this._default = defaultOptions;
        this._optionsByReference = optionsByReference;
        this._deprecated = deprecatedOptions;

        this._changingCallbacks = createCallBack({ syncStrategy: true });
        this._changedCallbacks = createCallBack({ syncStrategy: true });
        this._deprecatedCallbacks = createCallBack({ syncStrategy: true });

        this._cachedDeprecateNames = [];
        this.cachedGetters = {};
        this.cachedSetters = {};

        this._rules = [];
    }

    get _options() {
        return this._internalOptions.get();
    }

    set _options(value) {
        this._internalOptions = value;
    }

    get _deprecateNames() {
        if(!this._cachedDeprecateNames.length) {
            for(const optionName in this._deprecated) {
                this._cachedDeprecateNames.push(optionName);
            }
        }

        return this._cachedDeprecateNames;
    }

    get _initial() {
        if(!this._initialOptions) {
            const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));

            this._initialOptions = this._default;
            this._setByReference(this._initialOptions, rulesOptions);
        }

        return this._initialOptions;
    }

    set _initial(value) {
        this._initialOptions = value;
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = getParentName(name);
        const fieldObject = previousFieldName ?
            this._get(options, previousFieldName, false) :
            options;

        if(fieldObject) {
            delete fieldObject[getFieldName(name)];
        }
    }

    _get(options, name, unwrapObservables, silent) {
        if(silent) {
            return this._options[name];
        }

        this.cachedGetters[name] = this.cachedGetters[name] || compileGetter(name);

        return this.cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    _getByRules(rules) {
        rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;

        return Options.convertRulesToOptions(rules);
    }

    _normalizeName(name) {
        if(name) {
            for(let i = 0; i < this._deprecateNames.length; i++) {
                if(this._deprecateNames[i] === name) {
                    const deprecate = this._deprecated[name];

                    if(deprecate) {
                        this._notifyDeprecated(name);

                        return deprecate.alias || name;
                    }
                }
            }
        }

        return name;
    }

    _notifyDeprecated(option) {
        const info = this._deprecated[option];

        if(info) {
            this._deprecatedCallbacks.fire(option, info);
        }
    }

    _set(options, value, merge, silent) {
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

    _setByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    _setField(options, fullName, value) {
        let fieldName = '';
        let fieldObject = null;

        do {
            fieldName = fieldName ? `.${fieldName}` : '';
            fieldName = getFieldName(fullName) + fieldName;
            fullName = getParentName(fullName);
            fieldObject = fullName ? this._get(options, fullName, false) : options;
        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this._get(this._options, name, false);

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

    _setRelevantNames(options, name, value) {
        if(name) {
            const normalizedName = this._normalizeName(name);

            if(normalizedName && normalizedName !== name) {
                this._setField(options, normalizedName, value);
                this._clearField(options, name);
            }
        }
    }

    _prepareRelevantNames(options, name, value) {
        if(isPlainObject(value)) {
            for(const valueName in value) {
                this._prepareRelevantNames(options, `${name}.${valueName}`, value[valueName]);
            }
        }

        this._setRelevantNames(options, name, value);
    }

    addRules(rules) {
        this._rules = rules.concat(this._rules);
    }

    applyRules(rules) {
        const options = this._getByRules(rules);

        this.silent(options);
    }

    dispose() {
        this._changingCallbacks.empty();
        this._changedCallbacks.empty();
        this._deprecatedCallbacks.empty();
    }

    getAliasesByName(name) {
        return Object.keys(this._deprecated).filter(
            aliasName => name === this._deprecated[aliasName].alias
        );
    }

    isDeprecated(name) {
        return Object.prototype.hasOwnProperty.call(this._deprecated, name);
    }

    isInitial(name) {
        const value = this.option(name);
        const initialValue = this.initial(name);
        const areFunctions = isFunction(value) && isFunction(initialValue);

        return areFunctions ?
            value.toString() === initialValue.toString() :
            equalByValue(value, initialValue);
    }

    initial(name) {
        const fullPath = name.replace(/\[([^\]])\]/g, '.$1').split('.');
        const value = fullPath.reduce(
            (value, field) => value ? value[field] : this._initial[field], null
        );

        return isObject(value) ? clone(value) : value;
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

    option(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._get(this._options, this._normalizeName(options));
        } else {
            this._set(options, value);
        }
    }

    reset(name) {
        if(name) {
            const defaultValue = this.initial(name);

            this._set(name, defaultValue, false);
        }
    }

    silent(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._get(this._options, options, true);
        } else {
            this._set(options, value, undefined, true);
        }
    }
}
