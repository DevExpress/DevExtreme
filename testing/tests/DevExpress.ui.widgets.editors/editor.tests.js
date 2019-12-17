import $ from 'jquery';
import Editor from 'ui/editor/editor';
import Class from 'core/class';
import ValidationEngine from 'ui/validation_engine';
import hoverEvents from 'events/hover';

import 'common.css!';

const INVALID_MESSAGE_CLASS = 'dx-invalid-message';
const INVALID_MESSAGE_CONTENT_CLASS = 'dx-invalid-message-content';

const Fixture = Class.inherit({
    createEditor(options) {
        this.$element = $('<div/>').appendTo('body');
        const editor = new Editor(this.$element, options);

        return editor;
    },
    createOnlyElement(options) {
        this.$element = $('<div/>').appendTo('body');

        return this.$element;
    },
    teardown() {
        this.$element.remove();
        ValidationEngine.initGroups();
    }
});

QUnit.module('Editor', {
    beforeEach: () => {
        this.fixture = new Fixture();
    },
    afterEach: () => {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('Editor can be instantiated', (assert) => {
        const editor = this.fixture.createEditor();
        assert.ok(editor instanceof Editor);
    });

    QUnit.test('rendering', (assert) => {
        const editor = this.fixture.createEditor();
        assert.ok(editor);
    });

    QUnit.test('\'readOnly\' option has \'false\' value by default', (assert) => {
        const editor = this.fixture.createEditor();

        assert.strictEqual(editor.option('readOnly'), false);
    });

    QUnit.test('Changing the \'value\' option invokes the onValueChanged and passes the old and new values as arguments', (assert) => {
        const oldValue = 'old';
        const newValue = 'new';

        const onValueChanged = options => {
            assert.strictEqual(options.previousValue, oldValue, 'old value is ok');
            assert.strictEqual(options.value, newValue, 'new value is ok');
        };

        const editor = this.fixture.createEditor();

        editor.option('value', oldValue);
        editor.option('onValueChanged', onValueChanged);
        editor.option('value', newValue);
    });

    QUnit.test('Changing the \'value\' option invokes the onValueChanged and passes the old and new values as arguments, \'readOnly\' editor', (assert) => {
        const oldValue = 'old';
        const newValue = 'new';

        const onValueChanged = options => {
            assert.strictEqual(options.previousValue, oldValue, 'old value is ok');
            assert.strictEqual(options.value, newValue, 'new value is ok');
        };

        const editor = this.fixture.createEditor({ readOnly: true });

        editor.option('value', oldValue);
        editor.option('onValueChanged', onValueChanged);
        editor.option('value', newValue);
    });

    QUnit.test('Changing the \'value\' option invokes the onValueChanged and passes the old and new values as arguments, \'disabled\' editor', (assert) => {
        const oldValue = 'old';
        const newValue = 'new';

        const onValueChanged = options => {
            assert.strictEqual(options.previousValue, oldValue, 'old value is ok');
            assert.strictEqual(options.value, newValue, 'new value is ok');
        };

        const editor = this.fixture.createEditor({ disabled: true });

        editor.option('value', oldValue);
        editor.option('onValueChanged', onValueChanged);
        editor.option('value', newValue);
    });

    QUnit.test('keyboardProcessor is not defined for readOnly editor', (assert) => {
        const editor = this.fixture.createEditor({ focusStateEnabled: true, readOnly: true });

        assert.strictEqual(editor._keyboardProcessor, undefined, 'keyboardProcessor is not defined after init');

        editor.option('readOnly', false);

        assert.ok(editor._keyboardProcessor, 'keyboardProcessor is defined');
    });

    QUnit.test('If _valueChangeEventInstance is present, the onValueChanged must receive it as a Event argument; and then _valueChangeEventInstance must be reset', (assert) => {
        const newValue = 'new';
        const _valueChangeEventInstance = 'something';

        const onValueChanged = options => {
            assert.strictEqual(options.event, _valueChangeEventInstance, 'Event is ok');
        };

        const editor = this.fixture.createEditor();
        editor.option('onValueChanged', onValueChanged);
        editor._valueChangeEventInstance = _valueChangeEventInstance;
        editor.option('value', newValue);
        assert.strictEqual(editor._valueChangeEventInstance, undefined, '_valueChangeEventInstance is reset');
    });

    QUnit.test('_suppressValueChangeAction should suppress invoking _suppressValueChangeAction', (assert) => {
        assert.expect(0);

        const editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor.option('onValueChanged', () => {
            throw Error('failed');
        });
        editor.option('value', true);
    });

    QUnit.test('_resumeValueChangeAction should resume invoking _suppressValueChangeAction', (assert) => {
        const value = 'value';

        const onValueChanged = options => {
            assert.strictEqual(options.value, value);
        };

        assert.expect(1);

        const editor = this.fixture.createEditor();
        editor._suppressValueChangeAction();
        editor._resumeValueChangeAction();
        editor.option('onValueChanged', onValueChanged);
        editor.option('value', value);
    });

    QUnit.test('onValueChanged should work correctly when it passed on onInitialized (T314007)', (assert) => {
        let valueChangeCounter = 0;
        const editor = this.fixture.createEditor({
            onInitialized(e) {
                e.component.option('onValueChanged', () => {
                    valueChangeCounter++;
                });
            }
        });

        editor.option('value', 'new value');

        assert.equal(valueChangeCounter, 1, 'onValueChanged was fired');
    });

    QUnit.test('Editor can be reset()', (assert) => {
        const editor = this.fixture.createEditor({ value: '123' });

        editor.reset();

        assert.strictEqual(editor.option('value'), null);
    });

    QUnit.test('T359215 - the hover class should be added on hover event if widget has read only state', (assert) => {
        const editor = this.fixture.createEditor({
            hoverStateEnabled: true,
            readOnly: true
        });

        const $editor = editor.$element();

        $($editor).trigger(hoverEvents.start);
        assert.ok($editor.hasClass('dx-state-hover'), 'there is hover class');
    });

    [false, true].forEach((readOnly) => {
        const substring = readOnly ? '' : 'not';
        QUnit.test(`"backspace" key press event should ${substring} be prevented when editor is ${substring} read only`, (assert) => {
            const editor = this.fixture.createEditor({
                readOnly
            });
            const $eventTarget = $(editor._keyboardEventBindingTarget());
            let e = $.Event('keydown', { key: 'Backspace' });

            $eventTarget.trigger(e);
            assert.strictEqual(e.isDefaultPrevented(), readOnly);

            editor.option('readOnly', !readOnly);
            e = $.Event('keydown', { key: 'Backspace' });

            $eventTarget.trigger(e);
            assert.strictEqual(e.isDefaultPrevented(), !readOnly);
        });
    });
});

QUnit.module('the \'name\' option', {
    beforeEach: () => {
        this.$element = $('<div>').appendTo('body');
        this.EditorInheritor = Editor.inherit({
            _initMarkup() {
                this._$submitElement = $('<input type=\'hidden\'>').appendTo(this.$element());
                this.callBase();
            },
            _getSubmitElement() {
                return this._$submitElement;
            }
        });
    },
    afterEach: () => {
        this.$element.remove();
    }
}, () => {
    QUnit.test('editor inheritor input should get the \'name\' attribute with a correct value', (assert) => {
        const expectedName = 'some_name';

        new this.EditorInheritor(this.$element, {
            name: expectedName
        });

        const $input = this.$element.find('input[type=\'hidden\']');
        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value');
    });

    QUnit.test('editor inheritor input should get correct \'name\' attribute after the \'name\' option is changed', (assert) => {
        const expectedName = 'new_name';

        const instance = new this.EditorInheritor(this.$element, {
            name: 'initial_name'
        });

        const $input = this.$element.find('input[type=\'hidden\']');

        instance.option('name', expectedName);
        assert.equal($input.attr('name'), expectedName, 'the input \'name\' attribute has correct value ');
    });

    QUnit.test('the \'name\' attribute should not be rendered if name is an empty string', (assert) => {
        new this.EditorInheritor(this.$element);

        const input = this.$element.find('input[type=\'hidden\']').get(0);
        assert.notOk(input.hasAttribute('name'), 'there should be no \'name\' attribute for hidden input');
    });

    QUnit.test('the \'name\' attribute should be removed after name is changed to an empty string', (assert) => {
        const instance = new this.EditorInheritor(this.$element, {
            name: 'some_name'
        });

        const input = this.$element.find('input[type=\'hidden\']').get(0);

        instance.option('name', '');
        assert.notOk(input.hasAttribute('name'), 'there should be no \'name\' attribute for hidden input');
    });
});

QUnit.module('Validation - UI', {
    beforeEach: () => {
        this.fixture = new Fixture();
    },
    afterEach: () => {
        this.fixture.teardown();
    }
}, () => {
    const INVALID_VALIDATION_CLASS = 'dx-invalid';

    QUnit.test('Widget can be created as invalid', (assert) => {
        // assign
        const message = 'That is very bad editor';

        // act
        const editor = this.fixture.createEditor({
            value: '',
            isValid: false,
            validationError: {
                message
            }
        });

        // assert
        assert.ok(editor, 'Editor should be created');
        assert.ok(editor.$element().hasClass(INVALID_VALIDATION_CLASS), 'Editor main element should be marked as invalid');
    });

    QUnit.test('Widget can be set in invalid state through options', (assert) => {
        // assign
        const message = 'That is very bad editor';

        const editor = this.fixture.createEditor({
            value: ''
        });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message
            }
        });

        // assert
        assert.ok(editor.$element().hasClass(INVALID_VALIDATION_CLASS), 'Editor main element should be marked as invalid');
    });

    QUnit.test('Widget message should be created', (assert) => {
        const message = 'That is very bad editor';
        const editor = this.fixture.createEditor({});

        editor.option({
            isValid: false,
            validationError: {
                message
            }
        });

        assert.ok(editor._$validationMessage, 'Tooltip should be created');
        assert.ok(editor._$validationMessage.hasClass(INVALID_MESSAGE_CLASS), 'Tooltip should be marked with auto');
        assert.ok(editor._$validationMessage.hasClass('dx-invalid-message-auto'), 'Tooltip should be marked with auto');
        assert.ok(!editor._$validationMessage.hasClass('dx-invalid-message-always'), 'Tooltip should not be marked with always');
        assert.equal(editor._$validationMessage.dxOverlay('instance').$content().text(), message, 'Correct message should be set');
    });

    QUnit.test('Widget message (tooltip) should be created and always shown', (assert) => {
        // assign
        const message = 'That is very bad editor';

        const editor = this.fixture.createEditor({
            validationMessageMode: 'always'
        });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message
            }
        });

        // assert
        assert.ok(editor._$validationMessage, 'Tooltip should be created');
        assert.ok(editor._$validationMessage.hasClass(INVALID_MESSAGE_CLASS), 'Tooltip should be marked with auto');
        assert.ok(editor._$validationMessage.hasClass('dx-invalid-message-always'), 'Tooltip should be marked with always');
        assert.ok(!editor._$validationMessage.hasClass('dx-invalid-message-auto'), 'Tooltip should not be marked with auto');
    });

    QUnit.test('Widget message (tooltip) should be created but never shown', (assert) => {
        // assign
        const message = 'That is very bad editor';

        const editor = this.fixture.createEditor({
            validationMessageMode: 'none'
        });

        // act
        editor.option({
            isValid: false,
            validationError: {
                message
            }
        });

        // assert
        assert.ok(editor._$validationMessage, 'Tooltip should be created');
        assert.ok(editor._$validationMessage.hasClass(INVALID_MESSAGE_CLASS), 'Tooltip should be marked with auto');
        assert.ok(!editor._$validationMessage.hasClass('dx-invalid-message-auto'), 'Tooltip should not be marked as auto');
        assert.ok(!editor._$validationMessage.hasClass('dx-invalid-message-always'), 'Tooltip should not be marked as always');
    });

    QUnit.test('Widget message (tooltip) should be destroyed after editor become valid', (assert) => {
        // assign
        const message = 'That is very bad editor';

        const editor = this.fixture.createEditor({
            validationMessageMode: 'always'
        });

        editor.option({
            isValid: false,
            validationError: {
                message
            }
        });

        // act
        editor.option({ isValid: true });

        // assert
        assert.ok(!editor._$validationMessage, 'Tooltip should be destroyed; reference should be removed');
    });

    QUnit.test('Validation message should flip if it is out of boundary validationBoundary', (assert) => {
        const $parent = this.fixture.createOnlyElement().css({
            paddingTop: '100px'
        });
        const $element = $('<div>').appendTo($parent);

        const editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Flip'
            },
            validationBoundary: $parent
        });

        // act
        editor.option({ isValid: false });
        const $validationMessage = $element.find(`.${INVALID_MESSAGE_CONTENT_CLASS}`);

        // assert
        assert.ok($validationMessage.offset().top < $element.offset().top, 'validation message was flipped');
    });

    QUnit.test('Validation message should have the same with editor width', (assert) => {
        const width = 100;
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width,
            validationMessageMode: 'always',
            validationError: {
                message: 'Flip'
            },
            isValid: false
        });

        const $validationMessage = $element.find(`.${INVALID_MESSAGE_CLASS}`);
        assert.equal($validationMessage.outerWidth(), width, 'validation message width is correct');
    });

    QUnit.test('Validation message should have the same with editor width after option change', (assert) => {
        const width = 200;
        const $element = this.fixture.createOnlyElement();

        const editor = new Editor($element, {
            width: 100,
            validationMessageMode: 'always',
            validationError: {
                message: 'Flip'
            },
            isValid: false
        });

        editor.option('width', width);
        const $validationMessage = $element.find(`.${INVALID_MESSAGE_CLASS}`);
        assert.equal($validationMessage.outerWidth(), width, 'validation message width is correct');
    });

    QUnit.test('Overlay content width should be less or equal message width', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 100,
            validationMessageMode: 'always',
            validationError: {
                message: 'Very very very very very very very very very very very very very very very very very long validation message'
            },
            isValid: false
        });

        const $validationMessage = $element.find(`.${INVALID_MESSAGE_CLASS}`);
        const $content = $validationMessage.find(`.${INVALID_MESSAGE_CONTENT_CLASS}`);

        assert.ok($content.outerWidth() <= $validationMessage.outerWidth(), 'validation message width is correct');
    });

    QUnit.test('Validation message text should not be wrapped', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        const $content = $element.find(`.${INVALID_MESSAGE_CONTENT_CLASS}`);
        assert.equal($content.css('whiteSpace'), 'normal', 'text is not wrapped');
    });

    QUnit.test('Validation message should have correct width for small content', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 500,
            validationMessageMode: 'always',
            validationError: {
                message: 'Err'
            },
            isValid: false
        });

        const $content = $element.find(`.${INVALID_MESSAGE_CONTENT_CLASS}`);
        const contentWidth = $content.outerWidth();

        assert.equal($content.css('width', 'auto').outerWidth(), contentWidth, 'validation message width is correct');
    });

    QUnit.test('T376114 - Validation message should have the 100px max height if the editor has smaller size', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            width: 20,
            validationMessageMode: 'always',
            validationError: {
                message: 'ErrorErrorErrorErrorErrorErrorError'
            },
            isValid: false
        });

        const $content = $element.find(`.${INVALID_MESSAGE_CONTENT_CLASS}`);

        assert.equal($content.outerWidth(), 100, 'the validation message width is correct');
    });

    QUnit.test('Validation overlay should have the \'propagateOutsideClick\' with true ', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error'
            },
            isValid: false
        });

        assert.equal($element.find(`.${INVALID_MESSAGE_CLASS}.dx-widget`).dxOverlay('option', 'propagateOutsideClick'), true, '\'propagateOutsideClick\' option has correct value');
    });

    QUnit.test('Validation overlay should not inherit templates from the editor', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error'
            },
            integrationOptions: {
                templates: {
                    content: {
                        render() {
                            $('div').attr('id', 'editorContentTemplate');
                        }
                    }
                }
            },
            isValid: false
        });

        assert.equal($element.find(`.${INVALID_MESSAGE_CLASS}.dx-widget #editorContentTemplate`).length, 0, 'overlay does not inherit templates from the editor');
    });

    QUnit.test('Validation overlay should be render correctly in hidden area', (assert) => {
        const $element = this.fixture.createOnlyElement();
        const $hiddenDiv = $('<div>').css('display', 'none');

        $element.appendTo($hiddenDiv);

        const validationMessage = 'text is required';
        const editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: validationMessage
            },
            isValid: false
        });

        assert.equal(editor._$validationMessage.text(), validationMessage, 'validation overlay text was render correctly');
    });

    QUnit.test('Validation overlay width after render in hidden area should be equal width in visible area', (assert) => {
        const $element = this.fixture.createOnlyElement();
        const $hiddenDiv = $('<div>').css('display', 'none');

        $element.appendTo($hiddenDiv);
        $hiddenDiv.appendTo('#qunit-fixture');

        const validationMessage = 'text';
        const editor = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: validationMessage
            },
            isValid: false,
            width: 305
        });

        $hiddenDiv.css('display', 'block');

        assert.equal(editor._$validationMessage.outerWidth(), 305, 'overlay width was set correctly');
    });
});

