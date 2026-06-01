import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterWidth, getWidth } from '@js/core/utils/size';
import type { OptionChanged } from '@ts/core/widget/types';
import TextEditor from '@ts/ui/text_box/text_editor.mask';

import type { TextEditorBaseProperties } from './text_editor.base';

// STYLE textBox

export interface TextBoxProperties extends TextEditorBaseProperties {
  maxLength?: string | number | null;
}

const TEXTBOX_CLASS = 'dx-textbox';
const SEARCHBOX_CLASS = 'dx-searchbox';
const ICON_CLASS = 'dx-icon';
const SEARCH_ICON_CLASS = 'dx-icon-search';

class TextBox<
  TProperties extends TextBoxProperties = TextBoxProperties,
> extends TextEditor<TProperties> {
  _$searchIcon?: dxElementWrapper;

  _showClearButton?: boolean;

  ctor(element: Element, options: TProperties): void {
    if (options) {
      this._showClearButton = options.showClearButton;
    }

    super.ctor(element, options);
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      value: '',
      mode: 'text',
      maxLength: null,
    };
  }

  _initMarkup(): void {
    this.$element().addClass(TEXTBOX_CLASS);

    super._initMarkup();
    this.setAria('role', 'textbox');
  }

  _renderInputType(): void {
    super._renderInputType();

    this._renderSearchMode();
  }

  _useTemplates(): boolean {
    return false;
  }

  _renderProps(): void {
    super._renderProps();
    this._toggleMaxLengthProp();
  }

  _toggleMaxLengthProp(): void {
    const maxLength = this._getMaxLength();

    if (maxLength && maxLength > 0) {
      this._input().attr('maxLength', maxLength);
    } else {
      this._input().removeAttr('maxLength');
    }
  }

  _renderSearchMode(): void {
    const { mode } = this.option();

    if (mode === 'search') {
      this.$element().addClass(SEARCHBOX_CLASS);
      this._renderSearchIcon();

      if (this._showClearButton === undefined) {
        const { showClearButton } = this.option();

        this._showClearButton = showClearButton;
        this.option('showClearButton', true);
      }
    } else {
      this.$element().removeClass(SEARCHBOX_CLASS);

      if (this._$searchIcon) {
        this._$searchIcon.remove();
      }

      if (this._showClearButton === undefined) {
        return;
      }

      this.option({ showClearButton: this._showClearButton });
      this._showClearButton = undefined;
    }
  }

  _renderSearchIcon(): void {
    const $searchIcon = $('<div>')
      .addClass(ICON_CLASS)
      .addClass(SEARCH_ICON_CLASS);

    $searchIcon.prependTo(this._input().parent());
    this._$searchIcon = $searchIcon;
  }

  _getLabelContainerWidth(): number {
    if (this._$searchIcon) {
      const $inputContainer = this._input().parent();

      return getWidth($inputContainer) - this._getLabelBeforeWidth();
    }

    return super._getLabelContainerWidth();
  }

  _getLabelBeforeWidth(): number {
    let labelBeforeWidth = super._getLabelBeforeWidth();

    if (this._$searchIcon) {
      labelBeforeWidth += getOuterWidth(this._$searchIcon);
    }

    return labelBeforeWidth;
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'maxLength':
        this._toggleMaxLengthProp();
        break;
      case 'mode':
        super._optionChanged(args);
        this._updateLabelWidth();
        break;
      case 'mask':
        super._optionChanged(args);
        this._toggleMaxLengthProp();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getMaxLength(): number | null | undefined {
    const { mask, maxLength: rawLength } = this.option();

    const isMaskSpecified = !!mask;
    const maxLength = typeof rawLength === 'string' ? parseInt(rawLength, 10) : rawLength;

    return isMaskSpecified ? null : maxLength;
  }
}

registerComponent('dxTextBox', TextBox);

export default TextBox;
