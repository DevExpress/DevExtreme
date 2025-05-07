import $ from 'jquery';

import ToolbarBase from '__internal/ui/toolbar/m_toolbar.base';

import fx from 'common/core/animation/fx';
import resizeCallbacks from 'core/utils/resize_callbacks';
import themes from 'ui/themes';
import { deferUpdate } from 'core/utils/common';

import 'generic_light.css!';

import 'ui/text_box';
import 'ui/drop_down_button';
import 'ui/tabs';
import 'ui/toolbar';

QUnit.testStart(() => {
    const markup = `
        <style nonce="qunit-test">
            #toolbarWithMenu .dx-toolbar-menu-container {
                width: 100px;
            }
            .dx-list-item {
                /* NOTE: to avoid decimal values in geometry */
                line-height: 1;
            }
        </style>

        <div id="toolbar"></div>
        <div id="toolbarWithMenu"></div>
        <div id="widget"></div>
        <div id="widthRootStyle"></div>
    `;

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_ITEM_INVISIBLE_CLASS = 'dx-toolbar-item-invisible';
const TOOLBAR_ITEM_CONTENT_CLASS = 'dx-toolbar-item-content';
const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_BEFORE_CONTAINER_CLASS = 'dx-toolbar-before';
const TOOLBAR_AFTER_CONTAINER_CLASS = 'dx-toolbar-after';
const TOOLBAR_CENTER_CONTAINER_CLASS = 'dx-toolbar-center';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const LIST_ITEM_CLASS = 'dx-list-item';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TEXTEDITOR_CLASS = 'dx-texteditor';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';

const BASE_TEXTEDITOR_WIDTH = '150px';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#toolbar');
        this.instance = this.$element.dxToolbar().dxToolbar('instance');

        this.overflowMenu = {
            $element: () => {
                return this.$element.find(`.${DROP_DOWN_MENU_CLASS}`);
            },
            click() {
                this.$element().trigger('dxclick');
            },
            instance: () => {
                return this.instance._layoutStrategy._menu;
            }
        };

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('render', {
    beforeEach: function() {
        this.$element = $('#toolbar');
    }
}, () => {
    QUnit.test('label correctly fits into container', function(assert) {
        this.$element.dxToolbar({
            items: [
                { location: 'before', text: 'Summary' }
            ]
        });

        const labelElement = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`)[0];
        const labelMaxWidth = parseInt(labelElement.style.maxWidth);

        labelElement.style.maxWidth = '';

        const labelWidth = labelElement.getBoundingClientRect().width;
        assert.ok(labelWidth <= labelMaxWidth, 'Real label width less or equal to the max width');
    });

    QUnit.test('items - long labels', function(assert) {
        this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', options: { text: 'Before Button' } },
                { location: 'before', widget: 'dxButton', options: { text: 'Second Before Button' } },
                { location: 'after', widget: 'dxButton', options: { text: 'After Button' } },
                { location: 'center', text: 'Very very very very very very very very very very very long label' }
            ],
            width: '500px'
        });

        const $label = this.$element.find(`.${TOOLBAR_LABEL_CLASS}`);

        assert.strictEqual($label.children().eq(0).css('text-overflow'), 'ellipsis');
        assert.strictEqual($label.children().eq(0).css('overflow'), 'hidden');

        const $centerSection = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`);
        const beforeSectionWidth = this.$element.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`)[0].getBoundingClientRect().width;
        const afterSectionWidth = this.$element.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`)[0].getBoundingClientRect().width;

        assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
        assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

        const maxLabelWidth = this.$element.width() - beforeSectionWidth - afterSectionWidth;

        assert.roughEqual(parseFloat($label.css('max-width')), maxLabelWidth, 0.1);
    });

    QUnit.test('items - long custom html', function(assert) {
        this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', options: { text: 'Before Button' } },
                { location: 'before', widget: 'dxButton', options: { text: 'Second Before Button' } },
                { location: 'after', widget: 'dxButton', options: { text: 'After Button' } },
                { location: 'center', html: '<b>Very very very very very very very very very very very long label</b>' }
            ],
            width: 500
        });

        const $label = this.$element.find(`.${TOOLBAR_LABEL_CLASS}`);

        assert.strictEqual($label.children().eq(0).css('text-overflow'), 'ellipsis');
        assert.strictEqual($label.children().eq(0).css('overflow'), 'hidden');

        const $centerSection = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`);
        const beforeSectionWidth = this.$element.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`)[0].getBoundingClientRect().width;
        const afterSectionWidth = this.$element.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`)[0].getBoundingClientRect().width;

        assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
        assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

        const maxLabelWidth = this.$element.width() - beforeSectionWidth - afterSectionWidth;

        assert.roughEqual(parseFloat($label.css('max-width')), maxLabelWidth, 0.1);
    });

    QUnit.test('Center element has correct margin with RTL', function(assert) {
        const element = this.$element.dxToolbar({
            rtlEnabled: true,
            items: [
                { location: 'before', text: 'before' },
                { location: 'center', text: 'center' }
            ]
        });
        const margin = element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).get(0).style.margin;

        assert.strictEqual(margin, '0px auto', 'aligned by center');
    });

    ['before', 'center', 'after', undefined].forEach((location) => {
        ['never', 'auto', 'always', undefined].forEach((locateInMenu) => {
            const ITEM_WIDTH = 100;
            [10, 1000].forEach((toolbarWidth) => {
                QUnit.test(`Change item location at runtime (T844890), location: ${location}, locateInMenu: ${locateInMenu}, width: ${toolbarWidth}`, function(assert) {
                    const $toolbar = this.$element.dxToolbar({
                        items: [ { text: 'toolbar item', locateInMenu: locateInMenu, location: location, width: ITEM_WIDTH } ],
                        width: toolbarWidth
                    });
                    const toolbar = $toolbar.dxToolbar('instance');

                    const checkItemsLocation = ($toolbar, expected) => {
                        const $beforeItems = $toolbar.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS} .${TOOLBAR_ITEM_CLASS}`).not(`.${TOOLBAR_ITEM_INVISIBLE_CLASS}`);
                        const $centerItems = $toolbar.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS} .${TOOLBAR_ITEM_CLASS}`).not(`.${TOOLBAR_ITEM_INVISIBLE_CLASS}`);
                        const $afterItems = $toolbar.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS} .${TOOLBAR_ITEM_CLASS}`).not(`.${TOOLBAR_ITEM_INVISIBLE_CLASS}`);
                        const $menuItems = $toolbar.find(`.${TOOLBAR_MENU_CONTAINER_CLASS}`).not(`.${INVISIBLE_STATE_CLASS}`);

                        if(locateInMenu === 'always' || (locateInMenu === 'auto' && toolbarWidth < ITEM_WIDTH)) {
                            QUnit.assert.strictEqual($menuItems.length, 1, 'menu items count for ');
                            QUnit.assert.strictEqual($beforeItems.length, 0, 'items count with before location value');
                            QUnit.assert.strictEqual($centerItems.length, 0, 'items count with center location value');
                            QUnit.assert.strictEqual($afterItems.length, 0, 'items count with after location value');
                        } else {
                            QUnit.assert.strictEqual($menuItems.length, 0, 'menu items count');
                            QUnit.assert.strictEqual($beforeItems.length, expected.before || 0, 'items count with before location value');
                            QUnit.assert.strictEqual($centerItems.length, expected.center || 0, 'items count with center location value');
                            QUnit.assert.strictEqual($afterItems.length, expected.after || 0, 'items count with after location value');
                        }
                    };

                    const expectedInitial = {};
                    expectedInitial[location || 'center'] = 1;
                    checkItemsLocation($toolbar, expectedInitial);

                    toolbar.option('items[0].location', 'center');
                    checkItemsLocation($toolbar, { center: 1 });

                    toolbar.option('items[0].location', 'after');
                    checkItemsLocation($toolbar, { after: 1 });

                    toolbar.option('items[0].location', 'before');
                    checkItemsLocation($toolbar, { before: 1 });
                });
            });
        });
    });

    QUnit.test('buttons has text style in Material', function(assert) {
        const origIsMaterial = themes.isMaterialBased;
        themes.isMaterialBased = () => true;

        const element = this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        });
        const button = element.find('.dx-button').first();

        assert.ok(button.hasClass('dx-button-mode-text'));

        themes.isMaterialBased = origIsMaterial;
    });

    QUnit.test('drop down buttons has text style in Material', function(assert) {
        const origIsMaterial = themes.isMaterialBased;
        themes.isMaterialBased = () => true;

        const element = this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxDropDownButton',
                options: {
                    icon: 'home'
                }
            }]
        });
        const button = element.find('.dx-button').first();

        // is dropdown button
        assert.ok(button.hasClass('dx-dropdownbutton-action'));
        assert.ok(button.hasClass('dx-button-mode-text'));

        themes.isMaterialBased = origIsMaterial;
    });

    const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';

    QUnit.test('Toolbar with compact mode has the compact class', function(assert) {
        const $toolbar = this.$element.dxToolbar({
            items: [
                {
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        type: 'default',
                        text: 'before'
                    }
                },
                {
                    location: 'center',
                    widget: 'dxButton',
                    options: {
                        type: 'default',
                        text: 'center'
                    }
                }
            ],
            compactMode: true,
            width: 20
        });
        const toolbar = $toolbar.dxToolbar('instance');

        assert.ok($toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar with compact mode and small width has the compact class');

        toolbar.option('compactMode', false);

        assert.ok(!$toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar without compact mode hasn\'t the compact class');

        toolbar.option('compactMode', true);

        assert.ok($toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'compact class has been added to the toolbar');

        toolbar.option('width', 400);

        assert.ok(!$toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar with compact mode hasn\'t the compact class if widget has a large width');
    });

    QUnit.test('Buttons has default style in generic theme', function(assert) {
        const element = this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        });
        const button = element.find('.dx-button');

        assert.notOk(button.hasClass('dx-button-mode-text'));
    });

    QUnit.test('Toolbar provides it\'s own templates for the item widgets', function(assert) {
        let templateUsed;

        this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: { template: 'custom' }
            }],
            integrationOptions: {
                templates: {
                    custom: {
                        render: (options) => {
                            templateUsed = true;
                            $('<div>')
                                .attr('data-options', 'dxTemplate: { name: \'custom\' }')
                                .addClass('custom-template')
                                .text('Custom text')
                                .appendTo(options.container);
                        }
                    }
                }
            }
        });

        assert.ok(templateUsed);
        assert.strictEqual(this.$element.find('.custom-template').length, 1);
    });


    [true, false].forEach(deferRendering => {
        function renderToolbar(container, toolbarItems) {
            const renderer = deferRendering
                ? (func) => deferUpdate(() => func(), 100)
                : (func) => func();

            renderer(() => {
                $(container).dxToolbar({
                    items: toolbarItems
                });
            });
        }

        QUnit.test(`Toolbar menu icon rendered correctly in asynchronous template. Second item located in menu, deferRendering=${deferRendering}.`, function(assert) {
            renderToolbar(this.$element, [{
                location: 'after',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'after',
                locateInMenu: 'always',
                text: 'item2'
            }]);

            const toolbarItems = this.$element.find('.dx-toolbar-after').children();
            assert.strictEqual(toolbarItems.length, 2, 'All items are rendered');

            assert.strictEqual(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.strictEqual(toolbarItems[1].innerText.trim(), '', 'second item is menu button');
        });

        QUnit.test(`Toolbar simple items rendered correctly in asynchronous template. Items position: before, deferRendering=${deferRendering}.`, function(assert) {
            renderToolbar(this.$element, [{
                location: 'before',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'before',
                locateInMenu: 'never',
                text: 'item2'
            } ]);

            const toolbarItems = this.$element.find('.dx-toolbar-before').children();
            assert.strictEqual(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.strictEqual(toolbarItems[1].innerText.trim(), 'item2', 'second item is simple item');
        });

        QUnit.test(`Toolbar simple items rendered correctly in asynchronous template. Items position: after, deferRendering=${deferRendering}.`, function(assert) {
            renderToolbar(this.$element, [{
                location: 'after',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'after',
                locateInMenu: 'never',
                text: 'item2'
            } ]);

            const toolbarItems = this.$element.find('.dx-toolbar-after').children();
            assert.strictEqual(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.strictEqual(toolbarItems[1].innerText.trim(), 'item2', 'second item is simple item');
        });
    });

    QUnit.test('toolbar.items = [ buttonGroup.items=[ item1.elementAttr = { attr1="test1", attr2="test2", attr3="test3" }] ]', function(assert) {
        const $toolbar = this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButtonGroup',
                options: {
                    keyExpr: 'id',
                    items: [
                        { id: 1, text: 'button 1', elementAttr: { attr1: 'test1', attr2: 'test2', attr3: 'test3' } },
                    ],
                }
            }]
        });

        const $button = $toolbar.find('.dx-button');
        assert.strictEqual($button.attr('attr1'), 'test1');
        assert.strictEqual($button.attr('attr2'), 'test2');
        assert.strictEqual($button.attr('attr3'), 'test3');
    });

    QUnit.test('toolbar.items = [ buttonGroup.items=[ item1.elementAttr.class="test1",item2.elementAttr.class="test2"] ]', function(assert) {
        const $toolbar = this.$element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButtonGroup',
                options: {
                    keyExpr: 'id',
                    items: [
                        { id: 1, text: 'button 1', elementAttr: { class: 'test1' } },
                        { id: 2, text: 'button 2', elementAttr: { class: 'test2' } },
                    ],
                }
            }]
        });

        const $button = $toolbar.find('.dx-button');
        assert.strictEqual($button.eq(0).hasClass('test1'), true);
        assert.strictEqual($button.eq(0).hasClass('test2'), false);
        assert.strictEqual($button.eq(1).hasClass('test1'), false);
        assert.strictEqual($button.eq(1).hasClass('test2'), true);
    });
});

