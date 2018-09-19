import $ from "jquery";

import "common.css!";

QUnit.testStart(function() {
    var markup = '<div id="htmlEditor"></div>';

    $("#qunit-fixture").html(markup);
});

import "../DevExpress.ui.widgets.editors/htmlEditorParts/markup.tests.js";
