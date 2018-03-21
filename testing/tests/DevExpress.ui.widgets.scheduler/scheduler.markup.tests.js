"use strict";

import $ from "jquery";

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler"> </div>\
        <div id="scheduler-work-space"> </div>\
        <div id="navigator"> </div>';

    $("#qunit-fixture").html(markup);
});

import "./workSpace.markup.tests.js";
import "./common.markup.tests.js";
import "./navigator.markup.tests.js";
