import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import DataExpressionMixin from '@js/ui/editor/ui.data_expression';
import CollectionWidget from '@ts/ui/collection/edit';

import type { TypedCollectionWidgetOptions } from '../collection/base';

const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';

export type Properties = TypedCollectionWidgetOptions<RadioCollection>;

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

    // // @ts-expect-error
    // return extend(defaultOptions, DataExpressionMixin._dataExpressionDefaultOptions(), {
    //   _itemAttributes: { role: 'radio' },
    // });

    // @ts-expect-error
    return extend(defaultOptions, DataExpressionMixin._dataExpressionDefaultOptions());
  }

  _initMarkup(): void {
    super._initMarkup();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(() => {
      this._itemElements().addClass(RADIO_BUTTON_CLASS);
    });
  }

  _keyboardEventBindingTarget() {
    return this._focusTarget();
  }

  _postprocessRenderItem(args): void {
    const { itemData, itemElement } = args;
    const { html, text } = itemData;

    if (!html) {
      const $radio = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

      $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);

      const $radioContainer = $('<div>').append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);

      $(itemElement).prepend($radioContainer);

      const aria = {
        role: 'radio',
        label: undefined,
        // eslint-disable-next-line spellcheck/spell-checker
        labelledby: undefined,
      };

      debugger;

      if (text || typeof itemData === 'string') {
        aria.label = text || itemData;
      } else {
        // eslint-disable-next-line spellcheck/spell-checker
        aria.labelledby = text;
      }

      this.setAria(aria, $radioContainer);
    }

    super._postprocessRenderItem(args);
  }

  _getTargetForSettingId($target) {
    const $radioContainer = $target.find(`.${RADIO_VALUE_CONTAINER_CLASS}`);

    return $radioContainer;
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

    // this.setAria('checked', isSelected, $itemElement);

    const $radioContainer = $itemElement.find(`.${RADIO_VALUE_CONTAINER_CLASS}`);

    this.setAria('checked', isSelected, $radioContainer);
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

  _setAriaSelectionAttribute(): void {}
}

export default RadioCollection;
