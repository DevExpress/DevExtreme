import $ from "../../core/renderer";
import domAdapter from "../../core/dom_adapter";
import eventsEngine from "../../events/core/events_engine";
import modules from "./ui.grid_core.modules";
import clickEvent from "../../events/click";
import pointerEvents from "../../events/pointer";
import positionUtils from "../../animation/position";
import { addNamespace, fireEvent, normalizeKeyName } from "../../events/utils";
import browser from "../../core/utils/browser";
import { extend } from "../../core/utils/extend";
import EditorFactoryMixin from "../shared/ui.editor_factory_mixin";

var EDITOR_INLINE_BLOCK = "dx-editor-inline-block",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    FOCUS_OVERLAY_CLASS = "focus-overlay",
    CONTENT_CLASS = "content",
    FOCUSED_ELEMENT_CLASS = "dx-focused",
    ROW_CLASS = "dx-row",
    MODULE_NAMESPACE = "dxDataGridEditorFactory",
    UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, "focusin", clickEvent.name].join(" "), MODULE_NAMESPACE),
    POINTER_EVENTS_TARGET_CLASS = "dx-pointer-events-target",
    POINTER_EVENTS_NONE_CLASS = "dx-pointer-events-none",
    DX_HIDDEN = "dx-hidden";

var EditorFactory = modules.ViewController.inherit({
    _getFocusedElement: function($dataGridElement) {
        const rowSelector = this.option("focusedRowEnabled") ? "tr[tabindex]:focus" : "tr[tabindex]:not(.dx-data-row):focus",
            focusedElementSelector = `td[tabindex]:focus, ${rowSelector}, input:focus, textarea:focus, .dx-lookup-field:focus, .dx-checkbox:focus`;

        // T181706
        return $dataGridElement.find(focusedElementSelector);
    },

    _getFocusCellSelector: function() {
        return ".dx-row > td";
    },

    _updateFocusCore: function() {
        var $focus = this._$focusedElement,
            $dataGridElement = this.component && this.component.$element(),
            $focusCell,
            hideBorders;

        if($dataGridElement) {
            // this selector is specific to IE
            $focus = this._getFocusedElement($dataGridElement);

            if($focus.length) {
                if(!$focus.hasClass(CELL_FOCUS_DISABLED_CLASS) && !$focus.hasClass(ROW_CLASS)) {
                    $focusCell = $focus.closest(this._getFocusCellSelector() + ", ." + CELL_FOCUS_DISABLED_CLASS);
                    hideBorders = $focusCell.get(0) !== $focus.get(0) && $focusCell.hasClass(EDITOR_INLINE_BLOCK);
                    $focus = $focusCell;
                }

                if($focus.length && !$focus.hasClass(CELL_FOCUS_DISABLED_CLASS)) {
                    this.focus($focus, hideBorders);
                    return;
                }
            }
        }

        this.loseFocus();
    },

    _updateFocus: function(e) {
        var that = this,
            isFocusOverlay = e && e.event && $(e.event.target).hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

        that._isFocusOverlay = that._isFocusOverlay || isFocusOverlay;

        clearTimeout(that._updateFocusTimeoutID);

        that._updateFocusTimeoutID = setTimeout(function() {
            delete that._updateFocusTimeoutID;
            if(!that._isFocusOverlay) {
                that._updateFocusCore();
            }
            that._isFocusOverlay = false;
        });
    },

    _updateFocusOverlaySize: function($element, position) {
        var location = positionUtils.calculate($element, extend({ collision: "fit" }, position));

        if(location.h.oversize > 0) {
            $element.outerWidth($element.outerWidth() - location.h.oversize);
        }

        if(location.v.oversize > 0) {
            $element.outerHeight($element.outerHeight() - location.v.oversize);
        }
    },

    callbackNames: function() {
        return ["focused"];
    },

    focus: function($element, hideBorder) {
        var that = this;

        if($element === undefined) {
            return that._$focusedElement;
        } else if($element) {
            // To prevent overlay flicking
            if(!$element.is(that._$focusedElement)) {
                // TODO: this code should be before timeout else focus is not will move to adaptive form by shift + tab key
                that._$focusedElement && that._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
            }
            that._$focusedElement = $element;

            clearTimeout(that._focusTimeoutID);
            that._focusTimeoutID = setTimeout(function() {
                delete that._focusTimeoutID;

                that.renderFocusOverlay($element, hideBorder);

                $element.addClass(FOCUSED_ELEMENT_CLASS);
                that.focused.fire($element);
            });
        }
    },

    renderFocusOverlay: function($element, hideBorder) {
        var that = this,
            focusOverlayPosition;

        if(!that._$focusOverlay) {
            that._$focusOverlay = $("<div>").addClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS) + " " + POINTER_EVENTS_TARGET_CLASS);
        }

        if(hideBorder) {
            that._$focusOverlay.addClass(DX_HIDDEN);
        } else if($element.length) {
            // align "left bottom" for IE, align "right bottom" for Mozilla
            var align = browser.msie ? "left bottom" : browser.mozilla ? "right bottom" : "left top",
                $content = $element.closest("." + that.addWidgetPrefix(CONTENT_CLASS)),
                elemCoord = $element[0].getBoundingClientRect();

            that._$focusOverlay
                .removeClass(DX_HIDDEN)
                .appendTo($content)
                .outerWidth(elemCoord.right - elemCoord.left + 1)
                .outerHeight(elemCoord.bottom - elemCoord.top + 1);

            focusOverlayPosition = {
                precise: true,
                my: align,
                at: align,
                of: $element,
                boundary: $content.length && $content
            };

            that._updateFocusOverlaySize(that._$focusOverlay, focusOverlayPosition);
            positionUtils.setup(that._$focusOverlay, focusOverlayPosition);

            that._$focusOverlay.css("visibility", "visible"); // for ios
        }
    },

    resize: function() {
        var $focusedElement = this._$focusedElement;

        if($focusedElement) {
            this.focus($focusedElement);
        }
    },

    loseFocus: function() {
        this._$focusedElement && this._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
        this._$focusedElement = null;
        this._$focusOverlay && this._$focusOverlay.addClass(DX_HIDDEN);
    },

    init: function() {
        this.createAction("onEditorPreparing", { excludeValidators: ["disabled", "readOnly"], category: "rendering" });
        this.createAction("onEditorPrepared", { excludeValidators: ["disabled", "readOnly"], category: "rendering" });

        this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));
        eventsEngine.on(domAdapter.getDocument(), UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

        this._attachContainerEventHandlers();
    },

    _attachContainerEventHandlers: function() {
        var that = this,
            $container = that.component && that.component.$element();

        if($container) {
            // T179518
            eventsEngine.on($container, addNamespace("keydown", MODULE_NAMESPACE), function(e) {
                if(normalizeKeyName(e) === "tab") {
                    that._updateFocusHandler(e);
                }
            });
        }
    },

    _focusOverlayEventProxy: function(e) {
        var $target = $(e.target),
            $currentTarget = $(e.currentTarget),
            element,
            needProxy = $target.hasClass(POINTER_EVENTS_TARGET_CLASS) || $target.hasClass(POINTER_EVENTS_NONE_CLASS);

        if(!needProxy || $currentTarget.hasClass(DX_HIDDEN)) return;

        $currentTarget.addClass(DX_HIDDEN);

        element = $target.get(0).ownerDocument.elementFromPoint(e.clientX, e.clientY);

        fireEvent({
            originalEvent: e,
            target: element
        });

        e.stopPropagation();

        $currentTarget.removeClass(DX_HIDDEN);

        if(e.type === clickEvent.name && element.tagName === "INPUT") {
            eventsEngine.trigger($(element), "focus");
        }
    },

    dispose: function() {
        clearTimeout(this._focusTimeoutID);
        clearTimeout(this._updateFocusTimeoutID);
        eventsEngine.off(domAdapter.getDocument(), UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
    }
}).include(EditorFactoryMixin);

