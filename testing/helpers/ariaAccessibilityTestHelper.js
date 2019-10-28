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
            this.$itemContainer = this.widget._itemContainer();
            this.focusedItemId = this.widget.getFocusedItemId();
            this.$items = this.$itemContainer.find(`.${ITEM_CLASS}`);
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

    checkItemsAttributes(selectedIndexes, options = {}) {
        const { focusedItemIndex, ariaSelected } = options;

        selectedIndexes.forEach((index) => {
            this.checkItemAttributes(this.$items.eq(index), index, {
                id: isDefined(focusedItemIndex) && index === focusedItemIndex ? this.focusedItemId : null,
                role: "option",
                ariaSelected: "true"
            });
        });

        this.$items.each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                this.checkItemAttributes(this.$items.eq(index), index, {
                    id: null,
                    role: "option",
                    ariaSelected: "ariaSelected" in options ? ariaSelected : "false"
                });
            }
        });
    }

}

export default ariaAccessibilityTestHelper;
