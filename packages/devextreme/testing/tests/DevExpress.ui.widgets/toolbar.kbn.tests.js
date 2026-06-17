import $ from 'jquery';
import fx from 'common/core/animation/fx';

import {
    DISABLED_STATE_CLASS,
    FOCUSED_STATE_CLASS,
} from '__internal/core/widget/widget';

import { TOOLBAR_ITEM_CLASS } from '__internal/ui/toolbar/toolbar.base';
import {
    DROP_DOWN_MENU_BUTTON_CLASS,
    TOOLBAR_FOCUS_MODE_CLASS,
    MENU_ITEM_CLASS,
    MENU_ITEM_EXPANDED_CLASS,
    TOOLBAR_SEPARATOR_CLASS,
} from '__internal/ui/toolbar/constants';
import {
    DROP_DOWN_MENU_POPUP_WRAPPER_CLASS,
    DROP_DOWN_MENU_LIST_FOCUS_MODE_CLASS,
} from '__internal/ui/toolbar/internal/toolbar.menu';
import {
    focusItemFocusTarget,
} from '__internal/ui/toolbar/internal/roving.utils';
import { getItemFocusTarget } from '__internal/ui/toolbar/toolbar.utils';

import { BUTTON_CLASS } from '__internal/ui/button/button';
import { BUTTON_GROUP_CLASS } from '__internal/ui/button_group';
import { DROP_DOWN_BUTTON_CLASS } from '__internal/ui/drop_down_button';

import { TEXTEDITOR_CLASS, TEXTEDITOR_INPUT_CLASS } from '__internal/ui/text_box/text_editor.base';
import { TEXTBOX_CLASS } from '__internal/ui/text_box/text_box';

import { SWITCH_CLASS } from '__internal/ui/switch';
import { CHECK_BOX_CLASS } from '__internal/ui/check_box/check_box';
import { TABS_CLASS } from '__internal/ui/tabs/tabs';

import { LIST_ITEM_CLASS } from '__internal/ui/list/list.base';
import { DX_MENU_CLASS } from '__internal/ui/context_menu/menu_base';

import 'ui/toolbar';
import 'ui/button';
import 'ui/select_box';
import 'ui/drop_down_button';
import 'ui/button_group';
import 'ui/text_box';
import 'ui/number_box';
import 'ui/date_box';
import 'ui/date_range_box';
import 'ui/color_box';
import 'ui/tag_box';
import 'ui/autocomplete';
import 'ui/switch';
import 'ui/check_box';
import 'ui/menu';
import 'ui/tabs';
import 'ui/popup';
import 'ui/drop_down_editor/ui.drop_down_editor';

import 'fluent_blue_light.css!';

function getActiveElement() {
    const active = document.activeElement;
    return active && active.shadowRoot ? (active.shadowRoot.activeElement || active) : active;
}

const SELECTBOX_CLASS = 'dx-selectbox';
const TOOLBAR_SELECTOR = '#toolbar';

QUnit.testStart(function() {
    const markup = `
        <div id="${TOOLBAR_SELECTOR.substring(1)}"></div>
    `;

    $('#qunit-fixture').html(markup);
});

const buttonItem = (text, extra = {}) => ({
    widget: 'dxButton',
    locateInMenu: 'never',
    ...extra,
    options: { text, ...(extra.options || {}) },
});

const editorItem = (widget, options = {}, extra = {}) => ({
    widget,
    locateInMenu: 'never',
    ...extra,
    options,
});

const helpers = {
    createToolbar(items, options = {}, selector = TOOLBAR_SELECTOR) {
        return $(selector).dxToolbar({ items, ...options }).dxToolbar('instance');
    },

    getAvailableItems: (toolbar) => toolbar._getAvailableItems(),
    getOverflowMenu: (toolbar) => toolbar._layoutStrategy._menu,
    getOverflowList: (menu) => menu._list,
    getOverflowListItems(menu) {
        return this.getOverflowList(menu)._getAvailableItems();
    },

    press(key, target, modifiers = {}) {
        const el = target instanceof Element
            ? target
            : (target && target.get ? target.get(0) : $(TOOLBAR_SELECTOR).get(0));
        el.dispatchEvent(new KeyboardEvent('keydown', {
            key, bubbles: true, cancelable: true, ...modifiers,
        }));
    },

    focusItemAt(toolbar, index) {
        const $items = this.getAvailableItems(toolbar);
        const $item = $items.eq(index);
        toolbar.option('focusedElement', $item.get(0));
        focusItemFocusTarget($item);
        return $item;
    },

    findFocusTarget: ($item) => getItemFocusTarget($item) || $item,

    findInput: ($item) => $item.find(`.${TEXTEDITOR_INPUT_CLASS}`).first(),

    assertFocusedItemAt(assert, toolbar, expectedIndex, message) {
        const $items = this.getAvailableItems(toolbar);
        assert.strictEqual(
            $(toolbar.option('focusedElement')).get(0),
            $items.eq(expectedIndex).get(0),
            message || `focusedElement is item #${expectedIndex}`,
        );
    },

    assertOneTabStop(assert, $toolbar, message) {
        const $stops = $toolbar.find('[tabindex="0"]').not(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual($stops.length, 1, message || 'exactly one tab stop in toolbar');
    },

    assertActiveTabIndex(assert, $item, expected, message) {
        const actual = parseInt(this.findFocusTarget($item).attr('tabindex'), 10);
        assert.strictEqual(actual, expected, message || `active item tabindex=${expected}`);
    },

    createToolbarWithEditorBetweenButtons(widget, options, toolbarOptions) {
        return this.createToolbar(
            [buttonItem('Back'), editorItem(widget, options), buttonItem('Forward')],
            toolbarOptions || {},
        );
    },
};

const EDITOR_FIXTURES = {
    textInput: [
        { widget: 'dxTextBox', options: { value: 'hello', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxNumberBox', options: { value: 42, inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxAutocomplete', options: { items: ['Item 1', 'Item 2'], inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxSelectBox', options: { items: ['Small', 'Medium', 'Large'], value: 'Small', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxDateBox', options: { type: 'date', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxDateRangeBox', options: { startDateInputAttr: { 'aria-label': 'Start' }, endDateInputAttr: { 'aria-label': 'End' } } },
        { widget: 'dxColorBox', options: { value: '#ff0000', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxTagBox', options: { items: ['Red', 'Green', 'Blue'], inputAttr: { 'aria-label': 'Test' } } },
    ],
    popup: [
        { widget: 'dxSelectBox', options: { items: ['Small', 'Medium', 'Large'], inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxDateBox', options: { type: 'date', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxColorBox', options: { value: '#0080ff', inputAttr: { 'aria-label': 'Test' } } },
        { widget: 'dxDateRangeBox', options: { startDateInputAttr: { 'aria-label': 'Start' }, endDateInputAttr: { 'aria-label': 'End' } } },
        { widget: 'dxTagBox', options: { items: ['Red', 'Green', 'Blue'], inputAttr: { 'aria-label': 'Test' } } },
    ],
    toggle: [
        { widget: 'dxSwitch', options: { value: false } },
        { widget: 'dxCheckBox', options: { value: false } },
    ],
    collection: [
        { widget: 'dxButtonGroup', options: { items: [{ text: 'A' }, { text: 'B' }, { text: 'C' }] } },
    ],
};

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.$element = $(TOOLBAR_SELECTOR);
    },
    afterEach: function() {
        fx.off = false;
    },
};

QUnit.module('Enter/Exit: text input editors', moduleConfig, function() {

    EDITOR_FIXTURES.textInput.forEach(({ widget, options }) => {
        QUnit.test(`${widget}: Enter focuses input`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');

            const $input = helpers.findInput(helpers.getAvailableItems(toolbar).eq(1));
            assert.strictEqual(getActiveElement(), $input.get(0),
                `Enter focuses ${widget} input`);
        });

        QUnit.test(`${widget}: arrows blocked while input focused`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');

            const $input = helpers.findInput(helpers.getAvailableItems(toolbar).eq(1));
            helpers.press('ArrowLeft', $input.get(0));
            helpers.press('ArrowRight', $input.get(0));

            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `arrows do not navigate toolbar while ${widget} input is focused`);
        });

        QUnit.test(`${widget}: Esc keeps focusedElement on the editor item`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');
            const $input = helpers.findInput(helpers.getAvailableItems(toolbar).eq(1));
            helpers.press('Escape', $input.get(0));

            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `Esc keeps focusedElement on ${widget} item`);
        });

        QUnit.test(`${widget}: arrows navigate toolbar after Esc exits the editor`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');
            const $input = helpers.findInput(helpers.getAvailableItems(toolbar).eq(1));
            helpers.press('Escape', $input.get(0));
            helpers.press('ArrowRight');

            helpers.assertFocusedItemAt(assert, toolbar, 2,
                `ArrowRight navigates after Esc from ${widget}`);
        });

        if(widget === 'dxTextBox') {
            QUnit.test(`${widget}: enter→exit→arrow cycle preserves single tab stop`, function(assert) {
                const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
                helpers.focusItemAt(toolbar, 1);

                helpers.press('Enter');
                const $input = helpers.findInput(helpers.getAvailableItems(toolbar).eq(1));
                helpers.press('Escape', $input.get(0));
                helpers.press('ArrowRight');

                helpers.assertOneTabStop(assert, this.$element,
                    `single tab stop preserved through ${widget} enter/exit/navigate cycle`);
            });
        }

        QUnit.test(`${widget}: editor toggles dx-state-focused between toolbar navigation and Enter`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            const $editor = helpers.getAvailableItems(toolbar).eq(1).find(`.${TEXTEDITOR_CLASS}`).first();
            assert.strictEqual($editor.hasClass(FOCUSED_STATE_CLASS), false,
                `${widget} root has no dx-state-focused before Enter (plain toolbar navigation)`);

            helpers.press('Enter');

            assert.strictEqual($editor.hasClass(FOCUSED_STATE_CLASS), true,
                `${widget} root gains dx-state-focused after Enter`);
        });
    });
});

QUnit.module('Enter/Exit: dropdown/popup editors (matrix)', moduleConfig, function() {
    const POPUP_WIDGETS = [
        {
            widget: 'dxDropDownButton',
            options: { items: ['Option 1', 'Option 2'], text: 'Actions' },
            getInstance($item) {
                return $item.find(`.${DROP_DOWN_BUTTON_CLASS}`).dxDropDownButton('instance');
            },
            getFocusTarget($item) {
                return $item.find(`.${BUTTON_GROUP_CLASS}`);
            },
            prepareFocus($item) {
                const buttonGroupInstance = $item.find(`.${BUTTON_GROUP_CLASS}`).dxButtonGroup('instance');
                const $firstButton = buttonGroupInstance._buttonsCollection._itemElements().eq(0);
                buttonGroupInstance._buttonsCollection.option('focusedElement', $firstButton.get(0));
            },
        },
    ];

    POPUP_WIDGETS.forEach(({ widget, options, getInstance, getFocusTarget, prepareFocus }) => {
        const focusInner = (toolbar) => {
            const $item = helpers.focusItemAt(toolbar, 1);
            prepareFocus($item);
            return $item;
        };

        ['Enter', ' ', 'ArrowDown'].forEach((key) => {
            const label = key === ' ' ? 'Space' : key;
            QUnit.test(`${widget}: ${label} opens popup`, function(assert) {
                const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
                const $item = key === 'ArrowDown' ? helpers.focusItemAt(toolbar, 1) : focusInner(toolbar);

                helpers.press(key, getFocusTarget($item).get(0));

                assert.strictEqual(getInstance($item).option('opened'), true,
                    `${label} opens ${widget} popup`);
            });
        });

        QUnit.test(`${widget}: arrows blocked while popup is open`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            const $item = focusInner(toolbar);

            helpers.press('Enter', getFocusTarget($item).get(0));

            helpers.press('ArrowRight');
            helpers.press('ArrowLeft');

            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `arrows do not navigate toolbar while ${widget} popup is open`);
        });

        QUnit.test(`${widget}: Esc closes popup and keeps toolbar focus`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            const $item = helpers.focusItemAt(toolbar, 1);
            const instance = getInstance($item);
            instance.option('opened', true);

            helpers.press('Escape', getFocusTarget($item).get(0));

            assert.strictEqual(instance.option('opened'), false,
                `Esc closes ${widget} popup`);
            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `toolbar focus stays on ${widget} item after Esc`);
        });
    });
});

QUnit.module('Enter/Exit: toggle widgets', moduleConfig, function() {
    const TOGGLES = [
        {
            widget: 'dxSwitch',
            options: { value: false, width: 70 },
            containerSelector: `.${SWITCH_CLASS}`,
            toggledByEnter: true,
        },
        {
            widget: 'dxCheckBox',
            options: { text: 'Check', value: false },
            containerSelector: `.${CHECK_BOX_CLASS}`,
            toggledByEnter: false,
        },
    ];

    TOGGLES.forEach(({ widget, options, containerSelector, toggledByEnter }) => {
        const buildAndFocusInner = (toolbar) => {
            const $widgetRoot = toolbar.$element().find(containerSelector);
            const instance = $widgetRoot[widget]('instance');
            $widgetRoot.get(0).focus();
            return { $widgetRoot, instance };
        };

        const enterLabel = toggledByEnter ? 'toggles' : 'does not toggle';
        QUnit.test(`${widget}: Enter ${enterLabel} value`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            const { $widgetRoot, instance } = buildAndFocusInner(toolbar);
            const valueBefore = instance.option('value');

            helpers.press('Enter', $widgetRoot.get(0));

            const valueAfter = instance.option('value');
            if(toggledByEnter) {
                assert.notStrictEqual(valueAfter, valueBefore, `Enter toggles ${widget} value`);
            } else {
                assert.strictEqual(valueAfter, valueBefore, `Enter does not toggle ${widget} value`);
            }
        });

        QUnit.test(`${widget}: Space toggles value`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            const { $widgetRoot, instance } = buildAndFocusInner(toolbar);
            const valueBefore = instance.option('value');

            helpers.press(' ', $widgetRoot.get(0));

            assert.notStrictEqual(instance.option('value'), valueBefore,
                `Space toggles ${widget} value`);
        });

        QUnit.test(`${widget}: ArrowRight navigates toolbar (no inner edit mode)`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('ArrowRight');

            helpers.assertFocusedItemAt(assert, toolbar, 2,
                `ArrowRight navigates from ${widget} (no inner edit mode)`);
        });

        QUnit.test(`${widget}: ArrowLeft navigates toolbar`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('ArrowLeft');

            helpers.assertFocusedItemAt(assert, toolbar, 0,
                `ArrowLeft navigates from ${widget} (no inner edit mode)`);
        });
    });
});

QUnit.module('Enter/Exit: collection widgets', moduleConfig, function() {
    const COLLECTIONS = [
        {
            widget: 'dxMenu',
            options: {
                items: [
                    { text: 'File', items: [{ text: 'New' }, { text: 'Open' }] },
                    { text: 'Edit', items: [{ text: 'Cut' }, { text: 'Copy' }] },
                ],
            },
            innerFocusableSelector: `.${MENU_ITEM_CLASS}`,
        },
    ];

    COLLECTIONS.forEach(({ widget, options, innerFocusableSelector }) => {
        QUnit.test(`${widget}: Enter activates inner navigation`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');

            const $item = helpers.getAvailableItems(toolbar).eq(1);
            assert.strictEqual($item.get(0).contains(getActiveElement(), true), true,
                `Enter places DOM focus inside ${widget}`);
            assert.strictEqual($item.find(innerFocusableSelector).length > 0, true,
                `${widget} has inner focusable elements`);
        });

        QUnit.test(`${widget}: arrows do not navigate toolbar while inner mode is active`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');

            const activeEl = getActiveElement();
            helpers.press('ArrowRight', activeEl);
            helpers.press('ArrowLeft', activeEl);

            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `arrows do not navigate toolbar while inside ${widget}`);
        });

        QUnit.test(`${widget}: Esc returns focus to the toolbar item`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');
            helpers.press('Escape', getActiveElement());

            const $item = helpers.getAvailableItems(toolbar).eq(1);
            assert.strictEqual($item.get(0).contains(getActiveElement()), true,
                `Esc keeps DOM focus inside the ${widget} toolbar item`);
        });

        QUnit.test(`${widget}: arrows navigate toolbar after Esc`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');
            helpers.press('Escape', getActiveElement());
            helpers.press('ArrowRight');

            helpers.assertFocusedItemAt(assert, toolbar, 2,
                `ArrowRight navigates toolbar after Esc from ${widget}`);
        });

        QUnit.test(`${widget}: enter/exit cycle preserves single tab stop`, function(assert) {
            const toolbar = helpers.createToolbarWithEditorBetweenButtons(widget, options);
            helpers.focusItemAt(toolbar, 1);

            helpers.press('Enter');
            helpers.press('Escape', getActiveElement());
            helpers.press('ArrowRight');

            const $tabZero = this.$element.find('[tabindex="0"]');
            assert.strictEqual($tabZero.length, 1,
                `single tab stop preserved through ${widget} enter/exit/navigate cycle`);
        });
    });
});

QUnit.module('Enter/Exit: dxTabs in toolbar', moduleConfig, function() {
    const tabsOptions = {
        items: [{ text: 'Home' }, { text: 'Insert' }, { text: 'Layout' }],
        selectedIndex: 0,
        width: 'auto',
    };
    const setupTabsToolbar = () => helpers.createToolbarWithEditorBetweenButtons('dxTabs', tabsOptions);

    const focusTabsContainer = (toolbar) => {
        helpers.focusItemAt(toolbar, 1);
        const $tabs = helpers.getAvailableItems(toolbar).eq(1).find(`.${TABS_CLASS}`);
        $tabs.get(0).focus();
        return $tabs.dxTabs('instance');
    };

    QUnit.test('ArrowRight on tabs moves toolbar focus to next item', function(assert) {
        const toolbar = setupTabsToolbar();
        helpers.focusItemAt(toolbar, 1);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 2,
            'ArrowRight navigates toolbar away from dxTabs');
    });

    QUnit.test('ArrowLeft on tabs moves toolbar focus to previous item', function(assert) {
        const toolbar = setupTabsToolbar();
        helpers.focusItemAt(toolbar, 1);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'ArrowLeft navigates toolbar away from dxTabs');
    });

    QUnit.test('ArrowDown on focused tabs switches tabs and does not move toolbar focus', function(assert) {
        const toolbar = setupTabsToolbar();
        const tabs = focusTabsContainer(toolbar);
        const selectedBefore = tabs.option('selectedIndex');

        helpers.press('ArrowDown', getActiveElement());

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowDown keeps toolbar focus on tabs item');
        assert.strictEqual(tabs.option('selectedIndex'), selectedBefore + 1,
            'ArrowDown selects the next tab');
    });

    QUnit.test('ArrowUp on focused tabs switches tabs and does not move toolbar focus', function(assert) {
        const toolbar = setupTabsToolbar();
        const tabs = focusTabsContainer(toolbar);
        tabs.option('selectedIndex', 1);
        const selectedBefore = tabs.option('selectedIndex');

        helpers.press('ArrowUp', getActiveElement());

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowUp keeps toolbar focus on tabs item');
        assert.strictEqual(tabs.option('selectedIndex'), selectedBefore - 1,
            'ArrowUp selects the previous tab');
    });
});

