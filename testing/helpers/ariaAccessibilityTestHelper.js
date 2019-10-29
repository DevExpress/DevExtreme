import $ from "jquery";
import { isDefined } from "core/utils/type";

const { assert } = QUnit;

const ITEM_CLASS = "dx-item";
const TREEVIEW_NODE_CLASS = "dx-treeview-node";

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
            checked: $checkBox.hasClass("dx-checkbox-indeterminate") ? "mixed" : defaultValue
        }, `checkbox[${index}]`);
    }

    _checkNodeAttributes(options, $node, index) {
        const { focusedNodeIndex } = options;
        const $item = this.$items.eq(index);
        const node = this.widget._getNode($item);

        let nodeAttributes = {
            role: "treeitem",
            "data-item-id": node.id.toString(),
            level: $item.parents(".dx-treeview-node").length.toString(),
            expanded: node.internalFields.expanded.toString(),
            label: $item.text()
        };

        if(isDefined(node.internalFields.selected)) {
            nodeAttributes.selected = node.internalFields.selected.toString();
        }

        if(isDefined(focusedNodeIndex) && index === focusedNodeIndex) {
            nodeAttributes.id = this.focusedItemId;
        }

        this.checkAttributes($node, nodeAttributes, `node[${index}]`);
    }

    _checkGroupNodeAttributes(index) {
        const $nodeContainer = this.$items.eq(index).closest(".dx-treeview-node-container").eq(0);

        this.checkAttributes($nodeContainer, { role: "group" }, `nodeContainer[${index}]`);
    }

    _checkAttribute(options, index, defaultValue) {
        const $node = this.$items.eq(index).closest(`.${TREEVIEW_NODE_CLASS}`);
        if($node.length) {
            this._checkNodeAttributes(options, $node, index);
            this._checkGroupNodeAttributes(index);
        }

        this._checkItemAttributes(options, index, "true");

        if(this.isCheckBoxMode) {
            this._checkCheckboxAttributes(options, index, "true");
        }
    }

    checkItemsAttributes(selectedIndexes, options = {}) {
        selectedIndexes.forEach((index) => {
            this._checkAttribute(options, index, "true");
        });

        this.$items.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                this._checkAttribute(options, index, "false");
            }
        });
    }
}

export default ariaAccessibilityTestHelper;
