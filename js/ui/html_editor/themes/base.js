import Quill from 'quill';

let BaseTheme;

if(Quill) {
    const Theme = Quill.import('core/theme');

    BaseTheme = class BaseTheme extends Theme {
        constructor(quill, options) {

            super(quill, options);
            this.quill.root.classList.add('dx-htmleditor-content');
        }
    };
} else {
    BaseTheme = {};
}

export default BaseTheme;
