/* eslint-disable max-classes-per-file */
import type {
  AsyncRule,
  CompareRule,
  ComparisonOperator,
  CustomRule,
  EmailRule,
  NumericRule,
  PatternRule,
  RangeRule,
  RequiredRule,
  StringLengthRule,
  ValidationCallbackData,
  ValidationRule,
  ValidationStatus,
} from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import numberLocalization from '@js/common/core/localization/number';
import errors from '@js/core/errors';
import { EventsStrategy } from '@js/core/events_strategy';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error fromPromise is not typed in @js/core/utils/deferred
  fromPromise,
} from '@js/core/utils/deferred';
import {
  isBoolean,
  isDate,
  isDefined,
  isFunction,
  isNumeric, isObject,
  isPromise,
  isString,
} from '@js/core/utils/type';
import type { ValidationResult } from '@js/ui/validation_group';
import type Validator from '@ts/ui/validator';

/**
 * A validation group is identified by reference only: it can be a ValidationGroup
 * instance, a string, a Form, a Knockout view model or a grid row object.
 */
export type ValidationGroupKey = unknown;

interface InternalRuleFields {
  // holds whatever a user's validationCallback returned, so it is not necessarily boolean
  isValid?: unknown;
  value?: unknown;
  reevaluate?: boolean;
  validator?: Validator;
  index?: number;
  // set by editors themselves (date_box, number_box, masked text editors)
  editorSpecific?: boolean;
  // undocumented option of the numeric rule
  useCultureSettings?: boolean;
  // email rule delegates to the pattern rule
  pattern?: RegExp | string;
}

export type ValidationRuleInternal = ValidationRule & InternalRuleFields;

type RequiredRuleInternal = RequiredRule & InternalRuleFields;
type NumericRuleInternal = NumericRule & InternalRuleFields;
type RangeRuleInternal = RangeRule & InternalRuleFields;
type StringLengthRuleInternal = StringLengthRule & InternalRuleFields;
type CustomRuleInternal = CustomRule & InternalRuleFields;
type AsyncRuleInternal = AsyncRule & InternalRuleFields;
type CompareRuleInternal = CompareRule & InternalRuleFields;
type PatternRuleInternal = PatternRule & InternalRuleFields;
type EmailRuleInternal = EmailRule & InternalRuleFields;

export interface AsyncRuleResult {
  isValid?: boolean;
  message?: string;
}

// a user's validationCallback may return nothing at all
type RuleValidationResult = boolean | Promise<AsyncRuleResult> | undefined;

export interface ValidationResultInternal {
  name?: string;
  value?: unknown;
  brokenRule?: ValidationRuleInternal | null;
  brokenRules?: ValidationRuleInternal[] | null;
  isValid?: boolean;
  validationRules?: ValidationRuleInternal[];
  pendingRules?: ValidationRuleInternal[] | null;
  status?: ValidationStatus;
  complete?: Promise<ValidationResultInternal> | null;
  id?: string | null;
  validator?: Validator;
}

export interface GroupValidationResult {
  isValid?: boolean;
  brokenRules: ValidationRuleInternal[];
  validators: Validator[];
  status: ValidationStatus;
  complete: Promise<GroupValidationResult> | null;
}

export type GroupValidatedHandler = (result: GroupValidationResult) => void;

/**
 * Validation options shared by editors and the validator. `validationError(s)` are
 * intentionally opaque here: this code only passes them through and compares them
 * by reference.
 */
export interface ValidationOptions {
  isValid?: boolean;
  validationStatus?: ValidationStatus;
  validationError?: unknown;
  validationErrors?: unknown[] | null;
}

const EMAIL_VALIDATION_REGEX = /^[\d\w.+_-]+@[\d\w._-]+\.[\w]+$/i;

/**
 * Relational operators coerce their operands with ToNumber unless both of them are
 * strings. This helper reproduces that coercion in a form the compiler accepts.
 */
