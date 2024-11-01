import 'generic_light.css!';
import themes from 'ui/themes';
import { extend } from 'core/utils/extend';
import { DataSource } from 'common/data/data_source/data_source';
import holdEvent from 'common/core/events/hold';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import 'ui/responsive_box';
import 'ui/tabs';
import pointerMock from '../../helpers/pointerMock.js';
import { TestAsyncTabsWrapper, TestTabsWrapper } from '../../helpers/wrappers/tabsWrappers.js';
import { getScrollLeftMax } from '__internal/ui/scroll_view/utils/get_scroll_left_max';
import keyboardMock from '../../helpers/keyboardMock.js';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            #scrollableTabs .dx-tab {
                padding: 35px;
            }

            .bigtab.dx-tabs-expanded .dx-tab {
                width: 1000px;
            }

            #widthRootStyle {
                width: 300px;
            }
        </style>
        <div id="tabs"></div>
        <div id="widget"></div>
        <div id="widthRootStyle"></div>
        <div id="scrollableTabs"></div>`;

    $('#qunit-fixture').html(markup);
});

const TABS_ITEM_CLASS = 'dx-tab';
const TAB_SELECTED_CLASS = 'dx-tab-selected';
const FOCUS_STATE_CLASS = 'dx-state-focused';
const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
const TABS_ORIENTATION_CLASS = {
    vertical: 'dx-tabs-vertical',
    horizontal: 'dx-tabs-horizontal',
};
const TABS_ICON_POSITION_CLASS = {
    top: 'dx-tabs-icon-position-top',
    end: 'dx-tabs-icon-position-end',
    bottom: 'dx-tabs-icon-position-bottom',
    start: 'dx-tabs-icon-position-start',
};
const TABS_STYLING_MODE_CLASS = {
    primary: 'dx-tabs-styling-mode-primary',
    secondary: 'dx-tabs-styling-mode-secondary',
};
const STYLING_MODE = {
    primary: 'primary',
    secondary: 'secondary',
};
const INDICATOR_POSITION_CLASS = {
    top: 'dx-tab-indicator-position-top',
    right: 'dx-tab-indicator-position-right',
    bottom: 'dx-tab-indicator-position-bottom',
    left: 'dx-tab-indicator-position-left',
};
const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const FOCUSED_DISABLED_NEXT_TAB_CLASS = 'dx-focused-disabled-next-tab';
const FOCUSED_DISABLED_PREV_TAB_CLASS = 'dx-focused-disabled-prev-tab';
const TABS_SCROLLING_ENABLED_CLASS = 'dx-tabs-scrolling-enabled';
const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';
const TAB_OFFSET = 30;

const toSelector = cssClass => `.${cssClass}`;

QUnit.module('General', () => {
    QUnit.test('mouseup switch selected tab', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        $.each(tabsInstance.option('items'), function(clickedTabIndex) {
            const tabs = $(tabsInstance._itemElements());
            tabs.eq(clickedTabIndex).trigger('dxclick');

            tabs.each(function(tabIndex) {
                const tab = $(this);
                const isClickedTab = tabIndex === clickedTabIndex;

                assert.ok(isClickedTab ? tab.hasClass(TAB_SELECTED_CLASS) : !tab.hasClass(TAB_SELECTED_CLASS), 'tab selected state');
            });

            assert.equal(tabsInstance.option('selectedIndex'), clickedTabIndex, 'tabs selectedIndex');
        });
    });

    QUnit.test('repeated click doesn\'t change selected tab state', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        const tabElements = $(tabsInstance._itemElements());
        const tabElement = tabElements.eq(1);

        tabElement.trigger('dxclick');

        assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 1);

        tabElement.trigger('dxclick');
        assert.ok(tabElement.hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 1);
    });

    QUnit.test('disabled tab can\'t be selected by click', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [
                { text: '1' },
                {
                    text: '2',
                    disabled: true
                },
                { text: '3' }
            ]
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        const tabElements = $(tabsInstance._itemElements());

        tabElements.eq(2).trigger('dxclick');

        assert.ok(tabElements.eq(2).hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 2);

        tabElements.eq(1).trigger('dxclick');
        assert.ok(!tabElements.eq(1).hasClass(TAB_SELECTED_CLASS));
        assert.equal(tabsInstance.option('selectedIndex'), 2);
    });

    QUnit.test('dxpointerup event should change focused tab', function(assert) {
        const clock = sinon.useFakeTimers();

        const $tabs = $('#tabs').dxTabs({
            focusStateEnabled: true,
            items: [1, 2],
        });
        const $secondTab = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);

        try {
            $secondTab.trigger('dxpointerdown');
            clock.tick(10);
            assert.strictEqual($secondTab.hasClass(FOCUS_STATE_CLASS), false);
            $secondTab.trigger('dxpointerup');
            clock.tick(10);
            assert.strictEqual($secondTab.hasClass(FOCUS_STATE_CLASS), true);
        } finally {
            clock.restore();
        }
    });

    QUnit.test('regression: wrong selectedIndex in tab mouseup handler', function(assert) {
        let selectedIndex;

        const tabsEl = $('#tabs').dxTabs({
            onSelectionChanged: function() {
                selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
            },
            items: [
                { text: '0' },
                { text: '1' }
            ]
        });

        tabsEl.find(`.${TABS_ITEM_CLASS}`).eq(1).trigger('dxclick');
        assert.equal(selectedIndex, 1);

    });

    QUnit.test('select action should not be triggered when disabled item is disabled', function(assert) {
        let selectedIndex;

        const tabsEl = $('#tabs').dxTabs({
            onSelectionChanged: function(e) {
                selectedIndex = tabsEl.dxTabs('instance').option('selectedIndex');
            },
            items: [
                { text: '0' },
                { text: '1', disabled: true }
            ]
        });

        tabsEl.find(`.${TABS_ITEM_CLASS}`).eq(1).trigger('dxclick');
        assert.equal(selectedIndex, undefined);
    });

    QUnit.testInActiveWindow('specific class should be set to the selected item when next item has focused and disabled states', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2', disabled: true },
                { text: '3', disabled: true },
            ],
            focusStateEnabled: true,
        });
        const keyboard = keyboardMock($element);

        keyboard.press('right');
        keyboard.press('right');

        const $items = $element.find(toSelector(TABS_ITEM_CLASS));

        assert.notOk($items.eq(0).hasClass(FOCUSED_DISABLED_NEXT_TAB_CLASS), 'The first item does not have specific class');
        assert.ok($items.eq(1).hasClass(FOCUSED_DISABLED_NEXT_TAB_CLASS), 'The second item has specific class');

        keyboard.press('left');
        assert.notOk($items.eq(1).hasClass(FOCUSED_DISABLED_NEXT_TAB_CLASS), 'The second item does not have specific class');

        keyboard.press('right');
        keyboard.press('right');

        assert.notOk($items.eq(1).hasClass(FOCUSED_DISABLED_NEXT_TAB_CLASS), 'The second item does not have specific class');
    });

    QUnit.testInActiveWindow('specific class should be set to the selected item when prev item has focused and disabled states', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1', disabled: true },
                { text: '2', disabled: true },
                { text: '3' },
                { text: '4' },
            ],
            focusStateEnabled: true,
        });
        const keyboard = keyboardMock($element);

        keyboard.press('right');
        keyboard.press('right');

        const $items = $element.find(toSelector(TABS_ITEM_CLASS));

        assert.notOk($items.eq(0).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), 'The first item does not have specific class');
        assert.notOk($items.eq(3).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), 'The fourth item does not have specific class');

        keyboard.press('right');
        assert.notOk($items.eq(3).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), 'The fourth item does not have specific class');

        keyboard.press('left');
        assert.ok($items.eq(3).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), 'The fourth item has specific class');

        keyboard.press('right');
        keyboard.press('right');

        assert.notOk($items.eq(3).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), 'The fourth item does not have specific class');
    });

    QUnit.test('Scrolling enabled class on the tabs element must depends on the scrollingEnabled option', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [1, 2, 3],
        });
        const instance = $element.dxTabs('instance');

        assert.ok($element.hasClass(TABS_SCROLLING_ENABLED_CLASS));

        instance.option({ scrollingEnabled: false });

        assert.notOk($element.hasClass(TABS_SCROLLING_ENABLED_CLASS));
    });

    QUnit.test('the tabs element must have a horizontal class by default', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [1, 2, 3],
        });

        assert.ok($element.hasClass(TABS_ORIENTATION_CLASS.horizontal));
    });

    QUnit.test('the tabs element must have a vertical class if orientation is vertical', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [1, 2, 3],
            orientation: 'vertical',
        });

        assert.ok($element.hasClass(TABS_ORIENTATION_CLASS.vertical));
    });

    QUnit.test('the tabs element must have a correct orientation class in runtime change', function(assert) {
        const $element = $('#tabs').dxTabs({
            items: [1, 2, 3],
        });
        const tabs = $element.dxTabs('instance');

        assert.ok($element.hasClass(TABS_ORIENTATION_CLASS.horizontal));

        tabs.option('orientation', 'vertical');
        assert.ok($element.hasClass(TABS_ORIENTATION_CLASS.vertical));
        assert.notOk($element.hasClass(TABS_ORIENTATION_CLASS.horizontal));

        tabs.option('orientation', 'horizontal');
        assert.ok($element.hasClass(TABS_ORIENTATION_CLASS.horizontal));
        assert.notOk($element.hasClass(TABS_ORIENTATION_CLASS.vertical));
    });

    QUnit.test('vertical tabs should hide the navigation after iconPosition is changed from top to start', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [
                { text: 'item 1', icon: 'plus' },
                { text: 'item 2', icon: 'plus' },
                { text: 'item 3', icon: 'plus' },
            ],
            scrollingEnabled: true,
            visible: true,
            orientation: 'vertical',
            iconPosition: 'top',
            showNavButtons: true,
            height: 300,
        });

        assert.strictEqual($element.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 2, 'nav buttons was rendered');
        assert.strictEqual($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrollable was rendered');

        const instance = $element.dxTabs('instance');

        instance.option('iconPosition', 'start');

        assert.strictEqual($element.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0, 'nav buttons was removed');
        assert.strictEqual($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 0, 'scrollable was removed');
    });

    QUnit.test('the tabs element must have a start icon position class by default', function(assert) {
        const $element = $('#tabs').dxTabs();

        assert.ok($element.hasClass(TABS_ICON_POSITION_CLASS.start));
    });

    ['top', 'end', 'bottom'].forEach((iconPosition) => {
        QUnit.test('the tabs element must have a correct icon position class', function(assert) {
            const $element = $('#tabs').dxTabs({ iconPosition });

            assert.ok($element.hasClass(TABS_ICON_POSITION_CLASS[iconPosition]));
        });
    });

    QUnit.test('the tabs element must have a correct icon position class in runtime change', function(assert) {
        const $element = $('#tabs').dxTabs();
        const instance = $element.dxTabs('instance');
        const iconPositions = ['top', 'end', 'bottom'];

        iconPositions.forEach((iconPosition, index) => {
            instance.option({ iconPosition });

            if(index !== 0) {
                assert.notOk($element.hasClass(TABS_ICON_POSITION_CLASS[iconPositions[index - 1]]));
            }

            assert.ok($element.hasClass(TABS_ICON_POSITION_CLASS[iconPosition]));
        });
    });

    QUnit.test('the tabs element must have a correct styling mode class', function(assert) {
        const $element = $('#tabs').dxTabs({ items: [1, 2, 3] });
        const instance = $element.dxTabs('instance');

        assert.strictEqual(instance.option('stylingMode'), STYLING_MODE.primary);
        assert.strictEqual($element.hasClass(TABS_STYLING_MODE_CLASS.primary), true);
        assert.strictEqual($element.hasClass(TABS_STYLING_MODE_CLASS.secondary), false);

        instance.option({ stylingMode: 'secondary' });

        assert.strictEqual(instance.option('stylingMode'), STYLING_MODE.secondary);
        assert.strictEqual($element.hasClass(TABS_STYLING_MODE_CLASS.secondary), true);
        assert.strictEqual($element.hasClass(TABS_STYLING_MODE_CLASS.primary), false);
    });

    QUnit.test('Tabs should show the navigation after stylingMode is changed from secondary to primary', function(assert) {
        const isMaterialBased = themes.isMaterialBased();

        if(!isMaterialBased) {
            assert.ok(true, 'not isMaterialBased');
            return;
        }

        const $element = $('#scrollableTabs').dxTabs({
            items: [
                { text: 'item 1', icon: 'plus' },
                { text: 'item 2', icon: 'plus' },
                { text: 'item 3', icon: 'plus' },
            ],
            stylingMode: 'secondary',
            scrollingEnabled: true,
            visible: true,
            showNavButtons: true,
            width: 334,
        });

        assert.strictEqual($element.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 0, 'nav buttons was not rendered');
        assert.strictEqual($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 0, 'scrollable was not rendered');

        const instance = $element.dxTabs('instance');

        instance.option('stylingMode', 'primary');

        assert.strictEqual($element.find(`.${TABS_NAV_BUTTON_CLASS}`).length, 2, 'nav buttons was rendered');
        assert.strictEqual($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrollable was rendered');
    });
});

QUnit.module('Tab select action', () => {
    QUnit.module('onSelectionChanging', {
        beforeEach() {
            this.onSelectionChangingStub = sinon.stub();
            this.onSelectionChangedStub = sinon.stub();
            this.firstItem = { text: '0' };
            this.secondItem = { text: '1' };
            const initialOptions = {
                items: [
                    this.firstItem,
                    this.secondItem,
                    { text: '2' },
                    { text: '3' }
                ],
                onSelectionChanging: this.onSelectionChangingStub,
                onSelectionChanged: this.onSelectionChangedStub,
                selectByClick: true,
                selectedIndex: 0
            };
            this.init = (options) => {
                this.$tabs = $('#tabs');
                this.tabs = this.$tabs
                    .dxTabs($.extend({}, initialOptions, options))
                    .dxTabs('instance');
            };
            this.reinit = (options) => {
                this.tabs.dispose();

                this.init(options);
            };

            this.init();

            this.assertSelectionNotChanged = (assert) => {
                assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called once');
                assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called');

                assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'selectedIndex should remain 0');
                assert.deepEqual(this.tabs.option('selectedItem'), this.firstItem, 'selectedItem should remain the first item');
                assert.deepEqual(this.tabs.option('selectedItems'), [this.firstItem], 'selectedItems should remain the first item');
                assert.deepEqual(this.tabs.option('selectedItemKeys'), [this.firstItem], 'selectedItemKeys should remain the first key');
            };
            this.assertSecondItemSelected = (assert) => {
                assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
                assert.strictEqual(this.onSelectionChangedStub.callCount, 1, 'onSelectionChanged should be called');

                assert.strictEqual(this.tabs.option('selectedIndex'), 1, 'selectedIndex should be updated to 1');
                assert.deepEqual(this.tabs.option('selectedItem'), this.secondItem, 'selectedItem should be equal to the second item');
                assert.deepEqual(this.tabs.option('selectedItems'), [this.secondItem], 'selectedItems should contain second item');
                assert.deepEqual(this.tabs.option('selectedItemKeys'), [this.secondItem], 'selectedItemKeys should contain second item');
            };
        }
    }, () => {
        QUnit.module('selection should be cancelled when onSelectionChanging', () => {
            QUnit.test('is specified on init and sets cancel=true', function(assert) {
                this.onSelectionChangingStub = sinon.spy((e) => {
                    e.cancel = true;
                });

                this.reinit({
                    onSelectionChanging: this.onSelectionChangingStub,
                });

                const $item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
                $item.trigger('dxclick');

                this.assertSelectionNotChanged(assert);
            });

            QUnit.test('is changed at runtime and sets cancel=true', function(assert) {
                this.onSelectionChangingStub = sinon.spy(function(e) {
                    e.cancel = true;
                });

                this.tabs.option({
                    onSelectionChanging: this.onSelectionChangingStub,
                });

                this.$item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
                this.$item.trigger('dxclick');

                this.assertSelectionNotChanged(assert);
            });

            QUnit.test('sets e.cancel to promise resolved with true', function(assert) {
                const done = assert.async();

                this.onSelectionChangingStub = sinon.spy(function(e) {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        });
                    });
                });

                this.tabs.option('onSelectionChanging', this.onSelectionChangingStub);

                const $item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);

                $item.trigger('dxclick');

                assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging is called immediately after click');
                assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged is not called yet');
                assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'initial selectedIndex should be 0');


                setTimeout(() => {
                    this.assertSelectionNotChanged(assert);
                    done();
                });
            });
        });

        QUnit.module('selection should be applied when onSelectionChanging', () => {
            QUnit.test('does not update e.cancel', function(assert) {
                this.$item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
                this.$item.trigger('dxclick');

                assert.strictEqual(this.onSelectionChangingStub.getCall(0).args[0].cancel, false, 'e.cancel should be set to false');

                this.assertSecondItemSelected(assert);
            });

            QUnit.test('sets e.cancel to a promise resolved with false', function(assert) {
                const done = assert.async();

                this.onSelectionChangingStub = sinon.spy(function(e) {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(false);
                        });
                    });
                });

                this.tabs.option('onSelectionChanging', this.onSelectionChangingStub);

                const $item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);

                $item.trigger('dxclick');

                assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging is called immediately after click');
                assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged is not called yet');
                assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'initial selectedIndex should be 0');

                setTimeout(() => {
                    this.assertSecondItemSelected(assert);
                    done();
                });
            });

            QUnit.test('sets e.cancel to a rejected promise', function(assert) {
                const done = assert.async();

                this.onSelectionChangingStub = sinon.spy((e) => {
                    e.cancel = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject('Cancellation error');
                        });
                    });
                });

                this.tabs.option('onSelectionChanging', this.onSelectionChangingStub);

                const $item = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
                $item.trigger('dxclick');

                assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called after click');
                assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called before promise resolves');

                setTimeout(() => {
                    this.assertSecondItemSelected(assert);
                    done();
                });
            });
        });

        QUnit.test('multiple items should be selected and one item deselected correctly', function(assert) {
            this.tabs.option('selectionMode', 'multiple');

            const expectedResult = [
                { 'text': '1' },
                { 'text': '2' }
            ];
            this.reinit({
                selectedIndex: -1,
                selectionMode: 'multiple'
            });

            const $item1 = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(0);
            const $item2 = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
            const $item3 = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(2);

            // NOTE: Select items.
            $item1.trigger('dxclick');
            $item2.trigger('dxclick');
            $item3.trigger('dxclick');

            // NOTE: Deselect the first item.
            $item1.trigger('dxclick');

            const selectedItems = this.tabs.option('selectedItems');

            assert.deepEqual(selectedItems, expectedResult, 'Items with indexes 1 and 2 should be selected');
            assert.deepEqual(this.tabs.option('selectedItem'), this.secondItem, 'selectedItem should be updated properly');
            assert.deepEqual(this.tabs.option('selectedItems'), expectedResult, 'selectedItems should be updated properly');
            assert.deepEqual(this.tabs.option('selectedItemKeys'), expectedResult, 'selectedItemKeys should be updated properly');

            assert.strictEqual(this.onSelectionChangingStub.callCount, 4, 'onSelectionChanging should be called for each action');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 4, 'onSelectionChanged should be called for each complete selection change');
        });
    });

    QUnit.test('should not be triggered when is already selected', function(assert) {
        let count = 0;

        const $tabs = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' },
                { text: '3' }
            ],
            onSelectionChanged: function(e) {
                count += 1;
            }
        });

        const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(1);

        $tab
            .trigger('dxclick')
            .trigger('dxclick');

        assert.equal(count, 1, 'action triggered only once');
    });

    QUnit.test('selectedIndex updated on \'onItemClick\'', function(assert) {
        assert.expect(1);

        const $tabs = $('#tabs');

        $tabs.dxTabs({
            items: [1, 2, 3],
            selectedIndex: 1,
            onItemClick: function() {
                assert.equal(this.option('selectedIndex'), 2, 'selectedIndex changed');
            }
        });

        const $tab = $tabs.find(toSelector(TABS_ITEM_CLASS)).eq(2);

        pointerMock($tab).click();
    });

    QUnit.test('regression: B251795', function(assert) {
        assert.expect(2);

        let itemClickFired = 0;
        let itemSelectFired = 0;

        const $tabs = $('#tabs').dxTabs({
            items: [1, 2, 3],

            selectedIndex: 0,

            onItemClick: function() {
                itemClickFired++;
            },

            onSelectionChanged: function() {
                itemSelectFired++;
            }
        });

        $tabs
            .find('.' + TABS_ITEM_CLASS)
            .eq(1)
            .trigger($.Event('touchend', { touches: [1], targetTouches: [1], changedTouches: [{ identifier: 13 }] }))
            .trigger('mouseup');

        assert.equal(itemClickFired, 0);
        assert.equal(itemSelectFired, 0);
    });

    QUnit.test('Tabs in multiple mode', function(assert) {
        const $element = $('#widget').dxTabs({
            items: [
                { text: 'user' },
                { text: 'analytics' },
                { text: 'customers' },
                { text: 'search' },
                { text: 'favorites' }
            ], width: 400,
            selectionMode: 'multiple',
            selectedIndex: 2
        });
        const instance = $element.dxTabs('instance');

        assert.equal(instance.option('selectedItem').text, 'customers', 'was selected correct item');

        assert.ok(!instance.option('selectOnFocus'), 'option selectOnFocus must be false with turn on multiple mode');

        const $tab = $element.find(toSelector(TABS_ITEM_CLASS)).eq(3);
        pointerMock($tab).click();

        assert.equal(instance.option('selectedItems').length, 2, 'selected two items in multiple mode');
    });

    QUnit.test('focusedElement must be changed after changing the selectedIndex', function(assert) {
        assert.expect(2);

        const $tabs = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' },
            ],
            focusStateEnabled: true,
        });
        const tabs = $tabs.dxTabs('instance');

        const tabsItemFirst = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(0);

        tabsItemFirst.trigger('dxclick');

        const $focusedElementFirst = tabs.option('focusedElement');

        assert.strictEqual($focusedElementFirst, tabsItemFirst[0]);

        tabs.option({ selectedIndex: 1 });

        const tabItemSecond = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
        const $focusedElementSecond = tabs.option('focusedElement');

        assert.strictEqual($focusedElementSecond, tabItemSecond[0]);
    });

    QUnit.test('focusedElement must be changed after changing the selectedItem', function(assert) {
        assert.expect(2);

        const $tabs = $('#tabs').dxTabs({
            items: [
                { text: '0' },
                { text: '1' },
                { text: '2' },
            ],
            focusStateEnabled: true,
        });
        const tabs = $tabs.dxTabs('instance');

        const tabsItemFirst = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(0);

        tabsItemFirst.trigger('dxclick');

        const $focusedElementFirst = tabs.option('focusedElement');

        assert.strictEqual($focusedElementFirst, tabsItemFirst[0]);

        tabs.option({ selectedItem: tabs.option('items[1]') });

        const tabItemSecond = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
        const $focusedElementSecond = tabs.option('focusedElement');

        assert.strictEqual($focusedElementSecond, tabItemSecond[0]);
    });

    QUnit.test('focusedElement must be changed after changing the selectedItems', function(assert) {
        assert.expect(2);

        const items = [
            { text: '0' },
            { text: '1' },
            { text: '2' },
        ];
        const $tabs = $('#tabs').dxTabs({ items, focusStateEnabled: true });
        const tabs = $tabs.dxTabs('instance');

        const tabItemFirst = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(0);

        tabItemFirst.trigger('dxclick');

        const $focusedElementFirst = tabs.option('focusedElement');

        assert.strictEqual($focusedElementFirst, tabItemFirst[0]);

        tabs.option({ selectedItems: [items[1], items[2]] });

        const tabItemSecond = $tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
        const $focusedElementSecond = tabs.option('focusedElement');

        assert.strictEqual($focusedElementSecond, tabItemSecond[0]);
    });
});

QUnit.module('Horizontal scrolling', () => {
    const SCROLLABLE_CLASS = 'dx-scrollable';

    QUnit.test('tabs should be wrapped into scrollable if scrollingEnabled=true', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            width: 100
        });
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

        assert.ok($scrollable.length, 'scroll created');
        assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
        assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
    });

    QUnit.test('tabs should be wrapped into scrollable after orientation runtime changing', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: false,
            scrollingEnabled: true,
            orientation: 'vertical',
            width: 500,
            height: 50,
        });
        const instance = $element.dxTabs('instance');

        assert.strictEqual($element.children(`.${SCROLLABLE_CLASS}`).length, 1, 'scroll is created');

        instance.option({ orientation: 'horizontal' });

        assert.strictEqual($element.children(`.${SCROLLABLE_CLASS}`).length, 1, 'scroll was not removed');
    });

    QUnit.test('tabs should be wrapped into scrollable for some disabled items', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2', disabled: true }, { text: 'item 3', disabled: true }, { text: 'item 4', disabled: true }],
            width: 200
        });
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);

        assert.ok($scrollable.length, 'scroll created');
        assert.ok($scrollable.hasClass(TABS_SCROLLABLE_CLASS), 'wrapper class added');
        assert.ok($scrollable.find('.' + TABS_ITEM_CLASS).length, 'items wrapped into scrollable');
    });

    QUnit.test('scrollable width is equal to component width if there are invisible items there', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            showNavButtons: false,
            scrollingEnabled: true,
            items: [{ text: 'item 1' }, { text: 'item 2', visible: false }, { text: 'item 3', visible: false }, { text: 'item 4', visible: false }],
            width: 200,
        });

        const scrollableWidth = $element.children(`.${SCROLLABLE_CLASS}`).width();

        assert.strictEqual(scrollableWidth, 200);
    });

    QUnit.test('scrollable should have correct option scrollByContent', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            scrollByContent: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');
        const $scrollable = $element.children('.' + SCROLLABLE_CLASS);
        const scrollable = $scrollable.dxScrollable('instance');

        assert.ok(scrollable.option('scrollByContent'), 'scrollByContent was set');

        instance.option('scrollByContent', false);
        assert.ok(!scrollable.option('scrollByContent'), 'scrollByContent was set');
    });

    QUnit.test('scrollable should have correct direction option if tabs orientation has been updated', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            scrollByContent: true,
            width: 100,
            orientation: 'horizontal',
        });

        const getScrollable = () => {
            const $scrollable = $element.children(`.${SCROLLABLE_CLASS}`);
            const scrollable = $scrollable.dxScrollable('instance');
            return scrollable;
        };

        const tabs = $element.dxTabs('instance');

        assert.strictEqual(getScrollable().option('direction'), 'horizontal');

        tabs.option({ width: 'auto', height: 100, orientation: 'vertical' });
        assert.strictEqual(getScrollable().option('direction'), 'vertical');

        tabs.option({ width: 100, height: 'auto', orientation: 'horizontal' });
        assert.strictEqual(getScrollable().option('direction'), 'horizontal');
    });

    QUnit.test('tabs should not crash in Firefox after creation', function(assert) {
        $('#tabs').addClass('bigtab').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            scrollingEnabled: true,
            showNavButtons: true
        });

        assert.ok(true, 'widget was inited');
    });

    QUnit.test('nav buttons class should be added if showNavButtons=true', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            width: 100
        });

        assert.ok($element.hasClass(TABS_NAV_BUTTONS_CLASS), 'navs class added');
    });

    QUnit.test('nav buttons should be rendered when widget is rendered invisible', function(assert) {
        const $container = $('<div>');

        try {
            const $element = $('<div>').appendTo($container).dxTabs({
                items: [
                    { text: 'user' },
                    { text: 'analytics' },
                    { text: 'customers' },
                    { text: 'search' },
                    { text: 'favorites' }
                ],
                scrollingEnabled: true,
                showNavButtons: true,
                width: 100
            });

            $container.appendTo('#qunit-fixture');
            triggerShownEvent($container);

            assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 2, 'nav buttons are rendered');
        } finally {
            $container.remove();
        }
    });

    QUnit.test('The width of scrollable and tab elements should increase as the width of the container increases', function(assert) {
        const CONTAINER_UPDATED_WIDTH = 900;
        const CONTAINER_INITIAL_WIDTH = 200;

        const $container = $('<div>').css({ width: CONTAINER_INITIAL_WIDTH });

        try {
            $container.appendTo('#qunit-fixture');

            const dataSource = [
                { text: 'John Heart' },
                { text: 'Marina Elizabeth' },
                { text: 'Robert Reagan' },
                { text: 'Greta Sims' },
            ];

            const $element = $('<div>').appendTo($container).dxTabs({
                dataSource,
                scrollingEnabled: true,
                showNavButtons: false,
            });

            const $scrollable = $element.find(`.${SCROLLABLE_CLASS}`);

            assert.strictEqual($scrollable.outerWidth(), CONTAINER_INITIAL_WIDTH);

            $container.css({ width: CONTAINER_UPDATED_WIDTH });

            assert.strictEqual($scrollable.outerWidth(), CONTAINER_UPDATED_WIDTH);

            const $tab = $element.find(`.${TABS_ITEM_CLASS}`).eq(0);

            assert.strictEqual($tab.outerWidth(), CONTAINER_UPDATED_WIDTH / dataSource.length);
        } finally {
            $container.remove();
        }
    });

    QUnit.test('right nav button should be rendered if showNavButtons=true and possible to scroll right', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.children().eq(-1);

        assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
        assert.ok($button.hasClass(TABS_RIGHT_NAV_BUTTON_CLASS), 'right class added');
    });

    QUnit.test('click on right nav button should scroll tabs to right', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        $($button).trigger('dxclick');
        assert.equal(scrollable.scrollLeft(), TAB_OFFSET, 'scroll position is correct');
    });

    QUnit.test('hold on right nav button should scroll tabs to right to end', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
                { text: 'item 5' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        this.clock = sinon.useFakeTimers();

        $($button).trigger(holdEvent.name);
        this.clock.tick(100);
        $($button).trigger('mouseup');

        assert.equal(scrollable.scrollLeft(), 120, 'scroll position is correct');

        this.clock.restore();
    });

    QUnit.test('left nav button should be rendered if showNavButtons=true and possible to scroll left', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.children().eq(0);

        assert.ok($button.hasClass(TABS_NAV_BUTTON_CLASS), 'nav class added');
        assert.ok($button.hasClass(TABS_LEFT_NAV_BUTTON_CLASS), 'left class added');
    });

    QUnit.test('click on left nav button should scroll tabs to left', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        scrollable.update();
        scrollable.scrollTo(TAB_OFFSET);
        $($button).trigger('dxclick');
        assert.equal(scrollable.scrollLeft(), 0, 'scroll position is correct');
    });

    QUnit.test('hold on left nav button should scroll tabs to left to end', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' },
                { text: 'item 5' }, { text: 'item 6' }, { text: 'item 7' }, { text: 'item 8' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        this.clock = sinon.useFakeTimers();

        scrollable.update();
        scrollable.scrollTo(200);

        $($button).trigger(holdEvent.name);
        this.clock.tick(100);
        $($button).trigger('mouseup');

        assert.equal(scrollable.scrollLeft(), 80, 'scroll position is correct');

        this.clock.restore();
    });

    QUnit.test('selected item should be visible after selectedIndex was changed', function(assert) {
        assert.expect(2);
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            width: 100,
            selectedIndex: 0,
            scrollingEnabled: true,
            focusStateEnabled: true,
        });
        const instance = $element.dxTabs('instance');
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        scrollable.scrollToElement = function($item) {
            assert.equal($item.get(0), instance.itemElements().eq(3).get(0), 'scrolled to item');
        };
        instance.option('selectedIndex', 3);
    });

    QUnit.test('tabs should be wrapped into scrollable if all items are visible', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            showNavButtons: false,
            width: 250,
        });
        const $scrollable = $element.children(`.${SCROLLABLE_CLASS}`);

        assert.strictEqual($scrollable.length, 1, 'scroll was created');
    });

    QUnit.test('left button should be disabled if scrollPosition == 0', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');

        assert.ok($button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(10);
        assert.ok(!$button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(0);
        assert.ok($button.dxButton('instance').option('disabled'));
    });

    QUnit.test('right button should be disabled if scrollPosition == scrollWidth', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);
        const scrollable = $element.find('.' + SCROLLABLE_CLASS).dxScrollable('instance');
        const scrollWidth = Math.round(scrollable.scrollWidth());

        assert.ok(!$button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(scrollWidth - scrollable.clientWidth());
        assert.ok($button.dxButton('instance').option('disabled'));

        scrollable.scrollTo(0);
        assert.ok(!$button.dxButton('instance').option('disabled'));
    });

    QUnit.module('Disabled state of navigation buttons', () => {
        [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.25, 1.34, 1.5, 1.875, 2.25, 2.65].forEach((browserZoom) => {
            [true, false].forEach((rtlEnabled) => {
                const cssStyles = {
                    transform: `scale(${browserZoom})`,
                    transformOrigin: '0 0',
                };
                // T1037332
                QUnit.test(`Left button should be disabled in boundary value: ${JSON.stringify(cssStyles)}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                    assert.expect(6);

                    $('#tabs').css(cssStyles);
                    const $element = $('#tabs').dxTabs({
                        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                        showNavButtons: true,
                        scrollingEnabled: true,
                        rtlEnabled,
                        width: 100
                    });
                    const leftButton = $element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const rightButton = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const scrollable = $element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');

                    assert.strictEqual(leftButton.option('disabled'), rtlEnabled ? false : true);
                    assert.strictEqual(rightButton.option('disabled'), rtlEnabled ? true : false);

                    scrollable.scrollTo({ left: 10 });
                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), false);

                    scrollable.scrollTo({ left: 0 });
                    assert.strictEqual(leftButton.option('disabled'), true);
                    assert.strictEqual(rightButton.option('disabled'), false);
                });

                QUnit.test(`Right button should be disabled in boundary value: ${JSON.stringify(cssStyles)}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                    assert.expect(6);

                    $('#tabs').css(cssStyles);
                    const $element = $('#tabs').dxTabs({
                        items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                        showNavButtons: true,
                        scrollingEnabled: true,
                        rtlEnabled,
                        width: 100
                    });
                    const leftButton = $element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const rightButton = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).dxButton('instance');
                    const scrollable = $element.find(`.${SCROLLABLE_CLASS}`).dxScrollable('instance');

                    assert.strictEqual(leftButton.option('disabled'), rtlEnabled ? false : true);
                    assert.strictEqual(rightButton.option('disabled'), rtlEnabled ? true : false);

                    const maxLeftOffset = getScrollLeftMax($(scrollable.container()).get(0));
                    scrollable.scrollTo({ left: maxLeftOffset });

                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), true);

                    scrollable.scrollTo({ left: 10 });
                    assert.strictEqual(leftButton.option('disabled'), false);
                    assert.strictEqual(rightButton.option('disabled'), false);
                });
            });
        });
    });

    QUnit.test('button should update disabled state after dxresize', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            width: 100
        });
        const $button = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS);

        $button.dxButton('instance').option('disabled', true);

        $($element).trigger('dxresize');
        assert.ok(!$button.dxButton('instance').option('disabled'));
    });

    QUnit.test('tabs should not be refreshed after dimension changed', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            visible: true,
            width: 100
        });
        const instance = $element.dxTabs('instance');

        instance.itemElements().data('rendered', true);

        $($element).trigger('dxresize');

        assert.ok(instance.itemElements().data('rendered'), 'tabs was not refreshed');
        assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 1, 'only one scrollable wrapper should exist');
    });

    QUnit.test('tabs should hide navigation if scrollable is not allowed after resize', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            scrollingEnabled: true,
            showNavButtons: true,
            visible: true,
            width: 100,
        });
        const instance = $element.dxTabs('instance');

        instance.option('width', 700);

        assert.equal($element.find('.' + TABS_NAV_BUTTON_CLASS).length, 0, 'nav buttons was removed');
        assert.equal($element.find('.' + TABS_SCROLLABLE_CLASS).length, 0, 'scrollable was removed');
        assert.equal($element.find('.' + TABS_WRAPPER_CLASS).length, 1, 'indent wrapper was restored');
    });

    QUnit.test('tabs should scroll to the selected item on init', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }, { text: 'item 4' }, { text: 'item 5' }];
        const $element = $('#scrollableTabs').dxTabs({
            items: items,
            scrollingEnabled: true,
            visible: true,
            selectedItem: items[3],
            width: 200
        });

        const $item = $element.find('.' + TABS_ITEM_CLASS).eq(3);
        const itemOffset = Math.round($item.offset().left);
        const contentLeft = Math.round($element.offset().left);
        const contentRight = Math.round(contentLeft + $element.outerWidth());
        const rightBoundary = Math.round(contentRight - $item.outerWidth());

        assert.ok(itemOffset <= rightBoundary, `item offset ${itemOffset} is lower than right boundary ${rightBoundary}`);
        assert.ok(itemOffset > contentLeft, `item offset ${itemOffset} is greater than left boundary ${contentLeft}`);
    });

    QUnit.test('tabs should scroll to the disabled item when it have focus', function(assert) {
        const items = [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', disabled: true }];
        const $element = $('#scrollableTabs').dxTabs({
            items,
            width: 200,
            showNavButtons: false,
            focusStateEnabled: true,
        });
        const $item = $element.find(`.${DISABLED_STATE_CLASS}`).eq(0);
        const keyboard = keyboardMock($element);

        keyboard.press('right');
        keyboard.press('right');

        const contentLeft = $element.offset().left;
        const contentRight = contentLeft + $element.outerWidth();
        const itemLeft = $item.offset().left;
        const itemRight = itemLeft + $item.outerWidth();

        assert.roughEqual(itemRight, contentRight, 1, 'focused disabled item is in view');
    });
});

QUnit.module('RTL', () => {
    QUnit.test('nav buttons should have correct icons on init', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
        const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

        assert.equal(leftButtonIcon, BUTTON_NEXT_ICON, 'Left button icon is OK');
        assert.equal(rightButtonIcon, BUTTON_PREV_ICON, 'Right button icon is OK');
    });

    QUnit.test('nav buttons should have correct icons after rtlEnabled changed', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        $element.dxTabs('option', 'rtlEnabled', false);

        const leftButtonIcon = $element.find('.' + TABS_LEFT_NAV_BUTTON_CLASS).dxButton('option', 'icon');
        const rightButtonIcon = $element.find('.' + TABS_RIGHT_NAV_BUTTON_CLASS).dxButton('option', 'icon');

        assert.equal(leftButtonIcon, BUTTON_PREV_ICON, 'Left button icon is OK');
        assert.equal(rightButtonIcon, BUTTON_NEXT_ICON, 'Right button icon is OK');
    });

    QUnit.test('tabs should be scrolled to the right position on init in RTL mode', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
            showNavButtons: true,
            scrollingEnabled: true,
            rtlEnabled: true,
            width: 100
        });

        const scrollable = $element.find('.dx-scrollable').dxScrollable('instance');

        assert.equal(Math.round(scrollable.scrollLeft()), Math.round(scrollable.scrollWidth() - scrollable.clientWidth()), 'items are scrolled');
    });
});

QUnit.module('Live Update', {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.data = [{
            id: 0,
            text: '0',
            content: '0 tab content'
        },
        {
            id: 1,
            text: '1',
            content: '1 tab content'
        }];
        this.createTabs = (dataSourceOptions, tabOptions) => {
            const dataSource = new DataSource($.extend({
                paginate: false,
                pushAggregationTimeout: 0,
                load: () => this.data,
                key: 'id'
            }, dataSourceOptions));

            return $('#tabs').dxTabs(
                extend(tabOptions, {
                    dataSource,
                    onContentReady: e => {
                        e.component.option('onItemRendered', this.itemRenderedSpy);
                        e.component.option('onItemDeleted', this.itemDeletedSpy);
                    }
                })).dxTabs('instance');
        };
    }
}, function() {
    QUnit.test('update item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'update', data: {
            id: 1,
            text: '1 Updated',
            content: '1 tab content'
        }, key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('add item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'insert', data: {
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('remove item', function(assert) {
        const store = this.createTabs().getDataSource().store();

        const pushData = [{ type: 'remove', key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
    });

    QUnit.test('repaintChangesOnly, update item instance', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data[0] = {
            id: 0,
            text: '0 Updated',
            content: '0 tab content'
        };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '0 Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, add item', function(assert) {
        const dataSource = this.createTabs({}, { repaintChangesOnly: true }).getDataSource();

        this.data.push({
            id: 2,
            text: '2 Inserted',
            content: '2 tab content'
        });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '2 Inserted', 'check added item');
        assert.ok($(this.itemRenderedSpy.firstCall.args[0].itemElement).parent().hasClass(TABS_WRAPPER_CLASS), 'check item container');
    });

    QUnit.test('Show nav buttons when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 1, 'left nav button is shown');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 1, 'right nav button is shown');
    });

    QUnit.test('Hide nav buttons when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content'
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: true,
            width: 120,
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`).length, 0, 'left nav button is hidden');
        assert.equal($element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`).length, 0, 'right nav button is hidden');
    });

    QUnit.test('Enable scrolling when new item is added', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 100
        });
        const store = tabs.getDataSource().store();

        store.push([{
            type: 'insert',
            data: {
                id: 2,
                text: '2 Inserted',
                content: '2 tab content'
            }
        }]);

        const $element = tabs.$element();
        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrolling is enabled');
    });

    QUnit.test('Scrolling should not be disabled when item is removed', function(assert) {
        this.data = this.data.map(item => `item ${item.text}`);
        this.data.push({
            id: 2,
            text: 'item 2',
            content: '2 tab content',
        });

        const tabs = this.createTabs({}, {
            repaintChangesOnly: true,
            showNavButtons: false,
            width: 120,
        });

        const $element = tabs.$element();

        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrolling is enabled');

        const store = tabs.getDataSource().store();

        store.push([{
            type: 'remove',
            key: 2,
        }]);

        assert.equal($element.find(`.${TABS_SCROLLABLE_CLASS}`).length, 1, 'scrolling is not disabled');
    });
});

QUnit.module('Async templates', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('render tabs', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290 });
        this.clock.tick(10);
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 180,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 100,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            showNavButtons: false,
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. use default and custom templates', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), {
            width: 100,
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3', template: 'item' }],
            showNavButtons: true,
            itemTemplate: null
        });

        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('render tabs with scrollable and navigation buttons', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('Add scrollable when width is changed from large to small', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 220, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.width = 150;
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('Add scrollable and navigation buttons when width is changed from large to small', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 220, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.width = 150;
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('Remove scrollable when width is changed from small to large', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: false });
        this.clock.tick(10);
        testWrapper.width = 290;
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    QUnit.test('Remove scrollable and navigation buttons when width is changed from small to large', function() {
        const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 150, showNavButtons: true });
        this.clock.tick(10);
        testWrapper.width = 290;
        testWrapper.checkTabsWithoutScrollable();
        testWrapper.checkNavigationButtons(false);
    });

    [false, true].forEach(repaintChangesOnly => {
        QUnit.test(`Add scrollable when items are changed from 5 to 10, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: false, repaintChangesOnly });

            this.clock.tick(10);
            testWrapper.setItemsByCount(10);
            this.clock.tick(10);

            testWrapper.checkTabsWithScrollable();
            testWrapper.checkNavigationButtons(false);
        });

        QUnit.test(`Add scrollable and navigation buttons when items are changed from 5 to 10, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: true, repaintChangesOnly });

            this.clock.tick(10);
            testWrapper.setItemsByCount(10);
            this.clock.tick(10);

            testWrapper.checkTabsWithScrollable();
            testWrapper.checkNavigationButtons(true);
        });

        QUnit.test(`Remove scrollable when items are changed from 10 to 5, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: false, repaintChangesOnly, itemsCount: 10 });

            this.clock.tick(10);
            testWrapper.setItemsByCount(5);
            this.clock.tick(10);

            testWrapper.checkTabsWithoutScrollable();
            testWrapper.checkNavigationButtons(false);
        });

        QUnit.test(`Remove scrollable and navigation buttons when items are changed from 10 to 5, repaintChangesOnly: ${repaintChangesOnly}`, function() {
            const testWrapper = new TestAsyncTabsWrapper($('#tabs'), { width: 290, showNavButtons: true, repaintChangesOnly, itemsCount: 10 });

            this.clock.tick(10);
            testWrapper.setItemsByCount(5);
            this.clock.tick(10);

            testWrapper.checkTabsWithoutScrollable();
            testWrapper.checkNavigationButtons(false);
        });
    });
});

