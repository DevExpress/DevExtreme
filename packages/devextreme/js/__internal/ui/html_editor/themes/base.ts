import Quill from 'devextreme-quill';

import type { QuillDependent, ThemeConstructor, ThemeOptions } from '../types';
import type { QuillInstance } from '../types/quill';

// eslint-disable-next-line import/no-mutable-exports
let BasicTheme: QuillDependent<ThemeConstructor> = {};

if (Quill) {
  const Theme: ThemeConstructor = Quill.import('core/theme');

  BasicTheme = class BaseTheme extends Theme {
    constructor(quill: QuillInstance, options: ThemeOptions) {
      super(quill, options);
      this.quill.root.classList.add('dx-htmleditor-content');
      this.quill.root.setAttribute('role', 'textbox');
      this.quill.root.setAttribute('aria-label', 'Editor content');
      this.quill.root.setAttribute('aria-multiline', 'true');
    }
  };
}

export default BasicTheme;
