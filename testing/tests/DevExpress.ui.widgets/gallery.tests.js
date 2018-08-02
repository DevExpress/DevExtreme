var $ = require("jquery"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    fx = require("animation/fx"),
    animationFrame = require("animation/frame"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("ui/gallery");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<style>\
            .dx-gallery {\
                width: 400px;\
            }\
            .dx-gallery-item {\
                width: 400px;\
                height: 400px;\
            }\
            \
            #galleryWithItemPaddings,\
            #galleryWithBorderBox\
            {\
                width: 400px;\
                height: 400px;\
                display: inline-block;\
                border: solid 1px black;\
            }\
            \
            #galleryWithItemPaddings .dx-gallery-item\
            {\
                width: 200px;\
                height: 200px;\
                padding: 20px;\
            }\
            \
            #galleryWithItemPaddings .dx-gallery-item > div\
            {\
                width: 100%;\
                height: 100%;\
            }\
            \
            #galleryWithBorderBox .dx-gallery-item\
            {\
                -webkit-box-sizing: border-box;\
                    -moz-box-sizing: border-box;\
                        box-sizing: border-box;\
            }\
            \
            #galleryWithBorderBox .dx-gallery-item\
            {\
                width: 100%;\
                height: 100%;\
                padding: 20px;\
            }\
            \
            #galleryWithBorderBox .dx-gallery-item > div\
            {\
                width: 100%;\
                height: 100%;\
            }\
            \
            #widthRootStyle .dx-gallery-item {\
                width: 100%;\
                height: 100%;\
            }\
        </style>\
        \
        <div id="gallerySimple"></div>\
        \
        <div id="galleryWithItemPaddings"></div>\
        \
        <div id="galleryWithBorderBox"></div>\
        \
        <div id="galleryWithTmpl">\
            <div data-options="dxTemplate : { name: \'item\' } " >\
                <div>0</div>\
            </div>\
        </div>\
        \
        <div id="galleryWithoutSize"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $("#qunit-fixture").html(markup);
});

var GALLERY_CLASS = "dx-gallery",
    GALLERY_WRAPPER_CLASS = GALLERY_CLASS + "-wrapper",
    GALLERY_ITEM_CONTAINER_CLASS = GALLERY_CLASS + "-container",
    GALLERY_ITEM_CLASS = GALLERY_CLASS + "-item",
    GALLERY_INVISIBLE_ITEM_CLASS = GALLERY_CLASS + "-item-invisible",
    GALLERY_INDICATOR_CLASS = "dx-gallery-indicator",
    GALLERY_LOOP_ITEM_CLASS = GALLERY_CLASS + "-item-loop",
    INDICATOR_ITEM_CLASS = GALLERY_CLASS + "-indicator-item",
    GALLERY_SELECTED_ITEM_CLASS = INDICATOR_ITEM_CLASS + "-selected",
    NAV_PREV_BUTTON_CLASS = "dx-gallery-nav-button-prev",
    NAV_NEXT_BUTTON_CLASS = "dx-gallery-nav-button-next",
    DX_WIDGET_CLASS = "dx-widget",

    ANIMATION_WAIT_TIME = 500,
    ITEM_WIDTH = 400;

var calculateItemPosition = function($item, $gallery) {
    var $container = $gallery.find("." + GALLERY_ITEM_CONTAINER_CLASS),
        containerPosition = $container.position(),
        itemPosition = $item.position();

    return Math.round(itemPosition.left + containerPosition.left + parseFloat($item.css("marginLeft")));
};

QUnit.module("behavior", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple");
        this.mouse = pointerMock(this.$element);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("click triggers user handler", function(assert) {
    var clicked = false,
        clickEventArgs;

    var $gallery = this.$element.dxGallery({
        onItemClick: function(e) {
            clickEventArgs = e;
            clicked = true;
        },
        items: [ "0" ]
    });

    assert.ok(!clicked);
    $gallery.find("." + GALLERY_ITEM_CLASS).eq(0).trigger("dxclick");
    assert.ok(clicked);

    assert.ok(clickEventArgs.event);
    assert.equal(clickEventArgs.itemData, $gallery.dxGallery("instance").option("items")[0]);
});

QUnit.test("onContentReady fired after widget completely render", function(assert) {
    this.$element.dxGallery({
        indicatorEnabled: true,
        onContentReady: function(e) {
            assert.ok($(e.element).find("." + GALLERY_INDICATOR_CLASS).length);
        },
        items: ["0"]
    });
});

QUnit.test("click on item doesn't cause scroll to item", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            loop: true,
            width: 500
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    $galleryItems.eq(1).trigger("dxpointerdown");
    this.clock.tick();

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
});

QUnit.test("click on indicator item change selected item", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            loop: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    $gallery.find("." + INDICATOR_ITEM_CLASS).eq(3).trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(3), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -1200);
});

QUnit.test("change selectedIndex option cause animation", function(assert) {
    var origFX = fx.animate;
    var animated = false;
    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $gallery = this.$element.dxGallery({
                items: [0, 1, 2, 3]
            }),
            gallery = $gallery.dxGallery("instance");

        gallery.option("selectedIndex", 1);

        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("click on indicator item should works after showIndicator option changing (T179646)", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            showIndicator: true
        }),
        gallery = $gallery.dxGallery("instance");

    gallery.option("showIndicator", false);
    gallery.option("showIndicator", true);
    $gallery.find("." + INDICATOR_ITEM_CLASS).eq(3).trigger("dxclick");

    assert.equal(gallery.option("selectedIndex"), 3);
});

QUnit.test("indicator selected item should be correct after showIndicator option changing (T179897)", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            showIndicator: false
        }),
        gallery = $gallery.dxGallery("instance");

    gallery.option("showIndicator", true);
    assert.equal($gallery.find("." + GALLERY_SELECTED_ITEM_CLASS).index(), 0);
});

QUnit.test("B232221 -  backward direction behavior has bugs", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({ items: [1, 2, 3, 4], loop: true }),
        instance = $gallery.dxGallery("instance"),
        items = $gallery.find("." + GALLERY_ITEM_CLASS),
        itemLeft = function(i) { return calculateItemPosition(items.eq(i), $("#gallerySimple")); };

    instance.prevItem();
    assert.equal(itemLeft(3), 0, "container was moved back");

    instance.prevItem();
    assert.equal(itemLeft(2), 0);

    instance.prevItem();
    assert.equal(itemLeft(1), 0);

    instance.prevItem();
    assert.equal(itemLeft(0), 0);
});

QUnit.test("change selected item by swipe change indicator selected item", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3]
        }),
        $indicatorItems = function() {
            return $gallery.find("." + INDICATOR_ITEM_CLASS);
        },
        mouse = this.mouse;


    assert.ok($indicatorItems().eq(0).hasClass(GALLERY_SELECTED_ITEM_CLASS));

    mouse.start().swipeStart().swipeEnd(-1);

    assert.ok(!$indicatorItems().eq(0).hasClass(GALLERY_SELECTED_ITEM_CLASS));
    assert.ok($indicatorItems().eq(1).hasClass(GALLERY_SELECTED_ITEM_CLASS));
});

QUnit.test("handle swipe add class dx-gallery-active", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3]
        }),

        mouse = this.mouse;
    assert.equal($gallery.hasClass("dx-gallery-active"), false);

    mouse
        .start()
        .down()
        .move(-300);
    assert.equal($gallery.hasClass("dx-gallery-active"), true);

    mouse.up();
    assert.equal($gallery.hasClass("dx-gallery-active"), false);
});

