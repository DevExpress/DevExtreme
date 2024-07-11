"use strict";

exports.EditorLabelProps = void 0;
var _themes = require("../../../../ui/themes");
const EditorLabelProps = exports.EditorLabelProps = {
  label: '',
  get labelMode() {
    return (0, _themes.isMaterial)((0, _themes.current)()) ? 'floating' : 'static';
  }
};