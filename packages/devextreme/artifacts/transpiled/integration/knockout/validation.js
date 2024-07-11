"use strict";

var _iterator = require("../../core/utils/iterator");
var _extend = require("../../core/utils/extend");
var _class = _interopRequireDefault(require("../../core/class"));
var _events_strategy = require("../../core/events_strategy");
var _validation_engine = _interopRequireDefault(require("../../ui/validation_engine"));
var _deferred = require("../../core/utils/deferred");
var _guid = _interopRequireDefault(require("../../core/guid"));
var _knockout = _interopRequireDefault(require("knockout"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

if (_knockout.default) {
  const VALIDATION_STATUS_VALID = 'valid';
  const VALIDATION_STATUS_PENDING = 'pending';
  const koDxValidator = _class.default.inherit({
    ctor(target, _ref) {
      let {
        name,
        validationRules
      } = _ref;
      this.target = target;
      this.name = name;
      this.isValid = _knockout.default.observable(true);
      this.validationError = _knockout.default.observable();
      this.validationErrors = _knockout.default.observable();
      this.validationStatus = _knockout.default.observable(VALIDATION_STATUS_VALID);
      this._eventsStrategy = new _events_strategy.EventsStrategy(this);
      this.validationRules = (0, _iterator.map)(validationRules, (rule, index) => {
        return (0, _extend.extend)({}, rule, {
          validator: this,
          index: index
        });
      });
      this._validationInfo = {
        result: null,
        deferred: null
      };
    },
    _updateValidationResult(result) {
      if (!this._validationInfo.result || this._validationInfo.result.id !== result.id) {
        const complete = this._validationInfo.deferred && this._validationInfo.result.complete;
        this._validationInfo.result = (0, _extend.extend)({}, result, {
          complete
        });
      } else {
        for (const prop in result) {
          if (prop !== 'id' && prop !== 'complete') {
            this._validationInfo.result[prop] = result[prop];
          }
        }
      }
    },
    validate() {
      const currentResult = this._validationInfo && this._validationInfo.result;
      const value = this.target();
      if (currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
        return (0, _extend.extend)({}, currentResult);
      }
      const result = _validation_engine.default.validate(value, this.validationRules, this.name);
      result.id = new _guid.default().toString();
      this._applyValidationResult(result);
      result.complete && result.complete.then(res => {
        if (res.id === this._validationInfo.result.id) {
          this._applyValidationResult(res);
        }
      });
      return (0, _extend.extend)({}, this._validationInfo.result);
    },
    reset() {
      this.target(null);
      const result = {
        id: null,
        isValid: true,
        brokenRule: null,
        pendingRules: null,
        status: VALIDATION_STATUS_VALID,
        complete: null
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
          this._validationInfo.deferred = new _deferred.Deferred();
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
    on(eventName, eventHandler) {
      this._eventsStrategy.on(eventName, eventHandler);
      return this;
    },
    off(eventName, eventHandler) {
      this._eventsStrategy.off(eventName, eventHandler);
      return this;
    }
  });
  _knockout.default.extenders.dxValidator = function (target, option) {
    target.dxValidator = new koDxValidator(target, option);
    target.subscribe(target.dxValidator.validate.bind(target.dxValidator));
    return target;
  };

  // TODO: MODULARITY: Move this to another place?

  _validation_engine.default.registerModelForValidation = function (model) {
    (0, _iterator.each)(model, function (name, member) {
      if (_knockout.default.isObservable(member) && member.dxValidator) {
        _validation_engine.default.registerValidatorInGroup(model, member.dxValidator);
      }
    });
  };
  _validation_engine.default.unregisterModelForValidation = function (model) {
    (0, _iterator.each)(model, function (name, member) {
      if (_knockout.default.isObservable(member) && member.dxValidator) {
        _validation_engine.default.removeRegisteredValidator(model, member.dxValidator);
      }
    });
  };
  _validation_engine.default.validateModel = _validation_engine.default.validateGroup;
}