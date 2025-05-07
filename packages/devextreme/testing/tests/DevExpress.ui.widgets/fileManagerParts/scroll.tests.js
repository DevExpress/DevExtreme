import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import pointerEvents from 'common/core/events/pointer';
import { FileManagerWrapper, FileManagerProgressPanelWrapper, createTestFileSystem, createHugeFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';
import { CLICK_EVENT } from '../../../helpers/grid/keyboardNavigationHelper.js';
import { implementationsMap } from 'core/utils/size';

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            fileSystemProvider: fileSystem,
            itemView: {
                mode: 'thumbnails'
            },
            permissions: {
                create: true,
                copy: true,
                move: true,
                delete: true,
                rename: true,
                upload: true
            }
        });

        this.fileManager = this.$element.dxFileManager('instance');

        this.wrapper = new FileManagerWrapper(this.$element);
        this.progressPanelWrapper = new FileManagerProgressPanelWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

QUnit.module('Scroll', moduleConfig, () => {

    test('Details view - must keep scroll position', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                mode: 'details'
            }
        });
        this.clock.tick(400);

        const scrollPosition = 100;
        this.wrapper.getDetailsViewScrollableContainer().scrollTop(scrollPosition);
        this.clock.tick(400);

        this.fileManager.refresh();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');
    });

    test('Thumbnails view - must keep scroll position', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem()
        });
        this.clock.tick(400);

        const scrollPosition = 150;
        this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(scrollPosition);
        this.clock.tick(400);

        this.fileManager.refresh();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');

        implementationsMap.getWidth = originalFunc;
    });

    test('All views - must keep scroll position for sync focused item - scroll position at the end', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 550;
        // focus item in thumbnails and remember its scroll position
        this.fileManager.option({
            fileSystemProvider: createHugeFileSystem(),
            currentPath: 'Folder 1',
            width: 500,
            height: 250
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('File 0.txt').trigger(pointerEvents.down);
        this.clock.tick(400);
        this.wrapper.getThumbnailsViewPort().trigger($.Event('keydown', { key: 'End' }));
        this.clock.tick(400);

        const thumbnailsScrollPosition = this.wrapper.getThumbnailsViewScrollableContainer().scrollTop();

        // switch to details and remember scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(0).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        const detailsScrollPosition = this.wrapper.getDetailsViewScrollableContainer().scrollTop();
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 100), 'File 99.txt', 'focused item is visible');

        // switch to thumbnails and check scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(1).trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), thumbnailsScrollPosition, 'thumbnails scroll position is the same');

        // switch to details and check scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(0).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), detailsScrollPosition, 'details scroll position is the same');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 100), 'File 99.txt', 'focused item is visible');
        implementationsMap.getWidth = originalFunc;
    });

    test('Details view must keep scroll position when selection is changed', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                mode: 'details'
            }
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        this.wrapper.getDetailsViewScrollable().dxScrollable('instance').scrollTo({ top: 500 });
        const scrollPosition = Math.floor(this.wrapper.getDetailsViewScrollableContainer().scrollTop());
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(10).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(Math.floor(this.wrapper.getDetailsViewScrollableContainer().scrollTop()), scrollPosition, 'scroll position is the same');
    });

    test('Thumbnails view must keep scroll position when selection is changed', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem()
        });
        this.clock.tick(400);

        this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(500);
        const scrollPosition = this.wrapper.getThumbnailsViewScrollableContainer().scrollTop();
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('File 9.txt').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');
    });

    test('NavPane - must keep scroll position after refresh', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.fileManager.option({
            width: 500,
            height: 250,
            currentPath: 'Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1/Folder 1.1.1.1.1'
        });
        this.clock.tick(400);

        const scrollPosition = 64;
        this.wrapper.getDirsPanel().find('.dx-scrollable').dxScrollable('instance').scrollTo({ top: scrollPosition });
        this.clock.tick(400);

        this.fileManager.refresh();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getTreeViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');

        implementationsMap.getWidth = originalFunc;
    });

    test('Details view - must reset scroll position on currentPath changed (T1163728, T1125089)', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(15, 1, 24),
            itemView: {
                mode: 'details'
            }
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');

        this.fileManager.option('focusedItemKey', 'File 14.txt');
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 15), 'File 14.txt', 'focused item is visible');
        assert.ok(this.wrapper.getDetailsViewScrollableContainer().scrollTop() > 400, 'scroll position changed');

        this.fileManager.option('currentPath', 'Folder 1');
        this.clock.tick(800);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');
    });

    test('Thumbnails view - must reset scroll position on currentPath changed (T1163728, T1125089)', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(15, 1, 24)
        });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');

        this.fileManager.option('focusedItemKey', 'File 14.txt');
        this.clock.tick(400);

        assert.ok(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop() > 700, 'scroll position changed');

        this.fileManager.option('currentPath', 'Folder 1');
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');

        implementationsMap.getWidth = originalFunc;
    });

    test('Details view - must reset scroll position on currentPath changed (T1125089)', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                mode: 'details'
            },
            currentPath: 'Folder 1'
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');

        this.fileManager.option('focusedItemKey', 'Folder 1/File 99.txt');
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 100), 'File 99.txt', 'focused item is visible');
        assert.ok(this.wrapper.getDetailsViewScrollableContainer().scrollTop() > 3000, 'scroll position changed');

        this.fileManager.option('currentPath', 'Folder 2');
        this.clock.tick(800);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');
    });

    test('Thumbnails view - must reset scroll position on currentPath changed (T1125089)', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            currentPath: 'Folder 1'
        });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');

        this.fileManager.option('focusedItemKey', 'Folder 1/File 99.txt');
        this.clock.tick(400);

        assert.ok(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop() > 5000, 'scroll position changed');

        this.fileManager.option('currentPath', 'Folder 2');
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');

        implementationsMap.getWidth = originalFunc;
    });
});