QUnit.module('Core Navigation', moduleConfig, function() {
    const makeAlphabetButtonItems = (count) =>
        Array.from({ length: count }, (_, i) => buttonItem(String.fromCharCode(65 + i)));

    QUnit.test('first available item is the roving tabindex anchor on init', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        const $available = helpers.getAvailableItems(toolbar);

        const $tabZeroElements = this.$element.find('[tabindex="0"]');
        assert.strictEqual($tabZeroElements.length, 1, 'exactly one element with tabindex=0');
        assert.strictEqual(
            $tabZeroElements.closest(`.${TOOLBAR_ITEM_CLASS}`).get(0),
            $available.eq(0).get(0),
            'the anchor belongs to the first available item',
        );
    });

    QUnit.test('ArrowRight moves focus to the next item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'focus moved to item[1]');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('ArrowRight on last item wraps focus to first item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        helpers.focusItemAt(toolbar, 2);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 0, 'focus wrapped to first item');
    });

    QUnit.test('ArrowLeft on first item wraps focus to last item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 2, 'focus wrapped to last item');
    });

    QUnit.test('Home moves focus to the first item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        helpers.focusItemAt(toolbar, 2);

        helpers.press('Home');

        helpers.assertFocusedItemAt(assert, toolbar, 0, 'focus moved to first item');
    });

    QUnit.test('End moves focus to the last item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        helpers.focusItemAt(toolbar, 0);

        helpers.press('End');

        helpers.assertFocusedItemAt(assert, toolbar, 2, 'focus moved to last item');
    });

    const disabledScenarios = [
        {
            name: 'options.disabled',
            items: [
                buttonItem('A'),
                buttonItem('B', { options: { disabled: true } }),
                buttonItem('C'),
            ],
        },
        {
            name: 'item.disabled (item-level flag)',
            items: [
                buttonItem('A'),
                buttonItem('B', { disabled: true }),
                buttonItem('C'),
            ],
        },
    ];

    disabledScenarios.forEach(({ name, items }) => {
        QUnit.test(`ArrowRight skips disabled item (${name})`, function(assert) {
            const toolbar = helpers.createToolbar(items);
            const $items = helpers.getAvailableItems(toolbar);
            assert.strictEqual($items.length, 2, 'only 2 available items (disabled filtered out)');

            helpers.focusItemAt(toolbar, 0);
            helpers.press('ArrowRight');

            helpers.assertFocusedItemAt(assert, toolbar, 1,
                `ArrowRight skips disabled (${name}) and lands on next enabled item`);
        });
    });

    QUnit.test('ArrowLeft skips a disabled item between two enabled items', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B', { options: { disabled: true } }),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 1);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'ArrowLeft skips disabled item and lands on A');
    });

    QUnit.test('Home skips leading disabled items', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A', { disabled: true }),
            buttonItem('B'),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 1);

        helpers.press('Home');

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'Home lands on first enabled item, skipping disabled leader');
    });

    QUnit.test('End skips trailing disabled items', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B'),
            buttonItem('C', { disabled: true }),
        ]);
        helpers.focusItemAt(toolbar, 0);

        helpers.press('End');

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'End lands on last enabled item, skipping disabled trailer');
    });

    QUnit.test('multiple consecutive disabled items are all skipped', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B', { disabled: true }),
            buttonItem('C', { options: { disabled: true } }),
            buttonItem('D'),
        ]);
        assert.strictEqual(helpers.getAvailableItems(toolbar).length, 2, 'only 2 available items');

        helpers.focusItemAt(toolbar, 0);
        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'ArrowRight skips two consecutive disabled items and lands on D');
    });

    QUnit.test('disabled item never has tabindex=0', function(assert) {
        helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B', { options: { disabled: true } }),
            buttonItem('C'),
        ]);

        const $disabledButton = this.$element.find(`.${BUTTON_CLASS}.${DISABLED_STATE_CLASS}`);
        assert.strictEqual($disabledButton.attr('tabindex'), '-1',
            'disabled button has tabindex=-1');
    });

    QUnit.test('toolbar.disabled=true sets all items to tabindex=-1', function(assert) {
        helpers.createToolbar([buttonItem('A'), buttonItem('B')], { disabled: true });

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        $buttons.each(function() {
            assert.strictEqual($(this).attr('tabindex'), '-1',
                'button has tabindex=-1 when toolbar is disabled');
        });
    });

    QUnit.test('exactly one tabindex=0 is maintained after a sequence of navigation keys', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(4));
        helpers.focusItemAt(toolbar, 0);

        ['ArrowRight', 'ArrowRight', 'End', 'Home'].forEach((key) => {
            helpers.press(key);
            helpers.assertOneTabStop(assert, this.$element, `one tab stop after ${key}`);
        });
    });

    QUnit.test('ArrowRight transfers tabindex=0 from previous to newly focused item', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        const $items = helpers.getAvailableItems(toolbar);
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowRight');

        helpers.assertActiveTabIndex(assert, $items.eq(1), 0, 'item[1] is now the stop');
        helpers.assertActiveTabIndex(assert, $items.eq(0), -1, 'item[0] released the stop');
        helpers.assertActiveTabIndex(assert, $items.eq(2), -1, 'item[2] remained at -1');
    });

    QUnit.test('focusing an item via pointer makes it the roving tabindex anchor', function(assert) {
        const toolbar = helpers.createToolbar(makeAlphabetButtonItems(3));
        const $items = helpers.getAvailableItems(toolbar);

        $items.eq(1).find(`.${BUTTON_CLASS}`).get(0).dispatchEvent(new Event('focusin', { bubbles: true }));

        helpers.assertOneTabStop(assert, this.$element);
        const $tabZero = this.$element.find('[tabindex="0"]');
        assert.strictEqual(
            $tabZero.closest(`.${TOOLBAR_ITEM_CLASS}`).get(0),
            $items.eq(1).get(0),
            'item[1] is now the anchor',
        );
        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'focusedElement updated to item[1] after pointer focus');
    });
});

QUnit.module('Widget interaction', moduleConfig, function() {

    QUnit.test('Enter on dxButton fires click', function(assert) {
        let clicked = false;
        this.$element.dxToolbar({
            items: [{ widget: 'dxButton', options: { text: 'A', onClick: () => { clicked = true; } } }]
        });

        helpers.press('Enter', this.$element.find(`.${BUTTON_CLASS}`).get(0));

        assert.strictEqual(clicked, true, 'Enter fires click on dxButton');
    });

    QUnit.test('Space on dxButton fires click', function(assert) {
        let clicked = false;
        this.$element.dxToolbar({
            items: [{ widget: 'dxButton', options: { text: 'A', onClick: () => { clicked = true; } } }]
        });

        helpers.press(' ', this.$element.find(`.${BUTTON_CLASS}`).get(0));

        assert.strictEqual(clicked, true, 'Space fires click on dxButton');
    });

    function createButtonGroupToolbar() {
        return helpers.createToolbarWithEditorBetweenButtons(
            'dxButtonGroup',
            { items: [{ text: 'B' }, { text: 'I' }], keyExpr: 'text' },
        );
    }

    QUnit.test('ArrowDown/Up on dxButtonGroup pass through: toolbar focus stays on ButtonGroup', function(assert) {
        const toolbar = createButtonGroupToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $buttonGroupItem = $items.eq(1);

        toolbar.option('focusedElement', $buttonGroupItem.get(0));
        const $buttonGroupFocusTarget = $buttonGroupItem.find(`.${BUTTON_GROUP_CLASS}`);

        helpers.press('ArrowDown', $buttonGroupFocusTarget.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $buttonGroupItem.get(0), 'ArrowDown keeps toolbar focus on ButtonGroup');

        helpers.press('ArrowUp', $buttonGroupFocusTarget.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $buttonGroupItem.get(0), 'ArrowUp keeps toolbar focus on ButtonGroup');
    });

    QUnit.test('ArrowLeft on dxButtonGroup moves toolbar focus to previous item', function(assert) {
        const toolbar = createButtonGroupToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowLeft', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(0).get(0), 'ArrowLeft moves toolbar focus to previous item');
    });

    QUnit.test('ArrowRight on dxButtonGroup moves toolbar focus to next item', function(assert) {
        const toolbar = createButtonGroupToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0), 'ArrowRight moves toolbar focus to next item');
    });

    function createDropDownButtonToolbar() {
        return helpers.createToolbarWithEditorBetweenButtons(
            'dxDropDownButton',
            { items: ['Option 1', 'Option 2'], text: 'Actions' },
        );
    }

    function getDropDownButton($el) {
        return $el.find(`.${DROP_DOWN_BUTTON_CLASS}`).dxDropDownButton('instance');
    }

    function setButtonGroupFocusedItem($dropDownButtonItem) {
        const buttonGroupInstance = $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).dxButtonGroup('instance');
        const $firstButton = buttonGroupInstance._buttonsCollection._itemElements().eq(0);
        buttonGroupInstance._buttonsCollection.option('focusedElement', $firstButton.get(0));
    }

    QUnit.test('Enter on dxDropDownButton opens popup', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $dropDownButtonItem = helpers.getAvailableItems(toolbar).eq(1);
        const dropDownButton = getDropDownButton(this.$element);

        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press('Enter', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opens on Enter');
    });

    QUnit.test('Space on dxDropDownButton opens popup', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $dropDownButtonItem = helpers.getAvailableItems(toolbar).eq(1);
        const dropDownButton = getDropDownButton(this.$element);

        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press(' ', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opens on Space');
    });

    QUnit.test('ArrowDown on dxDropDownButton opens popup', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $dropDownButtonItem = helpers.getAvailableItems(toolbar).eq(1);
        const dropDownButton = getDropDownButton(this.$element);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        helpers.press('ArrowDown', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opens on ArrowDown');
    });

    QUnit.test('Esc on dxDropDownButton (open) closes popup and keeps toolbar focus', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $dropDownButtonItem = helpers.getAvailableItems(toolbar).eq(1);
        const dropDownButton = getDropDownButton(this.$element);

        dropDownButton.option('opened', true);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        helpers.press('Escape', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        assert.strictEqual(dropDownButton.option('opened'), false, 'popup closes on Esc');
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0), 'toolbar focus stays on DropDownButton item');
    });

    QUnit.test('ArrowLeft/Right on dxDropDownButton (popup closed) navigates toolbar', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowRight', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0), 'ArrowRight moves to next toolbar item');

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowLeft', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(0).get(0), 'ArrowLeft moves to previous toolbar item');
    });

    QUnit.test('ArrowLeft/Right on dxDropDownButton (popup open) does NOT navigate toolbar', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $dropDownButtonItem = $items.eq(1);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press('Enter', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        const dropDownButton = getDropDownButton(this.$element);
        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opened via Enter');

        helpers.press('ArrowRight', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0),
            'ArrowRight does not move focus when popup is open');

        helpers.press('ArrowLeft', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0),
            'ArrowLeft does not move focus when popup is open');
    });

    QUnit.test('selecting item in dxDropDownButton popup via keyboard preserves toolbar focusedElement', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $dropDownButtonItem = $items.eq(1);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press('Enter', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        const dropDownButton = getDropDownButton(this.$element);
        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opened');

        const $listItem = $(dropDownButton._list.$element().find(`.${LIST_ITEM_CLASS}`).first());
        $listItem.trigger('dxclick');

        assert.strictEqual(dropDownButton.option('opened'), false, 'popup closed after item click');
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0),
            'toolbar focusedElement stays on DropDownButton item after selection');
    });

    QUnit.test('focus moves to popup content on open — toolbar does not lose focusedElement', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $dropDownButtonItem = $items.eq(1);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press('Enter', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        const dropDownButton = getDropDownButton(this.$element);
        assert.strictEqual(dropDownButton.option('opened'), true, 'popup opened');

        const $listItem = $(dropDownButton._list.$element().find(`.${LIST_ITEM_CLASS}`).first());
        $listItem.get(0).focus();

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0),
            'focusedElement preserved when focus is inside popup overlay');
    });

    QUnit.test('tabindex stays on DropDownButton after selecting item via keyboard', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $dropDownButtonItem = $items.eq(1);

        toolbar.option('focusedElement', $dropDownButtonItem.get(0));
        setButtonGroupFocusedItem($dropDownButtonItem);
        helpers.press('Enter', $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`).get(0));

        const dropDownButton = getDropDownButton(this.$element);
        const $listItem = $(dropDownButton._list.$element().find(`.${LIST_ITEM_CLASS}`).first());
        $listItem.trigger('dxclick');

        assert.strictEqual(helpers.findFocusTarget($dropDownButtonItem).attr('tabindex'), '0',
            'DropDownButton focus target retains tabindex=0 after selection');

        $items.not($dropDownButtonItem).each(function() {
            assert.strictEqual(helpers.findFocusTarget($(this)).attr('tabindex'), '-1',
                'other toolbar items have tabindex=-1');
        });
    });

    QUnit.test('dxDropDownButton roving anchor is the inner .dx-buttongroup (not the .dx-dropdownbutton root)', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $dropDownButtonItem = helpers.getAvailableItems(toolbar).eq(1);
        const $dropDownButton = $dropDownButtonItem.find(`.${DROP_DOWN_BUTTON_CLASS}`);
        const $buttonGroup = $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`);

        helpers.focusItemAt(toolbar, 1);

        assert.strictEqual($buttonGroup.attr('tabindex'), '0',
            'inner .dx-buttongroup is the roving tab stop');
        assert.notStrictEqual($dropDownButton.attr('tabindex'), '0',
            '.dx-dropdownbutton root is not the roving tab stop');
        assert.notStrictEqual($dropDownButtonItem.attr('tabindex'), '0',
            'toolbar item root is not the roving tab stop');
        assert.strictEqual(getActiveElement(), $buttonGroup.get(0),
            'DOM focus lands on inner .dx-buttongroup');
    });

    QUnit.test('ArrowRight onto a dxDropDownButton item moves DOM focus to its .dx-buttongroup', function(assert) {
        const toolbar = createDropDownButtonToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $dropDownButtonItem = $items.eq(1);
        const $buttonGroup = $dropDownButtonItem.find(`.${BUTTON_GROUP_CLASS}`);

        helpers.focusItemAt(toolbar, 0);
        helpers.press('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $dropDownButtonItem.get(0),
            'roving focusedElement moved to DropDownButton item');
        assert.strictEqual(getActiveElement(), $buttonGroup.get(0),
            'DOM focus moved to .dx-buttongroup inside DropDownButton item');
        assert.strictEqual($buttonGroup.attr('tabindex'), '0',
            '.dx-buttongroup received tabindex=0 after roving move');
    });

    function createSelectBoxToolbar() {
        return helpers.createToolbarWithEditorBetweenButtons(
            'dxSelectBox',
            { items: ['Small', 'Medium', 'Large'], value: 'Small' },
        );
    }

    QUnit.test('Enter on dxSelectBox (toolbar mode) focuses the input', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $items.eq(1).get(0));

        helpers.press('Enter', this.$element.get(0));

        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual(getActiveElement(), $input.get(0), 'Enter focuses SelectBox input');
    });

    QUnit.test('ArrowDown on dxSelectBox (toolbar mode) does not open list', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $items.eq(1).get(0));

        const selectBox = $items.eq(1).find(`.${SELECTBOX_CLASS}`).dxSelectBox('instance');
        helpers.press('ArrowDown', this.$element.get(0));

        assert.strictEqual(selectBox.option('opened'), false, 'ArrowDown in toolbar mode does not open SelectBox list');
    });

    QUnit.test('Esc on dxSelectBox (list open) closes list', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const selectBox = $items.eq(1).find(`.${SELECTBOX_CLASS}`).dxSelectBox('instance');
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        selectBox.option('opened', true);
        $input.get(0).focus();

        helpers.press('Escape', $input.get(0));

        assert.strictEqual(selectBox.option('opened'), false, 'Esc closes SelectBox list');
    });

    QUnit.test('ArrowLeft does not navigate toolbar while SelectBox input is focused', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const selectBox = $items.eq(1).find(`.${SELECTBOX_CLASS}`).dxSelectBox('instance');
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        selectBox.option('opened', true);
        $input.get(0).focus();

        helpers.press('Escape', $input.get(0));

        helpers.press('ArrowLeft', $input.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(1).get(0),
            'ArrowLeft does not navigate toolbar while input is focused');
    });

    QUnit.test('Esc on dxSelectBox (list closed, input focused) returns focus to root div', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $selectBoxRoot = $items.eq(1).find(`.${SELECTBOX_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        $input.get(0).focus();

        helpers.press('Escape', $input.get(0));

        assert.strictEqual(getActiveElement(), $selectBoxRoot.get(0), 'Esc returns focus to SelectBox root div');
    });

    QUnit.test('arrows on dxSelectBox (toolbar mode) navigates toolbar', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowLeft', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(0).get(0), 'ArrowLeft moves to previous item');

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowRight', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0), 'ArrowRight moves to next item');
    });

    function createTextBoxToolbar() {
        return helpers.createToolbarWithEditorBetweenButtons('dxTextBox', { value: 'hello' });
    }

    QUnit.test('arrows on dxTextBox (toolbar mode) navigates toolbar', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowLeft', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(0).get(0), 'ArrowLeft navigates to previous item');

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowRight', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0), 'ArrowRight navigates to next item');
    });

    QUnit.test('Enter on dxTextBox focuses input', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        assert.strictEqual(getActiveElement(), $input.get(0), 'Enter focuses TextBox input');

        helpers.press('ArrowLeft', $input.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(1).get(0),
            'ArrowLeft does not navigate toolbar while in input mode');
    });

    QUnit.test('Esc on dxTextBox (input focused) returns to toolbar mode; arrows navigate', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', $input.get(0));

        helpers.press('ArrowLeft', this.$element.get(0));
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(0).get(0),
            'ArrowLeft navigates toolbar after Esc from TextBox');
    });

    QUnit.test('Esc from TextBox then ArrowRight: TextBox input has tabindex=-1', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $textEditor = $items.eq(1).find(`.${TEXTBOX_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', $input.get(0));

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($input.attr('tabindex'), '-1',
            'TextBox input has tabindex=-1 after navigating away');
        assert.strictEqual($textEditor.attr('tabindex'), '-1',
            'TextBox container has tabindex=-1 after navigating away');
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '0',
            'target button has tabindex=0');
    });

    QUnit.test('Esc from TextBox then ArrowLeft: TextBox input has tabindex=-1', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', $input.get(0));

        helpers.press('ArrowLeft', this.$element.get(0));

        assert.strictEqual($input.attr('tabindex'), '-1',
            'TextBox input has tabindex=-1 after ArrowLeft away');
        assert.strictEqual(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), '0',
            'Prev button has tabindex=0');
    });

    QUnit.test('Esc from SelectBox then ArrowRight: SelectBox input has tabindex=-1', function(assert) {
        const toolbar = createSelectBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $selectBox = $items.eq(1).find(`.${SELECTBOX_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        $input.get(0).focus();

        helpers.press('Escape', $input.get(0));

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($input.attr('tabindex'), '-1',
            'SelectBox input has tabindex=-1 after navigating away');
        assert.strictEqual($selectBox.attr('tabindex'), '-1',
            'SelectBox container has tabindex=-1 after navigating away');
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '0',
            'Next button has tabindex=0');
    });

    QUnit.test('TextBox active item: container has tabindex=0, input has tabindex=-1', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);
        const $textEditor = $items.eq(1).find(`.${TEXTBOX_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', $input.get(0));

        assert.strictEqual($textEditor.attr('tabindex'), '0',
            'TextBox container has tabindex=0 while it is the active item');
        assert.strictEqual($input.attr('tabindex'), '-1',
            'TextBox input has tabindex=-1 while TextBox is the active item');
    });

    QUnit.test('TextBox active item: non-focused items have tabindex=-1', function(assert) {
        const toolbar = createTextBoxToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', $input.get(0));

        assert.strictEqual(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), '-1',
            'Prev button has tabindex=-1');
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '-1',
            'Next button has tabindex=-1');
    });
});

QUnit.module('Mouse and keyboard sync', moduleConfig, function() {
    const threeButtons = () => [buttonItem('A'), buttonItem('B'), buttonItem('C')];

    const focusInner = ($el) => $el.get(0).dispatchEvent(new Event('focusin', { bubbles: true }));

    QUnit.test('focusin on item[j] sets it as the roving anchor (others release the stop)', function(assert) {
        const toolbar = helpers.createToolbar(threeButtons());
        const $items = helpers.getAvailableItems(toolbar);

        focusInner($items.eq(1).find(`.${BUTTON_CLASS}`));

        assert.strictEqual($items.eq(1).find(`.${BUTTON_CLASS}`).attr('tabindex'), '0',
            'focused item has tabindex=0');
        assert.strictEqual($items.eq(0).find(`.${BUTTON_CLASS}`).attr('tabindex'), '-1',
            'previous item released the stop');
        assert.strictEqual($items.eq(2).find(`.${BUTTON_CLASS}`).attr('tabindex'), '-1',
            'next item released the stop');
    });

    QUnit.test('focusin on item[j], then ArrowRight moves to item[j+1]', function(assert) {
        const toolbar = helpers.createToolbar(threeButtons());
        const $items = helpers.getAvailableItems(toolbar);

        focusInner($items.eq(1).find(`.${BUTTON_CLASS}`));
        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 2,
            'ArrowRight from click-focused item moves to next');
    });

    QUnit.test('focusin on item[j], then ArrowLeft moves to item[j-1]', function(assert) {
        const toolbar = helpers.createToolbar(threeButtons());
        const $items = helpers.getAvailableItems(toolbar);

        focusInner($items.eq(1).find(`.${BUTTON_CLASS}`));
        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'ArrowLeft from click-focused item moves to previous');
    });

    QUnit.test('focusin on TextBox input keeps focusedElement on its item; arrows do not navigate', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('Prev'),
            editorItem('dxTextBox', { value: 'hello' }),
            buttonItem('Next'),
        ]);
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        focusInner($input);
        helpers.press('ArrowLeft', $input.get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'ArrowLeft does not navigate toolbar after clicking TextBox input');
    });

    QUnit.test('focusin on TextBox → Esc → ArrowLeft navigates toolbar', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('Prev'),
            editorItem('dxTextBox', { value: 'hello' }),
            buttonItem('Next'),
        ]);
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        focusInner($input);
        helpers.press('Escape', $input.get(0));
        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'ArrowLeft navigates toolbar after Esc from click-focused TextBox');
    });

    QUnit.test('focusin on SelectBox input promotes its item to be focusedElement', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('Prev'),
            editorItem('dxSelectBox', { items: ['Small', 'Medium', 'Large'], value: 'Small' }),
            buttonItem('Next'),
        ]);
        const $items = helpers.getAvailableItems(toolbar);
        const $input = $items.eq(1).find(`.${TEXTEDITOR_INPUT_CLASS}`);

        focusInner($input);

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'focusedElement promoted to SelectBox item');
    });

    QUnit.test('focusin on DropDownButton item promotes it and Enter opens its popup', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('Prev'),
            editorItem('dxDropDownButton', { items: ['Option 1', 'Option 2'], text: 'Actions' }),
            buttonItem('Next'),
        ]);
        const $items = helpers.getAvailableItems(toolbar);
        const $buttonGroup = $items.eq(1).find(`.${BUTTON_GROUP_CLASS}`);
        const dropDownButton = this.$element.find(`.${DROP_DOWN_BUTTON_CLASS}`).dxDropDownButton('instance');

        focusInner($buttonGroup);
        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'focusedElement promoted to DropDownButton item');

        const buttonGroupInstance = $buttonGroup.dxButtonGroup('instance');
        const $firstButton = buttonGroupInstance._buttonsCollection._itemElements().eq(0);
        buttonGroupInstance._buttonsCollection.option('focusedElement', $firstButton.get(0));
        helpers.press('Enter', $buttonGroup.get(0));

        assert.strictEqual(dropDownButton.option('opened'), true,
            'Enter opens DropDownButton popup after click-focus');
    });
});

