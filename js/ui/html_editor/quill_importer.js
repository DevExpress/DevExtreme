import Errors from '../widget/ui.errors';
import Quill from 'quill';

export function getQuill() {
    if(!Quill) {
        throw Errors.Error('E1041', 'Quill');
    }

    return Quill;
}
