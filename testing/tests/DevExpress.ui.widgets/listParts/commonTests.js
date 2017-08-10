"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    fx = require("animation/fx"),
    DataSource = require("data/data_source/data_source").DataSource,
    ArrayStore = require("data/array_store"),
    List = require("ui/list"),
    executeAsyncMock = require("../../../helpers/executeAsyncMock.js"),
    pointerMock = require("../../../helpers/pointerMock.js"),
    keyboardMock = require("../../../helpers/keyboardMock.js"),
    registerComponent = require("core/component_registrator"),
    DOMComponent = require("core/dom_component"),
    holdEvent = require("events/hold"),
    swipeEvents = require("events/swipe"),
    ScrollView = require("ui/scroll_view");

var LIST_CLASS = "dx-list",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_GROUP_CLASS = "dx-list-group",
    LIST_GROUP_HEADER_CLASS = "dx-list-group-header",
    LIST_GROUP_BODY_CLASS = "dx-list-group-body";

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var ScrollViewMock = DOMComponent.inherit({

    NAME: "dxScrollView",

    _init: function() {
        var content = this.element().find(".scroll-view-content");
        if(content.length) {
            this._$scrollViewContent = content;
        } else {
            this._$scrollViewContent = $("<div />").addClass("scroll-view-content");
            this.element().append(this._$scrollViewContent);
        }

        this.callBase();

        this._history = [];
        this._updateCount = 0;
        this._pageLoading = true;
        this._loading = false;
        this._pos = 0;
    },

    content: function() {
        return this._$scrollViewContent;
    },

    pullDown: function() {
        var pullDownHandler = this.option("onPullDown");
        if($.isFunction(pullDownHandler)) {
            pullDownHandler();
        }
    },

    scrollBottom: function() {
        var scrollBottomHandler = this.option("onReachBottom");

        if($.isFunction(scrollBottomHandler)) {
            scrollBottomHandler();
        }
    },

    release: function(hideOrShow) {
        this._history.push(new Date());
        this.toggleLoading(!hideOrShow);
        $(this.element()).trigger("released");
    },

    toggleLoading: function(showOrHide) {
        this._pageLoading = showOrHide;
    },

    update: function() {
        this._updateCount++;
        return $.Deferred().resolve().promise();
    },

    isFull: function() {
        return true;
    },

    startLoading: function() {
        this._loading = true;
    },

    finishLoading: function() {
        this._loading = false;
    },

    scrollTo: function(pos) {
        this._pos = pos;
    },

    scrollTop: function() {
        return this._pos;
    },

    scrollOffset: function() {
        return { top: this._pos };
    }
});

var moduleSetup = {
    beforeEach: function() {
        executeAsyncMock.setup();

        this.element = $("#list");

        this.originalScrollView = ScrollView;
        List.mockScrollView(ScrollViewMock);
        registerComponent("dxScrollView", ScrollViewMock);

        this.clock = sinon.useFakeTimers();
        $.fx.off = true;
    },
    afterEach: function() {
        executeAsyncMock.teardown();

        List.mockScrollView(ScrollView);
        registerComponent("dxScrollView", this.originalScrollView);

        this.clock.restore();
        $.fx.off = false;
    }
};


QUnit.module("rendering", moduleSetup);

QUnit.test("rendering empty message for empty list", function(assert) {
    var element = this.element.dxList();
    assert.equal(element.find(".dx-empty-message").length, 1, "empty message was rendered");
});

QUnit.test("default", function(assert) {
    var element = this.element.dxList({ items: ["0", "1"] });
    assert.ok(element.hasClass(LIST_CLASS));

    var items = element.find(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 2);
    assert.ok(items.eq(0).hasClass(LIST_ITEM_CLASS));
    assert.ok(items.eq(1).hasClass(LIST_ITEM_CLASS));
    assert.equal($.trim(items.text()), "01", "all items rendered");
});

QUnit.test("itemTemplate default", function(assert) {
    var element = this.element.dxList({
        items: ["a", "b"],
        itemTemplate: function(item, index) {
            return index + ": " + item;
        }
    });

    var item = element.find(toSelector(LIST_ITEM_CLASS));

    assert.equal(item.eq(0).text(), "0: a");
    assert.equal(item.eq(1).text(), "1: b");
});

QUnit.test("itemTemplate returning string", function(assert) {
    var element = this.element.dxList({
        items: ["a", "b"],
        itemTemplate: function(item, index) {
            return index + ": " + item;
        }
    });

    var item = element.find(toSelector(LIST_ITEM_CLASS));

    assert.equal(item.eq(0).text(), "0: a");
    assert.equal(item.eq(1).text(), "1: b");
});

QUnit.test("itemTemplate returning jquery", function(assert) {
    var element = this.element.dxList({
        items: ["a"],
        itemTemplate: function(item, index) {
            return $("<span class='test' />");
        }
    });

    var item = element.children();
    assert.ok(item.find("span.test").length);
});

QUnit.test("rendering empty message for empty grouplist", function(assert) {
    var element = this.element.dxList({
        grouped: true
    });
    assert.equal(element.find(".dx-empty-message").length, 1, "empty message was rendered");
});

QUnit.test("groupTemplate default", function(assert) {
    var element = this.element.dxList({
        items: [
            {
                key: "group1",
                items: ["0", "1"]
            },
            {
                key: "group2",
                items: ["2"]
            }
        ],
        grouped: true
    });

    var groups = element.find(toSelector(LIST_GROUP_CLASS));
    assert.equal(groups.length, 2);

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.equal(groupHeaders.length, 2);

    assert.equal(groupHeaders.eq(0).text(), "group1");
    assert.equal(groupHeaders.eq(1).text(), "group2");

    var items = element.find(toSelector(LIST_ITEM_CLASS));
    assert.equal(items.length, 3);
});

QUnit.test("groupTemplate returning string", function(assert) {
    var element = this.element.dxList({
        items: [
            {
                key: "a",
                items: ["0", "1"]
            },
            {
                key: "b",
                items: ["2"]
            }
        ],

        grouped: true,

        groupTemplate: function(group, index) {
            return index + ": " + group.key;
        }
    });

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.equal(groupHeaders.eq(0).text(), "0: a");
    assert.equal(groupHeaders.eq(1).text(), "1: b");
});

QUnit.test("groupTemplate returning jquery", function(assert) {
    var element = this.element.dxList({
        items: [
            {
                key: "a",
                items: ["0", "1"]
            }
        ],

        grouped: true,

        groupTemplate: function(group, index) {
            return $("<span />");
        }
    });

    var groupHeaders = element.find(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.ok(groupHeaders.find("span").length);
});

QUnit.test("items of group should be in a group body", function(assert) {
    var $element = this.element.dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true
    });

    var $group = $element.find("." + LIST_GROUP_CLASS),
        $groupBody = $group.children("." + LIST_GROUP_BODY_CLASS);

    assert.equal($groupBody.length, 1, "group items wrapper exists");
    assert.equal($groupBody.children("." + LIST_ITEM_CLASS).length, 1, "there are items in items wrapper");
});


QUnit.module("nested rendering", moduleSetup);

QUnit.test("plain list with nested list should contain correct items", function(assert) {
    var $element = $("<div>").appendTo("#qunit-fixture");
    var instance = new List($element, {
        items: [1, 2],
        itemTemplate: function(data, index, $container) {
            var $nestedElement = $("<div>").appendTo($container);
            new List($nestedElement, {
                items: [1, 2]
            });
        }
    });

    assert.equal(instance.itemElements().length, 2, "correct items count");
});

