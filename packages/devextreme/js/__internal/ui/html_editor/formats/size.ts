import Quill from 'devextreme-quill';

import type { AttributorConstructor } from '../types/quill';

type OptionalAttributor = AttributorConstructor | Record<string, never>;

const SizeStyle: OptionalAttributor = Quill?.import('attributors/style/size') || {};

if ('whitelist' in SizeStyle) {
  SizeStyle.whitelist = null;
}

export default SizeStyle;
