"use strict";

var $ = require("jquery");

QUnit.testStart(function() {
    var markup =
        '<div id="container">\
            <div id="element"><div id="delegated"></div></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

require("./pointerParts/pointerTests.js");
require("./pointerParts/baseTests.js");
require("./pointerParts/mouseTests.js");
require("./pointerParts/touchTests.js");
require("./pointerParts/mouseAndTouchTests.js");
require("./pointerParts/msPointerTests.js");
