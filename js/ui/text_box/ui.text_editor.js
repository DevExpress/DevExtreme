const registerComponent = require('../../core/component_registrator');
const TextEditorMask = require('./ui.text_editor.mask');

registerComponent('dxTextEditor', TextEditorMask);

module.exports = TextEditorMask;