QUnit.test("transition from first item to last don't scroll content", function(assert) {
    var origFX = fx.animate,
        left;

    fx.animate = function($element, config) {
        left = config.to.left;
    };

    try {
        var $gallery = this.$element.dxGallery({
                items: [0, 1, 2, 3],
                loop: true,
                selectedIndex: 0
            }),
            galleryInstance = $gallery.dxGallery("instance");

        galleryInstance.prevItem();

        assert.equal(left, 400, "transition works correctly");

        galleryInstance.prevItem();

        assert.equal(left, -800, "transition works correctly, content was moved");

    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("transition from last item to first don't scroll content", function(assert) {
    var origFX = fx.animate,
        left;

    fx.animate = function($element, config) {
        left = config.to.left;
    };

    try {
        var $gallery = this.$element.dxGallery({
                items: [0, 1, 2, 3],
                loop: true,
                selectedIndex: 3
            }),
            galleryInstance = $gallery.dxGallery("instance");

        galleryInstance.nextItem();

        assert.equal(left, -1600, "transition works correctly");

        galleryInstance.nextItem();

        assert.equal(left, -400, "transition works correctly, content was moved");

    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("animationEnabled option test", function(assert) {
    fx.off = false;

    var origFX = fx.animate,
        animated = false;

    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $gallery = this.$element.dxGallery({
                items: [0, 1, 2, 3],
                animationEnabled: false
            }),
            galleryInstance = $gallery.dxGallery("instance");

        galleryInstance.option("selectedIndex", 1);

        assert.equal(animated, false, "animation was not present");

        galleryInstance.option("animationEnabled", true);
        galleryInstance.option("selectedIndex", 2);

        assert.equal(animated, true, "animation present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("create duplicate items, loop=true", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        loop: true
    });

    var $loopItems = $gallery.find("." + GALLERY_LOOP_ITEM_CLASS);
    assert.equal($loopItems.length, 2);
});

QUnit.test("duplicate items is not rendered when loop=false", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        loop: false
    });

    var $loopItems = $gallery.find("." + GALLERY_LOOP_ITEM_CLASS);
    assert.equal($loopItems.length, 0);
});

QUnit.test("duplicate items position", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        loop: true
    });

    var $loopItems = $gallery.find("." + GALLERY_LOOP_ITEM_CLASS);
    assert.equal(calculateItemPosition($loopItems.eq(0), $gallery), 1600);
    assert.equal(calculateItemPosition($loopItems.eq(1), $gallery), -400);
});

QUnit.test("duplicate items are visible for loop gallery", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        loop: true
    });

    var $loopItems = $gallery.find("." + GALLERY_LOOP_ITEM_CLASS);
    assert.equal($loopItems.length, 2);
    assert.ok($loopItems.is(":visible"));
});

QUnit.test("loop works correctly", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ],
            loop: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.ok($gallery.hasClass("dx-gallery-loop"));
    assert.equal($galleryItems.eq(0).position().left, 0);

    mouse.start().swipeStart().swipeEnd(1);

    assert.equal(calculateItemPosition($galleryItems.last(), $gallery), -1600);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -1200);
});

QUnit.test("loop - move to long distances (more then gallery length)", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ],
            loop: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);

    mouse.start().swipeStart().swipeEnd(13);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -1200);

    mouse.start().swipeStart().swipeEnd(-13);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
});

QUnit.test("non correct loop behavior", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ]
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.equal($galleryItems.eq(0).position().left, 0);

    mouse.start().swipeStart().swipeEnd(1);
    assert.equal($galleryItems.eq(0).position().left, 0);
});

QUnit.test("swipe right, wrong item position", function(assert) {
    var $gallery = $("#gallerySimple")
        .dxGallery({
            items: [0, 1, 2, 3],
            loop: true,
            initialItemWidth: 200
        });

    var mouse = pointerMock($gallery),
        galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    mouse.start().swipeStart().swipe(0.5);

    assert.equal(calculateItemPosition(galleryItems.eq(0), $gallery), 100);
    assert.equal(calculateItemPosition(galleryItems.eq(1), $gallery), 300);
    assert.equal(calculateItemPosition(galleryItems.eq(2), $gallery), 500);
    assert.equal(calculateItemPosition(galleryItems.eq(3), $gallery), 700);

    mouse.up();
});

QUnit.test("slideshowDelay", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ],
            slideshowDelay: 25
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    this.clock.tick(37);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -400);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 0);
});

QUnit.test("slideshow should immediately terminate after setting 'slideShowDelay' to 0", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            slideshowDelay: 25
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        gallery = $gallery.dxGallery("instance");

    this.clock.tick(5);
    gallery.option("slideshowDelay", 0);
    this.clock.tick(30);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0, "item position has not changed");
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 400, "item position has not changed");
});

QUnit.test("swipe gesture blocks slideshow", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ],
            slideshowDelay: 25
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    mouse.start().swipeStart().swipe(0.1);

    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.ok($galleryItems.eq(0).position().left >= 0);
    mouse.swipeEnd(1);
});

QUnit.test("swipe gesture after another swipe is not rejected (B238033)", function(assert) {
    assert.expect(1);

    fx.off = false;

    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3]
        }),
        mouse = this.mouse;

    mouse.start().swipeStart().swipeEnd(-1);
    mouse.start().swipeStart().swipeEnd(-1);

    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.equal($gallery.dxGallery("instance").option("selectedIndex"), 2);
});

QUnit.test("slideshow should work correctly after dimension change", function(assert) {
    fx.off = false;

    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        selectedIndex: 0,
        slideshowDelay: 500,
        animationDuration: 5000,
        width: 500
    });

    this.clock.tick(2500);
    resizeCallbacks.fire();

    this.clock.tick(5000);

    assert.equal($gallery.dxGallery('option', 'selectedIndex'), 2);
});

QUnit.test("disable user interaction", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [ 0, 1, 2, 3 ],
            indicatorEnabled: false,
            swipeEnabled: false
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    mouse.start().swipeStart().swipeEnd(-1);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
});

QUnit.test("disabled", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        indicatorEnabled: false,
        disabled: true
    });

    var $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    mouse.start().swipeStart().swipeEnd(-1);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
});

QUnit.test("changing selected index while animation should work correctly", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3],
            selectedIndex: 0
        }),
        gallery = $gallery.dxGallery("instance"),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    pointerMock($gallery).start().swipeStart().swipeEnd(-1);
    this.clock.tick(ANIMATION_WAIT_TIME);
    gallery.option("selectedIndex", 2);
    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), 0);
});

QUnit.test("gallery with two items works correctly when loop is enabled", function(assert) {

    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1],
            selectedIndex: 0,
            loop: true
        }),
        instance = $gallery.dxGallery("instance");

    var $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    instance.nextItem();
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 0, "going to next item is correct");

    instance.nextItem();
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 400, "going to next ghost item is correct");

    instance.option("selectedIndex", 0);

    instance.prevItem();
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -400, "going to prev ghost item is correct");

    instance.prevItem();
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0, "going to prev item is correct");
});

QUnit.test("navigation buttons must be hidden on last slides", function(assert) {
    var $gallery = this.$element.dxGallery({
        items: [0, 1, 2, 3],
        showNavButtons: true,
        loop: false
    });

    var instance = $gallery.dxGallery("instance"),
        prevNavButton = $gallery.find("." + NAV_PREV_BUTTON_CLASS),
        nextNavButton = $gallery.find("." + NAV_NEXT_BUTTON_CLASS);

    assert.equal(prevNavButton.css("display"), "none");
    assert.notEqual(nextNavButton.css("display"), "none");

    instance.option("selectedIndex", 3);
    assert.notEqual(prevNavButton.css("display"), "none");
    assert.equal(nextNavButton.css("display"), "none");

    instance.option("loop", true);
    assert.notEqual(prevNavButton.css("display"), "none");
    assert.notEqual(nextNavButton.css("display"), "none");

    instance.option("selectedIndex", 0);
    assert.notEqual(prevNavButton.css("display"), "none");
    assert.notEqual(nextNavButton.css("display"), "none");
});

QUnit.test("navigation buttons must be hidden when no items", function(assert) {
    var $gallery = this.$element.dxGallery({
        dataSource: [],
        showNavButtons: true,
        loop: true
    });

    var instance = $gallery.dxGallery("instance"),
        prevNavButton = $gallery.find("." + NAV_PREV_BUTTON_CLASS),
        nextNavButton = $gallery.find("." + NAV_NEXT_BUTTON_CLASS);

    assert.equal(prevNavButton.css("display"), "none");
    assert.equal(nextNavButton.css("display"), "none");

    instance.option("loop", false);
    instance.option("loop", true);
    assert.equal(prevNavButton.css("display"), "none");
    assert.equal(nextNavButton.css("display"), "none");
});

