import $ from "jquery";

import "ui/html_editor";

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
});
