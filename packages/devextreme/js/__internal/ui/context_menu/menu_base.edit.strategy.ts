import $ from '@js/core/renderer';
import type { Item } from '@js/ui/menu';
import PlainEditStrategy from '@ts/ui/collection/collection_widget.edit.strategy.plain';

class MenuBaseEditStrategy extends PlainEditStrategy<Item> {
  _getPlainItems(): Item[] {
    const getPlainItems = (items: Item[]): Item[] => items.flatMap(
      (item) => (item.items ? [item, ...getPlainItems(item.items)] : [item]),
    );

    return getPlainItems(this._getItems());
  }

  static _stringifyItem(item: Item): string {
    return JSON.stringify(item, (key: string, value: unknown) => {
      if (key === 'template') {
        return MenuBaseEditStrategy._getTemplateString(value);
      }
      return value;
    });
  }

  static _getTemplateString(template: unknown): string {
    if (typeof template === 'object' && template !== null) {
      // @ts-expect-error ts-error
      return $(template).text();
    }

    return String(template);
  }
}

export default MenuBaseEditStrategy;
