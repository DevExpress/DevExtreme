import $ from 'jquery';
import FileView from '__internal/ui/chat/file_view/file_view';
import File, { CHAT_FILE_CLASS } from '__internal/ui/chat/file_view/file';
import { BUTTON_CLASS } from '__internal/ui/button/button';


const moduleConfig = {
    beforeEach() {
        const init = (options = {}) => {
            const defaultOptions = {
                files: [{
                    name: 'test.txt',
                    size: 1024,
                }],
                ...options,
            };

            this.instance = new FileView($('#component'), defaultOptions);
            this.$element = $(this.instance.$element());

            const $buttons = this.$element.find(`.${BUTTON_CLASS}`);
            this.$downloadButton = $($buttons[0]);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    },
};

QUnit.module('FileView', moduleConfig, () => {
    QUnit.module('files', () => {
        QUnit.test('files option should update items dynamically', function(assert) {
            const files2 = [
                { name: 'test2', size: 20 },
                { name: 'test3', size: 30 },
            ];

            let $items = this.$element.find(`.${CHAT_FILE_CLASS}`);

            assert.strictEqual($items.length, 1, 'initially one file rendered');

            this.instance.option('files', files2);

            $items = this.$element.find(`.${CHAT_FILE_CLASS}`);

            assert.strictEqual($items.length, 2, 'renders two files after option change');
        });
    });

    QUnit.module('onDownload option', () => {
        QUnit.test('should pass correct event arguments to onDownload', function(assert) {
            assert.expect(4);

            this.reinit({
                onDownload: (e) => {
                    assert.ok(e.component instanceof FileView, 'component is correct');
                    assert.strictEqual(e.element, this.instance.element(), 'element is provided correctly');
                    assert.ok(e.event, 'original event is provided');
                    assert.strictEqual(typeof e.event, 'object', 'event is an object');
                },
            });

            this.$downloadButton.trigger('dxclick');
        });

        QUnit.test('should pass correct event arguments to onDownload via on()', function(assert) {
            assert.expect(4);

            const onDownload = (e) => {
                assert.ok(e.component instanceof FileView, 'component is correct');
                assert.strictEqual(e.element, this.instance.element(), 'element is provided correctly');
                assert.ok(e.event, 'original event is provided');
                assert.strictEqual(typeof e.event, 'object', 'event is an object');
            };

            this.instance.on('download', onDownload);

            this.$downloadButton.trigger('dxclick');
        });

        QUnit.test('should set onDownload via option()', function(assert) {
            assert.expect(4);

            const onDownload = (e) => {
                assert.ok(e.component instanceof FileView, 'component is correct');
                assert.strictEqual(e.element, this.instance.element(), 'element is provided correctly');
                assert.ok(e.event, 'original event is provided');
                assert.strictEqual(typeof e.event, 'object', 'event is an object');
            };

            this.instance.option('onDownload', onDownload);

            this.$downloadButton.trigger('dxclick');
        });
    });

    QUnit.module('Proxy state options', () => {
        [false, true].forEach(value => {
            QUnit.test(`passed state options should be equal to File state options when value is ${value}`, function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.reinit({
                    files: [{
                        name: 'test.txt',
                        size: 1024,
                    }],
                    ...options,
                });

                const fileInstance = File.getInstance(this.$element.find(`.${CHAT_FILE_CLASS}`));

                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(fileInstance.option(key), value, `File ${key} value is correct`);
                });
            });

            QUnit.test(`passed state options should be updated when changed at runtime with value ${value}`, function(assert) {
                const options = {
                    activeStateEnabled: value,
                    focusStateEnabled: value,
                    hoverStateEnabled: value,
                };

                this.instance.option(options);

                const fileInstance = File.getInstance(this.$element.find(`.${CHAT_FILE_CLASS}`));
                Object.entries(options).forEach(([key, value]) => {
                    assert.deepEqual(fileInstance.option(key), value, `File ${key} value is correct`);
                });
            });
        });

        QUnit.test('should have correct default state options', function(assert) {
            assert.strictEqual(this.instance.option('activeStateEnabled'), true, 'activeStateEnabled is true by default');
            assert.strictEqual(this.instance.option('focusStateEnabled'), true, 'focusStateEnabled is true by default');
            assert.strictEqual(this.instance.option('hoverStateEnabled'), true, 'hoverStateEnabled is true by default');
        });
    });

    QUnit.test('should clear DOM on dispose', function(assert) {
        const files = [{ name: 'test1', size: 10 }];
        this.reinit({ files });

        this.instance.dispose();

        assert.strictEqual(this.$element.children().length, 0, 'DOM cleared');
    });
});
