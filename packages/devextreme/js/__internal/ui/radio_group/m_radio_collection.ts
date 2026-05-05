import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import type { DxEvent } from '@js/events';
import type { CollectionWidgetItem as CollectionWidgetItemProperties } from '@js/ui/collection/ui.collection_widget.base';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import type { CollectionWidgetBaseProperties, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';

const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';

const ITEM_CONTENT_CLASS = 'dx-item-content';

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

  // eslint-disable-next-line class-methods-use-this
  _getItemIdTarget($target: dxElementWrapper): dxElementWrapper {
    const $radioContainer = $target.find(`.${RADIO_VALUE_CONTAINER_CLASS}`);

    if ($radioContainer.length) {
      return $radioContainer;
    }

    return $target;
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<CollectionWidgetItemProperties>): void {
    const { itemData, itemElement } = args;
    const { html } = itemData;

    const $itemElement = $(itemElement);

    if (!html) {
      const $radio = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

      $('<div>')
        .addClass(RADIO_BUTTON_ICON_DOT_CLASS)
        .appendTo($radio);

      const $radioContainer = $('<div>')
        .append($radio)
        .addClass(RADIO_VALUE_CONTAINER_CLASS);

      $itemElement.prepend($radioContainer);
    }

    super._postprocessRenderItem(args);

    // eslint-disable-next-line spellcheck/spell-checker
    const aria: { role: string; labelledby?: string } = {
      role: 'radio',
    };

    if (!html) {
      const $itemContent = $itemElement.find(`.${ITEM_CONTENT_CLASS}`);

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const contentId = $itemContent.attr('id') || `dx-${new Guid()}`;

      $itemContent.attr('id', contentId);

      // eslint-disable-next-line spellcheck/spell-checker
      aria.labelledby = contentId;
    }

    const $ariaTarget = this._getItemIdTarget($itemElement);

    this.setAria(aria, $ariaTarget);
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

    const $radioContainer = $itemElement.find(`.${RADIO_VALUE_CONTAINER_CLASS}`);
    const $ariaCheckedTarget = $radioContainer.length ? $radioContainer : $itemElement;

    this.setAria('checked', isSelected, $ariaCheckedTarget);
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
