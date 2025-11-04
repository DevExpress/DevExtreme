import { getWidth } from 'core/utils/size';
import { EDITORS_WITHOUT_LABELS } from '__internal/ui/form/form.layout_manager.utils';
import 'generic_light.css!';
import $ from 'jquery';
import 'ui/autocomplete';
import 'ui/calendar';
import 'ui/date_box';
import 'ui/drop_down_box';
import 'ui/switch';
import 'ui/slider';
import 'ui/range_slider';

import {
    FIELD_ITEM_CLASS,
    FORM_GROUP_CLASS,
    FORM_LAYOUT_MANAGER_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS,
    FORM_FIELD_ITEM_COL_CLASS,
} from '__internal/ui/form/constants';

import {
    GET_LABEL_WIDTH_BY_TEXT_CLASS,
    FIELD_ITEM_OPTIONAL_MARK_CLASS,
    FIELD_ITEM_REQUIRED_MARK_CLASS,
    FIELD_ITEM_LABEL_TEXT_CLASS,
    renderLabel,
} from '__internal/ui/form/components/label';

import 'ui/html_editor';
import '../../helpers/ignoreQuillTimers.js';
import 'ui/lookup';
import 'ui/radio_group';
import 'ui/tag_box';
import 'ui/toolbar';
import 'ui/text_area';
import 'ui/date_range_box';

import responsiveBoxScreenMock from '../../helpers/responsiveBoxScreenMock.js';
import { isDefined } from 'core/utils/type.js';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

const EDITOR_LABEL_CLASS = 'dx-texteditor-label';
const EDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FIELD_ITEM_HELP_TEXT_CLASS = 'dx-field-item-help-text';
const TEXTBOX_CLASS = 'dx-textbox';

const editorTypes = [
    'dxAutocomplete',
    'dxCalendar',
    'dxCheckBox',
    'dxColorBox',
    'dxDateBox',
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
    'dxDateRangeBox',
];

QUnit.test('Form renders editors with the right label, labelMode', function(assert) {
    ['outside', 'hidden', 'static', 'floating'].forEach(labelMode => {
        const form = $('#form').dxForm({
            items: [ { dataField: 'name', editorType: 'dxTextBox' } ],
            labelMode
        }).dxForm('instance');

        const renderedWidget = $('#form').find('.dx-field-item .dx-textbox').dxTextBox('instance');
        const widgetLabelMode = renderedWidget.option('labelMode');
        const widgetLabelText = renderedWidget.option('label');

        assert.equal(widgetLabelMode, labelMode === 'outside' ? 'hidden' : labelMode);
        assert.equal(widgetLabelText, 'Name');

        form.dispose();
    });
});

[true, false].forEach((showColon) => {
    editorTypes.forEach((editorType) => {
        QUnit.test(`label text, editorType=${editorType},label.showColon=${showColon}`, function(assert) {
            const $form = $('#form').dxForm({
                items: [{
                    dataField: 'item1',
                    editorType,
                    label: {
                        showColon,
                    }
                }],
            });

            const $label = $form.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
            assert.equal($label.text(), `Item 1${showColon ? ':' : ''}`);
        });
    });
});

[undefined, true, false].forEach((isLabelVisible) => {
    ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
        editorTypes.forEach((editorType) => {
            QUnit.test(`label rendering, form.labelMode=${formLabelMode},label.visible=${isLabelVisible},editorType=${editorType}`, function(assert) {
                const $form = $('#form').dxForm({
                    labelMode: formLabelMode,
                    items: [{
                        dataField: 'item1',
                        editorType,
                        label: {
                            visible: isLabelVisible,
                            showColon: true,
                        }
                    }],
                });

                const $label = $form.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
                let needRenderLabel = isLabelVisible;
                if(needRenderLabel === undefined) {
                    if(EDITORS_WITHOUT_LABELS.indexOf(editorType) !== -1 && formLabelMode !== 'hidden') {
                        needRenderLabel = true;
                    } else if(formLabelMode === 'outside') {
                        needRenderLabel = true;
                    }
                }
                assert.equal($label.length, needRenderLabel ? 1 : 0, `label is ${needRenderLabel ? '' : 'not '}rendered`);
            });
        });
    });
});


