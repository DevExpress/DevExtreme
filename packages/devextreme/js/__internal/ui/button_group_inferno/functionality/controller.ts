import type { ButtonGroupBase } from '../button_group.widget';

export class FunctionalityController {
  constructor(private readonly widget: ButtonGroupBase) {}

  public addItem(item: unknown): void {
    const { items = [] } = this.widget.option();
    this.widget.option('items', [...items, item]);
    console.warn('Item added:', item);
  }

  public selectItem(itemIndex: number): void {
    const { selectedItemKeys = [], items = [], keyExpr = 'text' } = this.widget.option();

    if (itemIndex >= 0 && itemIndex < items.length) {
      const item = items[itemIndex];
      const key = typeof keyExpr === 'string' ? item[keyExpr] : keyExpr(item);

      if (!selectedItemKeys.includes(key)) {
        const newSelectedKeys = [...selectedItemKeys, key];
        this.widget.option('selectedItemKeys', newSelectedKeys);
        console.warn(`Item selected at index ${itemIndex}:`, key);
      }
    }
  }

  public deselectItem(itemIndex: number): void {
    const { selectedItemKeys = [], items = [], keyExpr = 'text' } = this.widget.option();

    if (itemIndex >= 0 && itemIndex < items.length) {
      const item = items[itemIndex];
      const key = typeof keyExpr === 'string' ? item[keyExpr] : keyExpr(item);

      const keyIndex = selectedItemKeys.indexOf(key);
      if (keyIndex > -1) {
        const newSelectedKeys = selectedItemKeys.filter((_, index) => index !== keyIndex);
        this.widget.option('selectedItemKeys', newSelectedKeys);
        console.warn(`Item deselected at index ${itemIndex}:`, key);
      }
    }
  }

  public getSelectedItemKeys(): unknown[] {
    const { selectedItemKeys = [] } = this.widget.option();
    return selectedItemKeys;
  }

  public getSelectedItems(): unknown[] {
    const { selectedItems = [] } = this.widget.option();
    return selectedItems;
  }

  public clearSelection(): void {
    this.widget.option('selectedItemKeys', []);
    this.widget.option('selectedItems', []);
    console.warn('Selection cleared');
  }

  public isItemSelected(itemIndex: number): boolean {
    const { selectedItemKeys = [], items = [], keyExpr = 'text' } = this.widget.option();

    if (itemIndex >= 0 && itemIndex < items.length) {
      const item = items[itemIndex];
      const key = typeof keyExpr === 'string' ? item[keyExpr] : keyExpr(item);
      return selectedItemKeys.includes(key);
    }

    return false;
  }
}
