import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Properties } from '@js/ui/color_box';
import type { OptionChanged } from '@ts/core/widget/types';
import Color from '@ts/m_color';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import type { ValueChangedEvent } from '@ts/ui/editor/editor';

import type { PopupProperties } from '../popup/m_popup';
import type Popup from '../popup/m_popup';
import type { ColorViewProperties } from './color_view';
import ColorView from './color_view';

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
  makeTransparentBackground:
    colorEditorPrototype._makeTransparentBackground.bind(colorEditorPrototype),
  makeRgba: colorEditorPrototype._makeRgba.bind(colorEditorPrototype),
};

export interface ColorBoxProperties extends Omit<Properties,
'onClosed' | 'onOpened'
| 'onCopy' | 'onCut'
| 'onEnterKey' | 'onFocusIn'
| 'onFocusOut' | 'onInput'
| 'onKeyDown' | 'onKeyUp' | 'onPaste'
| 'onValueChanged' | 'validationMessagePosition'
| 'onContentReady' | 'onDisposing'
| 'onOptionChanged' | 'onInitialized'> {
  buttonsLocation?: string;
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
    const arrowHandler = (e: KeyboardEvent): boolean => {
      e.stopPropagation();
      const { opened } = this.option();
      if (opened) {
        e.preventDefault();
        return true;
      }
      return false;
    };

    const upArrowHandler = (e: KeyboardEvent): boolean => {
      const { opened } = this.option();
      if (!opened) {
        e.preventDefault();
        return false;
      }
      if (e.altKey) {
        this.close();
        return false;
      }
      return true;
    };

    const downArrowHandler = (e: KeyboardEvent): boolean => {
      const { opened } = this.option();
      if (!opened && !e.altKey) {
        e.preventDefault();
        return false;
      }
      if (!opened && e.altKey) {
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
      // @ts-expect-error fieldTemplate is deprecated --- IGNORE ---
      fieldTemplate: null,
      buttonsLocation: 'bottom after',
    };
  }

  _popupHidingHandler(): void {
    super._popupHidingHandler();
    const { applyValueMode, value } = this.option();

    if (applyValueMode === 'useButtons') {
      this._updateColorViewValue(value);
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

  _applyNewColor(newValue: string | null | undefined): void {
    this.option('value', newValue);

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

    return {
      value,
      matchValue: value,
      editAlphaChannel,
      applyValueMode,
      focusStateEnabled,
      stylingMode,
      target: this._input(),
      onEnterKeyPressed: (e: ValueChangedEvent<KeyboardEvent>): void => {
        const { event } = e;
        const { value: optionValue } = this.option();
        this._colorViewEnterKeyPressed = true;
        if (this._colorView.option('value') !== optionValue) {
          this._saveValueChangeEvent(event);
          const { value: colorViewValue } = this._colorView.option();
          this._applyNewColor(colorViewValue);
          this.close();
        }
      },

      onValueChanged: ({ event, value: changedValue, previousValue }): void => {
        const { applyValueMode: currentValueMode } = this.option();
        const isInstantlyMode = currentValueMode === 'instantly';
        const isOldValue = colorUtils.makeRgba(new Color(changedValue)) === previousValue;
        const isChangesApplied = isInstantlyMode || this._colorViewEnterKeyPressed;
        const isValueCleared = this._shouldSaveEmptyValue;

        if (isOldValue || !isChangesApplied || isValueCleared) {
          return;
        }

        if (event) {
          this._saveValueChangeEvent(event);
        }
        this._applyNewColor(changedValue);
      },
    };
  }

  _enterKeyHandler(e: KeyboardEvent): boolean | undefined {
    const newValue = this._input().val();
    const { value, editAlphaChannel } = this.option();
    const oldValue = value && editAlphaChannel ? colorUtils.makeRgba(new Color(value)) : value;

    if (!newValue) return false;

    const color = new Color(newValue);

    if (color.colorIsInvalid) {
      this._input().val(oldValue === null ? undefined : oldValue);
      return false;
    }
    if (newValue !== oldValue) {
      this._applyColorFromInput(newValue);
      this._saveValueChangeEvent(e);
      this.option('value', editAlphaChannel
        ? colorUtils.makeRgba(new Color(newValue)) : newValue);
    }

    if (this._colorView) {
      const { value: colorViewValue } = this._colorView.option();

      if (value !== colorViewValue) {
        this._saveValueChangeEvent(e);
        this.option('value', colorViewValue);
      }
    }

    this.close();
    return false;
  }

  _applyButtonHandler(e: ValueChangedEvent): void {
    this._saveValueChangeEvent(e.event);
    const { value } = this._colorView.option();
    this._applyNewColor(value);

    super._applyButtonHandler();
  }

  _cancelButtonHandler(): void {
    this._resetInputValue();

    super._cancelButtonHandler();
  }

  // need to be typed in widget.ts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any[] {
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
    if (!this._$noColorIcon?.length) {
      this._$noColorIcon = $('<i>')
        .addClass(`${DX_ICON_CLASS} ${DX_ICON_COLOR_DISMISS}`)
        .appendTo(this._$colorResultPreview);
    }
  }

  _updateNoColorIndicator(): void {
    const { value } = this.option();
    const hasValue = value !== null && value !== undefined && value.length > 0;

    this._$colorBoxInputContainer.toggleClass(COLOR_BOX_COLOR_IS_NOT_DEFINED, !hasValue);

    if (hasValue) {
      this._cleanNoColorIcon();

      colorUtils.makeTransparentBackground(this._$colorResultPreview, new Color(value));
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

  _renderValue(): DeferredObj<unknown> {
    const { value, editAlphaChannel } = this.option();
    const shouldConvertToColor = value && editAlphaChannel;
    const text = shouldConvertToColor ? colorUtils.makeRgba(new Color(value)) : value;

    this.option('text', text);

    return super._renderValue();
  }

  _resetInputValue(): void {
    const $input = this._input();
    const { value } = this.option();
    $input.val(value === null ? undefined : value);
    this._updateColorViewValue(value);
  }

  _updateColorViewValue(value: string | null | undefined): void {
    if (this._colorView) {
      this._colorView.option({
        value,
        matchValue: value,
      });
    }
  }

  _valueChangeEventHandler(e: ValueChangedEvent): void {
    let value = this._input().val();

    if (value) {
      value = this._applyColorFromInput(value);

      this._updateColorViewValue(value);
    }
    super._valueChangeEventHandler(e, value);
  }

  _applyColorFromInput(value: string): string {
    const { editAlphaChannel, value: optionValue } = this.option();
    const newColor = new Color(value);

    if (newColor.colorIsInvalid) {
      this._resetInputValue();
      return optionValue ?? '';
    }

    if (editAlphaChannel) {
      return colorUtils.makeRgba(newColor);
    }

    return value;
  }

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
        if (this._popup) {
          this._addPopupBottomClasses();
        }
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
