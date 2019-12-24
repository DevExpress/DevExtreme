import 'ui/action_sheet';
import 'ui/drop_down_menu';

import $ from 'jquery';
import Toolbar from 'ui/toolbar';
import ToolbarBase from 'ui/toolbar/ui.toolbar.base';
import fx from 'animation/fx';
import resizeCallbacks from 'core/utils/resize_callbacks';
import themes from 'ui/themes';
import eventsEngine from 'events/core/events_engine';

import 'common.css!';
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
const TOOLBAR_BEFORE_CONTAINER_CLASS = 'dx-toolbar-before';
const TOOLBAR_AFTER_CONTAINER_CLASS = 'dx-toolbar-after';
const TOOLBAR_CENTER_CONTAINER_CLASS = 'dx-toolbar-center';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_MENU_BUTTON_CLASS = 'dx-toolbar-menu-button';
const TOOLBAR_MENU_SECTION_CLASS = 'dx-toolbar-menu-section';
const LIST_ITEM_CLASS = 'dx-list-item';

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';

QUnit.module('render', {
    beforeEach: function() {
        this.element = $('#toolbar');
    }
});

QUnit.test('label correctly fits into container', function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', text: 'Summary' }
        ]
    });

    var labelElement = this.element.find('.' + TOOLBAR_ITEM_CLASS)[0],
        labelMaxWidth = parseInt(labelElement.style.maxWidth);

    labelElement.style.maxWidth = '';

    var labelWidth = labelElement.getBoundingClientRect().width;
    assert.ok(labelWidth <= labelMaxWidth, 'Real label width less or equal to the max width');
});

QUnit.test('items - long labels', function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', widget: 'button', options: { text: 'Before Button' } },
            { location: 'before', widget: 'button', options: { text: 'Second Before Button' } },
            { location: 'after', widget: 'button', options: { text: 'After Button' } },
            { location: 'center', text: 'Very very very very very very very very very very very long label' }
        ],
        width: '400px'
    });

    var $label = this.element.find('.' + TOOLBAR_LABEL_CLASS);

    assert.equal($label.children().eq(0).css('text-overflow'), 'ellipsis');
    assert.equal($label.children().eq(0).css('overflow'), 'hidden');

    var $centerSection = this.element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS),
        beforeSectionWidth = this.element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width,
        afterSectionWidth = this.element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

    assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
    assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

    var maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

    assert.ok(parseFloat($label.css('max-width')) < maxLabelWidth);

});

QUnit.test('items - long custom html', function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'before', widget: 'button', options: { text: 'Before Button' } },
            { location: 'before', widget: 'button', options: { text: 'Second Before Button' } },
            { location: 'after', widget: 'button', options: { text: 'After Button' } },
            { location: 'center', html: '<b>Very very very very very very very very very very very long label</b>' }
        ],
        width: 400
    });

    var $label = this.element.find('.' + TOOLBAR_LABEL_CLASS);

    assert.equal($label.children().eq(0).css('text-overflow'), 'ellipsis');
    assert.equal($label.children().eq(0).css('overflow'), 'hidden');

    var $centerSection = this.element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS),
        beforeSectionWidth = this.element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS)[0].getBoundingClientRect().width,
        afterSectionWidth = this.element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS)[0].getBoundingClientRect().width;

    assert.roughEqual(parseFloat($centerSection.css('margin-left')), beforeSectionWidth, 0.1);
    assert.roughEqual(parseFloat($centerSection.css('margin-right')), afterSectionWidth, 0.1);

    var maxLabelWidth = this.element.width() - beforeSectionWidth - afterSectionWidth;

    assert.ok(parseFloat($label.css('max-width')) < maxLabelWidth);
});

QUnit.test('Center element has correct margin with RTL', function(assert) {
    var element = this.element.dxToolbar({
            rtlEnabled: true,
            items: [
                { location: 'before', text: 'before' },
                { location: 'center', text: 'center' }
            ]
        }),
        margin = element.find('.' + TOOLBAR_CLASS + '-center').get(0).style.margin;

    assert.equal(margin, '0px auto', 'aligned by center');
});

