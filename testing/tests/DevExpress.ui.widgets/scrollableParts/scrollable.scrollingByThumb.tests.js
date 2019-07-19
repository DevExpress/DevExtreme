import $ from "jquery";
import translator from "animation/translator";
import animationFrame from "animation/frame";
import Scrollbar from "ui/scroll_view/ui.scrollbar";
import pointerMock from "../../../helpers/pointerMock.js";

import "common.css!";

import {
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_SCROLLBAR_CLASS,
    SCROLLABLE_SCROLL_CLASS,
    SCROLLBAR_VERTICAL_CLASS,
    SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
    SCROLLABLE_SCROLLBAR_ACTIVE_CLASS
} from "./scrollable.constants.js";

var moduleConfig = {
    beforeEach: function() {
        var markup = '\
            <div id="scrollable" style="height: 50px; width: 50px;">\
                <div class="content1" style="height: 100px; width: 100px;"></div>\
                <div class="content2"></div>\
            </div>';
        $("#qunit-fixture").html(markup);

        this.clock = sinon.useFakeTimers();
        this._originalRequestAnimationFrame = animationFrame.requestAnimationFrame;
        animationFrame.requestAnimationFrame = function(callback) {
            callback();
        };
    },
    afterEach: function() {
        this.clock.restore();
        animationFrame.requestAnimationFrame = this._originalRequestAnimationFrame;
    }
};

var getScrollOffset = function($scrollable) {
    var $content = $scrollable.find('.' + SCROLLABLE_CONTENT_CLASS),
        $container = $scrollable.find('.' + SCROLLABLE_CONTAINER_CLASS),
        location = translator.locate($content);

    return {
        top: location.top - $container.scrollTop(),
        left: location.left - $container.scrollLeft()
    };
};

QUnit.module("scrolling by thumb", moduleConfig);

QUnit.test("normalize visibilityMode for scrollbar", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: true,
        useNative: false
    });

    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option("visibilityMode"), "onScroll", "true normalize to onScroll");

    $scrollable.dxScrollable("option", "showScrollbar", false);

    scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));
    assert.equal(scrollbar.option("visibilityMode"), "never", "true normalize to onScroll");
});

QUnit.test("scroll by thumb", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        location,
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        containerToContentRatio = (containerHeight / contentHeight);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("update");

    mouse.down();
    var downEvent = mouse.lastEvent();
    mouse.move(0, distance);
    location = getScrollOffset($scrollable);

    assert.notOk(downEvent.isDefaultPrevented(), "default is not prevented"); // T516691
    assert.equal(location.top, -distance / containerToContentRatio, "scroll follows pointer");

    mouse.move(0, distance);
    location = getScrollOffset($scrollable);
    assert.equal(location.top, -2 * distance / containerToContentRatio, "scroll follows pointer everytime");
});

QUnit.test("scrollTo should scroll to correct position during scroll by thumb", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS),
        instance = $scrollable.dxScrollable("instance");

    $container.height(containerHeight);
    $content.height(contentHeight);
    instance.update();

    mouse.down().move(0, 10);
    instance.scrollTo(30);

    assert.equal(instance.scrollTop(), 30, "scroll has correct position");
});

QUnit.test("scroll by thumb without scrolling by content", function(assert) {
    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        scrollByContent: false,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $container.height(containerHeight);
    $content.height(contentHeight);
    $scrollable.dxScrollable("update");

    mouse.down().move(0, distance);
    assert.notEqual(getScrollOffset($scrollable).top, 0, "scroll follows pointer");
});

QUnit.test("scroll by thumb should prevent scrolling cross direction", function(assert) {
    var containerSize = 50,
        contentSize = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        direction: "both",
        scrollByThumb: true,
        scrollByContent: true,
        bounceEnabled: false,
        inertiaEnabled: false,
        useNative: false
    });

    var $thumb = $scrollable.find("." + SCROLLBAR_VERTICAL_CLASS + " ." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS),
        $content = $scrollable.find("." + SCROLLABLE_CONTENT_CLASS);

    $container
        .height(containerSize)
        .width(containerSize);
    $content
        .height(contentSize)
        .width(contentSize);
    $scrollable.dxScrollable("update");

    mouse.down().move(-distance, distance);
    assert.equal(getScrollOffset($scrollable).left, 0, "horizontal scrolling prevented");
});

QUnit.test("thumb is visible on mouseenter when thumbMode='onHover'", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden after scrollable creation");

    $container.trigger("mouseenter");

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after mouse enter");

    $container.trigger("mouseleave");

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden after mouse leave");
});

