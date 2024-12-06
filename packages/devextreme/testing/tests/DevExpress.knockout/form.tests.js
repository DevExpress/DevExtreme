import $ from 'jquery';
import ko from 'knockout';
import { FIELD_ITEM_CONTENT_CLASS } from '__internal/ui/form/constants';
import { FIELD_ITEM_CONTENT_LOCATION_CLASS } from '__internal/ui/form/components/m_field_item';
import { FIELD_ITEM_LABEL_LOCATION_CLASS } from '__internal/ui/form/components/m_label';

import fx from 'common/core/animation/fx';

import 'ui/form';
import 'ui/text_area';
import 'ui/select_box';
import 'ui/tag_box';
import 'integration/knockout';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(() => {
    const markup =
        `<div id="simpleDataForm" data-bind="dxForm: { formData: formData }"></div>
        <div id="simpleTemplateForm" data-bind="dxForm: { formData: formData, items: items }">
            <div data-options="dxTemplate:{ name:'simpleTemplate' }">
                <span>KO template</span>
                <div data-bind="dxTextArea: {
                    value: editorOptions.value,
                    onValueChanged: function(args) {
                        $data.component.updateData($data.dataField, args.value)
                    }
                }"></div>
            </div>
            <div data-options="dxTemplate:{ name:'tabTemplate' }">
                <div id="tabTemplate">Test tab template</div>
            </div>
        </div>
        <div id="simpleTemplateForm2" data-bind="dxForm: { items: items }">
            <div data-options="dxTemplate:{ name:'simpleTemplate2' }">
               <span id="name" data-bind="text: $data.name"></span>
            </div>
        </div>
        <div id="formWithItems" data-bind="dxForm: { formData: formData, items: items }"></div>
        <div id="formWithCustomOptions" data-bind="dxForm: formOptions"></div>`;

    $('#qunit-fixture').html(markup);
});

const moduleSetup = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
};

moduleWithoutCsp('Knockout integration', moduleSetup);

QUnit.test('Generate items from layoutData with unacceptable data', function(assert) {
    const viewModel = {
        formData: ko.observable({
            firstName: 'John',
            mark: ko.observable(13),
            lastName: function() { }
        })
    };
    ko.applyBindings(viewModel, $('#simpleDataForm').get(0));

    const layoutManager = $('#simpleDataForm').find('.dx-layout-manager').dxLayoutManager('instance');

    assert.deepEqual(layoutManager._items, [
        {
            dataField: 'firstName',
            editorType: 'dxTextBox',
            itemType: 'simple',
            visibleIndex: 0,
            col: 0
        },
        {
            col: 0,
            dataField: 'mark',
            editorType: 'dxNumberBox',
            itemType: 'simple',
            visibleIndex: 1
        }
    ]);
});

QUnit.test('Change formData -> observable value changed', function(assert) {
    const viewModel = {
        formData:
        {
            famousPirate: ko.observable('John Morgan')
        }
    };

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.find('.dx-textbox').dxTextBox('instance').option('value', 'Cpt. Jack Sparrow');

    assert.equal(viewModel.formData.famousPirate(), 'Cpt. Jack Sparrow', 'Values is synchronized');
});

QUnit.test('Change formData -> observable array changed', function(assert) {
    const itemsData = ko.observableArray([]);
    const viewModel = {
        formData: {
            items: itemsData
        },
        items: [{
            dataField: 'items',
            editorType: 'dxTagBox',
            editorOptions: {
                dataSource: ['item1', 'items2']
            }
        }]
    };

    const $form = $('#formWithItems');
    ko.applyBindings(viewModel, $form.get(0));

    const form = $form.dxForm('instance');
    const tagBox = form.getEditor('items');

    tagBox.option('value', ['item2']);

    assert.deepEqual(itemsData(), ['item2'], 'value of the observable array');
});

QUnit.test('Change observable -> formData changed', function(assert) {
    const viewModel = {
        formData:
        {
            famousPirate: ko.observable('John Morgan')
        }

    };

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    const textBox = $form.find('.dx-textbox').dxTextBox('instance');
    const form = $form.dxForm('instance');
    const layoutManager = $form.find('.dx-layout-manager').dxLayoutManager('instance');

    assert.equal(textBox.option('value'), 'John Morgan');

    viewModel.formData.famousPirate('Cpt. Jack Sparrow');
    assert.strictEqual(form.option('formData'), viewModel.formData);
    assert.strictEqual(layoutManager.option('layoutData'), viewModel.formData);

    assert.equal(textBox.option('value'), 'Cpt. Jack Sparrow', 'Values is synchronized');
    assert.equal(viewModel.formData.famousPirate(), 'Cpt. Jack Sparrow', 'famousPirate is changed');
});

