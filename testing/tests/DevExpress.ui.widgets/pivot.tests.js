var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    animation = require("ui/pivot").animation,
    fx = require("animation/fx"),
    translator = require("animation/translator"),
    domUtils = require("core/utils/dom"),
    Widget = require("ui/widget/ui.widget"),
    PivotTabs = require("ui/pivot/ui.pivot_tabs"),
    Pivot = require("ui/pivot"),
    config = require("core/config"),
    isRenderer = require("core/utils/type").isRenderer,
    pointerMock = require("../../helpers/pointerMock.js");

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<style>\
            #animated {\
                position: absolute\
            }\
            \
            .dx-pivottabs-container {\
                height: 40px;\
            }\
            \
            .dx-pivot-itemcontainer {\
                height: 50px;\
            }\
        </style>\
        \
        <div id="animated"></div>\
        <div id="pivot"></div>';

    $("#qunit-fixture").html(markup);
});


var PIVOT_AUTOHEIGHT_CLASS = "dx-pivot-autoheight",

    PIVOT_TABS_CONTAINER_CLASS = "dx-pivottabs-container",

    PIVOT_ITEM_WRAPPER_CLASS = "dx-pivot-itemwrapper",

    PIVOT_ITEM_CLASS = "dx-pivot-item",
    PIVOT_ITEM_HIDDEN_CLASS = "dx-pivot-item-hidden";

var toSelector = function(cssClass) {
    return "." + cssClass;
};


var position = function($element) {
    return translator.locate($element).left;
};


var mockFxAnimate = function(animations, type, output) {
    animations[type] = function($element, position, action) {
        position = position || 0;

        output.push({
            $element: $element,
            type: type,
            start: translator.locate($element).left,
            end: position
        });

        translator.move($element, { left: position });

        if(action) {
            action();
        }
    };
};

var animationCapturing = {
    start: function() {
        this._capturedAnimations = [];

        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, "returnBack", this._capturedAnimations);
        mockFxAnimate(animation, "slideAway", this._capturedAnimations);
        mockFxAnimate(animation, "slideBack", this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown: function() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


var PivotTabsMock = Widget.inherit({

    _defaultOptions: function() {
        return $.extend(this.callBase(), {
            items: [],
            selectedIndex: 0
        });
    },

    _init: function() {
        this.rolledBack = 0;
        this.prepared = 0;
        this.completed = 0;

        this.callBase();
        this._initActions();
    },

    _initActions: function() {
        this.onUpdatePosition = this._createActionByOption("onUpdatePosition");
        this.onRollback = this._createActionByOption("onRollback");
        this.onSelectionChanged = this._createActionByOption("onSelectionChanged");
        this.onPrepare = this._createActionByOption("onPrepare");
    },

    _renderContentImpl: noop,

    updatePosition: function(offset) {
        this.offset = offset;
    },

    rollback: function() {
        this.rolledBack = (this.rolledBack) + 1 || 1;
    },

    prepare: function() {
        this.prepared = (this.prepared) + 1 || 1;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "selectedIndex":
                this.completed = (this.completed) + 1 || 1;
                break;
            default:
                this.callBase(args);
        }
    }

});

var pivotTabsMock = {
    setup: function() {
        this.originalPivotTabs = PivotTabs;
        Pivot.mockPivotTabs(PivotTabsMock);
    },
    teardown: function() {
        Pivot.mockPivotTabs(this.originalPivotTabs);
    }
};


QUnit.module("sizing", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("pivot should have correct class if height is auto", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        height: "auto",
        items: [{ title: "all", text: "all content" }]
    });

    assert.ok($pivot.hasClass(PIVOT_AUTOHEIGHT_CLASS), "pivot height is auto");
});


QUnit.module("caching items", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("items should be cached", function(assert) {
    var renderCount = 0;

    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
            itemTemplate: function(itemData, itemIndex, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, "itemElement is correct");
                renderCount++;
            }
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("selectedIndex", 1);
    pivot.option("selectedIndex", 0);

    assert.strictEqual(renderCount, 2, "first item should be rendered one time");
});

