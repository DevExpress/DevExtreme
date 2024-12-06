import { getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import ArrayStore from 'common/data/array_store';
import fx from 'common/core/animation/fx';
import Button from 'ui/button';
import Popup from 'ui/popup';
import DropDownMenu from '__internal/ui/toolbar/internal/m_toolbar.menu';
import ToolbarMenuList from '__internal/ui/toolbar/internal/m_toolbar.menu.list';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import config from 'core/config';
import { DataSource } from 'common/data/data_source/data_source';
import { isRenderer } from 'core/utils/type';
import themes from 'ui/themes';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownMenu"></div>\
        <div id="dropDownMenuSecond"></div>';

    $('#qunit-fixture').html(markup);
});

const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
const DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';
const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';


const moduleConfig = {
    beforeEach: function() {
        executeAsyncMock.setup();
        fx.off = true;

        this.clock = sinon.useFakeTimers();

        this.$element = $('#dropDownMenu');
        this.instance = new DropDownMenu($('#dropDownMenu'));

        this.overflowMenu = {
            click: () => {
                this.$element.trigger('dxclick');
            },
            button: () => {
                return this.instance._button;
            },
            $button() {
                return $(this.button().$element());
            },
            list: () => {
                return this.instance._list;
            },
            $list() {
                return $(this.list().$element());
            },
            popup: () => {
                return this.instance._popup;
            },
            $popup() {
                return $(this.popup().$element());
            },
            $popupContent() {
                return $(this.popup().$content());
            },
            $items() {
                return this.$list().find(`.${LIST_ITEM_CLASS}`);
            }
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('render with popup', moduleConfig, () => {
    QUnit.test('default', function(assert) {
        assert.ok(this.overflowMenu.button() instanceof Button);
        assert.ok(this.$element.hasClass(DROP_DOWN_MENU_CLASS));
        assert.ok(this.overflowMenu.$button().hasClass(DROP_DOWN_MENU_BUTTON_CLASS));

        this.overflowMenu.click();

        assert.ok(this.overflowMenu.popup() instanceof Popup);

        assert.ok(this.overflowMenu.$list().hasClass(DROP_DOWN_MENU_LIST_CLASS));
        assert.equal(this.overflowMenu.$items().length, 0);
        assert.ok(this.overflowMenu.$popup().dxPopup('instance'));
    });

    QUnit.test('list should be rendered before onContentReady of the popup', function(assert) {
        assert.expect(1);

        try {
            Popup.defaultOptions({
                options: {
                    onContentReady: () => {
                        assert.strictEqual(this.overflowMenu.$list().length, 1, 'List is already rendered');
                    }
                }
            });

            this.overflowMenu.click();
        } finally {
            Popup.defaultOptions({ options: { onContentReady: () => {} } });
        }
    });

    QUnit.test('w/ options - items', function(assert) {
        this.instance.option('items', [ 'Item 0', 'Item 1', 'Item 2' ]);

        this.overflowMenu.click();

        assert.equal(this.overflowMenu.$items().length, 3);

        this.instance.option({
            items: [
                'Item 3',
                'Item 4'
            ],
        });
        this.overflowMenu.click();
        assert.equal(this.overflowMenu.$items().length, 2);
    });

    QUnit.test('w/ options - dataSource', function(assert) {
        this.instance.option('items', [ 'Item 0', 'Item 1', 'Item 2' ]);

        this.overflowMenu.click();

        assert.equal(this.overflowMenu.$items().length, 3);

        this.instance.option({
            dataSource: new DataSource([
                'Item 3',
                'Item 4'
            ]),
        });

        assert.equal(this.overflowMenu.$items().length, 2);
    });

    QUnit.test('RTL support', function(assert) {
        const RTL_SELECTOR = '.dx-rtl';
        this.instance.option({
            dataSource: new ArrayStore(['Item 0', 'Item 1', 'Item 2']),
            rtlEnabled: true,
        });

        this.instance.option();
        this.overflowMenu.click();
        assert.ok($(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS} ${RTL_SELECTOR}`).length > 0, 'menu is in RTL mode');
    });

    QUnit.test('correct wrapper classes should be set', function(assert) {
        const dropDownMenu = new DropDownMenu($('<div>').appendTo('#qunit-fixture'), {
            animation: {
                show: {
                    start: function() {
                        const $wrapper = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
                        assert.strictEqual($wrapper.hasClass(DROP_DOWN_MENU_POPUP_CLASS), true, 'popup class added');
                    }
                }
            }
        });

        dropDownMenu.option('opened', true);
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
});


QUnit.module('render', moduleConfig, () => {
    QUnit.test('w/ options - visible', function(assert) {
        const overflowMenuButton = this.overflowMenu.button();

        this.instance.option('visible', false);
        assert.equal(overflowMenuButton.option('visible'), false);

        this.instance.option('visible', false);
        assert.equal(overflowMenuButton.option('visible'), false);

        this.instance.option('visible', true);
        assert.equal(overflowMenuButton.option('visible'), true);

        this.instance.option('visible', true);
        assert.equal(overflowMenuButton.option('visible'), true);
    });

    QUnit.test('w/ options - deferRendering', function(assert) {
        this.instance.option({
            items: [0, 1, 2],
            deferRendering: true
        });

        this.overflowMenu.click();
        this.instance.option('opened', false);
        this.instance.option('items', [3, 4, 5]);

        assert.equal(this.overflowMenu.$items().text(), '012');

        this.overflowMenu.click();
        assert.equal(this.overflowMenu.$items().text(), '345');
    });

    QUnit.test('w/ options - itemTemplate', function(assert) {
        this.instance.option({
            items: [0, 1, 2],
            itemTemplate: function(item, itemIndex, itemElement) {
                assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
                return 'Item' + item;
            }
        });

        this.overflowMenu.click();

        assert.equal(this.overflowMenu.$items().text(), 'Item0Item1Item2');
    });

    QUnit.test('custom item template can return default template name', function(assert) {
        this.instance.option({
            items: [1, 2],
            itemTemplate: function() {
                return 'item';
            }
        });
        this.overflowMenu.click();

        const $items = this.overflowMenu.list().itemElements();

        assert.strictEqual($items.eq(0).text(), '1', 'default item template was applied');
        assert.strictEqual($items.eq(1).text(), '2', 'default item template was applied');
    });

    QUnit.test('popup should be rendered after first click only', function(assert) {
        assert.strictEqual(this.overflowMenu.popup(), undefined, 'popup is not rendered before it is opened');

        this.instance.option('opened', true);

        assert.strictEqual(this.overflowMenu.$popup().length, 1, 'popup is not rendered before it is opened');
    });

    QUnit.test('popup should be rendered if opened option is set to true on init', function(assert) {
        this.instance.option('opened', true);

        assert.ok(this.overflowMenu.popup().option('visible'), 'popup is visible');
    });

    QUnit.test('popup should be placed into container specified in the \'container\' option', function(assert) {
        const $container = $('#dropDownMenu');
        this.instance.option({
            container: $container,
            opened: true
        });

        assert.strictEqual(this.overflowMenu.$popupContent().closest($container).length, 1, 'Popover content located into desired container');
    });

    QUnit.test('popup should be placed into new container after changing the \'container\' option', function(assert) {
        const $container = $('#dropDownMenu');

        this.instance.option('opened', true);
        this.instance.option('container', $container);

        assert.strictEqual(this.overflowMenu.$popupContent().closest($container).length, 1, 'Popup content located into desired container');
    });
});

QUnit.module('behavior', moduleConfig, () => {
    QUnit.test('first click on button shows drop-down list, second click hides', function(assert) {
        this.overflowMenu.click();

        const popup = this.overflowMenu.popup();
        assert.ok(popup.option('visible'), 'popup is opened after first click');

        this.overflowMenu.click();
        assert.ok(!popup.option('visible'), 'popup is closed after second click');
    });

    QUnit.test('click outside of popup hides drop-down list', function(assert) {
        this.overflowMenu.click();

        const popup = this.overflowMenu.popup();
        assert.equal(popup.option('visible'), true);

        pointerMock(document).start().down();
        assert.equal(popup.option('visible'), false);
    });

    QUnit.test('click on list item hides drop-down list if closeOnClick=true', function(assert) {
        assert.expect(4);

        this.instance.option({
            items: [1, 2, 3],
            closeOnClick: false
        });
        this.overflowMenu.click();

        const popup = this.overflowMenu.popup();
        const $list = this.overflowMenu.$list();

        assert.equal(popup.option('visible'), true, 'popup is visible');

        $($list).trigger('dxclick');
        assert.equal(popup.option('visible'), true, 'click on list does not hide popup');

        $(this.overflowMenu.$items().first()).trigger('dxclick');
        assert.equal(popup.option('visible'), true, 'popup is visible');

        this.instance.option('closeOnClick', true);
        $(this.overflowMenu.$items().first()).trigger('dxclick');
        assert.equal(popup.option('visible'), false, 'popup is hidden');
    });

    QUnit.test('click on list item is not outside click for popup', function(assert) {
        assert.expect(1);

        this.overflowMenu.click();

        this.overflowMenu.popup().option('visible', false);
        assert.equal(this.instance.option('opened'), false);
    });
});


QUnit.module('integration', moduleConfig, () => {
    QUnit.test('list defaults', function(assert) {
        const list = new ToolbarMenuList($('#dropDownMenu'));
        assert.strictEqual(list.option('pullRefreshEnabled'), false);
        assert.strictEqual(list.option('activeStateEnabled'), true);
    });

    QUnit.test('button defaults', function(assert) {
        const button = $('#dropDownMenu').dxButton().dxButton('instance');
        assert.strictEqual(button.option('type'), 'normal');
        assert.strictEqual(button.option('text'), '');
        assert.strictEqual(button.option('template'), 'content');
        assert.strictEqual(button.option('width'), undefined);
        assert.strictEqual(button.option('height'), undefined);
    });

    [true, false].forEach(isMaterial => {
        [true, false].forEach(rtlEnabled => {
            QUnit.test(`popup defaults, rtlEnabled: ${rtlEnabled}, isMaterialTheme: ${isMaterial}`, function(assert) {
                const origIsMaterial = themes.isMaterial;
                themes.isMaterial = function() { return true; };

                try {
                    this.instance.option('rtlEnabled', rtlEnabled);

                    this.overflowMenu.click();

                    const popup = this.overflowMenu.popup();

                    assert.strictEqual(popup.option('height'), 'auto', 'popup.height');
                    assert.strictEqual(popup.option('width'), 'auto', 'popup.width');
                    assert.strictEqual(popup.option('autoResizeEnabled'), false, 'popup.autoResizeEnabled');
                    assert.strictEqual(popup.option('visible'), true, 'popup.visible');

                    assert.strictEqual(popup.option('deferRendering'), false, 'popup.deferRendering');
                    assert.strictEqual(popup.option('hideOnParentScroll'), true, 'popup.hideOnParentScroll');
                    assert.strictEqual(popup.option('shading'), false, 'popup.shading');
                    assert.strictEqual(popup.option('dragEnabled'), false, 'popup.dragEnabled');
                    assert.strictEqual(popup.option('showTitle'), false, 'popup.showTitle');
                    assert.strictEqual(popup.option('_fixWrapperPosition'), true, 'popup._fixWrapperPosition');

                    const { my, at, collision, offset, of } = popup.option('position');

                    assert.strictEqual(my, `top ${rtlEnabled ? 'left' : 'right'}`, 'popup.position.my');
                    assert.strictEqual(at, `bottom ${rtlEnabled ? 'left' : 'right'}`, 'popup.position.at');
                    assert.strictEqual(collision, 'fit flip', 'popup.position.collision');
                    assert.deepEqual(offset, { v: 3 }, 'popup.position.offset');
                    assert.deepEqual(of.get(0), this.$element.get(0), 'popup.position.of');

                } finally {
                    themes.isMaterial = origIsMaterial;
                }
            });
        });
    });

    QUnit.test('paginateEnabled is false by default', function(assert) {
        this.instance.option({
            dataSource: [1, 2, 3],
            opened: true,
        });

        assert.strictEqual(this.overflowMenu.list()._dataSource.paginate(), false, 'paginate is false');
    });

    QUnit.test('the \'onItemRendered\' option should be proxied to the list', function(assert) {
        const onItemRenderedHandler = sinon.stub();

        this.instance.option({
            dataSource: [1, 2],
            onItemRendered: onItemRenderedHandler,
            opened: true
        });
        const itemRenderedCallbackArgs = onItemRenderedHandler.getCall(0).args[0];

        assert.strictEqual(onItemRenderedHandler.callCount, 2, 'onItemRendered was fired');
        assert.strictEqual(this.overflowMenu.list().element(), itemRenderedCallbackArgs.element, 'onItemRendered was fired in the right context');
        assert.strictEqual(this.overflowMenu.list(), itemRenderedCallbackArgs.component, 'onItemRendered was fired in the right context');
    });
});

QUnit.module('regression', moduleConfig, () => {
    QUnit.test('B233109: dropDownMenu menu interference', function(assert) {
        this.instance.option({ items: [{ text: 'test1' }], opened: true });
        const ddMenu2 = new DropDownMenu($('#dropDownMenuSecond'));

        ddMenu2.option({ items: [{ text: 'test2' }], opened: true });

        const $button2 = $(ddMenu2._button.$element());
        const popup2 = ddMenu2._popup;

        this.overflowMenu.click();
        ddMenu2.option('opened', false);

        assert.equal(this.overflowMenu.popup().option('visible'), false);
        assert.equal(popup2.option('visible'), false);

        this.overflowMenu.$button()
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(this.overflowMenu.popup().option('visible'), true);
        assert.equal(popup2.option('visible'), false);

        $button2
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(this.overflowMenu.popup().option('visible'), false);
        assert.equal(popup2.option('visible'), true);

        this.overflowMenu.$button()
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(this.overflowMenu.popup().option('visible'), true);
        assert.equal(popup2.option('visible'), false);

        $('#qunit-fixture')
            .trigger('dxpointerdown')
            .trigger('dxclick');

        assert.equal(this.overflowMenu.popup().option('visible'), false);
        assert.equal(popup2.option('visible'), false);
    });

    QUnit.test('B250811 - Cancel item in overflow menu on Android does not work', function(assert) {
        assert.expect(1);

        this.instance.option({
            items: [
                'Item 0'
            ],
            onItemClick: () => {
                assert.equal(this.overflowMenu.popup().option('visible'), false, 'popup hides before onItemClick executed');
            }
        });

        this.overflowMenu.click();

        this.overflowMenu.$items()
            .last()
            .trigger('dxclick');
    });
});

QUnit.module('widget sizing render', moduleConfig, () => {
    QUnit.test('constructor', function(assert) {
        const dropDownMenuWidth = 400;
        this.instance.option({
            items: [
                'Item 0',
                'Item 1',
                'Item 2'
            ],
            width: dropDownMenuWidth
        });

        this.overflowMenu.click();

        assert.strictEqual(this.instance.option('width'), dropDownMenuWidth);
        assert.strictEqual(getOuterWidth(this.$element), dropDownMenuWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        this.instance.option({
            items: [
                'Item 0',
                'Item 1',
                'Item 2'
            ]
        });

        const customWidth = 400;

        this.instance.option('width', customWidth);
        this.overflowMenu.click();

        assert.strictEqual(getOuterWidth(this.$element), customWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.module('keyboard navigation', {
        beforeEach: function() {
            this.instance.option({
                items: [1, 2, 3],
                focusStateEnabled: true,
                opened: true
            });

            this.keyboard = keyboardMock(this.overflowMenu.$button());
        }
    }, () => {
        QUnit.test('list focusStateEnabled option', function(assert) {
            assert.expect(3);

            this.instance.option({ focusStateEnabled: false });
            assert.ok(!this.overflowMenu.list().option('focusStateEnabled'));

            this.instance.option('focusStateEnabled', true);
            assert.ok(this.overflowMenu.list().option('focusStateEnabled'));

            const $listItemContainer = this.overflowMenu.$list().find(`.${SCROLLVIEW_CONTENT_CLASS}`);
            assert.equal($listItemContainer.attr('tabindex'), -1, 'tabindex for list is -1');
        });

        QUnit.test('enter/space keys', function(assert) {
            assert.expect(3);

            this.instance.option('opened', false);
            this.overflowMenu.$button().focusin();
            assert.ok(this.overflowMenu.$button().hasClass(STATE_FOCUSED_CLASS), 'element is focused');

            this.keyboard.keyDown('enter');
            assert.ok(this.overflowMenu.popup().option('visible'));

            this.keyboard.keyDown('space');
            assert.ok(!this.overflowMenu.popup().option('visible'));
        });

        QUnit.test('navigation by arrows', function(assert) {
            assert.expect(4);

            this.instance.option('opened', false);
            this.overflowMenu.$button().focusin();

            this.keyboard.keyDown('enter');
            assert.ok(this.overflowMenu.popup().option('visible'));
            this.keyboard.keyDown('down');
            assert.ok(this.overflowMenu.$items().eq(0).hasClass(STATE_FOCUSED_CLASS), 'first item has focus class');

            this.keyboard.keyDown('down');
            assert.ok(this.overflowMenu.$items().eq(1).hasClass(STATE_FOCUSED_CLASS), 'second item has focus class');

            this.keyboard.keyDown('up');
            assert.ok(this.overflowMenu.$items().eq(0).hasClass(STATE_FOCUSED_CLASS), 'first item has focus class');
        });

        QUnit.test('hide popup on press tab', function(assert) {
            assert.expect(2);

            this.instance.option('opened', false);
            this.overflowMenu.$button().focusin();

            this.keyboard.keyDown('enter');
            assert.ok(this.overflowMenu.popup().option('visible'));
            this.keyboard.keyDown('tab');

            assert.ok(!this.overflowMenu.popup().option('visible'));

        });

        QUnit.test('Enter or space press should call onItemClick (T318240)', function(assert) {
            let itemClicked = 0;

            this.instance.option('onItemClick', function() { itemClicked++; });

            this.instance.option('opened', false);
            this.overflowMenu.$button().focusin();

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

            this.instance.option({ focusStateEnabled: true });

            const keyboard = keyboardMock(this.$element);

            keyboard.keyDown('tab');
        });
    });
});

QUnit.module('\'opened\' option', moduleConfig, () => {
    QUnit.test('Default option value', function(assert) {
        assert.strictEqual(this.instance.option('opened'), false, 'Option\'s default value is correct');
    });

    QUnit.test('Change menu visibility by option \'opened\' change', function(assert) {
        this.instance.option('opened', true);
        assert.ok($(document.body).find('.dx-overlay-wrapper').length, 'Correctly opened by option change');

        this.instance.option('opened', false);
        assert.ok(!$(document.body).find('.dx-overlay-wrapper').length, 'Correctly closed by option change');
    });

    QUnit.test('option opened should change after button click', function(assert) {
        this.overflowMenu.click();

        assert.ok(this.instance.option('opened'), 'option opened change to true');
    });
});

QUnit.module('aria accessibility', moduleConfig, () => {
    QUnit.test('aria role for widget', function(assert) {
        assert.strictEqual(this.$element.attr('role'), 'button');
    });

    QUnit.test('aria-haspopup for widget', function(assert) {
        assert.strictEqual(this.$element.attr('aria-haspopup'), 'true');
    });

    QUnit.test('aria role for widget after Popup opening (T1157065)', function(assert) {
        this.instance.option({ items: [1, 2, 3] });

        this.overflowMenu.click();

        assert.strictEqual(this.$element.attr('role'), 'button');
    });

    QUnit.test('aria role for section container (T1157065)', function(assert) {
        this.instance.option({ items: [1, 2, 3] });

        this.overflowMenu.click();

        assert.strictEqual(this.overflowMenu.$popupContent().find(`.${SCROLLVIEW_CONTENT_CLASS}`).attr('role'), 'menu');
    });

    QUnit.test('aria role for list items', function(assert) {
        this.instance.option({ items: [1, 2, 3], opened: true });

        this.overflowMenu.click();

        assert.strictEqual(this.$element.find('.dx-list-item:first').attr('role'), 'menuitem');
    });

    QUnit.test('aria-activedescendant on widget should point to focused list item', function(assert) {
        this.instance.option({ items: [1, 2, 3], opened: true });

        this.overflowMenu.click();

        const $listItem = this.$element.find('.dx-list-item:first');

        this.overflowMenu.click();
        const list = this.overflowMenu.list();
        list.option('focusedElement', $listItem);

        const $listItemContainer = list.$element().find(`.${SCROLLVIEW_CONTENT_CLASS}`);
        assert.notEqual($listItemContainer.attr('aria-activedescendant'), undefined);
        assert.strictEqual($listItemContainer.attr('aria-activedescendant'), $listItem.attr('id'));
    });

    QUnit.test('aria-expanded property', function(assert) {
        this.instance.option({ items: [1, 2, 3] });

        assert.strictEqual(this.$element.attr('aria-expanded'), 'false', 'collapsed by default');

        this.overflowMenu.click();
        assert.strictEqual(this.$element.attr('aria-expanded'), 'true', 'expanded after click');

        this.overflowMenu.click();
        assert.strictEqual(this.$element.attr('aria-expanded'), 'false', 'collapsed after click');

        this.overflowMenu.click();
        assert.strictEqual(this.$element.attr('aria-expanded'), 'true', 'expanded after option change');

        const $listItem = $(this.overflowMenu.$popupContent().find('.dx-list-item').first());

        $($listItem).trigger('dxclick');
        assert.strictEqual(this.$element.attr('aria-expanded'), 'false', 'collapsed after item click');
    });
});
