import $ from "jquery";

import "common.css!";

QUnit.testStart(() => {
    var markup = '<div id="richTextEditor"></div>';

    $("#qunit-fixture").html(markup);
});

import "./richTextEditorParts/converterController.tests.js";