['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
    [undefined, 'floating', 'hidden', 'static'].forEach((editorLabelMode) => {
        QUnit.test(`check editor labelMode, form.labelMode=${formLabelMode},editorOptions.labelMode=${editorLabelMode}`, function(assert) {
            const form = $('#form').dxForm({
                labelMode: formLabelMode,
                items: [
                    { dataField: 'item1', editorType: 'dxTextBox', editorOptions: { labelMode: editorLabelMode } }
                ]
            }).dxForm('instance');

            const editor = form.getEditor('item1');
            let expectedEditorLabelMode = editorLabelMode;
            if(expectedEditorLabelMode === undefined) {
                expectedEditorLabelMode = formLabelMode === 'outside'
                    ? 'hidden'
                    : formLabelMode;
            }
            assert.equal(editor.option('labelMode'), expectedEditorLabelMode, 'editor.labelMode is correct');
        });
    });
});

[true, false].forEach((showOptionalMark) => {
    [true, false].forEach((isLabelVisible) => {
        [true, false].forEach((showColon) => {
            ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
                [null, () => { return $('<div>').text('Custom text'); }].forEach((labelTemplate) => {
                    QUnit.test(`form renders with right optional mark, config=${JSON.stringify({ showOptionalMark, isLabelVisible, formLabelMode, showColon, labelTemplate })}`, function(assert) {
                        const $form = $('#form').dxForm({
                            showOptionalMark,
                            labelMode: formLabelMode,
                            items: [ {
                                dataField: 'item1',
                                label: { visible: isLabelVisible, showColon, template: labelTemplate },
                            }]
                        });

                        const $formLabel = $form.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);

                        const optionalMarkIsRenderedAsFormLabel = $formLabel.text().indexOf('optional') !== -1;

                        const labelText = labelTemplate ? 'Custom text' : 'Item 1';

                        const expectedFormLabelText = isLabelVisible ? `${labelText}${showColon && !labelTemplate ? ':' : ''}${optionalMarkIsRenderedAsFormLabel ? `${String.fromCharCode(160)}optional` : ''}` : '';
                        assert.equal($formLabel.text(), expectedFormLabelText, 'form.labelText');

                        if(showOptionalMark === false) {
                            assert.equal(optionalMarkIsRenderedAsFormLabel, false, 'optional mark in form label is not rendered');
                        } else if(isLabelVisible) {
                            assert.equal(optionalMarkIsRenderedAsFormLabel, true, 'optional mark in form label is rendered if label is visible');
                        } else {
                            assert.equal(optionalMarkIsRenderedAsFormLabel, false, 'optional mark in form label is not rendered if label is hidden');
                        }
                    });
                });
            });
        });
    });
});

[true, false].forEach((showOptionalMark) => {
    [true, false].forEach((isLabelVisible) => {
        ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
            [undefined, '', 'some help text'].forEach((helpText) => {
                QUnit.test(`form renders with right optional mark, config=${JSON.stringify({ showOptionalMark, isLabelVisible, formLabelMode, helpText })}`, function(assert) {
                    const $form = $('#form').dxForm({
                        showOptionalMark,
                        labelMode: formLabelMode,
                        items: [{
                            dataField: 'item1',
                            label: { visible: isLabelVisible },
                            helpText
                        }]
                    });

                    const $editorLabel = $form.find(`.${EDITOR_LABEL_CLASS}`);
                    const $helpText = $form.find(`.${FIELD_ITEM_HELP_TEXT_CLASS}`);

                    const optionalMarkIsRenderedAsHelpText = $helpText.text().indexOf('optional') !== -1;
                    const optionalMarkIsRenderedAsEditorLabel = $editorLabel.text().indexOf('optional') !== -1;

                    const editorLabelText = 'Item 1';

                    const needRenderEditorLabel = formLabelMode !== 'outside' && formLabelMode !== 'hidden';
                    assert.equal($editorLabel.text(), needRenderEditorLabel ? editorLabelText : '', 'editor.labelText');

                    assert.equal(optionalMarkIsRenderedAsEditorLabel, false, 'optional mark in editor is not rendered');
                    if(showOptionalMark === false) {
                        assert.equal(optionalMarkIsRenderedAsHelpText, false, 'optional mark in help text is not rendered');
                    } else if(isLabelVisible) {
                        assert.equal(optionalMarkIsRenderedAsHelpText, false, 'optional mark in help text is not rendered if label is visible');
                    } else {
                        assert.equal(optionalMarkIsRenderedAsHelpText, !isDefined(helpText) && needRenderEditorLabel, 'optional mark in help text is rendered correctly');
                    }
                });
            });
        });
    });
});