function toComparableValue(value: unknown): number | string {
  const primitive: unknown = isDefined(value) ? value.valueOf() : value;

  if (isNumeric(primitive) || isString(primitive)) {
    return primitive;
  }

  return Number(primitive);
}

type DataGetter = () => Record<string, unknown> | undefined;

function isDataGetter(value: unknown): value is DataGetter {
  return isFunction(value);
}

function getValidationCallbackParams(
  value: unknown,
  rule: CustomRuleInternal | AsyncRuleInternal,
): ValidationCallbackData {
  const { validator } = rule;
  // NOTE: a Knockout validator has no `option` method
  const dataGetter: unknown = validator && isFunction(validator.option)
    ? validator.option('dataGetter')
    : undefined;
  const extraParams = isDataGetter(dataGetter) ? dataGetter() : undefined;
  const params: ValidationCallbackData = {
    value,
    validator,
    rule,
  };
  if (extraParams) {
    Object.assign(params, extraParams);
  }
  return params;
}

const STATUS: Record<string, ValidationStatus> = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending',
};

abstract class BaseRuleValidator {
  public NAME!: string;

  constructor() {
    this.NAME = 'base';
  }

  defaultMessage(value?: string): string {
    // @ts-expect-error messageLocalization.getFormatter is declared as () => string
    return messageLocalization.getFormatter(`validation-${this.NAME}`)(value);
  }

  defaultFormattedMessage(value?: string): string {
    // @ts-expect-error messageLocalization.getFormatter is declared as () => string
    return messageLocalization.getFormatter(`validation-${this.NAME}-formatted`)(value);
  }

  _isValueEmpty(value: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return !rulesValidators.required.validate(value, { type: 'required' });
  }

  abstract validate(value: unknown, rule: ValidationRuleInternal): RuleValidationResult;
}

abstract class SyncRuleValidator extends BaseRuleValidator {
  validate(value: unknown, rule: ValidationRuleInternal): boolean {
    const valueArray = Array.isArray(value) ? value : [value];
    let result = true;

    if (valueArray.length) {
      valueArray.every((itemValue: unknown): boolean => {
        result = this._validate(itemValue, rule);
        return result;
      });
    } else {
      result = this._validate(null, rule);
    }

    return result;
  }

  abstract _validate(value: unknown, rule: ValidationRuleInternal): boolean;
}

class RequiredRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'required';
  }

  _validate(value: unknown, rule: RequiredRuleInternal): boolean {
    if (!isDefined(value)) return false;
    if (value === false) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const stringValue = String(value);
    if (rule.trim || !isDefined(rule.trim)) {
      return stringValue.trim() !== '';
    }
    return stringValue !== '';
  }
}

class NumericRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'numeric';
  }

  _validate(value: unknown, rule: NumericRuleInternal): boolean {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    if (rule.useCultureSettings && isString(value)) {
      const parsedValue = numberLocalization.parse(value);

      return parsedValue === null || (parsedValue !== undefined && !isNaN(parsedValue));
    }
    return isNumeric(value);
  }
}

class RangeRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'range';
  }

  _validate(value: unknown, rule: RangeRuleInternal): boolean {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const validNumber = rulesValidators.numeric.validate(value, rule);
    const validValue = isDefined(value) && value !== '';
    if (!(validNumber || isDate(value)) && !validValue) {
      return false;
    }
    const number = validNumber || !isDefined(value)
      ? parseFloat(String(value))
      : toComparableValue(value);
    const { min } = rule;
    const { max } = rule;
    if (isDefined(min)) {
      if (isDefined(max)) {
        return number >= min && number <= max;
      }
      return number >= min;
    }
    if (isDefined(max)) {
      return number <= max;
    }
    throw errors.Error('E0101');
  }
}

class StringLengthRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'stringLength';
  }

  _validate(value: unknown, rule: StringLengthRuleInternal): boolean {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const stringValue = String(value ?? '');
    const trimmedValue = rule.trim || !isDefined(rule.trim)
      ? stringValue.trim()
      : stringValue;
    if (rule.ignoreEmptyValue && this._isValueEmpty(trimmedValue)) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return rulesValidators.range.validate(
      trimmedValue.length,
      { ...rule },
    );
  }
}

class CustomRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'custom';
  }

  validate(value: unknown, rule: CustomRuleInternal): boolean | undefined {
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    const params = getValidationCallbackParams(value, rule);
    return rule.validationCallback?.(params);
  }
}

class AsyncRuleValidator extends BaseRuleValidator {
  constructor() {
    super();
    this.NAME = 'async';
  }

  validate(value: unknown, rule: AsyncRuleInternal): RuleValidationResult {
    if (!isDefined(rule.reevaluate)) {
      rule.reevaluate = true;
    }
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    const params = getValidationCallbackParams(value, rule);
    const callbackResult = rule.validationCallback?.(params);
    if (!isPromise(callbackResult)) {
      throw errors.Error('E0103');
    }
    return this._getWrappedPromise(fromPromise(callbackResult).promise());
  }

  _getWrappedPromise(promise: Promise<AsyncRuleResult>): Promise<AsyncRuleResult> {
    const deferred = Deferred<AsyncRuleResult>();
    promise.then((result): void => {
      deferred.resolve(result);
    }, (err: string | Record<string, unknown>): void => {
      const res: AsyncRuleResult = {
        isValid: false,
      };
      if (isDefined(err)) {
        if (isString(err)) {
          res.message = err;
        } else if (isObject(err) && isDefined(err.message) && isString(err.message)) {
          res.message = err.message;
        }
      }
      deferred.resolve(res);
    });
    return deferred.promise();
  }
}

class CompareRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'compare';
  }

  // eslint-disable-next-line consistent-return
  _validate(value: unknown, rule: CompareRuleInternal): boolean {
    if (!rule.comparisonTarget) {
      throw errors.Error('E0102');
    }
    if (rule.ignoreEmptyValue && this._isValueEmpty(value)) {
      return true;
    }
    rule.reevaluate = true;
    const otherValue: unknown = rule.comparisonTarget();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const type: ComparisonOperator = rule.comparisonType || '==';
    // eslint-disable-next-line default-case
    switch (type) {
      case '==':
        return value == otherValue; // eslint-disable-line eqeqeq
      case '!=':
        return value != otherValue; // eslint-disable-line eqeqeq
      case '===':
        return value === otherValue;
      case '!==':
        return value !== otherValue;
      case '>':
        return toComparableValue(value) > toComparableValue(otherValue);
      case '>=':
        return toComparableValue(value) >= toComparableValue(otherValue);
      case '<':
        return toComparableValue(value) < toComparableValue(otherValue);
      case '<=':
        return toComparableValue(value) <= toComparableValue(otherValue);
    }
  }
}

class PatternRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'pattern';
  }

  _validate(value: unknown, rule: PatternRuleInternal): boolean {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    const { pattern } = rule;
    const regExp = isString(pattern) ? new RegExp(pattern) : pattern;
    return Boolean(regExp?.test(String(value)));
  }
}

class EmailRuleValidator extends SyncRuleValidator {
  constructor() {
    super();
    this.NAME = 'email';
  }

  _validate(value: unknown, rule: EmailRuleInternal): boolean {
    if (rule.ignoreEmptyValue !== false && this._isValueEmpty(value)) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return rulesValidators.pattern.validate(
      value,
      {
        ...rule,
        pattern: EMAIL_VALIDATION_REGEX,
      },
    );
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

  email: new EmailRuleValidator(),
};

export class GroupConfig {
  group?: ValidationGroupKey;

  validators!: Validator[];

  _isRemovable?: boolean;

  _eventsStrategy!: EventsStrategy;

  _pendingValidators!: Validator[];

  _validationInfo!: {
    result: GroupValidationResult | null;
    deferred: DeferredObj<GroupValidationResult> | null;
  };

