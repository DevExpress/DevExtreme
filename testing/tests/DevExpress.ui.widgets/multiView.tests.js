import $ from "jquery";
import fx from "animation/fx";
import translator from "animation/translator";
import domUtils from "core/utils/dom";
import devices from "core/devices";
import { isRenderer } from "core/utils/type";
import config from "core/config";
import { animation } from "ui/multi_view";
import pointerMock from "../../helpers/pointerMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";
import Swipeable from "events/gesture/swipeable";

import "common.css!";
import "ui/multi_view";

QUnit.testStart(() => {
    const markup =
        `<style>
            #animated {
                position: absolute;
            }
            
            #multiView {
                width: 800px;
                height: 1000px;
            }
        </style>
        
        <div id="animated"></div>
        <div id="container">
            <div id="multiView"></div>
        </div>
        <div id="container2">
            <div id="customMultiView">
                <div data-options="dxTemplate: { name: 'template1' }" style="height: 50px;"></div>
                <div data-options="dxTemplate: { name: 'template2' }" style="height: 100px;"></div>
            </div>
        </div>
        <div id="container3">
            <div id="customMultiViewWithTemplate">
            </div>
            <div id="template1"><p>Test1</p></div>
            <div id="template2"><p>Test2</p></div>
        </div>`;

    $("#qunit-fixture").html(markup);
});

const MULTIVIEW_CLASS = "dx-multiview";
const MULTIVIEW_ITEM_CONTAINER_CLASS = "dx-multiview-item-container";

const MULTIVIEW_ITEM_CLASS = "dx-multiview-item";
const MULTIVIEW_ITEM_CONTENT_CLASS = "dx-multiview-item-content";
const MULTIVIEW_ITEM_HIDDEN_CLASS = "dx-multiview-item-hidden";

const toSelector = cssClass => `.${cssClass}`;

const position = $element => translator.locate($element).left;

const mockFxAnimate = (animations, type, output, startAction) => {
    animations[type] = ($element, position, duration, endAction) => {
        position = position || 0;

        output.push({
            $element: $element,
            type: type,
            start: translator.locate($element).left,
            duration: duration,
            end: position
        });

        if(startAction) {
            startAction();
        }

        translator.move($element, { left: position });

        if(endAction) {
            endAction();
        }
    };
};

const animationCapturing = {
    start(animationStartAction) {
        this._capturedAnimations = [];

        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, "moveTo", this._capturedAnimations, animationStartAction);

        return this._capturedAnimations;
    },
    teardown() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.module("rendering");

QUnit.test("height should be correctly updated on dxshown event", function(assert) {
    var $container;

    try {
        $container = $("<div>");

        var $multiView = $("#customMultiView").appendTo($container).dxMultiView({
            items: [{ template: 'template1' }, { template: 'template2' }],
            selectedIndex: 0,
            height: 'auto'
        });

        $container.appendTo("#qunit-fixture");
        domUtils.triggerShownEvent($container);

        var $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));
        assert.equal($items.eq(0).outerHeight(), $multiView.outerHeight(), "element has correct height");
    } finally {
        $container.remove();
    }
});

QUnit.test("multiView should trigger resize event for item content after item visibility changed", function(assert) {
    var resizeHandler = sinon.spy();

    $("#customMultiView").dxMultiView({
        items: [{
            template: function() {
                return $("<div>", { class: "dx-visibility-change-handler" }).on("dxresize", resizeHandler);
            }
        }, { template: 'template2' }],
        selectedIndex: 0,
        height: 'auto'
    });

    assert.ok(resizeHandler.called, "event has been triggered");
});

QUnit.test("item content should be rendered correctly when template was changed (T585645)", function(assert) {
    var $multiView = $("#customMultiViewWithTemplate").dxMultiView({
            items: [{ template: $("#template1") }, { template: $("#template1") }],
            selectedIndex: 0
        }),
        multiView = $multiView.dxMultiView("instance");

    multiView.option("items[1].template", $("#template2"));
    multiView.option("selectedIndex", 1);

    var $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.equal($items.eq(1).text(), "Test2", "element has correct content");
});

