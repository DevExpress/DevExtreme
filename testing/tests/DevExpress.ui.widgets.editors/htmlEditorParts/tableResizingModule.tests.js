import $ from 'jquery';

import Resizing from 'ui/html_editor/modules/tableResizing';

// import PointerMock from '../../../helpers/pointerMock.js';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
// const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor').css({ margin: '10px' });
        this.$table = $('\
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
        </table>\
        ').attr({
            width: 900,
            height: 200
        }).appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {}
        };

        this.options = {
            editorInstance: {
                on: () => {},
                off: () => {},
                $element: () => this.$element,
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getQuillContainer: () => this.$element
            }
        };

    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test, module } = QUnit;

module('Table resizing module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        this.clock.tick();
        assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.notOk(resizingInstance.enabled, 'module disabled by default');

        // create module instance with enabled equals to \'true\'
        //     this.options.enabled = true;
        //     const resizingInstance = new Resizing(this.quillMock, this.options);
        //     //resizingInstance.option('tableResizing', { enabled: true });
        //     this.clock.tick();
        //     const $tableResizeFrame = this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`);

        //     assert.strictEqual($tableResizeFrame.length, 1, 'There is a resize frame element');
        //     assert.notOk($tableResizeFrame.is(':visible'), 'Resize frame element is hidden');
    });

});