  constructor(group: ValidationGroupKey, isRemovable: boolean) {
    this.group = group;
    this.validators = [];
    this._isRemovable = isRemovable;
    this._pendingValidators = [];
    this._onValidatorStatusChanged = this._onValidatorStatusChanged.bind(this);
    this._resetValidationInfo();
    this._eventsStrategy = new EventsStrategy(this);
  }

  validate(): GroupValidationResult {
    const result: GroupValidationResult = {
      isValid: true,
      brokenRules: [],
      validators: [],
      status: STATUS.valid,
      complete: null,
    };
    this._unsubscribeFromAllChangeEvents();
    this._pendingValidators = [];
    this._resetValidationInfo();
    for (const validator of this.validators) {
      const validatorResult = validator.validate();
      result.isValid = result.isValid && validatorResult.isValid;
      if (validatorResult.brokenRules) {
        result.brokenRules = result.brokenRules.concat(validatorResult.brokenRules);
      }
      result.validators.push(validator);
      if (validatorResult.status === STATUS.pending) {
        this._addPendingValidator(validator);
      }
      this._subscribeToChangeEvents(validator);
    }
    if (this._pendingValidators.length) {
      result.status = STATUS.pending;
    } else {
      result.status = result.isValid ? STATUS.valid : STATUS.invalid;
      this._unsubscribeFromAllChangeEvents();
      this._raiseValidatedEvent(result);
    }
    this._updateValidationInfo(result);
    return { ...result };
  }

  _subscribeToChangeEvents(validator: Validator): void {
    validator.on('validating', this._onValidatorStatusChanged);
    validator.on('validated', this._onValidatorStatusChanged);
  }

  _unsubscribeFromChangeEvents(validator: Validator): void {
    validator.off('validating', this._onValidatorStatusChanged);
    validator.off('validated', this._onValidatorStatusChanged);
  }

  _unsubscribeFromAllChangeEvents(): void {
    for (const validator of this.validators) {
      this._unsubscribeFromChangeEvents(validator);
    }
  }

  _updateValidationInfo(result: GroupValidationResult): void {
    this._validationInfo.result = result;
    if (result.status !== STATUS.pending) {
      return;
    }
    if (!this._validationInfo.deferred) {
      this._validationInfo.deferred = Deferred<GroupValidationResult>();
      this._validationInfo.result.complete = this._validationInfo.deferred.promise();
    }
  }

  _addPendingValidator(validator: Validator): void {
    if (!this._pendingValidators.includes(validator)) {
      this._pendingValidators.push(validator);
    }
  }

  _removePendingValidator(validator: Validator): void {
    const index = this._pendingValidators.indexOf(validator);
    if (index >= 0) {
      this._pendingValidators.splice(index, 1);
    }
  }

  _orderBrokenRules(brokenRules: ValidationRuleInternal[]): ValidationRuleInternal[] {
    const orderedRules: ValidationRuleInternal[] = [];
    for (const validator of this.validators) {
      const foundRules = brokenRules.filter((rule): boolean => rule.validator === validator);
      if (foundRules.length) {
        orderedRules.push(...foundRules);
      }
    }
    return orderedRules;
  }

  _updateBrokenRules(result: ValidationResultInternal): void {
    if (!this._validationInfo.result) {
      return;
    }
    let { brokenRules } = this._validationInfo.result;
    const rules = brokenRules.filter((rule): boolean => rule.validator !== result.validator);
    if (result.brokenRules) {
      brokenRules = rules.concat(result.brokenRules);
    }
    this._validationInfo.result.brokenRules = this._orderBrokenRules(brokenRules);
  }

  _onValidatorStatusChanged(result: ValidationResultInternal): void {
    if (result.status === STATUS.pending) {
      if (result.validator) {
        this._addPendingValidator(result.validator);
      }
      return;
    }
    this._resolveIfComplete(result);
  }