QUnit.test('Change observable array -> formData changed', function(assert) {
    const itemsData = ko.observableArray([]);
    const viewModel = {
        formData: {
            items: itemsData
        },
        items: [{
            dataField: 'items',
            editorType: 'dxTagBox',
            editorOptions: {
                dataSource: ['item1', 'items2']
            }
        }]
    };

    const $form = $('#formWithItems');
    ko.applyBindings(viewModel, $form.get(0));

    itemsData(['item2']);

    const form = $form.dxForm('instance');
    const tagBox = form.getEditor('items');

    assert.deepEqual(tagBox.option('value'), ['item2'], 'value of the TagBox');
});

QUnit.test('Must unwrap visible option when render', function(assert) {
    const viewModel = {
        formOptions: {
            formData: {
                famousPirate: 'John Morgan',
                famousAdmiral: 'Horacio Nelson'
            },
            items: ['famousAdmiral', {
                dataField: 'famousPirate',
                visible: ko.observable(false)
            }]
        }
    };
    const visibleEditorSelector = '.dx-box-item';

    const $form = $('#formWithCustomOptions');
    ko.applyBindings(viewModel, $form.get(0));

    const $editor = $form.find(visibleEditorSelector);

    assert.equal($editor.length, 1, 'only one visible editor was render');
    assert.equal($editor.find('input').val(), 'Horacio Nelson', 'It\'s a visible item');

    viewModel.formOptions.items[1].visible(true);
    assert.equal($form.find(visibleEditorSelector).length, 2, 'Both editors are visible');
});

QUnit.test('Change formData field and other observable', function(assert) {
    const viewModel = {
        formData:
        {
            famousPirate: ko.observable(''),
            age: ko.observable(0)
        }
    };

    viewModel.formData.famousPirate.subscribe(function(newValue) {
        viewModel.formData.age(40);
    });

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    const pirateEditor = $form.find('.dx-textbox').dxTextBox('instance');
    const ageEditor = $form.find('.dx-numberbox').dxNumberBox('instance');

    pirateEditor.option('value', 'John Morgan');

    assert.equal(ageEditor.option('value'), 40, 'Age successfully updated');
});

QUnit.test('Form item should be removed from DOM if it\'s visibility was changed via binding', function(assert) {
    function viewModel() {
        const self = this;
        self.itemVisibility = ko.observable(true);
        self.formData = {
            number: ko.observable(0)
        };
        self.items = ko.computed(function() {
            return [{
                dataField: 'number',
                editorType: 'dxNumberBox',
                visible: self.itemVisibility()
            }];
        });
    }

    const $form = $('#formWithItems');
    const vm = new viewModel();

    ko.applyBindings(vm, $form.get(0));

    let $formItems = $form.find('.dx-box-item');
    assert.equal($formItems.length, 1, 'there is one visible item in DOM');

    vm.itemVisibility(false);
    $formItems = $form.find('.dx-box-item');
    assert.equal($formItems.length, 0, 'no visible item in DOM');
});

QUnit.test('Check that form doesn\'t rerender when change field widget', function(assert) {
    const viewModel = {
        formData:
            {
                famousPirate: ko.observable('John Morgan')
            }

    };
    let renderCalled = 0;

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.dxForm('instance')._render = function() { renderCalled++; };
    $form.find('.dx-textbox').dxTextBox('instance').option('value', 'Cpt. Jack Sparrow');

    assert.equal(renderCalled, 0);
});

QUnit.test('Check that layoutManager doesn\'t rerender when change field widget', function(assert) {
    const viewModel = {
        formData:
            {
                famousPirate: ko.observable('John Morgan')
            }

    };
    let renderCalled = 0;

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.find('.dx-layout-manager').dxLayoutManager('instance')._render = function() { renderCalled++; };
    $form.find('.dx-textbox').dxTextBox('instance').option('value', 'Cpt. Jack Sparrow');

    assert.equal(renderCalled, 0);
});