QUnit.module('Disabled items skip (focusin-driven)', moduleConfig, function() {

    const triadWithMiddleDisabled = () => [
        buttonItem('A'),
        buttonItem('B', { disabled: true }),
        buttonItem('C'),
    ];

    const triggerFocusinOn = ($item) => {
        $(TOOLBAR_SELECTOR).trigger($.Event('focusin', { target: helpers.findFocusTarget($item).get(0) }));
    };

    QUnit.test('ArrowRight skips disabled middle item (focusin-driven)', function(assert) {
        const toolbar = helpers.createToolbar(triadWithMiddleDisabled());
        const $available = helpers.getAvailableItems(toolbar);

        triggerFocusinOn($available.eq(0));
        helpers.press('ArrowRight', helpers.findFocusTarget($available.eq(0)).get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'ArrowRight skipped disabled item and landed on C');
    });

    QUnit.test('ArrowLeft skips disabled middle item (focusin-driven)', function(assert) {
        const toolbar = helpers.createToolbar(triadWithMiddleDisabled());
        const $available = helpers.getAvailableItems(toolbar);

        triggerFocusinOn($available.eq(1));
        helpers.press('ArrowLeft', helpers.findFocusTarget($available.eq(1)).get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'ArrowLeft skipped disabled item and landed on A');
    });

    QUnit.test('Home skips leading disabled items (focusin-driven)', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A', { disabled: true }),
            buttonItem('B'),
            buttonItem('C'),
        ]);
        const $available = helpers.getAvailableItems(toolbar);

        triggerFocusinOn($available.eq(1));
        helpers.press('Home', helpers.findFocusTarget($available.eq(1)).get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 0,
            'Home landed on first enabled item (B), skipping leading disabled');
    });

    QUnit.test('End skips trailing disabled items (focusin-driven)', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B'),
            buttonItem('C', { disabled: true }),
        ]);
        const $available = helpers.getAvailableItems(toolbar);

        triggerFocusinOn($available.eq(0));
        helpers.press('End', helpers.findFocusTarget($available.eq(0)).get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'End landed on last enabled item (B), skipping trailing disabled');
    });

    QUnit.test('disabled item never receives tabindex=0 even after navigation', function(assert) {
        const toolbar = helpers.createToolbar(triadWithMiddleDisabled());
        const $available = helpers.getAvailableItems(toolbar);
        const $disabled = this.$element.find(`.${TOOLBAR_ITEM_CLASS}.${DISABLED_STATE_CLASS}`).first();

        triggerFocusinOn($available.eq(0));
        helpers.press('ArrowRight', helpers.findFocusTarget($available.eq(0)).get(0));

        const tabIndexOnDisabled = parseInt(helpers.findFocusTarget($disabled).attr('tabindex'), 10);
        assert.notStrictEqual(tabIndexOnDisabled, 0,
            'disabled item focus target never has tabindex=0');
    });
});

QUnit.module('Resize and overflow', {
    beforeEach: function() {
        this.$container = $('<div>').width(1000).appendTo('#qunit-fixture');
        this.$element = $('<div>').appendTo(this.$container);
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
        this.$container.remove();
    }
}, function() {

    QUnit.test('item moved to overflow menu loses tabindex=0; first visible gets it', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'A', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'B', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'C', width: 200 } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        assert.strictEqual($items.length, 3, 'all 3 items visible initially');

        toolbar.option('focusedElement', $items.eq(2).get(0));
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '0',
            'item C has tabindex=0 before resize');

        this.$container.width(300);
        toolbar.updateDimensions();

        const $visibleAfter = helpers.getAvailableItems(toolbar);
        assert.strictEqual($visibleAfter.length < 3, true, 'fewer items visible after shrink');

        assert.strictEqual(helpers.findFocusTarget($visibleAfter.eq(0)).attr('tabindex'), '0',
            'first visible item has tabindex=0 after resize');
    });

    QUnit.test('item returns from overflow menu: tabindex stays on current active item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'A', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'B', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'C', width: 200 } },
            ],
        }).dxToolbar('instance');

        this.$container.width(300);
        toolbar.updateDimensions();

        const $visibleSmall = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $visibleSmall.eq(0).get(0));

        this.$container.width(1000);
        toolbar.updateDimensions();

        const $visibleLarge = helpers.getAvailableItems(toolbar);
        assert.strictEqual($visibleLarge.length, 3, 'all items visible after expand');
        assert.strictEqual(helpers.findFocusTarget($visibleLarge.eq(0)).attr('tabindex'), '0',
            'active item A still has tabindex=0');
        assert.strictEqual(helpers.findFocusTarget($visibleLarge.eq(1)).attr('tabindex'), '-1',
            'item B has tabindex=-1');
        assert.strictEqual(helpers.findFocusTarget($visibleLarge.eq(2)).attr('tabindex'), '-1',
            'returned item C has tabindex=-1');
    });

    QUnit.test('only one tabindex=0 exists after resize shrinks toolbar', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'A', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'B', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'C', width: 200 } },
            ],
        }).dxToolbar('instance');

        toolbar.option('focusedElement', helpers.getAvailableItems(toolbar).eq(1).get(0));

        this.$container.width(100);
        toolbar.updateDimensions();

        const $tabZero = this.$element.find('[tabindex="0"]');
        assert.strictEqual($tabZero.length, 1, 'exactly one tabindex=0 after shrink');
    });

    QUnit.test('TextBox input tabindex=-1 after TextBox item moves to overflow', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'never', options: { text: 'A' } },
                { location: 'before', widget: 'dxTextBox', locateInMenu: 'auto', options: { value: 'text', width: 300 } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $items.eq(1).get(0));

        this.$container.width(100);
        toolbar.updateDimensions();

        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual($input.attr('tabindex'), '-1',
            'hidden TextBox input has tabindex=-1');
    });

    QUnit.test('overflow button gets tabindex=0 after all items move to menu', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'A', width: 300 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'B', width: 300 } },
            ],
        }).dxToolbar('instance');

        toolbar.option('focusedElement', helpers.getAvailableItems(toolbar).eq(0).get(0));

        this.$container.width(50);
        toolbar.updateDimensions();

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        assert.strictEqual($overflowBtn.attr('tabindex'), '0',
            'overflow button has tabindex=0 when it is the only focusable element');
    });

    QUnit.test('resize shrink then expand: tabindex restored correctly on all items', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'A', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'B', width: 200 } },
                { location: 'before', widget: 'dxButton', locateInMenu: 'auto', options: { text: 'C', width: 200 } },
            ],
        }).dxToolbar('instance');

        toolbar.option('focusedElement', helpers.getAvailableItems(toolbar).eq(1).get(0));

        this.$container.width(100);
        toolbar.updateDimensions();

        this.$container.width(1000);
        toolbar.updateDimensions();

        const $items = helpers.getAvailableItems(toolbar);
        assert.strictEqual($items.length, 3, 'all items visible');
        assert.strictEqual(helpers.findFocusTarget($items.eq(1)).attr('tabindex'), '0',
            'previously focused item B has tabindex=0');
        assert.strictEqual(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), '-1',
            'item A has tabindex=-1');
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '-1',
            'item C has tabindex=-1');
    });
});

QUnit.module('Overflow menu', moduleConfig, function() {
    const makeOverflowToolbar = () => helpers.createToolbar([
        buttonItem('Visible'),
        buttonItem('Menu A', { locateInMenu: 'always' }),
        buttonItem('Menu B', { locateInMenu: 'always' }),
        buttonItem('Menu C', { locateInMenu: 'always' }),
    ]);

    const getOverflowBtn = ($el) => $el.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);

    ['Enter', 'ArrowDown'].forEach((key) => {
        QUnit.test(`${key} on overflow button opens menu and focuses the first item`, function(assert) {
            const toolbar = makeOverflowToolbar();
            const $overflowBtn = getOverflowBtn(this.$element);

            toolbar.option('focusedElement', $overflowBtn.get(0));
            helpers.press(key, $overflowBtn.get(0));

            const menu = helpers.getOverflowMenu(toolbar);
            assert.strictEqual(menu.option('opened'), true, `Menu is opened after ${key}`);

            const $firstListItem = helpers.getOverflowListItems(menu).first();
            assert.strictEqual(
                getActiveElement(),
                helpers.findFocusTarget($firstListItem).get(0),
                `First menu item is focused after ${key}`,
            );
        });
    });

    QUnit.test('Space on overflow button opens menu', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press(' ', $overflowBtn.get(0));

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('opened'), true, 'Menu is opened after Space');
    });

    QUnit.test('ArrowDown navigates inside menu; ArrowRight does not navigate toolbar', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');
        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);
        assert.strictEqual($items.length >= 2, true, 'At least 2 items in menu');

        const $firstFocusTarget = helpers.findFocusTarget($items.first());
        helpers.press('ArrowDown', $firstFocusTarget.get(0));

        const { focusedElement: afterDown } = list.option();
        assert.strictEqual(
            $(afterDown).get(0) !== $items.first().get(0),
            true,
            'ArrowDown moved focus inside menu',
        );

        const { focusedElement: toolbarFocused } = toolbar.option();
        const $currentListFocus = $(list.option('focusedElement'));
        const $currentFocusTarget = helpers.findFocusTarget($currentListFocus);
        helpers.press('ArrowRight', $currentFocusTarget.get(0));

        const { focusedElement: toolbarFocusedAfterRight } = toolbar.option();
        assert.strictEqual(
            $(toolbarFocusedAfterRight).get(0),
            $(toolbarFocused).get(0),
            'ArrowRight inside menu does not change toolbar focusedElement',
        );
    });

    QUnit.test('Escape closes menu; focus returns to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));

        menu.openWithFocus('first');
        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const $firstItem = helpers.getOverflowListItems(menu).first();
        const $focusTarget = helpers.findFocusTarget($firstItem);
        helpers.press('Escape', $focusTarget.get(0));

        assert.strictEqual(menu.option('opened'), false, 'Menu closed after Escape');
        assert.strictEqual(
            getActiveElement(),
            $overflowBtn.get(0),
            'Focus returned to overflow button after Escape',
        );
    });

    QUnit.test('item click closes menu; focus returns to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        menu.openWithFocus('first');
        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const $popup = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
        const $listItems = $popup.find(`.${LIST_ITEM_CLASS}`);
        assert.strictEqual($listItems.length > 0, true, 'Popup has list items');

        $listItems.first().trigger('dxclick');

        assert.strictEqual(menu.option('opened'), false, 'Menu closed after item click');
        assert.strictEqual(
            getActiveElement(),
            $overflowBtn.get(0),
            'Focus returned to overflow button after item click',
        );
    });

    QUnit.test('Tab inside menu closes popup and moves focus to overflow button (allows Tab default to exit toolbar)', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');
        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());
        assert.strictEqual(
            getActiveElement(),
            $firstFocusTarget.get(0),
            'First item is focused before Tab',
        );

        helpers.press('Tab', $firstFocusTarget.get(0));

        assert.strictEqual(menu.option('opened'), false, 'Menu is closed after Tab (APG-compliant)');
        assert.strictEqual(
            getActiveElement() === $overflowBtn.get(0),
            true,
            'Focus is on overflow button — in a real browser, Tab default will then move focus to the next element after the toolbar',
        );
    });

    QUnit.test('Shift+Tab inside menu closes popup and moves focus to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');
        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());

        helpers.press('Tab', $firstFocusTarget.get(0), { shiftKey: true });

        assert.strictEqual(menu.option('opened'), false, 'Menu is closed after Shift+Tab');
        assert.strictEqual(
            getActiveElement() === $overflowBtn.get(0),
            true,
            'Focus is on overflow button after Shift+Tab',
        );
    });

    QUnit.test('after close, overflow button retains tabindex=0; others have tabindex=-1', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
            ],
        }).dxToolbar('instance');

        const menu = toolbar._layoutStrategy._menu;
        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        menu.openWithFocus('first');

        const $firstItem = helpers.getOverflowListItems(menu).first();
        helpers.press('Escape', helpers.findFocusTarget($firstItem).get(0));

        assert.strictEqual(menu.option('opened'), false, 'Menu closed after Escape');
        assert.strictEqual(
            parseInt($overflowBtn.attr('tabindex'), 10),
            0,
            'Overflow button has tabindex=0 after close',
        );

        const $otherButtons = this.$element.find(`.${BUTTON_CLASS}`).not(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        const allTabindexMinus1 = $otherButtons.toArray().every(
            el => parseInt($(el).attr('tabindex'), 10) === -1,
        );
        assert.strictEqual(allTabindexMinus1, true, 'All other buttons have tabindex=-1');
    });

    QUnit.test('ArrowUp on overflow button opens menu; last item focused', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press('ArrowUp', $overflowBtn.get(0));

        assert.strictEqual(menu.option('opened'), true, 'Menu opened via ArrowUp');

        const $items = helpers.getOverflowListItems(menu);
        const $lastItem = $items.last();
        const $focusTarget = helpers.findFocusTarget($lastItem);
        assert.strictEqual(
            getActiveElement(),
            $focusTarget.get(0),
            'Last menu item is focused after ArrowUp',
        );
    });

    QUnit.test('disabled items inside menu are skipped by ArrowDown', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', disabled: true, options: { text: 'Menu B (disabled)' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu C' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);
        assert.strictEqual($items.length, 2, 'disabled item filtered out of available menu items');

        const $firstFocusTarget = helpers.findFocusTarget($items.first());
        helpers.press('ArrowDown', $firstFocusTarget.get(0));

        const $focused = $(list.option('focusedElement'));
        assert.strictEqual($focused.get(0), $items.eq(1).get(0),
            'ArrowDown skips disabled item and lands on Menu C');
    });

    QUnit.test('disabled items inside menu are skipped by ArrowUp', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', disabled: true, options: { text: 'Menu B (disabled)' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu C' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('last');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);

        const $lastFocusTarget = helpers.findFocusTarget($items.last());
        helpers.press('ArrowUp', $lastFocusTarget.get(0));

        const $focused = $(list.option('focusedElement'));
        assert.strictEqual($focused.get(0), $items.eq(0).get(0),
            'ArrowUp skips disabled item and lands on Menu A');
    });

    QUnit.test('disabled item in menu never gets tabindex=0', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', disabled: true, options: { text: 'Menu B (disabled)' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu C' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('first');

        const $popup = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
        const $disabledItems = $popup.find(`.${LIST_ITEM_CLASS}.${DISABLED_STATE_CLASS}`);
        assert.strictEqual($disabledItems.length > 0, true,
            'there is at least one disabled item in overflow menu');
        $disabledItems.each(function() {
            const $btn = $(this).find(`.${BUTTON_CLASS}`);
            assert.strictEqual(parseInt($btn.attr('tabindex'), 10), -1,
                'disabled menu item button has tabindex=-1');
        });
    });

    QUnit.test('options.disabled item inside menu is skipped by navigation', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B', disabled: true } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu C' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);
        assert.strictEqual($items.length, 2, 'options.disabled item filtered from menu available items');

        const $firstFocusTarget = helpers.findFocusTarget($items.first());
        helpers.press('ArrowDown', $firstFocusTarget.get(0));

        const $focused = $(list.option('focusedElement'));
        assert.strictEqual($focused.get(0), $items.eq(1).get(0),
            'ArrowDown skips options.disabled item in menu');
    });

    QUnit.test('opening menu with leading disabled items focuses first available item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', disabled: true, options: { text: 'Menu A (disabled)' } },
                { widget: 'dxButton', locateInMenu: 'always', disabled: true, options: { text: 'Menu B (disabled)' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu C' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press('Enter', $overflowBtn.get(0));

        assert.strictEqual(menu.option('opened'), true, 'Menu opened');

        const $items = helpers.getOverflowListItems(menu);
        assert.strictEqual($items.length, 1, 'Only 1 non-disabled item available');

        const $firstAvailableFocus = helpers.findFocusTarget($items.first());
        assert.strictEqual(
            getActiveElement() === $firstAvailableFocus.get(0),
            true,
            'Focus lands on first available (non-disabled) menu item, skipping disabled leading items',
        );
    });

    QUnit.test('focused menu item does not get dx-state-focused class', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);
        const $firstItem = $items.first();

        assert.strictEqual($firstItem.hasClass(FOCUSED_STATE_CLASS), false,
            'focused list item does not have dx-state-focused');
    });

    QUnit.test('navigating menu items never adds dx-state-focused to list items', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);
        const $firstFocusTarget = helpers.findFocusTarget($items.first());

        helpers.press('ArrowDown', $firstFocusTarget.get(0));

        const $focused = $(list.option('focusedElement'));
        assert.strictEqual($focused.hasClass(FOCUSED_STATE_CLASS), false,
            'second item does not have dx-state-focused after ArrowDown');

        assert.strictEqual($items.first().hasClass(FOCUSED_STATE_CLASS), false,
            'first item lost dx-state-focused class');

        const $allFocused = list.$element().find(`.${LIST_ITEM_CLASS}.${FOCUSED_STATE_CLASS}`);
        assert.strictEqual($allFocused.length, 0,
            'no dx-state-focused list items in the menu list');
    });

    QUnit.test('overflow button is included in toolbar keyboard navigation sequence', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const $available = helpers.getAvailableItems(toolbar);

        assert.strictEqual($available.last().get(0), $overflowBtn.get(0),
            'overflow button is the last available item in the navigation sequence');
    });

    QUnit.test('overflow button gets tabindex=0 when it becomes the active toolbar item', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const $available = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $available.last().get(0));

        assert.strictEqual($overflowBtn.attr('tabindex'), '0',
            'overflow button has tabindex=0 when it is the active toolbar item');
    });

    QUnit.test('focused menu item gets tabindex=0 after ArrowDown; previously focused item gets tabindex=-1', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('first');

        const $items = helpers.getOverflowListItems(menu);
        helpers.press('ArrowDown', helpers.findFocusTarget($items.first()).get(0));

        assert.strictEqual(helpers.findFocusTarget($items.eq(1)).attr('tabindex'), '0',
            'item[1] (newly focused) has tabindex=0');
        assert.strictEqual(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), '-1',
            'item[0] (previously focused) has tabindex=-1');
    });

    QUnit.test('all non-focused menu items have tabindex=-1 after navigation', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);
        menu.openWithFocus('first');

        const $items = helpers.getOverflowListItems(menu);
        helpers.press('ArrowDown', helpers.findFocusTarget($items.first()).get(0));

        assert.strictEqual(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), '-1',
            'item[0] has tabindex=-1 after focus moved away');
        assert.strictEqual(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), '-1',
            'item[2] has tabindex=-1 (never focused)');
    });

    QUnit.test('mouse click on overflow button opens menu; first item is focused (allowKeyboardNavigation=true)', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        assert.strictEqual(toolbar.option('allowKeyboardNavigation'), true, 'allowKeyboardNavigation is true (default)');

        $overflowBtn.trigger('dxclick');

        assert.strictEqual(menu.option('opened'), true, 'Menu is opened after click');

        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());

        assert.strictEqual(
            getActiveElement() === $firstFocusTarget.get(0),
            true,
            'First menu item is focused after mouse click (same behavior as Enter)',
        );
    });

    QUnit.test('popup overlay content does not steal focus when menu opens (focus goes to first list item)', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        $overflowBtn.trigger('dxclick');

        const popupContent = menu._popup.$overlayContent().get(0);
        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());

        assert.strictEqual(
            getActiveElement() === popupContent,
            false,
            'Popup overlay content is NOT the active element',
        );
        assert.strictEqual(
            getActiveElement() === $firstFocusTarget.get(0),
            true,
            'Focus is on the first menu item, not on the popup overlay',
        );
    });

    QUnit.test('Escape closes menu after mouse open; focus returns to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        $overflowBtn.trigger('dxclick');
        assert.strictEqual(menu.option('opened'), true, 'Menu is opened');

        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());

        assert.strictEqual(
            getActiveElement() === $firstFocusTarget.get(0),
            true,
            'First item is focused after mouse open',
        );

        helpers.press('Escape', $firstFocusTarget.get(0));

        assert.strictEqual(menu.option('opened'), false, 'Menu is closed after Escape');
        assert.strictEqual(
            getActiveElement() === $overflowBtn.get(0),
            true,
            'Focus returns to overflow button after Escape',
        );
    });

    QUnit.test('Escape closes menu after keyboard open; focus returns to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press('Enter', $overflowBtn.get(0));
        assert.strictEqual(menu.option('opened'), true, 'Menu is opened after Enter');

        const $firstFocusTarget = helpers.findFocusTarget(helpers.getOverflowListItems(menu).first());

        assert.strictEqual(
            getActiveElement() === $firstFocusTarget.get(0),
            true,
            'First item is focused after keyboard open',
        );

        helpers.press('Escape', $firstFocusTarget.get(0));

        assert.strictEqual(menu.option('opened'), false, 'Menu is closed after Escape');
        assert.strictEqual(
            getActiveElement() === $overflowBtn.get(0),
            true,
            'Focus returns to overflow button after Escape',
        );
    });

    QUnit.test('closing menu while focus is outside popup keeps focus on the outside element', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);
        const $outside = $('<button type="button">outside</button>').appendTo(document.body);


        menu.openWithFocus('first');

        $outside.get(0).focus();
        assert.strictEqual(getActiveElement(), $outside.get(0), 'Focus moved outside popup');

        menu.option('opened', false);

        assert.strictEqual(menu.option('opened'), false, 'Menu is closed');
        assert.notStrictEqual(
            getActiveElement(),
            $overflowBtn.get(0),
            'Focus is NOT moved to overflow button when it was already outside the popup',
        );

        $outside.remove();
    });

    QUnit.test('ArrowDown on dxMenu item at overflow list nav level navigates list, does not activate menu', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                {
                    locateInMenu: 'always',
                    widget: 'dxMenu',
                    options: {
                        items: [
                            { text: 'File', items: [{ text: 'New' }, { text: 'Open' }] },
                        ],
                    },
                },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'After Menu' } },
            ],
        }).dxToolbar('instance');
        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        const menu = toolbar._layoutStrategy._menu;

        $overflowBtn.get(0).focus();
        assert.strictEqual(getActiveElement(), $overflowBtn.get(0),
            'overflow button is focused before opening');

        helpers.press('ArrowDown', getActiveElement());
        assert.strictEqual(menu.option('opened'), true, 'overflow popup opened');

        const $listItems = helpers.getOverflowListItems(menu);
        const $menuListItem = $listItems.toArray().map((el) => $(el)).find(($i) => $i.find(`.${DX_MENU_CLASS}`).length > 0);
        assert.strictEqual(!!$menuListItem, true, 'found a list item containing dxMenu');

        const $menuRoot = $menuListItem.find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menuRoot.dxMenu('instance');

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu is at list nav level — internal focusedElement is null');
        assert.strictEqual(getActiveElement(), $menuListItem.get(0),
            'DOM focus is on the overflow list item wrapper, not inside dxMenu');

        helpers.press('ArrowDown', getActiveElement());

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu did NOT activate on ArrowDown — its keyboard handler did not process the key');

        const newFocused = $(helpers.getOverflowList(menu).option('focusedElement')).get(0);
        assert.notStrictEqual(newFocused, $menuListItem.get(0),
            'list moved to the next item on ArrowDown (instead of menu reacting)');
    });

});