QUnit.test("items should be cached correctly", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    var $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pivot.option("selectedIndex", 1);
    pivot.option("selectedIndex", 0);
    assert.equal($itemWrapper.find("." + PIVOT_ITEM_CLASS + ":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")").text(), "all content", "first item cached correctly");
    pivot.option("selectedIndex", 1);
    assert.equal($itemWrapper.find("." + PIVOT_ITEM_CLASS + ":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")").text(), "unread content", "second item cached correctly");
});

QUnit.test("cache should be cleared after items change", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    var $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pivot.option("selectedIndex", 1);
    pivot.option("items", [{ title: "unread", text: "unread content" }, { title: "all", text: "all content" }]);
    pivot.option("selectedIndex", 0);
    assert.equal($itemWrapper.find("." + PIVOT_ITEM_CLASS + ":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")").text(), "unread content", "cache cleared");
});


QUnit.module("hiding items", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("hiding event should be fired on item hiding", function(assert) {
    var origTriggerHidingEvent = domUtils.triggerHidingEvent;

    try {
        var $pivot = $("#pivot").dxPivot({
                selectedIndex: 0,
                items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }]
            }),
            pivot = $pivot.dxPivot("instance");

        domUtils.triggerHidingEvent = function($element) {
            assert.equal($.trim($element.text()), "all content", "correct item hidden");
        };
        pivot.option("selectedIndex", 1);
    } finally {
        domUtils.triggerHidingEvent = origTriggerHidingEvent;
    }
});

QUnit.test("shown event should be fired on item showing", function(assert) {
    var origTriggerShownEvent = domUtils.triggerShownEvent;

    try {
        var $pivot = $("#pivot").dxPivot({
                selectedIndex: 0,
                items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }]
            }),
            pivot = $pivot.dxPivot("instance");

        domUtils.triggerShownEvent = function($element) {
            assert.equal($.trim($element.text()), "all content", "correct item hidden");
        };
        pivot.option("selectedIndex", 1);
        pivot.option("selectedIndex", 0);
    } finally {
        domUtils.triggerShownEvent = origTriggerShownEvent;
    }
});


QUnit.module("design mode", {
    beforeEach: function() {
        config({ designMode: true });

        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        config({ designMode: false });

        fx.off = false;

        pivotTabsMock.teardown();
    }
});

QUnit.test("swipe should be rejected", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        selectedIndex: 0,
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    var startEvent = pointerMock($pivot).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "index should not change, swipe was rejected");
});


QUnit.module("options", {
    beforeEach: function() {
        fx.off = true;

        pivotTabsMock.setup();
    },
    afterEach: function() {
        fx.off = false;

        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("disabled should reject swipe", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        selectedIndex: 0,
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        disabled: true
    });

    var startEvent = pointerMock($pivot).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "index should not change, swipe was rejected");
});


QUnit.module("options change", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        pivotTabsMock.setup();
    },
    afterEach: function() {
        animationCapturing.teardown();

        pivotTabsMock.teardown();
    }
});

QUnit.test("widget should respond to selected index change", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    var $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    assert.equal($itemWrapper.text(), "all content", "pivot current content rendered with proper data");

    pivot.option("selectedIndex", 2);
    assert.equal($itemWrapper.find("." + PIVOT_ITEM_CLASS + ":not(." + PIVOT_ITEM_HIDDEN_CLASS + ")").text(), "favorites content", "pivot current content rendered with proper data");
    assert.strictEqual(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).option("selectedIndex"), 2, "pivottabs selectedIndex changed");
});

QUnit.test("widget should respond to items change", function(assert) {
    var items = [{ title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }];

    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("items", items);

    assert.equal($pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS)).text(), "unread content", "pivot current content rendered with proper data");
    assert.deepEqual(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).option("items"), items, "pivottabs items changed");
});

QUnit.test("selected index should be reset after items change", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 2,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("items", [{ title: "unread", text: "unread content" }]);
    assert.equal(pivot.option("selectedIndex"), 0, "selected index reset");
});


QUnit.module("events", {
    beforeEach: function() {
        pivotTabsMock.setup();
    },
    afterEach: function() {
        pivotTabsMock.teardown();
    }
});

QUnit.test("onSelectionChanged should be fired if selection changed", function(assert) {
    assert.expect(1);

    var done = assert.async();
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            onSelectionChanged: function(args) {
                assert.ok(true, "select action triggered");

                done();
            }
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("selectedIndex", 2);
});

