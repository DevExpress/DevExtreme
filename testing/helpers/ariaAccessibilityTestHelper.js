import $ from "jquery";
import { isDefined } from "core/utils/type";

const { assert } = QUnit;

const ITEM_CLASS = "dx-item";

class ariaAccessibilityTestHelper {
    constructor(args) {
        const { createWidget } = args;

        this.createWidget = (options = {}) => {
            this.$widget = $("<div>").appendTo("#qunit-fixture");
            this.widget = createWidget(this.$widget, options);
            this.$itemContainer = this.widget._itemContainer(this.widget.option("searchEnabled"));
            this.focusedItemId = this.widget.getFocusedItemId();
            this.$items = this.$itemContainer.find(`.${ITEM_CLASS}`);
            this.clock = sinon.useFakeTimers();
        };
    }

    checkAttributes($target, expectedAttributes) {
        const { role, activeDescendant, tabIndex } = expectedAttributes;

        assert.strictEqual($target.get(0).getAttribute("role"), role, "role");
        assert.strictEqual($target.get(0).getAttribute("aria-activedescendant"), activeDescendant, "activedescendant");
        assert.strictEqual($target.get(0).getAttribute("tabIndex"), tabIndex, "tabIndex");
    }

    checkItemAttributes($item, index, expectedAttributes) {
        const { id, role, ariaSelected } = expectedAttributes;

        assert.strictEqual($item.get(0).getAttribute("id"), id, `item[${index}].id`);
        assert.strictEqual($item.get(0).getAttribute("role"), role, `item[${index}].role`);
        assert.strictEqual($item.get(0).getAttribute("aria-selected"), ariaSelected, `item[${index}].aria-selected`);
    }

    checkCheckboxAttributes($item, index, expectedAttributes) {
        const { role, ariaChecked } = expectedAttributes;

        assert.strictEqual($item.get(0).getAttribute("role"), role, `checkbox[${index}].role`);
        assert.strictEqual($item.get(0).getAttribute("aria-checked"), ariaChecked, `checkbox[${index}].aria-checked`);
    }

    checkNodeAttributes($node, index, expectedAttributes) {
        const { id, dataItemId, role, ariaLabel, ariaExpanded, ariaLevel, ariaSelected } = expectedAttributes;

        assert.strictEqual($node.get(0).getAttribute("id"), id, `node[${index}].id`);
        assert.strictEqual($node.get(0).getAttribute("data-item-id"), dataItemId, `node[${index}].data-item-id`);
        assert.strictEqual($node.get(0).getAttribute("role"), role, `node[${index}].role`);
        assert.strictEqual($node.get(0).getAttribute("aria-label"), ariaLabel, `node[${index}].aria-label`);
        assert.strictEqual($node.get(0).getAttribute("aria-expanded"), ariaExpanded, `node[${index}].aria-expanded`);
        assert.strictEqual($node.get(0).getAttribute("aria-level"), ariaLevel, `node[${index}].aria-level`);
        assert.strictEqual($node.get(0).getAttribute("aria-selected"), ariaSelected, `node[${index}].aria-selected`);
    }

    checkGroupNodeAttributes($nodeContainer) {
        assert.strictEqual($nodeContainer.get(0).getAttribute("role"), "group", `nodeContainer.role`);
    }

    checkItemsAttributes(selectedIndexes, options = {}) {
        const { focusedItemIndex, ariaSelected, role, isCheckBoxMode, checkboxRole, selectionMode } = options;

        selectedIndexes.forEach((index) => {
            const checkBoxCount = this.$items.eq(index).closest(".dx-treeview-node").find(".dx-checkbox").length;
            const checkedCheckBoxCount = this.$items.eq(index).closest(".dx-treeview-node").find(".dx-checkbox-checked").length;
            const allCheckBoxSelected = checkBoxCount && checkedCheckBoxCount && checkBoxCount === checkedCheckBoxCount;

            if(this.$items.eq(index).closest(".dx-treeview-node").length) {
                this.checkNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node"), index, {
                    id: isDefined(focusedItemIndex) && index === focusedItemIndex ? this.focusedItemId : null,
                    dataItemId: this.widget._getNode(this.$items.eq(index)).id.toString(),
                    role: "treeitem",
                    ariaLabel: this.$items.eq(index).text(),
                    ariaExpanded: this.$items.eq(index).closest(".dx-treeview-node").find(".dx-treeview-node-container").eq(0).hasClass("dx-treeview-node-container-opened").toString(),
                    ariaLevel: this.$items.eq(index).parents(".dx-treeview-node").length.toString(),
                    ariaSelected: !allCheckBoxSelected && selectionMode === "multiple" ? null : "true"
                });
                this.checkGroupNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node-container").eq(0));
            }
            this.checkItemAttributes(this.$items.eq(index), index, {
                id: isDefined(focusedItemIndex) && index === focusedItemIndex ? this.focusedItemId : null,
                role: "role" in options ? role : "option",
                ariaSelected: "ariaSelected" in options ? ariaSelected : "true"
            });
            if(isCheckBoxMode) {
                this.checkCheckboxAttributes(this.$items.eq(index).prev(), index, {
                    role: checkboxRole || "checkbox",
                    ariaChecked: !allCheckBoxSelected && selectionMode === "multiple" ? "mixed" : "true"
                });
            }
        });

        this.$items.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                if(this.$items.eq(index).closest(".dx-treeview-node").length) {
                    this.checkNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node"), index, {
                        id: isDefined(focusedItemIndex) && index === focusedItemIndex ? this.focusedItemId : null,
                        dataItemId: this.widget._getNode(this.$items.eq(index)).id.toString(),
                        role: "treeitem",
                        ariaLabel: this.$items.eq(index).text(),
                        ariaExpanded: this.$items.eq(index).closest(".dx-treeview-node").find(".dx-treeview-node-container").eq(0).hasClass("dx-treeview-node-container-opened").toString(),
                        ariaLevel: this.$items.eq(index).parents(".dx-treeview-node").length.toString(),
                        ariaSelected: "false"
                    });
                    this.checkGroupNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node-container").eq(0));
                }
                this.checkItemAttributes(this.$items.eq(index), index, {
                    id: null,
                    role: "role" in options ? role : "option",
                    ariaSelected: "ariaSelected" in options ? ariaSelected : "false"
                });
                if(isCheckBoxMode) {
                    this.checkCheckboxAttributes(this.$items.eq(index).prev(), index, {
                        role: "checkbox",
                        ariaChecked: "false"
                    });
                }
            }
        });
    }
}

export default ariaAccessibilityTestHelper;
