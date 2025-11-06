import Quill from 'devextreme-quill';

import type { AttributorConstructor } from '../types/quill';

type OptionalAttributor = AttributorConstructor | Record<string, never>;

const FontStyle: OptionalAttributor = Quill?.import('attributors/style/font') || {};

if ('whitelist' in FontStyle) {
  FontStyle.whitelist = null;
}

export default FontStyle;
