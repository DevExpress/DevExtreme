export default class WidgetCollector {
    constructor() {
        this._collection = [];
    }

    clear() {
        this._collection = [];
    }

    add(name, instance) {
        this._collection.push({ name, instance });
    }

    getByName(widgetName) {
        const { instance } = this._collection.find(({ name }) => widgetName === name) || {};

        return instance;
    }

    each(handler) {
        this._collection.forEach(({ name, instance }) => instance && handler(name, instance));
    }
}
