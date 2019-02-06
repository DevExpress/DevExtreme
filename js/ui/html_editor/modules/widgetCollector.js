import { each } from "../../../core/utils/iterator";

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
        let widget;

        each(this._collection, (index, { name, instance }) => {
            if(widgetName === name) {
                widget = instance;
                return false;
            }
        });

        return widget;
    }

    each(handler) {
        each(this._collection, function(index, { name, instance }) {
            if(instance) {
                handler(name, instance);
            }
        });
    }
}