QUnit.test("no data text should be rendered into wrapper", function(assert) {
    var $gallery = this.$element.dxGallery({
            dataSource: [1, 2],
            selectedIndex: 1
        }),
        instance = $gallery.dxGallery("instance");

    instance.option("dataSource", []);
    assert.equal($gallery.find("." + GALLERY_WRAPPER_CLASS).children(".dx-empty-message").length, 1);
});

QUnit.test("gallery should not hang when initialItemWidth is greater than widget width (T417445)", function(assert) {
    var $gallery = this.$element.dxGallery({
            dataSource: [1, 2],
            width: 300,
            visible: false,
            showIndicator: false,
            initialItemWidth: 350
        }),
        instance = $gallery.dxGallery("instance");

    assert.equal(instance._pagesCount(), 2, "pages count is correct");
});


QUnit.module("render", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("default", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3],
            showNavButtons: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 400);
    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), 800);
    assert.equal(calculateItemPosition($galleryItems.eq(3), $gallery), 1200);
    assert.equal($gallery.find("." + NAV_NEXT_BUTTON_CLASS).length, 1);
    assert.equal($gallery.find("." + NAV_PREV_BUTTON_CLASS).length, 1);
    assert.equal($gallery.find("." + NAV_NEXT_BUTTON_CLASS).hasClass(DX_WIDGET_CLASS), true);
    assert.equal($gallery.find("." + NAV_PREV_BUTTON_CLASS).hasClass(DX_WIDGET_CLASS), true);
});

QUnit.test("render with auto height", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        items: [0, 1, 2, 3],
        height: "auto"
    });

    assert.ok($gallery.height() > 0, "Gallery has non-zero height");
});

QUnit.test("selectedIndex option on init", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3],
            showNavButtons: true,
            selectedIndex: 2
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), 0);
});

QUnit.test("B237131: gallery is not rendered if width and height are not set", function(assert) {
    var $gallery = $("#galleryWithoutSize").dxGallery({ items: [1, 2, 3, 4], loop: true }),
        instance = $gallery.dxGallery("instance");

    assert.equal(instance.option("height"), instance._itemElements().first().outerHeight(), "if widget height is undefined, that we use the item height");
});

QUnit.test("B230374 - error in our simulator when we are using items from viewmodel", function(assert) {
    assert.expect(0);
    var $gallery = $("#gallerySimple").dxGallery();
    pointerMock($gallery).start().swipeStart().swipe(0.5).swipeEnd(1);
});

QUnit.test("B234431 - displays only first 20 items when bound to array", function(assert) {
    executeAsyncMock.setup();
    try {
        var ITEMS_COUNT = 20 + 10,
            items = [];

        for(var i = 0; i < 30; i++) {
            items.push(i + ".png");
        }

        var $gallery = $("#gallerySimple").dxGallery({ dataSource: new ArrayStore(items) });

        assert.equal($gallery.find("." + GALLERY_ITEM_CLASS).length, ITEMS_COUNT, "30 items are rendered");
    } finally {
        executeAsyncMock.teardown();
    }
});

QUnit.test("navigation buttons duplication (B233450)", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({ showNavButtons: true }),
        instance = $gallery.dxGallery("instance");

    instance._refresh();

    assert.equal($gallery.find("." + NAV_PREV_BUTTON_CLASS).length, 1);
    assert.equal($gallery.find("." + NAV_NEXT_BUTTON_CLASS).length, 1);
});

QUnit.test("item template", function(assert) {
    var $gallery = $("#galleryWithTmpl").dxGallery({ items: [ 1, 2, 3 ] }),
        items = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(items.length, 3, "3 items were rendered");
    assert.equal($gallery.text().replace(/\s+/g, ""), "000");
});

var checkItemPositionForCurrentIndex = function(items, currentIndex, $gallery, assert) {
    var len = items.length - 2;
    items.each(function(index) {
        if(index >= len) return;
        assert.equal(calculateItemPosition($(this), $gallery), (-currentIndex + index) * $(this).outerWidth());
    });
};

QUnit.test("paddings support", function(assert) {
    var $element = $("#galleryWithItemPaddings").dxGallery({ items: [1, 2, 3] }),
        itemsElements = $element.find("." + GALLERY_ITEM_CLASS);

    assert.expect(2);
    checkItemPositionForCurrentIndex(itemsElements, 0, $("#galleryWithItemPaddings"), assert);

    var mouse = pointerMock($element);
    mouse.start().swipeStart().swipe(-0.5).swipeEnd(-1);

    checkItemPositionForCurrentIndex(itemsElements, 1, $("#galleryWithItemPaddings"), assert);
});

QUnit.test("box-sizing support", function(assert) {
    var $element = $("#galleryWithBorderBox").dxGallery({ items: [1, 2, 3] }),
        itemsElements = $element.find("." + GALLERY_ITEM_CLASS);

    assert.expect(2);
    checkItemPositionForCurrentIndex(itemsElements, 0, $("#galleryWithBorderBox"), assert);

    var mouse = pointerMock($element);
    mouse.start().swipeStart().swipe(-0.5).swipeEnd(-1);

    checkItemPositionForCurrentIndex(itemsElements, 1, $("#galleryWithBorderBox"), assert);
});

QUnit.test("items changed", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2],
            loop: true
        }),
        instance = $gallery.dxGallery("instance"),
        items = function() {
            return $gallery.find("." + GALLERY_ITEM_CLASS);
        };

    assert.equal(items().length, 5, "3 items + 2 duplicates");

    instance.option("items", [1, 2]);
    assert.equal(items().length, 4, "2 items + 2 duplicates");

});

QUnit.test("indicator change", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({ items: [0, 1] }),
        instance = $gallery.dxGallery("instance");

    var indicators = function() {
        return $gallery.find("." + INDICATOR_ITEM_CLASS);
    };

    assert.equal(indicators().length, 2);

    instance.option("items", [0, 1, 2]);
    assert.equal(indicators().length, 3);

    instance.option("showIndicator", false);
    assert.equal(indicators().length, 0);
});

QUnit.test("showNavButtons", function(assert) {
    var $element = $("#gallerySimple").dxGallery({
            items: [1, 2, 3],
            showNavButtons: true
        }),
        instance = $element.dxGallery("instance"),
        $wrapper = instance._$wrapper;

    assert.equal($wrapper.children("." + NAV_PREV_BUTTON_CLASS).length, 1);
    assert.equal($wrapper.children("." + NAV_NEXT_BUTTON_CLASS).length, 1);

    instance.option("showNavButtons", false);

    assert.equal($wrapper.children("." + NAV_PREV_BUTTON_CLASS).length, 0);
    assert.equal($wrapper.children("." + NAV_NEXT_BUTTON_CLASS).length, 0);

});

QUnit.test("showNavButtons with 2 items", function(assert) {
    var $element = $("#gallerySimple").dxGallery({
            items: [1, 2],
            showNavButtons: true
        }),
        instance = $element.dxGallery("instance"),
        $prevNavButton = $element.find("." + NAV_PREV_BUTTON_CLASS),
        $nextNavButton = $element.find("." + NAV_NEXT_BUTTON_CLASS);

    instance.nextItem();
    assert.equal($prevNavButton.css("display"), "block");
    assert.equal($nextNavButton.css("display"), "none");

    instance.prevItem();
    assert.equal($prevNavButton.css("display"), "none");
    assert.equal($nextNavButton.css("display"), "block");
});

QUnit.test("'wrapAround' option test when 'stretchImages' = true", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [1, 2, 3, 4],
            wrapAround: true,
            loop: true,
            width: 100,
            stretchImages: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        instance = $gallery.dxGallery("instance");

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 25);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 75);
    assert.equal(calculateItemPosition($galleryItems.last(), $gallery), -25);

    instance.option("wrapAround", false);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 100);
    assert.equal(calculateItemPosition($galleryItems.last(), $gallery), -100);
});

QUnit.test("'wrapAround' option test when 'stretchImages' = false", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [1, 2, 3, 4],
            wrapAround: true,
            loop: true,
            width: 400,
            initialItemWidth: 180,
            stretchImages: false
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 65);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 195);
    assert.equal(calculateItemPosition($galleryItems.last(), $gallery), -195);
});

