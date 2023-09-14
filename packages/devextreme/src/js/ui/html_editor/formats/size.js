import Quill from 'devextreme-quill';

let SizeStyle = {};

if(Quill) {
    SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = null;
}

export default SizeStyle;
