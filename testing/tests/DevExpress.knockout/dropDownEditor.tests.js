var $ = require('jquery'),
    ko = require('knockout');

require('integration/knockout');
require('ui/drop_down_editor/ui.drop_down_editor');

QUnit.testStart(function() {
    var markup =
        '<div id="dropDownEditorWithFieldTemplate" data-bind="dxDropDownEditor: { fieldTemplate: \'field\', value: \'test\'}">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <span id="customField" data-bind="text: $data"></span>\
                <div data-bind="dxTextBox: {}"></div>\
            </div>\
        </div>\
        \
        <div id="dropDownEditorWithContentTemplate" data-bind="dxDropDownEditor: { contentTemplate: \'content\', value: value, opened: true }">\
            <div data-options="dxTemplate: { name: \'content\' }">\
                <span data-bind="text: $data.value"></span>\
            </div>\
        </div>\
        <div id="dropDownEditorWithButtonTemplate" data-bind="dxDropDownEditor: { dropDownButtonTemplate: \'buttonTpl\' }">\
            <div data-options="dxTemplate: { name: \'buttonTpl\' }">\
                <span data-bind="text: $parent.text"></span>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Templates');

QUnit.test('fieldTemplate', function(assert) {
    var vm = {};
    var $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($dropDownEditor.text()), 'test', 'template rendered');
});

QUnit.test('contentTemplate', function(assert) {
    var vm = {
        value: 'test'
    };

    var $dropDownEditor = $('#dropDownEditorWithContentTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($('.dx-popup-wrapper').text()), 'test', 'content rendered');
});

QUnit.test('drop button template', function(assert) {
    var vm = {
        text: 'V'
    };
    var $dropDownEditor = $('#dropDownEditorWithButtonTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($('.dx-button-content').text()), 'V', 'template was rendered');
});

QUnit.test('fieldTemplate is rendered after changing value', function(assert) {
    var vm = {};
    var $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    $dropDownEditor.dxDropDownEditor('option', 'value', 'newtest');
    assert.equal($.trim($dropDownEditor.text()), 'newtest', 'template rendered');
});


QUnit.module('options');

QUnit.test('openOnFieldClick option with custom template', function(assert) {
    var $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings({}, $dropDownEditor.get(0));

    var dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');
    dropDownEditor.option('openOnFieldClick', true);

    $dropDownEditor.find('#customField').trigger('dxclick');

    assert.ok($dropDownEditor.dxDropDownEditor('option', 'opened'), 'dropDownEditor is opened');
});
