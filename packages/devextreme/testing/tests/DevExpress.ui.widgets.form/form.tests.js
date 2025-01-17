import { getWidth, getHeight } from 'core/utils/size';
import device from 'core/devices';
import config from 'core/config';
import domAdapter from '__internal/core/m_dom_adapter';
import resizeCallbacks from '__internal/core/utils/m_resize_callbacks';
import typeUtils from 'core/utils/type';
import { extend } from 'core/utils/extend';
import visibilityEventsModule from 'common/core/events/visibility_change';
import {
    EDITORS_WITHOUT_LABELS,
} from '__internal/ui/form/m_form.layout_manager.utils';
import 'generic_light.css!';
import $ from 'jquery';
import 'ui/autocomplete';
import 'ui/calendar';
import 'ui/date_box';
import 'ui/drop_down_box';
import 'ui/switch';
import 'ui/slider';
import 'ui/range_slider';

import windowModule from '__internal/core/utils/m_window';
import Form from 'ui/form';
import TextEditorBase from 'ui/text_box/ui.text_editor.base.js';
import {
    TEXTEDITOR_INPUT_CLASS
} from '__internal/ui/text_box/m_text_editor.base';


import {
    FIELD_ITEM_CLASS,
    FORM_GROUP_CLASS,
    FORM_LAYOUT_MANAGER_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS,
    FORM_FIELD_ITEM_COL_CLASS,
    FIELD_ITEM_CONTENT_CLASS,
    FIELD_ITEM_LABEL_CLASS,
    FORM_GROUP_CAPTION_CLASS,
    FORM_UNDERLINED_CLASS,
    FORM_VALIDATION_SUMMARY
} from '__internal/ui/form/constants';

import {
    GET_LABEL_WIDTH_BY_TEXT_CLASS,
    FIELD_ITEM_OPTIONAL_MARK_CLASS,
    FIELD_ITEM_REQUIRED_MARK_CLASS,
    FIELD_ITEM_LABEL_TEXT_CLASS,
    renderLabel,
} from '__internal/ui/form/components/m_label';

import { TOOLBAR_CLASS } from '__internal/ui/toolbar/m_constants';

import 'ui/html_editor';
import '../../helpers/ignoreQuillTimers.js';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/lookup';
import 'ui/radio_group';
import 'ui/tag_box';
import 'ui/toolbar';
import 'ui/text_area';
import 'ui/date_range_box';
import themes from 'ui/themes';
import registerKeyHandlerTestHelper from '../../helpers/registerKeyHandlerTestHelper.js';
import responsiveBoxScreenMock from '../../helpers/responsiveBoxScreenMock.js';
import { isDefined } from 'core/utils/type.js';
import { TABPANEL_CLASS } from '__internal/ui/tab_panel/m_tab_panel';

const INVALID_CLASS = 'dx-invalid';
const FORM_GROUP_CONTENT_CLASS = 'dx-form-group-content';
const MULTIVIEW_ITEM_CONTENT_CLASS = 'dx-multiview-item-content';
const LAST_COL_CLASS = 'dx-last-col';
const SLIDER_LABEL = 'dx-slider-label';
const EDITOR_LABEL_CLASS = 'dx-texteditor-label';
const EDITOR_INPUT_CLASS = 'dx-texteditor-input';
const FIELD_ITEM_HELP_TEXT_CLASS = 'dx-field-item-help-text';
const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const TEXTBOX_CLASS = 'dx-textbox';

QUnit.testStart(function() {
    const markup =
        '<div id="form"></div>\
        <div id="form2"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Form');

if(device.current().deviceType === 'desktop') {
    const items = [
        { dataField: 'name', editorType: 'dxTextBox' },
        { dataField: 'age', editorType: 'dxNumberBox' }
    ];

    items.forEach((item) => {
        registerKeyHandlerTestHelper.runTests({
            createWidget: ($element) => $element.dxForm({ items: items }).dxForm('instance'),
            keyPressTargetElement: (widget) => widget.getEditor(item.dataField).$element().find(`.${EDITOR_INPUT_CLASS}`),
            checkInitialize: false,
            testNamePrefix: `Form -> ${item.editorType}:`
        });
    });
}

QUnit.testInActiveWindow('Form\'s textbox input saves value on refresh (T404958)', function(assert) {
    let screen = 'md';
    const $form = $('#form').dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCountByScreen: {
            sm: 1,
            md: 2
        },
        items: [
            {
                dataField: 'name',
                editorType: 'dxTextBox'
            }
        ]
    });

    $form.find(`.${TEXTEDITOR_INPUT_CLASS}`)
        .first()
        .focus()
        .val('test');

    screen = 'sm';
    resizeCallbacks.fire();

    const formData = $form.dxForm('instance').option('formData');

    assert.deepEqual(formData, { name: 'test' }, 'textbox value updates');
});

QUnit.testInActiveWindow('Form\'s textarea input saves value on refresh (T404958)', function(assert) {
    let screen = 'md';
    const $form = $('#form').dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCountByScreen: {
            sm: 1,
            md: 2
        },
        items: [
            {
                dataField: 'name',
                editorType: 'dxTextArea'
            }
        ]
    });

    $form.find(`.${TEXTEDITOR_INPUT_CLASS}`)
        .first()
        .focus()
        .val('test');

    screen = 'sm';
    resizeCallbacks.fire();

    const formData = $form.dxForm('instance').option('formData');

    assert.deepEqual(formData, { name: 'test' }, 'textarea value updates');
});

QUnit.test('Check field width on render form with colspan', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { ID: 0, FirstName: 'John', LastName: 'Dow', HireDate: '01/01/1970' },
        colCount: 2,
        colCountByScreen: { xs: 2 },
        items: [{
            itemType: 'group',
            caption: 'Employee',
            colCount: 2,
            items: [
                { dataField: 'ID', colSpan: 2 },
                { dataField: 'FirstName', visible: true },
                { dataField: 'LastName', visible: true },
                { dataField: 'HireDate', colSpan: 2, visible: true }
            ]
        }]
    });

    const $fieldItems = $testContainer.find('.' + FIELD_ITEM_CLASS);
    const fieldWidths = {
        ID: getWidth($fieldItems.eq(1)),
        FirstName: getWidth($fieldItems.eq(2)),
        LastName: getWidth($fieldItems.eq(3)),
        HireDate: getWidth($fieldItems.eq(4))
    };

    assert.equal($fieldItems.length, 5, '4 simple items + 1 group item');
    assert.equal(fieldWidths.ID, fieldWidths.HireDate, 'fields with colspan 2 have the same width');
    assert.equal(fieldWidths.FirstName, fieldWidths.LastName, 'fields without colspan have the same width');
    assert.ok(fieldWidths.ID > fieldWidths.FirstName, 'field with colspan 2 is wider than field without colspan');
});

QUnit.test('Change of the formData field change value of the editor', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { FamousPirate: 'John Morgan' }
    });

    const formInstance = $testContainer.dxForm('instance');

    formInstance.option('formData.FamousPirate', 'Cpt. Jack Sparrow');

    assert.equal(formInstance.getEditor('FamousPirate').option('value'), 'Cpt. Jack Sparrow', 'Correct value');
});

QUnit.test('Change editor value after formOption is changed and items is defined', function(assert) {
    const $testContainer = $('#form');
    const form = $testContainer.dxForm({
        formData: { pirateName: 'Blackbeard', type: 'captain', isSought: true },
        items: ['pirateName', 'type', 'isSought']
    }).dxForm('instance');

    form.option('formData', {
        pirateName: 'John Morgan',
        type: 'captain',
        isSought: true
    });

    form.getEditor('isSought').option('value', false);
    assert.deepEqual(form.option('formData'), {
        pirateName: 'John Morgan',
        type: 'captain',
        isSought: false
    }, 'FormData is up to date');
});

QUnit.test('Reset editor value after formData changing only if dataField is defined', function(assert) {
    const $testContainer = $('#form');
    const form = $testContainer.dxForm({
        formData: { pirateName: 'Blackbeard', type: 'captain', isSought: 'Test', gender: 'Male' },
        items: [{ dataField: 'gender' }, { dataField: 'pirateName' }, { dataField: 'type' }, { name: 'isSought', editorType: 'dxTextBox' }]
    }).dxForm('instance');

    form.getEditor('isSought').option('value', 'Changed');
    form.getEditor('gender').option('value', 'Female');

    form.option('formData', {
        pirateName: 'John Morgan',
        type: 'captain'
    });

    assert.equal(form.getEditor('isSought').option('value'), 'Changed', '\'isSought\' editor wasn\'t reseted');
    assert.equal(form.getEditor('gender').option('value'), '', '\'gender\' editor was reseted');
});

QUnit.test('Invalid field name when item is defined not as string and not as object', function(assert) {
    const form = $('#form').dxForm({
        formData: { name: 'Batman', lastName: 'Klark' },
        items: [1, 'lastName']
    }).dxForm('instance');

    assert.equal(form.$element().find('.' + FIELD_ITEM_CLASS).length, 1, 'items count');
    assert.equal(form.getEditor('name'), undefined, 'editor by name field');
    assert.equal(form.getEditor('lastName').option('value'), 'Klark', 'editor by lastName field');
});

QUnit.test('Reset editor\'s value when the formData option is empty object', function(assert) {
    let values = [];
    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            room: 1
        },
        items: ['name', 'lastName', 'sex', 'room', 'isDeveloper'],
        onFieldDataChanged: function(e) {
            values.push({
                dataField: e.dataField,
                value: e.value
            });
        }
    }).dxForm('instance');

    form.option('formData', {});

    assert.equal(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.equal(form.getEditor('room').option('value'), null, 'editor for the room dataField');

    assert.deepEqual(values[0], { dataField: 'name', value: '' }, 'value of name dataField');
    assert.deepEqual(values[1], { dataField: 'room', value: null }, 'value of room dataField');

    values = [];
    form.option('formData', {});

    assert.equal(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.equal(form.getEditor('room').option('value'), null, 'editor for the room dataField');
    assert.equal(values.length, 0, 'onFieldDataChanged event is not called if the empty object is set to formData a second time');
});

QUnit.test('Reset editor\'s value when the formData option is null', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            room: 1
        },
        items: ['name', 'room']
    }).dxForm('instance');

    form.option('formData', null);

    assert.equal(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.equal(form.getEditor('room').option('value'), null, 'editor for the room dataField');
});

QUnit.test('Reset editor\'s value when the formData option is undefined', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            room: 1
        },
        items: ['name', 'room']
    }).dxForm('instance');

    form.option('formData', undefined);

    assert.equal(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.equal(form.getEditor('room').option('value'), null, 'editor for the room dataField');
});

QUnit.test('Reset editor\'s value with validation', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            lastName: 'John'
        },
        items: ['name', { dataField: 'lastName', isRequired: true }]
    }).dxForm('instance');

    form.option('formData', undefined);

    assert.equal(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.equal(form.getEditor('lastName').option('value'), '', 'editor for the lastName dataField');

    assert.ok(!form.getEditor('lastName').$element().hasClass(INVALID_CLASS), 'not invalid css class');
    assert.ok(form.getEditor('lastName').option('isValid'), 'isValid');
});

QUnit.test('The \'dataField\' option of a simple item should affect the editorOptions.name option', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            firstName: 'Mike'
        },
        items: [{ dataField: 'firstName' }]
    }).dxForm('instance');

    assert.equal(form.getEditor('firstName').option('name'), 'firstName', 'Editor name is OK');
});

QUnit.test('The \'dataField\' option of a simple item should not affect existing editorOptions.name option', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            firstName: 'Mike'
        },
        items: [{ dataField: 'firstName', editorOptions: { name: 'UserName' } }]
    }).dxForm('instance');

    assert.equal(form.getEditor('firstName').option('name'), 'UserName', 'Editor name is OK');
});

QUnit.test('rangeSlider labels should be rendered when used in forms (T1240185)', function(assert) {
    const form = $('#form').dxForm({
        items: [{
            dataField: 'test',
            editorType: 'dxRangeSlider',
            editorOptions: {
                label: {
                    visible: true,
                    position: 'top',
                },
            }
        }]
    });

    const labelExist = form.find(`.${SLIDER_LABEL}`).length > 0;
    const minLabel = form.find(`.${SLIDER_LABEL}`).eq(0).text();
    const maxLabel = form.find(`.${SLIDER_LABEL}`).eq(1).text();

    assert.ok(labelExist, 'label is rendered');
    assert.strictEqual(minLabel, '0', 'min label has correct value');
    assert.strictEqual(maxLabel, '100', 'max label has correct value');
});

QUnit.test('slider labels should be rendered when used in forms (T1240185)', function(assert) {
    const form = $('#form').dxForm({
        items: [{
            dataField: 'test',
            editorType: 'dxSlider',
            editorOptions: {
                label: {
                    visible: true,
                    position: 'top',
                },
            }
        }]
    });

    const labelExist = form.find(`.${SLIDER_LABEL}`).length > 0;
    const minLabel = form.find(`.${SLIDER_LABEL}`).eq(0).text();
    const maxLabel = form.find(`.${SLIDER_LABEL}`).eq(1).text();

    assert.ok(labelExist, 'label is rendered');
    assert.strictEqual(minLabel, '0', 'min label has correct value');
    assert.strictEqual(maxLabel, '100', 'max label has correct value');
});

QUnit.test('Don\'t refresh form when visibility changed to \'true\'', function(assert) {
    const $testContainer = $('#form');
    const expectedRefreshCount = 0;
    const form = $testContainer.dxForm({
        formData: { name: 'TestName' },
        items: [{ dataField: 'name' }]
    }).dxForm('instance');

    const refreshStub = sinon.stub(form, '_refresh');
    visibilityEventsModule.triggerHidingEvent($testContainer);
    visibilityEventsModule.triggerShownEvent($testContainer);

    assert.equal(refreshStub.callCount, expectedRefreshCount, 'Don\'t refresh on visibility changed to \'true\'');
    refreshStub.restore();
});

QUnit.test('Hide helper text when validation message shows for material theme', function(assert) {
    const origIsMaterialBased = themes.isMaterialBased;
    themes.isMaterialBased = function() { return true; };

    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            lastName: ''
        },
        items: [
            { dataField: 'name', helpText: 'First name field' },
            { dataField: 'lastName', isRequired: true, helpText: 'Last name field' }
        ]
    }).dxForm('instance');

    const lastName = form.getEditor('lastName');
    const firstName = form.getEditor('name');

    const isFieldWrapperInvalid = function(editor) {
        return editor.$element().parents('.dx-field-item-content-wrapper').hasClass(INVALID_CLASS);
    };

    lastName.focus();
    form.validate();

    triggerKeyUp(lastName.$element(), 'Enter');
    assert.ok(isFieldWrapperInvalid(lastName), 'invalid css class');

    firstName.focus();

    lastName.focus();
    assert.ok(isFieldWrapperInvalid(lastName), 'invalid css class');

    firstName.focus();
    assert.ok(!isFieldWrapperInvalid(lastName), 'not invalid css class');
    assert.ok(!isFieldWrapperInvalid(firstName), 'not invalid css class');

    themes.isMaterialBased = origIsMaterialBased;

});

QUnit.test('The formData is updated correctly when formData has \'undefined\' value', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: undefined,
        items: [{ dataField: 'City' }]
    });
    const form = $testContainer.dxForm('instance');

    const editor = form.getEditor('City');
    editor.option('value', 'New York');

    const formData = form.option('formData');
    assert.deepEqual(formData, { City: 'New York' }, 'updated formData');
    assert.equal($testContainer.find('.dx-field-item').length, 1, 'form item is rendered');
});

