import $ from 'jquery';
import {
    FIELD_ITEM_CLASS,
    FLEX_LAYOUT_CLASS,
    FIELD_ITEM_LABEL_ALIGN_CLASS,
    FIELD_ITEM_LABEL_CLASS } from 'ui/form/constants';

import 'ui/form';
import 'ui/switch';
import 'ui/lookup';
import 'ui/text_area';
import 'ui/radio_group';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Layout manager');

QUnit.test('Layout strategy when flex is not supported', function(assert) {
    const items = [
        {
            dataField: 'test1',
            editorType: 'dxTextBox'
        },
        {
            dataField: 'test2',
            editorType: 'dxTextBox',
            helpText: 'help'
        },
        {
            dataField: 'test3',
            editorType: 'dxRadioGroup'
        },
        {
            dataField: 'test4',
            editorType: 'dxCalendar'
        },
        {
            dataField: 'test5',
            editorType: 'dxTextArea'
        }
    ];
    const $testContainer = $('#container').dxLayoutManager();
    const layoutManager = $testContainer.dxLayoutManager('instance');

    layoutManager._hasBrowserFlex = function() {
        return false;
    };
    layoutManager.option('items', items);

    assert.equal(layoutManager._responsiveBox.option('_layoutStrategy'), 'fallback');
    assert.equal($testContainer.find('.' + FIELD_ITEM_CLASS + '.' + FLEX_LAYOUT_CLASS).length, 0, 'flex layout class');
});

QUnit.test('Layout strategy when flex is supported', function(assert) {
    const items = [
        {
            dataField: 'test1',
            editorType: 'dxTextBox'
        },
        {
            dataField: 'test2',
            editorType: 'dxTextBox',
            helpText: 'help'
        },
        {
            dataField: 'test3',
            editorType: 'dxRadioGroup'
        },
        {
            dataField: 'test4',
            editorType: 'dxCalendar'
        },
        {
            dataField: 'test5',
            editorType: 'dxTextArea'
        }
    ];
    const $testContainer = $('#container').dxLayoutManager();
    const layoutManager = $testContainer.dxLayoutManager('instance');

    layoutManager._hasBrowserFlex = function() {
        return true;
    };
    layoutManager.option('items', items);

    assert.equal(layoutManager._responsiveBox.option('_layoutStrategy'), 'flex');
    assert.equal($testContainer.find('.' + FIELD_ITEM_CLASS + '.' + FLEX_LAYOUT_CLASS).length, 5, 'flex layout class');
});

QUnit.test('Check label alignment classes when browser is not supported flex', function(assert) {
    const items = [
        {
            dataField: 'test1',
            editorType: 'dxTextBox'
        },
        {
            dataField: 'test2',
            editorType: 'dxTextBox',
            helpText: 'help'
        },
        {
            dataField: 'test3',
            editorType: 'dxRadioGroup'
        },
        {
            dataField: 'test4',
            editorType: 'dxCalendar'
        },
        {
            dataField: 'test5',
            editorType: 'dxTextArea'
        }
    ];
    const $testContainer = $('#container').dxLayoutManager();
    const layoutManager = $testContainer.dxLayoutManager('instance');

    layoutManager._hasBrowserFlex = function() {
        return false;
    };
    layoutManager.option('items', items);
    const $items = $testContainer.find('.' + FIELD_ITEM_CLASS);

    assert.ok(!$items.eq(0).hasClass(FIELD_ITEM_LABEL_ALIGN_CLASS), 'item doesn\'t have baseline alignment class');
    assert.ok($items.eq(1).hasClass(FIELD_ITEM_LABEL_ALIGN_CLASS), 'item have baseline alignment class');
    assert.ok($items.eq(2).hasClass(FIELD_ITEM_LABEL_ALIGN_CLASS), 'item have baseline alignment class');
    assert.ok($items.eq(3).hasClass(FIELD_ITEM_LABEL_ALIGN_CLASS), 'item have baseline alignment class');
    assert.ok($items.eq(4).hasClass(FIELD_ITEM_LABEL_ALIGN_CLASS), 'item have baseline alignment class');
});

QUnit.test('Check clickable fielditem', function(assert) {
    const clock = sinon.useFakeTimers();
    const $testContainer = $('#container').dxLayoutManager({
        items: [
            {
                dataField: 'isRich',
                editorType: 'dxSwitch',
                editorOptions: { value: false }
            },
            {
                dataField: 'hasMansion',
                editorType: 'dxCheckBox',
                editorOptions: { value: false }
            }
        ]
    });
    const $fieldItemLabels = $testContainer.find('.' + FIELD_ITEM_LABEL_CLASS);
    const instance = $testContainer.dxLayoutManager('instance');

    assert.deepEqual(instance.option('layoutData'), { isRich: false, hasMansion: false }, 'Correct initial data');

    $($fieldItemLabels.eq(0)).trigger('dxclick');
    clock.tick();

    $($fieldItemLabels.eq(1)).trigger('dxclick');
    clock.tick(200);

    assert.deepEqual(instance.option('layoutData'), { isRich: true, hasMansion: true }, 'Correct data');
    clock.restore();
});

QUnit.test('Generate several various widgets in layout', function(assert) {
    const $testContainer = $('#container').dxLayoutManager({
        items: [
            {
                label: { text: 'label1' },
                dataField: 'name',
                editorType: 'dxTextBox'
            },
            {
                label: { text: 'label2' },
                dataField: 'name',
                editorType: 'dxNumberBox'
            },
            {
                label: { text: 'label3' },
                dataField: 'name',
                editorType: 'dxDateBox'
            }
        ]
    });
    const $fieldItems = $testContainer.find('.' + FIELD_ITEM_CLASS);
    const $dateBox = $fieldItems.eq(2).find('.dx-datebox');


    assert.ok($fieldItems.eq(0).find('.dx-textbox').length, 'First item is dxTextBox');
    assert.ok($fieldItems.eq(1).find('.dx-numberbox').length, 'Second item is dxNumberBox');
    assert.ok($dateBox.length, 'Third item is dxDateBox');
    assert.ok($dateBox.width() < $fieldItems.eq(2).width(), 'dxDateBox width');
});

