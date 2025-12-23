import $ from 'jquery';
import device from 'core/devices';

import 'ui/form';
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';

const EDITOR_INPUT_CLASS = 'dx-texteditor-input';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Public API: registerKeyHandler');

QUnit.test('Set { items: null }, call registerKeyHandler', function(assert) {
    const form = $('#form').dxForm({ items: null }).dxForm('instance');
    const handler = function() { };

    form.registerKeyHandler('tab', handler);
    assert.ok(true, 'no exceptions');
});

QUnit.test('Set { items: [name] }, call registerKeyHandler', function(assert) {
    const form = $('#form').dxForm({ items: ['name'] }).dxForm('instance');
    const handler = function() { };

    form.registerKeyHandler('tab', handler);
    assert.ok(true, 'no exceptions');
});

QUnit.test('Set { items: [{dataField}] }, call registerKeyHandler', function(assert) {
    const form = $('#form').dxForm({ items: [{ dataField: 'name' }] }).dxForm('instance');
    const handler = function() { };

    form.registerKeyHandler('tab', handler);
    assert.ok(true, 'no exceptions');
});

if(device.current().deviceType === 'desktop') {
    const items = [
        { dataField: 'name', editorType: 'dxTextBox' },
        { dataField: 'age', editorType: 'dxNumberBox' }
    ];

    items.forEach((item) => {
        registerKeyHandlerTestHelper.runTests({
            createWidget: ($element) => $element.dxForm({ items: items }).dxForm('instance'),
            keyPressTargetElement: (widget) => widget.getEditor(item.dataField).$element().find(`.${EDITOR_INPUT_CLASS}`),
            checkInitialize: false,
            testNamePrefix: `Form -> ${item.editorType}:`
        });
    });
}
