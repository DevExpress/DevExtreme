import { getLibrary } from '../../../core/registry';

const quill = getLibrary('quill');
const FontStyle = quill.import('attributors/style/font');

FontStyle.whitelist = null;

export default FontStyle;
