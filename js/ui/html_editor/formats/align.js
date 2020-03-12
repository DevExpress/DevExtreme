import Quill from 'quill';

let AlignStyle = {};

if(Quill) {
    AlignStyle = Quill.import('attributors/style/align');
    AlignStyle.whitelist.push('left');
}

export default AlignStyle;
