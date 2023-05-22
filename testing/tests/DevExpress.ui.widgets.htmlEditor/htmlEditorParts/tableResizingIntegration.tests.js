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
const DX_HIGHLIGHTED_ROW_CLASS = 'dx-htmleditor-highlighted-row';
const DX_HIGHLIGHTED_COLUMN_CLASS = 'dx-htmleditor-highlighted-column';

const TIME_TO_WAIT = 200;

const DRAGGABLE_ELEMENT_OFFSET = 2;
const TABLE_BORDERS = 1;

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

const tableMarkupWithHeaderRow = '\
    <table>\
        <thead>\
            <tr>\
                <th>0</th>\
                <th>1</th>\
                <th>2</th>\
                <th>3</th>\
            </tr>\
        </thead>\
        <tbody>\
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
        </tbody>\
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

const tableMarkupAutoWidth = '\
    <table>\
        <tr>\
            <td width="50px">0_0</td>\
            <td>0_1</td>\
            <td>0_2</td>\
            <td width="50px">0_3</td>\
        </tr>\
    </table>\
    <br><br>';

const tableMarkupHeight = '\
    <table>\
        <tr>\
            <td>0_0</td>\
            <td>0_1</td>\
        </tr>\
        <tr>\
            <td height="50px">1_0</td>\
            <td height="50px">1_1</td>\
        </tr>\
    </table>\
    <br>';


function getColumnBordersOffset($table) {
    const columnBorderOffsets = [];

    $table.find('tr').eq(0).find('th, td').each((i, column) => {
        const columnWidth = $(column).outerWidth();

        columnBorderOffsets.push(i === 0 ? columnWidth : columnBorderOffsets[i - 1] + columnWidth);
    });

    return columnBorderOffsets;
}

function getRowBordersOffset($table) {
    const rowBorderOffsets = [];

    $table.find('th:first-child, td:first-child').each((i, row) => {
        const rowHeight = $(row).outerHeight();

        rowBorderOffsets.push(i === 0 ? rowHeight : rowBorderOffsets[i - 1] + rowHeight);
    });

    return rowBorderOffsets;
}

function checkResizerPositions(assert, $lineResizerElements, lineBorderOffsets, cssProperty = 'left') {
    $lineResizerElements.each((i, item) => {
        const resizerLeftPosition = parseInt($(item).css(cssProperty));
        assert.roughEqual(resizerLeftPosition, lineBorderOffsets[i] - DRAGGABLE_ELEMENT_OFFSET, 1.01, 'Resizer has the same offset as the column border, index = ' + i);
    });
}