QUnit.test("'wrapAround' option changed test", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [1, 2, 3, 4],
            wrapAround: true,
            width: 200,
            stretchImages: false,
            selectedIndex: 2
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        instance = $gallery.dxGallery("instance");

    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), 50);

    instance.option("wrapAround", false);

    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), 0);
});

QUnit.module("options changed callbacks", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple").dxGallery({ items: [0, 1, 2] });
        this.instance = this.$element.dxGallery("instance");

    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
});

var getImageSources = function($element) {
    return $element.find("img").map(function() {
        return $(this).attr("src");
    }).get().join("");
};

QUnit.test("items", function(assert) {
    this.instance.option("items", [3, 4, 5]);
    assert.equal(getImageSources(this.$element), "345");
});

QUnit.test("dataSource", function(assert) {
    executeAsyncMock.setup();

    this.instance.option("dataSource", [3, 4, 5]);
    assert.equal(getImageSources(this.$element), "345");

    this.instance.option("dataSource", {
        store: new ArrayStore([5, 6]),
        map: function(item) {
            return item * 2;
        }
    });
    assert.equal(getImageSources(this.$element), "1012");

    var store = new ArrayStore([11, 22]);
    this.instance.option("dataSource", new DataSource(store));
    assert.equal(getImageSources(this.$element), "1122");
});

QUnit.test("selectedIndex", function(assert) {
    var actionFired = 0;
    this.instance.option("onSelectionChanged", function() {
        actionFired++;
    });

    this.instance.option("selectedIndex", 1);
    assert.equal(actionFired, 1, "select action fired");

    var items = this.$element.find("." + GALLERY_ITEM_CLASS);
    assert.equal(calculateItemPosition(items.eq(1), this.$element), 0);
});

QUnit.test("loop - ghost items used correctly", function(assert) {
    var items = this.$element.find("." + GALLERY_ITEM_CLASS);

    this.instance.option("loop", true);
    this.instance.option("selectedIndex", 2);
    this.instance.nextItem();

    items = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition(items.eq(3), this.$element), 1200);

    this.instance.option("loop", false);
    this.instance.option("selectedIndex", 2);
    this.instance.nextItem();

    items = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition(items.eq(0), this.$element), -800);
});

QUnit.test("showNavButtons", function(assert) {
    this.instance.option("showNavButtons", true);
    assert.equal(this.$element.find("." + NAV_PREV_BUTTON_CLASS).length, 1);
    assert.equal(this.$element.find("." + NAV_NEXT_BUTTON_CLASS).length, 1);

    this.instance.option("showNavButtons", false);
    assert.equal(this.$element.find("." + NAV_PREV_BUTTON_CLASS).length, 0);
    assert.equal(this.$element.find("." + NAV_NEXT_BUTTON_CLASS).length, 0);
});

QUnit.test("showIndicator", function(assert) {
    this.instance.option("showIndicator", true);
    assert.equal(this.$element.find("." + INDICATOR_ITEM_CLASS).length, 3);

    this.instance.option("showIndicator", false);
    assert.equal(this.$element.find("." + INDICATOR_ITEM_CLASS).length, 0);
});

QUnit.test("slideshowDelay", function(assert) {
    var instance = this.instance;

    this.instance.option("slideshowDelay", 12);
    assert.equal(instance.option("selectedIndex"), 0, "at start, when we set slideshow delay selected index = 0");

    this.clock.tick(12);
    assert.equal(instance.option("selectedIndex"), 1, "after slideshow delay selected index = 1");

    instance.option("slideshowDelay", 32);
    this.clock.tick(12);
    assert.equal(instance.option("selectedIndex"), 1, "we change slideshow delete to 32ms and wait 12ms, slide do not change");

    this.clock.tick(20);
    assert.equal(instance.option("selectedIndex"), 2, "we wait 20ms and selected index = 2");
});

QUnit.test("userInteraction", function(assert) {
    this.instance.option("swipeEnabled", true);
    this.instance.option("indicatorEnabled", true);

    var mouse = pointerMock(this.$element).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(calculateItemPosition(this.$element.find("." + GALLERY_ITEM_CLASS).eq(0), this.$element), -400);

    this.instance.option("swipeEnabled", false);
    this.instance.option("indicatorEnabled", false);
    mouse.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(calculateItemPosition(this.$element.find("." + GALLERY_ITEM_CLASS).eq(0), this.$element), -400);
});

QUnit.module("items visibility", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple").dxGallery({ items: [0, 1, 2, 3, 4], width: 500, showNavButtons: true });
        this.instance = this.$element.dxGallery("instance");
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("invisible items should have correct class", function(assert) {
    var instance = this.instance;

    instance.option("selectedIndex", 2);

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    $.each($galleryItems, function(index, $item) {
        if(index !== instance.option("selectedIndex")) {
            assert.ok($($item).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "item has invisible class");
        } else {
            assert.notOk($($item).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "selected item has not invisible class");
        }
    });
});

QUnit.test("all items should be visible on swipeStart", function(assert) {
    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    var mouse = pointerMock(this.$element);

    mouse.start().swipeStart();

    $.each($galleryItems, function(index, $item) {
        assert.notOk($($item).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "swiped item has not invisible class");
    });
});


QUnit.test("all items should be visible after click on a button", function(assert) {
    var $nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS),
        instance = this.instance;

    var releaseItems = sinon.stub(instance, "_releaseInvisibleItems"),
        renderItemsVisibility = sinon.stub(instance, "_renderItemVisibility");

    $nextNavButton.trigger("dxclick");

    assert.equal(releaseItems.callCount, 1);
    assert.equal(renderItemsVisibility.callCount, 1);
});

QUnit.test("selected item shouldn't have invisible class", function(assert) {
    this.instance.option("selectedIndex", 2);

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    this.instance.goToItem(1);
    assert.notOk($galleryItems.eq(1).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "selected item has not invisible class");
    assert.ok($galleryItems.eq(2).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "previously selected item has not invisible class");

    this.instance.goToItem(3);
    assert.notOk($galleryItems.eq(3).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "selected item has not invisible class");
    assert.ok($galleryItems.eq(1).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "previously selected item has not invisible class");
});

QUnit.test("there are no invisible items if items count per page > 1", function(assert) {
    this.instance.option({
        width: 1000,
        initialItemWidth: undefined,
        items: [0, 1, 2]
    });
    this.instance.option("initialItemWidth", 100);
    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    $.each($galleryItems, function(index, $item) {
        assert.notOk($($item).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "item has not invisible class");
    });
});

QUnit.test("there are no invisible items if wrapAround=true", function(assert) {
    this.instance.option({
        width: 1000,
        wrapAround: false,
        items: [0, 1, 2]
    });

    this.instance.option("wrapAround", true);
    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    $.each($galleryItems, function(index, $item) {
        assert.notOk($($item).hasClass(GALLERY_INVISIBLE_ITEM_CLASS), "item has not invisible class");
    });
});

