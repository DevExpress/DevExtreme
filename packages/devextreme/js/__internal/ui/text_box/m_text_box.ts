import { normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getOuterWidth, getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';

import TextEditor from './m_text_editor';

const window = getWindow();

const ignoreKeys = ['backspace', 'tab', 'enter', 'pageUp', 'pageDown', 'end', 'home', 'leftArrow', 'rightArrow', 'downArrow', 'upArrow', 'del'];

const TEXTBOX_CLASS = 'dx-textbox';
const SEARCHBOX_CLASS = 'dx-searchbox';
const ICON_CLASS = 'dx-icon';
const SEARCH_ICON_CLASS = 'dx-icon-search';

const TextBox = TextEditor.inherit({

  ctor(element, options) {
    if (options) {
      this._showClearButton = options.showClearButton;
    }

    this.callBase.apply(this, arguments);
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      value: '',
      mode: 'text',

      maxLength: null,
    });
  },

  _initMarkup() {
    this.$element().addClass(TEXTBOX_CLASS);

    this.callBase();
    this.setAria('role', 'textbox');
  },

  _renderInputType() {
    this.callBase();

    this._renderSearchMode();
  },

  _useTemplates() {
    return false;
  },

  _renderProps() {
    this.callBase();
    this._toggleMaxLengthProp();
  },

  _toggleMaxLengthProp() {
    const maxLength = this._getMaxLength();
    if (maxLength && maxLength > 0) {
      this._input().attr('maxLength', maxLength);
    } else {
      this._input().removeAttr('maxLength');
    }
  },

  _renderSearchMode() {
    const $element = this._$element;

    if (this.option('mode') === 'search') {
      $element.addClass(SEARCHBOX_CLASS);
      this._renderSearchIcon();

      if (this._showClearButton === undefined) {
        this._showClearButton = this.option('showClearButton');
        this.option('showClearButton', true);
      }
    } else {
      $element.removeClass(SEARCHBOX_CLASS);
      this._$searchIcon && this._$searchIcon.remove();
      this.option('showClearButton', this._showClearButton === undefined ? this.option('showClearButton') : this._showClearButton);
      delete this._showClearButton;
    }
  },

  _renderSearchIcon() {
    const $searchIcon = $('<div>')
      .addClass(ICON_CLASS)
      .addClass(SEARCH_ICON_CLASS);

    $searchIcon.prependTo(this._input().parent());
    this._$searchIcon = $searchIcon;
  },

  _getLabelContainerWidth() {
    if (this._$searchIcon) {
      const $inputContainer = this._input().parent();

      return getWidth($inputContainer) - this._getLabelBeforeWidth();
    }

    return this.callBase();
  },

  _getLabelBeforeWidth() {
    let labelBeforeWidth = this.callBase();

    if (this._$searchIcon) {
      labelBeforeWidth += getOuterWidth(this._$searchIcon);
    }

    return labelBeforeWidth;
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'maxLength':
        this._toggleMaxLengthProp();
        break;
      case 'mode':
        this.callBase(args);
        this._updateLabelWidth();
        break;
      case 'mask':
        this.callBase(args);
        this._toggleMaxLengthProp();
        break;
      default:
        this.callBase(args);
    }
  },

  _onKeyDownCutOffHandler(e) {
    const actualMaxLength = this._getMaxLength();

    if (actualMaxLength && !e.ctrlKey && !this._hasSelection()) {
      const $input = $(e.target);
      const key = normalizeKeyName(e);

      this._cutOffExtraChar($input);

      return $input.val().length < actualMaxLength
        // @ts-expect-error
        || ignoreKeys.includes(key)
        // @ts-expect-error
        || window.getSelection().toString() !== '';
    }
    return true;
  },

  _onChangeCutOffHandler(e) {
    const $input = $(e.target);
    if (this.option('maxLength')) {
      this._cutOffExtraChar($input);
    }
  },

  _cutOffExtraChar($input) {
    const actualMaxLength = this._getMaxLength();
    const textInput = $input.val();
    if (actualMaxLength && textInput.length > actualMaxLength) {
      $input.val(textInput.substr(0, actualMaxLength));
    }
  },

  _getMaxLength() {
    const isMaskSpecified = !!this.option('mask');
    return isMaskSpecified ? null : this.option('maxLength');
  },
});

registerComponent('dxTextBox', TextBox);

export default TextBox;
