"use strict";

var DropDownEditor = require("./drop_down_editor/ui.drop_down_editor"),
    DataExpressionMixin = require("./editor/ui.data_expression"),
    when = require("../integration/jquery/deferred").when,
    $ = require("../core/renderer"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator");

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox";

/**
 * @name dxDropDownBox
 * @publicName dxDropDownBox
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @module ui/drop_down_box
 * @export default
 */
var DropDownBox = DropDownEditor.inherit({

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
        this.callBase();
        this.element().addClass(DROP_DOWN_BOX_CLASS);
    },

    _renderInputValue: function() {
        var callBase = this.callBase.bind(this),
            keys = this._getCurrentValue() || [],
            values = [];

        keys = Array.isArray(keys) ? keys : [keys];

        var itemLoadDeferreds = $.map(keys, (function(key) {
            return this._loadItem(key).always((function(item) {
                values.push(this._displayGetter(item));
            }).bind(this));
        }).bind(this));

        when.apply(this, itemLoadDeferreds).done((function() {
            callBase(values);
        }).bind(this));

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
        this._popup && this._updatePopupWidth();
    },

    _popupConfig: function() {
        return extend(this.callBase(), {
            width: this.element().outerWidth(),
            height: "auto",
            maxHeight: this._getMaxHeight.bind(this)
        });
    },

    _getMaxHeight: function() {
        var $element = this.element(),
            offset = $element.offset(),
            windowHeight = $(window).height(),
            maxHeight = windowHeight - offset.top - $element.outerHeight();

        return maxHeight * 0.9;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownBox", DropDownBox);

module.exports = DropDownBox;
