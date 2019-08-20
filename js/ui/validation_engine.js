import Class from "../core/class";
import { extend } from "../core/utils/extend";
import { inArray } from "../core/utils/array";
import { each } from "../core/utils/iterator";
import EventsMixin from "../core/events_mixin";
import errors from "../core/errors";
import commonUtils from "../core/utils/common";
import typeUtils from "../core/utils/type";
import numberLocalization from "../localization/number";
import messageLocalization from "../localization/message";

class BaseRuleValidator {
    constructor() {
        this.NAME = "base";
    }
    defaultMessage(value) {
        return messageLocalization.getFormatter("validation-" + this.NAME)(value);
    }
    defaultFormattedMessage(value) {
        return messageLocalization.getFormatter("validation-" + this.NAME + "-formatted")(value);
    }
    _isValueEmpty(value) {
        return !rulesValidators.required.validate(value, {});
    }
    validate(value, rule) {
        const valueArray = Array.isArray(value) ? value : [value];
        let result = true;

        if(valueArray.length) {
            valueArray.every((itemValue) => {
                result = this._validate(itemValue, rule);
                return result;
            });
        } else {
            result = this._validate(null, rule);
        }

        return result;
    }
}

class RequiredRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "required";
    }

    /**
     * @name RequiredRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name RequiredRule.trim
     * @type boolean
     * @default true
     */
    /**
     * @name RequiredRule.message
     * @type string
     * @default 'Required'
     */
    _validate(value, rule) {
        if(!typeUtils.isDefined(value)) return false;
        if(value === false) {
            return false;
        }
        value = String(value);
        if(rule.trim || !typeUtils.isDefined(rule.trim)) {
            value = value.trim();
        }
        return value !== "";
    }
}

class NumericRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "numeric";
    }

    /**
     * @name NumericRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name NumericRule.message
     * @type string
     * @default 'Value should be a number'
     */
    /**
     * @name NumericRule.ignoreEmptyValue
     * @type boolean
     * @default true
     */
    _validate(value, rule) {
        if(rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
            return true;
        }

        if(rule.useCultureSettings && typeUtils.isString(value)) {
            return !isNaN(numberLocalization.parse(value));
        } else {
            return typeUtils.isNumeric(value);
        }
    }
}

class RangeRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "range";
    }

    /**
     * @name RangeRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name RangeRule.min
     * @type datetime|number
     */
    /**
     * @name RangeRule.max
     * @type datetime|number
     */
    /**
     * @name RangeRule.message
     * @type string
     * @default 'Value is out of range'
     */
    /**
     * @name RangeRule.reevaluate
     * @type boolean
     * @default false
     */
    /**
     * @name RangeRule.ignoreEmptyValue
     * @type boolean
     * @default true
     */
    _validate(value, rule) {
        if(rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
            return true;
        }

        const validNumber = rulesValidators["numeric"].validate(value, rule),
            validValue = typeUtils.isDefined(value) && value !== "",
            number = validNumber ? parseFloat(value) : validValue && value.valueOf(),
            min = rule.min,
            max = rule.max;

        if(!(validNumber || typeUtils.isDate(value)) && !validValue) {
            return false;
        }

        if(typeUtils.isDefined(min)) {
            if(typeUtils.isDefined(max)) {
                return number >= min && number <= max;
            }
            return number >= min;
        } else {
            if(typeUtils.isDefined(max)) {
                return number <= max;
            } else {
                throw errors.Error("E0101");
            }
        }
    }
}

class StringLengthRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "stringLength";
    }

    /**
     * @name StringLengthRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name StringLengthRule.min
     * @type number
     */
    /**
     * @name StringLengthRule.max
     * @type number
     */
    /**
     * @name StringLengthRule.trim
     * @type boolean
     * @default true
     */
    /**
     * @name StringLengthRule.message
     * @type string
     * @default 'The length of the value is not correct'
     */
    /**
     * @name StringLengthRule.ignoreEmptyValue
     * @type boolean
     * @default false
     */
    _validate(value, rule) {
        value = typeUtils.isDefined(value) ? String(value) : "";
        if(rule.trim || !typeUtils.isDefined(rule.trim)) {
            value = value.trim();
        }

        if(rule.ignoreEmptyValue && this._isValueEmpty(value)) {
            return true;
        }

        return rulesValidators.range.validate(value.length,
            extend({}, rule));
    }
}

class CustomRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "custom";
    }

    /**
     * @name CustomRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name CustomRule.validationCallback
     * @type function
     * @type_function_return boolean
     * @type_function_param1 options:object
     * @type_function_param1_field1 value:string|number
     * @type_function_param1_field2 rule:object
     * @type_function_param1_field3 validator:object
     * @type_function_param1_field4 data:object
     */
    /**
     * @name CustomRule.message
     * @type string
     * @default 'Value is invalid'
     */
    /**
     * @name CustomRule.reevaluate
     * @type boolean
     * @default false
     */
    /**
     * @name CustomRule.ignoreEmptyValue
     * @type boolean
     * @default false
     */
    validate(value, rule) {
        if(rule.ignoreEmptyValue && this._isValueEmpty(value)) {
            return true;
        }

        const validator = rule.validator,
            dataGetter = validator && typeUtils.isFunction(validator.option) && validator.option("dataGetter"),
            data = typeUtils.isFunction(dataGetter) && dataGetter(),
            params = {
                value: value,
                validator: validator,
                rule: rule
            };

        if(data) {
            params.data = data;
        }

        return rule.validationCallback(params);
    }
}

class AsyncRuleValidator extends CustomRuleValidator {
    constructor() {
        super();
        this.NAME = "async";
    }

    /**
     * @name AsyncRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name AsyncRule.validationCallback
     * @type function
     * @type_function_return Promise
     * @type_function_param1 options:object
     * @type_function_param1_field1 value:string|number
     * @type_function_param1_field2 rule:object
     * @type_function_param1_field3 validator:object
     * @type_function_param1_field4 data:object
     */
    /**
     * @name AsyncRule.message
     * @type string
     * @default 'Value is invalid'
     */
    /**
     * @name AsyncRule.reevaluate
     * @type boolean
     * @default false
     */
    /**
     * @name AsyncRule.ignoreEmptyValue
     * @type boolean
     * @default false
     */
    validate(value, rule) {
        if(rule.ignoreEmptyValue && this._isValueEmpty(value)) {
            return new Promise(function(resolve) {
                resolve(true);
            });
        }

        const validator = rule.validator,
            dataGetter = validator && typeUtils.isFunction(validator.option) && validator.option("dataGetter"),
            data = typeUtils.isFunction(dataGetter) && dataGetter(),
            params = {
                value: value,
                validator: validator,
                rule: rule
            };

        if(data) {
            params.data = data;
        }
        const callbackResult = rule.validationCallback(params);
        if(!typeUtils.isPromise(callbackResult)) {
            throw errors.Error("validationCallback should return the Promise object");
        }
        return callbackResult;
    }
}

class CompareRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "compare";
    }

    /**
     * @name CompareRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name CompareRule.comparisonTarget
     * @type function
     * @type_function_return object
     */
    /**
     * @name CompareRule.comparisonType
     * @type Enums.ComparisonOperator
     * @default '=='
     */
    /**
     * @name CompareRule.message
     * @type string
     * @default 'Values do not match'
     */
    /**
     * @name CompareRule.reevaluate
     * @type boolean
     * @default true
     */
    /**
     * @name CompareRule.ignoreEmptyValue
     * @type boolean
     * @default false
     */
    _validate(value, rule) {
        if(!rule.comparisonTarget) {
            throw errors.Error("E0102");
        }

        if(rule.ignoreEmptyValue && this._isValueEmpty(value)) {
            return true;
        }

        extend(rule, { reevaluate: true });

        const otherValue = rule.comparisonTarget(),
            type = rule.comparisonType || "==";

        switch(type) {
            case "==":
                return value == otherValue; // eslint-disable-line eqeqeq
            case "!=":
                return value != otherValue; // eslint-disable-line eqeqeq
            case "===":
                return value === otherValue;
            case "!==":
                return value !== otherValue;
            case ">":
                return value > otherValue;
            case ">=":
                return value >= otherValue;
            case "<":
                return value < otherValue;
            case "<=":
                return value <= otherValue;

        }
    }
}

class PatternRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "pattern";
    }

    /**
     * @name PatternRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name PatternRule.pattern
     * @type regexp|string
     */
    /**
     * @name PatternRule.message
     * @type string
     * @default 'Value does not match pattern'
     */
    /**
     * @name PatternRule.ignoreEmptyValue
     * @type boolean
     * @default true
     */
    _validate(value, rule) {
        if(rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
            return true;
        }
        let pattern = rule.pattern;
        if(typeUtils.isString(pattern)) {
            pattern = new RegExp(pattern);
        }
        return pattern.test(value);
    }
}

class EmailRuleValidator extends BaseRuleValidator {
    constructor() {
        super();
        this.NAME = "email";
    }

    /**
     * @name EmailRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name EmailRule.message
     * @type string
     * @default 'Email is invalid'
     */
    /**
     * @name EmailRule.ignoreEmptyValue
     * @type boolean
     * @default true
     */
    _validate(value, rule) {
        if(rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
            return true;
        }
        return rulesValidators.pattern.validate(value,
            extend({},
                rule,
                {
                    pattern: /^[\d\w._-]+@([\d\w._-]+\.)+[\w]+$/i
                }));
    }
}

const rulesValidators = {
    /**
     * @name RequiredRule
     * @section dxValidator
     * @type object
     */
    "required": new RequiredRuleValidator(),

    /**
     * @name NumericRule
     * @section dxValidator
     * @type object
     */
    "numeric": new NumericRuleValidator(),

    /**
     * @name RangeRule
     * @section dxValidator
     * @type object
     */
    "range": new RangeRuleValidator(),

    /**
     * @name StringLengthRule
     * @section dxValidator
     * @type object
     */
    "stringLength": new StringLengthRuleValidator(),

    /**
     * @name CustomRule
     * @section dxValidator
     * @type object
     */
    "custom": new CustomRuleValidator(),

    /**
     * @name CustomRule
     * @section dxValidator
     * @type object
     */
    "async": new AsyncRuleValidator(),

    /**
     * @name CompareRule
     * @section dxValidator
     * @type object
     */
    "compare": new CompareRuleValidator(),

    /**
     * @name PatternRule
     * @section dxValidator
     * @type object
     */
    "pattern": new PatternRuleValidator(),

    /**
     * @name EmailRule
     * @section dxValidator
     * @type object
     */
    "email": new EmailRuleValidator()
};

const GroupConfig = Class.inherit({
    ctor(group) {
        this.group = group;
        this.validators = [];
    },

    validate() {
        /**
         * @name dxValidationGroupResult
         * @type Object
         */
        const result = {
            /**
             * @name dxValidationGroupResult.isValid
             * @type boolean
             */
            isValid: true,
            /**
             * @name dxValidationGroupResult.brokenRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
             */
            brokenRules: [],
            /**
             * @name dxValidationGroupResult.validators
             * @type Array<Object>
             */
            validators: [],
            /**
             * @name dxValidationGroupResult.status
             * @type string
             */
            status: "valid",
            /**
             * @name dxValidationGroupResult.complete
             * @type Promise
             */
            complete: null
        };
        delete this._asyncValidationResults;
        each(this.validators, (_, validator) => {
            const validatorResult = validator.validate();
            result.isValid = result.isValid && validatorResult.isValid;

            // if(validatorResult.brokenRule) {
            //     result.brokenRules.push(validatorResult.brokenRule);
            // }
            if(validatorResult.brokenRules) {
                result.brokenRules = result.brokenRules.concat(validatorResult.brokenRules);
            }
            result.validators.push(validator);
            if(validatorResult.complete) {
                this._asyncValidationResults = this._asyncValidationResults || [];
                this._asyncValidationResults.push(validatorResult);
            }
        });
        if(this._asyncValidationResults) {
            result.status = "pending";
            const completeList = this._asyncValidationResults.map(function(res) {
                return res.complete;
            });
            result.complete = Promise.all(completeList)
                .then((values) => {
                    if(!this._asyncValidationResults) {
                        return;
                    }
                    const res = this._getAsyncResult(result, values);
                    this._raiseValidatedEvent(res);
                    return res;
                });
        } else {
            result.status = result.isValid ? "valid" : "invalid";
            this._raiseValidatedEvent(result);
        }
        return result;
    },

    _getAsyncResult(result, values) {
        values.forEach((val, index) => {
            if(!val.isValid) {
                result.brokenRules = result.brokenRules.concat(this._asyncValidationResults[index].brokenRules);
            }
        });
        result.isValid = !result.brokenRules.length;
        result.status = result.isValid ? "valid" : "invalid";
        result.complete = null;
        return result;
    },

    _raiseValidatedEvent(result) {
        this.fireEvent("validated", [{
            validators: result.validators,
            brokenRules: result.brokenRules,
            isValid: result.isValid
        }]);
    },

    reset() {
        delete this._asyncValidationResults;
        each(this.validators, function(_, validator) {
            validator.reset();
        });
    }
}).include(EventsMixin);

