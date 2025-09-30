/* eslint-disable spellcheck/spell-checker */
import SpeechRecognitionAdapter from 'core/speech_recognition_adapter';
import errors from 'ui/widget/ui.errors';
import { NOT_SUPPORTED_ERROR } from '__internal/core/speech_recognition_adapter';


QUnit.module('SpeechRecognitionAdapter', {
    beforeEach: function() {
        this.originalSpeechRecognition = window.SpeechRecognition;
        this.originalWebkitSpeechRecognition = window.webkitSpeechRecognition;

        class SpeechRecognitionMock {
            constructor() {
                this.start = sinon.spy();
                this.stop = sinon.spy();
                this.onstart = null;
                this.onresult = null;
                this.onerror = null;
                this.onend = null;
                this.lang = null;
            }
        }

        this.SpeechRecognitionMock = SpeechRecognitionMock;
        window.SpeechRecognition = SpeechRecognitionMock;

        this.createAdapter = (config = {}, events = {}) => {
            return new SpeechRecognitionAdapter(config, {
                onResult: events.onResult || sinon.spy(),
                onError: events.onError || sinon.spy(),
                onEnd: events.onEnd || sinon.spy(),
            });
        };
    },
    afterEach: function() {
        window.SpeechRecognition = this.originalSpeechRecognition;
        window.webkitSpeechRecognition = this.originalWebkitSpeechRecognition;
    },
}, () => {
    QUnit.test('should initialize SpeechRecognition', function(assert) {
        const adapter = this.createAdapter();

        assert.ok(adapter._speechRecognition, 'SpeechRecognition available');
    });

    QUnit.test('should log an error if SpeechRecognition is not supported', function(assert) {
        sinon.spy(errors, 'log');

        window.SpeechRecognition = undefined;
        window.webkitSpeechRecognition = undefined;

        try {
            this.createAdapter();

            assert.deepEqual(errors.log.lastCall.args, [NOT_SUPPORTED_ERROR], 'logged with correct args');
        } finally {
            errors.log.restore();

        }
    });

    QUnit.test('should apply config on init and runtime', function(assert) {
        const adapter = this.createAdapter({ lang: 'en-US' });
        const speechRecognition = adapter._speechRecognition;

        assert.strictEqual(speechRecognition.lang, 'en-US', 'initial config applied');
    });

    QUnit.test('should apply config at runtime', function(assert) {
        const adapter = this.createAdapter();
        const speechRecognition = adapter._speechRecognition;

        adapter.applyConfig({ lang: 'fr-FR' });

        assert.strictEqual(speechRecognition.lang, 'fr-FR', 'config updated at runtime');
    });

    QUnit.test('should not override reserved event properties', function(assert) {
        const adapter = this.createAdapter({
            onresult: 'test',
            onerror: 'test',
            onend: 'test',
        });
        const speechRecognition = adapter._speechRecognition;

        assert.notStrictEqual(speechRecognition.onresult, 'test', 'onresult not overridden by config');
        assert.notStrictEqual(speechRecognition.onerror, 'test', 'onerror not overridden by config');
        assert.notStrictEqual(speechRecognition.onend, 'test', 'onend not overridden by config');
    });

    QUnit.test('should attach event handlers', function(assert) {
        const onResultSpy = sinon.spy();
        const onErrorSpy = sinon.spy();
        const onEndSpy = sinon.spy();

        const adapter = this.createAdapter({}, {
            onResult: onResultSpy,
            onError: onErrorSpy,
            onEnd: onEndSpy,
        });

        const speechRecognition = adapter._speechRecognition;

        const resultEvent = { type: 'result' };
        speechRecognition.onresult(resultEvent);

        const errorEvent = { type: 'error' };
        speechRecognition.onerror(errorEvent);

        speechRecognition.onend();

        assert.ok(onResultSpy.calledWith(resultEvent), 'onResult handler called');
        assert.ok(onErrorSpy.calledWith(errorEvent), 'onError handler called');
        assert.ok(onEndSpy.calledOnce, 'onEnd handler called');
    });

    QUnit.test('start and stop should call methods', function(assert) {
        const adapter = this.createAdapter();
        const speechRecognition = adapter._speechRecognition;

        adapter.start();
        speechRecognition.onstart();
        adapter.stop();

        assert.ok(speechRecognition.start.calledOnce, 'start called');
        assert.ok(speechRecognition.stop.calledOnce, 'stop called');
    });

    QUnit.test('dispose should clear internal speechRecognition', function(assert) {
        const adapter = this.createAdapter();
        assert.ok(adapter._speechRecognition, 'exists before dispose');

        adapter.dispose();
        assert.strictEqual(adapter._speechRecognition, null, 'cleared after dispose');
    });

    QUnit.test('should not call start when listening', function(assert) {
        const adapter = this.createAdapter();
        const speechRecognition = adapter._speechRecognition;

        speechRecognition.onstart();
        adapter.start();

        assert.ok(speechRecognition.start.notCalled, 'start not called');
    });

    QUnit.test('should not call stop if not listening', function(assert) {
        const adapter = this.createAdapter();
        const speechRecognition = adapter._speechRecognition;

        adapter.stop();

        assert.ok(speechRecognition.stop.notCalled, 'stop not called');
    });

    QUnit.test('should update _isListening on onstart/onend', function(assert) {
        const adapter = this.createAdapter();
        const speechRecognition = adapter._speechRecognition;

        assert.strictEqual(adapter._isListening, false, 'initially not listening');

        speechRecognition.onstart();
        assert.strictEqual(adapter._isListening, true, 'set to listening after onstart');

        speechRecognition.onend();
        assert.strictEqual(adapter._isListening, false, 'reset to false after onend');
    });
});

