import Errors from '../widget/ui.errors';
import Quill from 'quill';

function getQuill() {
    if(!Quill) {
        throw Errors.Error('E1041', 'Quill');
    }

    return Quill;
}

export { getQuill };
