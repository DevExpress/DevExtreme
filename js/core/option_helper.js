import coreDataUtils from "./utils/data";
import typeUtils from "./utils/type";

export class OptionHelper {
    constructor(context) {
        this.context = context;
        this.cachedGetters = {};
        this.cachedSetters = {};
    }

    clearOptionsField(options, name) {
        delete options[name];

        const previousFieldName = this.getPreviousName(name);
        const fieldName = this.getFieldName(name);
        const fieldObject = previousFieldName ? this.getOptionValue(options, previousFieldName, false) : options;

        if(fieldObject) {
            delete fieldObject[fieldName];
        }
    }

    getPreviousName(fullName) {
        const splitNames = fullName.split('.');
        splitNames.pop();
        return splitNames.join('.');
    }

    getFieldName(fullName) {
        const splitNames = fullName.split('.');
        return splitNames[splitNames.length - 1];
    }

    setOptionsField(options, fullName, value) {
        let fieldName = "";
        let fieldObject;

        do {
            if(fieldName) {
                fieldName = "." + fieldName;
            }

            fieldName = this.getFieldName(fullName) + fieldName;
            fullName = this.getPreviousName(fullName);
            fieldObject = fullName ? this.getOptionValue(options, fullName, false) : options;

        } while(!fieldObject);

        fieldObject[fieldName] = value;
    }

    getOptionValue(options, name, unwrapObservables) {

        let getter = this.cachedGetters[name];
        if(!getter) {
            getter = this.cachedGetters[name] = coreDataUtils.compileGetter(name);
        }

        return getter(options, { functionsAsIs: true, unwrapObservables });
    }

    setOptionValue(name, value, merge) {
        if(!this.cachedSetters[name]) {
            this.cachedSetters[name] = coreDataUtils.compileSetter(name);
        }

        const path = name.split(/[.[]/);
        merge = typeUtils.isDefined(merge) ? merge : !this.context._getOptionsByReference()[name];

        this.cachedSetters[name](this.context._options, value, {
            functionsAsIs: true,
            merge,
            unwrapObservables: path.length > 1 && !!this.context._getOptionsByReference()[path[0]]
        });
    }

    setOption(name, value, merge) {
        const previousValue = this.getOptionValue(this.context._options, name, false);

        if(this.context._optionValuesEqual(name, previousValue, value)) {
            return;
        }

        if(this.context._initialized) {
            this.context._optionChanging(name, previousValue, value);
        }

        this.setOptionValue(name, value, merge);
        this.context._notifyOptionChanged(name, value, previousValue);
    }

    prepareOption(options, name, value) {
        if(typeUtils.isPlainObject(value)) {
            for(const valueName in value) {
                this.prepareOption(options, name + "." + valueName, value[valueName]);
            }
        }

        this.normalizeOptionValue(options, name, value);
    }


    normalizeOptionName(name) {
        let deprecate;
        if(name) {
            if(!this.context._cachedDeprecateNames) {
                this.context._cachedDeprecateNames = [];
                for(const optionName in this.context._deprecatedOptions) {
                    this.context._cachedDeprecateNames.push(optionName);
                }
            }
            for(let i = 0; i < this.context._cachedDeprecateNames.length; i++) {
                if(this.context._cachedDeprecateNames[i] === name) {
                    deprecate = this.context._deprecatedOptions[name];
                    break;
                }
            }
            if(deprecate) {
                this.context._logWarningIfDeprecated(name);
                const alias = deprecate.alias;

                if(alias) {
                    name = alias;
                }
            }
        }

        return name;
    }

    normalizeOptionValue(options, name, value) {
        if(name) {
            const alias = this.normalizeOptionName(name);

            if(alias && alias !== name) {
                this.setOptionsField(options, alias, value);
                this.clearOptionsField(options, name);
            }
        }
    }
}
