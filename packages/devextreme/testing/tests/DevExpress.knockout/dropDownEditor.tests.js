import $ from 'jquery';
import ko from 'knockout';

import 'integration/knockout';
import 'ui/drop_down_editor/ui.drop_down_editor';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownEditorWithFieldAddons" data-bind="dxDropDownEditor: { fieldAddons: { beforeTemplate: \'field\' }, value: \'test\'}">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <span id="customField" data-bind="text: $data"></span>\
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

QUnit.test('fieldAddons.beforeTemplate', function(assert) {
    const vm = {};
    const $dropDownEditor = $('#dropDownEditorWithFieldAddons');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($dropDownEditor.find('#customField').text(), 'test', 'template rendered');
});

QUnit.test('drop button template', function(assert) {
    const vm = {
        text: 'V'
    };
    const $dropDownEditor = $('#dropDownEditorWithButtonTemplate');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    assert.equal($('.dx-button-content').text().trim(), 'V', 'template was rendered');
});

QUnit.test('fieldAddons.beforeTemplate is rendered after changing value', function(assert) {
    const vm = {};
    const $dropDownEditor = $('#dropDownEditorWithFieldAddons');
    ko.applyBindings(vm, $dropDownEditor.get(0));

    $dropDownEditor.dxDropDownEditor('option', 'value', 'newtest');
    assert.equal($dropDownEditor.find('#customField').text(), 'newtest', 'template rendered');
});


moduleWithoutCsp('options');

QUnit.test('openOnFieldClick option with custom template', function(assert) {
    const $dropDownEditor = $('#dropDownEditorWithFieldAddons');
    ko.applyBindings({}, $dropDownEditor.get(0));

    const dropDownEditor = $dropDownEditor.dxDropDownEditor('instance');
    dropDownEditor.option('openOnFieldClick', true);

    $dropDownEditor.find('#customField').trigger('dxclick');

    assert.ok($dropDownEditor.dxDropDownEditor('option', 'opened'), 'dropDownEditor is opened');
});
