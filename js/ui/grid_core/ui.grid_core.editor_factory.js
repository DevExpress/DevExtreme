"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    isWrapped = require("../../core/utils/variable_wrapper").isWrapped,
    compileGetter = require("../../core/utils/data").compileGetter,
    modules = require("./ui.grid_core.modules"),
    browser = require("../../core/utils/browser"),
    extend = require("../../core/utils/extend").extend,
    devices = require("../../core/devices"),
    positionUtils = require("../../animation/position"),
    eventUtils = require("../../events/utils"),
    clickEvent = require("../../events/click"),
    pointerEvents = require("../../events/pointer"),
    normalizeDataSourceOptions = require("../../data/data_source/data_source").normalizeDataSourceOptions,
    compareVersion = require("../../core/utils/version").compare,
    addNamespace = eventUtils.addNamespace;

require("../text_box");
require("../number_box");
require("../check_box");
require("../select_box");
require("../date_box");


var CHECKBOX_SIZE_CLASS = "checkbox-size",
    FOCUS_OVERLAY_CLASS = "focus-overlay",
    CONTENT_CLASS = "content",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    EDITOR_INLINE_BLOCK = "dx-editor-inline-block",
    MODULE_NAMESPACE = "dxDataGridEditorFactory",
    UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, "focusin", clickEvent.name].join(" "), MODULE_NAMESPACE),
    FOCUSED_ELEMENT_CLASS = "dx-focused",
    POINTER_EVENTS_TARGET_CLASS = "dx-pointer-events-target",
    POINTER_EVENTS_NONE_CLASS = "dx-pointer-events-none",
    EDITORS_INPUT_SELECTOR = "input:not([type='hidden'])",
    FOCUSED_ELEMENT_SELECTOR = "td[tabindex]:focus, input:focus, .dx-lookup-field:focus",
    DX_HIDDEN = "dx-hidden",
    TAB_KEY = 9;