QUnit.test("grouped list with nested list should contain correct items", function(assert) {
    var $element = $("<div>").appendTo("#qunit-fixture");
    var instance = new List($element, {
        grouped: true,
        items: [{ key: 1, items: [1] }, { key: 2, items: [2] }],
        itemTemplate: function(data, index, $container) {
            var $nestedElement = $("<div>").appendTo($container);
            new List($nestedElement, {
                grouped: true,
                items: [{ key: 1, items: [1] }, { key: 2, items: [2] }]
            });
        }
    });

    assert.equal(instance.itemElements().length, 2, "correct items count");
});


var LIST_GROUP_COLLAPSED_CLASS = "dx-list-group-collapsed",
    LIST_COLLAPSIBLE_GROUPS_CLASS = "dx-list-collapsible-groups";

QUnit.module("collapsible groups", moduleSetup);

QUnit.test("collapsible groups class should be present if groups can be collapsed", function(assert) {
    var $element = this.element.dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true,
        collapsibleGroups: true
    });

    assert.ok($element.hasClass(LIST_COLLAPSIBLE_GROUPS_CLASS), "collapsible groups class is present");

    $element.dxList("option", "collapsibleGroups", false);
    assert.ok(!$element.hasClass(LIST_COLLAPSIBLE_GROUPS_CLASS), "collapsible groups class is present");
});

QUnit.test("focus should move to first group's item when group expands", function(assert) {
    var $element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: true,
            collapsibleGroups: true
        }),
        $headers = $element.find(toSelector(LIST_GROUP_HEADER_CLASS)),
        $items = $element.find(toSelector(LIST_ITEM_CLASS));

    $element.trigger("focusin");

    $headers.eq(1).trigger("dxclick");
    $headers.eq(1).trigger("dxclick");
    assert.ok($items.eq(2).hasClass("dx-state-focused"), "first item of the second group is focused");
    assert.notOk($items.eq(0).hasClass("dx-state-focused"), "first item of the first group lost focus");
});

QUnit.test("focus class should not be added to any item when expanding group via api", function(assert) {
    var element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: true,
            collapsibleGroups: true
        }).dxList("instance"),
        $items = this.element.find(toSelector(LIST_ITEM_CLASS));

    element.expandGroup(0);

    assert.notOk($items.eq(0).hasClass("dx-state-focused"), "first item has not focused class");
});

QUnit.test("focus class should not be added to first group item when focusStateEnabled is false", function(assert) {
    var $element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: false,
            collapsibleGroups: true
        }),
        $headers = $element.find(toSelector(LIST_GROUP_HEADER_CLASS)),
        $items = $element.find(toSelector(LIST_ITEM_CLASS));

    $element.trigger("focusin");

    $headers.eq(1).trigger("dxclick");
    $headers.eq(1).trigger("dxclick");
    assert.notOk($items.eq(2).hasClass("dx-state-focused"), "first item of the second group is focused");
});

QUnit.test("group body should be collapsed by click on header", function(assert) {
    var $element = this.element.dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true,
        collapsibleGroups: true
    });

    var $group = $element.find("." + LIST_GROUP_CLASS),
        $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

    $groupHeader.trigger("dxclick");
    assert.ok($group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is present");
    $groupHeader.trigger("dxclick");
    assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
});

QUnit.test("group body should be not collapsed by click on header if collapsibleGroups is disabled", function(assert) {
    var $element = this.element.dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true,
        collapsibleGroups: false
    });

    var $group = $element.find("." + LIST_GROUP_CLASS),
        $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

    $groupHeader.trigger("dxclick");
    assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
});

QUnit.test("group body should be not collapsed by click on header in disabled state", function(assert) {
    var $element = this.element.dxList({
        items: [{ key: "a", items: ["0"] }],
        grouped: true,
        collapsibleGroups: true,
        disabled: true
    });

    var $group = $element.find("." + LIST_GROUP_CLASS),
        $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

    $groupHeader.trigger("dxclick");
    assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
});

QUnit.test("group collapsing is animated", function(assert) {
    try {
        var animateSpy = sinon.spy(fx, "animate");

        var $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        var $group = $element.find("." + LIST_GROUP_CLASS),
            $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS),
            $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);

        var groupBodyHeight = $groupBody.height();

        $groupHeader.trigger("dxclick");

        var args = animateSpy.getCall(0).args;

        assert.ok(animateSpy.calledOnce, "fx.animate is executed");
        assert.equal(args[0].get(0), $groupBody.get(0), "fx.animate ran on correct element");
        assert.equal(args[1].type, "custom", "fx.animate ran with correct animation type");
        assert.equal(args[1].from.height, groupBodyHeight, "fx.animate ran with correct start height");
        assert.equal(args[1].to.height, 0, "fx.animate ran with correct end height");
    } finally {
        fx.animate.restore();
    }
});

QUnit.test("group collapsing should update scroller position after animation", function(assert) {
    var origAnimate = fx.animate;

    try {
        var animationDeferred = $.Deferred();

        fx.animate = sinon.spy(function(_, options) {
            animationDeferred.done(function() {
                options.complete();
            });
        });

        var $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        var updateDimensionsSpy = sinon.spy();
        this.element.dxList("instance").updateDimensions = updateDimensionsSpy;

        var $group = $element.find("." + LIST_GROUP_CLASS),
            $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

        $groupHeader.trigger("dxclick");
        assert.ok(!updateDimensionsSpy.called, "updateDimensions is not executed");
        animationDeferred.resolve();
        assert.ok(updateDimensionsSpy.calledOnce, "updateDimensions is executed");
    } finally {
        fx.animate = origAnimate;
    }
});

QUnit.test("group should be collapsed by the collapseGroup method", function(assert) {
    var origAnimate = fx.animate;

    try {
        var AnimationDeferred = $.Deferred();

        fx.animate = sinon.spy(function(_, options) {
            AnimationDeferred.done(function() {
                options.complete();
            });
        });

        var $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true,
                disabled: true
            }),
            instance = $element.dxList("instance");

        var $group = $element.find("." + LIST_GROUP_CLASS);
        var $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);
        var groupBodyHeight = $groupBody.height();

        instance.collapseGroup(1).done(function() {
            assert.ok($group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is present");

            var args = fx.animate.getCall(0).args;

            assert.ok(fx.animate.calledOnce, "fx.animate used");
            assert.equal(args[1].type, "custom", "fx.animate ran with correct animation type");
            assert.equal(args[1].from.height, groupBodyHeight, "fx.animate ran with correct start height");
            assert.equal(args[1].to.height, 0, "fx.animate ran with correct end height");

            assert.equal(this, instance, "resolved on list");
        });

        AnimationDeferred.resolve();
    } finally {
        fx.animate = origAnimate;
    }
});

QUnit.test("group should be expanded by the expandGroup method", function(assert) {
    var origAnimate = fx.animate;

    try {
        var AnimationDeferred = $.Deferred();

        var $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true,
                disabled: true
            }),
            instance = $element.dxList("instance");

        var $group = $element.find("." + LIST_GROUP_CLASS);
        var $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);
        var groupBodyHeight = $groupBody.height();

        instance.collapseGroup(1);
        this.clock.tick(1000);

        fx.animate = sinon.spy(function(_, options) {
            AnimationDeferred.done(function() {
                options.complete();
            });
        });

        instance.expandGroup(1).done(function() {
            assert.ok(!$group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");

            var args = fx.animate.getCall(0).args;

            assert.ok(fx.animate.calledOnce, "fx.animate used");
            assert.equal(args[1].type, "custom", "fx.animate ran with correct animation type");
            assert.equal(args[1].from.height, 0, "fx.animate ran with correct start height");
            assert.equal(args[1].to.height, groupBodyHeight, "fx.animate ran with correct end height");

            assert.equal(this, instance, "resolved on list");
        });

        AnimationDeferred.resolve();
    } finally {
        fx.animate = origAnimate;
    }
});

