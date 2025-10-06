import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight } from '@js/core/utils/size';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { TextAreaProperties } from '@ts/ui/m_text_area';
import TextArea from '@ts/ui/m_text_area';

const TEXT_AREA_TOOLBAR = 'dx-textarea-toolbar';
const TEXT_AREA_WITH_TOOLBAR = 'dx-textarea-with-toolbar';

export type Properties = TextAreaProperties & {
  toolbarOptions?: ToolbarProperties;
};

class TextAreaOnSteroids extends TextArea<Properties> {
  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      toolbarOptions: undefined,
    };
  }

  _initMarkup(): void {
    this.$element().addClass(TEXT_AREA_WITH_TOOLBAR);
    super._initMarkup();
    this._renderToolbar();
  }

  _renderToolbar(): void {
    const { toolbarOptions = {} } = this.option();
    const { items } = toolbarOptions;

    if (!items?.length) {
      return;
    }

    this._$toolbar = $('<div>')
      .addClass(TEXT_AREA_TOOLBAR)
      .appendTo(this.$element());

    this._toolbar = this._createComponent(
      this._$toolbar,
      Toolbar,
      toolbarOptions,
    );
  }

  _renderButtonContainers(): void {}

  _getHeightDifference($input: dxElementWrapper): number {
    const superResult = super._getHeightDifference($input);
    const toolbarHeight = getOuterHeight(this._$toolbar);
    const sum: number = superResult + toolbarHeight;

    return sum;
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'toolbarOptions':
        this._toolbar?.option(value);
        break;

      default:
        super._optionChanged(args);
    }
  }

  _clean(): void {
    this._toolbar?.option('items', []);
    super._clean();
  }

  _dispose(): void {
    this._toolbar?.dispose();
    this._$toolbar?.remove();
    this._toolbar = null;
    this._$toolbar = null;
    super._dispose();
  }
}

registerComponent('dxTextAreaOnSteroids', TextAreaOnSteroids);

export default TextAreaOnSteroids;
