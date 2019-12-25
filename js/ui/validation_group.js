import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import DOMComponent from '../core/dom_component';
import ValidationSummary from './validation_summary';
import ValidationEngine from './validation_engine';
import Validator from './validator';

const VALIDATION_ENGINE_CLASS = 'dx-validationgroup';
const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';

/**
 * @name dxValidationGroup
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @module ui/validation_group
 * @export default
 */
const ValidationGroup = DOMComponent.inherit({
    _getDefaultOptions: function() {
        return this.callBase();

        /**
        * @name dxValidationGroupOptions.rtlEnabled
        * @hidden
        */

        /**
        * @name dxValidationGroupMethods.beginUpdate
        * @publicName beginUpdate()
        * @hidden
        */
        /**
        * @name dxValidationGroupMethods.defaultOptions
        * @publicName defaultOptions(rule)
        * @hidden
        */
        /**
        * @name dxValidationGroupMethods.endUpdate
        * @publicName endUpdate()
        * @hidden
        */
    },

    _init: function() {
        this.callBase();
        ValidationEngine.addGroup(this);
    },

    _initMarkup: function() {
        const $element = this.$element();
        $element.addClass(VALIDATION_ENGINE_CLASS);

        $element.find(`.${VALIDATOR_CLASS}`).each(function(_, validatorContainer) {
            Validator.getInstance($(validatorContainer))._initGroupRegistration();
        });


        $element.find(`.${VALIDATION_SUMMARY_CLASS}`).each(function(_, summaryContainer) {
            ValidationSummary.getInstance($(summaryContainer))._initGroupRegistration();
        });

        this.callBase();
    },

    /**
     * @name dxValidationGroupMethods.validate
     * @publicName validate()
     * @return dxValidationGroupResult
     */
    validate: function() {
        return ValidationEngine.validateGroup(this);
    },

    /**
     * @name dxValidationGroupMethods.reset
     * @publicName reset()
     */
    reset: function() {
        return ValidationEngine.resetGroup(this);
    },

    _dispose: function() {
        ValidationEngine.removeGroup(this);
        this.$element().removeClass(VALIDATION_ENGINE_CLASS);

        this.callBase();
    }
});

registerComponent('dxValidationGroup', ValidationGroup);

module.exports = ValidationGroup;
