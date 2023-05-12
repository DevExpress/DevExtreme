import $ from 'jquery';
import ko from 'knockout';

import 'integration/knockout';
import 'ui/drop_down_box';

QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownBoxWithContentTemplate" data-bind="dxDropDownBox: { contentTemplate: \'content\', value: value, opened: true }">\
            <div data-options="dxTemplate: { name: \'content\' }">\
                <span data-bind="text: $data.value"></span>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Templates');

QUnit.test('contentTemplate', function(assert) {
    const vm = {
        value: 'test'
    };

    const $dropDownEditor = $('#dropDownBoxWithContentTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($('.dx-popup-wrapper').text()), 'test', 'content rendered');
});