QUnit.module('Render in the ResponsiveBox. Flex strategy', () => {
    const itemTemplate = () => $('<div>').width(150).height(150).css('border', '1px solid black');
    const createResponsiveBox = ({ cols, rows, items }) => $('#widget').dxResponsiveBox({
        width: 300,
        cols,
        rows,
        itemTemplate,
        screenByWidth: () => 'md',
        items
    });

    QUnit.test('render tabs with scrollable and navigation buttons', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox item has colSpan', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }, { ratio: 1 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0, colspan: 2 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                },
                {
                    location: { col: 2, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox row has ratio = 2', function() {
        createResponsiveBox({
            cols: [{ ratio: 2 }, { ratio: 1 }],
            rows: [{ ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                },
                {
                    location: { col: 1, row: 0 }
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });

    QUnit.test('render tabs with scrollable and navigation buttons. ResponsiveBox in one column', function() {
        createResponsiveBox({
            cols: [{ ratio: 1 }],
            rows: [{ ratio: 1 }, { ratio: 1 }],
            items: [
                {
                    location: { col: 0, row: 0 }
                },
                {
                    location: { col: 0, row: 1 },
                    template: () => $('<div id=\'tabsInTemplate\'>')
                }
            ]
        });
        const testWrapper = new TestTabsWrapper($('#tabsInTemplate'), {
            itemsCount: 10,
            showNavButtons: true
        });
        testWrapper.checkTabsWithScrollable();
        testWrapper.checkNavigationButtons(true);
    });
});

QUnit.module('Indicator position', () => {
    [true, false].forEach(rtlEnabled => {
        QUnit.test(`The element must have the correct indicator position class when rtlEnabled=${rtlEnabled}`, function(assert) {
            const tabsElement = $('#tabs').dxTabs({
                items: [ 1, 2, 3 ],
                rtlEnabled,
            });
            const tabsInstance = tabsElement.dxTabs('instance');

            assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));

            tabsInstance.option({ orientation: 'vertical' });

            assert.notOk(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));
            assert.ok(tabsElement.hasClass(rtlEnabled ? INDICATOR_POSITION_CLASS.left : INDICATOR_POSITION_CLASS.right));
        });
    });

    QUnit.test('The element must have the correct indicator position class when rtlEnabled was changed in vertical orientation', function(assert) {
        const tabsElement = $('#tabs').dxTabs({
            items: [ 1, 2, 3 ],
            orientation: 'vertical',
        });
        const tabsInstance = tabsElement.dxTabs('instance');

        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.right));

        tabsInstance.option({ rtlEnabled: true });

        assert.notOk(tabsElement.hasClass(INDICATOR_POSITION_CLASS.right));
        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.left));
    });

    QUnit.test('The element must have the correct indicator position class when rtlEnabled was changed in vertical horizontal', function(assert) {
        const tabsElement = $('#tabs').dxTabs({ items: [ 1, 2, 3 ] });
        const tabsInstance = tabsElement.dxTabs('instance');

        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));

        tabsInstance.option({ rtlEnabled: true });

        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));
        assert.notOk(tabsElement.hasClass(INDICATOR_POSITION_CLASS.top));
    });

    QUnit.test('The element must have the correct indicator position class when _indicatorPosition was changed', function(assert) {
        const tabsElement = $('#tabs').dxTabs({ items: [ 1, 2, 3 ] });
        const tabsInstance = tabsElement.dxTabs('instance');

        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));

        tabsInstance.option({ _indicatorPosition: 'top' });

        assert.notOk(tabsElement.hasClass(INDICATOR_POSITION_CLASS.bottom));
        assert.ok(tabsElement.hasClass(INDICATOR_POSITION_CLASS.top));
    });
});

