var coreDataUtils = require("./data"),
    typeUtils = require("./type");

var cachedGetters = {};
var cachedSetters = {};
const clearOptionsField = (options, name) => {
    delete options[name];

    var previousFieldName = getPreviousName(name),
        fieldName = getFieldName(name),
        fieldObject = previousFieldName ? getOptionValue(options, previousFieldName, false) : options;

    if(fieldObject) {
        delete fieldObject[fieldName];
    }
};

const getPreviousName = (fullName) => {
    var splitNames = fullName.split('.');
    splitNames.pop();
    return splitNames.join('.');
};

const getFieldName = (fullName) => {
    var splitNames = fullName.split('.');
    return splitNames[splitNames.length - 1];
};

const setOptionsField = function(options, fullName, value) {
    var fieldName = "",
        fieldObject;

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
    var getter = cachedGetters[name];
    if(!getter) {
        getter = cachedGetters[name] = coreDataUtils.compileGetter(name);
    }

    return getter(options, { functionsAsIs: true, unwrapObservables: unwrapObservables });
};

const setOptionValue = function(name, value, merge) {
    if(!cachedSetters[name]) {
        cachedSetters[name] = coreDataUtils.compileSetter(name);
    }

    var path = name.split(/[.[]/);
    merge = typeUtils.isDefined(merge) ? merge : !this._getOptionsByReference()[name];

    cachedSetters[name](this._options, value, {
        functionsAsIs: true,
        merge,
        unwrapObservables: path.length > 1 && !!this._getOptionsByReference()[path[0]]
    });
};

const setOption = function(name, value, merge) {
    var previousValue = getOptionValue.bind(this)(this._options, name, false);

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
        for(var valueName in value) {
            prepareOption.bind(this)(options, name + "." + valueName, value[valueName]);
        }
    }

    normalizeOptionValue.bind(this)(options, name, value);
};


const normalizeOptionName = function(name) {
    var deprecate;
    if(name) {
        if(!this._cachedDeprecateNames) {
            this._cachedDeprecateNames = [];
            for(var optionName in this._deprecatedOptions) {
                this._cachedDeprecateNames.push(optionName);
            }
        }
        for(var i = 0; i < this._cachedDeprecateNames.length; i++) {
            if(this._cachedDeprecateNames[i] === name) {
                deprecate = this._deprecatedOptions[name];
                break;
            }
        }
        if(deprecate) {
            this._logWarningIfDeprecated(name);
            var alias = deprecate.alias;

            if(alias) {
                name = alias;
            }
        }
    }

    return name;
};

const normalizeOptionValue = function(options, name, value) {
    if(name) {
        var alias = normalizeOptionName.bind(this)(name);

        if(alias && alias !== name) {
            setOptionsField(options, alias, value);
            clearOptionsField(options, name);
        }
    }
};

exports.setOption = setOption;
exports.getOptionValue = getOptionValue;
exports.setOptionsField = setOptionsField;
exports.clearOptionsField = clearOptionsField;
exports.normalizeOptionName = normalizeOptionName;
exports.normalizeOptionValue = normalizeOptionValue;
exports.prepareOption = prepareOption;