QUnit.test('The formData with composite object is updated correctly when formData has \'undefined\' value', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: undefined,
        items: [{ dataField: 'Employee.City' }]
    });
    const form = $testContainer.dxForm('instance');

    const editor = form.getEditor('Employee.City');
    editor.option('value', 'New York');

    const formData = form.option('formData');
    assert.deepEqual(formData, { Employee: { City: 'New York' } }, 'formData is updated');
    assert.equal($testContainer.find('.dx-field-item').length, 1, 'form item is rendered');
});

QUnit.test('From renders the right types of editors by default', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { id: 1, name: 'Name' }
    });

    assert.ok($testContainer.find('.dx-field-item .dx-numberbox').hasClass('dx-editor-outlined'), 'right class rendered');
    assert.ok($testContainer.find('.dx-field-item .dx-textbox').hasClass('dx-editor-outlined'), 'right class rendered');
});

QUnit.test('From renders the right types of editors according to stylingMode option', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { id: 1, name: 'Name' },
        stylingMode: 'underlined'
    });

    assert.ok($testContainer.find('.dx-field-item .dx-numberbox').hasClass('dx-editor-underlined'), 'right class rendered');
    assert.ok($testContainer.find('.dx-field-item .dx-textbox').hasClass('dx-editor-underlined'), 'right class rendered');
});

QUnit.test('From renders editors with the right label, labelMode', function(assert) {
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
    [undefined, true, false].forEach((isLabelVisible) => {
        ['outside', 'floating', 'hidden', 'static'].forEach((formLabelMode) => {
            [
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
            ].forEach((editorType) => {
                QUnit.test(`label rendering, form.labelMode=${formLabelMode},label.visible=${isLabelVisible},editorType=${editorType},label.showColon=${showColon}`, function(assert) {
                    const $form = $('#form').dxForm({
                        labelMode: formLabelMode,
                        items: [{
                            dataField: 'item1',
                            editorType,
                            label: {
                                visible: isLabelVisible,
                                showColon,
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
                    assert.equal($label.length, needRenderLabel ? 1 : 0, 'label is rendered correctly');
                    assert.equal($label.text(), needRenderLabel ? `Item 1${showColon ? ':' : ''}` : '');
                });
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
                [undefined, 'floating', 'hidden', 'static'].forEach((editorLabelMode) => {
                    [undefined, '', 'some help text'].forEach((helpText) => {
                        [null, () => { return $('<div>').text('Custom text'); }].forEach((labelTemplate) => {
                            QUnit.test(`form renders with right optional mark, config=${JSON.stringify({ showOptionalMark, isLabelVisible, formLabelMode, editorLabelMode, helpText, showColon, labelTemplate })}`, function(assert) {
                                const $form = $('#form').dxForm({
                                    showOptionalMark,
                                    labelMode: formLabelMode,
                                    items: [ {
                                        dataField: 'item1',
                                        label: { visible: isLabelVisible, showColon, template: labelTemplate },
                                        editorOptions: { labelMode: editorLabelMode },
                                        helpText
                                    }]
                                });

                                const $formLabel = $form.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
                                const $editorLabel = $form.find(`.${EDITOR_LABEL_CLASS}`);
                                const $helpText = $form.find(`.${FIELD_ITEM_HELP_TEXT_CLASS}`);

                                const optionalMarkIsRenderedAsHelpText = $helpText.text().indexOf('optional') !== -1;
                                const optionalMarkIsRenderedAsFormLabel = $formLabel.text().indexOf('optional') !== -1;
                                const optionalMarkIsRenderedAsEditorLabel = $editorLabel.text().indexOf('optional') !== -1;

                                const labelText = labelTemplate ? 'Custom text' : 'Item 1';
                                const editorLabelText = 'Item 1';

                                const expectedFormLabelText = isLabelVisible ? `${labelText}${showColon && !labelTemplate ? ':' : ''}${optionalMarkIsRenderedAsFormLabel ? `${String.fromCharCode(160)}optional` : ''}` : '';
                                assert.equal($formLabel.text(), expectedFormLabelText, 'form.labelText');
                                const resultLabelMode = editorLabelMode || formLabelMode;
                                const needRenderEditorLabel = resultLabelMode !== 'outside' && resultLabelMode !== 'hidden';
                                assert.equal($editorLabel.text(), needRenderEditorLabel ? editorLabelText : '', 'editor.labelText');

                                assert.equal(optionalMarkIsRenderedAsEditorLabel, false, 'optional mark in editor is not rendered');
                                if(showOptionalMark === false) {
                                    assert.equal(optionalMarkIsRenderedAsHelpText, false, 'optional mark in help text is not rendered');
                                    assert.equal(optionalMarkIsRenderedAsFormLabel, false, 'optional mark in form label is not rendered');
                                } else if(isLabelVisible) {
                                    assert.equal(optionalMarkIsRenderedAsFormLabel, true, 'optional mark in form label is rendered if label is visible');
                                    assert.equal(optionalMarkIsRenderedAsHelpText, false, 'optional mark in help text is not rendered if label is visible');
                                } else {
                                    assert.equal(optionalMarkIsRenderedAsFormLabel, false, 'optional mark in form label is not rendered if label is hidden');
                                    assert.equal(optionalMarkIsRenderedAsHelpText, !isDefined(helpText) && ['static', 'floating'].indexOf(editorLabelMode || formLabelMode) !== -1, 'optional mark in help text is rendered correctly');
                                }
                            });
                        });
                    });
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

QUnit.test('field1.required -> form.validate() -> form.option("onFieldDataChanged", "newHandler") -> check form is not re-rendered (T1014577)', function(assert) {
    const checkEditorIsInvalid = (form) => form.$element().find(`.${TEXTBOX_CLASS}`).hasClass(INVALID_CLASS);
    const form = $('#form').dxForm({
        formData: { field1: '' },
        items: [ {
            dataField: 'field1',
            validationRules: [{ type: 'required' }]
        } ]
    }).dxForm('instance');

    form.validate();
    assert.equal(checkEditorIsInvalid(form), true, 'editor is invalid after validate');

    form.option('onFieldDataChanged', () => {});
    assert.equal(checkEditorIsInvalid(form), true, 'editor is still invalid after changing the onFieldDataChanged option');
});

QUnit.test('form.option("onFieldDataChanged", "newHandler") -> check new handler is called (T1014577)', function(assert) {
    const form = $('#form').dxForm({
        formData: { field1: '' },
        items: [ {
            dataField: 'field1',
            validationRules: [{ type: 'required' }]
        } ]
    }).dxForm('instance');

    const onFieldDataChangedStub = sinon.stub();
    form.option('onFieldDataChanged', onFieldDataChangedStub);

    form.updateData({ field1: 'some value 1' });
    assert.equal(onFieldDataChangedStub.callCount, 1, 'new handler is called after formData is updated');

    form.getEditor('field1').option('value', 'some value 2');
    assert.equal(onFieldDataChangedStub.callCount, 2, 'new handler is called after editor value is changed');
});

QUnit.test('onFieldDataChanged must be called once if new formData contains "length" property (T1213983)', function(assert) {
    const onFieldDataChangedStub = sinon.stub();

    const form = $('#form').dxForm({
        formData: {},
        items: [{
            dataField: 'length',
        }],
        onFieldDataChanged: onFieldDataChangedStub,
    }).dxForm('instance');

    form.option({ formData: { length: 10 } });

    assert.strictEqual(onFieldDataChangedStub.callCount, 1);
});


[
    { editorType: 'dxTextBox' },
    { label: { text: 'label text' } },
    { editorOptions: { width: 400 } },
].forEach(testConfig => {
    [true, false].forEach(useRepaint => {
        const clone = (item) => JSON.parse(JSON.stringify(item));
        QUnit.test(`Form.itemOption('group.item1', newItem2), testConfig = ${JSON.stringify(testConfig)}. useRepaint = ${useRepaint} (T903774)`, function(assert) {
            const item1 = {
                editorType: 'dxDropDownBox',
                dataField: 'item1',
                label: { text: 'item1' },
                editorOptions: { placeholder: 'test_placeHolder' }
            };
            const newItem1 = extend({
                dataField: 'newItem1',
                label: { text: 'new item1' },
                editorOptions: { width: 300 }
            }, testConfig);

            const form = $('#form').dxForm({
                items: [{
                    itemType: 'group',
                    caption: 'group1',
                    items: [ clone(item1) ]
                }]
            }).dxForm('instance');

            form.itemOption('group1.item1', clone(newItem1));
            if(useRepaint) {
                form.repaint();
            }

            if('editorType' in testConfig) {
                assert.deepEqual(form.itemOption('group1.item1'), undefined, 'item1');
                assert.deepEqual(form.itemOption('group1.newItem1'), extend(true, {}, newItem1, { editorType: testConfig.editorType || item1.editorType }), 'newItem1');
            } else {
                assert.deepEqual(form.itemOption('group1.item1'), extend(true, {}, item1, newItem1, { editorType: item1.editorType, dataField: item1.dataField }), 'item1');
                assert.deepEqual(form.itemOption('group1.newItem1'), undefined, 'newItem1');
            }
        });

        QUnit.test(`Form.itemOption('item1', newItem2), testConfig = ${JSON.stringify(testConfig)}. useRepaint = ${useRepaint} (T903774)`, function(assert) {
            const item1 = {
                editorType: 'dxDropDownBox',
                dataField: 'item1',
                label: { text: 'item1' },
                editorOptions: { placeholder: 'test_placeHolder' }
            };
            const newItem1 = extend({
                dataField: 'newItem1',
                label: { text: 'new item1' },
                editorOptions: { width: 300 }
            }, testConfig);

            const form = $('#form').dxForm({
                items: [ clone(item1) ]
            }).dxForm('instance');

            form.itemOption('item1', clone(newItem1));
            if(useRepaint) {
                form.repaint();
            }

            assert.deepEqual(form.itemOption('item1'), undefined, 'item1');
            assert.deepEqual(form.itemOption('newItem1'), extend(true, {}, newItem1, { editorType: testConfig.editorType || item1.editorType }), 'newItem1');
        });
    });
});

QUnit.test('Change options -> check _itemsOptionChangedHandler/_formDataOptionChangedHandler calls', function(assert) {
    const form = $('#form').dxForm({
        items: [ { name: 'id' } ]
    }).dxForm('instance');

    let actualLog = '';
    const _itemsOptionChangedHandler = form._itemsOptionChangedHandler;
    form._itemsOptionChangedHandler = function() { actualLog += 'items; '; return _itemsOptionChangedHandler.apply(form, arguments); };
    const _formDataOptionChangedHandler = form._formDataOptionChangedHandler;
    form._formDataOptionChangedHandler = function() { actualLog += 'formData; '; return _formDataOptionChangedHandler.apply(form, arguments); };
    const _defaultOptionChangedHandler = form._defaultOptionChangedHandler;
    form._defaultOptionChangedHandler = function() { actualLog += 'default; '; return _defaultOptionChangedHandler.apply(form, arguments); };

    function testConfig(optionName, expectedLog) {
        actualLog = '';
        form.option(optionName, {});
        assert.strictEqual(actualLog, expectedLog, `option("${optionName}")`);
    }

    testConfig('.', 'default; ');
    testConfig('.hint', 'default; ');
    testConfig('.items', 'default; ');
    testConfig('.formData', 'default; ');

    testConfig('a', 'default; ');
    testConfig('hint.b', 'default; ');
    testConfig('colCountByScreen.b.', 'default; ');
    testConfig('colCountByScreen.lg.c', 'default; ');

    testConfig('formData', 'default; ');
    testConfig('formData.', 'formData; ');
    testConfig(' formData . ', 'formData; ');
    testConfig('formData.a', 'formData; ');
    testConfig('formData.a.', 'formData; ');
    testConfig('formData.a.b', 'formData; ');
    testConfig('formData.items', 'formData; ');
    testConfig('formData.items[0]', 'formData; ');
    testConfig('formData.formData', 'formData; ');

    testConfig('items', 'default; ');
    testConfig('items.', 'items; default; ');
    testConfig(' items . ', 'items; default; ');
    testConfig('items.a', 'items; default; ');
    testConfig(' items . a ', 'items; default; ');
    testConfig('items.a.b', 'items; default; ');
    testConfig('items.formData', 'items; default; ');
    testConfig('items.formData.b', 'items; default; ');
    testConfig('items.items', 'items; default; ');

    testConfig('items[0]', 'default; ');
    testConfig('items[0].a', 'items; default; ');
    testConfig('items[0].visible', 'items; default; ');
    testConfig('items[0].items', 'items; default; ');
    testConfig('items[0].formData', 'items; default; ');
    testConfig('items[0].items[0]', 'items; default; ');

    testConfig('items[0].tabs', 'items; default; ');
    testConfig('items[0].tabs.a', 'items; default; ');
    testConfig('items[0].tabs.visible', 'items; default; ');
    testConfig('items[0].tabs[0]', 'items; default; ');
    testConfig('items[0].tabs[0].visible', 'items; default; ');
    testConfig('items[0].tabs[0].items', 'items; default; ');
    testConfig('items[0].tabs[0].formData', 'items; default; ');
    testConfig('items[0].tabs[0].items[0]', 'items; default; ');

    testConfig('hint.items', 'default; ');
    testConfig('hint.items.', 'default; ');
    testConfig('hint.items.a', 'default; ');
    testConfig('hint.items[0]', 'default; ');
    testConfig('hint.items[0].visible', 'default; ');

    testConfig('hint.formData', 'default; ');
    testConfig('hint.formData.a', 'default; ');

    testConfig('formData_items', 'default; ');
    testConfig('formData_items.', 'items; default; ');
    testConfig('xxx_formData_xxx', 'default; ');
    testConfig('xxx_formData_xxx.', 'formData; ');
    testConfig('xxx_items_xxx', 'default; ');
    testConfig('xxx_items_xxx.', 'items; default; ');
});

QUnit.test('Keep validation summary in an item with Form in its template', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        showValidationSummary: true,
        items: [{
            template: () => {
                return $('<div></div>').dxForm({
                    showValidationSummary: true,
                    items: []
                });
            }
        }]
    });

    assert.strictEqual($testContainer.find('.' + FORM_VALIDATION_SUMMARY).length, 2, 'FORM_VALIDATION_SUMMARY');
});

QUnit.module('Tabs', {
    beforeEach: function() {
        const that = this;
        that.clock = sinon.useFakeTimers();

        responsiveBoxScreenMock.setup.call(this, 1200);
    },

    afterEach: function() {
        this.clock.restore();
        responsiveBoxScreenMock.teardown.call(this);
    }
});
QUnit.test('items aren\'t tiny', function(assert) {
    const testContainer = $('#form');

    testContainer.dxForm({
        formData: {
            firstName: 'John',
            lastName: 'Smith',
            sex: true,
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
                itemType: 'tabbed',
                tabPanelOptions: { animationEnabled: true },
                tabs: [
                    {
                        title: 'Address1',
                        items: ['address.city', 'address.street']
                    },
                    {
                        title: 'Address2',
                        items: ['address.room', 'address.house']
                    }]
            }]
    });
    assert.ok(getWidth(testContainer.find('.dx-multiview-item .dx-textbox').first()) / getWidth(testContainer) > 0.5, 'Editors are not tiny');
});

QUnit.test('Show scroll buttons in tabpanel', function(assert) {
    const $testContainer = $('#form');
    $testContainer.width(250);

    $testContainer.dxForm({
        items: [
            {
                itemType: 'tabbed',
                tabPanelOptions: {
                    showNavButtons: true,
                },
                tabs: [
                    { title: 'tabbed 1111111111111' },
                    { title: 'tabbed 2222222222222' },
                ]
            }
        ]
    });

    assert.strictEqual($testContainer.find('.dx-tabs-nav-button').length, 2, 'tabPanelNavButtons.length');
    assert.strictEqual($testContainer.find('.dx-tabs-scrollable').length, 1, 'tabPanelNavButtons.length');
});

QUnit.test('Render tabs when formData is changed', function(assert) {
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
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        title: 'Other1',
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            items: ['firstName', 'lastName']
                        }, {
                            itemType: 'group',
                            items: ['address.city', 'address.street']
                        }]
                    },
                    {
                        title: 'Other2',
                        items: [{
                            itemType: 'group',
                            colCount: 2,
                            items: ['address.room', 'address.house']
                        }]
                    }]
            }]
    }).dxForm('instance');
    let $groups = testContainer.find('.dx-item-selected ' + '.' + FORM_GROUP_CLASS);

    form.option('formData', {
        firstName: 'Test Name',
        lastName: 'Test Last Name',
        order: 102,
        photo: 'image3.png',
        address: {
            city: 'New City',
            room: 1,
            house: 3,
            street: 'New street'
        } });

    this.clock.tick();

    $groups = testContainer.find('.dx-item-selected ' + '.' + FORM_GROUP_CLASS);
    assert.equal($groups.length, 2);
    assert.equal($groups.eq(0).find('.' + FIELD_ITEM_CLASS).length, 2, 'group 1');
    assert.equal($groups.eq(1).find('.' + FIELD_ITEM_CLASS).length, 2, 'group 2');

    testContainer.find('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', 1);
    this.clock.tick();
    $groups = testContainer.find('.dx-item-selected ' + '.' + FORM_GROUP_CLASS);

    assert.equal($groups.length, 1);
    assert.equal($groups.eq(0).find('.' + FIELD_ITEM_CLASS).length, 2, 'group 1');
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

QUnit.test('Data is updated correctly_T353275', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: {
            firstName: ''
        },
        items: [
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        items: ['firstName']
                    }]
            }]
    }).dxForm('instance');

    form.updateData('firstName', 'Test First Name');

    assert.equal(form.getEditor('firstName').option('value'), 'Test First Name', 'value of editor by \'firstName\' field');
});

