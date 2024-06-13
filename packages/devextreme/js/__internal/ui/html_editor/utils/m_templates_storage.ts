import { isDefined, isEmptyObject } from '@js/core/utils/type';

export default class TemplatesStorage {
  _storage: any;

  constructor() {
    this._storage = {};
  }

  set({ editorKey, marker }, value) {
    this._storage[editorKey] ??= {};
    this._storage[editorKey][marker] = value;
  }

  get({ editorKey, marker }) {
    const isQuillFormatCall = !isDefined(editorKey);

    // NOTE: If anonymous templates are used, mentions are parsed from the markup.
    // The Quill format does not have information about a related HtmlEditor instance.
    // In this case, we need to use the latest template in the storage
    // because the appropriate instance was already created and added to the storage.

    return isQuillFormatCall
      ? Object.values(this._storage).at(-1)?.[marker]
      : this._storage[editorKey]?.[marker];
  }

  delete({ editorKey, marker }) {
    if (!this._storage[editorKey]) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this._storage[editorKey][marker];
    if (isEmptyObject(this._storage[editorKey])) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._storage[editorKey];
    }
  }
}
