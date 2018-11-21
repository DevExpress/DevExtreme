var $ = require("jquery"),
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    PivotTabs = require("ui/pivot/ui.pivot_tabs"),
    animation = require("ui/pivot/ui.pivot_tabs").animation,
    config = require("core/config"),
    pointerMock = require("../../helpers/pointerMock.js");

require("common.css!");

var allowedDiff = 0.5;

QUnit.testStart(function() {
    var markup =
        '<style>\
            #animated {\
                    position: absolute\
            }\
            \
            .dx-pivottabs {\
                width: 500px;\
                height: 100px;\
            }\
            .dx-pivottabs-tab, .dx-pivottabs-ghosttab {\
                font-size: 60px;\
            }\
        </style>\
        \
        <div id="animated"></div>\
        <div id="pivottabs"></div>';

    $("#qunit-fixture").html(markup);
});

var PIVOT_CLASS = "dx-pivottabs",

    PIVOT_ITEM_CLASS = "dx-pivottabs-tab",
    PIVOT_ITEM_SELECTED_CLASS = "dx-pivottabs-tab-selected",

    PIVOT_GHOST_ITEM_CLASS = "dx-pivottabs-ghosttab";

var toSelector = function(cssClass) {
    return "." + cssClass;
};


var position = function($element) {
    return translator.locate($element).left;
};

var width = function($element) {
    return $element.outerWidth();
};


var mockFxAnimate = function(animation, type, output) {
    animation[type] = function($element, end, action) {
        end = end || 0;

        var itemIndex = $("#pivottabs")
            .find(toSelector(PIVOT_ITEM_CLASS) + ", " + toSelector(PIVOT_GHOST_ITEM_CLASS))
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
        this._capturedAnimations = [];

        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, "moveTo", this._capturedAnimations);
        mockFxAnimate(animation, "slideAppear", this._capturedAnimations);
        mockFxAnimate(animation, "slideDisappear", this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown: function() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animation;
    }
};


QUnit.module("pivot tabs rendering");

QUnit.test("widget should be rendered", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs")).$element();

    assert.ok($pivotTabs.hasClass(PIVOT_CLASS), "widget class added");
});

QUnit.test("selected index should be equal 0", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"));

    assert.equal(pivotTabs.option("selectedIndex"), 0, "selectedIndex equals 0");
});


QUnit.module("markup");

var testItemsPositions = function($itemElements, items, selectedIndex) {
    var itemInfo = [];
    $.each($itemElements, function(index) {
        itemInfo.push({ index: index, offset: $(this).position().left });
    });

    itemInfo.sort(function(a, b) { return a.offset - b.offset; });

    var prevOffset = 0;
    $.each(itemInfo, function(index, info) {
        var $item = $itemElements.eq(info.index);

        QUnit.assert.equal($item.text(), items[(index + selectedIndex >= items.length) ? index + selectedIndex - items.length : index + selectedIndex].title, "correct item content rendered");
        QUnit.assert.roughEqual($item.position().left, prevOffset, allowedDiff, "rendered correct position");

        prevOffset = $item.position().left + $item.outerWidth();
    });
};

var testItemsPositionsRTL = function($itemElements, items, selectedIndex, tabsContainerWidth) {
    var itemInfo = [];
    $.each($itemElements, function(index) {
        itemInfo.push({ index: index, offset: $(this).position().left });
    });

    itemInfo.sort(function(a, b) { return b.offset - a.offset; });

    var prevOffset = tabsContainerWidth;
    $.each(itemInfo, function(index, info) {
        var $item = $itemElements.eq(info.index);

        prevOffset -= $item.outerWidth();

        QUnit.assert.equal($item.text(), items[(index + selectedIndex >= items.length) ? index + selectedIndex - items.length : index + selectedIndex].title, "correct item content rendered");
        QUnit.assert.roughEqual($item.position().left, prevOffset, allowedDiff, "rendered correct position");
    });
};

QUnit.test("selected item should have selected class", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    }).$element();

    var $item = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)).eq(0);

    assert.ok($item.hasClass(PIVOT_ITEM_SELECTED_CLASS), "class is set correctly");
});

QUnit.test("items should be rendered in correctly positions", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }];

    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: items
    }).$element();

    testItemsPositions($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, 0);
});

