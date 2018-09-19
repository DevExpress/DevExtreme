import $ from "jquery";

import "common.css!";

QUnit.testStart(function() {
    var markup = '<div id="htmlEditor"></div>';

    $("#qunit-fixture").html(markup);
});

import "./htmlEditorParts/quillImporter.tests.js";
import "./htmlEditorParts/quillRegistrator.tests.js";
import "./htmlEditorParts/converters.tests.js";
import "./htmlEditorParts/markup.tests.js";
import "./htmlEditorParts/valueRendering.tests.js";
