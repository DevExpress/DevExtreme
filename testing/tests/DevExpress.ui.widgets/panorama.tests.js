var $ = require("jquery"),
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    animation = require("ui/panorama").animation,
    config = require("core/config"),
    pointerMock = require("../../helpers/pointerMock.js");

require("common.css!");
require("ui/panorama");

QUnit.testStart(function() {
    var markup =
        '<style>\
            #animated {\
                position: absolute\
            }\
            \
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
        <div id="animated"></div>\
        <div id="panorama"></div>';

    $("#qunit-fixture").html(markup);
});

var PANORAMA_TITLE_CLASS = "dx-panorama-title",
    PANORAMA_GHOST_TITLE_CLASS = "dx-panorama-ghosttitle",

    PANORAMA_ITEM_CLASS = "dx-panorama-item",
    PANORAMA_GHOST_ITEM_CLASS = "dx-panorama-ghostitem",

    PANORAMA_ITEM_MARGIN_SCALE = 0.02,
    PANORAMA_ITEM_WIDTH_SCALE = 0.88,
    PANORAMA_TITLE_MARGIN_SCALE = 0.02,

    PANORAMA_TEST_WIDTH = 200;

var toSelector = function(cssClass) {
    return "." + cssClass;
};


var position = function($element) {
    return translator.locate($element).left;
};

var backgroundPosition = function($element) {
    return parseInt($element.css("backgroundPosition").split(" ")[0], 10);
    // TODO: use when jQuery solve bug in ie11
    // return parseInt($element.css("backgroundPositionX"), 10);
};

var moveBackground = function($element, position) {
    $element.css("backgroundPosition", position + "px 0%");
    // TODO: use when jQuery solve bug in firefox
    // $element.css("background-position-x", position);
};


var mockFxAnimateBackground = function(animations, type, output) {
    animations[type] = function($element, position, action) {
        output.push({
            $element: $element,
            type: type,
            start: backgroundPosition($element),
            end: position
        });

        moveBackground($element, position);

        if(action) {
            action();
        }
    };
};

var mockFxAnimateTitle = function(animations, type, output) {
    animations[type] = function($element, end, action) {
        var itemIndex = $("#panorama")
            .find(toSelector(PANORAMA_TITLE_CLASS) + ", " + toSelector(PANORAMA_GHOST_TITLE_CLASS))
            .index($element.get(0));
        output[itemIndex] = {
            $element: $element,
            type: type,
            start: position($element),
            end: end
        };

        translator.move($element, { left: end });

        if(action) {
            action();
        }
    };
};

var mockFxAnimateItem = function(animations, type, output) {
    animations[type] = function($element, end, action) {
        var itemIndex = $("#panorama")
            .find(toSelector(PANORAMA_ITEM_CLASS) + ", " + toSelector(PANORAMA_GHOST_ITEM_CLASS))
            .index($element.get(0));
        output[itemIndex] = {
            $element: $element,
            type: type,
            start: position($element),
            end: end
        };

        translator.move($element, { left: end });

        if(action) {
            action();
        }
    };
};

var animationCapturing = {
    start: function() {
        this._capturedAnimations = {
            bg: [],
            title: [],
            items: []
        };

        this._animation = $.extend({}, animation);

        mockFxAnimateBackground(animation, "backgroundMove", this._capturedAnimations.bg);
        mockFxAnimateTitle(animation, "titleMove", this._capturedAnimations.title);
        mockFxAnimateItem(animation, "itemMove", this._capturedAnimations.items);

        return this._capturedAnimations;
    },
    teardown: function() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.module("markup");

QUnit.test("background should set correctly in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        rtlEnabled: true
    });

    assert.equal(backgroundPosition($panorama), PANORAMA_TEST_WIDTH - scaledBackgroundWidth, "background image in correct position");
});

QUnit.test("title should be rendered with correct position", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama"
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS));

    assert.equal(position($title), PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE, "correct position");
});

QUnit.test("title should be rendered with correct position in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        rtlEnabled: true
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS));

    assert.roughEqual(position($title), PANORAMA_TEST_WIDTH - (PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE + $title.outerWidth()), 0.1, "correct position");
});

