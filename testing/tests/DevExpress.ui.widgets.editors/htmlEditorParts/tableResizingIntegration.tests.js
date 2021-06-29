import $ from 'jquery';

import 'ui/html_editor';
import { getBoundingRect } from 'core/utils/position';
import { each } from 'core/utils/iterator';

import PointerMock from '../../../helpers/pointerMock.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { getWindow } from 'core/utils/window.js';

const { test, module } = QUnit;

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DX_DRAGGABLE_CLASS = 'dx-draggable';

const TIME_TO_WAIT = 200;

const DRAGGABLE_ELEMENT_OFFSET = 2;

const tableMarkup = '\
    <table>\
        <tr>\
            <td>0_0 content</td>\
            <td>0_1</td>\
            <td>0_2</td>\
            <td style="text-align: right;">0_3</td>\
        </tr>\
        <tr>\
            <td>1_0</td>\
            <td>1_1</td>\
            <td>1_2</td>\
            <td style="text-align: right;">1_3</td>\
        </tr>\
        <tr>\
            <td>2_0</td>\
            <td>2_1</td>\
            <td>2_2</td>\
            <td style="text-align: right;">2_3</td>\
        </tr>\
    </table>\
    <br><br>';

const tableMarkupWidth = '\
    <table>\
        <tr>\
            <td width="50px">0_0</td>\
            <td width="100px">0_1</td>\
            <td width="50px">0_2</td>\
            <td width="50px">0_3</td>\
        </tr>\
    </table>\
    <br><br>';


function getColumnBordersOffset($table) {
    const columnBorderOffsets = [];

    $table.find('tr').eq(0).find('td').each((i, column) => {
        const columnWidth = $(column).outerWidth();

        columnBorderOffsets.push(i === 0 ? columnWidth : columnBorderOffsets[i - 1] + columnWidth);
    });

    return columnBorderOffsets;
}

function getRowBordersOffset($table) {
    const rowBorderOffsets = [];

    $table.find('td:first-child').each((i, row) => {
        const rowHeight = $(row).outerHeight();

        rowBorderOffsets.push(i === 0 ? rowHeight : rowBorderOffsets[i - 1] + rowHeight);
    });

    return rowBorderOffsets;
}

function checkColumnResizerPositions(assert, $lineResizerElements, lineBorderOffsets, cssProperty = 'left') {
    $lineResizerElements.each((i, item) => {
        const resizerLeftPosition = parseInt($(item).css(cssProperty));
        assert.roughEqual(resizerLeftPosition, lineBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1.01, 'Resizer has the same offset as the column border, index = ' + i);
    });
}


