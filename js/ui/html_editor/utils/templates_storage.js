import { isDefined } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._widgetsMap = {};
    }

    set({ widgetKey, marker }, value) {
        let widgetTemplates = this._widgetsMap[widgetKey];
        if(!widgetTemplates) {
            widgetTemplates = new Map();
            this._widgetsMap[widgetKey] = widgetTemplates;
        }

        widgetTemplates.set(marker, value);
    }

    get({ widgetKey, marker }) {
        if(isDefined(widgetKey)) {
            const widgetTemplates = this._widgetsMap[widgetKey];
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

    delete({ widgetKey, marker }) {
        const widgetTemplates = this._widgetsMap[widgetKey];
        if(!widgetTemplates) {
            return;
        }

        widgetTemplates.delete(marker);
        if(widgetTemplates.size === 0) {
            delete this._widgetsMap[widgetKey];
        }
    }
}
