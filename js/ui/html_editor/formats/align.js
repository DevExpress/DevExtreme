import { getQuill } from '../quill_importer';

const quill = getQuill();
const AlignStyle = quill.import('attributors/style/align');

AlignStyle.whitelist.push('left');

export default AlignStyle;
