import { compileGetter, compileSetter } from './utils/data';
import { equals } from './utils/comparator';
import { extend } from './utils/extend';
import { isDefined, isPlainObject } from './utils/type';
import { Options } from './options';

const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));

export class OptionManager {
    constructor(options, defaultOptions, optionsByReference, deprecatedOptions, _changingCallbacks, _changedCallbacks, _deprecatedCallbacks) {
        this._options = options;
        this._default = defaultOptions;
        this._optionsByReference = optionsByReference;
        this._deprecated = deprecatedOptions;

        this._changingCallbacks = _changingCallbacks;
        this._changedCallbacks = _changedCallbacks;
        this._deprecatedCallbacks = _deprecatedCallbacks;

        this._cachedDeprecateNames = [];
        this.cachedGetters = {}; // Untouchable
        this.cachedSetters = {}; // Untouchable
    }

    get _deprecateNames() {
        if(!this._cachedDeprecateNames.length) {
            for(const optionName in this._deprecated) {
                this._cachedDeprecateNames.push(optionName);
            }
        }

        return this._cachedDeprecateNames;
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

    _setByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    // Untouchable

    _get(options, name, unwrapObservables, silent) {
        if(silent) {
            return this._options[name];
        }

        this.cachedGetters[name] = this.cachedGetters[name] || compileGetter(name);

        return this.cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    _set(options, value, merge, silent) {
        options = Options.normalizeOptions(options, value);

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
}