QUnit.test('Update editorOptions of an editor inside the tab', function(assert) {
    const testContainer = $('#form');
    const form = testContainer.dxForm({
        formData: {
            firstName: 'Test name'
        },
        items: [{
            itemType: 'tabbed',
            tabs: [{
                items: [{
                    dataField: 'firstName',
                    editorOptions: {
                        disabled: true
                    }
                }]
            }]
        }]
    }).dxForm('instance');

    assert.equal(form.getEditor('firstName').option('disabled'), true, 'initial state: editor is disabled');

    form.option('items[0].tabs[0].items[0].editorOptions.disabled', false);

    assert.equal(form.getEditor('firstName').option('disabled'), false, '\'disabled\' option was successfully changed');
});

QUnit.test('Update layout inside a tab (T1040296)', function(assert) {
    const testContainer = $('#form');

    const form = testContainer.dxForm({
        deferRendering: false,
        items: [
            {
                itemType: 'tabbed',
                tabPanelOptions: { 'deferRendering': false },
                tabs: [
                    {
                        title: 'General',
                        items: [
                            {
                                itemType: 'group',
                                items: [
                                    { dataField: 'id', visible: false },
                                    { itemType: 'group', items: [{ dataField: 'minWidth' }] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }).dxForm('instance');

    form.option('items[0].tabs[0].items[0].items[0].visible', true);
    form.option('items[0].tabs', [
        {
            title: 'General',
            items: [
                {
                    itemType: 'group',
                    items: [
                        { dataField: 'id', visible: true }, { itemType: 'group', items: [{ dataField: 'minWidth' }] }
                    ]
                }
            ]
        },
        { title: 'Window' }
    ]);

    assert.deepEqual([...testContainer.find('.dx-tab-text')].map(e => e.textContent), ['GeneralGeneral', 'WindowWindow'], 'dx-tab-text elements');
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

        responsiveBoxScreenMock.setup.call(this, 1200);
    },
    afterEach: function() {
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

QUnit.test('Change option after group rendered (check for cycling template render)', function(assert) {
    const $formContainer = $('#form').dxForm({
        formData: {
            firstName: 'John',
            lastName: 'Rightman'
        },
        items: [
            {
                itemType: 'group',
                caption: 'Personal',
                items: [
                    {
                        dataField: 'firstName'
                    },
                    {
                        dataField: 'lastName'
                    }
                ]
            }]
    });

    $formContainer.dxForm('instance').option('colCount', 4);

    const $fieldItemWidgets = $formContainer.find('.' + FIELD_ITEM_CONTENT_CLASS);

    assert.equal($fieldItemWidgets.length, 3, 'Correct number of a widgets');
});

QUnit.test('template should be applied to default field if items[].template option has been changed (T1085831)', function(assert) {
    const $formContainer = $('#form').dxForm({
        formData: {
            firstName: 'John',
        },
        items: [
            {
                itemType: 'group',
                caption: 'Personal',
                items: [
                    {
                        dataField: 'firstName'
                    },
                ]
            }]
    });

    const $customFieldTemplate = $('<div>').text('template').addClass('custom-field-template');

    $formContainer.dxForm('instance').option('items[0].items[0].template', () => $customFieldTemplate);

    assert.equal($formContainer.find('.custom-field-template').length, 1, 'custom template has been applied');
    assert.equal($formContainer.find('.custom-field-template').text(), 'template', 'template text is correct');
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

QUnit.module('T986577', () => {
    function getFormConfig() {
        return {
            width: 200,
            screenByWidth: (_) => { return 'md'; },
            colCountByScreen: {
                md: 1
            },
            items: [ {
                label: { text: 'text' },
                template: function() {
                    return $('<div></div>').dxToolbar({
                        multiline: false,
                        items: [
                            { text: 'Item1', locateInMenu: 'auto' },
                            { text: 'Item2', locateInMenu: 'auto' },
                            { text: 'Item3', locateInMenu: 'auto' }
                        ]
                    });
                }
            }, {
                label: { text: 'Very very long text' },
                editorType: 'dxTextBox'
            } ]
        };
    }

    QUnit.test('Toolbar is rendered inside form. alignItemLabels = false', function(assert) {
        const resizeEventSpy = sinon.spy(visibilityEventsModule, 'triggerResizeEvent');
        const $form = $('#form').dxForm(extend({ alignItemLabels: false }, getFormConfig()));

        const resizeEventArg = resizeEventSpy.getCall(0).args[0];
        assert.equal(resizeEventSpy.called, 1, 'resize is triggered only once');
        assert.deepEqual(resizeEventArg.get(0), $form.find(`.${TOOLBAR_CLASS}`).get(0), 'element is toolbar');
        assert.roughEqual(getWidth(resizeEventArg), 164, 5, 'toolbar width is correct');
        assert.roughEqual(getHeight(resizeEventArg), 36, 1, 'toolbar height is correct');

        resizeEventSpy.restore();
    });

    QUnit.test('Toolbar is rendered inside form. alignItemLabels = true', function(assert) {
        const resizeEventSpy = sinon.spy(visibilityEventsModule, 'triggerResizeEvent');
        const $form = $('#form').dxForm(extend({ alignItemLabels: true }, getFormConfig()));

        const resizeEventArg = resizeEventSpy.getCall(0).args[0];
        assert.equal(resizeEventSpy.called, 1, 'resize is triggered only once');
        assert.deepEqual(resizeEventArg.get(0), $form.find(`.${TOOLBAR_CLASS}`).get(0), 'element is toolbar');
        assert.roughEqual(getWidth(resizeEventArg), 72, 5, 'toolbar width is correct');
        assert.roughEqual(getHeight(resizeEventArg), 36, 1, 'toolbar height is correct');

        resizeEventSpy.restore();
    });
});

QUnit.module('Public API', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('UpdateData, simple case', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { test1: 'abc', test2: 'xyz' }
    });

    const form = $testContainer.dxForm('instance');

    form.updateData('test2', 'qwerty');

    assert.equal(form.option('formData.test2'), 'qwerty', 'Correct data');
});

QUnit.test('UpdateData, update with object', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        items: ['test1', 'test2', { dataField: 'test3.SuperMan' }, { dataField: 'test3.Specialization.good' }],
        formData: {
            test1: 'abc', test2: 'xyz', test3: {
                SuperMan: 'Kent',
                Specialization: {
                    good: true
                }
            }
        }
    });

    const form = $testContainer.dxForm('instance');

    form.updateData({
        test1: 'xyz', test2: 'qwerty', test3: {
            SuperMan: 'KAndrew',
            Specialization: {
                good: false
            }
        }
    });

    assert.deepEqual(form.option('formData'), {
        test1: 'xyz', test2: 'qwerty', test3: {
            SuperMan: 'KAndrew',
            Specialization: {
                good: false
            }
        }
    }, 'updated data');
    assert.equal(form.getEditor('test1').option('value'), 'xyz', 'editor\'s value of \'test1\' data field');
    assert.equal(form.getEditor('test2').option('value'), 'qwerty', 'editor\'s value of \'test2\' data field');
    assert.equal(form.getEditor('test3.SuperMan').option('value'), 'KAndrew', 'editor\'s value of \'test3.SuperMan\' data field');
    assert.ok(!form.getEditor('test3.Specialization.good').option('value'), 'editor\'s value of \'test3.Specialization.good\' data field');
});

QUnit.test('Get button instance', function(assert) {
    const form = $('#form').dxForm({
        items: [{
            itemType: 'button',
            name: 'button1',
            buttonOptions: { text: 'button1' }
        }, {
            itemType: 'group',
            items: [{
                itemType: 'button',
                name: 'button2',
                buttonOptions: { text: 'button2' }
            }]
        }, {
            itemType: 'button',
            buttonOptions: { text: 'button3' }
        }]
    }).dxForm('instance');

    const formInvalidateSpy = sinon.spy(form, '_invalidate');

    assert.strictEqual(form.getButton('button1').option('text'), 'button1');
    assert.strictEqual(form.getButton('button2').option('text'), 'button2');
    assert.strictEqual(form.getButton('button3'), undefined);

    form.option('items[1].items[0].buttonOptions.text', 'changed_button_text');

    assert.strictEqual(form.getButton('button2').option('text'), 'changed_button_text');
    assert.strictEqual(formInvalidateSpy.callCount, 0, 'Invalidate does not called');
});

QUnit.testInActiveWindow('Change \'Button.icon\'', function(assert) {
    ['option', 'itemOption', 'editor.option'].forEach(function(setOptionWay) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'button',
                name: 'button1',
                buttonOptions: { icon: 'icon1' }
            }]
        }).dxForm('instance');

        if(device.real().deviceType === 'desktop') {
            $('#form').find('.dx-button').focus();
            assert.ok($('#form').find('.dx-button').is(':focus'), 'initial focus');
        }

        switch(setOptionWay) {
            case 'option':
                form.option('items[0].buttonOptions.icon', 'icon2');
                break;
            case 'itemOption': {
                const buttonOptions = form.itemOption('button1').buttonOptions;
                buttonOptions.icon = 'icon2';
                form.itemOption('button1', 'buttonOptions', buttonOptions);
                break;
            }
            case 'editor.option':
                form.getButton('button1').option('icon', 'icon2');
                break;
        }

        assert.strictEqual(form.getButton('button1').option('icon'), 'icon2');
        if(device.real().deviceType === 'desktop') {
            assert.ok($('#form').find('.dx-button').is(':focus'), 'final focus');
        }
    });
});

QUnit.test('Get editor instance', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        formData: { test1: 'abc', test2: 'xyz' },
        items: ['test1', { name: 'test3', editorType: 'dxNumberBox' }]
    });

    const form = $testContainer.dxForm('instance');

    assert.ok(!typeUtils.isDefined(form.getEditor('test2')), 'We hasn\'t instance for \'test2\' field');
    assert.ok(typeUtils.isDefined(form.getEditor('test1')), 'We have instance for \'test1\' field');
    assert.ok(typeUtils.isDefined(form.getEditor('test3')), 'We have instance for \'test3\' field');

    assert.equal(form.getEditor('test1').NAME, 'dxTextBox', 'It\'s textbox');
    assert.equal(form.getEditor('test3').NAME, 'dxNumberBox', 'It\'s numberBox');
});

QUnit.test('Get editor instance with group config', function(assert) {
    const $testContainer = $('#form');

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

    const form = $testContainer.dxForm('instance');

    assert.ok(typeUtils.isDefined(form.getEditor('test1')), 'We have instance for \'test1\' field');
    assert.ok(typeUtils.isDefined(form.getEditor('test2')), 'We have instance for \'test2\' field');
    assert.ok(typeUtils.isDefined(form.getEditor('test3')), 'We have instance for \'test3\' field');

    assert.equal(form.getEditor('test2').NAME, 'dxTextArea', 'It\'s textArea');
    assert.equal(form.getEditor('test3').NAME, 'dxTextBox', 'It\'s textBox');
});

QUnit.test('UpdateDimensions', function(assert) {
    const $testContainer = $('#form');

    $testContainer.dxForm({
        height: 200,
        formData: { test1: 'abc', test2: 'xyz', test3: '123' },
        items: ['test1', 'test2', 'test3', {
            template: function() {
                return $('<div/>')
                    .attr('id', 'testBlock')
                    .css({ height: 300, 'backgroundColor': 'red' });
            }
        }]
    });

    const form = $testContainer.dxForm('instance');
    let isSizeUpdated;

    $('#testBlock').hide();
    form.updateDimensions().done(function() {
        isSizeUpdated = true;
    });
    this.clock.tick();

    assert.ok(isSizeUpdated);
});

function triggerKeyUp($element, key) {
    const e = $.Event('keyup');
    e.key = key;
    $($element.find('input').first()).trigger(e);
}

QUnit.test('Check component instance onEditorEnterKey', function(assert) {
    let testArgs;
    const form = $('#form').dxForm({
        formData: {
            name: 'Kyle',
            work: 'MexCo'
        },
        onEditorEnterKey: function(args) {
            testArgs = args;
        }
    }).dxForm('instance');

    const editor = form.getEditor('work');
    triggerKeyUp(editor.$element(), 'Enter');

    assert.notEqual(testArgs.component, undefined, 'component');
    assert.notEqual(testArgs.element, undefined, 'element');
    assert.notEqual(testArgs.event, undefined, 'Event');
    assert.equal(testArgs.dataField, 'work', 'dataField');
    assert.equal(testArgs.component.NAME, 'dxForm', 'correct component');
});

QUnit.test('Use \'itemOption\' with no items', function(assert) {
    const $testContainer = $('#form').dxForm({
        height: 200,
        formData: { test1: 'abc', test2: 'xyz', test3: '123' }
    });
    const form = $testContainer.dxForm('instance');
    const testItem = form.itemOption('test2');

    form.itemOption('test3', 'label', { text: 'NEWLABEL' });

    assert.deepEqual(testItem, { dataField: 'test2' }, 'corrected item received');
    assert.equal($testContainer.find('.' + FIELD_ITEM_LABEL_CLASS).last().text(), 'NEWLABEL:', 'new label rendered');
});

