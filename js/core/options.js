import createCallBack from './utils/callbacks';
import devices from './devices';
import { isFunction, isEmptyObject, isObject, type } from './utils/type';
import { findBestMatches, equalByValue } from './utils/common';
import { extend } from './utils/extend';
import { OptionManager } from './option_manager';
import { clone } from './utils/object';

const deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;

export class Options {
    constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
        this._changingCallbacks = createCallBack({ syncStrategy: true });
        this._changedCallbacks = createCallBack({ syncStrategy: true });
        this._deprecatedCallbacks = createCallBack({ syncStrategy: true });

        this._default = defaultOptions;
        this._deprecated = deprecatedOptions;

        this._cachedDeprecateNames = [];

        this._optionManager = new OptionManager(
            options,
            optionsByReference,
            this._changingCallbacks,
            this._changedCallbacks,
            this
        );

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

        return Options.convertRulesToOptions(rules);
    }

    _notifyDeprecated(option) {
        const info = this._deprecated[option];

        if(info) {
            this._deprecatedCallbacks.fire(option, info);
        }
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

    onChanging(callBack) {
        this._changingCallbacks.add(callBack);
    }

    onChanged(callBack) {
        this._changedCallbacks.add(callBack);
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
            return this._optionManager.get(this._options, Options.normalizeName(this, options));
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

    static convertRulesToOptions(rules) {
        const currentDevice = devices.current();
        return rules.reduce((options, { device, options: ruleOptions }) => {
            const deviceFilter = device || {};
            const match = isFunction(deviceFilter) ?
                deviceFilter(currentDevice) :
                deviceMatch(currentDevice, deviceFilter);

            if(match) {
                extend(options, ruleOptions);
            }
            return options;
        }, {});
    }

    static normalizeOptions(options, value) {
        return typeof options !== 'string' ? options : { [options]: value };
    }

    static normalizeName(owner, name) {
        if(name) {
            for(let i = 0; i < owner._deprecateNames.length; i++) {
                if(owner._deprecateNames[i] === name) {
                    const deprecate = owner._deprecated[name];

                    if(deprecate) {
                        owner._notifyDeprecated(name);

                        return deprecate.alias || name;
                    }
                }
            }
        }

        return name;
    }
}
