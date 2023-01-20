import { isDefined } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._widgetsMap = {};
    }

    set({ widgetID, marker }, value) {
        let widgetTemplates = this._widgetsMap[widgetID];
        if(!widgetTemplates) {
            widgetTemplates = new Map();
            this._widgetsMap[widgetID] = widgetTemplates;
        }

        widgetTemplates.set(marker, value);
    }

    get({ widgetID, marker }) {
        if(isDefined(widgetID)) {
            const widgetTemplates = this._widgetsMap[widgetID];
            return widgetTemplates ? widgetTemplates.get(marker) : undefined;
        }

        const ids = Object.keys(this._widgetsMap).sort((a, b) => b - a);
        let resultTemplate;

        ids.some(id => {
            const current = this._widgetsMap[id].get(marker);
            if(isDefined(current)) {
                resultTemplate = current;
                return true;
            }
        });
        return resultTemplate;
    }

    delete({ widgetID, marker }) {
        const widgetTemplates = this._widgetsMap[widgetID];
        if(!widgetTemplates) {
            return;
        }

        widgetTemplates.delete(marker);
        if(widgetTemplates.size === 0) {
            delete this._widgetsMap[widgetID];
        }
    }
}
