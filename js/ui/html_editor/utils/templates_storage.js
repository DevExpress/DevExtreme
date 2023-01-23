import { isDefined } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._widgetsStorage = {};
    }

    set({ widgetKey, marker }, value) {
        let widgetTemplates = this._widgetsStorage[widgetKey];
        if(!widgetTemplates) {
            this._widgetsStorage[widgetKey] = widgetTemplates = widgetTemplates = {};
        }

        widgetTemplates[marker] = value;
    }

    get({ widgetKey, marker }) {
        if(isDefined(widgetKey)) {
            const widgetTemplates = this._widgetsStorage[widgetKey];
            return widgetTemplates ? widgetTemplates[marker] : undefined;
        }

        const widgetsStorageKeys = Object.keys(this._widgetsStorage);

        return widgetsStorageKeys.length > 0 ? this._widgetsStorage[widgetsStorageKeys[widgetsStorageKeys.length - 1]][marker] : undefined;
    }

    delete({ widgetKey, marker }) {
        const widgetTemplates = this._widgetsStorage[widgetKey];
        if(!widgetTemplates) {
            return;
        }

        delete widgetTemplates[marker];
        if(Object.keys(widgetTemplates).length === 0) {
            delete this._widgetsStorage[widgetKey];
        }
    }
}
