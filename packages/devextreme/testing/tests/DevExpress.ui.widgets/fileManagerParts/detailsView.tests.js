import $ from 'jquery';
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import pointerEvents from 'common/core/events/pointer';
import localization from 'localization';
import messageLocalization from 'common/core/localization/message';
import { FileManagerWrapper, createTestFileSystem, isDesktopDevice, createHugeFileSystem } from '../../../helpers/fileManagerHelpers.js';
import { triggerCellClick } from '../../../helpers/fileManager/events.js';
import { implementationsMap } from 'core/utils/size';

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
                    size: 200,
                    owner: 'Admin'
                },
                {
                    name: '2.txt',
                    isDirectory: false,
                    size: 0,
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
        assert.equal(this.wrapper.getDetailsItemSize(1), '200 B', 'Incorrect formating of size column.');
        assert.equal(this.wrapper.getDetailsItemSize(2), '0 B', 'Incorrect formating of size column.');
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

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(2));
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(2), 'first directory selected');
        assert.ok(this.wrapper.isDetailsRowFocused(2), 'first directory focused');
        assert.deepEqual(getSelectedItemNames(fileManager), [ 'Folder 1.1' ], 'first directory in selection');

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1));
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(2), 'first directory is not selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(2), 'first directory is not focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(1), 'parent directory item is not selected');
        assert.ok(this.wrapper.isDetailsRowFocused(1), 'parent directory item is focused');
        assert.notOk(this.wrapper.getRowSelectCheckBox(1).length, 'parent directory item check box hidden');
        assert.notStrictEqual(fileManager.option('focusedItemKey'), '', 'some focus (option)');
        assert.deepEqual(fileManager.option('selectedItemKeys'), [], 'no selection (option)');
        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection (method)');
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

    test('Support selection by long tap', function(assert) {
        const selectionSpy = sinon.spy();
        const item1Path = 'Folder 1/Folder 1.1';
        const item2Path = 'Folder 1/Folder 1.2';

        const fileManager = prepareParentDirectoryTesting(this);
        fileManager.option('onSelectionChanged', selectionSpy);
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxhold');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1);
        assert.strictEqual(fileManager.getSelectedItems().length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, item1Path);
        assert.strictEqual(fileManager.getSelectedItems()[0].key, item1Path, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ item1Path ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ item1Path ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no deselected items');


        this.wrapper.getRowNameCellInDetailsView(3).trigger('dxhold');
        this.clock.tick(400);

        const oldSelectedItems = fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems.length, 2);
        assert.strictEqual(oldSelectedItems.length, 2, 'two items in selection');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems[0].path, item1Path);
        assert.strictEqual(oldSelectedItems[0].key, item1Path, 'correct item1 in selection');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems[1].path, item2Path);
        assert.strictEqual(oldSelectedItems[1].key, item2Path, 'correct item2 in selection');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ item1Path, item2Path ], 'selected keys provided');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ item2Path ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [], 'no deselected items');

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxhold');
        this.clock.tick(400);

        const newSelectedItems = fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 2, 'event not raised');
        assert.strictEqual(newSelectedItems.length, 2);
        assert.deepEqual(newSelectedItems, oldSelectedItems, 'selection has not changed');
    });

    test('Raise the ContextMenuItemClick event', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuItemClick: spy,
            permissions: {
                rename: true
            },
            contextMenu: {
                items: [
                    {
                        name: 'someItem',
                        text: 'someItem',
                        visibilityMode: 'manual',
                        visible: true,
                        items: [
                            {
                                name: 'otherItem',
                                text: 'otherItem',
                                specialField: 123
                            }
                        ]
                    }, 'rename'
                ]
            }
        });
        this.clock.tick(800);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        const $items = this.wrapper.getContextMenuItems();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(800);

        let itemData = fileManager.option('contextMenu.items')[0];
        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), $items.eq(0).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'itemView', 'viewArea is correct');

        $items.eq(1).trigger('dxclick');
        this.clock.tick(800);

        itemData = fileManager.option('contextMenu.items')[1];

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), $items.eq(1).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 2, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
    });

    test('Raise the ContextMenuItemClick event on fileActionsButton\'s menu', function(assert) {
        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuItemClick: spy,
            permissions: {
                rename: true
            },
            contextMenu: {
                items: [
                    {
                        name: 'someItem',
                        text: 'someItem',
                        visibilityMode: 'manual',
                        visible: true,
                        items: [
                            {
                                name: 'otherItem',
                                text: 'otherItem',
                                specialField: 123
                            }
                        ]
                    }, 'rename'
                ]
            }
        });
        this.clock.tick(800);

        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(800);

        const $items = this.wrapper.getContextMenuItems();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(800);

        let itemData = fileManager.option('contextMenu.items')[0];
        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), $items.eq(0).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'itemView', 'viewArea is correct');

        $items.eq(1).trigger('dxclick');
        this.clock.tick(800);

        itemData = fileManager.option('contextMenu.items')[1];

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), $items.eq(1).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 2, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
    });

    test('Default columns rearrangement and modification', function(assert) {
        const fileManager = this.wrapper.getInstance();
        const defaultCssClass = 'dx-filemanager-details-item-is-directory';
        const customCaption = 'This is directory';
        const customCssClass = 'some-test-css-class';
        fileManager.option({
            itemView: {
                details: {
                    columns: [ 'size', 'dateModified', 'name',
                        {
                            dataField: 'thumbnail',
                            caption: customCaption,
                            cssClass: customCssClass
                        }
                    ]
                }
            }
        });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(0).text(), 'File Size', 'first column is File Size');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(1).text(), 'Date Modified', 'second column is Date Modified');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(2).text(), 'Name', 'third column is Name');

        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(3).text(), customCaption, 'fourth column is thumbnais with custom capture');
        assert.ok(this.wrapper.getColumnHeaderInDetailsView(3).hasClass(customCssClass), 'fourth column has custom css class');
        assert.ok(this.wrapper.getColumnHeaderInDetailsView(3).hasClass(defaultCssClass), 'fourth column also has default css class');

        assert.strictEqual(this.wrapper.getDetailsCellValue(1, 3), 'Folder 1', 'folder has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(2, 3), '1.txt', 'file 1 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(3, 3), '2.txt', 'file 2 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(4, 3), '3.txt', 'file 3 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(5, 3), '4.txt', 'file 4 has correct name in correct column');
    });

    test('Cusom columns rearrangement and modification', function(assert) {
        const fileManager = this.wrapper.getInstance();
        let fileProvider = fileManager.option('fileSystemProvider');
        let index = 0;
        fileProvider = fileProvider.map(info => info.index = index++);
        fileManager.option({
            fileProvider,
            itemView: {
                details: {
                    columns: [
                        {
                            dataField: 'owner',
                            caption: 'Info owner'
                        },
                        {
                            dataField: 'index',
                            caption: 'Info index'
                        }
                    ]
                }
            }
        });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(0).text(), 'Info owner', 'first column has correct custom capture');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(1).text(), 'Info index', 'second column has correct custom capture');

        assert.strictEqual(this.wrapper.getDetailsCellValue(1, 1), '\u00A0', 'folder has correct owner in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(2, 1), 'Admin', 'file 1 has correct owner in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(3, 1), 'Admin', 'file 2 has correct owner in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(4, 1), 'Guest', 'file 3 has correct owner in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(5, 1), 'Max', 'file 4 has correct owner in correct column');

        assert.strictEqual(this.wrapper.getDetailsCellValue(1, 2), '0', 'folder has correct index in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(2, 2), '1', 'file 1 has correct index in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(3, 2), '2', 'file 2 has correct index in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(4, 2), '3', 'file 3 has correct index in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(5, 2), '4', 'file 4 has correct index in correct column');
    });

    test('Customize columns with customizeDetailColumns callback', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            itemView: {
                details: {
                    columns: [ 'size', 'dateModified', 'name']
                }
            },
            customizeDetailColumns: function(columns) {
                const fileSizeColumn = columns.filter(function(c) { return c.dataField === 'size'; })[0];
                columns.splice(columns.indexOf(fileSizeColumn), 1);

                const modifiedColumn = columns.filter(function(c) { return c.dataField === 'dateModified'; })[0];
                modifiedColumn.caption = 'Modified';

                columns.push({
                    caption: 'Created',
                    dataField: 'created',
                    dataType: 'date'
                });

                return columns;
            },
        });
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(0).text(), 'Modified', 'first column is Date Modified');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(1).text(), 'Name', 'second column is Name');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(2).text(), 'Created', 'third column is Date Created');

        assert.strictEqual(this.wrapper.getDetailsCellValue(1, 2), 'Folder 1', 'folder has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(2, 2), '1.txt', 'file 1 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(3, 2), '2.txt', 'file 2 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(4, 2), '3.txt', 'file 3 has correct name in correct column');
        assert.strictEqual(this.wrapper.getDetailsCellValue(5, 2), '4.txt', 'file 4 has correct name in correct column');
    });

    test('localize header captions (T949528)', function(assert) {
        const captionName = 'TEST';
        const captionDate = 'TEST1';
        const captionSize = 'TEST2';
        const locale = localization.locale();
        messageLocalization.load({
            'ja': {
                'dxFileManager-listDetailsColumnCaptionName': captionName,
                'dxFileManager-listDetailsColumnCaptionDateModified': captionDate,
                'dxFileManager-listDetailsColumnCaptionFileSize': captionSize,
            }
        });
        localization.locale('ja');

        this.wrapper.getInstance().repaint();
        this.clock.tick(600);

        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(1).text(), captionName, 'first column is Name');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(2).text(), captionDate, 'second column is Date Modified');
        assert.strictEqual(this.wrapper.getColumnHeaderInDetailsView(3).text(), captionSize, 'third column is File Size');
        localization.locale(locale);
    });

    test('columns without hidingPriority auto hide disabled (T950675)', function(assert) {
        const thumbnailsColumnCaption = 'thumbnailsColumnCaption';
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 500;
        this.wrapper.getInstance().option({
            fileSystemProvider: [{
                name: 'Some_very_very_very_very_very_very_very_very_very_very_very_very_very_very_long_folder',
                isDirectory: true,
                hasSubDirectories: false,
                items: []
            }],
            itemView: {
                mode: 'details',
                details: {
                    columns: [{ dataField: 'thumbnail', caption: 'thumbnailsColumnCaption' }, 'name']
                }
            },
            width: '500px'
        });
        this.clock.tick(600);

        assert.strictEqual(this.wrapper.getDetailsCell(thumbnailsColumnCaption, 0).outerWidth(), 36, 'thumbnails column width is correct');
        implementationsMap.getWidth = originalFunc;
    });

    test('sorting by file size is correct (T962735)', function(assert) {
        const columnHeader = this.wrapper.getColumnHeaderInDetailsView(3);

        assert.equal(columnHeader.attr('aria-sort'), 'none', 'sorting default');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'Folder 1');
        assert.equal(this.wrapper.getDetailsItemName(1), '2.txt');
        assert.equal(this.wrapper.getDetailsItemName(2), '1.txt');
        assert.equal(this.wrapper.getDetailsItemName(3), '3.txt');
        assert.equal(this.wrapper.getDetailsItemName(4), '4.txt', 'sorted descending');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), '4.txt');
        assert.equal(this.wrapper.getDetailsItemName(1), '3.txt');
        assert.equal(this.wrapper.getDetailsItemName(2), '1.txt');
        assert.equal(this.wrapper.getDetailsItemName(3), '2.txt');
        assert.equal(this.wrapper.getDetailsItemName(4), 'Folder 1', 'sorted ascending');

        columnHeader.trigger($.Event('dxclick', { ctrlKey: true }));
        this.clock.tick(400);

        assert.equal(columnHeader.attr('aria-sort'), 'none', 'sorting default');
    });

    test('focus and selection in \'single\' mode must be reseted when the last item is removed (T972613)', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            fileSystemProvider: createTestFileSystem(),
            currentPath: 'Folder 2',
            selectionMode: 'single',
            permissions: { delete: true }
        });
        this.clock.tick(400);

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1), true);
        this.clock.tick(400);

        assert.deepEqual(getSelectedItemNames(fileManager), ['File 2-1.jpg'], 'File 2-1.jpg is selected');

        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getRowsInDetailsView().length, 0, 'no files');
        assert.strictEqual(fileManager.option('focusedItemKey'), undefined, 'no focus (option)');
        assert.deepEqual(fileManager.option('selectedItemKeys'), [], 'no selection (option)');
        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection (method)');
    });

    test('focus selection in \'multiple\' mode must be reseted when the last item is removed (T972613)', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            fileSystemProvider: createTestFileSystem(),
            currentPath: 'Folder 2',
            selectionMode: 'multiple',
            permissions: { delete: true }
        });
        this.clock.tick(400);

        triggerCellClick(this.wrapper.getRowNameCellInDetailsView(1));
        this.clock.tick(400);

        assert.deepEqual(getSelectedItemNames(fileManager), ['File 2-1.jpg'], 'File 2-1.jpg is selected');

        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getRowsInDetailsView().length, 0, 'no files');
        assert.strictEqual(fileManager.option('focusedItemKey'), undefined, 'no focus (option)');
        assert.deepEqual(fileManager.option('selectedItemKeys'), [], 'no selection (option)');
        assert.deepEqual(getSelectedItemNames(fileManager), [], 'no selection (method)');
    });

    test('grid must hide its skeleton loader and render folder contents when current path is changed and some item is focused (T1129252, T1125089, T1125526)', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                showParentFolder: true
            },
            currentPath: 'Folder 1'
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');
        assert.ok(this.wrapper.getRowsInDetailsView().length > 2, 'rows are rendered');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 0), '..', 'parent folder is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 1), 'File 0.txt', 'file "File 0.txt" is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 2), 'File 1.txt', 'file "File 1.txt" is in place');

        fileManager.option('focusedItemKey', 'Folder 1/File 99.txt');
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 100), 'File 99.txt', 'focused item is visible');
        assert.ok(this.wrapper.getDetailsViewScrollableContainer().scrollTop() > 3000, 'scroll position changed');

        fileManager.option('currentPath', 'Folder 2');
        this.clock.tick(800);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');
        assert.ok(this.wrapper.getRowsInDetailsView().length > 2, 'rows are rendered');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 0), '..', 'parent folder is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 1), 'File 0.txt', 'file "File 0.txt" is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 2), 'File 1.txt', 'file "File 1.txt" is in place');
    });

    test('grid must hide its skeleton loader and render folder contents when current path is changed and some item is selected (T1129252, T1125089, T1125526)', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                showParentFolder: true
            },
            currentPath: 'Folder 1'
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'initial scroll position is 0');
        assert.ok(this.wrapper.getRowsInDetailsView().length > 2, 'rows are rendered');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 0), '..', 'parent folder is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 1), 'File 0.txt', 'file "File 0.txt" is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 2), 'File 1.txt', 'file "File 1.txt" is in place');

        fileManager.option({
            focusedItemKey: 'Folder 1/File 99.txt',
            selectedItemKeys: ['Folder 1/File 99.txt']
        });
        this.clock.tick(400);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 100), 'File 99.txt', 'focused item is visible');
        assert.ok(this.wrapper.getDetailsViewScrollableContainer().scrollTop() > 3000, 'scroll position changed');

        fileManager.option('currentPath', 'Folder 2');
        this.clock.tick(800);
        this.wrapper.getDetailsViewScrollableContainer().trigger('scroll');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), 0, 'scroll position resetted to 0');
        assert.ok(this.wrapper.getRowsInDetailsView().length > 2, 'rows are rendered');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 0), '..', 'parent folder is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 1), 'File 0.txt', 'file "File 0.txt" is in place');
        assert.strictEqual(this.wrapper.getDetailsCellText('Name', 2), 'File 1.txt', 'file "File 1.txt" is in place');
    });
});
