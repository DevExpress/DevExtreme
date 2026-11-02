import Errors from '@js/ui/widget/ui.errors';
import Quill from 'devextreme-quill';

import type { QuillStatic } from './types/quill';

export function getQuill(): QuillStatic {
  if (!Quill) {
    throw Errors.Error('E1041', 'Quill');
  }

  return Quill as QuillStatic;
}
