"use strict";

var $ = require("../../core/renderer"),
    gridCore = require("./ui.data_grid.core"),
    ExpandedGroupingHelper = require("./ui.data_grid.grouping.expanded").GroupingHelper,
    CollapsedGroupingHelper = require("./ui.data_grid.grouping.collapsed").GroupingHelper,
    messageLocalization = require("../../localization/message"),
    dataSourceAdapter = require("./ui.data_grid.data_source_adapter"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    devices = require("../../core/devices"),
    when = require("../../integration/jquery/deferred").when;

var DATAGRID_GROUP_PANEL_CLASS = "dx-datagrid-group-panel",
    DATAGRID_GROUP_PANEL_MESSAGE_CLASS = "dx-group-panel-message",
    DATAGRID_GROUP_PANEL_ITEM_CLASS = "dx-group-panel-item",
    DATAGRID_GROUP_OPENED_CLASS = "dx-datagrid-group-opened",
    DATAGRID_GROUP_CLOSED_CLASS = "dx-datagrid-group-closed",
    DATAGRID_EXPAND_CLASS = "dx-datagrid-expand",
    DATAGRID_SELECTION_DISABLED_CLASS = "dx-selection-disabled",
    DATAGRID_GROUP_ROW_CLASS = "dx-group-row";

var GroupingDataSourceAdapterExtender = (function() {
    return {
        init: function() {
            this.callBase.apply(this, arguments);
            this._initGroupingHelper();
        },
        _initGroupingHelper: function(options) {
            var grouping = this._grouping,
                remoteOperations = options ? options.remoteOperations : this.remoteOperations();

            if(remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging && !remoteOperations.grouping) {
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
            var that = this,
                totalCount = that.callBase();

            return (totalCount > 0 && that._dataSource.group() && that._dataSource.requireTotalCount()) ? totalCount + that._grouping.totalCountCorrection() : totalCount;
        },
        itemsCount: function() {
            return this._dataSource.group() ? (this._grouping.itemsCount() || 0) : this.callBase();
        },
        allowCollapseAll: function() {
            return this._grouping.allowCollapseAll();
        },
        isRowExpanded: function(key) {
            var groupInfo = this._grouping.findGroupInfo(key);
            return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
        },
        collapseAll: function(groupIndex) {
            return this._collapseExpandAll(groupIndex, false);
        },
        expandAll: function(groupIndex) {
            return this._collapseExpandAll(groupIndex, true);
        },
        _collapseExpandAll: function(groupIndex, isExpand) {
            var that = this,
                dataSource = that._dataSource,
                group = dataSource.group(),
                groups = gridCore.normalizeSortingInfo(group || []),
                i;

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
            }
            return true;
        },
        refresh: function() {
            this.callBase.apply(this, arguments);

            return this._grouping.refresh.apply(this._grouping, arguments);
        },
        changeRowExpand: function(path) {
            var that = this,
                dataSource = that._dataSource;

            if(dataSource.group()) {
                //TODO remove access to _changeLoadingCount
                dataSource._changeLoadingCount(1);
                return that._changeRowExpandCore(path).always(function() {
                    dataSource._changeLoadingCount(-1);
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
                for(var i = 0; i < group.length; i++) {
                    if(group[i].isExpanded === isExpanded) {
                        return true;
                    }
                }
            }
        },
        _customizeRemoteOperations: function(options) {
            var remoteOperations = options.remoteOperations;

            if(options.storeLoadOptions.group) {
                if(remoteOperations.grouping && !options.isCustomLoading) {
                    if(!remoteOperations.groupPaging || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)) {
                        remoteOperations.paging = false;
                    }
                }

                if(!remoteOperations.grouping && (!remoteOperations.sorting || !remoteOperations.filtering || options.isCustomLoading || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false))) {
                    remoteOperations.paging = false;
                }
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

var GroupingDataControllerExtender = (function() {
    return {
        init: function() {
            var that = this;
            that.callBase();

            that.createAction("onRowExpanding");
            that.createAction("onRowExpanded");
            that.createAction("onRowCollapsing");
            that.createAction("onRowCollapsed");
        },
        _processItems: function(items, changeType) {
            var groupColumns = this._columnsController.getGroupColumns();
            if(items.length && groupColumns.length) {
                items = this._processGroupItems(items, groupColumns.length);
            }
            return this.callBase(items, changeType);
        },
        _processItem: function(item, options) {
            if(typeUtils.isDefined(item.groupIndex) && typeUtils.isString(item.rowType) && item.rowType.indexOf("group") === 0) {
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
            var that = this,
                groupedColumns = that._columnsController.getGroupColumns(),
                column = groupedColumns[groupedColumns.length - groupsCount],
                scrollingMode,
                i,
                item,
                resultItems;

            if(!options) {
                scrollingMode = that.option("scrolling.mode");
                options = {
                    collectContinuationItems: scrollingMode !== "virtual" && scrollingMode !== "infinite",
                    resultItems: [],
                    path: [],
                    values: []
                };
            }

            resultItems = options.resultItems;

            if(options.data) {
                if(options.collectContinuationItems || !options.data.isContinuation) {
                    resultItems.push({
                        rowType: "group",
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
                        if(item && "items" in item) {
                            options.data = item;
                            options.path.push(item.key);
                            options.values.push(column && column.deserializeValue ? column.deserializeValue(item.key) : item.key);
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
            return this.callBase().concat(["collapseAll", "expandAll", "isRowExpanded", "expandRow", "collapseRow"]);
        },
        /**
         * @name dxDataGridMethods_collapseAll
         * @publicName collapseAll(groupIndex)
         * @param1 groupIndex:number | undefined
         */
        collapseAll: function(groupIndex) {
            var dataSource = this._dataSource;
            if(dataSource && dataSource.collapseAll(groupIndex)) {
                dataSource.pageIndex(0);
                dataSource.reload();
            }
        },
        /**
         * @name dxDataGridMethods_expandAll
         * @publicName expandAll(groupIndex)
         * @param1 groupIndex:number | undefined
         */
        expandAll: function(groupIndex) {
            var dataSource = this._dataSource;
            if(dataSource && dataSource.expandAll(groupIndex)) {
                dataSource.pageIndex(0);
                dataSource.reload();
            }
        },
        changeRowExpand: function(key) {
            var that = this,
                expanded = that.isRowExpanded(key),
                args = {
                    key: key,
                    expanded: expanded
                };

            that.executeAction(expanded ? "onRowCollapsing" : "onRowExpanding", args);

            if(!args.cancel) {
                return when(that._changeRowExpandCore(key)).done(function() {
                    args.expanded = !expanded;
                    that.executeAction(expanded ? "onRowCollapsed" : "onRowExpanded", args);
                });
            }
        },
        _changeRowExpandCore: function(key) {
            var that = this,
                dataSource = this._dataSource,
                d;

            if(!dataSource) return;

            d = $.Deferred();
            when(dataSource.changeRowExpand(key)).done(function() {
                that.load().done(d.resolve).fail(d.reject);
            }).fail(d.reject);

            return d;
        },
        /**
         * @name dxDataGridMethods_isRowExpanded
         * @publicName isRowExpanded(key)
         * @param1 key:any
         * @return boolean
         */
        isRowExpanded: function(key) {
            var dataSource = this._dataSource;

            return dataSource && dataSource.isRowExpanded(key);
        },
        /**
         * @name dxDataGridMethods_expandRow
         * @publicName expandRow(key)
         * @param1 key:any
         */
        expandRow: function(key) {
            if(!this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return $.Deferred().resolve();
        },
        /**
         * @name dxDataGridMethods_collapseRow
         * @publicName collapseRow(key)
         * @param1 key:any
         */
        collapseRow: function(key) {
            if(this.isRowExpanded(key)) {
                return this.changeRowExpand(key);
            }
            return $.Deferred().resolve();
        },
        optionChanged: function(args) {
            if(args.name === "grouping"/* autoExpandAll */) {
                args.name = "dataSource";
            }
            this.callBase(args);
        }
    };
})();

var onGroupingMenuItemClick = function(column, params) {
    var columnsController = this._columnsController;

    switch(params.itemData.value) {
        case "group":
            var groups = columnsController._dataSource.group() || [];

            columnsController.columnOption(column.dataField, "groupIndex", groups.length);
            break;
        case "ungroup":
            columnsController.columnOption(column.dataField, "groupIndex", -1);
            break;
        case "ungroupAll":
            this.component.clearGrouping();
            break;
    }
};

var GroupingHeaderPanelExtender = (function() {
    return {
        _getToolbarItems: function() {
            var items = this.callBase();

            return this._appendGroupingItem(items);
        },

        _appendGroupingItem: function(items) {
            var that = this,
                groupPanelRenderedCallback = function(e) {
                    that._updateGroupPanelContent(e.itemElement.find("." + DATAGRID_GROUP_PANEL_CLASS));
                };

            if(that._isGroupPanelVisible()) {
                var toolbarItem = {
                    html: "<div class='" + DATAGRID_GROUP_PANEL_CLASS + "'></div>",
                    name: "groupPanel",
                    onItemRendered: groupPanelRenderedCallback,
                    location: "before",
                    locateInMenu: "never",
                    sortIndex: 1
                };

                items.push(toolbarItem);
            }

            return items;
        },

        _isGroupPanelVisible: function() {
            var groupPanelOptions = this.option("groupPanel"),
                isVisible;

            if(groupPanelOptions) {
                isVisible = groupPanelOptions.visible;

                if(isVisible === "auto") {
                    isVisible = devices.current().deviceType === "desktop" ? true : false;
                }
            }

            return isVisible;
        },

        _renderGroupPanelItems: function($groupPanel, groupColumns) {
            var that = this;

            $groupPanel.empty();

            each(groupColumns, function(index, groupColumn) {
                that._createGroupPanelItem($groupPanel, groupColumn);
            });
        },

        _createGroupPanelItem: function($rootElement, groupColumn) {
            return $("<div />")
                .addClass(groupColumn.cssClass)
                .addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS)
                .data("columnData", groupColumn)
                .appendTo($rootElement)
                .text(groupColumn.caption);
        },

        _columnOptionChanged: function(e) {
            if(!this._requireReady && !gridCore.checkChanges(e.optionNames, ["width", "visibleWidth"])) {
                var $toolbarElement = this.element(),
                    $groupPanel = $toolbarElement && $toolbarElement.find("." + DATAGRID_GROUP_PANEL_CLASS);

                if($groupPanel && $groupPanel.length) {
                    this._updateGroupPanelContent($groupPanel);
                    this.renderCompleted.fire();
                }
            }
            this.callBase();
        },

        _updateGroupPanelContent: function($groupPanel) {
            var that = this,
                groupColumns = that.getController("columns").getGroupColumns(),
                groupPanelOptions = that.option("groupPanel");

            that._renderGroupPanelItems($groupPanel, groupColumns);

            if(groupPanelOptions.allowColumnDragging && !groupColumns.length) {
                $("<div />")
                    .addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS)
                    .text(groupPanelOptions.emptyPanelText)
                    .appendTo($groupPanel);
            }
        },

        allowDragging: function(column) {
            var groupPanelOptions = this.option("groupPanel");

            return this._isGroupPanelVisible() && groupPanelOptions.allowColumnDragging && column && column.allowGrouping;
        },

        getColumnElements: function() {
            var $element = this.element();
            return $element && $element.find("." + DATAGRID_GROUP_PANEL_ITEM_CLASS);
        },

        getColumns: function() {
            return this.getController("columns").getGroupColumns();
        },

        getBoundingRect: function() {
            var that = this,
                $element = that.element(),
                offset;

            if($element && $element.find("." + DATAGRID_GROUP_PANEL_CLASS).length) {
                offset = $element.offset();

                return {
                    top: offset.top,
                    bottom: offset.top + $element.height()
                };
            }
            return null;
        },

        getName: function() {
            return "group";
        },

        getContextMenuItems: function(options) {
            var that = this,
                contextMenuEnabled = that.option("grouping.contextMenuEnabled"),
                $groupedColumnElement = options.targetElement.closest("." + DATAGRID_GROUP_PANEL_ITEM_CLASS),
                items;

            if($groupedColumnElement.length) {
                options.column = $groupedColumnElement.data("columnData");
            }

            if(contextMenuEnabled && options.column) {
                var column = options.column,
                    isGroupingAllowed = typeUtils.isDefined(column.allowGrouping) ? column.allowGrouping : true;

                if(isGroupingAllowed) {
                    var isColumnGrouped = typeUtils.isDefined(column.groupIndex) && column.groupIndex > -1,
                        groupingTexts = that.option("grouping.texts"),
                        onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = [
                        { text: groupingTexts.ungroup, value: "ungroup", disabled: !isColumnGrouped, onItemClick: onItemClick },
                        { text: groupingTexts.ungroupAll, value: "ungroupAll", onItemClick: onItemClick }
                    ];
                }
            }
            return items;
        },

        isVisible: function() {
            return this.callBase() || this._isGroupPanelVisible();
        },

        optionChanged: function(args) {
            if(args.name === "groupPanel") {
                this._invalidate();
                args.handled = true;
            } else {
                this.callBase(args);
            }
        }
    };
})();

exports.GroupingHeaderPanelExtender = GroupingHeaderPanelExtender;


var GroupingRowsViewExtender = (function() {
    return {
        getContextMenuItems: function(options) {
            var that = this,
                contextMenuEnabled = that.option("grouping.contextMenuEnabled"),
                items;

            if(contextMenuEnabled && options.row && options.row.rowType === "group") {
                var columnsController = that._columnsController,
                    column = columnsController.columnOption("groupIndex:" + options.row.groupIndex);

                if(column && column.allowGrouping) {
                    var groupingTexts = that.option("grouping.texts"),
                        onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = [];

                    items.push(
                        { text: groupingTexts.ungroup, value: "ungroup", onItemClick: onItemClick },
                        { text: groupingTexts.ungroupAll, value: "ungroupAll", onItemClick: onItemClick }
                    );
                }
            }
            return items;
        },

        _rowClick: function(e) {
            var that = this,
                expandMode = that.option("grouping.expandMode"),
                isGroupRowStateChanged = expandMode === "rowClick" && $(e.jQueryEvent.target).closest("." + DATAGRID_GROUP_ROW_CLASS).length,
                isExpandButtonClicked = $(e.jQueryEvent.target).closest("." + DATAGRID_EXPAND_CLASS).length;

            if(isGroupRowStateChanged || isExpandButtonClicked) {
                that._changeGroupRowState(e);
            }

            that.callBase(e);
        },

        _changeGroupRowState: function(e) {
            var dataController = this.getController("data"),
                row = dataController.items()[e.rowIndex];

            if(row.rowType !== "detail") {
                dataController.changeRowExpand(row.key);
                e.jQueryEvent.preventDefault();
                e.handled = true;
            }
        },

        _getCellTemplate: function(options) {
            var that = this;

            if(options.column.command === "expand") {
                return {
                    allowRenderToDetachedContainer: true,
                    render: function(container, options) {
                        if(typeUtils.isDefined(options.value) && !(options.data && options.data.isContinuation) && !options.row.inserted) {
                            container
                                .addClass(DATAGRID_EXPAND_CLASS)
                                .addClass(DATAGRID_SELECTION_DISABLED_CLASS);

                            $("<div>")
                                .addClass(options.value ? DATAGRID_GROUP_OPENED_CLASS : DATAGRID_GROUP_CLOSED_CLASS)
                                .appendTo(container);

                            that.setAria("label",
                                options.value ? that.localize("dxDataGrid-ariaCollapse") : that.localize("dxDataGrid-ariaExpand"),
                                container);
                        }
                    }
                };
            }
            return that.callBase(options);
        }
    };
})();

var columnHeadersViewExtender = (function() {
    return {
        getContextMenuItems: function(options) {
            var that = this,
                contextMenuEnabled = that.option("grouping.contextMenuEnabled"),
                items = that.callBase(options);

            if(contextMenuEnabled && options.row && options.row.rowType === "header") {
                var column = options.column;

                if(!column.command && (!typeUtils.isDefined(column.allowGrouping) || column.allowGrouping)) {
                    var groupingTexts = that.option("grouping.texts"),
                        isColumnGrouped = typeUtils.isDefined(column.groupIndex) && column.groupIndex > -1,
                        onItemClick = onGroupingMenuItemClick.bind(that, column);

                    items = items || [];
                    items.push({ text: groupingTexts.groupByThisColumn, value: "group", beginGroup: true, disabled: isColumnGrouped, onItemClick: onItemClick });

                    if(column.showWhenGrouped) {
                        items.push({ text: groupingTexts.ungroup, value: "ungroup", disabled: !isColumnGrouped, onItemClick: onItemClick });
                    }

                    items.push({ text: groupingTexts.ungroupAll, value: "ungroupAll", onItemClick: onItemClick });
                }
            }
            return items;
        }
    };
})();
gridCore.registerModule("grouping", {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions_grouping
             * @publicName grouping
             * @type object
             */
            grouping: {
                /**
                 * @name dxDataGridOptions_grouping_autoExpandAll
                 * @publicName autoExpandAll
                 * @type boolean
                 * @default true
                 */
                autoExpandAll: true,
                /**
                 * @name dxDataGridOptions_grouping_allowCollapsing
                 * @publicName allowCollapsing
                 * @type boolean
                 * @default true
                 */
                allowCollapsing: true,
                /**
                 * @name dxDataGridOptions_grouping_contextMenuEnabled
                 * @publicName contextMenuEnabled
                 * @type boolean
                 * @default false
                 */
                contextMenuEnabled: false,
                /**
                 * @name dxDataGridOptions_grouping_expandMode
                 * @publicName expandMode
                 * @type string
                 * @acceptValues "buttonClick" | "rowClick"
                 * @default "buttonClick"
                 */
                expandMode: "buttonClick",
                /**
                 * @name dxDataGridOptions_grouping_texts
                 * @publicName texts
                 * @type object
                 */
                texts: {
                    /**
                    * @name dxDataGridOptions_grouping_texts_groupContinuesMessage
                    * @publicName groupContinuesMessage
                    * @type string
                    * @default "Continues on the next page"
                    */
                    groupContinuesMessage: messageLocalization.format("dxDataGrid-groupContinuesMessage"),
                    /**
                     * @name dxDataGridOptions_grouping_texts_groupContinuedMessage
                     * @publicName groupContinuedMessage
                     * @type string
                     * @default "Continued from the previous page"
                     */
                    groupContinuedMessage: messageLocalization.format("dxDataGrid-groupContinuedMessage"),
                    /**
                    * @name dxDataGridOptions_grouping_texts_groupByThisColumn
                    * @publicName groupByThisColumn
                    * @type string
                    * @default "Group by This Column"
                    */
                    groupByThisColumn: messageLocalization.format("dxDataGrid-groupHeaderText"),
                    /**
                    * @name dxDataGridOptions_grouping_texts_ungroup
                    * @publicName ungroup
                    * @type string
                    * @default "Ungroup"
                    */
                    ungroup: messageLocalization.format("dxDataGrid-ungroupHeaderText"),
                    /**
                    * @name dxDataGridOptions_grouping_texts_ungroupAll
                    * @publicName ungroupAll
                    * @type string
                    * @default "Ungroup All"
                    */
                    ungroupAll: messageLocalization.format("dxDataGrid-ungroupAllText")
                }
            },
            /**
            * @name dxDataGridOptions_groupPanel
            * @publicName groupPanel
            * @type object
            */
            groupPanel: {
                /**
                 * @name dxDataGridOptions_groupPanel_visible
                 * @publicName visible
                 * @type boolean|string
                 * @acceptValues "auto"
                 * @default false
                 */
                visible: false,
                /**
                 * @name dxDataGridOptions_groupPanel_emptyPanelText
                 * @publicName emptyPanelText
                 * @type string
                 * @default "Drag a column header here to group by that column"
                 */
                emptyPanelText: messageLocalization.format("dxDataGrid-groupPanelEmptyText"),
                /**
                 * @name dxDataGridOptions_groupPanel_allowColumnDragging
                 * @publicName allowColumnDragging
                 * @type boolean
                 * @default true
                 */
                allowColumnDragging: true
            }
        };
    },
    extenders: {
        controllers: {
            data: GroupingDataControllerExtender
        },
        views: {
            headerPanel: GroupingHeaderPanelExtender,
            rowsView: GroupingRowsViewExtender,
            columnHeadersView: columnHeadersViewExtender
        }
    }
});
