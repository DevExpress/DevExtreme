var $ = require("jquery");

require("common.css!");

QUnit.testStart(function() {
    var markup = '<div id="htmlEditor"></div>';

    $("#qunit-fixture").html(markup);
});

require("./htmlEditorParts/markup.tests.js");
require("./htmlEditorParts/valueRendering.tests.js");
require("./htmlEditorParts/formats.tests.js");