function checkItemsLocation($toolbarElement, expectedBeforeItemsCount, expectedCenterItemsCount, expectedAfterItemsCount, expectedMenuItemsCount) {
    const $beforeItems = $toolbarElement.find('.' + TOOLBAR_CLASS + '-before .' + TOOLBAR_ITEM_CLASS).not('.dx-toolbar-item-invisible');
    const $centerItems = $toolbarElement.find('.' + TOOLBAR_CLASS + '-center .' + TOOLBAR_ITEM_CLASS).not('.dx-toolbar-item-invisible');
    const $afterItems = $toolbarElement.find('.' + TOOLBAR_CLASS + '-after .' + TOOLBAR_ITEM_CLASS).not('.dx-toolbar-item-invisible');
    const $menuElement = $toolbarElement.find('.dx-toolbar-menu-container').not('.dx-state-invisible');
    QUnit.assert.equal($beforeItems.length, expectedBeforeItemsCount, 'items count with before location value');
    QUnit.assert.equal($centerItems.length, expectedCenterItemsCount, 'items count with center location value');
    QUnit.assert.equal($afterItems.length, expectedAfterItemsCount, 'items count with after location value');
    QUnit.assert.equal($menuElement.length, expectedMenuItemsCount, 'menu element');
}

['before', 'center', 'after', undefined].forEach((location) => {
    ['never', 'auto', 'always', undefined].forEach((locateInMenu) => {
        [1, 10000].forEach((width) => {
            QUnit.test(`Change item location at runtime -> location: ${location}, locateInMenu: ${locateInMenu}, width: ${width} (T844890)`, function(assert) {
                const $toolbarElement = this.element.dxToolbar({
                        items: [
                            { text: 'toolbar item', locateInMenu: locateInMenu, location: location },
                        ],
                        width: width
                    }),
                    toolbar = $toolbarElement.dxToolbar('instance');

                let expectedBeforeItemsCount = 0,
                    expectedCenterItemsCount = 0,
                    expectedAfterItemsCount = 0,
                    expectedMenuItemsCount = 0,
                    isMenuMode = (locateInMenu === 'always' || locateInMenu === 'auto' && width < 100);

                if(isMenuMode) {
                    expectedMenuItemsCount = 1;
                } else {
                    expectedBeforeItemsCount = location === 'before' ? 1 : 0;
                    expectedCenterItemsCount = location === 'center' || location === undefined ? 1 : 0;
                    expectedAfterItemsCount = location === 'after' ? 1 : 0;
                }

                checkItemsLocation($toolbarElement, expectedBeforeItemsCount, expectedCenterItemsCount, expectedAfterItemsCount, expectedMenuItemsCount);

                toolbar.option('items[0].location', 'center');
                checkItemsLocation($toolbarElement, 0, isMenuMode ? 0 : 1, 0, isMenuMode ? 1 : 0);

                toolbar.option('items[0].location', 'after');
                checkItemsLocation($toolbarElement, 0, 0, isMenuMode ? 0 : 1, isMenuMode ? 1 : 0);

                toolbar.option('items[0].location', 'before');
                checkItemsLocation($toolbarElement, isMenuMode ? 0 : 1, 0, 0, isMenuMode ? 1 : 0);
            });
        });
    });
});


QUnit.test('buttons has text style in Material', function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    ToolbarBase.prototype._waitParentAnimationFinished = () => Promise.resolve();

    var element = this.element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        }),
        button = element.find('.dx-button').first();

    assert.ok(button.hasClass('dx-button-mode-text'));

    themes.isMaterial = origIsMaterial;
});

var TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';

QUnit.test('Toolbar with compact mode has the compact class', function(assert) {
    var $toolbar = this.element.dxToolbar({
            items: [
                { location: 'before', text: 'before' },
                { location: 'center', text: 'center' }
            ],
            compactMode: true,
            width: 20
        }),
        toolbar = $toolbar.dxToolbar('instance');

    assert.ok($toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar with compact mode and small width has the compact class');

    toolbar.option('compactMode', false);

    assert.ok(!$toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar without compact mode hasn\'t the compact class');

    toolbar.option('compactMode', true);

    assert.ok($toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'compact class has been added to the toolbar');

    toolbar.option('width', 400);

    assert.ok(!$toolbar.hasClass(TOOLBAR_COMPACT_CLASS), 'toolbar with compact mode hasn\'t the compact class if widget has a large width');
});

QUnit.test('Buttons has default style in generic theme', function(assert) {
    var element = this.element.dxToolbar({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    type: 'default',
                    text: 'Back'
                }
            }]
        }),
        button = element.find('.dx-button');

    assert.notOk(button.hasClass('dx-button-mode-text'));
});

