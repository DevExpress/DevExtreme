import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            fileProvider: fileSystem,
            itemView: {
                mode: 'thumbnails'
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

        this.wrapper = new FileManagerWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

QUnit.module('Navigation operations', moduleConfig, () => {

    test('keep selection and expanded state during refresh', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        let $folderToggle = this.wrapper.getFolderToggle(1);
        $folderToggle.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        $folderToggle = this.wrapper.getFolderToggle(2);
        $folderToggle.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        let $folderNode = this.wrapper.getFolderNode(2);
        $folderNode.trigger('dxclick');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');

        const $commandButton = this.wrapper.getToolbarButton('Refresh');
        $commandButton.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');
    });

    test('navigate by folders in item view', function(assert) {
        let $item = this.wrapper.findThumbnailsItem('Folder 1');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the descendant folder');

        $item = this.wrapper.findThumbnailsItem('Folder 1.1');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');

        $item = this.wrapper.findThumbnailsItem('..');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the descendant folder');


        $item = this.wrapper.findThumbnailsItem('..');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');
    });

});
