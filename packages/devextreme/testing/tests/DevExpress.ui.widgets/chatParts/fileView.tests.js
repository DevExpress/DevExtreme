import $ from 'jquery';
import FileView, { FILE_VIEW_ITEM_CLASS, } from '__internal/ui/chat/file_view/file_view';

const { test } = QUnit;

QUnit.module('FileView', {
    beforeEach() {
        this.$element = $('<div>').appendTo('#qunit-fixture');

        const init = (options) => {
            this.instance = new FileView(this.$element, options);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        init();
    },

    afterEach() {
        this.instance.dispose();
        this.$element.remove();
    },
}, () => {
    test('files option should update items dynamically', function(assert) {
        const files1 = [{ name: 'test1', size: 10 }];

        const files2 = [
            { name: 'test2', size: 20 },
            { name: 'test3', size: 30 },
        ];

        this.reinit({ files: files1 });

        const fileInstanceMock = { dispose: sinon.spy() };
        this.instance._fileInstances = [fileInstanceMock];

        let $items = this.$element.find(`.${FILE_VIEW_ITEM_CLASS}`);
        assert.strictEqual($items.length, 1, 'initially one file rendered');

        this.instance.option('files', files2);
        $items = this.$element.find(`.${FILE_VIEW_ITEM_CLASS}`);

        assert.ok(fileInstanceMock.dispose.calledOnce, 'dispose called for old instances');
        assert.strictEqual($items.length, 2, 'renders two files after option change');
    });

    test('onDownload option should update in file instances', function(assert) {
        const files = [{ name: 'test', size: 1 }];
        this.reinit({ files });

        const originalFileInstances = this.instance._fileInstances;

        const fileInstanceMock = { option: sinon.spy() };
        this.instance._fileInstances = [fileInstanceMock];

        const handler = () => {};
        this.instance.option('onDownload', handler);

        assert.ok(fileInstanceMock.option.calledOnce, 'option() called on instance');
        assert.deepEqual(fileInstanceMock.option.firstCall.args, ['onDownload', handler], 'onDownload set correctly');

        this.instance._fileInstances = originalFileInstances;
    });

    test('state-related options should update in file instances', function(assert) {
        const files = [{ name: 'test1', size: 10 }];
        this.reinit({ files });

        const originalFileInstances = this.instance._fileInstances;

        const fileInstanceMock = { option: sinon.spy() };
        this.instance._fileInstances = [fileInstanceMock];

        const options = [
            { name: 'activeStateEnabled', value: true },
            { name: 'focusStateEnabled', value: true },
            { name: 'hoverStateEnabled', value: true },
        ];

        options.forEach(({ name, value }) => {
            this.instance.option(name, value);
        });

        assert.strictEqual(
            fileInstanceMock.option.callCount,
            options.length,
            'each option called once'
        );

        options.forEach(({ name, value }, index) => {
            const call = fileInstanceMock.option.getCall(index);

            assert.deepEqual(
                call.args,
                [name, value],
                `call #${index + 1}: ${name} updated with correct value`
            );
        });

        this.instance._fileInstances = originalFileInstances;
    });

    test('should clear fileInstances and DOM on dispose', function(assert) {
        const files = [{ name: 'test1', size: 10 }];
        this.reinit({ files });

        this.instance.dispose();

        assert.strictEqual(this.$element.children().length, 0, 'DOM cleared');
    });
});