  _resolveIfComplete(result: ValidationResultInternal): void {
    if (result.validator) {
      this._removePendingValidator(result.validator);
    }
    this._updateBrokenRules(result);
    if (!this._pendingValidators.length) {
      this._unsubscribeFromAllChangeEvents();
      if (!this._validationInfo.result) {
        return;
      }
      this._validationInfo.result.status = this._validationInfo.result.brokenRules.length === 0
        ? STATUS.valid
        : STATUS.invalid;
      this._validationInfo.result.isValid = this._validationInfo.result.status === STATUS.valid;
      const res: GroupValidationResult = { ...this._validationInfo.result, complete: null };
      const { deferred } = this._validationInfo;
      this._validationInfo.deferred = null;
      this._raiseValidatedEvent(res);
      if (deferred) {
        // eslint-disable-next-line no-restricted-globals
        setTimeout((): void => {
          deferred.resolve(res);
        });
      }
    }
  }

  _raiseValidatedEvent(result: GroupValidationResult): void {
    this._eventsStrategy.fireEvent('validated', [result]);
  }

  _resetValidationInfo(): void {
    this._validationInfo = {
      result: null,
      deferred: null,
    };
  }

  _synchronizeValidationInfo(): void {
    if (this._validationInfo.result) {
      this._validationInfo.result.validators = this.validators;
    }
  }

  removeRegisteredValidator(validator: Validator): void {
    const index = this.validators.indexOf(validator);
    if (index > -1) {
      this.validators.splice(index, 1);
      this._synchronizeValidationInfo();
      this._resolveIfComplete({ validator });
    }
  }

  registerValidator(validator: Validator): void {
    if (!this.validators.includes(validator)) {
      this.validators.push(validator);
      this._synchronizeValidationInfo();
    }
  }

  reset(): void {
    for (const validator of this.validators) {
      validator.reset();
    }
    this._pendingValidators = [];
    this._resetValidationInfo();
  }

  on(eventName: string, eventHandler: GroupValidatedHandler): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName: string, eventHandler?: GroupValidatedHandler): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
}

interface AsyncRuleItem {
  rule: ValidationRuleInternal;
  ruleValidator: BaseRuleValidator;
}

