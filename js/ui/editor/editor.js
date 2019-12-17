import $ from '../../core/renderer';
import dataUtils from '../../core/element_data';
import Callbacks from '../../core/utils/callbacks';
import windowUtils from '../../core/utils/window';
import { addNamespace, normalizeKeyName } from '../../events/utils';
import { getDefaultAlignment } from '../../core/utils/position';
import { extend } from '../../core/utils/extend';
import Guid from '../../core/guid';
import Widget from '../widget/ui.widget';
import Overlay from '../overlay';
import ValidationEngine from '../validation_engine';
import EventsEngine from '../../events/core/events_engine';

const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_CLASS = 'dx-invalid';
const INVALID_MESSAGE = 'dx-invalid-message';
const INVALID_MESSAGE_CONTENT = 'dx-invalid-message-content';
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_MESSAGE_ALWAYS = 'dx-invalid-message-always';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const READONLY_NAMESPACE = 'editorReadOnly';

const getValidationErrorMessage = function(validationErrors) {
    let validationErrorMessage = '';
    if(validationErrors) {
        validationErrors.forEach(function(err) {
            if(err.message) {
                validationErrorMessage += ((validationErrorMessage ? '<br />' : '') + err.message);
            }
        });
    }
    return validationErrorMessage;
};

/**
* @name Editor
* @type object
* @inherits Widget
* @module ui/editor/editor
* @export default
* @hidden
*/
const Editor = Widget.inherit({
    ctor: function() {
        this.showValidationMessageTimeout = null;
        this.validationRequest = Callbacks();
        this.callBase.apply(this, arguments);
        const $element = this.$element();
        if($element) {
            dataUtils.data($element[0], VALIDATION_TARGET, this);
        }

    },

    _initOptions: function(options) {
        this.callBase.apply(this, arguments);
        this.option(ValidationEngine.initValidationOptions(options));
    },

    _init: function() {
        this.callBase();
        this._initInnerOptionCache('validationTooltipOptions');
        const $element = this.$element();
        $element.addClass(DX_INVALID_BADGE_CLASS);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name EditorOptions.value
            * @type any
            * @default null
            * @fires EditorOptions.onValueChanged
            */
            value: null,

            /**
            * @name EditorOptions.name
            * @type string
            * @default ""
            * @hidden
            */
            name: '',

            /**
            * @name EditorOptions.onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field7 event:event
            * @action
            */
            onValueChanged: null,

            /**
             * @name EditorOptions.readOnly
             * @type boolean
             * @default false
             */
            readOnly: false,

            /**
            * @name EditorOptions.isValid
            * @type boolean
            * @default true
            */
            isValid: true,

            /**
            * @name EditorOptions.validationError
            * @type object
            * @ref
            * @default null
            */
            validationError: null,

            /**
            * @name EditorOptions.validationErrors
            * @type Array<object>
            * @default null
            */
            validationErrors: null,

            /**
            * @name EditorOptions.validationStatus
            * @type Enums.ValidationStatus
            * @default "valid"
            */
            validationStatus: VALIDATION_STATUS_VALID,

            /**
             * @name EditorOptions.validationMessageMode
             * @type Enums.ValidationMessageMode
             * @default "auto"
             */
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
            this._$validationMessage && this._$validationMessage.removeClass(INVALID_MESSAGE_AUTO);

            clearTimeout(this.showValidationMessageTimeout);

            // NOTE: Show the validation message after a click changes the value
            this.showValidationMessageTimeout = setTimeout(
                () => this._$validationMessage && this._$validationMessage.addClass(INVALID_MESSAGE_AUTO), 150
            );
        }

        return this.callBase(e);
    },

    _canValueBeChangedByClick: function() {
        return false;
    },

    _renderValidationState: function() {
        const isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;
        const validationMessageMode = this.option('validationMessageMode');
        const $element = this.$element();
        let validationErrors = this.option('validationErrors');
        if(!validationErrors && this.option('validationError')) {
            validationErrors = [this.option('validationError')];
        }
        $element.toggleClass(INVALID_CLASS, !isValid);
        this.setAria(VALIDATION_STATUS_INVALID, !isValid || undefined);

        if(!windowUtils.hasWindow()) {
            return;
        }

        if(this._$validationMessage) {
            this._$validationMessage.remove();
            this.setAria('describedby', null);
            this._$validationMessage = null;
        }

        const validationErrorMessage = getValidationErrorMessage(validationErrors);

        if(!isValid && validationErrorMessage) {
            this._$validationMessage = $('<div>').addClass(INVALID_MESSAGE)
                .html(validationErrorMessage)
                .appendTo($element);

            const validationTarget = this._getValidationMessageTarget();

            this._validationMessage = this._createComponent(this._$validationMessage, Overlay, extend({
                integrationOptions: {},
                templatesRenderAsynchronously: false,
                target: validationTarget,
                shading: false,
                width: 'auto',
                height: 'auto',
                container: $element,
                position: this._getValidationMessagePosition('below'),
                closeOnOutsideClick: false,
                closeOnTargetScroll: false,
                animation: null,
                visible: true,
                propagateOutsideClick: true,
                _checkParentVisibility: false
            }, this._getInnerOptionsCache('validationTooltipOptions')));

            this._$validationMessage
                .toggleClass(INVALID_MESSAGE_AUTO, validationMessageMode === 'auto')
                .toggleClass(INVALID_MESSAGE_ALWAYS, validationMessageMode === 'always');

            const messageId = 'dx-' + new Guid();

            this._validationMessage.$content()
                .addClass(INVALID_MESSAGE_CONTENT)
                .attr('id', messageId);

            this.setAria('describedby', messageId);

            this._setValidationMessageMaxWidth();
            this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
        }
    },

    _setValidationMessageMaxWidth: function() {
        if(!this._validationMessage) {
            return;
        }

        if(this._getValidationMessageTarget().outerWidth() === 0) {
            this._validationMessage.option('maxWidth', '100%');
            return;
        }

        const validationMessageMaxWidth = Math.max(VALIDATION_MESSAGE_MIN_WIDTH, this._getValidationMessageTarget().outerWidth());
        this._validationMessage.option('maxWidth', validationMessageMaxWidth);
    },

    _getValidationMessageTarget: function() {
        return this.$element();
    },

    _getValidationMessagePosition: function(positionRequest) {
        const rtlEnabled = this.option('rtlEnabled');
        const messagePositionSide = getDefaultAlignment(rtlEnabled);
        const messageOriginalOffset = this.option('validationMessageOffset');
        const messageOffset = { h: messageOriginalOffset.h, v: messageOriginalOffset.v };
        const verticalPositions = positionRequest === 'below' ? [' top', ' bottom'] : [' bottom', ' top'];

        if(rtlEnabled) messageOffset.h = -messageOffset.h;
        if(positionRequest !== 'below') messageOffset.v = -messageOffset.v;

        return {
            offset: messageOffset,
            boundary: this.option('validationBoundary'),
            my: messagePositionSide + verticalPositions[0],
            at: messagePositionSide + verticalPositions[1],
            collision: 'none flip'
        };
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

        dataUtils.data(element, VALIDATION_TARGET, null);
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

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onValueChanged':
                this._createValueChangeAction();
                break;
            case 'isValid':
            case 'validationError':
                this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
                break;
            case 'validationErrors':
            case 'validationStatus':
                this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
                this._renderValidationState();
                break;
            case 'validationBoundary':
            case 'validationMessageMode':
                this._renderValidationState();
                break;
            case 'validationTooltipOptions':
                this._innerOptionChanged(this._validationMessage, args);
                break;
            case 'readOnly':
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case 'value':
                if(!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(args.value, args.previousValue);
                    this._saveValueChangeEvent(undefined);
                }
                if(args.value != args.previousValue) { // eslint-disable-line eqeqeq
                    this.validationRequest.fire({
                        value: args.value,
                        editor: this
                    });
                }
                break;
            case 'width':
                this.callBase(args);
                this._setValidationMessageMaxWidth();
                break;
            case 'name':
                this._setSubmitElementName(args.value);
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name EditorMethods.reset
    * @publicName reset()
    */
    reset: function() {
        const defaultOptions = this._getDefaultOptions();
        this.option('value', defaultOptions.value);
    }
});

module.exports = Editor;
