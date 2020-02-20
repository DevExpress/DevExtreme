import { getLibrary } from '../../../core/registry';

const Theme = getLibrary('quill').import('core/theme');

class BaseTheme extends Theme {
    constructor(quill, options) {

        super(quill, options);
        this.quill.root.classList.add('dx-htmleditor-content');
    }
}

export default BaseTheme;
