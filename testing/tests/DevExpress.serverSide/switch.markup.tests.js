"use strict";

require("../DevExpress.ui.widgets.editors/switch.markup.tests.js");

var $ = require("jquery");

require("common.css!");
require("ui/switch");

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div id="switch"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var INNER_CLASS = "dx-switch-inner",
    INNER_SELECTOR = "." + INNER_CLASS,
    HANDLE_CLASS = "dx-switch-handle",
    HANDLE_SELECTOR = "." + HANDLE_CLASS,

    LABEL_ON_CLASS = "dx-switch-on",
    LABEL_OFF_CLASS = "dx-switch-off",
    LABEL_ON_SELECTOR = "." + LABEL_ON_CLASS,
    LABEL_OFF_SELECTOR = "." + LABEL_OFF_CLASS;

QUnit.module("Switch markup");

QUnit.test("markup shouldn't have labels and handle", function(assert) {
    var element = $("#switch").dxSwitch();

    var inner = element.find(INNER_SELECTOR);
    assert.notOk(inner.length, "Switch hasn't inner");

    var labelOnEl = element.find(LABEL_ON_SELECTOR);
    assert.notOk(labelOnEl.length, "Switch hasn't label");

    var handleEl = element.find(HANDLE_SELECTOR);
    assert.notOk(handleEl.length, "Switch hasn't handle");

    var labelOffEl = element.find(LABEL_OFF_SELECTOR);
    assert.notOk(labelOffEl.length, "Switch hasn't label");
});
