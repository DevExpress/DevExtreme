var $ = require("jquery");

require("common.css!");
require("ui/panorama");

QUnit.testStart(function() {
    var markup =
        '<style>\
            .dx-panorama {\
                width: 200px;\
                height: 600px;\
            }\
            .dx-panorama-title {\
                height: 100px;\
            }\
            .dx-panorama-itemscontainer {\
                top: 100px;\
            }\
        </style>\
        \
        <div id="panorama"></div>';

    $("#qunit-fixture").html(markup);
});

var PANORAMA_CLASS = "dx-panorama",

    PANORAMA_TITLE_CLASS = "dx-panorama-title",
    PANORAMA_GHOST_TITLE_CLASS = "dx-panorama-ghosttitle",
    PANORAMA_ITEMS_CONTAINER_CLASS = "dx-panorama-itemscontainer",

    PANORAMA_ITEM_CLASS = "dx-panorama-item";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var backgroundPosition = function($element) {
    return parseInt($element.css("background-position").split(" ")[0], 10);
};

var image = {
    width: 89,
    height: 50
};

QUnit.module("panorama rendering");

QUnit.test("widget should be rendered", function(assert) {
    var $panorama = $("#panorama").dxPanorama();

    assert.ok($panorama.hasClass(PANORAMA_CLASS), "widget class added");
});

QUnit.test("selected index should be equal 0", function(assert) {
    var panorama = $("#panorama").dxPanorama().dxPanorama("instance");

    assert.equal(panorama.option("selectedIndex"), 0, "selectedIndex equals 0");
});


QUnit.module("markup");

QUnit.test("background should set correctly", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image
    });

    assert.equal(backgroundPosition($panorama), 0, "background image in correct position");
});

QUnit.test("title should be rendered with correct data", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama"
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        $ghostTitle = $panorama.find(toSelector(PANORAMA_GHOST_TITLE_CLASS));

    assert.equal($title.length, 1, "title rendered");
    assert.equal($ghostTitle.length, 1, "ghost title rendered");
    assert.equal($title.text(), "my panorama", "correct title text rendered");
    assert.equal($ghostTitle.text(), "my panorama", "correct ghost title text rendered");
});

QUnit.test("items should be rendered in items container", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" }
        ]
    });

    var $container = $panorama.find(toSelector(PANORAMA_ITEMS_CONTAINER_CLASS)),
        $item = $container.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal($container.length, 1, "container rendered");
    assert.equal($item.length, 1, "item rendered in container");
});