QUnit.test('Use \'itemOption\' do not change the order of an items', function(assert) {
    const contentReadyStub = sinon.stub();
    const $testContainer = $('#form').dxForm({
        height: 200,
        formData: { ID: 1, FistName: 'Alex', LastName: 'Johnson', Address: 'Alabama' },
        items: [
            'ID',
            { dataField: 'FirstName' },
            { dataField: 'LastName' },
            'Address'
        ]
    });
    const form = $testContainer.dxForm('instance');

    form.on('contentReady', contentReadyStub);
    form.itemOption('FirstName', {
        visible: true,
        label: {
            text: 'Test Label'
        },
        editorOptions: {
            value: '',
            useMaskedValue: true,
            placeholder: 'CNPJ',
            mask: '000.000.000-00'
        }
    });

    assert.deepEqual(
        form.option('items'),
        [
            { dataField: 'ID' },
            {
                dataField: 'FirstName',
                visible: true,
                label: {
                    text: 'Test Label'
                },
                editorOptions: {
                    value: '',
                    useMaskedValue: true,
                    placeholder: 'CNPJ',
                    mask: '000.000.000-00'
                }
            },
            { dataField: 'LastName' },
            { dataField: 'Address' }
        ],
        'correct items order');

    assert.equal(contentReadyStub.callCount, 1, 'the form renders once');
});

QUnit.test('Use \'itemOption\' with groups', function(assert) {
    const $testContainer = $('#form').dxForm({
        height: 200,
        formData: { EmployeeID: 1, LastName: 'John', FirstName: 'Dow', BirthData: '01/01/1970', HireDate: '12/11/1995' },
        items: [
            {
                itemType: 'group',
                items: [
                    {
                        itemType: 'group',
                        caption: 'Personal',
                        items: [{
                            itemType: 'group',
                            caption: 'Full Name',
                            colCount: 3,
                            items: ['EmployeeID', 'LastName', 'FirstName']
                        }, {
                            itemType: 'group',
                            caption: 'Dates',
                            items: ['BirthDate', 'HireDate']
                        }]
                    }
                ]
            }
        ]
    }
    );
    const form = $testContainer.dxForm('instance');

    const unknownField = form.itemOption('FirstName');
    const firstGroup = form.itemOption('Personal');
    const secondGroup = form.itemOption('Personal.FullName');
    const innerOption = form.itemOption('Personal.FullName.FirstName');

    form.itemOption('Personal.Dates.HireDate', 'label', { text: 'NEWLABEL' });

    assert.equal(unknownField, undefined, 'corrected item received');
    assert.deepEqual({ itemType: firstGroup.itemType, caption: firstGroup.caption }, { itemType: 'group', caption: 'Personal' }, 'corrected item received');
    assert.deepEqual({ itemType: secondGroup.itemType, caption: secondGroup.caption }, { itemType: 'group', caption: 'Full Name' }, 'corrected item received');
    assert.equal(innerOption.dataField, 'FirstName', 'corrected item received');

    assert.equal($testContainer.find('.' + FIELD_ITEM_LABEL_CLASS).last().text(), 'NEWLABEL:', 'new label rendered');
});

QUnit.test('Use \'itemOption\' with groups and one group has empty caption (T359214)', function(assert) {
    const $testContainer = $('#form').dxForm({
        height: 200,
        items: [
            {
                itemType: 'group',
                caption: '',
                items: [
                    {
                        itemType: 'simple',
                        dataField: 'Sequence',
                        editType: 'dxTextBox'
                    },
                    {
                        itemType: 'simple',
                        dataField: 'AgentID',
                        editorType: 'dxTextBox'
                    }
                ]
            },
            {
                itemType: 'group',
                caption: 'TestGroup1',
                items: [
                    {
                        itemType: 'group',
                        caption: 'Tax',
                        items: [
                            {
                                itemType: 'simple',
                                dataField: 'IsResident',
                                editorType: 'dxTextBox'
                            },
                            {
                                itemType: 'simple',
                                dataField: 'Minor',
                                editorType: 'dxTextBox'
                            }
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: 'TestGroup2',
                        items: [
                            {
                                itemType: 'simple',
                                dataField: 'DIN',
                                editorType: 'dxTextBox'
                            }
                        ],
                    }
                ]
            }
        ]
    }
    );
    const form = $testContainer.dxForm('instance');

    form.itemOption('TestGroup1.TestGroup2', 'caption', 'custom');

    assert.equal($testContainer.find('.' + FORM_GROUP_CAPTION_CLASS).last().text(), 'custom', 'new caption rendered');
});

QUnit.test('Use \'itemOption\' with tabs', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { EmployeeID: 1, LastName: 'John', FirstName: 'Dow', BirthData: '01/01/1970', HireDate: '12/11/1995', Country: 'USA', City: 'Phoenix', Region: 'Arizona', Title: 'Ms' },
        items: [
            'EmployeeID', 'FirstName', 'LastName',
            {
                itemType: 'tabbed',
                tabs: [
                    {
                        title: 'Dates',
                        items: ['BirthDate', 'HireDate']
                    },
                    {
                        title: 'Address',
                        colCount: 2,
                        items: ['Country', 'City', 'Region']
                    },
                    {
                        title: 'Title',
                        items: ['Title']
                    }
                ]
            }
        ] }
    );
    const form = $testContainer.dxForm('instance');
    const tabItem = form.itemOption('Address');
    const innerTabItem = form.itemOption('Address.Country');

    form.itemOption('Dates.HireDate', 'label', { text: 'NEWLABEL' });

    assert.deepEqual(tabItem, {
        title: 'Address',
        colCount: 2,
        items: [{ dataField: 'Country' }, { dataField: 'City' }, { dataField: 'Region' }]
    }, 'Correct tab\'s item');
    assert.equal(innerTabItem.dataField, 'Country', 'corrected item received');
    assert.equal($testContainer.find('.' + FIELD_ITEM_LABEL_CLASS).eq(4).text(), 'NEWLABEL:', 'new label rendered');
});

QUnit.test('\'itemOption\' should get an item with several spaces in the caption', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { EmployeeID: 1, LastName: 'John', FirstName: 'Dow' },
        items: [
            'EmployeeID',
            {
                itemType: 'group',
                caption: 'Test group item',
                items: [
                    'FirstName', 'LastName'
                ]
            }
        ] }
    );
    const form = $testContainer.dxForm('instance');

    const groupItem = form.itemOption('Testgroupitem');
    const innerGroupItem = form.itemOption('Testgroupitem.FirstName');

    assert.deepEqual(groupItem, {
        itemType: 'group',
        caption: 'Test group item',
        items: [ { dataField: 'FirstName' }, { dataField: 'LastName' }]
    }, 'Correct group item');

    form.itemOption('Testgroupitem.LastName', 'label', { text: 'NEWLABEL' });

    assert.equal(innerGroupItem.dataField, 'FirstName', 'corrected item received');
    assert.equal($testContainer.find('.' + FIELD_ITEM_LABEL_CLASS).last().text(), 'NEWLABEL:', 'new label rendered');
});

QUnit.test('\'itemOption\' should get an item with several spaces in the caption and long path', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { EmployeeID: 1, LastName: 'John', FirstName: 'Dow' },
        items: [
            'EmployeeID',
            {
                itemType: 'group',
                caption: 'Test group 1',
                items: [{
                    itemType: 'group',
                    caption: 'Test group 2',
                    items: ['FirstName', 'LastName']
                }]
            }
        ] }
    );
    const form = $testContainer.dxForm('instance');

    const innerGroupItem = form.itemOption('Testgroup1.Testgroup2.FirstName');

    assert.deepEqual(innerGroupItem, { dataField: 'FirstName' }, 'corrected item received');
});

QUnit.test('\'itemOption\' should get an group inner item located into tabbed item', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: { EmployeeID: 1, LastName: 'John', FirstName: 'Dow' },
        items: [
            {
                itemType: 'tabbed',
                tabs: [{
                    title: 'Test Tab 1',
                    items: ['EmployeeID']
                }, {
                    title: 'Test Tab 2',
                    items: [{
                        itemType: 'group',
                        caption: 'Test Group 1',
                        items: ['FirstName', 'LastName']
                    }]
                }]
            }]
    });
    const form = $testContainer.dxForm('instance');

    const innerGroupItem = form.itemOption('TestTab2.TestGroup1.FirstName');

    assert.deepEqual(innerGroupItem, { dataField: 'FirstName' }, 'corrected item received');
});

QUnit.test('\'itemOption\' should get item by composite path use the name option', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: {
            LastName: 'Last Name'
        },
        items: [{
            itemType: 'group',
            caption: 'My Custom Group',
            name: 'testGroup',
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'My Custom Tab',
                    name: 'tab1',
                    items: [{
                        name: 'simpleItem',
                        dataField: 'LastName'
                    }]
                }]
            }]
        }]
    });
    const form = $testContainer.dxForm('instance');

    const item = form.itemOption('testGroup.tab1.simpleItem');

    assert.deepEqual(item.dataField, 'LastName', 'data field of item');
});

QUnit.test('\'itemOption\' should get a group item by the name option', function(assert) {
    const $testContainer = $('#form').dxForm({
        formData: {
            LastName: 'Last Name'
        },
        items: [{
            itemType: 'group',
            name: 'testGroup',
            items: [{
                name: 'simpleItem',
                dataField: 'LastName'
            }]
        }]
    });

    const item = $testContainer.dxForm('instance').itemOption('testGroup');

    assert.ok(!!item, 'get a group item');
    assert.equal(item.itemType, 'group', 'It\'s a group item');
    assert.deepEqual(item.items, [{
        name: 'simpleItem',
        dataField: 'LastName'
    }], 'has correct items');
});

QUnit.test('The exception is not thrown when option of an unknown item is changed', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'Name'
        }
    }).dxForm('instance');

    form.itemOption('lastName', 'cssClass', 'custom-class');

    assert.equal(form.$element().find('.custom-class').length, 0, 'custom css class is not found');
});

QUnit.test('No errors should occur on form reset twice when dxNumberBox is set as item with visible=false (T1146107)', function(assert) {
    const form = $('#form').dxForm({
        items: [{
            itemType: 'group',
            items: [{
                editorType: 'dxNumberBox',
                dataField: 'TestField',
            }]
        }],
    }).dxForm('instance');

    form.itemOption('TestField', 'visible', false);

    form.clear();
    form.clear();

    assert.ok(true, 'There are no exceptions');
});

QUnit.test('The exception is not thrown when tabs property in TabbedItem is not defined (T1151539)', function(assert) {
    try {
        $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabPanelOptions: {
                    deferRendering: false,
                },
            }]
        });
    } catch(e) {
        assert.ok(false, e);
    } finally {
        assert.ok(true, 'the exception is not thrown');
    }
});

[false, true].forEach(useItemOption => {
    const optionWay = useItemOption ? 'itemOption' : 'option';
    QUnit.test(`Changing an editor/button options without re-render Form when use the ${optionWay} method (T311892, T681241)`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                lastName: 'Kyle',
                firstName: 'John'
            },
            items: [
                { dataField: 'firstName', editorType: 'dxTextBox', editorOption: { width: 100, height: 20 } },
                { dataField: 'lastName', editorType: 'dxTextBox', editorOption: { width: 100, height: 20 } },
                { name: 'button', itemType: 'button', buttonOptions: { width: 100, height: 20 } }
            ]
        }).dxForm('instance');

        const formInvalidateSpy = sinon.spy(form, '_invalidate');
        const editorOptions = { width: 80, height: 40 };
        const buttonOptions = { width: 10, height: 20 };

        if(useItemOption) {
            form.itemOption('lastName', 'editorOptions', editorOptions);
            form.itemOption('button', 'buttonOptions', buttonOptions);
        } else {
            form.option('items[1].editorOptions', editorOptions);
            form.option('items[2].buttonOptions', buttonOptions);
        }

        const editor = $('#form .dx-textbox').last().dxTextBox('instance');
        const button = $('#form .dx-button').last().dxButton('instance');

        assert.deepEqual(form.option('items[1].editorOptions'), { width: 80, height: 40 }, 'correct editor options');
        assert.deepEqual(form.option('items[2].buttonOptions'), { width: 10, height: 20 }, 'correct button options');

        assert.equal(formInvalidateSpy.callCount, 0, 'Invalidate does not called');

        assert.equal(editor.option('width'), 80, 'Correct editor width');
        assert.equal(editor.option('height'), 40, 'Correct editor height');
        assert.equal(button.option('width'), 10, 'Correct button width');
        assert.equal(button.option('height'), 20, 'Correct button height');
    });

    QUnit.test(`Changing the editorOptions of a sub item without re-render Form when use the ${optionWay} method (T316522)`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                lastName: 'Kyle',
                firstName: 'John'
            },
            items: [
                {
                    itemType: 'group', items: [
                        {
                            itemType: 'group', items: [
                                {
                                    dataField: 'firstName',
                                    editorType: 'dxTextBox',
                                    editorOptions: { width: 100, height: 20 }
                                },
                                {
                                    dataField: 'lastName',
                                    editorType: 'dxTextBox',
                                    editorOptions: { width: 100, height: 20 }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).dxForm('instance');

        const editorOptions = { width: 80, height: 40 };
        if(useItemOption) {
            form.itemOption('lastName', 'editorOptions', editorOptions);
        } else {
            form.option('items[0].items[0].items[1].editorOptions', editorOptions);
        }

        const secondEditor = $('#form .dx-textbox').last().dxTextBox('instance');

        assert.equal(secondEditor.option('width'), 80, 'Correct width');
        assert.equal(secondEditor.option('height'), 40, 'Correct height');
    });

    QUnit.test(`The editorOptions correctly updates in case when only item name is defined and use the ${optionWay} method`, function(assert) {
        const form = $('#form').dxForm({
            items: [
                {
                    itemType: 'group', items: [
                        {
                            itemType: 'group', items: [
                                {
                                    name: 'firstName',
                                    editorType: 'dxTextBox',
                                    editorOptions: { width: 100, height: 20 }
                                },
                                {
                                    name: 'lastName',
                                    editorType: 'dxTextBox',
                                    editorOptions: { width: 100, height: 20 }
                                }
                            ]
                        }
                    ]
                }
            ]
        }).dxForm('instance');

        const invalidateSpy = sinon.spy(form, '_invalidate');

        const editorOptions = { width: 80, height: 40 };
        if(useItemOption) {
            form.itemOption('lastName', 'editorOptions', editorOptions);
        } else {
            form.option('items[0].items[0].items[1].editorOptions', editorOptions);
        }

        const secondEditor = $('#form .dx-textbox').last().dxTextBox('instance');

        assert.equal(invalidateSpy.callCount, 0, 'dxForm wasn\'t invalidated');
        assert.equal(secondEditor.option('width'), 80, 'Correct width');
        assert.equal(secondEditor.option('height'), 40, 'Correct height');
    });

    QUnit.test('Change editor/button options when item is hidden via api', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item0'
            }, {
                itemType: 'button',
                name: 'item1'
            }]
        }).dxForm('instance');

        const setItemOption = (index, optionName, value) => {
            if(useItemOption) {
                form.itemOption(`item${index}`, optionName, value);
            } else {
                form.option(`items[${index}].${optionName}`, value);
            }
        };

        setItemOption(0, 'visible', false);
        setItemOption(0, 'editorOptions', { width: 200 });
        setItemOption(1, 'visible', false);
        setItemOption(1, 'buttonOptions', { width: 100 });

        assert.equal(form.getEditor('item1'), undefined, 'editor of first item');
        assert.equal(form.getButton('item2'), undefined, 'button of second item');
        assert.deepEqual(form.option('items[0].editorOptions'), { width: 200 }, 'editor options of first item');
        assert.deepEqual(form.option('items[1].buttonOptions'), { width: 100 }, 'button options of second item');
    });

    QUnit.test(`Set a new validation rules when groups are nested one into another and use the ${optionWay} method`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                name: null,
                lastName: null
            },
            showValidationSummary: true,
            items: [{
                itemType: 'group',
                name: 'group1',
                items: [{
                    dataField: 'name'
                }, {
                    itemType: 'group',
                    name: 'group2',
                    items: [{
                        dataField: 'lastName'
                    }]
                }]
            }]
        }).dxForm('instance');

        form.beginUpdate();

        if(useItemOption) {
            form.itemOption('group1.name', 'validationRules', [{ type: 'required', message: 'Name is required' }]);
            form.itemOption('group1.group2.lastName', 'validationRules', [{ type: 'required', message: 'Last Name is required' }]);
        } else {
            form.option('items[0].items[0].validationRules', [{ type: 'required', message: 'Name is required' }]);
            form.option('items[0].items[1].items[0].validationRules', [{ type: 'required', message: 'Last Name is required' }]);
        }

        form.endUpdate();
        form.validate();

        const $summaryItemContents = $('.dx-validationsummary-item-content');
        assert.equal($summaryItemContents.length, 2, 'validation summary items count');
        assert.equal($summaryItemContents.eq(0).text(), 'Name is required', 'text of the first summary item');
        assert.equal($summaryItemContents.eq(1).text(), 'Last Name is required', 'text of the second summary item');
    });

    QUnit.test(`Set a new validation rules when tabs are nested into a group and use the ${optionWay} method`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                name: null,
                lastName: null
            },
            showValidationSummary: true,
            items: [{
                itemType: 'group',
                name: 'group1',
                items: [{
                    dataField: 'name'
                }, {
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'title1',
                        items: [{
                            dataField: 'lastName'
                        }]
                    }]
                }]
            }]
        }).dxForm('instance');

        form.beginUpdate();

        if(useItemOption) {
            form.itemOption('group1.name', 'validationRules', [{ type: 'required', message: 'Name is required' }]);
            form.itemOption('group1.title1.lastName', 'validationRules', [{ type: 'required', message: 'Last Name is required' }]);
        } else {
            form.option('items[0].items[0].validationRules', [{ type: 'required', message: 'Name is required' }]);
            form.option('items[0].items[1].tabs[0].items[0].validationRules', [{ type: 'required', message: 'Last Name is required' }]);
        }

        form.endUpdate();
        form.validate();

        const $summaryItemContents = $('.dx-validationsummary-item-content');
        assert.equal($summaryItemContents.length, 2, 'validation summary items count');
        assert.equal($summaryItemContents.eq(0).text(), 'Name is required', 'text of the first summary item');
        assert.equal($summaryItemContents.eq(1).text(), 'Last Name is required', 'text of the second summary item');
    });
});

