import $ from 'jquery';
import { isDefined } from 'core/utils/type';

const { assert } = QUnit;

const ITEM_CLASS = 'dx-item';
const TREEVIEW_NODE_CLASS = 'dx-treeview-node';

class ariaAccessibilityTestHelper {
    constructor(args) {
        const { createWidget } = args;

        this.createWidget = (options = {}) => {
            this.$widget = $('<div>').appendTo('#qunit-fixture');
            this.widget = createWidget(this.$widget, options);
            this.isCheckBoxMode = this.widget.option('showCheckBoxesMode') === 'normal';
            this.$items = this.getItems();

            if(this.widget.getFocusedItemId) {
                this.focusedItemId = this.widget.getFocusedItemId();
            }
        };
    }

    getItems() {
        if(this.widget._itemContainer) {
            this.$itemContainer = this.widget._itemContainer(this.widget.option('searchEnabled'));

            return this.$itemContainer.find(`.${ITEM_CLASS}`);
        }

        if(this.widget.itemElements) {
            return this.widget.itemElements();
        }
    }

    _getAttributeNames(element) {
        let result = [];

        if(isDefined(Element.prototype.getAttributeNames)) {
            result = element.getAttributeNames();
        } else {
            // IE11 support
            const attributes = element.attributes;
            const length = attributes.length;
            for(let i = 0; i < length; i++) {
                result.push(attributes[i].name);
            }
        }
        return result;
    }

    checkAttributes($target, expectedAttributes, prefix) {
        const element = $target.get(0);
        const skipAttributes = ['class', 'style', 'onclick'];
        const attributeNames = this._getAttributeNames(element).filter(name => skipAttributes.indexOf(name) === -1).map(name => name.toLowerCase());

        assert.strictEqual(attributeNames.length, Object.keys(expectedAttributes).length, `${prefix || ''}.attributes.count`);
        attributeNames.forEach((attributeName) => {
            assert.strictEqual(element.getAttribute(attributeName), attributeName in expectedAttributes ? expectedAttributes[attributeName] : null, `${prefix || ''}.${attributeName}`);
        });
    }

    _checkItemAttributes(options, index, defaultValue) {
        const { attributes, focusedItemIndex, role, tabindex } = options;

        const itemAttributes = {};
        attributes && attributes.forEach((attrName) => {
            itemAttributes[attrName] = defaultValue;
        });
        if(isDefined(focusedItemIndex) && index === focusedItemIndex) {
            itemAttributes.id = this.focusedItemId;
        }
        if('role' in options) {
            itemAttributes.role = role;
        }
        if('tabindex' in options) {
            itemAttributes.tabindex = tabindex;
        }

        this.checkAttributes(this.getItems().eq(index), itemAttributes, `item[${index}]`);
    }

    _checkCheckboxAttributes(options, index, defaultValue) {
        const $checkBox = this.getItems().eq(index).prev();

        this.checkAttributes($checkBox, {
            role: 'checkbox',
            'aria-checked': $checkBox.hasClass('dx-checkbox-indeterminate') ? 'mixed' : defaultValue,
            'aria-invalid': 'false',
            'aria-readonly': 'false'
        }, `checkbox[${index}]`);
    }

    _checkNodeAttributes(options, $node, index) {
        const { focusedNodeIndex } = options;
        const $item = this.getItems().eq(index);
        const node = this.widget._getNode($item);

        const nodeAttributes = {
            role: 'treeitem',
            'data-item-id': node.id.toString(),
            'aria-level': $item.parents('.dx-treeview-node').length.toString(),
            'aria-expanded': node.internalFields.expanded.toString(),
            'aria-label': $item.text()
        };

        if(isDefined(node.internalFields.selected)) {
            nodeAttributes['aria-selected'] = node.internalFields.selected.toString();
        }

        if(isDefined(focusedNodeIndex) && index === focusedNodeIndex) {
            nodeAttributes.id = this.focusedItemId;
        }

        this.checkAttributes($node, nodeAttributes, `node[${index}]`);
    }

    _checkGroupNodeAttributes(index) {
        const $nodeContainer = this.getItems().eq(index).closest('.dx-treeview-node-container').eq(0);

        this.checkAttributes($nodeContainer, { role: 'group' }, `nodeContainer[${index}]`);
    }

    _checkAttribute(options, index, defaultValue) {
        const $node = this.getItems().eq(index).closest(`.${TREEVIEW_NODE_CLASS}`);
        if($node.length) {
            this._checkNodeAttributes(options, $node, index);
            this._checkGroupNodeAttributes(index);
        }

        this._checkItemAttributes(options, index, defaultValue);

        if(this.isCheckBoxMode) {
            this._checkCheckboxAttributes(options, index, defaultValue);
        }
    }

    checkItemsAttributes(selectedIndexes, options = {}) {
        selectedIndexes.forEach((index) => {
            this._checkAttribute(options, index, 'true');
        });

        this.getItems().each((index) => {
            if(selectedIndexes.indexOf(index) === -1) {
                this._checkAttribute(options, index, 'false');
            }
        });
    }
}

export default ariaAccessibilityTestHelper;
