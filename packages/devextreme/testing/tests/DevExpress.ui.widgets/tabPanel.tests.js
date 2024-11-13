import fx from 'common/core/animation/fx';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import { deferUpdate } from 'core/utils/common';
import support from '__internal/core/utils/m_support';
import { isRenderer } from 'core/utils/type';
import 'generic_light.css!';
import $ from 'jquery';
import TabPanel from 'ui/tab_panel';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';
import translator from 'common/core/animation/translator';


QUnit.testStart(() => {
    const markup =
        '<div id="tabPanel">\
            <div data-options="dxTemplate: { name: \'title\' }">\
                <div data-bind="text: $data.text"></div>\
            </div>\
            \
            <div data-options="dxTemplate: { name: \'item\' }">\
                <p>First Name: <i data-bind="text: $data.firstName"></i></p>\
                <p>Last Name: <i data-bind="text: $data.lastName"></i></p>\
                <p>Birth Year: <i data-bind="text: $data.birthYear"></i></p>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const TABPANEL_TABS_ITEM_CLASS = 'dx-tabpanel-tab';
const TABS_CLASS = 'dx-tabs';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
const TABS_ITEM_CLASS = 'dx-tab';
const SELECTED_TAB_CLASS = 'dx-tab-selected';
const SELECTED_ITEM_CLASS = 'dx-item-selected';
const TABS_TITLE_TEXT_CLASS = 'dx-tab-text';
const ICON_CLASS = 'dx-icon';
const DISABLED_FOCUSED_TAB_CLASS = 'dx-disabled-focused-tab';
const FOCUSED_DISABLED_NEXT_TAB_CLASS = 'dx-focused-disabled-next-tab';
const FOCUSED_DISABLED_PREV_TAB_CLASS = 'dx-focused-disabled-prev-tab';
const FOCUS_STATE_CLASS = 'dx-state-focused';
const TABPANEL_CONTAINER_CLASS = 'dx-tabpanel-container';
const MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
const MULTIVIEW_HIDDEN_ITEM_CLASS = 'dx-multiview-item-hidden';

const TABPANEL_TABS_POSITION_CLASS = {
    top: 'dx-tabpanel-tabs-position-top',
    right: 'dx-tabpanel-tabs-position-right',
    bottom: 'dx-tabpanel-tabs-position-bottom',
    left: 'dx-tabpanel-tabs-position-left',
};

const TABS_POSITION = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
};

const TABS_ORIENTATION = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

const TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION = {
    top: 'dx-tab-indicator-position-bottom',
    right: 'dx-tab-indicator-position-left',
    bottom: 'dx-tab-indicator-position-top',
    left: 'dx-tab-indicator-position-right',
};

const TABS_INDICATOR_POSITION_CLASS = {
    top: 'dx-tab-indicator-position-top',
    right: 'dx-tab-indicator-position-right',
    bottom: 'dx-tab-indicator-position-bottom',
    left: 'dx-tab-indicator-position-left',
};

const toSelector = cssClass => {
    return '.' + cssClass;
};

QUnit.module('rendering', {
    beforeEach() {
        this.$tabPanel = $('#tabPanel').dxTabPanel();
    }
}, () => {
    // T803640
    QUnit.test('content should be rendered if create widget inside deferUpdate (React)', function(assert) {
        let $tabPanel;

        deferUpdate(function() {
            $tabPanel = $('<div>').appendTo('#qunit-fixture').dxTabPanel({
                items: ['Test1', 'Test2']
            });
        });

        const $tabTexts = $tabPanel.find('.dx-tab-text');
        const $contents = $tabPanel.find('.dx-multiview-item-content');

        assert.equal($tabTexts.length, 2, 'two tabs are rendered');
        assert.equal($tabTexts.eq(0).text(), 'Test1Test1', 'first tab text');
        assert.equal($tabTexts.eq(1).text(), 'Test2Test2', 'secon tab text');

        assert.equal($contents.length, 1, 'one content is rendered');
        assert.equal($contents.eq(0).text(), 'Test1', 'first item content is rendered');
    });

    QUnit.test(`tab must have ${TABPANEL_TABS_ITEM_CLASS} class`, function(assert) {
        const $element = $('#tabPanel').dxTabPanel({
            items: [1],
        });

        const tabs = $element.find(`.${TABS_ITEM_CLASS}`);

        assert.ok($(tabs[0]).hasClass(TABPANEL_TABS_ITEM_CLASS));
    });

    QUnit.test(`tabPanel must have ${TABPANEL_TABS_POSITION_CLASS.top} class by default`, function(assert) {
        const $element = $('#tabPanel').dxTabPanel();

        assert.ok($element.hasClass(TABPANEL_TABS_POSITION_CLASS.top));
    });

    QUnit.test('tabPanel must have a correct position class if tabsPosition has been changed', function(assert) {
        const $element = $('#tabPanel').dxTabPanel();
        const instance = $element.dxTabPanel('instance');

        instance.option('tabsPosition', TABS_POSITION.right);

        assert.notOk($element.hasClass(TABPANEL_TABS_POSITION_CLASS.top));
        assert.ok($element.hasClass(TABPANEL_TABS_POSITION_CLASS.right));
    });

    [true, false].forEach(rtlEnabled => {
        QUnit.test(`rtlEnabled: ${rtlEnabled}, dataSource: { title, icon } -> icon alignment`, function(assert) {
            const $element = $('<div>').appendTo('#qunit-fixture');
            new TabPanel($element, {
                rtlEnabled,
                items: [{ title: 'Caption', icon: 'remove' }], });

            const $title = $element.find(`.${TABS_TITLE_TEXT_CLASS}`);

            const TEXT_NODE_TYPE = 3;
            $title.contents()
                .filter((index, node) => { return node.nodeType === TEXT_NODE_TYPE; })
                .wrap('<span/>');

            const iconRect = $title.find(`.${ICON_CLASS}`).get(0).getBoundingClientRect();
            const textRect = $title.find('span').get(0).getBoundingClientRect();

            const epsilon = 2.1;
            assert.roughEqual((iconRect.top + iconRect.height / 2), textRect.top + textRect.height / 2, epsilon, `correct vertical centering of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);

            const horizontalMargin = rtlEnabled
                ? iconRect.right - textRect.right - iconRect.width
                : textRect.left - iconRect.left - iconRect.width;
            assert.strictEqual(horizontalMargin, 8, `correct horizontal alignment of icon ${JSON.stringify(iconRect)} and text ${JSON.stringify(textRect)}`);
        });
    });

    ['top', 'right', 'left', 'bottom'].forEach(tabsPosition => {
        QUnit.test(`TabPanel container has correct height when tabsPosition=${tabsPosition}`, function(assert) {
            const items = [
                {
                    title: 1,
                    text: 'Mariya Elizabeth Thomas Grace Sophia Rose Alexandra Victoria Isabella Natalie Olivia Emily Jennifer Margaret Stephanie',
                },
            ];

            const $tabPanel = $('<div>').appendTo('#qunit-fixture').dxTabPanel({
                items,
                width: 100,
                height: 100,
                tabsPosition,
            });

            const $tabPanelContainer = $tabPanel.find(`.${TABPANEL_CONTAINER_CLASS}`);

            if(tabsPosition === 'top' || tabsPosition === 'bottom') {
                assert.strictEqual($tabPanelContainer.get(0).clientHeight, 62);
            } else {
                assert.strictEqual($tabPanelContainer.get(0).clientWidth, 72);
            }
        });
    });
});

QUnit.module('options', {
    beforeEach() {
        fx.off = true;

        this.items = [{ text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
            { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' }];

        this.$tabPanel = $('#tabPanel').dxTabPanel({
            items: this.items
        });

        this.tabPanelInstance = this.$tabPanel.dxTabPanel('instance');
        this.tabWidgetInstance = this.$tabPanel.find(toSelector(TABS_CLASS)).dxTabs('instance');
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    QUnit.test('tabs should has correct swipeEnabled default', function(assert) {
        assert.equal(this.tabPanelInstance.option('swipeEnabled'), support.touch, 'option <swipeEnabled> of multiview widget default false');
    });

    QUnit.test('selectedIndex option test', function(assert) {
        assert.expect(2);

        assert.equal(this.tabWidgetInstance.option('selectedIndex'), 0, 'option <selectedIndex> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('selectedIndex', 1);

        assert.equal(this.tabWidgetInstance.option('selectedIndex'), 1, 'option <selectedIndex> of nested tabs widget successfully changed');
    });

    QUnit.test('selectedItem option test', function(assert) {
        assert.expect(2);

        assert.equal(this.tabWidgetInstance.option('selectedItem'), this.items[0], 'option <selectedItem> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('selectedItem', this.items[1]);

        assert.equal(this.tabWidgetInstance.option('selectedItem'), this.items[1], 'option <selectedItem> of nested tabs widget successfully changed');
    });

    QUnit.test('orientation option should be passed to tabs correctly', function(assert) {
        assert.strictEqual(this.tabWidgetInstance.option('orientation'), TABS_ORIENTATION.horizontal, 'option <orientation> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('tabsPosition', TABS_POSITION.right);

        assert.strictEqual(this.tabWidgetInstance.option('orientation'), TABS_ORIENTATION.vertical, 'option <orientation> of nested tabs widget successfully changed');
    });

    QUnit.test('iconPosition option should be passed to tabs correctly', function(assert) {
        assert.strictEqual(this.tabWidgetInstance.option('iconPosition'), 'start', 'option <iconPosition> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('iconPosition', 'top');

        assert.strictEqual(this.tabWidgetInstance.option('iconPosition'), 'top', 'option <iconPosition> of nested tabs widget successfully changed');
    });

    QUnit.test('stylingMode option should be passed to tabs correctly', function(assert) {
        assert.strictEqual(this.tabWidgetInstance.option('stylingMode'), 'primary', 'option <stylingMode> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('stylingMode', 'secondary');

        assert.strictEqual(this.tabWidgetInstance.option('stylingMode'), 'secondary', 'option <stylingMode> of nested tabs widget successfully changed');
    });

    QUnit.test('dataSource option test', function(assert) {
        assert.expect(2);

        this._$tabPanel = $('#tabPanel').dxTabPanel({
            dataSource: this.items
        });

        assert.deepEqual(this.tabWidgetInstance.option('items'), this.items, 'option <dataSource> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('dataSource', []);

        assert.deepEqual(this.tabWidgetInstance.option('items'), [], 'option <dataSource> of nested tabs widget successfully changed');
    });

    QUnit.test('items option test', function(assert) {
        assert.expect(2);

        assert.deepEqual(this.tabWidgetInstance.option('items'), this.items, 'option <items> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('items', []);

        assert.deepEqual(this.tabWidgetInstance.option('items'), [], 'option <items> of nested tabs widget successfully changed');
    });

    QUnit.test('itemHoldTimeout option test', function(assert) {
        assert.expect(2);

        assert.equal(this.tabWidgetInstance.option('itemHoldTimeout'), 750, 'option <itemHoldTimeout> successfully passed to nested tabs widget');

        this.tabPanelInstance.option('itemHoldTimeout', 1000);

        assert.equal(this.tabWidgetInstance.option('itemHoldTimeout'), 1000, 'option <itemHoldTimeout> of nested tabs widget successfully changed');
    });

    QUnit.test('tabs should has correct itemTemplateProperty', function(assert) {
        assert.equal(this.tabWidgetInstance.option('itemTemplateProperty'), 'tabTemplate', 'itemTemplateProperty option is correct');
    });

    QUnit.test('scrollingEnabled option', function(assert) {
        this.tabPanelInstance.option('scrollingEnabled', true);
        assert.ok(this.tabWidgetInstance.option('scrollingEnabled'), 'option has been passed to tabs');
    });

    QUnit.test('scrollByContent option', function(assert) {
        this.tabPanelInstance.option('scrollByContent', true);
        assert.ok(this.tabWidgetInstance.option('scrollByContent'), 'option has been passed to tabs');
    });

    QUnit.test('showNavButtons option', function(assert) {
        this.tabPanelInstance.option('showNavButtons', false);
        assert.notOk(this.tabWidgetInstance.option('showNavButtons'), 'option has been passed to tabs');
    });

    QUnit.test('hoverStateEnabled option', function(assert) {
        this.tabPanelInstance.option('hoverStateEnabled', false);
        assert.notOk(this.tabWidgetInstance.option('hoverStateEnabled'), 'option has been passed to tabs');
    });

    QUnit.test('loop option (T318329)', function(assert) {
        this.tabPanelInstance.option('loop', true);
        assert.ok(this.tabWidgetInstance.option('loopItemFocus'), 'option has been passed to tabs');
    });
});

QUnit.module('onSelectionChanging', {
    beforeEach() {
        fx.off = true;
        this.onSelectionChangingStub = sinon.stub();
        this.onSelectionChangedStub = sinon.stub();
        this.items = [{ text: '1' }, { text: '2' }];

        const initialOptions = {
            items: this.items,
            selectionMode: 'single',
            onSelectionChanging: this.onSelectionChangingStub,
            onSelectionChanged: this.onSelectionChangedStub,
        };

        this.init = (options) => {
            this.$tabPanel = $('#tabPanel');
            this.tabPanel = this.$tabPanel
                .dxTabPanel($.extend({}, initialOptions, options))
                .dxTabPanel('instance');
            this.$tabs = this.$tabPanel.find(toSelector(TABS_CLASS));
            this.tabs = this.$tabs.dxTabs('instance');
        };
        this.reinit = (options) => {
            this.tabPanel.dispose();
            this.init(options);
        };
        this.init();

        this.assertSelectionNotChanged = (assert) =>{
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called once');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called');

            assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'Tabs selectedIndex should remain 0');
            assert.deepEqual(this.tabs.option('selectedItem'), this.items[0], 'Tabs selectedItem should remain the first item');
            assert.deepEqual(this.tabs.option('selectedItems'), [this.items[0]], 'Tabs selectedItems should remain the first item');
            assert.deepEqual(this.tabs.option('selectedItemKeys'), [this.items[0]], 'Tabs selectedItemKeys should remain the first key');
            assert.ok(this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(0).hasClass(SELECTED_TAB_CLASS), 'First tab had a selected class');


            assert.strictEqual(this.tabPanel.option('selectedIndex'), 0, 'TabPanel selectedIndex should remain 0');
            assert.deepEqual(this.tabPanel.option('selectedItem'), this.items[0], 'TabPanel selectedItem should remain the first item');
            assert.deepEqual(this.tabPanel.option('selectedItems'), [this.items[0]], 'TabPanel selectedItems should remain the first item');
            assert.deepEqual(this.tabPanel.option('selectedItemKeys'), [this.items[0]], 'TabPanel selectedItemKeys should remain the first key');
            assert.ok(this.$tabPanel.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(0).hasClass(SELECTED_ITEM_CLASS), 'First multiView had a selected class');
        };
        this.assertSecondItemSelected = (assert) => {
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 1, 'onSelectionChanged should be called');

            assert.strictEqual(this.tabs.option('selectedIndex'), 1, 'Tabs selectedIndex should be updated to 1');
            assert.deepEqual(this.tabs.option('selectedItem'), this.items[1], 'Tabs selectedItem should be equal to the second item');
            assert.deepEqual(this.tabs.option('selectedItems'), [this.items[1]], 'Tabs selectedItems should contain second item');
            assert.deepEqual(this.tabs.option('selectedItemKeys'), [this.items[1]], 'Tabs selectedItemKeys should contain second item');
            assert.ok(this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1).hasClass(SELECTED_TAB_CLASS), 'Second tab had a selected class');

            assert.strictEqual(this.tabPanel.option('selectedIndex'), 1, 'TabPanel selectedIndex should be updated to 1');
            assert.deepEqual(this.tabPanel.option('selectedItem'), this.items[1], 'TabPanel selectedItem should be equal to the second item');
            assert.deepEqual(this.tabPanel.option('selectedItems'), [this.items[1]], 'TabPanel selectedItems should contain second item');
            assert.deepEqual(this.tabPanel.option('selectedItemKeys'), [this.items[1]], 'TabPanel selectedItemKeys should contain second item');
            assert.ok(this.$tabPanel.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1).hasClass(SELECTED_ITEM_CLASS), 'Second multiView had a selected class');
        };
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    QUnit.test('should be raised only once when tab is focused and clicked', function(assert) {
        const clock = sinon.useFakeTimers();
        this.onSelectionChangingStub = sinon.spy((e) => {
            e.cancel = true;
        });

        this.reinit({
            onSelectionChanging: this.onSelectionChangingStub,
            focusStateEnabled: true
        });

        this.$tabPanel.trigger('focusin');
        const $item = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CLASS}`).eq(1);
        $item.trigger('dxpointerdown');
        $item.trigger('dxclick');
        clock.tick(10);

        assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
        assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged is not called');

        assert.strictEqual(this.tabPanel.option('selectedIndex'), 0, 'tabPanel selected index is not changed');
        clock.restore();
    });

    QUnit.test('should be ignored if previous request is not processed yet', function(assert) {
        const done = assert.async();
        const delay = 300;
        this.onSelectionChangingStub = sinon.spy((e) => {
            e.cancel = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(false);
                }, delay);
            });
        });

        const items = [{ text: '1' }, { text: '2' }, { text: '3' }];
        this.reinit({
            onSelectionChanging: this.onSelectionChangingStub,
            items
        });

        const $items = this.$tabPanel.find(`.${TABS_ITEM_CLASS}`);

        $items.eq(2).trigger('dxclick');
        $items.eq(0).trigger('dxclick');
        $items.eq(1).trigger('dxclick');

        setTimeout(() => {
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 1, 'onSelectionChanged should be called');

            assert.strictEqual(this.tabs.option('selectedIndex'), 2, 'Tabs selectedIndex should be updated to 2');
            assert.deepEqual(this.tabs.option('selectedItem'), items[2], 'Tabs selectedItem should be equal to the third item');
            assert.deepEqual(this.tabs.option('selectedItems'), [items[2]], 'Tabs selectedItems should contain third item');
            assert.deepEqual(this.tabs.option('selectedItemKeys'), [items[2]], 'Tabs selectedItemKeys should contain third item');

            assert.strictEqual(this.tabPanel.option('selectedIndex'), 2, 'TabPanel selectedIndex should be updated to 2');
            assert.deepEqual(this.tabPanel.option('selectedItem'), items[2], 'TabPanel selectedItem should be equal to the third item');
            assert.deepEqual(this.tabPanel.option('selectedItems'), [items[2]], 'TabPanel selectedItems should contain third item');
            assert.deepEqual(this.tabPanel.option('selectedItemKeys'), [items[2]], 'TabPanel selectedItemKeys should contain third item');

            const $multiViewItems = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CLASS}`);
            assert.ok($multiViewItems.eq(2).hasClass(SELECTED_ITEM_CLASS), 'second multiview item is selected');
            assert.notOk($multiViewItems.eq(2).hasClass(MULTIVIEW_HIDDEN_ITEM_CLASS), 'second multiview item is visible');

            done();
        }, delay);
    });

    QUnit.test('tabPanel selectOnFocus should be false to not raise excess selectionChanging', function(assert) {
        assert.strictEqual(this.tabPanel.option('selectOnFocus'), false, 'selectOnFocus = false');
    });


    QUnit.module('after keyboard navigation', () => {
        QUnit.test('should keep new item focused even if selection is cancelled', function(assert) {
            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = true;
            });

            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
                focusStateEnabled: true
            });

            this.tabPanel.focus();

            const keyboard = keyboardMock(this.$tabs);
            keyboard.press('right');

            this.assertSelectionNotChanged(assert);

            const $secondTab = this.$tabs.find(`.${TABS_ITEM_CLASS}`).eq(1);
            assert.ok($secondTab.hasClass(FOCUS_STATE_CLASS), 'focus is moved to the second tab');
        });
    });

    QUnit.module('after multiView swipe', () => {
        QUnit.test('should cancel selection if e.cancel = true', function(assert) {
            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = true;
            });

            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
                swipeEnabled: true
            });

            const pointer = pointerMock(this.$tabPanel);
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            this.assertSelectionNotChanged(assert);

            const $itemContainer = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);
            assert.strictEqual(translator.locate($itemContainer).left, 0, 'container was not swiped');
        });

        QUnit.test('should cancel selection if e.cancel is a promise resolving with true', function(assert) {
            const done = assert.async();

            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    });
                });
            });

            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
                swipeEnabled: true
            });

            const $itemContainer = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);

            const pointer = pointerMock(this.$tabPanel);
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.notEqual(translator.locate($itemContainer).left, 0, 'container scroll is not restored immediately');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSelectionNotChanged(assert);

                    assert.strictEqual(translator.locate($itemContainer).left, 0, 'container scroll is restored');
                    done();
                });
            });
        });

        QUnit.test('should apply selection if e.cancel is a promise resolving with false', function(assert) {
            const done = assert.async();

            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false);
                    });
                });
            });

            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
                swipeEnabled: true
            });

            const $itemContainer = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);

            const pointer = pointerMock(this.$tabPanel);
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.notEqual(translator.locate($itemContainer).left, 0, 'container scroll is not restored immediately');
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSecondItemSelected(assert);

                    assert.strictEqual(translator.locate($itemContainer).left, 0, 'container scroll is restored');
                    done();
                });
            });
        });

        QUnit.test('should apply selection if e.cancel is a promise which rejects', function(assert) {
            const done = assert.async();

            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject();
                    });
                });
            });

            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
                swipeEnabled: true
            });

            const $itemContainer = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);

            const pointer = pointerMock(this.$tabPanel);
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            assert.notEqual(translator.locate($itemContainer).left, 0, 'container scroll is not restored immediately');
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'selectionChanging is called immediately');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'selectionChanged is not called until promise is resolved');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSecondItemSelected(assert);

                    assert.strictEqual(translator.locate($itemContainer).left, 0, 'container scroll is restored');

                    done();
                });
            });
        });

        QUnit.test('should apply the selection if e.cancel is not modified', function(assert) {
            this.reinit({
                swipeEnabled: true
            });

            const pointer = pointerMock(this.$tabPanel);
            pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);

            const $itemContainer = this.$tabPanel.find(`.${MULTIVIEW_ITEM_CONTAINER_CLASS}`);

            this.assertSecondItemSelected(assert);

            assert.strictEqual(translator.locate($itemContainer).left, 0, 'container scroll is restored');
        });
    });

    QUnit.module('should cancel selection', () => {
        QUnit.test('when it sets cancel=true in initial config', function(assert) {
            this.onSelectionChangingStub = sinon.spy(function(e) {
                e.cancel = true;
            });
            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
            });
            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);
            $item.trigger('dxclick');

            this.assertSelectionNotChanged(assert);
        });

        QUnit.test('when it sets cancel=true in runtime', function(assert) {
            this.onSelectionChangingStub = sinon.spy(function(e) {
                e.cancel = true;
            });
            this.tabPanel.option({
                onSelectionChanging: this.onSelectionChangingStub,
            });

            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);
            $item.trigger('dxclick');

            this.assertSelectionNotChanged(assert);
        });

        QUnit.test('when it sets cancel to promise in initial config and resolves it with true', function(assert) {
            const done = assert.async();
            this.onSelectionChangingStub = sinon.spy(function(e) {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    });
                });
            });
            this.reinit({
                onSelectionChanging: this.onSelectionChangingStub,
            });
            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);
            $item.trigger('dxclick');

            assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'selectedIndex is not changed until promise is resolved');
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called immediatelly');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called until promise is resolved');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSelectionNotChanged(assert);
                    done();
                });
            });
        });
    });

    QUnit.module('should apply new selection', () => {
        QUnit.test('when e.cancel is not modified', function(assert) {
            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);
            $item.trigger('dxclick');

            assert.strictEqual(this.onSelectionChangingStub.getCall(0).args[0].cancel, false, 'e.cancel should be set to false');

            this.assertSecondItemSelected(assert);
        });

        QUnit.test('when it sets e.cancel to a promise resolved with false', function(assert) {
            const done = assert.async();

            this.onSelectionChangingStub = sinon.spy(function(e) {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false);
                    });
                });
            });

            this.tabPanel.option('onSelectionChanging', this.onSelectionChangingStub);

            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);

            $item.trigger('dxclick');
            assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'selectedIndex is not changed until promise is resolved');
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called immediatelly');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called until promise is resolved');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSecondItemSelected(assert);
                    done();
                });
            });
        });

        QUnit.test('when it sets e.cancel to a rejected promise', function(assert) {
            const done = assert.async();

            this.onSelectionChangingStub = sinon.spy((e) => {
                e.cancel = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject('Cancellation error');
                    });
                }, 0);
            });

            this.tabPanel.option('onSelectionChanging', this.onSelectionChangingStub);

            const $item = this.$tabPanel.find(`.${TABPANEL_TABS_ITEM_CLASS}`).eq(1);
            $item.trigger('dxclick');

            assert.strictEqual(this.tabs.option('selectedIndex'), 0, 'selectedIndex is not changed until promise is resolved');
            assert.strictEqual(this.onSelectionChangingStub.callCount, 1, 'onSelectionChanging should be called after click');
            assert.strictEqual(this.onSelectionChangedStub.callCount, 0, 'onSelectionChanged should not be called before promise resolves');

            setTimeout(() => {
                setTimeout(() => {
                    this.assertSecondItemSelected(assert);
                    done();
                });
            });
        });
    });
});

QUnit.module('action handlers', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();

        fx.off = true;

        this.$tabPanel = $('#tabPanel').dxTabPanel({
            dataSource: [{ text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
                { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' }],

            onItemClick(e) {
                QUnit.assert.ok(true, 'option \'onItemClick\' successfully passed to nested multiview widget and raised on click');
            },

            onTitleClick(e) {
                QUnit.assert.ok(true, 'option \'onTitleClick\' successfully passed to nested tabs widget and raised on click');
            },

            onItemHold(e) {
                QUnit.assert.ok(true, 'option \'onItemHold\' successfully passed to nested multiview widget and raised on hold');
            },

            onTitleHold(titleElement, titleData) {
                QUnit.assert.ok(true, 'option \'onTitleHold\' successfully passed to nested tabs widget and raised on hold');
            },

            onSelectionChanged(e) {
                QUnit.assert.ok(true, 'option \'onSelectionChanged\' successfully passed to nested multiview and tabs widgets and raised on select');
            },

            swipeEnabled: true
        });

        this.tabPanelInstance = this.$tabPanel.dxTabPanel('instance');
        this.tabWidgetInstance = this.$tabPanel.find(toSelector(TABS_CLASS)).dxTabs('instance');

        this.multiViewMouse = pointerMock(this.$tabPanel.find(toSelector(MULTIVIEW_ITEM_CLASS))[0]).start();
        this.tabWidgetMouse = pointerMock(this.$tabPanel.find(toSelector(TABS_ITEM_CLASS))[0]).start();
    },
    afterEach() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('\'onItemClick\' and \'onTitleClick\' options test', function(assert) {
        assert.expect(4);

        this.multiViewMouse.click();
        this.tabWidgetMouse.click();

        this.tabPanelInstance.option('onItemClick', e => {
            assert.ok(true, 'option \'onItemClick\' of nested multiview widget successfully changed and raised on click');
        });
        this.tabPanelInstance.option('onTitleClick', e => {
            assert.ok(true, 'option \'onTitleClick\' of nested tabs widget successfully changed and raised on click');
        });

        this.multiViewMouse.click();
        this.tabWidgetMouse.click();
    });

    QUnit.test('\'onItemHold\' and \'onTitleHold\' options test', function(assert) {
        assert.expect(4);

        this.multiViewMouse.down();
        this.clock.tick(1000);
        this.multiViewMouse.up();

        this.tabWidgetMouse.down();
        this.clock.tick(1000);
        this.tabWidgetMouse.up();

        this.tabPanelInstance.option('onItemHold', e => {
            assert.ok(true, 'option \'onItemHold\' of nested multiview widget successfully changed and raised on hold');
        });
        this.tabPanelInstance.option('onTitleHold', e => {
            assert.ok(true, 'option \'onTitleHold\' of nested tabs widget successfully changed and raised on hold');
        });

        this.multiViewMouse.down();
        this.clock.tick(1000);
        this.multiViewMouse.up();

        this.tabWidgetMouse.down();
        this.clock.tick(1000);
        this.tabWidgetMouse.up();
    });

    QUnit.test('click on tab should be handled correctly when the \'deferRendering\' option is true', function(assert) {
        const items = [
            { text: 'Greg', title: 'Name' },
            { text: '31', title: 'Age' },
            { text: 'Charlotte', title: 'City' },
            { text: 'programmer', title: 'Job' }
        ];

        const $element = $('<div>').appendTo('body');

        $element.dxTabPanel({
            items,
            deferRendering: true,
            selectedIndex: 0
        });

        try {
            assert.equal($element.find(toSelector(MULTIVIEW_ITEM_CLASS + '-content')).length, 1, 'only one multiView item is rendered on init');

            const index = 2;
            const pointer = pointerMock($element.find(toSelector(TABS_ITEM_CLASS)).eq(index));

            pointer.start().click();

            assert.equal($element.find(toSelector(MULTIVIEW_ITEM_CLASS + '-content')).length, 2, 'one multiView item is rendered after click on tab');
            assert.equal($element.find(toSelector(SELECTED_ITEM_CLASS)).text(), items[index].text, 'selected multiView item has correct data');
        } finally {
            $element.remove();
        }
    });
});

QUnit.module('events handlers', {
    beforeEach() {
        const that = this;
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        that.createTabPanel = (assert, spies) => {
            spies = spies || {};

            that.titleClickSpy = sinon.spy(() => {
                assert.step('titleClick');
            });
            that.titleHoldSpy = sinon.spy(() => {
                assert.step('titleHold');
            });
            that.titleRenderedSpy = sinon.spy(() => {
                assert.step('titleRendered');
            });

            that.$tabPanel = $('#tabPanel').dxTabPanel({
                dataSource: [{ text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
                    { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' }],
                onInitialized(e) {
                    spies.titleClick && e.component.on('titleClick', that.titleClickSpy);
                    spies.titleHold && e.component.on('titleHold', that.titleHoldSpy);
                    spies.titleRendered && e.component.on('titleRendered', that.titleRenderedSpy);
                },
                swipeEnabled: true
            });

            that.tabPanelInstance = that.$tabPanel.dxTabPanel('instance');

            that.tabWidgetMouse = pointerMock(that.$tabPanel.find(toSelector(TABS_ITEM_CLASS))[0]).start();
        };
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('\'titleRendered\' event successfully raised', function(assert) {
        this.createTabPanel(assert, { titleRendered: true });

        assert.verifySteps(['titleRendered', 'titleRendered']);
    });

    QUnit.test('\'titleClick\' event successfully raised', function(assert) {
        this.createTabPanel(assert, { titleClick: true });

        this.tabWidgetMouse.click();
        assert.verifySteps(['titleClick']);
    });

    QUnit.test('\'titleHold\' event successfully raised', function(assert) {
        this.createTabPanel(assert, { titleHold: true });

        this.tabWidgetMouse.down();
        this.clock.tick(1000);
        this.tabWidgetMouse.up();
        assert.verifySteps(['titleHold']);
    });

    QUnit.test('runtime subscription to \'titleClick\' event works fine', function(assert) {
        this.createTabPanel(assert);

        this.tabPanelInstance.on('titleClick', this.titleClickSpy);

        this.tabWidgetMouse.click();
        assert.verifySteps(['titleClick']);
    });

    QUnit.test('runtime subscription to \'titleHold\' event works fine', function(assert) {
        this.createTabPanel(assert);

        this.tabPanelInstance.on('titleHold', this.titleHoldSpy);

        this.tabWidgetMouse.down();
        this.clock.tick(1000);
        this.tabWidgetMouse.up();
        assert.verifySteps(['titleHold']);
    });
});

QUnit.module('focus policy', {
    beforeEach() {
        fx.off = true;
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    QUnit.test('focusing empty tab should not cause infinite loop', function(assert) {
        assert.expect(0);

        const tabPanel = new TabPanel($('<div>').appendTo('#qunit-fixture'), {
            items: []
        });
        tabPanel.focus();
    });

    QUnit.test('click on dxTabPanel should not scroll page to the tabs', function(assert) {
        const $tabPanel = $('<div>').appendTo('#qunit-fixture');

        const tabPanel = new TabPanel($tabPanel, {
            items: [{ title: 'item 1' }]
        });

        const tabNativeFocus = sinon.spy(tabPanel._tabs, 'focus');

        $tabPanel.trigger('focusin');
        assert.equal(tabNativeFocus.callCount, 0, 'native focus should not be triggered');
    });

    function checkSelectionAndFocus(tabPanel, expectedSelectedIndex) {
        const $tabPanel = tabPanel.$element();
        const expectedSelectedItem = tabPanel.option('items')[expectedSelectedIndex];

        QUnit.assert.equal(tabPanel.option('selectedItem'), expectedSelectedItem, 'tabPanel.option(selectedItem)');
        QUnit.assert.equal($tabPanel.find(`.${MULTIVIEW_ITEM_CLASS}.${SELECTED_ITEM_CLASS}`).get(0).innerText, 'content ' + expectedSelectedIndex, 'tabPanel.SELECTED_ITEM_CLASS');

        QUnit.assert.equal(tabPanel._tabs.option('selectedItem'), expectedSelectedItem, 'tabPanel._tabs.option(selectedItem)');
        QUnit.assert.equal($tabPanel.find(`.${TABS_ITEM_CLASS}.${SELECTED_TAB_CLASS}`).get(0).innerText, 'tab ' + expectedSelectedIndex, 'tabPanel._tabs.SELECTED_TAB_CLASS');

        if(tabPanel.option('focusStateEnabled') === true) {
            QUnit.assert.equal($(tabPanel.option('focusedElement')).text(), 'content ' + expectedSelectedIndex, 'tabPanel.options(focusedElement)');
            QUnit.assert.equal($(tabPanel._tabs.option('focusedElement')).text(), 'tab ' + expectedSelectedIndex, 'tabPanel._tabs.focusedElement');
        } else {
            QUnit.assert.equal(tabPanel.option('focusedElement'), null, 'tabPanel.option(focusedElement)');
            QUnit.assert.equal(tabPanel._tabs.option('focusedElement'), null, 'tabPanel._tabs.options(focusedElement)');
        }
    }

    [0, 1].forEach(selectedIndex => {
        ['selectedIndex', 'selectedItem'].forEach(optionName => {
            QUnit.test(`focus -> setSelectedTab(${selectedIndex}) -> focus`, function(assert) {
                const $tabPanel = $('#tabPanel').dxTabPanel({
                    items: [{ tabTemplate: 'tab 0', template: 'content 0' }, { tabTemplate: 'tab 1', template: 'content 1' }]
                });
                const tabPanel = $tabPanel.dxTabPanel('instance');

                $tabPanel.focusin();
                if(optionName === 'selectedIndex') {
                    tabPanel.option('selectedIndex', selectedIndex);
                } else {
                    tabPanel.option('selectedItem', tabPanel.option('items')[selectedIndex]);
                }
                $tabPanel.focusin();

                checkSelectionAndFocus(tabPanel, selectedIndex);
            });
        });
    });

    QUnit.test('Focus class should not be added on wrapper after change showNavButtons option in runtime', function(assert) {
        const $tabPanel = $('#tabPanel').dxTabPanel({
            items: ['item 1'],
            showNavButtons: false,
        });
        const tabPanel = $tabPanel.dxTabPanel('instance');

        $tabPanel.focusin();
        $tabPanel.focusout();

        tabPanel.option({ showNavButtons: true });

        assert.strictEqual($tabPanel.find(`.${MULTIVIEW_WRAPPER_CLASS}`).hasClass(FOCUS_STATE_CLASS), false);
    });
});

QUnit.module('keyboard navigation', {
    beforeEach() {
        const items = [
            { text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
            { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' },
        ];

        fx.off = true;
        this.$element = $('#tabPanel').dxTabPanel({
            focusStateEnabled: true,
            items
        });
        this.instance = this.$element.dxTabPanel('instance');
        this.$tabs = this.$element.find(toSelector(TABS_CLASS));
        this.tabs = this.$tabs.dxTabs('instance');
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('focusStateEnabled option', function(assert) {
        assert.expect(2);

        this.instance.option('focusStateEnabled', false);
        assert.ok(!this.tabs.option('focusStateEnabled'));

        this.instance.option('focusStateEnabled', true);
        assert.ok(this.tabs.option('focusStateEnabled'));
    });

    QUnit.test('tabs focusedElement dependence on tabPanels focusedElement', function(assert) {
        assert.expect(4);

        this.instance.focus();
        $(toSelector(MULTIVIEW_ITEM_CLASS)).eq(1).trigger('dxpointerdown');
        this.clock.tick(10);

        const multiViewFocusedIndex = $(this.instance.option('focusedElement')).index();

        assert.strictEqual(isRenderer(this.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.strictEqual(isRenderer(this.tabs.option('focusedElement')), false, 'focusedElement is correct');
        assert.strictEqual(multiViewFocusedIndex, 1, 'second multiView element has been focused');
        assert.strictEqual(multiViewFocusedIndex, $(this.tabs.option('focusedElement')).index(), 'tabs focused element is equal multiView focused element');
    });

    QUnit.test('click on available tab removed specific tab classes if previous item is disabled', function(assert) {
        this.instance.option('items', [ 0, { disabled: true }, 2 ]);
        this.instance.focus();

        const keyboard = keyboardMock(this.$tabs);
        keyboard.press('right');

        const $thirdTab = this.$tabs.find(toSelector(TABPANEL_TABS_ITEM_CLASS)).get(2);
        pointerMock($thirdTab).start().click();

        this.clock.tick(10);

        assert.strictEqual($($thirdTab).hasClass(FOCUS_STATE_CLASS), true);
        assert.strictEqual($($thirdTab).hasClass(SELECTED_TAB_CLASS), true);

        const $firstTab = this.$tabs.find(toSelector(TABPANEL_TABS_ITEM_CLASS)).get(0);
        assert.strictEqual($($firstTab).hasClass(FOCUSED_DISABLED_NEXT_TAB_CLASS), false);

        keyboard.press('left');
        pointerMock($firstTab).start().click();
        this.clock.tick(10);

        assert.strictEqual($($thirdTab).hasClass(FOCUSED_DISABLED_PREV_TAB_CLASS), false);
    });

    QUnit.test('tabPanels focusedElement dependence on tabs focusedElement', function(assert) {
        assert.expect(3);

        this.instance.focus();
        $(toSelector(TABS_ITEM_CLASS)).eq(1).trigger('dxpointerup');
        this.clock.tick(10);

        const tabsFocusedIndex = $(this.instance.option('focusedElement')).index();
        assert.equal(isRenderer(this.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.equal(tabsFocusedIndex, 1, 'second tabs element has been focused');
        assert.equal(tabsFocusedIndex, $(this.instance.option('focusedElement')).index(), 'multiView focused element is equal tabs focused element');
    });

    QUnit.test('looping should work on keyboard navigation after loop runtime change to true and swipe', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'no kbn on mobile devices');
            return;
        }

        this.instance.option({
            items: [1, 2, 3],
            loop: false,
            swipeEnabled: true,
        });
        this.instance.option('loop', true);
        const pointer = pointerMock(this.$element);
        const keyDownEvent = $.Event('keydown', { key: 'ArrowRight' });

        pointer.start().swipeStart().swipe(-0.5).swipeEnd(-1);
        this.$element.trigger(keyDownEvent).trigger(keyDownEvent);

        assert.strictEqual(this.instance.option('selectedIndex'), 0, 'loop comes back to first element');
    });

    if(devices.current().deviceType === 'desktop') {
        const createWidget = ($element) => {
            const widget = $element.dxTabPanel({
                focusStateEnabled: true,
                items: [{ text: 'text' }]
            }).dxTabPanel('instance');

            $element.attr('tabIndex', 1);

            return widget;
        };

        registerKeyHandlerTestHelper.runTests({ createWidget: createWidget, checkInitialize: false });
        registerKeyHandlerTestHelper.runTests({ createWidget: createWidget, keyPressTargetElement: (widget) => widget._tabs.$element().eq(0), checkInitialize: false, testNamePrefix: 'Tabs: ' });
    }
});

QUnit.module('Disabled items', {
    beforeEach() {
        const items = [
            { text: 'user', title: 'Personal Data' },
            { text: 'comment', title: 'Contacts' },
        ];

        fx.off = true;

        this.$element = $('#tabPanel').dxTabPanel({
            focusStateEnabled: true,
            items
        });

        this.instance = this.$element.dxTabPanel('instance');
        this.$tabs = this.$element.find(toSelector(TABS_CLASS));

        this.instance.option('items[1].disabled', true);
        this.instance.focus();
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    QUnit.test('disabled item can be focused by keyboard', function(assert) {
        const $disabledItem = $(toSelector(TABS_ITEM_CLASS)).eq(1);
        const keyboard = keyboardMock(this.$tabs);

        keyboard.press('right');

        assert.strictEqual($disabledItem.hasClass('dx-state-focused'), true, 'disabled item is focused');
        assert.strictEqual($disabledItem.attr('aria-disabled'), 'true', 'disabled item aria-disabled is correct');
    });

    QUnit.test('multiview wrapper should have focused class if item is available', function(assert) {
        const multiViewWrapper = this.$element.find(toSelector(MULTIVIEW_WRAPPER_CLASS));
        const keyboard = keyboardMock(this.$tabs);

        assert.strictEqual($(multiViewWrapper).hasClass('dx-state-focused'), true, 'focused class set');

        keyboard.press('right');
        assert.strictEqual($(multiViewWrapper).hasClass('dx-state-focused'), false, 'focused class not set');
    });

    QUnit.test(`element has ${DISABLED_FOCUSED_TAB_CLASS} class when disabled item has focus`, function(assert) {
        const keyboard = keyboardMock(this.$tabs);

        assert.strictEqual($(this.$element).hasClass(DISABLED_FOCUSED_TAB_CLASS), false, 'class not set');

        keyboard.press('right');
        assert.strictEqual($(this.$element).hasClass(DISABLED_FOCUSED_TAB_CLASS), true, 'class set');
    });

    QUnit.test(`element does not have ${DISABLED_FOCUSED_TAB_CLASS} class when widget lost focus`, function(assert) {
        const keyboard = keyboardMock(this.$tabs);

        keyboard.press('right');
        assert.strictEqual($(this.$element).hasClass(DISABLED_FOCUSED_TAB_CLASS), true, 'class set');

        this.$element.focusout();
        assert.strictEqual($(this.$element).hasClass(DISABLED_FOCUSED_TAB_CLASS), false, 'class not set');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('active tab should have aria-controls attribute pointing to active multiview item', function(assert) {
        const $element = $('#tabPanel').dxTabPanel({
            focusStateEnabled: true,
            items: [1, 2],
            selectedIndex: 0
        });

        const tabs = $element.find('.dx-tab');
        const views = $element.find('.dx-multiview-item');
        const keyboard = new keyboardMock($element.find('.dx-tabs'));

        $element.find('.dx-tabs').focusin();

        assert.notEqual($(tabs[0]).attr('aria-controls'), undefined, 'aria-controls exists');
        assert.equal($(tabs[0]).attr('aria-controls'), $(views[0]).attr('id'), 'aria-controls equals 1st item\'s id');

        keyboard.keyDown('right');

        assert.notEqual($(tabs[1]).attr('aria-controls'), undefined, 'aria-controls exists');
        assert.equal($(tabs[1]).attr('aria-controls'), $(views[1]).attr('id'), 'aria-controls equals 2nd item\'s id');
    });
});

QUnit.module('dataSource integration', () => {
    QUnit.test('dataSource loading should be fired once', function(assert) {
        const deferred = $.Deferred();
        let dataSourceLoadCalled = 0;

        $('#tabPanel').dxTabPanel({
            dataSource: {
                load() {
                    dataSourceLoadCalled++;

                    return deferred.promise();
                }
            }
        });

        assert.equal(dataSourceLoadCalled, 1, 'dataSource load called once');
    });
});

QUnit.module('Tabs Indicator position', () => {
    ['top', 'right', 'bottom', 'left'].forEach(tabsPosition => {
        QUnit.test(`The tabs element must have the correct indicator position class when tabsPosition=${tabsPosition}`, function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({ items: [1, 2, 3], tabsPosition });
            const $tabs = $tabPanel.find(toSelector(TABS_CLASS));

            assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION[tabsPosition]));
        });
    });

    QUnit.test('The tabs element must have the correct indicator position class when tabsPosition was changed', function(assert) {
        const $tabPanel = $('#tabPanel').dxTabPanel({ items: [1, 2, 3] });
        const tabPanel = $tabPanel.dxTabPanel('instance');
        const $tabs = $tabPanel.find(toSelector(TABS_CLASS));

        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['top']));

        tabPanel.option({ tabsPosition: 'left' });

        assert.notOk($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['top']));
        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['left']));

        tabPanel.option({ tabsPosition: 'bottom' });

        assert.notOk($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['left']));
        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['bottom']));

        tabPanel.option({ tabsPosition: 'right' });

        assert.notOk($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['bottom']));
        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['right']));

        tabPanel.option({ tabsPosition: 'top' });

        assert.notOk($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['right']));
        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS_BY_TABS_POSITION['top']));
    });

    QUnit.test('The tabs element must have the correct indicator position class when _tabsIndicatorPosition was changed', function(assert) {
        const $tabPanel = $('#tabPanel').dxTabPanel({ items: [1, 2, 3] });
        const tabPanel = $tabPanel.dxTabPanel('instance');
        const $tabs = $tabPanel.find(toSelector(TABS_CLASS));

        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS.bottom));

        tabPanel.option({ _tabsIndicatorPosition: 'left' });

        assert.notOk($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS.bottom));
        assert.ok($tabs.hasClass(TABS_INDICATOR_POSITION_CLASS.left));
    });
});

QUnit.module('selectedIndex vs items.visible', () => {
    QUnit.module('on init', () => {
        QUnit.test('selectedIndex should be updated to the next visible item if initially selected item is hidden', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1
            });
            const instance = $tabPanel.dxTabPanel('instance');

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be updated to the next visible item to the left if initially selected item is hidden and RTL is enabled', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1,
                rtlEnabled: true
            });
            const instance = $tabPanel.dxTabPanel('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be zero when all items are not visible', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: false },
                ],
                selectedIndex: 1
            });
            const instance = $tabPanel.dxTabPanel('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('next visible item should be selected if currently selected item is hidden and loop=true', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: false },
                ],
                selectedIndex: 2,
                loop: true
            });
            const instance = $tabPanel.dxTabPanel('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('first visible item should be selected if current selected item is hidden and it is in the end and loop = true', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: false },
                ],
                selectedIndex: 2,
                loop: true
            });
            const instance = $tabPanel.dxTabPanel('instance');

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });
    });

    QUnit.module('on runtime', () => {
        QUnit.test('selectedIndex should be updated to the next visible item if it is changed to a hidden item', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ]
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('selectedIndex', 1);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('selectedIndex should be set to zero if all items became hidden', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: false },
                ]
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding selected item selectedIndex should be set to next visible item', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 1
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[1].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding non-selected item before selectedIndex, selectedIndex should not change', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[1].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding selected item positioned in the end, next visible item to the left is selected', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[2].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when showing previously invisible item before selectedIndex, selectedIndex should not change', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[1].visible', true);

            assert.strictEqual(instance.option('selectedIndex'), 2, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when showing previously invisible item after selectedIndex, selectedIndex should not change', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 0
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[1].visible', true);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('when hiding last visible item selectedIndex should return to 0 index', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: false },
                    { text: '2', visible: false },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items[2].visible', false);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is updated on proper index');
        });

        QUnit.test('after removing selected item selectedIndex should be restored to 0', function(assert) {
            const $tabPanel = $('#tabPanel').dxTabPanel({
                items: [
                    { text: '1', visible: true },
                    { text: '2', visible: true },
                    { text: '3', visible: true },
                ],
                selectedIndex: 2
            });
            const instance = $tabPanel.dxTabPanel('instance');
            instance.option('items', [
                { text: '1', visible: true },
                { text: '2', visible: true },
            ]);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not changed');
        });
    });
});
