import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import DOMComponent from '../core/dom_component';
import ValidationSummary from './validation_summary';
import ValidationEngine from './validation_engine';
import Validator from './validator';

const VALIDATION_ENGINE_CLASS = 'dx-validationgroup';
const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';

class ValidationGroup extends DOMComponent {
    _getDefaultOptions() {
        return super._getDefaultOptions();

        /**
        * @name dxValidationGroupOptions.rtlEnabled
        * @hidden
        */

        /**
        * @name dxValidationGroup.beginUpdate
        * @publicName beginUpdate()
        * @hidden
        */
        /**
        * @name dxValidationGroup.defaultOptions
        * @publicName defaultOptions(rule)
        * @hidden
        */
        /**
        * @name dxValidationGroup.endUpdate
        * @publicName endUpdate()
        * @hidden
        */
    }

    _init() {
        super._init();
        ValidationEngine.addGroup(this);
    }

    _initMarkup() {
        const $element = this.$element();
        $element.addClass(VALIDATION_ENGINE_CLASS);
        $element.find(`.${VALIDATOR_CLASS}`).each(function(_, validatorContainer) {
            Validator.getInstance($(validatorContainer))._initGroupRegistration();
        });
        $element.find(`.${VALIDATION_SUMMARY_CLASS}`).each(function(_, summaryContainer) {
            ValidationSummary.getInstance($(summaryContainer)).refreshValidationGroup();
        });
        super._initMarkup();
    }

    validate(focusFirstInvalidComponent = true) {
        return ValidationEngine.validateGroup(this, focusFirstInvalidComponent);
    }

    reset() {
        return ValidationEngine.resetGroup(this);
    }

    _dispose() {
        ValidationEngine.removeGroup(this);
        this.$element().removeClass(VALIDATION_ENGINE_CLASS);
        super._dispose();
    }

    _useTemplates() {
        return false;
    }
}

registerComponent('dxValidationGroup', ValidationGroup);

export default ValidationGroup;
