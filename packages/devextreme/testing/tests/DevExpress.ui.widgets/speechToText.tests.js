/* eslint-disable spellcheck/spell-checker */
import $ from 'jquery';
import { shouldSkipOnMobile } from '../../helpers/device.js';
import SpeechToText from 'ui/speech_to_text';
import Button from 'ui/button';
import devices from '__internal/core/m_devices';
import themes from 'ui/themes';

import 'generic_light.css!';

import {
    SPEECH_TO_TEXT_CLASS,
    SPEECH_TO_TEXT_LISTENING_CLASS,
} from '__internal/ui/speech_to_text/speech_to_text';

const BUTTON_MODE_CONTAINED_CLASS = 'dx-button-mode-contained';
const BUTTON_MODE_TEXT_CLASS = 'dx-button-mode-text';
const BUTTON_MODE_OUTLINED_CLASS = 'dx-button-mode-outlined';
const BUTTON_TYPE_DANGER_CLASS = 'dx-button-danger';
const BUTTON_TYPE_PRIMARY_CLASS = 'dx-button-primary';

const INKRIPPLE_CLASS = 'dx-inkripple';
const INKRIPPLE_WAVE_CLASS = 'dx-inkripple-wave';

QUnit.testStart(() => {
    const markup = '<div id="speechToText"></div>';
    $('#qunit-fixture').html(markup);
});

class SpeechRecognitionMock {
    constructor() {
        this.start = sinon.spy();
        this.stop = sinon.spy();
        this.onresult = null;
        this.onerror = null;
        this.onend = null;
    }
}

const moduleConfig = {
    beforeEach: function() {
        this.originalSpeechRecognition = window.SpeechRecognition;

        window.SpeechRecognition = SpeechRecognitionMock;

        const init = (options = {}, selector = '#speechToText') => {
            this.$element = $(selector).dxSpeechToText(options);
            this.instance = this.$element.dxSpeechToText('instance');
        };

        init();

        this.getAdapter = () => this.instance._speechRecognitionAdapter;
        this.getSpeechRecognition = () => this.getAdapter()._speechRecognition;

        this.reinit = (options, selector) => {
            this.instance.dispose();
            init(options, selector);
        };

        this.getButton = () => this.$element;

        this.getButtonInstance = () => {
            return Button.getInstance(this.getButton());
        };
    },
    afterEach: function() {
        window.SpeechRecognition = this.originalSpeechRecognition;
    },
};

QUnit.module('Initialization', moduleConfig, () => {
    QUnit.test('SpeechToText should be initialized with SpeechToText type', function(assert) {
        assert.ok(this.instance instanceof SpeechToText);
    });

    QUnit.test('component should have default state INITIAL', function(assert) {
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'component is not in listening state initially');
    });

    QUnit.test('component should render button with default options', function(assert) {
        const $button = this.getButton();

        assert.strictEqual($button.length, 1, 'button is rendered');
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_CLASS), 'main CSS class applied');
    });

    QUnit.test('button should inherit properties from SpeechToText options', function(assert) {
        this.reinit({
            stylingMode: 'custom',
            type: 'danger',
            disabled: true,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            width: 100,
            height: 100,
            useInkRipple: true,
        });

        const buttonInstance = this.getButtonInstance();

        assert.strictEqual(buttonInstance.option('stylingMode'), 'custom', 'stylingMode inherited');
        assert.strictEqual(buttonInstance.option('type'), 'danger', 'type inherited');
        assert.strictEqual(buttonInstance.option('disabled'), true, 'disabled inherited');
        assert.strictEqual(buttonInstance.option('activeStateEnabled'), false, 'activeStateEnabled inherited');
        assert.strictEqual(buttonInstance.option('focusStateEnabled'), false, 'focusStateEnabled inherited');
        assert.strictEqual(buttonInstance.option('hoverStateEnabled'), false, 'hoverStateEnabled inherited');
        assert.strictEqual(buttonInstance.option('width'), 100, 'width inherited');
        assert.strictEqual(buttonInstance.option('height'), 100, 'height inherited');
        assert.strictEqual(buttonInstance.option('useInkRipple'), true, 'useInkRipple inherited');
    });

    QUnit.test('should have focusStateEnabled=true on desktop device', function(assert) {
        const originalDevice = devices.real();
        const originalIsSimulator = devices.isSimulator;

        devices.real({ deviceType: 'desktop' });
        devices.isSimulator = () => false;

        try {
            this.reinit();
            const { focusStateEnabled } = this.instance.option();

            assert.strictEqual(focusStateEnabled, true, 'focusStateEnabled is true on desktop');
        } finally {
            devices.real(originalDevice);
            devices.isSimulator = originalIsSimulator;
        }
    });

    QUnit.test('should have focusStateEnabled=undefined on mobile device', function(assert) {
        const originalDevice = devices.real();

        devices.real({ deviceType: 'phone' });

        try {
            this.reinit();
            const { focusStateEnabled } = this.instance.option();

            assert.strictEqual(focusStateEnabled, false, 'focusStateEnabled is false on mobile');
        } finally {
            devices.real(originalDevice);
        }
    });

    QUnit.test('should have useInkRipple=true for Material theme', function(assert) {
        const originalIsMaterial = themes.isMaterial;

        themes.isMaterial = () => true;

        try {
            this.reinit();
            const { useInkRipple } = this.instance.option();

            assert.strictEqual(useInkRipple, true, 'useInkRipple is true for Material theme');
        } finally {
            themes.isMaterial = originalIsMaterial;
        }
    });

    QUnit.test('should have useInkRipple=false for non-Material theme', function(assert) {
        const originalIsMaterial = themes.isMaterial;

        themes.isMaterial = () => false;

        try {
            this.reinit();
            const { useInkRipple } = this.instance.option();

            assert.strictEqual(useInkRipple, false, 'useInkRipple is false for non-Material theme');
        } finally {
            themes.isMaterial = originalIsMaterial;
        }
    });

    QUnit.test('component should have proper customSpeechRecognizer default', function(assert) {
        const customEngine = this.instance.option('customSpeechRecognizer');

        assert.strictEqual(customEngine.enabled, false, 'customEngine disabled by default');
        assert.strictEqual(customEngine.isListening, false, 'customEngine not listening by default');
    });
});

