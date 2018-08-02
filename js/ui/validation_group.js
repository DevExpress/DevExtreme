var $ = require("../core/renderer"),
    registerComponent = require("../core/component_registrator"),
    DOMComponent = require("../core/dom_component"),
    ValidationSummary = require("./validation_summary"),
    ValidationEngine = require("./validation_engine"),
    Validator = require("./validator");

var VALIDATION_ENGINE_CLASS = "dx-validationgroup";
/**
 * @name dxValidationGroup
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @module ui/validation_group
 * @export default
 */
var ValidationGroup = DOMComponent.inherit({
    _getDefaultOptions: function() {
        return this.callBase();

        /**
        * @name dxValidationGroupOptions.rtlEnabled
        * @hidden
        * @inheritdoc
        */

        /**
        * @name dxValidationGroupMethods.beginUpdate
        * @publicName beginUpdate()
        * @hidden
        * @inheritdoc
        */
        /**
        * @name dxValidationGroupMethods.defaultOptions
        * @publicName defaultOptions(rule)
        * @hidden
        * @inheritdoc
        */
        /**
        * @name dxValidationGroupMethods.endUpdate
        * @publicName endUpdate()
        * @hidden
        * @inheritdoc
        */
    },

    _init: function() {
        this.callBase();
    },

    _initMarkup: function() {
        var $element = this.$element();
        $element.addClass(VALIDATION_ENGINE_CLASS);

        $element.find(".dx-validator").each(function(_, validatorContainer) {
            Validator.getInstance($(validatorContainer))._initGroupRegistration();
        });


        $element.find(".dx-validationsummary").each(function(_, summaryContainer) {
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

    _optionChanged: function(args) {
        switch(args.name) {
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        ValidationEngine.removeGroup(this);
        this.$element().removeClass(VALIDATION_ENGINE_CLASS);

        this.callBase();
    }
});

registerComponent("dxValidationGroup", ValidationGroup);

module.exports = ValidationGroup;
