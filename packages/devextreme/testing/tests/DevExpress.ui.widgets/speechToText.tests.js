import $ from 'jquery';
import SpeechToText from 'ui/speech_to_text';
import Button from 'ui/button';

import 'generic_light.css!';

import {
    SPEECH_TO_TEXT_CLASS,
    SPEECH_TO_TEXT_LISTENING_CLASS,
} from '__internal/ui/speech_to_text/speech_to_text';

const ICON_CLASS = 'dx-icon';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const BUTTON_MODE_CONTAINED_CLASS = 'dx-button-mode-contained';
const BUTTON_DANGER_CLASS = 'dx-button-danger';
const BUTTON_MODE_TEXT_CLASS = 'dx-button-mode-text';
const BUTTON_MODE_OUTLINED_CLASS = 'dx-button-mode-outlined';

QUnit.testStart(() => {
    const markup = '<div id="speechToText"></div>';
    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}, selector = '#speechToText') => {
            this.$element = $(selector).dxSpeechToText(options);
            this.instance = this.$element.dxSpeechToText('instance');
        };

        init();

        this.reinit = (options, selector) => {
            this.instance.dispose();
            init(options, selector);
        };

        this.getButton = () => this.$element;

        this.getButtonInstance = () => {
            return Button.getInstance(this.getButton());
        };
    }
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

    QUnit.test('component should have default options', function(assert) {
        const expectedDefaults = {
            stylingMode: 'contained',
            type: 'default',
            startIcon: 'micoutline',
            stopIcon: 'stopfilled',
            startText: '',
            stopText: '',
        };

        Object.entries(expectedDefaults).forEach(([key, value]) => {
            assert.strictEqual(this.instance.option(key), value, `${key} has correct default value`);
        });
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

    QUnit.test('disabled state should prevent state changes', function(assert) {
        this.reinit({ disabled: true });

        const $button = this.getButton();
        $button.trigger('dxclick');

        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'state did not change when disabled');
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
                assert.strictEqual(e.element, this.$element.get(0), 'element is provided correctly');
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
                assert.strictEqual(e.element, this.$element.get(0), 'element is provided correctly');
                assert.ok(e.event, 'original event is provided');
                assert.strictEqual(typeof e.event, 'object', 'event is an object');
            },
        });

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

        const $button = this.getButton();

        $button.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'manual control restored');
    });

    QUnit.test('should handle invalid custom engine configurations', function(assert) {
        this.instance.option('customSpeechRecognizer', null);
        assert.ok(true, 'handled null custom engine config');

        this.instance.option('customSpeechRecognizer', {});
        assert.ok(true, 'handled empty custom engine config');

        this.instance.option('customSpeechRecognizer', {
            enabled: true,
        });
        assert.ok(true, 'handled incomplete custom engine config');
    });
});

QUnit.module('Options', moduleConfig, () => {
    QUnit.test('should update button icon and text based on state', function(assert) {
        this.reinit({
            startText: 'Start Recording',
            stopText: 'Stop Recording',
            startIcon: 'user',
            stopIcon: 'check',
        });

        const $button = this.getButton();
        const $buttonText = $button.find(`.${BUTTON_TEXT_CLASS}`);

        let $icon = $button.find(`.${ICON_CLASS}`);

        assert.strictEqual($buttonText.text(), 'Start Recording', 'initial text displayed');
        assert.ok($icon.hasClass(`${ICON_CLASS}-user`), 'initial icon displayed');

        $button.trigger('dxclick');

        assert.strictEqual($buttonText.text(), 'Stop Recording', 'text updated after click');

        $icon = $button.find(`.${ICON_CLASS}`);

        assert.ok($icon.hasClass(`${ICON_CLASS}-check`), 'icon updated after click');
    });

    QUnit.test('should support button styling options', function(assert) {
        this.reinit({
            stylingMode: 'contained',
            type: 'danger',
        });

        const $button = this.getButton();

        assert.ok($button.hasClass(BUTTON_MODE_CONTAINED_CLASS), 'styling mode applied');
        assert.ok($button.hasClass(BUTTON_DANGER_CLASS), 'button type applied');
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

    QUnit.test('should provide undefined to button when icons are undefined', function(assert) {
        this.reinit({
            startIcon: undefined,
            stopIcon: undefined,
        });

        const buttonInstance = this.getButtonInstance();

        assert.strictEqual(buttonInstance.option('icon'), undefined, 'start icon is undefined');

        this.getButton().trigger('dxclick');

        assert.strictEqual(buttonInstance.option('icon'), undefined, 'stop icon is undefined');
    });
});

QUnit.module('Component Lifecycle', moduleConfig, () => {
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

    QUnit.test('should handle multiple reinitializations', function(assert) {
        const onStartClickSpy = sinon.spy();

        this.reinit({ onStartClick: onStartClickSpy });
        this.getButton().trigger('dxclick');

        assert.ok(onStartClickSpy.calledOnce, 'event works after first init');

        this.reinit({ onStartClick: onStartClickSpy });
        this.getButton().trigger('dxclick');

        assert.ok(onStartClickSpy.calledTwice, 'event works after reinit');
    });
});