QUnit.test('Changing the item\'s option via the itemOption when these options are set as object without re-render form', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'Test Name'
        },
        items: [
            {
                dataField: 'name',
                editorOption: { width: 100 },
                cssClass: 'test'
            }
        ]
    }).dxForm('instance');

    const formInvalidateSpy = sinon.spy(form, '_invalidate');

    form.itemOption('name', {
        editorOptions: { height: 120 },
        cssClass: 'test-class'
    });

    assert.equal(formInvalidateSpy.callCount, 0, 'Invalidate does not called');

    const editor = form.getEditor('name');
    assert.equal(editor.option('height'), 120, 'height of editor options');

    const $form = $('#form');
    assert.strictEqual($form.find('.test-class').length, 1, 'new cssClass of item');
    assert.strictEqual($form.find('.test').length, 0, 'old cssClass of item');
});

QUnit.test('Changing the item\'s option via the itemOption when these options are set as object with re-render form', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'Test Name'
        },
        items: [{ dataField: 'name' }]
    }).dxForm('instance');

    const formInvalidateSpy = sinon.spy(form, '_invalidate');

    form.itemOption('name', {
        colSpan: 2,
        cssClass: 'test-class'
    });

    assert.equal(formInvalidateSpy.callCount, 1, 'Invalidate does not called');

    assert.equal(form.option('items[0].colSpan'), 2, 'colSpan of item');
    assert.strictEqual($('#form').find('.test-class').length, 1, 'cssClass of item');
});

QUnit.module('visible/visibleIndex', () => {
    QUnit.test('item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: true },
                { dataField: 'field2', visible: true } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: true, visibleIndex: 0 },
                { dataField: 'field2', visible: true, visibleIndex: 1 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: true, visibleIndex: 1 },
                { dataField: 'field2', visible: true, visibleIndex: 0 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: true, visibleIndex: 2 },
                { dataField: 'field2', visible: true, visibleIndex: 3 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: true, visibleIndex: 5 },
                { dataField: 'field2', visible: true, visibleIndex: 2 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('item1.visible:false -> item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: false },
                { dataField: 'field2', visible: true }
            ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_1');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('item1.visible:false -> item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: false, visibleIndex: 0 },
                { dataField: 'field2', visible: true, visibleIndex: 1 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('item1.visible:false -> item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: false, visibleIndex: 1 },
                { dataField: 'field2', visible: true, visibleIndex: 0 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('item1.visible:false -> item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: false, visibleIndex: 2 },
                { dataField: 'field2', visible: true, visibleIndex: 5 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('item1.visible:false -> item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [
                { dataField: 'field1', visible: false, visibleIndex: 5 },
                { dataField: 'field2', visible: true, visibleIndex: 2 } ]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('group.item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                items: [
                    { dataField: 'field1', visible: true },
                    { dataField: 'field2', visible: true } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('group.item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                items: [
                    { dataField: 'field1', visible: true, visibleIndex: 0 },
                    { dataField: 'field2', visible: true, visibleIndex: 1 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('group.item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                items: [
                    { dataField: 'field1', visible: true, visibleIndex: 1 },
                    { dataField: 'field2', visible: true, visibleIndex: 0 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('group.item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                items: [
                    { dataField: 'field1', visible: true, visibleIndex: 2 },
                    { dataField: 'field2', visible: true, visibleIndex: 3 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('group.item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                items: [
                    { dataField: 'field1', visible: true, visibleIndex: 5 },
                    { dataField: 'field2', visible: true, visibleIndex: 2 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('group.item1.visible:false -> group.item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false },
                    { dataField: 'field2', visible: true } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('group.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_1');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('group.item1.visible:false -> group.item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false, visibleIndex: 0 },
                    { dataField: 'field2', visible: true, visibleIndex: 1 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('group.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('group.item1.visible:false -> group.item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false, visibleIndex: 1 },
                    { dataField: 'field2', visible: true, visibleIndex: 0 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('group.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('group.item1.visible:false -> group.item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false, visibleIndex: 2 },
                    { dataField: 'field2', visible: true, visibleIndex: 5 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('group.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('group.item1.visible:false -> group.item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                colCount: 1,
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false, visibleIndex: 5 },
                    { dataField: 'field2', visible: true, visibleIndex: 2 } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('group.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('tabbedGroup.item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabs: [ { title: 'tab', items: [
                    { dataField: 'field1', visible: true },
                    { dataField: 'field2', visible: true } ]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('tabbedGroup.item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabs: [ { title: 'tab', items: [
                    { dataField: 'field1', visible: true, visibleIndex: 0 },
                    { dataField: 'field2', visible: true, visibleIndex: 1 } ]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('tabbedGroup.item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: true, visibleIndex: 1 },
                        { dataField: 'field2', visible: true, visibleIndex: 0 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('tabbedGroup.item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: true, visibleIndex: 2 },
                        { dataField: 'field2', visible: true, visibleIndex: 3 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field1', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field2', 'inputs');
    });

    QUnit.test('tabbedGroup.item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: true, visibleIndex: 5 },
                        { dataField: 'field2', visible: true, visibleIndex: 2 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2', 'inputs');
        assert.equal($inputs.eq(1).attr('name'), 'field1', 'inputs');
    });

    QUnit.test('tabbedGroup.item1.visible:false -> tabbedGroup.item1.visible:true (no visibleIndex)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false },
                        { dataField: 'field2', visible: true }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('tabbed.tab.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_1');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('tabbedGroup.item1.visible:false -> tabbedGroup.item1.visible:true (sequential visibleIndex starting from 0)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false, visibleIndex: 0 },
                        { dataField: 'field2', visible: true, visibleIndex: 1 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('tabbed.tab.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('tabbedGroup.item1.visible:false -> tabbedGroup.item1.visible:true (sequantial visibleIndex starting from 0 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false, visibleIndex: 1 },
                        { dataField: 'field2', visible: true, visibleIndex: 0 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('tabbed.tab.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('tabbedGroup.item1.visible:false -> tabbedGroup.item1.visible:true (non sequensial visibleIndex starting from 2)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false, visibleIndex: 2 },
                        { dataField: 'field2', visible: true, visibleIndex: 5 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('tabbed.tab.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field1', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field2', 'inputs_2');
    });

    QUnit.test('tabbedGroup.item1.visible:false -> tabbedGroup.item1.visible:true (non sequantial visibleIndex starting from 2 does not fit with items order)', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false, visibleIndex: 5 },
                        { dataField: 'field2', visible: true, visibleIndex: 2 }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.eq(0).attr('name'), 'field2');

        form.itemOption('tabbed.tab.field1', 'visible', true);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.eq(0).attr('name'), 'field2', 'inputs_2');
        assert.equal($inputs_2.eq(1).attr('name'), 'field1', 'inputs_2');
    });

    QUnit.test('group.all.visible:false -> group.item1.visible:true,group.item2.visible:false (no visibleIndex), useUpdate=false', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false },
                    { dataField: 'field2', visible: false } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.length, 0);

        form.itemOption('group.field1', 'visible', true);
        form.itemOption('group.field2', 'visible', false);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.length, 1);
        assert.equal($inputs_2.eq(0).attr('name'), 'field1');
    });

    QUnit.test('group.all.visible:false -> group.item1.visible:true,group.item2.visible:false (no visibleIndex), useUpdate=true', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                name: 'group',
                items: [
                    { dataField: 'field1', visible: false },
                    { dataField: 'field2', visible: false } ]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.length, 0);

        form.beginUpdate();
        form.itemOption('group.field1', 'visible', true);
        form.itemOption('group.field2', 'visible', false);
        form.endUpdate();

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.length, 1);
        assert.equal($inputs_2.eq(0).attr('name'), 'field1');
    });

    QUnit.test('tabbedGroup.all.visible:false -> tabbedGroup.item1.visible:true, tabbedGroup.item2.visible:false (no visibleIndex), useUpdate=false', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false },
                        { dataField: 'field2', visible: false }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.length, 0);

        form.itemOption('tabbed.tab.field1', 'visible', true);
        form.itemOption('tabbed.tab.field2', 'visible', false);

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.length, 1);
        assert.equal($inputs_2.eq(0).attr('name'), 'field1');
    });

    QUnit.test('tabbedGroup.all.visible:false -> tabbedGroup.item1.visible:true, tabbedGroup.item2.visible:false (no visibleIndex), useUpdate=true', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'tabbed',
                name: 'tabbed',
                tabs: [{
                    title: 'tab', items: [
                        { dataField: 'field1', visible: false },
                        { dataField: 'field2', visible: false }]
                }]
            }]
        }).dxForm('instance');

        const $inputs = form.$element().find('input');
        assert.equal($inputs.length, 0);

        form.beginUpdate();
        form.itemOption('tabbed.tab.field1', 'visible', true);
        form.itemOption('tabbed.tab.field2', 'visible', false);
        form.endUpdate();

        const $inputs_2 = form.$element().find('input');
        assert.equal($inputs_2.length, 1);
        assert.equal($inputs_2.eq(0).attr('name'), 'field1');
    });
});

QUnit.test('clear - old test', function(assert) {
    const form = $('#form').dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            room: 1,
            isDeveloper: true
        },
        items: ['name', 'lastName', 'room', 'isDeveloper']
    }).dxForm('instance');

    form.clear();

    assert.strictEqual(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.strictEqual(form.getEditor('lastName').option('value'), '', 'editor for the lastName dataField');
    assert.strictEqual(form.getEditor('room').option('value'), null, 'editor for the room dataField');
    assert.strictEqual(form.getEditor('isDeveloper').option('value'), false, 'editor for the isDeveloper dataField');
});

QUnit.test('clear - clear formData and editors', function(assert) {
    const formData = {
        dxAutocomplete: 'a',
        dxCalendar: new Date(2019, 1, 1),
        dxCheckBox: true,
        dxColorBox: 'a',
        dxDateBox: new Date(2019, 1, 1),
        dxDropDownBox: '1',
        dxHtmlEditor: 'a',
        dxLookup: '1',
        dxNumberBox: 1,
        dxRadioGroup: '1',
        dxSelectBox: '1',
        dxTagBox: ['1'],
        dxTextArea: 'a',
        dxTextBox: 'a',
        dxDateRangeBox: [null, new Date(2021, 9, 17)],
    };

    const formItems = [
        { dataField: 'dxAutocomplete', editorType: 'dxAutocomplete' },
        { dataField: 'dxCalendar', editorType: 'dxCalendar' },
        { dataField: 'dxCheckBox', editorType: 'dxCheckBox' },
        { dataField: 'dxDateBox', editorType: 'dxDateBox' },
        { dataField: 'dxDropDownBox', editorType: 'dxDropDownBox', editorOptions: { dataSource: ['1'] } },
        { dataField: 'dxHtmlEditor', editorType: 'dxHtmlEditor' },
        { dataField: 'dxLookup', editorType: 'dxLookup', editorOptions: { dataSource: ['1'] } },
        { dataField: 'dxNumberBox', editorType: 'dxNumberBox' },
        { dataField: 'dxRadioGroup', editorType: 'dxRadioGroup', editorOptions: { dataSource: ['1'] } },
        { dataField: 'dxSelectBox', editorType: 'dxSelectBox', editorOptions: { dataSource: ['1'] } },
        { dataField: 'dxTagBox', editorType: 'dxTagBox', editorOptions: { dataSource: ['1'] } },
        { dataField: 'dxTextArea', editorType: 'dxTextArea' },
        { dataField: 'dxTextBox', editorType: 'dxTextBox' },
        { dataField: 'dxDateRangeBox', editorType: 'dxDateRangeBox', editorOptions: { value: ['9/17/2021'] } },
    ];

    const form = $('#form').dxForm({
        formData,
        items: formItems
    }).dxForm('instance');

    form.clear();

    const defaultResetValue = null;
    const stringEditorResetValue = '';
    const dxCheckBoxResetValue = false;
    const dxTagBoxResetValue = [];
    const dxDateRangeBoxResetValue = [null, null];

    assert.strictEqual(formData.dxAutocomplete, defaultResetValue, 'formData.dxAutocomplete');
    assert.strictEqual(formData.dxCalendar, defaultResetValue, 'formData.dxCalendar');
    assert.strictEqual(formData.dxCheckBox, dxCheckBoxResetValue, 'formData.dxCheckBox');
    assert.strictEqual(formData.dxDateBox, defaultResetValue, 'formData.dxDateBox');
    assert.strictEqual(formData.dxDropDownBox, defaultResetValue, 'formData.dxDropDownBox');
    assert.strictEqual(formData.dxHtmlEditor, defaultResetValue, 'formData.dxHtmlEditor');
    assert.strictEqual(formData.dxLookup, defaultResetValue, 'formData.dxLookup');
    assert.strictEqual(formData.dxNumberBox, defaultResetValue, 'formData.dxNumberBox');
    assert.strictEqual(formData.dxRadioGroup, defaultResetValue, 'formData.dxRadioGroup');
    assert.strictEqual(formData.dxSelectBox, defaultResetValue, 'formData.dxSelectBox');
    assert.strictEqual(formData.dxTagBox.length, dxTagBoxResetValue.length, 'formData.dxTagBox.length');
    assert.strictEqual(formData.dxTextArea, stringEditorResetValue, 'formData.dxTextArea');
    assert.strictEqual(formData.dxTextBox, stringEditorResetValue, 'formData.dxTextBox');
    assert.deepEqual(formData.dxDateRangeBox, dxDateRangeBoxResetValue, 'formData.dxDateRangeBox');

    assert.strictEqual(form.getEditor('dxAutocomplete').option('value'), defaultResetValue, 'form.getEditor.dxAutocomplete');
    assert.strictEqual(form.getEditor('dxCalendar').option('value'), defaultResetValue, 'form.getEditor.dxCalendar');
    assert.strictEqual(form.getEditor('dxCheckBox').option('value'), dxCheckBoxResetValue, 'form.getEditor.dxCheckBox');
    assert.strictEqual(form.getEditor('dxDateBox').option('value'), defaultResetValue, 'form.getEditor.dxDateBox');
    assert.strictEqual(form.getEditor('dxDropDownBox').option('value'), defaultResetValue, 'form.getEditor.dxDropDownBox');
    assert.strictEqual(form.getEditor('dxHtmlEditor').option('value'), defaultResetValue, 'form.getEditor.dxHtmlEditor');
    assert.strictEqual(form.getEditor('dxLookup').option('value'), defaultResetValue, 'form.getEditor.dxLookup');
    assert.strictEqual(form.getEditor('dxNumberBox').option('value'), defaultResetValue, 'form.getEditor.dxNumberBox');
    assert.strictEqual(form.getEditor('dxRadioGroup').option('value'), defaultResetValue, 'form.getEditor.dxRadioGroup');
    assert.strictEqual(form.getEditor('dxSelectBox').option('value'), defaultResetValue, 'form.getEditor.dxSelectBox');
    assert.strictEqual(form.getEditor('dxTagBox').option('value').length, dxTagBoxResetValue.length, 'form.getEditor.dxTagBox');
    assert.strictEqual(form.getEditor('dxTextArea').option('value'), stringEditorResetValue, 'form.getEditor.dxTextArea');
    assert.strictEqual(form.getEditor('dxTextBox').option('value'), stringEditorResetValue, 'form.getEditor.dxTextBox');
    assert.deepEqual(form.getEditor('dxDateRangeBox').option('value'), dxDateRangeBoxResetValue, 'form.getEditor.dxDateRangeBox');
});

const formatTestValue = value => Array.isArray(value) ? '[]' : value;

[undefined, null, []].forEach(groupItems => {
    QUnit.test(`Change group items from [1] -> ${formatTestValue(groupItems)}`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                field: 'Test'
            },
            items: [{
                itemType: 'group',
                name: 'TestGroup',
                items: ['field']
            }]
        }).dxForm('instance');

        form.itemOption('TestGroup', 'items', groupItems);

        const $layoutManager = $(`.${FORM_GROUP_CONTENT_CLASS} > .${FORM_LAYOUT_MANAGER_CLASS}`);
        assert.equal($layoutManager.length, 1, 'layout manager is rendered');
        assert.notOk($layoutManager.children().length, 'layout manager content is empty');
        assert.notOk(form.getEditor('field'), 'editor is not created');
    });
});

[undefined, null, []].forEach(tabbedItems => {
    QUnit.test(`Change tabbed items from [1] -> ${formatTestValue(tabbedItems)}`, function(assert) {
        const form = $('#form').dxForm({
            formData: {
                field: 'Test'
            },
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    name: 'TestTabbedItem',
                    items: ['field']
                }]
            }]
        }).dxForm('instance');

        form.itemOption('TestTabbedItem', 'items', tabbedItems);

        const $layoutManager = $(`.${MULTIVIEW_ITEM_CONTENT_CLASS} > .${FORM_LAYOUT_MANAGER_CLASS}`);
        assert.equal($layoutManager.length, 1, 'layout manager is rendered');
        assert.notOk($layoutManager.children().length, 'layout manager content is empty');
        assert.notOk(form.getEditor('field'), 'editor is not created');
    });
});