QUnit.test("item should have correct geometry", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" }
        ]
    });

    var $item = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0);

    assert.equal($item.outerWidth(), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_WIDTH_SCALE, "correct width");
    assert.equal($item.outerHeight(), 500, "correct width");
});


QUnit.module("item rendering");

QUnit.test("1 item should be rendered in items container", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" }
        ]
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal($items.length, 1, "items rendered");

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct item position");
});

QUnit.test("1 item should have correct position in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" }
        ],
        rtlEnabled: true
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE), "correct item position");
});

QUnit.test("2 items should be rendered in items container with correct geometry", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal($items.length, 2, "items rendered");

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE)), "correct second item position");
});

QUnit.test("2 items should have correct position in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE), "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE) * 2, "correct second item position");
});

QUnit.test(">3 items should be rendered in items container with correct geometry", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ]
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal($items.length, 3, "items rendered");

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE)), "correct second item position");
    assert.equal(position($items.eq(2)), PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "correct third item position");
});

QUnit.test(">3 items should have correct position in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ],
        rtlEnabled: true
    });

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE), "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE) * 2, "correct second item position");
    assert.equal(position($items.eq(2)), PANORAMA_TEST_WIDTH, "correct third item position");
});


QUnit.module("design mode", {
    beforeEach: function() {
        config({ designMode: true });

        fx.off = true;
    },
    afterEach: function() {
        config({ designMode: false });

        fx.off = false;
    }
});

QUnit.test("swipe should be rejected", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        selectedIndex: 0
    });

    var pointer = pointerMock($panorama);

    var startEvent = pointer.start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "swipe was rejected");

});


QUnit.module("option", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("disabled should reject swipe", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        selectedIndex: 0,
        disabled: true
    });

    var pointer = pointerMock($panorama);

    var startEvent = pointer.start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "swipe canceled in disabled widget");
});


QUnit.module("option change", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("background position should be set correctly", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            backgroundImage: image,
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    panorama.option("selectedIndex", 1);
    assert.ok(Math.abs(backgroundPosition($panorama) + backgroundStep(2)) <= 1, "background image in correct position");
});

QUnit.test("background position should be set correctly in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            backgroundImage: image,
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ],
            rtlEnabled: true
        }),
        panorama = $panorama.dxPanorama("instance");

    panorama.option("selectedIndex", 1);
    assert.ok(Math.abs(backgroundPosition($panorama) - (PANORAMA_TEST_WIDTH - scaledBackgroundWidth + backgroundStep(2))) <= 1, "background image in correct position");
});

QUnit.test("title should be rerendered with correct data", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama"
        }),
        panorama = $panorama.dxPanorama("instance");

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        $ghostTitle = $panorama.find(toSelector(PANORAMA_GHOST_TITLE_CLASS));

    panorama.option("title", "panorama");
    assert.equal($title.text(), "panorama", "correct title text rendered");
    assert.equal($ghostTitle.text(), "panorama", "correct ghost title text rendered");
});

QUnit.test("title should have correct position", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS));

    panorama.option("selectedIndex", 1);
    assert.ok(position($title) < PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE, "correct position");
});

QUnit.test("title should have correct position in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ],
            rtlEnabled: true
        }),
        panorama = $panorama.dxPanorama("instance");

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS));

    panorama.option("selectedIndex", 1);
    assert.ok(position($title) > PANORAMA_TEST_WIDTH - (PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE + $title.outerWidth()), "correct position");
});

QUnit.test("2 items should have correct geometry", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    panorama.option("selectedIndex", 1);
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item position");
    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + 2 * PANORAMA_ITEM_MARGIN_SCALE), "correct second item position");
});

QUnit.test("2 items should have correct geometry in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            items: [
                { text: "first item content" },
                { text: "second item content" }
            ],
            rtlEnabled: true
        }),
        panorama = $panorama.dxPanorama("instance");

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    panorama.option("selectedIndex", 1);
    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE) * 2, "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE), "correct second item position");
});

QUnit.test(">3 items should have correct geometry", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    panorama.option("selectedIndex", 1);
    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item position");
    assert.equal(position($items.eq(2)), PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + 2 * PANORAMA_ITEM_MARGIN_SCALE), "correct third item position");
});