QUnit.test('Toolbar provides it\'s own templates for the item widgets', function(assert) {
    var templateUsed;

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


QUnit.module('toolbar with menu', {
    beforeEach: function() {
        this.element = $('#toolbar');
        this.instance = this.element.dxToolbar({ renderAs: 'bottomToolbar' })
            .dxToolbar('instance');

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('menu button click doesn\'t dispatch action', function(assert) {
    var count = 0;
    this.element.dxToolbar({
        onItemClick: function() {
            count++;
        },
        items: [
            { location: 'menu', text: 'item2' }
        ],
        submenuType: 'dropDownMenu'
    });

    var button = this.element.find('.' + TOOLBAR_MENU_BUTTON_CLASS).get(0);
    $(button).trigger('dxclick');
    assert.equal(count, 0, 'onItemClick was not executed');
});

QUnit.test('windowResize should not show/hide menu that doesn\'t created', function(assert) {
    this.element.dxToolbar({
        renderAs: 'topToolbar',
        submenuType: 'actionSheet',
        items: [],
    });

    resizeCallbacks.fire();
    assert.ok(true);
});

QUnit.test('option visible for menu items', function(assert) {
    var instance = this.element.dxToolbar({
        submenuType: 'dropDownMenu',
        items: [
            { location: 'menu', text: 'a', visible: true }
        ],
    }).dxToolbar('instance');

    assert.ok(this.element.find('.' + DROP_DOWN_MENU_CLASS).length === 1, 'dropdown was rendered');

    instance.option('items', [{ location: 'menu', text: 'a', visible: false }]);
    assert.ok(this.element.find('.' + DROP_DOWN_MENU_CLASS).length === 0, 'dropdown was not rendered');
});

QUnit.test('changing field of item in submenu', function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', disabled: true }
        ],
        submenuType: 'actionSheet'
    });

    var $button = this.element.find('.' + TOOLBAR_MENU_BUTTON_CLASS);
    $($button).trigger('dxclick');
    this.element.dxToolbar('option', 'items[0].disabled', false);
    assert.equal($('.dx-state-disabled').length, 0, 'disabled state changed');
});

QUnit.test('dropdown menu should have correct position', function(assert) {
    this.element.dxToolbar({
        items: [
            { location: 'menu', disabled: true }
        ],
        submenuType: 'dropDownMenu'
    });

    var $button = this.element.find('.' + DROP_DOWN_MENU_CLASS),
        ddMenu = $button.dxDropDownMenu('instance'),
        position = ddMenu.option('popupPosition');

    assert.equal(position.at, 'bottom right', 'at position is correct');
    assert.equal(position.my, 'top right', 'my position is correct');
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
                                let itemClickHandler = sinon.spy();
                                let buttonClickHandler = sinon.spy();
                                let toolbarOptions = {
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

                                let $element = $('#toolbar');
                                $element.dxToolbar(toolbarOptions);

                                let $button = locateInMenu === 'never' ? $element.find(`.${TOOLBAR_ITEM_CLASS} .dx-button`).eq(0) : $element.find(`.${DROP_DOWN_MENU_CLASS}`).eq(0);

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


QUnit.module('widget sizing render');

QUnit.test('default', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', text: 'before' },
            { location: 'after', text: 'after' },
            { location: 'center', text: 'center' }
        ]
    });

    assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
});

QUnit.test('constructor', function(assert) {
    var $element = $('#widget').dxToolbar({ width: 400 }),
        instance = $element.dxToolbar('instance');

    assert.strictEqual(instance.option('width'), 400);
    assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
});

QUnit.test('root with custom width', function(assert) {
    var $element = $('#widthRootStyle').dxToolbar(),
        instance = $element.dxToolbar('instance');

    assert.strictEqual(instance.option('width'), undefined);
    assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
});

QUnit.test('change width', function(assert) {
    var $element = $('#widget').dxToolbar(),
        instance = $element.dxToolbar('instance'),
        customWidth = 400;

    instance.option('width', customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
});

QUnit.test('text should crop in the label inside the toolbar on toolbar\'s width changing', function(assert) {
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', text: 'Before long text label' },
                { location: 'after', text: 'after' }
            ],
            width: 300
        }),
        instance = $element.dxToolbar('instance'),
        $before = $element.find('.dx-toolbar-before').eq(0),
        $after = $element.find('.dx-toolbar-after').eq(0);

    instance.option('width', 100);

    assert.roughEqual($before.outerWidth(), 100 - $after.outerWidth(), 1.001, 'width of before element should be changed');
});