QUnit.module('State Management', moduleConfig, () => {
    QUnit.test('should change state from INITIAL to LISTENING on button click', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening CSS class applied');
    });

    QUnit.test('should change state from LISTENING to INITIAL on second button click', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening CSS class applied');

        $button.trigger('dxclick');
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening CSS class removed');
    });

    QUnit.test('should update button options when state changes', function(assert) {
        this.reinit({
            startIcon: 'play',
            stopIcon: 'pause',
            startText: 'Start',
            stopText: 'Stop',
        });

        const $button = this.getButton();
        const buttonInstance = this.getButtonInstance();

        assert.strictEqual(buttonInstance.option('icon'), 'play', 'initial icon correct');
        assert.strictEqual(buttonInstance.option('text'), 'Start', 'initial text correct');

        $button.trigger('dxclick');

        assert.strictEqual(buttonInstance.option('icon'), 'pause', 'listening icon correct');
        assert.strictEqual(buttonInstance.option('text'), 'Stop', 'listening text correct');
    });

    QUnit.test('should handle disabled option change at runtime', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'component in listening state');

        this.instance.option('disabled', true);
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'disabled resets to initial state');

        $button.trigger('dxclick');
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state unchanged when disabled');

        this.instance.option('disabled', false);

        $button.trigger('dxclick');
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'component working after re-enable');
    });

    QUnit.test('should properly handle state when switching from custom to manual control', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: true,
            }
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'custom engine listening state');

        this.instance.option('customSpeechRecognizer', {
            enabled: false,
            isListening: false,
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'reset to initial when custom engine disabled');

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'manual control works');
    });

    QUnit.test('should handle state transitions with disabled component', function(assert) {
        this.reinit({ disabled: true });

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'disabled prevents state change');

        this.instance.option('disabled', false);
        this.instance.option('customSpeechRecognizer', {
            enabled: true,
            isListening: true,
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'custom engine works after enabling');
    });

    QUnit.test('INITIAL state should not have animation by default', function(assert) {
        const animation = this.$element.css('animation');

        assert.strictEqual(animation, 'none 0s ease 0s 1 normal none running');
    });

    QUnit.test('LISTENING state should have animation by default', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');

        const animation = this.$element.css('animation');
        const easeInOutAnimationEnabled = animation.includes('1.5s ease-in-out 0.5s infinite normal none running');

        assert.strictEqual(easeInOutAnimationEnabled, true);
    });
});

