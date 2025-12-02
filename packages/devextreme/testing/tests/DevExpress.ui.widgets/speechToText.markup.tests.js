import $ from 'jquery';
import 'ui/speech_to_text';

import { BUTTON_CLASS } from '__internal/ui/button/button';
import {
    SPEECH_TO_TEXT_CLASS,
    SPEECH_TO_TEXT_LISTENING_CLASS,
} from '__internal/ui/speech_to_text/speech_to_text';

const BUTTON_TEXT_CLASS = 'dx-button-text';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const ICON_CLASS = 'dx-icon';

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
    }
};

QUnit.module('Component Markup', moduleConfig, () => {
    QUnit.test('should render with proper CSS classes', function(assert) {
        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_CLASS), 'main class applied');
    });

    QUnit.test('should render button element on component element', function(assert) {
        assert.ok(this.$element.hasClass(BUTTON_CLASS), 'button element is rendered on component level');
    });

    QUnit.test('should apply state-specific CSS classes', function(assert) {
        assert.ok(!this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'no listening class initially');

        this.$element.trigger('dxclick');

        assert.ok(this.$element.hasClass(SPEECH_TO_TEXT_LISTENING_CLASS), 'listening class applied');
    });

    QUnit.test('should apply disabled state CSS', function(assert) {
        this.reinit({ disabled: true });

        assert.ok(this.$element.hasClass(DISABLED_STATE_CLASS), 'disabled state class applied');
    });
});

QUnit.module('Button Rendering', moduleConfig, () => {
    QUnit.test('should update button content based on state', function(assert) {
        this.reinit({
            startText: 'Start',
            stopText: 'Stop',
        });

        const $buttonText = this.$element.find(`.${BUTTON_TEXT_CLASS}`);

        assert.strictEqual($buttonText.text(), 'Start', 'initial text displayed');

        this.$element.trigger('dxclick');

        assert.strictEqual($buttonText.text(), 'Stop', 'text updated on state change');
    });

    QUnit.test('should update button icon and text based on state', function(assert) {
        const getIcon = () => this.$element.find(`.${ICON_CLASS}`);

        assert.ok(getIcon().hasClass(`${ICON_CLASS}-micoutline`), 'initial icon displayed');

        this.$element.trigger('dxclick');

        assert.ok(getIcon().hasClass(`${ICON_CLASS}-stopfilled`), 'icon updated after click');
    });
});