QUnit.module("responsiveness", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple").dxGallery({ items: [0, 1, 2, 3, 4] });
        this.instance = this.$element.dxGallery("instance");
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("there is only one image on page if initialItemWith option was not set", function(assert) {
    this.instance.option("width", 500);

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.strictEqual(this.instance.option("initialItemWidth"), undefined, "'initialItemWidth' option is undefined on init");

    var secondItemPosition = calculateItemPosition($galleryItems.eq(1), this.$element);

    assert.equal(secondItemPosition, 500, "position of second item is correct");
    assert.equal($galleryItems.eq(0).width(), 500, "actual item width is correct");
});

QUnit.test("there is only real images on first page, if gallery is very long, stretchImages = false", function(assert) {
    this.instance.option({
        width: 1000,
        initialItemWidth: 100,
        items: [0, 1, 2]
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 175, "position of first item is correct");
    assert.equal($galleryItems.eq(0).width(), 100, "actual item width is correct");

    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 725, "position of last item is correct");
    assert.equal($galleryItems.eq(0).width(), 100, "actual item width is correct");
});

QUnit.test("there is only real images on first page, if gallery is very long, stretchImages = true", function(assert) {
    this.instance.option({
        width: 900,
        initialItemWidth: 100,
        items: [0, 1, 2],
        stretchImages: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of first item is correct");
    assert.equal(Math.round($galleryItems.eq(0).width()), 300, "actual item width is correct");

    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 600, "position of last item is correct");
    assert.equal(Math.round($galleryItems.eq(0).width()), 300, "actual item width is correct");
});

QUnit.test("actual width of items test when 'stretchImages' = true", function(assert) {
    this.instance.option({
        width: 200,
        initialItemWidth: 200,
        stretchImages: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of first item is correct");
    assert.equal($galleryItems.eq(0).width(), 200, "actual item width is correct");

    this.instance.option("width", 400);

    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 400, "position of third item is correct");
    assert.equal($galleryItems.eq(0).width(), 200, "actual item width is correct");

    this.instance.option("width", 450);

    assert.ok($galleryItems.eq(0).width() > 200, "actual item width is correct, item became wider");

    this.instance.option("width", 600);

    assert.equal(calculateItemPosition($galleryItems.eq(3), this.$element), 600, "position of fourth item is correct");
    assert.roughEqual($galleryItems.eq(0).width(), 200, 0.1, "actual item width is correct");
});

QUnit.test("'initialItemWidth' option test when 'stretchImages' = true", function(assert) {
    this.instance.option({
        width: 200,
        initialItemWidth: 200,
        stretchImages: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 200, "position of second item is correct");
    assert.equal($galleryItems.eq(0).width(), 200, "actual item width is correct");

    this.instance.option("initialItemWidth", 100);

    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 200, "position of third item is correct");
    assert.equal($galleryItems.eq(0).width(), 100, "actual item width is correct");
});

QUnit.test("'stretchImages' option test", function(assert) {
    this.instance.option({
        width: 450,
        initialItemWidth: 200,
        stretchImages: false
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.roughEqual($galleryItems.eq(0).width(), 200, 0.1, "width of the item is correct");

    this.instance.option("stretchImages", true);

    assert.equal($galleryItems.eq(0).width(), 225, "width of the item is correct");
});

QUnit.test("Item positions are correct after click on prevButton for loop mode, stretchImages=false", function(assert) {
    this.instance.option({
        width: 460,
        initialItemWidth: 200,
        stretchImages: false,
        items: [0, 1, 2, 3, 4, 5],
        showNavButtons: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $prevNavButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS);

    $prevNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(5), this.$element), 1120, "position of last item is correct, last page was shown");
    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 900);
});

QUnit.test("Last item position is correct after click on nextButton for loop mode, stretchImages=false", function(assert) {
    this.instance.option({
        width: 300,
        initialItemWidth: 160,
        stretchImages: false,
        items: [0, 1, 2, 3, 4, 5],
        selectedIndex: 4,
        showNavButtons: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

    $nextNavButton.trigger("dxclick");
    this.clock.tick(200);

    assert.equal(calculateItemPosition($galleryItems.eq(5), this.$element), 70, "position of last item is correct, last page was shown");
    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), -160);
});

QUnit.test("number of indicators shows the number of pages", function(assert) {
    this.instance.option("items", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    assert.equal(this.$element.find("." + INDICATOR_ITEM_CLASS).length, 10, "number of indicators correctly on init");

    this.instance.option("initialItemWidth", 200);
    this.instance.option("width", 400);

    assert.equal(this.$element.find("." + INDICATOR_ITEM_CLASS).length, 5, "number of indicators correctly after dimensionChanged");

    this.instance.option("initialItemWidth", 100);
    this.instance.option("width", 500);

    assert.equal(this.$element.find("." + INDICATOR_ITEM_CLASS).length, 2, "number of indicators correctly after dimensionChanged");
});

QUnit.test("click on indicator cause going to the next page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        width: 400,
        loop: true,
        initialItemWidth: 100
    });

    var $galleryIndicators = this.$element.find("." + INDICATOR_ITEM_CLASS),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    $galleryIndicators.eq(1).trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 0, "position of fifth item is correct, shown a second page");

    $galleryIndicators.eq(2).trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(8), this.$element), 0, "position of eighth item is correct, shown a third page");
});

QUnit.test("click on navButton cause going to the next page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        initialItemWidth: 100,
        width: 400,
        showNavButtons: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $nextButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS),
        $prevButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS);

    $nextButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 0, "position of fifth item is correct, second page was shown");

    $nextButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(8), this.$element), 0, "position of eighth item is correct, third page was shown");

    $prevButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 0, "position of fifth item is correct, second page was shown");

    $prevButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of first item is correct, first page was shown");
});

QUnit.test("last page state must look correctly", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100
    });

    var $galleryIndicators = this.$element.find("." + INDICATOR_ITEM_CLASS),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    $galleryIndicators.eq(1).trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 0, "position of fifth item is correct, second page was shown");

    $galleryIndicators.eq(2).trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(9), this.$element), this.$element.width() - $galleryItems.eq(0).width(), "position of last item is correct, shown a third page");
});

QUnit.test("last page state must look correctly, loop = true", function(assert) {
    this.instance.option({
        items: [0, 1, 2],
        width: 400,
        initialItemWidth: 200,
        showNavButtons: true,
        loop: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $prevNavButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS),
        $nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

    $nextNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 0, "position of second item is correct, second page was shown");
    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 200, "position of third item is correct, there are second and third items on the last page");

    $prevNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of item is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 200, "position of item is correct");

    $prevNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), -200, "position of item is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 0, "position of item is correct");

    $nextNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of item is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 200, "position of item is correct");
});

QUnit.test("calculations should accept small error", function(assert) {
    this.instance.option({
        items: [0, 1, 2],
        width: 300,
        initialItemWidth: 99.99,
        showNavButtons: true,
        loop: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $prevNavButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS),
        $nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

    $nextNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of item is correct");

    $prevNavButton.trigger("dxclick");

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0, "position of item is correct");
});

QUnit.test("last page indicator must look correctly", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100,
        loop: false,
        showNavButtons: true
    });

    var $galleryIndicators = this.$element.find("." + INDICATOR_ITEM_CLASS),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        $nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

    $nextNavButton.trigger("dxclick");
    assert.ok($galleryIndicators.eq(1).hasClass(GALLERY_SELECTED_ITEM_CLASS));

    $nextNavButton.trigger("dxclick");

    assert.ok($galleryIndicators.eq(2).hasClass(GALLERY_SELECTED_ITEM_CLASS));
    assert.equal(calculateItemPosition($galleryItems.eq(9), this.$element), this.$element.width() - $galleryItems.eq(0).width(), "position of last item is correct, shown a third page");
});

QUnit.test("item position is correct after swipe-start when there are few items on the page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100
    });

    var mouse = pointerMock(this.$element),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    mouse.start().swipeStart().swipe(-0.5);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), -200, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), -100, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 0, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(3), this.$element), 100, "item position is correct");

    mouse.up();
});

QUnit.test("item position is correct after swipe-start when 'wrapAround' = true", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3],
        wrapAround: true
    });

    var mouse = pointerMock(this.$element),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    mouse.start().swipeStart().swipe(-0.5);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), -100, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), 100, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), 300, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(3), this.$element), 500, "item position is correct");

    mouse.up();
});

QUnit.test("item position is correct in rtl mode when 'wrapAround' = true", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3],
        wrapAround: true,
        rtlEnabled: true
    });

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 100, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(1), this.$element), -100, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(2), this.$element), -300, "item position is correct");
    assert.equal(calculateItemPosition($galleryItems.eq(3), this.$element), -500, "item position is correct");
});

QUnit.test("change selected item by swipe when there are few items on the page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100
    });

    var mouse = pointerMock(this.$element),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    mouse.start().swipeStart().swipe(-0.5).swipeEnd(-1);

    assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), -this.instance.option("width"), "item position is correct");
    assert.equal(this.instance.option("selectedIndex"), 4, "selectedIndex was set correctly");

    mouse.up();
});

