import 'ui/action_sheet';
import 'ui/drop_down_menu';
import errors from 'core/errors';

import $ from 'jquery';
import Toolbar from 'ui/toolbar';
import ToolbarBase from 'ui/toolbar/ui.toolbar.base';
import fx from 'animation/fx';
import resizeCallbacks from 'core/utils/resize_callbacks';
import themes from 'ui/themes';
import eventsEngine from 'events/core/events_engine';
import { deferUpdate } from 'core/utils/common';

import 'ui/button_group';

import 'common.css!';
import 'generic_light.css!';
import 'ui/button';
import 'ui/tabs';

$('#qunit-fixture').html('<style>\
        #toolbarWithMenu .dx-toolbar-menu-container {\
            width: 100px;\
        }\
        .dx-list-item {\
            /* NOTE: to avoid decimal values in geometry */\
            line-height: 1;\
        }\
    </style>\
    \
    <div id="toolbar"></div>\
    <div id="toolbarWithMenu"></div>\
    <div id="widget"></div>\
    <div id="widthRootStyle" style="width: 300px;"></div>');

const TOOLBAR_CLASS = 'dx-toolbar';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_ITEM_INVISIBLE_CLASS = 'dx-toolbar-item-invisible';
const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_BEFORE_CONTAINER_CLASS = 'dx-toolbar-before';
const TOOLBAR_AFTER_CONTAINER_CLASS = 'dx-toolbar-after';
const TOOLBAR_CENTER_CONTAINER_CLASS = 'dx-toolbar-center';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_MENU_BUTTON_CLASS = 'dx-toolbar-menu-button';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const LIST_ITEM_CLASS = 'dx-list-item';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TEXTEDITOR_CLASS = 'dx-texteditor';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';

const BASE_TEXTEDITOR_WIDTH = '150px';

