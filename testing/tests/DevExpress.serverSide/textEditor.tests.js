"use strict";

var $ = require("jquery");

require("common.css!");

QUnit.testStart(function() {
    var markup = '<div id="texteditor"></div>';

    $("#qunit-fixture").html(markup);
});

require("../DevExpress.ui.widgets.editors/textEditorParts/markup.tests.js");
