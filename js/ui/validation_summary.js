"use strict";

var registerComponent = require("../core/component_registrator"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    iteratorUtils = require("../core/utils/iterator"),
    ValidationMixin = require("./validation/validation_mixin"),
    ValidationEngine = require("./validation_engine"),
    CollectionWidget = require("./collection/ui.collection_widget.edit");

var VALIDATION_SUMMARY_CLASS = "dx-validationsummary",
    ITEM_CLASS = VALIDATION_SUMMARY_CLASS + "-item",
    ITEM_DATA_KEY = VALIDATION_SUMMARY_CLASS + "-item-data";

/**
* @name dxValidationSummary
* @publicName dxValidationSummary
* @inherits CollectionWidget
* @groupName Helpers
* @module ui/validation_summary
* @export default
*/
var ValidationSummary = CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxValidationSummaryOptions_focusStateEnabled
            * @publicName focusStateEnabled
            * @hidden
            * @extend_doc
            */
            focusStateEnabled: false,
            /**
            * @name dxValidationSummaryOptions_noDataText
            * @publicName noDataText
            * @hidden
            * @extend_doc
            */
            noDataText: null
            /**
            * @name dxValidationSummaryOptions_validationGroup
            * @publicName validationGroup
            * @type string
            * @ref
            */

            // Ignore comments
            /**
            * @name dxValidationSummaryOptions_dataSource
            * @publicName dataSource
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_itemRender
            * @publicName itemRender
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_disabled
            * @publicName disabled
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_hint
            * @publicName hint
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_itemHoldTimeout
            * @publicName itemHoldTimeout
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_rtlEnabled
            * @publicName rtlEnabled
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_selectedIndex
            * @publicName selectedIndex
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_selectedItems
            * @publicName selectedItems
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_selectedItemKeys
            * @publicName selectedItemKeys
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_keyExpr
            * @publicName keyExpr
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_visible
            * @publicName visible
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_width
            * @publicName width
            * @hidden
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_height
            * @publicName height
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_onItemHold
            * @publicName onItemHold
            * @hidden
            * @action
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_onItemRendered
            * @publicName onItemRendered
            * @hidden
            * @action
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_onItemSelect
            * @publicName onItemSelect
            * @hidden
            * @action
            * @extend_doc
            */
            /**
            * @name dxValidationSummaryOptions_onSelectionChanged
            * @publicName onSelectionChanged
            * @hidden
            * @action
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_onItemContextMenu
            * @publicName onItemContextMenu
            * @hidden
            * @action
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_accessKey
            * @publicName accessKey
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxValidationSummaryOptions_tabIndex
            * @publicName tabIndex
            * @hidden
            * @extend_doc
            */
        });
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            validationGroup: true
        });
    },

    _init: function() {
        this.callBase();
        this._initGroupRegistration();
    },

    _initGroupRegistration: function() {
        var group = this._findGroup(),
            groupConfig = ValidationEngine.addGroup(group);

        this._unsubscribeGroup();

        this._groupWasInit = true;
        this._validationGroup = group;

        this.groupSubscription = this._groupValidationHandler.bind(this);
        groupConfig.on("validated", this.groupSubscription);
    },

    _unsubscribeGroup: function() {
        var groupConfig = ValidationEngine.getGroupConfig(this._validationGroup);
        groupConfig && groupConfig.off("validated", this.groupSubscription);
    },

    _getOrderedItems: function(validators, items) {
        var orderedItems = [];

        iteratorUtils.each(validators, function(_, validator) {
            var firstItem = grep(items, function(item) {
                if(item.validator === validator) {
                    return true;
                }
            })[0];

            if(firstItem) {
                orderedItems.push(firstItem);
            }
        });

        return orderedItems;
    },

    _groupValidationHandler: function(params) {
        var that = this,
            items = that._getOrderedItems(params.validators, iteratorUtils.map(params.brokenRules, function(rule) {
                return {
                    text: rule.message,
                    validator: rule.validator
                };
            }));

        that.validators = params.validators;

        iteratorUtils.each(that.validators, function(_, validator) {
            if(validator._validationSummary !== this) {
                var handler = that._itemValidationHandler.bind(that),
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

        that.option("items", items);
    },

    _itemValidationHandler: function(itemValidationResult) {
        var items = this.option("items"),
            isValid = itemValidationResult.isValid,
            elementIndex,
            replacementFound = false,
            newMessage = itemValidationResult.brokenRule && itemValidationResult.brokenRule.message,
            validator = itemValidationResult.validator;

        iteratorUtils.each(items, function(index, item) {
            if(item.validator === validator) {
                if(isValid) {
                    elementIndex = index;
                } else {
                    item.text = newMessage;
                }

                replacementFound = true;
                return false;
            }
        });

        if(isValid ^ replacementFound) {
            return;
        }

        if(isValid) {
            items.splice(elementIndex, 1);
        } else {
            items.push({
                text: newMessage,
                validator: validator
            });
        }

        items = this._getOrderedItems(this.validators, items);
        this.option("items", items);
    },

    _render: function() {
        this.element().addClass(VALIDATION_SUMMARY_CLASS);
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "validationGroup":
                this._initGroupRegistration();
                break;
            default:
                this.callBase(args);
        }
    },

    _itemClass: function() {
        return ITEM_CLASS;
    },

    _itemDataKey: function() {
        return ITEM_DATA_KEY;
    },

    _postprocessRenderItem: function(params) {
        params.itemElement.on("click", function() {
            params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
        });
    },

    _dispose: function() {
        this.callBase();
        this._unsubscribeGroup();
    }

    /**
    * @name dxValidationSummaryMethods_registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxValidationSummaryMethods_getDataSource
    * @publicName getDataSource()
    * @hidden
    * @extend_doc
    */

    /**
    * @name dxValidationSummaryMethods_focus
    * @publicName focus()
    * @hidden
    * @extend_doc
    */

}).include(ValidationMixin);

registerComponent("dxValidationSummary", ValidationSummary);

module.exports = ValidationSummary;
