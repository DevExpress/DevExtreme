
import { getOuterWidth, getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { deferUpdate, noop } from '../../core/utils/common';
import modules from './ui.grid_core.modules';
import { ColumnsView } from './ui.grid_core.columns_view';
import messageLocalization from '../../localization/message';
// @ts-expect-error
import { isMaterial as isMaterialTheme, isGeneric, current } from '../themes';
import TreeView from '../tree_view';
import devices from '../../core/devices';
import Popup from '../popup/ui.popup';
import Button from '../button';

import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';

const COLUMN_CHOOSER_CLASS = 'column-chooser';
const COLUMN_CHOOSER_BUTTON_CLASS = 'column-chooser-button';
const NOTOUCH_ACTION_CLASS = 'notouch-action';
const COLUMN_CHOOSER_LIST_CLASS = 'column-chooser-list';
const COLUMN_CHOOSER_PLAIN_CLASS = 'column-chooser-plain';
const COLUMN_CHOOSER_DRAG_CLASS = 'column-chooser-mode-drag';
const COLUMN_CHOOSER_SELECT_CLASS = 'column-chooser-mode-select';
const COLUMN_CHOOSER_ICON_NAME = 'column-chooser';
const COLUMN_CHOOSER_ITEM_CLASS = 'dx-column-chooser-item';

const CLICK_TIMEOUT = 300;

const processItems = function(that, chooserColumns) {
    const items = [];
    const isSelectMode = that.isSelectMode();
    const isRecursive = that.option('columnChooser.selection.recursive');

    if(chooserColumns.length) {
        each(chooserColumns, function(index, column) {
            const item = {
                text: column.caption,
                cssClass: column.cssClass,
                allowHiding: column.allowHiding,
                expanded: true,
                id: column.index,
                disabled: column.allowHiding === false,
                parentId: isDefined(column.ownerBand) ? column.ownerBand : null
            };

            const isRecursiveWithColumns = isRecursive && column.hasColumns;

            if(isSelectMode && !isRecursiveWithColumns) {
                item.selected = column.visible;
            }

            items.push(item);
        });
    }

    return items;
};

/**
 * @type {Partial<import('./ui.grid_core.column_chooser').ColumnChooserController>}
 */
const columnChooserControllerMembers = {
    renderShowColumnChooserButton: function($element) {
        const that = this;
        const columnChooserButtonClass = that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS);
        const columnChooserEnabled = that.option('columnChooser.enabled');
        const $showColumnChooserButton = $element.find('.' + columnChooserButtonClass);
        let $columnChooserButton;

        if(columnChooserEnabled) {
            if(!$showColumnChooserButton.length) {
                $columnChooserButton = $('<div>')
                    .addClass(columnChooserButtonClass)
                    .appendTo($element);

                that._createComponent($columnChooserButton, Button, {
                    icon: COLUMN_CHOOSER_ICON_NAME,
                    onClick: function() {
                        that.getView('columnChooserView').showColumnChooser();
                    },
                    hint: that.option('columnChooser.title'),
                    // @ts-expect-error
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
        const rowsView = this.getView('rowsView');
        const position = this.option('columnChooser.position');

        return isDefined(position) ? position : {
            my: 'right bottom',
            at: 'right bottom',
            of: rowsView && rowsView.element(),
            collision: 'fit',
            offset: '-2 -2',
            boundaryOffset: '2 2'
        };
    },
};
const ColumnChooserController = modules.ViewController.inherit(columnChooserControllerMembers);

/**
 * @type {Partial<import('./ui.grid_core.column_chooser').ColumnChooserView>}
 */
const columnChooserMembers = {
    _resizeCore: noop,

    _isWinDevice: function() {
        // @ts-expect-error
        return !!devices.real().win;
    },

    _initializePopupContainer: function() {
        const that = this;
        const columnChooserClass = that.addWidgetPrefix(COLUMN_CHOOSER_CLASS);
        const $element = that.element().addClass(columnChooserClass);
        const columnChooserOptions = that.option('columnChooser');

        const themeName = current();
        const isGenericTheme = isGeneric(themeName);
        const isMaterial = isMaterialTheme(themeName);

        const dxPopupOptions = {
            visible: false,
            shading: false,
            showCloseButton: false,
            dragEnabled: true,
            resizeEnabled: true,
            wrapperAttr: { class: columnChooserClass },
            toolbarItems: [
                { text: columnChooserOptions.title, toolbar: 'top', location: isGenericTheme || isMaterial ? 'before' : 'center' }
            ],
            position: that.getController('columnChooser').getPosition(),
            width: columnChooserOptions.width,
            height: columnChooserOptions.height,
            rtlEnabled: that.option('rtlEnabled'),
            onHidden: function() {
                if(that._isWinDevice()) {
                    $('body').removeClass(that.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
                }
            },
            // @ts-expect-error
            container: columnChooserOptions.container
        };

        if(isGenericTheme || isMaterial) {
            extend(dxPopupOptions, { showCloseButton: true });
        } else {
            // @ts-expect-error
            dxPopupOptions.toolbarItems[dxPopupOptions.toolbarItems.length] = { shortcut: 'cancel' };
        }

        if(!isDefined(this._popupContainer)) {
            that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);

            that._popupContainer.on('optionChanged', function(args) {
                if(args.name === 'visible') {
                    // @ts-expect-error
                    that.renderCompleted.fire();
                }
            });
        } else {
            this._popupContainer.option(dxPopupOptions);
        }

        this.setPopupAttributes();
    },

    setPopupAttributes: function() {
        const isSelectMode = this.isSelectMode();

        this._popupContainer.setAria({
            role: 'dialog',
            label: messageLocalization.format('dxDataGrid-columnChooserTitle')
        });

        this._popupContainer.$wrapper()
            .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode)
            .toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);

        this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));

        if(isSelectMode && !this._columnsController.isBandColumnsUsed()) {
            this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
        }
    },

    _renderCore: function(change) {
        if(this._popupContainer) {
            const isDragMode = !this.isSelectMode();

            if(!this._columnChooserList || change === 'full') {
                this._renderTreeView();
            } else if(isDragMode) {
                this._updateItems();
            }
        }
    },

    _renderTreeView: function() {
        const that = this;
        const $container = this._popupContainer.$content();

        const columnChooser = this.option('columnChooser');
        const isSelectMode = this.isSelectMode();

        const searchEnabled = isDefined(columnChooser.allowSearch) ? columnChooser.allowSearch : columnChooser.search?.enabled;
        const searchTimeout = isDefined(columnChooser.searchTimeout) ? columnChooser.searchTimeout : columnChooser.search?.timeout;

        /**
         * @type {import('../tree_view').Options}
         */
        const treeViewConfig = {
            dataStructure: 'plain',
            activeStateEnabled: true,
            focusStateEnabled: true,
            hoverStateEnabled: true,
            itemTemplate: 'item',
            showCheckBoxesMode: 'none',
            rootValue: null,
            searchEnabled: searchEnabled,
            searchTimeout: searchTimeout,
            searchEditorOptions: columnChooser.search?.editorOptions,
        };

        if(this._isWinDevice()) {
            treeViewConfig.useNativeScrolling = false;
        }

        extend(treeViewConfig, isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig());

        if(this._columnChooserList) {
            if(!treeViewConfig.searchEnabled) {
                treeViewConfig.searchValue = '';
            }

            this._columnChooserList.option(treeViewConfig);
        } else {
            this._columnChooserList = this._createComponent($container, TreeView, treeViewConfig);

            let scrollTop;

            this._columnChooserList.on('optionChanged', e => {
                scrollTop = e.component.getScrollable().scrollTop();
            });

            this._columnChooserList.on('contentReady', e => {
                deferUpdate(function() {
                    e.component.getScrollable().scrollTo({ y: scrollTop });

                    // @ts-expect-error
                    that.renderCompleted.fire();
                });
            });
        }

        // we need to set items after setting selectNodesRecursive, so they will be processed correctly inside TreeView
        this._updateItems();
    },

    _prepareDragModeConfig: function() {
        const columnChooserOptions = this.option('columnChooser');

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
        const that = this;
        const selectionOptions = this.option('columnChooser.selection') || {};

        const getFlatNodes = (nodes) => {
            const addNodesToArray = (nodes, flatNodesArray) => {
                return nodes.reduce((result, node) => {
                    result.push(node);

                    if(node.children.length) {
                        addNodesToArray(node.children, result);
                    }

                    return result;
                }, flatNodesArray);
            };

            return addNodesToArray(nodes, []);
        };

        const updateSelection = (e, nodes) => {
            nodes
                .filter(node => node.itemData.allowHiding === false)
                .forEach(node => e.component.selectItem(node.key));
        };

        const updateColumnVisibility = (nodes) => {
            nodes.forEach(node => {
                const columnIndex = node.itemData.id;
                const isVisible = node.selected !== false;
                that._columnsController.columnOption(columnIndex, 'visible', isVisible);
            });
        };

        let updateColumnVisibilityTimeout;
        let isUpdatingSelection = false;

        const selectionChangedHandler = e => {
            if(isUpdatingSelection) {
                return;
            }

            const nodes = getFlatNodes(e.component.getNodes());

            e.component.beginUpdate();
            isUpdatingSelection = true;

            updateSelection(e, nodes);

            e.component.endUpdate();
            isUpdatingSelection = false;

            clearTimeout(updateColumnVisibilityTimeout);
            updateColumnVisibilityTimeout = setTimeout(() => {
                that.component.beginUpdate();
                this._isUpdatingColumnVisibility = true;

                updateColumnVisibility(nodes);

                that.component.endUpdate();
                this._isUpdatingColumnVisibility = false;
            }, CLICK_TIMEOUT);
        };

        return {
            selectByClick: selectionOptions.selectByClick,
            selectNodesRecursive: selectionOptions.recursive,
            showCheckBoxesMode: selectionOptions.allowSelectAll ? 'selectAll' : 'normal',
            onSelectionChanged: selectionChangedHandler
        };
    },

    _updateItems: function() {
        const isSelectMode = this.isSelectMode();
        const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
        const items = processItems(this, chooserColumns);

        this._columnChooserList.option('items', items);
    },

    _updateItemSelection: function(columnIndex) {
        const isRecursive = this.option('columnChooser.selection.recursive');
        const column = this._columnsController.columnOption(columnIndex);

        const isRecursiveWithColumns = isRecursive && column.hasColumns;

        if(!isRecursiveWithColumns) {
            column.visible ?
                this._columnChooserList.selectItem(columnIndex) :
                this._columnChooserList.unselectItem(columnIndex);
        }
    },

    _columnOptionChanged: function(e) {
        this.callBase(e);

        const changeTypes = e.changeTypes;
        const optionNames = e.optionNames;
        const isSelectMode = this.isSelectMode();

        if(isSelectMode && this._columnChooserList && this._isUpdatingColumnVisibility !== true) {
            const isColumnVisibleChanged = optionNames.visible && e.columnIndex !== undefined;

            const optionsUsedInItems = ['showInColumnChooser', 'caption', 'allowHiding', 'visible', 'cssClass', 'ownerBand'];
            const needFullRender = optionsUsedInItems.some(optionName => optionNames[optionName]) || (changeTypes.columns && optionNames.all);

            if(isColumnVisibleChanged) {
                this._updateItemSelection(e.columnIndex);
            } else if(needFullRender) {
                this._updateItems();
            }
        }
    },

    optionChanged: function(args) {
        switch(args.name) {
            case 'columnChooser':
                this._initializePopupContainer();

                this.render(null, 'full');
                break;
            default:
                this.callBase(args);
        }
    },

    getColumnElements: function() {
        const result = [];

        const isSelectMode = this.isSelectMode();
        const chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
        const $content = this._popupContainer && this._popupContainer.$content();
        const $nodes = $content && $content.find('.dx-treeview-node');

        if($nodes) {
            chooserColumns.forEach(function(column) {
                const $node = $nodes.filter('[data-item-id = \'' + column.index + '\']');
                const item = $node.length ? $node.children('.' + COLUMN_CHOOSER_ITEM_CLASS).get(0) : null;
                result.push(item);
            });
        }

        // @ts-expect-error
        return $(result);
    },

    getName: function() {
        return 'columnChooser';
    },

    getColumns: function() {
        return this._columnsController.getChooserColumns();
    },

    allowDragging: function(column) {
        const isParentColumnVisible = this._columnsController.isParentColumnVisible(column.index);
        const isColumnHidden = !column.visible && column.allowHiding;

        return this.isColumnChooserVisible() && isParentColumnVisible && isColumnHidden;
    },

    allowColumnHeaderDragging: function(column) {
        const isDragMode = !this.isSelectMode();

        return isDragMode && this.isColumnChooserVisible() && column.allowHiding;
    },

    getBoundingRect: function() {
        const that = this;
        const container = that._popupContainer && that._popupContainer.$overlayContent();

        if(container && container.is(':visible')) {
            const offset = container.offset();

            return {
                left: offset.left,
                top: offset.top,
                right: offset.left + getOuterWidth(container),
                bottom: offset.top + getOuterHeight(container)
            };
        }

        return null;
    },

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
            $('body').addClass(this.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
        }
    },

    hideColumnChooser: function() {
        if(this._popupContainer) {
            this._popupContainer.hide();

            ///#DEBUG
            this._isPopupContainerShown = false;
            ///#ENDDEBUG
        }
    },

    isColumnChooserVisible: function() {
        const popupContainer = this._popupContainer;

        return popupContainer && popupContainer.option('visible');
    },

    isSelectMode: function() {
        return this.option('columnChooser.mode') === 'select';
    },

    hasHiddenColumns: function() {
        const isEnabled = this.option('columnChooser.enabled');
        const hiddenColumns = this.getColumns().filter(column => !column.visible);

        return isEnabled && hiddenColumns.length;
    },

    publicMethods: function() {
        return ['showColumnChooser', 'hideColumnChooser'];
    }
};
const ColumnChooserView = ColumnsView.inherit(columnChooserMembers);

