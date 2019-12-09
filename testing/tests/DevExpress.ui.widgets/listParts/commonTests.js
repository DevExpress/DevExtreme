import $ from "jquery";
import { DataSource } from "data/data_source/data_source";
import { isRenderer } from "core/utils/type";
import { noop } from "core/utils/common";
import config from "core/config";
import devices from "core/devices";
import errors from "ui/widget/ui.errors";
import executeAsyncMock from "../../../helpers/executeAsyncMock.js";
import fx from "animation/fx";
import holdEvent from "events/hold";
import keyboardMock from "../../../helpers/keyboardMock.js";
import pointerMock from "../../../helpers/pointerMock.js";
import registerComponent from "core/component_registrator";
import swipeEvents from "events/swipe";
import themes from "ui/themes";
import ArrayStore from "data/array_store";
import CustomStore from "data/custom_store";
import DOMComponent from "core/dom_component";
import KeyboardProcessor from "ui/widget/ui.keyboard_processor";
import List from "ui/list";
import ScrollView from "ui/scroll_view";
import eventsEngine from "events/core/events_engine";
import ariaAccessibilityTestHelper from '../../../helpers/ariaAccessibilityTestHelper.js';

const LIST_ITEM_CLASS = "dx-list-item";
const LIST_GROUP_CLASS = "dx-list-group";
const LIST_GROUP_HEADER_CLASS = "dx-list-group-header";
const LIST_GROUP_BODY_CLASS = "dx-list-group-body";

const toSelector = cssClass => {
    return "." + cssClass;
};

const isDeviceDesktop = assert => {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "skip this test on mobile devices");
        return false;
    }
    return true;
};

const ScrollViewMock = DOMComponent.inherit({

    NAME: "dxScrollView",

    _init() {
        const content = this.$element().find(".scroll-view-content");
        if(content.length) {
            this._$scrollViewContent = content;
        } else {
            this._$scrollViewContent = $("<div />").addClass("scroll-view-content");
            this.$element().append(this._$scrollViewContent);
        }

        this.callBase();

        this._history = [];
        this._updateCount = 0;
        this._pageLoading = true;
        this._loading = false;
        this._pos = 0;
    },

    content() {
        return this._$scrollViewContent;
    },

    pullDown() {
        const pullDownHandler = this.option("onPullDown");
        if($.isFunction(pullDownHandler)) {
            pullDownHandler();
        }
    },

    scrollBottom() {
        const scrollBottomHandler = this.option("onReachBottom");

        if($.isFunction(scrollBottomHandler)) {
            scrollBottomHandler();
        }
    },

    release(hideOrShow) {
        this._history.push(new Date());
        this.toggleLoading(!hideOrShow);
        $(this.$element()).trigger("released");
    },

    toggleLoading(showOrHide) {
        this._pageLoading = showOrHide;
    },

    update() {
        this._updateCount++;
        return $.Deferred().resolve().promise();
    },

    isFull() {
        return true;
    },

    startLoading() {
        this._loading = true;
    },

    finishLoading() {
        this._loading = false;
    },

    scrollTo(pos) {
        this._pos = pos;
    },

    scrollTop() {
        return this._pos;
    },

    scrollOffset() {
        return { top: this._pos };
    }
});

const moduleSetup = {
    beforeEach: () => {
        executeAsyncMock.setup();

        this.element = $("#list");

        this.originalScrollView = ScrollView;
        List.mockScrollView(ScrollViewMock);
        registerComponent("dxScrollView", ScrollViewMock);

        this.clock = sinon.useFakeTimers();
        $.fx.off = true;
    },
    afterEach: () => {
        executeAsyncMock.teardown();

        List.mockScrollView(ScrollView);
        registerComponent("dxScrollView", this.originalScrollView);

        this.clock.restore();
        $.fx.off = false;
    }
};

const LIST_GROUP_COLLAPSED_CLASS = "dx-list-group-collapsed";
const LIST_COLLAPSIBLE_GROUPS_CLASS = "dx-list-collapsible-groups";

