import Quill from 'devextreme-quill';

let BaseTheme;

if(Quill) {
    const Theme = Quill.import('core/theme');

    BaseTheme = class BaseTheme extends Theme {
        constructor(quill, options) {

            super(quill, options);
            this.quill.root.classList.add('dx-htmleditor-content');
            this.quill.root.setAttribute('role', 'textbox');
            this.quill.root.setAttribute('aria-label', 'Editor content');
        }
    };
} else {
    BaseTheme = {};
}

export default BaseTheme;