QUnit.test("item should stay hidden after changing template (T613732)", function(assert) {
    var $multiView = $("#customMultiViewWithTemplate").dxMultiView({
            items: [{ template: $("#template1") }, { template: $("#template1") }],
            selectedIndex: 0
        }),
        multiView = $multiView.dxMultiView("instance");

    multiView.option("items[1].template", $("#template2"));

    var $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.notOk($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), "first item is visible");
    assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), "second item is still hidden");
});

QUnit.module("nested multiview");

QUnit.test("inner multiview items should not be overlapped by nested multiview items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3, 4],
            itemTemplate: function() {
                return $("<div>").dxMultiView({
                    items: [1, 2]
                });
            }
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

    $multiView.dxMultiView("option", "selectedIndex", 3);

    var $items = $itemContainer.children(toSelector(MULTIVIEW_ITEM_CLASS));
    assert.ok(!$items.eq(3).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), "correct item selected");
});

QUnit.test("pointerdown should not affect to parent multiview (T306118)", function(assert) {
    if(devices.real() !== "generic") {
        assert.ok(true, "skip test on mobile phones");
        return;
    }

    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            itemTemplate: function() {
                return $("<div>").dxMultiView({ items: [3, 4] });
            }
        }),
        outerMultiView = $multiView.dxMultiView("instance"),
        $outerItemElements = $multiView.dxMultiView("itemElements"),
        $outerFirstItem = $outerItemElements.eq(0),
        $innerMultiView = $outerFirstItem.find("." + MULTIVIEW_CLASS),
        $innerSecondItem = $innerMultiView.dxMultiView("itemElements").get(1);

    $($outerItemElements.eq(0)).trigger($.Event("dxpointerdown", { target: $innerSecondItem }));

    assert.equal($(outerMultiView.option("focusedElement")).get(0), $outerItemElements.get(0), "focusedElement was not changed if event's target is not part of the widget");
});


QUnit.module("items positioning", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("selected item should have correct position", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        }),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.equal(position($items.eq(0)), 0, "first item has correct position");

    $multiView.dxMultiView("option", "selectedIndex", 2);
    assert.equal(position($items.eq(2)), 0, "third item has correct position");
});

QUnit.test("only selected item should be visible", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        }),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));

    $multiView.dxMultiView("instance").option("selectedIndex", 1);

    assert.ok($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok(!$items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));

    $multiView.dxMultiView("instance").option("selectedIndex", 2);

    assert.ok($items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
});


QUnit.module("animations", {
    beforeEach: function() {
        fx.off = true;

        this.$animated = $("#animated");
    },
    afterEach: function() {
        fx.off = false;

        translator.move(this.$animated, { left: 0 });
    }
});

QUnit.test("moveTo", function(assert) {
    translator.move(this.$animated, { left: 100 });

    animation.moveTo(this.$animated, 50);
    assert.strictEqual(position(this.$animated), 50, "animated to correct position");
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
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this._animationStartAction;
    }
});

QUnit.test("index increment should cause correct animation", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

    multiView.option("selectedIndex", 1);

    assert.equal(this.capturedAnimations[0].$element[0], $itemContainer[0], "item container animated");
    assert.equal(this.capturedAnimations[0].start, 0, "correct start position");
    assert.equal(this.capturedAnimations[0].end, -800, "correct end position");

    assert.equal(position($itemContainer), 0, "item container moved back");
});

QUnit.test("index reduction should cause correct animation", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

    multiView.option("selectedIndex", 1);

    assert.equal(this.capturedAnimations[0].$element[0], $itemContainer[0], "item container animated");
    assert.equal(this.capturedAnimations[0].start, 0, "correct start position");
    assert.equal(this.capturedAnimations[0].end, 800, "correct end position");

    assert.equal(position($itemContainer), 0, "item container moved back");
});

