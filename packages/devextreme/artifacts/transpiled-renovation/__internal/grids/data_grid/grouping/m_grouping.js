"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupingHeaderPanelExtender = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _accessibility = require("../../../../ui/shared/accessibility");
var _m_accessibility = require("../../../grids/grid_core/m_accessibility");
var _m_core = _interopRequireDefault(require("../m_core"));
var _m_data_source_adapter = _interopRequireDefault(require("../m_data_source_adapter"));
var _m_grouping_collapsed = require("./m_grouping_collapsed");
var _m_grouping_expanded = require("./m_grouping_expanded");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/method-signature-style */

const DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
const DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
const DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
const DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
const DATAGRID_GROUP_PANEL_CONTAINER_CLASS = 'dx-toolbar-item';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const dataSourceAdapterExtender = Base => class GroupingDataSourceAdapterExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._initGroupingHelper();
  }
  _initGroupingHelper(options) {
    const grouping = this._grouping;
    const isAutoExpandAll = this.option('grouping.autoExpandAll');
    const isFocusedRowEnabled = this.option('focusedRowEnabled');
    const remoteOperations = options ? options.remoteOperations : this.remoteOperations();
    const isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;
    if (isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
      if (!grouping || grouping instanceof _m_grouping_collapsed.GroupingHelper) {
        this._grouping = new _m_grouping_expanded.GroupingHelper(this);
      }
    } else if (!grouping || grouping instanceof _m_grouping_expanded.GroupingHelper) {
      this._grouping = new _m_grouping_collapsed.GroupingHelper(this);
    }
  }
  totalItemsCount() {
    const totalCount = super.totalItemsCount();
    return totalCount > 0 && this._dataSource.group() && this._dataSource.requireTotalCount() ? totalCount + this._grouping.totalCountCorrection() : totalCount;
  }
  itemsCount() {
    return this._dataSource.group() ? this._grouping.itemsCount() || 0 : super.itemsCount.apply(this, arguments);
  }
  allowCollapseAll() {
    return this._grouping.allowCollapseAll();
  }
  isGroupItemCountable(item) {
    return this._grouping.isGroupItemCountable(item);
  }
  isRowExpanded(key) {
    const groupInfo = this._grouping.findGroupInfo(key);
    return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
  }
  collapseAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, false);
  }
  expandAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, true);
  }
  _collapseExpandAll(groupIndex, isExpand) {
    const that = this;
    const dataSource = that._dataSource;
    const group = dataSource.group();
    const groups = _m_core.default.normalizeSortingInfo(group || []);
    if (groups.length) {
      for (let i = 0; i < groups.length; i++) {
        if (groupIndex === undefined || groupIndex === i) {
          groups[i].isExpanded = isExpand;
        } else if (group && group[i]) {
          groups[i].isExpanded = group[i].isExpanded;
        }
      }
      dataSource.group(groups);
      that._grouping.foreachGroups((groupInfo, parents) => {
        if (groupIndex === undefined || groupIndex === parents.length - 1) {
          groupInfo.isExpanded = isExpand;
        }
      }, false, true);
      that.resetPagesCache();
    }
    return true;
  }
  refresh() {
    super.refresh.apply(this, arguments);
    return this._grouping.refresh.apply(this._grouping, arguments);
  }
  changeRowExpand(path) {
    const that = this;
    const dataSource = that._dataSource;
    if (dataSource.group()) {
      dataSource.beginLoading();
      if (that._lastLoadOptions) {
        that._lastLoadOptions.groupExpand = true;
      }
      return that._changeRowExpandCore(path).always(() => {
        dataSource.endLoading();
      });
    }
  }
  _changeRowExpandCore(path) {
    return this._grouping.changeRowExpand(path);
  }
  /// #DEBUG
  getGroupsInfo() {
    return this._grouping._groupsInfo;
  }
  /// #ENDDEBUG
  // @ts-expect-error
  _hasGroupLevelsExpandState(group, isExpanded) {
    if (group && Array.isArray(group)) {
      for (let i = 0; i < group.length; i++) {
        if (group[i].isExpanded === isExpanded) {
          return true;
        }
      }
    }
  }
  _customizeRemoteOperations(options, operationTypes) {
    const {
      remoteOperations
    } = options;
    if (options.storeLoadOptions.group) {
      if (remoteOperations.grouping && !options.isCustomLoading) {
        if (!remoteOperations.groupPaging || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)) {
          remoteOperations.paging = false;
        }
      }
      if (!remoteOperations.grouping && (!remoteOperations.sorting || !remoteOperations.filtering || options.isCustomLoading || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false))) {
        remoteOperations.paging = false;
      }
    } else if (!options.isCustomLoading && remoteOperations.paging && operationTypes.grouping) {
      this.resetCache();
    }
    super._customizeRemoteOperations.apply(this, arguments);
  }
  _handleDataLoading(options) {
    super._handleDataLoading(options);
    this._initGroupingHelper(options);
    return this._grouping.handleDataLoading(options);
  }
  _handleDataLoaded(options) {
    return this._grouping.handleDataLoaded(options, super._handleDataLoaded.bind(this));
  }
  _handleDataLoadedCore(options) {
    return this._grouping.handleDataLoadedCore(options, super._handleDataLoadedCore.bind(this));
  }
};
_m_data_source_adapter.default.extend(dataSourceAdapterExtender);
const GroupingDataControllerExtender = Base => class GroupingDataControllerExtender extends Base {
  init() {
    const that = this;
    super.init();
    that.createAction('onRowExpanding');
    that.createAction('onRowExpanded');
    that.createAction('onRowCollapsing');
    that.createAction('onRowCollapsed');
  }
  _beforeProcessItems(items) {
    const groupColumns = this._columnsController.getGroupColumns();
    items = super._beforeProcessItems(items);
    if (items.length && groupColumns.length) {
      items = this._processGroupItems(items, groupColumns.length);
    }
    return items;
  }
  _processItem(item, options) {
    if ((0, _type.isDefined)(item.groupIndex) && (0, _type.isString)(item.rowType) && item.rowType.indexOf('group') === 0) {
      item = this._processGroupItem(item, options);
      options.dataIndex = 0;
    } else {
      // @ts-expect-error
      item = super._processItem.apply(this, arguments);
    }
    return item;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processGroupItem(item, options) {
    return item;
  }
  _processGroupItems(items, groupsCount, options) {
    const that = this;
    const groupedColumns = that._columnsController.getGroupColumns();
    const column = groupedColumns[groupedColumns.length - groupsCount];
    if (!options) {
      const scrollingMode = that.option('scrolling.mode');
      options = {
        collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
        resultItems: [],
        path: [],
        values: []
      };
    }
    const {
      resultItems
    } = options;
    if (options.data) {
      if (options.collectContinuationItems || !options.data.isContinuation) {
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
    if (items) {
      if (groupsCount === 0) {
        resultItems.push.apply(resultItems, items);
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && 'items' in item) {
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
  }
  publicMethods() {
    return super.publicMethods().concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
  }
  collapseAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.collapseAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }
  expandAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.expandAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }
  changeRowExpand(key) {
    const that = this;
    const expanded = that.isRowExpanded(key);
    const args = {
      key,
      expanded
    };
    that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);
    if (!args.cancel) {
      return (0, _deferred.when)(that._changeRowExpandCore(key)).done(() => {
        args.expanded = !expanded;
        that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
      });
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  _changeRowExpandCore(key) {
    const that = this;
    const dataSource = this._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (!dataSource) {
      d.resolve();
    } else {
      (0, _deferred.when)(dataSource.changeRowExpand(key)).done(() => {
        that.load().done(d.resolve).fail(d.reject);
      }).fail(d.reject);
    }
    return d;
  }
  isRowExpanded(key) {
    const dataSource = this._dataSource;
    return dataSource && dataSource.isRowExpanded(key);
  }
  expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  optionChanged(args) {
    if (args.name === 'grouping' /* autoExpandAll */) {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }
};
const onGroupingMenuItemClick = function (column, params) {
  const columnsController = this._columnsController;
  // eslint-disable-next-line default-case
  switch (params.itemData.value) {
    case 'group':
      {
        const groups = columnsController._dataSource.group() || [];
        columnsController.columnOption(column.dataField, 'groupIndex', groups.length);
        break;
      }
    case 'ungroup':
      columnsController.columnOption(column.dataField, 'groupIndex', -1);
      break;
    case 'ungroupAll':
      this.component.clearGrouping();
      break;
  }
};
const isGroupPanelVisible = groupPanelOptions => {
  const visible = groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.visible;
  return visible === 'auto' ? _devices.default.current().deviceType === 'desktop' : !!visible;
};
const allowDragging = (groupPanelOptions, column) => {
  const isVisible = isGroupPanelVisible(groupPanelOptions);
  const canDrag = (groupPanelOptions === null || groupPanelOptions === void 0 ? void 0 : groupPanelOptions.allowColumnDragging) && column.allowGrouping;
  return isVisible && !!canDrag;
};
const GroupingHeaderPanelExtender = Base => class GroupingHeaderPanelExtender extends Base {
  _getToolbarItems() {
    const items = super._getToolbarItems();
    return this._appendGroupingItem(items);
  }
  _appendGroupingItem(items) {
    if (this._isGroupPanelVisible()) {
      let isRendered = false;
      const toolbarItem = {
        template: () => {
          const $groupPanel = (0, _renderer.default)('<div>').addClass(DATAGRID_GROUP_PANEL_CLASS);
          this._updateGroupPanelContent($groupPanel);
          (0, _m_accessibility.registerKeyboardAction)('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
          return $groupPanel;
        },
        name: 'groupPanel',
        onItemRendered: () => {
          isRendered && this.renderCompleted.fire();
          isRendered = true;
        },
        location: 'before',
        locateInMenu: 'never',
        sortIndex: 1
      };
      items.push(toolbarItem);
      this.updateToolbarDimensions();
    }
    return items;
  }
  _handleActionKeyDown(args) {
    const {
      event
    } = args;
    const $target = (0, _renderer.default)(event.target);
    const groupColumnIndex = $target.closest(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`).index();
    const column = this._columnsController.getGroupColumns()[groupColumnIndex];
    const columnIndex = column && column.index;
    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      this._headerFilterController.showHeaderFilterMenu(columnIndex, true);
    } else {
      // @ts-expect-error
      this._processGroupItemAction(columnIndex);
    }
    event.preventDefault();
  }
  _isGroupPanelVisible() {
    return isGroupPanelVisible(this.option('groupPanel'));
  }
  _renderGroupPanelItems($groupPanel, groupColumns) {
    const that = this;
    $groupPanel.empty();
    (0, _iterator.each)(groupColumns, (index, groupColumn) => {
      that._createGroupPanelItem($groupPanel, groupColumn);
    });
    (0, _accessibility.restoreFocus)(this);
  }
  _createGroupPanelItem($rootElement, groupColumn) {
    const $groupPanelItem = (0, _renderer.default)('<div>').addClass(groupColumn.cssClass).addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS).data('columnData', groupColumn).appendTo($rootElement).text(groupColumn.caption);
    (0, _accessibility.setTabIndex)(this, $groupPanelItem);
    return $groupPanelItem;
  }
  _columnOptionChanged(e) {
    if (!this._requireReady && !_m_core.default.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
      const $toolbarElement = this.element();
      const $groupPanel = $toolbarElement && $toolbarElement.find(`.${DATAGRID_GROUP_PANEL_CLASS}`);
      if ($groupPanel && $groupPanel.length) {
        this._updateGroupPanelContent($groupPanel);
        this.updateToolbarDimensions();
        this.renderCompleted.fire();
      }
    }
    super._columnOptionChanged();
  }
  _updateGroupPanelContent($groupPanel) {
    const groupColumns = this.getColumns();
    const groupPanelOptions = this.option('groupPanel');
    this._renderGroupPanelItems($groupPanel, groupColumns);
    if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
      (0, _renderer.default)('<div>').addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS).text(groupPanelOptions.emptyPanelText).appendTo($groupPanel);
      $groupPanel.closest(`.${DATAGRID_GROUP_PANEL_CONTAINER_CLASS}`).addClass(DATAGRID_GROUP_PANEL_LABEL_CLASS);
      $groupPanel.closest(`.${DATAGRID_GROUP_PANEL_LABEL_CLASS}`).css('maxWidth', 'none');
    }
  }
  allowDragging(column) {
    const groupPanelOptions = this.option('groupPanel');
    return allowDragging(groupPanelOptions, column);
  }
  getColumnElements() {
    const $element = this.element();
    return $element && $element.find(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`);
  }
  getColumns() {
    return this._columnsController.getGroupColumns();
  }
  getBoundingRect() {
    const that = this;
    const $element = that.element();
    if ($element && $element.find(`.${DATAGRID_GROUP_PANEL_CLASS}`).length) {
      const offset = $element.offset();
      return {
        top: offset.top,
        bottom: offset.top + (0, _size.getHeight)($element)
      };
    }
    return null;
  }
  getName() {
    return 'group';
  }
  getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    const $groupedColumnElement = (0, _renderer.default)(options.targetElement).closest(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`);
    let items;
    if ($groupedColumnElement.length) {
      options.column = $groupedColumnElement.data('columnData');
    }
    if (contextMenuEnabled && options.column) {
      const {
        column
      } = options;
      const isGroupingAllowed = (0, _type.isDefined)(column.allowGrouping) ? column.allowGrouping : true;
      if (isGroupingAllowed) {
        const isColumnGrouped = (0, _type.isDefined)(column.groupIndex) && column.groupIndex > -1;
        const groupingTexts = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        items = [{
          text: groupingTexts.ungroup,
          value: 'ungroup',
          disabled: !isColumnGrouped,
          onItemClick
        }, {
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        }];
      }
    }
    return items;
  }
  isVisible() {
    return super.isVisible() || this._isGroupPanelVisible();
  }
  hasGroupedColumns() {
    return this._isGroupPanelVisible() && !!this.getColumns().length;
  }
  optionChanged(args) {
    if (args.name === 'groupPanel') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
};
exports.GroupingHeaderPanelExtender = GroupingHeaderPanelExtender;
const GroupingRowsViewExtender = Base => class GroupingRowsViewExtender extends Base {
  getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items;
    if (contextMenuEnabled && options.row && options.row.rowType === 'group') {
      const columnsController = that._columnsController;
      const column = columnsController.columnOption(`groupIndex:${options.row.groupIndex}`);
      if (column && column.allowGrouping) {
        const groupingTexts = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        items = [];
        items.push({
          text: groupingTexts.ungroup,
          value: 'ungroup',
          onItemClick
        }, {
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        });
      }
    }
    return items;
  }
  _rowClick(e) {
    const that = this;
    const expandMode = that.option('grouping.expandMode');
    const scrollingMode = that.option('scrolling.mode');
    const isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && (0, _renderer.default)(e.event.target).closest(`.${DATAGRID_GROUP_ROW_CLASS}`).length;
    const isExpandButtonClicked = (0, _renderer.default)(e.event.target).closest(`.${DATAGRID_EXPAND_CLASS}`).length;
    if (isGroupRowStateChanged || isExpandButtonClicked) {
      that._changeGroupRowState(e);
    }
    super._rowClick(e);
  }
  _changeGroupRowState(e) {
    const row = this._dataController.items()[e.rowIndex];
    // @ts-expect-error
    const allowCollapsing = this._columnsController.columnOption(`groupIndex:${row.groupIndex}`, 'allowCollapsing');
    if (row.rowType === 'data' || row.rowType === 'group' && allowCollapsing !== false) {
      // @ts-expect-error
      this._dataController.changeRowExpand(row.key, true);
      e.event.preventDefault();
      e.handled = true;
    }
  }
};
const columnHeadersViewExtender = Base => class GroupingHeadersViewExtender extends Base {
  getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items = super.getContextMenuItems(options);
    if (contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const {
        column
      } = options;
      if (!column.command && (!(0, _type.isDefined)(column.allowGrouping) || column.allowGrouping)) {
        const groupingTexts = that.option('grouping.texts');
        const isColumnGrouped = (0, _type.isDefined)(column.groupIndex) && column.groupIndex > -1;
        const onItemClick = onGroupingMenuItemClick.bind(that, column);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: groupingTexts.groupByThisColumn,
          value: 'group',
          beginGroup: true,
          disabled: isColumnGrouped,
          onItemClick
        });
        if (column.showWhenGrouped) {
          items.push({
            text: groupingTexts.ungroup,
            value: 'ungroup',
            disabled: !isColumnGrouped,
            onItemClick
          });
        }
        items.push({
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick
        });
      }
    }
    return items;
  }
  allowDragging(column) {
    const groupPanelOptions = this.option('groupPanel');
    return allowDragging(groupPanelOptions, column) || super.allowDragging(column);
  }
};
_m_core.default.registerModule('grouping', {
  defaultOptions() {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: false,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: _message.default.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: _message.default.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: _message.default.format('dxDataGrid-groupHeaderText'),
          ungroup: _message.default.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: _message.default.format('dxDataGrid-ungroupAllText')
        }
      },
      groupPanel: {
        visible: false,
        emptyPanelText: _message.default.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true
      }
    };
  },
  extenders: {
    controllers: {
      data: GroupingDataControllerExtender,
      columns: Base => class GroupingColumnsExtender extends Base {
        _getExpandColumnOptions() {
          // @ts-expect-error
          const options = super._getExpandColumnOptions.apply(this, arguments);
          // @ts-expect-error
          options.cellTemplate = _m_core.default.getExpandCellTemplate();
          return options;
        }
      },
      editing: Base => class GroupingEditingExtender extends Base {
        _isProcessedItem(item) {
          return (0, _type.isDefined)(item.groupIndex) && (0, _type.isString)(item.rowType) && item.rowType.indexOf('group') === 0;
        }
      }
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender
    }
  }
});