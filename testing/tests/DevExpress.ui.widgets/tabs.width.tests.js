import 'common.css!';
import 'generic_light.css!';
import { triggerResizeEvent, triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import 'ui/tabs';


const TABS_ITEM_CLASS = 'dx-tab';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';

QUnit.module('Width', () => {
    class TabsWidthTestHelper {
        constructor(assert, scrollingEnabled, setWidthApproach) {
            this.$container = $('<div id=\'container\'>');
            this.$tabs = $('<div>');
            this.assert = assert;
            this.scrollingEnabled = scrollingEnabled;
            this.setWidthApproach = setWidthApproach;
        }

        _initializeTabs(width) {
            this.$tabs.appendTo(this.$container);

            this.tabs = this.$tabs.dxTabs({
                items: [
                    { text: 'text 1' },
                    { text: 'long text example' }
                ],
                scrollingEnabled: this.scrollingEnabled,
                showNavButtons: true,
                width: this._isOptionApproach() ? width : undefined
            }).dxTabs('instance');

            this.$container.appendTo('#qunit-fixture');

            if(!this._isOptionApproach()) {
                this.setContainerWidth(width);
            }

            triggerShownEvent(this.$container);
        }

        _isOptionApproach() {
            return this.setWidthApproach === 'option';
        }

        setContainerWidth(width) {
            this.$container[0].setAttribute('style', `width:${width}px`);
        }

        _getTabItem(index) {
            return this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(index);
        }

        createFixedTabs() {
            this._initializeTabs(400);
            this.checkFixedTabs();
        }

        checkFixedTabs() {
            this.assert.equal(this.tabs.option('width'), this._isOptionApproach() ? 400 : undefined);

            this.assert.equal(this.$tabs.outerWidth(), 400);
            this.assert.ok(this._getTabItem(0).outerWidth() > 190, this._getTabItem(0).outerWidth() + ' > 190');
            this.assert.ok(this._getTabItem(1).outerWidth() > 190, this._getTabItem(1).outerWidth() + ' > 190');
            this.assert.equal(this.$tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0, 'nav buttons aren\'t rendered');
        }

        createStretchedTabs() {
            this._initializeTabs(200);
            this.checkStretchedTabs();
        }

        checkStretchedTabs() {
            this.assert.equal(this.tabs.option('width'), this._isOptionApproach() ? 200 : undefined);

            this.assert.equal(this.$tabs.outerWidth(), 200);
            this.assert.ok(this._getTabItem(0).outerWidth() < 70, this._getTabItem(0).outerWidth() + ' < 70');
            this.assert.ok(this._getTabItem(1).outerWidth() > 130, this._getTabItem(1).outerWidth() + ' > 130');
            this.assert.equal(this.$tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0, 'nav buttons aren\'t rendered');
        }

        createNavigationButtonsTabs() {
            this._initializeTabs(100);
            this.checkNavigationButtonsTabs();
        }

        checkNavigationButtonsTabs() {
            this.assert.equal(this.tabs.option('width'), this._isOptionApproach() ? 100 : undefined);

            this.assert.equal(this.$tabs.outerWidth(), 100);

            if(this.scrollingEnabled) {
                this.assert.ok(this._getTabItem(0).outerWidth() < 70, this._getTabItem().outerWidth() + ' < 70');
                this.assert.ok(this._getTabItem(1).outerWidth() > 100, this._getTabItem().outerWidth() + ' > 100');
                this.assert.equal(this.$tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 2, 'nav buttons aren\'t rendered');
            } else {
                this.assert.ok(this._getTabItem(0).outerWidth() < 55, this._getTabItem(0).outerWidth() + ' < 55');
                this.assert.ok(this._getTabItem(1).outerWidth() < 55, this._getTabItem(1).outerWidth() + ' < 55');
                this.assert.equal(this.$tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0, 'nav buttons aren\'t rendered');
            }
        }

        setWidth(width) {
            switch(this.setWidthApproach) {
                case 'option':
                    this.tabs.option('width', width);
                    break;
                case 'container':
                    this.setContainerWidth(width);
                    this.tabs.repaint();
                    break;
                case 'resizeBrowser':
                    this.setContainerWidth(width);
                    triggerResizeEvent(this.$container);
                    break;
            }
        }
    }

    [true, false, undefined].forEach((scrollingEnabled) => {
        ['resizeBrowser', 'container', 'option'].forEach((setWidthApproach) => {
            const config = `, scrollingEnabled=${scrollingEnabled}, change ${setWidthApproach}.width`;

            QUnit.test('Show fixed tabs, resize to show stretched tabs' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createFixedTabs(400);
                helper.setWidth(200);
                helper.checkStretchedTabs();
            });

            QUnit.test('Show fixed tabs, resize to show navigation buttons' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createFixedTabs(400);
                helper.setWidth(100);
                helper.checkNavigationButtonsTabs();
            });

            QUnit.test('Show stretched tabs, resize to show navigation buttons' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createStretchedTabs();
                helper.setWidth(100);
                helper.checkNavigationButtonsTabs();
            });

            QUnit.test('Show stretched tabs, resize to show fixed tabs' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createStretchedTabs();
                helper.setWidth(400);
                helper.checkFixedTabs();
            });

            QUnit.test('Show navigation buttons, resize to show stretched tabs' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createNavigationButtonsTabs();
                helper.setWidth(200);
                helper.checkStretchedTabs();
            });

            QUnit.test('Show navigation buttons, resize to show fixed tabs' + config, function(assert) {
                const helper = new TabsWidthTestHelper(assert, scrollingEnabled, setWidthApproach);
                helper.createFixedTabs();
                helper.setWidth(400);
                helper.checkFixedTabs();
            });
        });
    });

    QUnit.test('Does not render navbuttons: dx-tabs{ max-width: 413px; } .dx-tab{ width: 100px; }', function(assert) {
        const styles = '<style>.dx-tabs{ max-width: 413px; } .dx-tab{ width: 100px; }</style>';

        $('#qunit-fixture').html(styles);

        const $container = $('<div>');
        const $tabs = $('<div>');

        $tabs.appendTo($container).dxTabs({
            items: [
                { text: 'Timeline Day' },
                { text: 'Timeline Week' },
                { text: 'Timeline Work Week' },
                { text: 'Timeline Month' }
            ],
            scrollingEnabled: true,
            showNavButtons: true,
            width: 'auto'
        });
        $container.appendTo('#qunit-fixture');

        triggerShownEvent($container);

        assert.equal($tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0);

        $('#qunit-fixture').html('');
    });

    QUnit.test('Render navbuttons: dx-tabs{ max-width: 380px; } .dx-tab{ width: 100px; }', function(assert) {
        const styles = '<style>.dx-tabs{ max-width: 380px; } .dx-tab{ width: 100px; }</style>';

        $('#qunit-fixture').html(styles);

        const $container = $('<div>');
        const $tabs = $('<div>');

        $tabs.appendTo($container).dxTabs({
            items: [
                { text: 'Timeline Day' },
                { text: 'Timeline Week' },
                { text: 'Timeline Work Week' },
                { text: 'Timeline Month' }
            ],
            scrollingEnabled: true,
            showNavButtons: true,
            width: 'auto'
        });
        $container.appendTo('#qunit-fixture');

        triggerShownEvent($container);

        assert.equal($tabs.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 2);

        $('#qunit-fixture').html('');
    });
});

