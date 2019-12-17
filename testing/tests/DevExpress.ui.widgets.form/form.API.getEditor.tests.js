import $ from 'jquery';
import { isDefined } from 'core/utils/type';

import 'ui/form/ui.form';
import 'ui/text_area';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    var markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Public API: GetEditor');

function CheckGetEditorResult(assert, prepareItemsCallback) {
    var formItems1 = [
        'test1',
        { dataField: 'test2' },
        { name: 'custom1', editorType: 'dxTextArea' }
    ];
    var formItems2 = [
        'test1_',
        { dataField: 'test2_' },
        { name: 'custom1_', editorType: 'dxTextArea' }
    ];

    var form = $('#form').dxForm({
        items: prepareItemsCallback(formItems1)
    }).dxForm('instance');

    assert.ok(!isDefined(form.getEditor('notexist')), 'notexist');

    assert.equal(form.getEditor('test1').option('name'), 'test1');
    assert.equal(form.getEditor('test2').option('name'), 'test2');
    assert.equal(form.getEditor('custom1').option('name'), '', 'custom1');

    form.option('items', prepareItemsCallback(formItems2));

    assert.ok(!isDefined(form.getEditor('test1')), 'test1');
    assert.ok(!isDefined(form.getEditor('test2')), 'test2');
    assert.ok(!isDefined(form.getEditor('custom1')), 'custom1');
    assert.equal(form.getEditor('test1_').option('name'), 'test1_');
    assert.equal(form.getEditor('test2_').option('name'), 'test2_');
    assert.equal(form.getEditor('custom1_').option('name'), '', 'custom1_');
}

QUnit.test('getEditor returns [item] editor', function(assert) {
    CheckGetEditorResult(assert, items => items);
});

QUnit.test('getEditor returns [group.item] editor', function(assert) {
    CheckGetEditorResult(assert, items => {
        return [{
            itemType: 'group',
            items
        }];
    });
});

QUnit.test('getEditor returns [tabbed.tab1.item] editor', function(assert) {
    CheckGetEditorResult(assert, items => {
        return [{
            itemType: 'tabbed',
            tabs: [{
                title: 'tab1',
                items
            }]
        }];
    });
});

QUnit.test('getEditor returns [tabbed.tab2.item] editor', function(assert) {
    var formItems1 = [{
        itemType: 'tabbed',
        tabs: [
            { title: 'tab1', items: [ 'tab1_item1' ] },
            {
                title: 'tab2',
                items: [
                    'tab2_item1',
                    { dataField: 'tab2_datafield1' },
                    { name: 'tab2_custom', editorType: 'dxTextBox' }
                ]
            },
        ]
    }];
    var formItems2 = [{
        itemType: 'tabbed',
        tabs: [
            { title: 'tab1', items: [ 'tab1_item1_' ] },
            {
                title: 'tab2',
                items: [
                    'tab2_item1_',
                    { dataField: 'tab2_datafield1_' },
                    { name: 'tab2_custom_', editorType: 'dxTextArea' }
                ]
            },
        ]
    }];

    var $form = $('#form');
    var form = $form.dxForm({ items: formItems1 }).dxForm('instance');

    assert.ok(!isDefined(form.getEditor('tab2_item1')));
    assert.ok(!isDefined(form.getEditor('tab2_datafield1')));
    assert.ok(!isDefined(form.getEditor('tab2_custom')));

    $form.find('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', 1);

    assert.equal(form.getEditor('tab2_item1').option('name'), 'tab2_item1');
    assert.equal(form.getEditor('tab2_datafield1').option('name'), 'tab2_datafield1');
    assert.equal(form.getEditor('tab2_custom').option('name'), '', 'tab2_custom');

    form.option('items', formItems2);

    assert.ok(!isDefined(form.getEditor('tab2_item1')));
    assert.ok(!isDefined(form.getEditor('tab2_datafield1')));
    assert.ok(!isDefined(form.getEditor('tab2_custom')));
    assert.ok(!isDefined(form.getEditor('tab2_item1_')));
    assert.ok(!isDefined(form.getEditor('tab2_datafield1_')));
    assert.ok(!isDefined(form.getEditor('tab2_custom_')));
});

QUnit.test('getEditor returns [tabbed.tab1.group.item] editor', function(assert) {
    CheckGetEditorResult(assert, items => {
        return [{
            itemType: 'tabbed',
            tabs: [{
                title: 'tab1',
                items: [{
                    itemType: 'group',
                    items
                }]
            }]
        }];
    });
});

QUnit.test('getEditor returns [group.tabbed.tab1.group.item] editor', function(assert) {
    CheckGetEditorResult(assert, items => {
        return [{
            itemType: 'group',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'tab1',
                    items: [{
                        itemType: 'group',
                        items
                    }]
                }]
            }]
        }];
    });
});

QUnit.test('getEditor returns [tabbed1.tab1_1.tabbed2.tab2_1.item] editor', function(assert) {
    CheckGetEditorResult(assert, items => {
        return [{
            itemType: 'tabbed',
            tabs: [{
                title: 'tab1_1',
                items: [{
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab2_1',
                        items
                    }]
                }]
            }]
        }];
    });
});

QUnit.test('Get editor instance', function(assert) {
    // arrange
    var $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { test1: 'abc', test2: 'xyz' },
        items: ['test1', { name: 'test3', editorType: 'dxNumberBox' }]
    });

    // act
    var form = $testContainer.dxForm('instance');

    // assert
    assert.ok(!isDefined(form.getEditor('test2')), 'We hasn\'t instance for \'test2\' field');
    assert.ok(isDefined(form.getEditor('test1')), 'We have instance for \'test1\' field');
    assert.ok(isDefined(form.getEditor('test3')), 'We have instance for \'test3\' field');

    assert.equal(form.getEditor('test1').NAME, 'dxTextBox', 'It\'s textbox');
    assert.equal(form.getEditor('test3').NAME, 'dxNumberBox', 'It\'s numberBox');
});

QUnit.test('Get editor instance with group config', function(assert) {
    // arrange
    var $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { test1: 'abc', test2: 'xyz' },
        items: [
            'test1',
            {
                itemType: 'group',
                items: [{ dataField: 'test2', editorType: 'dxTextArea' }, { name: 'test3', editorType: 'dxTextBox' }]
            }
        ]
    });

    // act
    var form = $testContainer.dxForm('instance');

    // assert
    assert.ok(isDefined(form.getEditor('test1')), 'We have instance for \'test1\' field');
    assert.ok(isDefined(form.getEditor('test2')), 'We have instance for \'test2\' field');
    assert.ok(isDefined(form.getEditor('test3')), 'We have instance for \'test3\' field');

    assert.equal(form.getEditor('test2').NAME, 'dxTextArea', 'It\'s textArea');
    assert.equal(form.getEditor('test3').NAME, 'dxTextBox', 'It\'s textBox');
});
