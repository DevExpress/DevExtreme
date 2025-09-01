import { getItemFormatInfo, parseResultForEditorType } from '__internal/ui/form/form.ai.utils';
import errors from 'ui/widget/ui.errors';

const formItemComponents = [
    'dxAutocomplete',
    'dxCalendar',
    'dxCheckBox',
    'dxColorBox',
    'dxDateBox',
    'dxDateRangeBox',
    'dxDropDownBox',
    'dxHtmlEditor',
    'dxLookup',
    'dxNumberBox',
    'dxRadioGroup',
    'dxRangeSlider',
    'dxSelectBox',
    'dxSlider',
    'dxSwitch',
    'dxTagBox',
    'dxTextArea',
    'dxTextBox',
];

QUnit.module('getItemFormatInfo', () => {
    formItemComponents.forEach((editorType) => {
        QUnit.test(`should return correct format for ${editorType}`, function(assert) {
            const format = getItemFormatInfo({ editorType });
            const expectedFormats = {
                dxDateBox: 'date in ISO format',
                dxCalendar: 'date in ISO format',
                dxDateRangeBox: 'date range in ISO format, use pattern {start}:::{end}',
                dxColorBox: 'color in hex format',
                dxCheckBox: 'boolean value, true or false',
                dxSwitch: 'boolean value, true or false',
                dxNumberBox: 'numeric value',
                dxSlider: 'numeric value',
                dxRangeSlider: 'numeric range, use pattern {start}:::{end}',
            };

            assert.strictEqual(format, expectedFormats[editorType] || 'text', `${editorType} format is correct`);
        });
    });

    QUnit.test('should list acceptable values if editorOptions.items defined', function(assert) {
        const format = getItemFormatInfo({
            editorType: 'dxSelectBox',
            editorOptions: { items: ['item1', 'item2', 'item3'] },
        });
        const expectedFormat = 'text, accepted values: item1, item2, item3, split values with :::';

        assert.strictEqual(format, expectedFormat, 'list of acceptable values is correct');
    });

    QUnit.test('should list acceptable values if editorOptions.items passed as objects', function(assert) {
        const format = getItemFormatInfo({
            editorType: 'dxSelectBox',
            editorOptions: {
                items: [
                    { text: 'item1', value: 1 },
                    { text: 'item2', value: 2 },
                    { text: 'item3', value: 3 },
                ]
            },
        });
        const expectedFormat = 'text, accepted values: item1, item2, item3, split values with :::';

        assert.strictEqual(format, expectedFormat, 'list of acceptable values is correct');
    });

    QUnit.test('should allow custom values if editorOptions.acceptCustomValue = true', function(assert) {
        const format = getItemFormatInfo({
            editorType: 'dxSelectBox',
            editorOptions: {
                items: ['item1', 'item2', 'item3'],
                acceptCustomValue: true,
            },
        });
        const expectedFormat = 'text, accepted values: item1, item2, item3, split values with ::: (custom values are allowed)';

        assert.strictEqual(format, expectedFormat, 'list of acceptable values is correct, custom values are allowed');
    });
});

