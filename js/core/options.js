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

        this._optionManager = new OptionManager(
            options,
            defaultOptions,
            optionsByReference,
            deprecatedOptions,
            this._changingCallbacks,
            this._changedCallbacks,
            this._deprecatedCallbacks
        );

        this._rules = [];
    }

    get _options() {
        return this._optionManager._options;
    }

    set _initial(value) {
        this._initialOptions = value;
    }

    _getByRules(rules) {
        rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;

        return Options.convertRulesToOptions(rules);
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

    reset(name) {
        if(name) {
            const defaultValue = this.initial(name);

            this._optionManager._set(name, defaultValue, false);
        }
    }

    // REFACTOR ME

    get _initial() {
        if(!this._initialOptions) {
            const rulesOptions = this._getByRules(this.silent('defaultOptionsRules'));

            this._initialOptions = this._optionManager._default;
            this._optionManager._setByReference(this._initialOptions, rulesOptions);
        }

        return this._initialOptions;
    }

    option(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager._get(this._options, this._optionManager._normalizeName(options));
        } else {
            this._optionManager._set(options, value);
        }
    }

    silent(options, value) {
        const isGetter = arguments.length < 2 && type(options) !== 'object';

        if(isGetter) {
            return this._optionManager._get(this._options, options, true);
        } else {
            this._optionManager._set(options, value, undefined, true);
        }
    }

    getAliasesByName(name) {
        return Object.keys(this._optionManager._deprecated).filter(
            aliasName => name === this._optionManager._deprecated[aliasName].alias
        );
    }

    isDeprecated(name) {
        return Object.prototype.hasOwnProperty.call(this._optionManager._deprecated, name);
    }

    // REFACTOR ME

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
}