QUnit.test('text should crop in the label inside the toolbar on window\'s width changing', function(assert) {
    var $element = $('#widget').width(300).dxToolbar({
            items: [
                { location: 'before', text: 'Before long text label' },
                { location: 'after', text: 'after' }
            ]
        }),
        $before = $element.find('.dx-toolbar-before').eq(0),
        $after = $element.find('.dx-toolbar-after').eq(0);

    $element.width(100);
    resizeCallbacks.fire();

    assert.roughEqual($before.outerWidth(), 100 - $after.outerWidth(), 1.001, 'width of before element should be changed');
});

QUnit.test('label should positioned correctly inside the toolbar if toolbar-before section is empty', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'center', text: 'TextTextTextTextTextTextTe' },
            { location: 'before', template: 'nav-button', visible: false },
            { location: 'after', text: 'after after after' }
        ],
        width: 359
    });

    var $center = $element.find('.dx-toolbar-center').eq(0),
        $label = $center.children('.dx-toolbar-label').eq(0),
        $after = $element.find('.dx-toolbar-after').eq(0);

    assert.ok(Math.floor($label.position().left + $label.outerWidth()) <= Math.floor($element.outerWidth() - $after.outerWidth()), 'label is positioned correctly');
});

QUnit.test('title should be centered considering different before/after block widths (big before case)', function(assert) {
    var title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

    var $element = $('#widget').dxToolbar({
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

    var $center = $element.find('.dx-toolbar-center').eq(0);
    assert.equal(parseInt($center.css('margin-left')), 110);
    assert.equal(parseInt($center.css('margin-right')), 60);
    assert.equal($center.css('float'), 'none');
    assert.equal($center.width(), 230);
});

QUnit.test('title should be centered considering different before/after block widths (big after case)', function(assert) {
    var title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

    var $element = $('#widget').dxToolbar({
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

    var $center = $element.find('.dx-toolbar-center').eq(0);
    assert.equal(parseInt($center.css('margin-left')), 60);
    assert.equal(parseInt($center.css('margin-right')), 110);
    assert.equal($center.css('float'), 'right');
    assert.equal($center.width(), 230);
});

QUnit.test('title should be centered considering different before/after block widths after visible option change', function(assert) {
    var title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(50); }, visible: false },
            { location: 'center', text: title }
        ],
        width: 400
    });
    $element.dxToolbar('option', 'items[0].visible', true);

    var $center = $element.find('.dx-toolbar-center').eq(0);
    assert.equal(parseInt($center.css('margin-left')), 60);
});

QUnit.test('items should be arranged after rendering in the dxToolbarBase used in the dxPopup', function(assert) {
    var title = 'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongLongText';

    var $element = $('#widget').dxToolbarBase({
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

    var $center = $element.find('.dx-toolbar-center').eq(0);
    assert.equal(parseInt($center.css('margin-left')), 110);
    assert.equal(parseInt($center.css('margin-right')), 60);
    assert.equal($center.css('float'), 'none');
    assert.equal($center.width(), 230);
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
});

QUnit.test('center section should be at correct position for huge after section', function(assert) {
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(200); } },
            ],
            width: 400
        }),
        $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0),
        $after = $element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

    assert.equal($center.offset().left + $center.outerWidth(), $after.offset().left, 'center has correct position');
});

QUnit.test('items in center section should be at correct position after resize', function(assert) {
    var $item = $('<div>').width(50);
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(50); } },
            { location: 'center', template: function() { return $item; } },
            { location: 'after', template: function() { return $('<div>').width(200); } },
        ],
        width: 400
    });

    $element.dxToolbar('option', 'width', 1000);

    var elementCenter = $element.offset().left + $element.outerWidth() * 0.5,
        itemCenter = $item.offset().left + $item.outerWidth() * 0.5;

    assert.equal(itemCenter, elementCenter, 'item has correct position');
});

QUnit.test('center section should be at correct position for huge before section', function(assert) {
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(200); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(50); } },
            ],
            width: 400
        }),
        $before = $element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0),
        $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);


    assert.equal($center.offset().left, $before.offset().left + $before.outerWidth(), 'center has correct position');
});

QUnit.test('center section should be at correct position for huge after section after change size', function(assert) {
    var $item = $('<div>').width(200);
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(50); } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $item; } },
            ],
            width: 400
        }),
        $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0),
        $after = $element.find('.' + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

    $item.width(190);
    resizeCallbacks.fire();

    assert.equal($center.get(0).getBoundingClientRect().right, $after.get(0).getBoundingClientRect().left, 'center has correct position');
});

