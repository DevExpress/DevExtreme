import Color from '@js/color';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/color_box';
import type { OptionChanged } from '@ts/core/widget/types';
import DropDownEditor from '@ts/ui/drop_down_editor/m_drop_down_editor';

import type { PopupProperties } from '../popup/m_popup';
import type Popup from '../popup/m_popup';
import type { ColorViewProperties } from './m_color_view';
import ColorView from './m_color_view';

const COLOR_BOX_CLASS = 'dx-colorbox';
const COLOR_BOX_INPUT_CLASS = `${COLOR_BOX_CLASS}-input`;
const COLOR_BOX_INPUT_CONTAINER_CLASS = `${COLOR_BOX_INPUT_CLASS}-container`;
const COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS = `${COLOR_BOX_CLASS}-color-result-preview`;
const COLOR_BOX_COLOR_IS_NOT_DEFINED = `${COLOR_BOX_CLASS}-color-is-not-defined`;
const COLOR_BOX_OVERLAY_CLASS = `${COLOR_BOX_CLASS}-overlay`;

const COLOR_BOX_CONTAINER_CELL_CLASS = 'dx-colorview-container-cell';
const COLOR_BOX_BUTTON_CELL_CLASS = 'dx-colorview-button-cell';
const COLOR_BOX_BUTTONS_CONTAINER_CLASS = 'dx-colorview-buttons-container';
const COLOR_BOX_APPLY_BUTTON_CLASS = 'dx-colorview-apply-button';
const COLOR_BOX_CANCEL_BUTTON_CLASS = 'dx-colorview-cancel-button';

export const DX_ICON_CLASS = 'dx-icon';
export const DX_ICON_COLOR_DISMISS = 'dx-icon-colordismiss';

const colorEditorPrototype = ColorView.prototype;
const colorUtils = {
  makeTransparentBackground: colorEditorPrototype._makeTransparentBackground.bind(colorEditorPrototype),
  makeRgba: colorEditorPrototype._makeRgba.bind(colorEditorPrototype),
};

export interface ColorBoxProperties extends Omit<Properties,
'onClosed' | 'onOpened' |
'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' | 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition' | 'onContentReady' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
}

class ColorBox extends DropDownEditor<ColorBoxProperties> {
  _popup!: Popup;

  _colorView!: ColorView;

  _colorViewEnterKeyPressed?: boolean;

  _shouldSaveEmptyValue?: boolean;

  _$colorResultPreview!: dxElementWrapper;

  _$noColorIcon?: dxElementWrapper | null;

  _$colorBoxInputContainer!: dxElementWrapper;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | undefined> {
    // @ts-expect-error ts-error
    const arrowHandler = function (e) {
      e.stopPropagation();
      if (this.option('opened')) {
        e.preventDefault();
        return true;
      }
    };

    const upArrowHandler = function (e) {
      if (!this.option('opened')) {
        e.preventDefault();
        return false;
      }
      if (e.altKey) {
        this.close();
        return false;
      }
      return true;
    };

    const downArrowHandler = function (e) {
      if (!this.option('opened') && !e.altKey) {
        e.preventDefault();
        return false;
      }
      if (!this.option('opened') && e.altKey) {
        this._validatedOpening();
        return false;
      }
      return true;
    };

    return {
      ...super._supportedKeys(),
      enter: this._enterKeyHandler,
      leftArrow: arrowHandler,
      rightArrow: arrowHandler,
      upArrow: upArrowHandler,
      downArrow: downArrowHandler,
    };
  }

  _getDefaultOptions(): ColorBoxProperties {
    return {
      ...super._getDefaultOptions(),
      editAlphaChannel: false,
      applyValueMode: 'useButtons',
      keyStep: 1,
      // @ts-expect-error ts-error
      fieldTemplate: null,
      buttonsLocation: 'bottom after',
    };
  }

  _popupHidingHandler(): void {
    super._popupHidingHandler();
    const { applyValueMode } = this.option();

    if (applyValueMode === 'useButtons') {
      this._updateColorViewValue(this.option('value'));
    }
  }

