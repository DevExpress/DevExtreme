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

const TABS_CLASS = "dx-tabs";
const TABS_NAV_BUTTON_CLASS = "dx-tabs-nav-button";

let toSelector = (cssClass) => `.${cssClass}`;

QUnit.module("Tabs width");

class TabPanelWidthTestHelper {
    constructor(assert, setWidthApproach) {
        this.$container = $("#container");
        this.$element = $("#element");
        this.assert = assert;
        this.changeContainerWidth = (setWidthApproach === "container");
    }

    _initializeInstanceTabPanel(width) {
        if(this.changeContainerWidth) {
            this.$container.width(width);
        }

        this.$element.appendTo(this.$container).dxTabPanel({
            items: [
                { title: "title" },
                { title: "long title example" }
            ],
            showNavButtons: true,
            scrollingEnabled: true,
            width: this.changeContainerWidth ? undefined : width
        });

        domUtils.triggerShownEvent(this.$container);

        this.$tabs = this.$element.find(toSelector(TABS_CLASS));
        this.tabsWidgetInstance = this.$tabs.dxTabs("instance");
        this.tabPanelWidgetInstance = this.$element.dxTabPanel("instance");
    }

    createTabPanel(width, isNavButtons) {
        this._initializeInstanceTabPanel(width);
        this.checkTabPanelWithTabs(width, isNavButtons);
    }

    checkTabPanelWithTabs(width, isNavButtons) {
        this.assert.equal(this.tabPanelWidgetInstance.option("width"), this.changeContainerWidth ? undefined : width);
        this.assert.equal(this.tabsWidgetInstance.option("width"), undefined);
        this.assert.equal(this.$tabs.outerWidth(), width);
        this.assert.equal(this.$element.outerWidth(), width);
        this.assert.equal(this.$element.find(toSelector(TABS_NAV_BUTTON_CLASS)).length, isNavButtons ? 2 : 0, `${isNavButtons} navigation buttons should be rendered`);
    }

    setWidth(width) {
        if(this.changeContainerWidth) {
            this.$container.width(width);
        } else {
            this.tabPanelWidgetInstance.option("width", width);
        }

        this.tabPanelWidgetInstance.repaint();
    }
}

["container", "option"].forEach((setWidthApproach) => {
    const config = ", change " + setWidthApproach + ".width";

    QUnit.test(`Tabpanel with fixed tabs, resize to show navigation button tabs ${config}`, (assert) => {
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
});