QUnit.test(">3 items should have correct geometry in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ],
            rtlEnabled: true
        }),
        panorama = $panorama.dxPanorama("instance");

    var $items = $panorama.find(toSelector(PANORAMA_ITEM_CLASS));

    panorama.option("selectedIndex", 1);
    assert.equal(position($items.eq(0)), PANORAMA_TEST_WIDTH, "correct first item position");
    assert.equal(position($items.eq(1)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE), "correct second item position");
    assert.equal(position($items.eq(2)), PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_WIDTH_SCALE + PANORAMA_ITEM_MARGIN_SCALE) * 2, "correct third item position");
});


QUnit.module("animations", {
    beforeEach: function() {
        fx.off = true;

        this.$animated = $("#animated");
    },
    afterEach: function() {
        fx.off = false;

        this.$animated.css("opacity", 1);
        this.$animated.css("background-position-x", 0);
        translator.move(this.$animated, { left: 0 });
    }
});

QUnit.test("backgroundMove", function(assert) {
    animation.backgroundMove(this.$animated, 100);
    assert.strictEqual(backgroundPosition(this.$animated), 100, "animated to correct position");
});

QUnit.test("titleMove", function(assert) {
    animation.titleMove(this.$animated, 100);
    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
});

QUnit.test("itemMove", function(assert) {
    animation.itemMove(this.$animated, 100);
    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
});


QUnit.module("interaction via swipe", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("items should respond to swiping", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $item = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        itemStartPosition = position($item),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.01);
    assert.ok(position($item) > itemStartPosition, "item moves");

    pointer.swipeEnd(0);
    assert.equal(position($item), itemStartPosition, "item returns back");
});

QUnit.test("items should respond to swiping in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        itemStartPosition = position($item),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.01);
    assert.ok(position($item) < itemStartPosition, "item moves");

    pointer.swipeEnd(0);
    assert.equal(position($item), itemStartPosition, "item returns back");
});

QUnit.test("swipe should change selected item", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(panorama.option("selectedIndex"), 1, "item selected");

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(panorama.option("selectedIndex"), 0, "item selected");
});

QUnit.test("swipe should change selected item in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ],
            rtlEnabled: true
        }),
        panorama = $panorama.dxPanorama("instance");

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(panorama.option("selectedIndex"), 1, "item selected");

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(panorama.option("selectedIndex"), 0, "item selected");
});

QUnit.test("long fast left swipe should change selected index only by -1", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    panorama.option("selectedIndex", 2);
    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-2);
    assert.equal(panorama.option("selectedIndex"), 1, "index changed correctly");
});

QUnit.test("long fast right swipe should change selected index only by 1", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    panorama.option("selectedIndex", 1);

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(2);
    assert.equal(panorama.option("selectedIndex"), 2, "index changed correctly");
});

QUnit.module("interaction via click", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("selected index should not be changed by click on item", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    $(panorama.itemElements()).eq(1).trigger("dxclick");
    assert.equal(panorama.option("selectedIndex"), 0, "selected index not changed");
});


QUnit.module("interaction via swipe");

QUnit.test("previous animation should be stopped", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
            title: "my panorama",
            items: [
                { text: "first item content" },
                { text: "second item content" },
                { text: "third item content" }
            ]
        }),
        panorama = $panorama.dxPanorama("instance");

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2).swipeEnd(-1);
    pointer.start().swipeStart().swipe(-0.2).swipeEnd(-1);
    assert.equal(panorama.option("selectedIndex"), 1, "previous animation finished");
});


QUnit.module("background response on swipe", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

var image = {
    width: 89,
    height: 50
};
var scaledBackgroundWidth = 600 * image.width / image.height;
var backgroundStep = function(itemsCount) {
    return (scaledBackgroundWidth - PANORAMA_TEST_WIDTH * PANORAMA_ITEM_WIDTH_SCALE) / (itemsCount || 1);
};


QUnit.test("background should respond to swiping", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    assert.ok(backgroundPosition($panorama) > 0, "background moves");

    pointer.swipe(-0.4);
    assert.ok(backgroundPosition($panorama) < 0, "background moves");

    pointer.swipeEnd(0);
});

QUnit.test("background should respond to swiping in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    assert.ok(backgroundPosition($panorama) > PANORAMA_TEST_WIDTH - scaledBackgroundWidth, "background moves");

    pointer.swipe(-0.4);
    assert.ok(backgroundPosition($panorama) < PANORAMA_TEST_WIDTH - scaledBackgroundWidth, "background moves");

    pointer.swipeEnd(0);
});

