import localizationMessage from '@js/common/core/localization/message';
import Quill from 'devextreme-quill';

// eslint-disable-next-line import/no-mutable-exports
let BaseTheme;

if (Quill) {
  const Theme = Quill.import('core/theme');

  BaseTheme = class BaseTheme extends Theme {
    constructor(quill, options) {
      super(quill, options);
      this.quill.root.classList.add('dx-htmleditor-content');
      this.quill.root.setAttribute('role', 'textbox');
      this.quill.root.setAttribute('aria-label', [
        localizationMessage.format('dxHtmlEditor-editorAriaLabel'),
        localizationMessage.format('dxHtmlEditor-ariaEscapeInstruction'),
      ].join('. '));
      this.quill.root.setAttribute('aria-multiline', 'true');
    }
  };
} else {
  BaseTheme = {};
}

export default BaseTheme;
