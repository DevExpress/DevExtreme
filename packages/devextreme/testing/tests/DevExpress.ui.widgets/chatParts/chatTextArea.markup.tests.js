import $ from 'jquery';
import ChatTextArea, {
    CHAT_TEXTAREA_CLASS,
    CHAT_TEXT_AREA_TOOLBAR,
} from '__internal/ui/chat/message_box/chat_text_area';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import { TOOLBAR_CLASS } from '__internal/ui/toolbar/constants';
import { TOOLBAR_BEFORE_CLASS, TOOLBAR_AFTER_CLASS } from '__internal/ui/toolbar/toolbar.base';

const moduleConfig = {
    beforeEach: function() {
        this.init = (options = {}) => {
            this.instance = new ChatTextArea($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();
            this.init(options);
        };

        this.getToolbar = () => this.$element.find(`.${TOOLBAR_CLASS}`);
        this.getBeforeContainer = () => this.getToolbar().find(`.${TOOLBAR_BEFORE_CLASS}`);
        this.getAfterContainer = () => this.getToolbar().find(`.${TOOLBAR_AFTER_CLASS}`);
        this.getSendButton = () => this.getAfterContainer().find(`.${BUTTON_CLASS}`);
        this.getAttachButton = () => this.getBeforeContainer().find(`.${BUTTON_CLASS}`);

        this.init();
    }
};

QUnit.module('ChatTextArea', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test(`textarea field should have ${CHAT_TEXTAREA_CLASS} class`, function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_TEXTAREA_CLASS), true);
        });

        QUnit.test('toolbar should be rendered', function(assert) {
            const $toolbar = this.$element.find(`.${TOOLBAR_CLASS}`);

            assert.strictEqual($toolbar.length, 1, 'toolbar element exists');
            assert.strictEqual($toolbar.hasClass(CHAT_TEXT_AREA_TOOLBAR), true, 'toolbar has correct class');
        });
    });

    QUnit.module('Toolbar buttons', () => {
        QUnit.test('send button should be rendered in after container by default', function(assert) {
            const $sendButton = this.getSendButton();

            assert.strictEqual($sendButton.length, 1, 'send button exists in after container');
        });

        QUnit.test('file uploader button should not be rendered by default', function(assert) {
            const $buttons = this.getBeforeContainer().find(`.${BUTTON_CLASS}`);

            assert.strictEqual($buttons.length, 0, 'no buttons in before container');
        });

        QUnit.test('file uploader button should be rendered in before container when fileUploaderOptions is set', function(assert) {
            this.reinit({ fileUploaderOptions: {} });

            const $fileButton = this.getAttachButton();

            assert.strictEqual($fileButton.length, 1, 'file uploader button exists in before container');
        });

        QUnit.test('both buttons should be rendered when fileUploaderOptions is set', function(assert) {
            this.reinit({ fileUploaderOptions: {} });

            assert.strictEqual(this.getBeforeContainer().find(`.${BUTTON_CLASS}`).length, 1, 'one button in before container');
            assert.strictEqual(this.getAfterContainer().find(`.${BUTTON_CLASS}`).length, 1, 'one button in after container');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('send button should have correct aria-label', function(assert) {
            const $sendButton = this.getSendButton();

            assert.strictEqual($sendButton.attr('aria-label'), 'Send', 'send button has correct aria-label');
        });
    });

    QUnit.module('DOM structure', () => {
        QUnit.test('component should have correct DOM hierarchy', function(assert) {
            const $toolbar = this.getToolbar();

            assert.ok($toolbar.length > 0, 'toolbar is present');
            assert.ok($toolbar.parent().is(this.$element), 'toolbar is direct child of root element');
        });

        QUnit.test('toolbar should be appended after textarea elements', function(assert) {
            const $toolbar = this.getToolbar();
            const $children = this.$element.children();
            const toolbarIndex = $children.index($toolbar);

            assert.strictEqual(toolbarIndex, $children.length - 1, 'toolbar is the last child element');
        });
    });
});
