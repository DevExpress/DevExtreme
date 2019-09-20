import $ from "jquery";

import "ui/html_editor";
import { name as clickEvent } from "events/click";

import PointerMock from "../../../helpers/pointerMock.js";

const { test, module } = QUnit;

const RESIZE_FRAME_CLASS = "dx-resize-frame";
const RESIZABLE_HANDLER_CLASS = "dx-resizable-handle-corner-bottom-right";

const IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==";
const IMAGE_SIZE = 100;

module("Resizing integration", {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#htmlEditor");
        this.options = {
            value: `<img src="${IMAGE}" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}">`
        };

        this.createWidget = () => {
            this.instance = this.$element
                .dxHtmlEditor(this.options)
                .dxHtmlEditor("instance");
        };
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    test("Click on an image with default resize module config", (assert) => {
        this.createWidget();

        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, "There is no resize frame");
    });

    test("Click on an image after enable resizing via optionChange", (assert) => {
        this.createWidget();

        this.instance.option("mediaResizing.enabled", true);

        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, "There is resize frame");
        assert.ok($resizeFrame.is(":visible"), "Resize frame is visible");
    });

    test("Click on an image with enabled resizing", (assert) => {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, "There is resize frame");
        assert.ok($resizeFrame.is(":visible"), "Resize frame is visible");
    });

    test("Click on an image after disable resizing via optionChange", (assert) => {
        this.options.mediaResizing = { enabled: true };
        this.createWidget();

        this.instance.option("mediaResizing.enabled", false);

        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 0, "There is resize frame");
    });

    test("Click on an image with enabled resizing but remove 'image' from allowed resizing targets", (assert) => {
        this.createWidget();

        this.instance.option("mediaResizing", {
            enabled: true,
            allowedTargets: []
        });

        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, "There is resize frame, resizing enabled");
        assert.notOk($resizeFrame.is(":visible"), "Resize frame isn't visible, image isn't resizable");
    });

    test("check editor value after resizing", (assert) => {
        const done = assert.async();
        const hOffset = 10;
        const vOffset = 5;

        this.options.onValueChanged = (e) => {
            const $image = $(e.value).children();

            assert.ok($image.is("img"), "It's an image");
            assert.strictEqual(parseInt($image.attr("height")), IMAGE_SIZE + vOffset, `Height + ${vOffset}`);
            assert.strictEqual(parseInt($image.attr("width")), IMAGE_SIZE + hOffset, `Width + ${hOffset}`);
            done();
        };
        this.options.mediaResizing = { enabled: true };

        this.createWidget();
        this.$element
            .find("img")
            .trigger(clickEvent);

        const $resizableHandler = $(`.${RESIZABLE_HANDLER_CLASS}`);

        PointerMock($resizableHandler)
            .start()
            .dragStart()
            .drag(hOffset, vOffset)
            .dragEnd();
    });

});
