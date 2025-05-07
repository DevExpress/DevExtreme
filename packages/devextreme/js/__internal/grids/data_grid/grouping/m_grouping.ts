/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/method-signature-style */
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getHeight } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import { restoreFocus, setTabIndex } from '@js/ui/shared/accessibility';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import { registerKeyboardAction } from '@ts/grids/grid_core/m_accessibility';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { ColumnHeadersView } from '../../grid_core/column_headers/m_column_headers';
import type { ColumnsController } from '../../grid_core/columns_controller/m_columns_controller';
import type { EditingController } from '../../grid_core/editing/m_editing';
import type { HeaderPanel } from '../../grid_core/header_panel/m_header_panel';
import type { RowsView } from '../../grid_core/views/m_rows_view';
import gridCore from '../m_core';
import dataSourceAdapterProvider from '../m_data_source_adapter';
import { GroupingHelper as CollapsedGroupingHelper } from './m_grouping_collapsed';
import { GroupingHelper as ExpandedGroupingHelper } from './m_grouping_expanded';

const DATAGRID_GROUP_PANEL_CLASS = 'dx-datagrid-group-panel';
const DATAGRID_GROUP_PANEL_MESSAGE_CLASS = 'dx-group-panel-message';
const DATAGRID_GROUP_PANEL_ITEM_CLASS = 'dx-group-panel-item';
const DATAGRID_GROUP_PANEL_LABEL_CLASS = 'dx-toolbar-label';
const DATAGRID_GROUP_PANEL_CONTAINER_CLASS = 'dx-toolbar-item';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const DATAGRID_GROUP_ROW_CLASS = 'dx-group-row';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';

export interface GroupingDataControllerExtension {
  isRowExpanded(key): boolean;
  changeRowExpand(key, isRowClick?): any;
}

const dataSourceAdapterExtender = (Base: ModuleType<DataSourceAdapter>) => class GroupingDataSourceAdapterExtender extends Base {
  private _grouping: any;

  public init() {
    super.init.apply(this, arguments as any);
    this._initGroupingHelper();
  }

  private _initGroupingHelper(options?) {
    const grouping = this._grouping;
    const isAutoExpandAll = this.option('grouping.autoExpandAll');
    const isFocusedRowEnabled = this.option('focusedRowEnabled');
    const remoteOperations = options ? options.remoteOperations : this.remoteOperations();
    const isODataRemoteOperations = remoteOperations.filtering && remoteOperations.sorting && remoteOperations.paging;

    if (isODataRemoteOperations && !remoteOperations.grouping && (isAutoExpandAll || !isFocusedRowEnabled)) {
      if (!grouping || grouping instanceof CollapsedGroupingHelper) {
        this._grouping = new ExpandedGroupingHelper(this);
      }
    } else if (!grouping || grouping instanceof ExpandedGroupingHelper) {
      this._grouping = new CollapsedGroupingHelper(this);
    }
  }

  protected totalItemsCount() {
    const totalCount = super.totalItemsCount();

    return totalCount > 0 && this._dataSource.group() && this._dataSource.requireTotalCount() ? totalCount + this._grouping.totalCountCorrection() : totalCount;
  }

  protected itemsCount() {
    return this._dataSource.group() ? this._grouping.itemsCount() || 0 : super.itemsCount.apply(this, arguments as any);
  }

  protected allowCollapseAll() {
    return this._grouping.allowCollapseAll();
  }

  protected isGroupItemCountable(item) {
    return this._grouping.isGroupItemCountable(item);
  }

  private isRowExpanded(key) {
    const groupInfo = this._grouping.findGroupInfo(key);
    return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
  }

  private collapseAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, false);
  }

  private expandAll(groupIndex) {
    return this._collapseExpandAll(groupIndex, true);
  }

  private _collapseExpandAll(groupIndex, isExpand) {
    const that = this;
    const dataSource = that._dataSource;
    const group = dataSource.group();
    const groups = gridCore.normalizeSortingInfo(group || []);

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

  public refresh() {
    super.refresh.apply(this, arguments as any);

    return this._grouping.refresh.apply(this._grouping, arguments);
  }

  protected changeRowExpand(path) {
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

  protected _changeRowExpandCore(path) {
    return this._grouping.changeRowExpand(path);
  }

  /// #DEBUG
  private getGroupsInfo() {
    return this._grouping._groupsInfo;
  }

  /// #ENDDEBUG
  // @ts-expect-error
  private _hasGroupLevelsExpandState(group, isExpanded) {
    if (group && Array.isArray(group)) {
      for (let i = 0; i < group.length; i++) {
        if (group[i].isExpanded === isExpanded) {
          return true;
        }
      }
    }
  }

  protected _customizeRemoteOperations(options, operationTypes) {
    const { remoteOperations } = options;

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

    super._customizeRemoteOperations.apply(this, arguments as any);
  }

  protected _handleDataLoading(options) {
    super._handleDataLoading(options);
    this._initGroupingHelper(options);
    return this._grouping.handleDataLoading(options);
  }

  protected _handleDataLoaded(options) {
    return this._grouping.handleDataLoaded(options, super._handleDataLoaded.bind(this));
  }

  protected _handleDataLoadedCore(options) {
    return this._grouping.handleDataLoadedCore(options, super._handleDataLoadedCore.bind(this));
  }
};

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);

