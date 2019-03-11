import $ from "jquery";

import "common.css!";
import "ui/text_box";
import "ui/select_box";
import "ui/number_box";

const { module, test } = QUnit;

function getActionButtons($editor) {
    return {
        $before: $editor.find(".dx-texteditor-buttons-container:first-child").children(),
        $after: $editor.find(".dx-texteditor-buttons-container:last-child").children()
    };
}

function isClearButton($element) {
    return $element.hasClass("dx-clear-button-area");
}

function isSpinButton($element) {
    return $element.hasClass("dx-numberbox-spin-container");
}

function isDropDownButton($element) {
    return $element.hasClass("dx-dropdowneditor-button");
}

function hasInvisibleClass($element) {
    return $element.hasClass("dx-state-invisible");
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

        QUnit.test("should not render 'clear' button if showClearButton is false", function(assert) {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: false,
                buttons: ["clear"],
                value: "text"
            });

            const $after = getActionButtons($textBox).$after;
            assert.strictEqual($after.length, 1);
            assert.strictEqual(getButtonPlaceHolders($after).length, 1);
        });

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

        test("custom button with location 'before' should be rendered with it's configuration", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: false,
                value: "text",
                buttons: [{
                    name: "custom",
                    location: "before",
                    options: {
                        text: "custom"
                    }
                }]
            });

            const actionButtons = getActionButtons($textBox);

            assert.strictEqual(actionButtons.$before.length, 1);
            assert.strictEqual(actionButtons.$before.text(), "custom");
            assert.strictEqual(actionButtons.$after.length, 0);
        });

        test("custom button with location 'after' should be rendered with it's configuration", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: false,
                value: "text",
                buttons: [{
                    name: "custom",
                    location: "after",
                    options: {
                        text: "custom"
                    }
                }]
            });

            const actionButtons = getActionButtons($textBox);

            assert.strictEqual(actionButtons.$after.length, 1);
            assert.strictEqual(actionButtons.$after.text(), "custom");
            assert.strictEqual(actionButtons.$before.length, 0);
        });
    });

    module("numberBox", () => {
        test("should not render default buttons if the buttons option is an empty array", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({ buttons: [], showClearButton: true });
            const { $before, $after } = getActionButtons($numberBox);

            assert.notOk($before.length);
            assert.notOk($after.length);
        });

        test("widget should not render a clear button if 'buttons' option have no string for it", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ["spins"],
                value: 1
            });
            const $after = getActionButtons($numberBox).$after;

            assert.ok($after.length, 1);
            assert.ok(isSpinButton($after.eq(0)));
        });

        test("should render 'spins' buttons only after they become visible", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({ showClearButton: true });
            const numberBox = $numberBox.dxNumberBox("instance");
            let { $before, $after } = getActionButtons($numberBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: Stage3: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
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
        test("should render drop down button", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({ buttons: ["dropDown"], items: ["1", "2"], value: "1" });
            const $after = getActionButtons($selectBox).$after;

            assert.strictEqual($after.length, 1);
            assert.ok(isDropDownButton($after.eq(0)));
        });

        test("should not render default buttons if the buttons option is an empty array", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({ buttons: [], showClearButton: true, items: ["1", "2"], value: "1" });
            const { $before, $after } = getActionButtons($selectBox);

            assert.notOk($before.length);
            assert.notOk($after.length);
        });

        test("should render 'dropDown' button only after it becomes visible", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({ showClearButton: true, showDropDownButton: false });
            const selectBox = $selectBox.dxSelectBox("instance");
            let { $before, $after } = getActionButtons($selectBox);

            assert.notOk($before.length);
            assert.strictEqual($after.length, 2);
            // TODO: Stage3: assert.strictEqual(getButtonPlaceHolders($after).length, 2);
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

        test("buttons is rendered with fieldTemplate", (assert) => {
            var $selectBox = $("<div>").dxSelectBox({
                showClearButton: true,
                buttons: [{
                    name: "before1",
                    location: "before",
                    options: {
                        text: "before1"
                    }
                }, "clear", "dropDown"],
                fieldTemplate: function(value) {
                    const $textBox = $("<div>").dxTextBox();
                    return $("<div>").text(value + this.option("value")).append($textBox);
                },
                value: "test"
            });

            const { $before, $after } = getActionButtons($selectBox);

            assert.strictEqual($before.eq(0).text(), "before1");
            assert.ok(isClearButton($after.eq(1)));
            assert.ok(isDropDownButton($after.eq(2)));
        });
    });
});