QUnit.module('parseResultForEditorType', () => {
    QUnit.test('should return correct value for dxAutocomplete', function(assert) {
        const value = 'string';

        assert.strictEqual(parseResultForEditorType('', 'dxAutocomplete', value), value, 'string is correct value for dxAutocomplete');
    });

    QUnit.test('should return correct value for dxCalendar', function(assert) {
        const value = '2025-08-29';

        assert.strictEqual(parseResultForEditorType('', 'dxCalendar', value), value, '2025-08-29 is correct value for dxCalendar');
    });

    QUnit.test('should throw an error for a not date value for dxCalendar', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxCalendar', value);
            assert.ok(false, `parsing should fail for '${value}' for dxCalendar`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxCalendar`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxCheckBox', function(assert) {
        assert.strictEqual(parseResultForEditorType('', 'dxCheckBox', 'false'), false, 'returned false for string "false"');
        assert.strictEqual(parseResultForEditorType('', 'dxCheckBox', 'true'), true, 'returned true for string "true"');
    });

    QUnit.test('should throw an error for a not boolean value for dxCheckBox', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxCheckBox', value);
            assert.ok(false, `parsing should fail for '${value}' for dxCheckBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxCheckBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'boolean', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxSwitch', function(assert) {
        assert.strictEqual(parseResultForEditorType('', 'dxSwitch', 'false'), false, 'returned false for string "false"');
        assert.strictEqual(parseResultForEditorType('', 'dxSwitch', 'true'), true, 'returned true for string "true"');
    });

    QUnit.test('should throw an error for a not boolean value for dxSwitch', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxSwitch', value);
            assert.ok(false, `parsing should fail for '${value}' for dxSwitch`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxSwitch`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'boolean', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxColorBox', function(assert) {
        const value = '#fff';
        assert.strictEqual(parseResultForEditorType('', 'dxColorBox', value), value, '#fff is correct value for dxColorBox');
    });

    QUnit.test('should throw an error for not color value for dxColorBox', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxColorBox', value);
            assert.ok(false, `parsing should fail for '${value}' for dxColorBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxColorBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'color', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxDateBox', function(assert) {
        const value = '2025-08-29';

        assert.strictEqual(parseResultForEditorType('', 'dxDateBox', value), value, '2025-08-29 is correct value for dxDateBox');
    });

    QUnit.test('should throw an error for a not date value for dxDateBox', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxDateBox', value);
            assert.ok(false, `parsing should fail for '${value}' for dxDateBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxDateBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxDateRangeBox', function(assert) {
        const value = ['2025-08-01', '2025-08-01'];

        assert.strictEqual(parseResultForEditorType('', 'dxDateRangeBox', value), value, 'correct range box was returned');
    });

    QUnit.test('should throw an error for string value for dxDateRangeBox', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxDateRangeBox', value);
            assert.ok(false, `parsing should fail for '${value}' for dxDateRangeBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxDateRangeBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for array of one item for dxDateRangeBox', function(assert) {
        const value = ['2025-08-01'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxDateRangeBox', value);
            assert.ok(false, `parsing should fail for [${value}] for dxDateRangeBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxDateRangeBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for incorrect array item for dxDateRangeBox', function(assert) {
        const value = ['2025-08-01', '{}'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxDateRangeBox', value);
            assert.ok(false, `parsing should fail for [${value}] for dxDateRangeBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxDateRangeBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for array of more than two items for dxDateRangeBox', function(assert) {
        const value = ['2025-08-01', '2025-08-02', '2025-08-04'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxDateRangeBox', value);
            assert.ok(false, `parsing should fail for ${value} for dxDateRangeBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxDateRangeBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'date range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxHtmlEditor', function(assert) {
        const value = 'string';
        assert.strictEqual(parseResultForEditorType('', 'dxHtmlEditor', value), value, 'string is correct value for dxHtmlEditor');
    });

    QUnit.test('should throw an error for an array value for dxHtmlEditor', function(assert) {
        const value = ['string'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxHtmlEditor', value);
            assert.ok(false, `parsing should fail for [${value}] for dxHtmlEditor`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxHtmlEditor`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'string', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxNumberBox', function(assert) {
        const value = '3.14';
        assert.strictEqual(parseResultForEditorType('', 'dxNumberBox', value), value, '3.14 is correct value for dxNumberBox');
    });

    QUnit.test('should throw an error for an incorrect value for dxNumberBox', function(assert) {
        const value = 'string';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxNumberBox', value);
            assert.ok(false, `parsing should fail for '${value}' for dxNumberBox`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxNumberBox`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxSlider', function(assert) {
        const value = '3.14';
        assert.strictEqual(parseResultForEditorType('', 'dxSlider', value), value, '3.14 is correct value for dxSlider');
    });

    QUnit.test('should throw an error for an incorrect value for dxSlider', function(assert) {
        const value = 'string';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxSlider', value);
            assert.ok(false, `parsing should fail for '${value}' for dxSlider`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxSlider`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should return correct value for dxRangeSlider', function(assert) {
        const value = ['54.14', '0'];
        assert.strictEqual(parseResultForEditorType('', 'dxRangeSlider', value), value, 'set correct value for dxRangeSlider');
    });

    QUnit.test('should throw an error for string value for dxRangeSlider', function(assert) {
        const value = '{}';
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxRangeSlider', value);
            assert.ok(false, `parsing should fail for '${value}' for dxRangeSlider`);
        } catch(error) {
            assert.ok(true, `parsing failed for '${value}' for dxRangeSlider`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `'${value}'`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for array of one item for dxRangeSlider', function(assert) {
        const value = ['2025'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxRangeSlider', value);
            assert.ok(false, `parsing should fail for [${value}] for dxRangeSlider`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxRangeSlider`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for incorrect array item for dxRangeSlider', function(assert) {
        const value = ['2025', '{}'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxRangeSlider', value);
            assert.ok(false, `parsing should fail for [${value}] for dxRangeSlider`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxRangeSlider`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    QUnit.test('should throw an error for array of more than two items for dxRangeSlider', function(assert) {
        const value = ['2025', '2026', '2022'];
        const errorsSpy = sinon.spy(errors, 'Error');

        try {
            parseResultForEditorType('dataField', 'dxRangeSlider', value);
            assert.ok(false, `parsing should fail for ${value} for dxRangeSlider`);
        } catch(error) {
            assert.ok(true, `parsing failed for [${value}] for dxRangeSlider`);
            assert.strictEqual(errorsSpy.calledOnce, true, 'one error was thrown');
            assert.strictEqual(errorsSpy.lastCall.args[0], 'E1064', 'the error had correct number');
            assert.strictEqual(errorsSpy.lastCall.args[1], 'dataField', 'the error had correct dataField');
            assert.strictEqual(errorsSpy.lastCall.args[2], `[${value}]`, 'the error had correct value');
            assert.strictEqual(errorsSpy.lastCall.args[3], 'number range', 'the error had expected type');
        }
        errorsSpy.restore();
    });

    ['dxAutocomplete', 'dxDropDownBox', 'dxLookup', 'dxRadioGroup', 'dxSelectBox', 'dxTagBox', 'dxTextArea', 'dxTextBox'].forEach((editorType) => {
        QUnit.test(`should return same string value for ${editorType}`, function(assert) {
            const value = 'string';
            assert.strictEqual(parseResultForEditorType('', editorType, value), value, `string value returned for ${editorType}`);
        });

        QUnit.test(`should return same array value for ${editorType}`, function(assert) {
            const value = ['string'];
            assert.strictEqual(parseResultForEditorType('', editorType, value), value, `array value returned for ${editorType}`);
        });
    });
});
