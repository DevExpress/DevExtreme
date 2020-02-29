import { getQuill } from '../quill_importer';

const quill = getQuill();
const FontStyle = quill.import('attributors/style/font');

FontStyle.whitelist = null;

export default FontStyle;