QUnit.test('Check aria-labelledby attribute for editors label', function(assert) {
    const form = $('#form').dxForm({
        items: [ { dataField: 'name', editorType: 'dxTextBox' } ],
        labelMode: 'floating'
    }).dxForm('instance');

    const $fieldItem = $('#form').find(`.${FIELD_ITEM_CLASS}`);
    const itemInputAttr = $fieldItem.find(`.${EDITOR_INPUT_CLASS}`).attr('aria-labelledby');
    const editorLabelID = $fieldItem.find(`.${EDITOR_LABEL_CLASS}`).attr('id');

    assert.strictEqual(itemInputAttr.includes(editorLabelID), true, 'input attr value includes editor label id');

    form.dispose();
});

QUnit.module('Align labels', {
    beforeEach: function() {
        const that = this;

        that.testObject = {
            'ID': 1,
            'FirstName': 'John',
            'LastName': 'Heart',
            'Prefix': 'Mr.',
            'Position': 'CEO',
            'Picture': 'images/employees/01.png',
            'BirthDate': '1964/03/16',
            'HireDate': '1995/01/15',
            'Notes': 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
            'Address': '351 S Hill St.',
            'StateID': 5
        };
        that.clock = sinon.useFakeTimers();

        responsiveBoxScreenMock.setup.call(this, 1200);
    },
    afterEach: function() {
        this.clock.restore();
        responsiveBoxScreenMock.teardown.call(this);
    }
});

function getLabelWidth(container, form, text) {
    const $label = renderLabel({ text: text, location: 'left' }).appendTo(container);
    const width = getWidth($label.children().first());

    $label.remove();
    return width;
}

function findLabelTextsInColumn($container, columnIndex) {
    return $container.find('.' + FORM_FIELD_ITEM_COL_CLASS + columnIndex + ' .' + FIELD_ITEM_LABEL_CONTENT_CLASS);
}

QUnit.test('Align labels in column', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: this.testObject,
        colCount: 4,
        customizeItem: function(item) {
            switch(item.dataField) {
                case 'FirstName':
                case 'LastName':
                    item.colSpan = 2;
                    break;
                case 'Prefix':
                    item.colSpan = 4;
                    break;
                case 'Notes':
                    item.colSpan = 5;
                    break;
                case 'StateID':
                    item.colSpan = 3;
                    break;
                default:
            }
        }
    }).dxForm('instance');

    const $col1 = $('.dx-col-0');
    const $col2 = $('.dx-col-1');
    const $col3 = $('.dx-col-2');
    const $col4 = $('.dx-col-3');
    let $maxLabelWidth = getLabelWidth(testContainer, form, 'Position:');
    let i;
    let labelWidth;

    for(i = 0; i < 4; i++) {
        labelWidth = getWidth($col1.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col0 item ' + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, 'First Name:');
    for(i = 0; i < 3; i++) {
        labelWidth = getWidth($col2.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col1 item ' + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, 'Birth Date:');
    for(i = 0; i < 2; i++) {
        labelWidth = getWidth($col3.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col2 item ' + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, 'Last Name:');
    for(i = 0; i < 2; i++) {
        labelWidth = getWidth($col4.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col3 item ' + i);
    }

    assert.equal($('.' + GET_LABEL_WIDTH_BY_TEXT_CLASS).length, 0, 'hidden labels count');
});

QUnit.test('Align labels in column when labels text is identical', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: { TestBool: true, ShipName: 'Test' }
    }).dxForm('instance');

    const $col1 = $('.dx-col-0');
    const $maxLabelWidth = getLabelWidth(testContainer, form, 'Ship Name:');
    let i;

    for(i = 0; i < 2; i++) {
        const labelWidth = getWidth($col1.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col0 item ' + i);
    }
});

QUnit.test('Disable alignItemLabels', function(assert) {
    const testContainer = $('#form');

    testContainer.dxForm({
        formData: { TestBool: true, ShipName: 'Test' },
        alignItemLabels: false
    }).dxForm('instance');

    const $labelTexts = $('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);

    assert.notEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)));
});

QUnit.test('Disable alignItemLabels in group', function(assert) {
    const testContainer = $('#form');

    testContainer.dxForm({
        formData: { TestBool: true, ShipName: 'Test', Name: 'John', LastName: 'Smith' },
        items: [
            {
                itemType: 'group',
                alignItemLabels: false,
                items: ['TestBool', 'ShipName']
            },
            {
                itemType: 'group',
                items: ['Name', 'LastName']
            }
        ]
    }).dxForm('instance');

    const $groups = $('.' + FORM_GROUP_CLASS);
    let $labelTexts = $groups.eq(0).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);

    assert.notEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)), 'group 1');

    $labelTexts = $groups.eq(1).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    assert.equal(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)), 'group 2');
});

