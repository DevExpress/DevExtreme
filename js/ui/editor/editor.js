import $ from '../../core/renderer';
import { data } from '../../core/element_data';
import Callbacks from '../../core/utils/callbacks';
import { hasWindow } from '../../core/utils/window';
import { addNamespace, normalizeKeyName } from '../../events/utils/index';
import { extend } from '../../core/utils/extend';
import Widget from '../widget/ui.widget';
import ValidationEngine from '../validation_engine';
import EventsEngine from '../../events/core/events_engine';
import ValidationMessage from '../validation_message';
import Guid from '../../core/guid';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_CLASS = 'dx-invalid';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const READONLY_NAMESPACE = 'editorReadOnly';

const VALIDATION_MESSAGE_KEYS_MAP = {
    validationMessageMode: 'mode',
    validationMessageOffset: 'offset',
    validationBoundary: 'boundary',
};

const Editor = Widget.inherit({
    ctor: function() {
        this.showValidationMessageTimeout = null;
        this.validationRequest = Callbacks();

        this.callBase.apply(this, arguments);
    },

    _createElement: function(element) {
        this.callBase(element);
        const $element = this.$element();
        if($element) {
            data($element[0], VALIDATION_TARGET, this);
        }
    },

    _initOptions: function(options) {
        this.callBase.apply(this, arguments);
        this.option(ValidationEngine.initValidationOptions(options));
    },

    _init: function() {
        this.callBase();
        this._options.cache('validationTooltipOptions', this.option('validationTooltipOptions'));
        const $element = this.$element();
        $element.addClass(DX_INVALID_BADGE_CLASS);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: null,

            /**
            * @name EditorOptions.name
            * @type string
            * @default ""
            * @hidden
            */
            name: '',

            onValueChanged: null,

            readOnly: false,

            isValid: true,

            validationError: null,

            validationErrors: null,

            validationStatus: VALIDATION_STATUS_VALID,

            validationMessageMode: 'auto',

            validationBoundary: undefined,

            validationMessageOffset: { h: 0, v: 0 },

            validationTooltipOptions: {}
        });
    },

    _attachKeyboardEvents: function() {
        if(!this.option('readOnly')) {
            this.callBase();
        }
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            validationError: true
        });
    },

    _createValueChangeAction: function() {
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _suppressValueChangeAction: function() {
        this._valueChangeActionSuppressed = true;
    },

    _resumeValueChangeAction: function() {
        this._valueChangeActionSuppressed = false;
    },

    _initMarkup: function() {
        this._toggleReadOnlyState();
        this._setSubmitElementName(this.option('name'));

        this.callBase();
        this._renderValidationState();
    },

    _raiseValueChangeAction: function(value, previousValue) {
        if(!this._valueChangeAction) {
            this._createValueChangeAction();
        }
        this._valueChangeAction(this._valueChangeArgs(value, previousValue));
    },

    _valueChangeArgs: function(value, previousValue) {
        return {
            value: value,
            previousValue: previousValue,
            event: this._valueChangeEventInstance
        };
    },

    _saveValueChangeEvent: function(e) {
        this._valueChangeEventInstance = e;
    },

    _focusInHandler: function(e) {
        const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

        // NOTE: The click should be processed before the validation message is shown because
        // it can change the editor's value
        if(this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
            // NOTE: Prevent the validation message from showing
            const $validationMessageWrapper = this._validationMessage?._wrapper();
            $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);

            clearTimeout(this.showValidationMessageTimeout);

            // NOTE: Show the validation message after a click changes the value
            this.showValidationMessageTimeout = setTimeout(
                () => $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO), 150
            );
        }

        return this.callBase(e);
    },

    _canValueBeChangedByClick: function() {
        return false;
    },

    _getValidationErrors: function() {
        let validationErrors = this.option('validationErrors');
        if(!validationErrors && this.option('validationError')) {
            validationErrors = [this.option('validationError')];
        }
        return validationErrors;
    },

    _disposeValidationMessage: function() {
        if(this._$validationMessage) {
            this._$validationMessage.remove();
            this.setAria('describedby', null);
            this._$validationMessage = null;
        }
    },

    _toggleValidationClasses: function(isInvalid) {
        this.$element().toggleClass(INVALID_CLASS, isInvalid);
        this.setAria(VALIDATION_STATUS_INVALID, isInvalid || undefined);
    },

    _renderValidationState: function() {
        const isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;
        const validationErrors = this._getValidationErrors();
        const $element = this.$element();

        this._toggleValidationClasses(!isValid);

        if(!hasWindow()) {
            return;
        }

        this._disposeValidationMessage();
        if(!isValid && validationErrors) {
            this._$validationMessage = $('<div>').appendTo($element);
            this.setAria('describedby', 'dx-' + new Guid());

            this._validationMessage = new ValidationMessage(this._$validationMessage, extend({
                validationErrors,
                target: this._getValidationMessageTarget(),
                container: $element,
                mode: this.option('validationMessageMode'),
                positionRequest: 'below',
                offset: this.option('validationMessageOffset'),
                boundary: this.option('validationBoundary'),
                rtlEnabled: this.option('rtlEnabled')
            }, this._options.cache('validationTooltipOptions')));
            this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
        }
    },

    _getValidationMessageTarget: function() {
        return this.$element();
    },

    _toggleReadOnlyState: function() {
        const readOnly = this.option('readOnly');

        this._toggleBackspaceHandler(readOnly);
        this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
        this.setAria('readonly', readOnly || undefined);
    },

    _toggleBackspaceHandler: function(isReadOnly) {
        const $eventTarget = this._keyboardEventBindingTarget();
        const eventName = addNamespace('keydown', READONLY_NAMESPACE);

        EventsEngine.off($eventTarget, eventName);

        if(isReadOnly) {
            EventsEngine.on($eventTarget, eventName, (e) => {
                if(normalizeKeyName(e) === 'backspace') {
                    e.preventDefault();
                }
            });
        }
    },

    _dispose: function() {
        const element = this.$element()[0];

        data(element, VALIDATION_TARGET, null);
        clearTimeout(this.showValidationMessageTimeout);
        this.callBase();
    },

    _setSubmitElementName: function(name) {
        const $submitElement = this._getSubmitElement();

        if(!$submitElement) {
            return;
        }

        if(name.length > 0) {
            $submitElement.attr('name', name);
        } else {
            $submitElement.removeAttr('name');
        }
    },

    _getSubmitElement: function() {
        return null;
    },

    _setValidationMessageOption: function({ name, value }) {
        const optionKey = VALIDATION_MESSAGE_KEYS_MAP[name] ? VALIDATION_MESSAGE_KEYS_MAP[name] : name;
        this._validationMessage?.option(optionKey, value);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onValueChanged':
                this._createValueChangeAction();
                break;
            case 'readOnly':
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case 'value':
                if(args.value != args.previousValue) { // eslint-disable-line eqeqeq
                    this.validationRequest.fire({
                        value: args.value,
                        editor: this
                    });
                }
                if(!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(args.value, args.previousValue);
                    this._saveValueChangeEvent(undefined);
                }
                break;
            case 'width':
                this.callBase(args);
                this._validationMessage?.updateMaxWidth();
                break;
            case 'name':
                this._setSubmitElementName(args.value);
                break;
            case 'isValid':
            case 'validationError':
            case 'validationErrors':
            case 'validationStatus':
                this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
                this._renderValidationState();
                break;
            case 'validationBoundary':
            case 'validationMessageMode':
            case 'validationMessageOffset':
                this._setValidationMessageOption(args);
                break;
            case 'rtlEnabled':
                this._setValidationMessageOption(args);
                this.callBase(args);
                break;
            case 'validationTooltipOptions':
                this._innerWidgetOptionChanged(this._validationMessage, args);
                break;
            default:
                this.callBase(args);
        }
    },

    reset: function() {
        const defaultOptions = this._getDefaultOptions();
        this.option('value', defaultOptions.value);
    }
});

export default Editor;
