var registerComponent = require('../core/component_registrator'),
    eventsEngine = require('../events/core/events_engine'),
    grep = require('../core/utils/common').grep,
    extend = require('../core/utils/extend').extend,
    iteratorUtils = require('../core/utils/iterator'),
    ValidationMixin = require('./validation/validation_mixin'),
    ValidationEngine = require('./validation_engine'),
    CollectionWidget = require('./collection/ui.collection_widget.edit');

var VALIDATION_SUMMARY_CLASS = 'dx-validationsummary',
    ITEM_CLASS = VALIDATION_SUMMARY_CLASS + '-item',
    ITEM_DATA_KEY = VALIDATION_SUMMARY_CLASS + '-item-data';

/**
* @name dxValidationSummary
* @inherits CollectionWidget
* @module ui/validation_summary
* @export default
*/
var ValidationSummary = CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxValidationSummaryOptions.focusStateEnabled
            * @hidden
            */
            focusStateEnabled: false,
            /**
            * @name dxValidationSummaryOptions.noDataText
            * @hidden
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
            */
            /**
            * @name dxValidationSummaryOptions.itemRender
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.activeStateEnabled
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.disabled
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.hint
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.itemHoldTimeout
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.rtlEnabled
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.selectedIndex
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.selectedItem
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.keyExpr
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.visible
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.width
            * @hidden
            */
            /**
            * @name dxValidationSummaryOptions.height
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.onItemHold
            * @hidden
            * @action
            */

            /**
            * @name dxValidationSummaryOptions.onItemRendered
            * @hidden
            * @action
            */

            /**
            * @name dxValidationSummaryOptions.onItemSelect
            * @hidden
            * @action
            */
            /**
            * @name dxValidationSummaryOptions.onSelectionChanged
            * @hidden
            * @action
            */

            /**
            * @name dxValidationSummaryOptions.onItemContextMenu
            * @hidden
            * @action
            */

            /**
            * @name dxValidationSummaryOptions.accessKey
            * @hidden
            */

            /**
            * @name dxValidationSummaryOptions.tabIndex
            * @hidden
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
        groupConfig.on('validated', this.groupSubscription);
    },

    _unsubscribeGroup: function() {
        var groupConfig = ValidationEngine.getGroupConfig(this._validationGroup);
        groupConfig && groupConfig.off('validated', this.groupSubscription);
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
                        validator.off('validated', handler);
                        validator._validationSummary = null;
                        handler = null;
                    };
                validator.on('validated', handler);
                validator.on('disposing', disposingHandler);
                validator._validationSummary = this;
            }
        });

        that.option('items', items);
    },

    _itemValidationHandler: function(itemValidationResult) {
        var items = this.option('items'),
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
        this.option('items', items);
    },

    _initMarkup: function() {
        this.$element().addClass(VALIDATION_SUMMARY_CLASS);
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'validationGroup':
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
        eventsEngine.on(params.itemElement, 'click', function() {
            params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
        });
    },

    _dispose: function() {
        this.callBase();
        this._unsubscribeGroup();
    }

    /**
    * @name dxValidationSummaryMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxValidationSummaryMethods.getDataSource
    * @publicName getDataSource()
    * @hidden
    */

    /**
    * @name dxValidationSummaryMethods.focus
    * @publicName focus()
    * @hidden
    */

}).include(ValidationMixin);

registerComponent('dxValidationSummary', ValidationSummary);

module.exports = ValidationSummary;
