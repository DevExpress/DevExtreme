import Class from "../core/class";
import { extend } from "../core/utils/extend";
import { inArray } from "../core/utils/array";
import { each } from "../core/utils/iterator";
import EventsMixin from "../core/events_mixin";
import errors from "../core/errors";
import { grep } from "../core/utils/common";
import typeUtils from "../core/utils/type";
import numberLocalization from "../localization/number";
import messageLocalization from "../localization/message";
import Promise from "../core/polyfills/promise";
import { fromPromise, Deferred } from "../core/utils/deferred";

const STATUS = {
    valid: 'valid',
    invalid: 'invalid',
    pending: 'pending'
};

class BaseRuleValidator {
    constructor() {
        this.NAME = "base";
    }
    defaultMessage(value) {
        return messageLocalization.getFormatter(`validation-${this.NAME}`)(value);
    }
    defaultFormattedMessage(value) {
        return messageLocalization.getFormatter(`validation-${this.NAME}-formatted`)(value);
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
     * @type_function_param1_field5 column:object
     * @type_function_param1_field6 formItem:object
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
            extraParams = typeUtils.isFunction(dataGetter) && dataGetter(),
            params = {
                value: value,
                validator: validator,
                rule: rule
            };
        if(extraParams) {
            extend(params, extraParams);
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
     * @type_function_return Promise<any>
     * @type_function_param1 options:object
     * @type_function_param1_field1 value:string|number
     * @type_function_param1_field2 rule:object
     * @type_function_param1_field3 validator:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 column:object
     * @type_function_param1_field6 formItem:object
     */
    /**
     * @name AsyncRule.message
     * @type string
     * @default 'Value is invalid'
     */
    /**
     * @name AsyncRule.reevaluate
     * @type boolean
     * @default true
     */
    /**
     * @name AsyncRule.ignoreEmptyValue
     * @type boolean
     * @default false
     */
    validate(value, rule) {
        if(!typeUtils.isDefined(rule.reevaluate)) {
            extend(rule, { reevaluate: true });
        }
        if(rule.ignoreEmptyValue && this._isValueEmpty(value)) {
            return true;
        }
        const validator = rule.validator,
            dataGetter = validator && typeUtils.isFunction(validator.option) && validator.option("dataGetter"),
            extraParams = typeUtils.isFunction(dataGetter) && dataGetter(),
            params = {
                value: value,
                validator: validator,
                rule: rule
            };
        if(extraParams) {
            extend(params, extraParams);
        }
        const callbackResult = rule.validationCallback(params);
        if(!typeUtils.isPromise(callbackResult)) {
            throw errors.Error("E0103");
        }
        return this._getWrappedPromise(fromPromise(callbackResult).promise());
    }

    _getWrappedPromise(promise) {
        const deferred = new Deferred();
        promise.then(function(res) {
            deferred.resolve(res);
        }, function(err) {
            deferred.resolve(typeUtils.isDefined(err) ? err : false);
        });
        return deferred.promise();
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
     * @name AsyncRule
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
        this._pendingValidators = [];
        this._onValidatorStatusChanged = this._onValidatorStatusChanged.bind(this);
        this._resetValidationInfo();
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
             * @type Enums.ValidationStatus
             */
            status: STATUS.valid,
            /**
             * @name dxValidationGroupResult.complete
             * @type Promise<dxValidationGroupResult>
             */
            complete: null
        };
        this._unsubscribeFromAllChangeEvents();
        this._pendingValidators = [];
        this._resetValidationInfo();
        each(this.validators, (_, validator) => {
            const validatorResult = validator.validate();
            result.isValid = result.isValid && validatorResult.isValid;
            if(validatorResult.brokenRules) {
                result.brokenRules = result.brokenRules.concat(validatorResult.brokenRules);
            }
            result.validators.push(validator);
            if(validatorResult.status === STATUS.pending) {
                this._addPendingValidator(validator);
            }
            this._subscribeToChangeEvents(validator);
        });
        if(this._pendingValidators.length) {
            result.status = STATUS.pending;
        } else {
            result.status = result.isValid ? STATUS.valid : STATUS.invalid;
            this._unsubscribeFromAllChangeEvents();
            this._raiseValidatedEvent(result);
        }
        this._updateValidationInfo(result);
        return extend({}, this._validationInfo.result);
    },

    _subscribeToChangeEvents(validator) {
        validator.on("validating", this._onValidatorStatusChanged);
        validator.on("validated", this._onValidatorStatusChanged);
    },

    _unsubscribeFromChangeEvents(validator) {
        validator.off("validating", this._onValidatorStatusChanged);
        validator.off("validated", this._onValidatorStatusChanged);
    },

    _unsubscribeFromAllChangeEvents() {
        each(this.validators, (_, validator) => {
            this._unsubscribeFromChangeEvents(validator);
        });
    },

    _updateValidationInfo(result) {
        this._validationInfo.result = result;
        if(result.status !== STATUS.pending) {
            return;
        }
        if(!this._validationInfo.deferred) {
            this._validationInfo.deferred = new Deferred();
            this._validationInfo.result.complete = this._validationInfo.deferred.promise();
        }
    },

    _addPendingValidator(validator) {
        const foundValidator = grep(this._pendingValidators, function(val) {
            return val === validator;
        })[0];
        if(!foundValidator) {
            this._pendingValidators.push(validator);
        }
    },

    _removePendingValidator(validator) {
        const index = inArray(validator, this._pendingValidators);
        if(index >= 0) {
            this._pendingValidators.splice(index, 1);
        }
    },

    _orderBrokenRules(brokenRules) {
        let orderedRules = [];
        each(this.validators, function(_, validator) {
            const foundRules = grep(brokenRules, function(rule) {
                return rule.validator === validator;
            });
            if(foundRules.length) {
                orderedRules = orderedRules.concat(foundRules);
            }
        });
        return orderedRules;
    },

    _updateBrokenRules(result) {
        if(!this._validationInfo.result) {
            return;
        }
        let brokenRules = this._validationInfo.result.brokenRules;
        const rules = grep(brokenRules, function(rule) {
            return rule.validator !== result.validator;
        });
        if(result.brokenRules) {
            brokenRules = rules.concat(result.brokenRules);
        }
        this._validationInfo.result.brokenRules = this._orderBrokenRules(brokenRules);
    },

    _onValidatorStatusChanged(result) {
        if(result.status === STATUS.pending) {
            this._addPendingValidator(result.validator);
            return;
        }
        this._resolveIfComplete(result);
    },

    _resolveIfComplete(result) {
        this._removePendingValidator(result.validator);
        this._updateBrokenRules(result);
        if(!this._pendingValidators.length) {
            this._unsubscribeFromAllChangeEvents();
            if(!this._validationInfo.result) {
                return;
            }
            this._validationInfo.result.status = this._validationInfo.result.brokenRules.length === 0 ? STATUS.valid : STATUS.invalid;
            this._validationInfo.result.isValid = this._validationInfo.result.status === STATUS.valid;
            const res = extend({}, this._validationInfo.result, { complete: null }),
                deferred = this._validationInfo.deferred;
            this._resetValidationInfo();
            this._raiseValidatedEvent(res);
            deferred && setTimeout(() => {
                deferred.resolve(res);
            });
        }
    },

    _raiseValidatedEvent(result) {
        this.fireEvent("validated", [result]);
    },

    _resetValidationInfo() {
        this._validationInfo = {
            result: null,
            deferred: null
        };
    },

    _synchronizeValidationInfo() {
        if(this._validationInfo.result) {
            this._validationInfo.result.validators = this.validators;
        }
    },

    removeRegisteredValidator(validator) {
        const index = inArray(validator, this.validators);
        if(index > -1) {
            this.validators.splice(index, 1);
            this._synchronizeValidationInfo();
            this._resolveIfComplete({ validator });
        }
    },

    registerValidator(validator) {
        if(inArray(validator, this.validators) < 0) {
            this.validators.push(validator);
            this._synchronizeValidationInfo();
        }
    },

    reset() {
        each(this.validators, function(_, validator) {
            validator.reset();
        });
        this._pendingValidators = [];
        this._resetValidationInfo();
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
        const result = grep(this.groups, function(config) {
            return config.group === group;
        });
        if(result.length) {
            return result[0];
        }
        // TODO: consider throwing exception here, as it causes quite strange and hardly diagnostable behaviour
    },

    findGroup($element, model) {
        // try to find out if this control is child of validation group
        const $dxGroup = $element.parents(".dx-validationgroup").first();

        if($dxGroup.length) {
            return $dxGroup.dxValidationGroup("instance");
        }

        // Trick to be able to securely get ViewModel instance ($data) in Knockout
        return model;
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

    _setDefaultMessage(info) {
        const { rule, validator, name } = info;
        if(!typeUtils.isDefined(rule.message)) {
            if(validator.defaultFormattedMessage && typeUtils.isDefined(name)) {
                rule.message = validator.defaultFormattedMessage(name);
            } else {
                rule.message = validator.defaultMessage();
            }
        }
    },

    _addBrokenRule(info) {
        const { result, rule } = info;
        if(!result.brokenRule) {
            result.brokenRule = rule;
        }
        if(!result.brokenRules) {
            result.brokenRules = [];
        }
        result.brokenRules.push(rule);
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
             * @type RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule
             */
            brokenRule: null,
            /**
             * @name dxValidatorResult.brokenRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
             */
            brokenRules: null,
            /**
             * @name dxValidatorResult.isValid
             * @type boolean
             */
            isValid: true,
            /**
             * @name dxValidatorResult.validationRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
             */
            validationRules: rules,
            /**
             * @name dxValidatorResult.pendingRules
             * @type Array<AsyncRule>
             */
            pendingRules: null,
            /**
             * @name dxValidatorResult.status
             * @type Enums.ValidationStatus
             */
            status: STATUS.valid,
            /**
             * @name dxValidatorResult.complete
             * @type Promise<dxValidatorResult>
             */
            complete: null
        };
        const asyncRuleItems = [];
        each(rules || [], (_, rule) => {
            const ruleValidator = rulesValidators[rule.type];
            let ruleValidationResult;
            if(ruleValidator) {
                if(typeUtils.isDefined(rule.isValid) && rule.value === value && !rule.reevaluate) {
                    if(!rule.isValid) {
                        result.isValid = false;
                        this._addBrokenRule({
                            result,
                            rule
                        });
                        return false;
                    }
                    return true;
                }
                rule.value = value;
                if(rule.type === "async") {
                    asyncRuleItems.push({
                        rule: rule,
                        ruleValidator: ruleValidator
                    });
                    return true;
                }
                ruleValidationResult = ruleValidator.validate(value, rule);
                rule.isValid = ruleValidationResult;
                if(!ruleValidationResult) {
                    result.isValid = false;
                    this._setDefaultMessage({
                        rule,
                        validator: ruleValidator,
                        name
                    });
                    this._addBrokenRule({
                        result,
                        rule
                    });
                }
                if(!rule.isValid) {
                    return false;
                }
            } else {
                throw errors.Error("E0100");
            }
        });
        if(result.isValid && !result.brokenRules && asyncRuleItems.length) {
            result = this._validateAsyncRules({
                value,
                items: asyncRuleItems,
                result,
                name
            });
        }
        result.status = result.pendingRules ? STATUS.pending : (result.isValid ? STATUS.valid : STATUS.invalid);
        return result;
    },

    _validateAsyncRules({ result, value, items, name }) {
        const asyncResults = [];
        each(items, (_, item) => {
            const validateResult = item.ruleValidator.validate(value, item.rule);
            if(!typeUtils.isPromise(validateResult)) {
                this._updateRuleConfig({
                    rule: item.rule,
                    ruleResult: this._getPatchedRuleResult(validateResult),
                    validator: item.ruleValidator,
                    name
                });
            } else {
                if(!result.pendingRules) {
                    result.pendingRules = [];
                }
                result.pendingRules.push(item.rule);
                const asyncResult = validateResult.then((res) => {
                    const ruleResult = this._getPatchedRuleResult(res);
                    this._updateRuleConfig({
                        rule: item.rule,
                        ruleResult,
                        validator: item.ruleValidator,
                        name
                    });
                    return ruleResult;
                });
                asyncResults.push(asyncResult);
            }
        });
        if(asyncResults.length) {
            result.complete = Promise.all(asyncResults).then((values) => {
                return this._getAsyncRulesResult({
                    result,
                    values
                });
            });
        }
        return result;
    },

    _updateRuleConfig({ rule, ruleResult, validator, name }) {
        rule.isValid = ruleResult.isValid;
        if(!ruleResult.isValid) {
            if(typeUtils.isDefined(ruleResult.message) && typeUtils.isString(ruleResult.message) && ruleResult.message.length) {
                rule.message = ruleResult.message;
            } else {
                this._setDefaultMessage({
                    rule,
                    validator: validator,
                    name
                });
            }
        }
    },

    _getPatchedRuleResult(ruleResult) {
        let result;
        const isValid = true;
        if(typeUtils.isObject(ruleResult)) {
            result = extend({}, ruleResult);
            if(!typeUtils.isDefined(result.isValid)) {
                result.isValid = isValid;
            }
        } else {
            result = {
                isValid: typeUtils.isBoolean(ruleResult) ? ruleResult : isValid
            };
        }
        return result;
    },

    _getAsyncRulesResult({ values, result }) {
        each(values, (index, val) => {
            if(val.isValid === false) {
                result.isValid = val.isValid;
                const rule = result.pendingRules[index];
                this._addBrokenRule({
                    result,
                    rule
                });
            }
        });
        result.pendingRules = null;
        result.complete = null;
        result.status = result.isValid ? STATUS.valid : STATUS.invalid;
        return result;
    },

    registerValidatorInGroup(group, validator) {
        const groupConfig = ValidationEngine.addGroup(group);
        groupConfig.registerValidator.call(groupConfig, validator);
    },

    _shouldRemoveGroup(group, validatorsInGroup) {
        const isDefaultGroup = group === undefined,
            isValidationGroupInstance = group && group.NAME === "dxValidationGroup";
        return !isDefaultGroup && !isValidationGroupInstance && !validatorsInGroup.length;
    },

    removeRegisteredValidator(group, validator) {
        const config = ValidationEngine.getGroupConfig(group);
        if(config) {
            config.removeRegisteredValidator.call(config, validator);
            const validatorsInGroup = config.validators;
            if(this._shouldRemoveGroup(group, validatorsInGroup)) {
                this.removeGroup(group);
            }
        }
    },

    initValidationOptions(options) {
        const initedOptions = {};

        if(options) {
            const syncOptions = ['isValid', 'validationStatus', 'validationError', 'validationErrors'];

            syncOptions.forEach((prop) => {
                if(prop in options) {
                    Object.assign(initedOptions,
                        this._synchronizeValidationOptions({ name: prop, value: options[prop] }, options)
                    );
                }
            });
        }

        return initedOptions;
    },

    synchronizeValidationOptions({ name, value }, options) {
        switch(name) {
            case 'validationStatus': {
                const isValid = value === STATUS.valid || value === STATUS.pending;

                return options.isValid !== isValid ? { isValid } : {};
            }
            case 'isValid': {
                const { validationStatus } = options;
                let newStatus = validationStatus;

                if(value && validationStatus === STATUS.invalid) {
                    newStatus = STATUS.valid;
                } else if(!value && validationStatus !== STATUS.invalid) {
                    newStatus = STATUS.invalid;
                }

                return newStatus !== validationStatus ? { validationStatus: newStatus } : {};
            }
            case 'validationErrors': {
                let validationError = !value || !value.length ? null : value[0];

                return options.validationError !== validationError ? { validationError } : {};
            }
            case 'validationError': {
                const { validationErrors } = options;

                if(!value && validationErrors) {
                    return { validationErrors: null };
                } else if(value && !validationErrors) {
                    return { validationErrors: [value] };
                } else if(value && validationErrors && value !== validationErrors[0]) {
                    validationErrors[0] = value;
                    return { validationErrors: validationErrors.slice() };
                }
            }
        }

        return {};
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
