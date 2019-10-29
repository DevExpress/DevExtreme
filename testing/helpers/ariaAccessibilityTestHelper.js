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
            this.isCheckBoxMode = this.widget.option("showCheckBoxesMode") === "normal";

            if(this.widget.itemElements) {
                this.$items = this.widget.itemElements();
            }

            if(this.widget._itemContainer) {
                this.$itemContainer = this.widget._itemContainer(this.widget.option("searchEnabled"));
                this.$items = this.$itemContainer.find(`.${ITEM_CLASS}`);
                this.focusedItemId = this.widget.getFocusedItemId();
            }
        };
    }

    checkAttributes($target, expectedAttributes, prefix) {
        const element = $target.get(0);
        const skipAttributes = ["class", "style"];
        const attributeNames = element.getAttributeNames().filter(name => name !== skipAttributes[0] && name !== skipAttributes[1]);

        const sliceAriaPrefixIfNeed = (name) => name === "aria-autocomplete" || name.indexOf("aria-") === -1 ? name : name.slice(5);

        assert.equal(attributeNames.length === Object.keys(expectedAttributes).length, true, "attributes.count");
        attributeNames.forEach((attributeName) => {
            const attrName = sliceAriaPrefixIfNeed(attributeName);
            assert.strictEqual(element.getAttribute(attributeName), attrName in expectedAttributes ? expectedAttributes[attrName] : null, `${prefix || ''}.${attributeName}`);
        });
    }

    _checkItemAttributes(options, index, defaultValue) {
        const { attributes, focusedItemIndex, role } = options;

        let itemAttributes = {};
        attributes && attributes.forEach((attrName) => {
            itemAttributes[attrName] = defaultValue;
        });
        if(isDefined(focusedItemIndex) && index === focusedItemIndex) {
            itemAttributes.id = this.focusedItemId;
        }
        if("role" in options) {
            itemAttributes.role = role;
        }

        this.checkAttributes(this.$items.eq(index), itemAttributes, `item[${index}]`);
    }

    _checkCheckboxAttributes(options, index, defaultValue) {
        const $checkBox = this.$items.eq(index).prev();

        this.checkAttributes($checkBox, {
            role: "checkbox",
            checked: $checkBox.hasClass("dx-state-indeterminate") ? "mixed" : defaultValue
        }, `checkbox[${index}]`);
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
        const { focusedNodeIndex, selectionMode } = options;

        selectedIndexes.forEach((index) => {
            const checkBoxCount = this.$items.eq(index).closest(".dx-treeview-node").find(".dx-checkbox").length;
            const checkedCheckBoxCount = this.$items.eq(index).closest(".dx-treeview-node").find(".dx-checkbox-checked").length;
            const allCheckBoxSelected = checkBoxCount && checkedCheckBoxCount && checkBoxCount === checkedCheckBoxCount;

            if(this.$items.eq(index).closest(".dx-treeview-node").length) {
                this.checkNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node"), index, {
                    id: isDefined(focusedNodeIndex) && index === focusedNodeIndex ? this.focusedItemId : null,
                    dataItemId: this.widget._getNode(this.$items.eq(index)).id.toString(),
                    role: "treeitem",
                    ariaLabel: this.$items.eq(index).text(),
                    ariaExpanded: this.$items.eq(index).closest(".dx-treeview-node").find(".dx-treeview-node-container").eq(0).hasClass("dx-treeview-node-container-opened").toString(),
                    ariaLevel: this.$items.eq(index).parents(".dx-treeview-node").length.toString(),
                    ariaSelected: !allCheckBoxSelected && selectionMode === "multiple" ? null : "true"
                });
                this.checkGroupNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node-container").eq(0));
            }

            this._checkItemAttributes(options, index, "true");

            if(this.isCheckBoxMode) {
                this._checkCheckboxAttributes(options, index, "true");
            }
        });

        this.$items.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                if(this.$items.eq(index).closest(".dx-treeview-node").length) {
                    this.checkNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node"), index, {
                        id: isDefined(focusedNodeIndex) && index === focusedNodeIndex ? this.focusedItemId : null,
                        dataItemId: this.widget._getNode(this.$items.eq(index)).id.toString(),
                        role: "treeitem",
                        ariaLabel: this.$items.eq(index).text(),
                        ariaExpanded: this.$items.eq(index).closest(".dx-treeview-node").find(".dx-treeview-node-container").eq(0).hasClass("dx-treeview-node-container-opened").toString(),
                        ariaLevel: this.$items.eq(index).parents(".dx-treeview-node").length.toString(),
                        ariaSelected: "false"
                    });
                    this.checkGroupNodeAttributes(this.$items.eq(index).closest(".dx-treeview-node-container").eq(0));
                }

                this._checkItemAttributes(options, index, "false");

                if(this.isCheckBoxMode) {
                    this._checkCheckboxAttributes(options, index, "false");
                }
            }
        });
    }
}

export default ariaAccessibilityTestHelper;