QUnit.test("index change from first to last should prepare items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    this.animationStartAction = function() {
        assert.equal(position($items.eq(0)), 0, "first item has correct position");
        assert.equal(position($items.eq(2)), 800, "third item has correct position");
        assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    };

    multiView.option("selectedIndex", 2);
});

QUnit.test("index change from last to first should prepare items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    this.animationStartAction = function() {
        assert.equal(position($items.eq(0)), -800, "first item has correct position");
        assert.equal(position($items.eq(2)), 0, "third item has correct position");
        assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
        assert.ok(!$items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    };

    multiView.option("selectedIndex", 0);
});

QUnit.test("item container should be animated with zero duration if option animationEnabled is false", function(assert) {
    $("#multiView").dxMultiView({
        items: [1, 2, 3],
        animationEnabled: false
    });

    var multiView = $("#multiView").dxMultiView("instance");

    multiView.option("selectedIndex", 1);

    assert.equal(this.capturedAnimations[0].duration, 0, "animation duration is 0");
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
    $("#multiView").dxMultiView({
        items: [1, 2, 3],
        animationEnabled: false,
        selectedIndex: 0
    });

    var multiView = $("#multiView").dxMultiView("instance");

    $(multiView.itemElements()).eq(1).trigger("dxclick");
    assert.equal(multiView.option("selectedIndex"), 0, "selected index not changed");
});


QUnit.module("interaction via swipe", {
    beforeEach: function() {
        this.capturedAnimations = animationCapturing.start();

        this.origCompleteAnimation = animation.complete;
        this.completeCount = 0;
        this.completeElement = null;
        animation.complete = $.proxy(function(element) {
            this.completeCount++;
            this.completeElement = element;
        }, this);
    },
    afterEach: function() {
        animationCapturing.teardown();

        animation.complete = this.origCompleteAnimation;
    }
});

QUnit.test("item container should not be moved by swipe if items count less then 2", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1]
    });

    var startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxRightOffset, undefined, "container was not be moved");
});

QUnit.test("widget shouldn't handle dxswipe events if swipeEnabled is false", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            swipeEnabled: false
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd();
    assert.equal(multiView.option("selectedIndex"), 0, "selected index is not changed by swipe");
});

QUnit.test("widget shouldn't handle dxswipe events if swipeEnabled set to false dynamically", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            swipeEnabled: true
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    multiView.option("swipeEnabled", false);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd();

    assert.equal(multiView.option("selectedIndex"), 0, "selected index is not changed by swipe");
});

QUnit.test("item container should be moved by swipe", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3]
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.1);
    assert.equal(position($itemContainer), -$itemContainer.width() / 10, "container moved");
    pointer.swipeEnd();
});

QUnit.test("selected index should be changed after swipe", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(multiView.option("selectedIndex"), 1, "selected index was changed");
});

QUnit.test("item container should be animated back after canceled swipe", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(0.2).swipeEnd();
    assert.equal(multiView.option("selectedIndex"), 2, "selected index was not changed");
    assert.equal(this.capturedAnimations[0].end, 0, "container moved back");
});

QUnit.test("item container should not be moved right if selected index is 0", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1, 2, 3],
        selectedIndex: 0
    });

    var startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxRightOffset, 0, "container was not be moved");
});

QUnit.test("item container should not be moved left if selected index is 0 in RTL mode", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        rtlEnabled: true,
        items: [1, 2, 3],
        selectedIndex: 0
    });

    var startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxLeftOffset, 0, "container was not be moved");
});

QUnit.test("item container should not be moved right if selected index is last in RTL mode", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        rtlEnabled: true,
        items: [1, 2, 3],
        selectedIndex: 2
    });

    var startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxRightOffset, 0, "container was not be moved");
});

