import { getLibrary } from '../../../core/library_registry';

const quill = getLibrary('quill');
const SizeStyle = quill.import('attributors/style/size');

SizeStyle.whitelist = null;

export default SizeStyle;