QUnit.test("last page state must look correctly after swipe", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100,
        selectedIndex: 4
    });

    var mouse = pointerMock(this.$element),
        $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(4), this.$element), 0, "position of fifth item is correct, shown a second page");

    mouse.start().swipeStart().swipe(-0.5).swipeEnd(-1);

    assert.equal(calculateItemPosition($galleryItems.eq(9), this.$element), this.instance.option("width") - $galleryItems.eq(9).width(), "position of last item is correct");
    assert.equal(this.instance.option("selectedIndex"), 6, "selectedIndex was set correctly");

    mouse.up();
});

QUnit.test("loop works correctly when there are few items on the page", function(assert) {
    var origFX = fx.animate,
        left;

    fx.animate = function($element, config) {
        left = config.to.left;
    };

    try {
        this.instance.option({
            items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            width: 400,
            loop: true,
            initialItemWidth: 100
        });

        this.instance._prevPage();
        assert.equal(left, 400, "");
        assert.equal(this.instance.option("selectedIndex"), 6);

        this.instance._nextPage();

        assert.equal(left, -1000, "");
        assert.equal(this.instance.option("selectedIndex"), 0);
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("duplicate items count when there are few items on the page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 200,
        loop: true
    });

    assert.equal(this.$element.find("." + GALLERY_LOOP_ITEM_CLASS).length, 4);

    this.instance.option("initialItemWidth", 100);

    assert.equal(this.$element.find("." + GALLERY_LOOP_ITEM_CLASS).length, 8);
});

QUnit.test("duplicate items position when there are few items on the page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 400,
        initialItemWidth: 100,
        selectedIndex: 4,
        loop: true
    });

    assert.expect(8);

    var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
        loopItemsCount = this.$element.find("." + GALLERY_LOOP_ITEM_CLASS).length,
        i;

    for(i = 0; i < loopItemsCount / 2; i++) {
        assert.equal(calculateItemPosition($galleryItems.eq(i), this.$element), (i - loopItemsCount / 2) * $galleryItems.eq(0).width(), "left duplicate item position correct");
    }

    for(i = loopItemsCount / 2; i < loopItemsCount; i++) {
        assert.equal(calculateItemPosition($galleryItems.eq(i), this.$element), (i - loopItemsCount / 2) * $galleryItems.eq(0).width(), "right duplicate item position correct");
    }
});

QUnit.test("navigation buttons must be hidden on last slides when there are few items on the page", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7],
        width: 400,
        initialItemWidth: 100,
        loop: false,
        showNavButtons: true
    });

    var prevNavButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS),
        nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

    assert.equal(prevNavButton.css("display"), "none");
    assert.notEqual(nextNavButton.css("display"), "none");

    this.instance.option("selectedIndex", 4);
    assert.notEqual(prevNavButton.css("display"), "none");
    assert.equal(nextNavButton.css("display"), "none");
});

QUnit.test("indicator selected state is rendered correctly", function(assert) {
    this.instance.option({
        items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        width: 400,
        initialItemWidth: 100,
        loop: false
    });

    var $galleryIndicators = this.$element.find("." + INDICATOR_ITEM_CLASS);

    $galleryIndicators.eq(2).trigger("dxclick");

    this.instance.option("width", 600);

    assert.ok(this.$element.find("." + INDICATOR_ITEM_CLASS).eq(1).hasClass(GALLERY_SELECTED_ITEM_CLASS), "last indicator is selected");
});

QUnit.test("loop for the case when all the pictures fit on one page", function(assert) {
    var origFX = fx.animate,
        left;

    fx.animate = function($element, config) {
        left = config.to.left;
    };

    try {
        this.instance.option({
            items: [0, 1, 2],
            width: 300,
            initialItemWidth: 100,
            loop: true,
            showNavButtons: true
        });

        var prevNavButton = this.$element.find("." + NAV_PREV_BUTTON_CLASS),
            nextNavButton = this.$element.find("." + NAV_NEXT_BUTTON_CLASS);

        nextNavButton.trigger("dxclick");

        assert.equal(Math.round(left), -300, "container was moved correctly");

        prevNavButton.trigger("dxclick");

        assert.equal(Math.round(left), 300, "container was moved correctly");

    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("swipe for the case when all the pictures fit on one page", function(assert) {
    var origFX = fx.animate,
        left;

    fx.animate = function($element, config) {
        left = config.to.left;
    };
    try {
        this.instance.option({
            items: [0, 1, 2],
            width: 300,
            initialItemWidth: 100,
            loop: true
        });

        var $galleryItems = this.$element.find("." + GALLERY_ITEM_CLASS),
            mouse = pointerMock(this.$element);

        assert.equal(calculateItemPosition($galleryItems.eq(0), this.$element), 0);
        mouse.start().swipeStart().swipe(0.1).swipeEnd(1);

        assert.equal(Math.round(left), 300, "container was moved correctly");

        mouse.start().swipeStart().swipe(-0.1).swipeEnd(-1);

        assert.equal(Math.round(left), -300, "container was moved correctly");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.module("api", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple");
        this.mouse = pointerMock(this.$element);
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("B233068 - When change from 2nd to 4th slide or vice versa, animation do not start", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3],
            showIndicator: true,
            selectedIndex: 1
        }),
        instance = $gallery.dxGallery("instance");

    var indicatorItems = $gallery.find("." + INDICATOR_ITEM_CLASS),
        renderContainerPosition = instance._renderContainerPosition;

    instance._renderContainerPosition = function(offset, animate) {
        assert.equal(animate, true, "animation started");
        instance._renderContainerPosition = renderContainerPosition;
        return renderContainerPosition.apply(instance, arguments);
    };

    indicatorItems.eq(3).trigger("dxclick");

    this.clock.tick(ANIMATION_WAIT_TIME);
});

QUnit.test("prevItem / nextItem", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1]
        }),
        galleryInstance = $gallery.dxGallery("instance");

    galleryInstance.prevItem();
    assert.equal(galleryInstance.option("selectedIndex"), 0);
    galleryInstance.nextItem();
    assert.equal(galleryInstance.option("selectedIndex"), 1);
    galleryInstance.nextItem();
    assert.equal(galleryInstance.option("selectedIndex"), 1);
    galleryInstance.prevItem();
    assert.equal(galleryInstance.option("selectedIndex"), 0);
});

QUnit.test("prevItem / nextItem for loop", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2],
            loop: true
        }),
        galleryInstance = $gallery.dxGallery("instance");

    galleryInstance.prevItem();
    assert.equal(galleryInstance.option("selectedIndex"), 2);
    galleryInstance.nextItem();
    assert.equal(galleryInstance.option("selectedIndex"), 0);
});

QUnit.test("goToItem", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3, 4],
            loop: true
        }),
        galleryInstance = $gallery.dxGallery("instance");

    galleryInstance.goToItem(4);
    assert.equal(galleryInstance.option("selectedIndex"), 4);

    galleryInstance.goToItem(2);
    assert.equal(galleryInstance.option("selectedIndex"), 2);

    galleryInstance.goToItem(5);
    assert.equal(galleryInstance.option("selectedIndex"), 0);

    galleryInstance.goToItem(-2);
    assert.equal(galleryInstance.option("selectedIndex"), 3);

    galleryInstance.goToItem(10);
    assert.equal(galleryInstance.option("selectedIndex"), 0);

    galleryInstance.goToItem(-17);
    assert.equal(galleryInstance.option("selectedIndex"), 3);
});

QUnit.test("goToItem with animation", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1],
            animationDuration: 10
        }),
        galleryInstance = $gallery.dxGallery("instance"),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    galleryInstance.goToItem(1, true);
    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.equal(galleryInstance.option("selectedIndex"), 1);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -400);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 0);

    galleryInstance.goToItem(0, true);
    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.equal(galleryInstance.option("selectedIndex"), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 400);

});