QUnit.test('center section should be at correct position for huge before section after change size', function(assert) {
    var $item = $('<div>').width(200);
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $item; } },
                { location: 'center', template: function() { return $('<div>').width(50); } },
                { location: 'after', template: function() { return $('<div>').width(50); } },
            ],
            width: 400
        }),
        $before = $element.find('.' + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0),
        $center = $element.find('.' + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0);

    $item.width(190);
    resizeCallbacks.fire();

    assert.equal($center.get(0).getBoundingClientRect().left, $before.get(0).getBoundingClientRect().right, 'center has correct position');
});

QUnit.test('overflow items should be hidden if there is no free space for them', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var $visibleItems = $element.find('.' + TOOLBAR_ITEM_CLASS + ':visible');
    assert.equal($visibleItems.length, 3, 'two items was hidden');
});

QUnit.test('overflow items should be shown if there is free space for them after resize', function(assert) {
    var $element = $('#widget').dxToolbar({
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
    var $visibleItems = $element.find('.' + TOOLBAR_ITEM_CLASS + ':visible');
    assert.equal($visibleItems.length, 5, 'all items is visible');
});

QUnit.test('dropdown menu should be rendered if there is hidden overflow items', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test('dropdown menu button should be invisible if there is hidden invisible overflow items', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'after', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { locateInMenu: 'always', visible: false, template: function() { return $('<div>').width(100); } }
        ]
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 1, 'button is rendered');
    assert.notOk($dropDownMenu.is(':visible'), 'button is invisible');
});

QUnit.test('all overflow items should be hidden on render', function(assert) {
    var $element = $('#toolbarWithMenu').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } }
        ],
        width: 190
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.dxDropDownMenu('option', 'items').length, 2);
});

QUnit.test('overflow items should not be rendered twice after resize', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(50); } }
        ],
        width: 400
    });

    $element.dxToolbar('option', 'width', 190);

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    $dropDownMenu.dxDropDownMenu('open');
    $dropDownMenu.dxDropDownMenu('close');
    $element.dxToolbar('option', 'width', 188);

    assert.equal($dropDownMenu.dxDropDownMenu('option', 'items').length, 1);
});

QUnit.test('dropdown menu should be rendered if there is hidden overflow items after resize', function(assert) {
    var $element = $('#widget').dxToolbar({
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
    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test('dropdown menu shouldn\'t be closed during resize with open menu if menu has items', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

    dropDown.open();

    $element.dxToolbar('option', 'width', 500);
    assert.equal(dropDown.option('opened'), true);
});

QUnit.test('dropdown menu should be closed if after resize with open menu all items become visible', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

    dropDown.open();

    $element.dxToolbar('option', 'width', 1000);
    assert.equal(dropDown.option('opened'), false);
});

QUnit.test('dropdown menu strategy should be used if there is overflow widget', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'center', locateInMenu: 'auto', widget: 'dxButton', options: {} }
        ],
        submenuType: 'actionSheet',
        width: 100
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test('dropdown menu strategy should be used if there is overflow widget', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test' }, showText: 'inMenu' }
        ]
    });

    var $buttonText = $element.find('.dx-button-text');

    assert.equal($buttonText.length, 1);
    assert.ok($buttonText.is(':hidden'));
});

QUnit.test('dropdown menu strategy should be used if there is overflow widget', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'center', locateInMenu: 'auto', text: 'test' }
        ],
        submenuType: 'actionSheet',
        width: 100
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.equal($dropDownMenu.length, 1);
});

QUnit.test('visibility of dropdown menu should be changed if overflow items was hidden/shown after resize', function(assert) {
    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(150); } },
                { location: 'center', locateInMenu: 'auto', template: function() { return $('<div>').width(100); } },
                { location: 'center', template: function() { return $('<div>').width(100); } },
                { location: 'after', template: function() { return $('<div>').width(100); } },
            ],
            width: 400
        }),
        $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

    $element.dxToolbar('option', 'width', 1000);
    assert.ok($dropDownMenu.is(':hidden'), 'menu is hidden');

    $element.dxToolbar('option', 'width', 400);
    assert.ok($dropDownMenu.is(':visible'), 'menu is visible');
});

QUnit.test('hidden overflow items should be rendered in menu', function(assert) {
    var $item = $('<div>').width(100);
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $item; } },
            { location: 'center', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

    dropDown.option('onItemRendered', function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
    });

    dropDown.open();
});

