import { getOuterHeight, getHeight, getWidth, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import ArrayStore from 'data/array_store';
import devices from 'core/devices';
import fx from 'animation/fx';
import Button from 'ui/button';
import Popup from 'ui/popup';
import 'ui/popover';
import DropDownMenu from 'ui/toolbar/drop_down_menu';
import ToolbarMenuList from 'ui/toolbar/ui.toolbar.menu.list.js';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import config from 'core/config';
import { noop } from 'core/utils/common';
import { DataSource } from 'data/data_source/data_source';
import { isRenderer } from 'core/utils/type';
import themes from 'ui/themes';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownMenu"></div>\
        <div id="dropDownMenuSecond"></div>\
        <div id="dropDownMenuKeyboard"></div>';

    $('#qunit-fixture').html(markup);
});

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';


const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;

        this.clock = sinon.useFakeTimers();

        this.element = $('#dropDownMenu').dxDropDownMenu({});
        this.ddMenu = this.element.dxDropDownMenu('instance');

        this.button = this.ddMenu._button;
        this.$button = $(this.button.$element());
        this.mouse = pointerMock(this.$button);
        this.popup = this.ddMenu._popup;

        this.toggleMenu = function() {
            $(this.$button).trigger('dxclick');

            this.popup = this.ddMenu._popup;
            this.$popup = $(this.popup.$element());
            this.$popupContent = $(this.popup.$content());

            this.list = this.ddMenu._list;
            this.$list = $(this.list.$element());
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('render with popup'), moduleConfig, () => {
    QUnit.test('default', function(assert) {
        assert.ok(this.button instanceof Button);
        assert.ok(this.element.hasClass(DROP_DOWN_MENU_CLASS));
        assert.ok(this.$button.hasClass(DROP_DOWN_MENU_BUTTON_CLASS));

        this.toggleMenu();

        assert.ok(this.list instanceof ToolbarMenuList);
        assert.ok(this.popup instanceof Popup);

        assert.ok(this.$list.hasClass(DROP_DOWN_MENU_LIST_CLASS));
        assert.equal(this.$list.find('.dx-list-item').length, 0);
        assert.ok(this.$popup.dxPopup('instance'));
    });

    QUnit.test('list should be rendered before onContentReady of the popup', function(assert) {
        const ddMenu = this.element.dxDropDownMenu('instance');
        const initialPopupOptions = ddMenu._popupOptions;
        try {
            ddMenu._popupOptions = function() {
                return $.extend(initialPopupOptions.call(ddMenu), { onContentReady: function() {
                    assert.ok(this.$overlayContent().find('.' + DROP_DOWN_MENU_LIST_CLASS).length, 'List is already rendered');
                }
                });
            };
            this.toggleMenu();
        } finally {
            ddMenu._popupOptions = initialPopupOptions;
        }
    });

    QUnit.test('w/ options - items', function(assert) {
        this.element.dxDropDownMenu({
            items: [
                'Item 0',
                'Item 1',
                'Item 2'
            ],
        });
        this.toggleMenu();
        assert.equal(this.$popupContent.find('.dx-list-item').length, 3);

        this.element.dxDropDownMenu({
            items: [
                'Item 3',
                'Item 4'
            ],
        });
        this.toggleMenu();
        assert.equal(this.$popupContent.find('.dx-list-item').length, 2);
    });

    QUnit.test('w/ options - dataSource', function(assert) {
        this.element.dxDropDownMenu({
            dataSource: new ArrayStore([
                'Item 0',
                'Item 1',
                'Item 2'
            ]),
        });
        this.toggleMenu();
        assert.equal(this.$popupContent.find('.dx-list-item').length, 3);

        this.element.dxDropDownMenu({
            dataSource: new DataSource([
                'Item 3',
                'Item 4'
            ]),
        });

        assert.equal(this.$popupContent.find('.dx-list-item').length, 2);
    });

    QUnit.test('RTL support', function(assert) {
        const RTL_SELECTOR = '.dx-rtl';
        const DROPDOWNMENU_POPUP_WRAPPER_SELECTOR = '.dx-dropdownmenu-popup-wrapper';
        this.element.dxDropDownMenu({
            dataSource: new ArrayStore([
                'Item 0',
                'Item 1',
                'Item 2'
            ]),
            rtlEnabled: true,
        });

        this.ddMenu.option();
        this.toggleMenu();
        assert.ok($(DROPDOWNMENU_POPUP_WRAPPER_SELECTOR + ' ' + RTL_SELECTOR).length > 0, 'menu is in RTL mode');
    });

    QUnit.test('correct wrapper classes should be set', function(assert) {
        new DropDownMenu($('<div>').appendTo('#qunit-fixture'), {
            opened: true,
            popupAnimation: {
                show: {
                    start: function() {
                        const $wrapper = $('.' + DROP_DOWN_MENU_POPUP_WRAPPER_CLASS);
                        assert.strictEqual($wrapper.hasClass(DROP_DOWN_MENU_POPUP_CLASS), true, 'popup class added');
                    }
                }
            }
        });
    });

    QUnit.test('overlay should not overlap bottom button border', function(assert) {
        const $button = $('<div>');

        new DropDownMenu($button.appendTo('#qunit-fixture'), {
            opened: true,
        });

        const $overlay = $('.dx-overlay-content').first();
        const overlayTop = $overlay.offset().top;
        const buttonBottom = $button.offset().top + getOuterHeight($button);

        assert.ok(overlayTop >= buttonBottom);
    });
};


QUnit.module('render', moduleConfig, () => {
    QUnit.test('w/ options - button text', function(assert) {
        this.ddMenu.option('buttonText', 'some text');
        assert.equal(this.$button.find('.dx-button-content').text(), 'some text');

        this.ddMenu.option('buttonText', 'new text');
        assert.equal(this.$button.find('.dx-button-content').text(), 'new text');
    });

    QUnit.test('w/ options - button icon', function(assert) {
        this.ddMenu.option('buttonIcon', 'add');
        assert.ok(this.$button.find('.dx-icon-add').length);

        this.ddMenu.option('buttonIcon', 'remove');
        assert.ok(this.$button.find('.dx-icon-remove').length);
    });

    QUnit.test('popup should not be removed if the buttonText option is changed', function(assert) {
        this.ddMenu.option('buttonText', 'some text');
        assert.equal(this.element.find('.dx-popup').length, 1);
    });

    QUnit.test('popup should not be removed if the buttonIcon option is changed', function(assert) {
        this.ddMenu.option('buttonIcon', 'remove');
        assert.equal(this.element.find('.dx-popup').length, 1);
    });

    QUnit.test('w/ options - button icon src', function(assert) {
        this.ddMenu.option('buttonIcon', '');
        this.ddMenu.option('buttonIcon', '1.png');
        assert.ok(this.$button.find('img[src=\'1.png\']').length);

        this.ddMenu.option('buttonIcon', '2.png');
        assert.ok(this.$button.find('img[src=\'2.png\']').length);
    });

    QUnit.test('w/ options - visible', function(assert) {
        this.ddMenu.option('visible', false);
        assert.equal(this.button.option('visible'), false);

        this.ddMenu.option('visible', false);
        assert.equal(this.button.option('visible'), false);

        this.ddMenu.option('visible', true);
        assert.equal(this.button.option('visible'), true);

        this.ddMenu.option('visible', true);
        assert.equal(this.button.option('visible'), true);
    });

    QUnit.test('w/ options - deferRendering', function(assert) {
        this.ddMenu.option({
            items: [0, 1, 2],
            deferRendering: true
        });

        this.toggleMenu();
        this.ddMenu.option('opened', false);
        this.ddMenu.option('items', [3, 4, 5]);

        assert.equal(this.$list.find('.dx-list-item').text(), '012');

        this.toggleMenu();
        assert.equal(this.$list.find('.dx-list-item').text(), '345');
    });

    QUnit.test('w/ options - itemTemplate', function(assert) {
        this.ddMenu.option({
            items: [0, 1, 2],
            itemTemplate: function(item, itemIndex, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                return 'Item' + item;
            }
        });

        this.toggleMenu();

        assert.equal(this.$list.find('.dx-list-item').text(), 'Item0Item1Item2');
    });

    QUnit.test('custom item template can return default template name', function(assert) {
        this.ddMenu.option({
            items: [1, 2],
            itemTemplate: function() {
                return 'item';
            }
        });
        this.toggleMenu();

        const $items = this.list.itemElements();

        assert.strictEqual($items.eq(0).text(), '1', 'default item template was applied');
        assert.strictEqual($items.eq(1).text(), '2', 'default item template was applied');
    });

    QUnit.test('the \'buttonWidth\' option should be passed to the menu button', function(assert) {
        this.ddMenu.option('buttonWidth', 200);
        assert.ok(this.button.option('width'), 200);
    });

    QUnit.test('the \'buttonHeight\' option should be passed to the menu button', function(assert) {
        this.ddMenu.option('buttonHeight', 200);
        assert.ok(this.button.option('height'), 200);
    });

    QUnit.test('the \'buttonTemplate\' option should be passed to the menu button', function(assert) {
        this.ddMenu.option('buttonTemplate', function(data, container) {
            assert.equal(isRenderer(container), !!config().useJQuery, 'container is correct');
            return $('<span class=\'it-is-button-template\'/>');
        });

        assert.equal(this.$button.find('.it-is-button-template').length, 1);
    });

    QUnit.test('popup should be rendered after first click only', function(assert) {
        assert.equal(this.element.find('.dx-popup').length, 0, 'popup is not rendered before it is opened');
        this.ddMenu.open();
        assert.equal(this.element.find('.dx-popup').length, 1, 'popup is rendered after it is opened');
    });

    QUnit.test('popup should be rendered if opened option is set to true on init', function(assert) {
        const $dropDownMenu = $('#dropDownMenuSecond').dxDropDownMenu({
            opened: true
        });
        const popup = $dropDownMenu.find('.dx-popup').dxPopover('instance');

        assert.ok(popup.option('visible'), 'popup is visible');
    });

    QUnit.test('popup should be placed into container specified in the \'container\' option', function(assert) {
        const $container = $('#dropDownMenuSecond');
        const $dropDownMenu = $container.dxDropDownMenu({
            container: $container,
            opened: true
        });
        const popup = $dropDownMenu.find('.dx-popup').dxPopover('instance');
        const $content = popup.$content();

        assert.strictEqual($content.closest($container).length, 1, 'Popover content located into desired container');
    });

    QUnit.test('popup should be placed into new container after changing the \'container\' option', function(assert) {
        const $container = $('#dropDownMenuSecond');
        const $dropDownMenu = $container.dxDropDownMenu({
            opened: true
        });

        $dropDownMenu.dxDropDownMenu('option', 'container', $container);

        const popup = $dropDownMenu.find('.dx-popup').dxPopover('instance');
        const $content = popup.$content();

        assert.strictEqual($content.closest($container).length, 1, 'Popup content located into desired container');
    });
});

QUnit.module('position', {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
    }
}, () => {
    QUnit.test('check default position', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'unnecessary test on mobile devices');
            return;
        }
        const element = $('#dropDownMenu').dxDropDownMenu();
        const instance = element.dxDropDownMenu('instance');
        const defaultPosition = { my: 'top right', at: 'bottom right', collision: 'fit flip', offset: { v: 4 } };

        assert.deepEqual(defaultPosition, instance.option('popupPosition'));
    });

    QUnit.test('check position for LTR and RTL', function(assert) {
        const element = $('#dropDownMenu').dxDropDownMenu({});

        const instance = element.dxDropDownMenu('instance');
        let positionConfig;

        $(element.dxDropDownMenu('instance')._button.$element()).trigger('dxclick');

        positionConfig = instance._popup.option('position');

        assert.deepEqual(positionConfig, instance.option('popupPosition'));

        instance.option('rtlEnabled', true);
        positionConfig = instance._popup.option('position');

        assert.deepEqual(positionConfig, instance.option('popupPosition'));
    });
});