module("reordering", () => {

    module("textBox", () => {
        test("custom button with location 'after' should be rendered after the clear button", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: [
                    "clear", {
                        name: "custom",
                        location: "after",
                        options: {
                            text: "custom"
                        }
                    }],
                value: "text"
            });

            const $after = getActionButtons($textBox).$after;

            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.strictEqual($after.eq(1).text(), "custom");
        });

        test("the group of predefined and custom buttons should have correct order", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: [{
                    name: "before1",
                    location: "before",
                    options: {
                        text: "before1"
                    }
                }, {
                    name: "after1",
                    location: "after",
                    options: {
                        text: "after1"
                    }
                },
                "clear", {
                    name: "after2",
                    location: "after",
                    options: {
                        text: "after2"
                    }
                }],
                value: "text"
            });

            const { $before, $after } = getActionButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($before.text(), "before1");

            assert.strictEqual($after.length, 3);
            assert.strictEqual($after.eq(0).text(), "after1");
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), "after2");
        });

        test("buttons should have correct order if 'before' custom button is after 'after' buttons in the 'buttons' array", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: ["clear", {
                    name: "after1",
                    location: "after",
                    options: {
                        text: "after1"
                    }
                }, {
                    name: "before1",
                    location: "before",
                    options: {
                        text: "before1"
                    }
                }],
                value: "text"
            });

            const { $before, $after } = getActionButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($before.text(), "before1");

            assert.strictEqual($after.length, 2);
            assert.ok(isClearButton($after.eq(0)));
            assert.strictEqual($after.eq(1).text(), "after1");
        });

    });

    module("numberBox", () => {

        test("buttons option can reorder predefined buttons", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: ["spins", "clear"],
                value: 1
            });

            const $after = getActionButtons($numberBox).$after;
            assert.ok(isSpinButton($after.eq(0)));
            assert.ok(isClearButton($after.eq(1)));
        });

        test("widget should render custom and predefined buttons in the right order", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({
                showClearButton: true,
                showSpinButtons: true,
                buttons: [{
                    name: "after1",
                    location: "after",
                    options: {
                        text: "after1"
                    }
                }, "clear", {
                    name: "after2",
                    location: "after",
                    options: {
                        text: "after2"
                    }
                }, "spins", {
                    name: "after3",
                    location: "after",
                    options: {
                        text: "after3"
                    }
                }, {
                    name: "before1",
                    location: "before",
                    options: {
                        text: "before1"
                    }
                }],
                value: 1
            });

            const { $before, $after } = getActionButtons($numberBox);

            assert.strictEqual($after.eq(0).text(), "after1");
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), "after2");
            assert.ok(isSpinButton($after.eq(3)));
            assert.strictEqual($after.eq(4).text(), "after3");
            assert.strictEqual($before.length, 1);
        });

    });

    module("dropDownEditors", () => {
        test("buttons option can reorder predefined buttons", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({
                showClearButton: true,
                buttons: ["dropDown", "clear"],
                value: 1
            });

            const $after = getActionButtons($selectBox).$after;
            assert.ok(isDropDownButton($after.eq(0)));
            assert.ok(isClearButton($after.eq(1)));
        });

        test("widget should render custom and predefined buttons in the right order", (assert) => {
            const $selectBox = $("<div>").dxSelectBox({
                showClearButton: true,
                buttons: [{
                    name: "after1",
                    location: "after",
                    options: {
                        text: "after1"
                    }
                }, "clear", {
                    name: "after2",
                    location: "after",
                    options: {
                        text: "after2"
                    }
                }, "dropDown", {
                    name: "after3",
                    location: "after",
                    options: {
                        text: "after3"
                    }
                }, {
                    name: "before1",
                    location: "before",
                    options: {
                        text: "before1"
                    }
                }],
                value: 1
            });

            const { $before, $after } = getActionButtons($selectBox);

            assert.strictEqual($after.eq(0).text(), "after1");
            assert.ok(isClearButton($after.eq(1)));
            assert.strictEqual($after.eq(2).text(), "after2");
            assert.ok(isDropDownButton($after.eq(3)));
            assert.strictEqual($after.eq(4).text(), "after3");
            assert.strictEqual($before.length, 1);
        });
    });
});