QUnit.test('items with locateInMenu == \'always\' should be rendered in menu if there is free space for them', function(assert) {
    var $item = $('<div>').width(100);
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'center', locateInMenu: 'always', template: function() { return $item; } }
        ],
        width: 1000
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

    dropDown.option('onItemRendered', function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $item.get(0)), 'item was rendered in menu');
    });

    dropDown.open();
});

QUnit.test('visible overflow items should be moved back into widget after resize', function(assert) {
    var $item = $('<div>').width(100);
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'center', template: function() { return $('<div>').width(150); } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $item; } },
            { location: 'center', template: function() { return $('<div>').width(100); } },
            { location: 'after', template: function() { return $('<div>').width(100); } },
        ],
        width: 400
    });

    var $itemParent = $item.parent();
    var dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

    dropDown.open();
    dropDown.close();
    $element.dxToolbar('option', 'width', 1000);
    assert.ok($item.parent().is($itemParent), 'item was rendered in toolbar');
});

QUnit.test('dropdown menu should have four sections for items', function(assert) {
    var $beforeItem = $('<div>').width(150);
    var $centerItem = $('<div>').width(150);
    var $afterItem = $('<div>').width(150);

    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', locateInMenu: 'auto', template: function() { return $beforeItem; } },
            { location: 'center', locateInMenu: 'auto', template: function() { return $centerItem; } },
            { location: 'after', locateInMenu: 'auto', template: function() { return $afterItem; } },
        ],
        width: 100
    });

    var $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu('instance');

    dropDown.open();
    dropDown.close();

    var $sections = $dropDown.find('.dx-toolbar-menu-section');

    assert.equal($sections.length, 4, 'four sections was rendered');
    assert.ok($.contains($sections.eq(0).get(0), $beforeItem.get(0)));
    assert.ok($.contains($sections.eq(1).get(0), $centerItem.get(0)));

    assert.ok($.contains($sections.eq(2).get(0), $afterItem.get(0)));
    assert.ok($sections.eq(2).hasClass('dx-toolbar-menu-last-section'), 'border for last section is removed');
});

QUnit.test('dropdown menu shouldn\'t be closed after click on editors', function(assert) {
    var $beforeItem = $('<div>').width(150);

    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', locateInMenu: 'auto', template: function() { return $beforeItem; } },
        ],
        width: 100
    });

    var $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu('instance');
    dropDown.open();

    $($beforeItem).trigger('dxclick');

    assert.ok(dropDown.option('opened'), 'dropdown isn\'t closed');
});

QUnit.test('dropdown menu should be closed after click on button or menu items', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
            { location: 'before', template: function() { return $('<div>').width(100); } },
            { location: 'menu', text: 'test text' }
        ],
        width: 100
    });

    var $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu('instance');

    dropDown.open();
    dropDown.close();

    var $items = $element.find('.dx-list-item');

    dropDown.open();
    $($items.eq(0)).trigger('dxclick');
    assert.ok(!dropDown.option('opened'), 'dropdown is closed');

    dropDown.open();
    $($items.eq(1)).trigger('dxclick');
    assert.ok(!dropDown.option('opened'), 'dropdown is closed');
});

QUnit.test('overflow button should be rendered as list item in dropdown', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', locateInMenu: 'auto', widget: 'dxButton', options: { text: 'test text' } },
            { location: 'before', template: function() { return $('<div>').width(100); } }
        ],
        width: 100
    });

    var $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu('instance');

    dropDown.open();
    dropDown.close();

    var $section = $dropDown.find('.dx-toolbar-menu-section').eq(0);

    assert.equal($section.find('.dx-toolbar-menu-action').length, 1, 'click on button should close menu');
    assert.equal($section.find('.dx-toolbar-hidden-button').length, 1, 'button has specific class for override styles');
    assert.equal($section.find('.dx-list-item').text(), 'test text', 'button text was rendered');
});