QUnit.test("onSelectionChanged should be fired with correct item data if selection changed", function(assert) {
    var done = assert.async();
    var items = [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        $pivot = $("#pivot").dxPivot({
            items: items,
            onSelectionChanged: function(args) {
                assert.deepEqual(args.addedItems[0], items[2], "added selection is correct");
                assert.deepEqual(args.removedItems[0], items[0], "removed selection is correct");
                assert.deepEqual(args.addedItems[0], this.option("selectedItem"), "added selection is the same as selectedItem option");

                done();
            }
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("selectedIndex", 2);
});

QUnit.test("pivot should not render content twice after change items", function(assert) {
    var renderItemCount = 0;

    var items = [{ title: "1", text: "1" }, { title: "2", text: "2" }, { title: "3", text: "3" }],
        $pivot = $("#pivot").dxPivot({
            items: items,
            onItemRendered: function() {
                renderItemCount++;
            }
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("items", [{ title: "1", text: "1" }, { title: "2", text: "2" }]);

    assert.equal(renderItemCount, 2, "");
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

QUnit.test("returnBack", function(assert) {
    translator.move(this.$animated, { left: 100 });

    animation.returnBack(this.$animated, 0);
    assert.strictEqual(position(this.$animated), 0, "animated to correct position");
});

QUnit.test("slideAway", function(assert) {
    assert.expect(2);

    animation.slideAway(this.$animated, 100, function() {
        assert.ok(true, "complete action called");
    });
    assert.strictEqual(position(this.$animated), 100, "animated to correct position");
});

QUnit.test("slideBack", function(assert) {
    translator.move(this.$animated, { left: 100 });

    animation.slideBack(this.$animated);
    assert.strictEqual(position(this.$animated), 0, "animated to correct position");
});

QUnit.test("complete", function(assert) {
    assert.expect(2);

    var origFxStop = fx.stop;

    fx.stop = $.proxy(function(element, complete) {
        assert.equal(element[0], this.$animated[0], "element correct");
        assert.equal(complete, true, "animation completed");
    }, this);

    try {
        animation.complete(this.$animated);
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

        pivotTabsMock.setup();
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;

        pivotTabsMock.teardown();
    }
});

QUnit.test("prepare action should not be fired", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivot.option("selectedIndex", 1);
    assert.equal(pivotTabs.prepared, 0, "tabs stop not called");
});

QUnit.test("changing selectedIndex should cause correct animation in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            rtlEnabled: true
        }),
        pivot = $pivot.dxPivot("instance");

    pivot.option("selectedIndex", 1);

    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");
    assert.equal(this.capturedAnimations[0].type, "slideAway", "first is slideAway animation");
    assert.strictEqual(this.capturedAnimations[0].start, 0, "wrapper animated from correct position via slideAway");
    assert.ok(this.capturedAnimations[0].end > 0, "wrapper animated to correct position via slideAway");
    assert.equal(this.capturedAnimations[1].type, "slideBack", "second is slideBack animation");
    assert.ok(this.capturedAnimations[1].start < 0, "wrapper animated from correct position via slideBack");
    assert.strictEqual(this.capturedAnimations[1].end, 0, "wrapper animated to correct position via slideBack");
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
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            selectedIndex: 0
        }),
        pivot = $pivot.dxPivot("instance");

    $(pivot.itemElements()).eq(1).trigger("dxclick");
    assert.equal(pivot.option("selectedIndex"), 0, "selected index not changed");
});


QUnit.module("interaction via swipe", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        animation.complete = $.proxy(function() {
            this.completeCount++;
        }, this);

        pivotTabsMock.setup();
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;

        pivotTabsMock.teardown();
    }
});

QUnit.test("disable swipe on content with 'swipeEnabled' option", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            swipeEnabled: false
        }),
        pivot = $pivot.dxPivot("instance"),
        pointer = pointerMock($pivot);

    var swipeEvent = pointer.start().swipeStart().lastEvent();
    pointer.swipe(-0.5).swipeEnd(-1).lastEvent();
    assert.ok(swipeEvent.cancel, "swipe should not work");

    pivot.option("swipeEnabled", true);
    swipeEvent = pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1).lastEvent();
    assert.ok(!swipeEvent.cancel, "swipe should work");
});

