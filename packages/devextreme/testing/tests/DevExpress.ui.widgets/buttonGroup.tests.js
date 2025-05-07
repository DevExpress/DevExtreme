import { getWidth, getHeight, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import 'ui/button';
import 'ui/button_group';
import devices from '__internal/core/m_devices';
import eventsEngine from 'common/core/events/core/events_engine';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';

import 'generic_light.css!';

const BUTTON_CLASS = 'dx-button';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + '-item';
const BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_CLASS + '-item-has-width';
const ITEM_SELECTED_CLASS = 'dx-item-selected';
const STATE_SELECTED_CLASS = 'dx-state-selected';

const stylingModes = ['contained', 'outlined', 'text'];

QUnit.testStart(() => {
    const markup = `
        <div id="buttonGroup"></div>
        <div id="widget"></div>
    `;
    $('#qunit-fixture').html(markup);
});

QUnit.module('options', () => {
    QUnit.test('items=[item1.elementAttr = { attr1="test1", attr2="test2", attr3="test3" }]', function(assert) {
        const buttonGroup = $('#buttonGroup').dxButtonGroup({
            keyExpr: 'id',
            items: [
                { id: 1, text: 'button 1', elementAttr: { attr1: 'test1', attr2: 'test2', attr3: 'test3' } },
            ],
        });

        const $button = buttonGroup.find('.dx-button');
        assert.equal($button.attr('attr1'), 'test1');
        assert.equal($button.attr('attr2'), 'test2');
        assert.equal($button.attr('attr3'), 'test3');
    });

    QUnit.test('items=[item1.elementAttr.class="test1",item2.elementAttr.class="test2"]', function(assert) {
        const buttonGroup = $('#buttonGroup').dxButtonGroup({
            keyExpr: 'id',
            items: [
                { id: 1, text: 'button 1', elementAttr: { class: 'test1' } },
                { id: 2, text: 'button 2', elementAttr: { class: 'test2' } },
            ],
        });

        const $button = buttonGroup.find('.dx-button');
        assert.equal($button.eq(0).hasClass('test1'), true);
        assert.equal($button.eq(0).hasClass('test2'), false);
        assert.equal($button.eq(1).hasClass('test1'), false);
        assert.equal($button.eq(1).hasClass('test2'), true);

        // default classes are still exist
        assert.equal($button.eq(0).hasClass('dx-widget'), true);
        assert.equal($button.eq(1).hasClass('dx-widget'), true);
        assert.equal($button.eq(0).hasClass('dx-buttongroup-item'), true);
        assert.equal($button.eq(1).hasClass('dx-buttongroup-item'), true);
        assert.equal($button.eq(0).hasClass('dx-buttongroup-first-item'), true);
        assert.equal($button.eq(1).hasClass('dx-buttongroup-last-item'), true);
    });
});

QUnit.module('option changed', {
    createButtonGroup(options) {
        options = options || {
            items: [{ text: 'button 1' }, { text: 'button 2' }]
        };
        return $('#buttonGroup').dxButtonGroup(options).dxButtonGroup('instance');
    },
    beforeEach() {
        const init = (options) => {
            this.buttonGroup = this.createButtonGroup(options);
            this.$buttonGroup = this.buttonGroup.$element();
        };

        this.reinit = (options) => {
            this.buttonGroup.dispose();

            init(options);
        };

        init();
    }
}, () => {
    QUnit.test('change hover state for all buttons', function(assert) {
        this.buttonGroup.option('hoverStateEnabled', false);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('hoverStateEnabled'), false, 'first button');
        assert.equal(buttons[1].option('hoverStateEnabled'), false, 'second button');
    });

    QUnit.test('change focus state for all buttons', function(assert) {
        this.buttonGroup.option('focusStateEnabled', false);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('focusStateEnabled'), false, 'first button');
        assert.equal(buttons[1].option('focusStateEnabled'), false, 'second button');
    });

    QUnit.test('change active state for all buttons', function(assert) {
        this.buttonGroup.option('activeStateEnabled', true);
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('activeStateEnabled'), true, 'first button');
        assert.equal(buttons[1].option('activeStateEnabled'), true, 'second button');
    });

    QUnit.test('change items', function(assert) {
        this.buttonGroup.option('items', [{
            text: 'left'
        }, {
            text: 'right'
        }]);

        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));
        assert.equal(buttons[0].option('text'), 'left', 'text of first button');
        assert.equal(buttons[1].option('text'), 'right', 'text of second button');
    });

    QUnit.test('change the width option', function(assert) {
        this.buttonGroup.option('width', 500);

        const buttonsSelector = `.${BUTTON_CLASS}`;
        const buttons = $(buttonsSelector);

        assert.equal(getWidth(this.$buttonGroup), 500, 'button group width');
        assert.ok(buttons.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'first item when button group has width');
        assert.ok(buttons.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'second item when button group has width');
    });

    QUnit.test('buttonGroup height option', function(assert) {
        const $buttonGroup = this.createButtonGroup({
            height: 500
        }).$element();

        const buttons = $buttonGroup.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

        assert.equal(getHeight($buttonGroup), 500, 'button group height is right');
        assert.equal(getOuterHeight(buttons.eq(0)), 500, 'button group item height is right');

        this.buttonGroup.option('height', 700);
        assert.equal(getHeight($buttonGroup), 700, 'button group height is right');
        assert.equal(getOuterHeight(buttons.eq(0)), 700, 'button group item height is right');

        this.buttonGroup.option('height', '');
        assert.notEqual(getHeight($buttonGroup), 700, 'button group height changed to default');
    });

    QUnit.test('change the width option when item has template', function(assert) {
        const buttonGroup = this.createButtonGroup({
            items: [{ text: 'button 1' }, { text: 'button 2' }],
            buttonTemplate: () => '<div/>',
        });

        buttonGroup.option('width', 500);

        const $items = $(`.${BUTTON_GROUP_ITEM_CLASS}`);
        assert.equal(getWidth(buttonGroup.$element()), 500, 'button group width');
        assert.ok($items.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'first item when button group has width');
        assert.ok($items.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'second item when button group has width');
    });

    QUnit.test('template property of the item should be passed to the inner dxButton', function(assert) {
        const buttonGroup = this.createButtonGroup({
            items: [{
                text: 'button 1', template: () => {
                    return 'Template';
                }
            }]
        });
        const $buttonGroup = buttonGroup.$element();

        assert.strictEqual($buttonGroup.find(`.${BUTTON_CONTENT_CLASS}`).text(), 'Template', 'template has been applied');

        buttonGroup.option('items[0].template', function() {
            return 'New Template';
        });
        assert.strictEqual($buttonGroup.find(`.${BUTTON_CONTENT_CLASS}`).text(), 'New Template', 'template has been updated');
    });

    QUnit.test('buttonTemplate property should be passed to all inner dxButtons', function(assert) {
        const buttonGroup = this.createButtonGroup({
            items: [{ text: 'button 1' }],
            buttonTemplate: () => {
                return 'Template';
            }
        });
        const $buttonGroup = buttonGroup.$element();

        assert.strictEqual($buttonGroup.find(`.${BUTTON_CONTENT_CLASS}`).text(), 'Template', 'template has been applied');

        buttonGroup.option('buttonTemplate', function() {
            return 'New Template';
        });
        assert.strictEqual($buttonGroup.find(`.${BUTTON_CONTENT_CLASS}`).text(), 'New Template', 'template has been updated');
    });

    QUnit.test('custom item property should be passed to buttonTemplate function', function(assert) {
        const templateMock = sinon.stub().returns('Template');
        const item1 = { text: 'button 1', icon: 'box', custom: 1 };
        const item2 = { text: 'button 2', icon: 'box', custom: 2 };
        this.createButtonGroup({
            items: [item1, item2],
            buttonTemplate: templateMock
        });

        assert.strictEqual(templateMock.callCount, 2, 'template method was called 2 times');
        assert.deepEqual(templateMock.getCall(0).args[0], item1, 'full item should be passed to the template');
        assert.deepEqual(templateMock.getCall(1).args[0], item2, 'full item should be passed to the template');
    });

    QUnit.test('custom item property should not be passed to default buttonTemplate', function(assert) {
        const item1 = { text: 'button 1', icon: 'box', custom: 1 };
        const item2 = { text: 'button 2', icon: 'box', custom: 2 };
        this.createButtonGroup({
            items: [item1, item2]
        });

        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.deepEqual(buttons[0].option('_templateData'), {}, 'full item should be passed to the template');
        assert.deepEqual(buttons[1].option('_templateData'), {}, 'full item should be passed to the template');
    });

    QUnit.test('item.template should have higher priority than the buttonTemplate option', function(assert) {
        const buttonGroup = this.createButtonGroup({
            items: [{
                text: 'button 1', template: () => {
                    return 'item.template';
                }
            }],
            buttonTemplate: () => {
                return 'buttonTemplate';
            }
        });
        const $buttonGroup = buttonGroup.$element();

        assert.strictEqual($buttonGroup.find(`.${BUTTON_CONTENT_CLASS}`).text(), 'item.template', 'template is correct');
    });

    QUnit.test('button has aria-pressed=false attribute if not selected', function(assert) {
        $('#widget').dxButtonGroup({ items: [{ id: '1' }] });
        const $button = $(`.${BUTTON_CLASS}`).eq(0);

        assert.strictEqual($button.attr('aria-pressed'), 'false');
    });

    QUnit.test('button has aria-pressed=true attribute if selected', function(assert) {
        $('#widget').dxButtonGroup({ items: [{ id: '1' }] });
        const $button = $(`.${BUTTON_CLASS}`).eq(0);

        eventsEngine.trigger($button, 'dxclick');

        assert.strictEqual($button.attr('aria-pressed'), 'true');
    });

    QUnit.test('button has aria-pressed=false attribute if unselected', function(assert) {
        $('#widget').dxButtonGroup({ items: [{ id: '1' }, { id: '2' }] });
        const $firstButton = $(`.${BUTTON_CLASS}`).eq(0);
        const $secondButton = $(`.${BUTTON_CLASS}`).eq(1);

        eventsEngine.trigger($firstButton, 'dxclick');
        eventsEngine.trigger($secondButton, 'dxclick');

        assert.strictEqual($firstButton.attr('aria-pressed'), 'false');
        assert.strictEqual($secondButton.attr('aria-pressed'), 'true');
    });

    QUnit.test('it should be possible to set full set of options for each button', function(assert) {
        const $element = $('#widget').dxButtonGroup({
            items: [{ text: 'button 1', width: 24, elementAttr: { class: 'test' }, customOption: 'Test option' }]
        });
        const buttonsSelector = `.${BUTTON_CLASS}`;
        const button = $element.find(buttonsSelector).eq(0).dxButton('instance');

        assert.strictEqual(button.option('width'), 24, 'width is correct');
        assert.ok(button.$element().hasClass('test'), 'elementAttr is correct');
        assert.strictEqual(button.option('customOption'), 'Test option', 'all options should be passed to the button');
    });

    QUnit.test('default options should not be redefined', function(assert) {
        const $element = $('#widget').dxButtonGroup({
            items: [{ text: 'Test', focusStateEnabled: true }]
        });
        const buttonsSelector = `.${BUTTON_CLASS}`;
        const button = $element.find(buttonsSelector).eq(0).dxButton('instance');

        assert.strictEqual(button.option('focusStateEnabled'), false, 'focusStateEnabled has not been redefined');
    });

    QUnit.test('onClick can be redefined', function(assert) {
        const handler = sinon.spy();
        const $element = $('#widget').dxButtonGroup({
            items: [{ text: 'Test', onClick: handler }]
        });
        const buttonsSelector = `.${BUTTON_CLASS}`;
        const button = $element.find(buttonsSelector).eq(0);

        eventsEngine.trigger(button, 'dxclick');
        assert.strictEqual(handler.callCount, 1, 'handler has been called');
    });

    QUnit.test('selected class should not be added after hovering (T1222079)', function(assert) {
        const buttonGroup = $('#widget').dxButtonGroup({
            items: [
                { text: 'Button_1' },
                { text: 'Button_2' },
            ],
            selectedItemKeys: ['Button_1'],
            disabled: true,
        }).dxButtonGroup('instance');

        buttonGroup.option('disabled', false);
        const $buttons = buttonGroup.$element().find(`.${BUTTON_CLASS}`);

        assert.strictEqual($buttons.eq(0).hasClass(ITEM_SELECTED_CLASS), true, `first item has ${ITEM_SELECTED_CLASS} class`);
        assert.strictEqual($buttons.eq(1).hasClass(ITEM_SELECTED_CLASS), false, `second item does not have the ${ITEM_SELECTED_CLASS} class`);

        eventsEngine.trigger($buttons.eq(1), 'dxclick');

        assert.strictEqual($buttons.eq(0).hasClass(ITEM_SELECTED_CLASS), false, `first item does not have the ${ITEM_SELECTED_CLASS} class`);
        assert.strictEqual($buttons.eq(1).hasClass(ITEM_SELECTED_CLASS), true, `second item has ${ITEM_SELECTED_CLASS} class`);

        eventsEngine.trigger($buttons.eq(0), 'dxhoverstart');

        assert.strictEqual($buttons.eq(0).hasClass(ITEM_SELECTED_CLASS), false, `first item does not have the ${ITEM_SELECTED_CLASS} class`);
        assert.strictEqual($buttons.eq(0).hasClass(STATE_SELECTED_CLASS), false, `first item does not have the ${STATE_SELECTED_CLASS} class`);
        assert.strictEqual($buttons.eq(1).hasClass(ITEM_SELECTED_CLASS), true, `second item has ${ITEM_SELECTED_CLASS} class`);
    });

    QUnit.test('change the stylingMode option', function(assert) {
        this.buttonGroup.option('stylingMode', 'text');

        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('stylingMode'), 'text', 'first button');
        assert.equal(buttons[1].option('stylingMode'), 'text', 'second button');
    });

    stylingModes.forEach((stylingMode) => {
        const restStylingModes = stylingModes.filter((mode) => mode !== stylingMode);

        QUnit.test(`ButtonGroup has "${stylingMode}" class if styling mode is "${stylingMode}"`, function(assert) {
            this.reinit({ stylingMode });

            assert.strictEqual(this.$buttonGroup.hasClass(`${BUTTON_GROUP_CLASS}-mode-${stylingMode}`), true, `${stylingMode} class was added`);

            restStylingModes.forEach(mode => {
                assert.strictEqual(this.$buttonGroup.hasClass(`${BUTTON_GROUP_CLASS}-mode-${mode}`), false, `${mode} class was not added`);
            });
        });

        restStylingModes.forEach((newStylingMode) => {
            QUnit.test(`ButtonGroup has "${newStylingMode}" class if styling mode value is changed to "${newStylingMode}"`, function(assert) {
                this.buttonGroup.option('stylingMode', newStylingMode);

                assert.strictEqual(this.$buttonGroup.hasClass(`${BUTTON_GROUP_CLASS}-mode-${newStylingMode}`), true, `${stylingMode} class was changed to ${newStylingMode}`);

                const restStylingModes = stylingModes.filter((mode) => mode !== newStylingMode);

                restStylingModes.forEach(mode => {
                    assert.strictEqual(this.$buttonGroup.hasClass(`${BUTTON_GROUP_CLASS}-mode-${mode}`), false, `${mode} class was not added`);
                });
            });
        });
    });
});