QUnit.module("collapsible groups", moduleSetup, () => {
    QUnit.test("collapsible groups class should be present if groups can be collapsed", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        assert.ok($element.hasClass(LIST_COLLAPSIBLE_GROUPS_CLASS), "collapsible groups class is present");

        $element.dxList("option", "collapsibleGroups", false);
        assert.ok(!$element.hasClass(LIST_COLLAPSIBLE_GROUPS_CLASS), "collapsible groups class is present");
    });

    QUnit.test("focus should move to first group's item when group expands", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: true,
            collapsibleGroups: true
        });

        const $headers = $element.find(toSelector(LIST_GROUP_HEADER_CLASS));
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));

        const instance = $element.dxList("instance");

        $element.trigger("focusin");

        $headers.eq(1).trigger("dxclick");
        $headers.eq(1).trigger("dxclick");
        assert.equal(isRenderer(instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
        assert.ok($items.eq(2).hasClass("dx-state-focused"), "first item of the second group is focused");
        assert.notOk($items.eq(0).hasClass("dx-state-focused"), "first item of the first group lost focus");
    });

    QUnit.test("focus class should not be added to any item when expanding group via api", assert => {
        const element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: true,
            collapsibleGroups: true
        }).dxList("instance");

        const $items = this.element.find(toSelector(LIST_ITEM_CLASS));

        element.expandGroup(0);

        assert.notOk($items.eq(0).hasClass("dx-state-focused"), "first item has not focused class");
    });

    QUnit.test("focus class should not be added to first group item when focusStateEnabled is false", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["11", "12"] }, { key: "b", items: ["21", "22"] }],
            grouped: true,
            focusStateEnabled: false,
            collapsibleGroups: true
        });

        const $headers = $element.find(toSelector(LIST_GROUP_HEADER_CLASS));
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));

        $element.trigger("focusin");

        $headers.eq(1).trigger("dxclick");
        $headers.eq(1).trigger("dxclick");
        assert.notOk($items.eq(2).hasClass("dx-state-focused"), "first item of the second group is focused");
    });

    QUnit.test("group body should be collapsed by click on header", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        const $group = $element.find("." + LIST_GROUP_CLASS);
        const $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

        $groupHeader.trigger("dxclick");
        assert.ok($group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is present");
        $groupHeader.trigger("dxclick");
        assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
    });

    QUnit.test("group body should be not collapsed by click on header if collapsibleGroups is disabled", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: false
        });

        const $group = $element.find("." + LIST_GROUP_CLASS);
        const $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

        $groupHeader.trigger("dxclick");
        assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
    });

    QUnit.test("group body should be not collapsed by click on header in disabled state", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true,
            disabled: true
        });

        const $group = $element.find("." + LIST_GROUP_CLASS);
        const $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

        $groupHeader.trigger("dxclick");
        assert.ok(!$group.hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");
    });

    const LIST_GROUP_HEADER_INDICATOR_CLASS = "dx-list-group-header-indicator";

    QUnit.test("group header collapsed indicator element for the Material theme", assert => {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = () => {
            return true;
        };

        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        const $groupHeader = $element.find(toSelector(LIST_GROUP_CLASS) + " " + toSelector(LIST_GROUP_HEADER_CLASS));

        assert.equal($groupHeader.find(toSelector(LIST_GROUP_HEADER_INDICATOR_CLASS)).length, 1, "group header has the collapsed indicator element for the Material theme");

        themes.isMaterial = origIsMaterial;
    });

    QUnit.test("no group header collapsed indicator element for the Generic theme", assert => {
        const $element = this.element.dxList({
            items: [{ key: "a", items: ["0"] }],
            grouped: true,
            collapsibleGroups: true
        });

        const $groupHeader = $element.find(toSelector(LIST_GROUP_CLASS) + " " + toSelector(LIST_GROUP_HEADER_CLASS));

        assert.equal($groupHeader.find(toSelector(LIST_GROUP_HEADER_INDICATOR_CLASS)).length, 0, "group header should not have collapsed indicator element for the Generic theme");
    });

    QUnit.test("group collapsing is animated", assert => {
        try {
            const animateSpy = sinon.spy(fx, "animate");

            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true
            });

            const $group = $element.find("." + LIST_GROUP_CLASS);
            const $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);
            const $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);

            const groupBodyHeight = $groupBody.height();

            $groupHeader.trigger("dxclick");

            const args = animateSpy.getCall(0).args;

            assert.ok(animateSpy.calledOnce, "fx.animate is executed");
            assert.equal(args[0].get(0), $groupBody.get(0), "fx.animate ran on correct element");
            assert.equal(args[1].type, "custom", "fx.animate ran with correct animation type");
            assert.equal(args[1].from.height, groupBodyHeight, "fx.animate ran with correct start height");
            assert.equal(args[1].to.height, 0, "fx.animate ran with correct end height");
        } finally {
            fx.animate.restore();
        }
    });

    QUnit.test("group collapsing should update scroller position after animation", assert => {
        const origAnimate = fx.animate;

        try {
            const animationDeferred = $.Deferred();

            fx.animate = sinon.spy((_, options) => {
                animationDeferred.done(() => {
                    options.complete();
                });
            });

            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true
            });

            const updateDimensionsSpy = sinon.spy();
            this.element.dxList("instance").updateDimensions = updateDimensionsSpy;

            const $group = $element.find("." + LIST_GROUP_CLASS);
            const $groupHeader = $group.find("." + LIST_GROUP_HEADER_CLASS);

            $groupHeader.trigger("dxclick");
            assert.ok(!updateDimensionsSpy.called, "updateDimensions is not executed");
            animationDeferred.resolve();
            assert.ok(updateDimensionsSpy.calledOnce, "updateDimensions is executed");
        } finally {
            fx.animate = origAnimate;
        }
    });

    QUnit.test("group should be collapsed by the collapseGroup method", assert => {
        const origAnimate = fx.animate;

        try {
            const AnimationDeferred = $.Deferred();

            fx.animate = sinon.spy((_, options) => {
                AnimationDeferred.done(() => {
                    options.complete();
                });
            });

            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true,
                disabled: true
            });

            const instance = $element.dxList("instance");

            const $group = $element.find("." + LIST_GROUP_CLASS);
            const $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);
            const groupBodyHeight = $groupBody.height();

            instance.collapseGroup(1).done(function() {
                assert.ok($group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is present");

                const args = fx.animate.getCall(0).args;

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

    QUnit.test("group should be stay collapsed if collapseGroup method called twice", assert => {
        fx.off = true;

        try {
            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true
            });

            const instance = $element.dxList("instance");

            const $group = $element.find("." + LIST_GROUP_CLASS);
            const $groupBody = $group.eq(1).find("." + LIST_GROUP_BODY_CLASS);

            instance.collapseGroup(1).done(() => {
                instance.collapseGroup(1).done(() => {
                    assert.ok($group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is present");
                    assert.equal($groupBody.height(), 0, "group is still collapsed");
                });
            });
        } finally {
            fx.off = false;
        }
    });

    QUnit.test("group should be stay expanded by the expandGroup method", assert => {
        fx.off = true;

        try {
            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true
            });

            const instance = $element.dxList("instance");

            const $group = $element.find("." + LIST_GROUP_CLASS);

            instance.expandGroup(1).done(() => {
                const $groupBody = $group.eq(1).find("." + LIST_GROUP_BODY_CLASS);

                assert.notOk($group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "group is expanded");
                assert.notEqual($groupBody.height(), 0, "group is still expanded");
            });
        } finally {
            fx.off = false;
        }
    });

    QUnit.test("group should be expanded by the expandGroup method", assert => {
        const origAnimate = fx.animate;

        try {
            const AnimationDeferred = $.Deferred();

            const $element = this.element.dxList({
                items: [{ key: "a", items: ["0"] }, { key: "b", items: ["0"] }],
                grouped: true,
                collapsibleGroups: true,
                disabled: true
            });

            const instance = $element.dxList("instance");

            const $group = $element.find("." + LIST_GROUP_CLASS);
            const $groupBody = $group.find("." + LIST_GROUP_BODY_CLASS);
            const groupBodyHeight = $groupBody.height();

            instance.collapseGroup(1);
            this.clock.tick(1000);

            fx.animate = sinon.spy((_, options) => {
                AnimationDeferred.done(() => {
                    options.complete();
                });
            });

            instance.expandGroup(1).done(function() {
                assert.ok(!$group.eq(1).hasClass(LIST_GROUP_COLLAPSED_CLASS), "collapsed class is not present");

                const args = fx.animate.getCall(0).args;

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

    QUnit.test("items on another page are selected when grouping is enabled", assert => {
        const list = this.element.dxList({
            dataSource: {
                store: [
                    { key: "first", text: "item 1" },
                    { key: "second", text: "item 2" }
                ],
                pageSize: 1,
                paginate: true,
                group: "key"
            },
            grouped: true,
            selectionMode: "multiple",
            selectedItemKeys: ["item 1", "item 2"],
            keyExpr: "text"
        }).dxList("instance");

        const selectedItems = list.option("selectedItems");

        assert.equal(selectedItems.length, 2, "count of selected items");
    });

    QUnit.test("scrollView should be updated after group collapsed", assert => {
        try {
            List.mockScrollView(this.originalScrollView);
            fx.off = true;

            const $element = this.element.dxList({
                dataSource: {
                    store: [{ key: "a", items: ["0", "1", "2", "3", "4"] }, {
                        key: "b",
                        items: ["0", "1", "2", "3", "4"]
                    }],
                    pageSize: 1
                },
                height: 60,
                grouped: true,
                collapsibleGroups: true,
                disabled: true,
                pageLoadMode: "scrollBottom"
            });

            const instance = $element.dxList("instance");

            instance.collapseGroup(0);

            this.clock.tick();

            const $groups = $element.find("." + LIST_GROUP_CLASS);
            assert.equal($groups.length, 2, "second group was loaded");
        } finally {
            fx.off = false;
        }
    });

    QUnit.test("scrollView should update its position after a group has been collapsed", assert => {
        try {
            List.mockScrollView(this.originalScrollView);
            fx.off = true;

            const $element = this.element.dxList({
                pageLoadMode: "scrollBottom",
                height: 130,
                scrollingEnabled: true,
                useNativeScrolling: false,
                dataSource: {
                    load(options) {
                        const d = $.Deferred(),
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
                        setTimeout(() => {
                            d.resolve(items.slice(options.skip, options.skip + options.take));
                        }, 50);
                        return d.promise();
                    },
                    group: "key",
                    pageSize: 1
                },
                grouped: true,
                collapsibleGroups: true,
                groupTemplate(data) {
                    return $("<div>").text(data.key);
                },
                itemTemplate(data) {
                    return $("<div>").text(data.a);
                }
            });

            const instance = $element.dxList("instance");
            const releaseSpy = sinon.spy(instance._scrollView, "release");

            this.clock.tick(50);

            instance.scrollTo(200);
            this.clock.tick(50);

            instance.scrollTo(200);
            this.clock.tick(50);

            instance.collapseGroup(2);
            this.clock.tick(50);

            assert.ok(releaseSpy.lastCall.args[0], "The last call of 'release' hides load indicator");
        } finally {
            fx.off = false;
        }
    });

    QUnit.test("more button shouldn't disappear after group collapsed with array store", assert => {
        try {
            List.mockScrollView(this.originalScrollView);
            fx.off = true;

            const $element = this.element.dxList({
                dataSource: {
                    store: [
                        { key: "a", items: ["0", "1", "2"] },
                        { key: "b", items: ["0", "1", "2"] },
                        { key: "c", items: ["0", "1", "2"] },
                        { key: "d", items: ["0", "1", "2"] }],
                    paginate: true,
                    pageSize: 3
                },
                pageLoadMode: "nextButton",
                height: 500,
                grouped: true,
                collapsibleGroups: true
            });

            const instance = $element.dxList("instance");

            instance.collapseGroup(1);

            this.clock.tick();
            assert.ok(instance.$element().find(".dx-list-next-button").length, "button was not removed");
        } finally {
            fx.off = false;
        }
    });

    QUnit.test("more button shouldn't disappear after group collapsed with custom store", assert => {
        try {
            List.mockScrollView(this.originalScrollView);
            fx.off = true;

            const data = [
                { key: "a", items: ["0", "1", "2"] },
                { key: "b", items: ["0", "1", "2"] },
                { key: "c", items: ["0", "1", "2"] },
                { key: "d", items: ["0", "1", "2"] }];

            const $element = this.element.dxList({
                dataSource: {
                    load() {
                        return data;
                    },
                    paginate: true,
                    pageSize: 3
                },
                pageLoadMode: "nextButton",
                height: 400,
                grouped: true,
                collapsibleGroups: true
            });

            const instance = $element.dxList("instance");

            instance.collapseGroup(1);

            this.clock.tick();
            assert.ok(instance.$element().find(".dx-list-next-button").length, "button was not removed");
        } finally {
            fx.off = false;
        }
    });
});

QUnit.module("next button", moduleSetup, () => {
    const isElementHidden = $element => {
        return (!$element.length || $element.is(":hidden"));
    };

    QUnit.test("show next button", assert => {
        this.element.dxList({
            dataSource: {
                store: [1, 2, 3],
                pageSize: 2
            },
            pageLoadMode: "nextButton",
            scrollingEnabled: true
        }).dxList("instance");
        const nextButton = $(".dx-list-next-button ", this.element);

        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2, "first page loaded");
        $(".dx-button", nextButton).trigger("dxclick");
        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "second page loaded");
    });

    QUnit.test("showNextButton", assert => {
        const list = this.element.dxList({
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

        const nextButton = $(".dx-list-next-button ", this.element);
        list._dataSource.isLoading = () => {
            return true;
        };
        $(".dx-button", nextButton).trigger("dxclick");
        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2, "ignore nextButton click when data loading");
        list._dataSource.isLoading = () => {
            return false;
        };

        $(".dx-button", nextButton).trigger("dxclick");
        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 3, "second page loaded");
        assert.ok(isElementHidden($(".dx-list-next-button", this.element)), "no nextButton showed, if all data is loaded");
    });

    QUnit.test("nextButtonText", assert => {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        const list = this.element.dxList({
            dataSource,
            pageLoadMode: "nextButton",
            scrollingEnabled: true,
            nextButtonText: "Text"
        }).dxList("instance");

        assert.equal(this.element.find(".dx-list-next-button").text(), "Text");

        list.option("nextButtonText", "anotherText");
        assert.equal(this.element.find(".dx-list-next-button").text(), "anotherText");
    });

    QUnit.test("no nextButton when no dataSource", assert => {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        const list = this.element.dxList({}).dxList("instance");

        assert.ok(isElementHidden($(".dx-list-next-button", this.element)));

        list.option("pageLoadMode", "scrollButton");
        assert.ok(isElementHidden($(".dx-list-next-button", this.element)));
        list.option("pageLoadMode", "nextButton");

        list.option("dataSource", dataSource);
        assert.ok($(".dx-list-next-button", this.element).is(":visible"));

        list.option("dataSource", []);
        assert.ok(isElementHidden($(".dx-list-next-button", this.element)));
    });

    QUnit.test("nextButton should not be removed after repaint", assert => {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        const list = this.element.dxList({
            dataSource,
            pageLoadMode: "nextButton"
        }).dxList("instance");

        list.repaint();
        assert.ok($(".dx-list-next-button", this.element).text());
    });

    QUnit.test("nextButton should be removed after search if result items count is smaller than page size, repaintChangesOnly=true (T838645)", assert => {
        const list = this.element.dxList({
            repaintChangesOnly: true,
            dataSource: {
                store: ["1", "2", "3"],
                pageSize: 3
            },
            pageLoadMode: "nextButton",
            searchEnabled: true
        }).dxList("instance");

        const nextButtonSelector = ".dx-list-next-button";
        const $element = list.$element();

        assert.ok($element.find(nextButtonSelector).length, "nextButton is shown");
        list.option("searchValue", "1");
        assert.notOk($element.find(nextButtonSelector).length, "nextButton is removed");
    });
});

QUnit.module("options", moduleSetup, () => {
    QUnit.test("dataSource as config", assert => {
        const element = this.element.dxList({
            dataSource: {
                store: new ArrayStore([5, 3, 4, 2, 1]),
                sort: "this"
            },
            pageLoadMode: "scrollBottom"
        });

        assert.equal(element.text(), "12345");
        assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
    });

    QUnit.test("dataSource as array", assert => {
        const element = this.element.dxList({
            dataSource: [1, 2, 3, 4, 5],
            pageLoadMode: "scrollBottom"
        });

        assert.equal(element.text(), "12345");
        assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
    });

    QUnit.test("dataSource as store", assert => {
        const element = this.element.dxList({
            dataSource: new ArrayStore([1, 2, 3, 4, 5]),
            pageLoadMode: "scrollBottom"
        });

        assert.equal(element.text(), "12345");
        assert.deepEqual(element.dxList("instance").option("items"), [1, 2, 3, 4, 5]);
    });

    QUnit.test("wrapItemText option", (assert) => {
        const element = this.element.dxList({
            items: [1],
            wrapItemText: true
        });
        const instance = element.dxList("instance");
        const $container = instance._itemContainer();

        assert.ok($container.hasClass("dx-wrap-item-text"), "class was added");

        instance.option("wrapItemText", false);
        assert.notOk($container.hasClass("dx-wrap-item-text"), "class was removed");
    });
});

QUnit.module("options changed", moduleSetup, () => {
    QUnit.test("dataSource", assert => {
        const element = this.element.dxList({
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

    QUnit.test("items", assert => {
        const element = this.element.dxList({
            items: [0, 1, 3, 5, 4]
        });

        assert.equal(element.text(), "01354");

        element.dxList({
            items: [2, 6, 8, 9, 7]
        });

        assert.equal(element.text(), "26897");
    });

    QUnit.test("scrollingEnabled", assert => {
        const list = this.element.dxList({
            scrollingEnabled: false
        }).dxList("instance");

        assert.ok(list._scrollView.option("disabled"));

        list.option("scrollingEnabled", true);
        assert.ok(!list._scrollView.option("disabled"));
    });

    QUnit.test("scrollView disables when list is disabled", assert => {
        const list = this.element.dxList({ disabled: false }).dxList("instance");
        const scrollView = this.element.dxScrollView("instance");

        assert.ok(!scrollView.option("disabled"), "list is enabled, scrollView is enabled too");

        list.option("disabled", true);

        assert.ok(scrollView.option("disabled"), "list is disabled, scrollView is disabled too");
    });

    QUnit.test("onItemSwipe", assert => {
        assert.expect(2);

        const swipeHandler = () => {
            assert.ok(true, "swipe handled");
        };

        const list = this.element.dxList({
            items: [0],
            onItemSwipe: swipeHandler,
            itemHoldTimeout: 0,
            scrollingEnabled: true
        }).dxList("instance");

        const item = $.proxy(function() {
            return this.element.find(toSelector(LIST_ITEM_CLASS)).eq(0);
        }, this);
        const swipeItem = () => {
            pointerMock(item()).start().swipeStart().swipe(0.5).swipeEnd(1);
        };

        swipeItem();

        list.option("onItemSwipe", null);
        swipeItem();

        list.option("onItemSwipe", swipeHandler);
        swipeItem();
    });

    QUnit.test("displayExpr option change", assert => {
        const instance = this.element.dxList({
            items: [{ id: 1, name: "Item text", caption: "New item text" }],
            displayExpr: "name"
        }).dxList("instance");

        assert.strictEqual(instance.itemElements().text(), "Item text", "displayExpr works");

        instance.option("displayExpr", "caption");
        assert.strictEqual(instance.itemElements().text(), "New item text", "item text was changed");
    });

    QUnit.test("dxList shouldn't show 'Loading' and 'No data' at the same time than dataSource option changed", assert => {
        const $list = $("#list").dxList({ pageLoadMode: "scrollBottom" });
        const instance = $list.dxList("instance");
        const scrollView = $list.dxScrollView("instance");

        assert.equal($list.find(".dx-empty-message").length, 1, "empty message was rendered");

        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        instance.option("dataSource", dataSource);

        assert.ok(scrollView._pageLoading, "scrollBottom div is visible");
        assert.equal($list.find(".dx-empty-message").length, 0, "empty message was not rendered");
    });

    QUnit.test("list should be able to change grouped option after dataSource option", assert => {
        const $element = $("#list").dxList({
            dataSource: [{ key: 'parent', items: [{ text: 'child' }] }],
            grouped: true
        });

        const instance = $element.dxList("instance");

        instance.option({
            dataSource: [{ text: 'one' }],
            grouped: false
        });

        assert.notOk(instance.option("grouped"), "grouped option was changed without exceptions");
    });

    QUnit.test("searchEnabled option changing", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true
        });

        const instance = $element.dxList("instance");

        instance.option("searchEnabled", false);

        assert.notOk($element.hasClass("dx-list-with-search"), "list without search");
        assert.notOk($element.find(".dx-list-search").length, "hasn't search editor");

        instance.option("searchEnabled", true);

        assert.ok($element.hasClass("dx-list-with-search"), "list with search");
        assert.ok($element.children().first().hasClass("dx-list-search"), "has search editor");
    });

    QUnit.test("searchValue", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchExpr: "this"
        });

        const instance = $element.dxList("instance");

        instance.option("searchValue", 2);

        assert.deepEqual(instance.option("items"), [2], "items");
        assert.strictEqual(instance.getDataSource().searchValue(), 2, "search value of dataSource");
    });

    QUnit.test("searchMode", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 21, 3],
            searchExpr: "this",
            searchValue: "1"
        });

        const instance = $element.dxList("instance");

        assert.deepEqual(instance.option("items"), [1, 21], "items");

        instance.option("searchMode", "startswith");

        assert.deepEqual(instance.option("items"), [1], "items");
        assert.strictEqual(instance.getDataSource().searchOperation(), "startswith", "search operation of dataSource");
    });

    QUnit.test("searchMode equals", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 11, 111],
            searchExpr: "this",
            searchMode: "equals",
            searchValue: "1"
        });

        const instance = $element.dxList("instance");

        assert.deepEqual(instance.option("items"), [1], "items");
        assert.strictEqual(instance.getDataSource().searchOperation(), "=", "search operation of dataSource");
    });

    QUnit.test("searchExpr", assert => {
        const $element = $("#list").dxList({
            dataSource: [
                { text: "test1", value: "3" },
                { text: "test2", value: "3" },
                { text: "test3", value: "2" }
            ],
            searchExpr: "text",
            searchValue: "3"
        });

        const instance = $element.dxList("instance");

        assert.deepEqual(instance.option("items"), [{ text: "test3", value: "2" }], "items");

        instance.option("searchExpr", "value");

        assert.deepEqual(instance.option("items"), [{ text: "test1", value: "3" }, {
            text: "test2",
            value: "3"
        }], "items");
        assert.strictEqual(instance.getDataSource().searchExpr(), "value", "search operation of dataSource");
    });

    QUnit.test("searchEditorOptions", assert => {
        let searchEditorInstance;

        const $element = $("#list").dxList({
            dataSource: [
                { text: "test1", value: "3" },
                { text: "test2", value: "3" },
                { text: "test3", value: "2" }
            ],
            searchEnabled: true,
            searchEditorOptions: {
                placeholder: "Search"
            }
        });

        const instance = $element.dxList("instance");

        searchEditorInstance = $element.children(".dx-list-search").dxTextBox("instance");
        assert.strictEqual(searchEditorInstance.option("placeholder"), "Search", "placeholder of the search box");

        instance.option("searchEditorOptions", { placeholder: "Test" });

        assert.strictEqual(searchEditorInstance.option("placeholder"), "Test", "placeholder of the search box");
    });

    QUnit.test("apply list search options if dataSource set as dataSource instance", assert => {
        const instance = $("#list").dxList({
            dataSource: new DataSource({
                store: [],
                searchExpr: "test",
                searchValue: "1",
                searchOperation: "contains"
            }),
            searchExpr: "expr",
            searchValue: "2",
            searchMode: "startsWith"
        }).dxList("instance");

        const ds = instance.getDataSource();

        assert.strictEqual(ds.searchExpr(), "expr", "search expression is applied");
        assert.strictEqual(ds.searchValue(), "2", "search value is applied");
        assert.strictEqual(ds.searchOperation(), "startsWith", "search operation is applied");
    });

    QUnit.test("apply dataSource options if list search options are default", assert => {
        const instance = $("#list").dxList({
            dataSource: new DataSource({
                store: [],
                searchExpr: "expr",
                searchValue: "2",
                searchOperation: "startsWith"
            })
        }).dxList("instance");

        const ds = instance.getDataSource();

        assert.strictEqual(ds.searchExpr(), "expr", "search expression is applied");
        assert.strictEqual(ds.searchValue(), "2", "search value is applied");
        assert.strictEqual(ds.searchOperation(), "startsWith", "search operation is applied");
    });

    QUnit.test("dataSource change should save filter", assert => {
        const getDataSource = data => {
            return new DataSource({
                store: new ArrayStore({
                    data
                })
            });
        };
        const data1 = [{ text: "test 1" }, { text: "test 2" }];
        const data2 = [{ text: "item 1" }, { text: "item 2" }];

        const instance = $("#list").dxList({
            dataSource: getDataSource(data1),
            searchExpr: "text",
            searchValue: "2"
        }).dxList("instance");

        assert.deepEqual(instance.option("items"), [{ text: "test 2" }], "initial items");

        instance.option("dataSource", getDataSource(data2));

        assert.deepEqual(instance.option("items"), [{ text: "item 2" }], "updated items");
    });
});