QUnit.test('overflow item should rendered with correct template in menu and in toolbar', function(assert) {
    assert.expect(4);

    var $toolbarTemplate = $('<div>').width(500),
        $menuTemplate = $('<div>');

    var $element = $('#widget').dxToolbar({
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

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

    dropDown.option('onItemRendered', function(args) {
        assert.ok($.contains($(args.itemElement).get(0), $menuTemplate.get(0)), 'item was rendered in menu');
        assert.ok($toolbarTemplate.is(':hidden'), 'toolbar template was hidden');
    });

    dropDown.open();
});

QUnit.test('toolbar menu should have correct focused element', function(assert) {
    var $element = $('#widget').dxToolbar({
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


    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

    if(!dropDown.option('focusStateEnabled')) {
        assert.expect(0);
        return;
    }


    dropDown.open();

    var $item1 = $('.dx-list-item').eq(0),
        $item2 = $('.dx-list-item').eq(1);

    $($item2).trigger('dxpointerdown');
    this.clock.tick();

    assert.ok($item2.hasClass('dx-state-focused'), 'only item2 is focused');
    assert.ok(!$item1.hasClass('dx-state-focused'), 'only item2 is focused');
});

QUnit.test('toolbar menu should have correct item element', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [{ locateInMenu: 'always', text: 'item1' }]
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

    dropDown.open();
    dropDown.close();

    resizeCallbacks.fire();

    dropDown.open();
    assert.equal($('.dx-list-item').length, 1, 'only one item in menu is rendered');
});

QUnit.test('toolbar menu should be rendered after change item visible', function(assert) {
    assert.expect(3);

    var $element = $('#widget').dxToolbar({
            items: [{ locateInMenu: 'always', text: 'item1', visible: false }]
        }),
        $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 0, 'menu is not rendered');

    var toolbar = $element.dxToolbar('instance');

    toolbar.option('items[0].visible', true);
    $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);

    assert.equal($dropDownMenu.length, 1, 'menu is rendered');

    if(!$dropDownMenu.length) return;

    var dropDown = $dropDownMenu.dxDropDownMenu('instance');

    dropDown.open();

    assert.equal($('.dx-list-item').length, 1, 'item in menu is rendered');
    dropDown.close();
});

QUnit.test('invisible overflow items should be hidden if there no free space for them', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', locateInMenu: 'auto', template: function() { return $('<div>').width(300); } }
        ],
        width: 400
    });

    $element.dxToolbar('option', 'items[0].visible', false);
    assert.equal($element.find('.' + TOOLBAR_ITEM_CLASS + ':visible').length, 0, 'item was hidden');
});

QUnit.test('menu should be hidden if all overflow items were hidden', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            { location: 'before', template: function() { return $('<div>').width(300); } },
            { location: 'before', locateInMenu: 'auto', template: function() { return $('<div>').width(300); } }
        ],
        width: 300
    });

    $element.dxToolbar('option', 'items[1].visible', false);

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS);
    assert.ok($dropDownMenu.is(':hidden'), 'menu is hidden');
});

QUnit.testInActiveWindow('items should not be rearranged if width is not changed', function(assert) {
    var $input = $('<input>').width(300);

    ToolbarBase.prototype._waitParentAnimationFinished = () => Promise.resolve();

    var $element = $('#widget').dxToolbar({
            items: [
                { location: 'before', template: function() { return $('<div>').width(300); } },
                { location: 'before', locateInMenu: 'auto', template: function() { return $input; } }
            ],
            width: 300
        }),
        dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS).dxDropDownMenu('instance');

    dropDown.open();
    $input.focus();
    resizeCallbacks.fire('height');

    assert.ok($input.is(':focus'), 'focus is not lost');
});

QUnit.test('add a custom CSS to item of menu', function(assert) {
    var $element = $('#widget').dxToolbar({
        items: [
            {
                location: 'before',
                locateInMenu: 'always',
                cssClass: 'test'
            }
        ]
    });

    var $dropDownMenu = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDownMenu.dxDropDownMenu('instance');

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


QUnit.module('default template', {
    prepareItemTest: function(data) {
        var toolbar = new Toolbar($('<div>'), {
            items: [data]
        });

        return toolbar.itemElements().eq(0).find('.dx-item-content').contents();
    }
});

QUnit.test('T430159 dropdown menu should be closed after click on item if location is defined', function(assert) {
    var onClickActionStub = sinon.stub();

    var $element = $('#widget').dxToolbar({
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

    var $dropDown = $element.find('.' + DROP_DOWN_MENU_CLASS),
        dropDown = $dropDown.dxDropDownMenu('instance');

    dropDown.open();
    var $items = $('.dx-dropdownmenu-list .dx-list-item');

    $($items.eq(0)).trigger('dxclick');

    assert.ok(!dropDown.option('opened'), 'dropdown is closed');
    assert.equal(onClickActionStub.callCount, 1, 'onClick was fired');
});

QUnit.module('adaptivity without hiding in menu', {
    beforeEach: function() {
        this.element = $('#toolbar');
        this.getToolbarItems = function() {
            return this.element.find('.' + TOOLBAR_ITEM_CLASS);
        };

        this.MEASURE_SAFE_TEXT = 'xyvxyv';
    }
});

QUnit.test('items in before section should have correct sizes, width decreases', function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'before', text: this.MEASURE_SAFE_TEXT },
            { location: 'before', text: this.MEASURE_SAFE_TEXT },
            { location: 'before', text: this.MEASURE_SAFE_TEXT }
        ],
        width: 250,
        height: 50
    }).dxToolbar('instance');

    $.each(this.getToolbarItems(), function(index, $item) {
        assert.roughEqual($($item).outerWidth(), 58, 2, 'Width is correct');
    });

    toolBar.option('width', 180);

    $.each(this.getToolbarItems(), function(index, $item) {
        if(index < 2) {
            assert.roughEqual($($item).outerWidth(), 58, 1, 'Width is correct');
        } else {
            assert.roughEqual($($item).outerWidth(), 44, 1, 'Width is correct');
        }
    });

    toolBar.option('width', 100);

    assert.roughEqual(this.getToolbarItems().eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual(this.getToolbarItems().eq(1).outerWidth(), 22, 1, 'Width of the second item is correct');
    assert.roughEqual(this.getToolbarItems().eq(2).outerWidth(), 10, 1, 'Width of the third item is correct');
});

