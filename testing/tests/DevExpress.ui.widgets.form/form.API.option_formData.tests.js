import $ from 'jquery';

import 'ui/form/ui.form';
import 'ui/text_area';
import 'ui/tag_box';
import 'ui/slider';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

const checkEditor = (form, dataField, expectedValue) => {
    const editor = form.getEditor(dataField);
    const $editor = editor.$element();
    const $input = $editor.find('.dx-texteditor-input');
    QUnit.assert.equal(editor.option('value'), expectedValue, `value option of editor for the ${dataField}`);
    QUnit.assert.strictEqual($input.val(), expectedValue === null ? '' : expectedValue, `input value of editor for the ${dataField}`);
};

QUnit.module('Public API: option(formData, new value)');

QUnit.test('Set { formData: null }, call option(formData, null)', function(assert) {
    const form = $('#form').dxForm({ formData: null }).dxForm('instance');
    form.option('formData', null);
    assert.propEqual(form.option('formData'), {});
});

QUnit.test('Set { formData: null }, call option(formData, {})', function(assert) {
    const form = $('#form').dxForm({ formData: null }).dxForm('instance');
    const formData = {};
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
});

QUnit.test('Set { formData: null, items: [dataField1] }, call option(formData, {})', function(assert) {
    const form = $('#form').dxForm({ formData: null, items: ['dataField1'] }).dxForm('instance');
    const formData = {};
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: null, items: [dataField1] }, call option(formData, null)', function(assert) {
    const form = $('#form').dxForm({ formData: null, items: ['dataField1'] }).dxForm('instance');
    form.option('formData', null);
    assert.propEqual(form.option('formData'), {});
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {}, items: [dataField1] }, call option(formData, null)', function(assert) {
    const form = $('#form').dxForm({ formData: {}, items: ['dataField1'] }).dxForm('instance');
    form.option('formData', null);
    assert.propEqual(form.option('formData'), {});
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {}, items: [dataField1] }, call option(formData, {})', function(assert) {
    const form = $('#form').dxForm({ formData: {}, items: ['dataField1'] }).dxForm('instance');
    form.option('formData', {});
    assert.propEqual(form.option('formData'), {});
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, null)', function(assert) {
    const form = $('#form').dxForm({ formData: { dataField1: 'a' }, items: ['dataField1'] }).dxForm('instance');
    form.option('formData', null);
    assert.propEqual(form.option('formData'), { dataField1: '' });
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {})', function(assert) {
    const form = $('#form').dxForm({ formData: { dataField1: 'a' }, items: ['dataField1'] }).dxForm('instance');
    const formData = {};
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: undefined})', function(assert) {
    const form = $('#form').dxForm({ formData: { dataField1: 'a' }, items: ['dataField1'] }).dxForm('instance');
    const formData = { dataField1: undefined };
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: null})', function(assert) {
    const form = $('#form').dxForm({ formData: { dataField1: 'a' }, items: ['dataField1'] }).dxForm('instance');
    const formData = { dataField1: null };
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
    checkEditor(form, 'dataField1', null);
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, call option(formData, {dataField1: b})', function(assert) {
    const form = $('#form').dxForm({ formData: { dataField1: 'a' }, items: ['dataField1'] }).dxForm('instance');
    const formData = { dataField1: 'b' };
    form.option('formData', formData);
    assert.equal(form.option('formData'), formData);
    checkEditor(form, 'dataField1', 'b');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, null)', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', null);
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', {});
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1:undefined})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', { dataField1: undefined });
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1:null})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', { dataField1: null });
    checkEditor(form, 'dataField1', null);
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField1: b})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', { dataField1: 'b' });
    checkEditor(form, 'dataField1', 'b');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dataField1] }, change editor value, call option(formData, {dataField2:a})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: ['dataField1']
    }).dxForm('instance');

    form.getEditor('dataField1').option('value', 'val1');

    form.option('formData', { dataField2: 'a' });
    checkEditor(form, 'dataField1', '');
});

QUnit.test('Set { formData: {dataField1: a}, items: [dxTextArea] }, change editor value, call option(formData, {dataField1: b})', function() {
    const form = $('#form').dxForm({
        formData: { dataField1: 'a' },
        items: [{ name: 'custom1', editorType: 'dxTextArea' }]
    }).dxForm('instance');

    form.getEditor('custom1').option('value', 'val1');

    form.option('formData', { dataField1: 'b' });
    checkEditor(form, 'custom1', 'val1');
});

QUnit.test('Set { formData: {dataField1: a, dataField2: b}, items: [dataField1, dataField2], call option(formData, {dataField3: c}', assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $('#form').dxForm({
        formData: {
            dataField1: 'a',
            dataField2: 'b',
        },
        items: ['dataField1', 'dataField2'],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm('instance');

    form.option('formData', { dataField3: 'c' });

    checkEditor(form, 'dataField1', '');
    checkEditor(form, 'dataField2', '');

    assert.propEqual(form.option('formData'), { dataField3: 'c' }, 'formData');

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 1, 'onFieldDataChanged event\'s calls count');
    assert.equal(calls[0].args[0].dataField, 'dataField3', 'dataField argument of the onFieldDataChanged event');
    assert.equal(calls[0].args[0].value, 'c', 'value argument of the onFieldDataChanged event');
});

