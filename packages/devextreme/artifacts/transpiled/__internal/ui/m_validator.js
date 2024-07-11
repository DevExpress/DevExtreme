"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _dom_component = _interopRequireDefault(require("../../core/dom_component"));
var _element_data = require("../../core/element_data");
var _guid = _interopRequireDefault(require("../../core/guid"));
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _ui = _interopRequireDefault(require("../../ui/widget/ui.errors"));
var _m_validation_engine = _interopRequireDefault(require("./m_validation_engine"));
var _m_default_adapter = _interopRequireDefault(require("./validation/m_default_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const VALIDATION_STATUS_PENDING = 'pending';
// @ts-expect-error
const Validator = _dom_component.default.inherit({
  _initOptions(options) {
    this.callBase.apply(this, arguments);
    this.option(_m_validation_engine.default.initValidationOptions(options));
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      validationRules: []
    });
  },
  _init() {
    this.callBase();
    this._initGroupRegistration();
    this.focused = (0, _callbacks.default)();
    this._initAdapter();
    this._validationInfo = {
      result: null,
      deferred: null,
      skipValidation: false
    };
  },
  _initGroupRegistration() {
    const group = this._findGroup();
    if (!this._groupWasInit) {
      this.on('disposing', args => {
        _m_validation_engine.default.removeRegisteredValidator(args.component._validationGroup, args.component);
      });
    }
    if (!this._groupWasInit || this._validationGroup !== group) {
      _m_validation_engine.default.removeRegisteredValidator(this._validationGroup, this);
      this._groupWasInit = true;
      this._validationGroup = group;
      _m_validation_engine.default.registerValidatorInGroup(group, this);
    }
  },
  _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      validationGroup: true
    });
  },
  _getEditor() {
    const element = this.$element()[0];
    return (0, _element_data.data)(element, 'dx-validation-target');
  },
  _initAdapter() {
    const dxStandardEditor = this._getEditor();
    let adapter = this.option('adapter');
    if (!adapter) {
      if (dxStandardEditor) {
        adapter = new _m_default_adapter.default(dxStandardEditor, this);
        adapter.validationRequestsCallbacks.push(args => {
          if (this._validationInfo.skipValidation) {
            return;
          }
          this.validate(args);
        });
        this.option('adapter', adapter);
        return;
      }
      throw _ui.default.Error('E0120');
    }
    const callbacks = adapter.validationRequestsCallbacks;
    if (callbacks) {
      callbacks.push(args => {
        this.validate(args);
      });
    }
  },
  _toggleRTLDirection(isRtl) {
    var _this$option;
    const rtlEnabled = ((_this$option = this.option('adapter')) === null || _this$option === void 0 || (_this$option = _this$option.editor) === null || _this$option === void 0 ? void 0 : _this$option.option('rtlEnabled')) ?? isRtl;
    this.callBase(rtlEnabled);
  },
  _initMarkup() {
    this.$element().addClass(VALIDATOR_CLASS);
    this.callBase();
  },
  _render() {
    this.callBase();
    this._toggleAccessibilityAttributes();
  },
  _toggleAccessibilityAttributes() {
    const dxStandardEditor = this._getEditor();
    if (dxStandardEditor) {
      const rules = this.option('validationRules') || [];
      const isRequired = rules.some(_ref => {
        let {
          type
        } = _ref;
        return type === 'required';
      }) || null;
      if (dxStandardEditor.isInitialized()) {
        dxStandardEditor.setAria('required', isRequired);
      }
      dxStandardEditor.option('_onMarkupRendered', () => {
        dxStandardEditor.setAria('required', isRequired);
      });
    }
  },
  _visibilityChanged(visible) {
    if (visible) {
      this._initGroupRegistration();
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'validationGroup':
        this._initGroupRegistration();
        return;
      case 'validationRules':
        this._resetValidationRules();
        this._toggleAccessibilityAttributes();
        this.option('isValid') !== undefined && this.validate();
        return;
      case 'adapter':
        this._initAdapter();
        break;
      case 'isValid':
      case 'validationStatus':
        this.option(_m_validation_engine.default.synchronizeValidationOptions(args, this.option()));
        break;
      default:
        this.callBase(args);
    }
  },
  _getValidationRules() {
    if (!this._validationRules) {
      this._validationRules = (0, _iterator.map)(this.option('validationRules'), (rule, index) => (0, _extend.extend)({}, rule, {
        validator: this,
        index
      }));
    }
    return this._validationRules;
  },
  _findGroup() {
    const $element = this.$element();
    return this.option('validationGroup') || _m_validation_engine.default.findGroup($element, this._modelByElement($element));
  },
  _resetValidationRules() {
    delete this._validationRules;
  },
  validate(args) {
    const adapter = this.option('adapter');
    const name = this.option('name');
    const bypass = adapter.bypass && adapter.bypass();
    const value = args && args.value !== undefined ? args.value : adapter.getValue();
    const currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError();
    const rules = this._getValidationRules();
    const currentResult = this._validationInfo && this._validationInfo.result;
    if (currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
      return (0, _extend.extend)({}, currentResult);
    }
    let result;
    if (bypass) {
      result = {
        isValid: true,
        status: VALIDATION_STATUS_VALID
      };
    } else if (currentError && currentError.editorSpecific) {
      currentError.validator = this;
      result = {
        isValid: false,
        status: VALIDATION_STATUS_INVALID,
        brokenRule: currentError,
        brokenRules: [currentError]
      };
    } else {
      result = _m_validation_engine.default.validate(value, rules, name);
    }
    result.id = new _guid.default().toString();
    this._applyValidationResult(result, adapter);
    result.complete && result.complete.then(res => {
      if (res.id === this._validationInfo.result.id) {
        this._applyValidationResult(res, adapter);
      }
    });
    return (0, _extend.extend)({}, this._validationInfo.result);
  },
  reset() {
    const adapter = this.option('adapter');
    const result = {
      id: null,
      isValid: true,
      brokenRule: null,
      brokenRules: null,
      pendingRules: null,
      status: VALIDATION_STATUS_VALID,
      complete: null
    };
    this._validationInfo.skipValidation = true;
    adapter.reset();
    this._validationInfo.skipValidation = false;
    this._resetValidationRules();
    this._applyValidationResult(result, adapter);
  },
  _updateValidationResult(result) {
    if (!this._validationInfo.result || this._validationInfo.result.id !== result.id) {
      const complete = this._validationInfo.deferred && this._validationInfo.result.complete;
      this._validationInfo.result = (0, _extend.extend)({}, result, {
        complete
      });
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const prop in result) {
        if (prop !== 'id' && prop !== 'complete') {
          this._validationInfo.result[prop] = result[prop];
        }
      }
    }
  },
  _applyValidationResult(result, adapter) {
    const validatedAction = this._createActionByOption('onValidated', {
      excludeValidators: ['readOnly']
    });
    result.validator = this;
    this._updateValidationResult(result);
    adapter.applyValidationResults && adapter.applyValidationResults(this._validationInfo.result);
    this.option({
      validationStatus: this._validationInfo.result.status
    });
    if (this._validationInfo.result.status === VALIDATION_STATUS_PENDING) {
      if (!this._validationInfo.deferred) {
        this._validationInfo.deferred = (0, _deferred.Deferred)();
        this._validationInfo.result.complete = this._validationInfo.deferred.promise();
      }
      this._eventsStrategy.fireEvent('validating', [this._validationInfo.result]);
      return;
    }
    if (this._validationInfo.result.status !== VALIDATION_STATUS_PENDING) {
      validatedAction(result);
      if (this._validationInfo.deferred) {
        this._validationInfo.deferred.resolve(result);
        this._validationInfo.deferred = null;
      }
    }
  },
  focus() {
    const adapter = this.option('adapter');
    adapter && adapter.focus && adapter.focus();
  },
  _useTemplates() {
    return false;
  }
});
(0, _component_registrator.default)('dxValidator', Validator);
var _default = exports.default = Validator;