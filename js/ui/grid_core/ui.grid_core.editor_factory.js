"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    modules = require("./ui.grid_core.modules"),
    clickEvent = require("../../events/click"),
    contextMenuEvent = require("../../events/contextmenu"),
    pointerEvents = require("../../events/pointer"),
    positionUtils = require("../../animation/position"),
    eventUtils = require("../../events/utils"),
    addNamespace = eventUtils.addNamespace,
    browser = require("../../core/utils/browser"),
    extend = require("../../core/utils/extend").extend,
    EditorFactoryMixin = require("../shared/ui.editor_factory_mixin");

var EDITOR_INLINE_BLOCK = "dx-editor-inline-block",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    FOCUS_OVERLAY_CLASS = "focus-overlay",
    CONTENT_CLASS = "content",
    FOCUSED_ELEMENT_CLASS = "dx-focused",
    MODULE_NAMESPACE = "dxDataGridEditorFactory",
    UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, "focusin", clickEvent.name].join(" "), MODULE_NAMESPACE),
    POINTER_EVENTS_TARGET_CLASS = "dx-pointer-events-target",
    POINTER_EVENTS_NONE_CLASS = "dx-pointer-events-none",
    FOCUSED_ELEMENT_SELECTOR = "td[tabindex]:focus, input:focus, textarea:focus, .dx-lookup-field:focus, .dx-checkbox:focus",
    DX_HIDDEN = "dx-hidden",
    TAB_KEY = 9;

var EditorFactory = modules.ViewController.inherit({
    _getFocusedElement: function($dataGridElement) {
        //T181706
        return $dataGridElement.find(FOCUSED_ELEMENT_SELECTOR);
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
            //this selector is specific to IE
            $focus = this._getFocusedElement($dataGridElement);

            if($focus.length) {
                if(!$focus.hasClass(CELL_FOCUS_DISABLED_CLASS)) {
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
            isFocusOverlay = e && e.jQueryEvent && $(e.jQueryEvent.target).hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));

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
            that._focusTimeoutID = setTimeout(function() {
                delete that._focusTimeoutID;
                var $focusOverlay = that._$focusOverlay = that._$focusOverlay || $("<div>")
                    .addClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS) + " " + POINTER_EVENTS_TARGET_CLASS),
                    focusOverlayPosition;

                if(hideBorder) {
                    that._$focusOverlay && that._$focusOverlay.addClass(DX_HIDDEN);
                } else {
                    // align "left bottom" for IE, align "right bottom" for Mozilla
                    var align = browser.msie ? "left bottom" : browser.mozilla ? "right bottom" : "left top",
                        $content = $element.closest("." + that.addWidgetPrefix(CONTENT_CLASS));

                    $focusOverlay
                        .removeClass(DX_HIDDEN)
                        .appendTo($content)
                        .outerWidth($element.outerWidth() + 1)
                        .outerHeight($element.outerHeight() + 1);

                    focusOverlayPosition = {
                        precise: true,
                        my: align,
                        at: align,
                        of: $element,
                        boundary: $content.length && $content
                    };

                    that._updateFocusOverlaySize($focusOverlay, focusOverlayPosition);
                    positionUtils.setup($focusOverlay, focusOverlayPosition);

                    $focusOverlay.css("visibility", "visible"); // for ios
                }

                that._$focusedElement && that._$focusedElement.removeClass(FOCUSED_ELEMENT_CLASS);
                $element.addClass(FOCUSED_ELEMENT_CLASS);
                that._$focusedElement = $element;
                that.focused.fire($element);
            });
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
        this.createAction("onEditorPreparing", { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" });
        this.createAction("onEditorPrepared", { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" });

        this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));
        eventsEngine.on(document, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

        this._attachContainerEventHandlers();
    },

    _attachContainerEventHandlers: function() {
        var that = this,
            $container = that.component && that.component.$element(),
            isIE10OrLower = browser.msie && parseInt(browser.version) < 11;

        if($container) {
            //T179518
            eventsEngine.on($container, addNamespace("keydown", MODULE_NAMESPACE), function(e) {
                if(e.which === TAB_KEY) {
                    that._updateFocusHandler(e);
                }
            });

            //T112103, T110581, T174768, T551322
            isIE10OrLower && eventsEngine.on($container, [pointerEvents.down, pointerEvents.move, pointerEvents.up, clickEvent.name, contextMenuEvent.name].join(" "), "." + POINTER_EVENTS_TARGET_CLASS, that._focusOverlayEventProxy.bind(that));
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

        eventUtils.fireEvent({
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
        eventsEngine.off(document, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
    }
}).inherit(EditorFactoryMixin);

module.exports = {
    defaultOptions: function() {
        return {
            /**
              * @name dxDataGridOptions_onEditorPreparing
              * @publicName onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 cancel:boolean
              * @type_function_param1_field12 editorElement:Element
              * @type_function_param1_field13 readOnly:boolean
              * @type_function_param1_field14 editorName:string
              * @type_function_param1_field15 editorOptions:object
              * @type_function_param1_field16 dataField:string
              * @type_function_param1_field17 row:dxDataGridRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxTreeListOptions_onEditorPreparing
              * @publicName onEditorPreparing
              * @type function(e)
              * @type_function_param1 e:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 cancel:boolean
              * @type_function_param1_field12 editorElement:Element
              * @type_function_param1_field13 readOnly:boolean
              * @type_function_param1_field14 editorName:string
              * @type_function_param1_field15 editorOptions:object
              * @type_function_param1_field16 dataField:string
              * @type_function_param1_field17 row:dxTreeListRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxDataGridOptions_onEditorPrepared
              * @publicName onEditorPrepared
              * @type function(options)
              * @type_function_param1 options:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 editorElement:Element
              * @type_function_param1_field12 readOnly:boolean
              * @type_function_param1_field13 dataField:string
              * @type_function_param1_field14 row:dxDataGridRowObject
              * @extends Action
              * @action
             */

            /**
              * @name dxTreeListOptions_onEditorPrepared
              * @publicName onEditorPrepared
              * @type function(options)
              * @type_function_param1 options:object
              * @type_function_param1_field4 parentType:string
              * @type_function_param1_field5 value:any
              * @type_function_param1_field6 setValue(newValue):any
              * @type_function_param1_field7 updateValueTimeout:number
              * @type_function_param1_field8 width:number
              * @type_function_param1_field9 disabled:boolean
              * @type_function_param1_field10 rtlEnabled:boolean
              * @type_function_param1_field11 editorElement:Element
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