QUnit.test("items should be rendered in correctly positions in RTL mode", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }];

    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: items,
        rtlEnabled: true
    }).$element();

    testItemsPositionsRTL($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, 0, $pivotTabs.width());
});

QUnit.test("items should be rendered properly if index differs from zero", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        selectedIndex = 1;

    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: items,
        selectedIndex: selectedIndex
    }).$element();

    testItemsPositions($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, selectedIndex);
});

QUnit.test("items should be rendered properly if index differs from zero in RTL mode", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        selectedIndex = 1;

    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: items,
        selectedIndex: selectedIndex,
        rtlEnabled: true
    }).$element();

    testItemsPositionsRTL($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, selectedIndex, $pivotTabs.width());
});

QUnit.test("ghost item should be rendered", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    }).$element();

    var $ghostItem = $pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS));

    assert.ok($ghostItem.length, "ghost item generated");
    assert.equal($ghostItem.css("opacity"), 0, "ghost item is hidden");
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
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        selectedIndex: 0
    }).$element();

    var pointer = pointerMock($pivotTabs);

    var startEvent = pointer.start().swipeStart().lastEvent();
    assert.ok(startEvent.cancel, "index should not change because swipe was rejected");
});

QUnit.test("tab click should be rejected", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            selectedIndex: 0
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS));

    pointerMock($items.eq(1)).click();
    assert.strictEqual(pivotTabs.option("selectedIndex"), 0, "index should not change");
});


QUnit.module("options", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("disabled should reject swipe", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            selectedIndex: 0,
            disabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var pointer = pointerMock($pivotTabs);

    var startEvent = pointer.start().swipeStart().lastEvent();
    assert.ok(startEvent.cancel, "index should not change because swipe was rejected");
});

QUnit.test("disabled should reject tab click", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            selectedIndex: 0,
            disabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS));

    $($items.eq(1)).trigger("dxclick");
    assert.strictEqual(pivotTabs.option("selectedIndex"), 0, "index should not change");
});

QUnit.test("swipeEnabled option", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            swipeEnabled: false
        }),
        $pivotTabs = pivotTabs.$element(),
        pointer = pointerMock($pivotTabs);

    var swipeEvent = pointer.start().swipeStart().lastEvent();
    pointer.swipe(-0.5).swipeEnd(-1);
    assert.ok(swipeEvent.cancel, "swipe should not work");

    pivotTabs.option("swipeEnabled", true);
    swipeEvent = pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1).lastEvent();
    assert.ok(!swipeEvent.cancel, "swipe should work");
});


QUnit.module("options change", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("items change should draw items in correct positions", function(assert) {
    var items = [{ title: "unread" }, { title: "all" }, { title: "favorites" }];

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
        }),
        $pivotTabs = pivotTabs.$element();

    pivotTabs.option("items", items);

    testItemsPositions($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, 0);
});

QUnit.test("items change should draw items in correct positions in RTL mode", function(assert) {
    var items = [{ title: "unread" }, { title: "all" }, { title: "favorites" }];

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    pivotTabs.option("items", items);

    testItemsPositionsRTL($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, 0, $pivotTabs.width());
});

QUnit.test("selected index change should change items positions", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        selectedIndex = 1;

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: items
        }),
        $pivotTabs = pivotTabs.$element();

    pivotTabs.option("selectedIndex", 1);

    testItemsPositions($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, selectedIndex);
});

QUnit.test("selected index change should change items positions in RTL mode", function(assert) {
    var items = [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        selectedIndex = 1;

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: items,
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    pivotTabs.option("selectedIndex", 1);

    testItemsPositionsRTL($pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)), items, selectedIndex, $pivotTabs.width());
});


QUnit.module("animations", {
    beforeEach: function() {
        fx.off = true;

        this.$animated = $("#animated");
    },
    afterEach: function() {
        fx.off = false;

        this.$animated.css("opacity", 1);
        translator.move(this.$animated, { left: 0 });
    }
});

QUnit.test("moveTo", function(assert) {
    assert.expect(2);

    animation.moveTo(this.$animated, 100, function() {
        assert.ok(true, "complete action called");
    });

    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
});