module.exports = {
    defaultOptions: function() {
        return {
            /**
              * @name dxDataGridOptions.onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue, newText):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 cancel:boolean
              * @type_function_param1_field12 editorElement:dxElement
              * @type_function_param1_field13 readOnly:boolean
              * @type_function_param1_field14 editorName:string
              * @type_function_param1_field15 editorOptions:object
              * @type_function_param1_field16 dataField:string
              * @type_function_param1_field17 row:dxDataGridRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxTreeListOptions.onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue, newText):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 cancel:boolean
              * @type_function_param1_field12 editorElement:dxElement
              * @type_function_param1_field13 readOnly:boolean
              * @type_function_param1_field14 editorName:string
              * @type_function_param1_field15 editorOptions:object
              * @type_function_param1_field16 dataField:string
              * @type_function_param1_field17 row:dxTreeListRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxDataGridOptions.onEditorPrepared
              * @type function(options)
              * @type_function_param1 options:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue, newText):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 editorElement:dxElement
              * @type_function_param1_field12 readOnly:boolean
              * @type_function_param1_field13 dataField:string
              * @type_function_param1_field14 row:dxDataGridRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxTreeListOptions.onEditorPrepared
              * @type function(options)
              * @type_function_param1 options:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue, newText):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 editorElement:dxElement
              * @type_function_param1_field12 readOnly:boolean
              * @type_function_param1_field13 dataField:string
              * @type_function_param1_field14 row:dxTreeListRowObject
              * @extends Action
              * @action
             */
        };
    },
    controllers: {
        editorFactory: EditorFactory
    },
    extenders: {
        controllers: {
            columnsResizer: {
                _startResizing: function(args) {
                    this.callBase(args);

                    if(this.isResizing()) {
                        this.getController("editorFactory").loseFocus();
                    }
                }
            }
        }
    }
};
