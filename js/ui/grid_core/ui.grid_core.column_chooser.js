import $ from "../../core/renderer";
import { deferUpdate } from "../../core/utils/common";
import modules from "./ui.grid_core.modules";
import columnsView from "./ui.grid_core.columns_view";
import messageLocalization from "../../localization/message";
import themes from "../themes";
import Button from "../button";
import TreeView from "../tree_view";
import devices from "../../core/devices";
import Popup from "../popup";
import { noop } from "../../core/utils/common";
import { isDefined } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { each } from "../../core/utils/iterator";

var COLUMN_CHOOSER_CLASS = "column-chooser",
    COLUMN_CHOOSER_BUTTON_CLASS = "column-chooser-button",
    NOTOUCH_ACTION_CLASS = "notouch-action",
    COLUMN_CHOOSER_LIST_CLASS = "column-chooser-list",
    COLUMN_CHOOSER_PLAIN_CLASS = "column-chooser-plain",
    COLUMN_CHOOSER_DRAG_CLASS = "column-chooser-mode-drag",
    COLUMN_CHOOSER_SELECT_CLASS = "column-chooser-mode-select",
    COLUMN_CHOOSER_ICON_NAME = "column-chooser",
    COLUMN_CHOOSER_ITEM_CLASS = "dx-column-chooser-item",

    TREEVIEW_NODE_SELECTOR = ".dx-treeview-node",
    CHECKBOX_SELECTOR = ".dx-checkbox",

    CLICK_TIMEOUT = 300,

    processItems = function(that, chooserColumns) {
        var item,
            items = [],
            isSelectMode = that.option("columnChooser.mode") === "select";

        if(chooserColumns.length) {
            each(chooserColumns, function(index, column) {
                item = {
                    text: column.caption,
                    cssClass: column.cssClass,
                    allowHiding: column.allowHiding,
                    expanded: true,
                    id: column.index,
                    disabled: false,
                    disableCheckBox: column.allowHiding === false,
                    parentId: isDefined(column.ownerBand) ? column.ownerBand : null
                };

                if(isSelectMode) {
                    item.selected = column.visible;
                }

                items.push(item);
            });
        }

        return items;
    };

var ColumnChooserController = modules.ViewController.inherit({
    renderShowColumnChooserButton: function($element) {
        var that = this,
            columnChooserButtonClass = that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS),
            columnChooserEnabled = that.option("columnChooser.enabled"),
            $showColumnChooserButton = $element.find("." + columnChooserButtonClass),
            $columnChooserButton;

        if(columnChooserEnabled) {
            if(!$showColumnChooserButton.length) {
                $columnChooserButton = $("<div>")
                    .addClass(columnChooserButtonClass)
                    .appendTo($element);

                that._createComponent($columnChooserButton, Button, {
                    icon: COLUMN_CHOOSER_ICON_NAME,
                    onClick: function() {
                        that.getView("columnChooserView").showColumnChooser();
                    },
                    hint: that.option("columnChooser.title"),
                    integrationOptions: {}
                });
            } else {
                $showColumnChooserButton.show();
            }
        } else {
            $showColumnChooserButton.hide();
        }
    },

    getPosition: function() {
        var rowsView = this.getView("rowsView");

        return {
            my: "right bottom",
            at: "right bottom",
            of: rowsView && rowsView.element(),
            collision: "fit",
            offset: "-2 -2",
            boundaryOffset: "2 2"
        };
    }
});