QUnit.test("slideAppear", function(assert) {
    this.$animated.css("opacity", 0);

    animation.slideAppear(this.$animated, 100);

    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
    assert.equal(this.$animated.css("opacity"), 1, "opacity animated");
});

QUnit.test("slideDisappear", function(assert) {
    animation.slideDisappear(this.$animated, 100);

    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
    assert.equal(this.$animated.css("opacity"), 0, "opacity animated");
});

QUnit.test("complete", function(assert) {
    assert.expect(2);

    var origFxStop = fx.stop;

    fx.stop = $.proxy(function(element, complete) {
        assert.equal(element[0], this.$animated[0], "element correct");
        assert.equal(complete, true, "animation completed");
    }, this);

    try {
        animation.complete([this.$animated]);
    } finally {
        fx.stop = origFxStop;
    }
});

QUnit.test("stop", function(assert) {
    assert.expect(2);

    var origFxStop = fx.stop;

    fx.stop = $.proxy(function(element, complete) {
        assert.equal(element[0], this.$animated[0], "element correct");
        assert.equal(complete, undefined, "animation stopped");
    }, this);

    try {
        animation.stop([this.$animated]);
    } finally {
        fx.stop = origFxStop;
    }
});


QUnit.module("selected index change animation", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        animation.complete = $.proxy(function() {
            this.completeCount++;
        }, this);
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;
    }
});

QUnit.test("change to next item should cause animation to new item", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }]
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS));

    pivotTabs.option("selectedIndex", 1);

    assert.strictEqual(this.capturedAnimations.length, 3, "animation present");

    assert.equal(this.capturedAnimations[0].type, "slideAppear", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, width($items.eq(0)) + width($items.eq(1)), allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, width($items.eq(0)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, 0, allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, 0, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, -width($items.eq(0)), allowedDiff, "ghost item correct animation end position");
    assert.equal($pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS)).css("opacity"), 0, "ghost item is hidden after animation finished");
});

QUnit.test("change to next item should cause animation to new item in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        tabsContainerWidth = $pivotTabs.width();

    pivotTabs.option("selectedIndex", 1);

    assert.equal(this.capturedAnimations[0].type, "slideAppear", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, tabsContainerWidth - 2 * width($items.eq(0)) - width($items.eq(1)), allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(1)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, tabsContainerWidth - width($items.eq(0)), allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, tabsContainerWidth, allowedDiff, "ghost item correct animation end position");
});

QUnit.test("change to not next item should cause animation to new position from before new index position", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS));

    pivotTabs.option("selectedIndex", 2);

    assert.strictEqual(this.capturedAnimations.length, 4, "animation present");

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, width($items.eq(1)) + width($items.eq(2)), allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, width($items.eq(2)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "slideAppear", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, width($items.eq(0)) + width($items.eq(1)) + width($items.eq(2)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, width($items.eq(0)) + width($items.eq(2)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "third item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, width($items.eq(1)), allowedDiff, "third item correct animation start position");
    assert.roughEqual(this.capturedAnimations[2].end, 0, allowedDiff, "third item correct animation end position");

    assert.equal(this.capturedAnimations[3].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[3].start, 0, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[3].end, -width($items.eq(1)), allowedDiff, "ghost item correct animation end position");
    assert.equal($pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS)).css("opacity"), 0, "ghost item is hidden after animation finished");
});

QUnit.test("change to not next item should cause animation to new position from before new index position in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        tabsContainerWidth = $pivotTabs.width();

    pivotTabs.option("selectedIndex", 2);

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)) - width($items.eq(2)), allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(2)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "slideAppear", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, tabsContainerWidth - width($items.eq(0)) - 2 * width($items.eq(1)) - width($items.eq(2)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)) - width($items.eq(2)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "third item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, tabsContainerWidth - width($items.eq(1)) - width($items.eq(2)), allowedDiff, "third item correct animation start position");
    assert.roughEqual(this.capturedAnimations[2].end, tabsContainerWidth - width($items.eq(2)), allowedDiff, "third item correct animation end position");

    assert.equal(this.capturedAnimations[3].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[3].start, tabsContainerWidth - width($items.eq(1)), allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[3].end, tabsContainerWidth, allowedDiff, "ghost item correct animation end position");
});