QUnit.module('behavior', moduleConfig, () => {
    QUnit.test('first click on button shows drop-down list, second click hides', function(assert) {
        this.toggleMenu();

        const popup = this.popup;
        assert.ok(popup.option('visible'), 'popup is opened after first click');

        this.toggleMenu();
        assert.ok(!popup.option('visible'), 'popup is closed after second click');
    });

    QUnit.test('click outside of popup hides drop-down list', function(assert) {
        this.toggleMenu();

        const popup = this.popup;
        assert.equal(popup.option('visible'), true);

        pointerMock(document).start().down();
        assert.equal(popup.option('visible'), false);
    });

    QUnit.test('click on list item hides drop-down list if closeOnClick=true', function(assert) {
        assert.expect(4);

        this.ddMenu.option({
            items: [1, 2, 3],
            closeOnClick: false
        });
        this.toggleMenu();

        const popup = this.popup;
        const $list = this.$list;

        assert.equal(popup.option('visible'), true, 'popup is visible');

        $($list).trigger('dxclick');
        assert.equal(popup.option('visible'), true, 'click on list does not hide popup');

        $($list.find('.dx-list-item').first()).trigger('dxclick');
        assert.equal(popup.option('visible'), true, 'popup is visible');

        this.ddMenu.option('closeOnClick', true);
        $($list.find('.dx-list-item').first()).trigger('dxclick');
        assert.equal(popup.option('visible'), false, 'popup is hidden');
    });

    QUnit.test('click on list item is not outside click for popup', function(assert) {
        assert.expect(1);


        this.toggleMenu();

        this.popup.option('visible', false);
        assert.equal(this.ddMenu.option('opened'), false);
    });
});

