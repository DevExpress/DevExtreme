import $ from 'jquery';
import ImageCursor from '__internal/ui/html_editor/modules/m_imageCursor';
import { name as clickEvent } from 'common/core/events/click';

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor').css({ margin: '10px' });
        this.$markup = $('<p>test text</p><p><br></p><p><img src="/uploadDirectory/fakefile1.jpeg"></p>').appendTo(this.$element);

        this.selectedRange = { index: 0, length: 0 };

        this.preventImageCursor = false;

        this.quillMock = {
            root: this.$element.get(0),
            on: (e) => {},
            off: (e) => {},
            getModule: (moduleName) => this.quillMock[moduleName],
            scroll: {
                find: () => {
                    return { offset: e => 4 };
                }
            },
            setSelection: () => {}
        };

        this.options = {
            _quillContainer: this.$markup,

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

module('ImageCursor module', moduleConfig, () => {
    test('events should be detached if the clean method is called', function(assert) {
        this.options.fileUploadMode = 'server';
        const ImageCursorInstance = new ImageCursor(this.quillMock, this.options);

        this.attachSpies(ImageCursorInstance);
        ImageCursorInstance.clean();

        assert.strictEqual(this.attachEventsSpy.callCount, 0, 'Events are attached');
        assert.strictEqual(this.detachEventsSpy.callCount, 1, 'Events are detached');
    });

    test('events should not modify selection if target is not image', function(assert) {
        new ImageCursor(this.quillMock, this.options);

        const setSelectionSpy = sinon.spy(this.quillMock, 'setSelection');

        this.$markup.trigger(clickEvent);

        assert.strictEqual(setSelectionSpy.callCount, 0, 'selection is modified');
    });

    test('events should modify selection if target is image', function(assert) {
        new ImageCursor(this.quillMock, this.options);

        const setSelectionSpy = sinon.spy(this.quillMock, 'setSelection');

        this.$markup.find('img').trigger($.Event(clickEvent, { target: { tagName: 'img' } }));

        assert.strictEqual(setSelectionSpy.callCount, 1, 'selection is modified');
        assert.strictEqual(setSelectionSpy.getCall(0).args[0], 5, 'selection is modified');
    });
});
