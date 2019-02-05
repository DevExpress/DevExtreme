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
import "./htmlEditorParts/toolbarModule.tests.js";
import "./htmlEditorParts/toolbarIntegration.tests.js";
import "./htmlEditorParts/dropImageModule.tests.js";
import "./htmlEditorParts/popupModule.tests.js";
import "./htmlEditorParts/variablesModule.tests.js";
import "./htmlEditorParts/api.tests.js";
import "./htmlEditorParts/formDialog.tests.js";
import "./htmlEditorParts/paste.tests.js";
import "./htmlEditorParts/events.tests.js";
