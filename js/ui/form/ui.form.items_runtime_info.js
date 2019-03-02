import Guid from "../../core/guid";
import { each } from "../../core/utils/iterator";

export default class FormItemsRunTimeInfo {
    constructor() {
        this._map = {};
    }

    _findWidgetInstance(condition) {
        var result;

        each(this._map, function(guid, { widgetInstance, item }) {
            if(condition(item)) {
                result = widgetInstance;

                return false;
            }
        });

        return result;
    }

    clear() {
        this._map = {};
    }

    add(item, widgetInstance, guid, $itemContainer) {
        guid = guid || new Guid();
        this._map[guid] = { item, widgetInstance, $itemContainer };

        return guid;
    }

    addItemsOrExtendFrom(itemsRunTimeInfo) {
        itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
            if(this._map[key]) {
                this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
                this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer;
            } else {
                this.add(itemRunTimeInfo.item, itemRunTimeInfo.widgetInstance, key, itemRunTimeInfo.$itemContainer);
            }
        });
    }

    findWidgetInstanceByItem(item) {
        return this._findWidgetInstance(storedItem => storedItem === item);
    }

    findWidgetInstanceByName(name) {
        return this._findWidgetInstance(item => name === item.name);
    }

    findWidgetInstanceByDataField(dataField) {
        return this._findWidgetInstance(item => dataField === item.dataField);
    }

    findItemContainerByItem(item) {
        for(let key in this._map) {
            if(this._map[key].item === item) {
                return this._map[key].$itemContainer;
            }
        }
        return null;
    }

    each(handler) {
        each(this._map, function(key, itemRunTimeInfo) {
            handler(key, itemRunTimeInfo);
        });
    }
}
