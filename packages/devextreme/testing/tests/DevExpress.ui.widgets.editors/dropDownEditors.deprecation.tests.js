import 'ui/select_box';
import 'ui/tag_box';
import 'ui/color_box';
import 'ui/drop_down_box';
import errors from 'core/errors';

const LICENSE_WARNING = 'W0022';

const FIELD_TEMPLATE_WARNING_ARGS = (componentName) => [
    'W0001',
    componentName,
    'fieldTemplate',
    '25.2',
    'Use the \'fieldAddons\' option instead',
];

const FIELD_TEMPLATE_COMPONENTS = [
    { name: 'dxSelectBox', selector: '#selectBox' },
    { name: 'dxTagBox', selector: '#tagBox' },
    { name: 'dxColorBox', selector: '#colorBox' },
    { name: 'dxDropDownBox', selector: '#dropDownBox' },
];

QUnit.testStart(() => {
    const markup =
        '<div id="selectBox"></div>\
         <div id="tagBox"></div>\
         <div id="colorBox"></div>\
         <div id="dropDownBox"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Deprecated fieldTemplate', {
    beforeEach() {
        this.errorsSpy = sinon.spy(errors, 'log');

        this.getFilteredWarnings = () =>
            this.errorsSpy.getCalls().filter(({ args }) => args[0] !== LICENSE_WARNING);

        this.assertWarningIsCorrect = (assert, name) => {
            const warnings = this.getFilteredWarnings();

            assert.strictEqual(warnings.length, 1, 'only one warning logged');
            assert.deepEqual(
                warnings[0].args,
                FIELD_TEMPLATE_WARNING_ARGS(name),
                'warning is raised with correct parameters'
            );
        };
    },
    afterEach() {
        errors.log.restore();
    },
}, () => {
    const fieldTemplate = () => $('<div>').dxTextBox();

    FIELD_TEMPLATE_COMPONENTS.forEach(({ name, selector }) => {
        QUnit.test(
            `${name}: fieldTemplate should raise a deprecation warning on initialization`,
            function(assert) {
                $(selector)[name]({ fieldTemplate })[name]('instance');
                this.assertWarningIsCorrect(assert, name);
            }
        );

        QUnit.test(
            `${name}: fieldTemplate should raise a deprecation warning on option set`,
            function(assert) {
                const instance = $(selector)[name]()[name]('instance');

                instance.option({ fieldTemplate });

                this.assertWarningIsCorrect(assert, name);
            }
        );

        QUnit.test(`${name}: does not log extra warning on value change call`, function(assert) {
            const instance = $(selector)[name]({ fieldTemplate })[name]('instance');

            instance.option('value', '');

            this.assertWarningIsCorrect(assert, name);
        });
    });
});
