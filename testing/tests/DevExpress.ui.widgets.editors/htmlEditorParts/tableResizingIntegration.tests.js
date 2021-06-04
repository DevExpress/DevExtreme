import $ from 'jquery';

import 'ui/html_editor';
import { getBoundingRect } from 'core/utils/position';
import { each } from 'core/utils/iterator';

import PointerMock from '../../../helpers/pointerMock.js';

const { test, module } = QUnit;

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DX_DRAGGABLE_CLASS = 'dx-draggable';

const DRAGGABLE_ELEMENT_OFFSET = 2;

const tableMarkup = '\
    <table>\
        <tr>\
            <td>0_0</td>\
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
    </table>';


module('Resizing integration', {
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
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    test('Frame is created for table by default if the tableResizing option is enabled', function(assert) {
        this.createWidget();
        this.clock.tick();

        const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
        const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'Frame is created for table');
        assert.strictEqual($columnResizerElements.length, 4, 'Column resizers are created for every column separator');
        assert.strictEqual($rowResizerElements.length, 4, 'Row resizers are created for every row separator');
        assert.strictEqual($draggableElements.length, 0, 'Column resizers draggable elements are not created before the pointerDown event');
    });

    test('Draggable element should be created on pointerDown event', function(assert) {
        this.createWidget();
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        $columnResizerElements.eq(0)
            .trigger('dxpointerdown');

        const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

        assert.strictEqual($draggableElements.length, 1, 'Column resizers draggable elements are created after the pointerDown event');
    });

    test('Draggable element should be one', function(assert) {
        this.createWidget();
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        $columnResizerElements.eq(0)
            .trigger('dxpointerdown');

        $columnResizerElements.eq(1)
            .trigger('dxpointerdown');

        const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

        assert.strictEqual($draggableElements.length, 1, 'Column resizers draggable elements are created after the pointerDown event');
    });

    test('Frame is not created for table by default if the tableResizing option is disabled', function(assert) {
        this.createWidget({
            tableResizing: { enabled: false }
        });
        this.clock.tick();

        const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, 'Frame is not created for table');
        assert.strictEqual($columnResizerElements.length, 0, 'Column resizers are not created');
    });

    test('Frame is not created if a table does not exists', function(assert) {
        this.createWidget({
            value: ''
        });
        this.clock.tick();

        // this.$element
        //     .find('img')
        //     .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, 'Frame is not created');
    });

    test('Check table resize frame position', function(assert) {
        this.createWidget();
        this.clock.tick();

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
        this.clock.tick();

        this.instance.insertText(0, '1<br>1<br>', { bold: true });
        this.clock.tick();

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
        this.clock.tick();

        const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

        assert.strictEqual($resizeFrame.length, 2, 'Frame is created for table');
        assert.strictEqual($columnResizerElements.length, 8, 'Coulumn resize elements are created for the both tables');
    });

    test('Check column resizers elements positions', function(assert) {
        this.createWidget();
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        const $table = this.$element.find('table');
        // const tablePosition = getBoundingRect($table.get(0));
        const columnBorderOffsets = [];

        $table.find('tr').eq(0).find('td').each((i, element) => {
            const columnWidth = $(element).outerWidth();
            if(i > 0) {
                columnBorderOffsets[i] = columnBorderOffsets[i - 1] + columnWidth;
            } else {
                columnBorderOffsets[i] = columnWidth;
            }
        });

        $columnResizerElements.each((i, column) => {
            const resizerLeftPosition = parseInt($(column).css('left').replace('px', ''));
            assert.roughEqual(resizerLeftPosition, columnBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1, 'Resizer has the same offset as the column border, index = ' + i);
        });
    });

    test('Check column resizers elements and border positions after drag', function(assert) {
        this.createWidget({ width: 450 });
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        const $table = this.$element.find('table').width(400);
        // const tablePosition = getBoundingRect($table.get(0));
        const columnBorderOffsets = [];

        $columnResizerElements.eq(0)
            .trigger('dxpointerdown');

        const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

        PointerMock($draggableElements.eq(0))
            .start()
            .dragStart()
            .drag(50, 10)
            .dragEnd();

        this.clock.tick();

        $table.find('tr').eq(0).find('td').each((i, element) => {
            const columnWidth = $(element).outerWidth();
            if(i > 0) {
                columnBorderOffsets[i] = columnBorderOffsets[i - 1] + columnWidth;
            } else {
                columnBorderOffsets[i] = columnWidth;
            }
        });

        $columnResizerElements.each((i, column) => {
            const resizerLeftPosition = parseInt($(column).css('left').replace('px', ''));
            assert.roughEqual(resizerLeftPosition, columnBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1, 'Resizer has the same offset as the column border, index = ' + i);
        });

        assert.roughEqual(columnBorderOffsets[0], 150, 3);
        assert.roughEqual(columnBorderOffsets[1], 200, 3);
    });

    test('Table has fixed width style for every column if we drag the last column', function(assert) {
        this.createWidget({ width: 450 });
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
        const $table = this.$element.find('table').width(400);

        $columnResizerElements.eq(3)
            .trigger('dxpointerdown');

        const $columns = $table.find('tr').eq(0).find('td');

        each($columns, (_, element) => {
            const styleAttr = $(element).attr('style') || '';
            assert.ok(styleAttr.indexOf('width') >= 0);
        });
    });


    test('Table width was changed if we drag the last column', function(assert) {
        this.createWidget({ width: 400 });
        this.clock.tick();

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

        this.clock.tick();

        assert.roughEqual($table.outerWidth(), startTableWidth + offset, 3);
    });

    test('Table height was changed if we drag the row height resizer', function(assert) {
        this.createWidget({ height: 300 });
        this.clock.tick();

        const $columnResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
        const $table = this.$element.find('table');
        const startTableHeight = $table.outerHeight();
        const offset = 20;

        $columnResizerElements.eq(1)
            .trigger('dxpointerdown');

        const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

        PointerMock($draggableElements.eq(0))
            .start()
            .dragStart()
            .drag(0, offset)
            .dragEnd();

        this.clock.tick();

        assert.roughEqual($table.outerHeight(), startTableHeight + offset, 3);
    });

    test('Check row resizers elements positions', function(assert) {
        this.createWidget();
        this.clock.tick();

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

        $rowResizerElements.each((i, row) => {
            const resizerLeftPosition = parseInt($(row).css('top').replace('px', ''));
            assert.roughEqual(resizerLeftPosition, rowBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1, 'Resizer has the same offset as the row border, index = ' + i);
        });
    });

});
