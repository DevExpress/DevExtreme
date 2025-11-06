import Quill from 'devextreme-quill';

import type { AttributorConstructor } from '../types/quill';

type OptionalAttributor = AttributorConstructor | Record<string, never>;

const AlignStyle: OptionalAttributor = Quill?.import('attributors/style/align') || {};

if (Array.isArray(AlignStyle.whitelist)) {
  AlignStyle.whitelist.push('left');
}

export default AlignStyle;