module('Table resizing integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            tableResizing: { enabled: true },
            value: tableMarkup
        };

        this.createWidget = (options) => {
            const newOptions = $.extend({}, this.options, options);
            this.instance = this.$element
                .dxHtmlEditor(newOptions)
                .dxHtmlEditor('instance');

            this.quillInstance = this.instance.getQuillInstance();
        };
    },
    afterEach: function() {
        this.instance.dispose();
        this.clock.restore();
    }
}, () => {
    module('resizing frames initialization', {}, () => {
        test('Frame is created for table by default if the tableResizing option is enabled', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            assert.strictEqual($resizeFrame.length, 1, 'Frame is created for table');
            assert.strictEqual($columnResizerElements.length, 4, 'Column resizers are created for every column separator');
            assert.strictEqual($rowResizerElements.length, 3, 'Row resizers are created for every row separator');
            assert.strictEqual($draggableElements.length, 0, 'Column resizers draggable elements are not created before the pointerDown event');
        });

        test('Frame is removed if tableResizing option is disabled at runtime', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('tableResizing', { enabled: false });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            assert.strictEqual($resizeFrame.length, 0, 'Frame is created for table');
        });

        test('Draggable element should be created on pointerDown event', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            assert.strictEqual($draggableElements.length, 1, 'Column resizers draggable elements are created after the pointerDown event');
        });

        test('Draggable element should be disposed after drag', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            $columnResizerElements.eq(1)
                .trigger('dxpointerdown');

            let $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(1))
                .start()
                .dragStart()
                .drag(50, 10)
                .dragEnd();

            $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            assert.strictEqual($draggableElements.length, 0);
        });

        test('Frame is not created for table by default if the tableResizing option is disabled', function(assert) {
            this.createWidget({
                tableResizing: { enabled: false }
            });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            assert.strictEqual($resizeFrame.length, 0, 'Frame is not created for table');
            assert.strictEqual($columnResizerElements.length, 0, 'Column resizers are not created');
        });

        test('Frame is not created if a table does not exists', function(assert) {
            this.createWidget({
                value: ''
            });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            assert.strictEqual($resizeFrame.length, 0, 'Frame is not created');
        });

        test('Frame is created if we apply new value with table in runtime', function(assert) {
            this.createWidget({
                value: ''
            });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('value', tableMarkup);

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            assert.strictEqual($resizeFrame.length, 1, 'Frame is created');
        });
    });

    module('frame position', {}, () => {
        test('Check table resize frame position', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const tablePosition = getBoundingRect(this.$element.find('table').get(0));
            const framePosition = getBoundingRect($resizeFrame.get(0));

            assert.strictEqual(tablePosition.left, framePosition.left, 'Left is correrct');
            assert.strictEqual(tablePosition.top, framePosition.top, 'Top is correrct');
            assert.strictEqual(tablePosition.height, framePosition.height, 'Height is correrct');
            assert.strictEqual(tablePosition.width, framePosition.width, 'Width is correrct');
        });

        test('Check table resize frame position after content changes', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.insertText(0, '1<br>1<br>', { bold: true });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const tablePosition = getBoundingRect(this.$element.find('table').get(0));
            const framePosition = getBoundingRect($resizeFrame.get(0));

            assert.strictEqual(tablePosition.left, framePosition.left, 'Left is correrct');
            assert.strictEqual(tablePosition.top, framePosition.top, 'Top is correrct');
            assert.strictEqual(tablePosition.height, framePosition.height, 'Height is correrct');
            assert.strictEqual(tablePosition.width, framePosition.width, 'Width is correrct');
        });

        test('Check table resize frames positions for a two tables', function(assert) {
            this.createWidget({
                value: tableMarkup + '<br>' + tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            assert.strictEqual($resizeFrame.length, 2, 'Frame is created for table');
            assert.strictEqual($columnResizerElements.length, 8, 'Coulumn resize elements are created for the both tables');
        });

        test('Resizing should works correctly after widgets content vertical scrolling', function(assert) {
            this.createWidget({
                value: `1<br> ${tableMarkup} 1<br>1<br>1<br>1<br>1<br>`,
                height: 80
            });
            this.clock.tick(TIME_TO_WAIT);

            const $editorContent = this.instance._getContent();
            $editorContent.get(0).scrollTop = 25;
            $($editorContent).trigger('scroll');

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const tablePosition = getBoundingRect(this.$element.find('table').get(0));
            const framePosition = getBoundingRect($resizeFrame.get(0));

            assert.strictEqual(tablePosition.top, framePosition.top, 'Frame top position is correrct');
        });
    });

    module('Column resizing', {}, () => {
        test('Check column resizers elements positions', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Check column resizers elements and border positions after drag', function(assert) {
            this.createWidget({ width: 450 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table').width(400);

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(50, 10)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);

            assert.roughEqual(columnBorderOffsets[0], 150, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
        });

        test('Frame should change height if the table height is changed by horizontal drag', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true, minColumnWidth: 0 } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(-70, 0);

            assert.roughEqual($resizeFrame.outerHeight(), $table.outerHeight(), 3);
            assert.roughEqual($columnResizerElements.eq(0).outerHeight(), $table.outerHeight(), 3);

            PointerMock($draggableElement).dragEnd();
            this.clock.tick(TIME_TO_WAIT);
        });
    });

    module('minColumnWidth', {}, () => {
        test('Check column border positions after drag (default min width)', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table').width(400);

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(40, 0)
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);

            assert.roughEqual(columnBorderOffsets[0], 140, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
        });


        test('minColumnWidth option should work for zero value', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true, minColumnWidth: 0 } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-30, 0)
                .drag(-25, 0)
                .drag(-10, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.find('tr').eq(0).find('td:last-child').outerWidth(), 35, 3);
        });

        test('Check last column min width limitation after drag', function(assert) {
            this.createWidget({ width: 430 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-30, 0)
                .drag(-25, 0)
                .drag(-20, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.find('tr').eq(0).find('td:last-child').outerWidth(), 45, 3);
        });

        test('Table has fixed width style for every column if we drag the last column', function(assert) {
            this.createWidget({ width: 450 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table').width(400);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $columns = $table.find('tr').eq(0).find('td');

            each($columns, (_, element) => {
                const styleAttr = $(element).attr('width') || '';
                assert.ok(styleAttr.length >= 0);
            });
        });


        test('Table width was changed if we drag the last column', function(assert) {
            this.createWidget({ width: 400 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const startTableWidth = $table.outerWidth();
            const offset = -20;

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(offset, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.outerWidth(), startTableWidth + offset, 3);
        });
    });

    module('Row resizing', {}, () => {
        test('Table height was changed if we drag the row height resizer', function(assert) {
            this.createWidget({ height: 300 });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const startTableHeight = $table.outerHeight();
            const offset = 20;

            $rowResizerElements.eq(1)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(0, offset)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.outerHeight(), startTableHeight + offset, 3);
        });

        test('Table height is changed to minRowHeight if we try to set value less the limit', function(assert) {
            this.createWidget({
                height: 300,
                tableResizing: { enabled: true, minColumnWidth: 40, minRowHeight: 40 }
            });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const offset = 5;

            $rowResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(0, offset)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.find('tr:first-child').find('td:first-child').outerHeight(), 40, 3);
        });

        test('Table row height is limited by minRowHeight option', function(assert) {
            this.createWidget({
                height: 300,
                tableResizing: { enabled: true, minColumnWidth: 40, minRowHeight: 30 }
            });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $rowResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(0, 40)
                .drag(0, -10)
                .drag(0, -10)
                .drag(0, -10)
                .drag(0, -10)
                .drag(0, -10)
                .drag(0, -10)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.find('tr:first-child').find('td:first-child').outerHeight(), 30, 3);
        });

        test('Check row resizers elements positions', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const rowBorderOffsets = [];

            $table.find('td:first-child').each((i, element) => {
                const rowHeight = $(element).outerHeight();
                if(i > 0) {
                    rowBorderOffsets[i] = rowBorderOffsets[i - 1] + rowHeight;
                } else {
                    rowBorderOffsets[i] = rowHeight;
                }
            });

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
        });
    });

    module('Resizers boundaries', {}, () => {
        test('Boundary should have bottom boundary offset we use vertical drag', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true } });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            $rowResizerElements.eq(2)
                .trigger('dxpointerdown');
            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const boundaryOffset = $draggableElement.dxDraggable('instance').option('boundOffset');
            assert.roughEqual(boundaryOffset.bottom, -$(getWindow()).height(), 2);
        });

        test('Boundary should be the Table element if we drag column', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');
            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const boundaryElement = $($draggableElement.dxDraggable('instance').option('boundary')).get(0);
            assert.strictEqual(boundaryElement, $table.get(0));
        });

        test('Boundary should be all Quill element if we drag last column', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');
            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const boundaryElement = $($draggableElement.dxDraggable('instance').option('boundary')).get(0);
            assert.strictEqual(boundaryElement, $(this.instance._getQuillContainer()).get(0));
        });
    });

    module('API', {}, () => {
        test('Table and columns width was saved if we apply new markup with td width attributes', function(assert) {
            this.createWidget({ width: 630 });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('value', tableMarkupWidth);

            this.clock.tick(TIME_TO_WAIT);

            const $table = this.$element.find('table');

            const expectedColumnsWidths = [50, 100, 50, 50];

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 2, 'Column has expected width, index = ' + i);
            });

            assert.roughEqual($table.outerWidth(), 250, 3);
        });
    });

    module('Window resizing', {}, () => {
        test('Check resizers elements positions after window resize', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $table = this.$element.find('table').width(400);
            this.clock.tick(TIME_TO_WAIT);

            resizeCallbacks.fire();

            this.clock.tick(500);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Check columns widths and resizers positions after window resize', function(assert) {
            this.createWidget({
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);

            let $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(20, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            $('#htmlEditor').width(430);

            this.clock.tick(TIME_TO_WAIT);

            resizeCallbacks.fire();

            this.clock.tick(TIME_TO_WAIT);

            $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            const $table = this.$element.find('table');

            const columnBorderOffsets = getColumnBordersOffset($table);

            const expectedColumnsWidths = [97, 97, 97, 108];

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 1.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).attr('width')), expectedColumnsWidths[i], 1.01, 'Column has expected width attr, index = ' + i);
            });

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });
    });

    module('Table structure changing', {}, () => {
        test('Second frame should be added if we add the second table', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.quillInstance.setSelection(this.quillInstance.getLength(), 0);
            const tableModule = this.quillInstance.getModule('table');
            tableModule.insertTable(2, 2);

            this.clock.tick(TIME_TO_WAIT);
            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            let rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            let $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            $rowResizerElements.each((i, row) => {
                const resizerLeftPosition = parseInt($(row).css('top').replace('px', ''));
                assert.roughEqual(resizerLeftPosition, rowBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1.01, 'Resizer has the same offset as the row border for the first table, index = ' + i);
            });

            rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(1));
            $rowResizerElements = $resizeFrames.eq(1).find(`.${DX_ROW_RESIZER_CLASS}`);

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');

            assert.strictEqual($resizeFrames.length, 2);
        });

        test('First frame should be removed if we remove the first table', function(assert) {
            this.createWidget({
                value: tableMarkup + '<br>' + tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.deleteTable();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            const $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');

            assert.strictEqual($resizeFrames.length, 1);
        });

        test('Row resizers should be updated after a row insert', function(assert) {
            this.createWidget({
                value: tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertRow();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            const $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
        });

        test('Row resizers should be updated after some rows insert', function(assert) {
            this.createWidget({
                value: tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertRow();
            tableModule.insertRow();
            tableModule.insertRow();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            const $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
        });

        test('Row resizers should be updated after a row delete', function(assert) {
            this.createWidget({
                value: tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.deleteRow();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            const $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            checkColumnResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
        });

        test('Column resizers should be updated after a column insert', function(assert) {
            this.createWidget({
                value: tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const $tables = this.$element.find('table');
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            const columnBorderOffsets = getColumnBordersOffset($tables.eq(0));

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Columns widths should be updated after a some columns insert', function(assert) {
            this.createWidget({
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            let $table = this.$element.find('table');
            const startTableWidth = $table.outerWidth();

            $columnResizerElements.eq(1)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const expectedColumnsWidths = [40, 40, 40, 120, 141, 98, 120];

            $table = this.$element.find('table');

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 1.01, 'Column has expected width, index = ' + i);
            });

            assert.roughEqual($table.outerWidth(), startTableWidth, 3, 'Table width is not changed');
        });

        test('Table width should not be updated after a some columns insert', function(assert) {
            this.createWidget({
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-50, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            let $table = this.$element.find('table');
            const startTableWidth = $table.outerWidth();

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            $table = this.$element.find('table');

            assert.roughEqual($table.outerWidth(), startTableWidth, 2.01, 'Table width is not changed');
        });

        test('Column resizers should be updated after a some columns insert', function(assert) {
            this.createWidget({
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            let $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            let $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const expectedColumnsWidths = [40, 40, 40, 114, 114, 94, 155];

            $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(5)
                .trigger('dxpointerdown');

            $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-20, 0)
                .dragEnd();

            const $table = this.$element.find('table');

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 1.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).attr('width')), expectedColumnsWidths[i], 1.01, 'Column has expected width attr, index = ' + i);
            });
        });

        test('Column resizers should be updated after a column delete', function(assert) {
            this.createWidget({
                value: tableMarkup,
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            let $table = this.$element.find('table').eq(0);
            const tableWidth = $table.outerWidth();

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.deleteColumn();
            tableModule.deleteColumn();

            this.clock.tick(TIME_TO_WAIT);

            $table = this.$element.find('table').eq(0);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);

            assert.roughEqual($table.outerWidth(), tableWidth, 2, 'Table width is not changed');
        });

        test('Second table frame should update position after the insert row to the first table', function(assert) {
            this.createWidget({
                value: tableMarkup + '<br>' + tableMarkup
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertRow();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const tablePosition = getBoundingRect(this.$element.find('table').get(1));
            const framePosition = getBoundingRect($resizeFrame.get(1));

            assert.strictEqual(tablePosition.left, framePosition.left, 'Left is correrct');
            assert.strictEqual(tablePosition.top, framePosition.top, 'Top is correrct');
            assert.strictEqual(tablePosition.height, framePosition.height, 'Height is correrct');
            assert.strictEqual(tablePosition.width, framePosition.width, 'Width is correrct');
        });

        test('Row resizers should be updated on the table structure update after resize', function(assert) {
            this.createWidget({
                width: 430,
            });
            this.clock.tick(TIME_TO_WAIT);

            let $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            $rowResizerElements.eq(1)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(0, 40)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertRow();

            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            $rowResizerElements = $resizeFrames.eq(0).find(`.${DX_ROW_RESIZER_CLASS}`);

            $rowResizerElements.each((i, row) => {
                const resizerLeftPosition = parseInt($(row).css('top').replace('px', ''));
                assert.roughEqual(resizerLeftPosition, rowBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1.01, 'Resizer has the same offset as the row border for the table, index = ' + i);
            });
        });

        test('Column resizers should be updated on the table structure update after resize', function(assert) {
            this.createWidget({
                width: 430,
            });
            this.clock.tick(TIME_TO_WAIT);

            let $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(1)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const $tables = this.$element.find('table');
            $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            const columnBorderOffsets = getColumnBordersOffset($tables.eq(0));

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Column resizers should works correctly after the table structure update after resize', function(assert) {
            this.createWidget({
                width: 830,
            });
            this.clock.tick(TIME_TO_WAIT);

            let $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(1)
                .trigger('dxpointerdown');

            let $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const $tables = this.$element.find('table');
            $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($tables.eq(0));

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Table should have a correct width if it has not anough place after insert rows', function(assert) {
            assert.expect(17);

            const minColumnWidth = 40;
            this.createWidget({
                width: 230,
                tableResizing: {
                    enabled: true,
                    minColumnWidth: minColumnWidth
                }
            });
            this.clock.tick(TIME_TO_WAIT);

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(5, 0);
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();
            tableModule.insertColumn();

            this.clock.tick(TIME_TO_WAIT);

            const $table = this.$element.find('table').eq(0);

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), minColumnWidth, 1.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).attr('width')), minColumnWidth, 1.01, 'Column has expected width attr, index = ' + i);
            });

            assert.roughEqual($table.outerWidth(), minColumnWidth * 8, 2, 'Table width');
        });
    });

    module('rtl', {}, () => {
        test('Columns resizers should be positioned correctly if the rtl mode is enabled', function(assert) {
            this.createWidget({ width: 430, rtlEnabled: true });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');
        });

        test('Columns should be resized correctly after drag at the rtl mode', function(assert) {
            this.createWidget({ width: 430, rtlEnabled: true });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

            assert.roughEqual(columnBorderOffsets[0], 70, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
        });

        test('Columns resizers should be positioned correctly if the rtl mode is enabled at runtime', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('rtlEnabled', true);
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrames = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

            assert.strictEqual($resizeFrames.length, 1);
        });

        test('Columns resizers should works correctly if the rtl mode is enabled at runtime', function(assert) {
            this.createWidget({ width: 430 });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('rtlEnabled', true);
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkColumnResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

            assert.roughEqual(columnBorderOffsets[0], 70, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
        });
    });
});
