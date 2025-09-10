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
    [
        {
            editorType: 'dxCalendar',
            correctValue: '2025-08-29',
            incorrectValues: [{ value: '{}', description: 'not a date' }],
            expectedType: 'date',
        },
        {
            editorType: 'dxColorBox',
            correctValue: '#fff',
            incorrectValues: [{ value: '{}', description: 'not a color' }],
            expectedType: 'color',
        },
        {
            editorType: 'dxDateBox',
            correctValue: '2025-08-29',
            incorrectValues: [{ value: '{}', description: 'not a date' }],
            expectedType: 'date',
        },
        {
            editorType: 'dxHtmlEditor',
            correctValue: 'string',
            incorrectValues: [{ value: ['string'], description: 'array' }],
            expectedType: 'string',
        },
        {
            editorType: 'dxNumberBox',
            correctValue: '3.14',
            incorrectValues: [{ value: 'five', description: 'not a number' }],
            expectedType: 'number',
        },
        {
            editorType: 'dxSlider',
            correctValue: '3.14',
            incorrectValues: [{ value: 'five', description: 'not a number' }],
            expectedType: 'number',
        },
    ].forEach(({ editorType, correctValue, incorrectValues, expectedType }) => {
        QUnit.test(`should return correct value for ${editorType}`, function(assert) {
            const value = correctValue;

            assert.strictEqual(parseResultForEditorType('', editorType, value), value, `${JSON.stringify(value)} is correct value for ${editorType}`);
        });

        incorrectValues.forEach(({ value, description }) => {
            QUnit.test(`should throw an error for ${description} value for ${editorType}`, function(assert) {
                assert.throws(
                    () => parseResultForEditorType('dataField', editorType, value),
                    errors.Error('E1064', 'dataField', JSON.stringify(value), expectedType),
                    `error for ${JSON.stringify(value)} is thrown with correct parameters`,
                );
            });
        });
    });

    [{
        editorType: 'dxDateRangeBox',
        correctValues: [
            { value: ['2025-08-29', '2025-08-29'], description: 'two dates' },
            { value: ['2025-08-29'], description: 'one date' },
            { value: [], description: 'an empty array' },
        ],
        incorrectValues: [
            { value: '{}', description: 'string' },
            { value: ['2025-08-29', '{}'], description: 'array with not a date' },
            { value: ['2025-08-29', '2025-08-29', '2025-08-29'], description: 'array of more than two items' },
        ],
        expectedType: 'date range'
    }, {
        editorType: 'dxRangeSlider',
        correctValues: [
            { value: ['3.14', '3.14'], description: 'two numbers' },
            { value: ['3.14'], description: 'one number' },
            { value: [], description: 'an empty array' },
        ],
        incorrectValues: [
            { value: '{}', description: 'string' },
            { value: ['3.14', 'five'], description: 'array with not a number' },
            { value: ['3.14', '3.14', '3.14'], description: 'array of more than two items' },
        ],
        expectedType: 'number range'
    }].forEach(({ editorType, correctValues, incorrectValues, expectedType }) => {
        correctValues.forEach(({ value, description }) => {
            QUnit.test(`should return correct value for ${description} for ${editorType}`, function(assert) {
                assert.deepEqual(parseResultForEditorType('', editorType, value), value, `${JSON.stringify(value)} is correct value for ${editorType}`);
            });
        });

        incorrectValues.forEach(({ value, description }) => {
            QUnit.test(`should throw an error for ${description} value for ${editorType}`, function(assert) {
                assert.throws(
                    () => parseResultForEditorType('dataField', editorType, value),
                    errors.Error('E1064', 'dataField', JSON.stringify(value), expectedType),
                    `error for ${JSON.stringify(value)} is thrown with correct parameters`,
                );
            });
        });
    });

    ['dxCheckBox', 'dxSwitch'].forEach((editorType) => {
        QUnit.test(`should return correct value for ${editorType}`, function(assert) {
            assert.strictEqual(parseResultForEditorType('', editorType, 'false'), false, 'returned false for string "false"');
            assert.strictEqual(parseResultForEditorType('', editorType, 'true'), true, 'returned true for string "true"');
        });

        QUnit.test(`should throw an error for a not boolean value for ${editorType}`, function(assert) {
            const value = '.';
            assert.throws(
                () => parseResultForEditorType('dataField', editorType, value),
                errors.Error('E1064', 'dataField', JSON.stringify(value), 'boolean'),
                `error for ${JSON.stringify(value)} is thrown with correct parameters`,
            );
        });
    });

    ['dxAutocomplete', 'dxDropDownBox', 'dxLookup', 'dxRadioGroup', 'dxSelectBox', 'dxTagBox', 'dxTextArea', 'dxTextBox'].forEach((editorType) => {
        QUnit.test(`should return same string value for ${editorType}`, function(assert) {
            const value = 'string';
            assert.strictEqual(parseResultForEditorType('', editorType, value), value, `${JSON.stringify(value)} value returned for ${editorType}`);
        });

        QUnit.test(`should return same array value for ${editorType}`, function(assert) {
            const value = ['string'];
            assert.deepEqual(parseResultForEditorType('', editorType, value), value, `${JSON.stringify(value)} returned for ${editorType}`);
        });
    });

    [' value', 'value', '    value   ', 'value    '].forEach((value) => {
        QUnit.test(`should return trimmed value if spaces are around the value: ${value}`, function(assert) {
            assert.strictEqual(parseResultForEditorType('', '', value), 'value', 'trimmed value returned');
        });
    });

    [['  value', 'value  '], ['value', '    value  ']].forEach((value) => {
        QUnit.test(`should return trimmed values in array if spaces are around them: ${value}`, function(assert) {
            assert.deepEqual(parseResultForEditorType('', '', value), ['value', 'value'], 'trimmed value returned');
        });
    });
});