QUnit.module('Events', moduleConfig, () => {
    QUnit.test('onStartClick should be triggered on first button click', function(assert) {
        const onStartClickSpy = sinon.spy();

        this.reinit({ onStartClick: onStartClickSpy });

        this.getButton().trigger('dxclick');

        assert.ok(onStartClickSpy.calledOnce, 'onStartClick event fired exactly once');
    });

    QUnit.test('onStopClick should be triggered on second button click', function(assert) {
        const onStopClickSpy = sinon.spy();

        this.reinit({ onStopClick: onStopClickSpy });

        const $button = this.getButton();

        $button.trigger('dxclick');
        $button.trigger('dxclick');

        assert.ok(onStopClickSpy.calledOnce, 'onStopClick event fired exactly once');
    });

    QUnit.test('should pass correct event arguments to onStartClick', function(assert) {
        assert.expect(4);

        this.reinit({
            onStartClick: (e) => {
                assert.ok(e.component instanceof SpeechToText, 'component is correct');
                assert.deepEqual(e.element, this.instance.element(), 'element is provided correctly');
                assert.ok(e.event, 'original event is provided');
                assert.strictEqual(typeof e.event, 'object', 'event is an object');
            },
        });

        this.getButton().trigger('dxclick');
    });

    QUnit.test('should pass correct event arguments to onStopClick', function(assert) {
        assert.expect(4);

        this.reinit({
            onStopClick: (e) => {
                assert.ok(e.component instanceof SpeechToText, 'component is correct');
                assert.strictEqual(e.element, this.instance.element(), 'element is provided correctly');
                assert.ok(e.event, 'original event is provided');
                assert.strictEqual(typeof e.event, 'object', 'event is an object');
            },
        });

        const $button = this.getButton();

        $button.trigger('dxclick');
        $button.trigger('dxclick');
    });

    QUnit.test('should pass correct event arguments to onStopClick & onStartClick via on()', function(assert) {
        assert.expect(8);

        this.reinit();

        const handleClick = (e) => {
            assert.ok(e.component instanceof SpeechToText, 'component is correct');
            assert.strictEqual(e.element, this.instance.element(), 'element is provided correctly');
            assert.ok(e.event, 'original event is provided');
            assert.strictEqual(typeof e.event, 'object', 'event is an object');
        };

        this.instance.on('startClick', handleClick);
        this.instance.on('stopClick', handleClick);

        const $button = this.getButton();
        $button.trigger('dxclick');
        $button.trigger('dxclick');
    });

    QUnit.test('events should be updatable at runtime', function(assert) {
        const onStartClickSpy1 = sinon.spy();
        const onStartClickSpy2 = sinon.spy();

        this.reinit({ onStartClick: onStartClickSpy1 });

        this.getButton().trigger('dxclick');
        assert.ok(onStartClickSpy1.calledOnce, 'first handler called');

        this.instance.option('onStartClick', onStartClickSpy2);

        const $button = this.getButton();

        $button.trigger('dxclick');
        $button.trigger('dxclick');

        assert.ok(onStartClickSpy1.calledOnce, 'first handler not called again');
        assert.ok(onStartClickSpy2.calledOnce, 'second handler called');
    });
});

