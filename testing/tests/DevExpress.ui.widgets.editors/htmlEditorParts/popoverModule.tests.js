import $ from "jquery";

import PopoverModule from "ui/html_editor/modules/popover";

const POPOVER_CLASS = "dx-popover";
const SUGGESTION_LIST_CLASS = "dx-suggestion-list";

const moduleConfig = {
    beforeEach: () => {
        this.$element = $("#htmlEditor");

        this.options = {
            editorInstance: {
                $element: () => {
                    return this.$element;
                },
                _createComponent: ($element, widget, options) => {
                    return new widget($element, options);
                }
            }
        };
    }
};

const { test } = QUnit;

QUnit.module("Popover module", moduleConfig, () => {
    test("Render Popover with a suggestion list", (assert) => {
        this.options.dataSource = ["Test1", "Test2"];
        new PopoverModule({}, this.options);

        const $popover = this.$element.children();
        const $suggestionList = $popover.find("." + SUGGESTION_LIST_CLASS);
        const listDataSource = $suggestionList.dxList("option", "dataSource");

        assert.ok($popover.hasClass(POPOVER_CLASS), "Popover rendered");
        assert.equal($suggestionList.length, 1, "Popover contains one suggestion list");
        assert.deepEqual(listDataSource, this.options.dataSource, "List has a correct dataSource");
    });
});