QUnit.module('toolbar with menu', moduleConfig, () => {
    QUnit.test('dropDownMenu not exist, set toolbar.overflowMenuVisible = true, does not fire any errors', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'never', text: 'item2' }
        ]);

        try {
            this.instance.option('overflowMenuVisible', true);
        } catch(e) {
            assert.ok(false, e);
        } finally {
            assert.ok(true, 'no errors has been raised');
        }
    });

    QUnit.test('syncronize toolbar.overflowMenuVisible option by menuButton click', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'always', text: 'item2' }
        ]);

        assert.strictEqual(this.instance.option('overflowMenuVisible'), false);

        this.overflowMenu.click();

        assert.strictEqual(this.instance.option('overflowMenuVisible'), true);

        this.overflowMenu.click();

        assert.strictEqual(this.instance.option('overflowMenuVisible'), false);
    });

    QUnit.test('open menu by set toolbar.overflowMenuVisible = true', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'always', text: 'item2' }
        ]);

        this.instance.option('overflowMenuVisible', true);

        assert.strictEqual(this.overflowMenu.instance().option('opened'), true);
    });


    QUnit.test('open menu by menuButton click -> set toolbar.overflowMenuVisible = false', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'always', text: 'item2' }
        ]);

        this.overflowMenu.click();

        assert.strictEqual(this.overflowMenu.instance().option('opened'), true);

        this.instance.option('overflowMenuVisible', false);

        assert.strictEqual(this.overflowMenu.instance().option('opened'), false);
    });


    QUnit.test('syncronize toolbar.overflowMenuVisible, menu.opened=true -> menu.opened=false ', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'always', text: 'item2' }
        ]);

        assert.strictEqual(this.instance.option('overflowMenuVisible'), false);

        this.overflowMenu.instance().option('opened', true);

        assert.strictEqual(this.instance.option('overflowMenuVisible'), true);

        this.overflowMenu.instance().option('opened', false);

        assert.strictEqual(this.instance.option('overflowMenuVisible'), false);
    });

    QUnit.test('menu button click doesn\'t dispatch action', function(assert) {
        const onItemClickHandler = sinon.spy();

        this.instance.option({
            onItemClick: onItemClickHandler,
            items: [
                { locateInMenu: 'always', text: 'item2' }
            ],
        });

        this.overflowMenu.click();

        assert.strictEqual(onItemClickHandler.callCount, 0, 'onItemClick was not executed');
    });

    QUnit.test('windowResize should not show/hide menu that doesn\'t created', function(assert) {
        this.instance.option('items', []);

        resizeCallbacks.fire();
        assert.ok(true);
    });

    QUnit.test('option visible for menu items', function(assert) {
        this.instance.option({
            items: [
                { locateInMenu: 'always', text: 'a', visible: true }
            ],
        });

        assert.strictEqual(this.overflowMenu.$element().length, 1, 'overflow menu was rendered');

        this.instance.option('items', [{ locateInMenu: 'always', text: 'a', visible: false }]);
        assert.strictEqual(this.overflowMenu.$element().length, 0, 'overflow menu was not rendered');
    });

    QUnit.test('changing field of item in submenu', function(assert) {
        this.instance.option('items', [
            { locateInMenu: 'always', disabled: true }
        ]);

        this.overflowMenu.click();

        this.instance.option('items[0].disabled', false);

        assert.strictEqual($('.dx-state-disabled').length, 0, 'disabled state changed');
    });
});


