import $ from 'jquery';
import FileView, {
    CHAT_FILE_VIEW_CLASS,
    CHAT_FILE_VIEW_CONTAINER_CLASS,
    CHAT_FILE_VIEW_ITEM_CLASS,
} from '__internal/ui/chat/file_view/file_view';

import { CHAT_FILE_CLASS } from '__internal/ui/chat/file_view/file';

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
    test('should have correct structure when no files passed', function(assert) {
        const $container = this.$element.find(`.${CHAT_FILE_VIEW_CONTAINER_CLASS}`);

        assert.ok(this.$element.hasClass(CHAT_FILE_VIEW_CLASS), 'root has correct class');
        assert.strictEqual($container.length, 1, 'container is rendered');
        assert.strictEqual($container.children().length, 0, 'no items initially');
    });

    test('should have correct structure when files passed', function(assert) {
        const files = [{ name: 'Test', size: 50 }];
        this.reinit({ files });

        const $container = this.$element.find(`.${CHAT_FILE_VIEW_CONTAINER_CLASS}`);
        const $fileViewItem = $container.find(`.${CHAT_FILE_VIEW_ITEM_CLASS}`);
        const $chatFile = $container.find(`.${CHAT_FILE_CLASS}`);

        assert.strictEqual($fileViewItem.length, 1, 'fileView item is rendered');
        assert.strictEqual($chatFile.length, 1, 'file is rendered');
    });
});


