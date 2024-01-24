import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { focused } from '../widget/selectors';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { current, isMaterial, isFluent } from '../themes';
import devices from '../../core/devices';
import Editor from '../editor/editor';
import { addNamespace, normalizeKeyName } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import ClearButton from './ui.text_editor.clear';
import TextEditorButtonCollection from './texteditor_button_collection/index';
import config from '../../core/config';
import errors from '../widget/ui.errors';
import { Deferred } from '../../core/utils/deferred';
import LoadIndicator from '../load_indicator';
import { TextEditorLabel } from './ui.text_editor.label';
import { getWidth } from '../../core/utils/size';
import resizeObserverSingleton from '../../core/resize_observer';
import Guid from '../../core/guid';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_INPUT_SELECTOR = '.' + TEXTEDITOR_INPUT_CLASS;
const TEXTEDITOR_CONTAINER_CLASS = 'dx-texteditor-container';
const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';
const TEXTEDITOR_PLACEHOLDER_CLASS = 'dx-placeholder';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';

const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const TEXTEDITOR_VALIDATION_PENDING_CLASS = 'dx-validation-pending';
const TEXTEDITOR_VALID_CLASS = 'dx-valid';

const EVENTS_LIST = [
    'KeyDown', 'KeyPress', 'KeyUp',
    'Change', 'Cut', 'Copy', 'Paste', 'Input'
];

const CONTROL_KEYS = [
    'tab',
    'enter',
    'shift',
    'control',
    'alt',
    'escape',
    'pageUp',
    'pageDown',
    'end',
    'home',
    'leftArrow',
    'upArrow',
    'rightArrow',
    'downArrow',
];

let TextEditorLabelCreator = TextEditorLabel;

function checkButtonsOptionType(buttons) {
    if(isDefined(buttons) && !Array.isArray(buttons)) {
        throw errors.Error('E1053');
    }
}

