var dataUtils = require("../core/element_data"),
    Callbacks = require("../core/utils/callbacks"),
    errors = require("./widget/ui.errors"),
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
* @inherits DOMComponent
* @extension
* @module ui/validator
* @export default
*/
var Validator = DOMComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxValidatorOptions.validationRules
            * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
            */
            validationRules: []
            /**
            * @name dxValidatorOptions.validationGroup
            * @type string
            * @ref
            */
            /**
            * @name dxValidatorOptions.name
            * @type string
            */

            /**
            * @name dxValidatorOptions.adapter
            * @type Object
            */
            /**
            * @name dxValidatorOptions.adapter.getValue
            * @type function
            */
            /**
            * @name dxValidatorOptions.adapter.validationRequestsCallbacks
            * @type Array<function> | jquery.callbacks
            */
            /**
            * @name dxValidatorOptions.adapter.applyValidationResults
            * @type function
            */
            /**
            * @name dxValidatorOptions.adapter.reset
            * @type function
            */
            /**
            * @name dxValidatorOptions.adapter.focus
            * @type function
            */
            /**
            * @name dxValidatorOptions.adapter.bypass
            * @type function
            */

            /**
            * @name dxValidatorOptions.onValidated
            * @type function(validatedInfo)
            * @type_function_param1 validatedInfo:Object
            * @type_function_param1_field1 name:string
            * @type_function_param1_field2 isValid:boolean
            * @type_function_param1_field3 value:Object
            * @type_function_param1_field4 validationRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
            * @type_function_param1_field5 brokenRule:RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule
            * @action
            */

            /**
            * @name dxValidatorOptions.rtlEnabled
            * @hidden
            */

            /**
            * @name dxValidatorMethods.beginUpdate
            * @publicName beginUpdate()
            * @hidden
            */
            /**
            * @name dxValidatorMethods.defaultOptions
            * @publicName defaultOptions(rule)
            * @hidden
            */
            /**
            * @name dxValidatorMethods.endUpdate
            * @publicName endUpdate()
            * @hidden
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
                errors.log("W0014", "validationRequestsCallbacks", "jQuery.Callbacks", "17.2", "Use the array instead");
                callbacks.add(function() {
                    that.validate();
                });
            }
        }
    },

    _initMarkup: function() {
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
                this._resetValidationRules();
                this.option("isValid") !== undefined && this.validate();
                return;
            case "adapter":
                this._initAdapter();
                break;
            default:
                this.callBase(args);
        }
    },

    _getValidationRules: function() {
        if(!this._validationRules) {
            this._validationRules = map(this.option("validationRules"), (function(rule) {
                return extend({}, rule, { validator: this });
            }).bind(this));
        }

        return this._validationRules;
    },

    _resetValidationRules: function() {
        delete this._validationRules;
    },

    /**
    * @name dxValidatorMethods.validate
    * @publicName validate()
    * @return dxValidatorResult
    */
    validate: function() {
        var that = this,
            adapter = that.option("adapter"),
            name = that.option("name"),
            bypass = adapter.bypass && adapter.bypass(),
            value = adapter.getValue(),
            currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError(),
            rules = this._getValidationRules(),
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
    * @name dxValidatorMethods.reset
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
        this._resetValidationRules();
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
    * @name dxValidatorMethods.focus
    * @publicName focus()
    */
    focus: function() {
        var adapter = this.option("adapter");
        adapter && adapter.focus && adapter.focus();
    }
}).include(ValidationMixin);

registerComponent("dxValidator", Validator);

module.exports = Validator;
