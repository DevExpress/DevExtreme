import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import { Consts, FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager');
        this.wrapper = new FileManagerWrapper(this.$element);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

const createFileManager = useThumbnailViewMode => {
    const fileSystem = createTestFileSystem();
    const viewMode = useThumbnailViewMode ? 'thumbnails' : 'details';

    $('#fileManager').dxFileManager({
        fileProvider: fileSystem,
        itemView: {
            mode: viewMode,
            showFolders: false,
            showParentFolder: false
        },
        permissions: {
            create: true,
            copy: true,
            move: true,
            remove: true,
            rename: true,
            upload: true
        }
    });
};

QUnit.module('Toolbar', moduleConfig, () => {

    test('toolbar updated after selection changing in thumbnails view mode', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, 'has buttons');

        assert.ok($elements.eq(0).text().indexOf('New folder') !== -1, 'create folder button displayed');
        assert.ok($elements.eq(1).text().indexOf('Upload files') !== -1, 'upload files button displayed');
        assert.ok($elements.eq(2).val().indexOf('Thumbnails') !== -1, 'view switcher displayed');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, 'has buttons');

        assert.ok($elements.eq(0).text().indexOf('Move') !== -1, 'move displayed');
        assert.ok($elements.eq(1).text().indexOf('Copy') !== -1, 'copy displayed');
        assert.ok($elements.eq(2).text().indexOf('Rename') !== -1, 'rename displayed');
        assert.ok($elements.eq(3).text().indexOf('Delete') !== -1, 'delete button displayed');
        assert.ok($elements.eq(4).text().indexOf('Clear selection') !== -1, 'clear selection button displayed');
    });

    test('toolbar updated after folder changing in thumbnails view mode', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        let $folderNode = this.wrapper.getFolderNode(0);
        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
    });

    test('toolbar updated after selection changing in details view mode', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, 'has buttons');

        assert.ok($elements.eq(0).text().indexOf('New folder') !== -1, 'create folder button displayed');
        assert.ok($elements.eq(1).text().indexOf('Upload files') !== -1, 'upload files button displayed');
        assert.ok($elements.eq(2).val().indexOf('Details') !== -1, 'view switcher displayed');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, 'has buttons');

        assert.ok($elements.eq(0).text().indexOf('Move') !== -1, 'move displayed');
        assert.ok($elements.eq(1).text().indexOf('Copy') !== -1, 'copy displayed');
        assert.ok($elements.eq(2).text().indexOf('Rename') !== -1, 'rename displayed');
        assert.ok($elements.eq(3).text().indexOf('Delete') !== -1, 'delete button displayed');
        assert.ok($elements.eq(4).text().indexOf('Clear selection') !== -1, 'clear selection button displayed');
    });

    test('toolbar updated after folder changing in details view mode', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        let $folderNode = this.wrapper.getFolderNode(0);
        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
    });

    test('Display only general toolbar if file toolbar doesn\'t have items', function(assert) {
        createFileManager(false);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('permissions', {
            create: false,
            copy: false,
            move: false,
            remove: false,
            rename: false,
            upload: false
        });
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');
    });

    test('separator for hidden group is not visible', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, 'specified separator visible');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, 'specified separator visible');
    });

});
