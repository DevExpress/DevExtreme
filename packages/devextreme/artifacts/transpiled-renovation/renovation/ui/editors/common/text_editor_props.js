"use strict";

exports.TextEditorProps = void 0;
var _themes = require("../../../../ui/themes");
const TextEditorProps = exports.TextEditorProps = {
  maxLength: null,
  spellCheck: false,
  valueChangeEvent: 'change',
  get stylingMode() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? 'filled' : 'outlined';
  },
  defaultValue: ''
};