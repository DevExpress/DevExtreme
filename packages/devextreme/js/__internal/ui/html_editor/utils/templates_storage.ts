import type { FunctionTemplate } from '@js/core/templates/function_template';
import { isDefined, isEmptyObject } from '@js/core/utils/type';

import type { MentionTemplateKey, MentionTemplateLookupKey } from '../types';

export default class TemplatesStorage {
  _storage: Record<string, Record<string, FunctionTemplate>>;

  constructor() {
    this._storage = {};
  }

  set({ editorKey, marker }: MentionTemplateKey, value: FunctionTemplate): void {
    this._storage[editorKey] ??= {};
    this._storage[editorKey][marker] = value;
  }

  get({ editorKey, marker }: MentionTemplateLookupKey): FunctionTemplate | undefined {
    const isQuillFormatCall = !isDefined(editorKey);

    // NOTE: If anonymous templates are used, mentions are parsed from the markup.
    // The Quill format does not have information about a related HtmlEditor instance.
    // In this case, we need to use the latest template in the storage
    // because the appropriate instance was already created and added to the storage.

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- see the directives below
    return isQuillFormatCall
      // @ts-expect-error a raw dx-mention node has no data-marker; undefined finds no template
      ? Object.values(this._storage).at(-1)?.[marker]
      // @ts-expect-error see above
      : this._storage[editorKey]?.[marker];
  }

  delete({ editorKey, marker }: MentionTemplateKey): void {
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
