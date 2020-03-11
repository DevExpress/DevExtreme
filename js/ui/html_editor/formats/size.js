import Quill from 'quill';

let SizeStyle = {};

if(Quill) {
    SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = null;
}

export default SizeStyle;