QUnit.module('integration', () => {
    QUnit.test('list defaults', function(assert) {
        const list = $('#dropDownMenu').dxToolbarMenuList().dxToolbarMenuList('instance');
        assert.strictEqual(list.option('pullRefreshEnabled'), false);
    });

    QUnit.test('button defaults', function(assert) {
        const button = $('#dropDownMenu').dxButton().dxButton('instance');
        assert.strictEqual(button.option('type'), 'normal');
        assert.strictEqual(button.option('text'), '');
    });

    QUnit.test('popupHeight/popupWidth test', function(assert) {
        const $dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            popupHeight: 100,
            popupWidth: 50
        });

        $dropDownMenu.dxDropDownMenu('option', 'opened', true);

        const popup = $dropDownMenu.find('.dx-popover').dxPopover('instance');

        assert.equal(popup.option('height'), 100, 'popover height is right');
        assert.equal(popup.option('width'), 50, 'popover width is right');
    });

    QUnit.test('Popup autoResizeEnabled should be false by default', function(assert) {
        const $dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            opened: true
        });

        const popup = $dropDownMenu.find('.dx-popover').dxPopover('instance');

        assert.equal(popup.option('autoResizeEnabled'), false, 'popup.autoResizeEnabled is false');
    });

    QUnit.test('maxHeight test', function(assert) {
        const $dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            popupMaxHeight: 300,
            opened: true
        });

        const popup = $dropDownMenu.find('.dx-popover').dxPopover('instance');

        assert.equal(popup.option('maxHeight'), 300, 'popover height is right');

        $dropDownMenu.dxDropDownMenu('option', 'popupMaxHeight', 400);

        assert.equal(popup.option('maxHeight'), 400, 'popover height is right');
    });

    QUnit.test('popup target shoud be configured correctly', function(assert) {
        const $dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            opened: true
        });

        const $popup = $('.dx-popover');
        const $target = $($popup.dxPopover('option', 'target'));

        assert.equal($target.get(0), $dropDownMenu.get(0), 'popover target is drop down menu button');
    });

    QUnit.test('Popup vertical offset should be correct in material', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        try {
            const dropDownMenu = $('#dropDownMenu').dxDropDownMenu({}).dxDropDownMenu('instance');

            assert.deepEqual(dropDownMenu.option('popupPosition').offset, { v: 1 }, 'vertical offset is right');
        } finally {
            themes.isMaterial = origIsMaterial;
        }
    });

    QUnit.test('Popover arrow should be hide', function(assert) {
        $('#dropDownMenu').dxDropDownMenu({});

        $('.dx-dropdownmenu-button').trigger('dxclick');

        let $arrow = $('.dx-popover-arrow');

        assert.equal($('.dx-popover').length, 1, 'popup is selected');
        assert.equal(getHeight($arrow), 0, 'no arrow height in popup mode');
        assert.equal(getWidth($arrow), 0, 'no arrow width in popup mode');

        $('.dx-dropdownmenu-button').trigger('dxclick');
        $arrow = $('.dx-popover-arrow');

        assert.equal($('.dx-popover').length, 1, 'popover is selected');
        assert.strictEqual(getHeight($arrow), 0, 'arrow height in popover mode');
        assert.strictEqual(getWidth($arrow), 0, 'arrow width in popover mode');
    });

    QUnit.test('paginateEnabled is false by default', function(assert) {
        const dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            dataSource: [1, 2, 3]
        }).dxDropDownMenu('instance');

        assert.equal(dropDownMenu._dataSource.paginate(), false, 'paginate is false');
    });

    QUnit.test('the \'onItemRendered\' option should be proxied to the list', function(assert) {
        const options = {
            dataSource: [1, 2],
            onItemRendered: noop,
            opened: true
        };
        const itemRenderedCallback = sinon.stub(options, 'onItemRendered');
        const dropDownMenu = $('#dropDownMenu').dxDropDownMenu(options).dxDropDownMenu('instance');
        const itemRenderedCallbackArgs = itemRenderedCallback.getCall(0).args[0];

        assert.equal(itemRenderedCallback.callCount, 2, 'onItemRendered was fired');
        assert.equal(dropDownMenu._list.element(), itemRenderedCallbackArgs.element, 'onItemRendered was fired in the right context');
        assert.equal(dropDownMenu._list, itemRenderedCallbackArgs.component, 'onItemRendered was fired in the right context');
    });

    QUnit.test('the \'activeStateEnabled\' option should be proxied to the list', function(assert) {
        const dropDownMenu = $('#dropDownMenu').dxDropDownMenu({
            dataSource: [1, 2],
            activeStateEnabled: false,
            opened: true
        }).dxDropDownMenu('instance');

        assert.notOk(dropDownMenu._list.option('activeStateEnabled'), 'activeStateEnabled is OK');

        dropDownMenu.option('activeStateEnabled', true);

        assert.ok(dropDownMenu._list.option('activeStateEnabled'), 'activeStateEnabled is OK after option change');
    });
});

