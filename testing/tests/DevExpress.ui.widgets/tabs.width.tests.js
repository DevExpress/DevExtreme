import $ from "jquery";
import domUtils from "core/utils/dom";

import "ui/tabs";
import "common.css!";

const TABS_ITEM_CLASS = "dx-tab",
    TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button";

let toSelector = (cssClass) => `.${cssClass}`;


QUnit.module("Width");

class TabsWidthTestHelper {
    constructor(assert, scrollingEnabled, setWidthApproach) {
        this.$container = $("<div>");
        this.$element = $("<div>");
        this.assert = assert;
        this.scrollingEnabled = scrollingEnabled;
        this.changeContainerWidth = (setWidthApproach === "container");
    }

    _initializeInstanceTabs(width) {
        if(this.changeContainerWidth) {
            this.$container.width(width);
        }

        this.$element.appendTo(this.$container).dxTabs({
            items: [
                { text: "text 1" },
                { text: "long text example" }
            ],
            scrollingEnabled: this.scrollingEnabled,
            showNavButtons: true,
            width: this.changeContainerWidth ? undefined : width
        });
        this.$container.appendTo("#qunit-fixture");

        domUtils.triggerShownEvent(this.$container);
        this.instance = this.$element.dxTabs("instance");
    }

    remove() {
        this.$container.remove();
    }

    createFixedTabs() {
        this._initializeInstanceTabs(400);
        this.checkFixedTabs();
    }

    checkFixedTabs() {
        let tabItems = this.$element.find(toSelector(TABS_ITEM_CLASS));

        this.assert.equal(this.instance.option("width"), this.changeContainerWidth ? undefined : 400);
        this.assert.equal(this.$element.outerWidth(), 400);
        this.assert.ok(tabItems.eq(0).width() > 190, tabItems.eq(0).width() + " > 190");
        this.assert.ok(tabItems.eq(1).width() > 190, tabItems.eq(1).width() + " > 190");
        this.assert.equal(this.$element.find("." + TABS_NAV_BUTTON_CLASS).length, 0, "nav buttons aren't rendered");
    }

    createStretchedTabs() {
        this._initializeInstanceTabs(200);
        this.checkStretchedTabs();
    }

    checkStretchedTabs() {
        let tabItems = this.$element.find(toSelector(TABS_ITEM_CLASS));

        this.assert.equal(this.instance.option("width"), this.instance.option("width"), this.changeContainerWidth ? undefined : 200);
        this.assert.equal(this.$element.outerWidth(), 200);
        this.assert.ok(tabItems.eq(0).width() < 70, tabItems.eq(0).width() + " < 70");
        this.assert.ok(tabItems.eq(1).width() > 130, tabItems.eq(1).width() + " > 130");
        this.assert.equal(this.$element.find("." + TABS_NAV_BUTTON_CLASS).length, 0, "nav buttons aren't rendered");
    }

    createNavigationButtonsTabs() {
        this._initializeInstanceTabs(100);
        this.checkNavigationButtonsTabs();
    }

    checkNavigationButtonsTabs() {
        let tabItems = this.$element.find(toSelector(TABS_ITEM_CLASS));

        this.assert.equal(this.instance.option("width"), this.changeContainerWidth ? undefined : 100);
        this.assert.equal(this.$element.outerWidth(), 100);

        if(this.scrollingEnabled) {
            this.assert.ok(tabItems.eq(0).width() < 70, tabItems.eq(0).width() + " < 70");
            this.assert.ok(tabItems.eq(1).width() > 100, tabItems.eq(1).width() + " > 100");
            this.assert.equal(this.$element.find("." + TABS_NAV_BUTTON_CLASS).length, 2, "nav buttons aren't rendered");
        } else {
            this.assert.ok(tabItems.eq(0).width() < 55, tabItems.eq(0).width() + " < 55");
            this.assert.ok(tabItems.eq(1).width() < 55, tabItems.eq(1).width() + " < 55");
            this.assert.equal(this.$element.find("." + TABS_NAV_BUTTON_CLASS).length, 0, "nav buttons aren't rendered");
        }
    }

    setWidth(width) {
        if(this.changeContainerWidth) {
            this.$container.width(width);
            domUtils.triggerResizeEvent(this.$element);
        } else {
            this.instance.option("width", width);
        }
    }
}

[true, false].forEach((scrollingEnabled) => {
    ["container", "option"].forEach((setWidthApproach) => {
        const config = ", scrollingEnabled=" + scrollingEnabled + ", change " + setWidthApproach + ".width";

        QUnit.test("Show fixed tabs, resize to show stretched tabs" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createFixedTabs();
            this.helper.setWidth(200);
            this.helper.checkStretchedTabs();
            this.helper.remove();
        });

        QUnit.test("Show fixed tabs, resize to show navigation buttons" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createFixedTabs();
            this.helper.setWidth(100);
            this.helper.checkNavigationButtonsTabs();
            this.helper.remove();
        });

        QUnit.test("Show stretched tabs, resize to show navigation buttons" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createStretchedTabs();
            this.helper.setWidth(100);
            this.helper.checkNavigationButtonsTabs();
            this.helper.remove();
        });

        QUnit.test("Show stretched tabs, resize to show fixed tabs" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createStretchedTabs();
            this.helper.setWidth(400);
            this.helper.checkFixedTabs();
            this.helper.remove();
        });

        QUnit.test("Show navigation buttons, resize to show stretched tabs" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createNavigationButtonsTabs();
            this.helper.setWidth(200);
            this.helper.checkStretchedTabs();
            this.helper.remove();
        });

        QUnit.test("Show navigation buttons, resize to show fixed tabs" + config, function(assert) {
            this.helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
            this.helper.createFixedTabs();
            this.helper.setWidth(400);
            this.helper.checkFixedTabs();
            this.helper.remove();
        });
    });
});