QUnit.test("disable swipe on tabs with 'swipeEnabled' option", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            swipeEnabled: false
        }),
        pivot = $pivot.dxPivot("instance"),
        tabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    assert.strictEqual(tabs.option("swipeEnabled"), false, "swipeEnabled option was transferred to pivotTabs on init");

    pivot.option("swipeEnabled", true);
    assert.strictEqual(tabs.option("swipeEnabled"), true, "swipeEnabled option was transferred to pivotTabs on option change");
});

QUnit.test("swipe should change selected item", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance");

    var pointer = pointerMock($pivot);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(pivot.option("selectedIndex"), 1, "item selected");

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(pivot.option("selectedIndex"), 0, "item selected");
});

QUnit.test("swipe should change selected item in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
            rtlEnabled: true
        }),
        pivot = $pivot.dxPivot("instance");

    var pointer = pointerMock($pivot);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(pivot.option("selectedIndex"), 1, "item selected");

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(pivot.option("selectedIndex"), 0, "item selected");
});

QUnit.test("long fast left or right swipe should change selected index only by '1'", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
        width: 100
    });

    var startEvent = pointerMock($pivot).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxLeftOffset, 1, "maxLeftOffset of swipe is set to 1");
    assert.strictEqual(startEvent.maxRightOffset, 1, "maxRightOffset of swipe is set to 1");
});

QUnit.test("left swipe should cause correct animation", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    pointerMock($pivot).start().swipeStart().swipe(-0.5).swipeEnd(-1);

    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");
    assert.equal(this.capturedAnimations[0].type, "slideAway", "first is slideAway animation");
    assert.ok(this.capturedAnimations[0].end < 0, "wrapper animated to correct position via slideAway");
    assert.equal(this.capturedAnimations[1].type, "slideBack", "second is slideBack animation");
    assert.strictEqual(this.capturedAnimations[1].end, 0, "wrapper animated to correct position via slideBack");

    assert.strictEqual(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).completed, 1, "pivottabs animation completed");
});

QUnit.test("right swipe should cause correct animation in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        rtlEnabled: true
    });

    pointerMock($pivot).start().swipeStart().swipe(0.5).swipeEnd(1);

    assert.equal(this.capturedAnimations[0].type, "slideAway", "first is slideAway animation");
    assert.ok(this.capturedAnimations[0].end > 0, "wrapper animated to correct position via slideAway");
    assert.equal(this.capturedAnimations[1].type, "slideBack", "second is slideBack animation");
    assert.strictEqual(this.capturedAnimations[1].end, 0, "wrapper animated to correct position via slideBack");
});

QUnit.test("right swipe should cause correct animation", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    pointerMock($pivot).start().swipeStart().swipe(0.5).swipeEnd(1);

    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");
    assert.ok(this.capturedAnimations[0].end > 0, "wrapper animated to correct position via slideAway");
    assert.strictEqual(this.capturedAnimations[1].end, 0, "wrapper animated to correct position via slideBack");

    assert.strictEqual(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).completed, 1, "pivottabs animation completed");
});

QUnit.test("left swipe should cause correct animation in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        rtlEnabled: true
    });

    pointerMock($pivot).start().swipeStart().swipe(-0.5).swipeEnd(-1);

    assert.ok(this.capturedAnimations[0].end < 0, "wrapper animated to correct position via slideAway");
    assert.strictEqual(this.capturedAnimations[1].end, 0, "wrapper animated to correct position via slideBack");
});

QUnit.test("canceled swipe should cause correct animation", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    pointerMock($pivot).start().swipeStart().swipe(0.5).swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.length, 1, "animation present");
    assert.equal(this.capturedAnimations[0].type, "returnBack", "correct animation present");
    assert.strictEqual(this.capturedAnimations[0].end, 0, "wrapper animated to correct position via returnBack");

    assert.strictEqual(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).rolledBack, 1, "pivottabs animation rolled back");
});

QUnit.test("canceled swipe should cause correct animation in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        rtlEnabled: true
    });

    pointerMock($pivot).start().swipeStart().swipe(-0.5).swipeEnd(0);

    assert.strictEqual(this.capturedAnimations.length, 1, "animation present");
    assert.equal(this.capturedAnimations[0].type, "returnBack", "correct animation present");
    assert.strictEqual(this.capturedAnimations[0].end, 0, "wrapper animated to correct position via returnBack");
});