QUnit.module('Template items', moduleConfig, function() {
    const focusToolbarItem = (toolbar, index) => {
        const $item = helpers.getAvailableItems(toolbar).eq(index);
        helpers.findFocusTarget($item).get(0).focus();
        return $item;
    };

    const pressActive = (key) => {
        helpers.press(key, getActiveElement());
    };

    QUnit.test('template item with focusable content is in roving tabindex sequence', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<button type="button">').text('Custom') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3, 'All 3 items (including template) are in navigation sequence');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $focusTarget = helpers.findFocusTarget($templateItem);
        assert.strictEqual(
            $focusTarget !== undefined && $focusTarget !== null && $focusTarget.length > 0, true,
            'findFocusTarget returns the native button inside the template',
        );
    });

    QUnit.test('template item with no focusable content is skipped in navigation', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<span>').text('Static Text') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'Template item with no focusable content is excluded from navigation');
    });

    QUnit.test('ArrowRight to template item sets tabindex=0 and updates focusedElement', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<button type="button">').text('Custom') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $itemA = $allItems.eq(0);
        const $templateItem = $allItems.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemA).get(0) }));

        helpers.press('ArrowRight', helpers.findFocusTarget($itemA).get(0));

        const $focusTarget = helpers.findFocusTarget($templateItem);
        assert.strictEqual(
            parseInt($focusTarget.attr('tabindex'), 10),
            0,
            'Template item focus target has tabindex=0 after ArrowRight',
        );

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0), 'focusedElement is template item container');
    });

    QUnit.test('ArrowLeft to template item updates focusedElement', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<button type="button">').text('Custom') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $itemC = $allItems.eq(2);
        const $templateItem = $allItems.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemC).get(0) }));

        helpers.press('ArrowLeft', helpers.findFocusTarget($itemC).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0), 'ArrowLeft moved focus to template item');
    });

    QUnit.test('ArrowRight while template container is focused navigates toolbar', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<button type="button">').text('Custom') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $itemC = $allItems.eq(2);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemC.get(0), 'ArrowRight from template item moves focus to C');
    });

    QUnit.test('template item with [tabindex] div (not native button) is in roving tabindex sequence', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div tabindex="0">').text('Group item') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3, 'Template item with [tabindex] div is in navigation sequence');
    });

    QUnit.test('ArrowRight navigates to template item with [tabindex] div content', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div tabindex="0" class="tmpl-div">').text('Group item') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $itemA = $allItems.eq(0);
        const $templateItem = $allItems.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemA).get(0) }));

        helpers.press('ArrowRight', helpers.findFocusTarget($itemA).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0), 'focusedElement is the template item container');

        const $focusTarget = helpers.findFocusTarget($templateItem);
        assert.strictEqual(parseInt($focusTarget.attr('tabindex'), 10), 0, 'Template div has tabindex=0');
    });

    QUnit.test('navigation round-trip: leave and return to [tabindex] div template item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', template: () => $('<div tabindex="0" class="tmpl-div">').text('Group item') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(0);
        const $itemB = $allItems.eq(1);

        focusToolbarItem(toolbar, 0);
        pressActive('ArrowRight');
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemB.get(0), 'moved to B');

        pressActive('ArrowLeft');
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $templateItem.get(0), 'returned to template item');
        assert.strictEqual(parseInt(helpers.findFocusTarget($templateItem).attr('tabindex'), 10), 0, 'template div tabindex restored to 0');
    });

    QUnit.test('Tab after last focusable inside template exits toolbar', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<button type="button" class="only-btn">').text('Only'),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);

        toolbar.option('focusedElement', $templateItem.get(0));

        helpers.press('Enter', helpers.findFocusTarget($templateItem).get(0));

        helpers.press('Tab', getActiveElement());

        assert.strictEqual(
            this.$element.get(0).contains(getActiveElement()),
            false,
            'Tab after last focusable inside template exits toolbar',
        );
    });

    QUnit.test('click on focusable inside template sets active item and enters inner-focus mode', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<button type="button" class="tmpl-btn">').text('Custom') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $nativeBtn = $templateItem.find('.tmpl-btn');

        this.$element.trigger($.Event('focusin', { target: $nativeBtn.get(0) }));

        const { focusedElement } = toolbar.option();
        assert.strictEqual(
            $(focusedElement).get(0),
            $templateItem.get(0),
            'Mouse click on template content sets focusedElement to template item container',
        );
    });


    QUnit.test('template with <a href> is included in _getAvailableItems', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<a href="#" class="tmpl-link">').text('Link') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3, 'template with <a href> is included in available items');
    });

    QUnit.test('template with <a href>: findFocusTarget returns the <a> element', function(assert) {
        this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<a href="#" class="tmpl-link">').text('Link') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        });

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $focusTarget = helpers.findFocusTarget($templateItem);

        assert.strictEqual($focusTarget.get(0), $templateItem.find('.tmpl-link').get(0),
            'findFocusTarget returns the <a> element inside template');
    });

    QUnit.test('template with <a href>: tabindex=0 when active, -1 when not', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<a href="#" class="tmpl-link">').text('Link') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $link = $templateItem.find('.tmpl-link');

        assert.strictEqual($link.attr('tabindex'), '-1',
            'link has tabindex=-1 when not the active item');

        const $available = helpers.getAvailableItems(toolbar);
        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($available.eq(0)).get(0) }));

        helpers.press('ArrowRight', helpers.findFocusTarget($available.eq(0)).get(0));

        assert.strictEqual($link.attr('tabindex'), '0',
            'link has tabindex=0 when it is the active item');
    });

    QUnit.test('template with <a href>: ArrowRight navigates to next toolbar item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<a href="#" class="tmpl-link">').text('Link') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $linkItem = $available.eq(1);
        const $itemC = $available.eq(2);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($linkItem).get(0) }));

        helpers.press('ArrowRight', helpers.findFocusTarget($linkItem).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemC.get(0),
            'ArrowRight from link template navigates to next toolbar item');
    });

    QUnit.test('template with <a href>: ArrowLeft navigates to previous toolbar item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<a href="#" class="tmpl-link">').text('Link') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $linkItem = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($linkItem).get(0) }));

        helpers.press('ArrowLeft', helpers.findFocusTarget($linkItem).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemA.get(0),
            'ArrowLeft from link template navigates to previous toolbar item');
    });


    QUnit.test('template with dxButton widget: included in _getAvailableItems', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').dxButton({ text: 'TemplateBtn' }) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3, 'template with dxButton is included in available items');
    });

    QUnit.test('template with dxButton widget: findFocusTarget returns the dx-button element', function(assert) {
        this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').dxButton({ text: 'TemplateBtn' }) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        });

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $focusTarget = helpers.findFocusTarget($templateItem);
        const $dxButton = $templateItem.find(`.${BUTTON_CLASS}`).first();

        assert.strictEqual($focusTarget.get(0), $dxButton.get(0),
            'findFocusTarget returns the dx-button inside the template');
    });

    QUnit.test('template with dxButton widget: ArrowRight navigates toolbar', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').dxButton({ text: 'TemplateBtn' }) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemC = $available.eq(2);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemC.get(0),
            'ArrowRight from template dxButton navigates to next toolbar item');
    });


    QUnit.test('template with multiple plain focusable elements: item is one stop in _getAvailableItems', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3,
            'template with multiple links is one toolbar item — 3 available items total');
    });

    QUnit.test('template with multiple plain focusable elements: ArrowRight moves inside template', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0),
            'focusedElement remains on template item');
        assert.strictEqual(getActiveElement(), $links.eq(1).get(0),
            'ArrowRight moved focus to the second inner link');
    });

    QUnit.test('template with multiple plain focusable elements: ArrowLeft moves inside template', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');
        pressActive('ArrowLeft');

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0),
            'focusedElement remains on template item');
        assert.strictEqual(getActiveElement(), $links.eq(0).get(0),
            'ArrowLeft moved focus back to the first inner link');
    });

    QUnit.test('template with multiple plain focusable elements: ArrowRight on last inner target exits to next toolbar item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemC = $available.eq(2);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');
        pressActive('ArrowRight');
        pressActive('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemC.get(0),
            'ArrowRight on last inner link moves to next toolbar item');
    });

    QUnit.test('template with multiple plain focusable elements: ArrowLeft on first inner target exits to previous toolbar item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowLeft');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemA.get(0),
            'ArrowLeft on first inner link moves to previous toolbar item');
    });

    QUnit.test('template with multiple plain focusable elements: ArrowLeft from first inner target enters previous plain template at its LAST inner target', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-a1">').text('A1'),
                        $('<a href="#" tabindex="0" class="inner-link-a2">').text('A2'),
                        $('<a href="#" tabindex="0" class="inner-link-a3">').text('A3'),
                    ),
                },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-b1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-b2">').text('B2'),
                    ),
                },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $aLinks = $itemA.find('a');

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowLeft');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemA.get(0),
            'focusedElement is set to previous plain template item');
        assert.strictEqual(getActiveElement(), $aLinks.eq(2).get(0),
            'ArrowLeft enters previous plain template at its LAST inner target (A3)');
        assert.strictEqual($aLinks.eq(2).attr('tabindex'), '0',
            'last inner target of previous item has tabindex=0');
        assert.strictEqual($aLinks.eq(0).attr('tabindex'), '-1',
            'first inner target of previous item has tabindex=-1');
    });

    QUnit.test('RTL: ArrowLeft follows collection navigation and enters next plain template at its last inner target', function(assert) {
        const toolbar = this.$element.dxToolbar({
            rtlEnabled: true,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 0);
        pressActive('ArrowLeft');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $templateItem.get(0),
            'RTL ArrowLeft moves forward to template item');
        assert.strictEqual(getActiveElement(), $links.eq(2).get(0),
            'ArrowLeft enters template at last inner link after collection moves to the item');
    });

    QUnit.test('RTL: ArrowRight follows collection navigation and enters previous plain template at its first inner target', function(assert) {
        const toolbar = this.$element.dxToolbar({
            rtlEnabled: true,
            items: [
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(0);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $templateItem.get(0),
            'RTL ArrowRight moves backward to template item');
        assert.strictEqual(getActiveElement(), $links.eq(0).get(0),
            'ArrowRight enters template at first inner link after collection moves to the item');
    });

    QUnit.test('RTL: ArrowRight moves forward inside multiple plain focusable elements', function(assert) {
        const toolbar = this.$element.dxToolbar({
            rtlEnabled: true,
            items: [
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $templateItem = helpers.getAvailableItems(toolbar).eq(0);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 0);
        pressActive('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $templateItem.get(0),
            'focusedElement remains on template item');
        assert.strictEqual(getActiveElement(), $links.eq(1).get(0),
            'ArrowRight moved focus to the second inner link');
    });

    QUnit.test('RTL: ArrowLeft moves backward inside multiple plain focusable elements', function(assert) {
        const toolbar = this.$element.dxToolbar({
            rtlEnabled: true,
            items: [
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $templateItem = helpers.getAvailableItems(toolbar).eq(0);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 0);
        pressActive('ArrowRight');
        pressActive('ArrowLeft');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $templateItem.get(0),
            'focusedElement remains on template item');
        assert.strictEqual(getActiveElement(), $links.eq(0).get(0),
            'ArrowLeft moved focus back to the first inner link');
    });

    QUnit.test('template with DX widgets uses toolbar navigation, not plain-link navigation', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<div>').dxButton({ text: 'Btn1' }),
                        $('<div>').dxButton({ text: 'Btn2' }),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemC = $available.eq(2);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemC.get(0),
            'template with DX widgets navigates at toolbar level (not inside)');
    });

    QUnit.test('template with multiple plain focusable elements: focused item has one inner tab stop', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<a href="#" tabindex="0" class="inner-link-1">').text('B1'),
                        $('<a href="#" tabindex="0" class="inner-link-2">').text('B2'),
                        $('<a href="#" tabindex="0" class="inner-link-3">').text('B3'),
                    ),
                },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);
        const $links = $templateItem.find('a');

        focusToolbarItem(toolbar, 1);

        assert.strictEqual($links.eq(0).attr('tabindex'), '0',
            'first inner target gets tabindex=0 when item is activated');
        assert.strictEqual($links.eq(1).attr('tabindex'), '-1',
            'second inner target has tabindex=-1');
        assert.strictEqual($links.eq(2).attr('tabindex'), '-1',
            'third inner target has tabindex=-1');
    });

    QUnit.test('template with one plain focusable element: ArrowRight exits to next toolbar item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<a href="#" tabindex="0" class="inner-link">').text('B'),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemC = $available.eq(2);

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemC.get(0),
            'single-link template keeps toolbar-level navigation');
    });

    QUnit.test('template with dxButton widget: multiple plain focus target logic is not applied', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<div>').dxButton({ text: 'TemplateBtn' }),
                        $('<a href="#" tabindex="0" class="inner-link">').text('Link'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);
        const $itemC = $available.eq(2);
        const $dxButton = $templateItem.find(`.${BUTTON_CLASS}`).first();

        focusToolbarItem(toolbar, 1);
        pressActive('ArrowRight');

        assert.strictEqual(helpers.findFocusTarget($templateItem).get(0), $dxButton.get(0),
            'dxButton remains the template focus target');
        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $itemC.get(0),
            'ArrowRight exits to next toolbar item instead of moving to plain link');
    });

    QUnit.test('template with multiple focusable: inner elements have tabindex=-1 before activation', function(assert) {

        this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<button type="button" class="inner-btn-1">').text('B1'),
                        $('<button type="button" class="inner-btn-2">').text('B2'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        });

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $templateItem = $allItems.eq(1);
        const $firstInnerButton = $templateItem.find('.inner-btn-1');
        const $secondInnerButton = $templateItem.find('.inner-btn-2');

        assert.strictEqual($firstInnerButton.attr('tabindex'), '-1',
            'first inner button has tabindex=-1 (not the active item)');
        assert.strictEqual($secondInnerButton.attr('tabindex'), '-1',
            'second inner button has tabindex=-1 before activation');
    });

    QUnit.test('template with multiple focusable: ArrowRight inside activated mode does NOT navigate toolbar', function(assert) {

        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                {
                    locateInMenu: 'never',
                    template: () => $('<div>').append(
                        $('<button type="button" class="inner-btn-1">').text('B1'),
                        $('<button type="button" class="inner-btn-2">').text('B2'),
                    ),
                },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $templateItem = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($templateItem).get(0) }));

        helpers.press('Enter', helpers.findFocusTarget($templateItem).get(0));

        helpers.press('ArrowRight', getActiveElement());

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $templateItem.get(0),
            'ArrowRight inside activated template does NOT navigate toolbar');
    });
});