/**
 * @name validationEngine
 * @section Core
 * @namespace DevExpress
 * @module ui/validation_engine
 * @export default
 */
const ValidationEngine = {
    groups: [],

    /**
    * @name validationEngineMethods.getGroupConfig
    * @section Core
    * @publicName getGroupConfig(group)
    * @param1 group:string|object
    * @return object
    * @static
    */
    /**
    * @name validationEngineMethods.getGroupConfig
    * @section Core
    * @publicName getGroupConfig()
    * @return object
    * @static
    */
    getGroupConfig(group) {
        const result = commonUtils.grep(this.groups, function(config) {
            return config.group === group;
        });

        if(result.length) {
            return result[0];
        }
        // TODO: consider throwing exception here, as it causes quite strange and hardly diagnostable behaviour
    },

    initGroups() {
        this.groups = [];
        this.addGroup();
    },

    addGroup(group) {
        let config = this.getGroupConfig(group);
        if(!config) {
            config = new GroupConfig(group);
            this.groups.push(config);
        }

        return config;
    },

    removeGroup(group) {
        const config = this.getGroupConfig(group),
            index = inArray(config, this.groups);

        if(index > -1) {
            this.groups.splice(index, 1);
        }

        return config;
    },

    _setDefaultMessage(rule, validator, name) {
        if(!typeUtils.isDefined(rule.message)) {
            if(validator.defaultFormattedMessage && typeUtils.isDefined(name)) {
                rule.message = validator.defaultFormattedMessage(name);
            } else {
                rule.message = validator.defaultMessage();
            }
        }
    },

    validate(value, rules, name) {
        /**
         * @name dxValidatorResult
         * @type Object
         */
        let result = {
                name: name,
                /**
                 * @name dxValidatorResult.value
                 * @type any
                 */
                value: value,
                /**
                 * @name dxValidatorResult.brokenRule
                 * @type RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule
                 */
                brokenRule: null,
                /**
                 * @name dxValidatorResult.brokenRule
                 * @type RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule
                 */
                brokenRules: null,
                /**
                 * @name dxValidatorResult.isValid
                 * @type boolean
                 */
                isValid: true,
                /**
                 * @name dxValidatorResult.validationRules
                 * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
                 */
                validationRules: rules,
                /**
                 * @name dxValidatorResult.asyncValidationRules
                 * @type Array<AsyncRule>
                 */
                asyncValidationRules: null,
                /**
                 * @name dxValidatorResult.status
                 * @type string
                 */
                status: "valid",
                /**
                 * @name dxValidatorResult.complete
                 * @type Promise
                 */
                complete: null
            },
            that = this;
        const asyncRuleItems = [];
        each(rules || [], function(_, rule) {
            const ruleValidator = rulesValidators[rule.type];
            let ruleValidationResult;

            if(ruleValidator) {
                if(rule.type === "async") {
                    asyncRuleItems.push({
                        rule: rule,
                        ruleValidator: ruleValidator
                    });
                    return true;
                }
                if(typeUtils.isDefined(rule.isValid) && rule.value === value && !rule.reevaluate) {
                    if(!rule.isValid) {
                        result.isValid = false;
                        result.brokenRule = rule;
                        return false;
                    }
                    return true;
                }

                rule.value = value;

                ruleValidationResult = ruleValidator.validate(value, rule);
                rule.isValid = ruleValidationResult;

                if(!ruleValidationResult) {
                    result.isValid = false;
                    that._setDefaultMessage(rule, ruleValidator, name);
                    result.brokenRule = rule;
                }

                if(!rule.isValid) {
                    return false;
                }
            } else {
                throw errors.Error("E0100");
            }
        });
        if(result.brokenRule) {
            result.brokenRules = [];
            result.brokenRules.push(result.brokenRule);
        }
        if(result.isValid && asyncRuleItems.length) {
            result = this._getPatchedValidationResult(result, asyncRuleItems, value);
        }
        result.status = result.asyncValidationRules ? "pending" : (result.isValid ? "valid" : "invalid");
        return result;
    },

    _getPatchedValidationResult(result, items, value) {
        const asyncResults = [];
        result.asyncValidationRules = [];
        const getPatchedResult = function(result, isValid = true) {
            let res;
            if(typeUtils.isObject(result)) {
                res = extend({}, result);
                if(!typeUtils.isDefined(res.isValid)) {
                    res.isValid = isValid;
                }
            } else {
                res = {
                    isValid: typeUtils.isBoolean(result) ? result : isValid
                };
            }
            return res;
        };
        items.forEach(function(item) {
            result.asyncValidationRules.push(item.rule);
            const asyncResult = item.ruleValidator.validate(value, item.rule).then(function(res) {
                return getPatchedResult(res);
            }).catch(function(err) {
                return getPatchedResult(err, false);
            });
            asyncResults.push(asyncResult);
        });
        result.complete = Promise.all(asyncResults);
        return result;
    },

    registerValidatorInGroup(group, validator) {
        const groupConfig = ValidationEngine.addGroup(group);

        if(inArray(validator, groupConfig.validators) < 0) {
            groupConfig.validators.push(validator);
        }
    },

    _shouldRemoveGroup(group, validatorsInGroup) {
        const isDefaultGroup = group === undefined,
            isValidationGroupInstance = group && group.NAME === "dxValidationGroup";

        return !isDefaultGroup && !isValidationGroupInstance && !validatorsInGroup.length;
    },

    removeRegisteredValidator(group, validator) {
        const config = ValidationEngine.getGroupConfig(group),
            validatorsInGroup = config && config.validators;
        const index = inArray(validator, validatorsInGroup);
        if(index > -1) {
            validatorsInGroup.splice(index, 1);
            if(this._shouldRemoveGroup(group, validatorsInGroup)) {
                this.removeGroup(group);
            }
        }
    },

    /**
    * @name validationEngineMethods.validateGroup
    * @section Core
    * @publicName validateGroup(group)
    * @param1 group:string|object
    * @return dxValidationGroupResult
    * @static
    */
    /**
    * @name validationEngineMethods.validateGroup
    * @section Core
    * @publicName validateGroup()
    * @return dxValidationGroupResult
    * @static
    */
    validateGroup(group) {
        const groupConfig = ValidationEngine.getGroupConfig(group);

        if(!groupConfig) {
            throw errors.Error("E0110");
        }

        return groupConfig.validate();
    },

    /**
    * @name validationEngineMethods.resetGroup
    * @section Core
    * @publicName resetGroup(group)
    * @param1 group:string|object
    * @static
    */
    /**
    * @name validationEngineMethods.resetGroup
    * @section Core
    * @publicName resetGroup()
    * @static
    */
    resetGroup(group) {
        const groupConfig = ValidationEngine.getGroupConfig(group);

        if(!groupConfig) {
            throw errors.Error("E0110");
        }

        return groupConfig.reset();
    }

};

ValidationEngine.initGroups();

module.exports = ValidationEngine;
