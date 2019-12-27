const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';

import $ from 'jquery';
import 'ui/radio_group/radio_button';

QUnit.testStart(() => {
    const markup = '<div id="radioButton"></div>';

    $('#qunit-fixture').html(markup);
});

const toSelector = cssClass => '.' + cssClass;

QUnit.module('button rendering', () => {
    QUnit.test('widget should be rendered', (assert) => {
        const $radioButton = $('#radioButton').dxRadioButton();

        assert.ok($radioButton.hasClass(RADIO_BUTTON_CLASS), 'widget class added');
    });

    QUnit.test('icon should be rendered', (assert) => {
        const $radioButton = $('#radioButton').dxRadioButton();
        const $icon = $radioButton.children(toSelector(RADIO_BUTTON_ICON_CLASS));

        assert.ok($icon.length, 'icon rendered');
    });
});

QUnit.module('value changing', () => {
    QUnit.test('widget should be selected if value is set to true', (assert) => {
        const $radioButton = $('#radioButton').dxRadioButton({
            value: true
        });

        assert.ok($radioButton.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'selected class added');
    });

    QUnit.test('widget should not be selected if value is set to false', (assert) => {
        const $radioButton = $('#radioButton').dxRadioButton({
            value: false
        });

        assert.ok(!$radioButton.hasClass(RADIO_BUTTON_CHECKED_CLASS), 'selected class removed');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria role', (assert) => {
        const $element = $('#radioButton').dxRadioButton();
        assert.equal($element.attr('role'), 'radio', 'aria role is correct');
    });

    QUnit.test('aria properties if value is set to true', (assert) => {
        const $element = $('#radioButton').dxRadioButton({ value: true });

        $element.dxRadioButton('instance');

        assert.equal($element.attr('aria-checked'), 'true', 'aria checked true is correct');
    });

    QUnit.test('aria properties if value is set to false', (assert) => {
        const $element = $('#radioButton').dxRadioButton({ value: false });

        $element.dxRadioButton('instance');

        assert.equal($element.attr('aria-checked'), 'false', 'aria checked false is correct');
    });
});