QUnit.test("swipe should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.bg.length, 1, "animation present");
    assert.equal(this.capturedAnimations.bg[0].type, "backgroundMove", "correct animation present");
    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end + backgroundStep(2)) <= 1, "correct animation end position");
});

QUnit.test("swipe should cause correct background animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end - (PANORAMA_TEST_WIDTH - scaledBackgroundWidth + backgroundStep(2))) <= 1, "correct animation end position");
});

QUnit.test("swipe through left bound should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.bg.length, 1, "animation present");
    assert.equal(this.capturedAnimations.bg[0].type, "backgroundMove", "correct animation present");
    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end - (scaledBackgroundWidth - backgroundStep(2))) <= 1, "correct animation end position");
    assert.ok(Math.abs(backgroundPosition($panorama) + backgroundStep(2)) <= 1, "correct position after animation");
});

QUnit.test("swipe through right bound should cause correct background animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end - (PANORAMA_TEST_WIDTH - 2 * scaledBackgroundWidth + backgroundStep(2))) <= 1, "correct animation end position");
    assert.ok(Math.abs(backgroundPosition($panorama) - (PANORAMA_TEST_WIDTH - scaledBackgroundWidth + backgroundStep(2))) <= 1, "correct position after animation");
});

QUnit.test("swipe through right bound should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.bg.length, 1, "animation present");
    assert.equal(this.capturedAnimations.bg[0].type, "backgroundMove", "correct animation present");
    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end + scaledBackgroundWidth) <= 1, "correct animation end position");
    assert.strictEqual(backgroundPosition($panorama), 0, "correct position after animation");
});

QUnit.test("swipe through left bound should cause correct background animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.bg[0].end - PANORAMA_TEST_WIDTH) <= 1, "correct animation end position");
    assert.ok(Math.abs(backgroundPosition($panorama) - (PANORAMA_TEST_WIDTH - scaledBackgroundWidth)) <= 1, "correct position after animation");
});

QUnit.test("canceled swipe should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = backgroundPosition($panorama);
    pointer.swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.bg.length, 1, "animation present");
    assert.equal(this.capturedAnimations.bg[0].type, "backgroundMove", "correct animation present");
    assert.strictEqual(this.capturedAnimations.bg[0].start, offset, "correct animation start position");
    assert.strictEqual(this.capturedAnimations.bg[0].end, 0, "correct animation end position");
});


QUnit.module("title response on swipe", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

var titleStep = function($title, itemsCount) {
    var titleWidth = $title.outerWidth();

    return Math.max((titleWidth - PANORAMA_TEST_WIDTH) / (itemsCount || 1), titleWidth / (itemsCount || 1));
};

QUnit.test("title should respond to swiping", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE,
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    assert.ok(position($title) > titleStartPosition, "title moves");

    pointer.swipe(-0.4);
    assert.ok(position($title) < titleStartPosition, "title moves");

    pointer.swipeEnd();
});

QUnit.test("swipe should cause correct title animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE,
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($title);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.title.length, 1, "animation present");
    assert.strictEqual(this.capturedAnimations.title[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - (titleStartPosition - titleStep($title, 2))) <= 1, "correct animation end position");
});

QUnit.test("swipe should cause correct title animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH - (PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE + $title.outerWidth()),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($title);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.title[0].start, offset, "correct animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - (titleStartPosition + titleStep($title, 2))) <= 1, "correct animation end position");
});

QUnit.test("swipe through left bound should cause correct title animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE,
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($title);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.title.length, 2, "animation present");
    assert.roughEqual(this.capturedAnimations.title[0].start, -$title.outerWidth(), 0.1, "correct title animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - (titleStartPosition - titleStep($title, 2))) <= 1, "correct title animation end position");
    assert.strictEqual(this.capturedAnimations.title[1].start, offset, "correct ghost animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[1].end - PANORAMA_TEST_WIDTH) <= 1, "correct ghost animation end position");
});

