import Errors from '../widget/ui.errors';
import { getWindow } from '../../core/utils/window';

let Quill;

function getQuill() {
    if(!Quill) {
        Quill = requestQuill();
    }

    return Quill;
}

function requestQuill() {
    const window = getWindow();
    const quill = window && window.Quill || require('quill');

    if(!quill) {
        throw Errors.Error('E1041', 'Quill');
    }

    return quill;
}

export { getQuill };
