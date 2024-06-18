import Quill from 'devextreme-quill';

// eslint-disable-next-line import/no-mutable-exports
let FontStyle = {};

if (Quill) {
  FontStyle = Quill.import('attributors/style/font');
  // @ts-expect-error
  FontStyle.whitelist = null;
}

export default FontStyle;