QUnit.test("previous animation should be stopped", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    });

    pivotTabs.option("selectedIndex", 1);
    assert.equal(this.completeCount, 1, "previous animation finished");
});

QUnit.test("prepare action should not be fired", function(assert) {
    assert.expect(0);

    var pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        prepareAction: function() {
            assert.ok(false, "animation prepare action fired");
        }
    });

    pivotTabs.option("selectedIndex", 1);
});


QUnit.module("interaction via tabs click", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("tab click should change selected item", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS));

    $($items.eq(1)).trigger("dxclick");

    assert.equal(pivotTabs.option("selectedIndex"), 1, "item selected");
});


QUnit.module("interaction via swipe", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        animation.complete = $.proxy(function() {
            this.completeCount++;
        }, this);
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;
    }
});

QUnit.test("swipe should change selected item", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
        }),
        $pivotTabs = pivotTabs.$element();

    pointerMock($pivotTabs).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(pivotTabs.option("selectedIndex"), 1, "item selected");

    pointerMock($pivotTabs).start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(pivotTabs.option("selectedIndex"), 0, "item selected");
});

QUnit.test("swipe should change selected item in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    pointerMock($pivotTabs).start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(pivotTabs.option("selectedIndex"), 1, "item selected");

    pointerMock($pivotTabs).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(pivotTabs.option("selectedIndex"), 0, "item selected");
});

QUnit.test("long fast left or right swipe should change selected index only by +-1", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            width: 100
        }),
        $pivotTabs = pivotTabs.$element();

    var startEvent = pointerMock($pivotTabs).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxLeftOffset, 1, "maxLeftOffset of swipe is set to 1");
    assert.strictEqual(startEvent.maxRightOffset, 1, "maxRightOffset of swipe is set to 1");
});

QUnit.test("left swipe should cause correct animation", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }]
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs);

    pointer.start().swipeStart().swipe(-0.5);
    var offset = position($items.eq(0));
    pointer.swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.length, 3, "animation present");

    assert.equal(this.capturedAnimations[0].type, "slideAppear", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, width($items.eq(0)) + width($items.eq(1)) + offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, width($items.eq(0)) + offset, allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, 0, allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, offset, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, -width($items.eq(0)), allowedDiff, "ghost item correct animation end position");
    assert.equal($pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS)).css("opacity"), 0, "ghost item is hidden after animation finished");
});

QUnit.test("right swipe should cause correct animation in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs),
        tabsContainerWidth = $pivotTabs.width();

    pointer.start().swipeStart().swipe(0.5);
    var offset = position($items.eq(0));
    pointer.swipeEnd(1);

    assert.equal(this.capturedAnimations[0].type, "slideAppear", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, offset - width($items.eq(1)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(1)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, offset, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, tabsContainerWidth, allowedDiff, "ghost item correct animation end position");
});

QUnit.test("canceled left swipe should cause correct animation", function(assert) {
    assert.expect(8);

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            onRollback: function() {
                assert.ok(true, "rollback fired");
            }
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs);

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($items.eq(0));
    pointer.swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, 0, allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, width($items.eq(0)) + offset, allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, width($items.eq(0)), allowedDiff, "second item correct animation end position");
});

QUnit.test("canceled right swipe should cause correct animation in RTL", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs),
        tabsContainerWidth = $pivotTabs.width();

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($items.eq(0));
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, offset - width($items.eq(1)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "second item correct animation end position");
});

QUnit.test("right swipe should cause correct animation", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }]
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs);

    pointer.start().swipeStart().swipe(0.5);
    var offset = position($items.eq(0));
    pointer.swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.length, 3, "animation present");

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, -width($items.eq(1)) + offset, allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, 0, allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "slideDisappear", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, width($items.eq(0)) + offset, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, width($items.eq(0)) + width($items.eq(1)), allowedDiff, "ghost item correct animation end position");
});

QUnit.test("left swipe should cause correct animation in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs),
        tabsContainerWidth = $pivotTabs.width();

    pointer.start().swipeStart().swipe(-0.5);
    var offset = position($items.eq(0));
    pointer.swipeEnd(-1);

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, offset + width($items.eq(0)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(1)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "slideDisappear", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, offset - width($items.eq(1)), allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, tabsContainerWidth - width($items.eq(0)) - 2 * width($items.eq(1)), allowedDiff, "ghost item correct animation end position");
});