QUnit.test("item wrapper should respond to swiping", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    var $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pointerMock($pivot).start().swipeStart().swipe(0.01);
    assert.ok($itemWrapper.position().left > 0, "wrapper moves");
    assert.ok(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).offset > 0, "pivottabs move");

});

QUnit.test("item wrapper should respond to swiping correctly in RTL mode", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    var $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pointerMock($pivot).start().swipeStart().swipe(0.01);

    assert.ok($itemWrapper.position().left > 0, "wrapper moves");
    assert.ok(PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS))).offset > 0, "pivottabs move");
});

QUnit.test("item wrapper should not respond to swiping if only one item present", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }]
    });

    var startEvent = pointerMock($pivot).start().swipeStart().lastEvent();

    assert.ok(startEvent.cancel, "wrapper not moving");

});

QUnit.test("previous animation should be stopped", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    var pointer = pointerMock($pivot);

    pointer.start().swipeStart().swipe(-0.5);
    assert.equal(this.completeCount, 1, "previous animation finished");
    assert.strictEqual(pivotTabs.prepared, 1, "pivottabs animation stopped");
    pointer.swipeEnd(-1);
    assert.equal(this.completeCount, 1, "previous not finished once");
    assert.strictEqual(pivotTabs.prepared, 1, "pivottabs animation stopped only once");
});


QUnit.module("pivottabs integration", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        animation.complete = $.proxy(function() {
            this.completeCount++;
        }, this);

        pivotTabsMock.setup();
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;

        pivotTabsMock.teardown();
    }
});

QUnit.test("itemTemplateProperty should be specified correctly", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    assert.equal(pivotTabs.option("itemTemplateProperty"), "titleTemplate", "selected index forwarded");
});

QUnit.test("title template should be passed correctly", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }],
            itemTitleTemplate: function() { return 1; }
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    assert.equal(pivotTabs._getTemplateByOption("itemTemplate").render({}).text(), 1);

    pivot.option("itemTitleTemplate", function() { return 2; });
    assert.equal(pivotTabs._getTemplateByOption("itemTemplate").render({}).text(), 2);
});

QUnit.test("selectedIndex should be forwarded to pivot tabs", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivot.option("selectedIndex", 1);
    assert.equal(pivotTabs.option("selectedIndex"), 1, "selected index forwarded");
});

QUnit.test("disabled should be forwarded to pivot tabs", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivot.option("disabled", true);
    assert.equal(pivotTabs.option("disabled"), true, "disabled forwarded");
});

QUnit.test("rtlEnabled option should be forwarded to pivot tabs", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivot.option("rtlEnabled", true);
    assert.equal(pivotTabs.option("rtlEnabled"), true, "rtlEnabled forwarded");
});

QUnit.test("tab`s onUpdatePosition should update position", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivotTabs.onPrepare();
    pivotTabs.onUpdatePosition({ offset: 10 });

    assert.ok($pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS)).position().left > 0, "wrapper moves");

    assert.ok(!pivotTabs.offset, "tabs update positions not called");
});

QUnit.test("tab`s onRollback should animate rollback", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivotTabs.onPrepare();
    pivotTabs.onRollback();

    assert.strictEqual(this.capturedAnimations.length, 1, "animation present");
    assert.equal(this.capturedAnimations[0].type, "returnBack", "correct animation present");

    assert.ok(!pivotTabs.rolledBack, "tabs rollback not called");
});

QUnit.test("tab`s onSelectionChanged should animate complete", function(assert) {
    var items = [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }],
        $pivot = $("#pivot").dxPivot({
            items: items
        }),
        pivot = $pivot.dxPivot("instance"),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivotTabs.onPrepare();
    pivotTabs.option("selectedIndex", 1);
    pivotTabs.onSelectionChanged({ addedItems: [items[1]] });

    assert.strictEqual(this.capturedAnimations.length, 2, "animation present");
    assert.strictEqual(pivot.option("selectedIndex"), 1, "index changed");
});

QUnit.test("tab`s prepareAction should prepare animation", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
        }),
        pivotTabs = PivotTabsMock.getInstance($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)));

    pivotTabs.onPrepare();
    assert.equal(this.completeCount, 1, "animation finished");
    assert.equal(pivotTabs.prepared, 0, "tabs stop not called");
});
