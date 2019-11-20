import createCallBack from '../utils/callbacks';
import { isFunction, isObject, type } from '../utils/type';
import { equalByValue } from '../utils/common';
import { OptionManager } from './option_manager';
import { clone } from '../utils/object';
import { getFieldName, getParentName, convertRulesToOptions } from './utils';

export class Options {
    constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
        this._deprecatedCallbacks = createCallBack({ syncStrategy: true });

        this._default = defaultOptions;
        this._deprecated = deprecatedOptions;

        this._cachedDeprecateNames = [];

        this._optionManager = new OptionManager(
            options,
            optionsByReference
        );
        this._optionManager.onRelevantNamesPrepared((options, name, value) => this._setRelevantNames(options, name, value));

        this._rules = [];
    }

    get _options() {
        return this._optionManager._options;
    }

    get _deprecateNames() {
        if(!this._cachedDeprecateNames.length) {
            for(const optionName in this._deprecated) {
                this._cachedDeprecateNames.push(optionName);
            }
        }

        return this._cachedDeprecateNames;
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

    _getByRules(rules) {
        rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;

        return convertRulesToOptions(rules);
    }

    _notifyDeprecated(option) {
        const info = this._deprecated[option];

        if(info) {
            this._deprecatedCallbacks.fire(option, info);
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

    addRules(rules) {
        this._rules = rules.concat(this._rules);
    }

    applyRules(rules) {
        const options = this._getByRules(rules);

        this.silent(options);
    }

    dispose() {
        this._deprecatedCallbacks.empty();
        this._optionManager.dispose();
    }

    onChanging(callBack) {
        this._optionManager.onChanging(callBack);
    }

    onChanged(callBack) {
        this._optionManager.onChanged(callBack);
    }

    onDeprecated(callBack) {
        this._deprecatedCallbacks.add(callBack);
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

    option(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager.get(this._options, this._normalizeName(options));
        } else {
            this._optionManager.set(options, value);
        }
    }

    silent(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager.get(this._options, options, undefined, true);
        } else {
            this._optionManager.set(options, value, undefined, true);
        }
    }

    reset(name) {
        if(name) {
            const defaultValue = this.initial(name);

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
}