QUnit.module('Accessibility', moduleConfig, () => {
    QUnit.test('should have tabindex=0 on button element', function(assert) {
        if(shouldSkipOnMobile(assert)) {
            return;
        }

        const $button = this.getButton();

        assert.strictEqual($button.attr('tabindex'), '0', 'tabindex is set to 0');
    });

    QUnit.test('should have correct role attribute', function(assert) {
        const $button = this.getButton();

        assert.strictEqual($button.attr('role'), 'button', 'role is set to button');
    });

    QUnit.test('should have correct aria-label in initial state', function(assert) {
        const $button = this.getButton();

        assert.strictEqual($button.attr('aria-label'), 'Press to start voice transcription', 'aria-label for start state is correct');
    });

    QUnit.test('should have correct aria-label in listening state', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');

        assert.strictEqual($button.attr('aria-label'), 'Press to stop voice transcription', 'aria-label for stop state is correct');
    });

    QUnit.test('should have correct aria-pressed in initial state', function(assert) {
        const $button = this.getButton();

        assert.strictEqual($button.attr('aria-pressed'), 'false', 'aria-pressed is false in initial state');
    });

    QUnit.test('should have correct aria-pressed in listening state', function(assert) {
        const $button = this.getButton();

        $button.trigger('dxclick');

        assert.strictEqual($button.attr('aria-pressed'), 'true', 'aria-pressed is true in listening state');
    });

    QUnit.test('should update aria attributes when state changes', function(assert) {
        const $button = this.getButton();

        assert.strictEqual($button.attr('aria-label'), 'Press to start voice transcription', 'initial aria-label is correct');
        assert.strictEqual($button.attr('aria-pressed'), 'false', 'initial aria-pressed is correct');

        $button.trigger('dxclick');

        assert.strictEqual($button.attr('aria-label'), 'Press to stop voice transcription', 'listening aria-label is correct');
        assert.strictEqual($button.attr('aria-pressed'), 'true', 'listening aria-pressed is correct');

        $button.trigger('dxclick');

        assert.strictEqual($button.attr('aria-label'), 'Press to start voice transcription', 'switch to initial aria-label is correct');
        assert.strictEqual($button.attr('aria-pressed'), 'false', 'switch to initial aria-pressed is correct');
    });

    QUnit.test('should handle aria attributes with custom speech recognizer', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: false,
            }
        });

        const $button = this.getButton();

        assert.strictEqual($button.attr('aria-label'), 'Press to start voice transcription', 'initial aria-label is correct with custom engine');
        assert.strictEqual($button.attr('aria-pressed'), 'false', 'initial aria-pressed is correct with custom engine');

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
            isListening: true,
        });

        assert.strictEqual($button.attr('aria-label'), 'Press to stop voice transcription', 'aria-label updated with custom engine');
        assert.strictEqual($button.attr('aria-pressed'), 'true', 'aria-pressed updated with custom engine');
    });
});

QUnit.module('Custom Engine Integration', moduleConfig, () => {
    QUnit.test('should sync state with custom engine isListening prop', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: false,
            }
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'initial state is not listening');

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
            isListening: true,
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state synced to listening');
    });

    QUnit.test('should handle custom engine state during initialization', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: true,
            }
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening state set during init');
    });

    QUnit.test('should not auto-change state when custom engine is enabled', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: false,
            }
        });

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state not auto-changed with custom engine');
    });

    QUnit.test('should still trigger events with custom engine enabled', function(assert) {
        const onStartClickSpy = sinon.spy();

        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: false,
            },
            onStartClick: onStartClickSpy,
        });

        this.getButton().trigger('dxclick');

        assert.ok(onStartClickSpy.calledOnce, 'event still triggered with custom engine');
    });

    QUnit.test('should ignore custom engine when disabled', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: false,
                isListening: true,
            }
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'custom engine ignored when disabled');

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'normal behavior when custom engine disabled');
    });

    [undefined, null].forEach(customSpeechRecognizer => {
        QUnit.test(`should handle ${customSpeechRecognizer} customSpeechRecognizer option`, function(assert) {
            this.reinit({ customSpeechRecognizer });

            assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), `${customSpeechRecognizer} custom engine defaults to initial state`);

            const $button = this.getButton();
            $button.trigger('dxclick');

            assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), `normal behavior with ${customSpeechRecognizer} custom engine`);
        });
    });

    QUnit.test('should handle partial custom engine config updates', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: false,
            }
        });

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
            isListening: true,
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state updated');

        this.instance.option('customSpeechRecognizer', {
            enabled: false,
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state reset when custom engine disabled');

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'manual control restored');
    });

    QUnit.test('should handle custom engine with enabled is true and isListening is undefined', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
            }
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'undefined isListening defaults to false');
    });

    QUnit.test('should handle custom engine state transitions correctly', function(assert) {
        this.reinit({
            customSpeechRecognizer: {
                enabled: true,
                isListening: true,
            }
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'initially listening');

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
            isListening: false,
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'changed to initial');

        this.instance.option('customSpeechRecognizer', {
            enabled: false,
            isListening: true,
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'custom engine disabled');
    });

    QUnit.test('should handle invalid custom engine configurations gracefully', function(assert) {
        this.instance.option('customSpeechRecognizer', {});

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'empty config handled');

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
        });

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'missing isListening handled');

        this.instance.option('customSpeechRecognizer', {
            isListening: true,
        });

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'enabled not missed');
    });
});

