import $ from 'jquery';

import TypingIndicator from '__internal/ui/chat/typingindicator';

const CHAT_TYPINGINDICATOR_CLASS = 'dx-chat-typingindicator';
const CHAT_TYPINGINDICATOR_TEXT_CLASS = 'dx-chat-typingindicator-text';
const CHAT_TYPINGINDICATOR_BUBBLE_CLASS = 'dx-chat-typingindicator-bubble';
const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';

const AVATAR_CLASS = 'dx-avatar';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new TypingIndicator($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({ typingUsers: ['User'] });
    }
};

QUnit.module('TypingIndicator', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_TYPINGINDICATOR_CLASS), true);
        });
    });

    QUnit.module('Render', () => {
        QUnit.test('root element should contain avatar element', function(assert) {
            const $avatar = this.$element.find(`.${AVATAR_CLASS}`);

            assert.strictEqual($avatar.length, 1);
        });

        QUnit.test('root element should contain text element', function(assert) {
            const $text = this.$element.find(`.${CHAT_TYPINGINDICATOR_TEXT_CLASS}`);

            assert.strictEqual($text.length, 1);
        });

        QUnit.test('root element should contain bubble element', function(assert) {
            const $bubble = this.$element.find(`.${CHAT_TYPINGINDICATOR_BUBBLE_CLASS}`);

            assert.strictEqual($bubble.length, 1);
        });

        QUnit.test('bubble element should contain 3 circle elements', function(assert) {
            const $circles = this.$element
                .find(`.${CHAT_TYPINGINDICATOR_BUBBLE_CLASS}`)
                .find(`.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS}`);

            assert.strictEqual($circles.length, 3);
        });
    });
});
