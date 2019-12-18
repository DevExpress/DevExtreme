import { getQuill } from '../quill_importer';

const Theme = getQuill().import('core/theme');

class BaseTheme extends Theme {
    constructor(quill, options) {

        super(quill, options);
        this.quill.root.classList.add('dx-htmleditor-content');
    }
}

export default BaseTheme;
