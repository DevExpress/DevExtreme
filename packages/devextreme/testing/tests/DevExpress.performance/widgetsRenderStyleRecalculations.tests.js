require('../../helpers/qunitPerformanceExtension.js');
require('../../helpers/widgetsIterator.js');

require('generic_light.css!');

const $ = require('jquery');
require('ui/switch');
require('ui/check_box');
require('ui/slider');
require('ui/select_box');
require('ui/range_slider');
require('ui/color_box');
require('ui/number_box');
require('ui/text_box');
require('ui/text_area');
require('ui/autocomplete');
require('ui/calendar');
require('ui/date_box');
require('ui/drop_down_box');
require('ui/lookup');
require('ui/radio_group');
require('ui/tag_box');
require('ui/date_range_box');

QUnit.testStart(function() {
    $('#qunit-fixture').addClass('qunit-fixture-visible');
});

const LABEL_MODES = ['static', 'floating', 'outside'];
const components = [
    { name: 'dxAutocomplete' },
    { name: 'dxCalendar' },
    { name: 'dxCheckBox' },
    { name: 'dxColorBox' },
    { name: 'dxDateBox' },
    { name: 'dxDropDownBox' },
    { name: 'dxLookup' },
    { name: 'dxNumberBox' },
    { name: 'dxRadioGroup' },
    { name: 'dxRangeSlider' },
    { name: 'dxSelectBox' },
    { name: 'dxSlider' },
    { name: 'dxSwitch' },
    { name: 'dxTagBox' },
    { name: 'dxTextArea' },
    { name: 'dxTextBox' },
    { name: 'dxDateRangeBox' },
];

components.forEach((component) => {
    QUnit.performanceTest(`${component.name} relayouts on creation`, function(assert) {
        const measureFunction = function() {
            const $element = $('<div>');
            $element.appendTo('#qunit-fixture');

            $element[component.name]({});
        };

        assert.measureStyleRecalculation(measureFunction, 0);
    });

    LABEL_MODES.forEach((labelMode) => {
        QUnit.performanceTest(`${component.name} relayouts on creation with label when labelMode is ${labelMode}`, function(assert) {
            const measureFunction = function() {
                const $element = $('<div>');
                $element.appendTo('#qunit-fixture');

                $element[component.name]({
                    labelMode,
                    label: 'Label',
                });
            };

            assert.measureStyleRecalculation(measureFunction, 1);
        });
    });
});
