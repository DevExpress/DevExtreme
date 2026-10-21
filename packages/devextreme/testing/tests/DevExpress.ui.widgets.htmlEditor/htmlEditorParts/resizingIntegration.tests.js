import $ from 'jquery';

import 'ui/html_editor';
import { name as clickEvent } from 'common/core/events/click';

import PointerMock from '../../../helpers/pointerMock.js';

const { test, module } = QUnit;

const RESIZE_FRAME_CLASS = 'dx-resize-frame';
const RESIZABLE_CLASS = 'dx-resizable';
const RESIZABLE_HANDLER_CLASS = 'dx-resizable-handle-corner-bottom-right';

const IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==';
const IMAGE_SIZE = 100;
const BORDER_PADDING_WIDTH = 2;
const HTML_EDITOR_CONTENT_MARGIN = 1;

module('Resizing integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $('#htmlEditor');
        this.options = {
            value: `<img src="${IMAGE}" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}">`
        };

        this.createWidget = () => {
            this.instance = this.$element
                .dxHtmlEditor(this.options)
                .dxHtmlEditor('instance');
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    test('resetting the mediaResizing option while resizing is disabled does not throw', function(assert) {
        this.options.mediaResizing = { enabled: false };
        this.createWidget();

        this.instance.option('mediaResizing', undefined);

        assert.ok(true, 'the module is cleaned without an exception');
    });

    test('Click on an image with default resize module config', function(assert) {
        this.createWidget();

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, 'There is no resize frame');
    });

    test('Click on an image after enable resizing via optionChange', function(assert) {
        this.createWidget();

        this.instance.option('mediaResizing.enabled', true);

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'There is resize frame');
        assert.ok($resizeFrame.is(':visible'), 'Resize frame is visible');
    });

    test('Click on an image with enabled resizing', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'There is resize frame');
        assert.ok($resizeFrame.is(':visible'), 'Resize frame is visible');
    });

    test('Click on an image after disable resizing via optionChange', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.instance.option('mediaResizing.enabled', false);

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, 'There is resize frame');
    });

    test('Click on an image after the mediaResizing option is reset and enabled again', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.instance.option('mediaResizing', undefined);
        this.instance.option('mediaResizing', { enabled: true });

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'There is resize frame');
        assert.ok($resizeFrame.is(':visible'), 'Resize frame is visible');
    });

    test('Click on the same image after resizing is disabled and enabled again via optionChange', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();
        const $image = this.$element.find('img');

        $image.trigger(clickEvent);
        this.instance.option('mediaResizing.enabled', false);
        this.instance.option('mediaResizing.enabled', true);
        $image.trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'There is resize frame');
        assert.ok($resizeFrame.is(':visible'), 'Resize frame is visible');
    });

    test('resizing module of a previous render should not handle focusOut after repaint', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();
        const previousFrameHideSpy = sinon.spy(this.instance.getModule('resizing')._$resizeFrame, 'hide');

        this.instance.repaint();
        const currentFrameHideSpy = sinon.spy(this.instance.getModule('resizing')._$resizeFrame, 'hide');

        this.instance.focus();
        $('<input>')
            .appendTo('#qunit-fixture')
            .trigger('focus');

        assert.ok(currentFrameHideSpy.called, 'focusOut hides the frame of the current render');
        assert.ok(previousFrameHideSpy.notCalled, 'focusOut is not handled by the module of the previous render');
    });

    test('Click on an image with enabled resizing but remove \'image\' from allowed resizing targets', function(assert) {
        this.createWidget();

        this.instance.option('mediaResizing', {
            enabled: true,
            allowedTargets: []
        });

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, 'There is resize frame, resizing enabled');
        assert.notOk($resizeFrame.is(':visible'), 'Resize frame isn\'t visible, image isn\'t resizable');
    });

    test('check editor value after resizing with aspect ratio keeping', function(assert) {
        const done = assert.async();
        const hOffset = 10;
        const vOffset = 5;

        this.options.onValueChanged = (e) => {
            const $image = $(e.value).children();

            assert.ok($image.is('img'), 'It\'s an image');
            assert.strictEqual(parseInt($image.attr('height')), IMAGE_SIZE + hOffset, `Height + ${hOffset} because aspect ratio is kept`);
            assert.strictEqual(parseInt($image.attr('width')), IMAGE_SIZE + hOffset, `Width + ${hOffset}`);
            done();
        };
        this.options.mediaResizing = { enabled: true };

        this.createWidget();
        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizableHandler = $(`.${RESIZABLE_HANDLER_CLASS}`);

        PointerMock($resizableHandler)
            .start()
            .dragStart()
            .drag(hOffset, vOffset)
            .dragEnd();
    });


    test('integrated resizable should have keepAspectRatio=true (T1049676)', function(assert) {
        this.options.mediaResizing = { enabled: true };

        this.createWidget();
        this.$element
            .find('img')
            .trigger(clickEvent);

        const resizable = $(`.${RESIZABLE_CLASS}`).dxResizable('instance');

        assert.strictEqual(resizable.option('keepAspectRatio'), true, 'aspect ratio keeping is enabled');
    });

    test('check frame position for list item with nested image', function(assert) {
        this.options = {
            value: `<ol><li><img src="${IMAGE}" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}"></li></ol>`,
            mediaResizing: {
                enabled: true
            }
        };
        this.createWidget();

        const $image = this.$element.find('img');

        $image.trigger(clickEvent);

        const { left: frameLeft, top: frameTop } = this.$element
            .find(`.${RESIZE_FRAME_CLASS}`)
            .get(0)
            .getBoundingClientRect();

        const { left: imageLeft, top: imageTop } = $image
            .get(0)
            .getBoundingClientRect();

        assert.strictEqual(frameLeft + BORDER_PADDING_WIDTH, imageLeft, 'Frame positioned correctly by the left');
        assert.strictEqual(frameTop + BORDER_PADDING_WIDTH + HTML_EDITOR_CONTENT_MARGIN, imageTop, 'Frame positioned correctly by the top');
    });

    test('resizing frame should update its position after formatting', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);
        const { top: initialTop, left: initialLeft } = $resizeFrame.offset();

        this.instance.formatLine(0, 1, 'align', 'center');
        const { top: currentTop, left: currentLeft } = $resizeFrame.offset();
        assert.strictEqual(currentTop, initialTop, 'Resize frame save initial top position');
        assert.notEqual(currentLeft, initialLeft, 'Resize frame updates left position');
    });

    test('resizing frame should become hidden when another element focused', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.instance.focus();
        this.$element
            .find('img')
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        $('<input>')
            .appendTo('#qunit-fixture')
            .trigger('focus');

        assert.notOk($resizeFrame.is(':visible'), 'Resize frame isn\'t visible, image isn\'t resizable');
    });

    test('editor should move selection to the image after click on image', function(assert) {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.$element
            .find('img')
            .trigger(clickEvent);

        const { index, length } = this.instance.getSelection();

        assert.strictEqual(index, 1, 'by image - index is 1');
        assert.strictEqual(length, 0, 'by default - zero length');
    });
});
