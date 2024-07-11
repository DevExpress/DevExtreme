"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _errors = _interopRequireDefault(require("../../core/errors"));
var _events_strategy = require("../../core/events_strategy");
var _common = require("../../core/utils/common");
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _number = _interopRequireDefault(require("../../localization/number"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

// @ts-expect-error

const EMAIL_VALIDATION_REGEX = /^[\d\w.+_-]+@[\d\w._-]+\.[\w]+$/i;
const STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending'
};
class BaseRuleValidator {
  constructor() {
    this.NAME = 'base';
  }
  defaultMessage(value) {
    // @ts-expect-error
    return _message.default.getFormatter(`validation-${this.NAME}`)(value);
  }
  defaultFormattedMessage(value) {
    // @ts-expect-error
    return _message.default.getFormatter(`validation-${this.NAME}-formatted`)(value);
  }
  _isValueEmpty(value) {
    return !rulesValidators.required.validate(value, {});
  }
  validate(value, rule) {
    const valueArray = Array.isArray(value) ? value : [value];
    let result = true;
    if (valueArray.length) {
      valueArray.every(itemValue => {
        // @ts-expect-error
        result = this._validate(itemValue, rule);
        return result;
      });
    } else {
      // @ts-expect-error
      result = this._validate(null, rule);
    }
    return result;
  }
}
class RequiredRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'required';
  }
  _validate(value, rule) {
    if (!(0, _type.isDefined)(value)) return false;
    if (value === false) {
      return false;
    }
    value = String(value);
    if (rule.trim || !(0, _type.isDefined)(rule.trim)) {
      value = value.trim();
    }
    return value !== '';
  }
}
class NumericRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'numeric';
  }
  _validate(value, rule) {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    if (rule.useCultureSettings && (0, _type.isString)(value)) {
      return !isNaN(_number.default.parse(value));
    }
    return (0, _type.isNumeric)(value);
  }
}
class RangeRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'range';
  }
  _validate(value, rule) {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    const validNumber = rulesValidators.numeric.validate(value, rule);
    const validValue = (0, _type.isDefined)(value) && value !== '';
    const number = validNumber ? parseFloat(value) : validValue && value.valueOf();
    const {
      min
    } = rule;
    const {
      max
    } = rule;
    if (!(validNumber || (0, _type.isDate)(value)) && !validValue) {
      return false;
    }
    if ((0, _type.isDefined)(min)) {
      if ((0, _type.isDefined)(max)) {
        return number >= min && number <= max;
      }
      return number >= min;
    }
    if ((0, _type.isDefined)(max)) {
      return number <= max;
    }
    throw _errors.default.Error('E0101');
  }
}
class StringLengthRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'stringLength';
  }
  _validate(value, rule) {
    value = String(value ?? '');
    if (rule.trim || !(0, _type.isDefined)(rule.trim)) {
      value = value.trim();
    }
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    return rulesValidators.range.validate(value.length, (0, _extend.extend)({}, rule));
  }
}
class CustomRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'custom';
  }
  validate(value, rule) {
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    const {
      validator
    } = rule;
    const dataGetter = validator && (0, _type.isFunction)(validator.option) && validator.option('dataGetter');
    const extraParams = (0, _type.isFunction)(dataGetter) && dataGetter();
    const params = {
      value,
      validator,
      rule
    };
    if (extraParams) {
      (0, _extend.extend)(params, extraParams);
    }
    return rule.validationCallback(params);
  }
}
class AsyncRuleValidator extends CustomRuleValidator {
  constructor() {
    super();
    this.NAME = 'async';
  }
  validate(value, rule) {
    if (!(0, _type.isDefined)(rule.reevaluate)) {
      (0, _extend.extend)(rule, {
        reevaluate: true
      });
    }
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    const {
      validator
    } = rule;
    const dataGetter = validator && (0, _type.isFunction)(validator.option) && validator.option('dataGetter');
    const extraParams = (0, _type.isFunction)(dataGetter) && dataGetter();
    const params = {
      value,
      validator,
      rule
    };
    if (extraParams) {
      (0, _extend.extend)(params, extraParams);
    }
    const callbackResult = rule.validationCallback(params);
    if (!(0, _type.isPromise)(callbackResult)) {
      throw _errors.default.Error('E0103');
    }
    return this._getWrappedPromise((0, _deferred.fromPromise)(callbackResult).promise());
  }
  _getWrappedPromise(promise) {
    const deferred = (0, _deferred.Deferred)();
    promise.then(res => {
      deferred.resolve(res);
    }, err => {
      const res = {
        isValid: false
      };
      if ((0, _type.isDefined)(err)) {
        if ((0, _type.isString)(err)) {
          // @ts-expect-error
          res.message = err;
          // @ts-expect-error
        } else if ((0, _type.isObject)(err) && (0, _type.isDefined)(err.message) && (0, _type.isString)(err.message)) {
          // @ts-expect-error
          res.message = err.message;
        }
      }
      deferred.resolve(res);
    });
    return deferred.promise();
  }
}
class CompareRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'compare';
  }
  // @ts-expect-error
  // eslint-disable-next-line consistent-return
  _validate(value, rule) {
    if (!rule.comparisonTarget) {
      throw _errors.default.Error('E0102');
    }
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    (0, _extend.extend)(rule, {
      reevaluate: true
    });
    const otherValue = rule.comparisonTarget();
    const type = rule.comparisonType || '==';
    // eslint-disable-next-line default-case
    switch (type) {
      case '==':
        return value == otherValue;
      // eslint-disable-line eqeqeq
      case '!=':
        return value != otherValue;
      // eslint-disable-line eqeqeq
      case '===':
        return value === otherValue;
      case '!==':
        return value !== otherValue;
      case '>':
        return value > otherValue;
      case '>=':
        return value >= otherValue;
      case '<':
        return value < otherValue;
      case '<=':
        return value <= otherValue;
    }
  }
}
class PatternRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'pattern';
  }
  _validate(value, rule) {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    let {
      pattern
    } = rule;
    if ((0, _type.isString)(pattern)) {
      pattern = new RegExp(pattern);
    }
    return pattern.test(value);
  }
}
class EmailRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'email';
  }
  _validate(value, rule) {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    return rulesValidators.pattern.validate(value, (0, _extend.extend)({}, rule, {
      pattern: EMAIL_VALIDATION_REGEX
    }));
  }
}
const rulesValidators = {
  required: new RequiredRuleValidator(),
  numeric: new NumericRuleValidator(),
  range: new RangeRuleValidator(),
  stringLength: new StringLengthRuleValidator(),
  custom: new CustomRuleValidator(),
  async: new AsyncRuleValidator(),
  compare: new CompareRuleValidator(),
  pattern: new PatternRuleValidator(),
  email: new EmailRuleValidator()
};
const GroupConfig = _class.default.inherit({
  ctor(group, isRemovable) {
    this.group = group;
    this.validators = [];
    this._isRemovable = isRemovable;
    this._pendingValidators = [];
    this._onValidatorStatusChanged = this._onValidatorStatusChanged.bind(this);
    this._resetValidationInfo();
    this._eventsStrategy = new _events_strategy.EventsStrategy(this);
  },
  validate() {
    const result = {
      isValid: true,
      brokenRules: [],
      validators: [],
      status: STATUS.valid,
      complete: null
    };
    this._unsubscribeFromAllChangeEvents();
    this._pendingValidators = [];
    this._resetValidationInfo();
    (0, _iterator.each)(this.validators, (_, validator) => {
      const validatorResult = validator.validate();
      result.isValid = result.isValid && validatorResult.isValid;
      if (validatorResult.brokenRules) {
        result.brokenRules = result.brokenRules.concat(validatorResult.brokenRules);
      }
      // @ts-expect-error
      result.validators.push(validator);
      if (validatorResult.status === STATUS.pending) {
        this._addPendingValidator(validator);
      }
      this._subscribeToChangeEvents(validator);
    });
    if (this._pendingValidators.length) {
      result.status = STATUS.pending;
    } else {
      result.status = result.isValid ? STATUS.valid : STATUS.invalid;
      this._unsubscribeFromAllChangeEvents();
      this._raiseValidatedEvent(result);
    }
    this._updateValidationInfo(result);
    return (0, _extend.extend)({}, this._validationInfo.result);
  },
  _subscribeToChangeEvents(validator) {
    validator.on('validating', this._onValidatorStatusChanged);
    validator.on('validated', this._onValidatorStatusChanged);
  },
  _unsubscribeFromChangeEvents(validator) {
    validator.off('validating', this._onValidatorStatusChanged);
    validator.off('validated', this._onValidatorStatusChanged);
  },
  _unsubscribeFromAllChangeEvents() {
    (0, _iterator.each)(this.validators, (_, validator) => {
      this._unsubscribeFromChangeEvents(validator);
    });
  },
  _updateValidationInfo(result) {
    this._validationInfo.result = result;
    if (result.status !== STATUS.pending) {
      return;
    }
    if (!this._validationInfo.deferred) {
      this._validationInfo.deferred = (0, _deferred.Deferred)();
      this._validationInfo.result.complete = this._validationInfo.deferred.promise();
    }
  },
  _addPendingValidator(validator) {
    const foundValidator = (0, _common.grep)(this._pendingValidators, val => val === validator)[0];
    if (!foundValidator) {
      this._pendingValidators.push(validator);
    }
  },
  _removePendingValidator(validator) {
    const index = this._pendingValidators.indexOf(validator);
    if (index >= 0) {
      this._pendingValidators.splice(index, 1);
    }
  },
  _orderBrokenRules(brokenRules) {
    let orderedRules = [];
    (0, _iterator.each)(this.validators, (_, validator) => {
      const foundRules = (0, _common.grep)(brokenRules, rule => rule.validator === validator);
      if (foundRules.length) {
        orderedRules = orderedRules.concat(foundRules);
      }
    });
    return orderedRules;
  },
  _updateBrokenRules(result) {
    if (!this._validationInfo.result) {
      return;
    }
    let {
      brokenRules
    } = this._validationInfo.result;
    const rules = (0, _common.grep)(brokenRules, rule => rule.validator !== result.validator);
    if (result.brokenRules) {
      brokenRules = rules.concat(result.brokenRules);
    }
    this._validationInfo.result.brokenRules = this._orderBrokenRules(brokenRules);
  },
  _onValidatorStatusChanged(result) {
    if (result.status === STATUS.pending) {
      this._addPendingValidator(result.validator);
      return;
    }
    this._resolveIfComplete(result);
  },
  _resolveIfComplete(result) {
    this._removePendingValidator(result.validator);
    this._updateBrokenRules(result);
    if (!this._pendingValidators.length) {
      this._unsubscribeFromAllChangeEvents();
      if (!this._validationInfo.result) {
        return;
      }
      this._validationInfo.result.status = this._validationInfo.result.brokenRules.length === 0 ? STATUS.valid : STATUS.invalid;
      this._validationInfo.result.isValid = this._validationInfo.result.status === STATUS.valid;
      const res = (0, _extend.extend)({}, this._validationInfo.result, {
        complete: null
      });
      const {
        deferred
      } = this._validationInfo;
      this._validationInfo.deferred = null;
      this._raiseValidatedEvent(res);
      deferred && setTimeout(() => {
        deferred.resolve(res);
      });
    }
  },
  _raiseValidatedEvent(result) {
    this._eventsStrategy.fireEvent('validated', [result]);
  },
  _resetValidationInfo() {
    this._validationInfo = {
      result: null,
      deferred: null
    };
  },
  _synchronizeValidationInfo() {
    if (this._validationInfo.result) {
      this._validationInfo.result.validators = this.validators;
    }
  },
  removeRegisteredValidator(validator) {
    const index = this.validators.indexOf(validator);
    if (index > -1) {
      this.validators.splice(index, 1);
      this._synchronizeValidationInfo();
      this._resolveIfComplete({
        validator
      });
    }
  },
  registerValidator(validator) {
    if (!this.validators.includes(validator)) {
      this.validators.push(validator);
      this._synchronizeValidationInfo();
    }
  },
  reset() {
    (0, _iterator.each)(this.validators, (_, validator) => {
      validator.reset();
    });
    this._pendingValidators = [];
    this._resetValidationInfo();
  },
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  },
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
});
const ValidationEngine = {
  groups: [],
  getGroupConfig(group) {
    const result = (0, _common.grep)(this.groups, config => config.group === group);
    if (result.length) {
      return result[0];
    }
  },
  findGroup($element, model) {
    var _$element$data;
    const hasValidationGroup = (_$element$data = $element.data()) === null || _$element$data === void 0 || (_$element$data = _$element$data.dxComponents) === null || _$element$data === void 0 ? void 0 : _$element$data.includes('dxValidationGroup');
    const validationGroup = hasValidationGroup && $element.dxValidationGroup('instance');
    if (validationGroup) {
      return validationGroup;
    }
    // try to find out if this control is child of validation group
    const $dxGroup = $element.parents('.dx-validationgroup').first();
    if ($dxGroup.length) {
      return $dxGroup.dxValidationGroup('instance');
    }
    // Trick to be able to securely get ViewModel instance ($data) in Knockout
    return model;
  },
  initGroups() {
    this.groups = [];
    this.addGroup(undefined, false);
  },
  addGroup(group) {
    let isRemovable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let config = this.getGroupConfig(group);
    if (!config) {
      config = new GroupConfig(group, isRemovable);
      this.groups.push(config);
    }
    return config;
  },
  removeGroup(group) {
    const config = this.getGroupConfig(group);
    const index = this.groups.indexOf(config);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
    return config;
  },
  _setDefaultMessage(info) {
    const {
      rule,
      validator,
      name
    } = info;
    if (!(0, _type.isDefined)(rule.message)) {
      if (validator.defaultFormattedMessage && (0, _type.isDefined)(name)) {
        rule.message = validator.defaultFormattedMessage(name);
      } else {
        rule.message = validator.defaultMessage();
      }
    }
  },
  _addBrokenRule(info) {
    const {
      result,
      rule
    } = info;
    if (!result.brokenRule) {
      result.brokenRule = rule;
    }
    if (!result.brokenRules) {
      result.brokenRules = [];
    }
    result.brokenRules.push(rule);
  },
  validate(value, rules, name) {
    var _rules$;
    let result = {
      name,
      value,
      brokenRule: null,
      brokenRules: null,
      isValid: true,
      validationRules: rules,
      pendingRules: null,
      status: STATUS.valid,
      complete: null
    };
    const validator = rules === null || rules === void 0 || (_rules$ = rules[0]) === null || _rules$ === void 0 ? void 0 : _rules$.validator;
    const asyncRuleItems = [];
    // @ts-expect-error
    (0, _iterator.each)(rules || [], (_, rule) => {
      const ruleValidator = rulesValidators[rule.type];
      let ruleValidationResult;
      if (ruleValidator) {
        if ((0, _type.isDefined)(rule.isValid) && rule.value === value && !rule.reevaluate) {
          if (!rule.isValid) {
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
        if (rule.type === 'async') {
          // @ts-expect-error
          asyncRuleItems.push({
            rule,
            ruleValidator
          });
          return true;
        }
        ruleValidationResult = ruleValidator.validate(value, rule);
        rule.isValid = ruleValidationResult;
        if (!ruleValidationResult) {
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
        if (!rule.isValid) {
          return false;
        }
      } else {
        throw _errors.default.Error('E0100');
      }
    });
    if (result.isValid && !result.brokenRules && asyncRuleItems.length) {
      result = this._validateAsyncRules({
        value,
        items: asyncRuleItems,
        result,
        name
      });
    }
    this._synchronizeGroupValidationInfo(validator, result);
    result.status = result.pendingRules ? STATUS.pending : result.isValid ? STATUS.valid : STATUS.invalid;
    return result;
  },
  _synchronizeGroupValidationInfo(validator, result) {
    if (!validator) {
      return;
    }
    const groupConfig = ValidationEngine.getGroupConfig(validator._validationGroup);
    groupConfig._updateBrokenRules.call(groupConfig, {
      validator,
      brokenRules: result.brokenRules ?? []
    });
  },
  _validateAsyncRules(_ref) {
    let {
      result,
      value,
      items,
      name
    } = _ref;
    const asyncResults = [];
    (0, _iterator.each)(items, (_, item) => {
      const validateResult = item.ruleValidator.validate(value, item.rule);
      if (!(0, _type.isPromise)(validateResult)) {
        this._updateRuleConfig({
          rule: item.rule,
          ruleResult: this._getPatchedRuleResult(validateResult),
          validator: item.ruleValidator,
          name
        });
      } else {
        if (!result.pendingRules) {
          result.pendingRules = [];
        }
        result.pendingRules.push(item.rule);
        const asyncResult = validateResult.then(res => {
          const ruleResult = this._getPatchedRuleResult(res);
          this._updateRuleConfig({
            rule: item.rule,
            ruleResult,
            validator: item.ruleValidator,
            name
          });
          return ruleResult;
        });
        // @ts-expect-error
        asyncResults.push(asyncResult);
      }
    });
    if (asyncResults.length) {
      result.complete = Promise.all(asyncResults).then(values => this._getAsyncRulesResult({
        result,
        values
      }));
    }
    return result;
  },
  _updateRuleConfig(_ref2) {
    let {
      rule,
      ruleResult,
      validator,
      name
    } = _ref2;
    rule.isValid = ruleResult.isValid;
    if (!ruleResult.isValid) {
      if ((0, _type.isDefined)(ruleResult.message) && (0, _type.isString)(ruleResult.message) && ruleResult.message.length) {
        rule.message = ruleResult.message;
      } else {
        this._setDefaultMessage({
          rule,
          validator,
          name
        });
      }
    }
  },
  _getPatchedRuleResult(ruleResult) {
    let result;
    const isValid = true;
    if ((0, _type.isObject)(ruleResult)) {
      result = (0, _extend.extend)({}, ruleResult);
      if (!(0, _type.isDefined)(result.isValid)) {
        result.isValid = isValid;
      }
    } else {
      result = {
        isValid: (0, _type.isBoolean)(ruleResult) ? ruleResult : isValid
      };
    }
    return result;
  },
  _getAsyncRulesResult(_ref3) {
    let {
      values,
      result
    } = _ref3;
    (0, _iterator.each)(values, (index, val) => {
      if (val.isValid === false) {
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
  removeRegisteredValidator(group, validator) {
    const config = ValidationEngine.getGroupConfig(group);
    if (config) {
      config.removeRegisteredValidator.call(config, validator);
      const validatorsInGroup = config.validators;
      const isRemovable = config._isRemovable;
      const shouldRemoveGroup = validatorsInGroup.length === 0 && isRemovable;
      if (shouldRemoveGroup) {
        this.removeGroup(group);
      }
    }
  },
  initValidationOptions(options) {
    const initedOptions = {};
    if (options) {
      const syncOptions = ['isValid', 'validationStatus', 'validationError', 'validationErrors'];
      syncOptions.forEach(prop => {
        if (prop in options) {
          (0, _extend.extend)(initedOptions, this.synchronizeValidationOptions({
            name: prop,
            value: options[prop]
          }, options));
        }
      });
    }
    return initedOptions;
  },
  synchronizeValidationOptions(_ref4, options) {
    let {
      name,
      value
    } = _ref4;
    // eslint-disable-next-line default-case
    switch (name) {
      case 'validationStatus':
        {
          const isValid = value === STATUS.valid || value === STATUS.pending;
          return options.isValid !== isValid ? {
            isValid
          } : {};
        }
      case 'isValid':
        {
          const {
            validationStatus
          } = options;
          let newStatus = validationStatus;
          if (value && validationStatus === STATUS.invalid) {
            newStatus = STATUS.valid;
          } else if (!value && validationStatus !== STATUS.invalid) {
            newStatus = STATUS.invalid;
          }
          return newStatus !== validationStatus ? {
            validationStatus: newStatus
          } : {};
        }
      case 'validationErrors':
        {
          const validationError = !value || !value.length ? null : value[0];
          return options.validationError !== validationError ? {
            validationError
          } : {};
        }
      case 'validationError':
        {
          const {
            validationErrors
          } = options;
          if (!value && validationErrors) {
            return {
              validationErrors: null
            };
          }
          if (value && !validationErrors) {
            return {
              validationErrors: [value]
            };
          }
          if (value && validationErrors && value !== validationErrors[0]) {
            validationErrors[0] = value;
            return {
              validationErrors: validationErrors.slice()
            };
          }
        }
    }
    return {};
  },
  validateGroup(group) {
    const groupConfig = ValidationEngine.getGroupConfig(group);
    if (!groupConfig) {
      throw _errors.default.Error('E0110');
    }
    return groupConfig.validate();
  },
  resetGroup(group) {
    const groupConfig = ValidationEngine.getGroupConfig(group);
    if (!groupConfig) {
      throw _errors.default.Error('E0110');
    }
    return groupConfig.reset();
  }
};
ValidationEngine.initGroups();
var _default = exports.default = ValidationEngine;