QUnit.module('Events', () => {
    class ButtonGroupEventsTestHelper {
        constructor(eventName, isItemClickInInitialOption, isDisabled, isItemDisabled) {
            this.handler = sinon.spy();
            this.eventName = eventName;
            this.isItemClickInInitialOption = isItemClickInInitialOption;
            this.isDisabled = isDisabled;
            this.isItemDisabled = isItemDisabled;
            this.isKeyboardEvent = this.eventName === 'space' || this.eventName === 'enter';
        }

        createButtonGroup() {
            if(this.isItemClickInInitialOption) {
                this.buttonGroup = $('#widget').dxButtonGroup({
                    focusStateEnabled: true,
                    items: [{ text: 'item1', disabled: this.isItemDisabled, custom: 1 }],
                    disabled: this.isDisabled,
                    onItemClick: this.handler
                }).dxButtonGroup('instance');
            } else {
                this.buttonGroup = $('#widget').dxButtonGroup({
                    focusStateEnabled: true,
                    items: [{ text: 'item1', disabled: this.isItemDisabled, custom: 1 }],
                    disabled: this.isDisabled
                }).dxButtonGroup('instance');

                this.buttonGroup.option('onItemClick', this.handler);
            }
        }

        _getButtonGroupItem() {
            return this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`).eq(0);
        }

        performAction() {
            if(this.eventName === 'click') {
                eventsEngine.trigger(this._getButtonGroupItem(0), 'dxclick');
            } else if(this.eventName === 'touch') {
                pointerMock(this._getButtonGroupItem(0))
                    .start('touch')
                    .down()
                    .up();
            } else {
                if(!this.isDisabled) keyboardMock(this.buttonGroup.$element()).press(this.eventName);
            }
        }

        checkAsserts(assert) {
            if((this.isDisabled || this.isItemDisabled)) {
                assert.equal(this.handler.callCount, 0, 'handler.callCount');
            } else {
                assert.strictEqual(this.handler.callCount, 1, 'handler.callCount');

                const e = this.handler.getCall(0).args[0];
                assert.strictEqual(Object.keys(e).length, 6, 'Object.keys(e).length');
                assert.strictEqual(e.component, this.buttonGroup, 'e.component');
                assert.strictEqual(e.element, this.buttonGroup.element(), 'element is correct');
                assert.strictEqual(e.event.type, this.isKeyboardEvent ? 'keydown' : 'dxclick', 'e.event.type');
                assert.deepEqual(e.itemData, { text: 'item1', disabled: this.isItemDisabled, custom: 1 }, 'e.itemData');
                assert.strictEqual(e.itemIndex, 0, 'e.itemIndex');
                assert.strictEqual($(e.itemElement).get(0), this._getButtonGroupItem(0).get(0), '$(e.itemElement).get(0)');
            }
        }
    }

    [true, false].forEach((isDisabled) => {
        [true, false].forEach((isItemDisabled) => {
            [true, false].forEach((isItemClickInInitialOption) => {
                ['click', 'touch', 'space', 'enter'].forEach((eventName) => {
                    const config = ` ${eventName}, onItemClick is initial option=${isItemClickInInitialOption}, disabled: ${isDisabled} ${isItemDisabled ? `, item.disabled=${isItemDisabled}` : ''}`;

                    QUnit.test('Check onItemClick for' + config, function(assert) {
                        const helper = new ButtonGroupEventsTestHelper(eventName, isItemClickInInitialOption, isDisabled, isItemDisabled);
                        helper.createButtonGroup();
                        helper.performAction();
                        helper.checkAsserts(assert);
                    });
                });
            });
        });
    });
});

if(devices.current().deviceType === 'desktop') {
    registerKeyHandlerTestHelper.runTests({
        createWidget: ($element, options) => $element.dxButtonGroup(
            $.extend({
                items: [{ text: 'text' }]
            }, options)).dxButtonGroup('instance'),
        checkInitialize: true
    });
}
