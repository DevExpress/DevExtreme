import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { ValidationResult } from '@js/ui/validation_group';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';

import ValidationEngine from './validation_engine';
import ValidationSummary from './validation_summary';
import Validator from './validator';

const VALIDATION_ENGINE_CLASS = 'dx-validationgroup';
const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';

class ValidationGroup extends DOMComponent<ValidationGroup> {
  _getDefaultOptions(): DOMComponentProperties<ValidationGroup> {
    return super._getDefaultOptions();
  }

  _init(): void {
    super._init();
    ValidationEngine.addGroup(this, false);
  }

  _initMarkup(): void {
    const $element = this.$element();

    $element.addClass(VALIDATION_ENGINE_CLASS);
    $element.find(`.${VALIDATOR_CLASS}`).each((_, validatorContainer): boolean => {
      Validator.getInstance<Validator>($(validatorContainer))._initGroupRegistration();
      return true;
    });
    $element.find(`.${VALIDATION_SUMMARY_CLASS}`).each((_, summaryContainer): boolean => {
      ValidationSummary.getInstance<ValidationSummary>($(summaryContainer))
        .refreshValidationGroup();
      return true;
    });
    super._initMarkup();
  }

  validate(): ValidationResult {
    return ValidationEngine.validateGroup(this);
  }

  reset(): void {
    ValidationEngine.resetGroup(this);
  }

  _dispose(): void {
    ValidationEngine.removeGroup(this);
    this.$element().removeClass(VALIDATION_ENGINE_CLASS);
    super._dispose();
  }

  _useTemplates(): boolean {
    return false;
  }
}

registerComponent('dxValidationGroup', ValidationGroup);

export default ValidationGroup;
