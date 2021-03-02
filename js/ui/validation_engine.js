var Class = require("../core/class"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    each = require("../core/utils/iterator").each,
    EventsMixin = require("../core/events_mixin"),
    errors = require("../core/errors"),
    commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    numberLocalization = require("../localization/number"),
    messageLocalization = require("../localization/message");

var BaseRuleValidator = Class.inherit({
    NAME: "base",

    defaultMessage: function(value) { return messageLocalization.getFormatter("validation-" + this.NAME)(value); },
    defaultFormattedMessage: function(value) { return messageLocalization.getFormatter("validation-" + this.NAME + "-formatted")(value); },

    validate: function(value, rule) {
        var valueArray = Array.isArray(value) ? value : [value],
            result = true;

        if(valueArray.length) {
            valueArray.every(function(itemValue) {
                result = this._validate(itemValue, rule);
                return result;
            }, this);
        } else {
            result = this._validate(null, rule);
        }

        return result;
    }
});

var RequiredRuleValidator = BaseRuleValidator.inherit({
    NAME: "required",

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
    _validate: function(value, rule) {
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
});

var NumericRuleValidator = BaseRuleValidator.inherit({
    NAME: "numeric",

    /**
     * @name NumericRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name NumericRule.message
     * @type string
     * @default 'Value should be a number'
     */
    _validate: function(value, rule) {
        if(!rulesValidators.required.validate(value, {})) {
            return true;
        }

        if(rule.useCultureSettings && typeUtils.isString(value)) {
            return !isNaN(numberLocalization.parse(value));
        } else {
            return typeUtils.isNumeric(value);
        }
    }
});

var RangeRuleValidator = BaseRuleValidator.inherit({
    NAME: "range",

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

    _validate: function(value, rule) {
        if(!rulesValidators.required.validate(value, {})) {
            return true;
        }

        var validNumber = rulesValidators["numeric"].validate(value, rule),
            validValue = typeUtils.isDefined(value),
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
});

var StringLengthRuleValidator = BaseRuleValidator.inherit({
    NAME: "stringLength",

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
    _validate: function(value, rule) {
        value = typeUtils.isDefined(value) ? String(value) : "";
        if(rule.trim || !typeUtils.isDefined(rule.trim)) {
            value = value.trim();
        }

        return rulesValidators.range.validate(value.length,
            extend({}, rule));
    }
});

var CustomRuleValidator = BaseRuleValidator.inherit({
    NAME: "custom",

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
    validate: function(value, rule) {
        var validator = rule.validator,
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
});

var CompareRuleValidator = BaseRuleValidator.inherit({
    NAME: "compare",

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
    _validate: function(value, rule) {
        if(!rule.comparisonTarget) {
            throw errors.Error("E0102");
        }

        extend(rule, { reevaluate: true });

        var otherValue = rule.comparisonTarget(),
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
});

var PatternRuleValidator = BaseRuleValidator.inherit({
    NAME: "pattern",

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
    _validate: function(value, rule) {
        if(!rulesValidators.required.validate(value, {})) {
            return true;
        }
        var pattern = rule.pattern;
        if(typeUtils.isString(pattern)) {
            pattern = new RegExp(pattern);
        }
        return pattern.test(value);
    }
});

var EmailRuleValidator = BaseRuleValidator.inherit({
    NAME: "email",

    /**
     * @name EmailRule.type
     * @type Enums.ValidationRuleType
     */
    /**
     * @name EmailRule.message
     * @type string
     * @default 'Email is invalid'
     */
    _validate: function(value, rule) {
        if(!rulesValidators.required.validate(value, {})) {
            return true;
        }
        return rulesValidators.pattern.validate(value,
            extend({},
                rule,
                {
                    pattern: /^[\d\w._-]+@[\d\w._-]+\.[\w]+$/i
                }));
    }
});

var rulesValidators = {
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

var GroupConfig = Class.inherit({
    ctor: function(group) {
        this.group = group;
        this.validators = [];
    },

    validate: function() {
        /**
         * @name dxValidationGroupResult
         * @type Object
         */
        var result = {
            /**
             * @name dxValidationGroupResult.isValid
             * @type boolean
             */
            isValid: true,
            /**
             * @name dxValidationGroupResult.brokenRules
             * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
             */
            brokenRules: [],
            /**
             * @name dxValidationGroupResult.validators
             * @type Array<Object>
             */
            validators: []
        };

        each(this.validators, function(_, validator) {
            var validatorResult = validator.validate();
            result.isValid = result.isValid && validatorResult.isValid;

            if(validatorResult.brokenRule) {
                result.brokenRules.push(validatorResult.brokenRule);
            }
            result.validators.push(validator);
        });

        this.fireEvent("validated", [{
            validators: result.validators,
            brokenRules: result.brokenRules,
            isValid: result.isValid
        }]);

        return result;
    },

    reset: function() {
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
var ValidationEngine = {
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
    getGroupConfig: function(group) {
        var result = commonUtils.grep(this.groups, function(config) {
            return config.group === group;
        });

        if(result.length) {
            return result[0];
        }
        // TODO: consider throwing exception here, as it causes quite strange and hardly diagnostable behaviour
    },

    initGroups: function() {
        this.groups = [];
        this.addGroup();
    },

    addGroup: function(group) {

        var config = this.getGroupConfig(group);
        if(!config) {
            config = new GroupConfig(group);
            this.groups.push(config);
        }

        return config;
    },

    removeGroup: function(group) {
        var config = this.getGroupConfig(group),
            index = inArray(config, this.groups);

        if(index > -1) {
            this.groups.splice(index, 1);
        }

        return config;
    },

    _setDefaultMessage: function(rule, validator, name) {
        if(!typeUtils.isDefined(rule.message)) {
            if(validator.defaultFormattedMessage && typeUtils.isDefined(name)) {
                rule.message = validator.defaultFormattedMessage(name);
            } else {
                rule.message = validator.defaultMessage();
            }
        }
    },

    validate: function(value, rules, name) {
        /**
         * @name dxValidatorResult
         * @type Object
         */
        var result = {
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
                 * @name dxValidatorResult.isValid
                 * @type boolean
                 */
                isValid: true,
                /**
                 * @name dxValidatorResult.validationRules
                 * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
                 */
                validationRules: rules
            },
            that = this;

        each(rules || [], function(_, rule) {
            var ruleValidator = rulesValidators[rule.type],
                ruleValidationResult;

            if(ruleValidator) {
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

        return result;
    },

    registerValidatorInGroup: function(group, validator) {
        var groupConfig = ValidationEngine.addGroup(group);

        if(inArray(validator, groupConfig.validators) < 0) {
            groupConfig.validators.push(validator);
        }
    },

    _shouldRemoveGroup: function(group, validatorsInGroup) {
        var isDefaultGroup = group === undefined,
            isValidationGroupInstance = group && group.NAME === "dxValidationGroup";

        return !isDefaultGroup && !isValidationGroupInstance && !validatorsInGroup.length;
    },

    removeRegisteredValidator: function(group, validator) {
        var config = ValidationEngine.getGroupConfig(group),
            validatorsInGroup = config && config.validators;
        var index = inArray(validator, validatorsInGroup);
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
    validateGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);

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
    resetGroup: function(group) {
        var groupConfig = ValidationEngine.getGroupConfig(group);

        if(!groupConfig) {
            throw errors.Error("E0110");
        }

        return groupConfig.reset();
    }

};

ValidationEngine.initGroups();

module.exports = ValidationEngine;