class TextEditorBase extends Editor {
    ctor(_, options) {
        if(options) {
            checkButtonsOptionType(options.buttons);
        }

        this._buttonCollection = new TextEditorButtonCollection(this, this._getDefaultButtons());

        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;
        this._labelContainerElement = null;

        super.ctor.apply(this, arguments);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            buttons: void 0,

            value: '',

            spellcheck: false,

            showClearButton: false,

            valueChangeEvent: 'change',

            placeholder: '',

            inputAttr: {},

            onFocusIn: null,

            onFocusOut: null,

            onKeyDown: null,

            onKeyUp: null,

            onChange: null,

            onInput: null,

            onCut: null,

            onCopy: null,

            onPaste: null,

            onEnterKey: null,

            mode: 'text',

            hoverStateEnabled: true,

            focusStateEnabled: true,

            text: undefined,

            displayValueFormatter(value) {
                return isDefined(value) && value !== false ? value : '';
            },


            stylingMode: config().editorStylingMode || 'outlined',

            showValidationMark: true,

            label: '',

            labelMode: 'static',

            labelMark: ''
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device() {
                    const themeName = current();
                    return isMaterial(themeName);
                },
                options: {
                    labelMode: 'floating',
                    stylingMode: config().editorStylingMode || 'filled',
                }
            },
            {
                device() {
                    const themeName = current();
                    return isFluent(themeName);
                },
                options: {
                    labelMode: 'outside'
                }
            }
        ]);
    }

    _getDefaultButtons() {
        return [{ name: 'clear', Ctor: ClearButton }];
    }

    _isClearButtonVisible() {
        return this.option('showClearButton') && !this.option('readOnly');
    }

    _input() {
        return this.$element().find(TEXTEDITOR_INPUT_SELECTOR).first();
    }

    _isFocused() {
        return focused(this._input()) || super._isFocused();
    }

    _inputWrapper() {
        return this.$element();
    }

    _buttonsContainer() {
        return this._inputWrapper().find('.' + TEXTEDITOR_BUTTONS_CONTAINER_CLASS).eq(0);
    }

    _isControlKey(key) {
        return CONTROL_KEYS.indexOf(key) !== -1;
    }

    _renderStylingMode() {
        super._renderStylingMode();
        this._updateButtonsStyling(this.option('stylingMode'));
    }

    _initMarkup() {
        this.$element()
            .addClass(TEXTEDITOR_CLASS);

        this._renderInput();
        this._renderStylingMode();
        this._renderInputType();
        this._renderPlaceholder();

        this._renderProps();

        super._initMarkup();

        this._renderValue();

        this._renderLabel();
    }

    _render() {
        super._render();

        this._refreshValueChangeEvent();
        this._renderEvents();

        this._renderEnterKeyAction();
        this._renderEmptinessEvent();
    }

    _renderInput() {
        this._$buttonsContainer = this._$textEditorContainer = $('<div>')
            .addClass(TEXTEDITOR_CONTAINER_CLASS)
            .appendTo(this.$element());

        this._$textEditorInputContainer = $('<div>')
            .addClass(TEXTEDITOR_INPUT_CONTAINER_CLASS)
            .appendTo(this._$textEditorContainer);
        this._$textEditorInputContainer.append(this._createInput());

        this._renderButtonContainers();
    }

    _getInputContainer() {
        return this._$textEditorInputContainer;
    }

    _renderPendingIndicator() {
        this.$element().addClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
        const $inputContainer = this._getInputContainer();
        const $indicatorElement = $('<div>')
            .addClass(TEXTEDITOR_PENDING_INDICATOR_CLASS)
            .appendTo($inputContainer);
        this._pendingIndicator = this._createComponent($indicatorElement, LoadIndicator);
    }

    _disposePendingIndicator() {
        if(!this._pendingIndicator) {
            return;
        }
        this._pendingIndicator.dispose();
        this._pendingIndicator.$element().remove();
        this._pendingIndicator = null;
        this.$element().removeClass(TEXTEDITOR_VALIDATION_PENDING_CLASS);
    }

    _renderValidationState() {
        super._renderValidationState();
        const isPending = this.option('validationStatus') === 'pending';

        if(isPending) {
            !this._pendingIndicator && this._renderPendingIndicator();
            this._showValidMark = false;
        } else {
            if(this.option('validationStatus') === 'invalid') {
                this._showValidMark = false;
            }
            if(!this._showValidMark && this.option('showValidationMark') === true) {
                this._showValidMark = this.option('validationStatus') === 'valid' && !!this._pendingIndicator;
            }
            this._disposePendingIndicator();
        }

        this._toggleValidMark();
    }

    _renderButtonContainers() {
        const buttons = this.option('buttons');

        this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, this._$buttonsContainer);
        this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, this._$buttonsContainer);
    }

    _cleanButtonContainers() {
        this._$beforeButtonsContainer?.remove();
        this._$afterButtonsContainer?.remove();
        this._buttonCollection.clean();
    }

    _clean() {
        this._buttonCollection.clean();
        this._disposePendingIndicator();
        this._unobserveLabelContainerResize();
        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;
        this._$textEditorContainer = null;
        this._$buttonsContainer = null;
        super._clean();
    }

    _createInput() {
        const $input = $('<input>');
        this._applyInputAttributes($input, this.option('inputAttr'));
        return $input;
    }

    _setSubmitElementName(name) {
        const inputAttrName = this.option('inputAttr.name');
        return super._setSubmitElementName(name || inputAttrName || '');
    }

    _applyInputAttributes($input, customAttributes) {
        const inputAttributes = extend(this._getDefaultAttributes(), customAttributes);
        $input
            .attr(inputAttributes)
            .addClass(TEXTEDITOR_INPUT_CLASS);

        this._setInputMinHeight($input);
    }

    _setInputMinHeight($input) {
        $input.css('minHeight', this.option('height') ? '0' : '');
    }

    _getPlaceholderAttr() {
        const { ios, mac } = devices.real();
        const { placeholder } = this.option();

        // WA to fix vAlign (T898735)
        // https://bugs.webkit.org/show_bug.cgi?id=142968
        const value = placeholder || ((ios || mac) ? ' ' : null);

        return value;
    }

    _getDefaultAttributes() {
        const defaultAttributes = {
            autocomplete: 'off',
            placeholder: this._getPlaceholderAttr(),
        };

        return defaultAttributes;
    }

    _updateButtons(names) {
        this._buttonCollection.updateButtons(names);
    }

    _updateButtonsStyling(editorStylingMode) {
        each(this.option('buttons'), (_, { options, name: buttonName }) => {
            if(options && !options.stylingMode && this.option('visible')) {
                const buttonInstance = this.getButton(buttonName);
                buttonInstance.option && buttonInstance.option('stylingMode', editorStylingMode === 'underlined' ? 'text' : 'contained');
            }
        });
    }

    _renderValue() {
        const renderInputPromise = this._renderInputValue();
        return renderInputPromise.promise();
    }

    _renderInputValue(value) {
        value = value ?? this.option('value');

        let text = this.option('text');
        const displayValue = this.option('displayValue');
        const displayValueFormatter = this.option('displayValueFormatter');

        if(displayValue !== undefined && value !== null) {
            text = displayValueFormatter(displayValue);
        } else if(!isDefined(text)) {
            text = displayValueFormatter(value);
        }

        this.option('text', text);

        // fallback to empty string is required to support WebKit native date picker in some basic scenarios
        // can not be covered by QUnit
        if(this._input().val() !== (isDefined(text) ? text : '')) {
            this._renderDisplayText(text);
        } else {
            this._toggleEmptinessEventHandler();
        }

        return new Deferred().resolve();
    }

    _renderDisplayText(text) {
        this._input().val(text);
        this._toggleEmptinessEventHandler();
    }

    _isValueValid() {
        if(this._input().length) {
            const validity = this._input().get(0).validity;

            if(validity) {
                return validity.valid;
            }
        }

        return true;
    }

    _toggleEmptiness(isEmpty) {
        this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
        this._togglePlaceholder(isEmpty);
    }

    _togglePlaceholder(isEmpty) {
        this.$element()
            .find(`.${TEXTEDITOR_PLACEHOLDER_CLASS}`)
            .eq(0)
            .toggleClass(STATE_INVISIBLE_CLASS, !isEmpty);
    }

    _renderProps() {
        this._toggleReadOnlyState();
        this._toggleSpellcheckState();
        this._toggleTabIndex();
    }

    _toggleDisabledState(value) {
        super._toggleDisabledState.apply(this, arguments);

        const $input = this._input();
        $input.prop('disabled', value);
    }

    _toggleTabIndex() {
        const $input = this._input();
        const disabled = this.option('disabled');
        const focusStateEnabled = this.option('focusStateEnabled');

        if(disabled || !focusStateEnabled) {
            $input.attr('tabIndex', -1);
        } else {
            $input.removeAttr('tabIndex');
        }
    }

    _toggleReadOnlyState() {
        this._input().prop('readOnly', this._readOnlyPropValue());
        super._toggleReadOnlyState();
    }

    _readOnlyPropValue() {
        return this.option('readOnly');
    }

    _toggleSpellcheckState() {
        this._input().prop('spellcheck', this.option('spellcheck'));
    }

    _unobserveLabelContainerResize() {
        if(this._labelContainerElement) {
            resizeObserverSingleton.unobserve(this._labelContainerElement);

            this._labelContainerElement = null;
        }
    }

    _getLabelContainer() {
        return this._input();
    }

    _getLabelContainerWidth() {
        return getWidth(this._getLabelContainer());
    }

    _getLabelBeforeWidth() {
        const buttonsBeforeWidth = this._$beforeButtonsContainer && getWidth(this._$beforeButtonsContainer);

        return buttonsBeforeWidth ?? 0;
    }

    _updateLabelWidth() {
        this._label.updateBeforeWidth(this._getLabelBeforeWidth());
        this._label.updateMaxWidth(this._getLabelContainerWidth());
    }

    _getFieldElement() {
        return this._getLabelContainer();
    }

    _setFieldAria(force) {
        const { 'aria-label': ariaLabel } = this.option('inputAttr');

        const labelId = this._label.getId();

        const value = ariaLabel ? undefined : labelId;

        if(value || force) {
            const aria = {
                'labelledby': value,
                label: ariaLabel,
            };
            this.setAria(aria, this._getFieldElement());
        }
    }

    _renderLabel() {
        this._unobserveLabelContainerResize();

        this._labelContainerElement = $(this._getLabelContainer()).get(0);

        const { label, labelMode, labelMark, rtlEnabled } = this.option();

        const labelConfig = {
            onClickHandler: () => {
                this.focus();
            },
            onHoverHandler: (e) => { e.stopPropagation(); },
            onActiveHandler: (e) => { e.stopPropagation(); },
            $editor: this.$element(),
            text: label,
            mark: labelMark,
            mode: labelMode,
            rtlEnabled,
            containsButtonsBefore: !!this._$beforeButtonsContainer,
            getContainerWidth: () => {
                return this._getLabelContainerWidth();
            },
            getBeforeWidth: () => {
                return this._getLabelBeforeWidth();
            }
        };

        this._label = new TextEditorLabelCreator(labelConfig);

        this._setFieldAria();

        if(this._labelContainerElement) { // NOTE: element can be not in DOM yet in React and Vue
            resizeObserverSingleton.observe(this._labelContainerElement, this._updateLabelWidth.bind(this));
        }
    }

    _renderPlaceholder() {
        this._renderPlaceholderMarkup();
        this._attachPlaceholderEvents();
    }

    _renderPlaceholderMarkup() {
        if(this._$placeholder) {
            this._$placeholder.remove();
            this._$placeholder = null;
        }

        const $input = this._input();
        const placeholder = this.option('placeholder');
        const placeholderAttributes = {
            'id': placeholder ? `dx-${new Guid()}` : undefined,
            'data-dx_placeholder': placeholder,
        };

        const $placeholder = this._$placeholder = $('<div>')
            .attr(placeholderAttributes);

        $placeholder.insertAfter($input);
        $placeholder.addClass(TEXTEDITOR_PLACEHOLDER_CLASS);
    }

    _attachPlaceholderEvents() {
        const startEvent = addNamespace(pointerEvents.up, this.NAME);

        eventsEngine.on(this._$placeholder, startEvent, () => {
            eventsEngine.trigger(this._input(), 'focus');
        });
        this._toggleEmptinessEventHandler();
    }

    _placeholder() {
        return this._$placeholder || $();
    }

    _clearValueHandler(e) {
        const $input = this._input();
        e.stopPropagation();

        this._saveValueChangeEvent(e);
        this._clearValue();

        !this._isFocused() && eventsEngine.trigger($input, 'focus');
        eventsEngine.trigger($input, 'input');
    }

    _clearValue() {
        this.clear();
    }

    _renderEvents() {
        const $input = this._input();

        each(EVENTS_LIST, (_, event) => {
            if(this.hasActionSubscription('on' + event)) {

                const action = this._createActionByOption('on' + event, { excludeValidators: ['readOnly'] });

                eventsEngine.on($input, addNamespace(event.toLowerCase(), this.NAME), (e) => {
                    if(this._disposed) {
                        return;
                    }

                    action({ event: e });
                });
            }
        });
    }

    _refreshEvents() {
        const $input = this._input();

        each(EVENTS_LIST, (_, event) => {
            eventsEngine.off($input, addNamespace(event.toLowerCase(), this.NAME));
        });

        this._renderEvents();
    }

    _keyPressHandler() {
        this.option('text', this._input().val());
    }

    _keyDownHandler(e) {
        const $input = this._input();
        const isCtrlEnter = e.ctrlKey && normalizeKeyName(e) === 'enter';
        const isNewValue = $input.val() !== this.option('value');

        if(isCtrlEnter && isNewValue) {
            eventsEngine.trigger($input, 'change');
        }
    }

    _getValueChangeEventOptionName() {
        return 'valueChangeEvent';
    }

    _renderValueChangeEvent() {
        const keyPressEvent = addNamespace(this._renderValueEventName(), `${this.NAME}TextChange`);
        const valueChangeEvent = addNamespace(this.option(this._getValueChangeEventOptionName()), `${this.NAME}ValueChange`);
        const keyDownEvent = addNamespace('keydown', `${this.NAME}TextChange`);
        const $input = this._input();

        eventsEngine.on($input, keyPressEvent, this._keyPressHandler.bind(this));
        eventsEngine.on($input, valueChangeEvent, this._valueChangeEventHandler.bind(this));
        eventsEngine.on($input, keyDownEvent, this._keyDownHandler.bind(this));
    }

    _cleanValueChangeEvent() {
        const valueChangeNamespace = `.${this.NAME}ValueChange`;
        const textChangeNamespace = `.${this.NAME}TextChange`;

        eventsEngine.off(this._input(), valueChangeNamespace);
        eventsEngine.off(this._input(), textChangeNamespace);
    }

    _refreshValueChangeEvent() {
        this._cleanValueChangeEvent();
        this._renderValueChangeEvent();
    }

    _renderValueEventName() {
        return 'input change keypress';
    }

    _focusTarget() {
        return this._input();
    }

    _focusEventTarget() {
        return this.element();
    }

    _isInput(element) {
        return element === this._input().get(0);
    }

    _preventNestedFocusEvent(event) {
        if(event.isDefaultPrevented()) {
            return true;
        }

        let shouldPrevent = this._isNestedTarget(event.relatedTarget);

        if(event.type === 'focusin') {
            shouldPrevent = shouldPrevent && this._isNestedTarget(event.target) && !this._isInput(event.target);
        } else if(!shouldPrevent) {
            this._toggleFocusClass(false, this.$element());
        }

        shouldPrevent && event.preventDefault();
        return shouldPrevent;
    }

    _isNestedTarget(target) {
        return !!this.$element().find(target).length;
    }

    _focusClassTarget() {
        return this.$element();
    }

    _focusInHandler(event) {
        this._preventNestedFocusEvent(event);

        super._focusInHandler.apply(this, arguments);
    }

    _focusOutHandler(event) {
        this._preventNestedFocusEvent(event);

        super._focusOutHandler.apply(this, arguments);
    }

    _toggleFocusClass(isFocused, $element) {
        super._toggleFocusClass(isFocused, this._focusClassTarget($element));
    }

    _hasFocusClass(element) {
        return super._hasFocusClass($(element || this.$element()));
    }

    _renderEmptinessEvent() {
        const $input = this._input();

        eventsEngine.on($input, 'input blur', this._toggleEmptinessEventHandler.bind(this));
    }

    _toggleEmptinessEventHandler() {
        const text = this._input().val();
        const isEmpty = (text === '' || text === null) && this._isValueValid();

        this._toggleEmptiness(isEmpty);
    }

    _valueChangeEventHandler(e, formattedValue) {
        if(this.option('readOnly')) {
            return;
        }
        this._saveValueChangeEvent(e);
        this.option('value', arguments.length > 1 ? formattedValue : this._input().val());
        this._saveValueChangeEvent(undefined);
    }

    _renderEnterKeyAction() {
        this._enterKeyAction = this._createActionByOption('onEnterKey', {
            excludeValidators: ['readOnly']
        });

        eventsEngine.off(this._input(), 'keyup.onEnterKey.dxTextEditor');
        eventsEngine.on(this._input(), 'keyup.onEnterKey.dxTextEditor', this._enterKeyHandlerUp.bind(this));
    }

    _enterKeyHandlerUp(e) {
        if(this._disposed) {
            return;
        }

        if(normalizeKeyName(e) === 'enter') {
            this._enterKeyAction({ event: e });
        }
    }

    _updateValue() {
        this._options.silent('text', null);
        this._renderValue();
    }

    _dispose() {
        this._enterKeyAction = undefined;
        super._dispose();
    }

    _getSubmitElement() {
        return this._input();
    }

    _hasActiveElement() {
        return this._input().is(domAdapter.getActiveElement(this._input()[0]));
    }

    _optionChanged(args) {
        const { name, fullName, value } = args;

        const eventName = name.replace('on', '');
        if(EVENTS_LIST.includes(eventName)) {
            this._refreshEvents();
            return;
        }

        switch(name) {
            case 'valueChangeEvent':
                this._refreshValueChangeEvent();
                this._refreshFocusEvent();
                this._refreshEvents();
                break;
            case 'onValueChanged':
                this._createValueChangeAction();
                break;
            case 'focusStateEnabled':
                super._optionChanged(args);
                this._toggleTabIndex();
                break;
            case 'spellcheck':
                this._toggleSpellcheckState();
                break;
            case 'mode':
                this._renderInputType();
                break;
            case 'onEnterKey':
                this._renderEnterKeyAction();
                break;
            case 'placeholder':
                this._renderPlaceholder();
                this._setFieldAria(true);
                this._input().attr({ placeholder: this._getPlaceholderAttr() });
                break;
            case 'label':
                this._label.updateText(value);
                this._setFieldAria(true);
                break;
            case 'labelMark':
                this._label.updateMark(value);
                break;
            case 'labelMode':
                this._label.updateMode(value);
                this._setFieldAria();
                break;
            case 'width':
                super._optionChanged(args);
                this._label.updateMaxWidth(this._getLabelContainerWidth());
                break;
            case 'readOnly':
            case 'disabled':
                this._updateButtons();
                super._optionChanged(args);
                break;
            case 'showClearButton':
                this._updateButtons(['clear']);
                break;
            case 'text':
                break;
            case 'value':
                this._updateValue();
                super._optionChanged(args);
                break;
            case 'inputAttr':
                this._applyInputAttributes(this._input(), this.option(name));
                break;
            case 'stylingMode':
                this._renderStylingMode();
                this._updateLabelWidth();
                break;
            case 'buttons':
                if(fullName === name) {
                    checkButtonsOptionType(value);
                }
                this._cleanButtonContainers();
                this._renderButtonContainers();
                this._updateButtonsStyling(this.option('stylingMode'));
                this._updateLabelWidth();
                this._label.updateContainsButtonsBefore(!!this._$beforeButtonsContainer);
                break;
            case 'visible':
                super._optionChanged(args);
                if(value && this.option('buttons')) {
                    this._cleanButtonContainers();
                    this._renderButtonContainers();
                    this._updateButtonsStyling(this.option('stylingMode'));
                }
                break;
            case 'displayValueFormatter':
                this._invalidate();
                break;
            case 'showValidationMark':
                break;
            default:
                super._optionChanged(args);
        }
    }

    _renderInputType() {
        // B218621, B231875
        this._setInputType(this.option('mode'));
    }

    _setInputType(type) {
        const input = this._input();

        if(type === 'search') {
            type = 'text';
        }

        try {
            input.prop('type', type);
        } catch(e) {
            input.prop('type', 'text');
        }
    }

    getButton(name) {
        return this._buttonCollection.getButton(name);
    }

    focus() {
        eventsEngine.trigger(this._input(), 'focus');
    }

    clear() {
        if(this._showValidMark) {
            this._showValidMark = false;
            this._renderValidationState();
        }

        const defaultOptions = this._getDefaultOptions();
        if(this.option('value') === defaultOptions.value) {
            this._options.silent('text', '');
            this._renderValue();
        } else {
            this.option('value', defaultOptions.value);
        }
    }

    _resetToInitialValue() {
        if(this.option('value') === this._initialValue) {
            this._options.silent('text', this._initialValue);
            this._renderValue();
        } else {
            super._resetToInitialValue();
        }

        this._disposePendingIndicator();
        this._showValidMark = false;
        this._toggleValidMark();
    }

    _toggleValidMark() {
        this.$element().toggleClass(TEXTEDITOR_VALID_CLASS, !!this._showValidMark);
    }

    reset(value = undefined) {
        if(arguments.length) {
            super.reset(value);
        } else {
            super.reset();
        }
    }

    on(eventName, eventHandler) {
        const result = super.on(eventName, eventHandler);
        const event = eventName.charAt(0).toUpperCase() + eventName.substr(1);

        if(EVENTS_LIST.indexOf(event) >= 0) {
            this._refreshEvents();
        }
        return result;
    }
}

///#DEBUG
TextEditorBase.mockTextEditorLabel = (mock) => {
    TextEditorLabelCreator = mock;
};
TextEditorBase.restoreTextEditorLabel = (mock) => {
    TextEditorLabelCreator = TextEditorLabel;
};
///#ENDDEBUG

export default TextEditorBase;