QUnit.test("scrollView should be updated after group collapsed", function(assert) {
    List.mockScrollView(this.originalScrollView);

    var $element = this.element.dxList({
            autoPagingEnabled: true,
            dataSource: {
                store: [{ key: "a", items: ["0", "1", "2", "3", "4"] }, { key: "b", items: ["0", "1", "2", "3", "4"] }],
                pageSize: 1
            },
            height: 60,
            grouped: true,
            collapsibleGroups: true,
            disabled: true,
            pageLoadMode: "scrollBottom"
        }),
        instance = $element.dxList("instance");

    instance.collapseGroup(0);

    this.clock.tick(1000);

    var $groups = $element.find("." + LIST_GROUP_CLASS);
    assert.equal($groups.length, 2, "second group was loaded");
});

QUnit.test("scrollView should update its position after a group has been collapsed", function(assert) {
    List.mockScrollView(this.originalScrollView);

    var $element = this.element.dxList({
            pageLoadMode: "scrollBottom",
            height: 130,
            scrollingEnabled: true,
            useNativeScrolling: false,
            dataSource: {
                load: function(options) {
                    var d = $.Deferred(),
                        items = [{
                            key: 'first',
                            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
                        },
                        {
                            key: 'second',
                            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
                        },
                        {
                            key: 'third',
                            items: [{ a: 6 }, { a: 7 }, { a: 8 }]
                        }];
                    setTimeout(function() {
                        d.resolve(items.slice(options.skip, options.skip + options.take));
                    }, 50);
                    return d.promise();
                },
                group: "key",
                pageSize: 1,
            },
            grouped: true,
            collapsibleGroups: true,
            groupTemplate: function(data) {
                return $("<div>").text(data.key);
            },
            itemTemplate: function(data) {
                return $("<div>").text(data.a);
            }
        }),
        instance = $element.dxList("instance"),
        releaseSpy = sinon.spy(instance._scrollView, "release");

    this.clock.tick(50);

    instance.scrollTo(200);
    this.clock.tick(50);

    instance.scrollTo(200);
    this.clock.tick(50);

    instance.collapseGroup(2);
    this.clock.tick(1000);

    assert.ok(releaseSpy.lastCall.args[0], "The last call of 'release' hides load indicator");
});


QUnit.module("next button", moduleSetup);

var isElementHidden = function($element) {
    return (!$element.length || $element.is(":hidden"));
};

QUnit.test("showNextButton (deprecated showNextButton = true)", function(assert) {
    this.element.dxList({
        dataSource: {
            store: [1, 2, 3],
            pageSize: 2
        },
        showNextButton: true,
        scrollingEnabled: true
    }).dxList("instance");
    var nextButton = $(".dx-list-next-button ", this.element);

    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2, "first page loaded");
    $(".dx-button", nextButton).trigger("dxclick");
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "second page loaded");
});

QUnit.test("showNextButton (deprecated showNextButton = false)", function(assert) {
    this.element.dxList({
        dataSource: {
            store: [1, 2, 3],
            pageSize: 2
        },
        showNextButton: false,
        scrollingEnabled: true
    }).dxList("instance");
    var nextButton = $(".dx-list-next-button ", this.element);

    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "all data loaded");
    $(".dx-button", nextButton).trigger("dxclick");
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "second page loaded");
});

QUnit.test("showNextButton", function(assert) {
    var list = this.element.dxList({
        dataSource: {
            store: [1, 2, 3],
            pageSize: 2
        },
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true
    }).dxList("instance");

    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2, "first page loaded");
    assert.ok(isElementHidden($(".dx-list-next-button", this.element)), "no nextButton showed, if option = false");
    assert.ok(!this.element.hasClass("dx-has-next"));

    list.option("pageLoadMode", "nextButton");
    assert.ok($(".dx-list-next-button", this.element).is(":visible"), "nextButton showed, if option = true");
    assert.ok($(".dx-list-next-button", list._itemContainer()).length, "nextButton is render in right place");
    assert.ok(this.element.hasClass("dx-has-next"));

    var nextButton = $(".dx-list-next-button ", this.element);
    list._dataSource.isLoading = function() { return true; };
    $(".dx-button", nextButton).trigger("dxclick");
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2, "ignore nextButton click when data loading");
    list._dataSource.isLoading = function() { return false; };

    $(".dx-button", nextButton).trigger("dxclick");
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "second page loaded");
    assert.ok(isElementHidden($(".dx-list-next-button", this.element)), "no nextButton showed, if all data is loaded");
});

QUnit.test("nextButtonText", function(assert) {
    var dataSource = new DataSource({
        store: [1, 2, 3],
        pageSize: 2
    });

    var list = this.element.dxList({
        dataSource: dataSource,
        pageLoadMode: "nextButton",
        scrollingEnabled: true,
        nextButtonText: "Text"
    }).dxList("instance");

    assert.equal(this.element.find(".dx-list-next-button").text(), "Text");

    list.option("nextButtonText", "anotherText");
    assert.equal(this.element.find(".dx-list-next-button").text(), "anotherText");
});

QUnit.test("no nextButton when no dataSource", function(assert) {
    var dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        }),
        list = this.element.dxList({}).dxList("instance");

    assert.ok(isElementHidden($(".dx-list-next-button", this.element)));

    list.option("pageLoadMode", "scrollButton");
    assert.ok(isElementHidden($(".dx-list-next-button", this.element)));
    list.option("pageLoadMode", "nextButton");

    list.option("dataSource", dataSource);
    assert.ok($(".dx-list-next-button", this.element).is(":visible"));

    list.option("dataSource", []);
    assert.ok(isElementHidden($(".dx-list-next-button", this.element)));
});

QUnit.test("nextButton should not be removed after repaint", function(assert) {
    var dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        }),
        list = this.element.dxList({
            dataSource: dataSource,
            pageLoadMode: "nextButton"
        }).dxList("instance");

    list.repaint();
    assert.ok($(".dx-list-next-button", this.element).text());
});


QUnit.module("options", moduleSetup);

QUnit.test("dataSource as config", function(assert) {
    var element = this.element.dxList({
        dataSource: {
            store: new ArrayStore([5, 3, 4, 2, 1]),
            sort: "this"
        },
        pageLoadMode: "scrollBottom"
    });

    assert.equal(element.text(), "12345");
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
});

QUnit.test("dataSource as array", function(assert) {
    var element = this.element.dxList({
        dataSource: [1, 2, 3, 4, 5],
        pageLoadMode: "scrollBottom"
    });

    assert.equal(element.text(), "12345");
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
});

QUnit.test("dataSource as store", function(assert) {
    var element = this.element.dxList({
        dataSource: new ArrayStore([1, 2, 3, 4, 5]),
        pageLoadMode: "scrollBottom"
    });

    assert.equal(element.text(), "12345");
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
});


QUnit.module("options changed", moduleSetup);

QUnit.test("dataSource", function(assert) {
    var element = this.element.dxList({
        dataSource: {
            store: new ArrayStore([0, 1, 3, 5, 4])
        },
        pageLoadMode: "scrollBottom"
    });

    assert.equal(element.text(), "01354");
    assert.deepEqual(element.dxList("instance").option("items"), [0, 1, 3, 5, 4]);

    element.dxList({
        dataSource: {
            store: new ArrayStore([2, 6, 8, 9, 7])
        }
    });

    assert.equal(element.text(), "26897");
    assert.deepEqual(element.dxList("instance").option("items"), [2, 6, 8, 9, 7]);
});

QUnit.test("items", function(assert) {
    var element = this.element.dxList({
        items: [0, 1, 3, 5, 4]
    });

    assert.equal(element.text(), "01354");

    element.dxList({
        items: [2, 6, 8, 9, 7]
    });

    assert.equal(element.text(), "26897");
});