QUnit.test("item container should not be moved left if selected index is last", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1, 2, 3],
        selectedIndex: 2
    });

    var startEvent = pointerMock($multiView).start().swipeStart().lastEvent();

    assert.strictEqual(startEvent.maxLeftOffset, 0, "container was not be moved");
});

QUnit.test("item container left animation should  be completed correctly if selected index is last", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.2);
    assert.equal(this.completeCount, 1, "previous animation completed");
    assert.equal(this.completeElement[0], $itemContainer[0], "completed correct animation");
    pointer.swipeEnd();
});

QUnit.test("item container should not be moved if option swipeEnabled is false", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            swipeEnabled: false
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.1);
    assert.equal(position($itemContainer), 0, "container was not moved");
    pointer.swipeEnd();
});

QUnit.test("swipe with focusStateEnabled false (T319963)", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            swipeEnabled: true,
            focusStateEnabled: false
        }),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);

    assert.equal($multiView.find(".dx-state-focused").length, 0, "there is no focused class on any item");
});


QUnit.module("loop", {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this.animationStartAction;
    }
});

QUnit.test("item container should be moved right if selected index is 0", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(0.1);
    assert.equal(position($itemContainer), $itemContainer.width() / 10, "container was moved");
    pointer.swipeEnd();
});

QUnit.test("item container should be moved left if selected index is last", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.1);
    assert.equal(position($itemContainer), -$itemContainer.width() / 10, "container was  moved");
    pointer.swipeEnd();
});

QUnit.test("selected index should be set to last item after right swipe from first one", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(0.5).swipeEnd(1);
    assert.equal(multiView.option("selectedIndex"), 2, "selected index changed correctly");
});

QUnit.test("selected index should be set to first item after left swipe from last one", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        }),
        multiView = $("#multiView").dxMultiView("instance"),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(multiView.option("selectedIndex"), 0, "selected index changed correctly");
});

QUnit.test("selected index change from first item to last via right swipe should cause correct animation", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        }),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
    assert.equal(this.capturedAnimations[0].end, 800, "animated correctly");

});

QUnit.test("selected index change from last item to first via left swipe should cause correct animation", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        }),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(this.capturedAnimations[0].end, -800, "animated correctly");
});

QUnit.test("index change from first item to last should prepare items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0,
            loop: true
        }),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS)),
        pointer = pointerMock($multiView);

    this.animationStartAction = function() {
        assert.equal(position($items.eq(0)), 0, "first item has correct position");
        assert.equal(position($items.eq(2)), -800, "third item has correct position");
    };

    pointer.start().swipeStart().swipe(0.1).swipeEnd(1);
});

QUnit.test("index change from last item to first should prepare items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 2,
            loop: true
        }),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS)),
        pointer = pointerMock($multiView);

    this.animationStartAction = function() {
        assert.equal(position($items.eq(0)), 800, "first item has correct position");
        assert.equal(position($items.eq(2)), 0, "third item has correct position");
    };

    pointer.start().swipeStart().swipe(-0.1).swipeEnd(-1);
});

QUnit.test("second item should have correct position if swipe present at first one", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            loop: true
        }),
        $item1 = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS)).eq(1),
        pointer = pointerMock($multiView);

    pointer.start().swipeStart().swipe(-0.01);
    assert.equal(position($item1), 800, "item positioned correctly");
    pointer.swipe(0.02);
    assert.equal(position($item1), -800, "item positioned correctly");
    pointer.swipeEnd();
});


QUnit.module("defer rendering", {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        animationCapturing.start(this._animationStartAction);

        this.items = [
            { text: "Greg" },
            { text: "31" },
            { text: "Charlotte" },
            { text: "programmer" }
        ];

        this.$element = $("#multiView");
    },
    afterEach: function() {
        animationCapturing.teardown();
        delete this.animationStartAction;

        this.$element.remove();
    }
});

