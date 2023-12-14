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

const LABEL_MODES = ['hidden', 'static', 'floating', 'outside'];
const components = [
    { name: 'dxAutocomplete', expectedRecalculations: 2 },
    { name: 'dxCalendar', expectedRecalculations: 1 },
    { name: 'dxCheckBox', expectedRecalculations: 1 },
    { name: 'dxColorBox', expectedRecalculations: 2 },
    { name: 'dxDateBox', expectedRecalculations: 4 },
    { name: 'dxDropDownBox', expectedRecalculations: 2 },
    { name: 'dxLookup', expectedRecalculations: 2 },
    { name: 'dxNumberBox', expectedRecalculations: 1 },
    { name: 'dxRadioGroup', expectedRecalculations: 1 },
    { name: 'dxRangeSlider', expectedRecalculations: 7 },
    { name: 'dxSelectBox', expectedRecalculations: 2 },
    { name: 'dxSlider', expectedRecalculations: 3 },
    { name: 'dxSwitch', expectedRecalculations: 1 },
    { name: 'dxTagBox', expectedRecalculations: 2 },
    { name: 'dxTextArea', expectedRecalculations: 1 },
    { name: 'dxTextBox', expectedRecalculations: 1 },
    { name: 'dxDateRangeBox', expectedRecalculations: 1 },
];

components.forEach((component) => {
    QUnit.performanceTest(`${component.name} relayouts on creation`, function(assert) {
        const measureFunction = function() {
            const $element = $('<div>');
            $element.appendTo('#qunit-fixture');

            $element[component.name]({});
        };

        assert.measureStyleRecalculation(measureFunction, component.expectedRecalculations);
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

            assert.measureStyleRecalculation(measureFunction, component.expectedRecalculations);
        });
    });
});
