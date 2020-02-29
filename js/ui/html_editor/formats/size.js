import { getQuill } from '../quill_importer';

const quill = getQuill();
const SizeStyle = quill.import('attributors/style/size');

SizeStyle.whitelist = null;

export default SizeStyle;
