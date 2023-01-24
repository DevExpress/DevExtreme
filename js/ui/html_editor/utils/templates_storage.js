import { isDefined, isEmptyObject } from '../../../core/utils/type';

export default class TemplatesStorage {
    constructor() {
        this._storage = {};
    }

    set({ widgetKey, marker }, value) {
        this._storage[widgetKey] ??= {};
        this._storage[widgetKey][marker] = value;
    }

    get({ widgetKey, marker }) {
        const isQuillFormatCall = !isDefined(widgetKey);

        // T1110266
        // NOTE: If anonymous templates is used, mention is parsed from the markup.
        // Quill format does not have information about related HtmlEditor instance.
        // In this case, the latest template in the storage is what we need
        // because appropriate instance has already been created and has added its templates to the storage.
        return isQuillFormatCall
            ? Object.values(this._storage).at(-1)?.[marker]
            : this._storage[widgetKey]?.[marker];
    }

    delete({ widgetKey, marker }) {
        if(!this._storage[widgetKey]) {
            return;
        }

        delete this._storage[widgetKey][marker];
        if(isEmptyObject(this._storage[widgetKey])) {
            delete this._storage[widgetKey];
        }
    }
}