QUnit.test('items in center section should have correct sizes, width decreases', function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'center', text: this.MEASURE_SAFE_TEXT },
            { location: 'center', text: this.MEASURE_SAFE_TEXT },
            { location: 'center', text: this.MEASURE_SAFE_TEXT }
        ],
        width: 250,
        height: 50
    }).dxToolbar('instance');

    $.each(this.getToolbarItems(), function(index, $item) {
        assert.roughEqual($($item).outerWidth(), 58, 2, 'Width is correct');
    });

    toolBar.option('width', 140);

    $.each(this.getToolbarItems(), function(index, $item) {
        if(index < 2) {
            assert.roughEqual($($item).outerWidth(), 58, 1, 'Width is correct');
        } else {
            assert.roughEqual($($item).outerWidth(), 10, 1, 'Width is correct');
        }
    });

    toolBar.option('width', 100);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 22, 2, 'Width of the second item is correct');
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, 'Width of the third item is correct');
});

QUnit.test('items in before section should have correct sizes, width increases', function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'before', text: this.MEASURE_SAFE_TEXT },
            { location: 'before', text: this.MEASURE_SAFE_TEXT },
            { location: 'before', text: this.MEASURE_SAFE_TEXT }
        ],
        width: 100,
        height: 50
    }).dxToolbar('instance');

    toolBar.option('width', 180);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 34, 1, 'Width of the second item is correct');
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, 'Width of the third item is correct');

    toolBar.option('width', 250);

    $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 58, 1, 'Width of the second item is correct');
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 22, 1, 'Width of the third item is correct');
});

QUnit.test('items in center section should have correct sizes, width increases', function(assert) {
    var toolBar = this.element.dxToolbar({
        items: [
            { location: 'center', text: this.MEASURE_SAFE_TEXT },
            { location: 'center', text: this.MEASURE_SAFE_TEXT },
            { location: 'center', text: this.MEASURE_SAFE_TEXT }
        ],
        width: 50,
        height: 50
    }).dxToolbar('instance');

    toolBar.option('width', 140);

    var $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 10, 1, 'Width of the second item is correct');
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 10, 1, 'Width of the third item is correct');

    toolBar.option('width', 250);

    $toolbarItems = this.getToolbarItems();

    assert.roughEqual($toolbarItems.eq(0).outerWidth(), 58, 1, 'Width of the first item is correct');
    assert.roughEqual($toolbarItems.eq(1).outerWidth(), 58, 1, 'Width of the second item is correct');
    assert.roughEqual($toolbarItems.eq(2).outerWidth(), 46, 1, 'Width of the third item is correct');
});

QUnit.module('Waiting fonts for material theme', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('Toolbar calls font-waiting function for labels (T736793)', function(assert) {
    var estimatedData = [
        { args: [ 'text1', '400' ], description: 'call for the first label' },
        { args: [ 'text2', '400' ], description: 'call for the second label' },
        { args: [ 'text3', '400' ], description: 'call for the third label' }
    ];

    var executionCount = 0,
        origIsMaterial = themes.isMaterial,
        done = assert.async(3);

    themes.isMaterial = function() { return true; };

    themes.waitWebFont = function(text, fontWeight) {
        var data = estimatedData[executionCount];
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
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var done = assert.async();

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
