import Quill from 'devextreme-quill';

// eslint-disable-next-line import/no-mutable-exports
let SizeStyle = {};

if (Quill) {
  SizeStyle = Quill.import('attributors/style/size');
  // @ts-expect-error
  SizeStyle.whitelist = null;
}

export default SizeStyle;