QUnit.test("onItemRendered should be fired after item was rendered", function(assert) {
    var renderedItems = [];
    var $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true,
            onItemRendered: function(args) {
                renderedItems.push(args.itemData);
            }
        }),
        instance = $element.dxMultiView("instance");

    assert.deepEqual(renderedItems, [this.items[0]], "item was rendered");

    instance.option("selectedIndex", 1);
    assert.deepEqual(renderedItems, [this.items[0], this.items[1]], "item was rendered");
});

QUnit.test("item content should be rendered for selected item if deferRendering is true", function(assert) {
    var $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true
        }),
        instance = $element.dxMultiView("instance");

    assert.equal($element.find("." + MULTIVIEW_ITEM_CONTENT_CLASS).length, 1, "only one item is rendered on init");

    instance.option("selectedIndex", 1);
    assert.equal($element.find("." + MULTIVIEW_ITEM_CONTENT_CLASS).length, 2, "selected item is rendered");
});

QUnit.test("item content should be rendered for animated item if deferRendering is true", function(assert) {
    var $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true
        }),
        instance = $element.dxMultiView("instance");

    this.animationStartAction = function() {
        assert.equal($element.find("." + MULTIVIEW_ITEM_CLASS).eq(1).find("." + MULTIVIEW_ITEM_CONTENT_CLASS).length, 1, "animated item is rendered");
    };
    instance.option("selectedIndex", 1);
});

QUnit.test("widget should be rerendered on the deferRendering option change", function(assert) {
    var renderCount = 0,
        $element = this.$element.dxMultiView({
            items: this.items,
            selectedIndex: 0,
            deferRendering: true,
            onContentReady: function() {
                renderCount++;
            }
        }),
        instance = $element.dxMultiView("instance");

    var expectedRenderCount = 1;

    instance.option("deferRendering", false);
    expectedRenderCount++;
    assert.equal(renderCount, expectedRenderCount, "widget was rerendered one time on option changed");

    instance.option("deferRendering", true);
    expectedRenderCount++;
    assert.equal(renderCount, expectedRenderCount, "widget was rerendered one time on option changed");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        this._animationStartAction = $.proxy(function() {
            if(this.animationStartAction) {
                this.animationStartAction();
            }
        }, this);
        this.capturedAnimations = animationCapturing.start(this._animationStartAction);
    },
    afterEach: function() {
        animationCapturing.teardown();

        delete this.animationStartAction;
    }
});

QUnit.test("selected item should have focus after swipe", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2, 3, 4],
            selectedIndex: 0,
            focusStateEnabled: true
        }),
        multiView = $multiView.dxMultiView("instance"),
        $item1 = $(multiView.itemElements()).eq(1);

    pointerMock($multiView).start().swipeStart().swipe(-0.5).swipeEnd(-1);
    assert.equal(isRenderer(multiView.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
    assert.ok($item1.hasClass("dx-state-focused"), "item obtained focus after swipe");
    assert.equal(this.capturedAnimations[0].end, -800, "animated correctly");
});

QUnit.test("items should be animated in correct direction if looping through items from first to last", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1, 2],
        selectedIndex: 0,
        loop: true,
        animationEnabled: true,
        focusStateEnabled: true
    });

    $multiView.focusin();
    keyboardMock($multiView).keyDown("left");
    assert.equal(this.capturedAnimations[0].end, 800, "animated correctly");
});

QUnit.test("items should be animated in correct direction if looping through items from last to first", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1, 2],
        selectedIndex: 1,
        loop: true,
        animationEnabled: true,
        focusStateEnabled: true
    });

    $multiView.focusin();
    keyboardMock($multiView).keyDown("right");
    assert.equal(this.capturedAnimations[0].end, -800, "animated correctly");
});

QUnit.test("items should be animated in correct direction after looping through items", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
        items: [1, 2],
        selectedIndex: 1,
        loop: true,
        animationEnabled: true,
        focusStateEnabled: true
    });

    $multiView.focusin();
    keyboardMock($multiView).keyDown("right");
    keyboardMock($multiView).keyDown("right");
    assert.equal(this.capturedAnimations[1].end, -800, "animated correctly");
});