QUnit.module("selection", moduleSetup, () => {
    QUnit.test("should select item from invisible page", (assert) => {
        const clock = sinon.useFakeTimers();
        const done = assert.async();

        $("#list").dxList({
            selectionMode: "single",
            onSelectionChanged: (e) => {
                assert.deepEqual(e.addedItems, ['Item5']);
                done();
            },
            selectedItemKeys: 'Item5',
            dataSource: {
                pageSize: 3,
                paginate: true,
                store: new CustomStore({
                    load: ({ take }) => {
                        const deferred = $.Deferred();

                        setTimeout(() => deferred.resolve(['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'].slice(0, take)), 0);

                        return deferred.promise();
                    }
                })
            }
        });

        clock.tick(0);
    });

    QUnit.test("selection should not be removed after second click if selectionMode is single", assert => {
        const $element = this.element.dxList({
            items: [1],
            selectionMode: "single"
        });

        const $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(0);

        $item.trigger("dxclick");
        $item.trigger("dxclick");

        assert.ok($item.hasClass("dx-list-item-selected"), "item should not lose selection");
    });
});

QUnit.module("events", moduleSetup, () => {
    QUnit.test("onItemClick should be fired when item is clicked in ungrouped list", assert => {
        let actionFired;
        let actionData;

        const $element = this.element.dxList({
            items: ["0"],
            grouped: false,
            onItemClick(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find(toSelector(LIST_ITEM_CLASS));

        $item.trigger("dxclick");
        assert.ok(actionFired, "action fired");
        assert.strictEqual($item[0], $(actionData.itemElement)[0], "correct element passed");
        assert.strictEqual("0", actionData.itemData, "correct element passed");
    });

    QUnit.test("onItemClick should be fired when item is clicked in grouped list", assert => {
        let actionFired;
        let actionData;

        const items = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            },
            {
                key: 'second',
                items: [{ a: 3 }, { a: 4 }, { a: 5 }]
            }
        ];

        const $element = this.element.dxList({
            items,
            grouped: true,
            onItemClick(args) {
                actionFired = true;
                actionData = args;
            }
        });
        const $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(3);

        $item.trigger("dxclick");

        assert.ok(actionFired, "action fired");

        assert.strictEqual($item[0], $(actionData.itemElement)[0], "correct element passed");
        assert.strictEqual(items[1].items[0], actionData.itemData, "correct element passed");
        assert.strictEqual(0, actionData.itemIndex.item, "correct element itemIndex passed");
        assert.strictEqual(1, actionData.itemIndex.group, "correct groupIndex passed");
    });

    QUnit.test("onItemHold should be fired when item is held", assert => {
        let actionFired;
        let actionData;

        const $element = this.element.dxList({
            items: ["0"],
            onItemHold(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find(toSelector(LIST_ITEM_CLASS));

        $item.trigger(holdEvent.name);
        assert.ok(actionFired, "action fired");
        assert.strictEqual($item[0], $(actionData.itemElement)[0], "correct element passed");
        assert.strictEqual("0", actionData.itemData, "correct element passed");
    });

    QUnit.test("onItemSwipe should be fired when item is swiped", assert => {
        let actionFired;
        let actionData;

        const $element = this.element.dxList({
            items: ["0"],
            onItemSwipe(args) {
                actionFired = true;
                actionData = args;
            }
        });

        const $item = $element.find(toSelector(LIST_ITEM_CLASS));

        $item.trigger({
            type: swipeEvents.end,
            offset: -1
        });
        assert.ok(actionFired, "action fired");
        assert.strictEqual($item[0], $(actionData.itemElement)[0], "correct element passed");
        assert.strictEqual("0", actionData.itemData, "correct element passed");
        assert.equal("left", actionData.direction, "correct direction passed");

        $item.trigger({
            type: swipeEvents.end,
            offset: 1
        });
        assert.equal("right", actionData.direction, "correct direction passed");
    });

    QUnit.test("onContentReady", assert => {
        let contentReadyFired = 0;

        const instance = $("#list").dxList({
            onContentReady() {
                contentReadyFired++;
            }
        }).dxList("instance");

        assert.equal(contentReadyFired, 1);

        instance.option("items", ["a", "b"]);
        assert.equal(contentReadyFired, 2);
    });

    QUnit.test("onGroupRendered should fired with correct params", assert => {
        const items = [
            {
                key: 'first',
                items: [{ a: 0 }, { a: 1 }, { a: 2 }]
            }
        ];

        let groupRendered = 0;
        let eventData = [];

        const $list = $("#list").dxList({
            items,
            grouped: true,
            onGroupRendered(args) {
                eventData = args;
                groupRendered++;
            }
        });

        assert.equal(groupRendered, 1, "event triggered");
        assert.strictEqual(isRenderer(eventData.groupElement), !!config().useJQuery, "groupElement is correct");
        assert.strictEqual($(eventData.groupElement)[0], $list.find(".dx-list-group")[0], "groupElement is correct");
        assert.strictEqual(eventData.groupData, items[0], "groupData is correct");
        assert.strictEqual(eventData.groupIndex, 0, "groupIndex is correct");
    });

    QUnit.test("list should prevent default behavior when context menu event is firing", assert => {
        const $list = $("#list").dxList({
            items: [{ text: "test" }],
            menuMode: "context",
            menuItems: [{ text: "action", action: noop }]
        });

        const $item = $list.find(".dx-list-item").eq(0);

        const contextMenuEvent = $.Event("contextmenu", { pointerType: "mouse" });
        $item.trigger(contextMenuEvent);

        assert.ok(contextMenuEvent.isDefaultPrevented(), "default prevented");
    });
});

QUnit.module("dataSource integration", moduleSetup, () => {
    QUnit.test("pageLoading should be ordered for async dataSource (T233998)", assert => {
        List.mockScrollView(ScrollViewMock.inherit({
            isFull() {
                return false;
            }
        }));

        const $list = $("#list").dxList({
            dataSource: {
                load(option) {
                    const deferred = $.Deferred();

                    setTimeout(() => {
                        deferred.resolve([option.skip]);
                    }, 100);

                    return deferred.promise();
                },
                pageSize: 1
            },
            pageLoadMode: "scrollBottom"
        });

        this.clock.tick(300);

        assert.equal($.trim($list.find(".dx-list-item").text()), "012");
    });

    QUnit.test("shared data source", assert => {
        const dataSource = new DataSource();
        let widget;
        let changedHandler;

        this.element.dxList({
            dataSource
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

    QUnit.test("aggregated source (created from options)", assert => {
        const dataSourceConfig = {
            store: new ArrayStore([])
        };

        this.element.dxList({
            dataSource: dataSourceConfig
        });

        const widget = this.element.dxList("instance");
        const dataSource = widget._dataSource;
        assert.ok(dataSource instanceof DataSource);
        assert.ok("_store" in dataSource);

        widget._dispose();
        assert.ok(!("_store" in dataSource), "aggregated source is disposed");
        assert.ok(!("_dataSource" in widget), "source is unlinked");
    });

    QUnit.test("list shouldn't load dataSource again after first request fail (B253304)", assert => {
        let loadCalled = 0;

        $("#list").dxList({
            dataSource: {
                load() {
                    loadCalled++;
                    return $.Deferred().reject().promise();
                }
            }
        });

        assert.equal(loadCalled, 1, "load called once");
    });

    QUnit.test("loading indication panel should not be shown when list has no items", assert => {
        const element = this.element;
        element.dxList({
            height: 300,
            pageLoadMode: "scrollBottom",
            showSelectionControls: true,
            dataSource: {
                paginate: true,
                load() {
                    return $.Deferred();
                }
            }
        });

        const scrollView = element.dxScrollView("instance");
        this.clock.tick();
        assert.equal(scrollView._loading, false, "scrollView not in loading state");
    });

    QUnit.test("list indicates loading during dataSource loading", assert => {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load() {
                const deferred = $.Deferred();

                setTimeout(() => {
                    deferred.resolve([1, 2]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = this.element.dxList({
            dataSource
        });

        const scrollView = element.dxScrollView("instance");
        this.clock.tick(dataSourceLoadTime);
        assert.equal(scrollView._loading, false, "scrollview not in loading state after first data load");

        dataSource.load();
        this.clock.tick();
        assert.equal(scrollView._loading, true, "scrollview loading started on data reload");

        this.clock.tick(dataSourceLoadTime);
        assert.equal(scrollView._loading, false, "scrollview loading finished on data load");
    });

    QUnit.test("list doesn't indicate loading during dataSource loading when indicateLoading = false", assert => {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load() {
                const deferred = $.Deferred();

                setTimeout(() => {
                    deferred.resolve([]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = this.element.dxList({
            dataSource,
            indicateLoading: false
        });

        const scrollView = element.dxScrollView("instance");
        this.clock.tick(dataSourceLoadTime);
        assert.equal(scrollView._loading, false, "scrollView not in loading state");

        dataSource.load();
        assert.equal(scrollView._loading, false, "scrollView loading not indicated");
    });

    QUnit.test("setting indicateLoading to false hides load panel at once", assert => {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load() {
                const deferred = $.Deferred();

                setTimeout(() => {
                    deferred.resolve([]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = this.element.dxList({
            dataSource
        });

        const scrollView = element.dxScrollView("instance");
        this.clock.tick(dataSourceLoadTime);

        dataSource.load();

        setTimeout(() => {
            element.dxList("option", "indicateLoading", false);
        }, dataSourceLoadTime / 2);

        this.clock.tick(dataSourceLoadTime / 2);
        assert.equal(scrollView._loading, false, "scrollview loading not indicated");
    });

    QUnit.test("list doesn't indicate loading when click more button", assert => {
        const dataSourceLoadTime = 100;

        const element = this.element.dxList({
            dataSource: new DataSource({
                load() {
                    const deferred = $.Deferred();

                    setTimeout(() => {
                        deferred.resolve([1, 2]);
                    }, 0);

                    return deferred.promise();
                },
                pageSize: 2
            }),
            pageLoadMode: "nextButton"
        });

        const scrollView = element.dxScrollView("instance");
        this.clock.tick(dataSourceLoadTime);

        element.find(".dx-list-next-button .dx-button").trigger("dxclick");
        assert.equal(scrollView._loading, false, "scrollview loading started");
    });

    QUnit.test("reload", assert => {
        let loaded = 0;
        const $list = this.element.dxList({
            dataSource: new DataSource({
                load() {
                    const deferred = $.Deferred();
                    deferred.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
                    loaded++;
                    return deferred.promise();
                }
            })
        });
        const loadedOnInit = loaded;
        const list = $list.dxList("instance");

        list.scrollTo(10);
        list.reload();

        assert.equal(loaded, loadedOnInit + 1, "loaded fired after reload");
        assert.equal(list.scrollTop(), 0, "scroll to top after reload");
    });

    QUnit.test("first item rendered when pageSize is 1 and dataSource set as array", assert => {
        List.mockScrollView(ScrollViewMock.inherit({
            isFull() {
                return false;
            }
        }));

        const $list = this.element.dxList({
            pageLoadMode: "scrollBottom",
            dataSource: {
                store: [1, 2, 3, 4],
                pageSize: 1
            }
        });

        assert.equal($list.find(".dx-list-item").eq(0).text(), "1", "first item rendered");
    });

    QUnit.test("list should scroll to top if data source is load is happened", assert => {
        let loaded = 0;

        const data = (() => {
            const result = [];

            for(let i = 1; i <= 50; i++) {
                result.push("item " + i);
            }

            return result;
        })();

        const ds = new DataSource({
            load() {
                loaded++;
                return data;
            },
            pageSize: 1
        });

        const $list = this.element.dxList({
            dataSource: ds,
            pageLoadMode: "scrollBottom"
        });

        const instance = $list.dxList("instance");

        const loadedOnInit = loaded;
        instance.scrollTo(200);
        assert.equal(instance.scrollTop(), 200, "list is scrolled");

        ds.pageIndex(0);
        ds.load();

        assert.equal(loaded, loadedOnInit + 1, "dataSource load was fired");
        assert.equal(instance.scrollTop(), 0, "list scrolled to top");
    });
});

QUnit.module("infinite list scenario", moduleSetup, () => {
    QUnit.test("appending items on scroll bottom", assert => {
        const element = this.element.dxList({
            pageLoadMode: "scrollBottom",
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

    QUnit.test("scroll bottom action shouldn't load data if all items was loaded", assert => {
        let count = 0;
        const element = this.element.dxList({
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            dataSource: {
                load() {
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

    QUnit.test("appending items on scroll bottom", assert => {
        const element = this.element.dxList({
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

    QUnit.test("appending items on 'more' button", assert => {
        const element = this.element.dxList({
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

    QUnit.test("more button should have default type for the Material theme", assert => {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = () => {
            return true;
        };

        const element = this.element.dxList({
            dataSource: {
                store: new ArrayStore([1, 2, 3, 4]),
                pageSize: 2
            },
            pageLoadMode: "nextButton",
            scrollingEnabled: true
        });

        const button = element.find(".dx-list-next-button .dx-button").dxButton("instance");

        assert.equal(button.option("type"), "default", "more button should have default type for the Material theme");

        themes.isMaterial = origIsMaterial;
    });

    QUnit.test("more button should have undefined type for the Generic theme", assert => {
        const element = this.element.dxList({
            dataSource: {
                store: new ArrayStore([1, 2, 3, 4]),
                pageSize: 2
            },
            pageLoadMode: "nextButton",
            scrollingEnabled: true
        });

        const button = element.find(".dx-list-next-button .dx-button").dxButton("instance");

        assert.equal(button.option("type"), undefined, "more button should have undefined type for the Generic theme");
    });

    QUnit.test("should not expect appending items if items were appended just now", assert => {
        const element = this.element.dxList({
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

    QUnit.test("should not expect appending items if all items loaded", assert => {
        const element = this.element.dxList({
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

    QUnit.test("should not expect appending items if load error handled", assert => {
        const element = this.element.dxList({
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            dataSource: {
                store: new ArrayStore([1, 2, 3]),
                pageSize: 2,
                map: (item, index) => {
                    // eslint-disable-next-line no-eval
                    return eval(item);
                }
            }
        });

        element.dxList("instance")._dataSource.load = () => {
            element.dxList("instance")._dataSource.fireEvent("loadError");
            return $.Deferred().reject().promise();
        };

        element.dxScrollView("instance").scrollBottom();

        assert.equal(element.text(), "12", "error occurred");

        assert.equal(element.dxList("instance")._startIndexForAppendedItems, null, "flag set correctly");
    });

    QUnit.test("infinite loading should not happen if widget element is hidden", assert => {
        const $element = this.element.hide().dxList({
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            dataSource: {
                store: new ArrayStore([1, 2, 3, 4]),
                pageSize: 2
            },
            onInitialized(e) {
                $(e.element).dxScrollView("instance").isFull = () => {
                    return false;
                };
            }
        });

        this.clock.tick();

        assert.deepEqual($element.dxList("option", "items"), [1, 2], "only first page is loaded");
    });

    QUnit.test("infinite loading should happen when widget element is shown", assert => {
        const $element = this.element.hide().dxList({
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            dataSource: {
                store: new ArrayStore([1, 2, 3, 4]),
                pageSize: 2
            },
            onInitialized(e) {
                $(e.element).dxScrollView("instance").isFull = () => {
                    return false;
                };
            }
        });

        this.clock.tick();

        $element.show().triggerHandler("dxshown");
        this.clock.tick();

        assert.deepEqual($element.dxList("option", "items"), [1, 2, 3, 4], "all data loaded");
    });
});

QUnit.module("scrollView interaction", moduleSetup, () => {
    QUnit.test("list.updateDimensions calls scrollView.update", assert => {
        assert.expect(4);

        const list = this.element.dxList({
            items: [1, 2, 3]
        }).dxList("instance");

        const scrollView = this.element.dxScrollView("instance");

        assert.equal(scrollView._updateCount, 0, "no update after render list");

        list.updateDimensions().done(function() {
            assert.ok(true);
            assert.equal(this, list);
        });

        list.updateDimensions();
        assert.equal(scrollView._updateCount, 2, "+2 after update() call");
    });

    QUnit.test("width & height option change should call update method of scroll view", assert => {
        const list = this.element.dxList({
            items: [1, 2, 3]
        }).dxList("instance");

        const scrollView = this.element.dxScrollView("instance");
        const updateCount = scrollView._updateCount;

        list.option("width", 100);
        list.option("height", 100);
        assert.equal(scrollView._updateCount, updateCount + 2, "scroll view updated twice");
    });

    QUnit.test("visible option change should call update method of scroll view", assert => {
        const list = this.element.dxList({
            visible: false
        }).dxList("instance");

        const scrollView = this.element.dxScrollView("instance");
        const updateCount = scrollView._updateCount;

        list.option("visible", true);
        assert.equal(scrollView._updateCount, updateCount + 1, "scroll view updated");
    });

    QUnit.test("scrollView callbacks", assert => {
        let reloaded = 0;
        let nextPageCalled = 0;
        let pullRefreshActionFired = 0;
        let pageLoadingActionFired = 0;

        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        dataSource.pageIndex = newIndex => {
            if(newIndex === 0) {
                reloaded = true;
            }
        };
        dataSource.load = () => {
            dataSource.fireEvent("changed");
            nextPageCalled = true;
            return $.when(false);
        };

        const element = this.element;

        element.dxList({
            dataSource,
            pullRefreshEnabled: true,
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            onPullRefresh() {
                pullRefreshActionFired++;
            },
            onPageLoading() {
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

    QUnit.test("rtlEnabled option should be passed to scrollView", assert => {
        const list = this.element.dxList({
            items: [1, 2, 3],
            rtlEnabled: true
        }).dxList("instance");

        const scrollView = this.element.dxScrollView("instance");

        assert.ok(scrollView.option("rtlEnabled"), "rtlEnabled option is passed to scrollView on init");

        list.option("rtlEnabled", false);
        assert.ok(!scrollView.option("rtlEnabled"), "rtlEnabled option is passed to scrollView on optionChange");
    });
});

QUnit.module("scrollView integration", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test("on repaint scroll should be moved to top", assert => {
        const $list = $("#list");
        $list.height(100);
        $list.dxList({
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
            useNativeScrolling: false
        });
        $list.dxList("scrollTo", 100);
        $list.dxList("repaint");

        assert.equal($list.dxList("scrollTop"), 0);
    });

    QUnit.test("on start scrollbar has correct height", assert => {
        const $list = $("#list");
        $list.height(100);

        $list.dxList({
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
            useNativeScrolling: false
        });

        const $scrollViewContent = $list.find(".dx-scrollview-content");
        const $scrollableScroll = $list.find(".dx-scrollable-scroll");

        this.clock.tick(1);

        const scrollBarSize = Math.round(Math.pow($list.height(), 2) / $scrollViewContent.height());
        assert.equal($scrollableScroll.height(), scrollBarSize, "scrollbar has correct height");
    });

    QUnit.test("update scroll after change items", assert => {
        const $list = $("#list")
            .dxList({
                height: 50,
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
                useNativeScrolling: true
            });

        const scrollView = $list.dxScrollView("instance");
        const list = $list.dxList("instance");
        const contentHeight = $(scrollView.content()).height();

        list.option("items", [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        const newHeight = $(scrollView.content()).height();
        assert.equal(newHeight, contentHeight * 2, "update after items was changed");
    });

    QUnit.test("infinite sync data loading if scrollView is not full", assert => {
        const dataSource = new DataSource({
            store: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            pageSize: 1
        });

        const listHeight = 60;

        const $list = $("#list").height(listHeight).dxList({
            dataSource,
            pageLoadMode: "scrollBottom"
        });

        this.clock.tick(1);
        const listItems = $(toSelector(LIST_ITEM_CLASS), $list);
        const itemHeight = listItems.height();
        assert.ok(itemHeight * listItems.length >= listHeight);
        assert.ok(itemHeight * listItems.length <= listHeight + itemHeight);
    });

    QUnit.test("infinite async data loading if scrollView is not full", assert => {
        let count = 0;
        const dataSource = new DataSource({
            load() {
                const result = $.Deferred();
                setTimeout(() => {
                    result.resolve([count++]);
                }, 400);
                return result.promise();
            },
            pageSize: 1
        });

        const listHeight = 60;

        const $list = $("#list").height(listHeight).dxList({
            dataSource,
            pageLoadMode: "scrollBottom"
        });

        this.clock.tick(801); // NOTE: wait for two pages 400ms per one
        const listItems = $(toSelector(LIST_ITEM_CLASS), $list);
        assert.equal(listItems.eq(0).text(), "0");
        assert.equal(listItems.eq(1).text(), "1");
    });

    QUnit.test("list should try to load next page if scrollView is not full after dimensions updated", assert => {
        const $element = $("#list").dxList({
            pageLoadMode: "scrollBottom",
            height: 300,
            scrollingEnabled: true,
            onInitialized(e) {
                const list = e.component;
                const $list = $(e.element);

                $list.dxScrollView("instance").isFull = () => {
                    const height = list.option("height");
                    return height <= 300;
                };
            },
            dataSource: {
                load(options) {
                    const d = $.Deferred();
                    const items = [1, 2, 3, 4, 5, 6];

                    setTimeout(() => {
                        d.resolve(items.slice(options.skip, options.skip + options.take));
                    }, 50);

                    return d.promise();
                },
                pageSize: 3
            }
        });

        this.clock.tick(100);

        const instance = $element.dxList("instance");
        instance.option("height", 400);
        instance.updateDimensions();
        this.clock.tick(100);

        assert.deepEqual($element.find(".dx-list-item").length, 6, "all data loaded");
    });

    QUnit.test("list should be scrolled to item from bottom by scrollToItem", assert => {
        const $list = $("#list").dxList({
            items: ["0"]
        });

        const list = $list.dxList("instance");

        const $item = list.itemElements().eq(0);

        const scrollToElementSpy = sinon.spy();
        $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

        list.scrollToItem($item);
        assert.equal(scrollToElementSpy.firstCall.args[0].get(0), $item.get(0), "list scrolled to item");
    });

    QUnit.test("it should be possible to scroll to an item by denormalized index", assert => {
        const $list = $("#list").dxList({
            dataSource: new DataSource({
                store: [{ group: "Group 1", text: "Item 1", id: 1 }, { group: "Group 2", text: "Item 2", id: 2 }],
                key: "id",
                group: "group"
            }),
            grouped: true
        });

        const list = $list.dxList("instance");
        const $item = list.itemElements().eq(1);
        const scrollToElementSpy = sinon.spy($list.dxScrollView("instance"), "scrollToElement");

        list.scrollToItem(list.option("items")[1]);
        assert.equal(scrollToElementSpy.getCall(0).args[0].text(), $item.text(), "list scrolled to correct item");
    });

    QUnit.test("list shouldn't be scrolled if item isn't specified", assert => {
        const $list = $("#list").dxList({
            items: ["0"]
        });

        const list = $list.dxList("instance");

        const scrollToElementSpy = sinon.spy();
        $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

        list.scrollToItem($());
        assert.equal(scrollToElementSpy.firstCall.args[0], null, "list wasn't scrolled");
    });

    QUnit.test("list should be scrolled to item from bottom by scrollToItem", assert => {
        const $list = $("#list").dxList({
            items: ["0"]
        });

        const list = $list.dxList("instance");

        const $item = list.itemElements().eq(0);

        const scrollToElementSpy = sinon.spy();
        $list.dxScrollView("instance").scrollToElement = scrollToElementSpy;

        list.scrollToItem(0);
        assert.equal(scrollToElementSpy.firstCall.args[0].get(0), $item.get(0), "list scrolled to item");
    });

    QUnit.test("list should not fail on scrollToItem if item is a string of the specific format (T381823)", assert => {
        const items = ["12", "1.6", "#43"];

        const list = $("#list").dxList({
            items,
            height: 10
        }).dxList("instance");

        list.scrollToItem(items[1]);
        assert.expect(0);
    });

    QUnit.test("pulldown to refresh should work when option items is set", assert => {
        assert.expect(0);

        const $list = $("#list").dxList({
            items: [1, 2, 3],
            pullRefreshEnabled: true
        });

        try {
            $list.dxScrollView("refresh");
        } catch(e) {
            assert.ok(false, e.message);
        }
    });

    QUnit.test("updating scrollView options should release scroll", assert => {
        const $list = $("#list").height(1000).dxList({
            items: [1, 2, 3],
            pullRefreshEnabled: false
        });

        const releaseSpy = sinon.spy();
        $list.dxScrollView("instance").release = releaseSpy;

        $list.dxList("option", "pullRefreshEnabled", true);
        assert.ok(releaseSpy.calledOnce, "list release scrollview");
    });

    QUnit.test("scroll position should be saved after selectionMode option changing", assert => {
        const $list = $("#list").height(1000).dxList({
            items: [1, 2, 3, 4],
            selectionMode: "none",
            height: 10
        });

        const scrollView = $list.dxScrollView("instance");

        scrollView.scrollTo(4);
        const scrollTop = scrollView.scrollTop();

        $list.dxList("option", "selectionMode", "multiple");

        assert.equal(scrollView.scrollTop(), scrollTop, "position was not changed");
    });
});

QUnit.module("regressions", moduleSetup, () => {
    QUnit.test("list loading does not re-render items", assert => {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        this.element.dxList({ dataSource });

        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2);

        dataSource.load();
        assert.equal(this.element.find(toSelector(LIST_ITEM_CLASS)).length, 2);
    });

    QUnit.test("correctly handle data source errors (B230041)", assert => {
        const list = this.element.dxList({
            dataSource: {
                store: new ArrayStore([1]),
                select() {
                    throw Error("forced");
                }
            }
        }).dxList("instance");

        assert.equal(list._scrollView._history.length, 1);

        list._dataSource.load();
        assert.equal(list._scrollView._history.length, 2);
    });

    QUnit.test("B230535", assert => {
        let clicked = 0;

        this.element.dxList({
            items: [1, 2, 3],
            onItemClick() {
                clicked++;
            },
            disabled: true
        }).dxList("instance");

        this.element.find(toSelector(LIST_ITEM_CLASS)).each(function() {
            $(this).click();
            assert.ok(!clicked);
        });
    });

    QUnit.test("Q471954. dxList displays a blank area below the widget", assert => {
        this.element.dxList({
            items: [1, 2, 3]
        }).dxList("instance");

        const scrollView = this.element.dxScrollView("instance");

        assert.ok(!scrollView._pageLoading, "scrollBottom div is hidden");
    });

    QUnit.test("Q501091: dxList - onItemRendered is not called when swiped down", assert => {
        let itemRenderedCalled = false;

        const dataSource = new DataSource({
            store: [1, 2, 3],
            pageSize: 2
        });

        const list = this.element.dxList({
            pageLoadMode: "scrollBottom",
            scrollingEnabled: true,
            dataSource
        }).dxList("instance");

        list.option("onItemRendered", () => {
            itemRenderedCalled = true;
        });

        assert.ok(!itemRenderedCalled);
        this.element.dxScrollView("instance").scrollBottom();
        assert.ok(itemRenderedCalled);
    });

    QUnit.test("onItemClick on disabled items", assert => {
        let count = 0;

        const element = this.element.dxList({
            items: [
                { text: "0", disabled: true },
                { text: "1" }
            ],
            onItemClick(e) {
                count++;
            },
            scrollingEnabled: true
        });

        let item = element
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
});

QUnit.module("widget sizing render", {}, () => {
    QUnit.test("default", assert => {
        const $element = $("#list").dxList({ items: [1, 2, 3, 4] });

        assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
    });

    QUnit.test("change width", assert => {
        const $element = $("#list").dxList({ items: [1, 2, 3, 4] });
        const instance = $element.dxList("instance");
        const customWidth = 400;

        instance.option("width", customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
    });
});

QUnit.module("keyboard navigation", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test("list scroll to focused item after press up/down arrows", assert => {
        assert.expect(2);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        const instance = $element.dxList("instance");
        let $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(2).trigger("dxpointerdown");
        let keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();
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

    QUnit.test("'enter'/'space' keys pressing on selectAll checkbox", assert => {
        if(!isDeviceDesktop(assert)) {
            return;
        }
        assert.expect(3);

        const $element = $("#list").dxList({
            showSelectionControls: true,
            selectionMode: "all",
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        const keyboard = keyboardMock($element);
        const $selectAllCheckBox = $element.find(".dx-list-select-all-checkbox");
        const $selectAllItem = $element.find(".dx-list-select-all");
        const $firstItem = $element.find(toSelector(LIST_ITEM_CLASS)).eq(0);

        $firstItem.trigger("dxpointerdown");
        this.clock.tick();

        keyboard.keyDown("up");
        this.clock.tick();
        assert.ok($selectAllItem.hasClass("dx-state-focused"), "selectAll checkbox is focused");

        $element.trigger($.Event("keydown", { key: "Enter" }));

        assert.ok($selectAllCheckBox.hasClass("dx-checkbox-checked"), "selectAll checkbox is checked");

        $element.trigger($.Event("keydown", { key: " " }));

        assert.ok(!$selectAllCheckBox.hasClass("dx-checkbox-checked"), "selectAll checkbox isn't checked");
    });

    QUnit.test("focusing on selectAll checkbox after 'down'/'up' pressing", assert => {
        if(!isDeviceDesktop(assert)) {
            return;
        }
        assert.expect(6);

        const $element = $("#list").dxList({
            showSelectionControls: true,
            selectionMode: "all",
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        const keyboard = keyboardMock($element);
        const $selectAllCheckBox = $element.find(".dx-list-select-all");
        const $firstItem = $element.find(toSelector(LIST_ITEM_CLASS)).eq(0);
        const $lastItem = $element.find(toSelector(LIST_ITEM_CLASS)).eq(4);

        $firstItem.trigger("dxpointerdown");
        this.clock.tick();

        keyboard.keyDown("up");
        this.clock.tick();
        assert.ok($selectAllCheckBox.hasClass("dx-state-focused"), "selectAll checkbox is focused");

        keyboard.keyDown("up");
        this.clock.tick();

        assert.ok(!$selectAllCheckBox.hasClass("dx-state-focused"), "selectAll checkbox isn't focused");
        assert.ok($lastItem.hasClass("dx-state-focused"), "last item is focused");

        keyboard.keyDown("down");
        this.clock.tick();
        assert.ok($selectAllCheckBox.hasClass("dx-state-focused"), "selectAll checkbox is focused");

        keyboard.keyDown("down");
        this.clock.tick();
        assert.ok(!$selectAllCheckBox.hasClass("dx-state-focused"), "selectAll checkbox isn't focused");
        assert.ok($firstItem.hasClass("dx-state-focused"), "first item is focused");
    });

    QUnit.test("Select all when disabled item is null (T832581)", assert => {
        try {
            const instance = $("#list").dxList({
                dataSource: [null, undefined],
                searchEnabled: true,
                selectionMode: "all",
                showSelectionControls: true,
                selectAllMode: "allPages"
            }).dxList("instance");

            instance.selectAll();
        } catch(e) {
            assert.ok(0, "Error is thrown: " + e.message);
        }

        assert.ok(1);
    });

    QUnit.test("list does not scroll to item after click on it", assert => {
        assert.expect(2);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        const instance = $element.dxList("instance");
        const $item = $element.find(toSelector(LIST_ITEM_CLASS)).eq(2);
        const itemHeight = $item.outerHeight();

        instance.option("height", itemHeight * 2.5);
        assert.equal(instance.scrollTop(), 0, "list scrolled to zero");

        $item.trigger("dxpointerdown");
        this.clock.tick();

        assert.equal(instance.scrollTop(), 0, "item was not scrolled to half-visible item by click on it");
    });

    QUnit.test("list scroll to focused item after press home/end", assert => {
        assert.expect(2);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4]
        });

        const instance = $element.dxList("instance");
        const $item = $element.find(toSelector(LIST_ITEM_CLASS)).first();
        const keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();

        $element.trigger("focusin");
        instance.option("height", itemHeight * 3);

        keyboard.keyDown("end");
        assert.roughEqual(instance.scrollTop(), itemHeight * 2, 1.0001, "item scrolled to visible area at bottom end arrow were pressed");

        keyboard.keyDown("home");
        assert.equal(instance.scrollTop(), 0, "item scrolled to visible area at top when home were pressed");
    });

    QUnit.test("list scroll to focused item after press pageDown", assert => {
        assert.expect(7);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5]
        });

        const instance = $element.dxList("instance");
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.first();
        const keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();

        $element.trigger("focusin");
        instance.option("height", itemHeight * 3);

        keyboard.keyDown("pageDown");

        assert.equal(isRenderer(instance.option("focusedElement")), !!config().useJQuery, "focusedElement is correct");
        assert.roughEqual(instance.scrollTop(), 0, 1.0001, "list is not scrolled, when focusedItem is not last visible item on this page");
        assert.ok($items.eq(2).hasClass("dx-state-focused"), "focused item change to last visible item on this page");

        keyboard.keyDown("pageDown");

        assert.roughEqual(instance.scrollTop(), itemHeight * 2, 1.0001, "list scrolled to next page");
        assert.ok($items.eq(4).hasClass("dx-state-focused"), "last item on new page obtained focus");

        keyboard.keyDown("pageDown");

        assert.roughEqual(instance.scrollTop(), itemHeight * 3, 1.0001, "list scrolled to last page");
        assert.ok($items.eq(5).hasClass("dx-state-focused"), "last item on last page obtained focus");
    });

    QUnit.test("list scroll to hidden focused item after press pageDown", assert => {
        assert.expect(3);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6]
        });

        const instance = $element.dxList("instance");
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.first();
        const keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();

        $element.trigger("focusin");
        instance.option("height", itemHeight * 3);
        instance.option("focusedElement", $items.eq(3));
        instance.scrollToItem($items.first());

        assert.roughEqual(instance.scrollTop(), 0, 1.0001, "list is not scrolled");

        keyboard.keyDown("pageDown");

        assert.roughEqual(instance.scrollTop(), itemHeight * 3, 1.0001, "list scrolled to previous focusedItem");
        assert.ok($items.eq(5).hasClass("dx-state-focused"), "focused item change to last visible item on new page");
    });

    QUnit.test("list scroll to focused item after press pageUp", assert => {
        assert.expect(6);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5]
        });

        const instance = $element.dxList("instance");
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.first();
        const keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();

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

    QUnit.test("list scroll to hidden focused item after press pageUp", assert => {
        assert.expect(3);

        const $element = $("#list").dxList({
            focusStateEnabled: true,
            items: [0, 1, 2, 3, 4, 5, 6]
        });

        const instance = $element.dxList("instance");
        const $items = $element.find(toSelector(LIST_ITEM_CLASS));
        const $item = $items.first();
        const keyboard = keyboardMock($element);
        const itemHeight = $item.outerHeight();

        $element.trigger("focusin");
        instance.option("height", itemHeight * 3);
        instance.option("focusedElement", $items.eq(3));
        instance.scrollToItem($items.last());

        assert.roughEqual(instance.scrollTop(), itemHeight * 4, 1.0001, "list is not scrolled");

        keyboard.keyDown("pageUp");

        assert.roughEqual(instance.scrollTop(), itemHeight, 1.0001, "list scrolled to previous focusedItem");
        assert.ok($items.eq(1).hasClass("dx-state-focused"), "focused item change to last visible item on new page");
    });

    QUnit.test("list should attach keyboard events even if focusStateEnabled is false when this option was passed from outer widget", assert => {
        const handler = sinon.stub();
        const $element = $("#list");

        const instance = $element.dxList({
            focusStateEnabled: false,
            _keyboardProcessor: new KeyboardProcessor({ element: $element }),
            items: [1, 2, 3]
        }).dxList("instance");

        instance.registerKeyHandler("enter", handler);
        $element.trigger($.Event("keydown", { key: "Enter" }));

        assert.equal(handler.callCount, 1, "keyboardProcessor is attached");
    });

    QUnit.testInActiveWindow("First list item should be focused on the 'tab' key press when the search editor is focused", assert => {
        if(devices.real().deviceType !== "desktop") {
            assert.ok(true, "keyboard navigation is disabled for not desktop devices");
            return;
        }

        const $element = $("#list");

        const instance = $element.dxList({
            _keyboardProcessor: new KeyboardProcessor({ element: $element }),
            dataSource: [1, 2, 3],
            searchEnabled: true
        }).dxList("instance");

        let $searchEditor = $element.children(".dx-list-search");

        $searchEditor.find("input").focus();
        this.clock.tick();

        instance.registerKeyHandler("tab", e => {
            $element.find("[tabIndex]:not(:focus)").first().focus();
        });

        $element.trigger($.Event("keydown", { key: "Tab" }));
        this.clock.tick();

        $searchEditor = $element.children(".dx-list-search");
        assert.ok($element.find(toSelector(LIST_ITEM_CLASS)).first().hasClass("dx-state-focused"), "first list item is focused");
        assert.ok($element.hasClass("dx-state-focused"), "list is focused");
        assert.ok($element.find(".dx-scrollview-content").hasClass("dx-state-focused"), "scrollview content is focused");
    });
});

QUnit.module("Search", () => {
    QUnit.test("Render search editor", assert => {
        let $searchEditor;

        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchValue: "3"
        });

        $searchEditor = $element.children().first();
        assert.ok($element.hasClass("dx-list-with-search"), "list with search");
        assert.ok($searchEditor.hasClass("dx-list-search"), "has search editor");
        assert.strictEqual($searchEditor.dxTextBox("instance").option("value"), "3", "editor value");
    });

    QUnit.test("Search", assert => {
        let searchEditor;

        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchExpr: "this"
        });

        const instance = $element.dxList("instance");

        searchEditor = $element.children().first().dxTextBox("instance");
        searchEditor.option("value", "2");

        assert.deepEqual(instance.option("items"), [2], "items");
        assert.strictEqual(instance.option("searchValue"), "2", "search value");
    });

    QUnit.testInActiveWindow("Focusing widget when there is search editor", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchExpr: "this"
        });

        const instance = $element.dxList("instance");

        instance.focus();

        assert.ok($element.children(".dx-list-search").hasClass("dx-state-focused"), "search editor is focused");
    });

    QUnit.test("Show warning when dataSource is not specified", assert => {
        const instance = $("#list").dxList({
            items: [1, 2, 3],
            searchEnabled: true,
            searchExpr: "this"
        }).dxList("instance");

        const warningHandler = sinon.spy(errors, "log");

        try {
            instance.option("searchValue", "2");

            assert.equal(warningHandler.callCount, 1, "warning has been called once");
            assert.equal(warningHandler.getCall(0).args[0], "W1009", "warning has correct error id");
        } finally {
            warningHandler.restore();
        }
    });

    QUnit.test("Search when searchMode is specified", assert => {
        let searchEditor;

        const $element = $("#list").dxList({
            dataSource: [1, 12, 23],
            searchEnabled: true,
            searchExpr: "this",
            searchMode: "startswith"
        });

        const instance = $element.dxList("instance");

        searchEditor = $element.children().first().dxTextBox("instance");
        searchEditor.option("value", "2");

        assert.deepEqual(instance.option("items"), [23], "items");
        assert.strictEqual(instance.option("searchValue"), "2", "search value");
        assert.strictEqual(instance.getDataSource().searchOperation(), "startswith", "search operation");
    });

    QUnit.test("Search in items of grouped dataSource", assert => {
        const $element = $("#list").dxList({
            dataSource: [{ key: "a", items: [{ name: "1" }] }, { key: "b", items: [{ name: "2" }] }],
            grouped: true,
            searchEnabled: true,
            searchExpr: "name"
        });

        const instance = $element.dxList("instance");
        const expectedValue = { key: "a", items: [{ name: "1", key: "a" }] };

        assert.equal(instance.getDataSource().searchExpr(), "name", "dataSource has correct searchExpr");

        instance.option("searchValue", "1");

        assert.deepEqual(instance.option("items")[0], expectedValue, "items");
    });

    QUnit.test("Search in items of grouped dataSource with simple items", assert => {
        const $element = $("#list").dxList({
            dataSource: [{ key: "a", items: ["1", "2"] }],
            grouped: true,
            searchEnabled: true
        });

        const instance = $element.dxList("instance");
        const expectedItems = [{ key: "a", items: [{ text: "1", key: "a" }, { text: "2", key: "a" }] }];
        const expectedValue = { key: "a", items: [{ text: "1", key: "a" }] };

        assert.deepEqual(instance.option("items"), expectedItems, "items have correct structure");
        assert.equal(instance.getDataSource().searchExpr(), "text", "dataSource has correct searchExpr");

        instance.option("searchValue", "1");

        assert.deepEqual(instance.option("items")[0], expectedValue, "items");
    });

    // T582179
    QUnit.test("Selection should not be cleared after searching", assert => {
        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchExpr: "this",
            showSelectionControls: true,
            selectionMode: "all"
        });

        const instance = $element.dxList("instance");

        instance.selectAll();

        assert.deepEqual(instance.option("selectedItemKeys"), [1, 2, 3], "selectedItemKeys");

        instance.option("searchValue", "4");

        assert.deepEqual(instance.option("selectedItemKeys"), [1, 2, 3], "selectedItemKeys");
    });

    QUnit.test("Delayed search value should be applied on the widget reset", assert => {
        const clock = sinon.useFakeTimers();

        const $element = $("#list").dxList({
            dataSource: [1, 2, 3],
            searchEnabled: true,
            searchExpr: "this",
            searchTimeout: 500
        });

        const instance = $element.dxList("instance");
        const searchBoxInstance = $element.find(".dx-list-search").dxTextBox("instance");

        $(searchBoxInstance._input()).trigger("input", "test");
        instance.repaint();
        clock.tick(600);

        assert.equal(instance.option("searchValue"), "test", "Correct option");
        assert.equal(searchBoxInstance._input().val(), "test", "Search input has the correct value");
        clock.restore();
    });
});

var helper;
if(devices.real().deviceType === "desktop") {
    [true, false].forEach((searchEnabled) => {
        QUnit.module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
            beforeEach: () => {
                helper = new ariaAccessibilityTestHelper({
                    createWidget: ($element, options) => new List($element,
                        $.extend({
                            items: [{ text: "Item_1" }, { text: "Item_2" }, { text: "Item_3" }],
                            searchEnabled: searchEnabled
                        }, options))
                });
                this.clock = sinon.useFakeTimers();
            },
            afterEach: () => {
                this.clock.restore();
                helper.$widget.remove();
            }
        }, () => {
            QUnit.test(`Selected: ["Item_3"] -> focusin -> focusout`, () => {
                helper.createWidget({ selectedItemKeys: ["Item_3"], keyExpr: "text", selectionMode: "single" });

                if(searchEnabled) {
                    $(helper.$itemContainer).focusin();
                } else {
                    helper.$widget.focusin();
                }

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", "aria-activedescendant": helper.focusedItemId, tabindex: "0" });
                helper.checkItemsAttributes([2], { attributes: ["aria-selected"], focusedItemIndex: 2, role: "option" });

                helper.$widget.focusout();
                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", "aria-activedescendant": helper.focusedItemId, tabindex: "0" });
                helper.checkItemsAttributes([2], { attributes: ["aria-selected"], focusedItemIndex: 2, role: "option" });
            });


            QUnit.test(`Selected: ["Item_1"] -> set focusedElement -> change by click`, () => {
                helper.createWidget({ selectedItemKeys: ["Item_1"], keyExpr: "text", selectionMode: "single" });

                if(searchEnabled) {
                    $(helper.$itemContainer).focusin();
                } else {
                    helper.$widget.focusin();
                }

                const $item_2 = $(helper.getItems().eq(2));
                eventsEngine.trigger($item_2, "dxclick");
                eventsEngine.trigger($item_2, "dxpointerdown");
                this.clock.tick();

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", "aria-activedescendant": helper.focusedItemId, tabindex: "0" });
                helper.checkItemsAttributes([2], { attributes: ["aria-selected"], focusedItemIndex: 2, role: "option" });

                helper.widget.option("focusedElement", null);
                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", tabindex: "0" });
                helper.checkItemsAttributes([2], { attributes: ["aria-selected"], role: "option" });
            });

            QUnit.test(`Selected: ["Item_1", "Item_3"] -> select "Item_2" by click`, () => {
                helper.createWidget({ selectedItemKeys: ["Item_1", "Item_3"], keyExpr: "text", selectionMode: "multiple" });

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", tabindex: "0" });
                helper.checkItemsAttributes([0, 2], { attributes: ["aria-selected"], role: "option" });

                const $item_1 = $(helper.getItems().eq(1));
                eventsEngine.trigger($item_1, "dxclick");
                eventsEngine.trigger($item_1, "dxpointerdown");
                this.clock.tick();

                helper.checkAttributes(searchEnabled ? helper.$itemContainer : helper.$widget, { role: "listbox", "aria-activedescendant": helper.focusedItemId, tabindex: "0" });
                helper.checkItemsAttributes([0, 1, 2], { attributes: ["aria-selected"], focusedItemIndex: 1, role: "option" });
            });
        });
    });
}