QUnit.module('render', {
    beforeEach: function() {
        this.element = $('#toolbar');
    }
}, () => {
    QUnit.test('label correctly fits into container', function(assert) {
        this.element.dxToolbar({
            items: [
                { location: 'before', text: 'Summary' }
            ]
        });

        const labelElement = this.element.find('.' + TOOLBAR_ITEM_CLASS)[0];
        const labelMaxWidth = parseInt(labelElement.style.maxWidth);

        labelElement.style.maxWidth = '';

        const labelWidth = labelElement.getBoundingClientRect().width;
        assert.ok(labelWidth <= labelMaxWidth, 'Real label width less or equal to the max width');
    });

    QUnit.test('items - long labels', function(assert) {
        this.element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', options: { text: 'Before Button' } },
                { location: 'before', widget: 'dxButton', options: { text: 'Second Before Button' } },
                { location: 'after', widget: 'dxButton', options: { text: 'After Button' } },
                { location: 'center', text: 'Very very very very very very very very very very very long label' }
            ],
            width: '500px'
        });

        const $label = this.element.find('.' + TOOLBAR_LABEL_CLASS);

        assert.equal($label.children().eq(0).css('text-overflow'), 'ellipsis');
        assert.equal($label.children().eq(0).css('overflow'), 'hidden');

        const $centerSection = this.element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS);
        const beforeSectionWidth = this.element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width;
        const afterSectionWidth = this.element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

        assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
        assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

        const maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

        assert.ok(parseFloat($label.css('max-width')) <= maxLabelWidth);

    });

    QUnit.test('items - long custom html', function(assert) {
        this.element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', options: { text: 'Before Button' } },
                { location: 'before', widget: 'dxButton', options: { text: 'Second Before Button' } },
                { location: 'after', widget: 'dxButton', options: { text: 'After Button' } },
                { location: 'center', html: '<b>Very very very very very very very very very very very long label</b>' }
            ],
            width: 500
        });

        const $label = this.element.find('.' + TOOLBAR_LABEL_CLASS);

        assert.equal($label.children().eq(0).css('text-overflow'), 'ellipsis');
        assert.equal($label.children().eq(0).css('overflow'), 'hidden');

        const $centerSection = this.element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS); const beforeSectionWidth = this.element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width; const afterSectionWidth = this.element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

        assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
        assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

        const maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

        assert.ok(parseFloat($label.css('max-width')) <= maxLabelWidth);
    });

    QUnit.test('Center element has correct margin with RTL', function(assert) {
        const element = this.element.dxToolbar({
            rtlEnabled: true,
            items: [
                { location: 'before', text: 'before' },
                { location: 'center', text: 'center' }
            ]
        });
        const margin = element.find('.' + TOOLBAR_CLASS + '-center').get(0).style.margin;

        assert.equal(margin, '0px auto', 'aligned by center');
    });

    ['before', 'center', 'after', undefined].forEach((location) => {
        ['never', 'auto', 'always', undefined].forEach((locateInMenu) => {
            const ITEM_WIDTH = 100;
            [10, 1000].forEach((toolbarWidth) => {
                QUnit.test(`Change item location at runtime (T844890), location: ${location}, locateInMenu: ${locateInMenu}, width: ${toolbarWidth}`, function(assert) {
                    const $toolbar = this.element.dxToolbar({
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
                            QUnit.assert.equal($menuItems.length, 1, 'menu items count for ');
                            QUnit.assert.equal($beforeItems.length, 0, 'items count with before location value');
                            QUnit.assert.equal($centerItems.length, 0, 'items count with center location value');
                            QUnit.assert.equal($afterItems.length, 0, 'items count with after location value');
                        } else {
                            QUnit.assert.equal($menuItems.length, 0, 'menu items count');
                            QUnit.assert.equal($beforeItems.length, expected.before || 0, 'items count with before location value');
                            QUnit.assert.equal($centerItems.length, expected.center || 0, 'items count with center location value');
                            QUnit.assert.equal($afterItems.length, expected.after || 0, 'items count with after location value');
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
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        ToolbarBase.prototype._waitParentAnimationFinished = () => Promise.resolve();

        const element = this.element.dxToolbar({
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

        themes.isMaterial = origIsMaterial;
    });

    const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';

    QUnit.test('Toolbar with compact mode has the compact class', function(assert) {
        const $toolbar = this.element.dxToolbar({
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
        const element = this.element.dxToolbar({
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

        this.element.dxToolbar({
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
        assert.equal(this.element.find('.custom-template').length, 1);
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
            renderToolbar(this.element, [{
                location: 'after',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'after',
                locateInMenu: 'always',
                text: 'item2'
            }]);

            const toolbarItems = this.element.find('.dx-toolbar-after').children();
            assert.equal(toolbarItems.length, 2, 'All items are rendered');

            assert.equal(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.equal(toolbarItems[1].innerText.trim(), '', 'second item is menu button');
        });

        QUnit.test(`Toolbar simple items rendered correctly in asynchronous template. Items position: before, deferRendering=${deferRendering}.`, function(assert) {
            renderToolbar(this.element, [{
                location: 'before',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'before',
                locateInMenu: 'never',
                text: 'item2'
            } ]);

            const toolbarItems = this.element.find('.dx-toolbar-before').children();
            assert.equal(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.equal(toolbarItems[1].innerText.trim(), 'item2', 'second item is simple item');
        });

        QUnit.test(`Toolbar simple items rendered correctly in asynchronous template. Items position: after, deferRendering=${deferRendering}.`, function(assert) {
            renderToolbar(this.element, [{
                location: 'after',
                locateInMenu: 'never',
                text: 'item1'
            }, {
                location: 'after',
                locateInMenu: 'never',
                text: 'item2'
            } ]);

            const toolbarItems = this.element.find('.dx-toolbar-after').children();
            assert.equal(toolbarItems[0].innerText.trim(), 'item1', 'first item is simple item');
            assert.equal(toolbarItems[1].innerText.trim(), 'item2', 'second item is simple item');
        });
    });
});

QUnit.module('Deprecated options', {
    afterEach: function() {
        this.stub.restore();
    }
}, () => {
    QUnit.test('show warning if deprecated "height" option is used', function(assert) {
        assert.expect(2);
        this.stub = sinon.stub(errors, 'log', () => {
            assert.deepEqual(errors.log.lastCall.args, [
                'W0001',
                'dxToolbar',
                'height',
                '20.1',
                'Functionality associated with this option is not intended for the Toolbar widget.'
            ], 'args of the log method');
        });

        $('#toolbar').dxToolbar({
            items: [ { location: 'before', text: 'text1' } ],
            height: 50
        });

        assert.strictEqual(this.stub.callCount, 1, 'error.log.callCount');
    });

    QUnit.test('Warning messages not displaying if deprecated "height" option not used', function(assert) {
        assert.expect(1);
        this.stub = sinon.stub(errors, 'log', () => {
            assert.strictEqual(true, false, 'error.log should not be called');
        });

        $('#toolbar').dxToolbar({
            items: [ { location: 'before', text: 'text1' } ]
        });

        assert.strictEqual(this.stub.callCount, 0, 'error.log.callCount');
    });
});

QUnit.module('toolbar with menu', {
    beforeEach: function() {
        this.element = $('#toolbar');
        this.instance = this.element.dxToolbar()
            .dxToolbar('instance');

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('menu button click doesn\'t dispatch action', function(assert) {
        let count = 0;
        this.element.dxToolbar({
            onItemClick: function() {
                count++;
            },
            items: [
                { locateInMenu: 'always', text: 'item2' }
            ],
            submenuType: 'dropDownMenu'
        });

        const button = this.element.find('.' + TOOLBAR_MENU_BUTTON_CLASS).get(0);
        $(button).trigger('dxclick');
        assert.equal(count, 0, 'onItemClick was not executed');
    });

    QUnit.test('windowResize should not show/hide menu that doesn\'t created', function(assert) {
        this.element.dxToolbar({
            submenuType: 'actionSheet',
            items: [],
        });

        resizeCallbacks.fire();
        assert.ok(true);
    });

    QUnit.test('option visible for menu items', function(assert) {
        const instance = this.element.dxToolbar({
            submenuType: 'dropDownMenu',
            items: [
                { locateInMenu: 'always', text: 'a', visible: true }
            ],
        }).dxToolbar('instance');

        assert.strictEqual(this.element.find('.' + DROP_DOWN_MENU_CLASS).length, 1, 'dropdown was rendered');

        instance.option('items', [{ locateInMenu: 'always', text: 'a', visible: false }]);
        assert.strictEqual(this.element.find('.' + DROP_DOWN_MENU_CLASS).length, 0, 'dropdown was not rendered');
    });

    QUnit.test('changing field of item in submenu', function(assert) {
        this.element.dxToolbar({
            items: [
                { locateInMenu: 'always', disabled: true }
            ],
            submenuType: 'actionSheet'
        });

        const $button = this.element.find('.' + TOOLBAR_MENU_BUTTON_CLASS);
        $($button).trigger('dxclick');
        this.element.dxToolbar('option', 'items[0].disabled', false);
        assert.equal($('.dx-state-disabled').length, 0, 'disabled state changed');
    });

    QUnit.test('dropdown menu should have correct position', function(assert) {
        this.element.dxToolbar({
            items: [
                { locateInMenu: 'always', disabled: true }
            ],
            submenuType: 'dropDownMenu'
        });

        const $button = this.element.find('.' + DROP_DOWN_MENU_CLASS); const ddMenu = $button.dxDropDownMenu('instance'); const position = ddMenu.option('popupPosition');

        assert.equal(position.at, 'bottom right', 'at position is correct');
        assert.equal(position.my, 'top right', 'my position is correct');
    });
});

QUnit.module('disabled state', () => {
    [true, false, undefined, 'not declared'].forEach((isToolbarDisabled) => {
        [true, false, undefined, 'not declared'].forEach((isButtonDisabled) => {

            const checkClickHandlers = (assert, itemClickHandler, buttonClickHandler, buttonDisabled, toolbarDisabled, locateInMenu) => {
                if(locateInMenu !== 'never') {
                    return;
                }

                assert.strictEqual(itemClickHandler.callCount, toolbarDisabled ? 0 : 1, `onItemClick ${itemClickHandler.callCount}`);
                assert.strictEqual(buttonClickHandler.callCount, buttonDisabled || toolbarDisabled ? 0 : 1, `onButtonClick ${buttonClickHandler.callCount}`);
            };

            const checkDisabledState = (assert, $button, $toolbar, expectedButtonDisabled, expectedToolbarDisabled) => {
                assert.strictEqual($button.dxButton('option', 'disabled'), expectedButtonDisabled, `button.disabled ${expectedButtonDisabled}`);
                assert.strictEqual($toolbar.dxToolbar('option', 'disabled'), expectedToolbarDisabled, `toolbar.disabled ${expectedToolbarDisabled}`);
            };

            [true, false, undefined].forEach((isToolbarDisabledNew) => {
                [true, false, undefined].forEach((isButtonDisabledNew) => {
                    [true, false].forEach((changeDisabledOrder) => {
                        ['never', 'always'].forEach((locateInMenu) => {
                            QUnit.test(`new dxToolbar({
                                    toolbar.disabled: ${isToolbarDisabled},
                                    button.disabled: ${isButtonDisabled}),
                                    toolbar.disabled new: ${isToolbarDisabledNew},
                                    button.disabled new: ${isButtonDisabledNew},
                                    changeDisableOrder: ${changeDisabledOrder},
                                    locateInMenu: ${locateInMenu}`,
                            function(assert) {
                                const itemClickHandler = sinon.spy();
                                const buttonClickHandler = sinon.spy();
                                const toolbarOptions = {
                                    onItemClick: itemClickHandler,
                                    items: [{
                                        location: 'after',
                                        locateInMenu: locateInMenu,
                                        widget: 'dxButton',
                                        options: {
                                            onClick: buttonClickHandler
                                        }
                                    }]
                                };

                                if(isToolbarDisabled !== 'not declared') {
                                    toolbarOptions.disabled = isToolbarDisabled;
                                }
                                if(isButtonDisabled !== 'not declared') {
                                    toolbarOptions.items[0].options.disabled = isButtonDisabled;
                                }

                                const $element = $('#toolbar');
                                $element.dxToolbar(toolbarOptions);

                                const $button = locateInMenu === 'never' ? $element.find(`.${TOOLBAR_ITEM_CLASS} .dx-button`).eq(0) : $element.find(`.${DROP_DOWN_MENU_CLASS}`).eq(0);

                                const expectedToolbarValue = isToolbarDisabled !== 'not declared' ? isToolbarDisabled : false;
                                const expectedButtonValue = isButtonDisabled !== 'not declared' ? isButtonDisabled : false;

                                checkDisabledState(assert, $button, $element, locateInMenu === 'never' ? expectedButtonValue : false, expectedToolbarValue);

                                eventsEngine.trigger($button, 'dxclick');
                                checkClickHandlers(assert, itemClickHandler, buttonClickHandler, expectedButtonValue, expectedToolbarValue, locateInMenu);

                                itemClickHandler.reset();
                                buttonClickHandler.reset();

                                if(changeDisabledOrder) {
                                    $button.dxButton('option', 'disabled', isButtonDisabledNew);
                                    $element.dxToolbar('option', 'disabled', isToolbarDisabledNew);
                                } else {
                                    $element.dxToolbar('option', 'disabled', isToolbarDisabledNew);
                                    checkDisabledState(assert, $button, $element, locateInMenu === 'never' ? expectedButtonValue : false, isToolbarDisabledNew);
                                    $button.dxButton('option', 'disabled', isButtonDisabledNew);
                                }

                                checkDisabledState(assert, $button, $element, isButtonDisabledNew, isToolbarDisabledNew);

                                eventsEngine.trigger($button, 'dxclick');
                                checkClickHandlers(assert, itemClickHandler, buttonClickHandler, isButtonDisabledNew, isToolbarDisabledNew, locateInMenu);
                            });
                        });
                    });
                });
            });
        });
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
        const $element = $('#widget').dxToolbar({ width: 400 }); const instance = $element.dxToolbar('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxToolbar(); const instance = $element.dxToolbar('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxToolbar(); const instance = $element.dxToolbar('instance'); const customWidth = 400;

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

        const $center = $element.find('.dx-toolbar-center').eq(0); const $label = $center.children('.dx-toolbar-label').eq(0); const $after = $element.find('.dx-toolbar-after').eq(0);

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
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', text: title },
                { location: 'after', template: function() { return $('<div>').width(50); } }
            ],
            width: 400
        });

        const $center = $element.find('.dx-toolbar-center').eq(0);
        assert.equal(parseInt($center.css('margin-left')), 115);
        assert.equal(parseInt($center.css('margin-right')), 65);
        assert.equal($center.css('float'), 'none');
        assert.equal($center.width(), 220);
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
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', text: title },
                { location: 'after', template: function() { return $('<div>').width(100); } }
            ],
            width: 400
        });

        const $center = $element.find('.dx-toolbar-center').eq(0);
        assert.equal(parseInt($center.css('margin-left')), 65);
        assert.equal(parseInt($center.css('margin-right')), 115);
        assert.equal($center.css('float'), 'right');
        assert.equal($center.width(), 220);
    });

    QUnit.test('title should be centered considering different before/after block widths after visible option change', function(assert) {
        const title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); }, visible: false },
                { location: 'center', text: title }
            ],
            width: 400
        });
        $element.dxToolbar('option', 'items[0].visible', true);

        const $center = $element.find('.dx-toolbar-center').eq(0);
        assert.equal(parseInt($center.css('margin-left')), 65);
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

        const $center = $element.find('.dx-toolbar-center').eq(0);
        assert.equal(parseInt($center.css('margin-left')), 115);
        assert.equal(parseInt($center.css('margin-right')), 65);
        assert.equal($center.css('float'), 'none');
        assert.equal($center.width(), 220);
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

QUnit.module('adaptivity', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('center section should be at correct position for huge after section', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(200); } },
            ],
            width: 400
        });
        const $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);
        const $after = $element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

        assert.equal($center.offset().left + $center.outerWidth(), $after.offset().left, 'center has correct position');
    });

    QUnit.test('items in center section should be at correct position after resize', function(assert) {
        const $item = $('<div>').width(50);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $item; } },
                { location: 'after', template: function() { return $('<div>').width(200); } },
            ],
            width: 400
        });

        $element.dxToolbar('option', 'width', 1000);

        const elementCenter = $element.offset().left + $element.outerWidth() * 0.5;
        const itemCenter = $item.offset().left + $item.outerWidth() * 0.5;

        assert.equal(itemCenter, elementCenter, 'item has correct position');
    });

    QUnit.test('center section should be at correct position for huge before section', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(200); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(50); } },
            ],
            width: 400
        });
        const $before = $element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0);
        const $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);


        assert.equal($center.offset().left, $before.offset().left + $before.outerWidth(), 'center has correct position');
    });

    QUnit.test('center section should be at correct position for huge after section after change size', function(assert) {
        const $item = $('<div>').width(200);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $item; } },
            ],
            width: 400
        });
        const $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);
        const $after = $element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

        $item.width(190);
        resizeCallbacks.fire();

        assert.equal($center.get(0).getBoundingClientRect().right, $after.get(0).getBoundingClientRect().left, 'center has correct position');
    });

    QUnit.test('center section should be at correct position for huge before section after change size', function(assert) {
        const $item = $('<div>').width(200);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $item; } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(50); } },
            ],
            width: 400
        });
        const $before = $element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0);
        const $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);

        $item.width(190);
        resizeCallbacks.fire();

        assert.equal($center.get(0).getBoundingClientRect().left, $before.get(0).getBoundingClientRect().right, 'center has correct position');
    });

    QUnit.test('overflow items should be hidden if there is no free space for them', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const $visibleItems = $element.find('.' + TOOLBAR_ITEM_CLASS + ':visible');
        assert.equal($visibleItems.length, 3, 'two items was hidden');
    });

    QUnit.test('overflow items should be shown if there is free space for them after resize', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(60); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        $element.dxToolbar('option', 'width', 1000);
        const $visibleItems = $element.find('.' + TOOLBAR_ITEM_CLASS + ':visible');
        assert.equal($visibleItems.length, 5, 'all items is visible');
    });

    QUnit.test('dropdown menu should be rendered if there is hidden overflow items', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.equal($dropDownMenu.length, 1);
    });

    QUnit.test('dropdown menu button should be invisible if there is hidden invisible overflow items', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'after', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { locateInMenu: 'always', visible: false, template: function() { return $('<div>').width(100); } }
            ]
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

        assert.equal($dropDownMenu.length, 1, 'button is rendered');
        assert.notOk($dropDownMenu.is(':visible'), 'button is invisible');
    });

    QUnit.test('all overflow items should be hidden on render', function(assert) {
        const $element = $('#toolbarWithMenu').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } }
            ],
            width: 190
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.equal($dropDownMenu.dxDropDownMenu('option', 'items').length, 2);
    });

    QUnit.test('overflow items should not be rendered twice after resize', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } }
            ],
            width: 400
        });

        $element.dxToolbar('option', 'width', 230);

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        $dropDownMenu.dxDropDownMenu('open');
        $dropDownMenu.dxDropDownMenu('close');
        $element.dxToolbar('option', 'width', 228);

        assert.equal($dropDownMenu.dxDropDownMenu('option', 'items').length, 1);
    });

    QUnit.test('dropdown menu should be rendered if there is hidden overflow items after resize', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 1000
        });

        $element.dxToolbar('option', 'width', 400);
        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.equal($dropDownMenu.length, 1);
    });

    QUnit.test('dropdown menu shouldn\'t be closed during resize with open menu if menu has items', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

        dropDown.open();

        $element.dxToolbar('option', 'width', 500);
        assert.equal(dropDown.option('opened'), true);
    });

    QUnit.test('dropdown menu should be closed if after resize with open menu all items become visible', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

        dropDown.open();

        $element.dxToolbar('option', 'width', 1000);
        assert.equal(dropDown.option('opened'), false);
    });

    QUnit.test('dropdown menu strategy should be used if there is overflow widget', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'center', locateInMenu: 'auto', widget: 'dxButton', options: {} }
            ],
            submenuType: 'actionSheet',
            width: 100
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.equal($dropDownMenu.length, 1);
    });

    QUnit.test('dropdown menu strategy should be used if there is overflow widget, items: [{ locateInMenu: "auto", widget: "dxButton", showText: "inMenu" }]', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test' }, showText: 'inMenu' }
            ]
        });

        const $buttonText = $element.find('.dx-button-text');

        assert.equal($buttonText.length, 1);
        assert.ok($buttonText.is(':hidden'));
    });

    QUnit.test('dropdown menu strategy should be used if there is overflow widget, items: [{ location: "center", locateInMenu: "auto" }]', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'center', locateInMenu: 'auto', text: 'test' }
            ],
            submenuType: 'actionSheet',
            width: 100
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.equal($dropDownMenu.length, 1);
    });

    QUnit.test('visibility of dropdown menu should be changed if overflow items was hidden/shown after resize', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });
        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

        $element.dxToolbar('option', 'width', 1000);
        assert.ok($dropDownMenu.is(':hidden'), 'menu is hidden');

        $element.dxToolbar('option', 'width', 400);
        assert.ok($dropDownMenu.is(':visible'), 'menu is visible');
    });

    QUnit.test('hidden overflow items should be rendered in menu', function(assert) {
        const $item = $('<div>').width(100);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $item; } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
        });

        dropDown.open();
    });

    QUnit.test('items with locateInMenu == \'always\' should be rendered in menu if there is free space for them', function(assert) {
        const $item = $('<div>').width(100);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'center', locateInMenu: 'always', template: function() { return $item; } }
            ],
            width: 1000
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
        });

        dropDown.open();
    });

    QUnit.test('visible overflow items should be moved back into widget after resize', function(assert) {
        const $item = $('<div>').width(100);
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $item; } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        });

        const $itemParent = $item.parent();
        const dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

        dropDown.open();
        dropDown.close();
        $element.dxToolbar('option', 'width', 1000);
        assert.ok($item.parent().is($itemParent), 'item was rendered in toolbar');
    });

    QUnit.test('dropdown menu should have four sections for items', function(assert) {
        const $beforeItem = $('<div>').width(150);
        const $centerItem = $('<div>').width(150);
        const $afterItem = $('<div>').width(150);

        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', locateInMenu: 'auto', template: function() { return $beforeItem; } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $centerItem; } },
                { location: 'after', locateInMenu: 'auto', template: function() { return $afterItem; } },
            ],
            width: 100
        });

        const $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDown.dxDropDownMenu('instance');

        dropDown.open();
        dropDown.close();

        const $sections = $dropDown.find('.dx-toolbar-menu-section');

        assert.equal($sections.length, 4, 'four sections was rendered');
        assert.ok($.contains($sections.eq(0).get(0), $beforeItem.get(0)));
        assert.ok($.contains($sections.eq(1).get(0), $centerItem.get(0)));

        assert.ok($.contains($sections.eq(2).get(0), $afterItem.get(0)));
        assert.ok($sections.eq(2).hasClass('dx-toolbar-menu-last-section'), 'border for last section is removed');
    });

    QUnit.test('dropdown menu shouldn\'t be closed after click on editors', function(assert) {
        const $beforeItem = $('<div>').width(150);

        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', locateInMenu: 'auto', template: function() { return $beforeItem; } },
            ],
            width: 100
        });

        const $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDown.dxDropDownMenu('instance');
        dropDown.open();

        $($beforeItem).trigger('dxclick');

        assert.ok(dropDown.option('opened'), 'dropdown isn\'t closed');
    });

    QUnit.test('dropdown menu should be closed after click on button or menu items', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { locateInMenu: 'auto', text: 'test text' }
            ],
            width: 100
        });

        const $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS);
        const dropDown = $dropDown.dxDropDownMenu('instance');

        dropDown.open();
        dropDown.close();

        const $items = $element.find('.dx-list-item');

        dropDown.open();
        $($items.eq(0)).trigger('dxclick');
        assert.ok(!dropDown.option('opened'), 'dropdown is closed');

        dropDown.open();
        $($items.eq(1)).trigger('dxclick');
        assert.ok(!dropDown.option('opened'), 'dropdown is closed');
    });

    QUnit.test('overflow button should be rendered as list item in dropdown', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
                { location: 'before', template: function() { return $('<div>').width(100); } }
            ],
            width: 100
        });

        const $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDown.dxDropDownMenu('instance');

        dropDown.open();
        dropDown.close();

        const $section = $dropDown.find('.dx-toolbar-menu-section').eq(0);

        assert.equal($section.find('.dx-toolbar-menu-action').length, 1, 'click on button should close menu');
        assert.equal($section.find('.dx-toolbar-hidden-button').length, 1, 'button has specific class for override styles');
        assert.equal($section.find('.dx-list-item').text(), 'test text', 'button text was rendered');
    });

    QUnit.test('buttonGroup.locateInMenu: auto -> toolbar.setWidth(100) -> toolbar.openMenu', function(assert) {
        const toolbar = $('#widget').dxToolbar({
            items: [
                { locateInMenu: 'never', template: function() { return $('<div>').width(100); } },
                { locateInMenu: 'auto', widget: 'dxButtonGroup', options: { width: 100, items: [ { text: 'text1' } ] } }
            ]
        }).dxToolbar('instance');

        const getButtonGroupToolbarItem = () => toolbar.$element().find(`.${BUTTON_GROUP_CLASS}`).closest(`.${TOOLBAR_ITEM_CLASS}`);

        let $buttonGroupToolbarItem = getButtonGroupToolbarItem();
        assert.equal($buttonGroupToolbarItem.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS), false, 'buttonGroup is visible in toolbar');

        toolbar.option('width', 100);
        $buttonGroupToolbarItem = getButtonGroupToolbarItem();
        assert.equal($buttonGroupToolbarItem.hasClass(TOOLBAR_ITEM_INVISIBLE_CLASS), true, 'buttonGroup is hidden in toolbar');

        const done = assert.async();
        const $dropDown = toolbar.$element().find('.' + DROP_DOWN_MENU_CLASS);
        const dropDown = $dropDown.dxDropDownMenu('instance');
        dropDown.option('onItemRendered', function(args) {
            assert.equal($(args.itemElement).find(`.${BUTTON_GROUP_CLASS}`).length, 1, 'button group was rendered in menu');
            done();
        });
        dropDown.open();
    });

    QUnit.test('overflow item should rendered with correct template in menu and in toolbar', function(assert) {
        assert.expect(4);

        const $toolbarTemplate = $('<div>').width(500); const $menuTemplate = $('<div>');

        const $element = $('#widget').dxToolbar({
            items: [
                {
                    locateInMenu: 'auto',
                    template: function() { return $toolbarTemplate; },
                    menuItemTemplate: function() { return $menuTemplate; }
                }
            ],
            width: 1000
        });

        assert.ok($toolbarTemplate.is(':visible'), 'toolbar template was rendered');
        assert.ok($menuTemplate.is(':hidden'), 'menu template won\'t rendered');

        $element.dxToolbar('option', 'width', 400);

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.option('onItemRendered', function(args) {
            assert.ok($.contains($(args.itemElement).get(0), $menuTemplate.get(0)), 'item was rendered in menu');
            assert.ok($toolbarTemplate.is(':hidden'), 'toolbar template was hidden');
        });

        dropDown.open();
    });

    QUnit.test('toolbar menu should have correct focused element', function(assert) {
        const $element = $('#widget').dxToolbar({
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


        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        if(!dropDown.option('focusStateEnabled')) {
            assert.expect(0);
            return;
        }


        dropDown.open();

        const $item1 = $('.dx-list-item').eq(0); const $item2 = $('.dx-list-item').eq(1);

        $($item2).trigger('dxpointerdown');
        this.clock.tick();

        assert.ok($item2.hasClass('dx-state-focused'), 'only item2 is focused');
        assert.ok(!$item1.hasClass('dx-state-focused'), 'only item2 is focused');
    });

    QUnit.test('toolbar menu should have correct item element', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [{ locateInMenu: 'always', text: 'item1' }]
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.open();
        dropDown.close();

        resizeCallbacks.fire();

        dropDown.open();
        assert.equal($('.dx-list-item').length, 1, 'only one item in menu is rendered');
    });

    QUnit.test('toolbar menu should be rendered after change item visible', function(assert) {
        assert.expect(3);

        const $element = $('#widget').dxToolbar({
            items: [{ locateInMenu: 'always', text: 'item1', visible: false }]
        });

        let $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

        assert.equal($dropDownMenu.length, 0, 'menu is not rendered');

        const toolbar = $element.dxToolbar('instance');

        toolbar.option('items[0].visible', true);
        $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

        assert.equal($dropDownMenu.length, 1, 'menu is rendered');

        if(!$dropDownMenu.length) return;

        const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.open();

        assert.equal($('.dx-list-item').length, 1, 'item in menu is rendered');
        dropDown.close();
    });

    QUnit.test('invisible overflow items should be hidden if there no free space for them', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', locateInMenu: 'auto', template: function() { return $('<div>').width(300); } }
            ],
            width: 400
        });

        $element.dxToolbar('option', 'items[0].visible', false);
        assert.equal($element.find('.' + TOOLBAR_ITEM_CLASS + ':visible').length, 0, 'item was hidden');
    });

    QUnit.test('menu should be hidden if all overflow items were hidden', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(300); } },
                { location: 'before', locateInMenu: 'auto', template: function() { return $('<div>').width(300); } }
            ],
            width: 300
        });

        $element.dxToolbar('option', 'items[1].visible', false);

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
        assert.ok($dropDownMenu.is(':hidden'), 'menu is hidden');
    });

    QUnit.testInActiveWindow('items should not be rearranged if width is not changed', function(assert) {
        const $input = $('<input>').width(300);

        ToolbarBase.prototype._waitParentAnimationFinished = () => Promise.resolve();

        const $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(300); } },
                { location: 'before', locateInMenu: 'auto', template: function() { return $input; } }
            ],
            width: 300
        });
        const dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

        dropDown.open();
        $input.focus();
        resizeCallbacks.fire('height');

        assert.ok($input.is(':focus'), 'focus is not lost');
    });

    QUnit.test('add a custom CSS to item of menu', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        const $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDownMenu.dxDropDownMenu('instance');

        dropDown.open();

        assert.equal($('.' + TOOLBAR_MENU_SECTION_CLASS + ' .' + LIST_ITEM_CLASS + '.test').length, 1, 'item with the custom CSS');
    });

    QUnit.test('dropDown should use default container', function(assert) {
        const $element = $('#widget').dxToolbar({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        $element.find(`.${DROP_DOWN_MENU_CLASS}`).trigger('dxclick');

        assert.strictEqual($element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 0, 'Toolbar\'s container isn\'t contains a dropDown list');
    });

    QUnit.test('init Toolbar with new menuContainer', function(assert) {
        const $element = $('#widget');

        $element.dxToolbar({
            menuContainer: $element,
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        });

        $element.find(`.${DROP_DOWN_MENU_CLASS}`).trigger('dxclick');

        assert.strictEqual($element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 1, 'Toolbar\'s container contains a dropDown list');
    });

    QUnit.test('change Toolbar menuContainer', function(assert) {
        const $element = $('#widget');

        const instance = $element.dxToolbar({
            items: [
                {
                    location: 'before',
                    locateInMenu: 'always',
                    cssClass: 'test'
                }
            ]
        }).dxToolbar('instance');

        instance.option('menuContainer', $element);

        $element.find(`.${DROP_DOWN_MENU_CLASS}`).trigger('dxclick');

        assert.strictEqual($element.find(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`).length, 1, 'Toolbar\'s container contains a dropDown list');
    });
});

QUnit.module('default template', {
    prepareItemTest: function(data) {
        const toolbar = new Toolbar($('<div>'), {
            items: [data]
        });

        return toolbar.itemElements().eq(0).find('.dx-item-content').contents();
    }
}, () => {
    QUnit.test('T430159 dropdown menu should be closed after click on item if location is defined', function(assert) {
        const onClickActionStub = sinon.stub();

        const $element = $('#widget').dxToolbar({
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

        const $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS); const dropDown = $dropDown.dxDropDownMenu('instance');

        dropDown.open();
        const $items = $('.dx-dropdownmenu-list .dx-list-item');

        $($items.eq(0)).trigger('dxclick');

        assert.ok(!dropDown.option('opened'), 'dropdown is closed');
        assert.equal(onClickActionStub.callCount, 1, 'onClick was fired');
    });
});

QUnit.module('adaptivity without hiding in menu', {
    beforeEach: function() {
        this.element = $('#toolbar');
        this.getToolbarItems = function() {
            return this.element.find('.' + TOOLBAR_ITEM_CLASS);
        };

        this.MEASURE_SAFE_TEXT = 'xyvxyv';
        const fontStyles = '<style>\
        .dx-toolbar-label > div,\
        .dx-toolbar-label .dx-toolbar-item-content > div {\
            font-family: arial !important;\
        }\
        </style>';

        this.styles = $(fontStyles).appendTo('head');
    },
    afterEach: function() {
        this.styles.remove();
    }
}, () => {
    QUnit.test('items in before section should have correct sizes, width decreases', function(assert) {
        const toolBar = this.element.dxToolbar({
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
        const toolBar = this.element.dxToolbar({
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
        const toolBar = this.element.dxToolbar({
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
        const toolBar = this.element.dxToolbar({
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

QUnit.module('Waiting fonts for material theme', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Toolbar calls font-waiting function for labels (T736793)', function(assert) {
        const estimatedData = [
            { args: [ 'text1', '400' ], description: 'call for the first label' },
            { args: [ 'text2', '400' ], description: 'call for the second label' },
            { args: [ 'text3', '400' ], description: 'call for the third label' }
        ];

        let executionCount = 0;
        const origIsMaterial = themes.isMaterial;
        const done = assert.async(3);

        themes.isMaterial = function() { return true; };

        themes.waitWebFont = function(text, fontWeight) {
            const data = estimatedData[executionCount];
            assert.deepEqual([text, fontWeight], data.args, data.description);
            executionCount++;
            done();
        };

        $('#toolbar').dxToolbar({
            items: [
                { location: 'before', text: 'text1' },
                { location: 'before', text: 'text2' },
                { location: 'before', text: 'text3' }
            ],
            width: 250,
            height: 50
        });

        this.clock.tick();
        themes.isMaterial = origIsMaterial;
    });


    QUnit.test('Toolbar calls _dimensionChanged function in Material theme to recalculate labels (T736793)', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const done = assert.async();

        ToolbarBase.prototype._checkWebFontForLabelsLoaded = () => Promise.resolve();

        ToolbarBase.prototype._dimensionChanged = () => {
            assert.expect(0);
            done();
        };

        $('#toolbar').dxToolbar({
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