QUnit.test('Align labels in column when alignItemLabelsInAllGroups is enabled', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        colCount: 2,
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            middleName: 'Test Middle Name',
            order: 101,
            photo: 'image.png',
            address: {
                city: 'Test City',
                room: 11,
                house: 7,
                street: 'Test street'
            }
        },
        items: [
            {
                itemType: 'group',
                colCount: 3,
                items: ['firstName', 'lastName', 'middleName']
            },
            {
                itemType: 'group',
                colCount: 2,
                items: ['photo', 'order']
            },
            {
                itemType: 'group',
                colCount: 2,
                items: ['address.city', 'address.street']
            },
            {
                itemType: 'group',
                colCount: 2,
                items: ['address.room', 'address.house']
            }]
    }).dxForm('instance');
    let labelWidth;
    let textWidth;
    let $groups;
    let $texts;
    let i;

    $groups = form._getGroupElementsInColumn(testContainer, 0);
    $texts = findLabelTextsInColumn($groups, 0);
    labelWidth = getLabelWidth(testContainer, form, 'Address city:');
    for(i = 0; i < 2; i++) {
        textWidth = getWidth($texts.eq(i));

        assert.roughEqual(textWidth, labelWidth, 1, 'group col 1, col1 item ' + i);
    }

    $texts = findLabelTextsInColumn($groups, 1);
    assert.roughEqual(getWidth($texts.eq(0)), getLabelWidth(testContainer, form, 'Last Name:'), 1, 'group col 1, col2 item 1');
    assert.roughEqual(getWidth($texts.eq(1)), getLabelWidth(testContainer, form, 'Address street:'), 1, 'group col 1, col2 item 2');

    $texts = findLabelTextsInColumn($groups, 2);
    labelWidth = getLabelWidth(testContainer, form, 'Middle Name:');
    assert.roughEqual(getWidth($texts.eq(0)), labelWidth, 1, 'group col 1, col3 item 1');

    $groups = form._getGroupElementsInColumn(testContainer, 1);
    $texts = findLabelTextsInColumn($groups, 0);
    labelWidth = getLabelWidth(testContainer, form, 'Address room:');
    for(i = 0; i < 2; i++) {
        textWidth = getWidth($texts.eq(i));

        assert.roughEqual(textWidth, labelWidth, 1, 'group col 2, col1 item ' + i);
    }

    $texts = findLabelTextsInColumn($groups, 1);
    labelWidth = getLabelWidth(testContainer, form, 'Address house:');
    for(i = 0; i < 2; i++) {
        textWidth = getWidth($texts.eq(i));

        assert.roughEqual(textWidth, labelWidth, 1, 'group col , col2 item ' + i);
    }
});

QUnit.test('Align labels in column when alignItemLabelsInAllGroups is disabled', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        colCount: 2,
        alignItemLabelsInAllGroups: false,
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            order: 101,
            photo: 'image.png',
            address: {
                city: 'Test City',
                room: 11,
                house: 7,
                street: 'Test street'
            }
        },
        items: [
            {
                itemType: 'group',
                colCount: 2,
                items: ['firstName', 'lastName']
            },
            {
                itemType: 'group',
                colCount: 1,
                items: ['photo', 'order']
            },
            {
                itemType: 'group',
                colCount: 2,
                items: ['address.city', 'address.street']
            },
            {
                itemType: 'group',
                colCount: 2,
                items: ['address.room', 'address.house']
            }]
    }).dxForm('instance');
    let $groups;

    $groups = form._getGroupElementsInColumn(testContainer, 0);
    assert.notEqual(getWidth(findLabelTextsInColumn($groups.eq(0), 0).eq(0)), getWidth(findLabelTextsInColumn($groups.eq(1), 0).eq(0)), 'compare group1 with group2');

    $groups = form._getGroupElementsInColumn(testContainer, 1);
    assert.notEqual(getWidth(findLabelTextsInColumn($groups.eq(0), 0).eq(0)), getWidth(findLabelTextsInColumn($groups.eq(1), 0).eq(0)), 'compare group1 with group2');
});

