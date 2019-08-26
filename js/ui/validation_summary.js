import registerComponent from "../core/component_registrator";
import eventsEngine from "../events/core/events_engine";
import { grep } from "../core/utils/common";
import { extend } from "../core/utils/extend";
import iteratorUtils from "../core/utils/iterator";
import ValidationMixin from "./validation/validation_mixin";
import ValidationEngine from "./validation_engine";
import CollectionWidget from "./collection/ui.collection_widget.edit";

const VALIDATION_SUMMARY_CLASS = "dx-validationsummary",
    ITEM_CLASS = VALIDATION_SUMMARY_CLASS + "-item",
    ITEM_DATA_KEY = VALIDATION_SUMMARY_CLASS + "-item-data";

/**
* @name dxValidationSummary
* @inherits CollectionWidget
* @module ui/validation_summary
* @export default
*/
const ValidationSummary = CollectionWidget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            /**
            * @name dxValidationSummaryOptions.focusStateEnabled
            * @hidden
            * @inheritdoc
            */
            focusStateEnabled: false,
            /**
            * @name dxValidationSummaryOptions.noDataText
            * @hidden
            * @inheritdoc
            */
            noDataText: null
            /**
            * @name dxValidationSummaryOptions.validationGroup
            * @type string
            * @ref
            */

            // Ignore comments
            /**
            * @name dxValidationSummaryOptions.dataSource
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.itemRender
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.activeStateEnabled
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.disabled
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.hint
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.itemHoldTimeout
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.rtlEnabled
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.selectedIndex
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.selectedItem
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.selectedItems
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.selectedItemKeys
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.keyExpr
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.visible
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.width
            * @hidden
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.height
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.onItemHold
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.onItemRendered
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.onItemSelect
            * @hidden
            * @action
            * @inheritdoc
            */
            /**
            * @name dxValidationSummaryOptions.onSelectionChanged
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.onItemContextMenu
            * @hidden
            * @action
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.accessKey
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxValidationSummaryOptions.tabIndex
            * @hidden
            * @inheritdoc
            */
        });
    },

    _setOptionsByReference() {
        this.callBase();

        extend(this._optionsByReference, {
            validationGroup: true
        });
    },

    _init() {
        this.callBase();
        this._initGroupRegistration();
    },

    _initGroupRegistration() {
        const group = this._findGroup(),
            groupConfig = ValidationEngine.addGroup(group);

        this._unsubscribeGroup();

        this._groupWasInit = true;
        this._validationGroup = group;

        this.groupSubscription = this._groupValidationHandler.bind(this);
        groupConfig.on("validated", this.groupSubscription);
    },

    _unsubscribeGroup() {
        const groupConfig = ValidationEngine.getGroupConfig(this._validationGroup);
        groupConfig && groupConfig.off("validated", this.groupSubscription);
    },

    _getOrderedItems(validators, items) {
        let orderedItems = [];

        iteratorUtils.each(validators, function(_, validator) {
            const foundItems = grep(items, function(item) {
                if(item.validator === validator) {
                    return true;
                }
            });

            if(foundItems.length) {
                orderedItems = orderedItems.concat(foundItems);
            }
        });

        return orderedItems;
    },

    _groupValidationHandler(params) {
        const items = this._getOrderedItems(params.validators, iteratorUtils.map(params.brokenRules, function(rule) {
            return {
                text: rule.message,
                validator: rule.validator,
                index: rule.index
            };
        }));

        this.validators = params.validators;

        iteratorUtils.each(this.validators, (_, validator) => {
            if(validator._validationSummary !== this) {
                let handler = this._itemValidationHandler.bind(this),
                    disposingHandler = function() {
                        validator.off("validated", handler);
                        validator._validationSummary = null;
                        handler = null;
                    };
                validator.on("validated", handler);
                validator.on("disposing", disposingHandler);
                validator._validationSummary = this;
            }
        });

        this.option("items", items);
    },

    _itemValidationHandler(itemValidationResult) {
        const isValid = itemValidationResult.isValid,
            validator = itemValidationResult.validator,
            brokenRules = itemValidationResult.brokenRules;
        let items = this.option("items");

        if(isValid) {
            let itemIndex = 0;
            while(itemIndex < items.length) {
                const item = items[itemIndex];
                if(item.validator === validator) {
                    items.splice(itemIndex, 1);
                    continue;
                }
                itemIndex++;
            }
        } else {
            iteratorUtils.each(brokenRules, function(_, rule) {
                const foundItem = grep(items, function(item) {
                    return item.validator === validator && item.index === rule.index;
                })[0];
                if(foundItem && foundItem.text !== rule.message) {
                    foundItem.text = rule.message;
                    return true;
                }
                if(!foundItem) {
                    items.push({
                        text: rule.message,
                        validator: validator,
                        index: rule.index
                    });
                }
            });
        }

        items = this._getOrderedItems(this.validators, items);
        this.option("items", items);
    },

    _initMarkup() {
        this.$element().addClass(VALIDATION_SUMMARY_CLASS);
        this.callBase();
    },

    _optionChanged(args) {
        switch(args.name) {
            case "validationGroup":
                this._initGroupRegistration();
                break;
            default:
                this.callBase(args);
        }
    },

    _itemClass() {
        return ITEM_CLASS;
    },

    _itemDataKey() {
        return ITEM_DATA_KEY;
    },

    _postprocessRenderItem(params) {
        eventsEngine.on(params.itemElement, "click", function() {
            params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
        });
    },

    _dispose() {
        this.callBase();
        this._unsubscribeGroup();
    }

    /**
    * @name dxValidationSummaryMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxValidationSummaryMethods.getDataSource
    * @publicName getDataSource()
    * @hidden
    * @inheritdoc
    */

    /**
    * @name dxValidationSummaryMethods.focus
    * @publicName focus()
    * @hidden
    * @inheritdoc
    */

}).include(ValidationMixin);

registerComponent("dxValidationSummary", ValidationSummary);

module.exports = ValidationSummary;
