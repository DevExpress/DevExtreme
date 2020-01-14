import $ from '../../core/renderer';
import gridCore from './ui.data_grid.core';
import { GroupingHelper as ExpandedGroupingHelper } from './ui.data_grid.grouping.expanded';
import { GroupingHelper as CollapsedGroupingHelper } from './ui.data_grid.grouping.collapsed';
import messageLocalization from '../../localization/message';
import dataSourceAdapter from './ui.data_grid.data_source_adapter';
import { isDefined, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import devices from '../../core/devices';
import { when, Deferred } from '../../core/utils/deferred';
import { registerKeyboardAction } from '../grid_core/ui.grid_core.accessibility';
import { setTabIndex, restoreFocus } from '../shared/accessibility';

const DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
const DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
const DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
const DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';

const GroupingDataSourceAdapterExtender = (function() {
    return {
        init: function() {
            this.callBase.apply(this, arguments);
            this._initGroupingHelper();
        },
        _initGroupingHelper: function(options) {
            const grouping = this._grouping;
            const isAutoExpandAll = this.option('grouping.autoExpandAll');
            const isFocusedRowEnabled = this.option('focusedRowEnabled');
            const remoteOperations = options ? options.remoteOperations : this.remoteOperations();
            const isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;

            if(isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
                if(!grouping || grouping instanceof CollapsedGroupingHelper) {
                    this._grouping = new ExpandedGroupingHelper(this);
                }
            } else {
                if(!grouping || grouping instanceof ExpandedGroupingHelper) {
                    this._grouping = new CollapsedGroupingHelper(this);
                }
            }
        },
        totalItemsCount: function() {
            const that = this;
            const totalCount = that.callBase();

            return (totalCount > 0 && that._dataSource.group() && that._dataSource.requireTotalCount()) ? totalCount + that._grouping.totalCountCorrection() : totalCount;
        },
        itemsCount: function() {
            return this._dataSource.group() ? (this._grouping.itemsCount() || 0) : this.callBase.apply(this, arguments);
        },
        allowCollapseAll: function() {
            return this._grouping.allowCollapseAll();
        },
        isGroupItemCountable: function(item) {
            return this._grouping.isGroupItemCountable(item);
        },
        isRowExpanded: function(key) {
            const groupInfo = this._grouping.findGroupInfo(key);
            return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
        },
        collapseAll: function(groupIndex) {
            return this._collapseExpandAll(groupIndex, false);
        },
        expandAll: function(groupIndex) {
            return this._collapseExpandAll(groupIndex, true);
        },
        _collapseExpandAll: function(groupIndex, isExpand) {
            const that = this;
            const dataSource = that._dataSource;
            const group = dataSource.group();
            const groups = gridCore.normalizeSortingInfo(group || []);
            let i;

            if(groups.length) {
                for(i = 0; i < groups.length; i++) {
                    if(groupIndex === undefined || groupIndex === i) {
                        groups[i].isExpanded = isExpand;
                    } else if(group && group[i]) {
                        groups[i].isExpanded = group[i].isExpanded;
                    }
                }
                dataSource.group(groups);
                that._grouping.foreachGroups(function(groupInfo, parents) {
                    if(groupIndex === undefined || groupIndex === parents.length - 1) {
                        groupInfo.isExpanded = isExpand;
                    }
                }, false, true);

                that.resetPagesCache();
            }
            return true;
        },
        refresh: function() {
            this.callBase.apply(this, arguments);

            return this._grouping.refresh.apply(this._grouping, arguments);
        },
        changeRowExpand: function(path) {
            const that = this;
            const dataSource = that._dataSource;

            if(dataSource.group()) {
                dataSource.beginLoading();
                if(that._lastLoadOptions) {
                    that._lastLoadOptions.groupExpand = true;
                }
                return that._changeRowExpandCore(path).always(function() {
                    dataSource.endLoading();
                });
            }
        },
        _changeRowExpandCore: function(path) {
            return this._grouping.changeRowExpand(path);
        },
        ///#DEBUG
        getGroupsInfo: function() {
            return this._grouping._groupsInfo;
        },
        ///#ENDDEBUG
        _hasGroupLevelsExpandState: function(group, isExpanded) {
            if(group && Array.isArray(group)) {
                for(let i = 0; i < group.length; i++) {
                    if(group[i].isExpanded === isExpanded) {
                        return true;
                    }
                }
            }
        },
        _customizeRemoteOperations: function(options, isReload, operationTypes) {
            const remoteOperations = options.remoteOperations;

            if(options.storeLoadOptions.group) {
                if(remoteOperations.grouping && !options.isCustomLoading) {
                    if(!remoteOperations.groupPaging || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)) {
                        remoteOperations.paging = false;
                    }
                }

                if(!remoteOperations.grouping && (!remoteOperations.sorting || !remoteOperations.filtering || options.isCustomLoading || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false))) {
                    remoteOperations.paging = false;
                }
            } else if(!options.isCustomLoading && remoteOperations.paging && operationTypes.grouping) {
                this.resetCache();
            }

            this.callBase.apply(this, arguments);
        },
        _handleDataLoading: function(options) {
            this.callBase(options);
            this._initGroupingHelper(options);
            return this._grouping.handleDataLoading(options);
        },
        _handleDataLoaded: function(options) {
            return this._grouping.handleDataLoaded(options, this.callBase.bind(this));
        },
        _handleDataLoadedCore: function(options) {
            return this._grouping.handleDataLoadedCore(options, this.callBase.bind(this));
        }
    };
})();


