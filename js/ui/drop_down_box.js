import DropDownEditor from "./drop_down_editor/ui.drop_down_editor";
import DataExpressionMixin from "./editor/ui.data_expression";
import commonUtils from "../core/utils/common";
import { map } from "../core/utils/iterator";
import selectors from "./widget/selectors";
import KeyboardProcessor from "./widget/ui.keyboard_processor";
import { when, Deferred } from "../core/utils/deferred";
import $ from "../core/renderer";
import eventsEngine from "../events/core/events_engine";
import { grep } from "../core/utils/common";
import { extend } from "../core/utils/extend";
import { getElementMaxHeightByWindow } from "../ui/overlay/utils";
import registerComponent from "../core/component_registrator";
import { normalizeKeyName } from "../events/utils";

var DROP_DOWN_BOX_CLASS = "dx-dropdownbox",
    ANONYMOUS_TEMPLATE_NAME = "content";

/**
 * @name dxDropDownBox
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
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

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDropDownBoxOptions.attr
             * @inheritdoc
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.acceptCustomValue
             * @type boolean
             * @default false
             */
            acceptCustomValue: false,

            /**
             * @name dxDropDownBoxOptions.contentTemplate
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
             * @type dxPopupOptions
             * @default {}
             */

            /**
             * @name dxDropDownBoxOptions.fieldTemplate
             * @type template|function
             * @default null
             * @type_function_param1 value:object
             * @type_function_param2 fieldElement:dxElement
             * @type_function_return string|Node|jQuery
             */

            /**
             * @name dxDropDownBoxOptions.maxLength
             * @type string|number
             * @default null
             * @hidden
             */

            /**
            * @name dxDropDownBoxOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
             * @name dxDropDownBoxOptions.spellcheck
             * @type boolean
             * @default false
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.applyValueMode
             * @type string
             * @default "instantly"
             * @acceptValues 'useButtons'|'instantly'
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.itemTemplate
             * @type template
             * @default "item"
             * @inheritdoc
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.openOnFieldClick
             * @inheritdoc
             * @default true
             */
            openOnFieldClick: true,

            /**
             * @name dxDropDownBoxOptions.valueChangeEvent
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
                values.push(commonUtils.ensureDefined(displayValue, key));
            }).bind(this));
        }).bind(this));

        when.apply(this, itemLoadDeferreds).always((function() {
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

    _updatePopupWidth: function() {
        this._setPopupOption("width", this.$element().outerWidth());
    },

    _popupElementTabHandler: function(e) {
        if(normalizeKeyName(e) !== "tab") return;

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
            width: function() {
                return this.$element().outerWidth();
            }.bind(this),
            height: "auto",
            tabIndex: -1,
            dragEnabled: false,
            focusStateEnabled: this.option("focusStateEnabled"),
            maxHeight: function() {
                return getElementMaxHeightByWindow(this.$element());
            }.bind(this)
        });
    },

    _popupShownHandler: function() {
        this.callBase();
        var $firstElement = this._getTabbableElements().first();
        eventsEngine.trigger($firstElement, "focus");
    },

    _setCollectionWidgetOption: commonUtils.noop,

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case "width":
                this.callBase(args);
                this._updatePopupWidth();
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
