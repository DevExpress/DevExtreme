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
            </table>\
            ').appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {},
            getModule: (moduleName) => this.quillMock[moduleName]
        };

        this.options = {
            _quillContainer: this.$table,

            editorInstance: {
                on: () => {},
                off: () => {},
                $element: () => this.$element,
                addCleanCallback: () => {},
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getContent: () => this.$element,
                _getQuillContainer: () => this.$element,
                option: () => {}
            }
        };

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
            this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
        };

    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test, module } = QUnit;

module('Table Context Menu module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const tableUIInstance = new TableUI(this.quillMock, this.options);
        this.attachSpies(tableUIInstance);

        assert.notOk(tableUIInstance.enabled, 'module is disabled if option is not defined');
        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are not attached on module initialization');
    });

    test('create enabled module instance', function(assert) {
        this.options.enabled = true;
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        assert.ok(tableUIInstance.enabled, 'module is enabled if the option is defined as true');
    });

    test('events should be attached if the option is enabled at runtime', function(assert) {
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);
        tableUIInstance.option('enabled', true);

        assert.strictEqual(this.attachEventsSpy.callCount, 1, 'Events are attached on module initialization at runtime');
    });

    test('events should be detached if the option is disabled at runtime', function(assert) {
        this.options.enabled = true;
        const tableUIInstance = new TableUI(this.quillMock, this.options);

        this.attachSpies(tableUIInstance);
        tableUIInstance.option('enabled', false);

        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached on module deinitialization at runtime');
    });
});
