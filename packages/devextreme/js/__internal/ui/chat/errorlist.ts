import $ from '@js/core/renderer';
import dateSerialization from '@js/core/utils/date_serialization';
import messageLocalization from '@js/localization/message';
import type { Message } from '@js/ui/chat';
import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_ERRORLIST_CLASS = 'dx-chat-errorlist';
const CHAT_ERRORLIST_ERROR_CLASS = 'dx-chat-errorlist-error';
const CHAT_ERRORLIST_ERROR_ICON_CLASS = 'dx-chat-errorlist-error-icon';
const CHAT_ERRORLIST_ERROR_TEXT_CLASS = 'dx-chat-errorlist-error-text';

export const MESSAGEGROUP_TIMEOUT = 5 * 1000 * 60;

export interface Properties extends WidgetOptions<ErrorList> {
  items: CollectionWidgetItem[]; // Errors
}

class ErrorList extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
    };
  }

  _itemClass(): string {
    return CHAT_ERRORLIST_ERROR_CLASS;
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_ERRORLIST_CLASS);

    super._initMarkup();
  }

  _renderContentImpl(): void {
    const { items } = this.option();

    this._renderItems(items);
  }

  _renderItems(items: CollectionWidgetItem[]): void {
    if (items.length) {
      items.forEach((itemData, index) => {
        this._renderItem(index, itemData);
      });
    }
  }

  _renderItem(index: number, itemData: CollectionWidgetItem): void {
    const $item = $('<div>');

    $item
      .addClass(this._itemClass());

    $('<div>')
      .addClass(CHAT_ERRORLIST_ERROR_ICON_CLASS)
      .appendTo($item);

    $('<div>')
      .addClass(CHAT_ERRORLIST_ERROR_TEXT_CLASS)
      .appendTo($item)
      .text(String(itemData.text));

    $item.appendTo(this.$element());
  }

  _isEmpty(): boolean {
    const { items } = this.option();

    return items.length === 0;
  }

  _updateAria(): void {
    const aria = {
      role: 'log',
      atomic: 'false',
      label: messageLocalization.format('dxChat-messageListAriaLabel'),
      live: 'polite',
      relevant: 'additions',
    };

    this.setAria(aria);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'items':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ErrorList;