QUnit.module('Core behaviors', moduleConfig, function() {
    QUnit.test('exactly one tabindex=0 exists inside toolbar at all times', function(assert) {
        this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxSelectBox', options: { items: ['Small', 'Medium'] } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        });

        this.$element.trigger($.Event('focusin', { target: this.$element.get(0) }));

        const $tabindex0 = this.$element.find('[tabindex="0"]');
        assert.strictEqual($tabindex0.length, 1, 'Exactly one element inside toolbar has tabindex=0');
    });

    QUnit.test('Empty toolbar — no crash, no tabindex=0 items', function(assert) {
        this.$element.dxToolbar({ items: [] });
        const $tabindex0 = this.$element.find('[tabindex="0"]');
        assert.strictEqual($tabindex0.length, 0, 'No tabindex=0 elements in empty toolbar');
    });

    QUnit.test('allowKeyboardNavigation:false — no keyboard handling', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        const $firstFocusTarget = helpers.findFocusTarget($items.first());

        const focusBefore = toolbar.option('focusedElement');
        helpers.press('ArrowRight', $firstFocusTarget.get(0));

        const focusAfter = toolbar.option('focusedElement');
        assert.strictEqual(focusBefore, focusAfter, 'focusedElement unchanged when allowKeyboardNavigation:false');
    });

    QUnit.test('allowKeyboardNavigation:false — roving tabindex is not applied', function(assert) {
        this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
            ],
        });

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        const allHaveNaturalTabindex = $buttons.toArray().every(
            el => $(el).attr('tabindex') === undefined || $(el).attr('tabindex') === '0',
        );
        assert.strictEqual(allHaveNaturalTabindex, true,
            'buttons keep natural tabindex when allowKeyboardNavigation:false');
    });

    QUnit.test('allowKeyboardNavigation:false propagates to overflow menu list but not to DropDownMenu itself', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('focusStateEnabled'), true,
            'DropDownMenu keeps its own focusStateEnabled:true (default)');
        assert.strictEqual(menu.option('allowKeyboardNavigation'), false,
            'DropDownMenu receives allowKeyboardNavigation:false from toolbar');

        menu.option('opened', true);

        assert.strictEqual(helpers.getOverflowList(menu).option('focusStateEnabled'), false,
            'ToolbarMenuList gets focusStateEnabled:false via allowKeyboardNavigation');
    });

    QUnit.test('changing allowKeyboardNavigation at runtime propagates to menu and list', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        assert.strictEqual(menu.option('focusStateEnabled'), true, 'menu starts with focusStateEnabled:true');
        assert.strictEqual(menu.option('allowKeyboardNavigation'), true, 'menu starts with allowKeyboardNavigation:true');
        assert.strictEqual(helpers.getOverflowList(menu).option('focusStateEnabled'), true, 'list starts with focusStateEnabled:true');

        toolbar.option('allowKeyboardNavigation', false);

        assert.strictEqual(menu.option('focusStateEnabled'), true,
            'DropDownMenu keeps its own focusStateEnabled:true after runtime change');
        assert.strictEqual(menu.option('allowKeyboardNavigation'), false,
            'DropDownMenu gets allowKeyboardNavigation:false after runtime change');
        assert.strictEqual(helpers.getOverflowList(menu).option('focusStateEnabled'), false,
            'ToolbarMenuList gets focusStateEnabled:false after runtime change');
    });

    QUnit.test('allowKeyboardNavigation:true→false — items reset to natural tabindex (all 0)', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        const $firstFocusTarget = helpers.findFocusTarget($items.first());
        this.$element.trigger($.Event('focusin', { target: $firstFocusTarget.get(0) }));

        const tabIndicesBefore = $items.toArray().map(item => helpers.findFocusTarget($(item)).attr('tabindex'));
        assert.strictEqual(tabIndicesBefore[0], '0', 'First item has tabindex=0 (roving)');
        assert.strictEqual(tabIndicesBefore[1], '-1', 'Second item has tabindex=-1 (roving)');

        toolbar.option('allowKeyboardNavigation', false);

        const tabIndicesAfter = $items.toArray().map(item => helpers.findFocusTarget($(item)).attr('tabindex'));
        assert.strictEqual(tabIndicesAfter[0], '0', 'First item has natural tabindex=0 after allowKeyboardNavigation:false');
        assert.strictEqual(tabIndicesAfter[1], '0', 'Second item has natural tabindex=0 after allowKeyboardNavigation:false');
        assert.strictEqual(tabIndicesAfter[2], '0', 'Third item has natural tabindex=0 after allowKeyboardNavigation:false');
    });

    QUnit.test('allowKeyboardNavigation:false→true — roving tabindex is applied (only first item at 0)', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);

        const tabIndicesBefore = $items.toArray().map(item => helpers.findFocusTarget($(item)).attr('tabindex'));
        assert.strictEqual(tabIndicesBefore[0], '0', 'All items start at natural tabindex=0');
        assert.strictEqual(tabIndicesBefore[1], '0', 'All items start at natural tabindex=0');

        toolbar.option('allowKeyboardNavigation', true);

        const tabIndicesAfter = $items.toArray().map(item => helpers.findFocusTarget($(item)).attr('tabindex'));
        assert.strictEqual(tabIndicesAfter[0], '0', 'First item gets tabindex=0 from roving tabindex');
        assert.strictEqual(tabIndicesAfter[1], '-1', 'Second item gets tabindex=-1 from roving tabindex');
        assert.strictEqual(tabIndicesAfter[2], '-1', 'Third item gets tabindex=-1 from roving tabindex');
    });

    QUnit.test('allowKeyboardNavigation:false — overflow menu items use toggleItemFocusableElementTabIndex (not roving)', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const $listItems = helpers.getOverflowList(menu).$element().find(`.${LIST_ITEM_CLASS}`);
        const allButtonsHaveTabindex = $listItems.toArray().every(el => {
            const $btn = $(el).find(`.${BUTTON_CLASS}`);
            return $btn.length === 0 || $btn.attr('tabindex') === '0' || $btn.attr('tabindex') === undefined;
        });
        assert.strictEqual(allButtonsHaveTabindex, true,
            'menu items use natural tabindex (toggleItemFocusableElementTabIndex) when allowKeyboardNavigation:false');
    });

    QUnit.test('allowKeyboardNavigation:false — opening overflow menu does not auto-focus items', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const focusedElement = helpers.getOverflowList(menu).option('focusedElement');
        assert.strictEqual(focusedElement, null,
            'no item auto-focused on open when allowKeyboardNavigation:false');
    });

    QUnit.test('allowKeyboardNavigation:true — overflow menu uses roving tabindex', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const $listItems = helpers.getOverflowList(menu).$element().find(`.${LIST_ITEM_CLASS}`);
        const tabindexValues = $listItems.toArray().map(el => {
            const $btn = $(el).find(`.${BUTTON_CLASS}`);
            return $btn.length ? $btn.attr('tabindex') : undefined;
        });
        const countZero = tabindexValues.filter(v => v === '0').length;
        const countMinusOne = tabindexValues.filter(v => v === '-1').length;

        assert.strictEqual(countZero, 1, 'exactly one item has tabindex=0 (roving tabindex)');
        assert.strictEqual(countMinusOne, 1, 'other items have tabindex=-1');
    });

    QUnit.test('focusOut to overlay content does not reset focus state', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxSelectBox', options: { items: ['Light', 'Dark'] } },
            ],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $items.eq(0).get(0));
        focusItemFocusTarget($items.eq(0));

        const popup = $('<div>').appendTo('#qunit-fixture')
            .dxPopup({ visible: true }).dxPopup('instance');

        this.$element.trigger($.Event('focusout', {
            target: this.$element.find(`.${TEXTEDITOR_CLASS}`).get(0),
            relatedTarget: popup.$overlayContent().get(0),
        }));

        assert.strictEqual($(toolbar.option('focusedElement')).length > 0, true,
            'focusedElement is preserved when focus moves to overlay content');
        popup.dispose();
    });

    [
        { allowKeyboardNavigation: true, hasClass: true, label: 'has' },
        { allowKeyboardNavigation: false, hasClass: false, label: 'does NOT have' },
    ].forEach(({ allowKeyboardNavigation, hasClass, label }) => {
        QUnit.test(`allowKeyboardNavigation:${allowKeyboardNavigation} — toolbar element ${label} dx-toolbar-focus-mode class`, function(assert) {
            this.$element.dxToolbar({
                allowKeyboardNavigation: allowKeyboardNavigation,
                items: [
                    { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                ],
            });

            assert.strictEqual(
                this.$element.hasClass(TOOLBAR_FOCUS_MODE_CLASS),
                hasClass,
                `toolbar ${label} dx-toolbar-focus-mode class when allowKeyboardNavigation:${allowKeyboardNavigation}`,
            );
        });

        QUnit.test(`allowKeyboardNavigation:${allowKeyboardNavigation} — overflow popup wrapper ${label} dx-dropdownmenu-list-focus-mode class`, function(assert) {
            const toolbar = this.$element.dxToolbar({
                allowKeyboardNavigation: allowKeyboardNavigation,
                items: [
                    { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                ],
            }).dxToolbar('instance');

            const menu = helpers.getOverflowMenu(toolbar);
            menu.option('opened', true);

            const $wrapper = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
            assert.strictEqual(
                $wrapper.hasClass(DROP_DOWN_MENU_LIST_FOCUS_MODE_CLASS),
                hasClass,
                `popup wrapper ${label} dx-dropdownmenu-list-focus-mode class when allowKeyboardNavigation:${allowKeyboardNavigation}`,
            );
        });
    });

    QUnit.test('changing allowKeyboardNavigation at runtime toggles dx-dropdownmenu-list-focus-mode on popup wrapper', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
            ],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const $wrapper = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);

        assert.strictEqual(
            $wrapper.hasClass(DROP_DOWN_MENU_LIST_FOCUS_MODE_CLASS),
            true,
            'popup wrapper has class when allowKeyboardNavigation:true'
        );

        toolbar.option('allowKeyboardNavigation', false);

        assert.strictEqual(
            $wrapper.hasClass(DROP_DOWN_MENU_LIST_FOCUS_MODE_CLASS),
            false,
            'popup wrapper loses class after setting allowKeyboardNavigation:false'
        );

        toolbar.option('allowKeyboardNavigation', true);

        assert.strictEqual(
            $wrapper.hasClass(DROP_DOWN_MENU_LIST_FOCUS_MODE_CLASS),
            true,
            'popup wrapper regains class after setting allowKeyboardNavigation:true'
        );
    });
});

QUnit.module('allowKeyboardNavigation ↔ focusStateEnabled sync', moduleConfig, function() {
    QUnit.test('default: allowKeyboardNavigation:true → focusStateEnabled:true', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [{ locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } }],
        }).dxToolbar('instance');

        assert.strictEqual(toolbar.option('allowKeyboardNavigation'), true, 'ALN default true');
        assert.strictEqual(toolbar.option('focusStateEnabled'), true, 'focusStateEnabled synced to true');
    });

    QUnit.test('explicit allowKeyboardNavigation:false at init → focusStateEnabled:false', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [{ locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } }],
        }).dxToolbar('instance');

        assert.strictEqual(toolbar.option('focusStateEnabled'), false,
            'focusStateEnabled synced to false when allowKeyboardNavigation is explicitly false');
    });

    QUnit.test('runtime allowKeyboardNavigation:true → false syncs focusStateEnabled', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [{ locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } }],
        }).dxToolbar('instance');

        assert.strictEqual(toolbar.option('focusStateEnabled'), true, 'starts with focusStateEnabled:true');

        toolbar.option('allowKeyboardNavigation', false);
        assert.strictEqual(toolbar.option('focusStateEnabled'), false,
            'focusStateEnabled becomes false after allowKeyboardNavigation:false');
    });

    QUnit.test('runtime allowKeyboardNavigation:false → true syncs focusStateEnabled', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [{ locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } }],
        }).dxToolbar('instance');

        assert.strictEqual(toolbar.option('focusStateEnabled'), false, 'starts with focusStateEnabled:false');

        toolbar.option('allowKeyboardNavigation', true);
        assert.strictEqual(toolbar.option('focusStateEnabled'), true,
            'focusStateEnabled becomes true after allowKeyboardNavigation:true');
    });

    QUnit.test('runtime ALN:false → true bootstraps roving tabindex on first item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        toolbar.option('allowKeyboardNavigation', true);

        const $items = helpers.getAvailableItems(toolbar);
        const tabs = $items.toArray().map((el) => helpers.findFocusTarget($(el)).attr('tabindex'));
        assert.deepEqual(tabs, ['0', '-1', '-1'],
            'first item owns the single tab stop after enabling ALN');
    });

    QUnit.test('runtime ALN:true → false resets all items to natural tabindex', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        toolbar.option('allowKeyboardNavigation', false);

        const $items = helpers.getAvailableItems(toolbar);
        const tabs = $items.toArray().map((el) => helpers.findFocusTarget($(el)).attr('tabindex'));
        assert.deepEqual(tabs, ['0', '0', '0'], 'all items get natural tabindex after disabling ALN');
    });
});

QUnit.module('Non-focusable service items', moduleConfig, function() {
    QUnit.test('separator template is excluded from _getAvailableItems', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').addClass(TOOLBAR_SEPARATOR_CLASS) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'separator template is excluded from available items');
    });

    QUnit.test('label template (plain text span) is excluded from _getAvailableItems', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<span>').text('Title') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'label template is excluded from available items');
    });

    QUnit.test('ArrowRight skips separator and moves to next focusable item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').addClass(TOOLBAR_SEPARATOR_CLASS) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $itemC = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemA).get(0) }));

        helpers.press('ArrowRight', helpers.findFocusTarget($itemA).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemC.get(0),
            'ArrowRight skipped separator and landed on C');
    });

    QUnit.test('ArrowLeft skips separator and moves to previous focusable item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').addClass(TOOLBAR_SEPARATOR_CLASS) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'C' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $itemC = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemC).get(0) }));

        helpers.press('ArrowLeft', helpers.findFocusTarget($itemC).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemA.get(0),
            'ArrowLeft skipped separator and landed on A');
    });

    QUnit.test('Home ignores non-focusable item at the start', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', template: () => $('<div>').addClass(TOOLBAR_SEPARATOR_CLASS) },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $itemB = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemB).get(0) }));

        helpers.press('Home', helpers.findFocusTarget($itemB).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemA.get(0),
            'Home landed on first focusable item, ignoring leading separator');
    });

    QUnit.test('End ignores non-focusable item at the end', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
                { locateInMenu: 'never', template: () => $('<span>').text('Label') },
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        const $itemA = $available.eq(0);
        const $itemB = $available.eq(1);

        this.$element.trigger($.Event('focusin', { target: helpers.findFocusTarget($itemA).get(0) }));

        helpers.press('End', helpers.findFocusTarget($itemA).get(0));

        const { focusedElement } = toolbar.option();
        assert.strictEqual($(focusedElement).get(0), $itemB.get(0),
            'End landed on last focusable item, ignoring trailing label');
    });

    QUnit.test('non-focusable item does not receive tabindex=0 on init', function(assert) {
        this.$element.dxToolbar({
            items: [
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'A' } },
                { locateInMenu: 'never', template: () => $('<div>').addClass(TOOLBAR_SEPARATOR_CLASS) },
                { locateInMenu: 'never', template: () => $('<span>').text('Label') },
                { locateInMenu: 'never', widget: 'dxButton', options: { text: 'B' } },
            ],
        });

        const $allItems = this.$element.find(`.${TOOLBAR_ITEM_CLASS}`);
        const $separatorItem = $allItems.eq(1);
        const $labelItem = $allItems.eq(2);

        assert.strictEqual($separatorItem.find('[tabindex="0"]').length, 0,
            'separator item has no element with tabindex=0');
        assert.strictEqual($separatorItem.attr('tabindex'), undefined,
            'separator item container has no tabindex attribute');
        assert.strictEqual($labelItem.find('[tabindex="0"]').length, 0,
            'label item has no element with tabindex=0');
        assert.strictEqual($labelItem.attr('tabindex'), undefined,
            'label item container has no tabindex attribute');
    });
});

QUnit.module('Enter/Exit: dxMenu (APG Menu Button)', moduleConfig, function() {
    const menuItems = [
        { text: 'File', items: [{ text: 'New' }, { text: 'Open' }] },
        { text: 'Edit', items: [{ text: 'Cut' }, { text: 'Copy' }] },
    ];

    function createMenuToolbar() {
        return helpers.createToolbarWithEditorBetweenButtons('dxMenu', { items: menuItems });
    }

    QUnit.test('dxMenu is a single toolbar stop — ArrowRight skips past it', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(0).get(0));
        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(1).get(0),
            'ArrowRight from button lands on dxMenu item');

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0),
            'second ArrowRight skips past dxMenu to Next button');
    });

    QUnit.test('dxMenu root does NOT get dx-state-focused on toolbar navigation', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        focusItemFocusTarget($items.eq(1));

        assert.strictEqual($items.eq(1).find(`.${DX_MENU_CLASS}`).first().hasClass(FOCUSED_STATE_CLASS), false,
            '.dx-menu root does NOT have dx-state-focused during toolbar navigation (before Enter)');
    });

    QUnit.test('Enter activates menu — focus moves inside .dx-menu', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        assert.strictEqual(
            $items.eq(1).get(0).contains(getActiveElement()),
            true,
            'focus is inside the dxMenu toolbar item',
        );
    });

    QUnit.test('first menu-item gets dx-state-focused after Enter', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        const $firstMenuItem = $items.eq(1).find(`.${MENU_ITEM_CLASS}`).first();
        assert.strictEqual($firstMenuItem.hasClass(FOCUSED_STATE_CLASS), true,
            'first .dx-menu-item has dx-state-focused after Enter');
    });

    QUnit.test('ArrowRight inside menu navigates to next root item (not toolbar)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('ArrowRight', getActiveElement());

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(1).get(0),
            'toolbar focusedElement stays on dxMenu item');

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`);
        const menuInstance = $menu.dxMenu('instance');
        const $menuItems = $menu.find(`.${MENU_ITEM_CLASS}`);

        assert.strictEqual($(menuInstance.option('focusedElement')).get(0), $menuItems.eq(1).get(0),
            'menu focusedElement moved to second root item');
    });

    QUnit.test('ArrowLeft inside menu navigates to previous root item (not toolbar)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('ArrowRight', getActiveElement());

        helpers.press('ArrowLeft', getActiveElement());

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`);
        const menuInstance = $menu.dxMenu('instance');
        const $menuItems = $menu.find(`.${MENU_ITEM_CLASS}`);

        assert.strictEqual($(menuInstance.option('focusedElement')).get(0), $menuItems.eq(0).get(0),
            'menu focusedElement moved back to first root item');
    });

    QUnit.test('Escape exits menu — focus returns to .dx-toolbar-item (nav level)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', getActiveElement());

        assert.strictEqual(getActiveElement(), $items.eq(1).get(0),
            'focus returned to .dx-toolbar-item after Escape (nav-level focus target)');
        const $menuRoot = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        assert.strictEqual($menuRoot.hasClass(FOCUSED_STATE_CLASS), false,
            '.dx-menu root does NOT have dx-state-focused after Escape (back to toolbar nav level)');
    });

    QUnit.test('menu-item dx-state-focused removed after Escape', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        const $firstMenuItem = $items.eq(1).find(`.${MENU_ITEM_CLASS}`).first();
        assert.strictEqual($firstMenuItem.hasClass(FOCUSED_STATE_CLASS), true,
            'menu-item has dx-state-focused while inside menu');

        helpers.press('Escape', getActiveElement());

        assert.strictEqual($firstMenuItem.hasClass(FOCUSED_STATE_CLASS), false,
            'menu-item lost dx-state-focused after Escape');
    });

    QUnit.test('after Escape, ArrowRight navigates toolbar to next item', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', getActiveElement());

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(2).get(0),
            'ArrowRight navigates toolbar after Escape from menu');
    });

    QUnit.test('ArrowDown on root menu item opens submenu', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('ArrowDown', getActiveElement());

        const $expanded = $items.eq(1).find(`.${MENU_ITEM_EXPANDED_CLASS}`);
        assert.strictEqual($expanded.length > 0, true, 'submenu opened — menu item has expanded class');
    });

    QUnit.test('tabindex invariant after enter/exit cycle', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('Escape', getActiveElement());

        helpers.press('ArrowRight', this.$element.get(0));

        const $tabZero = this.$element.find('[tabindex="0"]');
        assert.strictEqual($tabZero.length, 1,
            'exactly one tabindex=0 after enter/exit/navigate cycle');
    });

    QUnit.test('tabindex=0 is on .dx-toolbar-item wrapper, not on .dx-menu root', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(0).get(0));
        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($items.eq(1).attr('tabindex'), '0',
            '.dx-toolbar-item is the Tab stop (tabindex=0)');
        assert.strictEqual($items.eq(1).find(`.${DX_MENU_CLASS}`).first().attr('tabindex'), '-1',
            '.dx-menu root is NOT a Tab stop (tabindex=-1, programmatic focus only)');
    });

    QUnit.test('dxMenu does not get dx-state-focused on toolbar navigation (before Enter)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        focusItemFocusTarget($items.eq(1));

        const $menuRoot = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        assert.strictEqual($menuRoot.hasClass(FOCUSED_STATE_CLASS), false,
            '.dx-menu root does not have dx-state-focused during toolbar navigation');

        const $menuItems = $menuRoot.find(`.${MENU_ITEM_CLASS}`);
        const anyMenuItemFocused = $menuItems.toArray().some(
            (el) => $(el).hasClass(FOCUSED_STATE_CLASS)
        );
        assert.strictEqual(anyMenuItemFocused, false,
            'no .dx-menu-item is activated/highlighted during toolbar navigation (silent like texteditor)');

        const menuInstance = $menuRoot.dxMenu('instance');
        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'menu internal focusedElement is null (not auto-activated)');
    });

    QUnit.test('Non-activation keys at toolbar nav level do not activate dxMenu', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        focusItemFocusTarget($items.eq(1));

        const $menuRoot = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menuRoot.dxMenu('instance');

        ['a', 'F1', 'PageDown', 'PageUp', 'Tab'].forEach(function(key) {
            helpers.press(key, $menuRoot.get(0));

            assert.strictEqual(menuInstance.option('focusedElement'), null,
                `dxMenu focusedElement is still null after "${key}" at nav level`);
            assert.strictEqual($menuRoot.find(`.${FOCUSED_STATE_CLASS}`).length, 0,
                `no .dx-menu-item is highlighted after "${key}" at nav level`);
        }, this);
    });

    QUnit.test('Tab landing on .dx-toolbar-item does not auto-activate dxMenu', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(0).get(0));
        helpers.press('ArrowRight', this.$element.get(0));

        $items.eq(1).get(0).focus();

        const $menuRoot = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menuRoot.dxMenu('instance');

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'menu does not auto-activate when Tab lands on .dx-toolbar-item');
        assert.strictEqual($menuRoot.hasClass(FOCUSED_STATE_CLASS), false,
            '.dx-menu root does not have dx-state-focused');
    });

    QUnit.test('Escape with open submenu closes submenu first; second Escape exits to toolbar nav', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('ArrowDown', getActiveElement());

        const $expanded = $items.eq(1).find(`.${MENU_ITEM_EXPANDED_CLASS}`);
        assert.strictEqual($expanded.length > 0, true, 'submenu is open after ArrowDown');

        helpers.press('Escape', getActiveElement());

        const $menuRoot = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menuRoot.dxMenu('instance');

        assert.strictEqual($items.eq(1).get(0).contains(getActiveElement()), true,
            'focus is still inside dxMenu toolbar item after first Escape');
        assert.strictEqual($items.eq(1).find(`.${MENU_ITEM_EXPANDED_CLASS}`).length, 0,
            'submenu is closed after first Escape');

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'menu focusedElement remains null after first Escape (cleared when submenu opened via keyboard)');

        helpers.press('Escape', getActiveElement());

        assert.strictEqual(getActiveElement(), $items.eq(1).get(0),
            'focus returned to .dx-toolbar-item after second Escape (nav-level focus target)');
        assert.strictEqual($menuRoot.hasClass(FOCUSED_STATE_CLASS), false,
            '.dx-menu root does not have dx-state-focused at nav level');
    });

    QUnit.test('ArrowDown at nav level does NOT activate dxMenu (menu is already visible)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowDown', this.$element.get(0));

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menu.dxMenu('instance');

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu is NOT activated by ArrowDown — focusedElement stays null');
        assert.strictEqual($menu.find(`.${FOCUSED_STATE_CLASS}`).length, 0,
            'no .dx-menu-item is highlighted after ArrowDown at nav level');
    });

    QUnit.test('ArrowUp at nav level does NOT activate dxMenu', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('ArrowUp', this.$element.get(0));

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menu.dxMenu('instance');

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu is NOT activated by ArrowUp — focusedElement stays null');
        assert.strictEqual($menu.find(`.${FOCUSED_STATE_CLASS}`).length, 0,
            'no .dx-menu-item is highlighted after ArrowUp at nav level');
    });

    QUnit.test('Re-activating dxMenu restores previously focused item (menu remembers position)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        helpers.press('ArrowRight', getActiveElement());

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();
        const $menuItems = $menu.find(`.${MENU_ITEM_CLASS}`);

        helpers.press('Escape', getActiveElement());

        helpers.press('Enter', this.$element.get(0));

        assert.strictEqual($menuItems.eq(1).hasClass(FOCUSED_STATE_CLASS), true,
            'second menu-item (the last focused one) is restored on re-activation');
        assert.strictEqual($menuItems.eq(0).hasClass(FOCUSED_STATE_CLASS), false,
            'first menu-item is NOT focused (would be a regression to old behavior)');
    });

    QUnit.test('ArrowDown after opening submenu navigates within submenu (does not re-activate root)', function(assert) {
        const toolbar = createMenuToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(1).get(0));
        helpers.press('Enter', this.$element.get(0));

        const $menu = $items.eq(1).find(`.${DX_MENU_CLASS}`).first();

        helpers.press('ArrowRight', getActiveElement());

        helpers.press('ArrowDown', getActiveElement());

        const $expandedBefore = $menu.find(`.${MENU_ITEM_EXPANDED_CLASS}`);
        assert.strictEqual($expandedBefore.length, 1, 'submenu open on the second root item');
        const expandedElement = $expandedBefore.get(0);

        helpers.press('ArrowDown', getActiveElement());

        const $expandedAfter = $menu.find(`.${MENU_ITEM_EXPANDED_CLASS}`);
        assert.strictEqual($expandedAfter.length, 1, 'submenu still open after second ArrowDown');
        assert.strictEqual($expandedAfter.get(0), expandedElement,
            'submenu is still on the second root item (not jumped to the first)');
    });
});

