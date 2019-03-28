import $ from "jquery";
import domUtils from "core/utils/dom";

import "ui/tab_panel";
import "common.css!css";

QUnit.testStart(() => {
    const markup =
        '<div id="container">\
            <div id="element">\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

const TABS_ITEM_CLASS = "dx-tab";
const TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button";

QUnit.module("Tabs width");

class TabPanelWidthTestHelper {
    constructor(assert, setWidthApproach) {
        this.$container = $("#container");
        this.$element = $("#element");
        this.assert = assert;
        this.setWidthApproach = setWidthApproach;
    }

    _initializeInstanceTabPanel(width) {
        if(!this.isOptionApproach()) {
            this.setContainerWidth(width);
        }

        this.tabPanelWidgetInstance = this.$element.appendTo(this.$container).dxTabPanel({
            items: [
                { title: "title" },
                { title: "long title example" }
            ],
            showNavButtons: true,
            scrollingEnabled: true,
            width: this.isOptionApproach() ? width : undefined
        }).dxTabPanel("instance");

        domUtils.triggerShownEvent(this.$container);
    }

    isOptionApproach() {
        return this.setWidthApproach === "option";
    }

    setContainerWidth(width) {
        document.getElementById("container").setAttribute("style", `width:${width}px`);
    }

    createTabPanel(width, isNavButtons) {
        this._initializeInstanceTabPanel(width);
        this.checkTabPanelWithTabs(width, isNavButtons);
    }

    checkTabPanelWithTabs(width, isNavButtons) {
        let tabsWidgetInstance = this.tabPanelWidgetInstance._tabs;

        this.assert.equal(this.tabPanelWidgetInstance.option("width"), this.isOptionApproach() ? width : undefined);
        this.assert.equal(tabsWidgetInstance.option("width"), undefined);
        this.assert.equal(tabsWidgetInstance.$element().outerWidth(), width);
        this.assert.equal(this.$element.outerWidth(), width);

        if(width > 250) {
            this.checkSizeFixedTabs();
        } else {
            this.checkSizeTabs();
        }

        this.assert.equal(this.$element.find(`.${TABS_NAV_BUTTON_CLASS}`).length, isNavButtons ? 2 : 0, `${isNavButtons ? 2 : 0} navigation buttons should be rendered`);
    }

    getTabItem(index) {
        return this.$element.find(`.${TABS_ITEM_CLASS}`).eq(index);
    }

    checkSizeFixedTabs() {
        this.assert.ok(this.getTabItem(0).width() > 190, this.getTabItem(0).width() + " > 190");
        this.assert.ok(this.getTabItem(1).width() > 190, this.getTabItem(1).width() + " > 190");
    }

    checkSizeTabs() {
        this.assert.ok(this.getTabItem(0).width() < 70, this.getTabItem(0).width() + " < 70");
        this.assert.ok(this.getTabItem(1).width() > 100, this.getTabItem(1).width() + " > 100");
    }

    setWidth(width) {
        switch(this.setWidthApproach) {
            case "option":
                this.tabPanelWidgetInstance.option("width", width);
                break;
            case "container":
                this.setContainerWidth(width);
                this.tabPanelWidgetInstance.repaint();
                break;
            case "resizeBrowser":
                this.setContainerWidth(width);
                domUtils.triggerResizeEvent(this.$container);
                break;
        }
    }
}

["resizeBrowser", "container", "option"].forEach((setWidthApproach) => {
    const config = `, change ${setWidthApproach}.width`;

    QUnit.test(`Tabpanel with fixed tabs, resize to show navigation button tabs${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(400, false);
        helper.setWidth(100);
        helper.checkTabPanelWithTabs(100, true);
    });

    QUnit.test(`Tabpanel with navigation button tabs, resize to fixed tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(100, true);
        helper.setWidth(400);
        helper.checkTabPanelWithTabs(400, false);
    });

    QUnit.test(`Tabpanel with navigation button tabs, resize to stretched tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(100, true);
        helper.setWidth(150);
        helper.checkTabPanelWithTabs(150, false);
    });

    QUnit.test(`Tabpanel with fixed tabs, resize to stretched tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(400, false);
        helper.setWidth(150);
        helper.checkTabPanelWithTabs(150, false);
    });

    QUnit.test(`Tabpanel with stretched tabs, resize to fixed tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(150, false);
        helper.setWidth(400);
        helper.checkTabPanelWithTabs(400, false);
    });

    QUnit.test(`Tabpanel with stretched tabs, resize to navigation buttons tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel(150, false);
        helper.setWidth(100);
        helper.checkTabPanelWithTabs(100, true);
    });
});
