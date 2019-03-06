import $ from "jquery";

import "common.css!";
import "ui/text_box";
import "ui/select_box";
import "ui/number_box";

const { module, test } = QUnit;

function getActionButtons($editor) {
    return {
        $before: $editor.find("> .dx-texteditor-buttons-container:first-child").children(),
        $after: $editor.find(".dx-texteditor-buttons-container:last-child").children()
    };
}

module("button collection", () => {
    test("should render default buttons if the 'buttons' option is not defined", (assert) => {
        const $textBox = $("<div>").dxTextBox({ showClearButton: true });
        const { $before, $after } = getActionButtons($textBox);

        assert.notOk($before.length);
        assert.strictEqual($after.length, 1);
    });

    test("should not render default buttons if the collection is defined", (assert) => {
        const $textBox = $("<div>").dxTextBox({ buttons: [], showClearButton: true });
        const { $before, $after } = getActionButtons($textBox);

        assert.notOk($before.length);
        assert.notOk($after.length);
    });

    test("should be an array", (assert) => {
        const error = new TypeError("'buttons' option must be an array");
        const checkException = (value) => {
            const textBox = $("<div>").dxTextBox({}).dxTextBox("instance");

            assert.throws(() => $("<div>").dxTextBox({ buttons: value }), error);
            assert.throws(() => textBox.option("buttons", value), error);
        };

        ["string", {}, 2, true].forEach(checkException);
    });

    module("button", () => {
        test("should be a string or an object only", (assert) => {
            const error = new TypeError("'buttons' option must include an object or a string items only");
            const checkException = (value) => {
                const textBox = $("<div>").dxTextBox({}).dxTextBox("instance");

                assert.throws(() => $("<div>").dxTextBox({ buttons: [value] }), error);
                assert.throws(() => textBox.option("buttons", [value]), error);
            };

            [0, [], true, null, void 0].forEach(checkException);
        });

        test("should not have buttons with same names", (assert) => {
            const error = new Error("'buttons' option item must have unique name");

            assert.throws(() => $("<div>").dxTextBox({ buttons: ["clear", "clear"] }), error);
            assert.throws(() => $("<div>").dxTextBox({ buttons: [{ name: "name" }, { name: "name" }] }), error);
        });

        module("fields", () => {
            test("'name' filed should be defined for custom buttons", (assert) => {
                const error = new Error("action button must have a name");

                assert.throws(() => $("<div>").dxTextBox({ buttons: [{}] }), error);
            });

            test("'name' filed should be a string", (assert) => {
                const error = new TypeError("action button's 'name' field must be a string");
                const checkException = (value) => {
                    const textBox = $("<div>").dxTextBox({}).dxTextBox("instance");

                    assert.throws(() => $("<div>").dxTextBox({ buttons: [{ name: value }] }), error);
                    assert.throws(() => textBox.option("buttons", [{ name: value }]), error);
                };

                [1, [], {}, false, null, void 0].forEach(checkException);
            });

            test("'location' field should be 'after' or 'before' string only", (assert) => {
                const error = new TypeError("action button's 'location' property can be 'after' or 'before' only");

                assert.throws(() => $("<div>").dxTextBox({ buttons: [{ name: "name", location: "incorrect" }] }), error);
            });

            test("'options' and 'location' fields should not be required", (assert) => {
                const $textBox = $("<div>").dxTextBox({ buttons: [{ name: "name1" }, { name: "name2" }] });
                const { $before, $after } = getActionButtons($textBox);

                assert.notOk($before.length);
                assert.strictEqual($after.length, 2);
            });
        });
    });
});

module("API", () => {
    test("'getButton' method should returns action button instance", (assert) => {
        const selectBox = $("<div>")
            .dxSelectBox({
                showClearButton: true,
                text: "someText",
                buttons: ["clear", { name: "custom", options: { text: "customButtonText" } }, "dropDown"]
            })
            .dxSelectBox("instance");

        const clearButton = selectBox.getButton("clear");
        const fakeButton = selectBox.getButton("fake");
        const dropDownButton = selectBox.getButton("dropDown");
        const customButton = selectBox.getButton("custom");

        assert.ok(clearButton.hasClass("dx-clear-button-area"));
        assert.strictEqual(fakeButton, null);
        assert.ok(dropDownButton.$element().hasClass("dx-dropdowneditor-button"));
        assert.strictEqual(customButton.option("text"), "customButtonText");
    });
});

