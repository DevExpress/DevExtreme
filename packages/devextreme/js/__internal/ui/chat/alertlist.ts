import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type {
  Alert,
} from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_ALERTLIST_ERROR_CLASS = 'dx-chat-alertlist-error';
const CHAT_ALERTLIST_ERROR_ICON_CLASS = 'dx-chat-alertlist-error-icon';
const CHAT_ALERTLIST_ERROR_TEXT_CLASS = 'dx-chat-alertlist-error-text';

export interface Properties extends WidgetOptions<AlertList> {
  items: Alert[];
}

class AlertList extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      items: [],
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_ALERTLIST_CLASS);

    super._initMarkup();

    const { items } = this.option();

    this._renderItems(items);
    this._updateAria();
  }

  _renderItems(items: Alert[]): void {
    if (items?.length) {
      items.forEach((itemData) => {
        this._renderItem(itemData);
      });
    }
  }

  _renderItem(itemData: Alert): void {
    const $item = $('<div>');

    $item
      .addClass(CHAT_ALERTLIST_ERROR_CLASS);

    $('<div>')
      .addClass(CHAT_ALERTLIST_ERROR_ICON_CLASS)
      .appendTo($item);

    $('<div>')
      .addClass(CHAT_ALERTLIST_ERROR_TEXT_CLASS)
      .appendTo($item)
      .text(String(itemData?.message ?? ''));

    $item.appendTo(this.$element());
  }

  _updateAria(): void {
    const aria = {
      role: 'log',
      atomic: 'false',
      label: messageLocalization.format('dxChat-alertListAriaLabel'),
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

export default AlertList;
