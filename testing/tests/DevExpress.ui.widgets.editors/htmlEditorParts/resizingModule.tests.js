import $ from "jquery";

import Resizing from "ui/html_editor/modules/resizing";
import devices from "core/devices";
import { name as clickEvent } from "events/click";

import PointerMock from "../../../helpers/pointerMock.js";

const RESIZE_FRAME_CLASS = "dx-resize-frame";

const RESIZABLE_HANDLE_RIGHT_CLASS = "dx-resizable-handle-right";
const RESIZABLE_HANDLE_BOTTOM_CLASS = "dx-resizable-handle-bottom";
const DX_TOUCH_DEVICE_CLASS = "dx-touch-device";

const IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWNgZGT8DwABDQEDEkMQNQAAAABJRU5ErkJggg==";
const IMAGE_SIZE = 100;
const BORDER_PADDING_WIDTH = 2;

const moduleConfig = {
    beforeEach: function() {
        this.$element = $("#htmlEditor").css({ position: "relative", margin: "10px" });
        this.$image = $("<img>").attr({
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            src: IMAGE
        }).appendTo(this.$element);
        this.$div = $("<div>").appendTo(this.$element);

        this.quillMock = {
            root: this.$element.get(0)
        };

        this.options = {
            editorInstance: {
                $element: () => this.$element,
                _createComponent: ($element, widget, options) => new widget($element, options),
                _getQuillContainer: () => this.$element
            }
        };

        this.attachSpies = (instance) => {
            this.attachEventsSpy = sinon.spy(instance, "_attachEvents");
            this.detachEventsSpy = sinon.spy(instance, "_detachEvents");
            this.createFrameSpy = sinon.spy(instance, "_createResizeFrame");
            this.updateFrameSpy = sinon.spy(instance, "updateFramePosition");
            this.showFrameSpy = sinon.spy(instance, "showFrame");
            this.hideFrameSpy = sinon.spy(instance, "hideFrame");
        };
    }
};

const { test, module } = QUnit;