QUnit.module('Options', moduleConfig, () => {
    QUnit.test('should support button styling options', function(assert) {
        this.reinit({
            stylingMode: 'contained',
            type: 'danger',
        });

        const $button = this.getButton();

        assert.ok($button.hasClass(BUTTON_MODE_CONTAINED_CLASS), 'styling mode applied');
        assert.ok($button.hasClass(BUTTON_TYPE_DANGER_CLASS), 'button type applied');
    });

    QUnit.test('should handle icon options change at runtime', function(assert) {
        const buttonInstance = this.getButtonInstance();

        this.instance.option('startIcon', 'home');
        assert.strictEqual(buttonInstance.option('icon'), 'home', 'start icon updated');

        this.getButton().trigger('dxclick');

        this.instance.option('stopIcon', 'gear');
        assert.strictEqual(buttonInstance.option('icon'), 'gear', 'stop icon updated');
    });

    QUnit.test('should handle text options change at runtime', function(assert) {
        const buttonInstance = this.getButtonInstance();

        this.instance.option('startText', 'Begin');
        assert.strictEqual(buttonInstance.option('text'), 'Begin', 'start text updated');

        this.getButton().trigger('dxclick');

        this.instance.option('stopText', 'End');
        assert.strictEqual(buttonInstance.option('text'), 'End', 'stop text updated');
    });

    QUnit.test('should handle width and height options', function(assert) {
        this.reinit({
            width: 200,
            height: 50,
        });

        const buttonInstance = this.getButtonInstance();

        assert.strictEqual(buttonInstance.option('width'), 200, 'width applied to button');
        assert.strictEqual(buttonInstance.option('height'), 50, 'height applied to button');
    });

    QUnit.test('should handle stylingMode changes at runtime', function(assert) {
        const $button = this.getButton();

        this.instance.option('stylingMode', 'text');
        assert.ok($button.hasClass(BUTTON_MODE_TEXT_CLASS), 'text styling mode applied');

        this.instance.option('stylingMode', 'outlined');
        assert.ok($button.hasClass(BUTTON_MODE_OUTLINED_CLASS), 'outlined styling mode applied');
    });

    QUnit.test('should handle button type changes at runtime', function(assert) {
        const $button = this.getButton();

        this.instance.option('type', 'danger');
        assert.ok($button.hasClass(BUTTON_TYPE_DANGER_CLASS), 'danger type is applied');

        this.instance.option('type', 'primary');
        assert.ok($button.hasClass(BUTTON_TYPE_PRIMARY_CLASS), 'primary type is applied');
    });

    [undefined, null].forEach(value => {
        QUnit.test(`should handle ${value} icon values`, function(assert) {
            this.reinit({
                startIcon: value,
                stopIcon: value,
            });

            const buttonInstance = this.getButtonInstance();

            assert.strictEqual(buttonInstance.option('icon'), value, `start icon is ${value}`);

            this.getButton().trigger('dxclick');

            assert.strictEqual(buttonInstance.option('icon'), value, `stop icon is ${value}`);
        });
    });

    QUnit.test('should apply hint option on init', function(assert) {
        this.reinit({
            hint: 'hint',
        });

        assert.strictEqual(this.$element.attr('title'), 'hint', 'title is added');
    });

    QUnit.test('should apply hint option at runtime', function(assert) {
        this.instance.option('hint', 'hint');

        assert.strictEqual(this.$element.attr('title'), 'hint', 'title is added');
    });
});

QUnit.module('Component Lifecycle', moduleConfig, () => {
    QUnit.test('should properly initialize actions with noop fallback', function(assert) {
        const expectedActions = ['onStartClick', 'onStopClick', 'onResult', 'onError', 'onEnd'];

        expectedActions.forEach(action => {
            assert.notStrictEqual(this.instance._actions[action], undefined, `${action} action initialized`);
            assert.strictEqual(typeof this.instance._actions[action], 'function', `${action} is a function`);
        });
    });

    QUnit.test('should handle action creation when option is undefined', function(assert) {
        assert.expect(2);

        try {
            this.reinit({
                onStartClick: undefined,
            });

            assert.strictEqual(typeof this.instance._actions.onStartClick, 'function', 'undefined action creates noop function');

            const $button = this.getButton();

            $button.trigger('dxclick');
        } catch(e) {
            assert.ok(false, `error ${e.message}`);
        } finally {
            assert.ok(true, 'no error');
        }
    });

    QUnit.test('should clean up state on _clean', function(assert) {
        this.getButton().trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'component in listening state');

        this.instance._clean();

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state reset to initial');
    });

    QUnit.test('should dispose actions on _dispose', function(assert) {
        const actionsBeforeDispose = Object.keys(this.instance._actions).length;
        assert.ok(actionsBeforeDispose > 0, 'actions exist before dispose');

        this.instance._dispose();

        assert.strictEqual(Object.keys(this.instance._actions).length, 0, 'actions cleared after dispose');
    });

    QUnit.test('reinit replaces event handler', function(assert) {
        const handleClickSpy1 = sinon.spy();
        const handleClickSpy2 = sinon.spy();

        this.reinit({ onStartClick: handleClickSpy1 });

        this.getButton().trigger('dxclick');

        assert.strictEqual(handleClickSpy1.callCount, 1, 'first init: handler called once');

        this.reinit({ onStartClick: handleClickSpy2 });

        this.getButton().trigger('dxclick');

        assert.strictEqual(handleClickSpy1.callCount, 1, 'old handler not called after reinit');
        assert.strictEqual(handleClickSpy2.callCount, 1, 'new handler called once after reinit');
    });
});