QUnit.test("canceled right swipe should cause correct animation", function(assert) {
    assert.expect(12);

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            onRollback: function() {
                assert.ok(true, "rollback fired");
            }
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs);

    pointer.start().swipeStart().swipe(0.2);
    var offset = position($items.eq(0));
    pointer.swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.length, 3, "animation present");

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, 0, allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, width($items.eq(0)) + offset, allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, width($items.eq(0)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, -width($items.eq(1)) + offset, allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, -width($items.eq(1)), allowedDiff, "ghost item correct animation end position");
    assert.equal($pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS)).css("opacity"), 0, "ghost item is hidden after animation finished");
});

QUnit.test("canceled left swipe should cause correct animation in RTL mode", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }],
            rtlEnabled: true
        }),
        $pivotTabs = pivotTabs.$element();

    var $items = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)),
        pointer = pointerMock($pivotTabs),
        tabsContainerWidth = $pivotTabs.width();

    pointer.start().swipeStart().swipe(-0.2);
    var offset = position($items.eq(0));
    pointer.swipeEnd(0);

    assert.equal(this.capturedAnimations[0].type, "moveTo", "first item animation type correct");
    assert.roughEqual(this.capturedAnimations[0].start, offset, allowedDiff, "first item correct animation start position");
    assert.roughEqual(this.capturedAnimations[0].end, tabsContainerWidth - width($items.eq(0)), allowedDiff, "first item correct animation end position");

    assert.equal(this.capturedAnimations[1].type, "moveTo", "second item animation type correct");
    assert.roughEqual(this.capturedAnimations[1].start, offset - width($items.eq(1)), allowedDiff, "second item correct animation start position");
    assert.roughEqual(this.capturedAnimations[1].end, tabsContainerWidth - width($items.eq(0)) - width($items.eq(1)), allowedDiff, "second item correct animation end position");

    assert.equal(this.capturedAnimations[2].type, "moveTo", "ghost item animation type correct");
    assert.roughEqual(this.capturedAnimations[2].start, offset + width($items.eq(0)), allowedDiff, "ghost item starts from previous item position");
    assert.roughEqual(this.capturedAnimations[2].end, tabsContainerWidth, allowedDiff, "ghost item correct animation end position");
});

QUnit.test("items should respond to mouse move", function(assert) {
    assert.expect(4);

    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        onUpdatePosition: function(args) {
            assert.ok(true, "update position fired");
            assert.ok(args.offset, "offset present");
        }
    }).$element();

    var $item = $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)).eq(0);

    var mouse = pointerMock($pivotTabs).start();

    mouse.swipeStart().swipe(0.1);
    assert.ok($item.position().left > 0, "item moves");

    mouse.swipeEnd(0);
    assert.equal($item.position().left, 0, "item returns back");
});

QUnit.test("items should not respond to mouse move if only one item present", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "favorites" }]
    }).$element();

    var mouse = pointerMock($pivotTabs);
    var startEvent = mouse.start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "swipe event was canceled");
});

QUnit.test("tabs should not move left greater that tabs container width", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    }).$element();

    var mouse = pointerMock($pivotTabs).start();

    var startEvent = mouse.swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxLeftOffset, 1, "container was not be moved left more than tab container width");

    assert.strictEqual(startEvent.maxRightOffset, 1, "container was not be moved right more than container width");
});

QUnit.test("ghost item should appear replacing last item when user swiping left to right", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    }).$element();

    var $ghostItem = $pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS));

    var item = function(index) {
        return $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)).eq(index);
    };

    var mouse = pointerMock($pivotTabs);

    mouse.start().swipeStart().swipe(0.01);

    assert.equal($ghostItem.css("opacity"), 1, "ghost item is visible");
    assert.equal($ghostItem.text(), "favorites", "ghost item text is valid");

    assert.roughEqual($ghostItem.position().left, item(1).position().left + item(1).outerWidth(), allowedDiff, "ghost replaced last item");
    assert.roughEqual(item(2).position().left, item(0).position().left - item(2).outerWidth(), allowedDiff, "last item moved forward");

    mouse.up();
});