QUnit.module('Accessibility', () => {
    QUnit.test('navigation buttons should not have aria attributes', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }, { text: 'item 1' }],
            showNavButtons: true,
            width: 100,
        });

        const $leftButton = $element.find(`.${TABS_LEFT_NAV_BUTTON_CLASS}`);
        const $rightButton = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`);

        const $buttons = [$leftButton, $rightButton];
        const attributes = ['role', 'aria-label', 'aria-disabled'];

        $buttons.forEach($button => {
            attributes.forEach(attribute => {
                const value = $button.attr(attribute);

                assert.strictEqual(value, undefined, `${attribute} is not set`);
            });
        });
    });

    QUnit.test('navigation button should not get aria-disabled when it get disabled state in runtime', function(assert) {
        const $element = $('#scrollableTabs').dxTabs({
            items: [{ text: 'item 0' }, { text: 'item 1' }],
            showNavButtons: true,
            width: 100,
        });

        const scrollable = $element.find(`.${TABS_SCROLLABLE_CLASS}`).dxScrollable('instance');

        scrollable.scrollTo(200);

        const $button = $element.find(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`);

        assert.strictEqual($button.hasClass(DISABLED_STATE_CLASS), true, 'button is disabled');
        assert.strictEqual($button.attr('aria-disabled'), undefined, 'aria-disabled is not set');
    });
});
