import { getLibrary } from '../../../core/registry';

const quill = getLibrary('quill');
const SizeStyle = quill.import('attributors/style/size');

SizeStyle.whitelist = null;

export default SizeStyle;