QUnit.test("goToItem without animation when animationEnabled is true", function(assert) {
    fx.off = false;

    var origFX = fx.animate,
        animated;

    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $gallery = $("#gallerySimple").dxGallery({
                items: [0, 1, 2, 3],
                animationEnabled: true
            }),
            galleryInstance = $gallery.dxGallery("instance");

        animated = false;

        galleryInstance.goToItem(1, false);

        assert.equal(animated, false, "animation was not present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("prevItem / nextItem with animation", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1],
            animationDuration: 10
        }),
        galleryInstance = $gallery.dxGallery("instance"),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    galleryInstance.nextItem(true);
    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.equal(galleryInstance.option("selectedIndex"), 1);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), -400);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 0);

    galleryInstance.prevItem(true);
    this.clock.tick(ANIMATION_WAIT_TIME);

    assert.equal(galleryInstance.option("selectedIndex"), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 400);
});

QUnit.test("goToItem should not cause animation if index equals selected index", function(assert) {
    fx.off = false;

    var origFX = fx.animate,
        animated;

    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        var $gallery = $("#gallerySimple").dxGallery({
                items: [0, 1, 2, 3],
                animationEnabled: true
            }),
            galleryInstance = $gallery.dxGallery("instance");

        animated = false;

        galleryInstance.goToItem(0, true);

        assert.equal(animated, false, "animation was not present");
    } finally {
        fx.animate = origFX;
    }
});

QUnit.test("click on navButtons switch current item", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1],
            animationDuration: 10,
            showNavButtons: true
        }),
        instance = $gallery.dxGallery("instance");

    $gallery.find("." + NAV_NEXT_BUTTON_CLASS).trigger("dxclick");
    assert.equal(instance.option("selectedIndex"), 1);

    $gallery.find("." + NAV_PREV_BUTTON_CLASS).trigger("dxclick");
    assert.equal(instance.option("selectedIndex"), 0);
});

QUnit.test("click on navButtons switch current item when loop mode", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2],
            showNavButtons: true,
            loop: true,
            selectedIndex: 2
        }),
        instance = $gallery.dxGallery("instance");

    $gallery.find("." + NAV_NEXT_BUTTON_CLASS).trigger("dxclick");
    assert.equal(instance.option("selectedIndex"), 0);

    $gallery.find("." + NAV_PREV_BUTTON_CLASS).trigger("dxclick");
    assert.equal(instance.option("selectedIndex"), 2);
});

QUnit.test("animationDuration", function(assert) {
    fx.off = false;

    var clock = sinon.useFakeTimers(),
        oldRAF = animationFrame.requestAnimationFrame;

    animationFrame.requestAnimationFrame = function(callback) {
        return window.setTimeout(callback, 10);
    };

    try {
        var $element = $("#gallerySimple").dxGallery({ items: [0, 1, 2] }),
            $container = $element.find("." + GALLERY_ITEM_CONTAINER_CLASS),
            instance = $element.dxGallery("instance"),
            originalAnimate = instance._animate;

        instance._animate = function(targetPosition) {
            return originalAnimate.call(this, targetPosition, { strategy: "frame" });
        };

        instance.option("animationDuration", 300);

        instance.nextItem(true);

        clock.tick(150);
        assert.ok($container.position().left < 0 && $container.position().left > -400, "animation is preforming");

        clock.tick(150);
        assert.equal($container.position().left, -400, "animation is completed");


        instance.option("animationDuration", 10000);

        instance.nextItem(true);

        clock.tick(5000);
        assert.ok($container.position().left < -400 && $container.position().left > -800, "animation is preforming");

        clock.tick(5000);
        assert.equal($container.position().left, -800, "animation is completed");
    } finally {
        animationFrame.requestAnimationFrame = oldRAF;
    }
});

QUnit.module("keyboard navigation", {
    beforeEach: function() {
        fx.off = true;

        this.$gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2],
            focusStateEnabled: true
        });

        this.instance = this.$gallery.dxGallery("instance");
        this.keyboard = keyboardMock(this.$gallery);
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("selected item changed after press right/left arrows", function(assert) {
    this.instance.option({
        loop: false,
        selectOnFocus: true
    });

    this.$gallery.focusin();
    this.keyboard.keyDown("left");

    assert.equal(this.instance.option("selectedIndex"), 0, "selectedIndex correct");

    this.keyboard.keyDown("right");

    assert.equal(this.instance.option("selectedIndex"), 1, "selectedIndex correct");

    this.keyboard.keyDown("left");

    assert.equal(this.instance.option("selectedIndex"), 0, "selectedIndex correct");
});

QUnit.test("focused item changed after press right/left arrows", function(assert) {
    this.instance.option({
        loop: false,
        selectOnFocus: true
    });

    var $galleryItems = this.$gallery.find("." + GALLERY_ITEM_CLASS);
    this.$gallery.trigger("focusin");

    this.keyboard.keyDown("right");

    assert.equal(isRenderer(this.instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.ok($galleryItems.eq(1).hasClass("dx-state-focused"), "selectedItem has focusedState class");

    this.keyboard.keyDown("left");

    assert.ok($galleryItems.eq(0).hasClass("dx-state-focused"), "selectedItem has focusedState class");
});

QUnit.test("selected item changed after press right/left arrows, loop mode", function(assert) {
    this.instance.option({
        loop: true,
        selectOnFocus: true,
        selectedIndex: 0
    });
    var $galleryItems = this.$gallery.find("." + GALLERY_ITEM_CLASS);

    this.$gallery.focusin();
    this.keyboard.keyDown("left");

    assert.equal(this.instance.option("selectedIndex"), 2, "selectedIndex correct");
    assert.ok($galleryItems.eq(2).hasClass("dx-state-focused"), "selectedItem has focusedState class");

    this.keyboard.keyDown("right");

    assert.equal(this.instance.option("selectedIndex"), 0, "selectedIndex correct");
    assert.ok($galleryItems.eq(0).hasClass("dx-state-focused"), "selectedItem has focusedState class");
});

QUnit.test("loopItemFocus option correctness", function(assert) {
    this.instance.option({
        loop: true
    });

    assert.equal(this.instance.option("loopItemFocus"), true, "loopItemFocus option was set correctly on init");

    this.instance.option("loop", false);

    assert.equal(this.instance.option("loopItemFocus"), false, "loopItemFocus option was set to false");
});

QUnit.test("keyboard navigation when there are a few pictures on the page", function(assert) {
    this.instance.option({
        width: 200,
        initialItemWidth: 100,
        items: [0, 1, 2],
        selectOnFocus: true,
        loop: true,
        selectedIndex: 2
    });

    this.$gallery.focusin();
    this.keyboard.keyDown("right");

    assert.equal(this.instance.option("selectedIndex"), 0, "selectedIndex correct");

    this.keyboard.keyDown("right");

    assert.equal(this.instance.option("selectedIndex"), 1, "selectedIndex correct");

    this.keyboard.keyDown("left");

    assert.equal(this.instance.option("selectedIndex"), 0, "selectedIndex correct");
});


QUnit.module("RTL", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#gallerySimple");
        this.mouse = pointerMock(this.$element);
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("default render", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2, 3],
            showNavButtons: true,
            rtlEnabled: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0);
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), -400);
    assert.equal(calculateItemPosition($galleryItems.eq(2), $gallery), -800);
    assert.equal(calculateItemPosition($galleryItems.eq(3), $gallery), -1200);
    assert.equal($gallery.find("." + NAV_NEXT_BUTTON_CLASS).length, 1);
    assert.equal($gallery.find("." + NAV_PREV_BUTTON_CLASS).length, 1);
    assert.equal($gallery.find("." + NAV_NEXT_BUTTON_CLASS).hasClass(DX_WIDGET_CLASS), true);
    assert.equal($gallery.find("." + NAV_PREV_BUTTON_CLASS).hasClass(DX_WIDGET_CLASS), true);
});

QUnit.test("change selected item by swipe change indicator selected item", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            rtlEnabled: true
        }),
        $indicatorItems = function() {
            return $gallery.find("." + INDICATOR_ITEM_CLASS);
        },
        mouse = this.mouse;


    assert.ok($indicatorItems().eq(0).hasClass(GALLERY_SELECTED_ITEM_CLASS));

    mouse.start().swipeStart().swipeEnd(1);

    assert.ok(!$indicatorItems().eq(0).hasClass(GALLERY_SELECTED_ITEM_CLASS));
    assert.ok($indicatorItems().eq(1).hasClass(GALLERY_SELECTED_ITEM_CLASS));
});