const GroupingDataControllerExtender = (Base: ModuleType<DataController>) => class GroupingDataControllerExtender extends Base {
  public init() {
    const that = this;
    super.init();

    that.createAction('onRowExpanding');
    that.createAction('onRowExpanded');
    that.createAction('onRowCollapsing');
    that.createAction('onRowCollapsed');
  }

  protected _beforeProcessItems(items) {
    const groupColumns = this._columnsController.getGroupColumns();

    items = super._beforeProcessItems(items);
    if (items.length && groupColumns.length) {
      items = this._processGroupItems(items, groupColumns.length);
    }
    return items;
  }

  protected _processItem(item, options) {
    if (isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0) {
      item = this._processGroupItem(item, options);
      options.dataIndex = 0;
    } else {
      // @ts-expect-error
      item = super._processItem.apply(this, arguments);
    }
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _processGroupItem(item, options?) {
    return item;
  }

  private _processGroupItems(items, groupsCount, options?) {
    const that = this;
    const groupedColumns = that._columnsController.getGroupColumns();
    const column = groupedColumns[groupedColumns.length - groupsCount];

    if (!options) {
      const scrollingMode = that.option('scrolling.mode');
      options = {
        collectContinuationItems: scrollingMode !== 'virtual' && scrollingMode !== 'infinite',
        resultItems: [],
        path: [],
        values: [],
      };
    }

    const { resultItems } = options;

    if (options.data) {
      if (options.collectContinuationItems || !options.data.isContinuation) {
        resultItems.push({
          rowType: 'group',
          data: options.data,
          groupIndex: options.path.length - 1,
          isExpanded: !!options.data.items,
          key: options.path.slice(0),
          values: options.values.slice(0),
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

  public publicMethods() {
    return super.publicMethods().concat(['collapseAll', 'expandAll', 'isRowExpanded', 'expandRow', 'collapseRow']);
  }

  private collapseAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.collapseAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }

  private expandAll(groupIndex) {
    const dataSource = this._dataSource;
    if (dataSource && dataSource.expandAll(groupIndex)) {
      dataSource.pageIndex(0);
      dataSource.reload();
    }
  }

  private changeRowExpand(key) {
    const that = this;
    const expanded = that.isRowExpanded(key);
    const args: any = {
      key,
      expanded,
    };

    that.executeAction(expanded ? 'onRowCollapsing' : 'onRowExpanding', args);

    if (!args.cancel) {
      return when(that._changeRowExpandCore(key)).done(() => {
        args.expanded = !expanded;
        that.executeAction(expanded ? 'onRowCollapsed' : 'onRowExpanded', args);
      });
    }

    // @ts-expect-error
    return new Deferred().resolve();
  }

  protected _changeRowExpandCore(key) {
    const that = this;
    const dataSource = this._dataSource;

    // @ts-expect-error
    const d = new Deferred();
    if (!dataSource) {
      d.resolve();
    } else {
      when(dataSource.changeRowExpand(key)).done(() => {
        that.load().done(d.resolve).fail(d.reject);
      }).fail(d.reject);
    }
    return d;
  }

  private isRowExpanded(key) {
    const dataSource = this._dataSource;

    return dataSource && dataSource.isRowExpanded(key);
  }

  private expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }

  private collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }

  public optionChanged(args) {
    if (args.name === 'grouping'/* autoExpandAll */) {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }
};

const onGroupingMenuItemClick = function (column, params) {
  const columnsController = this._columnsController;

  // eslint-disable-next-line default-case
  switch (params.itemData.value) {
    case 'group': {
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

const isGroupPanelVisible = (groupPanelOptions): boolean => {
  const visible = groupPanelOptions?.visible;

  return visible === 'auto'
    ? devices.current().deviceType === 'desktop'
    : !!visible;
};

const allowDragging = (groupPanelOptions, column): boolean => {
  const isVisible = isGroupPanelVisible(groupPanelOptions);
  const canDrag = groupPanelOptions?.allowColumnDragging && column.allowGrouping;

  return isVisible && !!canDrag;
};

export const GroupingHeaderPanelExtender = (Base: ModuleType<HeaderPanel>) => class GroupingHeaderPanelExtender extends Base {
  protected _getToolbarItems() {
    const items = super._getToolbarItems();

    return this._appendGroupingItem(items);
  }

  private _appendGroupingItem(items) {
    if (this._isGroupPanelVisible()) {
      let isRendered = false;
      const toolbarItem = {
        template: () => {
          const $groupPanel = $('<div>').addClass(DATAGRID_GROUP_PANEL_CLASS);
          this._updateGroupPanelContent($groupPanel);
          registerKeyboardAction('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
          return $groupPanel;
        },
        name: 'groupPanel',
        onItemRendered: () => {
          isRendered && this.renderCompleted.fire();
          isRendered = true;
        },
        location: 'before',
        locateInMenu: 'never',
        sortIndex: 1,
      };

      items.push(toolbarItem);
      this.updateToolbarDimensions();
    }

    return items;
  }

  private _handleActionKeyDown(args) {
    const { event } = args;
    const $target = $(event.target);
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

  private _isGroupPanelVisible(): boolean {
    return isGroupPanelVisible(this.option('groupPanel'));
  }

  private _renderGroupPanelItems($groupPanel, groupColumns) {
    const that = this;

    $groupPanel.empty();

    each(groupColumns, (index, groupColumn) => {
      that._createGroupPanelItem($groupPanel, groupColumn);
    });

    restoreFocus(this);
  }

  private _createGroupPanelItem($rootElement, groupColumn) {
    const $groupPanelItem = $('<div>')
      .addClass(groupColumn.cssClass)
      .addClass(DATAGRID_GROUP_PANEL_ITEM_CLASS)
      .data('columnData', groupColumn)
      .appendTo($rootElement)
      .text(groupColumn.caption);

    setTabIndex(this, $groupPanelItem);

    return $groupPanelItem;
  }

  protected _columnOptionChanged(e?) {
    if (!this._requireReady && !gridCore.checkChanges(e.optionNames, ['width', 'visibleWidth'])) {
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

  private _updateGroupPanelContent($groupPanel) {
    const groupColumns = this.getColumns();
    const groupPanelOptions: any = this.option('groupPanel');

    this._renderGroupPanelItems($groupPanel, groupColumns);

    if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
      $('<div>')
        .addClass(DATAGRID_GROUP_PANEL_MESSAGE_CLASS)
        .text(groupPanelOptions.emptyPanelText)
        .appendTo($groupPanel);

      $groupPanel.closest(`.${DATAGRID_GROUP_PANEL_CONTAINER_CLASS}`).addClass(DATAGRID_GROUP_PANEL_LABEL_CLASS);
      $groupPanel.closest(`.${DATAGRID_GROUP_PANEL_LABEL_CLASS}`).css('maxWidth', 'none');
    }
  }

  protected allowDragging(column?): boolean {
    const groupPanelOptions = this.option('groupPanel');

    return allowDragging(groupPanelOptions, column);
  }

  public getColumnElements() {
    const $element = this.element();
    return $element && $element.find(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`);
  }

  public getColumns() {
    return this._columnsController.getGroupColumns();
  }

  protected getBoundingRect() {
    const that = this;
    const $element = that.element();

    if ($element && $element.find(`.${DATAGRID_GROUP_PANEL_CLASS}`).length) {
      const offset = $element.offset();

      return {
        top: offset.top,
        bottom: offset.top + getHeight($element),
      };
    }
    return null;
  }

  public getName() {
    return 'group';
  }

  private getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    const $groupedColumnElement = $(options.targetElement).closest(`.${DATAGRID_GROUP_PANEL_ITEM_CLASS}`);
    let items;

    if ($groupedColumnElement.length) {
      options.column = $groupedColumnElement.data('columnData');
    }

    if (contextMenuEnabled && options.column) {
      const { column } = options;
      const isGroupingAllowed = isDefined(column.allowGrouping) ? column.allowGrouping : true;

      if (isGroupingAllowed) {
        const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        const groupingTexts: any = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);

        items = [
          {
            text: groupingTexts.ungroup, value: 'ungroup', disabled: !isColumnGrouped, onItemClick,
          },
          { text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick },
        ];
      }
    }
    return items;
  }

  public hasGroupedColumns(): boolean {
    return this._isGroupPanelVisible() && !!this.getColumns().length;
  }

  public optionChanged(args) {
    if (args.name === 'groupPanel') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
};

const GroupingRowsViewExtender = (Base: ModuleType<RowsView>) => class GroupingRowsViewExtender extends Base {
  private getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items;

    if (contextMenuEnabled && options.row && options.row.rowType === 'group') {
      const columnsController = that._columnsController;
      const column = columnsController.columnOption(`groupIndex:${options.row.groupIndex}`);

      if (column && column.allowGrouping) {
        const groupingTexts: any = that.option('grouping.texts');
        const onItemClick = onGroupingMenuItemClick.bind(that, column);

        items = [];

        items.push(
          { text: groupingTexts.ungroup, value: 'ungroup', onItemClick },
          { text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick },
        );
      }
    }
    return items;
  }

  protected _rowClick(e) {
    const that = this;
    const expandMode = that.option('grouping.expandMode');
    const scrollingMode = that.option('scrolling.mode');
    const isGroupRowStateChanged = scrollingMode !== 'infinite' && expandMode === 'rowClick' && $(e.event.target).closest(`.${DATAGRID_GROUP_ROW_CLASS}`).length;
    const isExpandButtonClicked = $(e.event.target).closest(`.${DATAGRID_EXPAND_CLASS}`).length;

    if (isGroupRowStateChanged || isExpandButtonClicked) {
      that._changeGroupRowState(e);
    }

    super._rowClick(e);
  }

  private _changeGroupRowState(e) {
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

const columnHeadersViewExtender = (Base: ModuleType<ColumnHeadersView>) => class GroupingHeadersViewExtender extends Base {
  public getContextMenuItems(options) {
    const that = this;
    const contextMenuEnabled = that.option('grouping.contextMenuEnabled');
    let items: any[] | undefined = super.getContextMenuItems(options);

    if (contextMenuEnabled && options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const { column } = options;

      if (!column.command && (!isDefined(column.allowGrouping) || column.allowGrouping)) {
        const groupingTexts: any = that.option('grouping.texts');
        const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        const onItemClick = onGroupingMenuItemClick.bind(that, column);

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: groupingTexts.groupByThisColumn, value: 'group', beginGroup: true, disabled: isColumnGrouped, onItemClick,
        });

        if (column.showWhenGrouped) {
          items.push({
            text: groupingTexts.ungroup, value: 'ungroup', disabled: !isColumnGrouped, onItemClick,
          });
        }

        items.push({ text: groupingTexts.ungroupAll, value: 'ungroupAll', onItemClick });
      }
    }
    return items;
  }

  protected allowDragging(column): boolean {
    const groupPanelOptions = this.option('groupPanel');

    return allowDragging(groupPanelOptions, column) || super.allowDragging(column);
  }
};

gridCore.registerModule('grouping', {
  defaultOptions() {
    return {
      grouping: {
        autoExpandAll: true,
        allowCollapsing: true,
        contextMenuEnabled: false,
        expandMode: 'buttonClick',
        texts: {
          groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
          groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
          groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
          ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
          ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText'),
        },
      },
      groupPanel: {
        visible: false,
        emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
        allowColumnDragging: true,
      },
    };
  },
  extenders: {
    controllers: {
      data: GroupingDataControllerExtender,
      columns: (Base: ModuleType<ColumnsController>) => class GroupingColumnsExtender extends Base {
        public _getExpandColumnOptions() {
          // @ts-expect-error
          const options = super._getExpandColumnOptions.apply(this, arguments);

          // @ts-expect-error
          options.cellTemplate = gridCore.getExpandCellTemplate();

          return options;
        }
      },
      editing: (Base: ModuleType<EditingController>) => class GroupingEditingExtender extends Base {
        protected _isProcessedItem(item) {
          return isDefined(item.groupIndex) && isString(item.rowType) && item.rowType.indexOf('group') === 0;
        }
      },
    },
    views: {
      headerPanel: GroupingHeaderPanelExtender,
      rowsView: GroupingRowsViewExtender,
      columnHeadersView: columnHeadersViewExtender,
    },
  },
});
