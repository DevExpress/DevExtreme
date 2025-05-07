import type { ValidationRule } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import { data as elementData } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import type { Properties, ValidationResult } from '@js/ui/validator';
import errors from '@js/ui/widget/ui.errors';
import DOMComponent from '@ts/core/widget/dom_component';

import ValidationEngine from './m_validation_engine';
import type ValidationGroup from './m_validation_group';
import DefaultAdapter from './validation/m_default_adapter';

const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const VALIDATION_STATUS_PENDING = 'pending';

class Validator extends DOMComponent<Validator, Properties> {
  _groupWasInit?: boolean;

  focused?: Callback;

  _validationInfo!: {
    result: ValidationResult;
    deferred: DeferredObj<ValidationResult> | null;
    skipValidation: boolean;
  };

  _validationRules?: ValidationRule[];

  _validationGroup?: ValidationGroup;

  _initOptions(options): void {
    // @ts-expect-error ts-error
    super._initOptions.apply(this, arguments);
    this.option(ValidationEngine.initValidationOptions(options));
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      validationRules: [],
    };
  }

  _init(): void {
    super._init();
    this._initGroupRegistration();
    this.focused = Callbacks();
    this._initAdapter();
    this._validationInfo = {
      // @ts-expect-error ts-error
      result: null,
      deferred: null,
      skipValidation: false,
    };
  }

  _initGroupRegistration(): void {
    const group = this._findGroup();
    if (!this._groupWasInit) {
      this.on('disposing', (args) => {
        ValidationEngine.removeRegisteredValidator(args.component._validationGroup, args.component);
      });
    }
    if (!this._groupWasInit || this._validationGroup !== group) {
      ValidationEngine.removeRegisteredValidator(this._validationGroup, this);
      this._groupWasInit = true;
      this._validationGroup = group;
      ValidationEngine.registerValidatorInGroup(group, this);
    }
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();
    extend(this._optionsByReference, {
      validationGroup: true,
    });
  }

  _getEditor() {
    const element = this.$element()[0];
    return elementData(element, 'dx-validation-target');
  }

  _initAdapter(): void {
    const dxStandardEditor = this._getEditor();
    let { adapter } = this.option();
    if (!adapter) {
      if (dxStandardEditor) {
        // @ts-expect-error ts-error
        adapter = new DefaultAdapter(dxStandardEditor, this);
        adapter?.validationRequestsCallbacks?.push((args) => {
          if (this._validationInfo?.skipValidation) {
            return;
          }
          this.validate(args);
        });
        this.option('adapter', adapter);
        return;
      }
      throw errors.Error('E0120');
    }
    const callbacks = adapter.validationRequestsCallbacks;
    if (callbacks) {
      callbacks.push((args) => {
        this.validate(args);
      });
    }
  }

  _toggleRTLDirection(isRtl: boolean): void {
    const { adapter } = this.option();
    // @ts-expect-error ts-error
    const rtlEnabled = adapter?.editor?.option('rtlEnabled') ?? isRtl;

    super._toggleRTLDirection(rtlEnabled);
  }

  _initMarkup(): void {
    this.$element().addClass(VALIDATOR_CLASS);
    super._initMarkup();
  }

  _render(): void {
    super._render();
    this._toggleAccessibilityAttributes();
  }

  _toggleAccessibilityAttributes(): void {
    const dxStandardEditor = this._getEditor();
    if (dxStandardEditor) {
      const rules = this.option('validationRules') || [];
      // @ts-expect-error ts-error
      const isRequired = rules.some(({ type }) => type === 'required') || null;

      if (dxStandardEditor.isInitialized()) {
        dxStandardEditor.setAria('required', isRequired);
      }
      dxStandardEditor.option('_onMarkupRendered', () => {
        dxStandardEditor.setAria('required', isRequired);
      });
    }
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._initGroupRegistration();
    }
  }

  _optionChanged(args): void {
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
        this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getValidationRules() {
    if (!this._validationRules) {
      this._validationRules = map(this.option('validationRules'), (rule, index) => extend({}, rule, {
        validator: this,
        index,
      }));
    }
    return this._validationRules;
  }

  _findGroup(): ValidationGroup {
    const $element = this.$element();

    const { validationGroup } = this.option();

    return validationGroup
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || ValidationEngine.findGroup($element, this._modelByElement($element));
  }

  _resetValidationRules(): void {
    delete this._validationRules;
  }

  validate(args?) {
    const { adapter, name } = this.option();
    const bypass = adapter?.bypass?.();
    const value = args && args.value !== undefined ? args.value : adapter?.getValue?.();
    // @ts-expect-error ts-error
    const currentError = adapter?.getCurrentValidationError?.();
    const rules = this._getValidationRules();
    const currentResult = this._validationInfo?.result;
    if (currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
      return extend({}, currentResult);
    }
    let result;
    if (bypass) {
      result = { isValid: true, status: VALIDATION_STATUS_VALID };
    } else if (currentError?.editorSpecific) {
      currentError.validator = this;
      result = {
        isValid: false, status: VALIDATION_STATUS_INVALID, brokenRule: currentError, brokenRules: [currentError],
      };
    } else {
      result = ValidationEngine.validate(value, rules, name);
    }
    result.id = new Guid().toString();
    this._applyValidationResult(result, adapter);
    result.complete?.then((res) => {
      // @ts-expect-error ts-error
      if (res.id === this._validationInfo.result.id) {
        this._applyValidationResult(res, adapter);
      }
    });
    return extend({}, this._validationInfo.result);
  }

  reset(): void {
    const { adapter } = this.option();
    const result = {
      id: null,
      isValid: true,
      brokenRule: null,
      brokenRules: null,
      pendingRules: null,
      status: VALIDATION_STATUS_VALID,
      complete: null,
    };

    this._validationInfo.skipValidation = true;
    // @ts-expect-error ts-error
    adapter.reset();
    this._validationInfo.skipValidation = false;
    this._resetValidationRules();
    this._applyValidationResult(result, adapter);
  }

  _updateValidationResult(result): void {
    // @ts-expect-error ts-error
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
  }

  _applyValidationResult(result, adapter): void {
    const validatedAction = this._createActionByOption('onValidated', {
      excludeValidators: ['readOnly'],
    });
    result.validator = this;
    this._updateValidationResult(result);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    adapter.applyValidationResults && adapter.applyValidationResults(this._validationInfo.result);
    this.option({
      validationStatus: this._validationInfo.result.status,
    });
    if (this._validationInfo.result.status === VALIDATION_STATUS_PENDING) {
      if (!this._validationInfo.deferred) {
        this._validationInfo.deferred = Deferred();
        this._validationInfo.result.complete = this._validationInfo.deferred.promise();
      }
      this._eventsStrategy.fireEvent('validating', [this._validationInfo.result]);
      return;
    }
    // @ts-expect-error ts-error
    if (this._validationInfo.result.status !== VALIDATION_STATUS_PENDING) {
      validatedAction(result);
      if (this._validationInfo.deferred) {
        this._validationInfo.deferred.resolve(result);
        this._validationInfo.deferred = null;
      }
    }
  }

  focus(): void {
    const { adapter } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/prefer-optional-chain
    adapter && adapter.focus && adapter.focus();
  }

  _useTemplates(): boolean {
    return false;
  }
}

registerComponent('dxValidator', Validator);

export default Validator;
