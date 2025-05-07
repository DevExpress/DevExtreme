import $ from 'jquery';
import dataUtils from 'core/element_data';

QUnit.testStart(function() {
    const markup = `
        <style nonce="qunit-test">
            .qunit-fixture-static {
                 position: absolute !important;
                 left: 0 !important;
                 top: 0 !important;
            }
             .dx-scrollable-native-ios .dx-scrollable-content {
                 padding: 0 !important;
            }
        </style>
        <div>
            <div class="dx-datagrid">
                <div id="container"></div>
            </div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});


import 'ui/data_grid';
import 'ui/autocomplete';
import 'ui/calendar';
import 'ui/color_box';
import 'ui/drop_down_box';
import 'ui/html_editor';
import 'ui/lookup';
import 'ui/radio_group';
import 'ui/range_slider';
import 'ui/slider';
import 'ui/switch';
import 'ui/tag_box';
import TextArea from 'ui/text_area';

import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import dateLocalization from 'common/core/localization/date';
import browser from 'core/utils/browser';
import devices from '__internal/core/m_devices';
import SelectBox from 'ui/select_box';
import { MockColumnsController, MockDataController, setupDataGridModules } from '../../helpers/dataGridMocks.js';
import config from 'core/config';
import typeUtils from 'core/utils/type';
import { noop } from 'core/utils/common';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

QUnit.module('Editor Factory', {
    beforeEach: function() {
        SelectBox.defaultOptions({ options: { deferRendering: false } });
        setupDataGridModules(this, ['editorFactory']);
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        executeAsyncMock.teardown();
        this.dispose();
    }
}, () => {

    ['dxAutocomplete', 'dxCalendar', 'dxCheckBox', 'dxColorBox', 'dxDateBox', 'dxDropDownBox', 'dxHtmlEditor', 'dxLookup', 'dxNumberBox', 'dxRadioGroup', 'dxRangeSlider', 'dxSelectBox', 'dxSlider', 'dxSwitch', 'dxTagBox', 'dxTextArea', 'dxTextBox'].forEach((editorType) => {
        QUnit.test(`Prepare editor based on editorType: ${editorType}`, function(assert) {
            // arrange
            const $container = $('#container');
            const editorOptions = {
                editorType,
                dataType: 'string'
            };

            if(editorType === 'dxDateBox') {
                editorOptions.dataType = 'date';
            } else if(editorType === 'dxRangeSlider') {
                editorOptions.value = [];
            }

            this.options.onEditorPreparing = function(options) {
                // assert
                assert.strictEqual(options.editorName, editorType, `editorName is set correctly: ${editorType}`);
                if(['dxSelectBox', 'dxLookup'].includes(editorType)) { // T1145047
                    assert.strictEqual(options.editorOptions.valueChangeEvent, undefined, `Prepare ${editorType} without the 'valueChangeEvent' option`);
                }
            };
            this.editorFactoryController.init();

            // act
            this.editorFactoryController.createEditor($container, editorOptions);
            const editor = $container[editorType]('instance');

            // assert
            assert.ok(editor, 'editor created');
        });
    });

    QUnit.test('Text editor', function(assert) {
        const $container = $('#container');
        let value = 'A';

        // act
        this.editorFactoryController.createEditor($container, {
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const textBox = $container.dxTextBox('instance');
        const valueChangeEvent = textBox.option('valueChangeEvent');

        // assert
        assert.ok(textBox, 'dxTextBox created');
        assert.equal(textBox.option('value'), 'A', 'text editor value');
        assert.ok(textBox._supportedKeys().enter, 'enter handler is defined'); // T1013643
        assert.notEqual(textBox._supportedKeys().enter, noop, 'enter handler is not noop'); // T1013643

        // act
        textBox.option('value', 'B');

        // assert
        assert.equal(valueChangeEvent, 'change', 'value change event is correct');

        assert.equal(value, 'B', 'value after change');
    });

    // T749989
    QUnit.test('Editor should not convert value to string if editorType is defined and not equal to dxTextBox', function(assert) {
    // arrange
        const $container = $('#container');
        const value = [];

        // act
        this.editorFactoryController.createEditor($container, {
            editorType: 'dxSelectBox',
            parentType: 'dataRow',
            value: value
        });
        const editor = $container.dxSelectBox('instance');

        // assert
        assert.ok(editor, 'editor created');
        assert.strictEqual(editor.option('value'), value, 'editor value was not converted to string');
    });

    QUnit.test('Text editor enter in ios (T344096)', function(assert) {
        if(!browser.webkit) {
            assert.ok(true, 'Not webkit browser');
            return;
        }

        const $container = $('#container');
        let value = 'A';

        const originalDevice = devices.real();

        devices.real({ ios: true });

        // act
        this.editorFactoryController.createEditor($container, {
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const textBox = $container.dxTextBox('instance');
        const valueChangeEvent = textBox.option('valueChangeEvent');

        // assert
        assert.ok(textBox, 'dxTextBox created');
        assert.equal(textBox.option('value'), 'A', 'text editor value');

        // mock for real blur
        $container.find('input').on('blur', function(e) {
            $(e.target).trigger('change');
        });

        // act
        $container.find('input').focus();
        $container.find('input').val('AB');
        $container.find('input').trigger($.Event('keydown', { key: 'Enter' }));

        // assert
        assert.equal(valueChangeEvent, 'change', 'value change event for ios');
        assert.equal(value, 'AB', 'value after change');

        devices.real(originalDevice);
    });

    QUnit.test('Text editor with set onEditorPreparing', function(assert) {
    // arrange
        const $container = $('#container');
        let textBox;

        this.options.onEditorPreparing = function(options) {
        // assert
            assert.strictEqual(options.setValue(), 'Test', 'option value');
            assert.equal(options.width, 100, 'option width');
            assert.strictEqual(options.parentType, 'filterRow', 'option parentType');

            options.cancel = true;
        };
        this.editorFactoryController.init();

        // act
        this.editorFactoryController.createEditor($container, {
            setValue: function() {
                return 'Test';
            },
            width: 100,
            parentType: 'filterRow'
        });

        textBox = dataUtils.data($container.get(0), 'dxTextBox');

        // assert
        assert.equal(this.__actionConfigs.onEditorPreparing.category, 'rendering', 'onEditorPreparing category');
        assert.ok(!textBox, 'dxTextBox not created');

        // arrange
        this.editorFactoryController.option('onEditorPreparing', (options) => {
            options.cancel = false;
        });

        // act
        this.editorFactoryController.createEditor($container, {
            setValue: function() {
                return 'Test';
            },
            width: 100,
            parentType: 'filterRow'
        });

        textBox = $container.dxTextBox('instance');

        // assert
        assert.ok(textBox, 'dxTextBox created');
    });

    QUnit.test('Text editor with set onEditorPrepared', function(assert) {
    // arrange
        const $container = $('#container');

        this.options.onEditorPrepared = function(options) {
        // assert
            assert.strictEqual(options.setValue(), 'Test', 'option value');
            assert.equal(options.width, 100, 'option width');
            assert.strictEqual(options.parentType, 'filterRow', 'option parentType');
        };
        this.editorFactoryController.init();

        // act
        this.editorFactoryController.createEditor($container, {
            setValue: function() {
                return 'Test';
            },
            width: 100,
            parentType: 'filterRow'
        });

        const textBox = $container.dxTextBox('instance');

        // assert
        assert.equal(this.__actionConfigs.onEditorPrepared.category, 'rendering', 'onEditorPrepared category');
        assert.ok(textBox, 'dxTextBox created');
    });

    QUnit.test('NumberBox', function(assert) {
        const $container = $('#container');
        let value = 124;

        this.editorFactoryController.createEditor($container, {
            dataType: 'number',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // act
        const numberBox = $container.dxNumberBox('instance');

        // assert
        assert.ok(numberBox, 'dxNumberBox created');
        assert.equal(numberBox.option('value'), value, 'numberbox value');
        assert.ok(!$container.hasClass('dx-numberbox-spin'), 'numberbox render without spin buttons');

        // act
        numberBox.option('value', 321);

        // assert
        assert.equal(value, 321, 'value after change');
    });

    // T159874
    QUnit.test('NumberBox with undefined value', function(assert) {
        const $container = $('#container');

        this.editorFactoryController.createEditor($container, {
            dataType: 'number',
            value: undefined
        });

        // act
        const numberBox = $container.dxNumberBox('instance');

        // assert
        assert.ok(numberBox, 'dxNumberBox created');
        assert.equal(numberBox.option('value'), null, 'numberbox value');
    });

    QUnit.test('Change editorOptions on editorPreparing', function(assert) {
        const $container = $('#container');
        let editorPreparingCallCount = 0;
        let value = 124;

        this.options.onEditorPreparing = function(options) {
            editorPreparingCallCount++;
            if(options.editorName === 'dxNumberBox') {
                assert.ok(!options.editorOptions.showSpinButtons);
                // act
                options.editorOptions.showSpinButtons = true;
            }
        };
        this.editorFactoryController.init();

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'number',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // act
        const numberBox = $container.dxNumberBox('instance');

        // assert
        assert.ok(numberBox, 'dxNumberBox created');
        assert.equal(editorPreparingCallCount, 1, 'editorPreparing call count');
        assert.equal(numberBox.option('value'), value, 'numberbox value');
        assert.equal(numberBox.option('showSpinButtons'), true, 'showSpinButtons true');
        assert.ok($container.hasClass('dx-numberbox-spin'), 'numberbox render with spin buttons');
    });

    const DATAGRID_CHECKBOX_SIZE_CLASS = 'dx-datagrid-checkbox-size';

    QUnit.test('Boolean editor', function(assert) {
        const $container = $('#container');
        let value = true;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        // act
        const checkBox = $container.dxCheckBox('instance');


        // assert
        assert.ok(checkBox, 'dxCheckBox created');
        assert.ok(checkBox.$element().hasClass(DATAGRID_CHECKBOX_SIZE_CLASS), 'checkbox has dx-datagrid-checkbox-size class');
        assert.equal(checkBox.option('value'), true, 'checkbox editor value');
        assert.ok(checkBox.option('hoverStateEnabled'), 'hover enabled');
        assert.ok(checkBox.option('focusStateEnabled'), 'focus enabled');
        assert.ok(!checkBox.option('activeStateEnabled'), 'active disabled');
        assert.ok($container.parent().hasClass('dx-editor-inline-block'), 'parent has dx-editor-inline-block class');

        // act
        checkBox.option('value', false);

        // assert
        assert.equal(value, false, 'value after change');
    });

    QUnit.test('Switch editor (T897363)', function(assert) {
        const $container = $('#container');
        let value = true;

        this.options.onEditorPreparing = (e) => {
            e.editorName = 'dxSwitch';
        };
        this.editorFactoryController.init();

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // assert
        const switchInstance = $container.dxSwitch('instance');

        assert.ok(switchInstance, 'dxSwitch is created');
        assert.equal(switchInstance.option('value'), true, 'editor value');
        assert.ok($container.parent().hasClass('dx-editor-inline-block'), 'parent has dx-editor-inline-block class');
    });

    QUnit.test('Boolean editor when inOnForm is true', function(assert) {
        const $container = $('#container');
        const value = true;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            isOnForm: true,
            value: value
        });
        // act
        const checkBox = $container.dxCheckBox('instance');


        // assert
        assert.ok(checkBox, 'dxCheckBox created');
        assert.notOk(checkBox.$element().hasClass(DATAGRID_CHECKBOX_SIZE_CLASS), 'checkbox not have dx-datagrid-checkbox-size class');
    });

    QUnit.test('Add custom tabIndex to Boolean editor', function(assert) {
        const $container = $('#container');

        this.editorFactoryController.option('tabIndex', 7);

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean'
        });

        // act
        const checkBox = $container.dxCheckBox('instance');

        // assert
        assert.equal(checkBox.$element().attr('tabIndex'), '7', 'tabIndex attr of checkBox');
    });

    QUnit.test('Boolean editor with null value should be intermediate', function(assert) {
        const $container = $('#container');
        let value = null;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // act
        const checkBox = $container.dxCheckBox('instance');

        // assert
        assert.ok(checkBox, 'dxCheckBox created');
        assert.equal(checkBox.option('value'), undefined, 'checkbox editor value is undefined');
    });

    QUnit.test('Date editor', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);

        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            format: 'shortDate',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        // act
        const editor = $container.dxDateBox('instance');

        // assert
        assert.ok(editor, 'dxDateBox created');
        assert.equal(editor.option('value'), value, 'editor value');

        // act
        editor.option('value', new Date(2013));

        // assert
        assert.equal(editor.option('displayFormat'), 'shortDate', 'Widget format is correct');
        assert.deepEqual(value, new Date(2013), 'value after change');
        // T601751
        assert.equal(editor.option('dateSerializationFormat'), null, 'dateSerializationFormat is null');
    });

    QUnit.test('DateTime editor', function(assert) {
    // arrange
        const $container = $('#container');

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'datetime',
            format: 'shortDateShortTime'
        });

        // assert
        const editor = $container.dxDateBox('instance');
        assert.ok(editor, 'has editor');
        assert.equal(editor.option('type'), 'datetime', 'editor type');
        assert.equal(editor.option('displayFormat'), 'shortDateShortTime', 'display format of the editor');
    });

    // T219884
    QUnit.test('Date editor with datetime format changing value', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);

        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            format: 'shortDate',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const editor = $container.dxDateBox('instance');
        editor.option('format', 'datetime');

        // act
        editor.option('value', new Date(2013));

        // assert
        assert.deepEqual(value, new Date(2013), 'value after change');
    });

    QUnit.test('Date editor with custom format (T146458)', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);
        const customFormat = 'dd.MM.yyyy';

        const mockGlobalizeLocalization = {
            format: function(date, format) {
                if(format === customFormat && date === value) {
                    return '03.02.2012';
                }
            }
        };

        dateLocalization.inject(mockGlobalizeLocalization);

        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            editorOptions: {
                pickerType: 'calendar'
            },
            value: value,
            format: 'dd.MM.yyyy',
            setValue: function(newValue) {
                value = newValue;
            }
        });
        // act
        const editor = $container.dxDateBox('instance');

        // assert
        assert.equal(editor.option('displayFormat'), 'dd.MM.yyyy', 'Widget format is correct');
        assert.equal($container.find(TEXTEDITOR_INPUT_SELECTOR).val(), '03.02.2012', 'Widget display date with custom format');
    });

    QUnit.test('Date editor with custom editorOptions', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            format: 'shortDate',
            editorOptions: {
                pickerType: 'rollers'
            },
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const editor = $container.dxDateBox('instance');

        // assert
        assert.equal(editor.option('pickerType'), 'rollers', 'pickerType from editorOptions');
    });


    QUnit.test('Boolean editor when filtering', function(assert) {
        const $container = $('#container');
        let value = true;

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            parentType: 'filterRow',
            showAllText: '[All]',
            trueText: 'True',
            falseText: 'False',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), true, 'selectbox value');
        assert.deepEqual(selectBox.option('items'), [null, true, false], 'selectbox items');

        const listItems = $('.dx-list-item');
        assert.equal(listItems.length, 3, 'list items count');
        assert.equal(listItems.eq(0).text(), '[All]');
        assert.equal(listItems.eq(1).text(), 'True');
        assert.equal(listItems.eq(2).text(), 'False');

        // act
        selectBox.option('value', false);

        // assert
        assert.equal(value, false, 'value after change');
    });

    // T191746
    QUnit.test('Boolean editor when filtering change value', function(assert) {
        const $container = $('#container');
        let value;

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            parentType: 'filterRow',
            showAllText: '[All]',
            trueText: 'True',
            falseText: 'False',
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // assert
        assert.strictEqual($container.find(TEXTEDITOR_INPUT_SELECTOR).val(), '[All]');
        assert.strictEqual(value, undefined);

        // act
        $container.find('.dx-list-item:contains(\'False\')').trigger('dxclick');

        // assert
        assert.strictEqual($container.find(TEXTEDITOR_INPUT_SELECTOR).val(), 'False', 'text after change to false');
        assert.strictEqual(value, false, 'value after change to false');

        // act
        $container.find('.dx-list-item:contains(\'True\')').trigger('dxclick');

        // assert
        assert.strictEqual($container.find(TEXTEDITOR_INPUT_SELECTOR).val(), 'True', 'text after change to true');
        assert.strictEqual(value, true, 'value after change to true');

        // act
        $container.find('.dx-list-item:contains(\'[All]\')').trigger('dxclick');

        // assert
        assert.strictEqual($container.find(TEXTEDITOR_INPUT_SELECTOR).val(), '[All]', 'text after change to null');
        assert.strictEqual(value, null, 'value after change to null');
    });

    QUnit.test('Boolean editor when filtering and no localized texts', function(assert) {
        const $container = $('#container');
        let value = true;

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            parentType: 'filterRow',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), true, 'selectbox value');
        assert.deepEqual(selectBox.option('items'), [null, true, false], 'selectbox items');

        const listItems = $('.dx-list-item');
        assert.equal(listItems.length, 3, 'list items count');
        assert.equal(listItems.eq(0).text(), '');
        assert.equal(listItems.eq(1).text(), 'true');
        assert.equal(listItems.eq(2).text(), 'false');

        // act
        selectBox.option('value', false);

        // assert
        assert.equal(value, false, 'value after change');
    });

    QUnit.test('Lookup editor', function(assert) {
        const $container = $('#container');
        let value = 2;
        let text;

        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            showAllText: '(All)',
            value: value,
            setValue: function(newValue, newText) {
                value = newValue;
                text = newText;
            }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), 2, 'selectbox value');
        assert.deepEqual(selectBox.option('items'), editorOptions.lookup.dataSource, 'selectbox items');
        // T293216
        assert.equal(selectBox.option('searchExpr'), 'value', 'selectbox searchExpr');

        const listItems = $('.dx-list-item');
        assert.equal(listItems.length, 3, 'list items count');
        assert.equal(listItems.eq(0).text(), 'text1');
        assert.equal(listItems.eq(1).text(), 'text2');
        assert.equal(listItems.eq(2).text(), 'text3');

        // act
        selectBox.option('value', 1);

        // assert
        assert.equal(value, 1, 'value after change');
        assert.equal(text, 'text1', 'text after change');
    });

    // T189828
    QUnit.test('Lookup editor with 0 value', function(assert) {
        const $container = $('#container');

        const editorOptions = {
            lookup: {
                dataSource: [{ id: 0, value: 'text1' }, { id: 1, value: 'text2' }, { id: 2, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            value: 0
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), 0, 'selectbox value');
        assert.equal(selectBox._input().val(), 'text1', 'selectbox text');
    });

    QUnit.test('Lookup editor with showClearButton', function(assert) {
    // arrange
        const $container = $('#container');
        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value',
                allowClearing: true
            },
            setValue: function() { }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox.option('showClearButton'), 'showClearButton');
    });

    QUnit.test('Lookup editor with allowClearing', function(assert) {
    // arrange
        const $container = $('#container');
        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value',
                allowClearing: false
            },
            setValue: function() { }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.strictEqual(selectBox.option('allowClearing'), false, 'allowClearing should be passed to the editor');
    });

    QUnit.test('Lookup editor with showClearButton and filtering', function(assert) {
    // arrange
        const $container = $('#container');
        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value',
                allowClearing: true
            },
            parentType: 'filterRow',
            setValue: function() { }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(!selectBox.option('showClearButton'), 'showClearButton');
    });

    QUnit.test('Lookup editor when filtering', function(assert) {
        const $container = $('#container');
        let value = 2;

        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            parentType: 'filterRow',
            showAllText: '(All)',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), 2, 'selectbox value');
        assert.deepEqual(selectBox.option('items'), [null, { id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }], 'selectbox items');
        // T293216
        assert.equal(selectBox.option('searchExpr'), 'value', 'selectbox searchExpr');

        const listItems = $('.dx-list-item');
        assert.equal(listItems.length, 4, 'list items count');
        assert.equal(listItems.eq(0).text(), '(All)');
        assert.equal(listItems.eq(1).text(), 'text1');
        assert.equal(listItems.eq(2).text(), 'text2');
        assert.equal(listItems.eq(3).text(), 'text3');

        // act
        selectBox.option('value', null);

        // assert
        assert.equal(value, null, 'value after change');
    });

    // T220163
    QUnit.test('Lookup editor with paging', function(assert) {
        const $container = $('#container');
        let value = 2;

        const editorOptions = {
            lookup: {
                dataSource: {
                    store: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                    pageSize: 2,
                    paginate: true
                },
                valueExpr: 'id',
                displayExpr: 'value'
            },
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('value'), 2, 'selectbox value');
        assert.deepEqual(selectBox.option('items'), [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }], 'selectbox items');

        const listItems = $('.dx-list-item');
        assert.equal(listItems.length, 2, 'list items count');
        assert.equal(listItems.eq(0).text(), 'text1');
        assert.equal(listItems.eq(1).text(), 'text2');

        // act
        selectBox.option('value', 1);

        // assert
        assert.equal(value, 1, 'value after change');
    });

    // T293216
    QUnit.test('Lookup editor with searchExpr', function(assert) {
        const $container = $('#container');
        let value = 2;

        const editorOptions = {
            lookup: {
                dataSource: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                searchExpr: 'searchValue',
                displayExpr: 'value'
            },
            showAllText: '(All)',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox, 'dxSelectBox created');
        assert.equal(selectBox.option('searchExpr'), 'searchValue', 'selectbox searchExpr');
        assert.equal(selectBox.option('value'), 2, 'selectbox value');
    });

    QUnit.test('ReadOnly for textBox', function(assert) {
        const $container = $('#container');
        let value = 'A';

        // act
        this.editorFactoryController.createEditor($container, {
            value: value,
            setValue: function(newValue) {
                value = newValue;
            },
            readOnly: true
        });
        const textBox = $container.dxTextBox('instance');

        assert.ok(textBox.option('readOnly'));
    });

    QUnit.test('ReadOnly for numberBox', function(assert) {
        const $container = $('#container');
        let value = 'A';

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'number',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            },
            readOnly: true
        });
        const numberBox = $container.dxNumberBox('instance');

        assert.ok(numberBox.option('readOnly'));
    });

    QUnit.test('ReadOnly for date editor', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);

        // act
        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            format: 'shortDate',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            },
            readOnly: true
        });

        // act
        const editor = $container.dxDateBox('instance');

        assert.ok(editor.option('readOnly'));
    });

    QUnit.test('ReadOnly for lookup', function(assert) {
        const $container = $('#container');
        let value = 2;
        const editorOptions = {
            lookup: {
                items: [
                    { id: 1, value: 'text1' },
                    { id: 2, value: 'text2' },
                    { id: 3, value: 'text3' }
                ],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            showAllText: '(All)',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            },
            readOnly: true
        };

        // act
        this.editorFactoryController.createEditor($container, editorOptions);

        // act
        const selectBox = $container.dxSelectBox('instance');

        // assert
        assert.ok(selectBox.option('readOnly'));
    });

    QUnit.test('ReadOnly for boolean editor', function(assert) {
        const $container = $('#container');
        let value = true;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            },
            readOnly: true
        });

        // act
        const checkBox = $container.dxCheckBox('instance');


        // assert
        assert.ok(checkBox.option('readOnly'), 'readonly');
        assert.ok(!checkBox.option('hoverStateEnabled'), 'no hover');
        assert.ok(!checkBox.option('focusStateEnabled'), 'no focus');
        assert.ok(!checkBox.option('activeStateEnabled'), 'no active');
    });
});

QUnit.module('Editor Factory - RTL', {
    beforeEach: function() {
        this.options = {
            rtlEnabled: true
        };
        setupDataGridModules(this, ['editorFactory']);
        executeAsyncMock.setup();
    },
    afterEach: function() {
        this.dispose();
        executeAsyncMock.teardown();
    }
}, () => {

    QUnit.test('Create TextBox with RTL', function(assert) {
        const $container = $('#container');
        let value = 'a';

        this.editorFactoryController.createEditor($container, {
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxTextBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'textbox created with correct \'rtlEnabled\' option');
    });

    QUnit.test('Create Boolean editor with RTL', function(assert) {
        const $container = $('#container');
        let value = true;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxCheckBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'checkbox created with correct \'rtlEnabled\' option');
    });

    QUnit.test('Create date editor with RTL', function(assert) {
        const $container = $('#container');
        let value = new Date(2012, 1, 3);

        this.editorFactoryController.createEditor($container, {
            dataType: 'date',
            format: 'shortDate',
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxDateBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'date editor created with correct \'rtlEnabled\' option');
    });

    QUnit.test('Create Boolean editor with RTL when filtering', function(assert) {
        const $container = $('#container');
        let value = true;

        this.editorFactoryController.createEditor($container, {
            dataType: 'boolean',
            parentType: 'filterRow',
            showAllText: '[All]',
            trueText: 'True',
            falseText: 'False',
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxSelectBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'selectbox created with correct \'rtlEnabled\' option');
    });

    QUnit.test('Create lookup editor with RTL', function(assert) {
        const $container = $('#container');
        let value = 2;

        this.editorFactoryController.createEditor($container, {
            lookup: {
                items: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            showAllText: '(All)',
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxSelectBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'selectbox created with correct \'rtlEnabled\' option');
    });

    QUnit.test('Create lookup editor with RTL when filtering', function(assert) {
        const $container = $('#container');
        let value = 2;

        this.editorFactoryController.createEditor($container, {
            lookup: {
                items: [{ id: 1, value: 'text1' }, { id: 2, value: 'text2' }, { id: 3, value: 'text3' }],
                valueExpr: 'id',
                displayExpr: 'value'
            },
            parentType: 'filterRow',
            showAllText: '(All)',
            setValue: function(newValue) {
                if(newValue === undefined) {
                    return value;
                }
                value = newValue;
            }
        });

        const editor = $container.dxSelectBox('instance');

        assert.ok(editor.option('rtlEnabled'), 'selectbox created with correct \'rtlEnabled\' option');
    });

    QUnit.test('dxTextArea editor inserts new line by Enter and ends edit by Ctrl + Enter ', function(assert) {
    // arrange
        const $container = $('#container');
        let value = 'Some text';
        let event;

        // act
        this.editorFactoryController.createEditor($container, {
            editorType: 'dxTextArea',
            parentType: 'dataRow',
            value: value,
            setValue: function(newValue) {
                value = newValue;
            }
        });

        // act
        event = $.Event('keydown', { key: 'enter' });
        $($container.find('textarea')).trigger(event);

        // assert
        assert.ok(event.isPropagationStopped(), 'enter propagation is stopped');

        // act
        event = $.Event('keydown', { key: 'enter', ctrlKey: true });
        $($container.find('textarea')).trigger(event);

        // assert
        assert.ok(!event.isPropagationStopped(), 'enter + ctrl propagation is not stopped');

        // act
        event = $.Event('keydown', { key: 'enter', shiftKey: true });
        $($container.find('textarea')).trigger(event);

        // assert
        assert.ok(!event.isPropagationStopped(), 'enter + shift propagation is not stopped');
    });
});

QUnit.module('Focus', {
    beforeEach: function() {
        const that = this;

        that.clock = sinon.useFakeTimers();
        that.$element = function() {
            return $('#container');
        };
        that.columns = [
            { caption: 'Column 1', visible: true, allowEditing: true, dataField: 'Column1' },
            { caption: 'Column 2', visible: true, allowEditing: true, dataField: 'Column2' },
            { caption: 'Column 3', visible: true, allowEditing: true, dataField: 'Column3' },
            { caption: 'Column 4', visible: true, allowEditing: true, dataField: 'Column4', dataType: 'boolean', showEditorAlways: true }
        ];

        that.setupDataGrid = function() {
            setupDataGridModules(that, ['data', 'rows', 'columns', 'editorFactory', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'validating', 'masterDetail'], {
                initViews: true,
                controllers: {
                    columns: new MockColumnsController(that.columns),
                    data: new MockDataController({
                        pageCount: 10,
                        pageIndex: 0,
                        pageSize: 6,
                        items: [
                            { values: ['test1', 'test2', 'test3', true], rowType: 'data', key: 0 },
                            { values: ['test1', 'test2', 'test3', true], rowType: 'data', key: 1 },
                            { values: ['test1', 'test2', 'test3', true], rowType: 'data', key: 2 },
                            { values: ['test1', 'test2', 'test3', true], rowType: 'data', key: 3 }
                        ]
                    })
                }
            });
        };
    },
    afterEach: function() {
        if(this.dispose) {
            this.dispose();
        }
        this.clock.restore();
    }
}, () => {

    QUnit.test('Update focus for cell of row', function(assert) {
    // arrange
        const testElement = $('#container');
        let isFocused;

        this.setupDataGrid();
        this._views.rowsView.render(testElement);

        // act
        this.editorFactoryController.component.element = function() {
            return $('#container');
        };

        this.editorFactoryController._getFocusedElement = function($dataGridElement) {
            return testElement.find('.dx-data-row td').eq(0);
        };

        this.editorFactoryController.focus = function() {
            isFocused = true;
        };

        this.editorFactoryController._updateFocusCore();

        // assert
        assert.ok(isFocused, 'cell is focused');
    });

    QUnit.test('Call focus without parameter', function(assert) {
    // arrange
        this.setupDataGrid();
        this.editorFactoryController._$focusedElement = $('<div/>');

        // act, assert
        assert.deepEqual(this.editorFactoryController.focus(), this.editorFactoryController._$focusedElement, 'focused element');
    });

    // T179518
    QUnit.test('Update focus on tab keydown', function(assert) {
    // arrange
        const testElement = $('#container');
        let isFocused;

        this.setupDataGrid();
        this._views.rowsView.render(testElement);

        // act
        this.editorFactoryController._getFocusedElement = function() {
            return testElement.find('.dx-data-row td').eq(0);
        };

        this.editorFactoryController.focus = function() {
            isFocused = true;
        };

        testElement.trigger($.Event('keydown.dxDataGridEditorFactory', { key: 'Tab' }));
        this.clock.tick(10);

        // assert
        assert.ok(isFocused, 'cell is focused');
    });

    QUnit.test('Focus element', function(assert) {
    // arrange
        const testElement = $('#container');

        this.setupDataGrid();

        // act
        this.editorFactoryController.focus(testElement);
        this.clock.tick(10);

        // assert
        assert.equal(this.editorFactoryController.focus(), testElement, 'focused element');
    });

    // T218997
    QUnit.test('Focus disabled on focused cell', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        let isFocused;

        that.setupDataGrid();
        that.rowsView.render(testElement);

        that.editorFactoryController.component.element = function() {
            return testElement;
        };

        that.editorFactoryController._getFocusedElement = function($dataGridElement) {
            return testElement.find('.dx-data-row td').eq(0);
        };

        that.editorFactoryController.focus = function($element) {
            isFocused = true;
        };

        // act
        that.editorFactoryController._updateFocusCore();

        // assert
        assert.ok(isFocused, 'cell is focused');

        testElement.find('.dx-data-row td').eq(0).addClass('dx-cell-focus-disabled');

        // act
        isFocused = false;
        that.editorFactoryController._updateFocusCore();

        // assert
        // T298733
        assert.ok(!isFocused, 'cell with class dx-cell-focus-disabled is not focused');
    });

    // T218997, T292164
    QUnit.test('Focus on cell with focused checkbox editor', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        let focusWithHiddenBorders;
        let isFocused;

        that.options = {
            editing: {
                mode: 'batch',
                allowUpdating: true
            }
        };

        that.setupDataGrid();
        that.rowsView.render(testElement);

        that.editorFactoryController.component.element = function() {
            return testElement;
        };


        that.editorFactoryController._getFocusedElement = function($dataGridElement) {
            return testElement.find('.dx-data-row .dx-checkbox').eq(0);
        };

        that.editorFactoryController.focus = function($element, hideBorders) {
            isFocused = true;
            focusWithHiddenBorders = hideBorders;
        };

        // act
        that.editorFactoryController._updateFocusCore();

        // assert
        assert.ok(isFocused, 'cell is focused');
        assert.ok(focusWithHiddenBorders, 'focus borders are hidden when cell has class dx-editor-inline-block exists and editor is focused');

        // act
        isFocused = false;
        that.editorFactoryController.focus(testElement.find('.dx-data-row .dx-editor-inline-block'));

        // assert
        assert.ok(isFocused, 'cell is focused');
        assert.ok(!focusWithHiddenBorders, 'focused cell with class dx-cell-focus-disabled has focus borders');
    });

    // T327148
    QUnit.testInActiveWindow('Focus on a filtering cell after editing cell in \'batch\' mode', function(assert) {
        const that = this;
        let $cell;
        const $testElement = $('#container');

        that.options = {
            showColumnHeaders: true,
            keyboardNavigation: {
                enabled: true
            },
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            filterRow: {
                visible: true
            },
            columns: [{ allowEditing: true, dataField: 'name' }, { allowEditing: true, dataField: 'lastName' }, { allowEditing: true, dataField: 'age' }],
            dataSource: [{ name: 'Bob', lastName: 'Smith', age: 19 }, { name: 'Dmitry', lastName: 'Semenov', age: 31 }, { name: 'George ', lastName: 'Bush', age: 51 }]
        };

        that.$element = function() {
            return $('.dx-datagrid').parent();
        };

        setupDataGridModules(that, ['data', 'columns', 'rows', 'columnHeaders', 'filterRow', 'editorFactory', 'editing', 'editingCellBased', 'keyboardNavigation'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);
        that.rowsView.render($testElement);

        // act
        $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(1).children().eq(1).trigger('dxpointerdown');
        $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(1).children().eq(1).trigger('dxclick');
        that.clock.tick(10);

        // assert
        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(1).children().eq(1);
        assert.ok($cell.find('input').length, 'has input');
        assert.ok($cell.hasClass('dx-focused'), 'focused cell');

        // act
        $testElement.find('.dx-datagrid-filter-row input').eq(1).trigger('focus');
        $testElement.find('.dx-datagrid-filter-row input').eq(1).trigger('dxpointerdown');
        $testElement.find('.dx-datagrid-filter-row input').eq(1).trigger('dxclick');
        that.clock.tick(10);

        // assert
        $cell = $testElement.find('.dx-datagrid-filter-row > td').eq(1);
        assert.ok($cell.hasClass('dx-focused'), 'focused cell');

        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(1).children().eq(1);
        assert.ok(!$cell.find('input').length, 'not has input');
        assert.ok(!$cell.hasClass('dx-focused'), 'not focused cell');
    });

    // T454719
    QUnit.testInActiveWindow('Focus on dxLookup editor', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'if device is not desktop we do not test the case');
            return;
        }

        const that = this;
        let $cell;
        const $testElement = $('#container');

        that.options = {
            keyboardNavigation: {
                enabled: true
            },
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            columns: [{ allowEditing: true, dataField: 'name', editCellTemplate: function(container, options) {
                assert.equal(typeUtils.isRenderer(container), !!config().useJQuery, 'editCellElement is correct');
                $('<div>').appendTo($(container)).dxLookup({});
            } }],
            dataSource: [{ name: 'Bob' }]
        };

        that.$element = function() {
            return $('.dx-datagrid').parent();
        };

        setupDataGridModules(that, ['data', 'columns', 'rows', 'editorFactory', 'editing', 'editingCellBased', 'keyboardNavigation'], {
            initViews: true
        });

        that.rowsView.render($testElement);

        // act
        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(0).children().eq(0);
        $cell.trigger('dxpointerdown');
        $cell.trigger('dxclick');
        that.clock.tick(10);

        // assert
        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(0).children().eq(0);
        assert.ok($cell.find('.dx-lookup-field').length, 'has lookup field');
        assert.ok($cell.hasClass('dx-focused'), 'cell is focused');
    });

    // T531176
    QUnit.testInActiveWindow('Focus on dxTextArea editor', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'if device is not desktop we do not test the case');
            return;
        }

        const that = this;
        let $cell;
        const $testElement = $('#container');

        that.options = {
            keyboardNavigation: {
                enabled: true
            },
            editing: {
                mode: 'batch',
                allowUpdating: true
            },
            columns: [{ allowEditing: true, dataField: 'name', editCellTemplate: function(container, options) {
                new TextArea($('<div>').appendTo(container), {});
            } }],
            dataSource: [{ name: 'Bob' }]
        };

        that.$element = function() {
            return $('.dx-datagrid').parent();
        };

        setupDataGridModules(that, ['data', 'columns', 'rows', 'editorFactory', 'editing', 'editingCellBased', 'keyboardNavigation'], {
            initViews: true
        });

        that.rowsView.render($testElement);

        // act
        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(0).children().eq(0);
        $cell.trigger('dxpointerdown');
        $cell.trigger('dxclick');
        that.clock.tick(10);

        // assert
        $cell = $testElement.find('.dx-datagrid-rowsview tbody > tr').eq(0).children().eq(0);
        assert.ok($cell.find('textarea').length, 'has lookup field');
        assert.ok($cell.hasClass('dx-focused'), 'cell is focused');
    });
});