QUnit.test("thumb is visible after update when content became more then container", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    var $innerWrapper = $scrollable.wrapInner("<div>").children().height(50);

    $scrollable.dxScrollable({
        showScrollbar: "onHover",
        useNative: false
    });

    var scrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var $container = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $container.trigger("mouseenter");

    assert.equal(scrollbar.option("visible"), false, "thumb is hidden when content less then container");

    $innerWrapper.height(200);
    $scrollable.dxScrollable("update");

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after update");
});

QUnit.test("thumb hide after scroll when showScrollbar = onScroll", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onScroll',
        inertiaEnabled: false,
        useNative: false
    });

    var $content = $("." + SCROLLABLE_CONTENT_CLASS, $scrollable);
    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);

    $scrollbar.trigger("mouseenter");
    pointerMock($content).start().wheel(1);

    assert.equal(scrollbar.option("visible"), false, "thumb is visible after scroll");
});

QUnit.test("thumb stays visible after scroll when mouseEnter on scrollbar and scroll stopped", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'onHover',
        inertiaEnabled: false,
        useNative: false
    });

    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable));

    $container.trigger("mouseenter");
    pointerMock($container).start().wheel(1);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible after mouse enter");
});

QUnit.test("thumb always visible when showScroll = always", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        inertiaEnabled: false,
        useNative: false
    });

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible always");

    pointerMock($("." + SCROLLABLE_CONTENT_CLASS, $scrollable)).start().wheel(1);

    assert.equal(scrollbar.option("visible"), true, "thumb is visible always");
});

QUnit.test("always visible class should be added when showScrollbar = always", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), true, "class added");

    $scrollable.dxScrollable("option", "showScrollbar", "never");
    assert.equal($scrollable.hasClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE), false, "class added");
});

QUnit.test("showScrollbar option change", function(assert) {
    var $scrollable = $("#scrollable").height(100);
    $scrollable.children().height(200);

    $scrollable.dxScrollable({
        showScrollbar: 'always',
        useNative: false
    });

    $scrollable.dxScrollable("option", "showScrollbar", "never");

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable),
        scrollbar = Scrollbar.getInstance($scrollbar);

    assert.equal($scrollbar.is(":hidden"), true);
    assert.equal(scrollbar.option("visible"), false);
});

QUnit.test("scrolling by thumb does not cause inertia", function(assert) {
    assert.expect(1);

    var containerHeight = 50,
        contentHeight = 100;

    var $scrollable = $("#scrollable").dxScrollable({
        scrollByThumb: true,
        useNative: false,
        onEnd: function() {
            var location = getScrollOffset($scrollable);
            assert.equal(location.top, -2 * distance / containerToContentRatio, "no inertia");
        }
    });

    $scrollable.find("." + SCROLLABLE_CONTENT_CLASS).height(contentHeight);

    var $thumb = $scrollable.find("." + SCROLLABLE_SCROLL_CLASS),
        mouse = pointerMock($thumb).start(),
        distance = 10,
        containerToContentRatio = (containerHeight / contentHeight);

    $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).height(containerHeight);

    $scrollable.dxScrollable("update");

    mouse
        .down()
        .move(0, distance)
        .wait(20)
        .move(0, distance)
        .up();
});

QUnit.test("thumb is visible on mouseenter when thumbMode='onHover' only for single scrollable nested in another scrollable", function(assert) {
    var $scrollable = $("#scrollable");
    var $wrapScrollable = $scrollable.wrap("<div>").parent();

    $wrapScrollable.height(10);
    $scrollable.height(20);
    $scrollable.children().height(30);

    var scrollableOption = {
        useNative: false,
        showScrollbar: "onHover"
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    var $scrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $wrapScrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);
    var $scrollableScrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollableScrollbar = Scrollbar.getInstance($scrollableScrollbar);
    var wrapScrollableScrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $wrapScrollable).not($scrollableScrollbar));

    $wrapScrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));
    $scrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));

    assert.equal(scrollableScrollbar.option("visible"), true, "scrollbar is visible for inner scrollable");
    assert.equal(wrapScrollableScrollbar.option("visible"), false, "scrollbar is hidden for outer scrollable");
});

QUnit.test("scroll by thumb does not hide scrollbar when mouse goes outside of scrollable", function(assert) {
    var $scrollable = $("#scrollable").dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        scrollByContent: true
    });

    var $scrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollbar = Scrollbar.getInstance($scrollbar);
    var $container = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);

    $container.trigger($.Event("mouseenter", { originalEvent: {} }));

    pointerMock($container)
        .start()
        .down()
        .move(0, -1);


    assert.equal(scrollbar.option("visible"), true, "scrollbar is visible");

    $container.trigger($.Event("mouseleave", { originalEvent: {} }));

    assert.equal(scrollbar.option("visible"), true, "scrollbar is visible after mouseleave");
});

