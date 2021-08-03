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

const { test, module } = QUnit;

module('Table UI module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        // this.clock.tick();
        // assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.notOk(tableUIInstance.enabled, 'module is disabled if option is not defined');
    });

    test('create module instance with enabled: false', function(assert) {
        this.options.enabled = true;
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        // assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 1, 'There is resize frame element');
        assert.ok(tableUIInstance.enabled, 'module is enabled if the option is defined as true');
    });


    test('events should be attached on module init', function(assert) {
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);

        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are not attached on module initialization');
    });

    test('events should be attached on module init if the option is true', function(assert) {
        this.options.enabled = true;
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);

        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are not detached on module initialization');
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are attached on module initialization');
    });

    test('events should be attached on module init if the option is enabled at runtime', function(assert) {
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);
        tableUIInstance.option('enabled', true);

        assert.strictEqual(this.attachEventsSpy.callCount, 1, 'Events are attached on module initialization at runtime');
    });

    test('events should be attached on module init if the option is disabled at runtime', function(assert) {
        this.options.enabled = true;
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);
        tableUIInstance.option('enabled', false);

        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached on module deinitialization at runtime');
    });


});
