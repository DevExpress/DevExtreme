import $ from 'jquery';
import ko from 'knockout';
import ValidationEngine from 'ui/validation_engine';

import 'ui/text_box';
import 'ui/validation_group';
import 'ui/validator';
import 'integration/knockout';

QUnit.testStart(function() {
    const markup =
        '<div id="testcaseSingleGroup" data-bind="dxValidationGroup: {}">\
            <div id="knockoutTextBox" data-bind="dxTextBox: {}, dxValidator: {}"></div>\
        </div>\
        <div id="testcaseMultipleGroups" >\
            <div data-bind="dxValidationGroup: {}">\
                <div data-bind="dxTextBox: {}, dxValidator: {}"></div>\
            </div>\
            <div data-bind="dxValidationGroup: {}">\
                <div data-bind="dxTextBox: {}, dxValidator: {}"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Integration');

QUnit.test('Knockout widgets can be created inside of dxValidationGroup', function(assert) {
    ko.applyBindings({}, document.getElementById('testcaseSingleGroup'));

    assert.ok($('#knockoutTextBox').dxTextBox('instance'), 'TextBox inside of validation should be created by Knockout');
});


QUnit.test('Two dxValidationGroups should be registered and differentiated', function(assert) {

    ko.applyBindings({}, document.getElementById('testcaseMultipleGroups'));

    assert.equal(ValidationEngine.groups.length, 3, 'Two groups should be registered; one default group should always exist');
});
