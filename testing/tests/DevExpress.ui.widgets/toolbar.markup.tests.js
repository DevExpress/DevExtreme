import 'ui/action_sheet';
import 'ui/button';
import 'ui/tabs';
import 'ui/drop_down_menu';
import $ from 'jquery';
import Toolbar from 'ui/toolbar';
import themes from 'ui/themes';

import 'common.css!';

QUnit.testStart(() => {
    const markup = '<div id=\'toolbar\'></div>';

    $('#qunit-fixture').html(markup);
});

const { test } = QUnit;

const TOOLBAR_CLASS = 'dx-toolbar';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_BEFORE_CONTAINER_CLASS = 'dx-toolbar-before';
const TOOLBAR_AFTER_CONTAINER_CLASS = 'dx-toolbar-after';
const TOOLBAR_CENTER_CONTAINER_CLASS = 'dx-toolbar-center';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_MENU_BUTTON_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_GROUP_CLASS = 'dx-toolbar-group';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';

const prepareItemTest = function(itemData) {
    const toolbar = new Toolbar($('<div>'), {
        items: [itemData]
    });

    return toolbar.itemElements().eq(0).find('.dx-item-content').contents();
};

QUnit.module('render', {
    beforeEach: () => {
        this.element = $('#toolbar');
    }
}, () => {
    test('containers', (assert) => {
        this.element.dxToolbar({});

        const beforeContainer = this.element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS);
        assert.equal(beforeContainer.length, 1);

        const afterContainer = this.element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS);
        assert.equal(afterContainer.length, 1);

        const centerContainer = this.element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS);
        assert.equal(centerContainer.length, 1);
    });

    test('render dropDownMenu', (assert) => {
        this.element.dxToolbar({
            items: [
                { location: 'after', locateInMenu: 'always', widget: 'button', options: { text: 'After Button' } }
            ]
        });

        const $toolbarMenuContainer = this.element.find('.' + TOOLBAR_MENU_BUTTON_CONTAINER_CLASS);

        assert.equal($toolbarMenuContainer.length, 1, 'Menu container rendered');
        assert.ok($toolbarMenuContainer.children().hasClass(DROP_DOWN_MENU_CLASS), 'DropDownMenu rendered');
    });

    test('items - widgets', (assert) => {
        this.element.dxToolbar({
            items: [
                { location: 'before', widget: 'button', options: { text: 'Before Button' } },
                { location: 'after', widget: 'button', options: { text: 'After Button' } },
                {
                    location: 'center', widget: 'tabs', options: {
                        items: [{ text: 'Tab 1' }, { text: 'Tab 2' }, { text: 'Tab 3' }]
                    }
                }
            ]
        });

        const items = this.element.find('.' + TOOLBAR_ITEM_CLASS);
        assert.equal(items.length, 3);

        assert.equal(items.eq(0).text(), 'Before Button');
        assert.equal(items.eq(1).text(), 'Tab 1Tab 2Tab 3');
        assert.equal(items.eq(2).text(), 'After Button');

    });

    test('items - label', (assert) => {
        this.element.dxToolbar({
            items: [
                { location: 'center', text: 'Label' }
            ]
        });

        const label = this.element.find('.' + TOOLBAR_ITEM_CLASS);

        assert.equal(label.length, 1);
        assert.equal(label.text(), 'Label');
        assert.ok(label.hasClass(TOOLBAR_LABEL_CLASS));
    });

    test('items - custom html', (assert) => {
        this.element.dxToolbar({
            items: [
                { location: 'center', html: '<b>Label</b>' }
            ]
        });

        const label = this.element.find('b');
        assert.equal(label.length, 1);
        assert.equal(label.text(), 'Label');
        assert.ok(this.element.find('.' + TOOLBAR_ITEM_CLASS).hasClass(TOOLBAR_LABEL_CLASS));
    });

    test('items - location', (assert) => {
        const element = this.element.dxToolbar({
            items: [
                { location: 'before', text: 'before' },
                { location: 'after', text: 'after' },
                { location: 'center', text: 'center' }
            ]
        });

        $.each(['before', 'after', 'center'], function() {
            assert.equal(element.find('.' + TOOLBAR_CLASS + '-' + this).text(), this);
        });
    });

    test('items - location', (assert) => {
        const element = this.element.dxToolbar({
            items: [
                { location: 'before', text: 'before' },
                { location: 'after', text: 'after' },
                { location: 'center', text: 'center' }
            ]
        });

        $.each(['before', 'after', 'center'], function() {
            assert.equal(element.find('.' + TOOLBAR_CLASS + '-' + this).text(), this);
        });
    });

    test('add a custom CSS class to item', (assert) => {
        this.element.dxToolbar({
            items: [
                { location: 'before', cssClass: 'test-before' },
                { location: 'after', cssClass: 'test-after' },
                { location: 'center', cssClass: 'test-center' }
            ]
        });

        const findItem = location => {
            const selector = `.${TOOLBAR_CLASS + '-' + location} > .${TOOLBAR_ITEM_CLASS}.test-${location}`;
            return this.element.find(selector);
        };

        $.each(['before', 'after', 'center'], (_, value) => {
            assert.equal(findItem(value).length, 1, `item in the ${value} container`);
        });
    });

    test('items with nested toolbar config 1', (assert) => {
        this.element.dxToolbar({
            items: [
                {
                    template: () => {
                        return $('<div id="toolbar2">').dxToolbar({
                            items: [{ html: '<div id="2">2</div>' }]
                        });
                    }
                },
                { html: '<div id="1">1</div>' }
            ]
        });

        assert.equal(this.element.find('#1').length, 1, '#1');
        assert.equal(this.element.find('#toolbar2 #1').length, 0, '#toolbar2 #1');

        assert.equal(this.element.find('#2').length, 1, '#2');
        assert.equal(this.element.find('#toolbar2 #2').length, 1, '#toolbar2 #2');
    });

    test('items with nested toolbar config 2', (assert) => {
        this.element.dxToolbar({
            items: [
                { html: '<div id="1">1</div>' },
                {
                    template: () => {
                        return $('<div id="toolbar2">').dxToolbar({
                            items: [{ html: '<div id="2">2</div>' }]
                        });
                    }
                }
            ]
        });

        assert.equal(this.element.find('#1').length, 1, '#1');
        assert.equal(this.element.find('#toolbar2 #1').length, 0, '#toolbar2 #1');

        assert.equal(this.element.find('#2').length, 1, '#2');
        assert.equal(this.element.find('#toolbar2 #2').length, 1, '#toolbar2 #2');
    });

    test('items with nested toolbar config 3', (assert) => {
        this.element.dxToolbar({
            items: [
                {
                    location: 'before',
                    template: () => {
                        return $('<div id="toolbar2">').dxToolbar({
                            items: [
                                {
                                    location: 'center',
                                    html: '<div id="2">2</div>'
                                }
                            ]
                        });
                    }
                },
                {
                    location: 'center',
                    html: '<div id="1">1</div>'
                }
            ]
        });

        assert.equal(this.element.find('#1').length, 1, '#1');
        assert.equal(this.element.find('#toolbar2 #1').length, 0, '#toolbar2 #1');

        assert.equal(this.element.find('#2').length, 1, '#2');
        assert.equal(this.element.find('#toolbar2 #2').length, 1, '#toolbar2 #2');
    });

    test('Clear timer for the animation in the Material theme', (assert) => {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
        this.element.dxToolbar({});

        const beforeContainer = this.element.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`);
        const afterContainer = this.element.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`);
        const centerContainer = this.element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`);

        assert.equal(beforeContainer.length, 1, 'the before container is rendered');
        assert.equal(afterContainer.length, 1, 'the after container is rendered');
        assert.equal(centerContainer.length, 1, 'the center container is rendered');

        themes.isMaterial = this.origIsMaterial;
    });
});

QUnit.test('elementAttr should be rendered on button items', function(assert) {
    const $toolbar = $('#toolbar').dxToolbar({
        items: [{
            location: 'before',
            widget: 'dxButton',
            options: {
                elementAttr: { 'test': '123' },
            }
        }]
    });

    assert.equal($toolbar.find('.dx-button').eq(0).attr('test'), 123, 'test attr exists');
});

QUnit.module('option change handlers', {
    beforeEach: () => {
        this.element = $('#toolbar');
    }
}, () => {
    test('items', (assert) => {
        const instance = this.element.dxToolbar({ items: [{ location: 'center', text: '0' }] }).dxToolbar('instance');

        instance.option('items', [{ location: 'center', text: '1' }]);
        assert.equal(this.element.text(), '1');
    });
});

QUnit.module('regressions', {
    beforeEach: () => {
        this.element = $('#toolbar').dxToolbar({});
        this.instance = this.element.dxToolbar('instance');
    }
}, () => {
    test('B231277', (assert) => {
        this.instance.option('items', [{ location: 'center' }]);
        assert.equal($.trim(this.element.text()), '');

        this.instance.option('items', [{ location: 'center', text: undefined }]);
        assert.equal($.trim(this.element.text()), '');

        this.instance.option('items', [{ location: 'center', text: null }]);
        assert.equal($.trim(this.element.text()), '');
    });
});

QUnit.module('aria accessibility', () => {
    test('aria role', (assert) => {
        const $element = $('#toolbar').dxToolbar();

        assert.equal($element.attr('role'), 'toolbar', 'role is correct');
    });
});

QUnit.module('item groups', {
    beforeEach: () => {
        this.$element = $('#toolbar');
        this.groups = [
            {
                location: 'before',
                items: [
                    { location: 'before', text: 'Item A-1' },
                    { location: 'after', text: 'Item A-2' }
                ]
            },
            {
                items: [
                    { text: 'Item B-1', visible: false },
                    { text: 'Item B-2' },
                    { text: 'Item B-3' }
                ]
            },
            {
                location: 'after',
                items: [
                    { text: 'Item C-1' },
                    { text: 'Item C-2' }
                ]
            }
        ];
    }
}, () => {
    test('toolbar should show item groups', (assert) => {
        const $element = this.$element.dxToolbar({
            items: this.groups,
            grouped: true,
        });
        const $groups = $element.find('.' + TOOLBAR_GROUP_CLASS);

        assert.equal($groups.length, 3, '3 groups rendered');
        assert.equal($groups.eq(0).find('.' + TOOLBAR_ITEM_CLASS).length, 2, 'first group contains 2 items');
        assert.equal($groups.eq(1).find('.' + TOOLBAR_ITEM_CLASS).length, 3, 'second group contains 3 items');
    });

    test('toolbar groups should be placed inside toolbar blocks', (assert) => {
        const $element = this.$element.dxToolbar({
            items: this.groups,
            grouped: true
        });
        const $before = $element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0);
        const $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);
        const $after = $element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

        assert.equal($before.find('.' + TOOLBAR_ITEM_CLASS).length, 2, '2 items are in before');
        assert.equal($center.find('.' + TOOLBAR_ITEM_CLASS).length, 3, '3 items are in center');
        assert.equal($after.find('.' + TOOLBAR_ITEM_CLASS).length, 2, '2 items are in after');
    });
});

QUnit.module('default template', () => {
    test('template should be rendered correctly with text', (assert) => {
        const $content = prepareItemTest('custom');

        assert.equal($content.text(), 'custom');
    });

    test('template should be rendered correctly with boolean', (assert) => {
        const $content = prepareItemTest(true);

        assert.equal($.trim($content.text()), 'true');
    });

    test('template should be rendered correctly with number', (assert) => {
        const $content = prepareItemTest(1);

        assert.equal($.trim($content.text()), '1');
    });

    test('template should be rendered correctly with text', (assert) => {
        const $content = prepareItemTest({ text: 'custom' });

        assert.equal($.trim($content.text()), 'custom');
    });

    test('template should be rendered correctly with html', (assert) => {
        const $content = prepareItemTest({ html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();
        assert.ok($span.length);
        assert.equal($span.text(), 'test');
    });

    test('template should be rendered correctly with htmlstring', (assert) => {
        const $content = prepareItemTest('<span>test</span>');

        assert.equal($content.text(), '<span>test</span>');
    });

    test('template should be rendered correctly with html & text', (assert) => {
        const $content = prepareItemTest({ text: 'text', html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();

        assert.ok($span.length);
        assert.equal($content.text(), 'test');
    });

    test('template should be rendered correctly with button without options', (assert) => {
        const $content = prepareItemTest({ widget: 'button' });

        const button = $content.filter('.dx-button');
        assert.equal(button.length, 1);
    });

    test('template should be rendered correctly with dxbutton without options', (assert) => {
        const $content = prepareItemTest({ widget: 'dxButton' });

        const button = $content.filter('.dx-button');
        assert.equal(button.length, 1);
    });

    test('template should be rendered correctly with button', (assert) => {
        const $content = prepareItemTest({ widget: 'button', options: { text: 'test' } });

        const button = $content.filter('.dx-button');
        assert.equal(button.length, 1);
        assert.equal($.trim(button.text()), 'test');
    });

    test('template should be rendered correctly with dxtabs', (assert) => {
        const $content = prepareItemTest({ widget: 'dxTabs', options: { items: [{ text: 'test' }] } });

        const tabs = $content.filter('.dx-tabs');

        assert.equal(tabs.length, 1);
        assert.equal(tabs.find('.dx-tab').length, 1);
        assert.equal($.trim(tabs.text()), 'test');
    });

    test('template should be rendered correctly with tabs', (assert) => {
        const $content = prepareItemTest({ widget: 'tabs', options: { items: [{ text: 'test' }] } });

        const tabs = $content.filter('.dx-tabs');

        assert.equal(tabs.length, 1);
        assert.equal(tabs.find('.dx-tab').length, 1);
        assert.equal($.trim(tabs.text()), 'test');
    });

    test('template should be rendered correctly with dropDownMenu', (assert) => {
        const $content = prepareItemTest({ widget: 'dropDownMenu', options: { items: [{ text: 'test' }] } });

        const dropDown = $content.filter('.dx-dropdownmenu');
        assert.equal(dropDown.length, 1);
    });
});
