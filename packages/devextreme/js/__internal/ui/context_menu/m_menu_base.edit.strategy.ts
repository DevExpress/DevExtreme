import $ from '@js/core/renderer';
import { map } from '@js/core/utils/iterator';
import type { Item } from '@js/ui/context_menu';
import PlainEditStrategy from '@ts/ui/collection/m_collection_widget.edit.strategy.plain';

class MenuBaseEditStrategy extends PlainEditStrategy {
  _getPlainItems(): Item {
    return map(this._collectionWidget.option('items'), function getMenuItems(item) {
      return item.items ? [item].concat(map(item.items, getMenuItems)) : item;
    });
  }

  _stringifyItem(item) {
    return JSON.stringify(item, (key, value) => {
      if (key === 'template') {
        return this._getTemplateString(value);
      }
      return value;
    });
  }

  _getTemplateString(template) {
    let result;

    if (typeof template === 'object') {
      result = $(template).text();
    } else {
      result = template.toString();
    }

    return result;
  }
}

export default MenuBaseEditStrategy;