QUnit.module("aria accessibility", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("selected item should have unique id", function(assert) {
    var $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            focusStateEnabled: true,
            selectedIndex: 0
        }),
        instance = $multiView.dxMultiView("instance"),
        id = instance.getFocusedItemId().toString(),
        $item0 = $multiView.find(".dx-multiview-item:eq(0)"),
        $item1 = $multiView.find(".dx-multiview-item:eq(1)");

    $multiView.focusin();

    assert.equal($item0.attr("id"), id, "selected 1st item has correct id");
    assert.equal($item1.attr("id"), undefined, "unselected item has no id");

    instance.option("selectedIndex", 1);
    instance.option("focusedElement", $item1);

    assert.equal($item1.attr("id"), id, "selected 2nd item has correct id");
    assert.equal($item0.attr("id"), undefined, "unselected item has no id");
});

QUnit.test("inactive item should have aria-hidden attribute", function(assert) {
    var $element = $("#multiView").dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            animationEnabled: false
        }),
        $item0 = $element.find(".dx-multiview-item:eq(0)"),
        $item1 = $element.find(".dx-multiview-item:eq(1)"),
        instance = $element.dxMultiView("instance");

    assert.equal($item0.attr("aria-hidden"), undefined, "aria-hidden does not exist for 1st item");
    assert.equal($item1.attr("aria-hidden"), "true", "aria-hidden is true for 2nd item");

    instance.option("selectedIndex", 1);

    assert.equal($item0.attr("aria-hidden"), "true", "aria-hidden is true for 1st item");
    assert.equal($item1.attr("aria-hidden"), undefined, "aria-hidden does not exist for 2nd item");
});

QUnit.module("swipeable disabled state", () => {
    QUnit.test("{items: [], swipeEnabled: false}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: false} -> items: [1, 2]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1, 2]);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: false} -> items: [1, 2], swipeEnabled: true", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1, 2]);
        multiView.option("swipeEnabled", true);

        assert.equal(swipeable.option("disabled"), false, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: false} -> swipeEnabled: true", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", true);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: true}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: true} -> items: [1, 2]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1, 2]);

        assert.equal(swipeable.option("disabled"), false, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: true} -> items: [1, 2], swipeEnabled: false", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1, 2]);
        multiView.option("swipeEnabled", false);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: true} -> swipeEnabled: false", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", false);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [], swipeEnabled: true} -> swipeEnabled: false, items: [1, 2]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", false);
        multiView.option("items", [1, 2]);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1], swipeEnabled: false}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1], swipeEnabled: true}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: false}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: false} -> items: [], swipeEnabled: true", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", []);
        multiView.option("swipeEnabled", true);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: false} -> swipeEnabled: true", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: false
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", true);

        assert.equal(swipeable.option("disabled"), false, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true}", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        assert.equal(swipeable.option("disabled"), false, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true} -> items: []", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", []);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true} -> items: [1]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1]);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true} -> items: [1,2,3]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("items", [1, 2, 3]);

        assert.equal(swipeable.option("disabled"), false, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), true, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true} -> swipeEnabled: false", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", false);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });

    QUnit.test("{items: [1, 2], swipeEnabled: true} -> swipeEnabled: false, items: [1,2,3]", function(assert) {
        const $multiView = $("#multiView").dxMultiView({
            items: [1, 2],
            swipeEnabled: true
        });
        const multiView = $multiView.dxMultiView("instance");
        const swipeable = Swipeable.getInstance($multiView);

        multiView.option("swipeEnabled", false);
        multiView.option("items", [1, 2, 3]);

        assert.equal(swipeable.option("disabled"), true, "Swipeable.disabled");
        assert.equal(multiView.option("swipeEnabled"), false, "MultiView.swipeEnabled");
    });
});