var ColumnChooserView = columnsView.ColumnsView.inherit({
    _resizeCore: noop,

    _isWinDevice: function() {
        return !!devices.real().win;
    },

    _updateList: function(change) {
        var items,
            $popupContent = this._popupContainer.$content(),
            isSelectMode = this.option("columnChooser.mode") === "select",
            columnChooserList = this._columnChooserList,
            chooserColumns = this._columnsController.getChooserColumns(isSelectMode);

        // T726413
        if(isSelectMode && columnChooserList && change && change.changeType === "selection") {
            items = processItems(this, chooserColumns);
            for(var i = 0; i < items.length; i++) {
                if(items[i].id === change.columnIndex) {
                    columnChooserList.option("items[" + i + "].selected", items[i].selected);
                }
            }
        } else if(!isSelectMode || !columnChooserList || change === "full") {
            this._popupContainer._wrapper()
                .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode)
                .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);

            items = processItems(this, chooserColumns);
            this._renderTreeView($popupContent, items);
        }
    },

    _initializePopupContainer: function() {
        var that = this,
            $element = that.element().addClass(that.addWidgetPrefix(COLUMN_CHOOSER_CLASS)),
            columnChooserOptions = that.option("columnChooser"),
            themeName = themes.current(),
            isGenericTheme = themes.isGeneric(themeName),
            isMaterial = themes.isMaterial(themeName),
            dxPopupOptions = {
                visible: false,
                shading: false,
                showCloseButton: false,
                dragEnabled: true,
                resizeEnabled: true,
                toolbarItems: [
                    { text: columnChooserOptions.title, toolbar: "top", location: isGenericTheme || isMaterial ? "before" : "center" }
                ],
                position: that.getController("columnChooser").getPosition(),
                width: columnChooserOptions.width,
                height: columnChooserOptions.height,
                rtlEnabled: that.option("rtlEnabled"),
                onHidden: function() {
                    if(that._isWinDevice()) {
                        $("body").removeClass(that.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
                    }
                },
                container: columnChooserOptions.container
            };

        if(isGenericTheme || isMaterial) {
            extend(dxPopupOptions, { showCloseButton: true });
        } else {
            dxPopupOptions.toolbarItems[dxPopupOptions.toolbarItems.length] = { shortcut: "cancel" };
        }

        if(!isDefined(this._popupContainer)) {
            that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);

            that._popupContainer.on("optionChanged", function(args) {
                if(args.name === "visible") {
                    that.renderCompleted.fire();
                }
            });
        } else {
            this._popupContainer.option(dxPopupOptions);
        }
    },

    _renderCore: function(change) {
        if(this._popupContainer) {
            this._updateList(change);
        }
    },

    _renderTreeView: function($container, items) {
        var that = this,
            scrollTop,
            scrollableInstance,
            columnChooser = this.option("columnChooser"),
            isSelectMode = columnChooser.mode === "select",
            treeViewConfig = {
                items: items,
                dataStructure: "plain",
                activeStateEnabled: true,
                focusStateEnabled: true,
                hoverStateEnabled: true,
                itemTemplate: "item",
                showCheckBoxesMode: "none",
                rootValue: null,
                searchEnabled: columnChooser.allowSearch,
                searchTimeout: columnChooser.searchTimeout,
                onItemRendered: function(e) {
                    if(e.itemData.disableCheckBox) {
                        let $treeViewNode = $(e.itemElement.closest(TREEVIEW_NODE_SELECTOR)),
                            checkBoxInstance,
                            $checkBox;

                        if($treeViewNode.length) {

                            $checkBox = $treeViewNode.find(CHECKBOX_SELECTOR);

                            if($checkBox.length) {
                                checkBoxInstance = $checkBox.data("dxCheckBox");

                                checkBoxInstance && checkBoxInstance.option("disabled", true);
                            }
                        }
                    }
                }
            };

        scrollableInstance = $container.find(".dx-scrollable").data("dxScrollable");
        scrollTop = scrollableInstance && scrollableInstance.scrollTop();

        if(isSelectMode && !this._columnsController.isBandColumnsUsed()) {
            $container.addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
        }

        treeViewConfig.onContentReady = function(e) {
            deferUpdate(function() {
                if(scrollTop) {
                    var scrollable = $(e.element).find(".dx-scrollable").data("dxScrollable");
                    scrollable && scrollable.scrollTo({ y: scrollTop });
                }

                that.renderCompleted.fire();
            });
        };


        if(this._isWinDevice()) {
            treeViewConfig.useNativeScrolling = false;
        }
        extend(treeViewConfig, isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig());

        if(this._columnChooserList) {
            if(!treeViewConfig.searchEnabled) {
                treeViewConfig.searchValue = "";
            }

            this._columnChooserList.option(treeViewConfig);
        } else {
            this._columnChooserList = this._createComponent($container, TreeView, treeViewConfig);
            $container.addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));
        }
    },

    _prepareDragModeConfig: function() {
        var columnChooserOptions = this.option("columnChooser");

        return {
            noDataText: columnChooserOptions.emptyPanelText,
            activeStateEnabled: false,
            focusStateEnabled: false,
            hoverStateEnabled: false,
            itemTemplate: function(data, index, item) {
                $(item)
                    .text(data.text)
                    .parent()
                    .addClass(data.cssClass)
                    .addClass(COLUMN_CHOOSER_ITEM_CLASS);
            }
        };
    },

    _prepareSelectModeConfig: function() {
        var that = this,
            selectionChangedHandler = function(e) {
                var visibleColumns = that._columnsController.getVisibleColumns().filter(function(item) { return !item.command; }),
                    isLastColumnUnselected = visibleColumns.length === 1 && !e.itemData.selected;

                if(isLastColumnUnselected) {
                    e.component.selectItem(e.itemElement);
                } else {
                    setTimeout(function() {
                        that._columnsController.columnOption(e.itemData.id, "visible", e.itemData.selected);
                    }, CLICK_TIMEOUT);
                }
            };

        return {
            selectNodesRecursive: false,
            showCheckBoxesMode: "normal",
            onItemSelectionChanged: selectionChangedHandler
        };
    },

    _columnOptionChanged: function(e) {
        var changeTypes = e.changeTypes,
            optionNames = e.optionNames,
            isSelectMode = this.option("columnChooser.mode") === "select";

        this.callBase(e);

        if(isSelectMode) {
            if(optionNames.visible && optionNames.length === 1 && e.columnIndex !== undefined) {
                this.render(null, {
                    changeType: "selection",
                    columnIndex: e.columnIndex
                });
            } else if(optionNames.showInColumnChooser || optionNames.visible || changeTypes.columns && optionNames.all) {
                this.render(null, "full");
            }
        }
    },

    optionChanged: function(args) {
        switch(args.name) {
            case "columnChooser":
                this._initializePopupContainer();
                this.render(null, "full");
                break;
            default:
                this.callBase(args);
        }
    },

    getColumnElements: function() {
        var result = [],
            $node,
            item,
            isSelectMode = this.option("columnChooser.mode") === "select",
            chooserColumns = this._columnsController.getChooserColumns(isSelectMode),
            $content = this._popupContainer && this._popupContainer.$content(),
            $nodes = $content && $content.find(".dx-treeview-node");

        if($nodes) {
            chooserColumns.forEach(function(column) {
                $node = $nodes.filter("[data-item-id = '" + column.index + "']");
                item = $node.length ? $node.children("." + COLUMN_CHOOSER_ITEM_CLASS).get(0) : null;
                result.push(item);
            });
        }

        return $(result);
    },

    getName: function() {
        return "columnChooser";
    },

    getColumns: function() {
        return this._columnsController.getChooserColumns();
    },

    allowDragging: function(column, sourceLocation) {
        var columnVisible = column && column.allowHiding && (sourceLocation !== "columnChooser" || !column.visible && this._columnsController.isParentColumnVisible(column.index));

        return this.isColumnChooserVisible() && columnVisible;
    },

    getBoundingRect: function() {
        var that = this,
            container = that._popupContainer && that._popupContainer._container(),
            offset;

        if(container && container.is(":visible")) {
            offset = container.offset();

            return {
                left: offset.left,
                top: offset.top,
                right: offset.left + container.outerWidth(),
                bottom: offset.top + container.outerHeight()
            };
        }

        return null;
    },

    /**
     * @name GridBaseMethods.showColumnChooser
     * @publicName showColumnChooser()
     */
    showColumnChooser: function() {
        ///#DEBUG
        this._isPopupContainerShown = true;
        ///#ENDDEBUG

        if(!this._popupContainer) {
            this._initializePopupContainer();
            this.render();
        }
        this._popupContainer.show();

        if(this._isWinDevice()) {
            $("body").addClass(this.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
        }
    },

    /**
     * @name GridBaseMethods.hideColumnChooser
     * @publicName hideColumnChooser()
     */
    hideColumnChooser: function() {
        if(this._popupContainer) {
            this._popupContainer.hide();

            ///#DEBUG
            this._isPopupContainerShown = false;
            ///#ENDDEBUG
        }
    },

    isColumnChooserVisible: function() {
        var popupContainer = this._popupContainer;

        return popupContainer && popupContainer.option("visible");
    },

    publicMethods: function() {
        return ["showColumnChooser", "hideColumnChooser"];
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.columnChooser
             * @type object
             */
            columnChooser: {
                /**
                 * @name GridBaseOptions.columnChooser.enabled
                 * @type boolean
                 * @default false
                 */
                enabled: false,
                /**
                 * @name GridBaseOptions.columnChooser.allowSearch
                 * @type boolean
                 * @default false
                 */
                allowSearch: false,
                /**
                 * @name GridBaseOptions.columnChooser.searchTimeout
                 * @type number
                 * @default 500
                 */
                searchTimeout: 500,
                /**
                 * @name GridBaseOptions.columnChooser.mode
                 * @type Enums.GridColumnChooserMode
                 * @default "dragAndDrop"
                 */
                mode: "dragAndDrop",
                /**
                 * @name GridBaseOptions.columnChooser.width
                 * @type number
                 * @default 250
                 */
                width: 250,
                /**
                 * @name GridBaseOptions.columnChooser.height
                 * @type number
                 * @default 260
                 */
                height: 260,
                /**
                 * @name GridBaseOptions.columnChooser.title
                 * @type string
                 * @default "Column Chooser"
                 */
                title: messageLocalization.format("dxDataGrid-columnChooserTitle"),
                /**
                 * @name GridBaseOptions.columnChooser.emptyPanelText
                 * @type string
                 * @default "Drag a column here to hide it"
                 */
                emptyPanelText: messageLocalization.format("dxDataGrid-columnChooserEmptyText"),
                // TODO private option
                container: undefined
            }
        };
    },
    controllers: {
        columnChooser: ColumnChooserController
    },
    views: {
        columnChooserView: ColumnChooserView
    },
    extenders: {
        views: {
            headerPanel: {
                _getToolbarItems: function() {
                    var items = this.callBase();

                    return this._appendColumnChooserItem(items);
                },

                _appendColumnChooserItem: function(items) {
                    var that = this,
                        columnChooserEnabled = that.option("columnChooser.enabled");

                    if(columnChooserEnabled) {
                        var onClickHandler = function() {
                                that.component.getView("columnChooserView").showColumnChooser();
                            },
                            onInitialized = function(e) {
                                $(e.element).addClass(that._getToolbarButtonClass(that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS)));
                            },
                            hintText = that.option("columnChooser.title"),
                            toolbarItem = {
                                widget: "dxButton",
                                options: {
                                    icon: COLUMN_CHOOSER_ICON_NAME,
                                    onClick: onClickHandler,
                                    hint: hintText,
                                    text: hintText,
                                    onInitialized: onInitialized
                                },
                                showText: "inMenu",
                                location: "after",
                                name: "columnChooserButton",
                                locateInMenu: "auto",
                                sortIndex: 40
                            };

                        items.push(toolbarItem);
                    }

                    return items;
                },

                optionChanged: function(args) {
                    switch(args.name) {
                        case "columnChooser":
                            this._invalidate();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                isVisible: function() {
                    var that = this,
                        columnChooserEnabled = that.option("columnChooser.enabled");

                    return that.callBase() || columnChooserEnabled;
                }
            }
        },
        controllers: {
            columns: {
                allowMoveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    var columnChooserMode = this.option("columnChooser.mode"),
                        isMoveColumnDisallowed = columnChooserMode === "select" && targetLocation === "columnChooser";

                    return isMoveColumnDisallowed ? false : this.callBase(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
                }
            }
        }
    }
};
