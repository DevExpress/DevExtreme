import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type {
  Alert,
} from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import Informer from '@ts/ui/m_informer';

const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_ALERTLIST_ERROR_CLASS = 'dx-chat-alertlist-error';

export interface Properties extends WidgetOptions<AlertList> {
  items: Alert[];
}

class AlertList extends Widget<Properties> {
  _informersInstances!: Informer[];

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
    this._informersInstances = [];

    if (items?.length) {
      items.forEach((itemData) => {
        this._renderItem(itemData);
      });
    }
  }

  _renderItem(itemData: Alert): void {
    const $informer = $('<div>')
      .addClass(CHAT_ALERTLIST_ERROR_CLASS);

    this.$element().append($informer);

    const informer = this._createComponent($informer, Informer, {
      text: itemData?.message ?? '',
      icon: 'errorcircle',
      showBackground: false,
    });

    this._informersInstances.push(informer);
  }

  _cleanItems(): void {
    this._informersInstances.forEach((informerInstance) => {
      informerInstance.dispose();
    });
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

  _clean(): void {
    this._cleanItems();

    super._clean();
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
