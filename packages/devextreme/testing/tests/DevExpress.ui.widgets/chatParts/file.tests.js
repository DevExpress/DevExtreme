import $ from 'jquery';

import File from '__internal/ui/chat/file_view/file';
import Button from 'ui/button';
import { BUTTON_CLASS } from '__internal/ui/button/button';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

const CHAT_FILE_NAME_CLASS = 'dx-chat-file-name';
const CHAT_FILE_SIZE_CLASS = 'dx-chat-file-size';

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

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
            this.$downloadButton = $($buttons[0]);
            this.downloadButton = Button.getInstance(this.$downloadButton);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    }
};

QUnit.module('File', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof File);
        });

        QUnit.test('download button should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                icon: 'download',
                stylingMode: 'text',
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(this.downloadButton.option(key), value, `${key} value is correct`);
            });
        });

        QUnit.test('should have correct default options', function(assert) {
            this.reinit({ data: {} });

            const expectedData = {
                name: '',
                size: 0,
            };

            const actualData = this.instance.option('data');

            assert.deepEqual(actualData, expectedData, 'default data is correct');
            assert.strictEqual(this.instance.option('onDownload'), undefined, 'onDownload is undefined by default');
        });
    });

    QUnit.module('Data option', () => {
        QUnit.test('should display file name correctly', function(assert) {
            const fileName = 'document.pdf';

            this.reinit({
                data: {
                    name: fileName,
                    size: 2048,
                },
            });

            const $nameElement = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);

            assert.strictEqual($nameElement.text(), fileName, 'file name is displayed');
            assert.strictEqual($nameElement.attr('title'), fileName, 'file name is in title attribute');
        });

        QUnit.test('should display file size correctly', function(assert) {
            const fileSize = 5120;

            this.reinit({
                data: {
                    name: 'image.png',
                    size: fileSize,
                },
            });

            const $sizeElement = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);
            const expectedText = `${fileSize} B`;

            assert.strictEqual($sizeElement.text(), expectedText, 'file size is displayed');
            assert.strictEqual($sizeElement.attr('title'), expectedText, 'file size is in title attribute');
        });

        QUnit.test('should re-render when data option changes', function(assert) {
            const newData = {
                name: 'new-file.docx',
                size: 10240,
            };

            this.instance.option('data', newData);

            const $nameElement = this.$element.find(`.${CHAT_FILE_NAME_CLASS}`);
            const $sizeElement = this.$element.find(`.${CHAT_FILE_SIZE_CLASS}`);

            assert.strictEqual($nameElement.text(), newData.name, 'new file name is displayed');
            assert.strictEqual($sizeElement.text(), `${newData.size} B`, 'new file size is displayed');
        });
    });

    QUnit.module('onDownload event', () => {
        QUnit.test('should be fired when download button is clicked', function(assert) {
            const onDownloadStub = sinon.stub();
            const testData = {
                name: 'test.txt',
                size: 1024,
            };

            this.reinit({
                data: testData,
                onDownload: onDownloadStub,
            });

            this.$downloadButton.trigger('dxclick');

            assert.strictEqual(onDownloadStub.callCount, 1, 'onDownload was called once');
        });

        QUnit.test('should be fired with correct arguments', function(assert) {
            assert.expect(5);

            const testData = {
                name: 'test.txt',
                size: 1024,
            };

            this.reinit({
                data: testData,
                onDownload: (e) => {
                    const {
                        attachment,
                        component,
                        element,
                        event,
                    } = e;

                    assert.deepEqual(attachment, testData, 'attachment data is correct');
                    assert.strictEqual(component, this.instance, 'component is correct');
                    assert.strictEqual(isRenderer(element), !!config().useJQuery, 'element is renderer');
                    assert.strictEqual($(element).is(this.$element), true, 'element is correct');
                    assert.strictEqual(event.type, 'dxclick', 'event.type is correct');
                },
            });

            this.$downloadButton.trigger('dxclick');
        });

        QUnit.test('should be possible to update it at runtime', function(assert) {
            const onDownloadStub = sinon.stub();

            this.instance.option('onDownload', onDownloadStub);

            this.$downloadButton.trigger('dxclick');

            assert.strictEqual(onDownloadStub.callCount, 1, 'updated onDownload was called');
        });

        QUnit.test('should not throw error when onDownload is not defined', function(assert) {
            this.reinit({
                data: {
                    name: 'test.txt',
                    size: 1024,
                },
            });

            try {
                this.$downloadButton.trigger('dxclick');
                assert.ok(true, 'no error thrown');
            } catch(e) {
                assert.ok(false, 'error was thrown');
            }
        });
    });

    QUnit.module('Proxy state options', () => {
        [true, false].forEach(value => {
            QUnit.test(`passed state options should be equal to download button state options when value is ${value}`, function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit({
                    data: {
                        name: 'test.txt',
                        size: 1024,
                    },
                    ...options,
                });

                Object.entries(options).forEach(([key, value]) => {
                    assert.strictEqual(this.downloadButton.option(key), value, `button ${key} value is correct`);
                });
            });

            QUnit.test(`passed state options should be updated when state options are changed at runtime with value ${value}`, function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option(options);

                Object.entries(options).forEach(([key, value]) => {
                    assert.strictEqual(this.downloadButton.option(key), value, `button ${key} value is correct`);
                });
            });
        });

        QUnit.test('should have correct default state options', function(assert) {
            this.reinit({
                data: {
                    name: 'test.txt',
                    size: 1024,
                },
            });

            [ 'activeStateEnabled', 'focusStateEnabled', 'hoverStateEnabled' ].forEach((option) => {
                assert.strictEqual(this.instance.option(option), true, `${option} is true by default`);
            });
        });
    });

    QUnit.module('Dispose', () => {
        QUnit.test('should properly dispose download button', function(assert) {
            const buttonDisposeSpy = sinon.spy(this.downloadButton, 'dispose');

            this.instance.dispose();

            assert.strictEqual(buttonDisposeSpy.callCount, 1, 'button dispose was called');
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('file element should have role="listitem"', function(assert) {
            assert.strictEqual(this.$element.attr('role'), 'listitem', 'file element should have correct role');
        });

        QUnit.test('download button should have correct aria-label with file name', function(assert) {
            const testFileName = 'document.pdf';

            this.reinit({
                data: {
                    name: testFileName,
                    size: 2048,
                },
            });

            assert.strictEqual(
                this.$downloadButton.attr('aria-label'),
                `Download file ${testFileName}`,
                'download button should have aria-label with file name',
            );
        });

        QUnit.test('download button aria-label should be updated when data is changed', function(assert) {
            assert.strictEqual(
                this.$downloadButton.attr('aria-label'),
                'Download file test-file.txt',
                'download button should have correct aria-label',
            );

            const secondFileName = 'file2.pdf';

            this.instance.option('data', {
                name: secondFileName,
                size: 2048,
            });

            const $newDownloadButton = this.$element.find(`.${BUTTON_CLASS}`).first();

            assert.strictEqual(
                $newDownloadButton.attr('aria-label'),
                `Download file ${secondFileName}`,
                'download button aria-label should be updated with new file name',
            );
        });

        QUnit.test('download button should have aria-label when file name is empty', function(assert) {
            this.reinit({
                data: {
                    name: '',
                    size: 0,
                },
            });

            assert.strictEqual(
                this.$downloadButton.attr('aria-label'),
                'Download file ',
                'download button should have aria-label even with empty file name',
            );
        });

        QUnit.test('role="listitem" should persist after data option change', function(assert) {
            this.reinit({
                data: {
                    name: 'initial.txt',
                    size: 512,
                },
            });

            assert.strictEqual(this.$element.attr('role'), 'listitem', 'role should be "listitem" initially');

            this.instance.option('data', {
                name: 'updated.pdf',
                size: 1024,
            });

            assert.strictEqual(this.$element.attr('role'), 'listitem', 'role should remain "listitem" after data change');
        });
    });
});
