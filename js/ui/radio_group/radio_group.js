"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    devices = require("../../core/devices"),
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    Editor = require("../editor/editor"),
    inkRipple = require("../widget/utils.ink_ripple"),
    DataExpressionMixin = require("../editor/ui.data_expression"),
    themes = require("../themes"),
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    ChildDefaultTemplate = require("../widget/child_default_template");

var RADIO_GROUP_CLASS = "dx-radiogroup",
    RADIO_GROUP_VERTICAL_CLASS = "dx-radiogroup-vertical",
    RADIO_GROUP_HORIZONTAL_CLASS = "dx-radiogroup-horizontal",
    RADIO_BUTTON_CLASS = "dx-radiobutton",
    RADIO_BUTTON_ICON_CLASS = "dx-radiobutton-icon",
    RADIO_BUTTON_ICON_DOT_CLASS = "dx-radiobutton-icon-dot",
    RADIO_VALUE_CONTAINER_CLASS = "dx-radio-value-container",
    RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked",
    ITEM_DATA_KEY = "dxItemData",
    RADIO_FEEDBACK_HIDE_TIMEOUT = 100;

var RadioCollection = CollectionWidget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), DataExpressionMixin._dataExpressionDefaultOptions(), {
            _itemAttributes: { role: "radio" }
        });
    },

    _supportedKeys: function() {
        var parent = this.callBase();

        return extend({}, parent, {
            enter: function(e) {
                e.preventDefault();
                return parent.enter.apply(this, arguments);
            },

            space: function(e) {
                e.preventDefault();
                return parent.space.apply(this, arguments);
            }
        });
    },

    _focusTarget: function() {
        return this.$element().parent();
    },

    _keyboardEventBindingTarget: function() {
        return this._focusTarget();
    }
});