QUnit.test('Check that form doesn\'t rerender when change observable', function(assert) {
    const viewModel = {
        formData:
            {
                famousPirate: ko.observable('John Morgan')
            }

    };
    let renderCalled = 0;

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.dxForm('instance')._render = function() { renderCalled++; };
    viewModel.formData.famousPirate('Cpt. Jack Sparrow');

    assert.equal(renderCalled, 0);
});

QUnit.test('Check that layoutManager doesn\'t rerender when change observable', function(assert) {
    const viewModel = {
        formData:
            {
                famousPirate: ko.observable('John Morgan')
            }

    };
    let renderCalled = 0;

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.find('.dx-layout-manager').dxLayoutManager('instance')._render = function() { renderCalled++; };
    viewModel.formData.famousPirate('Cpt. Jack Sparrow');

    assert.equal(renderCalled, 0);
});

QUnit.test('Change observable for formData field', function(assert) {
    const viewModel = {
        famousSailor: ko.observable('Edward Teach'),
        famousPirate: ko.observable('John Morgan')
    };

    viewModel.formData = {
        manOfTheYear: viewModel.famousPirate
    };

    const $form = $('#simpleDataForm');

    ko.applyBindings(viewModel, $form.get(0));

    const textBoxInstance = $form.find('.dx-textbox').dxTextBox('instance');
    const formInstance = $form.dxForm('instance');

    assert.equal(textBoxInstance._input().val(), 'John Morgan');

    formInstance._updateFieldValue('manOfTheYear', viewModel.famousSailor());

    assert.equal(textBoxInstance._input().val(), 'Edward Teach');
    assert.equal(viewModel.famousSailor(), 'Edward Teach');
    assert.equal(viewModel.famousPirate(), 'Edward Teach');
});

QUnit.test('Observable is not unwrap when the formData option is defined as instance_T319859', function(assert) {
    const Pirate = function() {
        this.famousPirate = ko.observable('John Morgan');
    };
    const viewModel = {
        formData: new Pirate()
    };

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    $form.find('.dx-textbox').dxTextBox('instance').option('value', 'Cpt. Jack Sparrow');
    assert.equal(viewModel.formData.famousPirate(), 'Cpt. Jack Sparrow', 'data field of form data is observable');
});

QUnit.test('\'formData\' object reference correctly updates after change whole \'formData\' option via \'option\' method when \'items\' option is defined', function(assert) {
    const Pirate = function(name) {
        this.famousPirate = ko.observable(name);
    };
    const firstPirate = new Pirate('John Morgan');
    const secondPirate = new Pirate('Jack Sparrow');
    const viewModel = {
        formData: firstPirate
    };

    const $form = $('#simpleDataForm');
    ko.applyBindings(viewModel, $form.get(0));

    const formInstance = $form.dxForm('instance');

    formInstance.option('items', ['famousPirate']);
    formInstance.option('formData', secondPirate);
    formInstance.getEditor('famousPirate').option('value', 'Calico Jack');

    assert.equal(formInstance.option('formData.famousPirate'), 'Calico Jack', 'formData is OK');
    assert.equal(firstPirate.famousPirate(), 'John Morgan', 'firstPirate data is OK');
    assert.equal(secondPirate.famousPirate(), 'Calico Jack', 'secondPirate data is OK');
});

QUnit.test('Form correctly work with a data contains computed fields without defined \'write\' logic', function(assert) {
    const viewModel = function() {
        this.famousPirate = ko.observable('Jack Sparrow');
        this.fullName = ko.computed(function() {
            return 'Captain ' + this.famousPirate();
        }, this);

        this.formData = {
            famousPirate: this.famousPirate,
            fullName: this.fullName
        };
    };
    const $form = $('#simpleDataForm');
    const vm = new viewModel();

    ko.applyBindings(vm, $form.get(0));

    const computedField = $form.find('.dx-textbox').eq(1).dxTextBox('instance');

    computedField.option('value', 'Cpt. Jack Sparrow');

    $form
        .dxForm('instance')
        .option('formData.fullName', vm.fullName);

    assert.equal(vm.fullName(), 'Captain Jack Sparrow', 'computed stay still with old value');
    assert.equal(computedField.option('value'), 'Cpt. Jack Sparrow', 'editor with computed value stay still with old value');
});

