import { isFunction, isObject, type } from '../utils/type';
import { equalByValue, noop } from '../utils/common';
import { OptionManager } from './option_manager';
import { clone } from '../utils/object';
import { getFieldName, getParentName, convertRulesToOptions } from './utils';
import { extend } from '../utils/extend';

export class Options {
    constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
        this._deprecatedCallback;

        this._default = defaultOptions;
        this._deprecated = deprecatedOptions;

        this._deprecatedNames = [];
        this._initDeprecatedNames();

        this._optionManager = new OptionManager(
            options,
            optionsByReference
        );
        this._optionManager.onRelevantNamesPrepared((options, name, value, silent) => this._setRelevantNames(options, name, value, silent));
        this._cachedOptions = {};

        this._rules = [];
    }

    set _initial(value) {
        this._initialOptions = value;
    }

    get _initial() {
        if(!this._initialOptions) {
            const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));

            this._initialOptions = this._default;
            this._optionManager._setByReference(this._initialOptions, rulesOptions);
        }

        return this._initialOptions;
    }

    _initDeprecatedNames() {
        for(const optionName in this._deprecated) {
            this._deprecatedNames.push(optionName);
        }
    }

    _getByRules(rules) {
        rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;

        return convertRulesToOptions(rules);
    }

    _notifyDeprecated(option) {
        const info = this._deprecated[option];

        if(info) {
            this._deprecatedCallback(option, info);
        }
    }

    _setRelevantNames(options, name, value, silent) {
        if(name) {
            const normalizedName = this._normalizeName(name, silent);

            if(normalizedName && normalizedName !== name) {
                this._setField(options, normalizedName, value);
                this._clearField(options, name);
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
            fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options;
        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = getParentName(name);
        const fieldObject = previousFieldName ?
            this._optionManager.get(options, previousFieldName, false) :
            options;

        if(fieldObject) {
            delete fieldObject[getFieldName(name)];
        }
    }

    _normalizeName(name, silent) {
        if(name && !silent) {
            for(let i = 0; i < this._deprecatedNames.length; i++) {
                if(this._deprecatedNames[i] === name) {
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

    addRules(rules) {
        this._rules = rules.concat(this._rules);
    }

    applyRules(rules) {
        const options = this._getByRules(rules);

        this.silent(options);
    }

    dispose() {
        this._deprecatedCallback = noop;
        this._optionManager.dispose();
    }

    onChanging(callBack) {
        this._optionManager.onChanging(callBack);
    }

    onChanged(callBack) {
        this._optionManager.onChanged(callBack);
    }

    onDeprecated(callBack) {
        this._deprecatedCallback = callBack;
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
        return this._initial[name];
    }

    option(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager.get(undefined, this._normalizeName(options));
        } else {
            this._optionManager.set(options, value);
        }
    }

    silent(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager.get(undefined, options, undefined, true);
        } else {
            this._optionManager.set(options, value, undefined, true);
        }
    }

    reset(name) {
        if(name) {
            const fullPath = name.replace(/\[([^\]])\]/g, '.$1').split('.');
            const value = fullPath.reduce(
                (value, field) => value ? value[field] : this.initial(field), null
            );

            const defaultValue = isObject(value) ? clone(value) : value;

            this._optionManager.set(name, defaultValue, false);
        }
    }

    getAliasesByName(name) {
        return Object.keys(this._deprecated).filter(
            aliasName => name === this._deprecated[aliasName].alias
        );
    }

    isDeprecated(name) {
        return Object.prototype.hasOwnProperty.call(this._deprecated, name);
    }

    cache(name, options) {
        const isGetter = arguments.length < 2;

        if(isGetter) {
            return this._cachedOptions[name];
        } else {
            this._cachedOptions[name] = extend(this._cachedOptions[name], options);
        }
    }
}
