import $ from 'jquery';
import TableUI from 'ui/html_editor/modules/tableContextMenu';


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
                    <td>0_3</td>\
                </tr>\
                <tr>\
                    <td>1_0</td>\
                    <td>1_1</td>\
                    <td>1_2</td>\
                    <td>1_3</td>\
                </tr>\
                <tr>\
                    <td>2_0</td>\
                    <td>2_1</td>\
                    <td>2_2</td>\
                    <td>2_3</td>\
                </tr>\
            </table>\
            ').appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {}
        };

        this.options = {
            _quillContainer: this.$table,
            editorInstance: {
                on: () => {},
                off: () => {},
                // addContentInitializedCallback: (callback) => { setTimeout(callback, 0); },
                // addCleanCallback: () => {},
                // option: (optionName) => {
                //     if(optionName === 'rtlEnabled') {
                //         return false;
                //     }
                // },
                $element: () => this.$element,
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getContent: () => this.$element,
                _getQuillContainer: () => this.$element
            }
        };

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
            this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
            // this.createFrameSpy = sinon.spy(instance, '_createResizeFrames');
            // this.updateFrameSpy = sinon.spy(instance, '_updateFramePosition');
            // this.detachSeparatorEventsSpy = sinon.spy(instance, '_detachSeparatorEvents');
        };

    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test, module, skip } = QUnit;

module('Table resizing module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const tableUiInstance = new TableUI(this.quillMock, this.options);

        this.clock.tick();
        // assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.notOk(tableUiInstance.enabled, 'module disabled by default');
    });

    skip('create module instance with enabled: true', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableUI(this.quillMock, this.options);

        this.clock.tick();
        // assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 1, 'There is resize frame element');
        assert.ok(resizingInstance.enabled, 'module disabled by default');
    });

});
