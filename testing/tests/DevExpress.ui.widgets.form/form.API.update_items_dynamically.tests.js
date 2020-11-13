import $ from 'jquery';
import 'ui/form/ui.form';
import 'ui/form/ui.form.layout_manager';

import 'common.css!';
import 'generic_light.css!';

const FORM_LAYOUT_MANAGER_CLASS = 'dx-layout-manager';
const TABPANEL_CONTAINER = 'dx-tabpanel-container';
const FIELD_ITEM_LABEL_CONTENT_CLASS = 'dx-field-item-label-content';

const { testStart, module, test } = QUnit;

class FormTestWrapper {
    constructor(options) {
        this._form = this._getTestContainer().dxForm(options).dxForm('instance');
        this._formContentReadyStub = sinon.stub();
        this._form.on('contentReady', this._formContentReadyStub);
        this.updateLayoutManagerStubs();
    }

    _getTestContainer() {
        return $('#form');
    }

    _createLayoutManagerStubs($form) {
        const layoutManagers = $form.find(`.${FORM_LAYOUT_MANAGER_CLASS}`).toArray().map(item => $(item).dxLayoutManager('instance'));
        return layoutManagers.map(layoutManager => {
            const stub = sinon.stub();
            layoutManager.on('contentReady', stub);
            return stub;
        });
    }

    _getLabelWidth(text) {
        const $label = this._form._rootLayoutManager._renderLabel({ text: text, location: 'left' }).appendTo(this._getTestContainer());
        const width = $label.children().first().width();
        $label.remove();
        return width;
    }

