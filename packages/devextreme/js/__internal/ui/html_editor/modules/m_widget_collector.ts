import { each } from '@js/core/utils/iterator';

export default class WidgetCollector {
  _collection: any[];

  constructor() {
    this._collection = [];
  }

  clear() {
    this._collection = [];
  }

  add(name, instance) {
    this._collection.push({ name, instance });
  }

  remove(name) {
    this._collection = this._collection.filter((item) => item.name !== name);
  }

  getByName(widgetName) {
    let widget = null;
    // @ts-expect-error
    each(this._collection, (index, { name, instance }) => {
      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });

    return widget;
  }

  each(handler) {
    this._collection.forEach(({ name, instance }) => instance && handler(name, instance));
  }
}
