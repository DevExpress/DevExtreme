import $ from 'jquery';

import Resizing from 'ui/html_editor/modules/resizing';

// import PointerMock from '../../../helpers/pointerMock.js';

const RESIZE_FRAME_CLASS = 'dx-resize-frame';

const IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==';
const IMAGE_SIZE = 100;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor').css({ position: 'relative', margin: '10px' });
        this.$image = $('<img>').attr({
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            src: IMAGE
        }).appendTo(this.$element);
        this.$div = $('<div>').appendTo(this.$element);

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

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, '_attachEvents');
            this.detachEventsSpy = sinon.spy(instance, '_detachEvents');
            this.createFrameSpy = sinon.spy(instance, '_createResizeFrame');
            this.updateFrameSpy = sinon.spy(instance, 'updateFramePosition');
            this.showFrameSpy = sinon.spy(instance, 'showFrame');
            this.hideFrameSpy = sinon.spy(instance, 'hideFrame');
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
};

const { test, module } = QUnit;

module('Resizing module', moduleConfig, () => {
    test('create module instance with default options', function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        assert.strictEqual(this.$element.find(`.${RESIZE_FRAME_CLASS}`).length, 0, 'There is no resize frame element');
        assert.deepEqual(resizingInstance.allowedTargets, ['image'], 'default allowed targets');
        assert.notOk(resizingInstance.enabled, 'module disabled by default');
    });


});
