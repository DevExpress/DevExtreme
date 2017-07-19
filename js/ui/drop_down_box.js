"use strict";

var DropDownEditor = require("./drop_down_editor/ui.drop_down_editor"),
    DataExpressionMixin = require("./editor/ui.data_expression"),
    commonUtils = require("../core/utils/common"),
    map = require("../core/utils/iterator").map,
    isDefined = require("../core/utils/type").isDefined,
    selectors = require("./widget/jquery.selectors"),
    KeyboardProcessor = require("./widget/ui.keyboard_processor"),
    when = require("../integration/jquery/deferred").when,
    $ = require("../core/renderer"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator");

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox",
    DIMENSION_DEPENDENT_OPTIONS = ["width", "height", "maxWidth", "maxHeight", "minWidth", "minHeight"];

/**
 * @name dxDropDownBox
 * @publicName dxDropDownBox
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @module ui/drop_down_box
 * @export default
 */
var DropDownBox = DropDownEditor.inherit({
    _supportedKeys: function() {
        return extend({}, this.callBase(), {
            tab: function(e) {
                if(!this.option("opened")) {
                    return;
                }

                var $tabbableElements = this._getTabbableElements(),
                    $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();

                $focusableElement && $focusableElement.focus();
                e.preventDefault();
            }
        });
    },

    _getTabbableElements: function() {
        return this._getElements().filter(selectors.tabbable);
    },

    _getElements: function() {
        return this.content().find("*");
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDropDownBoxOptions_attr
             * @publicName attr
             * @extend_doc
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions_fieldEditEnabled
             * @publicName fieldEditEnabled
             * @extend_doc
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions_acceptCustomValue
             * @publicName acceptCustomValue
             * @type boolean
             * @default false
             */
            acceptCustomValue: false,

            /**
             * @name dxDropDownBoxOptions_contentTemplate
             * @publicName contentTemplate
             * @type template
             * @default null
             * @type_function_param1 templateData:object
             * @type_function_param2 contentElement:jQuery
             * @type_function_return string|Node|jQuery
             */
            contentTemplate: null,

            /**
             * @name dxDropDownBoxOptions_dropDownOptions
             * @publicName dropDownOptions
             * @type Popup options
             * @default {}
             */
            dropDownOptions: {},

            /**
             * @name dxDropDownBoxOptions_maxLength
             * @publicName maxLength
             * @type string|number
             * @default null
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions_spellcheck
             * @publicName spellcheck
             * @type boolean
             * @default false
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions_applyValueMode
             * @publicName applyValueMode
             * @type string
             * @default "instantly"
             * @acceptValues 'useButtons'|'instantly'
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions_itemTemplate
             * @publicName itemTemplate
             * @type template
             * @default "item"
             * @extend_doc
             * @hidden
             */

            openOnFieldClick: true,

            /**
             * @name dxDropDownBoxOptions_valueChangeEvent
             * @publicName valueChangeEvent
             * @type string
             * @default "change"
             */

            valueFormat: function(value) {
                return Array.isArray(value) ? value.join(", ") : value;
            }
        });
    },

    _init: function() {
        this.callBase();
        this._initDataExpressions();
    },

    _render: function() {
        this._renderSubmitElement();
        this.callBase();
        this.element().addClass(DROP_DOWN_BOX_CLASS);
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.element());
    },

    _renderValue: function() {
        this._setSubmitValue();
        this.callBase();
    },

    _setSubmitValue: function() {
        var value = this.option("value"),
            submitValue = this.option("valueExpr") === "this" ? this._displayGetter(value) : value;

        this._$submitElement.val(submitValue);
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _renderInputValue: function() {
        var callBase = this.callBase.bind(this),
            currentValue = this._getCurrentValue(),
            keys = commonUtils.ensureDefined(currentValue, []),
            values = [];

        keys = Array.isArray(keys) ? keys : [keys];

        var itemLoadDeferreds = map(keys, (function(key) {
            return this._loadItem(key).always((function(item) {
                var displayValue = this._displayGetter(item);
                if(isDefined(displayValue)) {
                    values.push(displayValue);
                }
            }).bind(this));
        }).bind(this));

        when.apply(this, itemLoadDeferreds).done((function() {
            this.option("displayValue", values);
            callBase(values.length && values);
        }).bind(this))
            .fail(callBase);

        return itemLoadDeferreds;
    },

    _loadItem: function(value) {
        var selectedItem = grep(this.option("items") || [], (function(item) {
            return this._isValueEquals(this._valueGetter(item), value);
        }).bind(this))[0];

        return selectedItem !== undefined
            ? $.Deferred().resolve(selectedItem).promise()
            : this._loadValue(value);
    },

    _clearValueHandler: function(e) {
        e.stopPropagation();
        this.reset();
    },

    _updatePopupWidth: function() {
        this._setPopupOption("width", this.element().outerWidth());
    },

    _dimensionChanged: function() {
        this._popup && !this.option("dropDownOptions.width") && this._updatePopupWidth();
    },

    _popupElementTabHandler: function(e) {
        if(e.key !== "tab") return;

        var $firstTabbable = this._getTabbableElements().first().get(0),
            $lastTabbable = this._getTabbableElements().last().get(0),
            $target = e.originalEvent.target,
            moveBackward = !!($target === $firstTabbable && e.shift),
            moveForward = !!($target === $lastTabbable && !e.shift);

        if(moveBackward || moveForward) {
            this.close();
            this._input().focus();

            if(moveBackward) {
                e.originalEvent.preventDefault();
            }
        }
    },

    _renderPopup: function(e) {
        this.callBase();

        if(this.option("focusStateEnabled")) {
            this._popup._keyboardProcessor.push(new KeyboardProcessor({
                element: this.content(),
                handler: this._popupElementTabHandler,
                context: this
            }));
        }
    },

    _popupConfig: function() {
        return extend(this.callBase(), {
            width: this.element().outerWidth(),
            height: "auto",
            tabIndex: -1,
            dragEnabled: false,
            focusStateEnabled: this.option("focusStateEnabled"),
            onPositioned: null,
            maxHeight: this._getMaxHeight.bind(this)
        }, this.option("dropDownOptions"));
    },

    _getMaxHeight: function() {
        var $element = this.element(),
            offset = $element.offset(),
            windowHeight = $(window).height(),
            maxHeight = windowHeight - offset.top - $element.outerHeight();

        return maxHeight * 0.9;
    },

    _popupShownHandler: function() {
        this.callBase();
        var $firstElement = this._getTabbableElements().first();
        $firstElement.focus();
    },

    _popupOptionChanged: function(args) {
        var options = {};

        if(args.name === args.fullName) {
            options = args.value;
        } else {
            var option = args.fullName.split(".").pop();
            options[option] = args.value;
        }

        this._setPopupOption(options);

        Object.keys(options).every(function(option) {
            if(DIMENSION_DEPENDENT_OPTIONS.indexOf(option) >= 0) {
                this._dimensionChanged();
                return false;
            }
            return true;
        }, this);
    },

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "dropDownOptions":
                this._popupOptionChanged(args);
                break;
            case "dataSource":
                this._renderInputValue();
                break;
            case "displayValue":
                this.option("text", args.value);
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownBox", DropDownBox);

module.exports = DropDownBox;
