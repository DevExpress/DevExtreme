import $ from "jquery";

import "ui/html_editor";
const FOCUS_STATE_CLASS = "dx-state-focused";
const { test, module } = QUnit;

const moduleConfig = {
    beforeEach: () => {
        this.instance = $("#htmlEditor")
            .dxHtmlEditor({
                value: "<p>Test 1</p><p>Test 2</p><p>Test 3</p>"
            })
            .dxHtmlEditor("instance");
    }
};

module("Events", moduleConfig, () => {
    test("focusIn event by API", (assert) => {
        const focusInStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.instance.on("focusIn", focusInStub);
        this.instance.on("focusOut", focusOutStub);

        this.instance.focus();

        assert.strictEqual(focusInStub.callCount, 1, "Editor is focused");
        assert.strictEqual(focusOutStub.callCount, 0, "Editor isn't blurred");

        $(this.instance._focusTarget()).blur();

        assert.strictEqual(focusInStub.callCount, 1, "Editor is focused");
        assert.strictEqual(focusOutStub.callCount, 1, "Editor is blurred");
    });

    test("focus events should toggle 'dx-state-focused' class", (assert) => {
        const clock = sinon.useFakeTimers();

        this.instance.focus();
        clock.tick();

        const $element = this.instance.$element();
        const $focusTarget = this.instance._focusTarget();

        assert.ok($element.hasClass(FOCUS_STATE_CLASS), "element has focused class");
        assert.ok($focusTarget.hasClass(FOCUS_STATE_CLASS), "focusTarget has focused class");

        $(this.instance._focusTarget()).blur();
        clock.tick();

        assert.notOk($element.hasClass(FOCUS_STATE_CLASS), "element doesn't have focused class");
        assert.notOk($focusTarget.hasClass(FOCUS_STATE_CLASS), "focusTarget doesn't have focused class");
        clock.restore();
    });
});