module("Resizing module", moduleConfig, () => {
    test("create module instance with default options", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        assert.strictEqual(this.$element.find(`.${RESIZE_FRAME_CLASS}`).length, 0, "There is no resize frame element");
        assert.deepEqual(resizingInstance.allowedTargets, ["image"], "default allowed targets");
        assert.notOk(resizingInstance.enabled, "module disabled by default");
    });

    test("create module instance with enabled equals to 'true'", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.strictEqual($resizeFrame.length, 1, "There is a resize frame element");
        assert.notOk($resizeFrame.is(":visible"), "Resize frame element is hidden");
        assert.deepEqual(resizingInstance.allowedTargets, ["image"], "default allowed targets");
    });

    test("module should detach events on clean", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);

        this.attachSpies(resizingInstance);
        resizingInstance.clean();

        assert.ok(this.detachEventsSpy.calledOnce, "events has been detached on 'clean'");
    });

    test("module should attach and detach events on the 'enabled' option changing", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        this.attachSpies(resizingInstance);
        resizingInstance.option("enabled", true);

        assert.ok(this.attachEventsSpy.calledOnce, "events has been attached");
        assert.ok(this.detachEventsSpy.notCalled, "events hasn't detached");

        resizingInstance.option("enabled", false);

        assert.ok(this.attachEventsSpy.calledOnce, "events has been attached");
        assert.ok(this.detachEventsSpy.calledOnce, "events has been detached");
    });

    test("'allowedTargets' option should accept Array only", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        resizingInstance.option("allowedTargets", []);

        assert.deepEqual(resizingInstance.allowedTargets, [], "Empty array accepted");

        resizingInstance.option("allowedTargets", true);

        assert.deepEqual(resizingInstance.allowedTargets, [], "Boolean value rejected");
    });

    test("'option' can apply a set of options", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        resizingInstance.option("mediaResizing", { allowedTargets: ["video"], enabled: true });

        assert.ok(resizingInstance.enabled, "'enabled' option has been applied");
        assert.deepEqual(resizingInstance.allowedTargets, ["video"], "'allowedTargets' option has been applied");
    });

    test("click on an image with default module options", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        this.attachSpies(resizingInstance);
        this.$image.trigger(clickEvent);

        assert.notOk(resizingInstance._$target, "There is no active target");
        assert.ok(this.updateFrameSpy.notCalled, "Frame isn't updated");
        assert.ok(this.showFrameSpy.notCalled, "Frame isn't shown");
    });

    test("click on an image with enabled resizing", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.attachSpies(resizingInstance);
        this.$image.trigger(clickEvent);

        const frameClientRect = $resizeFrame
            .get(0)
            .getBoundingClientRect();

        assert.ok(resizingInstance._$target, "There is active target");
        assert.ok(this.updateFrameSpy.calledOnce, "Frame has been updated");
        assert.ok(this.showFrameSpy.calledOnce, "Frame has been shown");
        assert.ok($resizeFrame.is(":visible"), "Frame element is visible");
        assert.strictEqual(frameClientRect.width, IMAGE_SIZE + BORDER_PADDING_WIDTH * 2, "Frame has a correct width");
        assert.strictEqual(frameClientRect.height, IMAGE_SIZE + BORDER_PADDING_WIDTH * 2, "Frame has a correct height");
    });

    test("click on an div with enabled resizing", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.attachSpies(resizingInstance);
        this.$div.trigger(clickEvent);

        assert.notOk(resizingInstance._$target, "There is no active target");
        assert.ok(this.updateFrameSpy.notCalled, "Frame hasn't been updated");
        assert.ok(this.showFrameSpy.notCalled, "Frame hasn't been shown");
        assert.notOk($resizeFrame.is(":visible"), "Frame element isn't visible");
    });

    test("click on an image after disable image resizing", function(assert) {
        const resizingInstance = new Resizing(this.quillMock, this.options);

        this.attachSpies(resizingInstance);
        resizingInstance.option("enabled", true);
        resizingInstance.option("allowedTargets", []);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.$image.trigger(clickEvent);

        assert.notOk(resizingInstance._$target, "There is no active target");
        assert.ok(this.updateFrameSpy.notCalled, "Frame hasn't been updated");
        assert.ok(this.showFrameSpy.notCalled, "Frame hasn't been shown");
        assert.notOk($resizeFrame.is(":visible"), "Frame element isn't visible");
    });

    test("click outside the target should hide resize frame", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.attachSpies(resizingInstance);
        this.$image.trigger(clickEvent);

        assert.ok(this.showFrameSpy.calledOnce, "Frame has been shown after click on an image");

        this.$element.trigger(clickEvent);

        assert.notOk(resizingInstance._$target, "There is no active target");
        assert.ok(this.hideFrameSpy.calledOnce, "Frame has been hidden");
        assert.notOk($resizeFrame.is(":visible"), "Frame element isn't visible");
    });

    test("keydown event should hide resize frame", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.attachSpies(resizingInstance);
        this.$image.trigger(clickEvent);

        assert.ok(this.showFrameSpy.calledOnce, "Frame has been shown after click on an image");

        this.$element.trigger("keydown");

        assert.notOk(resizingInstance._$target, "There is no active target");
        assert.ok(this.hideFrameSpy.calledOnce, "Frame has been hidden");
        assert.notOk($resizeFrame.is(":visible"), "Frame element isn't visible");
    });

    test("scroll event should update resize frame position", function(assert) {
        this.options.enabled = true;
        const resizingInstance = new Resizing(this.quillMock, this.options);
        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        this.attachSpies(resizingInstance);
        this.$image.trigger(clickEvent);

        assert.ok(this.showFrameSpy.calledOnce, "Frame has been shown after click on an image");
        assert.ok(this.updateFrameSpy.calledOnce, "Frame position has been updated one time");

        this.$element.trigger("scroll");

        assert.ok(resizingInstance._$target, "There is an active target");
        assert.ok($resizeFrame.is(":visible"), "Frame element is visible");
        assert.ok(this.updateFrameSpy.calledTwice, "Frame has been updated two times");
        assert.ok(this.hideFrameSpy.notCalled, "Frame hasn't been hidden");
    });

    test("resize frame should change an target size on the frame resizing", function(assert) {
        this.options.enabled = true;
        new Resizing(this.quillMock, this.options);

        this.$image.trigger(clickEvent);

        const $rightHandle = this.$element.find(`.${RESIZABLE_HANDLE_RIGHT_CLASS}`);
        const $bottomHandle = this.$element.find(`.${RESIZABLE_HANDLE_BOTTOM_CLASS}`);

        PointerMock($rightHandle)
            .start()
            .dragStart()
            .drag(10, 0)
            .dragEnd();

        PointerMock($bottomHandle)
            .start()
            .dragStart()
            .drag(0, 5)
            .dragEnd();

        const imageClientRect = this.$image
            .get(0)
            .getBoundingClientRect();

        assert.strictEqual(imageClientRect.height, IMAGE_SIZE + 5, "Image height has been increased");
        assert.strictEqual(imageClientRect.width, IMAGE_SIZE + 10, "Image width has been increased");
    });

    test("check frame position", function(assert) {
        this.options.enabled = true;
        new Resizing(this.quillMock, this.options);

        this.$image.trigger(clickEvent);

        const frameClientRect = this.$element
            .find(`.${RESIZE_FRAME_CLASS}`)
            .get(0)
            .getBoundingClientRect();

        const imageClientRect = this.$image
            .get(0)
            .getBoundingClientRect();

        assert.strictEqual(frameClientRect.left + BORDER_PADDING_WIDTH, imageClientRect.left, "Frame positioned correctly by the left");
        assert.strictEqual(frameClientRect.top + BORDER_PADDING_WIDTH, imageClientRect.top, "Frame positioned correctly by the top");
    });

    test("resize frame should have specific class on mobile devices", function(assert) {
        const currentDevice = devices.current();

        devices.current("iPad");
        this.options.enabled = true;
        new Resizing(this.quillMock, this.options);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.ok($resizeFrame.hasClass(DX_TOUCH_DEVICE_CLASS), "frame has specific class");

        devices.current(currentDevice);
    });

    test("resize frame shouldn't have specific class on desktop", function(assert) {
        const currentDevice = devices.current();

        devices.current("desktop");
        this.options.enabled = true;
        new Resizing(this.quillMock, this.options);

        const $resizeFrame = this.$element.find(`.${RESIZE_FRAME_CLASS}`);

        assert.notOk($resizeFrame.hasClass(DX_TOUCH_DEVICE_CLASS), "frame doesn't have specific class");

        devices.current(currentDevice);
    });
});