  _popupConfig(): PopupProperties {
    return {
      ...super._popupConfig(),
      width: '',
    };
  }

  _contentReadyHandler(): void {
    this._createColorView();
    this._addPopupBottomClasses();
  }

  _addPopupBottomClasses(): void {
    const $popupBottom = this._popup.bottomToolbar();
    if ($popupBottom) {
      $popupBottom
        .addClass(COLOR_BOX_CONTAINER_CELL_CLASS)
        .addClass(COLOR_BOX_BUTTON_CELL_CLASS)
        .find('.dx-toolbar-items-container')
        .addClass(COLOR_BOX_BUTTONS_CONTAINER_CLASS);

      $popupBottom
        .find('.dx-popup-done')
        .addClass(COLOR_BOX_APPLY_BUTTON_CLASS);

      $popupBottom
        .find('.dx-popup-cancel')
        .addClass(COLOR_BOX_CANCEL_BUTTON_CLASS);
    }
  }

  _createColorView(): void {
    this._popup.$overlayContent().addClass(COLOR_BOX_OVERLAY_CLASS);

    const $content = this._popup.$content();

    if (!$content) {
      return;
    }

    const $colorView = $('<div>').appendTo($content);

    this._colorView = this._createComponent($colorView, ColorView, this._colorViewConfig());
  }

  _applyNewColor(value): void {
    this.option('value', value);

    this._updateNoColorIndicator();

    if (this._colorViewEnterKeyPressed) {
      this.close();
      this._colorViewEnterKeyPressed = false;
    }
  }

  _colorViewConfig(): ColorViewProperties {
    const {
      editAlphaChannel,
      value,
      applyValueMode,
      focusStateEnabled,
      stylingMode,
    } = this.option();

    const that = this;

    return {
      value,
      matchValue: value,
      editAlphaChannel,
      applyValueMode,
      focusStateEnabled,
      stylingMode,
      target: this._input(),
      onEnterKeyPressed({ event }) {
        that._colorViewEnterKeyPressed = true;
        if (that._colorView.option('value') !== that.option('value')) {
          that._saveValueChangeEvent(event);
          that._applyNewColor(that._colorView.option('value'));
          that.close();
        }
      },

      onValueChanged({ event, value, previousValue }) {
        // @ts-expect-error ts-error
        const instantlyMode = that.option('applyValueMode') === 'instantly';
        const isOldValue = colorUtils.makeRgba(value) === previousValue;
        const changesApplied = instantlyMode || that._colorViewEnterKeyPressed;
        const valueCleared = that._shouldSaveEmptyValue;

        if (isOldValue || !changesApplied || valueCleared) {
          return;
        }

        if (event) {
          // @ts-expect-error ts-error
          that._saveValueChangeEvent(event);
        }
        that._applyNewColor(value);
      },
    };
  }

  _enterKeyHandler(e) {
    const newValue = this._input().val();
    const { value, editAlphaChannel } = this.option();
    const oldValue = value && editAlphaChannel ? colorUtils.makeRgba(value) : value;

    if (!newValue) return false;

    const color = new Color(newValue);

    if (color.colorIsInvalid) {
      this._input().val(oldValue === null ? undefined : oldValue);
      return;
    }
    // @ts-expect-error ts-error
    if (newValue !== oldValue) {
      this._applyColorFromInput(newValue);
      this._saveValueChangeEvent(e);
      this.option('value', this.option('editAlphaChannel') ? colorUtils.makeRgba(newValue) : newValue);
    }

    if (this._colorView) {
      const colorViewValue = this._colorView.option('value');

      if (value !== colorViewValue) {
        this._saveValueChangeEvent(e);
        this.option('value', colorViewValue);
      }
    }

    this.close();
    return false;
  }

  _applyButtonHandler(e): void {
    this._saveValueChangeEvent(e.event);
    this._applyNewColor(this._colorView.option('value'));

    super._applyButtonHandler();
  }

  _cancelButtonHandler(): void {
    this._resetInputValue();

    super._cancelButtonHandler();
  }

  _getKeyboardListeners() {
    return super._getKeyboardListeners().concat([this._colorView]);
  }