    _findLabelTextsInColumn($container, columnIndex) {
        return $container.find(`.dx-col-${columnIndex} .${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    }

    _checkLabelTextsWidthByEtalon($labelTexts, etalonLabelText) {
        QUnit.assert.ok($labelTexts.length > 0, 'labels texts are rendered');
        const etalonLabelWidth = this._getLabelWidth(`${etalonLabelText}:`);
        $labelTexts.toArray().forEach(text => {
            const $text = $(text);
            const textWidth = $text.width();
            QUnit.assert.roughEqual(textWidth, etalonLabelWidth, 1, `width of the ${$text.text()}`);
        });
    }

    setOption(id, optionName, value) {
        this._form.option(`${id}.${optionName}`, value);
    }

    setItemOption(id, optionName, value) {
        this._form.itemOption.apply(this._form, arguments);
    }

    beginUpdate() {
        this._form.beginUpdate();
    }

    endUpdate() {
        this._form.endUpdate();
    }

    updateLayoutManagerStubs() {
        this._contentReadyStubs = this._createLayoutManagerStubs(this._form.$element());
    }

    checkValidationSummaryContent(expectedMessages) {
        const $itemsContent = this._form.$element().find('.dx-validationsummary-item-content');

        QUnit.assert.equal($itemsContent.length, expectedMessages.length, 'validation summary items');
        $itemsContent.toArray().forEach((item, index) => {
            QUnit.assert.strictEqual($(item).text(), expectedMessages[index], `${index} item text of the validation summary`);
        });
    }

    checkValidationResult({ isValid, brokenRulesCount, validatorsCount }) {
        const result = this._form.validate();
        QUnit.assert.equal(result.isValid, isValid, 'isValid of validation result');
        QUnit.assert.equal(result.brokenRules.length, brokenRulesCount, 'brokenRules count of validation result');
        QUnit.assert.equal(result.validators.length, validatorsCount, 'validators count of validation result');
    }

    checkFormsReRender(message = '', isReRender = false) {
        QUnit.assert.equal(this._formContentReadyStub.callCount, Number(isReRender), `${message}, form is ${isReRender ? '' : 'not'} re-render`);
        this._formContentReadyStub.reset();
    }

    checkLayoutManagerRendering(expectedRenderingArray, message = '') {
        this._contentReadyStubs.forEach((stub, index) => {
            const expected = expectedRenderingArray[index];
            if(stub.callCount > 1) {
                QUnit.assert.equal(stub.callCount, 1, 'the content ready event is many times thrown');
            }
            QUnit.assert.equal(stub.callCount === 1, expected, `${message}, ${index} layoutManager is ${expected ? '' : 'not'} re-render`);
        });
        this._contentReadyStubs.forEach(stub => stub.reset());
    }

    checkSimpleItem(id, expectedValue, expectedLabel) {
        const editor = this._form.getEditor(id);
        const attrID = editor.option('inputAttr.id');
        const labelText = $(`[for='${attrID}'] .dx-field-item-label-text`).text();
        QUnit.assert.equal(editor.option('value'), expectedValue, `editor value of ${id}`);
        QUnit.assert.strictEqual(labelText, `${expectedLabel}:`, `label of ${id}`);
    }

    checkEditorInstanceRemoved(id) {
        const editor = this._form.getEditor(id);
        QUnit.assert.notOk(!!editor, `editor of ${id} doesn't contains in the Form`);
    }

    checkLabelText(itemSelector, expectedText) {
        const labelText = $(itemSelector).find('.dx-field-item-label-text').text();
        QUnit.assert.strictEqual(labelText, `${expectedText}:`, 'text of label');
    }

    checkHelpText(itemSelector, expectedText) {
        const helpText = $(itemSelector).find('.dx-field-item-help-text').text();
        QUnit.assert.strictEqual(helpText, `${expectedText}`, 'text of helpText');
    }

    checkItemElement(selector, expected, message) {
        QUnit.assert.equal(this._form.$element().find(selector).length > 0, expected, message || 'item element');
    }

    checkGroupCaption(groupSelector, expectedCaption) {
        QUnit.assert.strictEqual(this._form.$element().find(`${groupSelector} .dx-form-group-caption`).text(), expectedCaption, 'caption of group');
    }

    checkTabTitle(tabSelector, expectedTitle) {
        QUnit.assert.strictEqual(this._form.$element().find(`${tabSelector} .dx-tab-text`).text(), expectedTitle, 'caption of tab');
    }

    checkLabelsWidthInGroup({ columnIndex, groupColumnIndex = 0, etalonLabelText }) {
        const $groups = this._form._getGroupElementsInColumn(this._getTestContainer(), columnIndex);
        const $texts = this._findLabelTextsInColumn($groups, groupColumnIndex);
        this._checkLabelTextsWidthByEtalon($texts, etalonLabelText);
    }

    checkLabelsWidthInTab({ tabColumnIndex, etalonLabelText }) {
        const $tabContainers = this._form.$element().find(`.${TABPANEL_CONTAINER}`);
        const $texts = this._findLabelTextsInColumn($tabContainers, tabColumnIndex);
        this._checkLabelTextsWidthByEtalon($texts, etalonLabelText);
    }

    checkLabelsBySelector({ itemSelector, columnIndex = 0, etalonLabelText }) {
        const $texts = this._form.$element().find(`${itemSelector}.dx-col-${columnIndex} .${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
        this._checkLabelTextsWidthByEtalon($texts, etalonLabelText);
    }

    checkRequired(selector, expected, message) {
        QUnit.assert.equal(this._form.$element().find(`${selector} .dx-field-item-required-mark`).length > 0, expected, message || 'item required');
    }
}

testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

module('Group item. Use the option method', function() {
    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        cssClass: 'test-item',
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setOption('items[1].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0]', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setOption('items[1].items[0]', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change items of group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: ['dataField2']
                }
            ]
        });

        testWrapper.setOption('items[1]', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption('items[1]', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change visible of first group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        cssClass: 'test-group',
                        caption: 'Test Caption',
                        items: [{
                            dataField: 'dataField2',
                            cssClass: 'test-item'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-group', false, 'group item element');
        testWrapper.checkItemElement('.test-item', false, 'simple item element');

        testWrapper.setOption('items[1].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-group', true, 'group item element');
        testWrapper.checkGroupCaption('.test-group', 'Test Caption');
        testWrapper.checkItemElement('.test-item', true, 'simple item element');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change items of first group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: ['dataField2']
                    }]
                }
            ]
        });

        const items = ['dataField11', 'dataField12'].map((dataField, index) => ({
            itemType: 'group',
            cssClass: `group${index}`,
            items: [{
                dataField,
                editorType: 'dxTextBox'
            }]
        }));
        testWrapper.setOption('items[1]', 'items', items);
        const message = 'items: [{itemType: "group", items: ["dataField11"]}, {itemType: "group", items: ["dataField12"]}]';
        testWrapper.checkLayoutManagerRendering([false, true, false], message);
        testWrapper.checkFormsReRender(message);
        testWrapper.checkItemElement('.group0', true, 'first group item element');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkItemElement('.group1', true, 'second group item element');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption('items[1]', 'items', [{
            itemType: 'group',
            cssClass: 'group3',
            items: [{
                dataField: 'dataField3',
                editorType: 'dxTextBox'
            }]
        }]);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'items: [{itemType: "group", items:["dataField3"]}]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkItemElement('.group3', true, 'third group item element');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'dataField2',
                            cssClass: 'test-item'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setOption('items[1].items[0].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0].items[0]', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setOption('items[1].items[0].items[0]', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change items of last group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: ['dataField2']
                    }]
                }
            ]
        });

        const items = ['dataField11', 'dataField12'].map(dataField => ({
            dataField,
            editorType: 'dxTextBox'
        }));
        testWrapper.setOption('items[1].items[0]', 'items', items);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption('items[1].items[0]', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change visible of dataField2 and dataField3)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        cssClass: 'test-item2'
                    }]
                },
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField3',
                        cssClass: 'test-item3'
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false in the first group');
        testWrapper.checkFormsReRender('visible: false in the first group');
        testWrapper.checkItemElement('.test-item2', false);

        testWrapper.setOption('items[2].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false in the second group');
        testWrapper.checkFormsReRender('visible: false in the second group');
        testWrapper.checkItemElement('.test-item3', false);

        testWrapper.setOption('items[1].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true in the first group');
        testWrapper.checkFormsReRender('visible: true in the first group');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item2', true);

        testWrapper.setOption('items[2].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true in the second group');
        testWrapper.checkFormsReRender('visible: true in the second group');
        testWrapper.checkSimpleItem('dataField3', 'DataField3', 'Data Field 3');
        testWrapper.checkItemElement('.test-item3', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change items in the both groups)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: ['dataField2']
                },
                {
                    itemType: 'group',
                    items: ['dataField3']
                }
            ]
        });

        testWrapper.setOption('items[1]', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true, false], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption('items[2]', 'items',
            ['dataField21', 'dataField22'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField21", "dataField22"]');
        testWrapper.checkFormsReRender('items: ["dataField21", "dataField22"]');
        testWrapper.checkSimpleItem('dataField21', '', 'Data Field 21');
        testWrapper.checkSimpleItem('dataField22', '', 'Data Field 22');
        testWrapper.checkEditorInstanceRemoved('dataField3');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change options of dataField2 and dataField3)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        cssClass: 'test-item2'
                    }]
                },
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField3',
                        cssClass: 'test-item3'
                    }]
                }
            ]
        });

        testWrapper.beginUpdate();

        testWrapper.setOption('items[1].items[0]', 'label', { text: 'Test Label 2' });
        testWrapper.setOption('items[1].items[0]', 'name', 'Test Name 2');
        testWrapper.setOption('items[1].items[0]', 'helpText', 'Test help text 2');

        testWrapper.setOption('items[2].items[0]', 'label', { text: 'Test Label 3' });
        testWrapper.setOption('items[2].items[0]', 'name', 'Test Name 3');
        testWrapper.setOption('items[2].items[0]', 'helpText', 'Test help text 3');

        testWrapper.endUpdate();

        testWrapper.checkFormsReRender();
        testWrapper.checkLayoutManagerRendering([false, true, true]);
        testWrapper.checkLabelText('.test-item2', 'Test Label 2');
        testWrapper.checkHelpText('.test-item2', 'Test help text 2');
        testWrapper.checkLabelText('.test-item3', 'Test Label 3');
        testWrapper.checkHelpText('.test-item3', 'Test help text 3');
    });

    test('Set { items: [{itemType: \'group\', items:[{itemType: \'group\', items:[\'dataField2\']}, \'dataField1\']}] }, change required of dataField1 and change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            items: [
                {
                    itemType: 'group',
                    items: [
                        {
                            itemType: 'group',
                            items: [{
                                dataField: 'dataField2',
                                cssClass: 'test-item2'
                            }]
                        },
                        {
                            dataField: 'dataField1',
                            cssClass: 'test-item1'
                        }
                    ]
                }
            ]
        });

        testWrapper.setOption('items[0].items[1]', 'isRequired', true);
        testWrapper.checkFormsReRender('change isRequired of dataField1');
        testWrapper.checkLayoutManagerRendering([false, true, false], 'change isRequired of dataField1');
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');

        testWrapper.updateLayoutManagerStubs();
        testWrapper.setOption('items[0].items[0].items[0]', 'visible', false);
        testWrapper.checkFormsReRender('change visible of dataField2');
        testWrapper.checkLayoutManagerRendering([false, false, true], 'change visible of dataField2');
        testWrapper.checkItemElement('.test-item2', false);
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');
    });
});

module('Tabbed item. Use the option method', function() {
    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [{
                            cssClass: 'test-item',
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].tabs[0].items[0]', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setOption('items[1].tabs[0].items[0]', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change items of tab)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: ['dataField2']
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].tabs[0]', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption('items[1].tabs[0]', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [{
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[1].tabs[0].items[0]', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setOption('items[1].tabs[0].items[0]', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [{
                            itemType: 'group',
                            items: [{
                                cssClass: 'test-item',
                                dataField: 'dataField2'
                            }]
                        }]
                    }]
                }
            ]
        });

        const id = 'items[1].tabs[0].items[0].items[0]';
        testWrapper.setOption(id, 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setOption(id, 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change items of group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [{
                            itemType: 'group',
                            items: ['dataField2']
                        }]
                    }]
                }
            ]
        });

        const id = 'items[1].tabs[0].items[0]';
        testWrapper.setOption(id, 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setOption(id, 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        items: [{
                            itemType: 'group',
                            items: [{
                                dataField: 'dataField2'
                            }]
                        }]
                    }]
                }
            ]
        });

        const id = 'items[1].tabs[0].items[0].items[0]';
        testWrapper.setOption(id, 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setOption(id, 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items: [{itemType: \'tabbed\', tabs:[{items: [\'dataField2\']}]}] }, change visible of tabbed item)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'tabbed',
                        cssClass: 'test-tab',
                        tabs: [{
                            title: 'Test Title',
                            items: ['dataField2']
                        }]
                    }]
                }
            ]
        });

        const id = 'items[1].items[0]';
        testWrapper.setOption(id, 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-tab', false, 'tabbed item element');

        testWrapper.setOption(id, 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-tab', true, 'tabbed item element');
        testWrapper.checkTabTitle('.test-tab', 'Test Title');
    });

    test('Set { items: [{itemType: \'tabbed\', tabs[{items:[{itemType: \'group\', items:[\'dataField2\']}, \'dataField1\']}] }, change required of dataField1 and change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            items: [
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [
                            {
                                itemType: 'group',
                                items: [{
                                    dataField: 'dataField2',
                                    cssClass: 'test-item2'
                                }]
                            },
                            {
                                dataField: 'dataField1',
                                cssClass: 'test-item1'
                            }
                        ]
                    }]
                }
            ]
        });

        testWrapper.setOption('items[0].tabs[0].items[1]', 'isRequired', true);
        testWrapper.checkFormsReRender('change isRequired of dataField1');
        testWrapper.checkLayoutManagerRendering([false, true, false], 'change isRequired of dataField1');
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');

        testWrapper.updateLayoutManagerStubs();
        testWrapper.setOption('items[0].tabs[0].items[0].items[0]', 'visible', false);
        testWrapper.checkFormsReRender('change visible of dataField2');
        testWrapper.checkLayoutManagerRendering([false, false, true], 'change visible of dataField2');
        testWrapper.checkItemElement('.test-item2', false);
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');
    });
});

module('Group item. Use the itemOption method', function() {
    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        cssClass: 'test-item',
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setItemOption('dataField2', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change options of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        cssClass: 'test-item',
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', {
            label: { text: 'Test Label' },
            name: 'Test Name',
            helpText: 'Test help text'
        });
        testWrapper.checkFormsReRender('change options');
        testWrapper.checkLayoutManagerRendering([false, true], 'change options');
        testWrapper.checkLabelText('.test-item', 'Test Label');
        testWrapper.checkHelpText('.test-item', 'Test help text');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setItemOption('dataField2', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change items of group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: ['dataField2']
                }
            ]
        });

        testWrapper.setItemOption('group1', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('group1', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}] }, change items of group, change visible of dataField12)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: ['dataField2']
                }
            ]
        });

        testWrapper.setItemOption('group1', 'items',
            ['dataField11', 'dataField12'].map((dataField, index) => ({
                dataField,
                editorType: 'dxTextBox',
                cssClass: `.test-item1${index + 1}`
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');

        testWrapper.setItemOption('group1.dataField12', 'visible', false);
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item12', false, 'item element of the dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change visible of first group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        cssClass: 'test-group',
                        caption: 'Test Caption',
                        items: [{
                            dataField: 'dataField2',
                            cssClass: 'test-item'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('TestCaption', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-group', false, 'group item element');
        testWrapper.checkItemElement('.test-item', false, 'simple item element');

        testWrapper.setItemOption('TestCaption', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-group', true, 'group item element');
        testWrapper.checkGroupCaption('.test-group', 'Test Caption');
        testWrapper.checkItemElement('.test-item', true, 'simple item element');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change items of first group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: [{
                        itemType: 'group',
                        items: ['dataField2']
                    }]
                }
            ]
        });

        const items = ['dataField11', 'dataField12'].map((dataField, index) => ({
            itemType: 'group',
            cssClass: `group${index}`,
            items: [{
                dataField,
                editorType: 'dxTextBox'
            }]
        }));
        testWrapper.setItemOption('group1', 'items', items);
        const message = 'items: [{itemType: "group", items: ["dataField11"]}, {itemType: "group", items: ["dataField12"]}]';
        testWrapper.checkLayoutManagerRendering([false, true, false], message);
        testWrapper.checkFormsReRender(message);
        testWrapper.checkItemElement('.group0', true, 'first group item element');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkItemElement('.group1', true, 'second group item element');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('group1', 'items', [{
            itemType: 'group',
            cssClass: 'group3',
            items: [{
                dataField: 'dataField3',
                editorType: 'dxTextBox'
            }]
        }]);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'items: [{itemType: "group", items:["dataField3"]}]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkItemElement('.group3', true, 'third group item element');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'dataField2',
                            cssClass: 'test-item'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setItemOption('dataField2', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change items of second group, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        name: 'group2',
                        items: [{
                            dataField: 'dataField2',
                            cssClass: 'test-item'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('group2', 'items',
            ['dataField11', 'dataField12'].map((dataField, index) => ({
                dataField,
                editorType: 'dxTextBox',
                cssClass: `.test-item1${index + 1}`
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: [dataField11, dataField12]');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('group2.dataField11', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item11', false, 'item element of the dataField11');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setItemOption('dataField2', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[{itemType: \'group\', items: [\'dataField2\']}]}] }, change items of last group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        name: 'group2',
                        items: ['dataField2']
                    }]
                }
            ]
        });

        const items = ['dataField11', 'dataField12'].map(dataField => ({
            dataField,
            editorType: 'dxTextBox'
        }));
        testWrapper.setItemOption('group2', 'items', items);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('group2', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change visible of dataField2 and dataField3)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        cssClass: 'test-item2'
                    }]
                },
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField3',
                        cssClass: 'test-item3'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false in the first group');
        testWrapper.checkFormsReRender('visible: false in the first group');
        testWrapper.checkItemElement('.test-item2', false);

        testWrapper.setItemOption('dataField3', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false in the second group');
        testWrapper.checkFormsReRender('visible: false in the second group');
        testWrapper.checkItemElement('.test-item3', false);

        testWrapper.setItemOption('dataField2', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true in the first group');
        testWrapper.checkFormsReRender('visible: true in the first group');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item2', true);

        testWrapper.setItemOption('dataField3', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true in the second group');
        testWrapper.checkFormsReRender('visible: true in the second group');
        testWrapper.checkSimpleItem('dataField3', 'DataField3', 'Data Field 3');
        testWrapper.checkItemElement('.test-item3', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change items in the both groups)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: ['dataField2']
                },
                {
                    itemType: 'group',
                    name: 'group2',
                    items: ['dataField3']
                }
            ]
        });

        testWrapper.setItemOption('group1', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true, false], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('group2', 'items',
            ['dataField21', 'dataField22'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField21", "dataField22"]');
        testWrapper.checkFormsReRender('items: ["dataField21", "dataField22"]');
        testWrapper.checkSimpleItem('dataField21', '', 'Data Field 21');
        testWrapper.checkSimpleItem('dataField22', '', 'Data Field 22');
        testWrapper.checkEditorInstanceRemoved('dataField3');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items:[\'dataField2\']}, {itemType: \'group\', items:[\'dataField3\']}] }, change options of dataField2 and dataField3)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2',
                dataField3: 'DataField3'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        cssClass: 'test-item2'
                    }]
                },
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField3',
                        cssClass: 'test-item3'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', {
            label: { text: 'Test Label 2' },
            name: 'Test Name 2',
            helpText: 'Test help text 2'
        });
        testWrapper.checkFormsReRender('change options of dataField2');
        testWrapper.checkLayoutManagerRendering([false, true, false], 'change options of dataField2');
        testWrapper.checkLabelText('.test-item2', 'Test Label 2');
        testWrapper.checkHelpText('.test-item2', 'Test help text 2');

        testWrapper.setItemOption('dataField3', {
            label: { text: 'Test Label 3' },
            name: 'Test Name 3',
            helpText: 'Test help text 3'
        });
        testWrapper.checkFormsReRender('change options of dataField3');
        testWrapper.checkLayoutManagerRendering([false, false, true], 'change options of dataField3');
        testWrapper.checkLabelText('.test-item3', 'Test Label 3');
        testWrapper.checkHelpText('.test-item3', 'Test help text 3');
    });

    test('Set { items: [{itemType: \'group\', items:[{itemType: \'group\', items:[\'dataField2\']}, \'dataField1\']}] }, change required of dataField1 and change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            items: [
                {
                    itemType: 'group',
                    items: [
                        {
                            itemType: 'group',
                            items: [{
                                dataField: 'dataField2',
                                cssClass: 'test-item2'
                            }]
                        },
                        {
                            dataField: 'dataField1',
                            cssClass: 'test-item1'
                        }
                    ]
                }
            ]
        });

        testWrapper.setItemOption('dataField1', {
            isRequired: true
        });
        testWrapper.checkFormsReRender('change isRequired of dataField1');
        testWrapper.checkLayoutManagerRendering([false, true, false], 'change isRequired of dataField1');
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');

        testWrapper.updateLayoutManagerStubs();
        testWrapper.setItemOption('dataField2', {
            visible: false
        });
        testWrapper.checkFormsReRender('change visible of dataField2');
        testWrapper.checkLayoutManagerRendering([false, false, true], 'change visible of dataField2');
        testWrapper.checkItemElement('.test-item2', false);
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');
    });
});

module('Tabbed item. Use the itemOption method', function() {
    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [{
                            cssClass: 'test-item',
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.dataField2', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setItemOption('tab1.dataField2', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {temType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change items of tab)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: ['dataField2']
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('tab1', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: \'dataField2\'}]}] }, change editorOptions of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [{
                            dataField: 'dataField2'
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.dataField2', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setItemOption('tab1.dataField2', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [{
                            itemType: 'group',
                            name: 'group1',
                            items: [{
                                cssClass: 'test-item',
                                dataField: 'dataField2'
                            }]
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.group1.dataField2', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-item', false);

        testWrapper.setItemOption('tab1.group1.dataField2', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-item', true);
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change items of group)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [{
                            itemType: 'group',
                            name: 'group1',
                            items: ['dataField2']
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.group1', 'items',
            ['dataField11', 'dataField12'].map(dataField => ({
                dataField,
                editorType: 'dxTextBox'
            }))
        );
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField11", "dataField12"]');
        testWrapper.checkFormsReRender('items: ["dataField11", "dataField12"]');
        testWrapper.checkSimpleItem('dataField11', '', 'Data Field 11');
        testWrapper.checkSimpleItem('dataField12', '', 'Data Field 12');
        testWrapper.checkEditorInstanceRemoved('dataField2');

        testWrapper.setItemOption('tab1.group1', 'items', [{
            dataField: 'dataField3',
            editorType: 'dxTextBox'
        }]);
        testWrapper.checkLayoutManagerRendering([false, false, true], 'items: ["dataField3"]');
        testWrapper.checkFormsReRender('items: ["dataField3"]');
        testWrapper.checkSimpleItem('dataField3', '', 'Data Field 3');
        testWrapper.checkEditorInstanceRemoved('dataField11');
        testWrapper.checkEditorInstanceRemoved('dataField12');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'tabbed\', tabs:[{items: [{itemType: \'group\', items:[\'dataField2\']}]}]}] }, change editorOptions of dataField2")', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [{
                            itemType: 'group',
                            name: 'group1',
                            items: [{
                                dataField: 'dataField2'
                            }]
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.group1.dataField2', 'editorOptions', { value: 'test value' });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { value: \'test value\' }');
        testWrapper.checkFormsReRender('editorOptions: { value: \'test value\' }');

        testWrapper.setItemOption('tab1.group1.dataField2', 'editorOptions', { });
        testWrapper.checkLayoutManagerRendering([false, false, false], 'editorOptions: { }');
        testWrapper.checkFormsReRender('editorOptions: { }');
    });

    test('Set { formData: {\'DataField1\', \'DataField2\'}, items: [\'dataField1\', {itemType: \'group\', items: [{itemType: \'tabbed\', tabs:[{items: [\'dataField2\']}]}] }, change visible of tabbed item)', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1',
                dataField2: 'DataField2'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: [{
                        itemType: 'tabbed',
                        cssClass: 'test-tab',
                        name: 'tabbedItem',
                        tabs: [{
                            title: 'Test Title',
                            items: ['dataField2']
                        }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('group1.tabbedItem', 'visible', false);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: false');
        testWrapper.checkFormsReRender('visible: false');
        testWrapper.checkItemElement('.test-tab', false, 'tabbed item element');

        testWrapper.setItemOption('group1.tabbedItem', 'visible', true);
        testWrapper.checkLayoutManagerRendering([false, true, false], 'visible: true');
        testWrapper.checkFormsReRender('visible: true');
        testWrapper.checkSimpleItem('dataField2', 'DataField2', 'Data Field 2');
        testWrapper.checkItemElement('.test-tab', true, 'tabbed item element');
        testWrapper.checkTabTitle('.test-tab', 'Test Title');
    });

    test('Set { items: [{itemType: \'tabbed\', tabs:[{items:[{itemType: \'group\', items:[\'dataField2\']}, \'dataField1\']}]}] }, change required of dataField1 and change visible of dataField2)', function() {
        const testWrapper = new FormTestWrapper({
            items: [
                {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'tab1',
                        items: [
                            {
                                itemType: 'group',
                                items: [{
                                    dataField: 'dataField2',
                                    cssClass: 'test-item2'
                                }]
                            },
                            {
                                dataField: 'dataField1',
                                cssClass: 'test-item1'
                            }
                        ]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('tab1.dataField1', {
            isRequired: true
        });
        testWrapper.checkFormsReRender('change isRequired of dataField1');
        testWrapper.checkLayoutManagerRendering([false, true, false], 'change isRequired of dataField1');
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');

        testWrapper.updateLayoutManagerStubs();
        testWrapper.setItemOption('tab1.dataField2', {
            visible: false
        });
        testWrapper.checkFormsReRender('change visible of dataField2');
        testWrapper.checkLayoutManagerRendering([false, false, true], 'change visible of dataField2');
        testWrapper.checkItemElement('.test-item2', false);
        testWrapper.checkRequired('.test-item1', true, 'required of dataField 1');
    });
});

module('Align labels', () => {
    test('Change visible of the simple item in the group when col count is 1', function() {
        const testWrapper = new FormTestWrapper({
            items: [{
                itemType: 'group',
                items: ['name', 'lastName']
            }, {
                itemType: 'group',
                name: 'group1',
                items: ['address', 'city']
            }]
        });

        testWrapper.setItemOption('group1.address', 'visible', false);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.setItemOption('group1.address', 'visible', true);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
    });

    test('Change items of the second group item when col count is 1', function() {
        const testWrapper = new FormTestWrapper({
            items: [{
                itemType: 'group',
                items: ['name', 'lastName']
            }, {
                itemType: 'group',
                name: 'group1',
                items: ['address', 'city']
            }]
        });

        testWrapper.setItemOption('group1', 'items', []);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.setItemOption('group1', 'items', [{ dataField: 'Description' }]);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Description' });
    });

    test('Change visible of the nested group item inside a group when col count is 1', function() {
        const testWrapper = new FormTestWrapper({
            items: [{
                itemType: 'group',
                items: ['name', 'lastName']
            }, {
                itemType: 'group',
                items: [{
                    itemType: 'group',
                    name: 'group1',
                    items: ['address', 'city']
                }]
            }]
        });

        testWrapper.setItemOption('group1', 'visible', false);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.setItemOption('group1', 'visible', true);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
    });

    test('Change visible of the simple item in the group when col count is 2', function() {
        const testWrapper = new FormTestWrapper({
            colCount: 2,
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'group',
                items: ['name', 'lastName']
            }, {
                itemType: 'group',
                name: 'group1',
                items: ['address', {
                    dataField: 'city',
                    label: {
                        text: 'Test City'
                    }
                }, 'mail']
            }]
        });

        testWrapper.setItemOption('group1.city', 'visible', false);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 1, etalonLabelText: 'Address' });

        testWrapper.setItemOption('group1.city', 'visible', true);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 1, etalonLabelText: 'Test City' });
    });

    test('Change items of the groups when groups has col count is 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'group',
                name: 'group1',
                colCount: 2,
                caption: 'Group 1',
                items: ['name', 'lastName']
            }, {
                itemType: 'group',
                name: 'group2',
                caption: 'Group 2',
                colCount: 2,
                items: ['address', 'mail']
            }]
        });

        testWrapper.setItemOption('group2', 'items', [
            'address', 'mail',
            {
                dataField: 'city',
                label: {
                    text: 'Test City'
                }
            }
        ]);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Test City' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('group1', 'items', ['name', 'description', 'lastName']);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Last Name' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Description' });
    });

    test('Change visible of the simple item and set colspan = 2 in the group with colCount = 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'group',
                name: 'group1',
                colCount: 2,
                items: ['name', 'description', 'lastName', 'city']
            }]
        });

        testWrapper.setItemOption('group1.name', 'visible', false);
        testWrapper.setItemOption('group1.description', 'colSpan', 2);

        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'City' });
    });

    test('Change visible of the simple item in the tab when col count is 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    colCount: 2,
                    items: ['name', 'lastName', { dataField: 'description' }, 'homeAddress']
                }]
            }]
        });

        testWrapper.setItemOption('title1.description', 'visible', false);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Home Address' });
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('title1.description', 'visible', true);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 1, etalonLabelText: 'Home Address' });
    });

    test('Change visible of the simple item in the tab when col count is 1', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: ['name', 'lastName', { dataField: 'homeAddress' }, 'Description']
                }]
            }]
        });

        testWrapper.setItemOption('title1.homeAddress', 'visible', false);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Description' });

        testWrapper.setItemOption('title1.homeAddress', 'visible', true);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Home Address' });

    });

    test('Change items of the simple item in the tab when col count is 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    colCount: 2,
                    items: ['name', 'lastName', 'description', 'homeAddress']
                }]
            }]
        });

        testWrapper.setItemOption('title1', 'items', ['name', 'lastName']);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Name' });
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('title1', 'items', ['name', 'lastName', 'description', 'homeAddress']);
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInTab({ tabColumnIndex: 1, etalonLabelText: 'Home Address' });
    });

    test('Change visible of the simple items of groups in the tab when col count of the groups is 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: [{
                        itemType: 'group',
                        colCount: 2,
                        name: 'group1',
                        items: ['name', 'lastName']
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        name: 'group2',
                        items: [{ dataField: 'description' }, { dataField: 'homeAddress' }]
                    }]
                }]
            }]
        });

        testWrapper.setItemOption('title1.group1.description', 'visible', false);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Home Address' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('title1.group1.homeAddress', 'visible', false);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Name' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('title1.group1.description', 'visible', true);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Last Name' });

        testWrapper.setItemOption('title1.group1.homeAddress', 'visible', true);
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Home Address' });
    });

    test('Labels of common layout align independently from labels of the tabbed item when parent col count is 1', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            items: [{
                dataField: 'name',
                cssClass: 'parent'
            }, {
                dataField: 'birthDate',
                cssClass: 'parent'
            }, {
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: [{
                        itemType: 'group',
                        colCount: 2,
                        name: 'group1',
                        items: ['note', 'phone']
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        name: 'group2',
                        items: [{ dataField: 'description' }, { dataField: 'homeAddress' }]
                    }]
                }]
            }]
        });

        testWrapper.setItemOption('title1.group2.description', 'visible', false);
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', etalonLabelText: 'Birth Date' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Home Address' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Phone' });

        testWrapper.setItemOption('title1.group2.description', 'visible', true);
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', etalonLabelText: 'Birth Date' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Home Address' });
    });

    test('Labels of common layout align independently from labels of the tabbed item when parent col count is 2', function() {
        const testWrapper = new FormTestWrapper({
            screenByWidth: () => 'lg',
            colCount: 2,
            items: [{
                dataField: 'name',
                cssClass: 'parent'
            }, {
                dataField: 'birthDate',
                cssClass: 'parent'
            }, {
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: [{
                        itemType: 'group',
                        colCount: 2,
                        name: 'group1',
                        items: ['note', 'phone']
                    }, {
                        itemType: 'group',
                        colCount: 2,
                        name: 'group2',
                        items: [{ dataField: 'description' }, { dataField: 'homeAddress' }]
                    }]
                }]
            }]
        });

        testWrapper.setItemOption('title1.group2.description', 'visible', false);
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', columnIndex: 0, etalonLabelText: 'Name' });
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', columnIndex: 1, etalonLabelText: 'Birth Date' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Home Address' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Phone' });

        testWrapper.setItemOption('title1.group2.description', 'visible', true);
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', columnIndex: 0, etalonLabelText: 'Name' });
        testWrapper.checkLabelsBySelector({ itemSelector: '.parent', columnIndex: 1, etalonLabelText: 'Birth Date' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 0, etalonLabelText: 'Description' });
        testWrapper.checkLabelsWidthInGroup({ columnIndex: 0, groupColumnIndex: 1, etalonLabelText: 'Home Address' });
    });
});

module('Validation', () => {
    test('Rendering new item with validation rules', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'validationRules', [{ type: 'required' }]);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
    });

    test('Rendering new simple item instead of a simple item with validation rules', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: [{
                        dataField: 'dataField2',
                        validationRules: [{ type: 'required' }]
                    }]
                }
            ]
        });

        testWrapper.setItemOption('group1', 'items', [{ dataField: 'dataField3' }]);
        testWrapper.checkValidationResult({ isValid: true, brokenRulesCount: 0, validatorsCount: 0 });
    });

    test('Rendering new items with validation rules', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }, {
                        dataField: 'dataField3'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'validationRules', [{ type: 'required' }]);
        testWrapper.setItemOption('dataField3', 'validationRules', [{ type: 'required' }]);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 2, validatorsCount: 2 });
    });

    test('Rendering new items with validation rules instead of items without validation rules in the group and check the validation summary', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            showValidationSummary: true,
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }, {
                        dataField: 'dataField3'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'validationRules', [{ type: 'required', message: 'dataField2 is required' }]);
        testWrapper.setItemOption('dataField3', 'validationRules', [{ type: 'required', message: 'dataField3 is required' }]);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 2, validatorsCount: 2 });
        testWrapper.checkValidationSummaryContent(['dataField2 is required', 'dataField3 is required']);
    });

    test('Rendering new simple item without validation rules instead of items with validation rules in the group and check the validation summary', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            showValidationSummary: true,
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: [{
                        dataField: 'dataField2',
                        validationRules: [{ type: 'required', message: 'dataField2 is required' }]
                    }, {
                        dataField: 'dataField3',
                        validationRules: [{ type: 'required', message: 'dataField3 is required' }]
                    }]
                }
            ]
        });

        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 2, validatorsCount: 2 });
        testWrapper.checkValidationSummaryContent(['dataField2 is required', 'dataField3 is required']);
        testWrapper.setItemOption('group1', 'items', [{ dataField: 'dataField2' }, { dataField: 'dataField3' }]);
        testWrapper.checkValidationResult({ isValid: true, brokenRulesCount: 0, validatorsCount: 0 });
        testWrapper.checkValidationSummaryContent([]);
    });

    test('Add new validator of simple item after validating form with the validation summary', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            showValidationSummary: true,
            items: ['dataField1',
                {
                    itemType: 'group',
                    name: 'group1',
                    items: [{
                        dataField: 'dataField2',
                        validationRules: [{ type: 'required', message: 'dataField2 is required' }]
                    }]
                }
            ]
        });

        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
        testWrapper.checkValidationSummaryContent(['dataField2 is required']);
        testWrapper.setItemOption('group1', 'items', [{
            dataField: 'dataField2',
            validationRules: [{ type: 'required', message: 'dataField2 is required' }]
        }, {
            dataField: 'dataField3',
            validationRules: [{ type: 'required', message: 'dataField3 is required' }]
        }]);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 2, validatorsCount: 2 });
        testWrapper.checkValidationSummaryContent(['dataField2 is required', 'dataField3 is required']);
    });

    test('Change the isRequired option of the simple item', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2'
                    }]
                }
            ]
        });

        testWrapper.setItemOption('dataField2', 'isRequired', true);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });

        testWrapper.setItemOption('dataField2', 'isRequired', false);
        testWrapper.checkValidationResult({ isValid: true, brokenRulesCount: 0, validatorsCount: 0 });
    });

    test('Change the visible option of the simple item', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        validationRules: [{ type: 'required' }]
                    }]
                }
            ]
        });

        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
        testWrapper.setItemOption('dataField2', 'visible', false);
        testWrapper.checkValidationResult({ isValid: true, brokenRulesCount: 0, validatorsCount: 0 });
        testWrapper.setItemOption('dataField2', 'visible', true);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
    });

    test('Change the visible option of the simple item with validationSummary', function() {
        const testWrapper = new FormTestWrapper({
            formData: {
                dataField1: 'DataField1'
            },
            showValidationSummary: true,
            items: ['dataField1',
                {
                    itemType: 'group',
                    items: [{
                        dataField: 'dataField2',
                        validationRules: [{ type: 'required' }]
                    }]
                }
            ]
        });

        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
        testWrapper.checkValidationSummaryContent(['Required']);

        testWrapper.setItemOption('dataField2', 'visible', false);
        testWrapper.checkValidationResult({ isValid: true, brokenRulesCount: 0, validatorsCount: 0 });
        testWrapper.checkValidationSummaryContent([]);

        testWrapper.setItemOption('dataField2', 'visible', true);
        testWrapper.checkValidationResult({ isValid: false, brokenRulesCount: 1, validatorsCount: 1 });
        testWrapper.checkValidationSummaryContent(['Required']);
    });

    [
        () => {},
        (form) => { form.itemOption('group1', 'visible', false); },
        (form) => { form.repaint(); },
        (form) => { form._refresh(); }
    ].forEach(additionalTestAction => {
        test(`field1.optionChange, field2.optionChange (T948708). Additional action: ${additionalTestAction.toString()}`, function(assert) {
            const form = new FormTestWrapper({
                items: [ {
                    itemType: 'group',
                    name: 'group1',
                    items: ['field1', {
                        itemType: 'group',
                        name: 'group2',
                        items: ['field2']
                    }]
                }]
            })._form;

            form.itemOption('group1.field1', 'colSpan', 1);
            additionalTestAction(form);
            form.itemOption('group1.group2.field2', 'colSpan', 1);

            assert.ok('no error is raised');
            assert.strictEqual(form.itemOption('group1.group2.field2').colSpan, 1);
        });
    });
});