QUnit.test('Set { formData: {dataField1: a, dataField2: b}, items: [dataField1, dataField2], call option(formData, {dataField2: c}', assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $('#form').dxForm({
        formData: {
            dataField1: 'a',
            dataField2: 'b',
        },
        items: ['dataField1', 'dataField2'],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm('instance');

    form.option('formData', { dataField2: 'c' });

    checkEditor(form, 'dataField1', '');
    checkEditor(form, 'dataField2', 'c');

    assert.propEqual(form.option('formData'), { dataField2: 'c' }, 'formData');

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 1, 'onFieldDataChanged event\'s calls count');
    assert.equal(calls[0].args[0].dataField, 'dataField2', 'dataField argument of the onFieldDataChanged event');
    assert.equal(calls[0].args[0].value, 'c', 'value argument of the onFieldDataChanged event');
});

QUnit.test('Set { formData: {dataField1: a, dataField2: b}, items: [dataField1, dataField2], call option(formData, {dataField3: c}, change editor value', assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $('#form').dxForm({
        formData: {
            dataField1: 'a',
            dataField2: 'b',
        },
        items: ['dataField1', 'dataField2'],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm('instance');

    form.option('formData', { dataField3: 'c' });
    form.getEditor('dataField2').option('value', 'd');

    checkEditor(form, 'dataField1', '');
    checkEditor(form, 'dataField2', 'd');
    assert.propEqual(form.option('formData'), { dataField2: 'd', dataField3: 'c' }, 'formData');

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 2, 'onFieldDataChanged event\'s calls count');
    assert.equal(calls[0].args[0].dataField, 'dataField3', 'first call - dataField argument of the onFieldDataChanged event');
    assert.equal(calls[0].args[0].value, 'c', 'first call - value argument of the onFieldDataChanged event');
    assert.equal(calls[1].args[0].dataField, 'dataField2', 'second call - dataField argument of the onFieldDataChanged event');
    assert.equal(calls[1].args[0].value, 'd', 'second call - value argument of the onFieldDataChanged event');
});

QUnit.test('Set { formData: {dataField3: c}, items: [dataField1, dataField2], call option(formData, {dataField1: a, dataField2: b})', assert => {
    const onFieldDataChangedStub = sinon.stub();
    const form = $('#form').dxForm({
        formData: {
            dataField3: 'c'
        },
        items: ['dataField1', 'dataField2'],
        onFieldDataChanged: onFieldDataChangedStub
    }).dxForm('instance');

    assert.propEqual(form.option('formData'), { dataField3: 'c' }, 'formData before changing via API');

    form.option('formData', {
        dataField1: 'a',
        dataField2: 'b'
    });

    checkEditor(form, 'dataField1', 'a');
    checkEditor(form, 'dataField2', 'b');
    assert.propEqual(form.option('formData'), { dataField1: 'a', dataField2: 'b' }, 'formData after changing via API');

    const calls = onFieldDataChangedStub.getCalls();
    assert.equal(onFieldDataChangedStub.callCount, 2, 'onFieldDataChanged event\'s calls count');
    assert.equal(calls[0].args[0].dataField, 'dataField1', 'first call - dataField argument of the onFieldDataChanged event');
    assert.equal(calls[0].args[0].value, 'a', 'first call - value argument of the onFieldDataChanged event');
    assert.equal(calls[1].args[0].dataField, 'dataField2', 'second call - dataField argument of the onFieldDataChanged event');
    assert.equal(calls[1].args[0].value, 'b', 'second call - value argument of the onFieldDataChanged event');
});

QUnit.test('Reset editor\'s value when set formData: {dataField1: a}', assert => {
    const formData = {
        dxTextBox: 'a',
        dxDateBox: new Date(),
        dxSelectBox: 'item2',
        dxTagBox: ['item2'],
        dxSlider: 35
    };
    const dataSource = ['item1', 'item2', 'item3'];
    const form = $('#form').dxForm({
        formData: formData,
        items: ['dxTextBox', 'dxDateBox', {
            dataField: 'dxSelectBox',
            editorType: 'dxSelectBox',
            editorOptions: {
                dataSource: dataSource
            }
        },
        {
            dataField: 'dxTagBox',
            editorType: 'dxTagBox',
            editorOptions: {
                dataSource: dataSource
            }
        },
        {
            dataField: 'dxSlider',
            editorType: 'dxSlider'
        }]
    }).dxForm('instance');

    form.option('formData', { dataField1: 'a' });

    Object.keys(formData).forEach(dataField => {
        const editor = form.getEditor(dataField);
        assert.deepEqual(editor.option('value'), editor._getDefaultOptions().value, `a default value of the ${dataField} editor`);
    });
});
