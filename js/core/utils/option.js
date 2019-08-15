import coreDataUtils from "./data";
import typeUtils from "./type";

const cachedGetters = {};
const cachedSetters = {};

const clearOptionsField = (options, name) => {
    delete options[name];

    const previousFieldName = getPreviousName(name);
    const fieldName = getFieldName(name);
    const fieldObject = previousFieldName ? getOptionValue(options, previousFieldName, false) : options;

    if(fieldObject) {
        delete fieldObject[fieldName];
    }
};

const getPreviousName = (fullName) => {
    const splitNames = fullName.split('.');
    splitNames.pop();
    return splitNames.join('.');
};

const getFieldName = (fullName) => {
    const splitNames = fullName.split('.');
    return splitNames[splitNames.length - 1];
};

const setOptionsField = (options, fullName, value) => {
    let fieldName = "";
    let fieldObject;

    do {
        if(fieldName) {
            fieldName = "." + fieldName;
        }

        fieldName = getFieldName(fullName) + fieldName;
        fullName = getPreviousName(fullName);
        fieldObject = fullName ? getOptionValue(options, fullName, false) : options;

    } while(!fieldObject);

    fieldObject[fieldName] = value;
};

const getOptionValue = (options, name, unwrapObservables) => {
    let getter = cachedGetters[name];
    if(!getter) {
        getter = cachedGetters[name] = coreDataUtils.compileGetter(name);
    }

    return getter(options, { functionsAsIs: true, unwrapObservables });
};

const setOptionValue = function(name, value, merge) {
    if(!cachedSetters[name]) {
        cachedSetters[name] = coreDataUtils.compileSetter(name);
    }

    const path = name.split(/[.[]/);
    merge = typeUtils.isDefined(merge) ? merge : !this._getOptionsByReference()[name];

    cachedSetters[name](this._options, value, {
        functionsAsIs: true,
        merge,
        unwrapObservables: path.length > 1 && !!this._getOptionsByReference()[path[0]]
    });
};

const setOption = function(name, value, merge) {
    const previousValue = getOptionValue.bind(this)(this._options, name, false);

    if(this._optionValuesEqual(name, previousValue, value)) {
        return;
    }

    if(this._initialized) {
        this._optionChanging(name, previousValue, value);
    }

    setOptionValue.bind(this)(name, value, merge);
    this._notifyOptionChanged(name, value, previousValue);
};

const prepareOption = function(options, name, value) {
    if(typeUtils.isPlainObject(value)) {
        for(const valueName in value) {
            prepareOption.bind(this)(options, name + "." + valueName, value[valueName]);
        }
    }

    normalizeOptionValue.bind(this)(options, name, value);
};


const normalizeOptionName = function(name) {
    let deprecate;
    if(name) {
        if(!this._cachedDeprecateNames) {
            this._cachedDeprecateNames = [];
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
};

const normalizeOptionValue = function(options, name, value) {
    if(name) {
        const alias = normalizeOptionName.bind(this)(name);

        if(alias && alias !== name) {
            setOptionsField(options, alias, value);
            clearOptionsField(options, name);
        }
    }
};

export {
    setOption,
    getOptionValue,
    setOptionsField,
    clearOptionsField,
    normalizeOptionName,
    normalizeOptionValue,
    prepareOption
};