QUnit.test('Align labels in columns when there are rows', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: this.testObject,
        colCount: 4,
        items: [{
            name: 'fieldFirstValue',
            colSpan: 2,
            editorType: 'dxTextBox',
            label: {
                text: 'Field 1'
            }
        },
        {
            name: 'fieldSecondValue',
            colSpan: 2,
            editorType: 'dxTextBox',
            label: {
                text: 'Field 2'
            }
        },
        {
            name: 'fieldThirdValue',
            colSpan: 2,
            editorType: 'dxTextBox',
            label: {
                text: 'Field three'
            }
        },
        {
            name: 'fieldFourthValue',
            colSpan: 2,
            editorType: 'dxTextBox',
            label: {
                text: 'Field four'
            }
        }
        ]
    }).dxForm('instance');

    const $col1 = $('.dx-col-0');
    const $col2 = $('.dx-col-2');
    let $maxLabelWidth = getLabelWidth(testContainer, form, 'Field three:');
    let i;
    let labelWidth;

    for(i = 0; i < 2; i++) {
        labelWidth = getWidth($col1.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col0 item ' + i);
    }

    $maxLabelWidth = getLabelWidth(testContainer, form, 'Field four:');
    for(i = 0; i < 2; i++) {
        labelWidth = getWidth($col2.eq(i).find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS).first());

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'col2 item ' + i);
    }
});

QUnit.test('Align labels when layout is changed in responsive box_T306106', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: this.testObject,
        colCount: 4,
        customizeItem: function(item) {
            switch(item.dataField) {
                case 'FirstName':
                case 'LastName':
                    item.colSpan = 2;
                    break;
                case 'Prefix':
                    item.colSpan = 4;
                    break;
                case 'Notes':
                    item.colSpan = 5;
                    break;
                case 'StateID':
                    item.colSpan = 3;
                    break;
                default:
            }
        }
    }).dxForm('instance');

    const $labelsContent = testContainer.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    const $maxLabelWidth = getLabelWidth(testContainer, form, 'First Name:');
    let i;

    this.updateScreenSize(500);

    for(i = 0; i < 11; i++) {
        const labelWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'item ' + i);
    }

    assert.equal($('.' + GET_LABEL_WIDTH_BY_TEXT_CLASS).length, 0, 'hidden labels count');
});

QUnit.test('Align labels when layout is changed when small window size by default_T306106', function(assert) {
    this.updateScreenSize(500);

    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: this.testObject,
        colCount: 4,
        customizeItem: function(item) {
            switch(item.dataField) {
                case 'FirstName':
                case 'LastName':
                    item.colSpan = 2;
                    break;
                case 'Prefix':
                    item.colSpan = 4;
                    break;
                case 'Notes':
                    item.colSpan = 5;
                    break;
                case 'StateID':
                    item.colSpan = 3;
                    break;
                default:
            }
        }
    }).dxForm('instance');

    const $labelsContent = testContainer.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    const $maxLabelWidth = getLabelWidth(testContainer, form, 'First Name:');
    let i;

    for(i = 0; i < 11; i++) {
        const labelWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelWidth, $maxLabelWidth, 1, 'item ' + i);
    }

    assert.equal($('.' + GET_LABEL_WIDTH_BY_TEXT_CLASS).length, 0, 'hidden labels count');
});

QUnit.test('Labels are not aligned when labelLocation is top', function(assert) {
    $('#form').dxForm({
        labelLocation: 'top',
        formData: {
            dataField: 'Data field',
            bigDataField: 'Big Data field'
        },
    }).dxForm('instance');

    const $labelTexts = $(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    assert.notEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)));
});

