import $ from 'jquery';

import 'ui/html_editor';
import { deferUpdate } from 'core/utils/common';
import { Event as dxEvent } from 'common/core/events';

import devices from '__internal/core/m_devices';
import eventsEngine from 'common/core/events/core/events_engine';

import keyboardMock from '../../../helpers/keyboardMock.js';

const FOCUS_STATE_CLASS = 'dx-state-focused';
const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const TIME_TO_WAIT = 500;
const ORANGE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4z8j4HwAFBQIB6OfkUgAAAABJRU5ErkJggg==';

const { test, module: testModule } = QUnit;

function createEvent(type = 'paste', element) {
    const customEvent = document.createEvent('Event');

    customEvent.initEvent(type, true, true);
    customEvent.clipboardData = {
        getData: () => 'test'
    };

    if(element) {
        const { x, y } = element.getBoundingClientRect();
        customEvent.clientX = x;
        customEvent.clientY = y;
        customEvent.dataTransfer = { files: [] };
    }

    return customEvent;
}

const createModuleConfig = function({ initialOptions = {}, beforeCallback, afterCallback }) {
    return {
        beforeEach: function() {
            beforeCallback && beforeCallback();
            this.clock = sinon.useFakeTimers();

            this.options = initialOptions;

            this.$container = $('#htmlEditor');

            this.createEditor = (options) => {
                this.instance = this.$container
                    .dxHtmlEditor(options || this.options)
                    .dxHtmlEditor('instance');
            };
        },
        afterEach: function() {
            afterCallback && afterCallback();
            this.clock.restore();
        }
    };
};

testModule('Events', createModuleConfig({ initialOptions: { value: '<p>Test 1</p><p>Test 2</p><p>Test 3</p>' } }), () => {
    test('focusIn event by API', function(assert) {
        this.createEditor();

        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.instance.on('focusIn', focusInStub);
        this.instance.on('focusOut', focusOutStub);

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused');
        assert.strictEqual(focusOutStub.callCount, 0, 'Editor isn\'t blurred');

        $(this.instance._focusTarget()).blur();

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused');
        assert.strictEqual(focusOutStub.callCount, 1, 'Editor is blurred');
    });

    test('focus events should toggle \'dx-state-focused\' class', function(assert) {
        this.createEditor();
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        const $element = this.instance.$element();
        const $focusTarget = this.instance._focusTarget();

        assert.ok($element.hasClass(FOCUS_STATE_CLASS), 'element has focused class');
        assert.ok($focusTarget.hasClass(FOCUS_STATE_CLASS), 'focusTarget has focused class');

        $(this.instance._focusTarget()).blur();
        this.clock.tick(TIME_TO_WAIT);

        assert.notOk($element.hasClass(FOCUS_STATE_CLASS), 'element doesn\'t have focused class');
        assert.notOk($focusTarget.hasClass(FOCUS_STATE_CLASS), 'focusTarget doesn\'t have focused class');
    });

    test('focus events should not trigger when content is pasted', function(assert) {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.createEditor({
            onFocusIn: focusInStub,
            onFocusOut: focusOutStub
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        const $content = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`);

        $content[0].dispatchEvent(createEvent('paste'));
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 0, 'Editor isn\'t blurred');

        $content.blur();
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 1, 'Editor is blurred one time');
    });

    test('focus events listeners attached via \'on\' should not trigger when content is pasted', function(assert) {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.createEditor({});

        this.instance.on('focusIn', focusInStub);
        this.instance.on('focusOut', focusOutStub);

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        const $content = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`);

        $content[0].dispatchEvent(createEvent('paste'));
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 0, 'Editor isn\'t blurred');

        $content.blur();
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 1, 'Editor is blurred one time');
    });

    test('focus events listeners attached only after the content is rendered (T934089)', function(assert) {
        const focusInStub = sinon.stub();
        deferUpdate(() => {
            this.createEditor({
                onFocusIn: focusInStub,
            });
        });

        this.instance.focus();

        assert.strictEqual(focusInStub.callCount, 1, 'Focus event handler is attached');
    });

    test('change value to "null" should raise only one ValueChanged event', function(assert) {
        const valueChangedStub = sinon.stub();
        const onValueChangedStub = sinon.stub();

        this.createEditor({
            value: 'test',
            onValueChanged: onValueChangedStub,
        });

        this.instance.on('valueChanged', valueChangedStub);
        this.instance.option('value', null);

        assert.ok(onValueChangedStub.calledOnce, 'subscribe via options');
        assert.ok(valueChangedStub.calledOnce, 'subscribe via method');
    });
});

