import $ from 'jquery';
import TableResizing from 'ui/html_editor/modules/tableResizing';
import resizeCallbacks from 'core/utils/resize_callbacks';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';

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
            _quillContainer: this.$table,
            editorInstance: {
                on: () => {},
                off: () => {},
                addContentInitializedCallback: (callback) => { setTimeout(callback, 0); },
                addCleanCallback: () => {},
                option: (optionName) => {
                    if(optionName === 'rtlEnabled') {
                        return false;
                    }
                },
                $element: () => this.$element,
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getContent: () => this.$element,
                _getQuillContainer: () => this.$element
            }
        };

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
            this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
            this.createFrameSpy = sinon.spy(instance, '_createResizeFrames');
            this.updateFrameSpy = sinon.spy(instance, '_updateFramePosition');
            this.detachSeparatorEventsSpy = sinon.spy(instance, '_detachSeparatorEvents');
        };

    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test, module } = QUnit;

module('Table resizing module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);
        assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.notOk(resizingInstance.enabled, 'module disabled by default');
    });

    test('create module instance with enabled: true', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);
        assert.strictEqual(this.$element.find(`.${DX_COLUMN_RESIZE_FRAME_CLASS}`).length, 1, 'There is resize frame element');
        assert.ok(resizingInstance.enabled, 'module disabled by default');
    });

    test('module should attach events', function(assert) {
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('enabled', true);

        this.clock.tick(10);

        assert.strictEqual(this.attachEventsSpy.callCount, 1, 'Events are attached on module initialization');
        assert.strictEqual(this.detachEventsSpy.callCount, 0, 'Events are not detached on module initialization');

    });

    test('module should detach events on clean', function(assert) {
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('enabled', true);

        this.clock.tick(10);

        resizingInstance.clean();

        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached on module deinitialization');
        assert.strictEqual(this.detachSeparatorEventsSpy.callCount, 1, 'Events are detached on module deinitialization');
    });

    test('module should detach events on tableResizng disabling at runtime', function(assert) {
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('enabled', true);

        this.clock.tick(10);

        resizingInstance.option('enabled', false);

        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached on module deinitialization');
        assert.strictEqual(this.detachSeparatorEventsSpy.callCount, 1, 'Events are detached on module deinitialization');
    });

    test('module should work correct if it has been enabled or disabled some times at runtime', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        try {
            resizeCallbacks.fire();

            resizingInstance.option('enabled', true);

            this.clock.tick(10);

            resizingInstance.option('enabled', false);

            this.clock.tick(10);

            resizingInstance.option('enabled', true);

            assert.strictEqual(typeof resizingInstance._resizeHandler, 'function', 'resizingInstance._resizeHandler is still a function');
        } catch(e) {
            assert.ok(false);
        }
    });

    test('Window resize callback should be added', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        resizeCallbacks.fire();

        assert.strictEqual(typeof resizingInstance._resizeHandlerWithContext, 'object', '_resizeHandler is an object');
    });

    test('Window resize callback should be cleaned after the widget dispose', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        resizeCallbacks.fire();

        resizingInstance.clean();

        assert.strictEqual(resizingInstance._resizeHandlerWithContext, undefined, '_resizeHandler has been cleared on clean()');
        assert.strictEqual(typeof resizingInstance._resizeHandler, 'function', 'resizingInstance._resizeHandler is still a function');
    });

    test('minColumnWidth can be applied', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('minColumnWidth', 55);

        assert.strictEqual(resizingInstance._minColumnWidth, 55, 'minColumnWidth is applied');
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'module is not reinited');
    });

    test('negative values of minColumnWidth and minRowHeight options should be transformed to zero for module calculations', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('minColumnWidth', -20);
        resizingInstance.option('minRowHeight', -10);

        assert.strictEqual(resizingInstance._minColumnWidth, 0, 'minColumnWidth is applied');
        assert.strictEqual(resizingInstance._minRowHeight, 0, 'minRowHeight is applied');
    });

    test('minRowHeight can be applied', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('minRowHeight', 45);

        assert.strictEqual(resizingInstance._minRowHeight, 45, 'minRowHeight is applied');
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'module is not reinited');
    });

    test('minColumnWidth and minRowHeight as an object can be applied', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('tableResizing', { minColumnWidth: 55, minRowHeight: 45 });

        assert.strictEqual(resizingInstance._minColumnWidth, 55, 'minColumnWidth is applied');
        assert.strictEqual(resizingInstance._minRowHeight, 45, 'minRowHeight is applied');
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'module is not reinited');
    });

    test('enabled as an object can be applied', function(assert) {
        this.options.enabled = true;
        const resizingInstance = new TableResizing(this.quillMock, this.options);

        this.clock.tick(10);

        this.attachSpies(resizingInstance);
        resizingInstance.option('tableResizing', { enabled: false });

        assert.strictEqual(resizingInstance.enabled, false, 'enabled is applied');
        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'module events are disabled');
    });
});
