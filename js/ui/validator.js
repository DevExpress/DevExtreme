import dataUtils from "../core/element_data";
import Callbacks from "../core/utils/callbacks";
import errors from "./widget/ui.errors";
import DOMComponent from "../core/dom_component";
import { extend } from "../core/utils/extend";
import { map } from "../core/utils/iterator";
import ValidationMixin from "./validation/validation_mixin";
import ValidationEngine from "./validation_engine";
import DefaultAdapter from "./validation/default_adapter";
import registerComponent from "../core/component_registrator";
import { Deferred } from "../core/utils/deferred";

const VALIDATOR_CLASS = "dx-validator",
    VALIDATION_STATUS_VALID = "valid",
    VALIDATION_STATUS_INVALID = "invalid",
    VALIDATION_STATUS_PENDING = "pending";

/**
* @name dxValidator
* @inherits DOMComponent
* @extension
* @module ui/validator
* @export default
*/
const Validator = DOMComponent.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            /**
            * @name dxValidatorOptions.validationRules
            * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
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
            * @type_function_param1_field4 validationRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
            * @type_function_param1_field5 brokenRule:RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule
            * @type_function_param1_field6 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
            * @type_function_param1_field6 status:Enums.ValidationStatus
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

    _init() {
        this.callBase();
        this._initGroupRegistration();
        this.focused = Callbacks();
        this._initAdapter();
        this._validationInfo = {
            result: null,
            deferred: null,
            complete: null
        };
    },

    _initGroupRegistration() {
        const group = this._findGroup();
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

    _setOptionsByReference() {
        this.callBase();
        extend(this._optionsByReference, {
            validationGroup: true
        });
    },

    _initAdapter() {
        const element = this.$element()[0],
            dxStandardEditor = dataUtils.data(element, "dx-validation-target");
        let adapter = this.option("adapter");
        if(!adapter) {
            if(dxStandardEditor) {
                adapter = new DefaultAdapter(dxStandardEditor, this);
                adapter.validationRequestsCallbacks.add((args) => {
                    this.validate(args);
                });
                this.option("adapter", adapter);
                return;
            }
            throw errors.Error("E0120");
        }
        const callbacks = adapter.validationRequestsCallbacks;
        if(callbacks) {
            if(Array.isArray(callbacks)) {
                callbacks.push((args) => {
                    this.validate(args);
                });
            } else {
                errors.log("W0014", "validationRequestsCallbacks", "jQuery.Callbacks", "17.2", "Use the array instead");
                callbacks.add((args) => {
                    this.validate(args);
                });
            }
        }
    },

    _initMarkup() {
        this.$element().addClass(VALIDATOR_CLASS);
        this.callBase();
    },

    _visibilityChanged(visible) {
        if(visible) {
            this._initGroupRegistration();
        }
    },

    _optionChanged(args) {
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
            case "isValid":
            case "validationStatus":
                this._synchronizeValidationStatus(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _synchronizeValidationStatus({ name, value }) {
        if(name === "validationStatus") {
            const isValid = value === VALIDATION_STATUS_VALID || value === VALIDATION_STATUS_PENDING;
            this.option("isValid") !== isValid && this.option("isValid", isValid);
        } else if(name === "isValid") {
            const validationStatus = this.option("validationStatus");
            let newStatus = validationStatus;
            if(value && validationStatus === VALIDATION_STATUS_INVALID) {
                newStatus = VALIDATION_STATUS_VALID;
            } else if(!value && validationStatus !== VALIDATION_STATUS_INVALID) {
                newStatus = VALIDATION_STATUS_INVALID;
            }
            newStatus !== validationStatus && this.option("validationStatus", newStatus);
        }
    },

    _getValidationRules() {
        if(!this._validationRules) {
            this._validationRules = map(this.option("validationRules"), (rule, index) => {
                return extend({}, rule, {
                    validator: this,
                    index: index
                });
            });
        }
        return this._validationRules;
    },

    _resetValidationRules() {
        delete this._validationRules;
    },

    /**
    * @name dxValidatorMethods.validate
    * @publicName validate()
    * @return dxValidatorResult
    */
    validate(args) {
        const adapter = this.option("adapter"),
            name = this.option("name"),
            bypass = adapter.bypass && adapter.bypass(),
            value = (args && args.value !== undefined) ? args.value : adapter.getValue(),
            currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError(),
            rules = this._getValidationRules();
        const currentResult = this._validationInfo && this._validationInfo.result;
        if(currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
            return currentResult;
        }
        let result;
        if(bypass) {
            result = { isValid: true, status: VALIDATION_STATUS_VALID };
        } else if(currentError && currentError.editorSpecific) {
            currentError.validator = this;
            result = { isValid: false, status: VALIDATION_STATUS_INVALID, brokenRule: currentError, brokenRules: [currentError] };
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
    reset() {
        const adapter = this.option("adapter"),
            result = {
                isValid: true,
                brokenRule: null,
                brokenRules: null,
                pendingRules: null,
                status: VALIDATION_STATUS_VALID,
                complete: null
            };
        adapter.reset();
        this._resetValidationRules();
        this._applyValidationResult(result, adapter);
    },

    _applyValidationResult(result, adapter) {
        const validatedAction = this._createActionByOption("onValidated");
        result.validator = this;
        adapter.applyValidationResults && adapter.applyValidationResults(result);
        this.option({
            validationStatus: result.status
        });
        this._validationInfo.result = result;
        if(result.status === VALIDATION_STATUS_PENDING) {
            result.complete.then((res) => {
                if(res === this._validationInfo.result) {
                    this._applyValidationResult(res, adapter);
                }
                return res;
            });
            if(!this._validationInfo.deferred) {
                this._validationInfo.deferred = new Deferred();
                this._validationInfo.complete = this._validationInfo.deferred.promise();
            }
            this._validationInfo.result.complete = this._validationInfo.complete;
            this.fireEvent("validating", [this._validationInfo.result]);
            return;
        }
        if(result.status !== VALIDATION_STATUS_PENDING) {
            validatedAction(result);
            if(this._validationInfo.deferred) {
                this._validationInfo.deferred.resolve(result);
                this._validationInfo.deferred = null;
            }
        }
    },
    /**
    * @name dxValidatorMethods.focus
    * @publicName focus()
    */
    focus() {
        const adapter = this.option("adapter");
        adapter && adapter.focus && adapter.focus();
    }
}).include(ValidationMixin);

registerComponent("dxValidator", Validator);

module.exports = Validator;
