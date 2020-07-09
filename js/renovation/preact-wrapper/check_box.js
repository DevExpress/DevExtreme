import Component from './component';
import ValidationEngine from '../../ui/validation_engine';
import { extend } from '../../core/utils/extend';
import Overlay from '../../ui/overlay';
import windowUtils from '../../core/utils/window';
import { encodeHtml } from '../../core/utils/string';
import $ from '../../core/renderer';
import Guid from '../../core/guid';
import { data } from '../../core/element_data';
import Callbacks from '../../core/utils/callbacks';
import { getDefaultAlignment } from '../../core/utils/position';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;

export default class CheckBox extends Component {
    _init() {
        super._init();

        data(this.$element()[0], VALIDATION_TARGET, this);
        this.validationRequest = Callbacks();
        this.showValidationMessageTimeout = null;

        this._valueChangeAction = this._createActionByOption('onValueChanged', {
            excludeValidators: ['disabled', 'readOnly']
        });
    }

    _getDefaultOptions() {
        return extend(
            super._getDefaultOptions(),
            {
                validationMessageOffset: { h: 0, v: 0 },
                validationTooltipOptions: {}
            }
        );
    }

    getProps() {
        const props = super.getProps();
        props.onFocusIn = () => {
            const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

            // NOTE: The click should be processed before the validation message is shown because
            // it can change the editor's value
            if(this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
                // NOTE: Prevent the validation message from showing
                this._$validationMessage && this._$validationMessage.removeClass(INVALID_MESSAGE_AUTO);

                clearTimeout(this.showValidationMessageTimeout);

                // NOTE: Show the validation message after a click changes the value
                this.showValidationMessageTimeout = setTimeout(() => {
                    this._$validationMessage && this._$validationMessage.addClass(INVALID_MESSAGE_AUTO);
                }, 150
                );
            }
        };
        return props;
    }

    _getValidationErrorMessage(validationErrors) {
        let validationErrorMessage = '';
        if(validationErrors) {
            validationErrors.forEach(function(err) {
                if(err.message) {
                    validationErrorMessage += ((validationErrorMessage ? '<br />' : '') + encodeHtml(err.message));
                }
            });
        }
        return validationErrorMessage;
    }

    _setValidationMessageMaxWidth() {
        if(!this._validationMessage) {
            return;
        }

        if(this._getValidationMessageTarget().outerWidth() === 0) {
            this._validationMessage.option('maxWidth', '100%');
            return;
        }

        const validationMessageMaxWidth = Math.max(VALIDATION_MESSAGE_MIN_WIDTH, this._getValidationMessageTarget().outerWidth());
        this._validationMessage.option('maxWidth', validationMessageMaxWidth);
    }

    _renderValidationState() {
        const isValid = this.option('isValid') && this.option('validationStatus') !== 'invalid';
        const validationMessageMode = this.option('validationMessageMode');
        const $element = this.$element();
        let validationErrors = this.option('validationErrors');
        if(!validationErrors && this.option('validationError')) {
            validationErrors = [this.option('validationError')];
        }

        if(!windowUtils.hasWindow()) {
            return;
        }

        if(this._$validationMessage) {
            this._$validationMessage.remove();
            $element.attr('aria-describedby', null);
            this._$validationMessage = null;
        }

        const validationErrorMessage = this._getValidationErrorMessage(validationErrors);

        if(!isValid && validationErrorMessage) {
            this._$validationMessage = $('<div>').addClass('dx-invalid-message')
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
            }, this._options.cache('validationTooltipOptions')));

            this._$validationMessage
                .toggleClass(INVALID_MESSAGE_AUTO, validationMessageMode === 'auto')
                .toggleClass('dx-invalid-message-always', validationMessageMode === 'always');

            const messageId = 'dx-' + new Guid();

            this._validationMessage.$content()
                .addClass('dx-invalid-message-content')
                .attr('id', messageId);

            $element.attr('aria-describedby', messageId);

            this._setValidationMessageMaxWidth();
            this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
        }
    }

    _bindInnerWidgetOptions(innerWidget, optionsContainer) {
        const syncOptions = () =>
            this._options.silent(optionsContainer, extend({}, innerWidget.option()));

        syncOptions();
        innerWidget.on('optionChanged', syncOptions);
    }

    _getValidationMessageTarget() {
        return this.$element();
    }

    _getValidationMessagePosition(positionRequest) {
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
    }

    _optionChanged(option) {
        const { name, value } = option || {};
        if(name && this._getActionConfigs()[name]) {
            this._addAction(name);
        }

        switch(name) {
            case 'value':
                this.validationRequest.fire({
                    value,
                    editor: this
                });
                this._valueChangeAction?.({
                    element: this.$element(),
                    previousValue: !value,
                    value: value,
                });
                break;
            case 'isValid':
            case 'validationError':
                this.option(ValidationEngine.synchronizeValidationOptions(option, this.option()));
                break;
            case 'validationErrors':
            case 'validationStatus':
                this.option(ValidationEngine.synchronizeValidationOptions(option, this.option()));
                this._renderValidationState();
                break;
            default:
                this.$element().toggleClass('dx-invalid', !this.option('isValid'));
                super._optionChanged(option);
        }

        this._invalidate();
    }

    _canValueBeChangedByClick() {
        return true;
    }

    _dispose() {
        super._dispose();

        data(this.element(), VALIDATION_TARGET, null);
        clearTimeout(this.showValidationMessageTimeout);
    }
}
