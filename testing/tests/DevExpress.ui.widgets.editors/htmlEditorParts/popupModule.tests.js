import $ from "jquery";

import PopupModule from "ui/html_editor/modules/popup";

const POPOVER_CLASS = "dx-popup";
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

QUnit.module("Popup module", moduleConfig, () => {
    test("Render Popup with a suggestion list", (assert) => {
        this.options.dataSource = ["Test1", "Test2"];
        new PopupModule({}, this.options);

        const $popup = this.$element.children();
        const $suggestionList = $popup.find(`.${SUGGESTION_LIST_CLASS}`);
        const listDataSource = $suggestionList.dxList("option", "dataSource");

        assert.ok($popup.hasClass(POPOVER_CLASS), "Popup rendered");
        assert.equal($suggestionList.length, 1, "Popup contains one suggestion list");
        assert.deepEqual(listDataSource, this.options.dataSource, "List has a correct dataSource");
    });
});