dataSourceAdapter.extend(GroupingDataSourceAdapterExtender);

const GroupingDataControllerExtender = (function() {
    return {
        init: function() {
            const that = this;
            that.callBase();

            that.createAction('onRowExpanding');
            that.createAction('onRowExpanded');
            that.createAction('onRowCollapsing');
            that.createAction('onRowCollapsed');
        },
        _beforeProcessItems: function(items) {
            const groupColumns = this._columnsController.getGroupColumns();

            items = this.callBase(items);
            if(items.length && groupColumns.length) {
                items = this._processGroupItems(items, groupColumns.length);
            }
            return items;
        },
        _processItem: function(item, options) {
            if(isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0) {
                item = this._processGroupItem(item, options);
                options.dataIndex = 0;
            } else {
                item = this.callBase.apply(this, arguments);
            }
            return item;
        },
        _processGroupItem: function(item) {
            return item;
        },
        _processGroupItems: function(items, groupsCount, options) {
            const that = this;
            const groupedColumns = that._columnsController.getGroupColumns();
            const column = groupedColumns[groupedColumns.length - groupsCount];
            let scrollingMode;
            let i;
            let item;
            let resultItems;

            if(!options) {
                scrollingMode = that.option('scrolling.mode');
                options = {
                    collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
                    resultItems: [],
                    path: [],
                    values: []
                };
            }

            resultItems = options.resultItems;

            if(options.data) {
                if(options.collectContinuationItems || !options.data.isContinuation) {
                    resultItems.push({
                        rowType: 'group',
                        data: options.data,
                        groupIndex: options.path.length - 1,
                        isExpanded: !!options.data.items,
                        key: options.path.slice(0),
                        values: options.values.slice(0)
                    });
                }
            }
            if(items) {
                if(groupsCount === 0) {
                    resultItems.push.apply(resultItems, items);
                } else {
                    for(i = 0; i < items.length; i++) {
                        item = items[i];
                        if(item && 'items' in item) {
                            options.data = item;
                            options.path.push(item.key);
                            options.values.push(column && column.deserializeValue && !column.calculateDisplayValue ? column.deserializeValue(item.key) : item.key);
                            that._processGroupItems(item.items, groupsCount - 1, options);
                            options.data = undefined;
                            options.path.pop();
                            options.values.pop();
                        } else {
                            resultItems.push(item);
                        }
                    }
                }
            }

            return resultItems;
        },
        publicMethods: function() {
            return this.callBase().concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
        },
        /**
         * @name dxDataGridMethods.collapseAll
         * @publicName collapseAll(groupIndex)
         * @param1 groupIndex:number | undefined
         */
        collapseAll: function(groupIndex) {
            const dataSource = this._dataSource;
            if(dataSource && dataSource.collapseAll(groupIndex)) {
                dataSource.pageIndex(0);
                dataSource.reload();
            }
        },
        /**
         * @name dxDataGridMethods.expandAll
         * @publicName expandAll(groupIndex)
         * @param1 groupIndex:number | undefined
         */
        expandAll: function(groupIndex) {
            const dataSource = this._dataSource;
            if(dataSource && dataSource.expandAll(groupIndex)) {
                dataSource.pageIndex(0);
                dataSource.reload();
            }
        },
        changeRowExpand: function(key) {
            const that = this;
            const expanded = that.isRowExpanded(key);
            const args = {
                key: key,
                expanded: expanded
            };

            that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);

            if(!args.cancel) {
                return when(that._changeRowExpandCore(key)).done(function() {
                    args.expanded = !expanded;
                    that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
                });
            }

            return new Deferred().resolve();
        },
        _changeRowExpandCore: function(key) {
            const that = this;
            const dataSource = this._dataSource;
            let d;

            if(!dataSource) return;

            d = new Deferred();
            when(dataSource.changeRowExpand(key)).done(function() {
                that.load().done(d.resolve).fail(d.reject);
            }).fail(d.reject);

            return d;
        },
        /**
         * @name dxDataGridMethods.isRowExpanded
         * @publicName isRowExpanded(key)
         * @param1 key:any
         * @return boolean
         */
        isRowExpanded: function(key) {
            const dataSource = this._dataSource;

            return dataSource && dataSource.isRowExpanded(key);
        },
        /**
         * @name dxDataGridMethods.expandRow
         * @publicName expandRow(key)
         * @param1 key:any
         * @return Promise<void>
         */
        expandRow: function(key) {
            if(!this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return new Deferred().resolve();
        },
        /**
         * @name dxDataGridMethods.collapseRow
         * @publicName collapseRow(key)
         * @param1 key:any
         * @return Promise<void>
         */
        collapseRow: function(key) {
            if(this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return new Deferred().resolve();
        },
        optionChanged: function(args) {
            if(args.name === 'grouping'/* autoExpandAll */) {
                args.name = 'dataSource';
            }
            this.callBase(args);
        }
    };
})();

const onGroupingMenuItemClick = function(column, params) {
    const columnsController = this._columnsController;

    switch(params.itemData.value) {
        case 'group':
            var groups = columnsController._dataSource.group() || [];

            columnsController.columnOption(column.dataField, 'groupIndex', groups.length);
            break;
        case 'ungroup':
            columnsController.columnOption(column.dataField, 'groupIndex', -1);
            break;
        case 'ungroupAll':
            this.component.clearGrouping();
            break;
    }
};

const GroupingHeaderPanelExtender = (function() {
    return {
        _getToolbarItems: function() {
            const items = this.callBase();

            return this._appendGroupingItem(items);
        },

        _appendGroupingItem: function(items) {
            const that = this;
            let isRendered = false;
            const groupPanelRenderedCallback = function(e) {
                const $groupPanel = $(e.itemElement).find('.' + DATAGRID_GROUP_PANEL_CLASS);
                that._updateGroupPanelContent($groupPanel);
                registerKeyboardAction('groupPanel', that, $groupPanel, undefined, that._handleActionKeyDown.bind(that));
                isRendered && that.renderCompleted.fire();
                isRendered = true;
            };

            if(that._isGroupPanelVisible()) {
                const toolbarItem = {
                    html: '<div class=\'' + DATAGRID_GROUP_PANEL_CLASS + '\'></div>',
                    name: 'groupPanel',
                    onItemRendered: groupPanelRenderedCallback,
                    location: 'before',
                    locateInMenu: 'never',
                    sortIndex: 1
                };

                items.push(toolbarItem);
            }

            return items;
        },

        _handleActionKeyDown: function(args) {
            const event = args.event;
            const $target = $(event.target);
            const groupColumnIndex = $target.closest(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`).index();
            const column = this._columnsController.getGroupColumns()[groupColumnIndex];
            const columnIndex = column && column.index;

            if($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
                this.getController('headerFilter').showHeaderFilterMenu(columnIndex, true);
            } else {
                this._processGroupItemAction(columnIndex);
            }

            event.preventDefault();
        },

        _isGroupPanelVisible: function() {
            const groupPanelOptions = this.option('groupPanel');
            let isVisible;

            if(groupPanelOptions) {
                isVisible = groupPanelOptions.visible;

                if(isVisible === 'auto') {
                    isVisible = devices.current().deviceType === 'desktop' ? true : false;
                }
            }

            return isVisible;
        },

        _renderGroupPanelItems: function($groupPanel, groupColumns) {
            const that = this;

            $groupPanel.empty();

            each(groupColumns, function(index, groupColumn) {
                that._createGroupPanelItem($groupPanel, groupColumn);
            });

            restoreFocus(this);
        },

        _createGroupPanelItem: function($rootElement, groupColumn) {
            const $groupPanelItem = $('<div>')
                .addClass(groupColumn.cssClass)
                .addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS)
                .data('columnData', groupColumn)
                .appendTo($rootElement)
                .text(groupColumn.caption);

            setTabIndex(this, $groupPanelItem);

            return $groupPanelItem;
        },

        _columnOptionChanged: function(e) {
            if(!this._requireReady && !gridCore.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
                const $toolbarElement = this.element();
                const $groupPanel = $toolbarElement && $toolbarElement.find('.' + DATAGRID_GROUP_PANEL_CLASS);

                if($groupPanel && $groupPanel.length) {
                    this._updateGroupPanelContent($groupPanel);
                    this.renderCompleted.fire();
                }
            }
            this.callBase();
        },

        _updateGroupPanelContent: function($groupPanel) {
            const that = this;
            const groupColumns = that.getController('columns').getGroupColumns();
            const groupPanelOptions = that.option('groupPanel');

            that._renderGroupPanelItems($groupPanel, groupColumns);

            if(groupPanelOptions.allowColumnDragging && !groupColumns.length) {
                $('<div>')
                    .addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS)
                    .text(groupPanelOptions.emptyPanelText)
                    .appendTo($groupPanel);

                $groupPanel.closest('.' + DATAGRID_GROUP_PANEL_LABEL_CLASS).css('maxWidth', 'none');
                that.updateToolbarDimensions();
            }
        },

        allowDragging: function(column) {
            const groupPanelOptions = this.option('groupPanel');

            return this._isGroupPanelVisible() && groupPanelOptions.allowColumnDragging && column && column.allowGrouping;
        },

        getColumnElements: function() {
            const $element = this.element();
            return $element && $element.find('.' + DATAGRID_GROUP_PANEL_ITEM_CLASS);
        },

        getColumns: function() {
            return this.getController('columns').getGroupColumns();
        },

        getBoundingRect: function() {
            const that = this;
            const $element = that.element();
            let offset;

            if($element && $element.find('.' + DATAGRID_GROUP_PANEL_CLASS).length) {
                offset = $element.offset();

                return {
                    top: offset.top,
                    bottom: offset.top + $element.height()
                };
            }
            return null;
        },

        getName: function() {
            return 'group';
        },

        getContextMenuItems: function(options) {
            const that = this;
            const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
            const $groupedColumnElement = $(options.targetElement).closest('.' + DATAGRID_GROUP_PANEL_ITEM_CLASS);
            let items;

            if($groupedColumnElement.length) {
                options.column = $groupedColumnElement.data('columnData');
            }

            if(contextMenuEnabled && options.column) {
                const column = options.column;
                const isGroupingAllowed = isDefined(column.allowGrouping) ? column.allowGrouping : true;

                if(isGroupingAllowed) {
                    const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
                    const groupingTexts = that.option('grouping.texts');
                    const onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = [
                        { text: groupingTexts.ungroup, value: 'ungroup', disabled: !isColumnGrouped, onItemClick: onItemClick },
                        { text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick: onItemClick }
                    ];
                }
            }
            return items;
        },

        isVisible: function() {
            return this.callBase() || this._isGroupPanelVisible();
        },

        optionChanged: function(args) {
            if(args.name === 'groupPanel') {
                this._invalidate();
                args.handled = true;
            } else {
                this.callBase(args);
            }
        }
    };
})();

exports.GroupingHeaderPanelExtender = GroupingHeaderPanelExtender;


const GroupingRowsViewExtender = (function() {
    return {
        getContextMenuItems: function(options) {
            const that = this;
            const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
            let items;

            if(contextMenuEnabled && options.row && options.row.rowType === 'group') {
                const columnsController = that._columnsController;
                const column = columnsController.columnOption('groupIndex:' + options.row.groupIndex);

                if(column && column.allowGrouping) {
                    const groupingTexts = that.option('grouping.texts');
                    const onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = [];

                    items.push(
                        { text: groupingTexts.ungroup, value: 'ungroup', onItemClick: onItemClick },
                        { text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick: onItemClick }
                    );
                }
            }
            return items;
        },

        _rowClick: function(e) {
            const that = this;
            const expandMode = that.option('grouping.expandMode');
            const scrollingMode = that.option('scrolling.mode');
            const isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && $(e.event.target).closest('.' + DATAGRID_GROUP_ROW_CLASS).length;
            const isExpandButtonClicked = $(e.event.target).closest('.' + DATAGRID_EXPAND_CLASS).length;

            if(isGroupRowStateChanged || isExpandButtonClicked) {
                that._changeGroupRowState(e);
            }

            that.callBase(e);
        },

        _changeGroupRowState: function(e) {
            const dataController = this.getController('data');
            const row = dataController.items()[e.rowIndex];
            const allowCollapsing = this._columnsController.columnOption('groupIndex:' + row.groupIndex, 'allowCollapsing');

            if(row.rowType === 'data' || row.rowType === 'group' && allowCollapsing !== false) {
                dataController.changeRowExpand(row.key);
                e.event.preventDefault();
                e.handled = true;
            }
        }
    };
})();

const columnHeadersViewExtender = (function() {
    return {
        getContextMenuItems: function(options) {
            const that = this;
            const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
            let items = that.callBase(options);

            if(contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
                const column = options.column;

                if(!column.command && (!isDefined(column.allowGrouping) || column.allowGrouping)) {
                    const groupingTexts = that.option('grouping.texts');
                    const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
                    const onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = items || [];
                    items.push({ text: groupingTexts.groupByThisColumn, value: 'group', beginGroup: true, disabled: isColumnGrouped, onItemClick: onItemClick });

                    if(column.showWhenGrouped) {
                        items.push({ text: groupingTexts.ungroup, value: 'ungroup', disabled: !isColumnGrouped, onItemClick: onItemClick });
                    }

                    items.push({ text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick: onItemClick });
                }
            }
            return items;
        }
    };
})();
gridCore.registerModule('grouping', {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions.grouping
             * @type object
             */
            grouping: {
                /**
                 * @name dxDataGridOptions.grouping.autoExpandAll
                 * @type boolean
                 * @default true
                 */
                autoExpandAll: true,
                /**
                 * @name dxDataGridOptions.grouping.allowCollapsing
                 * @type boolean
                 * @default true
                 */
                allowCollapsing: true,
                /**
                 * @name dxDataGridOptions.grouping.contextMenuEnabled
                 * @type boolean
                 * @default false
                 */
                contextMenuEnabled: false,
                /**
                 * @name dxDataGridOptions.grouping.expandMode
                 * @type Enums.GridGroupingExpandMode
                 * @default "buttonClick"
                 */
                expandMode: 'buttonClick',
                /**
                 * @name dxDataGridOptions.grouping.texts
                 * @type object
                 */
                texts: {
                    /**
                    * @name dxDataGridOptions.grouping.texts.groupContinuesMessage
                    * @type string
                    * @default "Continues on the next page"
                    */
                    groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
                    /**
                     * @name dxDataGridOptions.grouping.texts.groupContinuedMessage
                     * @type string
                     * @default "Continued from the previous page"
                     */
                    groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
                    /**
                    * @name dxDataGridOptions.grouping.texts.groupByThisColumn
                    * @type string
                    * @default "Group by This Column"
                    */
                    groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
                    /**
                    * @name dxDataGridOptions.grouping.texts.ungroup
                    * @type string
                    * @default "Ungroup"
                    */
                    ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
                    /**
                    * @name dxDataGridOptions.grouping.texts.ungroupAll
                    * @type string
                    * @default "Ungroup All"
                    */
                    ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText')
                }
            },
            /**
            * @name dxDataGridOptions.groupPanel
            * @type object
            */
            groupPanel: {
                /**
                 * @name dxDataGridOptions.groupPanel.visible
                 * @type boolean|Enums.Mode
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxDataGridOptions.groupPanel.emptyPanelText
                 * @type string
                 * @default "Drag a column header here to group by that column"
                 */
                emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
                /**
                 * @name dxDataGridOptions.groupPanel.allowColumnDragging
                 * @type boolean
                 * @default true
                 */
                allowColumnDragging: true
            }
        };
    },
    extenders: {
        controllers: {
            data: GroupingDataControllerExtender,
            columns: {
                _getExpandColumnOptions: function() {
                    const options = this.callBase.apply(this, arguments);

                    options.cellTemplate = gridCore.getExpandCellTemplate();

                    return options;
                },
            }
        },
        views: {
            headerPanel: GroupingHeaderPanelExtender,
            rowsView: GroupingRowsViewExtender,
            columnHeadersView: columnHeadersViewExtender
        }
    }
});
