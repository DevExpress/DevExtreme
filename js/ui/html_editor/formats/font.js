import { getLibrary } from '../../../core/library_registry';

const quill = getLibrary('quill');
const FontStyle = quill.import('attributors/style/font');

FontStyle.whitelist = null;

export default FontStyle;
