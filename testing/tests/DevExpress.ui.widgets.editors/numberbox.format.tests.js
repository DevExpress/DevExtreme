import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';

import 'ui/number_box';
import 'ui/text_box/ui.text_editor';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture">\
            <div id="numberbox"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.$element = $('#numberbox').dxNumberBox({
            useMaskBehavior: true,
        });
        this.clock = sinon.useFakeTimers();
        this.$input = this.$element.find('.dx-texteditor-input');
        this.instance = this.$element.dxNumberBox('instance');
        this.keyboard = keyboardMock(this.$input, true);
    },

    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('percent', moduleConfig, () => {
    [
        { text: '0.04', value: 0.00035, format: '#0.00%' },
        { text: '0.0350', value: 0.00035, format: '#0.0000%' },
        { text: '0.14', value: 0.00135, format: '#0.00%' },
        { text: '0.4', value: 0.0035, format: '#0.0%' },
        { text: '0.35', value: 0.0035, format: '#0.00%' },
        { text: '1.4', value: 0.0135, format: '#0.0%' },
        { text: '0.005', value: 0.000049999, format: '#0.000%' },
        { text: '0.004', value: 0.0000444999, format: '#0.000%' },
        { text: '1.2962', value: 0.01296249, format: '#0.0000%' },
        { text: '1.2963', value: 0.0129625, format: '#0.0000%' },
        { text: '1.2962', value: 0.01296249999, format: '#0.0000%' },
        { text: '4.654', value: 0.046544999, format: '#0.000%' },
        { text: '-4.654', value: -0.046544999, format: '#0.000%' },
        { text: '4.65', value: 0.04645, format: '#0.00%' },
        { text: '-4.65', value: -0.04645, format: '#0.00%' },
        { text: '4.6', value: 0.04645, format: '#0.0%' },
        { text: '5', value: 0.04645, format: '#0%' },
        { text: '-35.86', value: -0.35855, format: '#0.00%' },
        { text: '1.2962', value: 0.01296249, format: '#0.0000%' },
        { text: '-1.2962', value: -0.01296249, format: '#0.0000%' },
        { text: '10.004', value: 0.100035, format: '#0.000%' },
        { text: '43.104', value: 0.431035, format: '#0.000%' },
        { text: '43.105', value: 0.431045, format: '#0.000%' },
        { text: '0.004', value: 0.000035, format: '#0.000%' },
        { text: '-0.004', value: -0.000035, format: '#0.000%' },
        { text: '0.0036', value: 0.000035521, format: '#0.0000%' },
        { text: '0.00356', value: 0.000035559, format: '#0.00000%' },
        { text: '0.0035', value: 0.000035499, format: '#0.0000%' },
    ].forEach(({ text, value, format }) => {
        QUnit.test(`percent format should correctly handle float values, value: ${value}, format: ${format} (T1093736)`, function(assert) {
            this.instance.option({
                format,
                value
            });

            assert.strictEqual(this.$input.val(), `${text}%`, 'text is correct');
            assert.strictEqual(this.instance.option('value'), value, 'value is correct');
        });
    });
});
