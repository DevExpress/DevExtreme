import type { ValidationStatus } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import { data as elementData } from '@js/core/element_data';
import Guid from '@js/core/guid';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import type { Properties } from '@js/ui/validator';
import errors from '@js/ui/widget/ui.errors';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import type {
  ValidationRequestArgs,
  ValidationRequestHandler,
  ValidationTargetEditor,
  ValidationTargetEditorOptions,
} from '@ts/ui/validation/default_adapter';
import DefaultAdapter from '@ts/ui/validation/default_adapter';
import type {
  ValidationGroupKey,
  ValidationResultInternal,
  ValidationRuleInternal,
} from '@ts/ui/validation_engine';
import ValidationEngine from '@ts/ui/validation_engine';
import type ValidationSummary from '@ts/ui/validation_summary';

const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_STATUS_VALID: ValidationStatus = 'valid';
const VALIDATION_STATUS_INVALID: ValidationStatus = 'invalid';
const VALIDATION_STATUS_PENDING: ValidationStatus = 'pending';

export interface ValidationAdapter {
  editor?: ValidationTargetEditor;
  validationRequestsCallbacks?: ValidationRequestHandler[];
  getValue?: () => unknown;
  getCurrentValidationError?: () => ValidationRuleInternal | null | undefined;
  bypass?: () => boolean | undefined;
  applyValidationResults?: (result: ValidationResultInternal) => void;
  reset?: () => void;
  focus?: () => void;
}

// The public `Properties` type declares these events in terms of the public dxValidator
// class; the internal class has to declare them in terms of itself.
type ComponentEvents = 'onDisposing' | 'onInitialized' | 'onOptionChanged';

export interface ValidatorProperties extends
  Omit<Properties, 'adapter' | ComponentEvents>,
  Pick<DOMComponentProperties<Validator>, ComponentEvents> {
  adapter?: ValidationAdapter;
  isValid?: boolean;
  validationStatus?: ValidationStatus;
  // set by the grid and the form to pass the editing context to custom rules
  dataGetter?: () => Record<string, unknown>;
}

class Validator extends DOMComponent<Validator, ValidatorProperties> {
  _groupWasInit?: boolean;

  focused?: Callback;

  _validationInfo!: {
    result: ValidationResultInternal | null;
    deferred: DeferredObj<ValidationResultInternal> | null;
    skipValidation: boolean;
  };

  _validationRules?: ValidationRuleInternal[];

  _validationGroup?: ValidationGroupKey;

  _validationSummary?: ValidationSummary | null;

  _initOptions(options: ValidatorProperties): void {
    super._initOptions(options);
    this.option(ValidationEngine.initValidationOptions(options));
  }

