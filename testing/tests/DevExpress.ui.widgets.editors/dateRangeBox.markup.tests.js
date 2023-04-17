import $ from 'jquery';
import config from 'core/config';

import 'ui/date_range_box';

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

const stylingModes = ['outlined', 'underlined', 'filled'];

const getStartDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getStartDateBox();

const getEndDateBoxInstance = dateRangeBoxInstance => dateRangeBoxInstance.getEndDateBox();

const getStartDateBoxElement = dateRangeBoxInstance => getStartDateBoxInstance(dateRangeBoxInstance).$element();

const getEndDateBoxElement = dateRangeBoxInstance => getEndDateBoxInstance(dateRangeBoxInstance).$element();

const getSeparatorElement = dateRangeBoxInstance => dateRangeBoxInstance._$separator;

const moduleConfig = {
    beforeEach: function() {
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
    }
};

QUnit.module('DateRangeBox markup', moduleConfig, () => {
    QUnit.test('DateRangeBox has expected class', function(assert) {
        assert.ok(this.$element.hasClass(DATERANGEBOX_CLASS));
    });

    stylingModes.forEach((stylingMode) => {
        QUnit.test(`DateRangeBox has "${stylingMode}" class if config().editorStylingMode is ${stylingMode}`, function(assert) {
            config({ editorStylingMode: stylingMode });
            this.reinit({});

            assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${stylingMode}`), true, `${stylingMode} class was added`);
            const restStylingModes = stylingModes.filter((mode) => mode !== stylingMode);
            restStylingModes.forEach(mode => {
                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
            });

            config({ editorStylingMode: null });
        });

        QUnit.test(`DateRangeBox has "${stylingMode}" class if styling mode is "${stylingMode}"`, function(assert) {
            this.reinit({ stylingMode });

            assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${stylingMode}`), true, `${stylingMode} class was added`);
            const restStylingModes = stylingModes.filter((mode) => mode !== stylingMode);
            restStylingModes.forEach(mode => {
                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
            });
        });

        stylingModes.forEach((newStylingMode) => {
            QUnit.test(`DateRangeBox has "${newStylingMode}" class if styling mode value is changed to "${newStylingMode}"`, function(assert) {
                this.instance.option('stylingMode', newStylingMode);

                assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${newStylingMode}`), true, `${stylingMode} class was changed to ${newStylingMode}`);

                const restStylingModes = stylingModes.filter((mode) => mode !== newStylingMode);
                restStylingModes.forEach(mode => {
                    assert.strictEqual(this.$element.hasClass(`${DATERANGEBOX_CLASS}-${mode}`), false, `${mode} class was not added`);
                });
            });
        });
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