  _init(): void {
    super._init();
  }

  _initMarkup(): void {
    this.$element().addClass(COLOR_BOX_CLASS);
    super._initMarkup();
  }

  _renderInput(): void {
    super._renderInput();

    this._input().addClass(COLOR_BOX_INPUT_CLASS);
    this._renderColorPreview();
  }

  _renderNoColorIcon(): void {
    if (!this._$noColorIcon || !this._$noColorIcon.length) {
      this._$noColorIcon = $('<i>')
        .addClass(`${DX_ICON_CLASS} ${DX_ICON_COLOR_DISMISS}`)
        .appendTo(this._$colorResultPreview);
    }
  }

  _updateNoColorIndicator(): void {
    const { value } = this.option();
    const hasValue = Boolean(value);

    this._$colorBoxInputContainer.toggleClass(COLOR_BOX_COLOR_IS_NOT_DEFINED, !hasValue);

    if (hasValue) {
      this._cleanNoColorIcon();

      colorUtils.makeTransparentBackground(this._$colorResultPreview, value);
    } else {
      this._$colorResultPreview.removeAttr('style');
      this._renderNoColorIcon();
    }
  }

  _renderColorPreview(): void {
    this.$element().wrapInner($('<div>').addClass(COLOR_BOX_INPUT_CONTAINER_CLASS));
    this._$colorBoxInputContainer = this.$element().children().eq(0);

    if (!this._$textEditorInputContainer) {
      return;
    }

    this._$colorResultPreview = $('<div>')
      .addClass(COLOR_BOX_COLOR_RESULT_PREVIEW_CLASS)
      .appendTo(this._$textEditorInputContainer);

    this._updateNoColorIndicator();
  }

  _renderValue() {
    const { value, editAlphaChannel } = this.option();
    const shouldConvertToColor = value && editAlphaChannel;
    const text = shouldConvertToColor ? colorUtils.makeRgba(value) : value;

    this.option('text', text);

    return super._renderValue();
  }

  _resetInputValue(): void {
    const $input = this._input();
    const value = this.option('value');
    // @ts-expect-error ts-error
    $input.val(value);
    this._updateColorViewValue(value);
  }

  _updateColorViewValue(value): void {
    if (this._colorView) {
      this._colorView.option({
        value,
        matchValue: value,
      });
    }
  }

  _valueChangeEventHandler(e): void {
    let value = this._input().val();

    if (value) {
      value = this._applyColorFromInput(value);

      this._updateColorViewValue(value);
    }
    super._valueChangeEventHandler(e, value);
  }

  _applyColorFromInput(value) {
    const { editAlphaChannel } = this.option();
    const newColor = new Color(value);

    if (newColor.colorIsInvalid) {
      this._resetInputValue();
      return this.option('value');
    }

    if (editAlphaChannel) {
      return colorUtils.makeRgba(value);
    }

    return value;
  }

  // eslint-disable-next-line class-methods-use-this
  _shouldLogFieldTemplateDeprecationWarning(): boolean {
    return true;
  }

  _cleanNoColorIcon(): void {
    this._$noColorIcon?.remove();
    this._$noColorIcon = undefined;
  }

  _clean(): void {
    super._clean();
    delete this._shouldSaveEmptyValue;

    this._cleanNoColorIcon();
  }

  _valueOptionChangeHandler(): void {
    const { value } = this.option();

    if (value === null) {
      this._shouldSaveEmptyValue = true;
    }

    this._updateNoColorIndicator();
    this._updateColorViewValue(value);

    this._shouldSaveEmptyValue = false;
  }

  _optionChanged(args: OptionChanged<ColorBoxProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'value':
        this._valueOptionChangeHandler();
        super._optionChanged(args);
        break;
      case 'applyButtonText':
      case 'cancelButtonText':
        super._optionChanged(args);
        this._popup && this._addPopupBottomClasses();
        break;
      case 'editAlphaChannel':
      case 'keyStep':
        if (this._colorView) {
          this._colorView.option(name, value);
        }
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxColorBox', ColorBox);

export default ColorBox;