var EditorFactoryController = modules.ViewController.inherit((function() {

    var getResultConfig = function(config, options) {
        return extend(config, {
            readOnly: options.readOnly,
            placeholder: options.placeholder,
            inputAttr: {
                id: options.id
            },
            tabIndex: options.tabIndex
        }, options.editorOptions);
    };

    var checkEnterBug = function() {
        return (browser.msie && parseInt(browser.version) <= 11) || devices.real().ios;//T344096, T249363, T314719 rid off after fix https://connect.microsoft.com/IE/feedback/details/1552272/
    };

    var getTextEditorConfig = function(options) {
        var isValueChanged = false,
            data = {},
            isEnterBug = checkEnterBug(),
            sharedData = options.sharedData || data;

        return getResultConfig({
            placeholder: options.placeholder,
            width: options.width,
            value: options.value,
            onValueChanged: function(e) {
                var updateValue = function(e, notFireEvent) {
                    isValueChanged = false;
                    options && options.setValue(e.value, notFireEvent);
                };

                window.clearTimeout(data.valueChangeTimeout);

                if(e.jQueryEvent && e.jQueryEvent.type === "keyup" && !options.updateValueImmediately) {
                    if(options.parentType === "filterRow" || options.parentType === "searchPanel") {
                        sharedData.valueChangeTimeout = data.valueChangeTimeout = window.setTimeout(function() {
                            updateValue(e, data.valueChangeTimeout !== sharedData.valueChangeTimeout);
                        }, typeUtils.isDefined(options.updateValueTimeout) ? options.updateValueTimeout : 0);
                    } else {
                        isValueChanged = true;
                    }
                } else {
                    updateValue(e);
                }
            },
            onFocusOut: function(e) {
                if(isEnterBug && isValueChanged) {
                    isValueChanged = false;
                    options.setValue(e.component.option("value"));
                }
            },
            onKeyDown: function(e) {
                if(isEnterBug && isValueChanged && e.jQueryEvent.keyCode === 13) {
                    isValueChanged = false;
                    options.setValue(e.component.option("value"));
                }
            },
            valueChangeEvent: "change" + (options.parentType === "filterRow" || isEnterBug ? " keyup" : "")
        }, options);
    };

    var prepareDateBox = function(options) {
        options.editorName = "dxDateBox";

        options.editorOptions = getResultConfig({
            value: options.value,
            onValueChanged: function(args) {
                options.setValue(args.value);
            },
            onKeyDown: function(e) {
                if(checkEnterBug() && e.jQueryEvent.keyCode === 13) {
                    e.component.blur();
                    e.component.focus();
                }
            },
            displayFormat: options.format,
            type: options.dataType,
            formatWidthCalculator: null,
            width: "auto"
        }, options);
    };

    var prepareTextBox = function(options) {
        var config = getTextEditorConfig(options),
            isSearching = options.parentType === "searchPanel",
            toString = function(value) {
                return typeUtils.isDefined(value) ? value.toString() : "";
            };

        config.value = toString(options.value);
        config.valueChangeEvent += (isSearching ? " keyup search" : "");
        config.mode = isSearching ? "search" : "text";

        options.editorName = "dxTextBox";
        options.editorOptions = config;
        //$container.dxTextBox(config);
        //$container.dxTextBox("instance").registerKeyHandler("enter", commonUtils.noop);
    };

    var prepareNumberBox = function(options) {
        var config = getTextEditorConfig(options);

        config.value = typeUtils.isDefined(options.value) ? options.value : null;

        options.editorName = "dxNumberBox";

        options.editorOptions = config;
    };

    var prepareBooleanEditor = function(options) {
        if(options.parentType === "filterRow") {
            prepareSelectBox(extend(options, {
                lookup: {
                    displayExpr: function(data) {
                        if(data === true) {
                            return options.trueText || "true";
                        } else if(data === false) {
                            return options.falseText || "false";
                        }
                    },
                    dataSource: [true, false]
                }
            }));
        } else {
            prepareCheckBox(options);
        }
    };

    var prepareSelectBox = function(options) {
        var lookup = options.lookup,
            displayGetter,
            dataSource,
            postProcess,
            isFilterRow = options.parentType === "filterRow";

        if(lookup) {
            displayGetter = compileGetter(lookup.displayExpr);
            dataSource = lookup.dataSource;

            if(typeUtils.isFunction(dataSource) && !isWrapped(dataSource)) {
                dataSource = dataSource(options.row || {});
            }

            if(typeUtils.isObject(dataSource) || Array.isArray(dataSource)) {
                dataSource = normalizeDataSourceOptions(dataSource);
                if(isFilterRow) {
                    postProcess = dataSource.postProcess;
                    dataSource.postProcess = function(items) {
                        if(this.pageIndex() === 0) {
                            items = items.slice(0);
                            items.unshift(null);
                        }
                        if(postProcess) {
                            return postProcess.call(this, items);
                        }
                        return items;
                    };
                }
            }

            var allowClearing = Boolean(lookup.allowClearing && !isFilterRow);

            options.editorName = "dxSelectBox";
            options.editorOptions = getResultConfig({
                searchEnabled: true,
                value: options.value,
                valueExpr: options.lookup.valueExpr,
                searchExpr: options.lookup.searchExpr || options.lookup.displayExpr,
                allowClearing: allowClearing,
                showClearButton: allowClearing,
                displayExpr: function(data) {
                    if(data === null) {
                        return options.showAllText;
                    }
                    return displayGetter(data);
                },
                dataSource: dataSource,
                onValueChanged: function(e) {
                    var params = [e.value];

                    !isFilterRow && params.push(e.component.option("text"));
                    options.setValue.apply(this, params);
                }
            }, options);
        }
    };

    var prepareCheckBox = function(options) {
        options.editorName = "dxCheckBox";
        options.editorOptions = getResultConfig({
            value: typeUtils.isDefined(options.value) ? options.value : undefined,
            hoverStateEnabled: !options.readOnly,
            focusStateEnabled: !options.readOnly,
            activeStateEnabled: false,
            onValueChanged: function(e) {
                options.setValue && options.setValue(e.value, e);
            },
        }, options);
    };

    var createEditorCore = function(that, options) {
        if(options.editorName && options.editorOptions && options.editorElement[options.editorName]) {
            if(options.editorName === "dxCheckBox") {
                if(!options.isOnForm) {
                    options.editorElement.addClass(that.addWidgetPrefix(CHECKBOX_SIZE_CLASS));
                    options.editorElement.parent().addClass(EDITOR_INLINE_BLOCK);
                }
                if(options.command || options.editorOptions.readOnly) {
                    options.editorElement.parent().addClass(CELL_FOCUS_DISABLED_CLASS);
                }
            }

            that._createComponent(options.editorElement, options.editorName, options.editorOptions);

            if(options.editorName === "dxTextBox") {
                options.editorElement.dxTextBox("instance").registerKeyHandler("enter", noop);
            }
        }
    };
    return {
        _getFocusedElement: function($dataGridElement) {
            //T181706
            return $dataGridElement.find(FOCUSED_ELEMENT_SELECTOR);
        },

        _getFocusCellSelector: function() {
            return ".dx-row > td";
        },

        _updateFocusCore: function() {
            var $focus = this._$focusedElement,
                $dataGridElement = this.component && this.component.element(),
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
                            precise: compareVersion($.fn.jquery, [3]) >= 0,
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
            $(document).on(UPDATE_FOCUS_EVENTS, this._updateFocusHandler);

            this._attachContainerEventHandlers();
        },

        _attachContainerEventHandlers: function() {
            var that = this,
                $container = that.component && that.component.element(),
                isIE10OrLower = browser.msie && parseInt(browser.version) < 11;

            if($container) {
                //T179518
                $container.on(addNamespace("keydown", MODULE_NAMESPACE), function(e) {
                    if(e.which === TAB_KEY) {
                        that._updateFocusHandler(e);
                    }
                });

                //T112103, T110581, T174768
                isIE10OrLower && $container.on([pointerEvents.down, pointerEvents.move, pointerEvents.up, clickEvent.name].join(" "), "." + POINTER_EVENTS_TARGET_CLASS, that._focusOverlayEventProxy.bind(that));
            }
        },

        _focusOverlayEventProxy: function(e) {
            var $target = $(e.target),
                $currentTarget = $(e.currentTarget),
                element,
                needProxy = $target.hasClass(POINTER_EVENTS_TARGET_CLASS) || $target.hasClass(POINTER_EVENTS_NONE_CLASS),
                $focusedElement = this._$focusedElement;

            if(!needProxy || $currentTarget.hasClass(DX_HIDDEN)) return;

            $currentTarget.addClass(DX_HIDDEN);

            element = $target.get(0).ownerDocument.elementFromPoint(e.clientX, e.clientY);

            eventUtils.fireEvent({
                originalEvent: e,
                target: element
            });

            e.stopPropagation();

            $currentTarget.removeClass(DX_HIDDEN);

            $focusedElement && $focusedElement.find(EDITORS_INPUT_SELECTOR).focus();
        },

        dispose: function() {
            clearTimeout(this._focusTimeoutID);
            clearTimeout(this._updateFocusTimeoutID);
            $(document).off(UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
        },

        createEditor: function($container, options) {
            options.cancel = false;
            options.editorElement = $container;

            if(!typeUtils.isDefined(options.tabIndex)) {
                options.tabIndex = this.option("tabIndex");
            }

            if(options.lookup) {
                prepareSelectBox(options);
            } else {
                switch(options.dataType) {
                    case "date":
                    case "datetime":
                        prepareDateBox(options);
                        break;
                    case "boolean":
                        prepareBooleanEditor(options);
                        break;
                    case "number":
                        prepareNumberBox(options);
                        break;
                    default:
                        prepareTextBox(options);
                        break;
                }
            }

            this.executeAction("onEditorPreparing", options);

            if(options.cancel) {
                return;
            }

            createEditorCore(this, options);

            this.executeAction("onEditorPrepared", options);
        }
    };
})());

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
              * @type_function_param1_field12 editorElement:jQuery
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
              * @type_function_param1_field12 editorElement:jQuery
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
              * @type_function_param1_field11 editorElement:jQuery
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
              * @type_function_param1_field11 editorElement:jQuery
              * @type_function_param1_field12 readOnly:boolean
              * @type_function_param1_field13 dataField:string
              * @type_function_param1_field14 row:dxTreeListRowObject
              * @extends Action
              * @action
             */
        };
    },
    controllers: {
        editorFactory: EditorFactoryController
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