module("rendering", () => {
    function getButtonPlaceHolders($container) {
        return $container.filter(":empty");
    }

    module("textBox", () => {
        function isClearButton($element) {
            return $element.hasClass("dx-clear-button-area");
        }

        test("should render 'clear' button only after it becomes visible", (assert) => {
            const $textBox = $("<div>").dxTextBox({});
            const textBox = $textBox.dxTextBox("instance");
            let { $before, $after } = getActionButtons($textBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            textBox.option({ showClearButton: true });

            const actionButtons = getActionButtons($textBox);

            $before = actionButtons.$before;
            $after = actionButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.notOk(getButtonPlaceHolders($after).length);
            assert.ok(isClearButton($after.eq(0)));
        });

        test("should render predefined button ('clear')", (assert) => {
            const $textBox = $("<div>").dxTextBox({ showClearButton: true, buttons: ["clear"] });
            const { $before, $after } = getActionButtons($textBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 1);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test("should have only 'clear' predefined button", (assert) => {
            const error = new Error("editor does not have 'fakeButtonName' action button");

            assert.throws(() => $("<div>").dxTextBox({ buttons: ["fakeButtonName"] }), error);
        });

        test("custom button should not have 'clear' name", (assert) => {
            const error = new Error("'clear' name reserved for the predefined action button");

            assert.throws(() => $("<div>").dxTextBox({ buttons: [{ name: "clear" }] }), error);
        });
    });

    module("numberBox", () => {
        test("should render 'spins' buttons only after they become visible", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({ showClearButton: true });
            const numberBox = $numberBox.dxNumberBox("instance");
            let { $before, $after } = getActionButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            numberBox.option({ text: "Some text", showSpinButtons: true });

            const actionButtons = getActionButtons($numberBox);

            $before = actionButtons.$before;
            $after = actionButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test("should render predefined buttons ('clear', 'spins')", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ["clear", "spins"]
            });
            const { $before, $after } = getActionButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test("should have only 'clear', 'spins' predefined buttons", (assert) => {
            const error = new Error("editor does not have 'fakeButtonName' action button");

            assert.throws(() => $("<div>").dxNumberBox({ buttons: ["fakeButtonName"] }), error);
        });

        test("custom button should not have 'clear' or 'spins' name", (assert) => {
            assert.throws(() => $("<div>").dxNumberBox({ buttons: [{ name: "clear" }] }),
                new Error("'clear' name reserved for the predefined action button"));
            assert.throws(() => $("<div>").dxNumberBox({ buttons: [{ name: "spins" }] }),
                new Error("'spins' name reserved for the predefined action button"));
        });
    });

    module("dropDownEditors", () => {
        test("should render 'dropDown' button only after it becomes visible", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({ showClearButton: true, showDropDownButton: false });
            const selectBox = $selectBox.dxSelectBox("instance");
            let { $before, $after } = getActionButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);

            selectBox.option({ text: "Some text", showDropDownButton: true });

            const actionButtons = getActionButtons($selectBox);

            $before = actionButtons.$before;
            $after = actionButtons.$after;

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.notOk(getButtonPlaceHolders($after).length);
        });

        test("should render predefined buttons ('clear', 'dropDown')", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({ showClearButton: true, buttons: ["clear", "dropDown"] });
            const { $before, $after } = getActionButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            assert.strictEqual(getButtonPlaceHolders($after).length, 0);
        });

        test("should have only 'clear', 'dropDown' predefined button", (assert) => {
            const error = new Error("editor does not have 'fakeButtonName' action button");

            assert.throws(() => $("<div>").dxSelectBox({ buttons: ["fakeButtonName"] }), error);
        });

        test("custom button should not have 'clear' or 'dropDown' name", (assert) => {
            assert.throws(() => $("<div>").dxSelectBox({ buttons: [{ name: "clear" }] }),
                new Error("'clear' name reserved for the predefined action button"));
            assert.throws(() => $("<div>").dxSelectBox({ buttons: [{ name: "dropDown" }] }),
                new Error("'dropDown' name reserved for the predefined action button"));
        });
    });
});
