import type { ValidationRule, ValidationStatus } from '@js/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { EventHandler } from '@ts/core/events_strategy';
import { EventsStrategy } from '@ts/core/events_strategy';
import { Guid } from '@ts/core/guid';
import { Deferred } from '@ts/core/utils/m_deferred';
import { extend } from '@ts/core/utils/m_extend';
import { each, map } from '@ts/core/utils/m_iterator';
import type { ValidationResultInternal, ValidationRuleInternal } from '@ts/ui/validation_engine';
import ValidationEngine from '@ts/ui/validation_engine';
import type { Observable } from 'knockout';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

const VALIDATION_STATUS_VALID: ValidationStatus = 'valid';
const VALIDATION_STATUS_PENDING: ValidationStatus = 'pending';

interface KoDxValidatorOptions {
  name?: string;
  validationRules?: ValidationRule[];
}

interface ValidationInfo {
  result: ValidationResultInternal | null;
  deferred: DeferredObj<ValidationResultInternal> | null;
}

interface ValidatedObservable extends Observable {
  dxValidator?: KoDxValidator;
}

class KoDxValidator {
  target: ValidatedObservable;

  name: string | undefined;

  isValid: Observable<boolean | undefined>;

  validationError: Observable<ValidationRuleInternal | null | undefined>;

  validationErrors: Observable<ValidationRuleInternal[] | null | undefined>;

  validationStatus: Observable<ValidationStatus | undefined>;

  _eventsStrategy: EventsStrategy;

  validationRules: ValidationRuleInternal[];

  _validationInfo: ValidationInfo;

  constructor(target: ValidatedObservable, { name, validationRules }: KoDxValidatorOptions) {
    this.target = target;
    this.name = name;
    this.isValid = ko.observable<boolean | undefined>(true);
    this.validationError = ko.observable<ValidationRuleInternal | null>();
    this.validationErrors = ko.observable<ValidationRuleInternal[] | null>();
    this.validationStatus = ko.observable<ValidationStatus | undefined>(VALIDATION_STATUS_VALID);
    this._eventsStrategy = new EventsStrategy(this);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
    this.validationRules = map(validationRules, (rule, index) => extend({}, rule, {
      validator: this,
      index,
    }));
    this._validationInfo = {
      result: null,
      deferred: null,
    };
  }

  _updateValidationResult(result: ValidationResultInternal): ValidationResultInternal {
    const { result: currentResult } = this._validationInfo;

    if (!currentResult || currentResult.id !== result.id) {
      const complete = this._validationInfo.deferred && currentResult?.complete;
      const updatedResult: ValidationResultInternal = extend({}, result, { complete });
      this._validationInfo.result = updatedResult;

      return updatedResult;
    }

    const { id, complete, ...restResultProperties } = result;
    Object.assign(currentResult, restResultProperties);

    return currentResult;
  }

  validate(): ValidationResultInternal {
    const currentResult = this._validationInfo?.result;
    const value = this.target();
    if (currentResult?.status === VALIDATION_STATUS_PENDING
      && currentResult.value === value
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
      return extend({}, currentResult);
    }
    const result = ValidationEngine.validate(value, this.validationRules, this.name);
    result.id = new Guid().toString();
    this._applyValidationResult(result);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    result?.complete?.then((res) => {
      if (res.id === this._validationInfo.result?.id) {
        this._applyValidationResult(res);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() is untyped
    return extend({}, this._validationInfo.result);
  }

  reset(): ValidationResultInternal {
    this.target(null);
    const result: ValidationResultInternal = {
      id: null,
      isValid: true,
      brokenRule: null,
      pendingRules: null,
      status: VALIDATION_STATUS_VALID,
      complete: null,
    };

    this._applyValidationResult(result);
    return result;
  }

  _applyValidationResult(result: ValidationResultInternal): void {
    // @ts-expect-error the engine expects the Validator widget here, this validator duck-types it
    result.validator = this;
    const currentResult = this._updateValidationResult(result);
    const { dxValidator } = this.target;
    dxValidator?.isValid(currentResult.isValid);
    dxValidator?.validationError(currentResult.brokenRule);
    dxValidator?.validationErrors(currentResult.brokenRules);
    dxValidator?.validationStatus(currentResult.status);
    if (result.status === VALIDATION_STATUS_PENDING) {
      if (!this._validationInfo.deferred) {
        this._validationInfo.deferred = Deferred<ValidationResultInternal>();
        currentResult.complete = this._validationInfo.deferred.promise();
      }
      this._eventsStrategy.fireEvent('validating', [currentResult]);
      return;
    }
    this._eventsStrategy.fireEvent('validated', [result]);
    if (this._validationInfo.deferred) {
      this._validationInfo.deferred.resolve(result);
      this._validationInfo.deferred = null;
    }
  }

  on(eventName: string, eventHandler: EventHandler): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  off(eventName: string, eventHandler: EventHandler): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
}

const hasDxValidator = (
  member: unknown,
): member is ValidatedObservable & { dxValidator: KoDxValidator } => ko.isObservable(member)
  && 'dxValidator' in member
  && !!member.dxValidator;

if (ko) {
  ko.extenders.dxValidator = (
    target: ValidatedObservable,
    option: KoDxValidatorOptions,
  ): ValidatedObservable => {
    const validator = new KoDxValidator(target, option);
    target.dxValidator = validator;
    target.subscribe(validator.validate.bind(validator));

    return target;
  };

  // TODO: MODULARITY: Move this to another place?
  Object.assign(ValidationEngine, {
    registerModelForValidation(model: object): void {
      each(model, (_, member: unknown) => {
        if (hasDxValidator(member)) {
          // @ts-expect-error the engine expects the Validator widget, this validator duck-types it
          ValidationEngine.registerValidatorInGroup(model, member.dxValidator);
        }
      });
    },

    unregisterModelForValidation(model: object): void {
      each(model, (_, member: unknown) => {
        if (hasDxValidator(member)) {
          // @ts-expect-error the engine expects the Validator widget, this validator duck-types it
          ValidationEngine.removeRegisteredValidator(model, member.dxValidator);
        }
      });
    },

    validateModel: ValidationEngine.validateGroup,
  });
}
