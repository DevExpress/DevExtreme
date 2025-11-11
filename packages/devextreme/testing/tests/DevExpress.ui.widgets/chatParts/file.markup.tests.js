import $ from 'jquery';
import File from '__internal/ui/chat/file_view/file';

const CHAT_FILE_CLASS = 'dx-chat-file';
const CHAT_FILE_ICON_CONTAINER_CLASS = 'dx-chat-file-icon-container';
const CHAT_FILE_NAME_CLASS = 'dx-chat-file-name';
const CHAT_FILE_SIZE_CLASS = 'dx-chat-file-size';
const CHAT_FILE_DOWNLOAD_BUTTON_CLASS = 'dx-chat-file-download-button';
const BUTTON_CLASS = 'dx-button';
const DX_ICON_CLASS = 'dx-icon';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            const defaultOptions = {
                data: {
                    name: 'test-file.txt',
                    size: 1024,
                },
                ...options,
            };

            this.instance = new File($('#component'), defaultOptions);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    }
};

QUnit.module('File', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.ok(this.$element.hasClass(CHAT_FILE_CLASS), 'root element has dx-chat-file class');
        });

        QUnit.test('icon container should be rendered', function(assert) {
            const $iconContainer = this.$element.find(`.${CHAT_FILE_ICON_CONTAINER_CLASS}`);

            assert.strictEqual($iconContainer.length, 1, 'icon container exists');
        });

        QUnit.test('icon should be rendered inside icon container', function(assert) {
            const $iconContainer = this.$element.find(`.${CHAT_FILE_ICON_CONTAINER_CLASS}`);
            const $icon = $iconContainer.find(`.${DX_ICON_CLASS}`);

            assert.strictEqual($icon.length, 1, 'icon exists');
        });

        QUnit.test('name element should be rendered', function(assert) {
            const $name = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);

            assert.strictEqual($name.length, 1, 'name element exists');
        });

        QUnit.test('size element should be rendered', function(assert) {
            const $size = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.strictEqual($size.length, 1, 'size element exists');
        });

        QUnit.test('download button should be rendered', function(assert) {
            this.reinit({ onDownload: () => {} });
            const $button = this.$element.find(`.${CHAT_FILE_DOWNLOAD_BUTTON_CLASS}`);

            assert.strictEqual($button.length, 1, 'download button exists');
            assert.strictEqual($button.hasClass(BUTTON_CLASS), true, 'download button has button class');
        });
    });

    QUnit.module('Content', () => {
        QUnit.test('name element should display correct text', function(assert) {
            const fileName = 'document.pdf';

            this.reinit({
                data: {
                    name: fileName,
                    size: 2048,
                },
            });

            const $name = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);

            assert.strictEqual($name.text(), fileName, 'name text is correct');
        });

        QUnit.test('size element should display correct text', function(assert) {
            this.reinit({
                data: {
                    name: 'image.png',
                    size: 5120,
                },
            });

            const $size = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.strictEqual($size.text(), '5 KB', 'size text is correct');
        });

        QUnit.test('name element should have title attribute', function(assert) {
            const fileName = 'very-long-file-name.txt';

            this.reinit({
                data: {
                    name: fileName,
                    size: 1024,
                },
            });

            const $name = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);

            assert.strictEqual($name.attr('title'), fileName, 'title attribute is set');
        });

        QUnit.test('size element should have title attribute', function(assert) {
            this.reinit({
                data: {
                    name: 'file.txt',
                    size: 9999,
                },
            });

            const $size = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.strictEqual($size.attr('title'), '10 KB', 'title attribute is set');
        });
    });

    QUnit.module('Re-render on data change', () => {
        QUnit.test('should re-render all content when data changes', function(assert) {
            const newData = {
                name: 'new-file.docx',
                size: 10240,
            };

            this.instance.option('data', newData);

            const $name = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);
            const $size = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.strictEqual($name.text(), newData.name, 'name is updated');
            assert.strictEqual($size.text(), '10 KB', 'size is updated');
        });
    });

    QUnit.module('onDownload option', () => {
        QUnit.test('download button should not be rendered if onDownload is undefined', function(assert) {
            const $button = this.$element.find(`.${CHAT_FILE_DOWNLOAD_BUTTON_CLASS}`);

            assert.strictEqual($button.length, 0, 'download button is not rendered');
        });

        QUnit.test('should re-render button on onDownload runtime changes', function(assert) {
            let $button = this.$element.find(`.${CHAT_FILE_DOWNLOAD_BUTTON_CLASS}`);

            assert.strictEqual($button.length, 0, 'download button is not rendered initially');

            this.instance.option('onDownload', () => {});

            $button = this.$element.find(`.${CHAT_FILE_DOWNLOAD_BUTTON_CLASS}`);

            assert.strictEqual($button.length, 1, 'download button is rendered');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('download button should have tabIndex=0 when focusStateEnabled is true', function(assert) {
            this.reinit({
                data: {
                    name: 'test.txt',
                    size: 1024,
                },
                onDownload: () => {},
            });

            const $downloadButton = this.$element.find(`.${CHAT_FILE_DOWNLOAD_BUTTON_CLASS}`);
            const tabIndex = $downloadButton.attr('tabIndex');

            assert.strictEqual(tabIndex, '0', 'download button has tabIndex=0');
        });
    });
});
