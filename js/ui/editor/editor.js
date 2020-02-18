import $ from '../../core/renderer';
import dataUtils from '../../core/element_data';
import { buildErrorMessage, initValidationOptions, synchronizeValidationOptions } from '../validation_engine';
import { hasWindow } from '../../core/utils/window';
import { addNamespace, normalizeKeyName } from '../../events/utils';
import { getDefaultAlignment } from '../../core/utils/position';
import { extend } from '../../core/utils/extend';
import Callbacks from '../../core/utils/callbacks';
import EventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import Overlay from '../overlay';
import Widget from '../widget/ui.widget';

const Editor = Widget.inherit({
    ctor() {
        this.showValidationMessageTimeout = null;
        this.validationRequest = Callbacks();
        this.callBase.apply(this, arguments);

        const element = this.$element()?.get(0);

        element && dataUtils.data(element, 'dx-validation-target', this);
    },

    _initOptions(options) {
        this.callBase.apply(this, arguments);
        this.option(initValidationOptions(options));
    },

    _init() {
        this.callBase();

        const $element = this.$element();
        const { validationTooltipOptions } = this.option();

        this._options.cache('validationTooltipOptions', validationTooltipOptions);
        $element.addClass('dx-show-invalid-badge');
    },

    _getDefaultOptions() {
        return extend(this.callBase(), {
            /**
            * @name EditorOptions.name
            * @type string
            * @default ""
            * @hidden
            */
            name: '',

            value: null,
            onValueChanged: null,
            readOnly: false,
            isValid: true,
            validationError: null,
            validationErrors: null,
            validationStatus: 'valid',
            validationMessageMode: 'auto',
            validationBoundary: undefined,
            validationMessageOffset: { h: 0, v: 0 },
            validationTooltipOptions: {}
        });
    },

    _attachKeyboardEvents() {
        const readOnly = this.option();

        !readOnly && this.callBase();
    },

    _setOptionsByReference() {
        this.callBase();

        extend(this._optionsByReference, { validationError: true });
    },

    _createValueChangeAction() {
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _suppressValueChangeAction() {
        this._valueChangeActionSuppressed = true;
    },

    _resumeValueChangeAction() {
        this._valueChangeActionSuppressed = false;
    },

    _initMarkup() {
        const { name } = this.option();

        this._toggleReadOnlyState();
        this._setSubmitElementName(name);

        this.callBase();
        this._renderValidationState();
    },

    _raiseValueChangeAction(value, previousValue) {
        !this._valueChangeAction && this._createValueChangeAction();
        this._valueChangeAction(this._valueChangeArgs(value, previousValue));
    },

    _valueChangeArgs(value, previousValue) {
        return {
            value,
            previousValue,
            event: this._valueChangeEventInstance
        };
    },

    _saveValueChangeEvent(e) {
        this._valueChangeEventInstance = e;
    },

    _focusInHandler(e) {
        const { validationMessageMode } = this.option();
        const isValidationMessageShownOnFocus = validationMessageMode === 'auto';

        // NOTE: The click should be processed before the validation message is shown because
        // it can change the editor's value
        if(this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
            // NOTE: Prevent the validation message from showing
            this._$validationMessage?.removeClass('dx-invalid-message-auto');

            clearTimeout(this.showValidationMessageTimeout);

            // NOTE: Show the validation message after a click changes the value
            this.showValidationMessageTimeout = setTimeout(
                () => this._$validationMessage?.addClass('dx-invalid-message-auto'), 150
            );
        }

        return this.callBase(e);
    },

    _canValueBeChangedByClick() {
        return false;
    },

    _createValidationOverlay($element, $message) {
        return this._createComponent($message, Overlay, extend({
            integrationOptions: {},
            templatesRenderAsynchronously: false,
            target: this._getValidationMessageTarget(),
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
        }, this._options.cache('validationTooltipOptions')));
    },

    _renderValidationState() {
        const $element = this.$element();
        const { validationStatus, validationError, validationMessageMode } = this.option();
        let { validationErrors, isValid } = this.option();

        isValid = isValid && validationStatus !== 'invalid';

        if(!validationErrors && validationError) {
            validationErrors = [validationError];
        }

        $element.toggleClass('dx-invalid', !isValid);
        this.setAria('invalid', !isValid || undefined);

        if(!hasWindow()) {
            return;
        }

        const errorMessage = buildErrorMessage(validationErrors);

        if(this._$validationMessage) {
            this._$validationMessage.remove();
            this.setAria('describedby', null);
            this._$validationMessage = null;
        }

        if(!isValid && errorMessage) {
            const messageId = `dx-${new Guid()}`;

            this._$validationMessage = $('<div>');
            this._validationMessage = this._createValidationOverlay($element, this._$validationMessage);
            this._$validationMessage
                .addClass('dx-invalid-message')
                .html(errorMessage)
                .toggleClass('dx-invalid-message-auto', validationMessageMode === 'auto')
                .toggleClass('dx-invalid-message-always', validationMessageMode === 'always')
                .appendTo($element)
                .$content()
                .addClass('dx-invalid-message-content')
                .attr('id', messageId);

            this.setAria('describedby', messageId);
            this._setValidationMessageMaxWidth();
            this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
        }
    },

    _setValidationMessageMaxWidth() {
        if(this._validationMessage) {
            const messageTarget = this._getValidationMessageTarget();
            const messageOuterWidth = messageTarget.outerWidth();
            const maxMessageWidth = messageOuterWidth !== 0 ? Math.max(100, messageOuterWidth) : '100%';

            this._validationMessage.option('maxWidth', maxMessageWidth);
        }
    },

    _getValidationMessageTarget() {
        return this.$element();
    },

    _getValidationMessagePosition(positionRequest) {
        const { rtlEnabled, validationMessageOffset, validationBoundary } = this.option();
        const messagePositionSide = getDefaultAlignment(rtlEnabled);
        const verticalPositions = positionRequest === 'below' ? [' top', ' bottom'] : [' bottom', ' top'];

        return {
            offset: {
                h: validationMessageOffset.h * (rtlEnabled ? -1 : 1),
                v: validationMessageOffset.v * (positionRequest !== 'below' ? -1 : 1)
            },
            boundary: validationBoundary,
            my: messagePositionSide + verticalPositions[0],
            at: messagePositionSide + verticalPositions[1],
            collision: 'none flip'
        };
    },

    _toggleReadOnlyState() {
        const { readOnly } = this.option();

        this._toggleBackspaceHandler(readOnly);
        this.$element().toggleClass('dx-state-readonly', !!readOnly);
        this.setAria('readonly', readOnly || undefined);
    },

    _toggleBackspaceHandler(isReadOnly) {
        const $eventTarget = this._keyboardEventBindingTarget();
        const eventName = addNamespace('keydown', 'editorReadOnly');

        EventsEngine.off($eventTarget, eventName);

        isReadOnly && EventsEngine.on($eventTarget, eventName, (e) =>
            normalizeKeyName(e) === 'backspace' && e.preventDefault()
        );
    },

    _dispose() {
        const element = this.$element().get(0);

        dataUtils.data(element, 'dx-validation-target', null);
        clearTimeout(this.showValidationMessageTimeout);
        this.callBase();
    },

    _setSubmitElementName(name) {
        const $submitElement = this._getSubmitElement();

        name.length > 0 ? $submitElement?.attr('name', name) :
            $submitElement?.removeAttr('name');
    },

    _getSubmitElement() {
        return null;
    },

    _optionChanged(args) {
        const { name, value, previousValue } = args;

        switch(name) {
            case 'onValueChanged':
                this._createValueChangeAction();
                break;
            case 'isValid':
            case 'validationError':
                this.option(synchronizeValidationOptions(args, this.option()));
                break;
            case 'validationErrors':
            case 'validationStatus':
                this.option(synchronizeValidationOptions(args, this.option()));
                this._renderValidationState();
                break;
            case 'validationBoundary':
            case 'validationMessageMode':
                this._renderValidationState();
                break;
            case 'validationTooltipOptions':
                this._innerWidgetOptionChanged(this._validationMessage, args);
                break;
            case 'readOnly':
                this._toggleReadOnlyState();
                this._refreshFocusState();
                break;
            case 'value':
                if(!this._valueChangeActionSuppressed) {
                    this._raiseValueChangeAction(value, previousValue);
                    this._saveValueChangeEvent(undefined);
                }

                value != previousValue && this.validationRequest.fire(// eslint-disable-line eqeqeq
                    { editor: this, value }
                );
                break;
            case 'width':
                this.callBase(args);
                this._setValidationMessageMaxWidth();
                break;
            case 'name':
                this._setSubmitElementName(value);
                break;
            default:
                this.callBase(args);
        }
    },

    reset() {
        const { value } = this._getDefaultOptions();

        this.option('value', value);
    }
});

module.exports = Editor;