QUnit.test("swipe through right bound should cause correct title animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH - (PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE + $title.outerWidth()),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($title);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.title[0].start, PANORAMA_TEST_WIDTH, "correct title animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - (titleStartPosition + titleStep($title, 2))) <= 1, "correct title animation end position");
    assert.strictEqual(this.capturedAnimations.title[1].start, offset, "correct ghost animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[1].end + (PANORAMA_TEST_WIDTH + $title.outerWidth())) <= 1, "correct ghost animation end position");
});

QUnit.test("swipe through right bound should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE,
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($title);
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.title.length, 2, "animation present");
    assert.strictEqual(this.capturedAnimations.title[0].start, PANORAMA_TEST_WIDTH, "correct title animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - titleStartPosition) <= 1, "correct title animation end position");
    assert.equal(Math.round(this.capturedAnimations.title[1].start), Math.round(offset), "correct ghost animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[1].end + (PANORAMA_TEST_WIDTH + $title.outerWidth())) <= 1, "correct ghost animation end position");
});

QUnit.test("swipe through left bound should cause correct background animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        backgroundImage: image,
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH - (PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE + $title.outerWidth()),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($title);
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.title.length, 2, "animation present");
    assert.roughEqual(this.capturedAnimations.title[0].start, -$title.outerWidth(), 0.01, "correct title animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[0].end - titleStartPosition) <= 1, "correct title animation end position");
    assert.equal(Math.round(this.capturedAnimations.title[1].start), Math.round(offset), "correct ghost animation start position");
    assert.ok(Math.abs(this.capturedAnimations.title[1].end - PANORAMA_TEST_WIDTH) <= 1, "correct ghost animation end position");
});

QUnit.test("canceled swipe should cause correct title animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $title = $panorama.find(toSelector(PANORAMA_TITLE_CLASS)),
        titleStartPosition = PANORAMA_TEST_WIDTH * PANORAMA_TITLE_MARGIN_SCALE,
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($title);
    pointer.swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.title.length, 1, "animation present");
    assert.equal(this.capturedAnimations.title[0].type, "titleMove", "correct animation present");
    assert.strictEqual(this.capturedAnimations.title[0].start, offset, "correct animation start position");
    assert.strictEqual(this.capturedAnimations.title[0].end, titleStartPosition, "correct animation end position");
});


QUnit.module("swiping 2 items", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

QUnit.test("swipe from left to right on first item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item0);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * (3 * PANORAMA_ITEM_MARGIN_SCALE + 2 * PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("swipe from left to right on first item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item0);
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
});

QUnit.test("canceled swipe from left to right on first item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item0);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, -PANORAMA_TEST_WIDTH * PANORAMA_ITEM_WIDTH_SCALE, "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("canceled swipe from left to right on first item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item0);
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset, "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - 3 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
});

QUnit.test("swipe from left to right on second item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item1);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * (3 * PANORAMA_ITEM_MARGIN_SCALE + 2 * PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("swipe from left to right on second item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item1);
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
});

QUnit.test("canceled swipe from left to right on second item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item1);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, -PANORAMA_TEST_WIDTH * PANORAMA_ITEM_WIDTH_SCALE, "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("canceled swipe from left to right on second item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($item1);
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset, "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - 3 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
});

QUnit.test("swipe from right to left on first item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($ghost);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset, "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("swipe from right to left on first item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($ghost);
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset, "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - 3 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
});

QUnit.test("canceled swipe from right to left on first item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($ghost);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * (3 * PANORAMA_ITEM_MARGIN_SCALE + 2 * PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("canceled swipe from right to left on first item should cause correct animation in RTL mode ", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($item0);
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");

    pointer.start().swipeStart().swipe(-0.1);
    offset = position($item0);
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position when offset is small");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position when offset is small");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position when offset is small");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position when offset is small");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position when offset is small");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct ghost item end position when offset is small");
    assert.equal($ghost.text(), "second item content", "ghost content correct");

});

QUnit.test("swipe from right to left on second item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($ghost);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset, "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("swipe from right to left on second item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item1);
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - 3 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
});

QUnit.test("canceled swipe from right to left on second item should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ]
    });

    var $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($ghost);
    assert.equal($ghost.css("opacity"), 1, "ghost appear");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * (3 * PANORAMA_ITEM_MARGIN_SCALE + 2 * PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item end position");
    assert.equal($ghost.text(), "second item content", "ghost content correct");
    assert.equal($ghost.css("opacity"), 0, "ghost disappear");
});