QUnit.test("userInteraction", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1, 2],
            rtlEnabled: true,
            swipeEnabled: true,
            indicatorEnabled: true
        }),
        instance = $gallery.dxGallery("instance"),
        mouse = pointerMock($gallery);

    mouse.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(calculateItemPosition($gallery.find("." + GALLERY_ITEM_CLASS).eq(0), $gallery), 400);

    instance.option("swipeEnabled", false);
    instance.option("indicatorEnabled", false);
    mouse.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(calculateItemPosition($gallery.find("." + GALLERY_ITEM_CLASS).eq(0), $gallery), 400);
});

QUnit.test("loop works correctly for rtl mode", function(assert) {
    var $gallery = this.$element.dxGallery({
            items: [0, 1, 2, 3],
            loop: true,
            rtlEnabled: true
        }),
        $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS),
        mouse = this.mouse;

    assert.ok($gallery.hasClass("dx-gallery-loop"));
    assert.equal($galleryItems.eq(0).position().left, 0);

    mouse.start().swipeStart().swipeEnd(-1);

    assert.equal(calculateItemPosition($galleryItems.last(), $gallery), 1600);
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 1200);
});

QUnit.test("gallery with two items works correctly when loop is enabled, rtl mode", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            items: [0, 1],
            selectedIndex: 0,
            loop: true,
            rtlEnabled: true
        }),
        instance = $gallery.dxGallery("instance");

    var $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    instance.nextItem();
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), 0, "going to next item is correct");

    instance.nextItem();
    assert.equal(calculateItemPosition($galleryItems.eq(1), $gallery), -400, "going to next ghost item is correct");

    instance.option("selectedIndex", 0);

    instance.prevItem();
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 400, "going to prev ghost item is correct");

    instance.prevItem();
    assert.equal(calculateItemPosition($galleryItems.eq(0), $gallery), 0, "going to prev item is correct");
});

QUnit.test("Item positions are correct for responsive gallery, stretchImages=false, rtl mode", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        width: 400,
        initialItemWidth: 210,
        stretchImages: false,
        items: [0, 1],
        rtlEnabled: true
    });

    var $galleryItems = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal(Math.abs(calculateItemPosition($galleryItems.first(), $gallery)), 95, "position of first item is correct");
});


QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxGallery({ items: [0, 1, 2] });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#widget").dxGallery({ items: [0, 1, 2], width: 400 }),
        instance = $element.dxGallery("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#widthRootStyle").dxGallery({ items: [0, 1, 2] });

    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxGallery({ items: [0, 1, 2] }),
        instance = $element.dxGallery("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});

QUnit.test("change sizes after showing", function(assert) {
    var $element = $("#widget");
    var $elementWrapper = $element.wrap("<div>").parent().detach();

    $element.dxGallery({
        height: 400,
        items: [1]
    });

    $element.find(".dx-gallery-item").css("height", "100%");

    $elementWrapper.appendTo("#qunit-fixture");
    $element.trigger("dxshown");

    assert.ok($element.height() > 0, "height present");
});

QUnit.test("items position set without animation after windowsResizeCallback is fired", function(assert) {
    var origFX = fx.animate;
    var animated = false;
    fx.animate = function() {
        animated = true;
        return $.Deferred().resolve().promise();
    };

    try {
        $("#widget").dxGallery({
            items: [0, 1, 2, 3],
            selectedIndex: 1
        });

        resizeCallbacks.fire();

        assert.equal(animated, false, "animation is not present");
    } finally {
        fx.animate = origFX;
    }

});


QUnit.module("gallery with paginated dataSource", {
    beforeEach: function() {
        this.fxOff = fx.off;
        fx.off = true;
    },

    afterEach: function() {
        fx.off = this.fxOff;
    }

});

QUnit.test("gallery should load next page on next nav button click", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2, 3, 4, 5],
            pageSize: 2,
            paginate: true
        }
    });

    var $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 2, "rendered items count is correct on init");

    var $nextNavButton = $gallery.find("." + NAV_NEXT_BUTTON_CLASS).trigger("dxclick");

    $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 4, "rendered items count is correct after loading next dataSource page");

    $nextNavButton.trigger("dxclick");
    $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 4, "rendered items count is correct, there are items for showing next gallery page");
});

QUnit.test("next navButton is visible if dataSource has next page", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2],
            pageSize: 1,
            paginate: true
        }
    });

    var $nextNavButton = $gallery.find("." + NAV_NEXT_BUTTON_CLASS);
    assert.notEqual($nextNavButton.css("display"), "none", "navButton is visible");
});

QUnit.test("next navButton is invisible for last page and visible after click on prev navButton", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2],
            pageSize: 1,
            paginate: true
        }
    });

    var $nextNavButton = $gallery.find("." + NAV_NEXT_BUTTON_CLASS),
        $prevNavButton = $gallery.find("." + NAV_PREV_BUTTON_CLASS);


    $nextNavButton.trigger("dxclick");
    assert.equal($nextNavButton.css("display"), "none", "next navButton is invisible");

    $prevNavButton.trigger("dxclick");
    assert.notEqual($nextNavButton.css("display"), "none", "next navButton is invisible");
});

QUnit.test("gallery should load next page on creating if next visible page is not full", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2],
            pageSize: 1,
            paginate: true
        }
    });

    var $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 2, "rendered items count is correct, there are items for showing next gallery page");
});

QUnit.test("items positions are correct after loading new items", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2, 3],
            pageSize: 1,
            paginate: true
        }
    });

    $gallery.find("." + NAV_NEXT_BUTTON_CLASS).trigger("dxclick");

    var $thirdItem = $gallery.find("." + GALLERY_ITEM_CLASS).eq(2);
    assert.equal(calculateItemPosition($thirdItem, $gallery), ITEM_WIDTH, "item position is correct");
});

QUnit.test("indicators count is correct after loading new items", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        showNavButtons: true,
        dataSource: {
            store: [1, 2, 3],
            pageSize: 1,
            paginate: true
        }
    });

    assert.equal($gallery.find("." + INDICATOR_ITEM_CLASS).length, 2, "indicators count is correct, next page was loaded");

    $gallery.find("." + NAV_NEXT_BUTTON_CLASS).trigger("dxclick");

    assert.equal($gallery.find("." + INDICATOR_ITEM_CLASS).length, 3, "indicators count is correct, next page was loaded");
});

QUnit.test("next dataSource page should be loaded during swipe gesture", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            dataSource: {
                store: [1, 2, 3],
                pageSize: 1,
                paginate: true
            }
        }),
        pointer = pointerMock($gallery).start();

    pointer.swipeStart().swipe(-1);
    var $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 3, "rendered items count is correct");
});

QUnit.test("width of loaded items is correct", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            width: 400,
            loop: true,
            initialItemWidth: 350,
            dataSource: {
                store: [1, 2, 3],
                pageSize: 1,
                paginate: true
            }
        }),
        pointer = pointerMock($gallery).start();

    pointer.swipeStart().swipe(-1);
    var $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.eq(3).width(), 350, "rendered items width is correct");
});

QUnit.test("loading items on init when dataSource pageSize < visible pageSize", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
            width: 400,
            initialItemWidth: 200,
            dataSource: {
                store: [1, 2, 3, 4, 5],
                pageSize: 1,
                paginate: true
            }
        }),
        $items = $gallery.find("." + GALLERY_ITEM_CLASS);

    assert.equal($items.filter(":visible").length, 4, "items count is correct");
});

QUnit.test("next dataSource page should be loaded on indicator click", function(assert) {
    var $gallery = $("#gallerySimple").dxGallery({
        width: 400,
        initialItemWidth: 200,
        dataSource: {
            store: [1, 2, 3, 4, 5, 6, 7, 8],
            pageSize: 1,
            paginate: true
        }
    });

    $gallery.find("." + INDICATOR_ITEM_CLASS).eq(1).trigger("dxclick");

    var $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 6, "rendered items count is correct");

    $gallery.find("." + INDICATOR_ITEM_CLASS).eq(2).trigger("dxclick");
    $items = $gallery.find("." + GALLERY_ITEM_CLASS);
    assert.equal($items.filter(":visible").length, 8, "rendered items count is correct");
});