QUnit.module('Enter/Exit: dxMenu inside overflow list', moduleConfig, function() {
    const menuItems = [
        { text: 'File', items: [{ text: 'New' }, { text: 'Open' }] },
        { text: 'Edit', items: [{ text: 'Cut' }, { text: 'Copy' }] },
    ];

    function setupOverflowWithMenu($el) {
        const toolbar = $el.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { locateInMenu: 'always', widget: 'dxMenu', options: { items: menuItems } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'After' } },
            ],
        }).dxToolbar('instance');

        const $overflowBtn = $el.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        $overflowBtn.get(0).focus();

        helpers.press('ArrowDown', getActiveElement());

        const menu = helpers.getOverflowMenu(toolbar);
        const list = helpers.getOverflowList(menu);
        const $menuListItem = helpers.getOverflowListItems(menu)
            .toArray()
            .map((el) => $(el))
            .find(($i) => $i.find(`.${DX_MENU_CLASS}`).length > 0);

        const $menuRoot = $menuListItem.find(`.${DX_MENU_CLASS}`).first();
        const menuInstance = $menuRoot.dxMenu('instance');

        return { list, $menuListItem, $menuRoot, menuInstance };
    }

    QUnit.test('Enter activates dxMenu — focus moves into .dx-menu, first item highlighted', function(assert) {
        const { $menuListItem, $menuRoot, menuInstance } = setupOverflowWithMenu(this.$element);

        helpers.press('Enter', getActiveElement());

        assert.strictEqual($menuListItem.get(0).contains(getActiveElement()), true,
            'focus is inside the list item that hosts dxMenu');
        const $firstMenuItem = $menuRoot.find(`.${MENU_ITEM_CLASS}`).first();
        assert.strictEqual($firstMenuItem.hasClass(FOCUSED_STATE_CLASS), true,
            'first .dx-menu-item has dx-state-focused after Enter');
        assert.strictEqual($(menuInstance.option('focusedElement')).get(0), $firstMenuItem.get(0),
            'dxMenu focusedElement is on the first item');
    });

    QUnit.test('ArrowDown at list nav level navigates list — does NOT activate dxMenu', function(assert) {
        const { list, $menuListItem, menuInstance } = setupOverflowWithMenu(this.$element);

        assert.strictEqual(getActiveElement(), $menuListItem.get(0),
            'DOM focus is on the list item wrapper before ArrowDown');

        helpers.press('ArrowDown', getActiveElement());

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu is NOT activated by ArrowDown — focusedElement stays null');
        assert.notStrictEqual($(list.option('focusedElement')).get(0), $menuListItem.get(0),
            'list moved focus to the next list item');
    });

    QUnit.test('ArrowUp at list nav level navigates list — does NOT activate dxMenu', function(assert) {
        const { list, $menuListItem, menuInstance } = setupOverflowWithMenu(this.$element);

        assert.strictEqual(getActiveElement(), $menuListItem.get(0),
            'DOM focus is on the list item wrapper before ArrowUp');

        helpers.press('ArrowUp', getActiveElement());

        assert.strictEqual(menuInstance.option('focusedElement'), null,
            'dxMenu is NOT activated by ArrowUp — focusedElement stays null');
        assert.notStrictEqual($(list.option('focusedElement')).get(0), $menuListItem.get(0),
            'list moved focus on ArrowUp');
    });

    QUnit.test('Tab from TextBox input closes overflow menu and keeps native tab navigation', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxTextBox', locateInMenu: 'always', options: { value: 'Text' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'After' } },
            ],
        }).dxToolbar('instance');

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        $overflowBtn.get(0).focus();

        helpers.press('ArrowDown', getActiveElement());

        const menu = helpers.getOverflowMenu(toolbar);
        const $input = helpers.getOverflowList(menu).$element().find(`.${TEXTEDITOR_INPUT_CLASS}`).first();
        $input.get(0).focus();

        const event = new KeyboardEvent('keydown', {
            key: 'Tab',
            bubbles: true,
            cancelable: true,
        });
        $input.get(0).dispatchEvent(event);

        assert.strictEqual(event.defaultPrevented, false,
            'Tab default action is not prevented');
        assert.strictEqual(menu.option('opened'), false,
            'overflow menu is closed by Tab from TextBox input');
    });

    QUnit.test('ArrowRight inside menu navigates between root items (not list)', function(assert) {
        const { list, $menuListItem, $menuRoot, menuInstance } = setupOverflowWithMenu(this.$element);

        helpers.press('Enter', getActiveElement());

        helpers.press('ArrowRight', getActiveElement());

        const $menuItems = $menuRoot.find(`.${MENU_ITEM_CLASS}`);
        assert.strictEqual($(menuInstance.option('focusedElement')).get(0), $menuItems.eq(1).get(0),
            'menu focusedElement moved to second root item');
        assert.strictEqual($(list.option('focusedElement')).get(0), $menuListItem.get(0),
            'list focus stays on the dxMenu list item');
    });

    QUnit.test('Escape exits dxMenu — focus returns to list-item wrapper (nav level)', function(assert) {
        const { $menuListItem, $menuRoot } = setupOverflowWithMenu(this.$element);

        helpers.press('Enter', getActiveElement());

        helpers.press('Escape', getActiveElement());

        assert.strictEqual(getActiveElement(), $menuListItem.get(0),
            'focus returned to the list-item wrapper after Escape');
        assert.strictEqual($menuRoot.find(`.${FOCUSED_STATE_CLASS}`).length, 0,
            'no menu-item is visually focused after exiting to list nav level');
    });

    QUnit.test('Escape with open submenu closes submenu first; second Escape exits to list nav', function(assert) {
        const { $menuListItem, $menuRoot } = setupOverflowWithMenu(this.$element);

        helpers.press('Enter', getActiveElement());

        helpers.press('ArrowDown', getActiveElement());

        assert.strictEqual($menuRoot.find(`.${MENU_ITEM_EXPANDED_CLASS}`).length > 0, true,
            'submenu is open after ArrowDown');

        helpers.press('Escape', getActiveElement());

        assert.strictEqual($menuRoot.find(`.${MENU_ITEM_EXPANDED_CLASS}`).length, 0,
            'submenu is closed after first Escape');
        assert.strictEqual($menuListItem.get(0).contains(getActiveElement()), true,
            'focus is still inside dxMenu list item after first Escape');

        helpers.press('Escape', getActiveElement());

        assert.strictEqual(getActiveElement(), $menuListItem.get(0),
            'focus returned to list-item wrapper after second Escape');
    });

    QUnit.test('Re-activating dxMenu restores previously focused item', function(assert) {
        const { $menuRoot } = setupOverflowWithMenu(this.$element);

        helpers.press('Enter', getActiveElement());

        helpers.press('ArrowRight', getActiveElement());

        const $menuItems = $menuRoot.find(`.${MENU_ITEM_CLASS}`);

        helpers.press('Escape', getActiveElement());

        helpers.press('Enter', getActiveElement());

        assert.strictEqual($menuItems.eq(1).hasClass(FOCUSED_STATE_CLASS), true,
            'second menu-item (the last focused one) is restored on re-activation');
        assert.strictEqual($menuItems.eq(0).hasClass(FOCUSED_STATE_CLASS), false,
            'first menu-item is NOT focused (would be a regression)');
    });

    QUnit.test('tabindex=0 is on the list-item wrapper, not on .dx-menu root', function(assert) {
        const { $menuListItem, $menuRoot } = setupOverflowWithMenu(this.$element);

        assert.strictEqual($menuListItem.attr('tabindex'), '0',
            'list-item is the Tab stop (tabindex=0)');
        assert.strictEqual($menuRoot.attr('tabindex'), '-1',
            '.dx-menu root is NOT a Tab stop (tabindex=-1)');
    });
});

QUnit.module('Enter: plain overflow item', moduleConfig, function() {
    QUnit.test('Enter on plain overflow item with onClick fires item.onClick', function(assert) {
        let clicked = false;
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { text: 'Plain', locateInMenu: 'always', onClick: () => { clicked = true; } },
            ],
        }).dxToolbar('instance');

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        $overflowBtn.get(0).focus();

        helpers.press('ArrowDown', getActiveElement());

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('opened'), true, 'overflow popup is opened');

        const $plainListItem = helpers.getOverflowListItems(menu).first();
        assert.strictEqual($plainListItem.text().trim(), 'Plain',
            'plain item is the first overflow list item');

        helpers.press('Enter', getActiveElement());

        assert.strictEqual(clicked, true,
            'Enter activates plain overflow item with onClick (callSuper in handleEnterKey)');
    });

    QUnit.test('Space on plain overflow item with onClick fires item.onClick', function(assert) {
        let clicked = false;
        const toolbar = this.$element.dxToolbar({
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { text: 'Plain', locateInMenu: 'always', onClick: () => { clicked = true; } },
            ],
        }).dxToolbar('instance');

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        $overflowBtn.get(0).focus();

        helpers.press('ArrowDown', getActiveElement());

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('opened'), true, 'overflow popup is opened');

        helpers.press(' ', getActiveElement());

        assert.strictEqual(clicked, true,
            'Space activates plain overflow list item with onClick (defaultPrevented from supportedKeys.space must not skip super._enterKeyHandler)');
    });
});

QUnit.module('Enter: root item-level onClick', moduleConfig, function() {
    QUnit.test('Enter on widget-wrapped root item with item-level onClick fires it via super', function(assert) {
        let itemClicked = false;
        let widgetClicked = false;
        const toolbar = this.$element.dxToolbar({
            items: [{
                widget: 'dxButton',
                options: { text: 'A', onClick: () => { widgetClicked = true; } },
                onClick: () => { itemClicked = true; },
            }],
        }).dxToolbar('instance');

        helpers.focusItemAt(toolbar, 0);

        helpers.press('Enter', getActiveElement());

        assert.strictEqual(widgetClicked, true, 'dxButton.options.onClick fires (handled by dxButton itself)');
        assert.strictEqual(itemClicked, true,
            'item-level onClick fires via super._enterKeyHandler → _itemClickHandler');
    });

    QUnit.test('Space on widget-wrapped root item with item-level onClick fires onItemClick', function(assert) {
        let itemClickCount = 0;
        const toolbar = this.$element.dxToolbar({
            onItemClick: () => { itemClickCount += 1; },
            items: [{
                widget: 'dxButton',
                options: { text: 'A' },
                onClick: () => {},
            }],
        }).dxToolbar('instance');

        helpers.focusItemAt(toolbar, 0);

        helpers.press(' ', getActiveElement());

        assert.strictEqual(itemClickCount, 1,
            'onItemClick fires for Space on regular item (Space sets defaultPrevented in supportedKeys, but super._enterKeyHandler must still run)');
    });
});

QUnit.module('Enter/Space: overflow button is not an item', moduleConfig, function() {
    function makeOverflowToolbar(ctx, onItemClick) {
        return ctx.$element.dxToolbar({
            onItemClick,
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
                { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
            ],
        }).dxToolbar('instance');
    }

    QUnit.test('Enter on overflow button does NOT fire onItemClick', function(assert) {
        let itemClickArgs;
        let itemClickCount = 0;
        const toolbar = makeOverflowToolbar(this, (e) => {
            itemClickCount += 1;
            itemClickArgs = e;
        });

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press('Enter', $overflowBtn.get(0));

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('opened'), true,
            'sanity: Enter still opens the overflow menu');
        assert.strictEqual(itemClickCount, 0,
            `onItemClick is not fired for the overflow button (got ${itemClickCount} call(s) with ${JSON.stringify({
                itemIndex: itemClickArgs && itemClickArgs.itemIndex,
                hasItemElement: !!(itemClickArgs && itemClickArgs.itemElement),
                hasItemData: !!(itemClickArgs && itemClickArgs.itemData),
            })})`);
    });

    QUnit.test('Space on overflow button does NOT fire onItemClick', function(assert) {
        let itemClickCount = 0;
        const toolbar = makeOverflowToolbar(this, () => { itemClickCount += 1; });

        const $overflowBtn = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        toolbar.option('focusedElement', $overflowBtn.get(0));
        helpers.press(' ', $overflowBtn.get(0));

        const menu = helpers.getOverflowMenu(toolbar);
        assert.strictEqual(menu.option('opened'), true,
            'sanity: Space still opens the overflow menu');
        assert.strictEqual(itemClickCount, 0,
            'onItemClick is not fired for the overflow button on Space');
    });
});

QUnit.module('_focusOutHandler: callSuper contract', moduleConfig, function() {
    function makeToolbar(ctx, { allowKeyboardNavigation = true, items, onFocusOut }) {
        return ctx.$element.dxToolbar({
            allowKeyboardNavigation,
            items: items || [{ widget: 'dxButton', locateInMenu: 'never', options: { text: 'A' } }],
            onFocusOut,
        }).dxToolbar('instance');
    }

    QUnit.test('fallback (navigator undefined) — focusout calls super (onFocusOut fires)', function(assert) {
        let calls = 0;
        const toolbar = makeToolbar(this, {
            allowKeyboardNavigation: true,
            onFocusOut: () => { calls++; },
        });
        assert.ok(toolbar._navigator, 'navigator created in APG mode (sanity)');
        toolbar._navigator = undefined;

        this.$element.trigger($.Event('focusout', {
            target: this.$element.find(`.${BUTTON_CLASS}`).get(0),
            relatedTarget: $('#qunit-fixture').get(0),
        }));

        assert.strictEqual(calls, 1, 'super._focusOutHandler invoked in fallback path');
    });

    QUnit.test('APG: focusout to outside (no overlay) calls super (onFocusOut fires)', function(assert) {
        let calls = 0;
        const toolbar = makeToolbar(this, { onFocusOut: () => { calls++; } });
        assert.ok(toolbar._navigator, 'navigator created in APG mode');

        const outside = $('<button type="button">outside</button>').appendTo('#qunit-fixture');
        this.$element.trigger($.Event('focusout', {
            target: this.$element.find(`.${BUTTON_CLASS}`).get(0),
            relatedTarget: outside.get(0),
        }));

        assert.strictEqual(calls, 1, 'super._focusOutHandler invoked when shouldDelegateFocusOut returns true');
        outside.remove();
    });

    QUnit.test('APG: focusout with relatedTarget inside toolbar skips super', function(assert) {
        let calls = 0;
        const toolbar = makeToolbar(this, {
            items: [
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'A' } },
                { widget: 'dxButton', locateInMenu: 'never', options: { text: 'B' } },
            ],
            onFocusOut: () => { calls++; },
        });
        assert.ok(toolbar._navigator, 'navigator created');

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        this.$element.trigger($.Event('focusout', {
            target: $buttons.get(0),
            relatedTarget: $buttons.get(1),
        }));

        assert.strictEqual(calls, 0, 'super._focusOutHandler is skipped when relatedTarget stays inside toolbar');
    });

    QUnit.test('APG: focusout with relatedTarget inside overlay skips super', function(assert) {
        let calls = 0;
        const toolbar = makeToolbar(this, { onFocusOut: () => { calls++; } });
        assert.ok(toolbar._navigator, 'navigator created');

        const popup = $('<div>').appendTo('#qunit-fixture')
            .dxPopup({ visible: true, contentTemplate: () => $('<button>x</button>') })
            .dxPopup('instance');

        this.$element.trigger($.Event('focusout', {
            target: this.$element.find(`.${BUTTON_CLASS}`).get(0),
            relatedTarget: popup.$overlayContent().find('button').get(0),
        }));

        assert.strictEqual(calls, 0, 'super._focusOutHandler is skipped when relatedTarget is inside overlay content');
        popup.dispose();
    });
});