QUnit.test('Labels are not aligned when labelLocation is top with the groups', function(assert) {
    $('#form').dxForm({
        labelLocation: 'top',
        formData: {
            isActive: true,
            ShipName: 'Test',
            Name: 'John',
            LastName: 'Smith'
        },
        items: [
            {
                itemType: 'group',
                items: ['isActive', 'ShipName']
            },
            {
                itemType: 'group',
                items: ['Name', 'LastName']
            }
        ]
    }).dxForm('instance');

    const $groups = $(`.${FORM_GROUP_CLASS}`);
    let $labelTexts = $groups.eq(0).find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);

    assert.notEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)), 'group 1');

    $labelTexts = $groups.eq(1).find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    assert.notEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)), 'group 2');
});

QUnit.test('required mark aligned', function(assert) {
    const $testContainer = $('#form').dxForm({
        requiredMark: '!',
        items: [{
            dataField: 'name',
            isRequired: true
        }]
    });

    const $labelsContent = $testContainer.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    const $requiredLabel = $labelsContent.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $requiredMark = $labelsContent.find(`.${FIELD_ITEM_REQUIRED_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.roughEqual($labelsContent.offset().left + getWidth($requiredLabel), $requiredMark.offset().left, 0.5, 'position of requared mark is right');
    assert.ok($requiredLabel.position().left < $requiredMark.position().left, 'required mark should be after of the text');
});

QUnit.test('Align with "" required mark, T1031458', function(assert) {
    const $testContainer = $('#form').dxForm({
        width: 200,
        requiredMark: '',
        items: [{
            dataField: 'X',
            isRequired: true
        }]
    });

    const $labelText = $testContainer.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $textBox = $testContainer.find(`.${TEXTBOX_CLASS}`);

    assert.roughEqual(getWidth($labelText), 11, 3, 'labelsContent.width');
    assert.roughEqual($textBox.offset().left, $labelText.offset().left + 25, 3, 'textBox.left');
});

QUnit.test('Align with " " required mark, T1031458', function(assert) {
    const $testContainer = $('#form').dxForm({
        width: 200,
        requiredMark: ' ',
        items: [{
            dataField: 'X',
            isRequired: true
        }]
    });

    const $labelText = $testContainer.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $textBox = $testContainer.find(`.${TEXTBOX_CLASS}`);

    assert.roughEqual(getWidth($labelText), 11, 3, 'labelsContent.width');
    assert.roughEqual($textBox.offset().left, $labelText.offset().left + 25, 3, 'textBox.left');
});

QUnit.test('Align with "!" required mark, T1031458', function(assert) {
    const $testContainer = $('#form').dxForm({
        width: 200,
        requiredMark: '!',
        items: [{
            dataField: 'X',
            isRequired: true
        }]
    });

    const $labelText = $testContainer.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $textBox = $testContainer.find(`.${TEXTBOX_CLASS}`);

    assert.roughEqual(getWidth($labelText), 11, 3, 'labelsContent.width');
    assert.roughEqual($textBox.offset().left, $labelText.offset().left + 29, 3, 'textBox.left');
});

QUnit.test('Align with "×" required mark, T1031458', function(assert) {
    const $testContainer = $('#form').dxForm({
        width: 200,
        requiredMark: '×',
        items: [{
            dataField: 'X',
            isRequired: true
        }]
    });

    const $labelText = $testContainer.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $textBox = $testContainer.find(`.${TEXTBOX_CLASS}`);

    assert.roughEqual(getWidth($labelText), 11, 3, 'labelsContent.width');
    assert.roughEqual($textBox.offset().left, $labelText.offset().left + 35, 3, 'textBox.left');
});

QUnit.test('optional mark aligned', function(assert) {
    const $testContainer = $('#form').dxForm({
        optionalMark: 'optMark',
        showOptionalMark: true,
        items: ['position']
    });

    const $labelsContent = $testContainer.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    const $optionalLabel = $labelsContent.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $optionalMark = $labelsContent.find(`.${FIELD_ITEM_OPTIONAL_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.roughEqual($labelsContent.offset().left + getWidth($optionalLabel), $optionalMark.offset().left, 0.5, 'position of optional mark is right');
    assert.ok($optionalLabel.position().left < $optionalMark.position().left, 'optional mark should be after of the text');
});

QUnit.test('Check align labels', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            order: 101,
            photo: 'image.png',
            address: {
                city: 'Test City',
                room: 11,
                house: 7,
                street: 'Test street'
            }
        },
        items: [
            'test order', 'photo personal',
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        title: 'Address1',
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            items: ['address.city', 'address.street', 'address.room', 'address.house']
                        }]
                    },
                    {
                        title: 'Address2',
                        colCount: 2,
                        items: ['firstName', 'lastName']
                    }]
            }]
    }).dxForm('instance');
    let $labelTexts;
    let labelWidth;
    let $layoutManager;
    let $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);

    $layoutManager = $layoutManagers.eq(0);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    assert.roughEqual(getWidth($labelTexts.eq(0)), getWidth($labelTexts.eq(1)), 1, 'col 1');

    $layoutManager = $layoutManagers.eq(1);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    labelWidth = getLabelWidth($layoutManager, form, 'Address room:');
    assert.roughEqual(getWidth($labelTexts.eq(0)), labelWidth, 1, 'tab 1 col 1');

    $labelTexts = findLabelTextsInColumn($layoutManager, 1);
    labelWidth = getLabelWidth($layoutManager, form, 'Address house:');
    assert.roughEqual(getWidth($labelTexts.eq(1)), labelWidth, 1, 'tab 1 col 2');

    testContainer.find('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', 1);
    this.clock.tick();

    $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelTexts = findLabelTextsInColumn($layoutManager, 0);
    labelWidth = getLabelWidth($layoutManager, form, 'First Name:');
    assert.roughEqual(getWidth($labelTexts.eq(0)), labelWidth, 1, 'tab 2 col 1');

    $labelTexts = findLabelTextsInColumn($layoutManager, 1);
    labelWidth = getLabelWidth($layoutManager, form, 'Last Name:');
    assert.roughEqual(getWidth($labelTexts.eq(0)), labelWidth, 1, 'tab 2 col 2');
});

