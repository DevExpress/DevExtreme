var $ = require("jquery");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<style>\
            .dx-scrollable-native-win8.dx-scrollable-native.dx-scrollview .dx-scrollable-container .dx-scrollview-content {\
                height: auto !important;\
            }\
            \
            .dx-list-item {\
                height: 40px;\
            }\
            \
            .dx-icon-remove {\
                width: 20px;\
            }\
            \
            .dx-inkripple {\
                position: absolute;\
                overflow: hidden;\
            }\
        </style>\
        \
        <div id="list"></div>\
        \
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

require("./listParts/commonTests.js");
require("./listParts/editingTests.js");
require("./listParts/editingUITests.js");
require("./listParts/dataSourceFromUrlTests.js");
require("./listParts/liveUpdateTests.js");
