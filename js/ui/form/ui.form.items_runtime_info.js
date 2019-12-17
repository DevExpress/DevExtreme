import Guid from '../../core/guid';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { isString } from '../../core/utils/type';

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

    _findFieldByCondition(callback, valueExpr) {
        let result;
        each(this._map, function(key, value) {
            if(callback(value)) {
                result = valueExpr === 'guid' ? key : value[valueExpr];
                return false;
            }
        });
        return result;
    }

    clear() {
        this._map = {};
    }

    removeItemsByItems(itemsRunTimeInfo) {
        each(itemsRunTimeInfo.getItems(), guid => this.removeItemByKey(guid));
    }

    removeItemByKey(key) {
        delete this._map[key];
    }

    add(options) {
        const key = options.guid || new Guid();
        this._map[key] = options;
        return key;
    }

    addItemsOrExtendFrom(itemsRunTimeInfo) {
        itemsRunTimeInfo.each((key, itemRunTimeInfo) => {
            if(this._map[key]) {
                if(itemRunTimeInfo.widgetInstance) {
                    this._map[key].widgetInstance = itemRunTimeInfo.widgetInstance;
                }
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

    extendRunTimeItemInfoByKey(key, options) {
        if(this._map[key]) {
            this._map[key] = extend(this._map[key], options);
        }
    }

    findWidgetInstanceByItem(item) {
        return this._findWidgetInstance(storedItem => storedItem === item);
    }

    getGroupOrTabLayoutManagerByPath(targetPath) {
        return this._findFieldByCondition(({ path }) => path === targetPath, 'layoutManager');
    }

    getKeyByPath(targetPath) {
        return this._findFieldByCondition(({ path }) => path === targetPath, 'guid');
    }

    getPathFromItem(targetItem) {
        return this._findFieldByCondition(({ item }) => item === targetItem, 'path');
    }

    findWidgetInstanceByName(name) {
        return this._findWidgetInstance(item => name === item.name);
    }

    findWidgetInstanceByDataField(dataField) {
        return this._findWidgetInstance(item => dataField === (isString(item) ? item : item.dataField));
    }

    findItemContainerByItem(item) {
        for(const key in this._map) {
            if(this._map[key].item === item) {
                return this._map[key].$itemContainer;
            }
        }
        return null;
    }

    findItemIndexByItem(targetItem) {
        return this._findFieldByCondition(({ item }) => item === targetItem, 'itemIndex');
    }

    getItems() {
        return this._map;
    }

    each(handler) {
        each(this._map, function(key, itemRunTimeInfo) {
            handler(key, itemRunTimeInfo);
        });
    }

    removeItemsByPathStartWith(path) {
        const keys = Object.keys(this._map);
        const filteredKeys = keys.filter(key => this._map[key].path.startsWith(path));
        filteredKeys.forEach(key => this.removeItemByKey(key));
    }
}
