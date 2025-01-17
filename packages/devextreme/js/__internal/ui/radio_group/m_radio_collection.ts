import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import CollectionWidget from '@ts/ui/collection/edit';
import type { CollectionWidgetBaseProperties } from '@ts/ui/collection/m_collection_widget.base';

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
    const defaultOptions = super._getDefaultOptions();

    // @ts-expect-error
    return extend(defaultOptions, DataExpressionMixin._dataExpressionDefaultOptions(), {
      _itemAttributes: { role: 'radio' },
    });
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

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    const parent = super._supportedKeys();

    return extend({}, parent, {
      enter(e) {
        e.preventDefault();
        // @ts-expect-error
        return parent.enter.apply(this, arguments);
      },

      space(e) {
        e.preventDefault();
        // @ts-expect-error
        return parent.space.apply(this, arguments);
      },
    });
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  // eslint-disable-next-line class-methods-use-this
  _setAriaSelectionAttribute(): void {}
}

export default RadioCollection;
