"use strict";

var DropDownEditor = require("./drop_down_editor/ui.drop_down_editor"),
    DataExpressionMixin = require("./editor/ui.data_expression"),
    commonUtils = require("../core/utils/common"),
    window = require("../core/utils/window").getWindow(),
    map = require("../core/utils/iterator").map,
    isDefined = require("../core/utils/type").isDefined,
    selectors = require("./widget/selectors"),
    KeyboardProcessor = require("./widget/ui.keyboard_processor"),
    deferredUtils = require("../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    grep = require("../core/utils/common").grep,
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator");

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox";

/**
 * @name dxDropDownBox
 * @isEditor
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

                $focusableElement && eventsEngine.trigger($focusableElement, "focus");
                e.preventDefault();
            }
        });
    },

    _getTabbableElements: function() {
        return this._getElements().filter(selectors.tabbable);
    },

    _getElements: function() {
        return $(this.content()).find("*");
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDropDownBoxOptions.attr
             * @publicName attr
             * @inheritdoc
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.acceptCustomValue
             * @publicName acceptCustomValue
             * @type boolean
             * @default false
             */
            acceptCustomValue: false,

            /**
             * @name dxDropDownBoxOptions.contentTemplate
             * @publicName contentTemplate
             * @type template|function
             * @default null
             * @type_function_param1 templateData:object
             * @type_function_param1_field1 component:dxDropDownBox
             * @type_function_param1_field2 value:any
             * @type_function_param2 contentElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            contentTemplate: null,

            /**
             * @name dxDropDownBoxOptions.dropDownOptions
             * @publicName dropDownOptions
             * @type dxPopupOptions
             * @default {}
             */
            dropDownOptions: {},

            /**
             * @name dxDropDownBoxOptions.fieldTemplate
             * @publicName fieldTemplate
             * @type template|function
             * @default null
             * @type_function_param1 value:object
             * @type_function_param2 fieldElement:dxElement
             * @type_function_return string|Node|jQuery
             */

            /**
             * @name dxDropDownBoxOptions.maxLength
             * @publicName maxLength
             * @type string|number
             * @default null
             * @hidden
             */

            /**
            * @name dxDropDownBoxOptions.onContentReady
            * @publicName onContentReady
            * @hidden true
            * @action
            */

            /**
             * @name dxDropDownBoxOptions.spellcheck
             * @publicName spellcheck
             * @type boolean
             * @default false
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.applyValueMode
             * @publicName applyValueMode
             * @type string
             * @default "instantly"
             * @acceptValues 'useButtons'|'instantly'
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.itemTemplate
             * @publicName itemTemplate
             * @type template
             * @default "item"
             * @inheritdoc
             * @hidden
             */

            openOnFieldClick: true,

            /**
             * @name dxDropDownBoxOptions.valueChangeEvent
             * @publicName valueChangeEvent
             * @type string
             * @default "change"
             */

            valueFormat: function(value) {
                return Array.isArray(value) ? value.join(", ") : value;
            }
        });
    },

    _initMarkup: function() {
        this._initDataExpressions();
        this._renderSubmitElement();
        this.$element().addClass(DROP_DOWN_BOX_CLASS);

        this.callBase();
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.$element());
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
            values = [];

        if(!this._dataSource) {
            callBase(values);
            return;
        }

        var currentValue = this._getCurrentValue(),
            keys = commonUtils.ensureDefined(currentValue, []);

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
        var deferred = new Deferred(),
            that = this;

        var selectedItem = grep(this.option("items") || [], (function(item) {
            return this._isValueEquals(this._valueGetter(item), value);
        }).bind(this))[0];

        if(selectedItem !== undefined) {
            deferred.resolve(selectedItem);
        } else {
            this._loadValue(value)
                .done(function(item) {
                    deferred.resolve(item);
                })
                .fail(function(args) {
                    if(that.option("acceptCustomValue")) {
                        deferred.resolve(value);
                    } else {
                        deferred.reject();
                    }
                });
        }

        return deferred.promise();
    },

    _clearValueHandler: function(e) {
        e.stopPropagation();
        this.reset();
    },

    _updatePopupWidth: function() {
        this._setPopupOption("width", this.$element().outerWidth());
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
            eventsEngine.trigger(this._input(), "focus");

            if(moveBackward) {
                e.originalEvent.preventDefault();
            }
        }
    },

    _renderPopup: function(e) {
        this.callBase();
        this._options.dropDownOptions = extend({}, this._popup.option());

        this._popup.on("optionChanged", function(e) {
            this.option("dropDownOptions" + "." + e.fullName, e.value);
        }.bind(this));

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
            width: this.$element().outerWidth(),
            height: "auto",
            tabIndex: -1,
            dragEnabled: false,
            focusStateEnabled: this.option("focusStateEnabled"),
            maxHeight: this._getMaxHeight.bind(this)
        }, this.option("dropDownOptions"));
    },

    _getMaxHeight: function() {
        var $element = this.$element(),
            offsetTop = $element.offset().top - $(window).scrollTop(),
            offsetBottom = $(window).innerHeight() - offsetTop - $element.outerHeight(),
            maxHeight = Math.max(offsetTop, offsetBottom) * 0.9;

        return maxHeight;
    },

    _popupShownHandler: function() {
        this.callBase();
        var $firstElement = this._getTabbableElements().first();
        eventsEngine.trigger($firstElement, "focus");
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

        if(Object.keys(options).indexOf("width") !== -1 && options["width"] === undefined) {
            this._updatePopupWidth();
        }
    },

    _setCollectionWidgetOption: commonUtils.noop,

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._updatePopupWidth();
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
            case "displayExpr":
                this._renderValue();
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent("dxDropDownBox", DropDownBox);

module.exports = DropDownBox;
