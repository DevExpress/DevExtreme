import Class from '@ts/core/m_class';
import { EventsStrategy } from '@ts/core/m_events_strategy';
import { Guid } from '@ts/core/m_guid';
import { Deferred } from '@ts/core/utils/m_deferred';
import { extend } from '@ts/core/utils/m_extend';
import { each, map } from '@ts/core/utils/m_iterator';
import ValidationEngine from '@ts/ui/m_validation_engine';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

if (ko) {
  const VALIDATION_STATUS_VALID = 'valid';
  const VALIDATION_STATUS_PENDING = 'pending';

  const koDxValidator = Class.inherit({
    ctor(target, { name, validationRules }) {
      this.target = target;
      this.name = name;
      this.isValid = ko.observable(true);
      this.validationError = ko.observable();
      this.validationErrors = ko.observable();
      this.validationStatus = ko.observable(VALIDATION_STATUS_VALID);
      this._eventsStrategy = new EventsStrategy(this);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      this.validationRules = map(validationRules, (rule, index) => extend({}, rule, {
        validator: this,
        index,
      }));
      this._validationInfo = {
        result: null,
        deferred: null,
      };
    },

    _updateValidationResult(result) {
      if (!this._validationInfo.result || this._validationInfo.result.id !== result.id) {
        const complete = this._validationInfo.deferred && this._validationInfo.result.complete;
        this._validationInfo.result = extend({}, result, { complete });
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const prop in result) {
          if (prop !== 'id' && prop !== 'complete') {
            this._validationInfo.result[prop] = result[prop];
          }
        }
      }
    },

    validate() {
      const currentResult = this._validationInfo?.result;
      const value = this.target();
      if (currentResult
        && currentResult.status === VALIDATION_STATUS_PENDING
        && currentResult.value === value
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return extend({}, currentResult);
      }
      const result = ValidationEngine.validate(value, this.validationRules, this.name);
      // @ts-expect-error
      result.id = new Guid().toString();
      this._applyValidationResult(result);
      // @ts-expect-error
      result.complete?.then((res) => {
        if (res.id === this._validationInfo.result.id) {
          this._applyValidationResult(res);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return extend({}, this._validationInfo.result);
    },

    reset() {
      this.target(null);
      const result = {
        id: null,
        isValid: true,
        brokenRule: null,
        pendingRules: null,
        status: VALIDATION_STATUS_VALID,
        complete: null,
      };

      this._applyValidationResult(result);
      return result;
    },

    _applyValidationResult(result) {
      result.validator = this;
      this._updateValidationResult(result);
      this.target.dxValidator.isValid(this._validationInfo.result.isValid);
      this.target.dxValidator.validationError(this._validationInfo.result.brokenRule);
      this.target.dxValidator.validationErrors(this._validationInfo.result.brokenRules);
      this.target.dxValidator.validationStatus(this._validationInfo.result.status);
      if (result.status === VALIDATION_STATUS_PENDING) {
        if (!this._validationInfo.deferred) {
          // @ts-expect-error
          this._validationInfo.deferred = new Deferred();
          this._validationInfo.result.complete = this._validationInfo.deferred.promise();
        }
        this._eventsStrategy.fireEvent('validating', [this._validationInfo.result]);
        return;
      }
      if (result.status !== VALIDATION_STATUS_PENDING) {
        this._eventsStrategy.fireEvent('validated', [result]);
        if (this._validationInfo.deferred) {
          this._validationInfo.deferred.resolve(result);
          this._validationInfo.deferred = null;
        }
      }
    },

    on(eventName: string, eventHandler) {
      this._eventsStrategy.on(eventName, eventHandler);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this;
    },

    off(eventName: string, eventHandler) {
      this._eventsStrategy.off(eventName, eventHandler);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this;
    },
  });

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,func-names
  ko.extenders.dxValidator = function (target, option) {
    // eslint-disable-next-line new-cap
    target.dxValidator = new koDxValidator(target, option);
    target.subscribe(target.dxValidator.validate.bind(target.dxValidator));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return target;
  };

  // TODO: MODULARITY: Move this to another place?
  // @ts-expect-error
  // eslint-disable-next-line func-names
  ValidationEngine.registerModelForValidation = function (model): void {
    each(model, (_, member) => {
      // @ts-expect-error
      if (ko.isObservable(member) && member.dxValidator) {
        // @ts-expect-error
        ValidationEngine.registerValidatorInGroup(model, member.dxValidator);
      }
    });
  };

  // @ts-expect-error
  // eslint-disable-next-line func-names
  ValidationEngine.unregisterModelForValidation = function (model): void {
    each(model, (_, member) => {
      // @ts-expect-error
      if (ko.isObservable(member) && member.dxValidator) {
        // @ts-expect-error
        ValidationEngine.removeRegisteredValidator(model, member.dxValidator);
      }
    });
  };

  // @ts-expect-error
  ValidationEngine.validateModel = ValidationEngine.validateGroup;
}