QUnit.module('widget sizing render', () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', text: 'before' },
                { location: 'after', text: 'after' },
                { location: 'center', text: 'center' }
            ]
        });

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxToolbar({ width: 400 });
        const instance = $element.dxToolbar('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxToolbar();
        const instance = $element.dxToolbar('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxToolbar();
        const instance = $element.dxToolbar('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('text should crop in the label inside the toolbar on toolbar\'s width changing', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', text: 'Before long text label' },
                { location: 'after', text: 'after' }
            ],
            width: 300
        });
        const instance = $element.dxToolbar('instance');
        const $before = $element.find('.dx-toolbar-before').eq(0);
        const $after = $element.find('.dx-toolbar-after').eq(0);
        const afterPadding = parseInt($after.css('paddingLeft'));

        instance.option('width', 100);

        assert.roughEqual($before.width(), 100 - $after.width() - afterPadding, 1.001, 'width of before element should be changed');
    });

    QUnit.test('text should crop in the label inside the toolbar on window\'s width changing', function(assert) {
        const $element = $('#widget').width(300).dxToolbar({
            items: [
                { location: 'before', text: 'Before long text label' },
                { location: 'after', text: 'after' }
            ]
        });
        const $before = $element.find('.dx-toolbar-before').eq(0);
        const $after = $element.find('.dx-toolbar-after').eq(0);
        const afterPadding = parseInt($after.css('paddingLeft'));

        $element.width(100);
        resizeCallbacks.fire();

        assert.roughEqual($before.width(), 100 - $after.width() - afterPadding, 1.001, 'width of before element should be changed');
    });

    QUnit.test('label should positioned correctly inside the toolbar if toolbar-before section is empty', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'center', text: 'TextTextTextTextTextTextTe' },
                { location: 'before', template: 'nav-button', visible: false },
                { location: 'after', text: 'after after after' }
            ],
            width: 359
        });

        const $center = $element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        const $label = $center.children('.dx-toolbar-label').eq(0);
        const $after = $element.find('.dx-toolbar-after').eq(0);

        assert.ok(Math.floor($label.position().left + $label.outerWidth()) <= Math.floor($element.outerWidth() - $after.outerWidth()), 'label is positioned correctly');
    });

    QUnit.test('title should be centered considering different before/after block widths (big before case)', function(assert) {
        const title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

        const $element = $('#widget').dxToolbar({
            onItemRendered: function(args) {
                if($(args.itemElement).text() === title) {
                    $(args.itemElement).css('maxWidth', 200);
                }
            },
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', text: title },
                { location: 'after', template: () => $('<div>').width(50) }
            ],
            width: 400
        });

        const $center = $element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        assert.strictEqual(parseInt($center.css('margin-left')), 115);
        assert.strictEqual(parseInt($center.css('margin-right')), 65);
        assert.strictEqual($center.css('float'), 'none');
        assert.strictEqual($center.width(), 220);
    });

    QUnit.test('title should be centered considering different before/after block widths (big after case)', function(assert) {
        const title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

        const $element = $('#widget').dxToolbar({
            onItemRendered: function(args) {
                if($(args.itemElement).text() === title) {
                    $(args.itemElement).css('maxWidth', 200);
                }
            },
            items: [
                { location: 'before', template: () => $('<div>').width(50) },
                { location: 'center', text: title },
                { location: 'after', template: () => $('<div>').width(100) }
            ],
            width: 400
        });

        const $center = $element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        assert.strictEqual(parseInt($center.css('margin-left')), 65);
        assert.strictEqual(parseInt($center.css('margin-right')), 115);
        assert.strictEqual($center.css('float'), 'right');
        assert.strictEqual($center.width(), 220);
    });

    QUnit.test('title should be centered considering different before/after block widths after visible option change', function(assert) {
        const title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: () => $('<div>').width(50), visible: false },
                { location: 'center', text: title }
            ],
            width: 400
        });
        $element.dxToolbar('option', 'items[0].visible', true);

        const $center = $element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        assert.strictEqual(parseInt($center.css('margin-left')), 65);
    });

    QUnit.test('items should be arranged after rendering in the dxToolbarBase used in the dxPopup', function(assert) {
        const title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

        const $element = $('#widget').dxToolbarBase({
            onItemRendered: function(args) {
                if($(args.itemElement).text() === title) {
                    $(args.itemElement).css('maxWidth', 200);
                }
            },
            items: [
                {
                    location: 'before', template: function() {
                        return $('<div>').width(100);
                    }
                },
                { location: 'center', text: title },
                {
                    location: 'after', template: function() {
                        return $('<div>').width(50);
                    }
                }
            ],
            width: 400
        });

        const $center = $element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        assert.strictEqual(parseInt($center.css('margin-left')), 115);
        assert.strictEqual(parseInt($center.css('margin-right')), 65);
        assert.strictEqual($center.css('float'), 'none');
        assert.strictEqual($center.width(), 220);
    });

    [
        {
            caseName: 'default toolbar TextEditor rendering',
            itemConfig: {
                widget: 'dxTextBox'
            },
            expectedResult: true
        },
        {
            caseName: 'item template with the TextEditor at the root level',
            itemConfig: {
                template: () => $('<div>').dxTextBox()
            },
            expectedResult: true
        },
        {
            caseName: 'item template with wrapped TextEditor (complex templates etc)',
            itemConfig: {
                template: () => $('<div>').append($('<div>').dxTextBox())
            },
            expectedResult: false
        }
    ].forEach(({ caseName, itemConfig, expectedResult }) => {
        QUnit.test(`TextEditor sizing: ${caseName}`, function(assert) {
            const $element = $('#widget').dxToolbar({
                items: [itemConfig],
                width: 400
            });

            const editorCssWidth = $element.find(`.${TEXTEDITOR_CLASS}`).css('width');
            const isStandardWidth = editorCssWidth === BASE_TEXTEDITOR_WIDTH;

            assert.strictEqual(isStandardWidth, expectedResult);
        });
    });
});

