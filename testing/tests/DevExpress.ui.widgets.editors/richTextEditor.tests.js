import $ from "jquery";

import "common.css!";

QUnit.testStart(() => {
    var markup = '<div id="richTextEditor"></div>';

    $("#qunit-fixture").html(markup);
});

import "./richTextEditorParts/quillRegistrator.tests.js";
import "./richTextEditorParts/converters.tests.js";
import "./richTextEditorParts/markup.tests.js";
import "./richTextEditorParts/valueRendering.tests.js";
import "./richTextEditorParts/toolbarModule.tests.js";
import "./richTextEditorParts/dropImageModule.tests.js";
import "./richTextEditorParts/paste.tests.js";
