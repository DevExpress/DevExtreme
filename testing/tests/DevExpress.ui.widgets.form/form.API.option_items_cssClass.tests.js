import $ from 'jquery';
import devices from 'core/devices';

import 'ui/form/ui.form';

import 'generic_light.css!';

const INVALID_CLASS = 'dx-invalid';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

[false, true].forEach(useItemOption => {
    QUnit.module(`Public API: ${useItemOption ? 'itemOption(option, cssClass)' : 'option(items.cssClass)'}`, () => {
        const createForm = items => {
            items = items || [{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1'
            }];
            return $('#form').dxForm({ items: items }).dxForm('instance');
        };

        QUnit.testInActiveWindow('SimpleItem(undefined -> null)', function(assert) {
            const form = createForm();

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', null);
            } else {
                form.option('items[0].cssClass', null);
            }

            assert.strictEqual(form.itemOption('item1').cssClass, null, 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), null, 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
        });

        QUnit.testInActiveWindow('SimpleItem(undefined -> class1)', function(assert) {
            const form = createForm();

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class1');
            } else {
                form.option('items[0].cssClass', 'class1');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class1', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class1', 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');
        });

        QUnit.testInActiveWindow('SimpleItem(null -> undefined)', function(assert) {
            const form = createForm([{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1',
                cssClass: null
            }]);

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', undefined);
            } else {
                form.option('items[0].cssClass', undefined);
            }

            assert.strictEqual(form.itemOption('item1').cssClass, undefined, 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), undefined, 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
        });

        QUnit.testInActiveWindow('SimpleItem(null -> class1)', function(assert) {
            const form = createForm([{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1',
                cssClass: null
            }]);

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class1');
            } else {
                form.option('items[0].cssClass', 'class1');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class1', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class1', 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');
        });

        QUnit.testInActiveWindow('SimpleItem(class1 -> undefined)', function(assert) {
            const form = createForm([{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1',
                cssClass: 'class1'
            }]);

            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');
            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', undefined);
            } else {
                form.option('items[0].cssClass', undefined);
            }

            assert.strictEqual(form.itemOption('item1').cssClass, undefined, 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), undefined, 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class1').length, 0, '$(#form).find(class1).length');
        });

        QUnit.testInActiveWindow('SimpleItem(class1 -> null)', function(assert) {
            const form = createForm([{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1',
                cssClass: 'class1'
            }]);

            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');
            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', null);
            } else {
                form.option('items[0].cssClass', null);
            }

            assert.strictEqual(form.itemOption('item1').cssClass, null, 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), null, 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class1').length, 0, '$(#form).find(class1).length');
        });

        QUnit.testInActiveWindow('SimpleItem(class1 -> class2)', function(assert) {
            const form = createForm([{
                itemType: 'simple',
                editorType: 'dxTextBox',
                name: 'item1',
                cssClass: 'class1',
                validationRules: [{
                    type: 'custom',
                    validationCallback: () => false
                }]
            }]);

            form.validate();
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class2');
            } else {
                form.option('items[0].cssClass', 'class2');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class2', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class2', 'form.option(items[0].cssClass)');
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class2').length, 1, '$(#form).find(class2).length');
        });

        QUnit.testInActiveWindow('SimpleItem(class1 -> class2) in form with 2 items', function(assert) {
            const form = createForm([
                {
                    itemType: 'simple',
                    editorType: 'dxTextBox',
                    name: 'item1',
                    cssClass: 'class1'
                },
                {
                    itemType: 'simple',
                    editorType: 'dxTextBox',
                    validationRules: [{
                        type: 'custom',
                        validationCallback: function() { return false; }
                    }]
                }
            ]);

            form.validate();
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class2');
            } else {
                form.option('items[0].cssClass', 'class2');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class2', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class2', 'form.option(items[0].cssClass)');
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class2').length, 1, '$(#form).find(class2).length');
        });

        QUnit.test('SimpleItem(undefined -> class1) when item is hidden via api', function(assert) {
            const form = createForm([
                {
                    itemType: 'simple',
                    editorType: 'dxTextBox',
                    name: 'item1'
                }]
            );

            if(useItemOption) {
                form.itemOption('item1', 'visible', false);
                form.itemOption('item1', 'cssClass', 'class1');
            } else {
                form.option('items[0].visible', false);
                form.option('items[0].cssClass', 'class1');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class1', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class1', 'form.option(items[0].cssClass)');
            assert.strictEqual($('#form').find('.class2').length, 0, '$(#form).find(class2).length');
        });

        QUnit.testInActiveWindow('ButtonItem(class1 -> class2)', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'desktop specific test');
                return;
            }
            const form = createForm([{
                itemType: 'button',
                name: 'item1',
                cssClass: 'class1',
                buttonOptions: { icon: 'icon1' }
            }]);

            $('#form').find('.dx-button').focus();
            assert.ok($('#form').find('.dx-button').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class2');
            } else {
                form.option('items[0].cssClass', 'class2');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class2', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class2', 'form.option(items[0].cssClass)');
            assert.ok($('#form').find('.dx-button').is(':focus'), 'final focus');
            assert.strictEqual($('#form').find('.class2').length, 1, '$(#form).find(class2).length');
        });

        QUnit.testInActiveWindow('ButtonItem(class1 -> class2) in form with 2 items', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'desktop specific test');
                return;
            }
            const form = createForm([
                {
                    itemType: 'button',
                    name: 'item1',
                    cssClass: 'class1',
                    buttonOptions: { icon: 'icon1' }
                },
                {
                    itemType: 'simple',
                    editorType: 'dxTextBox',
                    validationRules: [{
                        type: 'custom',
                        validationCallback: () => false
                    }]
                }
            ]);

            form.validate();
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `initial [${INVALID_CLASS}].length`);

            $('#form').find('.dx-texteditor-input').focus();
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class1').length, 1, '$(#form).find(class1).length');

            if(useItemOption) {
                form.itemOption('item1', 'cssClass', 'class2');
            } else {
                form.option('items[0].cssClass', 'class2');
            }

            assert.strictEqual(form.itemOption('item1').cssClass, 'class2', 'form.itemOption(item1).cssClass');
            assert.strictEqual(form.option('items[0].cssClass'), 'class2', 'form.option(items[0].cssClass)');
            assert.strictEqual($('#form').find(`.${INVALID_CLASS}`).length, 1, `final [${INVALID_CLASS}].length`);
            assert.ok($('#form').find('.dx-texteditor-input').is(':focus'), 'initial focus');
            assert.strictEqual($('#form').find('.class2').length, 1, '$(#form).find(class2).length');
        });
    });
});