QUnit.test("scrollingEnabled", function(assert) {
    var list = this.element.dxList({
        scrollingEnabled: false
    }).dxList("instance");

    assert.ok(list._scrollView.option("disabled"));

    list.option("scrollingEnabled", true);
    assert.ok(!list._scrollView.option("disabled"));
});

QUnit.test("scrollView disables when list is disabled", function(assert) {
    var list = this.element.dxList({ disabled: false }).dxList("instance"),
        scrollView = this.element.dxScrollView("instance");

    assert.ok(!scrollView.option("disabled"), "list is enabled, scrollView is enabled too");

    list.option("disabled", true);

    assert.ok(scrollView.option("disabled"), "list is disabled, scrollView is disabled too");
});

QUnit.test("onItemSwipe", function(assert) {
    assert.expect(2);

    var swipeHandler = function() {
        assert.ok(true, "swipe handled");
    };

    var list = this.element.dxList({
        items: [0],
        onItemSwipe: swipeHandler,
        itemHoldTimeout: 0,
        scrollingEnabled: true
    }).dxList("instance");

    var item = $.proxy(function() {
        return this.element.find(toSelector(LIST_ITEM_CLASS)).eq(0);
    }, this);
    var swipeItem = function() {
        pointerMock(item()).start().swipeStart().swipe(0.5).swipeEnd(1);
    };

    swipeItem();

    list.option("onItemSwipe", null);
    swipeItem();

    list.option("onItemSwipe", swipeHandler);
    swipeItem();
});


QUnit.test("dxList shouldn't show 'Loading' and 'No data' at the same time than dataSource option changed", function(assert) {
    var $list = $("#list").dxList({ pageLoadMode: "scrollBottom" }),
        instance = $list.dxList("instance"),
        scrollView = $list.dxScrollView("instance");

    assert.equal($list.find(".dx-empty-message").length, 1, "empty message was rendered");

    var dataSource = new DataSource({
        store: [1, 2, 3],
        pageSize: 2
    });

    instance.option("dataSource", dataSource);

    assert.ok(scrollView._pageLoading, "scrollBottom div is visible");
    assert.equal($list.find(".dx-empty-message").length, 0, "empty message was not rendered");
});

QUnit.test("list should be able to change grouped option after dataSource option", function(assert) {
    var $element = $("#list").dxList({
            dataSource: [{ key: 'parent', items: [{ text: 'child' }] }],
            grouped: true
        }),
        instance = $element.dxList("instance");

    instance.option({
        dataSource: [{ text: 'one' }],
        grouped: false
    });

    assert.notOk(instance.option("grouped"), "grouped option was changed without exceptions");
});


QUnit.module("selection", moduleSetup);

QUnit.test("selection should not be removed after second click if selectionMode is single", function(assert) {
    var $element = this.element.dxList({
            items: [1],
            selectionMode: "single"
        }),
        $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(0);

    $item.trigger("dxclick");
    $item.trigger("dxclick");

    assert.ok($item.hasClass("dx-list-item-selected"), "item should not lose selection");
});

QUnit.module("events", moduleSetup);

QUnit.test("onItemClick should be fired when item is clicked in ungrouped list", function(assert) {
    var actionFired,
        actionData;

    var $element = this.element.dxList({
            items: ["0"],
            grouped: false,
            onItemClick: function(args) {
                actionFired = true;
                actionData = args;
            }
        }),
        $item = $element.find(toSelector(LIST_ITEM_CLASS));

    $item.trigger("dxclick");
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
});

QUnit.test("onItemClick should be fired when item is clicked in grouped list", function(assert) {
    var actionFired,
        actionData;

    var items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        },
        {
            key: 'second',
            items: [{ a: 3 }, { a: 4 }, { a: 5 }]
        }
    ];

    var $element = this.element.dxList({
        items: items,
        grouped: true,
        onItemClick: function(args) {
            actionFired = true;
            actionData = args;
        }
    });
    var $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(3);

    $item.trigger("dxclick");

    assert.ok(actionFired, "action fired");

    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual(items[1].items[0], actionData.itemData, "correct element passed");
    assert.strictEqual(0, actionData.itemIndex.item, "correct element itemIndex passed");
    assert.strictEqual(1, actionData.itemIndex.group, "correct groupIndex passed");
});

QUnit.test("onItemHold should be fired when item is held", function(assert) {
    var actionFired,
        actionData;

    var $element = this.element.dxList({
            items: ["0"],
            onItemHold: function(args) {
                actionFired = true;
                actionData = args;
            }
        }),
        $item = $element.find(toSelector(LIST_ITEM_CLASS));

    $item.trigger(holdEvent.name);
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
});

QUnit.test("onItemSwipe should be fired when item is swiped", function(assert) {
    var actionFired,
        actionData;

    var $element = this.element.dxList({
            items: ["0"],
            onItemSwipe: function(args) {
                actionFired = true;
                actionData = args;
            }
        }),
        $item = $element.find(toSelector(LIST_ITEM_CLASS));

    $item.trigger({
        type: swipeEvents.end,
        offset: -1
    });
    assert.ok(actionFired, "action fired");
    assert.strictEqual($item[0], actionData.itemElement[0], "correct element passed");
    assert.strictEqual("0", actionData.itemData, "correct element passed");
    assert.equal("left", actionData.direction, "correct direction passed");

    $item.trigger({
        type: swipeEvents.end,
        offset: 1
    });
    assert.equal("right", actionData.direction, "correct direction passed");
});

QUnit.test("onContentReady", function(assert) {
    var contentReadyFired = 0,
        instance = $("#list").dxList({
            onContentReady: function() {
                contentReadyFired++;
            }
        }).dxList("instance");

    assert.equal(contentReadyFired, 1);

    instance.option("items", ["a", "b"]);
    assert.equal(contentReadyFired, 2);
});

QUnit.test("onGroupRendered should fired with correct params", function(assert) {
    var items = [
        {
            key: 'first',
            items: [{ a: 0 }, { a: 1 }, { a: 2 }]
        }
    ];

    var groupRendered = 0,
        eventData = [],
        $list = $("#list").dxList({
            items: items,
            grouped: true,
            onGroupRendered: function(args) {
                eventData = args;
                groupRendered++;
            }
        });

    assert.equal(groupRendered, 1, "event triggered");
    assert.strictEqual(eventData.groupElement[0], $list.find(".dx-list-group")[0], "groupElement is correct");
    assert.strictEqual(eventData.groupData, items[0], "groupData is correct");
    assert.strictEqual(eventData.groupIndex, 0, "groupIndex is correct");
});

QUnit.test("list should prevent default behavior when context menu event is firing", function(assert) {
    var $list = $("#list").dxList({
            items: [{ text: "test" }],
            menuMode: "context",
            menuItems: [{ text: "action", action: noop }]
        }),
        $item = $list.find(".dx-list-item").eq(0);

    var contextMenuEvent = $.Event("contextmenu", { pointerType: "mouse" });
    $item.trigger(contextMenuEvent);

    assert.ok(contextMenuEvent.isDefaultPrevented(), "default prevented");
});


QUnit.module("dataSource integration", moduleSetup);

QUnit.test("pageLoading should be ordered for async dataSource (T233998)", function(assert) {
    List.mockScrollView(ScrollViewMock.inherit({
        isFull: function() {
            return false;
        }
    }));

    var $list = $("#list").dxList({
        dataSource: {
            load: function(option) {
                var deferred = $.Deferred();

                setTimeout(function() {
                    deferred.resolve([option.skip]);
                }, 100);

                return deferred.promise();
            },
            pageSize: 1
        },
        autoPagingEnabled: true
    });

    this.clock.tick(300);

    assert.equal($.trim($list.find(".dx-list-item").text()), "012");
});

