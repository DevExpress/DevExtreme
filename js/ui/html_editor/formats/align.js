
import { getLibrary } from '../../../core/registry';

const quill = getLibrary('quill');
const AlignStyle = quill.import('attributors/style/align');

AlignStyle.whitelist.push('left');

export default AlignStyle;