/**
 * @type {import('./ui.grid_core.modules').Module}
 */
export const columnChooserModule = {
    defaultOptions: function() {
        return {
            columnChooser: {
                enabled: false,
                search: {
                    enabled: false,
                    timeout: 500,
                    editorOptions: {},
                },
                selection: {
                    allowSelectAll: false,
                    selectByClick: false,
                    recursive: false,
                },
                position: undefined,
                mode: 'dragAndDrop',
                width: 250,
                height: 260,
                title: messageLocalization.format('dxDataGrid-columnChooserTitle'),
                emptyPanelText: messageLocalization.format('dxDataGrid-columnChooserEmptyText'),
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
                    const items = this.callBase();

                    return this._appendColumnChooserItem(items);
                },

                _appendColumnChooserItem: function(items) {
                    const that = this;
                    const columnChooserEnabled = that.option('columnChooser.enabled');

                    if(columnChooserEnabled) {
                        const onClickHandler = function() {
                            that.component.getView('columnChooserView').showColumnChooser();
                        };
                        const onInitialized = function(e) {
                            $(e.element).addClass(that._getToolbarButtonClass(that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS)));
                        };
                        const hintText = that.option('columnChooser.title');
                        /**
                         * @type {any}
                         */
                        const toolbarItem = {
                            widget: 'dxButton',
                            options: {
                                icon: COLUMN_CHOOSER_ICON_NAME,
                                onClick: onClickHandler,
                                hint: hintText,
                                text: hintText,
                                onInitialized: onInitialized,
                                elementAttr: { 'aria-haspopup': 'dialog' }
                            },
                            showText: 'inMenu',
                            location: 'after',
                            name: 'columnChooserButton',
                            locateInMenu: 'auto',
                            sortIndex: 40
                        };

                        items.push(toolbarItem);
                    }

                    return items;
                },

                optionChanged: function(args) {
                    switch(args.name) {
                        case 'columnChooser':
                            this._invalidate();
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                isVisible: function() {
                    const that = this;
                    const columnChooserEnabled = that.option('columnChooser.enabled');

                    return that.callBase() || columnChooserEnabled;
                }
            },

            columnHeadersView: {
                allowDragging: function(column) {
                    const columnChooserView = this.component.getView('columnChooserView');

                    const isDragMode = !columnChooserView.isSelectMode();
                    const isColumnChooserVisible = columnChooserView.isColumnChooserVisible();

                    return (isDragMode && isColumnChooserVisible && column.allowHiding) || this.callBase(column);
                },
            }
        },
        controllers: {
            columns: {
                allowMoveColumn: function(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
                    const isSelectMode = this.option('columnChooser.mode') === 'select';
                    const isMoveColumnDisallowed = isSelectMode && targetLocation === 'columnChooser';

                    return isMoveColumnDisallowed ? false : this.callBase(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
                }
            }
        }
    }
};