QUnit.test("canceled swipe from right to left on second item should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 1,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" }
        ],
        rtlEnabled: true
    });

    var $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        $ghost = $panorama.find(toSelector(PANORAMA_GHOST_ITEM_CLASS)),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item1);
    assert.equal($ghost.text(), "first item content", "ghost content correct");
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct ghost item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct ghost item end position");
    assert.equal($ghost.text(), "first item content", "ghost content correct");
});


QUnit.module("swiping >=3 items", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach: function() {
        animationCapturing.teardown();
    }
});

QUnit.test("swipe from right to left should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item0);
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, -PANORAMA_TEST_WIDTH * PANORAMA_ITEM_WIDTH_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item end position");
});

QUnit.test("swipe from left to right should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.1);
    var offset = position($item0);
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item end position");
});

QUnit.test("canceled swipe from right to left should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item0);
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.ok(!this.capturedAnimations.items[2], "animation not present for third element");
});

QUnit.test("canceled swipe from left to right should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.1);
    var offset = position($item0);
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.ok(!this.capturedAnimations.items[2], "animation not present for third element");
});

QUnit.test("swipe from left to right with 3 items should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.1);
    var offset = position($item0);
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct third item end position");

    assert.equal(position($item1), PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "second item moved after animation at start");
});

QUnit.test("swipe from right to left with 3 items should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $item1 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(1),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item0);
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item end position");

    assert.equal(position($item1), PANORAMA_TEST_WIDTH, "second item moved after animation at start");
});

QUnit.test("swipe from left to right with 4 items should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" },
            { text: "fourth item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $item2 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(2),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.1);
    var offset = position($item0);
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.ok(!this.capturedAnimations.items[2], "animation not present third fourth element");
    assert.equal(this.capturedAnimations.items[3].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct fourth item start position");
    assert.equal(this.capturedAnimations.items[3].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct fourth item end position");

    assert.equal(position($item2), PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "third item moved after animation at start");
});

QUnit.test("swipe from right to left with 4 items should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" },
            { text: "fourth item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        $item2 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(2),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item0);
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.ok(!this.capturedAnimations.items[2], "animation not present third fourth element");
    assert.equal(this.capturedAnimations.items[3].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct fourth item start position");
    assert.equal(this.capturedAnimations.items[3].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct fourth item end position");

    assert.equal(position($item2), PANORAMA_TEST_WIDTH, "third item moved after animation at start");
});

QUnit.test("canceled swipe from left to right should cause correct animation", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ]
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(0.1);
    var offset = position($item0);
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH * PANORAMA_ITEM_MARGIN_SCALE, "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH * (2 * PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH * -PANORAMA_ITEM_WIDTH_SCALE, "correct third item end position");
});

QUnit.test("canceled swipe from right to left should cause correct animation in RTL mode", function(assert) {
    var $panorama = $("#panorama").dxPanorama({
        selectedIndex: 0,
        title: "my panorama",
        items: [
            { text: "first item content" },
            { text: "second item content" },
            { text: "third item content" }
        ],
        rtlEnabled: true
    });

    var $item0 = $panorama.find(toSelector(PANORAMA_ITEM_CLASS)).eq(0),
        pointer = pointerMock($panorama);

    pointer.start().swipeStart().swipe(-0.1);
    var offset = position($item0);
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations.items[0].start, offset, "correct first item start position");
    assert.equal(this.capturedAnimations.items[0].end, PANORAMA_TEST_WIDTH - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct first item end position");
    assert.equal(this.capturedAnimations.items[1].start, offset - PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item start position");
    assert.equal(this.capturedAnimations.items[1].end, PANORAMA_TEST_WIDTH - 2 * PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct second item end position");
    assert.equal(this.capturedAnimations.items[2].start, offset + PANORAMA_TEST_WIDTH * (PANORAMA_ITEM_MARGIN_SCALE + PANORAMA_ITEM_WIDTH_SCALE), "correct third item start position");
    assert.equal(this.capturedAnimations.items[2].end, PANORAMA_TEST_WIDTH, "correct third item end position");
});