const ValidationEngine = {
  groups: [],

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  getGroupConfig(group: ValidationGroupKey) {
    const result = this.groups.filter((config): boolean => config.group === group);
    if (result.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result[0];
    }
    return undefined;
  },

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  findGroup($element, model: ValidationGroupKey): ValidationGroupKey {
    const hasValidationGroup = $element.data()?.dxComponents?.includes('dxValidationGroup');
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

  initGroups(): void {
    this.groups = [];
    this.addGroup(undefined, false);
  },

  addGroup(group: ValidationGroupKey, isRemovable = true): GroupConfig {
    let config: GroupConfig | undefined = this.getGroupConfig(group);
    if (!config) {
      config = new GroupConfig(group, isRemovable);
      this.groups.push(config);
    }
    return config;
  },

  removeGroup(group: ValidationGroupKey): GroupConfig | undefined {
    const config: GroupConfig | undefined = this.getGroupConfig(group);
    const index = this.groups.indexOf(config);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
    return config;
  },

  _setDefaultMessage(info: {
    rule: ValidationRuleInternal;
    validator: BaseRuleValidator;
    name?: string;
  }): void {
    const { rule, validator, name } = info;
    if (!isDefined(rule.message)) {
      if (validator.defaultFormattedMessage && isDefined(name)) {
        rule.message = validator.defaultFormattedMessage(name);
      } else {
        rule.message = validator.defaultMessage();
      }
    }
  },

  _addBrokenRule(info: {
    result: ValidationResultInternal;
    rule: ValidationRuleInternal;
  }): void {
    const { result, rule } = info;
    result.brokenRule ??= rule;
    result.brokenRules ??= [];
    result.brokenRules.push(rule);
  },

  validate(
    value: unknown,
    rules: ValidationRuleInternal[] | undefined,
    name?: string,
  ): ValidationResultInternal {
    let result: ValidationResultInternal = {
      name,
      value,
      brokenRule: null,
      brokenRules: null,
      isValid: true,
      validationRules: rules,
      pendingRules: null,
      status: STATUS.valid,
      complete: null,
    };
    const validator = rules?.[0]?.validator;

    const asyncRuleItems: AsyncRuleItem[] = [];

    (rules ?? []).some((rule): boolean => {
      const ruleValidator: BaseRuleValidator | undefined = rulesValidators[rule.type];

      if (!ruleValidator) {
        throw errors.Error('E0100');
      }

      if (isDefined(rule.isValid) && rule.value === value && !rule.reevaluate) {
        if (!rule.isValid) {
          result.isValid = false;
          this._addBrokenRule({ result, rule });
          return true;
        }
        return false;
      }

      rule.value = value;
      if (rule.type === 'async') {
        asyncRuleItems.push({ rule, ruleValidator });
        return false;
      }

      const ruleValidationResult = ruleValidator.validate(value, rule);
      rule.isValid = ruleValidationResult;

      if (!ruleValidationResult) {
        result.isValid = false;
        this._setDefaultMessage({ rule, validator: ruleValidator, name });
        this._addBrokenRule({ result, rule });
      }

      if (!rule.isValid) {
        return true;
      }

      return false;
    });

    if (result.isValid && !result.brokenRules && asyncRuleItems.length) {
      result = this._validateAsyncRules({
        value,
        items: asyncRuleItems,
        result,
        name,
      });
    }

    this._synchronizeGroupValidationInfo(validator, result);

    if (result.pendingRules) {
      result.status = STATUS.pending;
    } else if (result.isValid) {
      result.status = STATUS.valid;
    } else {
      result.status = STATUS.invalid;
    }

    return result;
  },

  _synchronizeGroupValidationInfo(
    validator: Validator | undefined,
    result: ValidationResultInternal,
  ): void {
    if (!validator) {
      return;
    }
    const groupConfig: GroupConfig | undefined = ValidationEngine
      .getGroupConfig(validator._validationGroup);
    groupConfig?._updateBrokenRules({ validator, brokenRules: result.brokenRules ?? [] });
  },

  _validateAsyncRules({
    result, value, items, name,
  }: {
    result: ValidationResultInternal;
    value: unknown;
    items: AsyncRuleItem[];
    name?: string;
  }): ValidationResultInternal {
    const asyncResults: Promise<AsyncRuleResult>[] = [];

    for (const item of items) {
      const validateResult = item.ruleValidator.validate(value, item.rule);

      if (!isPromise(validateResult)) {
        this._updateRuleConfig({
          rule: item.rule,
          ruleResult: this._getPatchedRuleResult(validateResult),
          validator: item.ruleValidator,
          name,
        });
      } else {
        result.pendingRules ??= [];
        result.pendingRules.push(item.rule);

        const asyncResult = validateResult.then((res: AsyncRuleResult): AsyncRuleResult => {
          const ruleResult = this._getPatchedRuleResult(res);
          this._updateRuleConfig({
            rule: item.rule,
            ruleResult,
            validator: item.ruleValidator,
            name,
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return ruleResult;
        });

        asyncResults.push(asyncResult);
      }
    }

    if (asyncResults.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      result.complete = Promise.all(asyncResults).then((values) => this._getAsyncRulesResult({
        result,
        values,
      }));
    }
    return result;
  },

  _updateRuleConfig({
    rule, ruleResult, validator, name,
  }: {
    rule: ValidationRuleInternal;
    ruleResult: AsyncRuleResult;
    validator: BaseRuleValidator;
    name?: string;
  }): void {
    rule.isValid = ruleResult.isValid;
    if (!ruleResult.isValid) {
      if (
        isDefined(ruleResult.message)
        && isString(ruleResult.message)
        && ruleResult.message.length
      ) {
        rule.message = ruleResult.message;
      } else {
        this._setDefaultMessage({
          rule,
          validator,
          name,
        });
      }
    }
  },

  _getPatchedRuleResult(ruleResult: AsyncRuleResult | boolean): AsyncRuleResult {
    const defaultIsValid = true;
    if (isObject(ruleResult)) {
      const result: AsyncRuleResult = { ...ruleResult };
      if (!isDefined(result.isValid)) {
        result.isValid = defaultIsValid;
      }
      return result;
    }
    return {
      isValid: isBoolean(ruleResult) ? ruleResult : defaultIsValid,
    };
  },

  _getAsyncRulesResult({ values, result }: {
    values: AsyncRuleResult[];
    result: ValidationResultInternal;
  }): ValidationResultInternal {
    const { pendingRules } = result;

    values.forEach((val, index): void => {
      if (val.isValid === false) {
        result.isValid = val.isValid;
        const rule = pendingRules?.[index];
        if (rule) {
          this._addBrokenRule({
            result,
            rule,
          });
        }
      }
    });
    result.pendingRules = null;
    result.complete = null;
    result.status = result.isValid ? STATUS.valid : STATUS.invalid;
    return result;
  },

  registerValidatorInGroup(group: ValidationGroupKey, validator: Validator): void {
    const groupConfig = ValidationEngine.addGroup(group);
    groupConfig.registerValidator.call(groupConfig, validator);
  },

  removeRegisteredValidator(group: ValidationGroupKey, validator: Validator): void {
    const config: GroupConfig | undefined = ValidationEngine.getGroupConfig(group);
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

  initValidationOptions(options?: ValidationOptions): ValidationOptions {
    const initedOptions: ValidationOptions = {};

    if (options) {
      const syncOptions: (keyof ValidationOptions)[] = ['isValid', 'validationStatus', 'validationError', 'validationErrors'];

      syncOptions.forEach((prop) => {
        if (prop in options) {
          Object.assign(
            initedOptions,
            this.synchronizeValidationOptions({ name: prop, value: options[prop] }, options),
          );
        }
      });
    }

    return initedOptions;
  },

  synchronizeValidationOptions(
    { name, value }: { name: string; value: unknown },
    options: ValidationOptions,
  ): ValidationOptions {
    // eslint-disable-next-line default-case
    switch (name) {
      case 'validationStatus': {
        const isValid = value === STATUS.valid || value === STATUS.pending;

        return options.isValid !== isValid ? { isValid } : {};
      }
      case 'isValid': {
        const { validationStatus } = options;
        let newStatus = validationStatus;

        if (value && validationStatus === STATUS.invalid) {
          newStatus = STATUS.valid;
        } else if (!value && validationStatus !== STATUS.invalid) {
          newStatus = STATUS.invalid;
        }

        return newStatus !== validationStatus ? { validationStatus: newStatus } : {};
      }
      case 'validationErrors': {
        const errorList = Array.isArray(value) ? value : undefined;
        const validationError = !errorList?.length ? null : errorList[0];

        return options.validationError !== validationError ? { validationError } : {};
      }
      case 'validationError': {
        const { validationErrors } = options;

        if (!value && validationErrors) {
          return { validationErrors: null };
        } if (value && !validationErrors) {
          return { validationErrors: [value] };
        } if (value && validationErrors && value !== validationErrors[0]) {
          validationErrors[0] = value;
          return { validationErrors: validationErrors.slice() };
        }
      }
    }

    return {};
  },

  validateGroup(group: ValidationGroupKey): ValidationResult {
    const groupConfig = ValidationEngine.getGroupConfig(group);
    if (!groupConfig) {
      throw errors.Error('E0110');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return groupConfig.validate();
  },

  resetGroup(group: ValidationGroupKey): void {
    const groupConfig: GroupConfig | undefined = ValidationEngine.getGroupConfig(group);
    if (!groupConfig) {
      throw errors.Error('E0110');
    }
    groupConfig.reset();
  },
};

ValidationEngine.initGroups();

export default ValidationEngine;
