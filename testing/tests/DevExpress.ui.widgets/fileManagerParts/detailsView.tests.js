import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import pointerEvents from 'events/pointer';
import { FileManagerWrapper, createTestFileSystem, isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';
import { triggerCellClick } from '../../../helpers/fileManager/events.js';

const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            itemView: {
                mode: 'details',
                showParentFolder: false
            },
            fileSystemProvider: [
                {
                    name: 'Folder 1',
                    isDirectory: true
                },
                {
                    name: '1.txt',
                    isDirectory: false,
                    size: 0,
                    owner: 'Admin'
                },
                {
                    name: '2.txt',
                    isDirectory: false,
                    size: 200,
                    owner: 'Admin'
                },
                {
                    name: '3.txt',
                    isDirectory: false,
                    size: 1024,
                    owner: 'Guest'
                },
                {
                    name: '4.txt',
                    isDirectory: false,
                    size: 1300,
                    owner: 'Max'
                }
            ]
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

const getSelectedItemNames = fileManager => fileManager.getSelectedItems().map(item => item.name);

const prepareParentDirectoryTesting = (context, singleSelection) => {
    const fileManager = context.$element.dxFileManager('instance');
    fileManager.option({
        fileSystemProvider: createTestFileSystem(),
        currentPath: 'Folder 1',
        selectionMode: singleSelection ? 'single' : 'multiple',
        itemView: {
            showParentFolder: true
        }
    });
    context.clock.tick(400);
    return fileManager;
};

QUnit.module('Details View', moduleConfig, () => {

    test('Format file sizes', function(assert) {
        assert.equal(this.wrapper.getDetailsItemSize(0).trim(), '', 'Folder shouldn\'t display own size.');
        assert.equal(this.wrapper.getDetailsItemSize(1), '0 B', 'Incorrect formating of size column.');
        assert.equal(this.wrapper.getDetailsItemSize(2), '200 B', 'Incorrect formating of size column.');
        assert.equal(this.wrapper.getDetailsItemSize(3), '1 KB', 'Incorrect formating of size column.');
        assert.equal(this.wrapper.getDetailsItemSize(4), '1.3 KB', 'Incorrect formating of size column.');
    });

    test('Using custom formats of JSON files', function(assert) {
        $('#fileManager')
            .dxFileManager('instance')
            .option('fileSystemProvider', {
                data: [
                    {
                        title: 'Folder',
                        noFolder: true,
                        myDate: '2/2/2000'
                    },
                    {
                        title: 'Title.txt',
                        noFolder: false,
                        myDate: '1/1/2000',
                        count: 55
                    }
                ],
                nameExpr: 'title',
                isDirectoryExpr: 'noFolder',
                dateModifiedExpr: 'myDate',
                sizeExpr: 'count'
            });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsItemName(0).indexOf('Folder'), 0);
        assert.equal(this.wrapper.getDetailsItemDateModified(0).trim(), '2/2/2000');
        assert.equal(this.wrapper.getDetailsItemSize(0).trim(), '');

        assert.strictEqual(this.wrapper.getDetailsItemName(1).indexOf('Title.txt'), 0);
        assert.equal(this.wrapper.getDetailsItemDateModified(1).trim(), '1/1/2000');
        assert.equal(this.wrapper.getDetailsItemSize(1).trim(), '55 B');
    });

    test('Add additional columns to details view', function(assert) {
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('customizeDetailColumns', columns => {
            columns.push({ dataField: 'owner', caption: 'owner' });
            return columns;
        });
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsCellText('owner', 0).trim(), '');
        assert.equal(this.wrapper.getDetailsCellText('owner', 1), 'Admin');
        assert.equal(this.wrapper.getDetailsCellText('owner', 2), 'Admin');
        assert.equal(this.wrapper.getDetailsCellText('owner', 3), 'Guest');
        assert.equal(this.wrapper.getDetailsCellText('owner', 4), 'Max');
    });

    test('Raise the  SelectedFileOpened event', function(assert) {
        const spy = sinon.spy();
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('onSelectedFileOpened', spy);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxdblclick');
        this.clock.tick(800);
        assert.equal(spy.callCount, 1);
        assert.equal(spy.args[0][0].file.name, '1.txt', 'file passed as argument');

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxdblclick');
        this.clock.tick(800);
        assert.equal(spy.callCount, 1);
    });

    test('Apply sorting by click on file type column header', function(assert) {
        const columnHeader = this.$element.find('[id*=dx-col]').first();

        assert.equal(columnHeader.attr('aria-sort'), 'none', 'sorting default');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), '1.txt');
        assert.equal(this.wrapper.getDetailsItemName(1), '2.txt');
        assert.equal(this.wrapper.getDetailsItemName(2), '3.txt');
        assert.equal(this.wrapper.getDetailsItemName(3), '4.txt');
        assert.equal(this.wrapper.getDetailsItemName(4), 'Folder 1', 'sorted ascending');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'Folder 1');
        assert.equal(this.wrapper.getDetailsItemName(1), '1.txt');
        assert.equal(this.wrapper.getDetailsItemName(2), '2.txt');
        assert.equal(this.wrapper.getDetailsItemName(3), '3.txt');
        assert.equal(this.wrapper.getDetailsItemName(4), '4.txt', 'sorted descending');

        const e = $.Event('dxclick');
        e.ctrlKey = true;
        columnHeader.trigger(e);
        this.clock.tick(400);

        assert.equal(columnHeader.attr('aria-sort'), 'none', 'sorting default');
    });

    test('Details view must has ScrollView', function(assert) {
        assert.ok(this.wrapper.getDetailsItemScrollable().length);
    });

    test('\'Back\' directory must not be sortable', function(assert) {
        this.wrapper.getInstance().option({
            fileSystemProvider: createTestFileSystem(),
            currentPath: 'Folder 1',
            itemView: {
                showParentFolder: true
            }
        });
        this.clock.tick(400);
        const columnHeader = this.wrapper.getColumnHeaderInDetailsView(1);
        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), '..');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 1-1.txt');
        assert.equal(this.wrapper.getDetailsItemName(2), 'File 1-2.jpg');
        assert.equal(this.wrapper.getDetailsItemName(3), 'Folder 1.1');
        assert.equal(this.wrapper.getDetailsItemName(4), 'Folder 1.2', 'sorted ascending, \'back\' directory is on top');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), '..');
        assert.equal(this.wrapper.getDetailsItemName(1), 'Folder 1.2');
        assert.equal(this.wrapper.getDetailsItemName(2), 'Folder 1.1');
        assert.equal(this.wrapper.getDetailsItemName(3), 'File 1-2.jpg');
        assert.equal(this.wrapper.getDetailsItemName(4), 'File 1-1.txt', 'sorted descending, \'back\' directory is on top');
    });

    test('Parent directory item is not selectable in multi-selection mode via clicks', function(assert) {
        const fileManager = prepareParentDirectoryTesting(this);

        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection');

        this.wrapper.getRowNameCellInDetailsView(2)
            .trigger('dxpointerdown')
            .trigger('dxclick');
        this.wrapper.getRowNameCellInDetailsView(2).trigger(pointerEvents.up);
        this.clock.tick(400);

        assert.ok(this.wrapper.isDetailsRowSelected(2), 'first directory selected');
        assert.ok(this.wrapper.isDetailsRowFocused(2), 'first directory focused');
        assert.deepEqual(getSelectedItemNames(fileManager), [ 'Folder 1.1' ], 'first directory in selection');

        this.wrapper.getRowNameCellInDetailsView(1)
            .trigger('dxpointerdown')
            .trigger('dxclick');
        this.wrapper.getRowNameCellInDetailsView(1).trigger(pointerEvents.up);
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(2), 'first directory is not selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(2), 'first directory is not focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(1), 'parent directory item is not selected');
        assert.ok(this.wrapper.isDetailsRowFocused(1), 'parent directory item is focused');
        assert.notOk(this.wrapper.getRowSelectCheckBox(1).length, 'parent directory item check box hidden');
        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection');
    });

    test('Select All check box ignore parent directory item when all items selected', function(assert) {
        const fileManager = prepareParentDirectoryTesting(this);
        const allNames = [ 'Folder 1.1', 'Folder 1.2', 'File 1-1.txt', 'File 1-2.jpg' ];

        if(isDesktopDevice()) {
            assert.strictEqual(this.wrapper.getSelectAllCheckBoxState(), 'clear', 'select all is not checked');
        }

        for(let i = 2; i <= 5; i++) {
            const e = $.Event('dxclick');
            e.ctrlKey = i !== 1;
            this.wrapper.getRowNameCellInDetailsView(i).trigger(pointerEvents.down).trigger(e);
            this.clock.tick(400);
        }

        if(isDesktopDevice()) {
            assert.strictEqual(this.wrapper.getSelectAllCheckBoxState(), 'checked', 'select all is checked');
        }
        assert.deepEqual(getSelectedItemNames(fileManager), allNames, 'all items in selection');

        const e = $.Event('dxclick');
        e.ctrlKey = true;
        this.wrapper.getRowNameCellInDetailsView(1).trigger(pointerEvents.down).trigger(e);

        if(isDesktopDevice()) {
            assert.strictEqual(this.wrapper.getSelectAllCheckBoxState(), 'checked', 'select all is checked');
        }
        assert.deepEqual(getSelectedItemNames(fileManager), allNames, 'all items in selection');
        assert.notOk(this.wrapper.isDetailsRowSelected(1), 'parent directory item is not selected');
        assert.ok(this.wrapper.isDetailsRowFocused(1), 'parent directory item is focused');
        assert.notOk(this.wrapper.getRowSelectCheckBox(1).length, 'parent directory item check box hidden');
    });

    test('Select All check box ignore parent directory item when it is checked', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true);
            return;
        }
        const fileManager = prepareParentDirectoryTesting(this);
        const allNames = [ 'Folder 1.1', 'Folder 1.2', 'File 1-1.txt', 'File 1-2.jpg' ];

        assert.strictEqual(this.wrapper.getSelectAllCheckBoxState(), 'clear', 'select all is not checked');

        this.wrapper.getSelectAllCheckBox().trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getSelectAllCheckBoxState(), 'checked', 'select all is checked');
        assert.deepEqual(getSelectedItemNames(fileManager), allNames, 'all items in selection');
        assert.notOk(this.wrapper.isDetailsRowSelected(1), 'parent directory item is not selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(1), 'parent directory item is focused');
        assert.notOk(this.wrapper.getRowSelectCheckBox(1).length, 'parent directory item check box hidden');
    });

    test('Parent directory item is not selectable in single-selection mode via clicks', function(assert) {
        const fileManager = prepareParentDirectoryTesting(this, true);

        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection');

        this.wrapper.getRowNameCellInDetailsView(2).trigger(pointerEvents.down);
        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(2), 'first directory selected');
        assert.ok(this.wrapper.isDetailsRowFocused(2), 'first directory focused');
        assert.deepEqual(getSelectedItemNames(fileManager), [ 'Folder 1.1' ], 'first directory in selection');

        this.wrapper.getRowNameCellInDetailsView(1).trigger(pointerEvents.down);
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(2), 'first directory is not selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(2), 'first directory is not focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(1), 'parent directory item is not selected');
        assert.ok(this.wrapper.isDetailsRowFocused(1), 'parent directory item is focused');
        assert.notOk(this.wrapper.getRowSelectCheckBox(1).length, 'parent directory item check box hidden');
        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection');
    });

    test('selectionChanged event ignore parent direcotry item', function(assert) {
        const selectionSpy = sinon.spy();
        const itemPath = 'Folder 1/Folder 1.1';

        const fileManager = prepareParentDirectoryTesting(this);
        fileManager.option('onSelectionChanged', selectionSpy);

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(2));
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, itemPath, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ itemPath ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ itemPath ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no deselected items');

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1));
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems, [], 'no items in selection');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [], 'no item keys in selection');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [], 'no selected items');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ itemPath ], 'one item became deselected');

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1));
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event not raised');

        if(isDesktopDevice()) {
            this.wrapper.getSelectCheckBoxInDetailsView(2).trigger('dxclick');
        } else {
            triggerCellClick(this.wrapper.getRowNameCellInDetailsView(2));
        }
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 3, 'event raised');
        assert.strictEqual(selectionSpy.args[2][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[2][0].selectedItems[0].path, itemPath, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[2][0].selectedItemKeys, [ itemPath ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[2][0].currentSelectedItemKeys, [ itemPath ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[2][0].currentDeselectedItemKeys, [], 'no deselected items');

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1));
        this.clock.tick(400);

        if(isDesktopDevice()) {
            assert.strictEqual(selectionSpy.callCount, 3, 'event not raised');
        } else {
            assert.strictEqual(selectionSpy.callCount, 4, 'event raised');
            assert.deepEqual(selectionSpy.args[3][0].selectedItems, [], 'no items in selection');
            assert.deepEqual(selectionSpy.args[3][0].selectedItemKeys, [], 'no item keys in selection');
            assert.deepEqual(selectionSpy.args[3][0].currentSelectedItemKeys, [], 'no selected items');
            assert.deepEqual(selectionSpy.args[3][0].currentDeselectedItemKeys, [ itemPath ], 'one item became deselected');
        }
    });
});
