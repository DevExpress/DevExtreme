import $ from 'jquery';
import fx from 'animation/fx';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        const init = (options) => {
            this.$element = $('#dateRangeBox').dxDateRangeBox(options);
            this.instance = this.$element.dxDateRangeBox('instance');
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({
            value: ['2023/01/05', '2023/02/14']
        });
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Strategy', moduleConfig, () => {
    [
        {
            optionName: 'selectionMode',
            optionValue: 'range'
        },
        {
            optionName: 'viewsCount',
            optionValue: 2
        },
    ].forEach(({ optionName, optionValue }) => {
        QUnit.test(`Calendar should have ${optionName} option equals ${optionValue}`, function(assert) {
            const startDateBox = getStartDateBoxInstance(this.instance);

            startDateBox.open();

            assert.strictEqual(startDateBox._strategy.widgetOption(optionName), optionValue);
        });
    });

    QUnit.test('Calendar should have "values" option equals to dateRangeBox "value"', function(assert) {
        const startDateBox = getStartDateBoxInstance(this.instance);

        startDateBox.open();

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), this.instance.option('value'));
    });
});

QUnit.module('Strategy with applyValueMode="instantly', moduleConfig, () => {
    QUnit.test('StartDate value should be passed to startDateBox after click by calendar cell, value: [null, null]', function(assert) {
        this.reinit({
            applyValueMode: 'instantly',
            value: [null, null],
        });

        this.instance.open();

        const startDateBox = getStartDateBoxInstance(this.instance);

        assert.deepEqual(startDateBox._strategy.widgetOption('values'), [null, null]);
    });
});