testModule('drop and paste events', createModuleConfig({
    beforeCallback: () => $('#qunit-fixture').addClass('qunit-fixture-visible'),
    afterCallback: () => $('#qunit-fixture').removeClass('qunit-fixture-visible')
}), function() {
    ['drop', 'paste'].forEach((eventType) => {
        test(`event should keep valueChanged event on ${eventType}`, function(assert) {
            const done = assert.async();
            this.createEditor({
                onValueChanged: ({ event }) => {
                    assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                    assert.strictEqual(event.type, eventType, 'value changed after "paste" event dispatched');
                    done();
                },
            });
            this.instance.focus();
            this.clock.tick(TIME_TO_WAIT);
            const contentElem = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`).get(0);

            contentElem.dispatchEvent(createEvent(eventType, eventType === 'drop' ? contentElem : null));
            contentElem.textContent = 'test';
        });
    });

    test('event should keep the last raised event', function(assert) {
        const done = assert.async();
        this.createEditor({
            onValueChanged: ({ event }) => {
                assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                assert.strictEqual(event.type, 'paste', 'value changed after "paste" event dispatched');
                done();
            },
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);
        const contentElem = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`).get(0);

        contentElem.dispatchEvent(createEvent('drop', contentElem));
        contentElem.dispatchEvent(createEvent('paste'));

        contentElem.textContent = 'test';
    });
});

testModule('ValueChanged event', createModuleConfig({}), function() {
    test('event should keep valueChanged event on typing', function(assert) {
        const done = assert.async();
        this.createEditor({
            onValueChanged: ({ event }) => {
                assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                assert.strictEqual(event.type, 'keydown', 'value changed after "keydown" event dispatched');
                done();
            },
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);
        const contentElem = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`).get(0);

        keyboardMock(contentElem).type('t');
        contentElem.textContent = 't';
    });

    [
        'bold',
        'italic',
        'strike',
        'underline',
        'alignLeft',
        'alignCenter',
        'alignRight',
        'alignJustify',
        'orderedList',
        'bulletList',
        'codeBlock',
        'blockquote',

    ].forEach((toolbarOperation) => {
        test(`${toolbarOperation} toolbar item - click on toolbar button should raise valueChanged event with the relevant event`, function(assert) {
            assert.expect(2);
            const done = assert.async();
            this.createEditor({
                value: 'test',
                toolbar: { items: [toolbarOperation] },
                onValueChanged: ({ event }) => {
                    if(event) {
                        assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                        assert.strictEqual(
                            event.type,
                            'dxclick',
                            `${toolbarOperation} toolbar item - value changed after "dxclick" event dispatched`
                        );
                        done();
                    }
                },
            });
            this.instance.focus();
            this.clock.tick(TIME_TO_WAIT);
            this.instance.setSelection(0, 3);

            $('.dx-htmleditor-toolbar .dx-button').trigger('dxclick');
        });
    });

    [
        {
            name: 'header',
            acceptedValues: [false, 1, 2, 3, 4, 5]
        },
        {
            name: 'size',
            acceptedValues: ['8pt', '10pt']
        },
        {
            name: 'font',
            acceptedValues: ['Arial', 'Courier New']
        }
    ].forEach((listFormat) => {
        const { name } = listFormat;

        test(`${name} toolbar item - click on toolbar button should raise valueChanged event with the relevant event`, function(assert) {
            assert.expect(2);
            const done = assert.async();
            this.createEditor({
                value: 'test',
                toolbar: { items: [listFormat] },
                onValueChanged: ({ event }) => {
                    if(event) {
                        assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                        assert.strictEqual(
                            event.type,
                            'dxclick',
                            `${name} toolbar item - value changed after "dxclick" event dispatched`
                        );
                        done();
                    }
                },
            });
            this.instance.focus();
            this.clock.tick(TIME_TO_WAIT);
            this.instance.setSelection(0, 3);

            $('.dx-htmleditor-toolbar .dx-dropdowneditor-button').trigger('dxclick');
            $('.dx-list-item')
                .last()
                .trigger('dxclick');
        });
    });

    [
        'color',
        'background'
    ].forEach((colorDialog) => {
        test(`${colorDialog} toolbar item - click on toolbar button should raise valueChanged event with the relevant event`, function(assert) {
            assert.expect(2);
            const done = assert.async();
            this.createEditor({
                value: 'test',
                toolbar: { items: [colorDialog] },
                onValueChanged: ({ event }) => {
                    if(event) {
                        assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                        assert.strictEqual(
                            event.type,
                            'dxclick',
                            `${colorDialog} toolbar item - value changed after "dxclick" event dispatched`
                        );
                        done();
                    }
                },
            });
            this.instance.focus();
            this.clock.tick(TIME_TO_WAIT);
            this.instance.setSelection(0, 3);

            $('.dx-htmleditor-toolbar .dx-button').trigger('dxclick');

            keyboardMock($('.dx-texteditor-input').first())
                .type('100')
                .change();

            $('.dx-formdialog .dx-toolbar .dx-button')
                .first()
                .trigger('dxclick');
        });
    });

    test('link toolbar item - click on toolbar button should raise valueChanged event with the relevant event', function(assert) {
        assert.expect(2);
        const done = assert.async();
        const operationName = 'link';
        this.createEditor({
            value: 'test',
            toolbar: { items: [operationName] },
            onValueChanged: ({ event }) => {
                if(event) {
                    assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                    assert.strictEqual(
                        event.type,
                        'dxclick',
                        `${operationName} toolbar item - value changed after "dxclick" event dispatched`
                    );
                    done();
                }
            },
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);
        this.instance.setSelection(0, 3);

        $('.dx-htmleditor-toolbar .dx-button').trigger('dxclick');

        keyboardMock($('.dx-texteditor-input').first())
            .type('http://testdomain.test')
            .change();

        $('.dx-formdialog .dx-toolbar .dx-button')
            .first()
            .trigger('dxclick');
    });

    test('image toolbar item - click on toolbar button should raise valueChanged event with the relevant event', function(assert) {
        assert.expect(2);
        const done = assert.async();
        const operationName = 'image';
        this.createEditor({
            value: 'test',
            toolbar: { items: [operationName] },
            onValueChanged: ({ event }) => {
                if(event) {
                    assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                    assert.strictEqual(
                        event.type,
                        'dxclick',
                        `${operationName} toolbar item - value changed after "dxclick" event dispatched`
                    );
                    done();
                }
            },
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);
        this.instance.setSelection(0, 3);

        $('.dx-htmleditor-toolbar .dx-button').trigger('dxclick');

        keyboardMock($('.dx-texteditor-input').first())
            .type(ORANGE_PIXEL)
            .change();
        $('.dx-formdialog .dx-toolbar .dx-button')
            .first()
            .trigger('dxclick');
    });

    test('clear formatting - click on toolbar button should raise valueChanged event with the relevant event', function(assert) {
        assert.expect(2);
        const done = assert.async();
        this.createEditor({
            value: '<b>test</b>',
            toolbar: { items: ['clear'] },
            onValueChanged: ({ event }) => {
                if(event) {
                    assert.ok(event instanceof dxEvent, 'event is instance of the dxEvent');
                    assert.strictEqual(
                        event.type,
                        'dxclick',
                        'clear toolbar item - value changed after "dxclick" event dispatched'
                    );
                    done();
                }
            },
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);
        this.instance.setSelection(0, 3);

        $('.dx-htmleditor-toolbar .dx-button').trigger('dxclick');
    });

    test('dxpointermove event propagation should be stopped on HtmlEditor content to fix selection (T1045869)', function(assert) {
        const isIos = devices.current().platform === 'ios';
        assert.expect(1);
        this.createEditor();

        const $editorContent = this.$container.find('.dx-htmleditor-content');

        eventsEngine.on($editorContent, 'dxpointermove', (e) => {
            assert.strictEqual(e.isPropagationStopped(), isIos);
        });

        $editorContent.trigger('dxpointermove');
    });
});
