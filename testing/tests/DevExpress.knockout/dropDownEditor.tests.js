const $ = require('jquery');
const ko = require('knockout');

require('integration/knockout');
require('ui/drop_down_editor/ui.drop_down_editor');

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownEditorWithFieldTemplate" data-bind="dxDropDownEditor: { fieldTemplate: \'field\', value: \'test\'}">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <span id="customField" data-bind="text: $data"></span>\
                <div data-bind="dxTextBox: {}"></div>\
            </div>\
        </div>\
        <div id="dropDownEditorWithButtonTemplate" data-bind="dxDropDownEditor: { dropDownButtonTemplate: \'buttonTpl\' }">\
            <div data-options="dxTemplate: { name: \'buttonTpl\' }">\
                <span data-bind="text: $parent.text"></span>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

moduleWithoutCsp('Templates');

QUnit.test('fieldTemplate', function(assert) {
    const vm = {};
    const $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($dropDownEditor.text()), 'test', 'template rendered');
});

QUnit.test('drop button template', function(assert) {
    const vm = {
        text: 'V'
    };
    const $dropDownEditor = $('#dropDownEditorWithButtonTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($.trim($('.dx-button-content').text()), 'V', 'template was rendered');
});

QUnit.test('fieldTemplate is rendered after changing value', function(assert) {
    const vm = {};
    const $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    $dropDownEditor.dxDropDownEditor('option', 'value', 'newtest');
    assert.equal($.trim($dropDownEditor.text()), 'newtest', 'template rendered');
});


moduleWithoutCsp('options');

QUnit.test('openOnFieldClick option with custom template', function(assert) {
    const $dropDownEditor = $('#dropDownEditorWithFieldTemplate');
    ko.applyBindings({}, $dropDownEditor.get(0));

    const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');
    dropDownEditor.option('openOnFieldClick', true);

    $dropDownEditor.find('#customField').trigger('dxclick');

    assert.ok($dropDownEditor.dxDropDownEditor('option', 'opened'), 'dropDownEditor is opened');
});