QUnit.module('Overflow menu: visual focus states', moduleConfig, function() {
    function makeOverflowToolbar() {
        return helpers.createToolbar([
            buttonItem('Visible'),
            buttonItem('Menu A', { locateInMenu: 'always' }),
            buttonItem('Menu B', { locateInMenu: 'always' }),
        ]);
    }

    const getOverflowBtn = ($el) => $el.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);

    QUnit.test('overflow button is focused when navigated to via keyboard', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        focusItemFocusTarget($overflowBtn);

        assert.strictEqual(getActiveElement(), $overflowBtn.get(0),
            'overflow button is the active element');
    });

    QUnit.test('overflow button retains focus after Escape closes popup', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $overflowBtn = getOverflowBtn(this.$element);
        const menu = helpers.getOverflowMenu(toolbar);

        toolbar.option('focusedElement', $overflowBtn.get(0));
        focusItemFocusTarget($overflowBtn);

        menu.openWithFocus('first');

        const $firstItem = helpers.getOverflowListItems(menu).first();
        const $focusTarget = helpers.findFocusTarget($firstItem);
        helpers.press('Escape', $focusTarget.get(0));

        assert.strictEqual(menu.option('opened'), false, 'popup closed after Escape');
        assert.strictEqual(getActiveElement(), $overflowBtn.get(0),
            'overflow button retains focus after popup closes');
    });

    QUnit.test('ArrowRight from visible button navigates focus to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $items = helpers.getAvailableItems(toolbar);
        const $overflowBtn = getOverflowBtn(this.$element);

        toolbar.option('focusedElement', $items.eq(0).get(0));
        focusItemFocusTarget($items.eq(0));

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $overflowBtn.get(0),
            'focusedElement is the overflow button');
        assert.strictEqual(getActiveElement(), $overflowBtn.get(0),
            'overflow button is focused after navigation');
    });

    QUnit.test('previous button loses dx-state-focused when focus moves to overflow button', function(assert) {
        const toolbar = makeOverflowToolbar();
        const $items = helpers.getAvailableItems(toolbar);

        toolbar.option('focusedElement', $items.eq(0).get(0));
        focusItemFocusTarget($items.eq(0));

        const $button = $items.eq(0).find(`.${BUTTON_CLASS}`);
        assert.strictEqual($button.hasClass(FOCUSED_STATE_CLASS), true,
            'visible button has dx-state-focused before navigation');

        helpers.press('ArrowRight', this.$element.get(0));

        assert.strictEqual($button.hasClass(FOCUSED_STATE_CLASS), false,
            'visible button lost dx-state-focused after focus moved');
    });

    QUnit.test('overflow list does not set aria-activedescendant on its container when item is focused', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $listEl = list.$element();

        assert.strictEqual($listEl.attr('aria-activedescendant'), undefined,
            'list container has no aria-activedescendant (roving tabindex owns focus)');
    });

    QUnit.test('overflow list items do not receive a synthetic id attribute when focused', function(assert) {
        const toolbar = makeOverflowToolbar();
        const menu = helpers.getOverflowMenu(toolbar);

        menu.openWithFocus('first');

        const list = helpers.getOverflowList(menu);
        const $items = helpers.getOverflowListItems(menu);

        $items.each(function() {
            assert.strictEqual($(this).attr('id'), undefined,
                'list item has no synthetic id (roving tabindex owns focus)');
        });
    });
});


QUnit.module('Arrow navigation — RTL', moduleConfig, function() {
    QUnit.test('ArrowLeft navigates to the visually-right item when rtlEnabled', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { rtlEnabled: true },
        );
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowLeft navigates forward in RTL');
    });

    QUnit.test('ArrowRight navigates to the visually-left item when rtlEnabled', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { rtlEnabled: true },
        );
        helpers.focusItemAt(toolbar, 2);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowRight navigates backward in RTL');
    });

    QUnit.test('Home/End remain absolute regardless of RTL', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { rtlEnabled: true },
        );
        helpers.focusItemAt(toolbar, 1);

        helpers.press('Home');
        helpers.assertFocusedItemAt(assert, toolbar, 0, 'Home goes to first item in DOM order');

        helpers.press('End');
        helpers.assertFocusedItemAt(assert, toolbar, 2, 'End goes to last item in DOM order');
    });

    QUnit.test('RTL toggled at runtime flips the arrow semantics', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowRight');
        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowRight goes forward in LTR');

        toolbar.option('rtlEnabled', true);
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowLeft');
        helpers.assertFocusedItemAt(assert, toolbar, 1, 'ArrowLeft goes forward after switching to RTL');
    });
});

QUnit.module('Arrow navigation — loopItemFocus', moduleConfig, function() {
    QUnit.test('default loops at the right edge (ArrowRight on last → first)', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 2);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 0, 'ArrowRight at last loops to first');
    });

    QUnit.test('default loops at the left edge (ArrowLeft on first → last)', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 2, 'ArrowLeft at first loops to last');
    });

    QUnit.test('loopItemFocus:false keeps focus on last item when pressing ArrowRight', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { loopItemFocus: false },
        );
        helpers.focusItemAt(toolbar, 2);

        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 2, 'ArrowRight at last stays put when loopItemFocus:false');
    });

    QUnit.test('loopItemFocus:false keeps focus on first item when pressing ArrowLeft', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { loopItemFocus: false },
        );
        helpers.focusItemAt(toolbar, 0);

        helpers.press('ArrowLeft');

        helpers.assertFocusedItemAt(assert, toolbar, 0, 'ArrowLeft at first stays put when loopItemFocus:false');
    });

    QUnit.test('Home/End work identically regardless of loopItemFocus', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { loopItemFocus: false },
        );
        helpers.focusItemAt(toolbar, 1);

        helpers.press('End');
        helpers.assertFocusedItemAt(assert, toolbar, 2, 'End jumps to last');

        helpers.press('Home');
        helpers.assertFocusedItemAt(assert, toolbar, 0, 'Home jumps to first');
    });
});

QUnit.module('Item-level tabIndex option', moduleConfig, function() {
    QUnit.test('active item receives custom tabIndex from item.options.tabIndex', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B', { options: { tabIndex: 5 } }),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 1);

        const $items = helpers.getAvailableItems(toolbar);
        helpers.assertActiveTabIndex(assert, $items.eq(1), 5,
            'item with options.tabIndex=5 keeps that value while active');
    });

    QUnit.test('inactive item with custom tabIndex falls back to -1', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            buttonItem('B', { options: { tabIndex: 5 } }),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 1);

        helpers.press('ArrowRight');

        const $items = helpers.getAvailableItems(toolbar);
        helpers.assertActiveTabIndex(assert, $items.eq(1), -1,
            'previously active item with custom tabIndex returns to -1 when inactive');
        helpers.assertActiveTabIndex(assert, $items.eq(2), 0,
            'newly active item gets default tabIndex=0');
    });

    QUnit.test('exactly one tab stop is maintained when using custom item tabIndex', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A', { options: { tabIndex: 3 } }),
            buttonItem('B', { options: { tabIndex: 5 } }),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 0);

        const $tabStops = this.$element.find('[tabindex]:not([tabindex="-1"])').not(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual($tabStops.length, 1, 'exactly one positive-tabindex stop exists');
    });
});

QUnit.module('Roving tabindex — incremental vs reset paths', moduleConfig, function() {
    QUnit.test('ArrowRight uses the DOM-focused item when focusStateEnabled is false and focusedElement is stale', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('Attach'), buttonItem('Send')], {
            focusStateEnabled: false,
        });
        const $items = helpers.getAvailableItems(toolbar);
        const $attach = $items.eq(0);
        const $send = $items.eq(1);

        helpers.focusItemAt(toolbar, 1);

        helpers.findFocusTarget($send).attr('tabindex', '-1');
        helpers.findFocusTarget($attach).attr('tabindex', '0');
        helpers.findFocusTarget($attach).get(0).focus();

        helpers.press('ArrowRight', helpers.findFocusTarget($attach).get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $send.get(0), 'focus moved from DOM-focused Attach to Send');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($send).get(0), 'Send button received DOM focus');
    });

    QUnit.test('ArrowRight uses the current roving tab stop when the keydown target is the toolbar root', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('Attach'), buttonItem('Send')], {
            focusStateEnabled: false,
        });
        const $items = helpers.getAvailableItems(toolbar);
        const $send = $items.eq(1);

        toolbar.option('focusedElement', null);

        helpers.press('ArrowRight', toolbar.$element().get(0));

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $send.get(0), 'focus moved from current roving tab stop to Send');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($send).get(0), 'Send button received DOM focus');
    });

    QUnit.test('arrow navigation is incremental: unrelated items are not affected', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C'), buttonItem('D')]);
        helpers.focusItemAt(toolbar, 1);

        const $items = helpers.getAvailableItems(toolbar);

        helpers.press('ArrowRight');
        assert.strictEqual(parseInt(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), 10), -1,
            'A is still -1 (was not re-scanned)');
        assert.strictEqual(parseInt(helpers.findFocusTarget($items.eq(1)).attr('tabindex'), 10), -1,
            'B lost tabindex=0');
        assert.strictEqual(parseInt(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), 10), 0,
            'C gained tabindex=0');
        assert.strictEqual(parseInt(helpers.findFocusTarget($items.eq(3)).attr('tabindex'), 10), -1,
            'D is still -1 (was not re-scanned)');
    });

    QUnit.test('item disabled option change triggers _resetRovingTabIndex (full pass)', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        const resetSpy = sinon.spy(toolbar, '_resetRovingTabIndex');

        const items = toolbar.option('items').slice();
        items[1] = { ...items[1], disabled: true };
        toolbar.option('items', items);

        assert.strictEqual(resetSpy.called, true, '_resetRovingTabIndex was called after disabled change');

        resetSpy.restore();
    });

    QUnit.test('items option change triggers _resetRovingTabIndex', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B')]);
        helpers.focusItemAt(toolbar, 0);

        const resetSpy = sinon.spy(toolbar, '_resetRovingTabIndex');

        toolbar.option('items', [buttonItem('X'), buttonItem('Y'), buttonItem('Z')]);

        assert.strictEqual(resetSpy.called, true, '_resetRovingTabIndex was called after items option change');

        resetSpy.restore();
    });

    QUnit.test('after _resetRovingTabIndex, exactly one item has tabindex=0', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar._resetRovingTabIndex();

        helpers.assertOneTabStop(assert, this.$element,
            'one tab stop after explicit reset (focused item retains the stop)');
    });

    QUnit.test('ArrowRight: only the previously active and newly active items change tabindex', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        const $items = helpers.getAvailableItems(toolbar);
        const initialFirst = parseInt(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), 10);

        helpers.press('ArrowRight');

        const afterFirst = parseInt(helpers.findFocusTarget($items.eq(0)).attr('tabindex'), 10);
        const afterSecond = parseInt(helpers.findFocusTarget($items.eq(1)).attr('tabindex'), 10);
        const afterThird = parseInt(helpers.findFocusTarget($items.eq(2)).attr('tabindex'), 10);

        assert.strictEqual(initialFirst, 0, 'first started as the tab stop');
        assert.strictEqual(afterFirst, -1, 'first lost the stop');
        assert.strictEqual(afterSecond, 0, 'second became the stop');
        assert.strictEqual(afterThird, -1, 'third remained untouched at -1');
    });
});

QUnit.module('Focus restore on full re-render', moduleConfig, function() {
    QUnit.test('option("items") keeps DOM focus on the same item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        const $item1 = helpers.getAvailableItems(toolbar).eq(1);
        assert.strictEqual(getActiveElement(toolbar), helpers.findFocusTarget($item1).get(0),
            'DOM focus restored to item #1 after full re-render');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('dataSource reload keeps DOM focus on the same item', function(assert) {
        const toolbar = this.$element.dxToolbar({
            dataSource: [buttonItem('A'), buttonItem('B'), buttonItem('C')],
        }).dxToolbar('instance');
        helpers.focusItemAt(toolbar, 2);

        toolbar.getDataSource().reload();

        const $item2 = helpers.getAvailableItems(toolbar).eq(2);
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($item2).get(0),
            'DOM focus restored after dataSource reload');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('does not steal focus when the user is outside the toolbar', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B')]);
        const outside = $('<button type="button">').text('outside').appendTo('#qunit-fixture').get(0);
        outside.focus();
        assert.strictEqual(getActiveElement(), outside, 'precondition: focus is outside the toolbar');

        toolbar.option('items', [buttonItem('A'), buttonItem('B')]);

        assert.strictEqual(getActiveElement(), outside,
            'focus stays on the outside element; toolbar did not grab it');
        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), false,
            'no toolbar item received focus');
    });

    QUnit.test('focused item removed: focus falls back to a still-present item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C'), buttonItem('D')]);
        helpers.focusItemAt(toolbar, 3);

        toolbar.option('items', [buttonItem('A'), buttonItem('B')]);

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'two items remain');
        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), true,
            'focus restored to a still-present item');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(1)).get(0),
            'focus landed on the last available item (no index >= 3 exists)');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('focused item becomes disabled: focus moves to an enabled item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items', [buttonItem('A', { disabled: true }), buttonItem('B'), buttonItem('C')]);

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'disabled item is excluded from available items');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(0)).get(0),
            'focus moved to the nearest enabled item, never the disabled one');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('overflow button keeps focus after re-render', function(assert) {
        const makeItems = () => [
            buttonItem('Visible'),
            buttonItem('Menu A', { locateInMenu: 'always' }),
            buttonItem('Menu B', { locateInMenu: 'always' }),
        ];
        const toolbar = helpers.createToolbar(makeItems());

        const $overflow = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        assert.ok($overflow.length, 'precondition: overflow button is present');
        toolbar.option('focusedElement', $overflow.get(0));
        focusItemFocusTarget($overflow);

        toolbar.option('items', makeItems());

        const $overflowAfter = this.$element.find(`.${DROP_DOWN_MENU_BUTTON_CLASS}`);
        assert.strictEqual(getActiveElement(), $overflowAfter.get(0),
            'overflow button refocused after re-render');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('allowKeyboardNavigation:false: no focus restore attempted', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B')],
            { allowKeyboardNavigation: false },
        );
        helpers.findFocusTarget(helpers.getAvailableItems(toolbar).eq(0)).get(0).focus();

        toolbar.option('items', [buttonItem('A'), buttonItem('B')]);

        assert.strictEqual(!!toolbar._pendingFocusTarget, false, 'no pending focus descriptor was captured');
        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), false,
            'toolbar did not re-grab focus when keyboard navigation is disabled');
    });

    QUnit.test('async-rendered template item: focus restored after render', function(assert) {
        const makeItems = () => [
            buttonItem('A'),
            { locateInMenu: 'never', template: () => $('<button type="button">').text('Tpl') },
            buttonItem('C'),
        ];
        const toolbar = this.$element.dxToolbar({ items: makeItems() }).dxToolbar('instance');
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', makeItems());

        const $tpl = helpers.getAvailableItems(toolbar).eq(1);
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($tpl).get(0),
            'focus restored to the template item after re-render');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('multiline toolbar restores focus after re-render', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B'), buttonItem('C')],
            { multiline: true },
        );
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        const $item1 = helpers.getAvailableItems(toolbar).eq(1);
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($item1).get(0),
            'DOM focus restored in multiline mode');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('repeated re-render: still one tab stop and focus on a valid item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 2);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), true,
            'focus remains inside toolbar after two consecutive re-renders');
        helpers.assertOneTabStop(assert, this.$element);
        assert.strictEqual(!!toolbar._pendingFocusTarget, false,
            'pending focus target is fully consumed');
    });
});

QUnit.module('Focus restore on full re-render — edge cases', moduleConfig, function() {
    QUnit.test('restored non-first item owns the single tab stop', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 2);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        const $items = helpers.getAvailableItems(toolbar);
        helpers.assertActiveTabIndex(assert, $items.eq(2), 0, 'restored item #2 holds tabindex=0');
        helpers.assertActiveTabIndex(assert, $items.eq(0), -1, 'item #0 released the reset-default stop');
        helpers.assertActiveTabIndex(assert, $items.eq(1), -1, 'item #1 stays at -1');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('focusedElement option is re-synced to the restored item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'focusedElement points to the restored item (focusin pipeline ran)');
    });

    QUnit.test('disabled focused item skips to the next higher enabled item (not the last)', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C'), buttonItem('D')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [
            buttonItem('A'), buttonItem('B', { disabled: true }), buttonItem('C'), buttonItem('D'),
        ]);

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 3, 'disabled B is excluded');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(1)).get(0),
            'focus landed on C — the next higher enabled item, not the last (D)');
        assert.notStrictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(2)).get(0),
            'focus is NOT on the last item D (distinguishes nearest-higher from last-fallback)');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('all items disabled after re-render: focus is not forced into the toolbar', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items', [buttonItem('A', { disabled: true }), buttonItem('B', { disabled: true })]);

        assert.strictEqual(helpers.getAvailableItems(toolbar).length, 0, 'no available items remain');
        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), false,
            'no focus is forced when nothing is focusable');
    });

    QUnit.test('captureFocusedItem tri-state: item -> target, outside -> null, body -> undefined', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B')]);
        const nav = toolbar._navigator;

        const $item0 = helpers.getAvailableItems(toolbar).eq(0);
        helpers.findFocusTarget($item0).get(0).focus();
        const target = nav.captureFocusedItem();
        assert.strictEqual(target, 0, 'focus on item yields a target');
        assert.strictEqual(target.index, undefined, 'target.index is the focused item index');

        const outside = $('<button type="button">').appendTo('#qunit-fixture').get(0);
        outside.focus();
        assert.strictEqual(nav.captureFocusedItem(), null,
            'focus on a real outside element -> null (drop pending)');

        outside.blur();
        assert.strictEqual(nav.captureFocusedItem(), undefined,
            'focus on body/null -> undefined (keep pending)');
    });

    QUnit.test('body focus during a re-render does not clobber the captured target', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        toolbar._pendingFocusTarget = 2;
        if(getActiveElement() && getActiveElement() !== document.body) {
            getActiveElement().blur();
        }

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        const $item2 = helpers.getAvailableItems(toolbar).eq(2);
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($item2).get(0),
            'seeded targer survived the body-focus re-render and drove the restore');
    });
});

QUnit.module('Focus restore — nearest item by array index (mixed locations)', moduleConfig, function() {
    const focusedItemIndex = (toolbar) => {
        const active = getActiveElement();
        const items = toolbar.option('items') || [];
        for(let i = 0; i < items.length; i++) {
            const $itemEl = toolbar._findItemElementByItem(items[i]);
            if($itemEl.length && $itemEl.get(0).contains(active)) {
                return i;
            }
        }
        return undefined;
    };

    QUnit.test('nearest-above is chosen by array index, not by DOM order', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A', { location: 'before' }),
            buttonItem('B', { location: 'before' }),
            buttonItem('C', { location: 'after' }),
            buttonItem('D', { location: 'before' }),
        ]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items[1].disabled', true);

        assert.strictEqual(focusedItemIndex(toolbar), 2,
            'focus landed on array index 2 (nearest above 1), not the DOM-first index 3');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('fallback picks the highest array index, not the last DOM item', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A', { location: 'before' }),
            buttonItem('B', { location: 'after' }),
            buttonItem('C', { location: 'before' }),
            buttonItem('D', { location: 'before' }),
        ]);
        helpers.focusItemAt(toolbar, 2);

        toolbar.option('items[3].disabled', true);

        assert.strictEqual(focusedItemIndex(toolbar), 2,
            'fallback landed on the highest array index 2, not the last DOM item (index 1)');
        helpers.assertOneTabStop(assert, this.$element);
    });
});

QUnit.module('Focus restore — focused item disabled in place (incremental)', moduleConfig, function() {
    QUnit.test('disabling the focused item moves DOM focus to an adjacent enabled item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);
        assert.strictEqual(
            getActiveElement(), helpers.findFocusTarget(helpers.getAvailableItems(toolbar).eq(1)).get(0),
            'precondition: B owns DOM focus',
        );

        toolbar.option('items[1].disabled', true);

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2, 'disabled B excluded from available items');
        assert.strictEqual(this.$element.get(0).contains(getActiveElement()), true,
            'focus stays inside the toolbar after disabling the focused item');
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(1)).get(0),
            'DOM focus moved to the next enabled item (C)');
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('after disabling the focused item, arrow navigation continues without re-entering', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items[0].disabled', true);

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual(getActiveElement(), helpers.findFocusTarget($available.eq(0)).get(0),
            'DOM focus moved to B after disabling A');

        helpers.press('ArrowRight', getActiveElement());

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'ArrowRight moves on to C — toolbar navigation still works');
    });

    QUnit.test('disabling a NON-focused item does not move focus', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items[2].disabled', true);

        assert.strictEqual(
            getActiveElement(), helpers.findFocusTarget(helpers.getAvailableItems(toolbar).eq(0)).get(0),
            'focus remains on A; disabling another item did not steal focus',
        );
        helpers.assertOneTabStop(assert, this.$element);
    });

    QUnit.test('disabling the only enabled focused item does not throw and leaves no tab stop', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B', { disabled: true })]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items[0].disabled', true);

        assert.strictEqual(helpers.getAvailableItems(toolbar).length, 0, 'no enabled items remain');
        assert.strictEqual(
            this.$element.find('[tabindex="0"]').not(`.${TEXTEDITOR_INPUT_CLASS}`).length, 0,
            'no roving tab stop remains when nothing is focusable',
        );
    });
});

