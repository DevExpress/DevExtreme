import Guid from "../../core/guid";
import { each } from "../../core/utils/iterator";

export default class FormItemsRunTimeInfo {
    constructor() {
        this._map = {};
    }

    _findWidgetInstance(condition) {
        let result;

        each(this._map, function(guid, { widgetInstance, item }) {
            if(condition(item)) {
                result = widgetInstance;

                return false;
            }
        });

        return result;
    }

    _findFieldByCondition(callback, field) {
        let result;
        each(this._map, function(key, value) {
            if(callback(value)) {
                result = field === "guid" ? key : value[field];
                return false;
            }
        });
        return result;
    }

    clear() {
        this._map = {};
    }

    removeItemsByItems(itemsRunTimeInfo) {
        each(itemsRunTimeInfo.getItems(), guid => {
            delete this._map[guid];
        });
    }

    add(options) {
        const key = options.guid || new Guid();
        this._map[key] = options;
        return key;
    }

    addLayoutManagerToItemByKey(layoutManager, key) {
        const item = this._map[key];
        if(item) {
            item.layoutManager = layoutManager;
        }
    }

    addItemsOrExtendFrom(itemsRunTimeInfo) {
        itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
            if(this._map[key]) {
                this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
                this._map[key].$itemContainer = itemRunTimeInfo.$itemContainer;
            } else {
                this.add({
                    item: itemRunTimeInfo.item,
                    widgetInstance: itemRunTimeInfo.widgetInstance,
                    guid: key,
                    $itemContainer: itemRunTimeInfo.$itemContainer
                });
            }
        });
    }

    findWidgetInstanceByItem(item) {
        return this._findWidgetInstance(storedItem => storedItem === item);
    }

    getGroupOrTabLayoutManagerByPath(path) {
        return this._findFieldByCondition(value => value.path === path, "layoutManager");
    }

    getKeyByPath(path) {
        return this._findFieldByCondition(value => value.path === path, "guid");
    }

    getPathFromItem(targetItem) {
        return this._findFieldByCondition(value => value.item === targetItem, "path");
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

    getItems() {
        return this._map;
    }

    each(handler) {
        each(this._map, function(key, itemRunTimeInfo) {
            handler(key, itemRunTimeInfo);
        });
    }
}
