import Guid from "../../core/guid";
import { each } from "../../core/utils/iterator";

export default class InstanceStorage {
    constructor() {
        this._storage = {};
    }

    _find(condition) {
        var resultInstance;

        each(this._storage, function(guid, { instance, item }) {
            if(condition(item)) {
                resultInstance = instance;

                return false;
            }
        });

        return resultInstance;
    }

    clear() {
        this._storage = {};
    }

    add(item, instance, guid) {
        guid = guid || new Guid();
        this._storage[guid] = { item, instance };

        return guid;
    }

    extend(instanceStorage) {
        instanceStorage.each((instance, item, guid) => {
            if(this._storage[guid]) {
                this._storage[guid].instance = instance;
            } else {
                this.add(item, instance, guid);
            }
        });
    }

    findByItem(item) {
        return this._find(storedItem => storedItem === item);
    }

    findByName(name) {
        return this._find(item => name === item.name);
    }

    findByDataField(dataField) {
        return this._find(item => dataField === item.dataField);
    }

    each(handler) {
        each(this._storage, function(guid, { instance, item }) {
            if(instance) {
                handler(instance, item, guid);
            }
        });
    }
}
