import $ from 'jquery';

import TypingIndicator from '__internal/ui/chat/typingindicator';
import Avatar from '__internal/ui/chat/avatar';

const CHAT_TYPINGINDICATOR_TEXT_CLASS = 'dx-chat-typingindicator-text';
const CHAT_TYPINGINDICATOR_BUBBLE_CLASS = 'dx-chat-typingindicator-bubble';
const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';

const AVATAR_CLASS = 'dx-avatar';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new TypingIndicator($('#component'), options);

            this.$element = $(this.instance.$element());

            this.getAvatarElement = () => this.$element.find(`.${AVATAR_CLASS}`);
            this.getTextElement = () => this.$element.find(`.${CHAT_TYPINGINDICATOR_TEXT_CLASS}`);
            this.getBubbleElement = () => this.$element.find(`.${CHAT_TYPINGINDICATOR_BUBBLE_CLASS}`);
            this.getCircleElement = () => this.$element.find(`.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS}`);

            this.$avatar = this.getAvatarElement();
            this.$text = this.getTextElement();
            this.$bubble = this.getBubbleElement();
            this.$circles = this.getCircleElement();

            this.avatar = Avatar.getInstance(this.$avatar);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('TypingIndicator', moduleConfig, () => {
    QUnit.module('Avatar integration', () => {
        QUnit.test('should have correct name option', function(assert) {
            this.reinit({ typingUsers: [{}] });

            assert.strictEqual(this.avatar.option('name'), '');
        });
    });

    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof TypingIndicator);
        });

        QUnit.test('Should not render content by default', function(assert) {
            assert.strictEqual(this.$element.children().length, 0, 'Content is not rendered when no users are present');
        });

        [null, undefined].forEach(value => {
            QUnit.test(`There is no error if typingUsers is ${value}`, function(assert) {
                try {
                    this.reinit({ typingUsers: value });

                    assert.ok(true, 'There is no error');
                } catch(e) {
                    assert.ok(false, `Error is raised: ${e.message}`);
                }
            });
        });
    });

    QUnit.module('Text', () => {
        QUnit.test('Should display text correctly for a single user', function(assert) {
            this.reinit({ typingUsers: [{ name: 'Alice' }] });

            assert.strictEqual(this.$text.text(), 'Alice is typing...');
        });

        QUnit.test('Should display text correctly for two users', function(assert) {
            this.reinit({ typingUsers: [{ name: 'Alice' }, { name: 'James' }] });

            assert.strictEqual(this.$text.text(), 'Alice and James are typing...');
        });

        QUnit.test('Should display text correctly for three users', function(assert) {
            this.reinit({ typingUsers: [{ name: 'Alice' }, { name: 'James' }, { name: 'Karl' }] });

            assert.strictEqual(this.$text.text(), 'Alice, James and Karl are typing...');
        });

        QUnit.test('Should display text correctly for more than three users', function(assert) {
            this.reinit({ typingUsers: [{ name: 'Alice' }, { name: 'James' }, { name: 'Karl' }, { name: 'Mark' }] });

            assert.strictEqual(this.$text.text(), 'Alice, James, Karl and other are typing...');
        });

        [undefined, '', ' '].forEach(name => {
            QUnit.test(`Should correctly handle users an empty name, if name is '${name}'`, function(assert) {
                this.reinit({ typingUsers: [{}] });

                assert.strictEqual(this.$text.text(), 'Unknown User is typing...');
            });
        });
    });

    QUnit.module('typingUsers runtime changing', () => {
        [null, undefined].forEach(value => {
            QUnit.test(`Should render content if value is changed in runtime and initial value is ${value}`, function(assert) {
                this.reinit({ typingUsers: [] });

                this.instance.option({ typingUsers: [{ name: 'Alice' }] });

                assert.strictEqual(this.getAvatarElement().length, 1, 'Avatar is rendered');
                assert.strictEqual(this.getTextElement().length, 1, 'Text is rendered');
                assert.strictEqual(this.getBubbleElement().length, 1, 'Bubble is rendered');
                assert.strictEqual(this.getCircleElement().length, 3, 'Circles are rendered');
            });

            QUnit.test(`Should remove content if typingUsers gets ${value} value in runtime, initial value is not empty`, function(assert) {
                this.reinit({ typingUsers: [{ name: 'Alice' }] });

                this.instance.option({ typingUsers: value });

                assert.strictEqual(this.$element.children().length, 0, 'Content is not rendered when no users are present');
            });
        });

        QUnit.test('Should update text correctly in runtime', function(assert) {
            this.reinit({ typingUsers: [{ name: 'Alice' }] });

            this.instance.option({ typingUsers: [{ name: 'James' }] });

            assert.strictEqual(this.getTextElement().text(), 'James is typing...', 'Text updated correctly');
        });
    });
});
