import Guid from '../../core/guid';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';

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

    add(options) {
        const key = options.guid || new Guid();
        this._map[key] = options;
        return key;
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

    extendRunTimeItemInfoByKey(key, options) {
        this._map[key] = extend(this._map[key], options);
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

    findItemIndexByItem(targetItem) {
        for(let key in this._map) {
            if(this._map[key].item === targetItem) {
                return this._map[key].itemIndex;
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