QUnit.test('Reset editor\'s value when the formData option is empty object', function(assert) {
    const viewModel = function() {
        this.formData = ko.observable({
            name: 'User',
            lastName: 'Test Last Name',
            gender: 'Male',
            room: 1,
            isDeveloper: true
        });

        this.items = ['name', 'lastName', 'sex', 'room', 'isDeveloper'];
    };
    const $form = $('#simpleTemplateForm');
    const vm = new viewModel();

    ko.applyBindings(vm, $form.get(0));
    const form = $form.dxForm('instance');

    vm.formData({});

    assert.strictEqual(form.getEditor('name').option('value'), '', 'editor for the name dataField');
    assert.strictEqual(form.getEditor('lastName').option('value'), '', 'editor for the lastName dataField');
    assert.strictEqual(form.getEditor('sex').option('value'), '', 'editor for the sex dataField');
    assert.strictEqual(form.getEditor('room').option('value'), null, 'editor for the room dataField');
    assert.strictEqual(form.getEditor('isDeveloper').option('value'), false, 'editor for the isDeveloper dataField');
});

QUnit.test('Form is not crashed when numberbox is used (T369550)', function(assert) {
    const viewModel = {
        formData: {
            number: ko.observable(0)
        },
        items: [{
            dataField: 'number',
            editorType: 'dxNumberBox',
        }]
    };
    const $form = $('#formWithItems');

    ko.applyBindings(viewModel, $form.get(0));
    $form.find('.dx-numberbox').dxNumberBox('option', 'value', 10);

    assert.ok(true, 'error is not threw');
});

QUnit.test('Form items should have correct model', function(assert) {
    assert.expect(1);
    const viewModel = {
        formData: {},
        items: [{
            itemType: 'button',
            buttonOptions: {
                text: 'Register',
                onClick: function(e) {
                    assert.deepEqual(e.model, viewModel, 'model is defined');
                }
            }
        }]
    };

    const $form = $('#formWithItems');

    ko.applyBindings(viewModel, $form.get(0));
    $form.find('.dx-button').trigger('dxclick');
});

QUnit.test('Editor doesn\'t update the field data if it\'s already up to date', function(assert) {
    const viewModel = {
        formData: {
            testObj: ko.observable({ name: 'John' })
        },
        items: [{
            dataField: 'testObj',
            editorType: 'dxSelectBox',
            editorOptions: { displayExpr: 'name' }
        }]
    };

    const $form = $('#formWithItems');

    ko.applyBindings(viewModel, $form.get(0));
    const formInstance = $form.dxForm('instance');

    const editor = formInstance.getEditor('testObj');

    const updateFieldValueSpy = sinon.spy(formInstance, '_updateFieldValue');
    editor.option('value', { name: 'Alex' });

    assert.equal(updateFieldValueSpy.callCount, 0, 'Editor doesn\'t update actual value');
    assert.equal(formInstance.option('formData.testObj.name'), 'Alex', 'FormData is correct');
});


moduleWithoutCsp('Templates');

QUnit.test('Render template', function(assert) {
    const viewModel = {
        formData: {
            test: ko.observable('John Morgan')
        },
        items: [{ dataField: 'test', template: 'simpleTemplate' }]
    };
    const $form = $('#simpleTemplateForm');

    ko.applyBindings(viewModel, $form.get(0));

    const $fieldItemWidget = $form.find('.' + FIELD_ITEM_CONTENT_CLASS);
    const spanText = $fieldItemWidget.find('span').text();
    const textArea = $fieldItemWidget.find('.dx-textarea').dxTextArea('instance');
    const form = $form.dxForm('instance');

    assert.equal(spanText, 'KO template');
    assert.equal(textArea.option('value'), form.option('formData.test'), 'Widget\'s value equal to bound datafield');
});

QUnit.test('Check template bound to data', function(assert) {
    const viewModel = {
        formData: {
            test: ko.observable('John Morgan')
        },
        items: [{ dataField: 'test', template: 'simpleTemplate' }]
    };
    const $form = $('#simpleTemplateForm');

    ko.applyBindings(viewModel, $form.get(0));

    const $fieldItemWidget = $form.find('.' + FIELD_ITEM_CONTENT_CLASS);
    const textArea = $fieldItemWidget.find('.dx-textarea').dxTextArea('instance');
    const form = $form.dxForm('instance');

    textArea.option('value', 'qwerty');

    assert.equal(form.option('formData.test'), 'qwerty', 'Correct data');
});