QUnit.module('Validation overlay options', {
    beforeEach: () => {
        this.fixture = new Fixture();
    },
    afterEach: () => {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('it should be possible to redefine validation overlay options', (assert) => {
        const $element = this.fixture.createOnlyElement();

        new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            validationTooltipOptions: {
                width: 200,
                customOption: 'Test'
            },
            isValid: false
        });

        const overlay = $element.find(`.${INVALID_MESSAGE_CLASS}.dx-widget`).dxOverlay('instance');

        assert.equal(overlay.option('customOption'), 'Test', 'a custom option has been created');
        assert.equal(overlay.option('width'), 200, 'a default option has been redefined');
    });

    QUnit.test('editor\'s overlay options should be changed when validation overlay\'s options changed', (assert) => {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        assert.equal(instance.option('validationTooltipOptions.width'), 'auto', 'options are readable on init');

        const overlay = instance._validationMessage;

        overlay.option('width', 150);
        assert.equal(instance.option('validationTooltipOptions.width'), 150, 'option has ben changed');
    });

    QUnit.test('it should be possible to set validationTooltipOptions dynamically', (assert) => {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        const overlay = instance._validationMessage;

        instance.option('validationTooltipOptions.width', 130);
        assert.equal(overlay.option('width'), 130, 'option has ben changed');

        instance.option('validationTooltipOptions', { height: 50 });
        assert.equal(overlay.option('height'), 50, 'option has ben changed');
        assert.equal(instance.option('validationTooltipOptions.width'), 130, 'redefined object\'s fields was not changed');
        assert.equal(instance.option('validationTooltipOptions.shading'), false, 'default object\'s fields was not changed');
    });

    QUnit.test('it should be possible to set null or undefined to the validationTooltipOptions', (assert) => {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        const overlay = instance._validationMessage;

        instance.option('validationTooltipOptions.test', 130);
        instance.option('validationTooltipOptions.test2', 120);
        assert.strictEqual(overlay.option('test'), 130, 'option has ben changed');
        assert.strictEqual(overlay.option('test2'), 120, 'option has ben changed');

        instance.option('validationTooltipOptions', { test2: null, test: undefined });
        assert.strictEqual(overlay.option('test'), undefined, 'option has ben changed');
        assert.strictEqual(overlay.option('test2'), null, 'option has ben changed');
    });

    QUnit.test('default validation options should not be redefined on revalidation', (assert) => {
        const $element = this.fixture.createOnlyElement();

        const instance = new Editor($element, {
            validationMessageMode: 'always',
            validationError: {
                message: 'Error message'
            },
            isValid: false
        });

        instance.option({
            isValid: true,
            validationError: {
                message: 'New error message'
            }
        });
        instance.option('isValid', false);

        const message = $(`.${INVALID_MESSAGE_CONTENT_CLASS}`).text();
        assert.strictEqual(message, 'New error message');
    });
});