module("collection updating", () => {

    module("textBox", () => {
        function isClearButton($element) {
            return $element.hasClass("dx-clear-button-area");
        }

        test("it is able to change internal custom button option", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: ["clear", {
                    name: "custom",
                    location: "after",
                    options: {
                        text: "custom"
                    }
                }],
                value: "text"
            });
            const textBox = $textBox.dxTextBox("instance");

            textBox.option("buttons[1].location", "before");
            const { $before, $after } = getActionButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($after.length, 0);
        });

        test("it is able to reorder buttons", (assert) => {
            const customButtonConfig = {
                name: "custom",
                location: "after",
                options: {
                    text: "custom"
                }
            };

            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: ["clear", customButtonConfig],
                value: "text"
            });
            const textBox = $textBox.dxTextBox("instance");

            textBox.option("buttons", [customButtonConfig, "clear"]);

            const $after = getActionButtons($textBox).$after;

            assert.strictEqual($after.eq(0).text(), "custom");
            assert.ok(isClearButton($after.eq(1)));
        });

        test("it is able to change buttons", (assert) => {
            const customButtonConfig = {
                name: "custom",
                location: "after",
                options: {
                    text: "custom"
                }
            };

            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: ["clear", customButtonConfig],
                value: "text"
            });
            const textBox = $textBox.dxTextBox("instance");

            textBox.option("buttons", [
                {
                    name: "custom2",
                    location: "before",
                    options: {
                        text: "custom2"
                    }
                },
                "clear",
                customButtonConfig
            ]);

            const { $before, $after } = getActionButtons($textBox);

            assert.strictEqual($before.length, 1);
            assert.strictEqual($after.length, 2);
            assert.strictEqual($before.eq(0).text(), "custom2");
            assert.ok(isClearButton($after.eq(0)));
        });

        test("buttons and showClearButton options should control clear button visibility", (assert) => {
            const $textBox = $("<div>").dxTextBox({
                showClearButton: true,
                buttons: ["clear"],
                value: "text"
            });
            const textBox = $textBox.dxTextBox("instance");

            let $after = getActionButtons($textBox).$after;
            assert.strictEqual($after.length, 1);

            textBox.option("buttons", []);
            $after = getActionButtons($textBox).$after;
            assert.strictEqual($after.length, 0);

            textBox.option("buttons", ["clear"]);
            $after = getActionButtons($textBox).$after;
            assert.strictEqual($after.length, 1);

            textBox.option("showClearButton", false);
            $after = getActionButtons($textBox).$after;
            assert.strictEqual($after.length, 1);
            assert.ok(hasInvisibleClass($after.eq(0)));
        });

    });

    module("numberBox", () => {
        test("number box should work with 'buttons' option", (assert) => {
            const $numberBox = $("<div>").dxNumberBox({
                showSpinButtons: true,
                buttons: ["spins"],
                value: 1
            });
            const numberBox = $numberBox.dxNumberBox("instance");

            let $after = getActionButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);

            numberBox.option("buttons", []);
            $after = getActionButtons($numberBox).$after;
            assert.strictEqual($after.length, 0);

            numberBox.option("buttons", ["spins"]);
            $after = getActionButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);

            numberBox.option("showSpinButtons", false);
            $after = getActionButtons($numberBox).$after;
            assert.strictEqual($after.length, 1);
            assert.ok(hasInvisibleClass($after.eq(0).children().eq(0)));
            assert.ok(hasInvisibleClass($after.eq(0).children().eq(1)));
        });
    });

    module("dropDownEditors", () => {
        test("Drop button template should work with 'buttons' option", (assert) => {
            var buttonTemplate = function() {
                return "<div>Template</div>";
            };

            var $selectBox = $("<div>").dxSelectBox({
                items: ["1", "2"]
            });

            const selectBox = $selectBox.dxSelectBox("instance");

            selectBox.option("buttons", ["dropDown"]);
            selectBox.option("dropDownButtonTemplate", buttonTemplate);

            let $after = getActionButtons($selectBox).$after;
            assert.strictEqual($after.length, 1);
            assert.strictEqual($after.eq(0).text(), "Template");

            selectBox.option("buttons", []);
            $after = getActionButtons($selectBox).$after;
            assert.strictEqual($after.length, 0, "Button was not rendered");

            selectBox.option("buttons", ["dropDown"]);
            $after = getActionButtons($selectBox).$after;
            assert.strictEqual($after.eq(0).text(), "Template");

            selectBox.option("dropDownButtonTemplate", null);
            $after = getActionButtons($selectBox).$after;
            assert.ok(isDropDownButton($after.eq(0)));
        });
    });
});