QUnit.module('regression', moduleConfig, () => {
    QUnit.test('B233109: dropDownMenu menu interference', function(assert) {
        const ddMenu1 = $('#dropDownMenu').dxDropDownMenu({ items: [{ text: 'test1' }], opened: true }).dxDropDownMenu('instance');
        const ddMenu2 = $('#dropDownMenuSecond').dxDropDownMenu({ items: [{ text: 'test2' }], opened: true }).dxDropDownMenu('instance');
        const $button1 = $(ddMenu1._button.$element());
        const $button2 = $(ddMenu2._button.$element());
        const popup1 = ddMenu1._popup;
        const popup2 = ddMenu2._popup;

        ddMenu1.close();
        ddMenu2.close();

        assert.equal(popup1.option('visible'), false);
        assert.equal(popup2.option('visible'), false);

        $button1
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(popup1.option('visible'), true);
        assert.equal(popup2.option('visible'), false);

        $button2
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(popup1.option('visible'), false);
        assert.equal(popup2.option('visible'), true);

        $button1
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(popup1.option('visible'), true);
        assert.equal(popup2.option('visible'), false);

        $('#qunit-fixture')
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(popup1.option('visible'), false);
        assert.equal(popup2.option('visible'), false);
    });

    QUnit.test('B250811 - Cancel item in overflow menu on Android does not work', function(assert) {
        assert.expect(1);

        const that = this;

        that.ddMenu.option({
            items: [
                'Item 0'
            ],
            onItemClick: function() {
                assert.equal(that.popup.option('visible'), false, 'popup hides before onItemClick executed');
            }
        });

        that.toggleMenu();

        that.$list
            .find('.dx-list-item')
            .last()
            .trigger('dxclick');
    });
});

