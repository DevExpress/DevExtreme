import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import { Consts, FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

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
            fileProvider: [
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

const ShowMoreButtonText = '\u22EE';

const getFileSizeCellValueInDetailsView = ($element, rowIndex) => getCellValueInDetailsView($element, rowIndex, 4);

const getCellValueInDetailsView = ($element, rowIndex, columnIndex) => {
    return getCellInDetailsView($element, rowIndex, columnIndex)
        .text()
        .replace(ShowMoreButtonText, '');
};

const getCellInDetailsView = ($element, rowIndex, columnIndex) => {
    return $element.find(`tr.${Consts.GRID_DATA_ROW_CLASS}[aria-rowindex=${rowIndex}] td`)
        .eq(columnIndex);
};

QUnit.module('Details View', moduleConfig, () => {

    test('Format file sizes', function(assert) {
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 1).trim(), '', 'Folder shouldn\'t display own size.');
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 2), '0 B', 'Incorrect formating of size column.');
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 3), '200 B', 'Incorrect formating of size column.');
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 4), '1 KB', 'Incorrect formating of size column.');
        assert.equal(getFileSizeCellValueInDetailsView(this.$element, 5), '1.3 KB', 'Incorrect formating of size column.');
    });

    test('Using custom formats of JSON files', function(assert) {
        $('#fileManager')
            .dxFileManager('instance')
            .option('fileProvider', {
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

        assert.ok(getCellValueInDetailsView(this.$element, 1, 2).indexOf('Folder') === 0);
        assert.equal(getCellValueInDetailsView(this.$element, 1, 3).trim(), '2/2/2000');
        assert.equal(getCellValueInDetailsView(this.$element, 1, 4).trim(), '');

        assert.ok(getCellValueInDetailsView(this.$element, 2, 2).indexOf('Title.txt') === 0);
        assert.equal(getCellValueInDetailsView(this.$element, 2, 3).trim(), '1/1/2000');
        assert.equal(getCellValueInDetailsView(this.$element, 2, 4).trim(), '55 B');
    });

    test('Add additional columns to details view', function(assert) {
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('customizeDetailColumns', columns => {
            columns.push({ dataField: 'owner' });
            return columns;
        });
        this.clock.tick(400);

        assert.equal(getCellValueInDetailsView(this.$element, 1, 5).trim(), '');
        assert.equal(getCellValueInDetailsView(this.$element, 2, 5), 'Admin');
        assert.equal(getCellValueInDetailsView(this.$element, 3, 5), 'Admin');
        assert.equal(getCellValueInDetailsView(this.$element, 4, 5), 'Guest');
        assert.equal(getCellValueInDetailsView(this.$element, 5, 5), 'Max');
    });

    test('Raise the  SelectedFileOpened event', function(assert) {
        let eventCounter = 0;
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('onSelectedFileOpened', e => {
            eventCounter++;
        });

        getCellInDetailsView(this.$element, 2, 2).trigger('dxdblclick');
        this.clock.tick(800);
        assert.equal(eventCounter, 1);

        getCellInDetailsView(this.$element, 1, 2).trigger('dxdblclick');
        this.clock.tick(800);
        assert.equal(eventCounter, 1);
    });

    test('Apply sorting by click on file type column header', function(assert) {
        const columnHeader = this.$element.find('[id*=dx-col]').first();

        assert.equal(columnHeader.attr('aria-sort'), 'none', 'sorting default');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(getCellValueInDetailsView(this.$element, 1, 2), '1.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 2, 2), '2.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 3, 2), '3.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 4, 2), '4.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 5, 2), 'Folder 1', 'sorted ascending');

        columnHeader.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(getCellValueInDetailsView(this.$element, 1, 2), 'Folder 1');
        assert.equal(getCellValueInDetailsView(this.$element, 2, 2), '1.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 3, 2), '2.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 4, 2), '3.txt');
        assert.equal(getCellValueInDetailsView(this.$element, 5, 2), '4.txt', 'sorted descending');

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
            fileProvider: createTestFileSystem(),
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

});
