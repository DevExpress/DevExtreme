var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    fx = require("animation/fx"),
    Widget = require("ui/widget/ui.widget"),
    PivotTabs = require("ui/pivot/ui.pivot_tabs"),
    Pivot = require("ui/pivot"),
    config = require("core/config"),
    isRenderer = require("core/utils/type").isRenderer;

require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<style>\
            .dx-pivottabs-container {\
                height: 40px;\
            }\
            .dx-pivot-itemcontainer {\
                height: 50px;\
            }\
        </style>\
        <div id="pivot"></div>';

    $("#qunit-fixture").html(markup);
});


var PIVOT_CLASS = "dx-pivot",

    PIVOT_TABS_CONTAINER_CLASS = "dx-pivottabs-container",

    PIVOT_ITEM_CONTAINER_CLASS = "dx-pivot-itemcontainer",
    PIVOT_ITEM_WRAPPER_CLASS = "dx-pivot-itemwrapper",

    PIVOT_ITEM_HIDDEN_CLASS = "dx-pivot-item-hidden";

var toSelector = function(cssClass) {
    return "." + cssClass;
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


QUnit.module("pivot rendering", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("widget should be rendered", function(assert) {
    var $pivot = $("#pivot").dxPivot();

    assert.ok($pivot.hasClass(PIVOT_CLASS), "widget class added");
});

QUnit.test("selected index should be equal 0", function(assert) {
    var pivot = $("#pivot").dxPivot().dxPivot("instance");

    assert.equal(pivot.option("selectedIndex"), 0, "selectedIndex equals 0");
});


QUnit.module("markup", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("pivot tabs should be rendered", function(assert) {
    var $pivot = $("#pivot").dxPivot();

    assert.equal($pivot.find(toSelector(PIVOT_TABS_CONTAINER_CLASS)).length, 1, "pivot tabs container rendered");
});

QUnit.test("pivot item should be rendered", function(assert) {
    var $pivot = $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }, { title: "favorites", text: "favorites content" }]
    });

    var $itemContainer = $pivot.find(toSelector(PIVOT_ITEM_CONTAINER_CLASS)),
        $itemWrapper = $itemContainer.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    assert.equal($itemContainer.length, 1, "pivot current content container rendered");
    assert.equal($itemWrapper.text(), "all content", "pivot current content rendered with proper data");
});


QUnit.module("content template", {
    beforeEach: function() {
        pivotTabsMock.setup();

        fx.off = true;
    },
    afterEach: function() {
        pivotTabsMock.teardown();

        fx.off = false;
    }
});

QUnit.test("content should be rendered from content template if specified", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
            contentTemplate: function(container) {
                assert.equal(isRenderer(container), !!config().useJQuery, "container is correct");
                return "<div>content</div>";
            }
        }),
        $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    assert.equal($itemWrapper.text(), "content", "content rendered");
});

QUnit.test("content should be rendered from content template only once", function(assert) {
    var renderTimes = 0;

    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
            contentTemplate: function() {
                renderTimes++;
                return "<div>content</div>";
            }
        }),
        pivot = $pivot.dxPivot("instance"),
        $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pivot.repaint();
    assert.equal(renderTimes, 1, "content rendered only once");
    assert.equal($itemWrapper.text(), "content", "content was not lost");
});

QUnit.test("content should be hidden after selected index change", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
            contentTemplate: function() {
                return "<div>content</div>";
            }
        }),
        pivot = $pivot.dxPivot("instance"),
        $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pivot.option("selectedIndex", 1);
    assert.equal($itemWrapper.find("." + PIVOT_ITEM_HIDDEN_CLASS).length, 0, "content was not hidden");
});

QUnit.test("content should be rerendered if content template changed", function(assert) {
    var $pivot = $("#pivot").dxPivot({
            selectedIndex: 0,
            items: [{ title: "all", text: "all content" }, { title: "unread", text: "unread content" }],
            contentTemplate: function() {
                return "<div>content</div>";
            }
        }),
        pivot = $pivot.dxPivot("instance"),
        $itemWrapper = $pivot.find(toSelector(PIVOT_ITEM_WRAPPER_CLASS));

    pivot.option("contentTemplate", function() { return null; }); // TODO: may be null?
    assert.equal($itemWrapper.text(), "all content", "content rendered");
});


QUnit.module("item title template", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("itemTitleTemplate should have correct arguments", function(assert) {
    $("#pivot").dxPivot({
        items: [{ title: "all", text: "all content" }],
        itemTitleTemplate: function(itemData, itemIndex, itemElement) {
            assert.equal(isRenderer(itemElement), !!config().useJQuery, "itemElement is correct");
            return 1;
        }
    });
});

QUnit.test("titleTemplate for item should have correct arguments", function(assert) {
    $("#pivot").dxPivot({
        items: [{
            titleTemplate: function(itemData, itemIndex, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, "itemElement is correct");
                return "all";
            },
            text: "all content"
        }]
    });
});

