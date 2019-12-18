var registerComponent = require('../../core/component_registrator'),
    TextEditorMask = require('./ui.text_editor.mask');

registerComponent('dxTextEditor', TextEditorMask);

module.exports = TextEditorMask;
