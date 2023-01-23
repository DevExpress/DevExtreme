import { isDefined } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._storage = {};
    }

    set({ widgetKey, marker }, value) {
        this._storage[widgetKey] ??= {};
        this._storage[widgetKey][marker] = value;
    }

    get({ widgetKey, marker }) {
        // reason for add double key is T1110266
        if(isDefined(widgetKey)) {
            const widgetTemplates = this._storage[widgetKey];

            return widgetTemplates ? widgetTemplates[marker] : undefined;
        } else {
            // When Quill parse markup, we do not have info about widget (widgetKey)
            // In this case, we take latest template from storage because this (latest) template related to current widget(this widget initialized parsing of markup)
            const lastWidgetTemplates = Object.values(this._storage).at(-1);

            return lastWidgetTemplates ? lastWidgetTemplates[marker] : undefined;
        }
    }

    delete({ widgetKey, marker }) {
        const widgetTemplates = this._storage[widgetKey];
        if(!widgetTemplates) {
            return;
        }

        delete widgetTemplates[marker];
        if(Object.keys(widgetTemplates).length === 0) {
            delete this._storage[widgetKey];
        }
    }
}