QUnit.module('Tab key — toolbar does not intercept', moduleConfig, function() {
    QUnit.test('Tab does not invoke roving navigation and is not preventDefaulted', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        const focusBefore = toolbar.option('focusedElement');
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        this.$element.find(`.${BUTTON_CLASS}`).first().get(0).dispatchEvent(event);

        assert.strictEqual(toolbar.option('focusedElement'), focusBefore,
            'Tab leaves focusedElement unchanged (browser handles natively)');
        assert.strictEqual(event.defaultPrevented, false,
            'Tab keydown is not preventDefaulted by toolbar');
    });

    QUnit.test('Shift+Tab does not invoke roving navigation', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        const focusBefore = toolbar.option('focusedElement');
        helpers.press('Tab', undefined, { shiftKey: true });

        assert.strictEqual(toolbar.option('focusedElement'), focusBefore,
            'Shift+Tab leaves focusedElement unchanged');
    });
});

QUnit.module('allowKeyboardNavigation — runtime toggle', moduleConfig, function() {
    QUnit.test('toggling false then back to true updates the focus-state-enabled marker class', function(assert) {
        const toolbar = helpers.createToolbar(
            [buttonItem('A'), buttonItem('B')],
            { allowKeyboardNavigation: true },
        );
        assert.strictEqual(this.$element.hasClass(TOOLBAR_FOCUS_MODE_CLASS), true,
            'marker class present when allowKeyboardNavigation:true');

        toolbar.option('allowKeyboardNavigation', false);
        assert.strictEqual(this.$element.hasClass(TOOLBAR_FOCUS_MODE_CLASS), false,
            'marker class removed after toggling to false');

        toolbar.option('allowKeyboardNavigation', true);
        assert.strictEqual(this.$element.hasClass(TOOLBAR_FOCUS_MODE_CLASS), true,
            'marker class re-added after toggling back to true');
    });

    QUnit.test('toggling false detaches arrow navigation', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('allowKeyboardNavigation', false);

        const focusBefore = toolbar.option('focusedElement');
        helpers.press('ArrowRight');

        assert.strictEqual(toolbar.option('focusedElement'), focusBefore,
            'ArrowRight is ignored when allowKeyboardNavigation becomes false');
    });

    QUnit.test('toggling back to true re-enables arrow navigation', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        toolbar.option('allowKeyboardNavigation', false);
        toolbar.option('allowKeyboardNavigation', true);

        helpers.focusItemAt(toolbar, 0);
        helpers.press('ArrowRight');

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'navigation works again after re-enabling');
    });

    QUnit.test('toolbar item containers never get dx-state-focused regardless of allowKeyboardNavigation', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B')]);
        helpers.focusItemAt(toolbar, 0);

        assert.strictEqual(this.$element.find(`.${TOOLBAR_ITEM_CLASS}.${FOCUSED_STATE_CLASS}`).length, 0,
            'item container has no dx-state-focused while focused');
        assert.strictEqual(this.$element.filter(`.${FOCUSED_STATE_CLASS}`).length, 0,
            'toolbar root has no dx-state-focused while focused');

        toolbar.option('allowKeyboardNavigation', false);

        assert.strictEqual(this.$element.find(`.${TOOLBAR_ITEM_CLASS}.${FOCUSED_STATE_CLASS}`).length, 0,
            'item container still has no dx-state-focused after allowKeyboardNavigation becomes false');
    });
});

QUnit.module('Item collection updates — navigator stability', moduleConfig, function() {
    QUnit.test('replacing all items after focus does not throw', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('X'), buttonItem('Y')]);

        assert.ok(true, 'no error when items replaced after focus');
    });

    QUnit.test('extending items keeps a single tab stop', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('A'), buttonItem('B'), buttonItem('C'), buttonItem('D')]);

        helpers.assertOneTabStop(assert, this.$element,
            'one tab stop preserved after items extended');
    });

    QUnit.test('removing focused item leaves a single tab stop on a remaining item', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        toolbar.option('items', [buttonItem('A'), buttonItem('C')]);

        helpers.assertOneTabStop(assert, this.$element,
            'one tab stop after focused item removal');
    });

    QUnit.test('emptying items removes all tab stops without throwing', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 0);

        toolbar.option('items', []);

        const $stops = this.$element.find('[tabindex="0"]').not(`.${TEXTEDITOR_INPUT_CLASS}`);
        assert.strictEqual($stops.length, 0, 'no tab stops when items list is empty');
    });
});

QUnit.module('Escape semantics (consolidated)', moduleConfig, function() {
    QUnit.test('Escape on text-editor input closes editor and keeps focusedElement on item', function(assert) {
        const toolbar = helpers.createToolbar([
            buttonItem('A'),
            editorItem('dxTextBox', { value: 'hello', inputAttr: { 'aria-label': 't' } }),
            buttonItem('C'),
        ]);
        helpers.focusItemAt(toolbar, 1);
        helpers.press('Enter');

        const $items = helpers.getAvailableItems(toolbar);
        const $input = helpers.findInput($items.eq(1));
        helpers.press('Escape', $input.get(0));

        helpers.assertFocusedItemAt(assert, toolbar, 1,
            'focusedElement remains on the editor item after Escape');
        assert.notStrictEqual(getActiveElement(), $input.get(0),
            'input has lost DOM focus after Escape');
    });

    QUnit.test('Escape on a plain button item is a no-op (no error, focus unchanged)', function(assert) {
        const toolbar = helpers.createToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        helpers.focusItemAt(toolbar, 1);

        helpers.press('Escape');

        helpers.assertFocusedItemAt(assert, toolbar, 1, 'focus unchanged on plain item Escape');
    });
});

QUnit.module('allowKeyboardNavigation:false — fallback delegation to base', moduleConfig, function() {
    QUnit.test('_supportedKeys deletes arrow/home/end handlers at allowKeyboardNavigation:true (navigator owns)', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [buttonItem('A'), buttonItem('B')],
        }).dxToolbar('instance');

        const keys = toolbar._supportedKeys();
        assert.strictEqual(keys.leftArrow, undefined, 'leftArrow removed (handled by RovingTabIndexNavigator capture)');
        assert.strictEqual(keys.rightArrow, undefined, 'rightArrow removed');
        assert.strictEqual(keys.home, undefined, 'home removed');
        assert.strictEqual(keys.end, undefined, 'end removed');
    });

    QUnit.test('navigator is not created at allowKeyboardNavigation:false', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [buttonItem('A'), buttonItem('B')],
        }).dxToolbar('instance');

        assert.strictEqual(toolbar._navigator, undefined,
            'no RovingTabIndexNavigator instance when allowKeyboardNavigation:false');
    });

    QUnit.test('navigator IS created at allowKeyboardNavigation:true', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: true,
            items: [buttonItem('A'), buttonItem('B')],
        }).dxToolbar('instance');

        assert.strictEqual(!!toolbar._navigator, true, 'RovingTabIndexNavigator instance present at allowKeyboardNavigation:true');
    });

    QUnit.test('_moveFocus at allowKeyboardNavigation:false delegates to super and moves focusedElement', function(assert) {
        const toolbar = this.$element.dxToolbar({
            allowKeyboardNavigation: false,
            items: [buttonItem('A'), buttonItem('B'), buttonItem('C')],
        }).dxToolbar('instance');

        const $items = helpers.getAvailableItems(toolbar);
        toolbar.option('focusedElement', $items.eq(0).get(0));
        toolbar._moveFocus('right');

        assert.strictEqual($(toolbar.option('focusedElement')).get(0), $items.eq(1).get(0),
            'super._moveFocus moves focusedElement to next item at allowKeyboardNavigation:false');
    });
});

QUnit.module('Audit cleanup — utilities and delegation', moduleConfig, function() {
    QUnit.test('isItemDisabled util returns true when widgetDisabled flag is set', function(assert) {
        const toolbar = this.$element.dxToolbar({
            disabled: true,
            items: [buttonItem('A')],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 0,
            'all items filtered out when widget disabled (isItemDisabled returns true)');
    });

    QUnit.test('isItemDisabled util returns true for items with dx-state-disabled class', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [
                buttonItem('A'),
                { widget: 'dxButton', locateInMenu: 'never', disabled: true, options: { text: 'B' } },
                buttonItem('C'),
            ],
        }).dxToolbar('instance');

        const $available = helpers.getAvailableItems(toolbar);
        assert.strictEqual($available.length, 2,
            'disabled item excluded from available items (isItemDisabled detects dx-state-disabled)');
    });
});

QUnit.module('Space key — text input guard', moduleConfig, function() {
    const spaceOnInput = ($input) => {
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        $input.get(0).dispatchEvent(event);
        return event;
    };

    QUnit.test('Space on TextBox input (toolbar body) is NOT prevented', function(assert) {
        this.$element.dxToolbar({
            items: [{ widget: 'dxTextBox', locateInMenu: 'never', options: { value: 'hello' } }],
        });

        const $input = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`).first();
        $input.get(0).focus();

        const event = spaceOnInput($input);

        assert.strictEqual(event.defaultPrevented, false,
            'Space is not prevented - browser can insert the character');
    });

    QUnit.test('Space on SelectBox input (toolbar body) is NOT prevented', function(assert) {
        this.$element.dxToolbar({
            items: [{ widget: 'dxSelectBox', locateInMenu: 'never', options: { items: ['Light', 'Dark'], value: 'Light' } }],
        });

        const $input = this.$element.find(`.${SELECTBOX_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first();
        $input.get(0).focus();

        const event = spaceOnInput($input);

        assert.strictEqual(event.defaultPrevented, false,
            'Space is not prevented in SelectBox input');
    });

    QUnit.test('Space on TextBox input inside menu is NOT prevented', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [{ widget: 'dxTextBox', locateInMenu: 'always', options: { value: 'hello' } }],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const $popup = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
        const $input = $popup.find(`.${TEXTEDITOR_INPUT_CLASS}`).first();
        $input.get(0).focus();

        const event = spaceOnInput($input);

        assert.strictEqual(event.defaultPrevented, false,
            'Space is not prevented in TextBox input inside menu');
    });

    QUnit.test('Space on SelectBox input inside menu is NOT prevented', function(assert) {
        const toolbar = this.$element.dxToolbar({
            items: [{ widget: 'dxSelectBox', locateInMenu: 'always', options: { items: ['Light', 'Dark'], value: 'Light' } }],
        }).dxToolbar('instance');

        const menu = helpers.getOverflowMenu(toolbar);
        menu.option('opened', true);

        const $popup = $(`.${DROP_DOWN_MENU_POPUP_WRAPPER_CLASS}`);
        const $input = $popup.find(`.${SELECTBOX_CLASS} .${TEXTEDITOR_INPUT_CLASS}`).first();
        $input.get(0).focus();

        const event = spaceOnInput($input);

        assert.strictEqual(event.defaultPrevented, false,
            'Space is not prevented in SelectBox input inside menu');
    });

    QUnit.test('Space on dxButton still fires click (Space guard does not regress buttons)', function(assert) {
        let clicked = false;
        this.$element.dxToolbar({
            items: [{ widget: 'dxButton', locateInMenu: 'never', options: { text: 'A', onClick: () => { clicked = true; } } }],
        });

        const $button = this.$element.find(`.${BUTTON_CLASS}`).first();
        $button.get(0).focus();
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
        $button.get(0).dispatchEvent(event);

        assert.strictEqual(clicked, true, 'Space on dxButton still fires click');
        assert.strictEqual(event.defaultPrevented, true, 'Space is still prevented on dxButton (prevents page scroll)');
    });
});

QUnit.module('non APG mode', moduleConfig, function() {

    const nonAPGToolbar = (items, extra = {}) =>
        helpers.createToolbar(items, { allowKeyboardNavigation: false, ...extra });

    QUnit.test('no tabindex=-1 — every item stays in the native tab order', function(assert) {
        nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        assert.strictEqual(this.$element.find('[tabindex="-1"]').length, 0,
            'no element has tabindex=-1 in legacy mode');
    });

    QUnit.test('each button item keeps its natural tabindex=0 — multiple tab stops', function(assert) {
        nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);

        const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
        const naturalCount = $buttons.toArray().filter(
            (el) => $(el).attr('tabindex') === '0' || $(el).attr('tabindex') === undefined
        ).length;

        assert.strictEqual(naturalCount, 3,
            'all 3 buttons have natural tabindex — roving is not applied');
    });

    QUnit.test('ArrowRight on a focused button does not move browser focus to the next item', function(assert) {
        const toolbar = nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        const $btn = helpers.findFocusTarget(helpers.focusItemAt(toolbar, 0));
        const elementBefore = getActiveElement();

        helpers.press('ArrowRight', $btn.get(0));

        assert.strictEqual(getActiveElement(), elementBefore,
            'browser focus stays on original button after ArrowRight in legacy mode');
    });

    QUnit.test('ArrowLeft on a focused button does not move browser focus to the previous item', function(assert) {
        const toolbar = nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        const $btn = helpers.findFocusTarget(helpers.focusItemAt(toolbar, 2));
        const elementBefore = getActiveElement();

        helpers.press('ArrowLeft', $btn.get(0));

        assert.strictEqual(getActiveElement(), elementBefore,
            'browser focus stays on original button after ArrowLeft in legacy mode');
    });

    QUnit.test('Home and End keys do not move browser focus from the focused button', function(assert) {
        const toolbar = nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        const $btn = helpers.findFocusTarget(helpers.focusItemAt(toolbar, 1));

        helpers.press('Home', $btn.get(0));
        assert.strictEqual(getActiveElement(), $btn.get(0), 'Home does not move browser focus');

        helpers.press('End', $btn.get(0));
        assert.strictEqual(getActiveElement(), $btn.get(0), 'End does not move browser focus');
    });

    QUnit.test('ArrowDown and ArrowUp do not move browser focus from the focused button', function(assert) {
        const toolbar = nonAPGToolbar([buttonItem('A'), buttonItem('B'), buttonItem('C')]);
        const $btn = helpers.findFocusTarget(helpers.focusItemAt(toolbar, 1));

        helpers.press('ArrowDown', $btn.get(0));
        assert.strictEqual(getActiveElement(), $btn.get(0), 'ArrowDown does not move browser focus');

        helpers.press('ArrowUp', $btn.get(0));
        assert.strictEqual(getActiveElement(), $btn.get(0), 'ArrowUp does not move browser focus');
    });

    const setupLegacyTabsToolbar = () => helpers.createToolbarWithEditorBetweenButtons(
        'dxTabs',
        {
            items: [{ text: 'Home' }, { text: 'Insert' }, { text: 'Layout' }],
            selectedIndex: 0,
            width: 'auto',
        },
        { allowKeyboardNavigation: false },
    );

    const focusTabs = (toolbar) => {
        const $tabs = toolbar._getAvailableItems().eq(1).find(`.${TABS_CLASS}`);
        $tabs.get(0).focus();
        return $tabs;
    };

    QUnit.test('ArrowRight on focused dxTabs advances selectedIndex', function(assert) {
        const toolbar = setupLegacyTabsToolbar();
        const $tabs = focusTabs(toolbar);

        helpers.press('ArrowRight', $tabs.get(0));

        assert.strictEqual($tabs.dxTabs('option', 'selectedIndex'), 1,
            'ArrowRight is forwarded to dxTabs and advances selectedIndex in legacy mode');
    });

    QUnit.test('ArrowLeft on focused dxTabs decreases selectedIndex', function(assert) {
        const toolbar = setupLegacyTabsToolbar();
        const $tabs = focusTabs(toolbar);
        $tabs.dxTabs('option', 'selectedIndex', 2);

        helpers.press('ArrowLeft', $tabs.get(0));

        assert.strictEqual($tabs.dxTabs('option', 'selectedIndex'), 1,
            'ArrowLeft is forwarded to dxTabs and decreases selectedIndex in legacy mode');
    });

    QUnit.test('ArrowRight on focused dxTabs does not move browser focus outside of dxTabs', function(assert) {
        const toolbar = setupLegacyTabsToolbar();
        const $tabs = focusTabs(toolbar);

        helpers.press('ArrowRight', $tabs.get(0));

        assert.strictEqual(
            $tabs.get(0) === getActiveElement() || $tabs.get(0).contains(getActiveElement()),
            true,
            'browser focus stays inside dxTabs after ArrowRight in legacy mode',
        );
    });
});

QUnit.module('APG toolbar inside drop-down popup — focus entry (unwrap to inner input)', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this, arguments);

        this.setup = ({ allowKeyboardNavigation, items }) => {
            const $toolbar = $('<div>');
            const toolbar = $toolbar.dxToolbar({ allowKeyboardNavigation, items }).dxToolbar('instance');

            const editor = this.$element.dxDropDownEditor({
                focusStateEnabled: true,
                opened: true,
                dropDownOptions: {
                    contentTemplate: () => $toolbar,
                },
            }).dxDropDownEditor('instance');

            const $container = $toolbar.find('.dx-texteditor').first();
            return {
                editor,
                toolbar,
                $field: this.$element.find('.dx-texteditor-input').first(),
                $container,
                $innerInput: $container.find('.dx-texteditor-input').first(),
            };
        };

        this.pressTabOnField = ($field, shiftKey = false) => {
            $field.focus().trigger($.Event('keydown', { key: 'Tab', shiftKey }));
        };
    },
    afterEach: function() {
        moduleConfig.afterEach.apply(this, arguments);
    },
}, () => {
    const TEXTBOX_ITEM = { widget: 'dxTextBox', locateInMenu: 'never', options: { value: 'hello' } };

    QUnit.test('precondition: APG toolbar puts the tab stop on the .dx-texteditor container, input is tabindex=-1', function(assert) {
        const { $container, $innerInput } = this.setup({
            allowKeyboardNavigation: true,
            items: [TEXTBOX_ITEM],
        });

        assert.strictEqual($container.attr('tabindex'), '0',
            'editor container is the roving tab stop (tabindex=0)');
        assert.strictEqual($innerInput.attr('tabindex'), '-1',
            'inner input is removed from the tab order (tabindex=-1)');
    });

    QUnit.test('first popup focusable is the container, but Tab focuses the inner input', function(assert) {
        const { editor, $field, $container, $innerInput } = this.setup({
            allowKeyboardNavigation: true,
            items: [TEXTBOX_ITEM],
        });

        assert.strictEqual(editor._getFirstPopupElement().get(0), $container.get(0),
            'popup reports the .dx-texteditor container as its focusable element');

        this.pressTabOnField($field);

        assert.strictEqual(getActiveElement(), $innerInput.get(0),
            'Tab unwraps the container and focuses the inner input');
    });

    QUnit.test('last popup focusable is the container, but Shift+Tab focuses the inner input', function(assert) {
        const { editor, $field, $container, $innerInput } = this.setup({
            allowKeyboardNavigation: true,
            items: [TEXTBOX_ITEM],
        });

        assert.strictEqual(editor._getFirstPopupElement().get(0), $container.get(0),
            'popup reports the .dx-texteditor container as its last focusable element');

        this.pressTabOnField($field, true);

        assert.strictEqual(getActiveElement(), $innerInput.get(0),
            'Shift+Tab unwraps the container and focuses the inner input');
    });

    QUnit.test('non-APG toolbar (allowKeyboardNavigation:false): tab stop stays on the input, Tab focuses it directly (fallback, no regression)', function(assert) {
        const { editor, $field, $container, $innerInput } = this.setup({
            allowKeyboardNavigation: false,
            items: [TEXTBOX_ITEM],
        });

        assert.notStrictEqual($container.attr('tabindex'), '0',
            'container is NOT a tab stop without keyboard navigation');
        assert.strictEqual(editor._getFirstPopupElement().get(0), $innerInput.get(0),
            'popup reports the input itself as its focusable element');

        this.pressTabOnField($field);

        assert.strictEqual(getActiveElement(), $innerInput.get(0),
            'Tab focuses the input directly via the fallback branch ($input is empty -> $focusTarget = $focusableElement)');
    });

    QUnit.test('Tab with a non-editor roving item (dxButton) focuses the element itself (no unwrap)', function(assert) {
        const { editor, $field } = this.setup({
            allowKeyboardNavigation: true,
            items: [buttonItem('Action')],
        });

        const $button = editor._getFirstPopupElement();
        assert.strictEqual($button.hasClass(BUTTON_CLASS), true, 'popup focusable is the button (roving tab stop)');
        assert.strictEqual($button.hasClass(TEXTEDITOR_CLASS), false, 'button is not a text editor');

        this.pressTabOnField($field);

        assert.strictEqual(getActiveElement(), $button.get(0),
            'Tab focuses the button itself — unwrap branch is skipped for non-editor items');
    });
});
