import $ from 'jquery';

import MessageBubble from '__internal/ui/chat/messagebubble';

const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBubble($('#component'), options);
            this.$element = $(this.instance.$element());
            this.$content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBubble', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageBubble);
        });

        QUnit.test('should be rendered with passed text value', function(assert) {
            this.reinit({ text: 'message text' });

            assert.strictEqual(this.$element.text(), 'message text');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('text option should be updatable at runtime', function(assert) {
            this.instance.option('text', 'new message text');

            assert.strictEqual(this.$element.text(), 'new message text');
        });

        QUnit.test('template render function should be called if it has been passed', function(assert) {
            const templateSpy = sinon.spy();
            const messageText = 'message text';

            this.reinit({
                text: messageText,
                template: templateSpy,
            });

            assert.strictEqual(templateSpy.callCount, 1, 'template was rendered once');
            assert.strictEqual(templateSpy.args[0][0], messageText, 'text argument is correct');
            assert.strictEqual($(templateSpy.args[0][1]).get(0), this.$content.get(0), 'container element is correct');
        });

        QUnit.test('default markup should be restored after reseting the template option at runtime', function(assert) {
            const templateSpy = sinon.spy();
            const messageText = 'message text';

            this.reinit({
                text: messageText,
                template: templateSpy,
            });

            this.instance.option('template', null);

            assert.strictEqual(this.$element.text(), messageText, 'text is correct');
        });

        QUnit.test('template option should set message bubble content at runtime', function(assert) {
            const template = (data, container) => {
                $('<h1>').text(`template text: ${data}`).appendTo(container);
            };

            this.reinit({
                text: 'text'
            });

            assert.strictEqual(this.$element.text(), 'text', 'text is correct');

            this.instance.option('template', template);

            const $bubbleContentChild = $(this.$content.children());

            assert.strictEqual($bubbleContentChild.prop('tagName'), 'H1', 'content tag is correct');
            assert.strictEqual($bubbleContentChild.text(), 'template text: text', 'content text is correct');
        });
    });
});