QUnit.module('Ink Ripple', moduleConfig, () => {
    QUnit.test('should create ink ripple effect on click when useInkRipple is enabled', function(assert) {
        const originalIsMaterial = themes.isMaterial;
        const clock = sinon.useFakeTimers();

        themes.isMaterial = () => true;

        try {
            this.reinit();
            const $button = this.getButton();

            $button.trigger('dxactive');

            const $inkRipple = $button.find(`.${INKRIPPLE_CLASS}`);
            assert.strictEqual($inkRipple.length, 1, 'ink ripple container is created');

            const $inkRippleWave = $inkRipple.find(`.${INKRIPPLE_WAVE_CLASS}`);
            assert.strictEqual($inkRippleWave.length, 1, 'ink ripple wave element is created because _attachFeedbackEvents is overridden');

            clock.tick();
        } finally {
            themes.isMaterial = originalIsMaterial;
            clock.restore();
        }
    });
});

QUnit.module('SpeechRecognitionAdapter integration', moduleConfig, () => {
    QUnit.test('should initialize SpeechRecognitionAdapter when available', function(assert) {
        this.reinit();

        const speechRecognitionAdapter = this.getAdapter();

        assert.ok(speechRecognitionAdapter, 'speech recognition adapter initialized');
    });

    QUnit.test('should pass initial speechRecognitionConfig to adapter', function(assert) {
        this.reinit({
            speechRecognitionConfig: { lang: 'en-US' }
        });

        const speechRecognition = this.getSpeechRecognition();

        assert.strictEqual(speechRecognition.lang, 'en-US', 'initial config passed to adapter');
    });

    QUnit.test('should pass actions as event handlers to adapter', function(assert) {
        const actionsSpies = {
            onResult: sinon.spy(),
            onError: sinon.spy(),
            onEnd: sinon.spy(),
        };

        this.reinit(actionsSpies);

        const speechRecognition = this.getSpeechRecognition();

        const actions = [
            { option: 'onResult', method: 'onresult', spy: actionsSpies.onResult, event: { type: 'result' } },
            { option: 'onError', method: 'onerror', spy: actionsSpies.onError, event: { type: 'error' } },
            { option: 'onEnd', method: 'onend', spy: actionsSpies.onEnd, event: { type: 'end' } },
        ];

        actions.forEach(({ option, method, spy, event }) => {
            speechRecognition[method](event);
            const args = spy.firstCall.args[0];

            assert.ok(spy.calledOnce, `${option} action passed to adapter`);

            assert.ok(args.component instanceof SpeechToText, `${option}: component is passed`);
            assert.strictEqual(args.element, this.instance.element(), `${option}: element is passed`);
            assert.strictEqual(args.event, event, `${option}: native event passed correctly`);
        });
    });

    QUnit.test('should call start on speechRecognitionAdapter when start button clicked', function(assert) {
        this.reinit();
        const speechRecognitionAdapter = this.getAdapter();
        const startSpy = sinon.spy(speechRecognitionAdapter, 'start');

        this.getButton().trigger('dxclick');

        assert.ok(startSpy.calledOnce, 'start called once on button click');
    });

    QUnit.test('should call stop on speechRecognitionAdapter when stop button clicked', function(assert) {
        this.reinit();
        const speechRecognitionAdapter = this.getAdapter();
        const stopSpy = sinon.spy(speechRecognitionAdapter, 'stop');


        this.getButton().trigger('dxclick');
        this.getButton().trigger('dxclick');

        assert.ok(stopSpy.calledOnce, 'stop called once on button click');
    });

    QUnit.test('should handle end event via adapter', function(assert) {
        this.reinit();

        const speechRecognition = this.getSpeechRecognition();
        const $button = this.getButton();

        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening state active');

        speechRecognition.onend();

        assert.notOk(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state reset after end event');
    });

    QUnit.test('should re-apply config when speechRecognitionConfig option changes', function(assert) {
        this.reinit();

        const adapter = this.getAdapter();
        const applyConfigSpy = sinon.spy(adapter, 'applyConfig');

        this.instance.option('speechRecognitionConfig', { lang: 'fr-FR' });

        assert.ok(applyConfigSpy.calledOnce, 'applyConfig called on option change');
        assert.strictEqual(this.getSpeechRecognition().lang, 'fr-FR', 'config updated in recognition instance');
    });

    QUnit.test('should apply nested option change for speechRecognitionConfig', function(assert) {
        this.reinit();

        const adapter = this.getAdapter();
        const applyConfigSpy = sinon.spy(adapter, 'applyConfig');

        this.instance.option('speechRecognitionConfig.lang', 'fr-FR');

        assert.ok(applyConfigSpy.calledOnce, 'applyConfig called on nested option change');
        assert.strictEqual(this.getSpeechRecognition().lang, 'fr-FR', 'config updated in recognition instance');
    });

    QUnit.test('should update onResult/onError/onEnd handlers at runtime', function(assert) {
        const initialActionsSpies = {
            onResult: sinon.spy(),
            onError: sinon.spy(),
            onEnd: sinon.spy(),
        };
        const updatedActionsSpies = {
            onResult: sinon.spy(),
            onError: sinon.spy(),
            onEnd: sinon.spy(),
        };

        this.reinit(initialActionsSpies);

        const speechRecognition = this.getSpeechRecognition();

        const actions = [
            { prop: 'onresult', option: 'onResult', initial: initialActionsSpies.onResult, updated: updatedActionsSpies.onResult, event: { type: 'result' } },
            { prop: 'onerror', option: 'onError', initial: initialActionsSpies.onError, updated: updatedActionsSpies.onError, event: { type: 'error' } },
            { prop: 'onend', option: 'onEnd', initial: initialActionsSpies.onEnd, updated: updatedActionsSpies.onEnd, event: { type: 'error' } },

        ];

        actions.forEach(({ prop, option, initial, updated, event }) => {
            this.instance.option(option, updated);

            speechRecognition[prop](event);

            assert.ok(updated.calledOnce, `${option} updated handler called`);
            assert.notOk(initial.called, `${option} initial handler not called`);
            assert.strictEqual(updated.firstCall.args[0].event, event, `${option} event passed correctly`);
        });
    });

    QUnit.test('should allow subscribing to result/error/end via .on()', function(assert) {
        assert.expect(9);

        this.reinit();

        const events = [
            { eventName: 'result', trigger: 'onresult' },
            { eventName: 'error', trigger: 'onerror' },
            { eventName: 'end', trigger: 'onend' },
        ];

        const speechRecognition = this.getSpeechRecognition();

        events.forEach(({ eventName, trigger }) => {
            this.instance.on(eventName, (e) => {
                assert.ok(e.component instanceof SpeechToText, `${eventName}: component is passed`);
                assert.strictEqual(e.element, this.instance.element(), `${eventName}: element is passed`);
                assert.strictEqual(e.event.type, eventName, `${eventName}: event type correct`);
            });

            speechRecognition[trigger]({ type: eventName });
        });
    });

    QUnit.test('should stop recognition when disabled set to true at runtime', function(assert) {
        this.reinit();
        const adapter = this.getAdapter();
        const stopSpy = sinon.spy(adapter, 'stop');

        this.getButton().trigger('dxclick');
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'component in listening state');

        this.instance.option('disabled', true);

        assert.ok(stopSpy.calledOnce, 'stop called when disabled');
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state reset after disabling');
    });

    QUnit.test('should dispose adapter and set it to null', function(assert) {
        this.reinit();

        const adapter = this.getAdapter();
        const disposeSpy = sinon.spy(adapter, 'dispose');

        this.instance._dispose();

        assert.ok(disposeSpy.calledOnce, 'adapter.dispose called');
        assert.strictEqual(this.getAdapter(), null, 'adapter set to null after dispose');
    });
});