QUnit.test('Editors with object value correctly work with values from data', function(assert) {
    const $testContainer = $('#container');
    const items = [
        { myText: 'test1', number: 1 },
        { myText: 'test2', number: 2 },
        { myText: 'test3', number: 3 }
    ];

    const layoutManager = $testContainer.dxLayoutManager({
        layoutData: { testItem: items[1] },
        items: [
            {
                dataField: 'testItem',
                editorType: 'dxLookup',
                editorOptions: {
                    items: items,
                    displayExpr: 'myText'
                }
            }
        ]
    }).dxLayoutManager('instance');

    const lookupCurrentItemText = layoutManager.$element().find('.dx-lookup-field').text();

    assert.equal(lookupCurrentItemText, 'test2', 'lookup has correct current item');
});

QUnit.test('Change a layoutData object', function(assert) {
    const $testContainer = $('#container');

    const layoutManager = $testContainer.dxLayoutManager({
        layoutData: {
            name: 'Patti',
            active: true,
            price: 1200,
            birthDate: new Date('10/10/2010')
        },
        customizeItem: function(item) {
            if(item.dataField === 'active') {
                item.editorType = 'dxSwitch';
            }
        }
    }).dxLayoutManager('instance');

    layoutManager.option('layoutData', {
        name: 'Vadim',
        active: null,
        price: 450,
        birthDate: new Date('1/1/2001')
    });

    const $editors = $testContainer.find('.dx-texteditor, .dx-switch');

    assert.equal($editors.eq(0).dxTextBox('instance').option('value'), 'Vadim');
    assert.equal($editors.eq(1).dxSwitch('instance').option('value'), false);
    assert.equal($editors.eq(2).dxNumberBox('instance').option('value'), 450);
    assert.deepEqual($editors.eq(3).dxDateBox('instance').option('value'), new Date('1/1/2001'));
});

function triggerKeyUp($element, key) {
    const e = $.Event('keyup');
    e.key = key;
    $($element.find('input').first()).trigger(e);
}

QUnit.test('onEditorEnterKey', function(assert) {
    let testArgs;
    let editor;
    const layoutManager = $('#container').dxLayoutManager({
        layoutData: {
            name: 'Test Name',
            profession: 'Test profession'
        },
        onEditorEnterKey: function(args) {
            testArgs = args;
        }
    }).dxLayoutManager('instance');

    editor = layoutManager.getEditor('profession');
    triggerKeyUp(editor.$element(), 'Enter');

    assert.notEqual(testArgs.component, undefined, 'component');
    assert.notEqual(testArgs.element, undefined, 'element');
    assert.notEqual(testArgs.event, undefined, 'Event');
    assert.equal(testArgs.dataField, 'profession', 'dataField');
    assert.equal(testArgs.component.NAME, 'dxLayoutManager', 'correct component');

    editor = layoutManager.getEditor('name');
    triggerKeyUp(editor.$element(), 'Enter');

    assert.notEqual(testArgs.component, undefined, 'component');
    assert.notEqual(testArgs.element, undefined, 'element');
    assert.notEqual(testArgs.event, undefined, 'Event');
    assert.equal(testArgs.dataField, 'name', 'dataField');
});

QUnit.test('Should save layoutData properties by reference (T706177)', function(assert) {
    const done = assert.async();

    const items = [
        { id: 1, name: 'name1' },
        { id: 2, name: 'name2' }
    ];

    const layoutManager = $('#container').dxLayoutManager({
        layoutData: { id: 1, field: items[0] },
        items: [{
            dataField: 'field',
            editorType: 'dxSelectBox',
            editorOptions: {
                dataSource: items,
                onValueChanged: ({ previousValue, value }) => {
                    assert.deepEqual(previousValue, { id: 1, name: 'name1' });
                    assert.deepEqual(value, { id: 2, name: 'name2' });
                    done();
                }
            }
        }]
    }).dxLayoutManager('instance');

    const editor = layoutManager.getEditor('field');

    editor.option('value', items[1]);
});

QUnit.test('Change items from [1] -> []', function(assert) {
    const layoutManager = $('#container').dxLayoutManager({
        formData: {
            name: 'TestName'
        },
        items: ['name']
    }).dxLayoutManager('instance');

    layoutManager.option('items', []);

    assert.equal(layoutManager.$element().children().length, 0, 'layout manager content is empty');
    assert.notOk(layoutManager.getEditor('name'), 'editor is not created');
});

QUnit.module('Render multiple columns');

QUnit.test('Change from fixed colCount to auto and vice versa', function(assert) {
    const $testContainer = $('#container').width(450);

    $testContainer.dxLayoutManager({
        layoutData: { test1: 'abc', test2: 'qwe', test3: 'xyz' },
        colCount: 1,
        minColWidth: 200
    });

    const instance = $testContainer.dxLayoutManager('instance');

    assert.equal(instance._getColCount(), 1, 'We have only 1 column');

    instance.option('colCount', 'auto');
    assert.equal(instance._getColCount(), 2, 'We have only 2 columns');

    instance.option('colCount', 3);
    assert.equal(instance._getColCount(), 3, 'We have only 3 columns');
});
