import dataUtils from '../core/element_data';
import Callbacks from '../core/utils/callbacks';
import errors from './widget/ui.errors';
import DOMComponent from '../core/dom_component';
import { extend } from '../core/utils/extend';
import { map } from '../core/utils/iterator';
import ValidationEngine from './validation_engine';
import DefaultAdapter from './validation/default_adapter';
import registerComponent from '../core/component_registrator';
import { Deferred } from '../core/utils/deferred';
import Guid from '../core/guid';

const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const VALIDATION_STATUS_PENDING = 'pending';

const Validator = DOMComponent.inherit({
    _initOptions: function(options) {
        this.callBase.apply(this, arguments);
        this.option(ValidationEngine.initValidationOptions(options));
    },

    _getDefaultOptions() {
        return extend(this.callBase(), {
            validationRules: []

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
            skipValidation: false
        };
    },

    _initGroupRegistration() {
        const group = this._findGroup();
        if(!this._groupWasInit) {
            this.on('disposing', function(args) {
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
        const element = this.$element()[0];
        const dxStandardEditor = dataUtils.data(element, 'dx-validation-target');
        let adapter = this.option('adapter');
        if(!adapter) {
            if(dxStandardEditor) {
                adapter = new DefaultAdapter(dxStandardEditor, this);
                adapter.validationRequestsCallbacks.add((args) => {
                    if(this._validationInfo.skipValidation) {
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
        if(callbacks) {
            if(Array.isArray(callbacks)) {
                callbacks.push((args) => {
                    this.validate(args);
                });
            } else {
                errors.log('W0014', 'validationRequestsCallbacks', 'jQuery.Callbacks', '17.2', 'Use the array instead');
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
            case 'validationGroup':
                this._initGroupRegistration();
                return;
            case 'validationRules':
                this._resetValidationRules();
                this.option('isValid') !== undefined && this.validate();
                return;
            case 'adapter':
                this._initAdapter();
                break;
            case 'isValid':
            case 'validationStatus':
                this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
                break;
            default:
                this.callBase(args);
        }
    },

    _getValidationRules() {
        if(!this._validationRules) {
            this._validationRules = map(this.option('validationRules'), (rule, index) => {
                return extend({}, rule, {
                    validator: this,
                    index: index
                });
            });
        }
        return this._validationRules;
    },

    _findGroup() {
        const $element = this.$element();

        return this.option('validationGroup') ||
            ValidationEngine.findGroup($element, this._modelByElement($element));
    },

    _resetValidationRules() {
        delete this._validationRules;
    },

    validate(args) {
        const adapter = this.option('adapter');
        const name = this.option('name');
        const bypass = adapter.bypass && adapter.bypass();
        const value = (args && args.value !== undefined) ? args.value : adapter.getValue();
        const currentError = adapter.getCurrentValidationError && adapter.getCurrentValidationError();
        const rules = this._getValidationRules();
        const currentResult = this._validationInfo && this._validationInfo.result;
        if(currentResult && currentResult.status === VALIDATION_STATUS_PENDING && currentResult.value === value) {
            return extend({}, currentResult);
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
        result.id = new Guid().toString();
        this._applyValidationResult(result, adapter);
        result.complete && result.complete.then((res) => {
            if(res.id === this._validationInfo.result.id) {
                this._applyValidationResult(res, adapter);
            }
        });
        return extend({}, this._validationInfo.result);
    },

    reset() {
        const adapter = this.option('adapter');
        const result = {
            id: null,
            isValid: true,
            brokenRule: null,
            brokenRules: null,
            pendingRules: null,
            status: VALIDATION_STATUS_VALID,
            complete: null
        };

        this._validationInfo.skipValidation = true;
        adapter.reset();
        this._validationInfo.skipValidation = false;
        this._resetValidationRules();
        this._applyValidationResult(result, adapter);
    },

    _updateValidationResult(result) {
        if(!this._validationInfo.result || this._validationInfo.result.id !== result.id) {
            const complete = this._validationInfo.deferred && this._validationInfo.result.complete;
            this._validationInfo.result = extend({}, result, { complete });
        } else {
            for(const prop in result) {
                if(prop !== 'id' && prop !== 'complete') {
                    this._validationInfo.result[prop] = result[prop];
                }
            }
        }
    },

    _applyValidationResult(result, adapter) {
        const validatedAction = this._createActionByOption('onValidated');
        result.validator = this;
        this._updateValidationResult(result);
        adapter.applyValidationResults && adapter.applyValidationResults(this._validationInfo.result);
        this.option({
            validationStatus: this._validationInfo.result.status
        });
        if(this._validationInfo.result.status === VALIDATION_STATUS_PENDING) {
            if(!this._validationInfo.deferred) {
                this._validationInfo.deferred = new Deferred();
                this._validationInfo.result.complete = this._validationInfo.deferred.promise();
            }
            this.fireEvent('validating', [this._validationInfo.result]);
            return;
        }
        if(this._validationInfo.result.status !== VALIDATION_STATUS_PENDING) {
            validatedAction(result);
            if(this._validationInfo.deferred) {
                this._validationInfo.deferred.resolve(result);
                this._validationInfo.deferred = null;
            }
        }
    },
    focus() {
        const adapter = this.option('adapter');
        adapter && adapter.focus && adapter.focus();
    }
});

registerComponent('dxValidator', Validator);

module.exports = Validator;
