import { isDefined } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._map = {};
    }

    set({ widgetID, marker }, value) {
        let innerMap = this._map[widgetID];
        if(!innerMap) {
            innerMap = new Map();
            this._map[widgetID] = innerMap;
        }

        innerMap.set(marker, value);
    }

    get({ widgetID, marker }) {
        if(isDefined(widgetID)) {
            const innerMap = this._map[widgetID];
            return innerMap ? innerMap.get(marker) : undefined;
        }

        const ids = Object.keys(this._map).sort((a, b) => a - b);

        for(let i = ids.length - 1; i >= 0; i--) {
            const current = this._map[ids[i]].get(marker);
            if(isDefined(current)) {
                return current;
            }
        }
        return undefined;
    }

    delete({ widgetID, marker }) {
        const innerMap = this._map[widgetID];
        if(!innerMap) {
            return;
        }

        innerMap.delete(marker);
        if(innerMap.size === 0) {
            delete this._map[widgetID];
        }
    }
}