function dragLoop(pointerMockInstance, stepCount, offsets) {
    for(let i = 0; i < stepCount; i++) {
        pointerMockInstance.drag(offsets[0], offsets[1]);
    }
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

        test('Frame is not created if tableResizing option is disabled on init', function(assert) {
            this.createWidget({ tableResizing: { enabled: false } });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            assert.strictEqual($resizeFrame.length, 0, 'Frame is created for table');
        });

        test('Frame is created for table if the tableResizing option sets at runtime', function(assert) {
            this.createWidget({ tableResizing: { enabled: false } });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('tableResizing', { enabled: true });
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

            assert.strictEqual($resizeFrame.length, 0, 'Frame is not created for table');
        });

        test('Table resuizing should support value change to null at runtime', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            try {
                this.instance.option('tableResizing', null);
                this.clock.tick(TIME_TO_WAIT);

                const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

                assert.strictEqual($resizeFrame.length, 0, 'Frame is not created for table');
            } catch(e) {
                assert.ok(false);
            }
        });

        test('Frame is removed if tableResizing.enabled option is disabled at runtime', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('tableResizing.enabled', false);
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

            assert.strictEqual($resizeFrame.length, 0, 'Frame is removed');
        });

        test('Horizontal draggable element should be created on pointerDown event', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);
            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_COLUMN_CLASS}`);

            assert.strictEqual($draggableElements.length, 1, 'Column resizers draggable elements are created after the pointerDown event');
            assert.strictEqual($highlightedElement.length, 1, 'Column resizers highlighted element is created after the pointerDown event');
        });

        test('Vertical draggable element should be created on pointerDown event', function(assert) {
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);
            $rowResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);
            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_ROW_CLASS}`);

            assert.strictEqual($draggableElements.length, 1, 'Row resizers draggable elements are created after the pointerDown event');
            assert.strictEqual($highlightedElement.length, 1, 'Row resizers highlighted element is created after the pointerDown event');
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
            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_COLUMN_CLASS}`);

            assert.strictEqual($draggableElements.length, 0);
            assert.strictEqual($highlightedElement.length, 0);
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

        test('Table with fixed width should not change size after tableResizing is enabled', function(assert) {
            this.createWidget({
                width: 700,
                tableResizing: { enabled: false },
                value: tableMarkupAutoWidth
            });
            this.clock.tick(TIME_TO_WAIT);

            const $table = this.$element.find('table').eq(0);
            $table.css('width', 400);

            this.instance.option('tableResizing', { enabled: true });

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.outerWidth(), 400, 2, 'Table width is correct');
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

        test('Check table resize frame position after content height changes', function(assert) {
            this.createWidget({ width: 430 });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.insertText(0, 'some text some text some text', { bold: true });
            this.clock.tick(TIME_TO_WAIT);

            const $resizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);
            const tablePosition = getBoundingRect(this.$element.find('table').get(0));
            const framePosition = getBoundingRect($resizeFrame.get(0));

            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));
            const $rowResizerElements = $resizeFrame.find(`.${DX_ROW_RESIZER_CLASS}`);

            assert.strictEqual(tablePosition.left, framePosition.left, 'Left is correrct');
            assert.strictEqual(tablePosition.top, framePosition.top, 'Top is correrct');
            assert.strictEqual(tablePosition.height, framePosition.height, 'Height is correrct');
            assert.strictEqual(tablePosition.width, framePosition.width, 'Width is correrct');

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
        });

        test('Check column resizers elements and border positions after drag', function(assert) {
            this.createWidget({ width: 430 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);

            assert.roughEqual(columnBorderOffsets[0], 150, 2.01);
            assert.roughEqual(columnBorderOffsets[1], 200, 2.01);
        });

        test('The widget raise valueChange event after resizing (T1041884)', function(assert) {
            assert.expect(4);
            const done = assert.async();
            const valueChangedSpy = sinon.spy();
            this.createWidget({ onValueChanged: valueChangedSpy, width: 430 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const initialEditorValue = this.instance.option('value');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(20, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);
            const history = this.quillInstance.getModule('history').stack;

            this.clock.restore();

            setTimeout(() => {
                assert.strictEqual(valueChangedSpy.callCount, 1, 'value change event is raised');
                assert.ok(valueChangedSpy.getCall(0).args[0].event, 'event is saved');
                assert.notStrictEqual(this.instance.option('value'), initialEditorValue, 'value was changed');
                assert.strictEqual(history.undo.length, 1, 'history modul detect resizing');

                done();
            }, TIME_TO_WAIT);
        });

        test('Check column resizers elements and border positions after drag if the table has a header row (T1028207)', function(assert) {
            this.createWidget({ width: 430, value: tableMarkupWithHeaderRow });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);

            assert.roughEqual(columnBorderOffsets[0], 150, 2.01);
            assert.roughEqual(columnBorderOffsets[1], 200, 2.01);
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

        test('Table should not change on non-last column resizing if next column has content', function(assert) {
            this.createWidget({ width: 630, value: tableMarkupWidth });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const startTableWidth = $table.outerWidth();
            $table.find('td').eq(3).text('text12');

            $columnResizerElements.eq(2)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart();

            dragLoop(pointerMockInstance, 10, [1, 0]);

            pointerMockInstance.dragEnd();

            assert.roughEqual(startTableWidth, $table.outerWidth(), 5);
        });

        test('Table should not change on non-last column resizing if previous column has content', function(assert) {
            this.createWidget({ width: 630, value: tableMarkupWidth });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');
            const startTableWidth = $table.outerWidth();
            $table.find('td').eq(1).text('text12');

            $columnResizerElements.eq(1)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(-50, 0);

            dragLoop(pointerMockInstance, 10, [-1, 0]);

            pointerMockInstance.dragEnd();

            assert.roughEqual(startTableWidth, $table.outerWidth(), 5);
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

        test('minColumnWidth can be applied at runtime', function(assert) {
            this.createWidget({ width: 435 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            const checkingElement = $columnResizerElements.eq(0);

            this.instance.option('tableResizing.minColumnWidth', 50);

            const $table = this.$element.find('table');

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-30, 0)
                .drag(-20, 0)
                .drag(-10, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            assert.roughEqual($table.find('tr').eq(0).find('td:last-child').outerWidth(), 50, 3);
            assert.ok(checkingElement.is(':visible'));
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

        test('Check column highlighted element position if the column with min width is dragging to the left', function(assert) {
            this.createWidget({ value: tableMarkupWidth, tableResizing: { enabled: true, minColumnWidth: 50 } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(-10, 0);

            this.clock.tick(TIME_TO_WAIT);

            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_COLUMN_CLASS}`);

            assert.roughEqual(parseInt($highlightedElement.css('left')), 200, 3);

            PointerMock($draggableElement).dragEnd();
        });

        test('Check frame elements positions after drag out of the column width limit', function(assert) {
            this.createWidget({ width: 435 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart();

            dragLoop(pointerMockInstance, 5, [-20, 0]);

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);
            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_COLUMN_CLASS}`);

            assert.roughEqual(columnBorderOffsets[0], 40, 3);

            assert.roughEqual(parseInt($highlightedElement.css('left')), 40, 3);

            pointerMockInstance.dragEnd();
        });

        test('Check frame elements positions after drag out of the next column width limit', function(assert) {
            this.createWidget({ width: 435 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            $columnResizerElements.eq(0)
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(20, 10)
                .drag(20, 10)
                .drag(20, 10)
                .drag(20, 10)
                .drag(20, 10);

            this.clock.tick(TIME_TO_WAIT);

            const columnBorderOffsets = getColumnBordersOffset($table);
            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_COLUMN_CLASS}`);

            assert.roughEqual(columnBorderOffsets[0], 160, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
            assert.roughEqual(parseInt($highlightedElement.css('left')), 160, 3);

            PointerMock($draggableElement).dragEnd();
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
                const styleStyle = $(element).css('width') || '';
                assert.ok(styleStyle.length >= 0);
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

        test('Height of the table with header row was changed if we drag the row height resizer (T1028207)', function(assert) {
            this.createWidget({ height: 300, value: tableMarkupWithHeaderRow });
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

            const rowBorderOffsets = getRowBordersOffset(this.$element.find('table').eq(0));

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');

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

        test('minRowHeight can be applied at runtime', function(assert) {
            this.createWidget({
                height: 300
            });
            this.clock.tick(TIME_TO_WAIT);

            this.instance.option('tableResizing.minRowHeight', 40);

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
                tableResizing: { enabled: true, minColumnWidth: 40, minRowHeight: 20 }
            });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElement = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`).eq(0);
            const $table = this.$element.find('table');

            $rowResizerElement
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(0, 40);

            dragLoop(pointerMockInstance, 6, [0, -10]);

            this.clock.tick(TIME_TO_WAIT);

            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_ROW_CLASS}`);

            assert.roughEqual($table.find('tr:first-child').find('td:first-child').outerHeight(), 24, 3);
            assert.roughEqual(parseInt($highlightedElement.css('top')), 24, 3);

            pointerMockInstance.dragEnd();
        });

        test('Table highlighted element position is limited by minRowHeight option while the row has content-based height', function(assert) {
            this.createWidget({
                height: 300,
                width: 430,
                tableResizing: { enabled: true, minColumnWidth: 40, minRowHeight: 20 }
            });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElement = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`).eq(0);
            const $table = this.$element.find('table');

            this.instance.insertText(0, 'some text some test some text');
            this.clock.tick(TIME_TO_WAIT);

            $rowResizerElement
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(0, 40);

            dragLoop(pointerMockInstance, 6, [0, -10]);

            this.clock.tick(TIME_TO_WAIT);

            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_ROW_CLASS}`);

            assert.roughEqual(parseInt($highlightedElement.css('top')) + DRAGGABLE_ELEMENT_OFFSET, $table.find('tr:first-child').find('td:first-child').outerHeight(), 3);

            pointerMockInstance.dragEnd();
        });

        test('Table highlighted element position is limited by minRowHeight option while the row has content-based height after last column drag', function(assert) {
            this.createWidget({
                height: 300,
                width: 430,
                value: tableMarkupHeight
            });
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElement = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`).eq(1);
            const $table = this.$element.find('table');

            $rowResizerElement
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            const pointerMockInstance = PointerMock($draggableElement)
                .start()
                .dragStart();

            dragLoop(pointerMockInstance, 4, [0, -10]);

            this.clock.tick(TIME_TO_WAIT);

            const $highlightedElement = this.$element.find(`.${DX_HIGHLIGHTED_ROW_CLASS}`);

            assert.roughEqual(parseInt($highlightedElement.css('top')) + DRAGGABLE_ELEMENT_OFFSET, $table.outerHeight() - TABLE_BORDERS, 3);

            pointerMockInstance.dragEnd();
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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
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

        test('Boundary should be Quill content element if we drag last column', function(assert) {
            this.createWidget({ width: 430, tableResizing: { enabled: true } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');
            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);
            const draggableInstance = $draggableElement.dxDraggable('instance');

            const boundaryElement = draggableInstance.option('boundary').get(0);
            const boundaryOffset = draggableInstance.option('boundOffset');
            assert.strictEqual(boundaryElement, $(this.instance._getContent()).get(0));
            assert.strictEqual(boundaryOffset.left, $(this.instance._getContent()).css('paddingLeft'));
            assert.strictEqual(boundaryOffset.right, $(this.instance._getContent()).css('paddingRight'));
        });
    });

    module('API', {}, () => {
        test('Table and columns width was saved if we apply new markup with td width styles', function(assert) {
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
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

            const expectedColumnsWidths = [97, 97, 97, 107];

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 2.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).css('width')), expectedColumnsWidths[i], 2.01, 'Column has expected width style, index = ' + i);
            });

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');

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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');

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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
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

            checkResizerPositions(assert, $rowResizerElements, rowBorderOffsets, 'top');
        });

        test('Table should save custom column width after the first column deletion', function(assert) {
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

            const tableModule = this.quillInstance.getModule('table');
            let $table = this.$element.find('table');
            const tableWidth = $table.outerWidth();

            this.quillInstance.setSelection(4, 0);
            tableModule.deleteRow();
            this.clock.tick(TIME_TO_WAIT);

            const expectedColumnsWidths = [150, 150, 150, 100];
            $table = this.$element.find('table');

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 2.51, 'Column has expected width, index = ' + i);
            });

            assert.roughEqual($table.outerWidth(), tableWidth, 2.51, 'Table width is not changed');
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
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
            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
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

            const expectedColumnsWidths = [40, 40, 40, 120, 120, 141, 98];

            const $table = this.$element.find('table');

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 1.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).css('width')), expectedColumnsWidths[i], 1.01, 'Column has expected width style, index = ' + i);
            });
        });

        test('Column resizers should be updated after a some columns insert and new resize', function(assert) {
            this.createWidget({
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            let $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
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

            $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(6)
                .trigger('dxpointerdown');

            $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-30, 0)
                .dragEnd();

            const $table = this.$element.find('table');

            const expectedColumnsWidths = [40, 40, 40, 120, 120, 141, 68];

            $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                assert.roughEqual($(columnElement).outerWidth(), expectedColumnsWidths[i], 1.01, 'Column has expected width, index = ' + i);
                assert.roughEqual(parseInt($(columnElement).css('width')), expectedColumnsWidths[i], 1.01, 'Column has expected width style, index = ' + i);
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);

            assert.roughEqual($table.outerWidth(), tableWidth, 2, 'Table width is not changed');
        });

        test('Table should save custom row height after the first row deletion', function(assert) {
            this.createWidget({
                value: tableMarkup,
                width: 630
            });
            this.clock.tick(TIME_TO_WAIT);
            let $table = this.$element.find('table').eq(0);

            const $rowResizerElement = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`).eq(0);

            this.clock.tick(TIME_TO_WAIT);

            $rowResizerElement
                .trigger('dxpointerdown');

            const $draggableElement = this.$element.find(`.${DX_DRAGGABLE_CLASS}`).eq(0);

            PointerMock($draggableElement)
                .start()
                .dragStart()
                .drag(0, 50)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            const tableHeight = $table.outerHeight();

            const tableModule = this.quillInstance.getModule('table');

            this.quillInstance.setSelection(4, 0);
            tableModule.deleteColumn();

            this.clock.tick(TIME_TO_WAIT);

            $table = this.$element.find('table').eq(0);

            assert.roughEqual($table.outerHeight(), tableHeight, 2, 'Table height is not changed');
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets);
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
                assert.roughEqual(parseInt($(columnElement).css('width')), minColumnWidth, 1.01, 'Column has expected width style, index = ' + i);
            });

            assert.roughEqual($table.outerWidth(), minColumnWidth * 8, 2, 'Table width');
        });
    });

    module('history integration', {}, () => {
        test('The widget can revert table resizing by undo if table has columns with auto width', function(assert) {
            assert.expect(6);
            const done = assert.async();
            this.createWidget({ width: 432 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {
                this.instance.undo();
                const $table = this.$element.find('table');

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), 100, 2, 'Column has expected width, index = ' + i);
                    });

                    const history = this.quillInstance.getModule('history');
                    assert.strictEqual(history.stack.undo.length, 0, 'undo history stack is correct');
                    assert.strictEqual(history.stack.redo.length, 1, 'redo history stack is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert table resizing by redo if table has columns with auto width', function(assert) {
            assert.expect(3);
            const done = assert.async();
            this.createWidget({ width: 432 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {

                this.instance.undo();
                this.instance.redo();

                const $table = this.$element.find('table');

                const $columns = $table.find('tr').eq(0).find('td');


                setTimeout(() => {
                    assert.roughEqual($columns.eq(2).outerWidth(), 60, 2, 'Changes is reverted for the resized column');
                    assert.roughEqual($columns.eq(3).outerWidth(), 140, 2, 'Changes is reverted for the next column');
                    assert.roughEqual($table.outerWidth(), 400, 2, 'Table width is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert whole table resizing by undo if table has columns with auto width', function(assert) {
            assert.expect(5);
            const done = assert.async();
            this.createWidget({ width: 432 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {

                this.instance.undo();

                const $table = this.$element.find('table');

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), 100, 2, 'Column has expected width, index = ' + i);
                    });

                    assert.roughEqual($table.outerWidth(), 400, 2, 'Table width is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert whole table resizing by undo and redo if table has columns with auto width', function(assert) {
            assert.expect(5);
            const done = assert.async();
            this.createWidget({ width: 432 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-40, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {

                this.instance.undo();
                this.instance.redo();

                const $table = this.$element.find('table');

                const expectedWidths = [100, 100, 100, 60];

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), expectedWidths[i], 2, 'Column has expected width, index = ' + i);
                    });

                    assert.roughEqual($table.outerWidth(), 360, 2, 'Table width is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert table resizing by undo if table has no columns with auto width', function(assert) {
            assert.expect(4);
            const done = assert.async();
            this.createWidget({ value: tableMarkupWidth, width: 282 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(2)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(50, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {
                this.instance.undo();
                const $table = this.$element.find('table');

                const expectedWidths = [50, 100, 50, 50];

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), expectedWidths[i], 2, 'Column has expected width, index = ' + i);
                    });

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert whole table resizing by undo if table has no columns with auto width', function(assert) {
            assert.expect(5);
            const done = assert.async();
            this.createWidget({ value: tableMarkupWidth, width: 282 });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(50, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {
                this.instance.undo();
                const $table = this.$element.find('table');

                const expectedWidths = [50, 100, 50, 50];

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), expectedWidths[i], 2, 'Column has expected width, index = ' + i);
                    });

                    assert.roughEqual($table.outerWidth(), 250, 2, 'Table width is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert whole table resizing by redo if table has no columns with auto width', function(assert) {
            assert.expect(5);
            const done = assert.async();
            this.createWidget({ value: tableMarkupWidth, width: 282, tableResizing: { enabled: true, minColumnWidth: 0 } });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);

            $columnResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(-10, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {
                this.instance.undo();
                this.instance.redo();

                const $table = this.$element.find('table');

                const expectedWidths = [50, 100, 50, 40];

                setTimeout(() => {
                    $table.find('tr').eq(0).find('td').each((i, columnElement) => {
                        assert.roughEqual($(columnElement).outerWidth(), expectedWidths[i], 2, 'Column has expected width, index = ' + i);
                    });

                    assert.roughEqual($table.outerWidth(), 240, 2, 'Table width is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });

        test('The widget can revert table vertical resizing by undo', function(assert) {
            assert.expect(4);
            const done = assert.async();
            this.createWidget();
            this.clock.tick(TIME_TO_WAIT);

            const $rowResizerElements = this.$element.find(`.${DX_ROW_RESIZER_CLASS}`);

            $rowResizerElements.eq(3)
                .trigger('dxpointerdown');

            const $draggableElements = this.$element.find(`.${DX_DRAGGABLE_CLASS}`);

            PointerMock($draggableElements.eq(0))
                .start()
                .dragStart()
                .drag(30, 0)
                .dragEnd();

            this.clock.tick(TIME_TO_WAIT);

            this.clock.restore();

            setTimeout(() => {
                this.instance.undo();

                const $table = this.$element.find('table');

                setTimeout(() => {
                    $table.find('tr').each((i, rowElement) => {
                        assert.roughEqual($(rowElement).outerHeight(), 24, 2, 'Row has expected height, index = ' + i);
                    });

                    assert.roughEqual($table.outerHeight(), 74, 2, 'Table height is correct');

                    done();
                }, TIME_TO_WAIT);

            }, TIME_TO_WAIT);
        });
    });

    module('rtl', {}, () => {
        test('Columns resizers should be positioned correctly if the rtl mode is enabled', function(assert) {
            this.createWidget({ width: 430, rtlEnabled: true });
            this.clock.tick(TIME_TO_WAIT);

            const $columnResizerElements = this.$element.find(`.${DX_COLUMN_RESIZER_CLASS}`);
            const $table = this.$element.find('table');

            const columnBorderOffsets = getColumnBordersOffset($table);

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');
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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

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

            checkResizerPositions(assert, $columnResizerElements, columnBorderOffsets, 'right');

            assert.roughEqual(columnBorderOffsets[0], 70, 3);
            assert.roughEqual(columnBorderOffsets[1], 200, 3);
        });
    });
});