QUnit.test("shared data source", function(assert) {
    var dataSource = new DataSource(),
        widget,
        changedHandler;

    this.element.dxList({
        dataSource: dataSource
    });

    widget = this.element.dxList("instance");
    changedHandler = widget._proxiedDataSourceChangedHandler;
    assert.ok($.isFunction(changedHandler));
    assert.ok(dataSource._eventsStrategy._events["changed"].has(changedHandler));

    widget._dispose();
    assert.ok(!dataSource._eventsStrategy._events["changed"].has(changedHandler));
    assert.ok(!widget._proxiedDataSourceChangedHandler);

    assert.ok("_store" in dataSource, "dataSource is not disposed");
    assert.ok(!("_dataSource" in widget), "dataSource is unlinked");
});

QUnit.test("aggregated source (created from options)", function(assert) {
    var dataSourceConfig = {
        store: new ArrayStore([])
    };

    this.element.dxList({
        dataSource: dataSourceConfig
    });

    var widget = this.element.dxList("instance"),
        dataSource = widget._dataSource;
    assert.ok(dataSource instanceof DataSource);
    assert.ok("_store" in dataSource);

    widget._dispose();
    assert.ok(!("_store" in dataSource), "aggregated source is disposed");
    assert.ok(!("_dataSource" in widget), "source is unlinked");
});

QUnit.test("list shouldn't load dataSource again after first request fail (B253304)", function(assert) {
    var loadCalled = 0;

    $("#list").dxList({
        dataSource: {
            load: function() {
                loadCalled++;
                return $.Deferred().reject().promise();
            }
        }
    });

    assert.equal(loadCalled, 1, "load called once");
});

QUnit.test("loading indication panel should not be shown when list has no items", function(assert) {
    var element = this.element;
    element.dxList({
        height: 300,
        pageLoadMode: "scrollBottom",
        showSelectionControls: true,
        dataSource: {
            paginate: true,
            load: function() {
                return $.Deferred();
            }
        }
    });

    var scrollView = element.dxScrollView("instance");
    this.clock.tick();
    assert.equal(scrollView._loading, false, "scrollView not in loading state");
});

QUnit.test("list indicates loading during dataSource loading", function(assert) {
    var dataSourceLoadTime = 100;

    var dataSource = new DataSource({
        load: function() {
            var deferred = $.Deferred();

            setTimeout(function() {
                deferred.resolve([1, 2]);
            }, dataSourceLoadTime);

            return deferred.promise();
        }
    });

    var element = this.element.dxList({
        dataSource: dataSource
    });

    var scrollView = element.dxScrollView("instance");
    this.clock.tick(dataSourceLoadTime);
    assert.equal(scrollView._loading, false, "scrollview not in loading state after first data load");

    dataSource.load();
    this.clock.tick();
    assert.equal(scrollView._loading, true, "scrollview loading started on data reload");

    this.clock.tick(dataSourceLoadTime);
    assert.equal(scrollView._loading, false, "scrollview loading finished on data load");
});

QUnit.test("list doesn't indicate loading during dataSource loading when indicateLoading = false", function(assert) {
    var dataSourceLoadTime = 100;

    var dataSource = new DataSource({
        load: function() {
            var deferred = $.Deferred();

            setTimeout(function() {
                deferred.resolve([]);
            }, dataSourceLoadTime);

            return deferred.promise();
        }
    });

    var element = this.element.dxList({
        dataSource: dataSource,
        indicateLoading: false
    });

    var scrollView = element.dxScrollView("instance");
    this.clock.tick(dataSourceLoadTime);
    assert.equal(scrollView._loading, false, "scrollView not in loading state");

    dataSource.load();
    assert.equal(scrollView._loading, false, "scrollView loading not indicated");
});

QUnit.test("setting indicateLoading to false hides load panel at once", function(assert) {
    var dataSourceLoadTime = 100;

    var dataSource = new DataSource({
        load: function() {
            var deferred = $.Deferred();

            setTimeout(function() {
                deferred.resolve([]);
            }, dataSourceLoadTime);

            return deferred.promise();
        }
    });

    var element = this.element.dxList({
        dataSource: dataSource
    });

    var scrollView = element.dxScrollView("instance");
    this.clock.tick(dataSourceLoadTime);

    dataSource.load();

    setTimeout(function() {
        element.dxList("option", "indicateLoading", false);
    }, dataSourceLoadTime / 2);

    this.clock.tick(dataSourceLoadTime / 2);
    assert.equal(scrollView._loading, false, "scrollview loading not indicated");
});

QUnit.test("list doesn't indicate loading when click more button", function(assert) {
    var dataSourceLoadTime = 100;

    var element = this.element.dxList({
        dataSource: new DataSource({
            load: function() {
                var deferred = $.Deferred();

                setTimeout(function() {
                    deferred.resolve([1, 2]);
                }, 0);

                return deferred.promise();
            },
            pageSize: 2
        }),
        pageLoadMode: "nextButton"
    });

    var scrollView = element.dxScrollView("instance");
    this.clock.tick(dataSourceLoadTime);

    element.find(".dx-list-next-button .dx-button").trigger("dxclick");
    assert.equal(scrollView._loading, false, "scrollview loading started");
});

QUnit.test("reload", function(assert) {
    var loaded = 0;
    var $list = this.element.dxList({
        dataSource: new DataSource({
            load: function() {
                var deferred = $.Deferred();
                deferred.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
                loaded++;
                return deferred.promise();
            }
        })
    });
    var loadedOnInit = loaded;
    var list = $list.dxList("instance");

    list.scrollTo(10);
    list.reload();

    assert.equal(loaded, loadedOnInit + 1, "loaded fired after reload");
    assert.equal(list.scrollTop(), 0, "scroll to top after reload");
});

QUnit.test("first item rendered when pageSize is 1 and dataSource set as array", function(assert) {
    List.mockScrollView(ScrollViewMock.inherit({
        isFull: function() {
            return false;
        },
    }));

    var $list = this.element.dxList({
        autoPagingEnabled: true,
        dataSource: {
            store: [1, 2, 3, 4],
            pageSize: 1
        }
    });

    assert.equal($list.find(".dx-list-item").eq(0).text(), "1", "first item rendered");
});

QUnit.test("list should scroll to top if data source is load is happened", function(assert) {
    var loaded = 0,
        data = function() {
            var result = [];

            for(var i = 1; i <= 50; i++) {
                result.push("item " + i);
            }

            return result;
        }(),
        ds = new DataSource({
            load: function() {
                loaded++;
                return data;
            },
            pageSize: 1
        });

    var $list = this.element.dxList({
            dataSource: ds,
            pageLoadMode: "scrollBottom"
        }),
        instance = $list.dxList("instance");

    var loadedOnInit = loaded;
    instance.scrollTo(200);
    assert.equal(instance.scrollTop(), 200, "list is scrolled");

    ds.pageIndex(0);
    ds.load();

    assert.equal(loaded, loadedOnInit + 1, "dataSource load was fired");
    assert.equal(instance.scrollTop(), 0, "list scrolled to top");
});


QUnit.module("infinite list scenario", moduleSetup);

QUnit.test("appending items on scroll bottom (deprecated autoPagingEnabled = true)", function(assert) {
    var element = this.element.dxList({
        autoPagingEnabled: true,
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        }
    });
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2], "correct items presented in options");

    element.dxScrollView("instance").scrollBottom();
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4], "correct items presented in options");
});

