import $ from 'jquery';
import renderer from 'core/renderer';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, FileManagerProgressPanelWrapper, createTestFileSystem, createHugeFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';
import { CLICK_EVENT } from '../../../helpers/grid/keyboardNavigationHelper.js';

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
        const originalFunc = renderer.fn.width;
        renderer.fn.width = () => 1200;

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

        renderer.fn.width = originalFunc;
    });

    test('All views - must keep scroll position for sync focused item', function(assert) {
        // focus item in thumbnails and remember its scroll position
        this.fileManager.option('fileSystemProvider', createHugeFileSystem());
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder 0').trigger('dxpointerdown');
        this.clock.tick(400);
        this.wrapper.getThumbnailsViewPort().trigger($.Event('keydown', { key: 'PageDown' }));
        this.clock.tick(400);

        const thumbnailsScrollPosition = this.wrapper.getThumbnailsViewScrollableContainer().scrollTop();

        // switch to details and remember scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(0).trigger('dxclick');
        this.clock.tick(400);

        const detailsScrollPosition = this.wrapper.getDetailsViewScrollableContainer().scrollTop();

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

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), detailsScrollPosition, 'details scroll position is the same');
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

        this.wrapper.getDetailsViewScrollableContainer().scrollTop(500);
        const scrollPosition = this.wrapper.getDetailsViewScrollableContainer().scrollTop();
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(10).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');
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
});
