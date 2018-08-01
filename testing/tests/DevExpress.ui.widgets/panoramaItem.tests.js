var $ = require("jquery"),
    Panorama = require("ui/panorama");

QUnit.module("title builtin");

var PANORAMA_TITLE_CLASS = "dx-panorama-item-title";

QUnit.test("title should be rendered correctly by default", function(assert) {
    var widget = new Panorama($("<div>"), {
            items: [{}]
        }),
        $item = widget.itemElements().eq(0);

    var $title = $item.children("." + PANORAMA_TITLE_CLASS);
    assert.ok(!$title.length);
});

QUnit.test("title should be rendered correctly with value = true", function(assert) {
    var widget = new Panorama($("<div>"), {
            items: [{ title: "title" }]
        }),
        $item = widget.itemElements().eq(0);

    var $title = $item.children().eq(0);
    assert.ok($title.hasClass(PANORAMA_TITLE_CLASS), "title created correctly");
    assert.equal($title.text(), "title", "title has correct text");
});

QUnit.test("title should be rendered correctly after value changed", function(assert) {
    var widget = new Panorama($("<div>"), {
            items: [{ title: "title" }]
        }),
        $item = widget.itemElements().eq(0);

    widget.option("items[0].title", null);

    var $title = $item.children("." + PANORAMA_TITLE_CLASS);
    assert.ok(!$title.length);
});