QUnit.module('Adaptivity', {
    beforeEach: function() {
        const that = this;
        that.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('One column screen should be customizable with screenByWidth option on init', function(assert) {
    const $form = $('#form');

    $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            room: 1,
            isDeveloper: true
        },
        colCount: 2,
        screenByWidth: function() { return 'xs'; },
        items: ['name', 'lastName', 'room', 'isDeveloper']
    });

    assert.equal($form.find('.dx-layout-manager-one-col').length, 1, 'single column screen was changed');
    assert.equal($form.find('.dx-single-column-item-content').length, 4, 'There are 4 items in the column');
});

QUnit.test('One column screen should be customizable with screenByWidth option on option change', function(assert) {
    const $form = $('#form');
    const form = $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            room: 1,
            isDeveloper: true
        },
        colCount: 2,
        screenByWidth: function() { return 'md'; },
        items: ['name', 'lastName', 'room', 'isDeveloper']
    }).dxForm('instance');


    assert.equal($form.find('.dx-single-column-item-content').length, 0, 'There are no single column items');

    form.option('screenByWidth', function() { return 'xs'; });

    assert.equal($form.find('.dx-single-column-item-content').length, 4, 'There are 4 items in the column');
    assert.equal($form.find('.dx-layout-manager-one-col').length, 1, 'single column screen was changed');
});

QUnit.test('Column count may depend on screen factor', function(assert) {
    const $form = $('#form');
    let screen = 'md';

    $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            room: 1,
            isDeveloper: true
        },
        colCountByScreen: {
            sm: 1,
            md: 2
        },
        screenByWidth: function() { return screen; },
        items: ['name', 'lastName', 'room', 'isDeveloper']
    });

    assert.equal($form.find('.dx-first-col.dx-last-col').length, 0, 'more than one column exists');

    screen = 'sm';
    resizeCallbacks.fire();

    assert.equal($form.find('.dx-first-col.dx-last-col').length, 4, 'only one column exists');
});

QUnit.test('Column count ignores hide/show scroller when rerendering if screen factor changed', function(assert) {
    const originalGetDocumentElement = domAdapter.getDocumentElement;
    try {
        const largeScreenWidth = 1200;
        const mediumScreenWidth = 1199;
        let width = largeScreenWidth;
        const height = 300;
        const scrollerWidth = 17;

        domAdapter.getDocumentElement = function() {
            return {
                clientWidth: width,
                clientHeight: height
            };
        };

        const $form = $('#form');

        $form.dxForm({
            labelLocation: 'left',
            colCountByScreen: {
                lg: 2,
                md: 1
            },
            items: [
                {
                    name: 'f1', editorType: 'dxTextBox',
                    editorOptions: {
                        onDisposing: function() {
                            width = mediumScreenWidth + scrollerWidth;
                        }
                    }
                },
                'f2'
            ]
        });

        assert.equal($form.find('.dx-col-0').length, 1, '(.dx-col-0).length initial');
        assert.equal($form.find('.dx-col-1').length, 1, '(.dx-col-1).length initial');

        width = mediumScreenWidth;
        resizeCallbacks.fire();

        assert.equal($form.find('.dx-col-0').length, 2, '(.dx-col-0).length current');
        assert.equal($form.find('.dx-col-1').length, 0, '(.dx-col-1).length current');
    } finally {
        domAdapter.getDocumentElement = originalGetDocumentElement;
    }
});

QUnit.test('Form should repaint once when screen factor changed', function(assert) {
    const $form = $('#form');
    let screen = 'md';
    const form = $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            room: 1,
            isDeveloper: true
        },
        colCountByScreen: {
            sm: 1,
            md: 2
        },
        screenByWidth: function() { return screen; },
        items: ['name', 'lastName', 'sex', 'room', 'isDeveloper']
    }).dxForm('instance');
    const refreshStub = sinon.stub(form, '_refresh');

    screen = 'sm';
    resizeCallbacks.fire();
    resizeCallbacks.fire();

    assert.equal(refreshStub.callCount, 1, 'refresh called once');
});

QUnit.test('Form doesn\'t redraw layout when colCount doesn\'t changed', function(assert) {
    const $form = $('#form');
    let screen = 'md';
    const form = $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        items: [{
            name: 'test',
            editorType: 'dxTextBox',
            editorOptions: {
                value: 'Test'
            }
        }]
    }).dxForm('instance');

    form.getEditor('test').option('value', 'Changed');
    screen = 'sm';
    resizeCallbacks.fire();

    assert.equal(form.getEditor('test').option('value'), 'Changed', 'Editor keeps old value');
});

QUnit.test('Form doesn\'t redraw layout when colCount doesn\'t changed and colCountByScreen option defined', function(assert) {
    const $form = $('#form');
    let screen = 'md';
    const form = $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCountByScreen: {
            sm: 2,
            md: 2
        },
        items: [{
            name: 'test',
            editorType: 'dxTextBox',
            editorOptions: {
                value: 'Test'
            }
        }]
    }).dxForm('instance');

    form.getEditor('test').option('value', 'Changed');
    screen = 'sm';
    resizeCallbacks.fire();

    assert.equal(form.getEditor('test').option('value'), 'Changed', 'Editor keeps old value');
});

QUnit.test('Form is not redrawn when colCount doesn\'t change (\'colCount\' and \'colCountByScreen\' options are defined)', function(assert) {
    const $form = $('#form');
    let screen = 'md';
    let initCount = 0;

    $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCount: 1, // xs and lg screens have an equal colCount
        colCountByScreen: {
            sm: 2,
            md: 2
        },
        items: [{
            name: 'test',
            editorType: 'dxTextBox',
            editorOptions: {
                onInitialized: function() {
                    initCount++;
                }
            }
        }]
    });

    assert.equal(initCount, 1, 'Editor is initialized');

    screen = 'sm';
    resizeCallbacks.fire();

    assert.equal(initCount, 1, 'colCount doesn\'t changed, editor doesn\'t rerender');

    screen = 'lg';
    resizeCallbacks.fire();
    assert.equal(initCount, 2, 'colCount is changed, editor is rerender');

    screen = 'xs';
    resizeCallbacks.fire();
    assert.equal(initCount, 2, 'colCount doesn\'t changed, editor doesn\'t rerender');
});

QUnit.test('Column count for group may depend on screen factor', function(assert) {
    const $form = $('#form');
    let screen = 'md';

    $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name',
            gender: 'Male',
            room: 1,
            isDeveloper: true
        },
        screenByWidth: function() { return screen; },
        items: [{
            itemType: 'group',
            caption: 'Group 1',
            colCount: 1,
            colCountByScreen: {
                sm: 2,
                md: 3
            },
            items: ['name', 'lastName']
        },
        {
            itemType: 'group',
            caption: 'Group 2',
            colCount: 2,
            colCountByScreen: {
                sm: 4,
                md: 1
            },
            items: ['sex', 'room', 'isDeveloper']
        }]
    });


    assert.equal($form.find('.dx-group-colcount-3').length, 1, 'first group should have 3 columns');
    assert.equal($form.find('.dx-group-colcount-1').length, 1, 'second group should have 1 column');

    screen = 'sm';
    resizeCallbacks.fire();

    assert.equal($form.find('.dx-group-colcount-2').length, 1, 'first group should have 2 columns');
    assert.equal($form.find('.dx-group-colcount-4').length, 1, 'second group should have 4 columns');
});

QUnit.test('Column count for tabs may depend on screen factor', function(assert) {
    const $form = $('#form');
    let screen = 'md';

    $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test',
            gender: 'Male',
            room: 1,
            isDeveloper: true
        },
        screenByWidth: function() { return screen; },
        items: [{
            itemType: 'tabbed',
            caption: 'Group 1',
            colCount: 1,
            tabs: [{
                colCountByScreen: { sm: 2, md: 3 },
                items: ['name', 'lastName', 'gender', 'room', 'isDeveloper']
            }]
        }]
    });


    assert.equal($form.find('.dx-field-item-tab.dx-col-2').length, 1, 'tab has 3 groups on md screen');

    screen = 'sm';
    resizeCallbacks.fire();

    assert.notOk($form.find('.dx-field-item-tab.dx-col-2').length, 'tab has not 3 groups on sm screen');
    assert.ok($form.find('.dx-field-item-tab.dx-col-1').length, 'tab has 2 groups on sm screen');
});

QUnit.test('Cached colCount options doesn\'t leak', function(assert) {
    const $form = $('#form');
    const instance = $form.dxForm({
        formData: {
            name: 'User',
            lastName: 'Test Last Name'
        },
        colCount: 2,
        items: [{
            itemType: 'group',
            caption: 'Group 1',
            colCount: 1,
            colCountByScreen: {
                sm: 2,
                md: 3
            },
            items: ['name', 'lastName']
        }]
    }).dxForm('instance');


    assert.equal(instance._cachedColCountOptions.length, 2, 'root + group item colCount options cached');

    instance.option('items', ['name']);

    assert.equal(instance._cachedColCountOptions.length, 1, 'only root colCount options cached');
});

QUnit.test('Form refreshes only one time on dimension changed with group layout', function(assert) {
    const $form = $('#form').width(300);
    const screen = 'md';
    const form = $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCount: 'auto',
        minColWidth: 100,
        items: [{
            name: 'test1',
            editorType: 'dxTextBox'
        }, {
            itemType: 'group',
            caption: 'Test group',
            colCount: 'auto',
            minColWidth: 200,
            items: [
                { name: 'test2', editorType: 'dxTextBox' },
                { name: 'test3', editorType: 'dxTextBox' }
            ]
        }]
    }).dxForm('instance');

    const refreshSpy = sinon.spy(form, '_refresh');

    $form.width(100);
    resizeCallbacks.fire();
    this.clock.tick();
    assert.equal(refreshSpy.callCount, 1, 'form has been redraw layout one time');
});

QUnit.test('Form redraw layout when colCount is \'auto\' and an calculated colCount changed', function(assert) {
    const $form = $('#form').width(300);
    const screen = 'md';
    const form = $form.dxForm({
        screenByWidth: function() {
            return screen;
        },
        colCount: 'auto',
        minColWidth: 100,
        items: [{
            name: 'test1',
            editorType: 'dxTextBox'
        }, {
            name: 'test2',
            editorType: 'dxTextBox'
        }]
    }).dxForm('instance');

    const refreshSpy = sinon.spy(form, '_refresh');

    $form.width(100);
    resizeCallbacks.fire();
    this.clock.tick();

    assert.equal(refreshSpy.callCount, 1, 'form has been redraw layout');
});

