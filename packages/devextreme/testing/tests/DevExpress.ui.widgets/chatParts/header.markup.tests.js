import $ from 'jquery';

import ChatHeader from '__internal/ui/chat/header';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ChatHeader($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ChatHeader', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_HEADER_CLASS), true);
        });

        QUnit.test('text element should have correct class', function(assert) {
            assert.strictEqual(this.$element.children().first().hasClass(CHAT_HEADER_TEXT_CLASS), true);
        });
    });
});