var RadioGroup = Editor.inherit({

    _activeStateUnit: "." + RADIO_BUTTON_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), extend(DataExpressionMixin._dataExpressionDefaultOptions(), {

            /**
             * @name dxRadioGroupOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxRadioGroupOptions_activeStateEnabled
            * @publicName activeStateEnabled
            * @type boolean
            * @default true
            * @extend_doc
            */
            activeStateEnabled: true,

            /**
            * @name dxRadioGroupOptions_layout
            * @publicName layout
            * @type string
            * @default "vertical"
            * @acceptValues 'vertical'|'horizontal'
            */
            layout: "vertical",

            useInkRipple: false

            /**
            * @name dxRadioGroupOptions_value
            * @publicName value
            * @ref
            * @extend_doc
            */

            /**
            * @name dxRadioGroupOptions_name
            * @publicName name
            * @type string
            * @hidden false
            * @extend_doc
            */
        }));
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { tablet: true },
                options: {
                    /**
                     * @name dxRadioGroupOptions_layout
                     * @publicName layout
                     * @custom_default_for_tablets 'horizontal'
                     */
                    layout: "horizontal"
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxRadioGroupOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            value: true
        });
    },

    _dataSourceOptions: function() {
        return { paginate: false };
    },

    _init: function() {
        this.callBase();
        this._initDataExpressions();
        this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT;
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["item"] = new ChildDefaultTemplate("item", this);
    },

    _render: function() {
        this.$element().addClass(RADIO_GROUP_CLASS);
        this._renderSubmitElement();
        this._renderRadios();
        this.setAria("role", "radiogroup");

        this.callBase();

        this._renderLayout();
        this._updateItemsSize();

        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render({
            waveSizeCoefficient: 3.3,
            useHoldAnimation: false,
            isCentered: true
        });
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        if(value) {
            this._inkRipple.showWave({
                element: $element.find("." + RADIO_BUTTON_ICON_CLASS),
                Event: e
            });
        } else {
            this._inkRipple.hideWave({
                element: $element.find("." + RADIO_BUTTON_ICON_CLASS),
                Event: e
            });
        }
    },

    _renderFocusState: noop,

    _renderRadios: function() {
        var $radios = $("<div>").appendTo(this.$element());

        this._radios = this._createComponent($radios, RadioCollection, {
            dataSource: this._dataSource,
            onItemRendered: this._itemRenderedHandler.bind(this),
            onItemClick: this._itemClickHandler.bind(this),
            itemTemplate: this._getTemplateByOption("itemTemplate"),
            scrollingEnabled: false,
            focusStateEnabled: this.option("focusStateEnabled"),
            accessKey: this.option("accessKey"),
            tabIndex: this.option("tabIndex"),
            noDataText: ""
        });

        this._setCollectionWidgetOption("onContentReady", this._contentReadyHandler.bind(this));
        this._contentReadyHandler();
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.$element());
        this._setSubmitValue();
    },

    _setSubmitValue: function(value) {
        value = value || this.option("value");

        var submitValue = this.option("valueExpr") === "this" ? this._displayGetter(value) : value;
        this._$submitElement.val(submitValue);
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _contentReadyHandler: function() {
        this.itemElements().addClass(RADIO_BUTTON_CLASS);
        this._refreshSelected();
    },

    _itemRenderedHandler: function(e) {
        if(e.itemData.html) {
            return;
        }

        var $radio,
            $radioContainer;

        $radio = $("<div>").addClass(RADIO_BUTTON_ICON_CLASS);
        $("<div>").addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);
        $radioContainer = $("<div>").append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);

        e.itemElement.prepend($radioContainer);
    },

    _itemClickHandler: function(e) {
        this._saveValueChangeEvent(e.Event);
        this.option("value", this._getItemValue(e.itemData));
    },

    _getItemValue: function(item) {
        return !!this._valueGetter ? this._valueGetter(item) : item.text;
    },

    itemElements: function() {
        return this._radios.itemElements();
    },

    _renderDimensions: function() {
        this.callBase();
        this._updateItemsSize();
    },

    _renderLayout: function() {
        var layout = this.option("layout");
        this.$element().toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === "vertical");
        this.$element().toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === "horizontal");
    },

    _refreshSelected: function() {
        var selectedValue = this.option("value");

        this.itemElements().each((function(_, item) {
            var $item = $(item);
            var itemValue = this._valueGetter($item.data(ITEM_DATA_KEY));
            $item.toggleClass(RADIO_BUTTON_CHECKED_CLASS, this._isValueEquals(itemValue, selectedValue));

            this.setAria("checked", this._isValueEquals(itemValue, selectedValue), $item);
        }).bind(this));
    },

    _updateItemsSize: function() {
        if(this.option("layout") === "horizontal") {
            this.itemElements().css("height", "auto");
        } else {
            var itemsCount = this.option("items").length;
            this.itemElements().css("height", 100 / itemsCount + "%");
        }
    },

    _getAriaTarget: function() {
        return this.$element();
    },

    _setCollectionWidgetOption: function() {
        this._setWidgetOption("_radios", arguments);
    },

    focus: function() {
        this._radios && this._radios.focus();
    },

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);

        switch(args.name) {
            case "useInkRipple":
                this._invalidate();
                break;
            case "focusStateEnabled":
            case "accessKey":
            case "tabIndex":
                this._setCollectionWidgetOption(args.name, args.value);
                break;
            case "disabled":
                this.callBase(args);
                this._setCollectionWidgetOption(args.name, args.value);
                break;
            case "dataSource":
                this._setCollectionWidgetOption("dataSource");
                break;
            case "valueExpr":
                this._refreshSelected();
                break;
            case "value":
                this._refreshSelected();
                this._setSubmitValue(args.value);
                this.callBase(args);
                break;
            case "items":
            case "itemTemplate":
            case "displayExpr":
                break;
            case "layout":
                this._renderLayout();
                this._updateItemsSize();
                break;
            default:
                this.callBase(args);
        }
    }

}).include(DataExpressionMixin);

registerComponent("dxRadioGroup", RadioGroup);

module.exports = RadioGroup;
