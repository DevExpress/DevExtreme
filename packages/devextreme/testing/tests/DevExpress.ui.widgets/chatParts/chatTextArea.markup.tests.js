import $ from 'jquery';
import ChatTextArea, {
    TEXT_AREA_TOOLBAR,
} from '__internal/ui/chat/message_box/chat_text_area';

const BUTTON_CLASS = 'dx-button';
const TOOLBAR_CLASS = 'dx-toolbar';
const TOOLBAR_BEFORE_CONTAINER_CLASS = 'dx-toolbar-before';
const TOOLBAR_AFTER_CONTAINER_CLASS = 'dx-toolbar-after';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ChatTextArea($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    }
};

QUnit.module('ChatTextArea', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('toolbar should be rendered', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);

            assert.strictEqual($toolbar.length, 1, 'toolbar element exists');
            assert.strictEqual($toolbar.hasClass(TOOLBAR_CLASS), true, 'toolbar has correct class');
        });
    });

    QUnit.module('Toolbar buttons', () => {
        QUnit.test('send button should be rendered by default', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $afterContainer = $toolbar.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`);
            const $sendButton = $afterContainer.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($sendButton.length, 1, 'send button exists');
        });

        QUnit.test('file uploader button should not be rendered by default', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $beforeContainer = $toolbar.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`);
            const $buttons = $beforeContainer.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($buttons.length, 0, 'no buttons in before container');
        });

        QUnit.test('file uploader button should be rendered when fileUploaderOptions is set', function(assert) {
            this.reinit({
                fileUploaderOptions: {}
            });

            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $beforeContainer = $toolbar.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`);
            const $fileButton = $beforeContainer.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($fileButton.length, 1, 'file uploader button exists');
        });

        QUnit.test('buttons should be in correct containers', function(assert) {
            this.reinit({
                fileUploaderOptions: {}
            });

            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $beforeContainer = $toolbar.find(`.${TOOLBAR_BEFORE_CONTAINER_CLASS}`);
            const $afterContainer = $toolbar.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS}`);

            assert.strictEqual($beforeContainer.find(`.${BUTTON_CLASS}`).length, 1, 'one button in before container');
            assert.strictEqual($afterContainer.find(`.${BUTTON_CLASS}`).length, 1, 'one button in after container');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('send button should have correct aria-label', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $sendButton = $toolbar.find(`.${TOOLBAR_AFTER_CONTAINER_CLASS} .${BUTTON_CLASS}`);

            assert.strictEqual($sendButton.attr('aria-label'), 'Send', 'send button has correct aria-label');
        });
    });

    QUnit.module('DOM structure', () => {
        QUnit.test('component should have correct DOM hierarchy', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);

            assert.ok($toolbar.length > 0, 'toolbar is present');
            assert.ok($toolbar.parent().is(this.$element), 'toolbar is direct child of root element');
        });

        QUnit.test('toolbar should be appended after textarea elements', function(assert) {
            const $toolbar = this.$element.find(`.${TEXT_AREA_TOOLBAR}`);
            const $children = this.$element.children();
            const toolbarIndex = $children.index($toolbar);

            assert.strictEqual(toolbarIndex, $children.length - 1, 'toolbar is the last child element');
        });
    });
});