QUnit.test("scroll bottom action shouldn't load data if all items was loaded", function(assert) {
    var count = 0;
    var element = this.element.dxList({
        autoPagingEnabled: true,
        scrollingEnabled: true,
        dataSource: {
            load: function() {
                count++;
                return [1];
            },
            pageSize: 2
        }
    });

    assert.equal(count, 1, "first page loaded");

    element.dxScrollView("instance").scrollBottom();
    assert.equal(count, 1, "data source loaded, shouldn't load another page");
});

QUnit.test("appending items on scroll bottom (deprecated autoPagingEnabled = false)", function(assert) {
    var element = this.element.dxList({
        autoPagingEnabled: false,
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        }
    });
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4], "correct items presented in options");

    element.dxScrollView("instance").scrollBottom();
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4], "correct items presented in options");
});

QUnit.test("appending items on scroll bottom", function(assert) {
    var element = this.element.dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        }
    });

    assert.equal(element.text(), "12", "correct items generated");
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2], "correct items presented in options");

    element.find(toSelector(LIST_ITEM_CLASS)).data("rendered", true);

    element.dxScrollView("instance").scrollBottom();

    assert.equal(element.text(), "1234", "correct items generated");
    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4], "correct items presented in options");

    assert.strictEqual(element.find(toSelector(LIST_ITEM_CLASS)).eq(0).data("rendered"), true, "first item is not rerendered");
    assert.strictEqual(element.find(toSelector(LIST_ITEM_CLASS)).eq(1).data("rendered"), true, "first item is not rerendered");

    element.dxScrollView("instance").scrollBottom();

    assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "does not expecting appending items if all items rendered");
});

QUnit.test("appending items on 'more' button", function(assert) {
    var element = this.element.dxList({
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        },
        pageLoadMode: "nextButton",
        scrollingEnabled: true
    });

    assert.deepEqual(element.dxList("instance").option("items"), [1, 2], "correct items presented in options");

    element.find(toSelector(LIST_ITEM_CLASS)).data("rendered", true);

    element.find(".dx-list-next-button .dx-button").trigger("dxclick");

    assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4], "correct items presented in options");

    assert.strictEqual(element.find(toSelector(LIST_ITEM_CLASS)).eq(0).data("rendered"), true, "first item is not rerendered");
    assert.strictEqual(element.find(toSelector(LIST_ITEM_CLASS)).eq(1).data("rendered"), true, "first item is not rerendered");

    element.find(".dx-list-next-button .dx-button").trigger("dxclick");

    assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "does not expecting appending items if all items rendered");
});

QUnit.test("should not expect appending items if items were appended just now", function(assert) {
    var element = this.element.dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        }
    });

    element.dxScrollView("instance").scrollBottom();

    assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "flag set correctly");
});

QUnit.test("should not expect appending items if all items loaded", function(assert) {
    var element = this.element.dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2]),
            pageSize: 2
        }
    });
    element.dxScrollView("instance").scrollBottom();

    assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "flag set correctly");
});

QUnit.test("should not expect appending items if load error handled", function(assert) {
    // jshint evil:true

    var element = this.element.dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3]),
            pageSize: 2,
            map: function(item, index) { return eval(item); }
        }
    });

    element.dxList("instance")._dataSource.load = function() {
        element.dxList("instance")._dataSource.fireEvent("loadError");
        return $.Deferred().reject().promise();
    };

    element.dxScrollView("instance").scrollBottom();

    assert.equal(element.text(), "12", "error occurred");

    assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "flag set correctly");
});

QUnit.test("infinite loading should not happen if widget element is hidden", function(assert) {
    var $element = this.element.hide().dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        },
        onInitialized: function(e) {
            e.element.dxScrollView("instance").isFull = function() {
                return false;
            };
        }
    });

    this.clock.tick();

    assert.deepEqual($element.dxList("option", "items"), [1, 2], "only first page is loaded");
});

QUnit.test("infinite loading should happen when widget element is shown", function(assert) {
    var $element = this.element.hide().dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: {
            store: new ArrayStore([1, 2, 3, 4]),
            pageSize: 2
        },
        onInitialized: function(e) {
            e.element.dxScrollView("instance").isFull = function() {
                return false;
            };
        }
    });

    this.clock.tick();

    $element.show().triggerHandler("dxshown");
    this.clock.tick();

    assert.deepEqual($element.dxList("option", "items"), [1, 2, 3, 4], "all data loaded");
});


QUnit.module("scrollView interaction", moduleSetup);

QUnit.test("list.updateDimensions calls scrollView.update", function(assert) {
    assert.expect(4);

    var list = this.element.dxList({
        items: [1, 2, 3]
    }).dxList("instance");

    var scrollView = this.element.dxScrollView("instance");

    assert.equal(scrollView._updateCount, 0, "no update after render list");

    list.updateDimensions().done(function() {
        assert.ok(true);
        assert.equal(this, list);
    });

    list.updateDimensions();
    assert.equal(scrollView._updateCount, 2, "+2 after update() call");
});

QUnit.test("width & height option change should call update method of scroll view", function(assert) {
    var list = this.element.dxList({
            items: [1, 2, 3]
        }).dxList("instance"),
        scrollView = this.element.dxScrollView("instance"),
        updateCount = scrollView._updateCount;

    list.option("width", 100);
    list.option("height", 100);
    assert.equal(scrollView._updateCount, updateCount + 2, "scroll view updated twice");
});

QUnit.test("visible option change should call update method of scroll view", function(assert) {
    var list = this.element.dxList({
        visible: false
    }).dxList("instance");

    var scrollView = this.element.dxScrollView("instance");
    var updateCount = scrollView._updateCount;

    list.option("visible", true);
    assert.equal(scrollView._updateCount, updateCount + 1, "scroll view updated");
});

QUnit.test("scrollView callbacks", function(assert) {
    var reloaded = 0,
        nextPageCalled = 0,
        pullRefreshActionFired = 0,
        pageLoadingActionFired = 0,
        dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

    dataSource.pageIndex = function(newIndex) {
        if(newIndex === 0) {
            reloaded = true;
        }
    };
    dataSource.load = function() {
        dataSource.fireEvent("changed");
        nextPageCalled = true;
        return $.when(false);
    };

    var element = this.element;

    element.dxList({
        dataSource: dataSource,
        pullRefreshEnabled: true,
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        onPullRefresh: function() {
            pullRefreshActionFired++;
        },
        onPageLoading: function() {
            pageLoadingActionFired++;
        }
    }).dxList("instance");

    element.dxScrollView("instance").pullDown();
    assert.ok(reloaded, "dataSource reloaded");
    assert.equal(pullRefreshActionFired, 1, "onPullRefresh fired");

    element.dxScrollView("instance").scrollBottom();
    assert.ok(nextPageCalled, "next page loaded");
    assert.equal(pageLoadingActionFired, 1, "onPageLoading fired");
});

QUnit.test("rtlEnabled option should be passed to scrollView", function(assert) {
    var list = this.element.dxList({
            items: [1, 2, 3],
            rtlEnabled: true
        }).dxList("instance"),
        scrollView = this.element.dxScrollView("instance");

    assert.ok(scrollView.option("rtlEnabled"), "rtlEnabled option is passed to scrollView on init");

    list.option("rtlEnabled", false);
    assert.ok(!scrollView.option("rtlEnabled"), "rtlEnabled option is passed to scrollView on optionChange");
});


