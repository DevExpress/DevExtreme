import $ from 'jquery';
import TabPanel from 'ui/tab_panel';
import themes from 'ui/themes';
import { TABPANEL_CLASS } from '__internal/ui/tab_panel/tab_panel';
import {
    TABS_CLASS,
    TABS_ITEM_CLASS,
    TABS_ITEM_TEXT_SPAN_CLASS,
    TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS,
} from '__internal/ui/tabs/tabs';

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

const MULTIVIEW_CLASS = 'dx-multiview';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MUTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';

const nestedElementsCount = function($element, cssClass) {
    return $element.find(`.${cssClass}`).length;
};

QUnit.module('TabPanel markup', {
    beforeEach: function() {
        this.init = (options) => {
            this.$element = $('#tabPanel').dxTabPanel(options);
        };
    },
}, () => {
    QUnit.test('tabPanel should have correct class', function(assert) {
        this.init();
        assert.ok(this.$element.hasClass(TABPANEL_CLASS), 'widget class added');
    });

    [[{ title: '1' }], [1]].forEach(items => {
        QUnit.test(`TabPanel tab item should have a correct span element when items is ${items}`, function(assert) {
            const $tabPanel = $('<div>').appendTo('#qunit-fixture').dxTabPanel({ items });
            const $tabsTextSpan = $tabPanel.find(`.${TABS_ITEM_TEXT_SPAN_CLASS}`);

            assert.strictEqual($tabsTextSpan.length, 1, 'span element added');
        });

        QUnit.test(`TabPanel tab item should have a correct span element in Fluent when items is ${items}`, function(assert) {
            const origIsFluent = themes.isFluent;
            themes.isFluent = function() { return true; };

            try {
                const $tabPanel = $('<div>').appendTo('#qunit-fixture').dxTabPanel({ items });
                const $tabsTextSpanPseudo = $tabPanel.find(`.${TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS}`);

                assert.strictEqual($tabsTextSpanPseudo.length, 1, 'span element added');
            } finally {
                themes.isFluent = origIsFluent;
            }
        });
    });

    QUnit.test('rendering tabs widget test', function(assert) {
        this.init();
        assert.ok(this.$element.find(`.${TABS_CLASS}`), 'tabs widget added');
    });

    QUnit.test('rendering multiview widget test', function(assert) {
        this.init();
        assert.ok(this.$element.hasClass(MULTIVIEW_CLASS), 'multiview widget added');
    });

    QUnit.test('count of nested widget elements test', function(assert) {
        const items = [{ text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
            { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' }];

        this.init({ dataSource: items });

        const tabsCount = nestedElementsCount(this.$element.find(`.${TABS_CLASS}`), TABS_ITEM_CLASS);
        const multiViewItemsCount = nestedElementsCount(this.$element.find('.' + MUTIVIEW_WRAPPER_CLASS), MULTIVIEW_ITEM_CLASS);

        assert.equal(tabsCount, multiViewItemsCount, 'tab widget items count and multiview widget items count is equal');
    });
});

QUnit.module('TabPanel items', () => {
    QUnit.test('items option test - changing a single item at runtime', function(assert) {
        const items = [
            { text: 'Greg', title: 'Name' }
        ];

        const $tabPanel = $('<div>').appendTo('#qunit-fixture');

        const tabPanel = $tabPanel.dxTabPanel({
            items: items
        }).dxTabPanel('instance');

        tabPanel.option('items[0].title', 'test');

        assert.strictEqual($tabPanel.find(`.${TABS_ITEM_CLASS}`).eq(0).text(),
            'testtest', 'option <items> of nested tabs widget successfully changed - tabs were rerendered');
    });

    QUnit.test('itemTitleTemplate rendering test', function(assert) {
        assert.expect(2);

        const items = [{ text: 'user', icon: 'user', title: 'Personal Data', firstName: 'John', lastName: 'Smith' },
            { text: 'comment', icon: 'comment', title: 'Contacts', phone: '(555)555-5555', email: 'John.Smith@example.com' }];

        const $tabPanel = $('#tabPanel').dxTabPanel({
            items: items,
            itemTitleTemplate: $('<span>Template</span>')
        });
        const tabPanelInstance = $tabPanel.dxTabPanel('instance');
        const tabWidgetInstance = $tabPanel.find(`.${TABS_CLASS}`).dxTabs('instance');

        assert.deepEqual(tabWidgetInstance.itemElements().eq(0).text(),
            'Template',
            'option <itemTitleTemplate> successfully passed to nested tabs widget');

        tabPanelInstance.option('itemTitleTemplate', $('<span>Changed template</span>'));

        assert.deepEqual(tabWidgetInstance.itemElements().eq(0).text(),
            'Changed template',
            'option <itemTitleTemplate> of nested tabs widget successfully changed');
    });

    QUnit.test('disabled item should be rendered correctly', function(assert) {
        const items = [
            { text: 'Greg', title: 'Name' },
            { text: 'Albert', title: 'Name' }
        ];

        const tabPanel = $('#tabPanel').dxTabPanel({
            items: items,
            itemTitleTemplate: $('<span>Template</span>')
        }).dxTabPanel('instance');

        tabPanel.option('items[1].disabled', true);

        const $disabledItem = tabPanel.itemElements().eq(1);
        const $tabs = tabPanel.$element().find('.' + TABS_ITEM_CLASS);

        assert.ok($disabledItem.hasClass('dx-state-disabled'), 'Item is disabled');
        assert.notEqual($tabs.length, 0, 'Tabs are rendered');
    });

    [
        { title: 'text', expected: 'texttext' },
        { title: 'text<i>text</i>', expected: 'text<i>text</i>text<i>text</i>' },
        { title: null, expected: '' },
        { title: undefined, expected: '' },
        { title: '', expected: '' },
        { title: 0, expected: '00' },
        { title: 1, expected: '11' },
        { title: new Date(2019, 10, 13), expected: `${new Date(2019, 10, 13)}${new Date(2019, 10, 13)}` },
        { title: { value: 'title' }, expected: '' }
    ].forEach((value) => {
        QUnit.test(`DefaultTemplate: title template property - ${value.title}`, function(assert) {
            const $element = $('<div>').appendTo('#qunit-fixture');

            new TabPanel($element, { items: [ { title: value.title }] });

            const $itemElements = $element.find(`.${TABS_CLASS}`).dxTabs('instance').itemElements();

            assert.strictEqual($itemElements.eq(0).text(), value.expected, 'item.title');
        });

        QUnit.test(`DefaultTemplate: items["${value.title}"] as primitive`, function(assert) {
            const $element = $('<div>').appendTo('#qunit-fixture');

            new TabPanel($element, { items: [ value.title ] });

            const $itemElements = $element.find(`.${TABS_CLASS}`).dxTabs('instance').itemElements();

            assert.strictEqual($itemElements.eq(0).text(), value.expected, 'item.title');
        });
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', function(assert) {
        const $element = $('#tabPanel').dxTabPanel();
        assert.equal($element.attr('role'), 'tabpanel');
    });

    QUnit.test('tabpanel should NOT have aria-activedescendant', function(assert) {
        const $element = $('#tabPanel').dxTabPanel({ items: [1, 2] });
        const instance = $element.dxTabPanel('instance');

        assert.equal($element.attr('aria-activedescendant'), undefined, 'aria-activedescendant does not exist');

        instance.option('focusedElement', $element.find('.dx-item:eq(1)'));
        assert.equal($element.attr('aria-activedescendant'), undefined, 'aria-activedescendant does not exist after selection update');
    });

    QUnit.module('aria-label of tabs', {
        beforeEach: function() {
            this.createTabPanel = (options) => {
                this.$element = $('<div>').appendTo('#qunit-fixture').dxTabPanel(options);
                this.instance = this.$element.dxTabPanel('instance');
            };
            this.getTab = (index) => this.$element.find(`.${TABS_ITEM_CLASS}`).eq(index);
        }
    }, () => {
        QUnit.test('tab with title and icon should not get aria-label', function(assert) {
            this.createTabPanel({ items: [{ title: 'User', icon: 'user' }] });

            assert.strictEqual(this.getTab(0).attr('aria-label'), undefined);
        });

        QUnit.test('string item should not get aria-label', function(assert) {
            this.createTabPanel({ items: ['User'] });

            assert.strictEqual(this.getTab(0).attr('aria-label'), undefined);
        });

        QUnit.test('tab of the item without title and icon should not get aria-label', function(assert) {
            this.createTabPanel({ items: [{ text: 'User content' }] });

            assert.strictEqual(this.getTab(0).attr('aria-label'), undefined);
        });

        [
            { icon: 'user', expected: 'user', description: 'a dxIcon without a localized message' },
            { icon: 'close', expected: 'Close', description: 'a dxIcon with a localized message' },
            { icon: '/path/file.png', expected: 'file', description: 'a path to an image' },
        ].forEach(({ icon, expected, description }) => {
            QUnit.test(`icon-only tab should get aria-label "${expected}" for ${description}`, function(assert) {
                this.createTabPanel({ items: [{ icon }] });

                assert.strictEqual(this.getTab(0).attr('aria-label'), expected);
            });
        });

        QUnit.test('icon-only tab should get aria-label even if the item has content text or html', function(assert) {
            this.createTabPanel({
                items: [
                    { icon: 'user', text: 'User content' },
                    { icon: 'find', html: '<b>Find content</b>' },
                ],
            });

            assert.strictEqual(this.getTab(0).attr('aria-label'), 'user', 'item with text');
            assert.strictEqual(this.getTab(1).attr('aria-label'), 'find', 'item with html');
        });

        QUnit.test('icon-only tab with badge should get aria-label derived from icon', function(assert) {
            this.createTabPanel({ items: [{ icon: 'user', badge: '5' }] });

            assert.strictEqual(this.getTab(0).attr('aria-label'), 'user');
        });

        QUnit.test('aria-label should be derived from item data when a custom itemTitleTemplate is used', function(assert) {
            this.createTabPanel({
                items: [{ icon: 'user' }, { icon: 'user', title: 'User' }],
                itemTitleTemplate: (data) => `<i class="dx-icon dx-icon-${data.icon}"></i>`,
            });

            assert.strictEqual(this.getTab(0).attr('aria-label'), 'user', 'icon-only item');
            assert.strictEqual(this.getTab(1).attr('aria-label'), undefined, 'item with title');
        });

        [true, false].forEach((repaintChangesOnly) => {
            QUnit.test(`aria-label should follow item title and icon changes, repaintChangesOnly: ${repaintChangesOnly}`, function(assert) {
                this.createTabPanel({ items: [{ title: 'User', icon: 'user' }], repaintChangesOnly });

                this.instance.option('items[0].title', '');
                assert.strictEqual(this.getTab(0).attr('aria-label'), 'user', 'label appears when title is cleared');

                this.instance.option('items[0].icon', 'close');
                assert.strictEqual(this.getTab(0).attr('aria-label'), 'Close', 'label follows the icon');

                this.instance.option('items[0].title', 'Close');
                assert.strictEqual(this.getTab(0).attr('aria-label'), undefined, 'label is removed when title is set');
            });

            QUnit.test(`aria-label should be recalculated when items are replaced, repaintChangesOnly: ${repaintChangesOnly}`, function(assert) {
                this.createTabPanel({ items: [{ icon: 'user' }], repaintChangesOnly });

                this.instance.option('items', [{ title: 'User', icon: 'user' }, { icon: 'find' }]);

                assert.strictEqual(this.getTab(0).attr('aria-label'), undefined, 'title and icon item');
                assert.strictEqual(this.getTab(1).attr('aria-label'), 'find', 'icon-only item');
            });
        });
    });
});
