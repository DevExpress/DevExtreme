import $ from 'jquery';
import DateRangeBox from 'ui/date_range_box';

QUnit.testStart(function() {
    const markup =
        '<div id="dateRangeBox"></div>';

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const ICON_CLASS = 'dx-icon';

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getStartDateBoxElement = dateRangeBoxInstance => getStartDateBoxInstance(dateRangeBoxInstance).$element();

const getEndDateBoxElement = dateRangeBoxInstance => getEndDateBoxInstance(dateRangeBoxInstance).$element();

const getSeparatorElement = dateRangeBoxInstance => dateRangeBoxInstance._$separator;

const moduleConfig = {
    beforeEach: function() {
        this.reinit = (options) => {
            this.instance = this.$element.dxDateRangeBox(options).dxDateRangeBox('instance');
        };

        this.$element = $('#dateRangeBox');
        this.reinit({
            value: ['2023/01/05', '2023/02/14']
        });
    }
};

QUnit.module('DateRangeBox markup', moduleConfig, () => {
    QUnit.test('DateRangeBox has expected class', function(assert) {
        assert.ok(this.$element.hasClass(DATERANGEBOX_CLASS));
    });

    QUnit.test('StartDateBox has expected class', function(assert) {
        const $startDateBox = getStartDateBoxElement(this.instance);

        assert.ok($startDateBox.hasClass(START_DATEBOX_CLASS));
    });

    QUnit.test('EndDateBox has expected class', function(assert) {
        const $endDateBox = getEndDateBoxElement(this.instance);

        assert.ok($endDateBox.hasClass(END_DATEBOX_CLASS));
    });

    QUnit.test('Separator has expected class', function(assert) {
        const $separator = getSeparatorElement(this.instance);

        assert.ok($separator.hasClass(DATERANGEBOX_SEPARATOR_CLASS));
    });

    QUnit.test('Separator has icon', function(assert) {
        const $separator = getSeparatorElement(this.instance);
        const $icon = $separator.find(`.${ICON_CLASS}`);

        assert.strictEqual($icon.length, 1);
    });
});