function getColsCountFromDOM($form) {
    let result = -1;

    const $lastCol = $form.find(`.${LAST_COL_CLASS}`);
    [1, 2, 3, 4].forEach(colCount => {
        $lastCol.each((_, $item) => {
            if($($item).hasClass(`dx-col-${colCount - 1}`)) {
                result = colCount;
            }
        });
    });

    return result;
}

QUnit.test('group colCountByScreen property change should update layout', function(assert) {
    const form = $('#form').dxForm({
        screenByWidth: () => 'md',
        items: [{
            itemType: 'group',
            colCountByScreen: { md: 1 },
            items: ['name', 'email']
        }],
    }).dxForm('instance');

    form.option('items[0].colCountByScreen.md', 2);

    assert.strictEqual(getColsCountFromDOM(form.$element()), 2);
});

QUnit.test('nested group colCountByScreen property change should update layout', function(assert) {
    const form = $('#form').dxForm({
        screenByWidth: () => 'md',
        items: [{
            itemType: 'group',
            items: [{
                itemType: 'group',
                colCountByScreen: { md: 2 },
                items: ['Phone', 'Email'],
            }],
        }],
    }).dxForm('instance');

    form.option('items[0].items[0].colCountByScreen.md', 1);

    assert.strictEqual(getColsCountFromDOM(form.$element()), 1);
});

QUnit.test('tab colCountByScreen property change should update layouts', function(assert) {
    const form = $('#form').dxForm({
        screenByWidth: () => 'md',
        items: [{
            itemType: 'tabbed',
            tabs: [{
                items: ['Phone', 'Email'],
                colCountByScreen: { md: 2 },
            }],
        }],
    }).dxForm('instance');

    form.option('items[0].tabs[0].colCountByScreen.md', 1);

    assert.strictEqual(getColsCountFromDOM(form.$element()), 1);
});

QUnit.test('colCountByScreen property change with itemOption should update layout', function(assert) {
    const form = $('#form').dxForm({
        screenByWidth: () => 'md',
        items: [{
            itemType: 'tabbed',
            name: 'groupName',
            tabs: [{
                name: 'tabName',
                items: ['Phone', 'Email'],
                colCountByScreen: { md: 1 },
            }],
        }],
    }).dxForm('instance');

    form.itemOption('groupName.tabName', 'colCountByScreen.md', 2);

    assert.strictEqual(getColsCountFromDOM(form.$element()), 2);
});

[
    { screenWidth: 1500, expectedSize: 'lg' },
    { screenWidth: 1000, expectedSize: 'md' },
    { screenWidth: 900, expectedSize: 'sm' },
    { screenWidth: 700, expectedSize: 'xs' },
].forEach((testConfig) => {
    QUnit.test(`Default implementation of screenByWidth. Screen size: ${testConfig.screenWidth}`, function(assert) {
        const getDocumentElementStub = sinon.stub(domAdapter, 'getDocumentElement').returns({
            clientWidth: testConfig.screenWidth
        });

        const config = {
            colCountByScreen: { xs: 1, sm: 2, md: 3, lg: 4 },
            items: [
                { dataField: 'field1' }, { dataField: 'field2' }, { dataField: 'field3' }, { dataField: 'field4' }
            ]
        };

        const $form = $('#form').dxForm(config);

        const colsCount = getColsCountFromDOM($form);
        assert.equal(colsCount, config.colCountByScreen[testConfig.expectedSize], 'form has correct columns count');
        getDocumentElementStub.restore();
    });
});

['globalOption', 'instanceOption'].forEach((optionType) => {
    QUnit.test(`Setting screen by width. Use ${optionType}`, function(assert) {
        const defaultCustomRules = Form._classCustomRules;

        const globalOptionStub = sinon.stub().returns('xs');
        const instanceOptionStub = sinon.stub().returns('xs');
        const defaultFunctionStub = sinon.spy(windowModule, 'defaultScreenFactorFunc');

        const config = {
            colCountByScreen: { xs: 1, sm: 2, md: 3, lg: 4 },
            items: [
                { dataField: 'field1' }, { dataField: 'field2' }, { dataField: 'field3' }, { dataField: 'field4' }
            ]
        };

        if(optionType === 'globalOption') {
            Form.defaultOptions({
                options: {
                    screenByWidth: globalOptionStub
                }
            });
        } else if(optionType === 'instanceOption') {
            config['screenByWidth'] = instanceOptionStub;
        }

        const $form = $('#form').dxForm(config);
        assert.equal(globalOptionStub.called, optionType === 'globalOption', 'global function is called');
        assert.equal(instanceOptionStub.called, optionType === 'instanceOption', 'instance function is called');
        assert.equal(defaultFunctionStub.called, 0, 'default function is called');

        const colsCount = getColsCountFromDOM($form);
        assert.equal(colsCount, 1, 'form has correct columns count');

        Form._classCustomRules = defaultCustomRules;
        defaultFunctionStub.restore();
    });
});

QUnit.module('Form when rtlEnabled is true');

QUnit.test('required mark aligned when rtlEnabled option is set to true', function(assert) {
    const $testContainer = $('#form').dxForm({
        requiredMark: '!',
        rtlEnabled: true,
        items: [{
            dataField: 'name',
            isRequired: true
        }]
    });

    const $labelsContent = $testContainer.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    const $requiredLabel = $labelsContent.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $requiredMark = $labelsContent.find(`.${FIELD_ITEM_REQUIRED_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.notEqual($labelsContent.offset().left, $requiredMark.offset().left, 'position of requared mark is right');
    assert.ok($requiredLabel.position().left > $requiredMark.position().left, 'required mark should be before of the text');
});

QUnit.test('optional mark aligned when rtlEnabled option is set to true', function(assert) {
    const $testContainer = $('#form').dxForm({
        optionalMark: 'optMark',
        showOptionalMark: true,
        rtlEnabled: true,
        items: ['position']
    });

    const $labelsContent = $testContainer.find(`.${FIELD_ITEM_LABEL_CONTENT_CLASS}`);
    const $optionalLabel = $labelsContent.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);
    const $optionalMark = $labelsContent.find(`.${FIELD_ITEM_OPTIONAL_MARK_CLASS}`);

    $labelsContent.width(200);

    assert.notEqual($labelsContent.offset().left, $optionalMark.offset().left, 'position of optional mark is right');
    assert.ok($optionalLabel.position().left > $optionalMark.position().left, 'optional mark should be before of the text');
});

QUnit.module('Events');

QUnit.test('Should not skip `optionChanged` event handler that has been added on the `onInitialized` event handler', function(assert) {
    const eventCalls = [];

    const form = $('#form').dxForm({
        formData: { firstName: 'John' },
        onOptionChanged: function() {
            eventCalls.push('onOptionChanged');
        },
        onContentReady: function(e) {
            e.component.on('optionChanged', function() {
                eventCalls.push('optionChanged from `onContentReady`');
            });
        },
        onInitialized: function(e) {
            e.component.on('optionChanged', function() {
                eventCalls.push('optionChanged from `onInitialized`');
            });
        }
    }).dxForm('instance');

    form.option('formData', { lastName: 'John' });

    assert.deepEqual(eventCalls, [
        'optionChanged from `onInitialized`',
        'optionChanged from `onContentReady`',
        'onOptionChanged'
    ]);
});

[2, 3, 'auto'].forEach(colCount => {
    [1, undefined].forEach(colSpan => {
        QUnit.test(`Form.colCount=${colCount}, field.colSpan=${colSpan} -> resizeWindow() //T923489`, function(assert) {
            $('#form').dxForm({
                colCount: colCount,
                items: [
                    { dataField: 'field1', colSpan: 2 },
                    { dataField: 'field2', colSpan: colSpan }
                ]
            }).dxForm('instance');

            resizeCallbacks.fire();

            assert.equal(1, 1, 'resize of the form does not freeze the page');
        });
    });
});

QUnit.test('Form set the right class to the root element for different global editorStylingMode option', function(assert) {
    const stylingModes = ['filled', 'underlined', 'outlined'];

    stylingModes.forEach(mode => {
        const shouldSetClass = mode === 'underlined';

        config({ editorStylingMode: mode });
        $('#form').dxForm({});

        assert.equal(
            $('#form').hasClass(FORM_UNDERLINED_CLASS),
            shouldSetClass,
            `${FORM_UNDERLINED_CLASS} is ${shouldSetClass ? '' : 'not'} set`);

        $('#form').dxForm('instance').dispose();
        config({ editorStylingMode: null });
    });
});

QUnit.test('Form item stylingMode option should rewrite global editorStylingMode option (T1044604)', function(assert) {
    const stylingModes = [null, 'outlined', 'filled', 'underlined' ];
    const defaultStylingMode = TextEditorBase.prototype._getDefaultOptions().stylingMode;


    stylingModes.forEach(globalStylingMode => {
        stylingModes.forEach(editorStylingMode => {
            if(globalStylingMode) {
                config({ editorStylingMode: globalStylingMode });
            }

            $('#form').dxForm({
                formData: { field1: '', field2: '' },
                items: [
                    { dataField: 'field1' },
                    { dataField: 'field2', editorOptions: { stylingMode: editorStylingMode } }
                ]
            });

            function getExpectedClass(mode) {
                return `dx-editor-${mode ? mode : defaultStylingMode}`;
            }

            const firstEditorExpectedClass = getExpectedClass(globalStylingMode);
            const secondEditorExpectedClass = getExpectedClass(editorStylingMode || globalStylingMode);

            const form = $('#form').dxForm('instance');

            assert.ok($(form.getEditor('field1').element()).hasClass(firstEditorExpectedClass), `default editor (global=${globalStylingMode}), editor not set`);
            assert.ok($(form.getEditor('field2').element()).hasClass(secondEditorExpectedClass), `custom editor (global=${globalStylingMode}, editor=${editorStylingMode})`);

            form.dispose();
            config({ editorStylingMode: null });
        });
    });
});

QUnit.test('TagBox.SelectionChanged is raised once if formData is wrapped into a recursive Proxy', function(assert) {
    function wrapToRecursiveProxy(target) {
        const handler = {
            get: function(obj, prop) {
                const propValue = obj[prop];
                return (propValue !== null && typeof propValue === 'object') ? new Proxy(propValue, handler) : propValue;
            },
        };
        return new Proxy(target, handler);
    }

    const $testContainer = $('#form');
    const formData = { arrayField: ['item1', 'item2'] };
    const watchCallbacks = [];
    let onSelectionChangedCounter = 0;

    const form = $testContainer.dxForm({
        formData: wrapToRecursiveProxy(formData),
        items: [
            {
                dataField: 'arrayField',
                editorType: 'dxTagBox',
                editorOptions: { dataSource: ['item1', 'item2'], onSelectionChanged: () => onSelectionChangedCounter++ }
            }
        ],
        integrationOptions: {
            watchMethod: function(fn, callback, options, __debug) {
                if(__debug && __debug.createWatcherDataField === 'arrayField') {
                    watchCallbacks.push(callback);
                }
                return function() {};
            },
        },
    }).dxForm('instance');

    onSelectionChangedCounter = 0;
    form.getEditor('arrayField').option('value', ['item1']);

    watchCallbacks.forEach(callback => callback());

    assert.deepEqual(form.getEditor('arrayField').option('value'), ['item1'], 'tagBox.option(value)');
    assert.deepEqual(formData, { arrayField: ['item1'] }, 'formData');
    assert.strictEqual(onSelectionChangedCounter, 1, 'onSelectionChangedCounter');
});

[['dxCalendar', new Date(2019, 1, 2), { dxCalendar: new Date(2019, 1, 3) } ],
    ['dxRangeSlider', [1, 5], { dxRangeSlider: [1, 3] } ],
    ['dxSlider', 199, { dxSlider: 99 }],
    ['dxSwitch', true, { dxSwitch: false }],
    ['dxAutocomplete', '1', { dxAutocomplete: '2' }],
    ['dxColorBox', new Date(2019, 1, 1), { dxColorBox: new Date(2019, 1, 2) } ],
    ['dxDateBox', new Date(2017, 0, 3), { dxDateBox: new Date(2019, 1, 2) }],
    ['dxDropDownBox', '1', { dxDropDownBox: '3' }],
    ['dxHtmlEditor', '<p>a</p>', { dxHtmlEditor: '<p>b</p>' }],
    ['dxLookup', '1', { dxLookup: '3' }],
    ['dxNumberBox', '1', { dxNumberBox: '3' }],
    ['dxRadioGroup', '1', { dxRadioGroup: '3' }],
    ['dxSelectBox', '1', { dxSelectBox: '2' }],
    ['dxTagBox', ['1'], { dxTagBox: ['2'] }],
    ['dxTextArea', 'a', { dxTextArea: 'b' }],
    ['dxTextBox', 'a', { dxTextBox: 'b' }],
    ['dxDateRangeBox', [new Date(2021, 8, 17), new Date(2021, 9, 17)], { dxDateRangeBox: [null, null] } ],
    ['dxCheckBox', true, { dxCheckbox: false } ],
].forEach((editorData) => {
    QUnit.test(`form should be dirty after ${editorData[0]} value updated and become pristine on getting back to initial value`, function(assert) {
        const editorName = editorData[0];
        const newEditorValue = editorData[1];
        const initialFormData = editorData[2];

        const form = $('#form').dxForm({
            formData: initialFormData,
            items: [{ dataField: editorName, editorType: editorName }]
        }).dxForm('instance');

        const initialValue = form.getEditor(editorName).option('value');

        assert.strictEqual(form.option('isDirty'), false, 'pristine after init');

        form.updateData(editorName, newEditorValue);

        assert.strictEqual(form.option('isDirty'), true, 'is dirty after update');

        form.updateData(editorName, initialValue);

        assert.strictEqual(form.option('isDirty'), false, 'pristine after setting initial value');
    });
});

QUnit.test('nested form items should affect isDirty', function(assert) {
    const form = $('#form').dxForm({
        items: [{
            itemType: 'group',
            items: [{
                itemType: 'group',
                items: [{
                    itemType: 'group',
                    items: [{
                        dataField: 'ZipCode'
                    }],
                }],
            }],
        }],
    }).dxForm('instance');

    form.updateData('ZipCode', '4012');

    assert.strictEqual(form.option('isDirty'), true);
});

QUnit.test('setting form items props should non affect isDirty', function(assert) {
    const form = $('#form').dxForm({
        screenByWidth: () => 'md',
        items: [{
            itemType: 'tabbed',
            name: 'groupName',
            tabs: [{
                name: 'tabName',
                items: ['Phone', 'Email'],
                colCountByScreen: { md: 1 },
            }],
        }],
    }).dxForm('instance');

    form.itemOption('groupName.tabName', 'colCountByScreen.md', 2);

    assert.strictEqual(form.option('isDirty'), false);
});

QUnit.test('form should be dirty when some editors are dirty', function(assert) {
    const originalName = 'Mart';
    const originalAddress = '8th Street';

    const form = $('#form2').dxForm({
        formData: {
            Name: originalName,
            Address: originalAddress,
        },
    }).dxForm('instance');

    assert.strictEqual(form.option('isDirty'), false, 'form is not dirty when all editors are pristine');

    form.updateData('Name', 'Ted');
    form.updateData('Address', 'Paradise str');

    assert.strictEqual(form.option('isDirty'), true, 'form is dirty when editors are dirty');

    form.updateData('Name', originalName);

    assert.strictEqual(form.option('isDirty'), true, 'form is dirty when some editors are dirty');

    form.updateData('Address', originalAddress);

    assert.strictEqual(form.option('isDirty'), false, 'form is not dirty when all editors are back to pristine');
});

