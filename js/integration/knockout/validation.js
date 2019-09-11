import { each, map } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";
import Class from "../../core/class";
import EventsMixin from "../../core/events_mixin";
import ValidationEngine from "../../ui/validation_engine";
import { Deferred } from "../../core/utils/deferred";
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
        this._validationInfo = {
            result: null,
            deferred: null,
            complete: null
        };
    },

    validate() {
        const currentResult = this._validationInfo && this._validationInfo.result,
            value = this.target();
        if(currentResult && currentResult.status === "pending" && currentResult.value === value) {
            return currentResult;
        }
        let result = ValidationEngine.validate(value, this.validationRules, this.name);
        this._applyValidationResult(result);
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
        this._applyValidationResult(result);
        return result;
    },

    _applyValidationResult(result) {
        result.validator = this;
        this._validationInfo.result = result;
        this.target.dxValidator.isValid(result.isValid);
        this.target.dxValidator.validationError(result.brokenRule);
        this.target.dxValidator.validationErrors(result.brokenRules);
        this.target.dxValidator.validationStatus(result.status);
        if(result.status === "pending") {
            result.complete.then((res) => {
                if(res === this._validationInfo.result) {
                    this._applyValidationResult(res);
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
        if(result.status !== "pending") {
            this.fireEvent("validated", [result]);
            if(this._validationInfo.deferred) {
                this._validationInfo.deferred.resolve(result);
                this._validationInfo.deferred = null;
            }
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