  _getDefaultOptions(): ValidatorProperties {
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
      result: null,
      deferred: null,
      skipValidation: false,
    };
  }

  _initGroupRegistration(): void {
    const group = this._findGroup();
    if (!this._groupWasInit) {
      this.on('disposing', (args): void => {
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
    Object.assign(this._optionsByReference, {
      validationGroup: true,
    });
  }

  _getEditor(): ValidationTargetEditor | undefined {
    const element = this.$element()[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return elementData(element, 'dx-validation-target');
  }

  _initAdapter(): void {
    const dxStandardEditor = this._getEditor();
    let { adapter } = this.option();
    if (!adapter) {
      if (dxStandardEditor) {
        adapter = new DefaultAdapter(dxStandardEditor, this);
        adapter?.validationRequestsCallbacks?.push((args): void => {
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
      callbacks.push((args): void => {
        this.validate(args);
      });
    }
  }

  _toggleRTLDirection(isRtl: boolean): void {
    const { adapter } = this.option();
    const editorOptions: ValidationTargetEditorOptions = adapter?.editor?.option() ?? {};
    const rtlEnabled: boolean = editorOptions.rtlEnabled ?? isRtl;

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
      const { validationRules } = this.option() ?? {};
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const isRequired = validationRules?.some(({ type }): boolean => type === 'required') || null;

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

  _optionChanged(args: OptionChanged<ValidatorProperties>): void {
    switch (args.name) {
      case 'validationGroup':
        this._initGroupRegistration();
        return;
      case 'validationRules': {
        this._resetValidationRules();
        this._toggleAccessibilityAttributes();
        const { isValid } = this.option();
        if (isValid !== undefined) {
          this.validate();
        }
        return;
      }
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

  _getValidationRules(): ValidationRuleInternal[] {
    const { validationRules } = this.option();
    this._validationRules ??= validationRules?.map(
      (rule, index: number) => ({
        ...rule,
        validator: this,
        index,
      }),
    );
    return this._validationRules ?? [];
  }

  _findGroup(): ValidationGroupKey {
    const $element = this.$element();

    const { validationGroup } = this.option();

    return validationGroup
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || ValidationEngine.findGroup($element, this._modelByElement($element));
  }

  _resetValidationRules(): void {
    delete this._validationRules;
  }

  validate(args?: ValidationRequestArgs): ValidationResultInternal {
    const { adapter, name } = this.option();
    const bypass = adapter?.bypass?.();
    const value = args?.value ?? adapter?.getValue?.();
    const currentError = adapter?.getCurrentValidationError?.();
    const rules = this._getValidationRules();
    const currentResult = this._validationInfo?.result;
    if (currentResult?.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return extend({}, currentResult);
    }
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let result: ValidationResultInternal;
    if (bypass) {
      result = {
        isValid: true,
        status: VALIDATION_STATUS_VALID,
      };
    } else if (currentError?.editorSpecific) {
      currentError.validator = this;
      result = {
        isValid: false,
        status: VALIDATION_STATUS_INVALID,
        brokenRule: currentError,
        brokenRules: [currentError],
      };
    } else {
      result = ValidationEngine.validate(value, rules, name);
    }
    result.id = new Guid().toString();
    this._applyValidationResult(result, adapter);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    result?.complete?.then((res) => {
      if (res.id === this._validationInfo.result?.id) {
        this._applyValidationResult(res, adapter);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend({}, this._validationInfo.result);
  }

  reset(): void {
    const { adapter } = this.option();
    const result: ValidationResultInternal = {
      id: null,
      isValid: true,
      brokenRule: null,
      brokenRules: null,
      pendingRules: null,
      status: VALIDATION_STATUS_VALID,
      complete: null,
    };

    this._validationInfo.skipValidation = true;
    adapter?.reset?.();
    this._validationInfo.skipValidation = false;
    this._resetValidationRules();
    this._applyValidationResult(result, adapter);
  }

  _updateValidationResult(result: ValidationResultInternal): void {
    const { result: currentResult } = this._validationInfo;

    if (!currentResult || currentResult.id !== result.id) {
      const complete = this._validationInfo.deferred && currentResult?.complete;
      this._validationInfo.result = extend({}, result, { complete });
    } else {
      const { id, complete, ...restResultProperties } = result;
      Object.assign(currentResult, restResultProperties);
    }
  }

  _applyValidationResult(
    result: ValidationResultInternal,
    adapter: ValidationAdapter | undefined,
  ): void {
    const validatedAction = this._createActionByOption('onValidated', {
      excludeValidators: ['readOnly'],
    });

    result.validator = this;
    this._updateValidationResult(result);
    const { result: currentResult } = this._validationInfo;
    if (currentResult && typeof adapter?.applyValidationResults === 'function') {
      adapter.applyValidationResults(currentResult);
    }

    this.option({
      validationStatus: currentResult?.status,
    });

    if (currentResult?.status === VALIDATION_STATUS_PENDING) {
      if (!this._validationInfo.deferred) {
        this._validationInfo.deferred = Deferred<ValidationResultInternal>();
        currentResult.complete = this._validationInfo.deferred.promise();
      }
      this._eventsStrategy.fireEvent('validating', [currentResult]);
      return;
    }

    validatedAction(result);
    if (this._validationInfo.deferred) {
      this._validationInfo.deferred.resolve(result);
      this._validationInfo.deferred = null;
    }
  }

  focus(): void {
    const { adapter } = this.option();
    adapter?.focus?.();
  }

  _useTemplates(): boolean {
    return false;
  }
}

registerComponent('dxValidator', Validator);

export default Validator;
