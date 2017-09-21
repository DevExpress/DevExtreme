"use strict";

var registerComponent = require("../../core/component_registrator"),
    TextEditorFormatter = require("./ui.text_editor.formatter");

registerComponent("dxTextEditor", TextEditorFormatter);

module.exports = TextEditorFormatter;
