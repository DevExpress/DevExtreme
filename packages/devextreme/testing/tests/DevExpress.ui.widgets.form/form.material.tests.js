import $ from 'jquery';

import 'ui/form';

import 'material_blue_light.css!';
import { FIELD_ITEM_CONTENT_WRAPPER_CLASS } from '__internal/ui/form/components/field_item';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('dx-invalid class on dx-field-item-content-wrapper (T949285)', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    const invalidClass = 'dx-invalid';
    const formData = {
        field1: ''
    };

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (simple item)', function(assert) {
        const formInstance = $('#form').dxForm({
            formData,
            items: [{
                dataField: 'field1',
                helpText: 'help',
                isRequired: true
            }]
        }).dxForm('instance');

        formInstance.validate();

        const editorInstance = formInstance.getEditor('field1');
        const wrapper = $(editorInstance.element()).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.notOk(wrapper.hasClass(invalidClass));
        editorInstance.focus();
        this.clock.tick();
        assert.ok(wrapper.hasClass(invalidClass));
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (template)', function(assert) {
        let editorElement;
        $('#form').dxForm({
            validationGroup: 'formGroup',
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: function(data, itemElement) {
                        editorElement = $('<div>').dxTextBox({
                            value: ''
                        }).dxValidator({
                            validationGroup: 'formGroup',
                            validationRules: [{
                                type: 'required',
                                message: 'LastName is required'
                            }]
                        }).appendTo(itemElement);
                    }
                }
            ]
        })
            .dxForm('instance')
            .validate();

        const wrapper = $(editorElement).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.notOk(wrapper.hasClass(invalidClass));
        $(editorElement).dxTextBox('instance').focus();
        this.clock.tick();
        assert.ok(wrapper.hasClass(invalidClass));
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (async template) (T1107088)', function(assert) {
        let $editorElement;
        const form = $('#form').dxForm({
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: 'itemTemplate'
                }
            ],
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    itemTemplate: {
                        render({ container, onRendered }) {

                            $editorElement = $('<div>').appendTo(container);

                            setTimeout(() => {
                                $editorElement.dxTextBox({}).dxValidator({
                                    validationRules: [{
                                        type: 'required',
                                        message: 'LastName is required'
                                    }]
                                });

                                $editorElement.dxValidator('instance').validate();
                                onRendered();
                            });
                        }
                    }
                }
            },
        }).dxForm('instance');

        const $itemContentWrapper = $editorElement.closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
        this.clock.tick();

        form.validate();
        $editorElement.dxTextBox('instance').focus();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), true);

        $editorElement.dxTextBox('instance').blur();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid focused editor (async template) with dx-template-wrapper class (T1107088)', function(assert) {
        let $editorElement;
        const form = $('#form').dxForm({
            formData,
            items: [
                {
                    dataField: 'field1',
                    helpText: 'help',
                    template: 'itemTemplate'
                }
            ],
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    itemTemplate: {
                        render({ container, onRendered }) {
                            $editorElement = $('<div>')
                                .addClass('dx-template-wrapper')
                                .appendTo(container);

                            setTimeout(() => {
                                $editorElement.dxTextBox({}).dxValidator({
                                    validationRules: [{
                                        type: 'required',
                                        message: 'LastName is required'
                                    }]
                                });

                                $editorElement.dxValidator('instance').validate();
                                onRendered();
                            });
                        }
                    }
                }
            },
        }).dxForm('instance');

        const $itemContentWrapper = $editorElement.closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
        this.clock.tick();

        form.validate();
        $editorElement.dxTextBox('instance').focus();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), true);

        $editorElement.dxTextBox('instance').blur();
        assert.strictEqual($itemContentWrapper.hasClass(invalidClass), false);
    });

    QUnit.testInActiveWindow('dx-invalid class is added for invalid editor if validationMessageMode: "always" (T1026923)', function(assert) {
        const formInstance = $('#form').dxForm({
            formData,
            customizeItem: function(item) {
                if(item.itemType === 'simple') {
                    item.editorOptions = { ...item.editorOptions, validationMessageMode: 'always' };
                }
            },
            items: [{
                dataField: 'field1',
                helpText: 'help',
                isRequired: true
            }]
        }).dxForm('instance');

        formInstance.validate();

        const editorInstance = formInstance.getEditor('field1');
        const wrapper = $(editorInstance.element()).closest(`.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`);

        assert.ok(wrapper.hasClass(invalidClass));
    });
});