QUnit.test('Redraw layout manager when labelLocation changes', function(assert) {
    const $form = $('#simpleTemplateForm').dxForm({ formData: { testField: 'test' } });
    const form = $form.dxForm('instance');

    assert.equal($form.find('.' + FIELD_ITEM_LABEL_LOCATION_CLASS + 'left').length, 1, 'We have 1 label with location left');

    form.option('labelLocation', 'bottom');

    assert.equal($form.find('.' + FIELD_ITEM_LABEL_LOCATION_CLASS + 'bottom').length, 1, 'We have 1 label with location bottom');
    assert.equal($form.find('.' + FIELD_ITEM_LABEL_LOCATION_CLASS + 'left').length, 0, 'We has\'t labels with location left');
});

QUnit.test('Item content class should depend on the \'labelLocation\' option', function(assert) {
    const $form = $('#simpleTemplateForm').dxForm({ formData: { testField: 'test' } });
    const form = $form.dxForm('instance');

    assert.equal($form.find('.' + FIELD_ITEM_CONTENT_LOCATION_CLASS + 'right').length, 1, 'Item content has the \'right\' location');

    form.option('labelLocation', 'right');
    assert.equal($form.find('.' + FIELD_ITEM_CONTENT_LOCATION_CLASS + 'left').length, 1, 'Item content has the \'left\' location');

    form.option('labelLocation', 'top');
    assert.equal($form.find('.' + FIELD_ITEM_CONTENT_LOCATION_CLASS + 'bottom').length, 1, 'Item content has the \'bottom\' location');
});

QUnit.test('Tab template', function(assert) {
    const viewModel = {
        formData: {
            test: ko.observable('John Morgan')
        },
        items: [{
            itemType: 'tabbed',
            tabs: [
                {
                    dataField: 'test',
                    tabTemplate: 'tabTemplate'
                }
            ]
        }]
    };
    const $form = $('#simpleTemplateForm');

    ko.applyBindings(viewModel, $form.get(0));

    assert.equal($form.find('#tabTemplate').length, 1);
    assert.equal($form.find('#tabTemplate').first().text(), 'Test tab template');
});

QUnit.test('The formData is empty object when formData has \'undefined\' value', function(assert) {
    const viewModel = {
        formData: ko.observable(),
        items: [{ dataField: 'City' }]
    };
    ko.applyBindings(viewModel, $('#formWithItems').get(0));

    assert.deepEqual(viewModel.formData(), { });
});

QUnit.test('Check name argument of the simple item template when name is defined', function(assert) {
    const viewModel = {
        items: [{ name: 'TestName', template: 'simpleTemplate2' }]
    };
    const $form = $('#simpleTemplateForm2');

    ko.applyBindings(viewModel, $form.get(0));

    assert.strictEqual($('#name').text(), 'TestName', 'the name argument of template');
});

QUnit.test('Check name argument of the simple item template when name and dataField are defined', function(assert) {
    const viewModel = {
        items: [{ name: 'TestName', dataField: 'TestDataField', template: 'simpleTemplate2' }]
    };
    const $form = $('#simpleTemplateForm2');

    ko.applyBindings(viewModel, $form.get(0));

    assert.strictEqual($('#name').text(), 'TestName', 'the name argument of template');
});

QUnit.test('Check name argument of the simple item template when name is undefined', function(assert) {
    const viewModel = {
        items: [{ template: 'simpleTemplate2' }]
    };
    const $form = $('#simpleTemplateForm2');

    ko.applyBindings(viewModel, $form.get(0));

    assert.strictEqual($('#name').text(), '', 'the name argument of template');
});

QUnit.test('Check name argument of the simple item template when name is undefined and dataField is defined', function(assert) {
    const viewModel = {
        items: [{ dataField: 'TestDataField', template: 'simpleTemplate2' }]
    };
    const $form = $('#simpleTemplateForm2');

    ko.applyBindings(viewModel, $form.get(0));

    assert.strictEqual($('#name').text(), '', 'the name argument of template');
});
