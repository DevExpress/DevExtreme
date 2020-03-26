import $ from 'jquery';

import 'ui/form/ui.form';

import 'common.css!';
import 'generic_light.css!';

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
