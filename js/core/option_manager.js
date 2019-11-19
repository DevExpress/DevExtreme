import { compileGetter, compileSetter } from './utils/data';
import { equals } from './utils/comparator';
import { extend } from './utils/extend';
import { isDefined, isPlainObject } from './utils/type';
import { Options } from './options';

const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));

export class OptionManager {
    constructor(options, optionsByReference, _changingCallbacks, _changedCallbacks, _deprecatedCallbacks, owner) {
        this._options = options;
        this._optionsByReference = optionsByReference;
        this._owner = owner;

        this._changingCallbacks = _changingCallbacks;
        this._changedCallbacks = _changedCallbacks;
        this._deprecatedCallbacks = _deprecatedCallbacks;

        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    _setByReference(options, rulesOptions) {
        extend(true, options, rulesOptions);

        for(const fieldName in this._optionsByReference) {
            if(Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
                options[fieldName] = rulesOptions[fieldName];
            }
        }
    }

    _setPreparedValue(name, value, merge) {
        const previousValue = this.get(this._options, name, false);

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
            const normalizedName = Options.normalizeName(this._owner, name);

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
            fieldObject = fullName ? this.get(options, fullName, false) : options;
        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    _clearField(options, name) {
        delete options[name];

        const previousFieldName = getParentName(name);
        const fieldObject = previousFieldName ?
            this.get(options, previousFieldName, false) :
            options;

        if(fieldObject) {
            delete fieldObject[getFieldName(name)];
        }
    }

    get(options, name, unwrapObservables, silent) {
        if(silent) {
            return this._options[name];
        }

        this.cachedGetters[name] = this.cachedGetters[name] || compileGetter(name);

        return this.cachedGetters[name](options, { functionsAsIs: true, unwrapObservables });
    }

    set(options, value, merge, silent) {
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
}
