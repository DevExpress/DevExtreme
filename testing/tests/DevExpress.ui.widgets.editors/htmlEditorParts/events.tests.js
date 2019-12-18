import $ from 'jquery';

import 'ui/html_editor';
const FOCUS_STATE_CLASS = 'dx-state-focused';
const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const TIME_TO_WAIT = 500;

const { test, module } = QUnit;

function createPasteEvent() {
    const pasteEvent = document.createEvent('Event');

    pasteEvent.initEvent('paste', true, true);
    pasteEvent.clipboardData = {
        getData: () => 'test'
    };

    return pasteEvent;
}

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.options = {
            value: '<p>Test 1</p><p>Test 2</p><p>Test 3</p>'
        };

        this.createEditor = (options) => {
            this.instance = $('#htmlEditor')
                .dxHtmlEditor(options || this.options)
                .dxHtmlEditor('instance');
        };
    },
    afterEach: () => {
        this.clock.restore();
    }
};

module('Events', moduleConfig, () => {
    test('focusIn event by API', (assert) => {
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

    test('focus events should toggle \'dx-state-focused\' class', (assert) => {
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

    test('focus events should not trigger when content is pasted', (assert) => {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.createEditor({
            onFocusIn: focusInStub,
            onFocusOut: focusOutStub
        });
        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        const $content = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`);

        $content[0].dispatchEvent(createPasteEvent());
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 0, 'Editor isn\'t blurred');

        $content.blur();
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 1, 'Editor is blurred one time');
    });

    test('focus events listeners attached via \'on\' should not trigger when content is pasted', (assert) => {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.createEditor({});

        this.instance.on('focusIn', focusInStub);
        this.instance.on('focusOut', focusOutStub);

        this.instance.focus();
        this.clock.tick(TIME_TO_WAIT);

        const $content = $(this.instance.element()).find(`.${HTML_EDITOR_CONTENT_CLASS}`);

        $content[0].dispatchEvent(createPasteEvent());
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 0, 'Editor isn\'t blurred');

        $content.blur();
        this.clock.tick(TIME_TO_WAIT);

        assert.strictEqual(focusInStub.callCount, 1, 'Editor is focused one time');
        assert.strictEqual(focusOutStub.callCount, 1, 'Editor is blurred one time');
    });
});
