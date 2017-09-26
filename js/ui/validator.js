"use strict";

var dataUtils = require("../core/element_data"),
    Callbacks = require("../core/utils/callbacks"),
    errors = require("./widget/ui.errors"),
    logger = require("../core/utils/console").logger,
    DOMComponent = require("../core/dom_component"),
    extend = require("../core/utils/extend").extend,
    map = require("../core/utils/iterator").map,
    ValidationMixin = require("./validation/validation_mixin"),
    ValidationEngine = require("./validation_engine"),
    DefaultAdapter = require("./validation/default_adapter"),
    registerComponent = require("../core/component_registrator");

var VALIDATOR_CLASS = "dx-validator";

/**
* @name dxValidator
* @publicName dxValidator
* @inherits DOMComponent
* @groupName Helpers
* @module ui/validator
* @export default
*/
var Validator = DOMComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxValidatorOptions_validationRules
            * @publicName validationRules
            * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
            */
            validationRules: []
            /**
            * @name dxValidatorOptions_validationGroup
            * @publicName validationGroup
            * @type string
            * @ref
            */
            /**
            * @name dxValidatorOptions_name
            * @publicName name
            * @type string
            */

            /**
            * @name dxValidatorOptions_adapter
            * @publicName adapter
            * @type object
            */
            /**
            * @name dxValidatorOptions_adapter_getValue
            * @publicName getValue
            * @type function
            */
            /**
            * @name dxValidatorOptions_adapter_validationRequestsCallbacks
            * @publicName validationRequestsCallbacks
            * @type Array<function> | jquery.callbacks
            */
            /**
            * @name dxValidatorOptions_adapter_applyValidationResults
            * @publicName applyValidationResults
            * @type function
            */
            /**
            * @name dxValidatorOptions_adapter_reset
            * @publicName reset
            * @type function
            */
            /**
            * @name dxValidatorOptions_adapter_focus
            * @publicName focus
            * @type function
            */
            /**
            * @name dxValidatorOptions_adapter_bypass
            * @publicName bypass
            * @type function
            */

            /**
            * @name dxValidatorOptions_onValidated
            * @publicName onValidated
            * @type function(validatedInfo)
            * @type_function_param1 validatedInfo:object
            * @type_function_param1_field1 name:string
            * @type_function_param1_field2 isValid:boolean
            * @type_function_param1_field3 value:object
            * @type_function_param1_field4 validationRules:array
            * @type_function_param1_field5 brokenRule:object
            * @action
            */

            /**
            * @name dxValidatorOptions_rtlEnabled
            * @publicName rtlEnabled
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidatorMethods_beginUpdate
            * @publicName beginUpdate()
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidatorMethods_defaultOptions
            * @publicName defaultOptions(rule)
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidatorMethods_endUpdate
            * @publicName endUpdate()
            * @hidden
            * @extend_doc
            */
        });
    },

    _init: function() {
        this.callBase();
        this._initGroupRegistration();

        this.focused = Callbacks();
        this._initAdapter();

    },

    _initGroupRegistration: function() {
        var group = this._findGroup();

        if(!this._groupWasInit) {
            this.on("disposing", function(args) {
                ValidationEngine.removeRegisteredValidator(args.component._validationGroup, args.component);
            });
        }

        if(!this._groupWasInit || this._validationGroup !== group) {
            ValidationEngine.removeRegisteredValidator(this._validationGroup, this);

            this._groupWasInit = true;
            this._validationGroup = group;

            ValidationEngine.registerValidatorInGroup(group, this);
        }
    },


    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            validationGroup: true
        });
    },

    _initAdapter: function() {
        var that = this,
            element = that.$element()[0],
            dxStandardEditor = dataUtils.data(element, "dx-validation-target"),
            adapter = that.option("adapter");
        if(!adapter) {
            if(dxStandardEditor) {
                adapter = new DefaultAdapter(dxStandardEditor, this);

                adapter.validationRequestsCallbacks.add(function() {
                    that.validate();
                });

                this.option("adapter", adapter);
                return;
            }
            throw errors.Error("E0120");
        }

        var callbacks = adapter.validationRequestsCallbacks;

        if(callbacks) {
            if(Array.isArray(callbacks)) {
                callbacks.push(function() {
                    that.validate();
                });
            } else {
                logger.warn("Specifying the validationRequestsCallbacks option with jQuery.Callbacks are now deprecated. Instead, use the array.");
                callbacks.add(function() {
                    that.validate();
                });
            }
        }
    },

    _render: function() {
        this.$element().addClass(VALIDATOR_CLASS);
        this.callBase();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._initGroupRegistration();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "validationGroup":
                this._initGroupRegistration();
                return;
            case "validationRules":
                this.option("isValid") !== undefined && this.validate();
                return;
            case "adapter":
                this._initAdapter();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxValidatorMethods_validate
    * @publicName validate()
    * @return Object
    */
    validate: function() {
        var that = this,
            adapter = that.option("adapter"),
            name = that.option("name"),
            bypass = adapter.bypass && adapter.bypass(),
            value = adapter.getValue(),
            currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError(),
            rules = map(that.option("validationRules"), function(rule) {
                rule.validator = that;
                return rule;
            }),
            result;

        if(bypass) {
            result = { isValid: true };
        } else if(currentError && currentError.editorSpecific) {
            currentError.validator = this;
            result = { isValid: false, brokenRule: currentError };
        } else {
            result = ValidationEngine.validate(value, rules, name);
        }

        this._applyValidationResult(result, adapter);


        return result;
    },


    /**
    * @name dxValidatorMethods_reset
    * @publicName reset()
    */
    reset: function() {
        var that = this,
            adapter = that.option("adapter"),
            result = {
                isValid: true,
                brokenRule: null
            };
        adapter.reset();
        this._applyValidationResult(result, adapter);
    },

    _applyValidationResult: function(result, adapter) {
        var validatedAction = this._createActionByOption("onValidated");
        result.validator = this;

        adapter.applyValidationResults && adapter.applyValidationResults(result);

        this.option({
            isValid: result.isValid
        });

        validatedAction(result);
    },
    /**
    * @name dxValidatorMethods_focus
    * @publicName focus()
    */
    focus: function() {
        var adapter = this.option("adapter");
        adapter && adapter.focus && adapter.focus();
    }
}).include(ValidationMixin);

registerComponent("dxValidator", Validator);

module.exports = Validator;