QUnit.module("scrollView integration", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("on repaint scroll should be moved to top", function(assert) {
    var $list = $("#list");
    $list.height(100);
    $list.dxList({
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        useNativeScrolling: false
    });
    $list.dxList("scrollTo", 100);
    $list.dxList("repaint");

    assert.equal($list.dxList("scrollTop"), 0);
});

QUnit.test("on start scrollbar has correct height", function(assert) {
    var $list = $("#list");
    $list.height(100);


    $list.dxList({
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        useNativeScrolling: false
    });

    var $scrollViewContent = $list.find(".dx-scrollview-content"),
        $scrollableScroll = $list.find(".dx-scrollable-scroll");

    this.clock.tick(1);

    var scrollBarSize = Math.round(Math.pow($list.height(), 2) / $scrollViewContent.height());
    assert.equal($scrollableScroll.height(), scrollBarSize, "scrollbar has correct height");
});

QUnit.test("update scroll after change items", function(assert) {
    var $list = $("#list")
        .dxList({
            height: 50,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
            useNativeScrolling: true
        });

    var scrollView = $list.dxScrollView("instance"),
        list = $list.dxList("instance"),
        contentHeight = scrollView.content().height();

    list.option("items", [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    var newHeight = scrollView.content().height();
    assert.equal(newHeight, contentHeight * 2, "update after items was changed");
});

QUnit.test("infinite sync data loading if scrollView is not full", function(assert) {
    var dataSource = new DataSource({
        store: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        pageSize: 1
    });

    var listHeight = 60;

    var $list = $("#list").height(listHeight).dxList({
        dataSource: dataSource,
        pageLoadMode: "scrollBottom"
    });

    this.clock.tick(1);
    var listItems = $(toSelector(LIST_ITEM_CLASS), $list),
        itemHeight = listItems.height();
    assert.ok(itemHeight * listItems.length >= listHeight);
    assert.ok(itemHeight * listItems.length <= listHeight + itemHeight);
});

QUnit.test("infinite async data loading if scrollView is not full", function(assert) {
    var count = 0;
    var dataSource = new DataSource({
        load: function() {
            var result = $.Deferred();
            setTimeout(function() {
                result.resolve([count++]);
            }, 400);
            return result.promise();
        },
        pageSize: 1
    });

    var listHeight = 60;

    var $list = $("#list").height(listHeight).dxList({
        dataSource: dataSource,
        pageLoadMode: "scrollBottom"
    });

    this.clock.tick(801); // NOTE: wait for two pages 400ms per one
    var listItems = $(toSelector(LIST_ITEM_CLASS), $list);
    assert.equal(listItems.eq(0).text(), "0");
    assert.equal(listItems.eq(1).text(), "1");
});

QUnit.test("list should try to load next page if scrollView is not full after dimensions updated", function(assert) {
    var $element = $("#list").dxList({
        pageLoadMode: "scrollBottom",
        height: 300,
        scrollingEnabled: true,
        onInitialized: function(e) {
            var list = e.component,
                $list = e.element;

            $list.dxScrollView("instance").isFull = function() {
                var height = list.option("height");
                return height <= 300;
            };
        },
        dataSource: {
            load: function(options) {
                var d = $.Deferred(),
                    items = [1, 2, 3, 4, 5, 6];

                setTimeout(function() {
                    d.resolve(items.slice(options.skip, options.skip + options.take));
                }, 50);

                return d.promise();
            },
            pageSize: 3
        }
    });

    this.clock.tick(100);

    var instance = $element.dxList("instance");
    instance.option("height", 400);
    instance.updateDimensions();
    this.clock.tick(100);

    assert.deepEqual($element.find(".dx-list-item").length, 6, "all data loaded");
});

QUnit.test("list should be scrolled to item from bottom by scrollToItem", function(assert) {
    var $list = $("#list").dxList({
            items: ["0"]
        }),
        list = $list.dxList("instance");

    var $item = list.itemElements().eq(0);

    var scrollToElementSpy = sinon.spy();
    $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

    list.scrollToItem($item);
    assert.equal(scrollToElementSpy.firstCall.args[0].get(0), $item.get(0), "list scrolled to item");
});

QUnit.test("list shouldn't be scrolled if item isn't specified", function(assert) {
    var $list = $("#list").dxList({
            items: ["0"]
        }),
        list = $list.dxList("instance");

    var scrollToElementSpy = sinon.spy();
    $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

    list.scrollToItem($());
    assert.equal(scrollToElementSpy.firstCall.args[0], null, "list wasn't scrolled");
});

QUnit.test("list should be scrolled to item from bottom by scrollToItem", function(assert) {
    var $list = $("#list").dxList({
            items: ["0"]
        }),
        list = $list.dxList("instance");

    var $item = list.itemElements().eq(0);

    var scrollToElementSpy = sinon.spy();
    $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

    list.scrollToItem(0);
    assert.equal(scrollToElementSpy.firstCall.args[0].get(0), $item.get(0), "list scrolled to item");
});

QUnit.test("list should not fail on scrollToItem if item is a string of the specific format (T381823)", function(assert) {
    var items = ["12", "1.6", "#43"];

    var list = $("#list").dxList({
        items: items,
        height: 10
    }).dxList("instance");

    list.scrollToItem(items[1]);
    assert.expect(0);
});

QUnit.test("pulldown to refresh should work when option items is set", function(assert) {
    assert.expect(0);

    var $list = $("#list").dxList({
        items: [1, 2, 3],
        pullRefreshEnabled: true
    });

    try {
        $list.dxScrollView("refresh");
    } catch(e) {
        assert.ok(false, e.message);
    }
});

QUnit.test("updating scrollView options should release scroll", function(assert) {
    var $list = $("#list").height(1000).dxList({
        items: [1, 2, 3],
        pullRefreshEnabled: false
    });

    var releaseSpy = sinon.spy();
    $list.dxScrollView("instance").release = releaseSpy;

    $list.dxList("option", "pullRefreshEnabled", true);
    assert.ok(releaseSpy.calledOnce, "list release scrollview");
});

QUnit.test("scroll position should be saved after selectionMode option changing", function(assert) {
    var $list = $("#list").height(1000).dxList({
            items: [1, 2, 3, 4],
            selectionMode: "none",
            height: 10
        }),
        scrollView = $list.dxScrollView("instance");

    scrollView.scrollTo(4);
    var scrollTop = scrollView.scrollTop();

    $list.dxList("option", "selectionMode", "multiple");

    assert.equal(scrollView.scrollTop(), scrollTop, "position was not changed");
});


QUnit.module("regressions", moduleSetup);

QUnit.test("list loading does not re-render items", function(assert) {
    var dataSource = new DataSource({
        store: [1, 2, 3],
        pageSize: 2
    });

    this.element.dxList({ dataSource: dataSource });

    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2);

    dataSource.load();
    assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2);
});

QUnit.test("correctly handle data source errors (B230041)", function(assert) {
    var list = this.element.dxList({
        dataSource: {
            store: new ArrayStore([1]),
            select: function() {
                throw Error("forced");
            }
        }
    }).dxList("instance");

    assert.equal(list._scrollView._history.length, 1);

    list._dataSource.load();
    assert.equal(list._scrollView._history.length, 2);
});

QUnit.test("B230535", function(assert) {
    var clicked = 0;

    this.element.dxList({
        items: [1, 2, 3],
        onItemClick: function() {
            clicked++;
        },
        disabled: true
    }).dxList("instance");

    this.element.find(toSelector(LIST_ITEM_CLASS)).each(function() {
        $(this).click();
        assert.ok(!clicked);
    });
});

QUnit.test("Q471954. dxList displays a blank area below the widget", function(assert) {
    this.element.dxList({
        items: [1, 2, 3]
    }).dxList("instance");

    var scrollView = this.element.dxScrollView("instance");

    assert.ok(!scrollView._pageLoading, "scrollBottom div is hidden");
});

QUnit.test("Q501091: dxList - onItemRendered is not called when swiped down", function(assert) {
    var itemRenderedCalled = false,
        dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

    var list = this.element.dxList({
        pageLoadMode: "scrollBottom",
        scrollingEnabled: true,
        dataSource: dataSource
    }).dxList("instance");

    list.option("onItemRendered", function() {
        itemRenderedCalled = true;
    });

    assert.ok(!itemRenderedCalled);
    this.element.dxScrollView("instance").scrollBottom();
    assert.ok(itemRenderedCalled);
});

QUnit.test("onItemClick on disabled items", function(assert) {
    var count = 0;

    var element = this.element.dxList({
        items: [
            { text: "0", disabled: true },
            { text: "1" }
        ],
        onItemClick: function(e) {
            count++;
        },
        scrollingEnabled: true
    });

    var item = element
        .find(toSelector(LIST_ITEM_CLASS))
        .last();

    item.trigger("dxclick");

    assert.equal(count, 1);

    item = element
        .find(toSelector(LIST_ITEM_CLASS))
        .first();

    item.trigger("dxclick");

    assert.equal(count, 1);
});

QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#list").dxList({ items: [1, 2, 3, 4] });

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("constructor", function(assert) {
    var $element = $("#list").dxList({ items: [1, 2, 3, 4], width: 400 }),
        instance = $element.dxList("instance");

    assert.strictEqual(instance.option("width"), 400);
    assert.strictEqual($element.outerWidth(), 400, "outer width of the element must be equal to custom width");
});

QUnit.test("root with custom width", function(assert) {
    var $element = $("#list").width(300).dxList({ items: [1, 2, 3, 4] }),
        instance = $element.dxList("instance");

    assert.strictEqual(instance.option("width"), undefined);
    assert.strictEqual($element.outerWidth(), 300, "outer width of the element must be equal to custom width");
});

QUnit.test("change width", function(assert) {
    var $element = $("#list").dxList({ items: [1, 2, 3, 4] }),
        instance = $element.dxList("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("list scroll to focused item after press up/down arrows", function(assert) {
    assert.expect(2);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        }),
        instance = $element.dxList("instance"),
        $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(2).trigger("dxpointerdown"),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();
    this.clock.tick();

    instance.option("height", itemHeight * 3);

    keyboard.keyDown("down");
    assert.equal(instance.scrollTop(), itemHeight, "item scrolled to visible area at bottom when down arrow were pressed");

    $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(1);
    $item.trigger("dxpointerdown");
    this.clock.tick();
    keyboard = keyboardMock($element);
    keyboard.keyDown("up");
    assert.equal(instance.scrollTop(), 0, "item scrolled to visible area at top when up arrow were pressed");
});

