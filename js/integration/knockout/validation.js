import { each, map } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import Class from "../../core/class";
import EventsMixin from "../../core/events_mixin";
import ValidationEngine from "../../ui/validation_engine";
import ko from "knockout";

const koDxValidator = Class.inherit({
    ctor(target, option) {
        this.target = target;
        this.name = option.name;
        this.isValid = ko.observable(true);
        this.validationError = ko.observable();
        this.validationErrors = ko.observable();
        this.validationStatus = ko.observable("valid");

        this.validationRules = map(option.validationRules, (rule, index) => {
            return extend({}, rule, {
                validator: this,
                index: index
            });
        });
    },

    validate() {
        if(this._validationResult && this._validationResult.status === "pending") {
            return this._validationResult;
        }
        let result = ValidationEngine.validate(this.target(), this.validationRules, this.name);
        this._applyValidationResult(result);
        if(result.complete) {
            result.complete = result.complete.then(() => {
                this._applyValidationResult(this._validationResult);
                return this._validationResult;
            });
        }
        return result;
    },

    reset() {
        this.target(null);
        const result = {
            isValid: true,
            brokenRule: null,
            pendingRules: null,
            status: "valid",
            complete: null
        };
        this._validationResult = result;
        this._applyValidationResult(result);
        return result;
    },

    _applyValidationResult(result) {
        result.validator = this;
        this._validationResult = result;
        this.target.dxValidator.isValid(result.isValid);
        this.target.dxValidator.validationError(result.brokenRule);
        this.target.dxValidator.validationErrors(result.brokenRules);
        this.target.dxValidator.validationStatus(result.status);
        if(result.status !== "pending") {
            this.fireEvent("validated", [result]);
        }
    }
}).include(EventsMixin);


ko.extenders.dxValidator = function(target, option) {
    target.dxValidator = new koDxValidator(target, option);
    target.subscribe(target.dxValidator.validate.bind(target.dxValidator));

    return target;
};

// TODO: MODULARITY: Move this to another place?

/**
* @name validationEngineMethods.registerModelForValidation
* @publicName registerModelForValidation(model)
* @param1 model:object
* @static
*/
ValidationEngine.registerModelForValidation = function(model) {
    each(model, function(name, member) {
        if(ko.isObservable(member) && member.dxValidator) {
            ValidationEngine.registerValidatorInGroup(model, member.dxValidator);
        }
    });
};

/**
* @name validationEngineMethods.unregisterModelForValidation
* @publicName unregisterModelForValidation(model)
* @param1 model:object
* @static
*/
ValidationEngine.unregisterModelForValidation = function(model) {
    each(model, function(name, member) {
        if(ko.isObservable(member) && member.dxValidator) {
            ValidationEngine.removeRegisteredValidator(model, member.dxValidator);
        }
    });
};

/**
* @name validationEngineMethods.validateModel
* @publicName validateModel(model)
* @param1 model:object
* @return object
* @static
*/
ValidationEngine.validateModel = ValidationEngine.validateGroup;