[true, false].forEach((openOnFieldClick) => {
    [true, false, undefined].forEach((hideOnOutsideClick) => {
        QUnit.test(`Opened DropDownList must hide on input label click, openOnFieldClick: ${openOnFieldClick}, hideOnOutsideClick: ${hideOnOutsideClick} (T1257945)`, function(assert) {
            const dropDownOptions = hideOnOutsideClick === undefined ? {} : { hideOnOutsideClick };
            const $form = $('#form').dxForm({
                formData: { CustomerID: 'VINET' },
                items: [{
                    itemType: 'group',
                    colCount: 2,
                    items: [{
                        dataField: 'CustomerID',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            items: ['VINET', 'VALUE', 'VINS'],
                            value: '',
                            openOnFieldClick,
                            dropDownOptions,
                        },
                    }],
                }],
            });

            const $dropDownButton = $form.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);

            pointerMock($dropDownButton).click();

            const editorInstance = $form.dxForm('instance').getEditor('CustomerID');

            assert.true(editorInstance.option('opened'), 'drop down list is visible');

            const $label = $form.find(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`);

            pointerMock($label).click();

            // NOTE: In the real environment, clicking the label triggers a click on the editor,
            // toggling the popup visibility if openOnFieldClick=true.
            // This assertion only takes hideOnOutsideClick into account
            switch(hideOnOutsideClick) {
                case true:
                    assert.false(editorInstance.option('opened'), 'drop down list is hidden by outside click');
                    break;
                case false:
                    assert.true(editorInstance.option('opened'), `drop down list ${openOnFieldClick ? 'is hidden by triggered input click' : 'is visible'}`);
                    break;
                default:
                    assert.strictEqual(editorInstance.option('opened'), openOnFieldClick, `drop down list is hidden by ${openOnFieldClick ? 'triggered input click' : 'outside click'}`);
            }
        });
    });
});

QUnit.test('DropDownEditor popup must toggle on input or dropDownButton click if openOnFieldClick = true', function(assert) {
    const $form = $('#form').dxForm({
        formData: { CustomerID: 'VINET' },
        items: [{
            itemType: 'group',
            colCount: 2,
            items: [{
                dataField: 'CustomerID',
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: ['VINET', 'VALUE', 'VINS'],
                    value: '',
                    openOnFieldClick: true,
                },
            }],
        }],
    });

    const $dropDownEditorInput = $form.find(`.${EDITOR_INPUT_CLASS}`);
    const $dropDownButton = $form.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);

    pointerMock($dropDownEditorInput).click();

    const editorInstance = $form.dxForm('instance').getEditor('CustomerID');

    assert.true(editorInstance.option('opened'), 'drop down list is visible');

    pointerMock($dropDownEditorInput).click();

    assert.false(editorInstance.option('opened'), 'drop down list is hidden');

    pointerMock($dropDownButton).click();

    assert.true(editorInstance.option('opened'), 'drop down list is visible');

    pointerMock($dropDownButton).click();

    assert.false(editorInstance.option('opened'), 'drop down list is hidden');
});

QUnit.test('DropDownEditor popup must toggle on dropDownButton click if openOnFieldClick = false', function(assert) {
    const $form = $('#form').dxForm({
        formData: { CustomerID: 'VINET' },
        items: [{
            itemType: 'group',
            colCount: 2,
            items: [{
                dataField: 'CustomerID',
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: ['VINET', 'VALUE', 'VINS'],
                    value: '',
                    openOnFieldClick: false,
                },
            }],
        }],
    });

    const $dropDownEditorInput = $form.find(`.${EDITOR_INPUT_CLASS}`);
    const $dropDownButton = $form.find(`.${DROP_DOWN_EDITOR_BUTTON_CLASS}`);

    pointerMock($dropDownEditorInput).click();

    const editorInstance = $form.dxForm('instance').getEditor('CustomerID');

    assert.false(editorInstance.option('opened'), 'drop down list is hidden');

    pointerMock($dropDownButton).click();

    assert.true(editorInstance.option('opened'), 'drop down list is visible');

    pointerMock($dropDownEditorInput).click();

    assert.true(editorInstance.option('opened'), 'drop down list is visible');

    pointerMock($dropDownButton).click();

    assert.false(editorInstance.option('opened'), 'drop down list is hidden');
});

QUnit.module('reset', () => {
    [
        ['dxCalendar', new Date(2019, 1, 2), { dxCalendar: new Date(2019, 1, 3) } ],
        ['dxRangeSlider', [1, 5], { dxRangeSlider: [1, 3] } ],
        ['dxSlider', 199, { dxSlider: 99 }],
        ['dxSwitch', true, { dxSwitch: false }],
        ['dxAutocomplete', '1', { dxAutocomplete: '2' }],
        ['dxColorBox', new Date(2019, 1, 1), { dxColorBox: new Date(2019, 1, 2) } ],
        ['dxDateBox', new Date(2017, 0, 3), { dxDateBox: new Date(2019, 1, 2) }],
        ['dxDropDownBox', '1', { dxDropDownBox: '3' }],
        ['dxHtmlEditor', '<p>a</p>', { dxHtmlEditor: '<p>b</p>' }],
        ['dxLookup', '1', { dxLookup: '3' }],
        ['dxNumberBox', '1', { dxNumberBox: '3' }],
        ['dxRadioGroup', '1', { dxRadioGroup: '3' }],
        ['dxSelectBox', '1', { dxSelectBox: '2' }],
        ['dxTagBox', ['1'], { dxTagBox: ['2'] }],
        ['dxTextArea', 'a', { dxTextArea: 'b' }],
        ['dxTextBox', 'a', { dxTextBox: 'b' }],
        ['dxDateRangeBox', [new Date(2021, 8, 17), new Date(2021, 9, 17)], { dxDateRangeBox: [null, null] } ],
        ['dxCheckBox', true, { dxCheckBox: false } ],
        ['dxCheckBox', undefined, { dxCheckBox: false } ]
    ].forEach((editorData) => {
        QUnit.test(`should update ${editorData[0]} value to initial value and isDirty to false`, function(assert) {
            const editorName = editorData[0];
            const newEditorValue = editorData[1];
            const initialFormData = editorData[2];
            const editorInitialValue = initialFormData[editorName];

            const form = $('#form').dxForm({
                formData: initialFormData,
                items: [{ dataField: editorName, editorType: editorName }]
            }).dxForm('instance');

            assert.deepEqual(form.getEditor(editorName).option('value'), editorInitialValue);

            assert.strictEqual(form.option('isDirty'), false, 'pristine after init');

            form.updateData(editorName, newEditorValue);

            assert.deepEqual(form.getEditor(editorName).option('value'), newEditorValue);

            assert.strictEqual(form.option('isDirty'), true, 'is dirty after update');

            form.reset();

            assert.deepEqual(form.getEditor(editorName).option('value'), editorInitialValue);

            assert.strictEqual(form.option('isDirty'), false, 'pristine after resetting form');
        });
    });

    QUnit.test('should update isDirty when nested editors updated', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                items: [{
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'ZipCode'
                        }],
                    }],
                }],
            }],
        }).dxForm('instance');

        form.updateData('ZipCode', '4012');

        form.reset();

        assert.strictEqual(form.option('isDirty'), false, 'isDirty set to false after reset');
    });

    QUnit.test('should update nested editors', function(assert) {
        const form = $('#form').dxForm({
            items: [{
                itemType: 'group',
                items: [{
                    itemType: 'group',
                    items: [{
                        itemType: 'group',
                        items: [{
                            dataField: 'ZipCode'
                        }],
                    }],
                }],
            }],
        }).dxForm('instance');

        form.updateData('ZipCode', '4012');

        assert.strictEqual(form.getEditor('ZipCode').option('value'), '4012');

        form.reset();

        assert.strictEqual(form.getEditor('ZipCode').option('value'), '');
    });

    QUnit.test('should update all editors\' values to initial values', function(assert) {
        const initialName = 'Mart';
        const initialAddress = '8th Street';

        const form = $('#form').dxForm({
            formData: {
                Name: initialName,
                Address: initialAddress,
            },
        }).dxForm('instance');

        form.updateData('Address', 'Paradise 4012 str');
        form.updateData('Name', 'Lucy Lawless');

        form.reset();

        assert.strictEqual(form.getEditor('Name').option('value'), initialName, 'name updated to initial');
        assert.strictEqual(form.getEditor('Address').option('value'), initialAddress, 'address updated to initial');
    });


    QUnit.test('with parameters should update passed fields with parameter value', function(assert) {
        const initialName = 'Mart';

        const form = $('#form').dxForm({
            formData: {
                Name: initialName,
                Address: '8th Street',
            },
        }).dxForm('instance');

        form.reset({ Address: 'new address' });

        assert.strictEqual(form.getEditor('Address').option('value'), 'new address');
        assert.strictEqual(form.getEditor('Name').option('value'), initialName);
    });

    QUnit.test('with parameters should update fields not specified in parameters with initial value', function(assert) {
        const initialName = 'Mart';

        const form = $('#form').dxForm({
            formData: {
                Name: initialName,
                Address: '8th Street',
            },
        }).dxForm('instance');

        form.getEditor('Name').option('value', 'Peetya');

        form.reset({ Address: 'new address' });

        assert.strictEqual(form.getEditor('Name').option('value'), initialName);
    });

    QUnit.test('should be able to update to undefined value with parameter', function(assert) {
        const form = $('#form').dxForm({
            formData: { dxCheckBox: false },
            items: [{ dataField: 'dxCheckBox', editorType: 'dxCheckBox' }]
        }).dxForm('instance');

        form.reset({ dxCheckBox: undefined });

        assert.strictEqual(form.getEditor('dxCheckBox').option('value'), undefined);
    });

    QUnit.test('should update isDirty to false after reset', function(assert) {
        const initialAddress = '8th Street';

        const form = $('#form').dxForm({
            formData: { Address: initialAddress }
        }).dxForm('instance');

        form.updateData('Address', '4012 str');

        assert.strictEqual(form.option('isDirty'), true, 'form isDirty before reset');

        form.reset();

        assert.strictEqual(form.option('isDirty'), false, 'form is pristine before reset');
    });

    QUnit.test('should update isDirty to false after reset back to initial value by parameter', function(assert) {
        const initialAddress = '8th Street';

        const form = $('#form').dxForm({
            formData: {
                Address: initialAddress,
            },
        }).dxForm('instance');

        form.updateData('Address', '4012 str');

        assert.strictEqual(form.option('isDirty'), true);
        form.reset({ Address: initialAddress });
        assert.strictEqual(form.option('isDirty'), false);
    });

    QUnit.test('should clear validation summary', function(assert) {
        const form = $('#form').dxForm({
            formData: { field1: '' },
            showValidationSummary: true,
            items: [ {
                dataField: 'field1',
                validationRules: [{ type: 'required' }]
            }, {
                dataField: 'field2',
                validationRules: [{ type: 'required' }]
            } ]
        }).dxForm('instance');

        form.validate();

        const validationItemsBeforeReset = $(`.${FORM_VALIDATION_SUMMARY}`).children();

        assert.strictEqual(validationItemsBeforeReset.length, 2, 'form has validation summary items before reset');

        form.reset();

        const validationItemsAfterReset = $(`.${FORM_VALIDATION_SUMMARY}`).children();

        assert.strictEqual(validationItemsAfterReset.length, 0, 'form does not have validation summary items after reset');
    });

    QUnit.test('validation summary should appear after validating reset form', function(assert) {
        const form = $('#form').dxForm({
            formData: { field1: '' },
            showValidationSummary: true,
            items: [ {
                dataField: 'field1',
                validationRules: [{ type: 'required' }]
            }, {
                dataField: 'field2',
                validationRules: [{ type: 'required' }]
            } ]
        }).dxForm('instance');

        form.reset();
        form.validate();

        const summaryItemsAfterValidate = $(`.${FORM_VALIDATION_SUMMARY}`).children();

        assert.strictEqual(summaryItemsAfterValidate.length, 2, 'form has validation summary after validation');
    });

    [
        'dxSelectBox',
        'dxDropDownBox'
    ].forEach((editorType) => {
        QUnit.test(`Focused ${editorType} should not lose its value when the form is resized (T1196835)`, function(assert) {
            let screen = 'lg';

            const name = 'VINET';
            const value = 'Vins et alcools Chevalier (France)';
            const form = $('#form').dxForm({
                formData: { name: name },
                screenByWidth: function() { return screen; },
                colCountByScreen: {
                    sm: 1,
                    lg: 2
                },
                items: [
                    {
                        itemType: 'simple',
                        dataField: 'name',
                        editorOptions: {
                            displayExpr: 'Text',
                            valueExpr: 'Value',
                            showClearButton: true,
                            dataSource: [{ Value: name, Text: value }],
                        },
                        editorType,
                    },
                ]
            }).dxForm('instance');

            const dropDownEditor = form.getEditor('name');

            screen = 'sm';
            dropDownEditor.focus();
            resizeCallbacks.fire();

            assert.strictEqual($(form.getEditor('name').field()).val(), value, `${editorType} contains expected value`);
        });

        QUnit.test(`Focused ${editorType} inside a tabbed item should not lose its value when the form is resized (T1196835)`, function(assert) {
            let screen = 'lg';

            const name = 'VINET';
            const value = 'Vins et alcools Chevalier (France)';
            const form = $('#form').dxForm({
                formData: { name: name },
                screenByWidth: function() { return screen; },
                colCountByScreen: {
                    sm: 1,
                    lg: 2
                },
                items: [{
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'Phone',
                        colCount: 1,
                        items: [{
                            itemType: 'simple',
                            dataField: 'name',
                            editorOptions: {
                                displayExpr: 'Text',
                                valueExpr: 'Value',
                                showClearButton: true,
                                dataSource: [{ Value: name, Text: value }],
                            },
                            editorType,
                        }],
                    }],
                }],
            }).dxForm('instance');

            const dropDownEditor = form.getEditor('name');

            screen = 'sm';
            dropDownEditor.focus();
            resizeCallbacks.fire();

            assert.strictEqual($(form.getEditor('name').field()).val(), value, `${editorType} contains expected value`);
        });

        QUnit.test(`${editorType} inside a tabbed item and focused tab should not lose its value when the form is resized (T1196835)`, function(assert) {
            let screen = 'lg';

            const name = 'VINET';
            const value = 'Vins et alcools Chevalier (France)';
            const form = $('#form').dxForm({
                formData: { name: name },
                screenByWidth: function() { return screen; },
                colCountByScreen: {
                    sm: 1,
                    lg: 2
                },
                items: [{
                    itemType: 'tabbed',
                    tabs: [{
                        title: 'Phone',
                        colCount: 1,
                        items: [{
                            itemType: 'simple',
                            dataField: 'name',
                            editorOptions: {
                                displayExpr: 'Text',
                                valueExpr: 'Value',
                                showClearButton: true,
                                dataSource: [{ Value: name, Text: value }],
                            },
                            editorType,
                        }],
                    }],
                }],
            }).dxForm('instance');

            screen = 'sm';
            $(form.element()).find(`.${TABPANEL_CLASS}`).focus();
            resizeCallbacks.fire();

            assert.strictEqual($(form.getEditor('name').field()).val(), value, `${editorType} contains expected value`);
        });
    });
});
