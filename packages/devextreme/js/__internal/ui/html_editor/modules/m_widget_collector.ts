import { each } from '@js/core/utils/iterator';
import type Widget from '@ts/core/widget/widget';

/** A toolbar item's widget (the `component` of its `onInitialized`), stored by the item name */
interface CollectedWidget<TInstance> {
  name: string;
  instance: TInstance;
}

export default class WidgetCollector<TInstance = Widget> {
  _collection: CollectedWidget<TInstance>[];

  constructor() {
    this._collection = [];
  }

  clear(): void {
    this._collection = [];
  }

  add(name: string, instance: TInstance): void {
    this._collection.push({ name, instance });
  }

  remove(name?: string): void {
    this._collection = this._collection.filter((item) => item.name !== name);
  }

  getByName(widgetName: string): TInstance | null {
    let widget: TInstance | null = null;
    each(this._collection, (index, { name, instance }) => {
      if (name === widgetName) {
        widget = instance;
        return false;
      }
      return undefined;
    });

    return widget;
  }

  each(handler: (name: string, instance: TInstance) => void): void {
    this._collection.forEach(({ name, instance }) => instance && handler(name, instance));
  }
}
