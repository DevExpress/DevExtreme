import Quill from 'devextreme-quill';

// eslint-disable-next-line import/no-mutable-exports
let AlignStyle = {};

if (Quill) {
  AlignStyle = Quill.import('attributors/style/align');
  // @ts-expect-error
  AlignStyle.whitelist.push('left');
}

export default AlignStyle;
