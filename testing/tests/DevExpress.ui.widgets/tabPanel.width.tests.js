import $ from 'jquery';
import domUtils from 'core/utils/dom';

import 'ui/tab_panel';
import 'common.css!css';

const TABS_ITEM_CLASS = 'dx-tab';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';

QUnit.module('Tabs width');

class TabPanelWidthTestHelper {
    constructor(assert, setWidthApproach) {
        this.$container = $('<div id=\'container\'>');
        this.$tabPanel = $('<div>');
        this.assert = assert;
        this.setWidthApproach = setWidthApproach;
    }

    _initializeTabPanel(width) {
        this.$tabPanel.appendTo(this.$container);

        this.tabPanel = this.$tabPanel.dxTabPanel({
            items: [
                { title: 'title' },
                { title: 'long title example' }
            ],
            showNavButtons: true,
            scrollingEnabled: true,
            width: this._isOptionApproach() ? width : undefined
        }).dxTabPanel('instance');

        this.$container.appendTo('#qunit-fixture');

        if(!this._isOptionApproach()) {
            this.setContainerWidth(width);
        }

        domUtils.triggerShownEvent(this.$container);
    }

    _isOptionApproach() {
        return this.setWidthApproach === 'option';
    }

    setContainerWidth(width) {
        this.$container[0].setAttribute('style', `width:${width}px`);
    }

    createTabPanel(options) {
        this._initializeTabPanel(options.width);
        this.checkTabPanel(options);
    }

    checkTabPanel(options) {
        let tabs = this.tabPanel._tabs;

        this.assert.equal(this.tabPanel.option('width'), this._isOptionApproach() ? options.width : undefined);
        this.assert.equal(tabs.option('width'), undefined);
        this.assert.equal(tabs.$element().outerWidth(), options.width);
        this.assert.equal(this.$tabPanel.outerWidth(), options.width);

        if(options.width > 250) {
            this.assert.ok(this._getTabItem(0).width() > 190, this._getTabItem(0).width() + ' > 190');
            this.assert.ok(this._getTabItem(1).width() > 190, this._getTabItem(1).width() + ' > 190');
        } else {
            this.assert.ok(this._getTabItem(0).width() < 70, this._getTabItem(0).width() + ' < 70');
            this.assert.ok(this._getTabItem(1).width() > 100, this._getTabItem(1).width() + ' > 100');
        }

        this.assert.equal(this.$tabPanel.find(`.${TABS_NAV_BUTTON_CLASS}`).length, options.expectNavButtons, `${options.expectNavButtons} navigation buttons should be rendered`);
    }

    _getTabItem(index) {
        return this.$tabPanel.find(`.${TABS_ITEM_CLASS}`).eq(index);
    }

    setWidth(width) {
        switch(this.setWidthApproach) {
            case 'option':
                this.tabPanel.option('width', width);
                break;
            case 'container':
                this.setContainerWidth(width);
                this.tabPanel.repaint();
                break;
            case 'resizeBrowser':
                this.setContainerWidth(width);
                domUtils.triggerResizeEvent(this.$container);
                break;
        }
    }
}

['resizeBrowser', 'container', 'option'].forEach((setWidthApproach) => {
    const config = `, change ${setWidthApproach}.width`;

    QUnit.test(`Tabpanel with fixed tabs, resize to show navigation button tabs${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 400, expectNavButtons: 0 });
        helper.setWidth(100);
        helper.checkTabPanel({ width: 100, expectNavButtons: 2 });
    });

    QUnit.test(`Tabpanel with navigation button tabs, resize to fixed tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 100, expectNavButtons: 2 });
        helper.setWidth(400);
        helper.checkTabPanel({ width: 400, expectNavButtons: 0 });
    });

    QUnit.test(`Tabpanel with navigation button tabs, resize to stretched tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 100, expectNavButtons: 2 });
        helper.setWidth(150);
        helper.checkTabPanel({ width: 150, expectNavButtons: 0 });
    });

    QUnit.test(`Tabpanel with fixed tabs, resize to stretched tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 400, expectNavButtons: 0 });
        helper.setWidth(150);
        helper.checkTabPanel({ width: 150, expectNavButtons: 0 });
    });

    QUnit.test(`Tabpanel with stretched tabs, resize to fixed tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 150, expectNavButtons: 0 });
        helper.setWidth(400);
        helper.checkTabPanel({ width: 400, expectNavButtons: 0 });
    });

    QUnit.test(`Tabpanel with stretched tabs, resize to navigation buttons tabs ${config}`, (assert) => {
        let helper = new TabPanelWidthTestHelper(assert, setWidthApproach);
        helper.createTabPanel({ width: 150, expectNavButtons: 0 });
        helper.setWidth(100);
        helper.checkTabPanel({ width: 100, expectNavButtons: 2 });
    });
});
