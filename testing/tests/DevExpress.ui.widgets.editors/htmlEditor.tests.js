import $ from "jquery";

import "common.css!";

QUnit.testStart(() => {
    var markup = '<div id="htmlEditor"></div>';

    $("#qunit-fixture").html(markup);
});

import "./htmlEditorParts/quillRegistrator.tests.js";
import "./htmlEditorParts/converters.tests.js";
import "./htmlEditorParts/markup.tests.js";
import "./htmlEditorParts/valueRendering.tests.js";