QUnit.test('Check align labels when layout is changed by default_T306106', function(assert) {
    this.updateScreenSize(500);

    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            order: 101,
            photo: 'image.png',
            address: {
                city: 'Test City',
                room: 11,
                house: 7,
                street: 'Test street'
            }
        },
        items: [
            'test order', 'photo personal',
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        title: 'Address1',
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            items: ['address.city', 'address.street', 'address.room', 'address.house']
                        }]
                    },
                    {
                        title: 'Address2',
                        colCount: 2,
                        items: ['firstName', 'lastName']
                    }]
            }]
    }).dxForm('instance');
    let labelWidth;
    let labelContentWidth;
    let $labelsContent;
    let $layoutManager;
    let $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);
    let i;

    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, 'Address house:');
    for(i = 0; i < 4; i++) {
        labelContentWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelContentWidth, labelWidth, 1, 'tab 1, item ' + i);
    }

    testContainer.find('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', 1);
    this.clock.tick();

    $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelsContent = $layoutManager.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, 'First Name:');
    for(i = 0; i < 2; i++) {
        labelContentWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelContentWidth, labelWidth, 1, 'tab 2, item ' + i);
    }
});

QUnit.test('Check align labels when layout is changed_T306106', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            order: 101,
            photo: 'image.png',
            address: {
                city: 'Test City',
                room: 11,
                house: 7,
                street: 'Test street'
            }
        },
        items: [
            'test order', 'photo personal',
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        title: 'Address1',
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            items: ['address.city', 'address.street', 'address.room', 'address.house']
                        }]
                    },
                    {
                        title: 'Address2',
                        colCount: 2,
                        items: ['firstName', 'lastName']
                    }]
            }]
    }).dxForm('instance');
    let labelWidth;
    let labelContentWidth;
    let $labelsContent;
    let $layoutManager;
    let $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);
    let i;

    this.updateScreenSize(500);

    $layoutManager = $layoutManagers.eq(1);
    $labelsContent = $layoutManager.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, 'Address house:');
    for(i = 0; i < 4; i++) {
        labelContentWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelContentWidth, labelWidth, 1, 'tab 1, item ' + i);
    }

    testContainer.find('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', 1);
    this.clock.tick();

    $layoutManagers = testContainer.find('.' + FORM_LAYOUT_MANAGER_CLASS);
    $layoutManager = $layoutManagers.eq(3);
    $labelsContent = $layoutManager.find('.' + FIELD_ITEM_LABEL_CONTENT_CLASS);
    labelWidth = getLabelWidth($layoutManager, form, 'First Name:');
    for(i = 0; i < 2; i++) {
        labelContentWidth = getWidth($labelsContent.eq(i));

        assert.roughEqual(labelContentWidth, labelWidth, 1, 'tab 2, item ' + i);
    }
});
