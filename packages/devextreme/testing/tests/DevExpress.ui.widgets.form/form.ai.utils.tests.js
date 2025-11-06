import { getFieldType, getItemFormatInfo } from '__internal/ui/form/form.ai.utils';

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

QUnit.module('getFieldType', () => {
    formItemComponents.forEach((editorType) => {
        QUnit.test(`should return correct format for ${editorType}`, function(assert) {
            const format = getFieldType(editorType);
            const expectedFormats = {
                dxDateBox: 'date',
                dxCalendar: 'date',
                dxDateRangeBox: 'dateRange',
                dxColorBox: 'color',
                dxCheckBox: 'boolean',
                dxSwitch: 'boolean',
                dxNumberBox: 'number',
                dxSlider: 'number',
                dxRangeSlider: 'numberRange',
            };

            assert.strictEqual(format, expectedFormats[editorType] || 'string', `${editorType} format is correct`);
        });
    });
});