QUnit.module('widget sizing render', {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
    }
}, () => {
    QUnit.test('constructor', function(assert) {
        const dropDownMenuWidth = 400;
        const $element = $('#dropDownMenu').dxDropDownMenu({
            items: [
                'Item 0',
                'Item 1',
                'Item 2'
            ],
            width: dropDownMenuWidth
        });
        const instance = $element.dxDropDownMenu('instance');
        const borderWidth = parseInt($element.css('borderLeftWidth'));

        instance.open();

        assert.strictEqual(instance.option('width'), dropDownMenuWidth);
        assert.strictEqual(getOuterWidth($element), dropDownMenuWidth, 'outer width of the element must be equal to custom width');
        assert.strictEqual(getOuterWidth(instance._popup.$element()), dropDownMenuWidth - 2 * borderWidth, 'outer width of the popup must be equal to custom width minus border');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu({
            items: [
                'Item 0',
                'Item 1',
                'Item 2'
            ]
        });
        const instance = $element.dxDropDownMenu('instance');
        const customWidth = 400;
        const borderWidth = parseInt($element.css('borderLeftWidth'));

        instance.option('width', customWidth);
        instance.open();

        assert.strictEqual(getOuterWidth(instance._popup.$element()), customWidth - 2 * borderWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.element = $('#dropDownMenu').dxDropDownMenu({
            items: [1, 2, 3],
            focusStateEnabled: true,
            opened: true
        });
        this.instance = this.element.dxDropDownMenu('instance');

        this.button = this.instance._button;
        this.$button = $(this.button.$element());
        this.keyboard = keyboardMock(this.$button);
        this.popup = this.instance._popup;

        this.popup = this.instance._popup;
        this.$popup = $(this.popup.$element());
        this.$popupContent = $(this.popup.$content());

        this.list = this.instance._list;
        this.$list = $(this.list.$element());
        this.$items = this.$list.find('.dx-list-item');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('list focusStateEnabled option', function(assert) {
        assert.expect(3);

        this.instance.option({ focusStateEnabled: false });
        assert.ok(!this.list.option('focusStateEnabled'));

        this.instance.option('focusStateEnabled', true);
        assert.ok(this.list.option('focusStateEnabled'));

        assert.equal(this.$list.attr('tabindex'), -1, 'tabindex for list is -1');
    });

    QUnit.test('enter/space keys', function(assert) {
        assert.expect(3);

        this.instance.close();
        this.$button.focusin();
        assert.ok(this.$button.hasClass(STATE_FOCUSED_CLASS), 'element is focused');

        this.keyboard.keyDown('enter');
        assert.ok(this.popup.option('visible'));

        this.keyboard.keyDown('space');
        assert.ok(!this.popup.option('visible'));
    });

    QUnit.test('navigation by arrows', function(assert) {
        assert.expect(4);

        this.instance.close();
        this.$button.focusin();

        this.keyboard.keyDown('enter');
        assert.ok(this.popup.option('visible'));
        this.keyboard.keyDown('down');
        assert.ok(this.$items.eq(0).hasClass(STATE_FOCUSED_CLASS), 'first item has focus class');

        this.keyboard.keyDown('down');
        assert.ok(this.$items.eq(1).hasClass(STATE_FOCUSED_CLASS), 'second item has focus class');

        this.keyboard.keyDown('up');
        assert.ok(this.$items.eq(0).hasClass(STATE_FOCUSED_CLASS), 'first item has focus class');
    });

    QUnit.test('hide popup on press tab', function(assert) {
        assert.expect(2);

        this.instance.close();
        this.$button.focusin();

        this.keyboard.keyDown('enter');
        assert.ok(this.popup.option('visible'));
        this.keyboard.keyDown('tab');

        assert.ok(!this.popup.option('visible'));

    });

    QUnit.test('Enter or space press should call onItemClick (T318240)', function(assert) {
        let itemClicked = 0;

        this.instance.option('onItemClick', function() { itemClicked++; });

        this.instance.close();
        this.$button.focusin();

        this.keyboard.keyDown('enter');
        this.keyboard.keyDown('down');
        this.keyboard.keyDown('enter');

        this.keyboard.keyDown('enter');
        this.keyboard.keyDown('down');
        this.keyboard.keyDown('space');

        assert.equal(itemClicked, 2, 'item was clicked twice');
    });

    QUnit.test('No exceptions on \'tab\' key pressing when popup is not opened', function(assert) {
        assert.expect(0);
        const instance = $('#dropDownMenuKeyboard').dxDropDownMenu({ focusStateEnabled: true }).dxDropDownMenu('instance');
        const $element = $(instance.$element());
        const keyboard = keyboardMock($element);

        keyboard.keyDown('tab');
    });
});

QUnit.module('\'opened\' option', moduleConfig, () => {
    QUnit.test('Default option value', function(assert) {
        const instance = $('#dropDownMenu').dxDropDownMenu('instance');

        assert.strictEqual(instance.option('opened'), false, 'Option\'s default value is correct');
    });

    QUnit.test('Change menu visibility by open() and close() methods', function(assert) {
        const instance = $('#dropDownMenu').dxDropDownMenu('instance');

        instance.open();
        assert.ok($(document.body).find('.dx-overlay-wrapper').length, 'Correctly opened by open()');

        instance.close();
        assert.ok(!$(document.body).find('.dx-overlay-wrapper').length, 'Correctly closed by close()');
    });

    QUnit.test('Change menu visibility by option \'opened\' change', function(assert) {
        const instance = $('#dropDownMenu').dxDropDownMenu('instance');

        instance.option('opened', true);
        assert.ok($(document.body).find('.dx-overlay-wrapper').length, 'Correctly opened by option change');

        instance.option('opened', false);
        assert.ok(!$(document.body).find('.dx-overlay-wrapper').length, 'Correctly closed by option change');
    });

    QUnit.test('option opened should change after button click', function(assert) {
        this.element.dxDropDownMenu();

        this.toggleMenu();

        assert.ok(this.ddMenu.option('opened'), 'option opened change to true');
    });
});

QUnit.module('aria accessibility', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('aria role for widget', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu();

        assert.equal($element.attr('role'), 'menubar');
    });

    QUnit.test('aria-haspopup for widget', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu();

        assert.equal($element.attr('aria-haspopup'), 'true');
    });

    QUnit.test('aria role for list items', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu({ items: [1, 2, 3], opened: true });
        $('#dropDownMenu').dxDropDownMenu('close');

        assert.equal($element.find('.dx-list-item:first').attr('role'), 'menuitem');
    });

    QUnit.test('aria-activedescendant on widget should point to focused list item', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu({ items: [1, 2, 3], opened: true });
        const instance = $element.dxDropDownMenu('instance');
        instance.close();

        const $listItem = $element.find('.dx-list-item:first');
        const list = $element.find('.dx-list').dxToolbarMenuList('instance');

        instance.open();
        list.option('focusedElement', $listItem);

        assert.notEqual($element.attr('aria-activedescendant'), undefined);
        assert.equal($element.attr('aria-activedescendant'), $listItem.attr('id'));
    });

    QUnit.test('aria-expanded property', function(assert) {
        const $element = $('#dropDownMenu').dxDropDownMenu({ items: [1, 2, 3] });
        const instance = $element.dxDropDownMenu('instance');

        instance.close();
        assert.equal($element.attr('aria-expanded'), 'false', 'collapsed by default');

        $($element).trigger('dxclick');
        assert.equal($element.attr('aria-expanded'), 'true', 'expanded after click');

        $($element).trigger('dxclick');
        assert.equal($element.attr('aria-expanded'), 'false', 'collapsed after click');

        instance.open();
        assert.equal($element.attr('aria-expanded'), 'true', 'expanded after option change');

        const $listItem = $(instance._popup.$content().find('.dx-list-item').first());
        $($listItem).trigger('dxclick');
        assert.equal($element.attr('aria-expanded'), 'false', 'collapsed after item click');
    });
});