QUnit.module('Validation Events', {
    beforeEach: () => {
        this.fixture = new Fixture();
    },
    afterEach: () => {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('validationRequest event should fire on value change', (assert) => {
        const value = 'test123';
        const handler = sinon.stub();

        const editor = this.fixture.createEditor({
            value: 'xxx'
        });

        editor.validationRequest.add(handler);

        // act
        editor.option('value', value);
        // assert
        const params = handler.getCall(0).args[0];
        assert.ok(handler.calledOnce, 'Validating handler should be called');
        assert.equal(params.value, value, 'Correct value was passed');
        assert.equal(params.editor, editor, 'Editor was passed');
    });

    QUnit.test('T220137: validationRequest event should NOT fire on value change', (assert) => {
        const nullValue = null;
        const handler = sinon.stub();

        const editor = this.fixture.createEditor({
            value: undefined
        });

        editor.validationRequest.add(handler);

        // act
        editor.option('value', nullValue);
        // assert
        assert.ok(!handler.called, 'Validating handler should not be called');
    });
});

QUnit.module('aria accessibility', {
    beforeEach: () => {
        this.fixture = new Fixture();
    },
    afterEach: () => {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('readonly state', (assert) => {
        const editor = this.fixture.createEditor({ readOnly: true });

        assert.equal(editor.$element().attr('aria-readonly'), 'true', 'aria-readonly is correct');

        editor.option('readOnly', false);
        assert.equal(editor.$element().attr('aria-readonly'), undefined, 'aria-readonly does not exist in not readonly state');
    });

    QUnit.test('invalid state', (assert) => {
        const editor = this.fixture.createEditor({
            isValid: false,
            validationError: {
                message: 'test message'
            }
        });
        const messageId = $(`.${INVALID_MESSAGE_CONTENT_CLASS}`).attr('id');

        assert.strictEqual(editor.$element().attr('aria-invalid'), 'true', 'aria-invalid is correct');
        assert.ok(editor.$element().get(0).hasAttribute('aria-describedby'), 'invalid editor should have the \'aria-describedby\' attribute');
        assert.strictEqual(editor.$element().attr('aria-describedby'), messageId, 'invalid editor should be described by a message');

        editor.option('isValid', true);
        assert.strictEqual(editor.$element().attr('aria-invalid'), undefined, 'aria-invalid does not exist in valid state');
        assert.strictEqual(editor.$element().attr('aria-describedby'), undefined, 'aria-describedby does not exist in valid state');
    });
});
