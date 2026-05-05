import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import type { DxEvent } from '@js/events';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { CollectionWidgetBaseProperties } from '@ts/ui/collection/collection_widget.base';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';

const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';

export type Properties = CollectionWidgetBaseProperties<RadioCollection>;

class RadioCollection extends CollectionWidget<Properties> {
  _focusTarget(): dxElementWrapper {
    return $(this.element()).parent();
  }

  // eslint-disable-next-line class-methods-use-this
  _nullValueSelectionSupported(): boolean {
    return true;
  }

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error DataExpressionMixin._dataExpressionDefaultOptions()
      // should be added to the type
      ...DataExpressionMixin._dataExpressionDefaultOptions(),
      _itemAttributes: { role: 'radio' },
    } as Properties;
  }

  _initMarkup(): void {
    super._initMarkup();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(() => {
      this._itemElements().addClass(RADIO_BUTTON_CLASS);
    });
  }

  _keyboardEventBindingTarget(): dxElementWrapper {
    return this._focusTarget();
  }

  _postprocessRenderItem(args): void {
    const { itemData: { html }, itemElement } = args;

    if (!html) {
      const $radio = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

      $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);

      const $radioContainer = $('<div>').append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);

      $(itemElement).prepend($radioContainer);
    }

    super._postprocessRenderItem(args);
  }

  _processSelectableItem(
    $itemElement: dxElementWrapper,
    isSelected: boolean,
  ): void {
    super._processSelectableItem($itemElement, isSelected);

    $itemElement
      .toggleClass(RADIO_BUTTON_CHECKED_CLASS, isSelected)
      .find(`.${RADIO_BUTTON_ICON_CLASS}`)
      .first()
      .toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, isSelected);

    this.setAria('checked', isSelected, $itemElement);
  }

  _refreshContent(): void {
    this._prepareContent();
    this._renderContent();
  }

  _supportedKeys(): Record<string, (e: DxEvent<KeyboardEvent>) => void> {
    const parent = super._supportedKeys();

    return {
      ...parent,
      enter(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        parent.enter?.apply(this, [e]);
      },

      space(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        parent.space?.apply(this, [e]);
      },
    };
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  // eslint-disable-next-line class-methods-use-this
  _setAriaSelectionAttribute(): void {}
}

export default RadioCollection;
