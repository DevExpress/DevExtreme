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

const components = [
    { name: 'dxAutocomplete', config: {}, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxAutocomplete', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },

    { name: 'dxCalendar', config: {}, expectedRecalculations: 1 },
    { name: 'dxCheckBox', config: {}, expectedRecalculations: 1 },

    { name: 'dxColorBox', config: {}, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxColorBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },

    { name: 'dxDateBox', config: {}, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { labelMode: 'hidden' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { labelMode: 'static' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { labelMode: 'floating' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { labelMode: 'outside' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 4 },
    { name: 'dxDateBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 4 },

    { name: 'dxDropDownBox', config: {}, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxDropDownBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },

    { name: 'dxLookup', config: {}, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxLookup', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },

    { name: 'dxNumberBox', config: {}, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxNumberBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },

    { name: 'dxRadioGroup', config: {}, expectedRecalculations: 1 },
    { name: 'dxSlider', config: {}, expectedRecalculations: 5 },
    { name: 'dxRangeSlider', config: {}, expectedRecalculations: 5 },
    { name: 'dxSwitch', config: {}, expectedRecalculations: 1 },

    { name: 'dxSelectBox', config: {}, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxSelectBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },

    { name: 'dxTagBox', config: {}, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },
    { name: 'dxTagBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 2 },

    { name: 'dxTextArea', config: {}, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxTextArea', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 1 },

    { name: 'dxTextBox', config: {}, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { mode: 'search' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { mode: 'search', label: 'Label', labelMode: 'hidden' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { mode: 'search', label: 'Label', labelMode: 'static' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { mode: 'search', label: 'Label', labelMode: 'floating' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { mode: 'search', label: 'Label', labelMode: 'outside' }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },
    { name: 'dxTextBox', config: { label: 'Label', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 1 },

    { name: 'dxDateRangeBox', config: {}, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: '', endDateLabel: '', labelMode: 'hidden' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: '', endDateLabel: '', labelMode: 'static' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: '', endDateLabel: '', labelMode: 'floating' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: '', endDateLabel: '', labelMode: 'outside' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'hidden' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'static' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'floating' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'outside' }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'hidden', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'static', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'floating', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 11 },
    { name: 'dxDateRangeBox', config: { startDateLabel: 'StartDate', endDateLabel: 'EndDate', labelMode: 'outside', buttons: [{ name: 'custom', location: 'before' }] }, expectedRecalculations: 11 },
];

components.forEach(({ name, config, expectedRecalculations }) => {
    QUnit.performanceTest(`${name} relayouts on creation, config: ${JSON.stringify(config)}`, function(assert) {
        const measureFunction = function() {
            const $element = $('<div>');
            $element.appendTo('#qunit-fixture');

            $element[name](config);
        };

        assert.measureStyleRecalculation(measureFunction, expectedRecalculations);
    });
});
