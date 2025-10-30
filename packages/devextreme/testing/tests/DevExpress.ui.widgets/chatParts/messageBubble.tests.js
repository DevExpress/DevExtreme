import $ from 'jquery';
import messageLocalization from 'common/core/localization/message';

import MessageBubble, {
    MESSAGE_DATA_KEY,
    CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
    CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS
} from '__internal/ui/chat/messagebubble';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import { CHAT_FILE_VIEW_CLASS } from '__internal/ui/chat/file_view/file_view';
import { CHAT_FILE_CLASS, CHAT_FILE_NAME_CLASS, CHAT_FILE_SIZE_CLASS } from '__internal/ui/chat/file_view/file';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBubble($('#component'), options);
            this.$element = $(this.instance.$element());
            this.$content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
            this.$getAttachments = () => this.$element.find(`.${CHAT_FILE_VIEW_CLASS}`);
            this.getDownloadButton = () => this.$element.find(`.${BUTTON_CLASS}`);
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

        QUnit.test('bubble should be rendered with default text if isDeleted is true', function(assert) {
            this.reinit({ isDeleted: true });

            assert.strictEqual(this.$element.text(), messageLocalization.format('dxChat-deletedMessageText'));
        });

        QUnit.test('should render an image with correct attributes', function(assert) {
            const imageSrc = 'test image src';
            const imageAlt = 'Image alt';
            this.reinit({ src: imageSrc, type: 'image', alt: imageAlt });

            const $img = this.$element.find('img');

            assert.strictEqual($img.length, 1, 'One <img> element is rendered');
            assert.strictEqual($img.attr('src'), imageSrc, 'Image has correct src');
            assert.strictEqual($img.attr('alt'), imageAlt, 'Image has correct default alt');
        });

        QUnit.test('should render an image with default alt', function(assert) {
            this.reinit({ src: '', type: 'image' });

            const $img = this.$element.find('img');

            assert.strictEqual($img.attr('alt'), 'Image shared in chat', 'Image has correct default alt');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('text option should be updatable at runtime', function(assert) {
            this.instance.option('text', 'new message text');

            assert.strictEqual(this.$element.text(), 'new message text');
        });

        QUnit.test('bubble should be render with default text if isDeleted is true', function(assert) {
            this.reinit({ isDeleted: true });

            assert.strictEqual(this.$element.text(), messageLocalization.format('dxChat-deletedMessageText'));
        });

        QUnit.test('isDeleted option should change the message text after change at runtime', function(assert) {
            this.instance.option('isDeleted', true);

            assert.strictEqual(this.$element.text(), messageLocalization.format('dxChat-deletedMessageText'));
        });

        [
            { name: 'text', newValue: { text: 'updated message text' } },
            { name: 'isDeleted', newValue: true },
            { name: 'isEdited', newValue: true },
        ].forEach(({ name, newValue }) => {
            QUnit.test(`message data should be updated after changing ${name} option at runtime`, function(assert) {
                this.reinit({});

                this.instance.option(name, newValue);

                assert.strictEqual(this.instance.$element().data(MESSAGE_DATA_KEY)[name], newValue, 'message data is updated');
            });
        });

        QUnit.test('template render function should be called if it has been passed', function(assert) {
            const templateSpy = sinon.spy();
            const message = { text: 'message text', type: 'text', src: undefined, alt: undefined };

            this.reinit({
                ...message,
                template: templateSpy,
            });

            assert.strictEqual(templateSpy.callCount, 1, 'template was rendered once');
            assert.deepEqual(templateSpy.args[0][0], message, 'message argument is correct');
            assert.strictEqual($(templateSpy.args[0][1]).get(0), this.$content.get(0), 'container element is correct');
        });

        QUnit.test('template should be called after change text option at runtime', function(assert) {
            const templateSpy = sinon.spy();
            const messageText = 'message text';

            this.reinit({
                text: messageText,
                template: templateSpy,
            });

            assert.strictEqual(templateSpy.callCount, 1, 'template was rendered once');

            this.instance.option('text', 'new message text');
            assert.strictEqual(templateSpy.callCount, 2, 'template was rendered');
        });

        QUnit.test('default markup should be restored after reseting the template option at runtime', function(assert) {
            const templateSpy = sinon.spy();
            const messageText = 'message text';

            this.reinit({
                text: messageText,
                type: 'text',
                template: templateSpy,
            });

            this.instance.option('template', null);

            assert.strictEqual(this.$element.text(), messageText, 'text is correct');
        });

        QUnit.test('template option should set message bubble content at runtime', function(assert) {
            const template = (data, container) => {
                $('<h1>').text(`template text: ${data.text}`).appendTo(container);
            };

            this.reinit({
                text: 'text',
            });

            assert.strictEqual(this.$element.text(), 'text', 'text is correct');

            this.instance.option('template', template);

            const $bubbleContentChild = $(this.$content.children());

            assert.strictEqual($bubbleContentChild.prop('tagName'), 'H1', 'content tag is correct');
            assert.strictEqual($bubbleContentChild.text(), 'template text: text', 'content text is correct');
        });

        QUnit.test('should remove image class when message type changes from image to text', function(assert) {
            const imageSrc = 'test.png';

            this.reinit({ type: 'image', src: imageSrc });

            assert.ok(
                this.$element.hasClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS),
                'initially has image class'
            );

            this.instance.option({ type: 'text' });

            assert.notOk(
                this.$element.hasClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS),
                'image class is removed after changing type to text'
            );
        });

        QUnit.test('should render FileView when attachments passed', function(assert) {
            this.reinit({ attachments: [{ name: 'text.txt', size: 1024 }] });

            const $fileView = this.$getAttachments();
            const $file = $fileView.find(`.${CHAT_FILE_CLASS}`);
            const $fileName = $file.find(`.${CHAT_FILE_NAME_CLASS}`);
            const $fileSize = $file.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.ok($fileView.length, 'FileView is rendered inside attachments container');
            assert.strictEqual($fileName.text(), 'text.txt', 'name rendered correctly');
            assert.strictEqual($fileSize.text(), '1 KB', 'size rendered correctly');
        });

        QUnit.test('should not render attachments container when no attachments passed', function(assert) {
            this.reinit({ attachments: [] });

            assert.strictEqual(this.$getAttachments().length, 0, 'attachments container is empty');
        });

        QUnit.test('should not render FileView when no attachments passed', function(assert) {
            this.reinit({ attachments: [] });

            assert.strictEqual(this.$getAttachments().children().length, 0, 'attachments container is empty');
        });

        QUnit.test('should not render FileView when isDeleted is true', function(assert) {
            this.reinit({
                isDeleted: true,
                attachments: [{ name: 'text.txt', size: 1024 }],
            });

            assert.strictEqual(this.$getAttachments().children().length, 0, 'no attachments rendered for deleted message');
        });

        QUnit.test('should render attachments in runtime', function(assert) {
            const attachments = [{ name: 'text.txt', size: 1024 }];
            let $fileView = this.$getAttachments();

            assert.strictEqual($fileView.length, 0, 'FileView is empty initially');

            this.instance.option({ attachments });

            $fileView = this.$getAttachments();

            assert.strictEqual($fileView.length, 1, 'FileView is rendered inside attachments container');
        });

        QUnit.test('should pass onAttachmentDownload to FileView', function(assert) {
            const onAttachmentDownload = sinon.spy();

            this.reinit({
                attachments: [{ name: 'text.txt', size: 1024 }],
                onAttachmentDownload,
                showAttachmentDownloadButton: true,
            });

            this.getDownloadButton().trigger('dxclick');

            assert.strictEqual(onAttachmentDownload.callCount, 1);
        });

        QUnit.test('should set onAttachmentDownload to FileView in runtime', function(assert) {
            const onAttachmentDownload = sinon.spy();

            this.reinit({
                attachments: [{ name: 'text.txt', size: 1024 }],
                showAttachmentDownloadButton: true,
            });

            this.instance.option({ onAttachmentDownload });
            this.getDownloadButton().trigger('dxclick');

            assert.strictEqual(onAttachmentDownload.callCount, 1);
        });
    });
});