QUnit.test("ghost item should appear replacing last item when user swiping right to left in RTL mode", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        rtlEnabled: true
    }).$element();

    var $ghostItem = $pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS));

    var item = function(index) {
        return $pivotTabs.find(toSelector(PIVOT_ITEM_CLASS)).eq(index);
    };

    var mouse = pointerMock($pivotTabs);

    mouse.start().swipeStart().swipe(-0.01);

    assert.equal($ghostItem.css("opacity"), 1, "ghost item is visible");
    assert.equal($ghostItem.text(), "favorites", "ghost item text is valid");

    assert.roughEqual($ghostItem.position().left, item(1).position().left - item(2).outerWidth(), allowedDiff, "ghost replaced last item");
    assert.roughEqual(item(2).position().left, item(0).position().left + item(0).outerWidth(), allowedDiff, "last item moved forward");

    mouse.up();
});

QUnit.test("ghost item should not appear when user swiping right to left", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }]
    }).$element();

    var $ghostItem = $pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS));

    var mouse = pointerMock($pivotTabs);

    mouse.start().swipeStart().swipe(-0.01);

    assert.equal($ghostItem.css("opacity"), 0, "ghost item is hidden");
});

QUnit.test("ghost item should not appear when user swiping left to right in RTL mode", function(assert) {
    var $pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        rtlEnabled: true
    }).$element();

    var $ghostItem = $pivotTabs.find(toSelector(PIVOT_GHOST_ITEM_CLASS));

    var mouse = pointerMock($pivotTabs);

    mouse.start().swipeStart().swipe(0.01);

    assert.equal($ghostItem.css("opacity"), 0, "ghost item is hidden");
});

QUnit.test("previous animation should be stopped", function(assert) {
    assert.expect(3);

    var pivotTabs = new PivotTabs($("#pivottabs"), {
            items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
            onPrepare: function() {
                assert.ok(true, "prepare fired");
            }
        }),
        $pivotTabs = pivotTabs.$element();

    var pointer = pointerMock($pivotTabs);

    pointer.start().swipeStart().swipe(-0.5);
    assert.equal(this.completeCount, 1, "previous animation finished");
    pointer.swipeEnd(-1);
    assert.equal(this.completeCount, 1, "previous not finished once");
});


QUnit.module("pivot integration", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        animation.complete = $.proxy(function() {
            this.completeCount++;
        }, this);
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;
    }
});

QUnit.test("items should respond to updatePosition method call", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        updatePositionAction: function(args) {
            assert.ok(false, "update position not fired");
        }
    });

    var $item = pivotTabs.$element().find(toSelector(PIVOT_ITEM_CLASS)).eq(0);

    pivotTabs.prepare();
    pivotTabs.updatePosition(10);
    assert.ok($item.position().left > 0, "item moves");
});

QUnit.test("items should be moved back by rollback method call with animation", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }],
        rollbackAction: function() {
            assert.ok(false, "rollback not fired");
        }
    });

    pivotTabs.prepare();
    pivotTabs.rollback();
    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");
});

QUnit.test("previous animation should be stopped", function(assert) {
    var pivotTabs = new PivotTabs($("#pivottabs"), {
        items: [{ title: "all" }, { title: "unread" }, { title: "favorites" }],
        prepareAction: function() {
            assert.ok(false, "prepare not fired");
        }
    });

    pivotTabs.prepare();
    assert.equal(this.completeCount, 1, "previous animation finished");
});


QUnit.module("default template", {
    prepareItemTest: function(data) {
        var pivotTabs = new PivotTabs($("<div>"), {
            items: [data]
        });

        return pivotTabs.itemElements().eq(0).find(".dx-item-content").contents();
    }
});

QUnit.test("template should be rendered correctly with string", function(assert) {
    var $content = this.prepareItemTest("custom");

    assert.equal($content.text(), "custom");
});

QUnit.test("template should be rendered correctly with title", function(assert) {
    var $content = this.prepareItemTest({ title: "custom" });

    assert.equal($content.text(), "custom");
});

QUnit.test("template should be rendered correctly with not plain title", function(assert) {
    var ctor = function() {
        this.title = "custom";
    };

    var $content = this.prepareItemTest(new ctor());

    assert.equal($content.text(), "custom");
});