QUnit.test("leaving inner scroller and releasing in outer scroller should hide inner scrollbar and show outer scrollbar", function(assert) {
    var $scrollable = $("#scrollable");
    var $wrapScrollable = $scrollable.wrap("<div>").parent();

    $wrapScrollable.height(10);
    $scrollable.height(20);
    $scrollable.children().height(30);

    var scrollableOption = {
        useNative: false,
        inertiaEnabled: false,
        showScrollbar: "onHover"
    };

    $scrollable.dxScrollable(scrollableOption);
    $wrapScrollable.dxScrollable(scrollableOption);

    var $scrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $scrollable);
    var $wrapScrollableContainer = $("." + SCROLLABLE_CONTAINER_CLASS, $wrapScrollable).not($scrollableContainer);
    var $scrollableScrollbar = $("." + SCROLLABLE_SCROLLBAR_CLASS, $scrollable);
    var scrollableScrollbar = Scrollbar.getInstance($scrollableScrollbar);
    var wrapScrollableScrollbar = Scrollbar.getInstance($("." + SCROLLABLE_SCROLLBAR_CLASS, $wrapScrollable).not($scrollableScrollbar));

    // enter outer
    $wrapScrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));
    // enter inner
    $scrollableContainer.trigger($.Event("mouseenter", { originalEvent: {} }));

    // start scrolling inner
    pointerMock($scrollableContainer).start().down().move(0, 10);
    // leaving inner
    $scrollableContainer.trigger($.Event("mouseleave", { relatedTarget: $wrapScrollableContainer.get(0) }));
    // up on outer
    pointerMock($wrapScrollableContainer).up();

    assert.equal(scrollableScrollbar.option("visible"), false, "scrollbar is hidden for inner scrollable");
    assert.equal(wrapScrollableScrollbar.option("visible"), true, "scrollbar is visible for outer scrollable");
});

QUnit.test("scrollbar is visible for parent scrollable after mouse leave for children scrollable", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50);

    $childScrollable.append("<div>").children().height(75);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });

    var $parentContainer = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).eq(0);
    var $childrenContainer = $childScrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event("mouseenter", { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event("mouseenter", { originalEvent: { target: $childrenContainer.get(0) } }));

    var childrenScrollbar = Scrollbar.getInstance($childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var parentScrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not(childrenScrollbar.$element()));

    assert.equal(parentScrollbar.option("visible"), false, "parent scrollbar is hidden");
    assert.equal(childrenScrollbar.option("visible"), true, "children scrollbar is visible");

    $childScrollable.triggerHandler($.Event("mouseleave", { relatedTarget: $parentContainer.get(0) }));

    assert.equal(parentScrollbar.option("visible"), true, "parent scrollbar is visible");
    assert.equal(childrenScrollbar.option("visible"), false, "children scrollbar is hidden");
});

QUnit.test("scrollbar is visible for parent scrollable after start", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50);

    $childScrollable.append("<div>").children().height(75);
    $childScrollable.appendTo($scrollable).dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });

    var $parentContainer = $scrollable.find("." + SCROLLABLE_CONTAINER_CLASS).eq(0);
    var $childrenContainer = $childScrollable.find("." + SCROLLABLE_CONTAINER_CLASS);

    $parentContainer.trigger($.Event("mouseenter", { originalEvent: { target: $parentContainer.get(0) } }));
    $childrenContainer.trigger($.Event("mouseenter", { originalEvent: { target: $childrenContainer.get(0) } }));
    pointerMock($childrenContainer).start().down().move(0, 10);
    $childrenContainer.trigger($.Event("mouseleave", { originalEvent: { target: $childrenContainer.get(0) } }));

    var childrenScrollbar = Scrollbar.getInstance($childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS));
    var parentScrollbar = Scrollbar.getInstance($scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not(childrenScrollbar.$element()));

    assert.equal(parentScrollbar.option("visible"), false, "parent scrollbar is hidden");
    assert.equal(childrenScrollbar.option("visible"), true, "children scrollbar is visible");
});

QUnit.test("scrollbar set active state only for one scrollable when direction of parentScrollable is horizontal and direction of innerScrollable is vertical", function(assert) {
    var $scrollable = $("#scrollable").height(25);
    var $childScrollable = $("<div>").height(50).appendTo($scrollable);
    $childScrollable.append("<div>").children().height(75);
    $childScrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "vertical"
    });
    $scrollable.dxScrollable({
        useNative: false,
        showScrollbar: "onHover",
        direction: "horizontal"
    });

    var $childScrollbar = $childScrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS);
    var $scrollbar = $scrollable.find("." + SCROLLABLE_SCROLLBAR_CLASS).not($childScrollbar);

    pointerMock($childScrollable).start()
        .down()
        .up();

    assert.equal($childScrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, "child scrollbar has not active state");
    assert.equal($scrollbar.hasClass(SCROLLABLE_SCROLLBAR_ACTIVE_CLASS), false, "scrollbar has not active state");
});
