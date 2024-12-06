import EventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import { data } from '@js/core/element_data';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { hasWindow } from '@js/core/utils/window';
import ValidationEngine from '@js/ui/validation_engine';
import ValidationMessage from '@js/ui/validation_message';
import Widget from '@js/ui/widget/ui.widget';

import domUtils from '../../core/utils/m_dom';

const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_CLASS = 'dx-invalid';
const DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
const VALIDATION_TARGET = 'dx-validation-target';
const VALIDATION_STATUS_VALID = 'valid';
const VALIDATION_STATUS_INVALID = 'invalid';
const READONLY_NAMESPACE = 'editorReadOnly';

const ALLOWED_STYLING_MODES = ['outlined', 'filled', 'underlined'];

const VALIDATION_MESSAGE_KEYS_MAP = {
  validationMessageMode: 'mode',
  validationMessagePosition: 'positionSide',
  validationMessageOffset: 'offset',
  validationBoundary: 'boundary',
};
// @ts-expect-error
const Editor = Widget.inherit({
  ctor() {
    this.showValidationMessageTimeout = null;
    this.validationRequest = Callbacks();

    this.callBase.apply(this, arguments);
  },

  _createElement(element) {
    this.callBase(element);
    const $element = this.$element();
    if ($element) {
      data($element[0], VALIDATION_TARGET, this);
    }
  },

  _initOptions(options) {
    this.callBase.apply(this, arguments);
    // @ts-expect-error
    this.option(ValidationEngine.initValidationOptions(options));
  },

  _init() {
    this._initialValue = this.option('value');
    this.callBase();
    this._options.cache('validationTooltipOptions', this.option('validationTooltipOptions'));
    const $element = this.$element();
    $element.addClass(DX_INVALID_BADGE_CLASS);
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      value: null,

      name: '',

      onValueChanged: null,

      readOnly: false,

      isValid: true,

      validationError: null,

      validationErrors: null,

      validationStatus: VALIDATION_STATUS_VALID,

      validationMessageMode: 'auto',

      validationMessagePosition: 'bottom',

      validationBoundary: undefined,

      validationMessageOffset: { h: 0, v: 0 },

      validationTooltipOptions: {},

      _showValidationMessage: true,

      isDirty: false,
    });
  },

  _attachKeyboardEvents() {
    if (!this.option('readOnly')) {
      this.callBase();
    }
  },

  _setOptionsByReference() {
    this.callBase();

    extend(this._optionsByReference, {
      validationError: true,
    });
  },

  _createValueChangeAction() {
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  },

  _suppressValueChangeAction() {
    this._valueChangeActionSuppressed = true;
  },

  _resumeValueChangeAction() {
    this._valueChangeActionSuppressed = false;
  },

  _initMarkup() {
    this._toggleReadOnlyState();
    this._setSubmitElementName(this.option('name'));

    this.callBase();
    this._renderValidationState();
    this.option('_onMarkupRendered')?.();
  },

  _raiseValueChangeAction(value, previousValue) {
    if (!this._valueChangeAction) {
      this._createValueChangeAction();
    }
    this._valueChangeAction(this._valueChangeArgs(value, previousValue));
  },

  _valueChangeArgs(value, previousValue) {
    return {
      value,
      previousValue,
      event: this._valueChangeEventInstance,
    };
  },

  _saveValueChangeEvent(e) {
    this._valueChangeEventInstance = e;
  },

  _focusInHandler(e) {
    const isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto';

    // NOTE: The click should be processed before the validation message is shown because
    // it can change the editor's value
    if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
      // NOTE: Prevent the validation message from showing
      const $validationMessageWrapper = this._validationMessage?.$wrapper();
      $validationMessageWrapper?.removeClass(INVALID_MESSAGE_AUTO);

      clearTimeout(this.showValidationMessageTimeout);

      // NOTE: Show the validation message after a click changes the value
      this.showValidationMessageTimeout = setTimeout(() => $validationMessageWrapper?.addClass(INVALID_MESSAGE_AUTO), 150);
    }

    return this.callBase(e);
  },

  _canValueBeChangedByClick() {
    return false;
  },

  _getStylingModePrefix() {
    return 'dx-editor-';
  },

  _renderStylingMode() {
    const optionName = 'stylingMode';
    const optionValue = this.option(optionName);
    const prefix = this._getStylingModePrefix();

    const allowedStylingClasses = ALLOWED_STYLING_MODES.map((mode) => prefix + mode);

    allowedStylingClasses.forEach((className) => this.$element().removeClass(className));

    let stylingModeClass = prefix + optionValue;

    if (!allowedStylingClasses.includes(stylingModeClass)) {
      const defaultOptionValue = this._getDefaultOptions()[optionName];
      const platformOptionValue = this._convertRulesToOptions(this._defaultOptionsRules())[optionName];
      stylingModeClass = prefix + (platformOptionValue || defaultOptionValue);
    }

    this.$element().addClass(stylingModeClass);
  },

  _getValidationErrors() {
    let validationErrors = this.option('validationErrors');
    if (!validationErrors && this.option('validationError')) {
      validationErrors = [this.option('validationError')];
    }
    return validationErrors;
  },

  _disposeValidationMessage() {
    if (this._$validationMessage) {
      this._$validationMessage.remove();
      this.setAria('describedby', null);
      this._$validationMessage = undefined;
      this._validationMessage = undefined;
    }
  },

  _toggleValidationClasses(isInvalid) {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.setAria(VALIDATION_STATUS_INVALID, isInvalid || undefined);
  },

  _renderValidationState() {
    const isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;
    const validationErrors = this._getValidationErrors();
    const $element = this.$element();

    this._toggleValidationClasses(!isValid);

    if (!hasWindow() || this.option('_showValidationMessage') === false) {
      return;
    }

    this._disposeValidationMessage();
    if (!isValid && validationErrors) {
      const {
        validationMessageMode, validationMessageOffset, validationBoundary, rtlEnabled,
      } = this.option();

      this._$validationMessage = $('<div>').appendTo($element);
      const validationMessageContentId = `dx-${new Guid()}`;
      this.setAria('describedby', validationMessageContentId);

      this._validationMessage = new ValidationMessage(this._$validationMessage, extend({
        validationErrors,
        rtlEnabled,
        target: this._getValidationMessageTarget(),
        visualContainer: $element,
        mode: validationMessageMode,
        positionSide: this._getValidationMessagePosition(),
        offset: validationMessageOffset,
        boundary: validationBoundary,
        contentId: validationMessageContentId,
      }, this._options.cache('validationTooltipOptions')));
      this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
    }
  },

  _getValidationMessagePosition() {
    return this.option('validationMessagePosition');
  },

  _getValidationMessageTarget() {
    return this.$element();
  },

  _toggleReadOnlyState() {
    const readOnly = this.option('readOnly');

    this._toggleBackspaceHandler(readOnly);
    this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
    this._setAriaReadonly(readOnly);
  },

  _setAriaReadonly(readOnly) {
    this.setAria('readonly', readOnly || undefined);
  },

  _toggleBackspaceHandler(isReadOnly) {
    const $eventTarget = this._keyboardEventBindingTarget();
    const eventName = addNamespace('keydown', READONLY_NAMESPACE);

    EventsEngine.off($eventTarget, eventName);

    if (isReadOnly) {
      EventsEngine.on($eventTarget, eventName, (e) => {
        if (normalizeKeyName(e) === 'backspace') {
          e.preventDefault();
        }
      });
    }
  },

  _dispose() {
    const element = this.$element()[0];

    data(element, VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);
    this._disposeValidationMessage();
    this.callBase();
  },

  _setSubmitElementName(name) {
    const $submitElement = this._getSubmitElement();

    if (!$submitElement) {
      return;
    }

    if (name.length > 0) {
      $submitElement.attr('name', name);
    } else {
      $submitElement.removeAttr('name');
    }
  },

  _getSubmitElement() {
    return null;
  },

  _setValidationMessageOption({ name, value }) {
    const optionKey = VALIDATION_MESSAGE_KEYS_MAP[name] ? VALIDATION_MESSAGE_KEYS_MAP[name] : name;
    this._validationMessage?.option(optionKey, value);
  },

  _hasActiveElement: noop,

  _optionChanged(args) {
    switch (args.name) {
      case 'onValueChanged':
        this._createValueChangeAction();
        break;
      case 'readOnly':
        this._toggleReadOnlyState();
        this._refreshFocusState();
        break;
      case 'value':
        if (args.value != args.previousValue) { // eslint-disable-line eqeqeq
          this.option('isDirty', this._initialValue !== args.value);

          this.validationRequest.fire({
            value: args.value,
            editor: this,
          });
        }
        if (!this._valueChangeActionSuppressed) {
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
        // @ts-expect-error
        this.option(ValidationEngine.synchronizeValidationOptions(args, this.option()));
        this._renderValidationState();
        break;
      case 'validationBoundary':
      case 'validationMessageMode':
      case 'validationMessagePosition':
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
      case '_showValidationMessage':
      case 'isDirty':
        break;
      default:
        this.callBase(args);
    }
  },

  _resetToInitialValue() {
    this.option('value', this._initialValue);
  },

  blur() {
    if (this._hasActiveElement()) {
      domUtils.resetActiveElement();
    }
  },

  clear() {
    const defaultOptions = this._getDefaultOptions();
    this.option('value', defaultOptions.value);
  },

  reset(value = undefined) {
    if (arguments.length) {
      this._initialValue = value;
    }

    this._resetToInitialValue();
    this.option('isDirty', false);
    this.option('isValid', true);
  },
});

Editor.isEditor = (instance) => instance instanceof Editor;
export default Editor;
