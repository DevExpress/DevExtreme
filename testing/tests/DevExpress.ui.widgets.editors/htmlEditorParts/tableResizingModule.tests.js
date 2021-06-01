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
            on: () => {},
            off: () => {},
            getSelection: () => this.selectedRange,
            setSelection: (index, length) => { this.selectedRange = { index, length }; }
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

        // this.attachSpies = (instance) => {
        //     this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
        //     this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
        //     this.createFrameSpy = sinon.spy(instance, '_createResizeFrame');
        //     this.updateFrameSpy = sinon.spy(instance, 'updateFramePosition');
        //     this.showFrameSpy = sinon.spy(instance, 'showFrame');
        //     this.hideFrameSpy = sinon.spy(instance, 'hideFrame');
        // };
    },
    afterEach: function() {
        this.clock.tick();
        // resizingInstance.clean();
        this.clock.restore();
    }
};

const { test, module } = QUnit;

module('Table resizing module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);
        assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.notOk(resizingInstance.enabled, 'module disabled by default');
    });


});