QUnit.module('adaptivity', moduleConfig, () => {
    QUnit.test('center section should be at correct position for huge after section', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(50) },
                { location: 'center', template: () => $('<div>').width(50) },
                { location: 'after', template: () => $('<div>').width(200) },
            ],
            width: 400
        });
        const $center = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        const $after = this.$element.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`).eq(0);

        assert.strictEqual($center.offset().left + $center.outerWidth(), $after.offset().left, 'center has correct position');
    });

    QUnit.test('items in center section should be at correct position after resize', function(assert) {
        const $item = $('<div>').width(50);
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(50) },
                { location: 'center', template: () => $item },
                { location: 'after', template: () => $('<div>').width(200) },
            ],
            width: 400
        });

        this.$element.dxToolbar('option', 'width', 1000);

        const elementCenter = this.$element.offset().left + this.$element.outerWidth() * 0.5;
        const itemCenter = $item.offset().left + $item.outerWidth() * 0.5;

        assert.strictEqual(itemCenter, elementCenter, 'item has correct position');
    });

    QUnit.test('Resize container: 1000px -> 100px, 100px -> 1000px', function(assert) {
        const $container = $('<div />')
            .width(1000)
            .appendTo($('#widget'));

        const $toolbar = $('<div />').appendTo($container).dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'button 1', width: 100 } },
                { location: 'center', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'button 1', width: 100 } },
                { location: 'after', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'button 1', width: 100 } },
            ],
        });
        const getVisibleItemsCount = () => $toolbar.find(`.${TOOLBAR_ITEM_CLASS}:visible`).length;
        assert.strictEqual(getVisibleItemsCount(), 3, 'all items are visible');

        $container.width(100);
        $toolbar.dxToolbar('instance').updateDimensions();
        assert.strictEqual(getVisibleItemsCount(), 0, 'all items are invisible, because there is no free space');

        $container.width(1000);
        $toolbar.dxToolbar('instance').updateDimensions();
        assert.strictEqual(getVisibleItemsCount(), 3, 'all items became visible');
    });

    QUnit.test('center section should be at correct position for huge before section', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(200) },
                { location: 'center', template: () => $('<div>').width(50) },
                { location: 'after', template: () => $('<div>').width(50) },
            ],
            width: 400
        });
        const $before = this.$element.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`).eq(0);
        const $center = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);

        assert.strictEqual($center.offset().left, $before.offset().left + $before.outerWidth(), 'center has correct position');
    });

    QUnit.test('center section should be at correct position for huge after section after change size', function(assert) {
        const $item = $('<div>').width(200);
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(50) },
                { location: 'center', template: () => $('<div>').width(50) },
                { location: 'after', template: () => $item },
            ],
            width: 400
        });
        const $center = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);
        const $after = this.$element.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`).eq(0);

        $item.width(190);
        resizeCallbacks.fire();

        assert.strictEqual($center.get(0).getBoundingClientRect().right, $after.get(0).getBoundingClientRect().left, 'center has correct position');
    });

    QUnit.test('center section should be at correct position for huge before section after change size', function(assert) {
        const $item = $('<div>').width(200);
        this.instance.option({
            items: [
                { location: 'before', template: () => $item },
                { location: 'center', template: () => $('<div>').width(50) },
                { location: 'after', template: () => $('<div>').width(50) },
            ],
            width: 400
        });

        const $before = this.$element.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`).eq(0);
        const $center = this.$element.find(`.${TOOLBAR_CENTER_CONTAINER_CLASS}`).eq(0);

        $item.width(190);
        resizeCallbacks.fire();

        assert.strictEqual($center.get(0).getBoundingClientRect().left, $before.get(0).getBoundingClientRect().right, 'center has correct position');
    });

    QUnit.test('overflow items should be hidden if there is no free space for them', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        const $visibleItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}:visible`);
        assert.strictEqual($visibleItems.length, 3, 'two items was hidden');
    });

    QUnit.test('Buttons declared via template should be hidden if there is no enough free space for them (T1191856)', function(assert) {
        const items = [{
            location: 'after',
            locateInMenu: 'never',
            template() {
                return $('<div />').dxTextBox({
                    width: 256
                });
            }
        }];

        for(let i = 0; i < 5; i++) {
            items.push({
                location: 'before',
                widget: 'dxButton',
                locateInMenu: 'auto',
                template() {
                    return $('<div />').dxButton({
                        text: 'Button long text'
                    });
                }
            });
        }

        this.instance.option({
            items,
            width: 500
        });

        const $visibleItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}:visible`);
        assert.strictEqual($visibleItems.length, 2, 'two items are visible');
    });

    QUnit.test('overflow items should be shown if there is free space for them after resize', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(50) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(60) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        this.instance.option('width', 1000);
        const $visibleItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}:visible`);
        assert.strictEqual($visibleItems.length, 5, 'all items is visible');
    });

    QUnit.test('menu should be rendered if there is hidden overflow items', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        assert.strictEqual(this.overflowMenu.$element().length, 1);
    });

    QUnit.test('menu button should be invisible if there is hidden invisible overflow items', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'after', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { locateInMenu: 'always', visible: false, template: () => $('<div>').width(100) }
            ]
        });

        assert.strictEqual(this.overflowMenu.$element().length, 1, 'button is rendered');
        assert.notOk(this.overflowMenu.$element().is(':visible'), 'button is invisible');
    });

    QUnit.test('all overflow items should be hidden on render', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(50) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(50) }
            ],
            width: 190
        });

        assert.strictEqual(this.overflowMenu.instance().option('items').length, 2);
    });

    QUnit.test('overflow items should not be rendered twice after resize', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(50) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(50) }
            ],
            width: 400
        });

        this.instance.option('width', 230);

        this.overflowMenu.click();
        this.overflowMenu.click();

        this.instance.option('width', 228);

        assert.strictEqual(this.overflowMenu.instance().option('items').length, 1);
    });

    QUnit.test('menu should be rendered if there is hidden overflow items after resize', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 1000
        });

        this.instance.option('width', 400);

        assert.strictEqual(this.overflowMenu.$element().length, 1);
    });

    QUnit.test('menu shouldn\'t be closed during resize with open menu if menu has items', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        this.overflowMenu.click();

        assert.strictEqual(this.overflowMenu.instance().option('opened'), true);
    });

    QUnit.test('menu should be closed if after resize with open menu all items become visible', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        this.overflowMenu.click();

        this.instance.option('width', 1000);

        assert.strictEqual(this.overflowMenu.instance().option('opened'), false);
    });

    QUnit.test('menu strategy should be used if there is overflow widget', function(assert) {
        this.instance.option({
            items: [
                { location: 'center', locateInMenu: 'auto', widget: 'dxButton', options: {} }
            ],
            width: 100
        });

        assert.strictEqual(this.overflowMenu.$element().length, 1);
    });

    QUnit.test('menu strategy should be used if there is overflow widget, items: [{ locateInMenu: "auto", widget: "dxButton", showText: "inMenu" }]', function(assert) {
        this.instance.option({
            items: [
                { locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test' }, showText: 'inMenu' }
            ]
        });

        const $buttonText = this.$element.find('.dx-button-text');

        assert.strictEqual($buttonText.length, 1);
        assert.ok($buttonText.is(':hidden'));
    });

    QUnit.test('menu strategy should be used if there is overflow widget, items: [{ location: "center", locateInMenu: "auto" }]', function(assert) {
        this.instance.option({
            items: [
                { location: 'center', locateInMenu: 'auto', text: 'test' }
            ],
            width: 100
        });

        assert.strictEqual(this.overflowMenu.$element().length, 1);
    });

    QUnit.test('visibility of menu should be changed if overflow items was hidden/shown after resize', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        this.instance.option('width', 1000);
        assert.ok(this.overflowMenu.$element().is(':hidden'), 'menu is hidden');

        this.instance.option('width', 400);
        assert.ok(this.overflowMenu.$element().is(':visible'), 'menu is visible');
    });

    QUnit.test('hidden overflow items should be rendered in menu', function(assert) {
        const $item = $('<div>').width(100);
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $item },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        this.overflowMenu.instance().option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
        });

        this.overflowMenu.click();
    });

    QUnit.test('items with locateInMenu == \'always\' should be rendered in menu if there is free space for them', function(assert) {
        const $item = $('<div>').width(100);
        this.instance.option({
            items: [
                { location: 'center', locateInMenu: 'always', template: () => $item }
            ],
            width: 1000
        });

        this.overflowMenu.instance().option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
        });

        this.overflowMenu.click();
    });

    QUnit.test('visible overflow items should be moved back into widget after resize', function(assert) {
        const $item = $('<div>').width(100);
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(100) },
                { location: 'center', template: () => $('<div>').width(150) },
                { location: 'center', locateInMenu: 'auto', template: () => $item },
                { location: 'center', template: () => $('<div>').width(100) },
                { location: 'after', template: () => $('<div>').width(100) },
            ],
            width: 400
        });

        const $itemParent = $item.parent();

        this.overflowMenu.click();
        this.overflowMenu.click();

        this.instance.option('width', 1000);
        assert.ok($item.parent().is($itemParent), 'item was rendered in toolbar');
    });

    QUnit.test('menu should have four sections for items', function(assert) {
        const $beforeItem = $('<div>').width(150);
        const $centerItem = $('<div>').width(150);
        const $afterItem = $('<div>').width(150);

        this.instance.option({
            items: [
                { location: 'before', locateInMenu: 'auto', template: () => $beforeItem },
                { location: 'center', locateInMenu: 'auto', template: () => $centerItem },
                { location: 'after', locateInMenu: 'auto', template: () => $afterItem },
            ],
            width: 100
        });

        this.overflowMenu.click();
        this.overflowMenu.click();

        const $sections = this.overflowMenu.$element().find('.dx-toolbar-menu-section');

        assert.strictEqual($sections.length, 4, 'four sections was rendered');
        assert.ok($.contains($sections.eq(0).get(0), $beforeItem.get(0)));
        assert.ok($.contains($sections.eq(1).get(0), $centerItem.get(0)));

        assert.ok($.contains($sections.eq(2).get(0), $afterItem.get(0)));
        assert.ok($sections.eq(2).hasClass('dx-toolbar-menu-last-section'), 'border for last section is removed');
    });

    QUnit.test('menu shouldn\'t be closed after click on editors', function(assert) {
        const $beforeItem = $('<div>').width(150);

        this.instance.option({
            items: [
                { location: 'before', locateInMenu: 'auto', template: () => $beforeItem },
            ],
            width: 100
        });

        this.overflowMenu.click();

        $($beforeItem).trigger('dxclick');

        assert.ok(this.overflowMenu.instance().option('opened'), 'dropdown isn\'t closed');
    });

    QUnit.test('menu should be closed after click on button or menu items', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
                { location: 'before', template: () => $('<div>').width(100) },
                { locateInMenu: 'auto', text: 'test text' }
            ],
            width: 100
        });

        this.overflowMenu.click();
        this.overflowMenu.click();

        const $items = this.overflowMenu.$element().find('.dx-list-item');

        this.overflowMenu.click();
        $($items.eq(0)).trigger('dxclick');
        assert.ok(!this.overflowMenu.instance().option('opened'), 'dropdown is closed');

        this.overflowMenu.click();
        $($items.eq(1)).trigger('dxclick');
        assert.ok(!this.overflowMenu.instance().option('opened'), 'dropdown is closed');
    });

    QUnit.test('overflow button should be rendered as list item in dropdown', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
                { location: 'before', template: () => $('<div>').width(100) }
            ],
            width: 100
        });


        this.overflowMenu.click();
        this.overflowMenu.click();

        const $section = this.overflowMenu.$element().find('.dx-toolbar-menu-section').eq(0);

        assert.strictEqual($section.find('.dx-toolbar-menu-action').length, 1, 'click on button should close menu');
        assert.strictEqual($section.find('.dx-toolbar-hidden-button').length, 1, 'button has specific class for override styles');
        assert.strictEqual($section.find('.dx-list-item').text(), 'test text', 'button text was rendered');
    });

    QUnit.test('buttonGroup.locateInMenu: auto -> toolbar.setWidth(100) -> toolbar.openMenu', function(assert) {
        this.instance.option({
            items: [
                { locateInMenu: 'never', template: () => $('<div>').width(100) },
                { locateInMenu: 'auto', widget: 'dxButtonGroup', options: { width: 100, items: [ { text: 'text1' } ] } }
            ]
        });

        const getButtonGroupToolbarItem = () => this.$element.find(`.${BUTTON_GROUP_CLASS}`).closest(`.${TOOLBAR_ITEM_CLASS}`);

        let $buttonGroupToolbarItem = getButtonGroupToolbarItem();
        assert.strictEqual($buttonGroupToolbarItem.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS), false, 'buttonGroup is visible in toolbar');

        this.instance.option('width', 100);

        $buttonGroupToolbarItem = getButtonGroupToolbarItem();
        assert.strictEqual($buttonGroupToolbarItem.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS), true, 'buttonGroup is hidden in toolbar');

        const done = assert.async();

        this.overflowMenu.instance().option('onItemRendered', function(args) {
            assert.strictEqual($(args.itemElement).find(`.${BUTTON_GROUP_CLASS}`).length, 1, 'button group was rendered in menu');
            done();
        });

        this.overflowMenu.click();
    });

    QUnit.test('overflow item should rendered with correct template in menu and in toolbar', function(assert) {
        assert.expect(4);

        const $toolbarTemplate = $('<div>').width(500);
        const $menuTemplate = $('<div>');

        this.instance.option({
            items: [
                {
                    locateInMenu: 'auto',
                    template: () => $toolbarTemplate,
                    menuItemTemplate: () => $menuTemplate
                }
            ],
            width: 1000
        });

        assert.ok($toolbarTemplate.is(':visible'), 'toolbar template was rendered');
        assert.ok($menuTemplate.is(':hidden'), 'menu template won\'t rendered');

        this.instance.option('width', 400);

        this.overflowMenu.instance().option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $menuTemplate.get(0)), 'item was rendered in menu');
            assert.ok($toolbarTemplate.is(':hidden'), 'toolbar template was hidden');
        });

        this.overflowMenu.click();
    });

    QUnit.test('overflow item should be rendered in correct container in menu and in toolbar when locateInMenu is auto (T1102197)', function(assert) {
        assert.expect(2);

        const $itemTemplate = $('<div>itemTemplate</div>').width(500);

        this.instance.option({
            items: [
                {
                    locateInMenu: 'auto',
                    template: () => $itemTemplate,
                }
            ],
            width: 1000
        });

        assert.strictEqual($itemTemplate.parent().hasClass(TOOLBAR_ITEM_CONTENT_CLASS), true, 'template was rendered in correct container');

        this.instance.option('width', 400);

        this.overflowMenu.instance().option('onItemRendered', () => {
            assert.strictEqual($itemTemplate.parent().hasClass(TOOLBAR_ITEM_CONTENT_CLASS), true, 'template was rendered in correct container');
        });

        this.overflowMenu.click();
    });


    QUnit.test('toolbar menu items should have focused state', function(assert) {
        this.instance.option({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    text: 'item1'
                },
                {
                    location: 'center',
                    locateInMenu: 'always',
                    text: 'item2'
                }
            ]
        });

        this.overflowMenu.click();

        const $item1 = $('.dx-list-item').eq(0);
        const $item2 = $('.dx-list-item').eq(1);

        $($item2).trigger('dxpointerdown');
        this.clock.tick(10);

        assert.ok(!$item2.hasClass('dx-state-focused'), 'only item2 is focused');
        assert.ok(!$item1.hasClass('dx-state-focused'), 'only item2 is focused');
    });

    QUnit.test('toolbar menu should have correct item element', function(assert) {
        this.instance.option({
            items: [{ locateInMenu: 'always', text: 'item1' }]
        });

        this.overflowMenu.click();
        this.overflowMenu.click();

        resizeCallbacks.fire();

        this.overflowMenu.click();
        assert.strictEqual($('.dx-list-item').length, 1, 'only one item in menu is rendered');
    });

    QUnit.test('toolbar menu should be rendered after change item visible', function(assert) {
        assert.expect(3);

        this.instance.option({
            items: [{ locateInMenu: 'always', text: 'item1', visible: false }]
        });

        assert.strictEqual(this.overflowMenu.$element().length, 0, 'menu is not rendered');

        this.instance.option('items[0].visible', true);

        assert.strictEqual(this.overflowMenu.$element().length, 1, 'menu is rendered');

        if(!this.overflowMenu.$element().length) return;

        this.overflowMenu.click();

        assert.strictEqual($('.dx-list-item').length, 1, 'item in menu is rendered');
        this.overflowMenu.click();
    });

    QUnit.test('invisible overflow items should be hidden if there no free space for them', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', locateInMenu: 'auto', template: () => $('<div>').width(300) }
            ],
            width: 400
        });

        this.instance.option('items[0].visible', false);
        assert.strictEqual(this.overflowMenu.$element().find(`.${TOOLBAR_ITEM_CLASS}:visible`).length, 0, 'item was hidden');
    });

    QUnit.test('menu should be hidden if all overflow items were hidden', function(assert) {
        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(300) },
                { location: 'before', locateInMenu: 'auto', template: () => $('<div>').width(300) }
            ],
            width: 300
        });

        this.instance.option('items[1].visible', false);

        assert.ok(this.overflowMenu.$element().is(':hidden'), 'menu is hidden');
    });

    QUnit.testInActiveWindow('items should not be rearranged if width is not changed', function(assert) {
        const $input = $('<input>').width(300);

        this.instance.option({
            items: [
                { location: 'before', template: () => $('<div>').width(300) },
                { location: 'before', locateInMenu: 'auto', template: () => $input }
            ],
            width: 300
        });

        this.overflowMenu.click();
        $input.focus();
        resizeCallbacks.fire('height');

        assert.ok($input.is(':focus'), 'focus is not lost');
    });

    QUnit.test('add a custom CSS to item of menu', function(assert) {
        this.instance.option({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        this.overflowMenu.click();

        assert.strictEqual($(`.${TOOLBAR_MENU_SECTION_CLASS} .${LIST_ITEM_CLASS}.test`).length, 1, 'item with the custom CSS');
    });

    QUnit.test('dropDown should use default container', function(assert) {
        this.instance.option({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        this.overflowMenu.click();

        assert.strictEqual(this.$element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 0, 'Toolbar\'s container isn\'t contains a dropDown list');
    });

    QUnit.test('init Toolbar with new menuContainer', function(assert) {
        this.instance.option({
            menuContainer: this.$element,
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        this.overflowMenu.click();

        assert.strictEqual(this.$element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 1, 'Toolbar\'s container contains a dropDown list');
    });

    QUnit.test('change Toolbar menuContainer', function(assert) {
        this.instance.option({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        this.instance.option('menuContainer', this.$element);

        this.overflowMenu.click();

        assert.strictEqual(this.$element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 1, 'Toolbar\'s container contains a dropDown list');
    });
});

QUnit.module('default template', moduleConfig, () => {
    QUnit.test('T430159 menu should be closed after click on item if location is defined', function(assert) {
        const onClickActionStub = sinon.stub();

        this.instance.option({
            items: [
                {
                    location: 'center',
                    text: '123',
                    locateInMenu: 'always',
                    isAction: true,
                    onClick: onClickActionStub
                }
            ],
            width: 100
        });

        this.overflowMenu.click();

        const $items = this.overflowMenu.instance()._popup.$content().find('.dx-list-item');

        $($items.eq(0)).trigger('dxclick');

        assert.ok(!this.overflowMenu.instance().option('opened'), 'dropdown is closed');
        assert.strictEqual(onClickActionStub.callCount, 1, 'onClick was fired');
    });

    ['single', 'multiple'].forEach(selectionMode => {
        QUnit.test(`Click on buttonGroup item inside menu (T977105). selectionMode: ${selectionMode}`, function(assert) {
            const onClickActionStub = sinon.stub();

            this.instance.option({
                items: [ {
                    location: 'center',
                    locateInMenu: 'always',
                    onClick: onClickActionStub,
                    widget: 'dxButtonGroup',
                    options: {
                        items: [ { text: 'left' }, { text: 'center' } ],
                        selectionMode,
                    }
                }]
            });

            this.overflowMenu.click();
            const $items = this.overflowMenu.instance()._popup.$content().find('.dx-buttongroup-item');

            $($items.eq(0)).trigger('dxclick');

            assert.ok(!this.overflowMenu.instance().option('opened'), 'dropdown is closed');
            assert.strictEqual(onClickActionStub.callCount, 1, 'onClick was fired');
        });
    });
});

QUnit.module('adaptivity without hiding in menu', {
    beforeEach: function() {
        this.$element = $('#toolbar');
        this.getToolbarItems = function() {
            return this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        };

        this.MEASURE_SAFE_TEXT = 'xyvxyv';
        const fontStyles = `
            <style nonce="qunit-test">
                .dx-toolbar-label > div,
                .dx-toolbar-label .dx-toolbar-item-content > div {
                    font-family: arial !important;
                }
            </style>
        `;

        this.styles = $(fontStyles).appendTo($('#qunit-fixture'));
    },
    afterEach: function() {
        this.styles.remove();
    }
}, () => {
    QUnit.test('items in before section should have correct sizes, width decreases', function(assert) {
        const toolBar = this.$element.dxToolbar({
            items: [
                { location: 'before', text: this.MEASURE_SAFE_TEXT },
                { location: 'before', text: this.MEASURE_SAFE_TEXT },
                { location: 'before', text: this.MEASURE_SAFE_TEXT }
            ],
            width: 250,
            height: 50
        }).dxToolbar('instance');

        $.each(this.getToolbarItems(), function(index, $item) {
            if(index < 2) {
                assert.roughEqual($($item).outerWidth(), 65, 1, 'Width is correct');
            } else {
                assert.roughEqual($($item).outerWidth(), 60, 1, 'Width is correct');
            }
        });

        toolBar.option('width', 180);

        $.each(this.getToolbarItems(), function(index, $item) {
            if(index < 2) {
                assert.roughEqual($($item).outerWidth(), 65, 1, 'Width is correct');
            } else {
                assert.roughEqual($($item).outerWidth(), 40, 1, 'Width is correct');
            }
        });

        toolBar.option('width', 100);

        assert.roughEqual(this.getToolbarItems().eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual(this.getToolbarItems().eq(1).outerWidth(), 30, 1, 'Width of the second item is correct');
        assert.roughEqual(this.getToolbarItems().eq(2).outerWidth(), 0, 1, 'Width of the third item is correct');
    });

    QUnit.test('items in center section should have correct sizes, width decreases', function(assert) {
        const toolBar = this.$element.dxToolbar({
            items: [
                { location: 'center', text: this.MEASURE_SAFE_TEXT },
                { location: 'center', text: this.MEASURE_SAFE_TEXT },
                { location: 'center', text: this.MEASURE_SAFE_TEXT }
            ],
            width: 250,
            height: 50
        }).dxToolbar('instance');

        $.each(this.getToolbarItems(), function(index, $item) {
            if(index < 2) {
                assert.roughEqual($($item).outerWidth(), 65, 1, 'Width is correct');
            } else {
                assert.roughEqual($($item).outerWidth(), 60, 1, 'Width is correct');
            }
        });

        toolBar.option('width', 150);

        $.each(this.getToolbarItems(), function(index, $item) {
            if(index < 2) {
                assert.roughEqual($($item).outerWidth(), 65, 1, 'Width is correct');
            } else {
                assert.roughEqual($($item).outerWidth(), 10, 1, 'Width is correct');
            }
        });

        toolBar.option('width', 100);

        const $toolbarItems = this.getToolbarItems();

        assert.roughEqual($toolbarItems.eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual($toolbarItems.eq(1).outerWidth(), 30, 2, 'Width of the second item is correct');
        assert.roughEqual($toolbarItems.eq(2).outerWidth(), 0, 1, 'Width of the third item is correct');
    });

    QUnit.test('items in before section should have correct sizes, width increases', function(assert) {
        const toolBar = this.$element.dxToolbar({
            items: [
                { location: 'before', text: this.MEASURE_SAFE_TEXT },
                { location: 'before', text: this.MEASURE_SAFE_TEXT },
                { location: 'before', text: this.MEASURE_SAFE_TEXT }
            ],
            width: 100,
            height: 50
        }).dxToolbar('instance');

        toolBar.option('width', 180);

        let $toolbarItems = this.getToolbarItems();

        assert.roughEqual($toolbarItems.eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual($toolbarItems.eq(1).outerWidth(), 45, 1, 'Width of the second item is correct');
        assert.roughEqual($toolbarItems.eq(2).outerWidth(), 0, 1, 'Width of the third item is correct');

        toolBar.option('width', 260);

        $toolbarItems = this.getToolbarItems();

        assert.roughEqual($toolbarItems.eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual($toolbarItems.eq(1).outerWidth(), 65, 1, 'Width of the second item is correct');
        assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, 'Width of the third item is correct');
    });

    QUnit.test('items in center section should have correct sizes, width increases', function(assert) {
        const toolBar = this.$element.dxToolbar({
            items: [
                { location: 'center', text: this.MEASURE_SAFE_TEXT },
                { location: 'center', text: this.MEASURE_SAFE_TEXT },
                { location: 'center', text: this.MEASURE_SAFE_TEXT }
            ],
            width: 50,
            height: 50
        }).dxToolbar('instance');

        toolBar.option('width', 140);

        let $toolbarItems = this.getToolbarItems();

        assert.roughEqual($toolbarItems.eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual($toolbarItems.eq(1).outerWidth(), 20, 1, 'Width of the second item is correct');
        assert.roughEqual($toolbarItems.eq(2).outerWidth(), 0, 1, 'Width of the third item is correct');

        toolBar.option('width', 250);

        $toolbarItems = this.getToolbarItems();

        assert.roughEqual($toolbarItems.eq(0).outerWidth(), 65, 1, 'Width of the first item is correct');
        assert.roughEqual($toolbarItems.eq(1).outerWidth(), 65, 1, 'Width of the second item is correct');
        assert.roughEqual($toolbarItems.eq(2).outerWidth(), 25, 1, 'Width of the third item is correct');
    });
});

QUnit.module('Toolbar disposing', () => {
    QUnit.test('_dimensionChanged call should not raise any error if toolbar is disposed (T1147410)', function(assert) {
        const toolbar = $('#toolbar').dxToolbar().dxToolbar('instance');

        toolbar.dispose();

        try {
            toolbar._dimensionChanged();
        } catch(e) {
            assert.ok(false, e);
        } finally {
            assert.ok(true, 'the exception is not thrown');
        }
    });
});

QUnit.module('Waiting fonts for material theme', moduleConfig, () => {
    QUnit.test('Toolbar calls font-waiting function for labels (T736793)', function(assert) {
        const estimatedData = [
            { args: [ 'text1', '400' ], description: 'call for the first label' },
            { args: [ 'text2', '400' ], description: 'call for the second label' },
            { args: [ 'text3', '400' ], description: 'call for the third label' }
        ];

        let executionCount = 0;
        const origIsMaterial = themes.isMaterial;
        const done = assert.async(3);

        themes.isMaterial = () => true;

        themes.waitWebFont = function(text, fontWeight) {
            const data = estimatedData[executionCount];
            assert.deepEqual([text, fontWeight], data.args, data.description);
            executionCount++;
            done();
        };

        this.instance.option({
            items: [
                { location: 'before', text: 'text1' },
                { location: 'before', text: 'text2' },
                { location: 'before', text: 'text3' }
            ],
            width: 250,
            height: 50
        });

        this.clock.tick(10);
        themes.isMaterial = origIsMaterial;
    });


    QUnit.test('Toolbar calls _dimensionChanged function in Material theme to recalculate labels (T736793)', function(assert) {
        const estimatedData = [
            { args: [ 'text1', '400' ], description: 'call for the first label' },
            { args: [ 'text2', '400' ], description: 'call for the second label' },
            { args: [ 'text3', '400' ], description: 'call for the third label' }
        ];

        let executionCount = 0;
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = () => true;

        const done = assert.async(5);

        themes.waitWebFont = (text, fontWeight) => {
            const data = estimatedData[executionCount];
            assert.deepEqual([text, fontWeight], data.args, data.description);
            executionCount++;
            done();
        };

        ToolbarBase.prototype._dimensionChanged = () => {
            assert.ok(true, 'dimensionChanged is called');
            done();
        };

        this.instance.option({
            items: [
                { location: 'before', text: 'text1' },
                { location: 'before', text: 'text2' },
                { location: 'before', text: 'text3' }
            ],
            width: 250,
            height: 50
        });

        this.clock.tick(15);

        themes.isMaterial = origIsMaterial;
    });
});