QUnit.test("list does not scroll to item after click on it", function(assert) {
    assert.expect(2);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        }),
        instance = $element.dxList("instance"),
        $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(2),
        itemHeight = $item.outerHeight();

    instance.option("height", itemHeight * 2.5);
    assert.equal(instance.scrollTop(), 0, "list scrolled to zero");

    $item.trigger("dxpointerdown");
    this.clock.tick();

    assert.equal(instance.scrollTop(), 0, "item was not scrolled to half-visible item by click on it");
});

QUnit.test("list scroll to focused item after press home/end", function(assert) {
    assert.expect(2);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        }),
        instance = $element.dxList("instance"),
        $item = $element.find(toSelector(LIST_ITEM_CLASS)).first(),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();


    $element.trigger("focusin");
    instance.option("height", itemHeight * 3);

    keyboard.keyDown("end");
    assert.roughEqual(instance.scrollTop(), itemHeight * 2, 1.0001, "item scrolled to visible area at bottom end arrow were pressed");

    keyboard.keyDown("home");
    assert.equal(instance.scrollTop(), 0, "item scrolled to visible area at top when home were pressed");
});

QUnit.test("list scroll to focused item after press pageDown", function(assert) {
    assert.expect(6);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5]
        }),
        instance = $element.dxList("instance"),
        $items = $element.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.first(),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();

    $element.trigger("focusin");
    instance.option("height", itemHeight * 3);

    keyboard.keyDown("pageDown");

    assert.roughEqual(instance.scrollTop(), 0, 1.0001, "list is not scrolled, when focusedItem is not last visible item on this page");
    assert.ok($items.eq(2).hasClass("dx-state-focused"), "focused item change to last visible item on this page");

    keyboard.keyDown("pageDown");

    assert.roughEqual(instance.scrollTop(), itemHeight * 2, 1.0001, "list scrolled to next page");
    assert.ok($items.eq(4).hasClass("dx-state-focused"), "last item on new page obtained focus");

    keyboard.keyDown("pageDown");

    assert.roughEqual(instance.scrollTop(), itemHeight * 3, 1.0001, "list scrolled to last page");
    assert.ok($items.eq(5).hasClass("dx-state-focused"), "last item on last page obtained focus");
});

QUnit.test("list scroll to hidden focused item after press pageDown", function(assert) {
    assert.expect(3);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6]
        }),
        instance = $element.dxList("instance"),
        $items = $element.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.first(),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();

    $element.trigger("focusin");
    instance.option("height", itemHeight * 3);
    instance.option("focusedElement", $items.eq(3));
    instance.scrollToItem($items.first());

    assert.roughEqual(instance.scrollTop(), 0, 1.0001, "list is not scrolled");

    keyboard.keyDown("pageDown");

    assert.roughEqual(instance.scrollTop(), itemHeight * 3, 1.0001, "list scrolled to previous focusedItem");
    assert.ok($items.eq(5).hasClass("dx-state-focused"), "focused item change to last visible item on new page");
});

QUnit.test("list scroll to focused item after press pageUp", function(assert) {
    assert.expect(6);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5]
        }),
        instance = $element.dxList("instance"),
        $items = $element.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.first(),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();

    $element.trigger("focusin");
    instance.option("height", itemHeight * 3);
    instance.option("focusedElement", $items.last());
    instance.scrollToItem($items.last());

    keyboard.keyDown("pageUp");

    assert.roughEqual(instance.scrollTop(), itemHeight * 3, 1.0001, "list is not scrolled, when focusedItem is not first visible item on this page");
    assert.ok($items.eq(3).hasClass("dx-state-focused"), "focused item change to first visible item on this page");

    keyboard.keyDown("pageUp");

    assert.roughEqual(instance.scrollTop(), itemHeight, 1.0001, "list scrolled to next page");
    assert.ok($items.eq(1).hasClass("dx-state-focused"), "first item on new page obtained focus");

    keyboard.keyDown("pageUp");

    assert.roughEqual(instance.scrollTop(), 0, 1.0001, "list scrolled to first page");
    assert.ok($items.eq(0).hasClass("dx-state-focused"), "first item on first page obtained focus");
});

QUnit.test("list scroll to hidden focused item after press pageUp", function(assert) {
    assert.expect(3);

    var $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6]
        }),
        instance = $element.dxList("instance"),
        $items = $element.find(toSelector(LIST_ITEM_CLASS)),
        $item = $items.first(),
        keyboard = keyboardMock($element),
        itemHeight = $item.outerHeight();

    $element.trigger("focusin");
    instance.option("height", itemHeight * 3);
    instance.option("focusedElement", $items.eq(3));
    instance.scrollToItem($items.last());

    assert.roughEqual(instance.scrollTop(), itemHeight * 4, 1.0001, "list is not scrolled");

    keyboard.keyDown("pageUp");

    assert.roughEqual(instance.scrollTop(), itemHeight, 1.0001, "list scrolled to previous focusedItem");
    assert.ok($items.eq(1).hasClass("dx-state-focused"), "focused item change to last visible item on new page");
});


QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#list").dxList();
    assert.equal($element.attr("role"), "listbox", "aria role is correct");
});

QUnit.test("list item role", function(assert) {
    assert.expect(2);

    var items = [0, 1],
        $element = $("#list").dxList({ items: items });

    $element.find(".dx-list-item").each(function(i, item) {
        assert.equal($(item).attr("role"), "option", "role for item " + i + " is correct");
    });
});
