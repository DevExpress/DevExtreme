/* eslint-disable max-classes-per-file */
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { getHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { ItemClickEvent } from '@js/ui/context_menu';
import type {
  Grouping, GroupingTexts, GroupPanel, Properties,
} from '@js/ui/data_grid';
import { restoreFocus, setTabIndex } from '@js/ui/shared/accessibility';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { GroupPanelKeyboardNavigationController } from '@ts/grids/data_grid/keyboard_navigation/group_panel_keyboard_navigation';
import { registerKeyboardAction } from '@ts/grids/grid_core/accessibility';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import { ColumnContextMenuMixin } from '@ts/grids/grid_core/context_menu/column_context_menu_mixin';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, OperationTypes } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ToolbarItem } from '@ts/grids/grid_core/header_panel/types';
import type {
  ModuleType, OptionChanged, OptionChangedFor, RowKey,
} from '@ts/grids/grid_core/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type {
  BoundingRect,
  ContextMenuItemsOptions,
  GridContextMenuItem,
  ViewRowEvent,
} from '@ts/grids/grid_core/views/types';

import type { ColumnHeadersView } from '../../grid_core/column_headers/column_headers';
import type { HeaderPanel } from '../../grid_core/header_panel/header_panel';
import type { RowsView } from '../../grid_core/views/rows_view';
import gridCore from '../core';
import dataSourceAdapterProvider from '../data_source_adapter';
import {
  CLASSES,
  CONTEXT_MENU_GROUP_BY_COLUMN_ICON_NAME,
  CONTEXT_MENU_UNGROUP_ALL_COLUMNS_ICON_NAME,
  CONTEXT_MENU_UNGROUP_COLUMN_ICON_NAME,
} from './const';
import { GroupingHelper as CollapsedGroupingHelper } from './m_grouping_collapsed';
import type { GroupingHelper } from './m_grouping_core';
import { GroupingHelper as ExpandedGroupingHelper } from './m_grouping_expanded';
import type {
  ForeachGroupsResult,
  GroupInfoLevel,
  GroupingDataControllerExtension,
  GroupingDataSourceAdapter,
  GroupingKeyboardNavigationController,
  GroupingLoadOperation,
  GroupItem,
  GroupItemData,
} from './types';

const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';

const dataSourceAdapterExtender = (
  Base: ModuleType<DataSourceAdapter>,
): ModuleType<GroupingDataSourceAdapter> => class GroupingDataSourceAdapterExtender extends Base {
  public _grouping!: GroupingHelper;

  public init(dataSource?: DataSource): void {
    super.init(dataSource);
    this._initGroupingHelper();
  }

  private _initGroupingHelper(options?: LoadOperation): void {
    const grouping = this._grouping;
    const isAutoExpandAll: Grouping['autoExpandAll'] = this.option('grouping.autoExpandAll');
    const isFocusedRowEnabled = this.option('focusedRowEnabled');
    const remoteOperations = options?.remoteOperations ?? this.remoteOperations();
    const isODataRemoteOperations = remoteOperations.filtering
      && remoteOperations.sorting
      && remoteOperations.paging;

    if (
      isODataRemoteOperations
      && !remoteOperations.grouping
      && (isAutoExpandAll || !isFocusedRowEnabled)
    ) {
      if (!grouping || grouping instanceof CollapsedGroupingHelper) {
        this._grouping = new ExpandedGroupingHelper(this);
      }
    } else if (!grouping || grouping instanceof ExpandedGroupingHelper) {
      this._grouping = new CollapsedGroupingHelper(this);
    }
  }

  public totalItemsCount(): number {
    const totalCount = super.totalItemsCount();
    const needTotalCountCorrection = totalCount > 0
      && this._dataSource.group()
      && this._dataSource.requireTotalCount();

    return needTotalCountCorrection
      ? totalCount + this._grouping.totalCountCorrection()
      : totalCount;
  }

  public itemsCount(): number {
    return this._dataSource.group()
      ? this._grouping.itemsCount() || 0
      : super.itemsCount();
  }

  protected isGroupItemCountable(item: GroupItemData): boolean {
    return this._grouping.isGroupItemCountable(item);
  }

  public isRowExpanded(key: RowKey): boolean {
    // @ts-expect-error group row keys are paths
    const groupInfo = this._grouping.findGroupInfo(key);
    return groupInfo ? groupInfo.isExpanded : !this._grouping.allowCollapseAll();
  }

  public collapseAll(groupIndex?: number): boolean {
    return this._collapseExpandAll(groupIndex, false);
  }

  public expandAll(groupIndex?: number): boolean {
    return this._collapseExpandAll(groupIndex, true);
  }

  private _collapseExpandAll(groupIndex: number | undefined, isExpand: boolean): boolean {
    const dataSource = this._dataSource;
    const group = dataSource.group();
    const groups = gridCore.normalizeSortingInfo(group || []);

    if (groups.length) {
      for (let i = 0; i < groups.length; i += 1) {
        if (groupIndex === undefined || groupIndex === i) {
          groups[i].isExpanded = isExpand;
        } else if (group?.[i]) {
          groups[i].isExpanded = group[i].isExpanded;
        }
      }
      // @ts-expect-error normalizeSortingInfo() types selector wider than public KeySelector
      dataSource.group(groups);
      this._grouping.foreachGroups((groupInfo, parents) => {
        if (groupIndex === undefined || groupIndex === parents.length - 1) {
          groupInfo.isExpanded = isExpand;
        }
      }, false, true);

      this.resetPagesCache();
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- callers wait on the result
  public refresh(options: LoadOperation, operationTypes: OperationTypes): ForeachGroupsResult {
    super.refresh(options, operationTypes);

    return this._grouping.refresh(options, operationTypes);
  }

  public changeRowExpand(path: RowKey): DeferredObj<unknown> | undefined {
    const dataSource = this._dataSource;

    if (!dataSource.group()) {
      return undefined;
    }

    dataSource.beginLoading();
    if (this._lastLoadOptions) {
      this._lastLoadOptions.groupExpand = true;
    }
    return this._changeRowExpandCore(path).always(() => {
      dataSource.endLoading();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- callers wait on the result
  protected _changeRowExpandCore(path: RowKey): DeferredObj<unknown> {
    // @ts-expect-error group row keys are paths
    return this._grouping.changeRowExpand(path);
  }

  /// #DEBUG
  private getGroupsInfo(): GroupInfoLevel {
    return this._grouping.groupsInfo;
  }

  /// #ENDDEBUG
  private _hasGroupLevelsExpandState(
    group: LoadOperation['storeLoadOptions']['group'],
    isExpanded: boolean,
  ): boolean {
    return Array.isArray(group)
      && group.some((level) => typeof level === 'object' && level.isExpanded === isExpanded);
  }

  protected _customizeRemoteOperations(
    options: LoadOperation,
    operationTypes: OperationTypes,
  ): void {
    const remoteOperations = options.remoteOperations ?? {};

    if (options.storeLoadOptions.group) {
      if (remoteOperations.grouping && !options.isCustomLoading) {
        if (
          !remoteOperations.groupPaging
          || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, true)
        ) {
          remoteOperations.paging = false;
        }
      }

      if (
        !remoteOperations.grouping
        && (
          !remoteOperations.sorting
          || !remoteOperations.filtering
          || options.isCustomLoading
          || this._hasGroupLevelsExpandState(options.storeLoadOptions.group, false)
        )
      ) {
        remoteOperations.paging = false;
      }
    } else if (!options.isCustomLoading && remoteOperations.paging && operationTypes.grouping) {
      this.resetCache();
    }

    super._customizeRemoteOperations(options, operationTypes);
  }

  protected _handleDataLoading(options: GroupingLoadOperation): void {
    super._handleDataLoading(options);
    this._initGroupingHelper(options);
    return this._grouping.handleDataLoading(options);
  }

  public customizeLoadResultHandler(options: GroupingLoadOperation): void {
    return this._grouping.handleDataLoaded(options, super.customizeLoadResultHandler.bind(this));
  }

  protected customizeLoadResultHandlerCore(options: GroupingLoadOperation): void {
    return this._grouping.handleDataLoadedCore(
      options,
      super.customizeLoadResultHandlerCore.bind(this),
    );
  }
};

dataSourceAdapterProvider.extend(dataSourceAdapterExtender);

const onGroupingMenuItemClick = (
  keyboardNavigationController: GroupingKeyboardNavigationController | undefined,
  column: Column,
  rowIndex: number,
  e: ItemClickEvent<GridContextMenuItem>,
): void => {
  switch (e.itemData?.value) {
    case 'group':
      keyboardNavigationController?.groupColumn?.(column, rowIndex);
      break;
    case 'ungroup':
      keyboardNavigationController?.ungroupColumn?.(column, rowIndex);
      break;
    case 'ungroupAll':
      keyboardNavigationController?.ungroupAllColumns?.();
      break;
    default:
      break;
  }
};

const isGroupPanelVisible = (groupPanelOptions: GroupPanel | undefined): boolean => {
  const visible = groupPanelOptions?.visible;

  return visible === 'auto'
    ? devices.current().deviceType === 'desktop'
    : !!visible;
};

const allowDragging = (
  groupPanelOptions: GroupPanel | undefined,
  column: Column | undefined,
): boolean => {
  const isVisible = isGroupPanelVisible(groupPanelOptions);
  const canDrag = groupPanelOptions?.allowColumnDragging && column?.allowGrouping;

  return isVisible && !!canDrag;
};

export const GroupingHeaderPanelExtender = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class HeaderPanelGroupingExtender
  extends ColumnContextMenuMixin(Base) {
  protected _getToolbarItems(): ToolbarItem[] {
    const items = super._getToolbarItems();

    return this._appendGroupingItem(items);
  }

  private _appendGroupingItem(items: ToolbarItem[]): ToolbarItem[] {
    if (this._isGroupPanelVisible()) {
      let isRendered = false;
      const toolbarItem: ToolbarItem = {
        template: (): dxElementWrapper => {
          const $groupPanel = $('<div>').addClass(CLASSES.groupPanel);
          this._updateGroupPanelContent($groupPanel);
          registerKeyboardAction('groupPanel', this, $groupPanel, undefined, this._handleActionKeyDown.bind(this));
          return $groupPanel;
        },
        name: 'groupPanel',
        onItemRendered: (): void => {
          if (isRendered) {
            this.renderCompleted.fire();
          }
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

  private _handleActionKeyDown(args: { event: DxEvent }): void {
    const { event } = args;
    const $target = $(event.target);
    const groupColumnIndex = $target.closest(`.${CLASSES.groupPanelItem}`).index();
    const column = this._columnsController.getGroupColumns()[groupColumnIndex];
    const columnIndex = column?.index;

    if (!$target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      // @ts-expect-error _processGroupItemAction is defined by sorting
      this._processGroupItemAction(columnIndex);
    } else if (isDefined(columnIndex)) {
      this._headerFilterController.showHeaderFilterMenu(columnIndex, true);
    }

    event.preventDefault();
  }

  private _isGroupPanelVisible(): boolean {
    return isGroupPanelVisible(this.option('groupPanel'));
  }

  private _renderGroupPanelItems($groupPanel: dxElementWrapper, groupColumns: Column[]): void {
    $groupPanel.empty();

    groupColumns.forEach((groupColumn) => {
      this._createGroupPanelItem($groupPanel, groupColumn);
    });

    restoreFocus(this);
  }

  protected _createGroupPanelItem(
    $rootElement: dxElementWrapper,
    groupColumn: Column,
  ): dxElementWrapper {
    const $groupPanelItem = $('<div>')
      .addClass(groupColumn.cssClass ?? '')
      .addClass(CLASSES.groupPanelItem)
      .data('columnData', groupColumn)
      .appendTo($rootElement)
      .text(groupColumn.caption ?? '');

    setTabIndex(this, $groupPanelItem);

    return $groupPanelItem;
  }

  private getGroupAndUngroupItems(options: ContextMenuItemsOptions): GridContextMenuItem[] {
    const { column } = options;
    const contextMenuEnabled: Grouping['contextMenuEnabled'] = this.option('grouping.contextMenuEnabled');

    if (contextMenuEnabled && column) {
      const isGroupingAllowed = isDefined(column.allowGrouping) ? column.allowGrouping : true;

      if (isGroupingAllowed) {
        const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        const groupingTexts: GroupingTexts = this.option('grouping.texts');
        const onItemClick = (e: ItemClickEvent<GridContextMenuItem>): void => {
          onGroupingMenuItemClick(this.getKeyboardNavigationController(), column, 0, e);
        };

        return [
          {
            text: groupingTexts.ungroup,
            value: 'ungroup',
            disabled: !isColumnGrouped,
            onItemClick,
            icon: CONTEXT_MENU_UNGROUP_COLUMN_ICON_NAME,
          },
          {
            text: groupingTexts.ungroupAll,
            value: 'ungroupAll',
            onItemClick,
            icon: CONTEXT_MENU_UNGROUP_ALL_COLUMNS_ICON_NAME,
          },
        ];
      }
    }

    return [];
  }

  protected _columnOptionChanged(e?: ColumnsChanges): void {
    if (
      e
      && !this._requireReady
      && !gridCore.checkChanges(e.optionNames, ['width', 'visibleWidth'])
    ) {
      const $toolbarElement = this.element();
      const $groupPanel = $toolbarElement?.find(`.${CLASSES.groupPanel}`);

      if ($groupPanel?.length) {
        this._updateGroupPanelContent($groupPanel);
        this.updateToolbarDimensions();
        this.renderCompleted.fire();
      }
    }
    super._columnOptionChanged();
  }

  private _updateGroupPanelContent($groupPanel: dxElementWrapper): void {
    const groupColumns = this.getColumns();
    const groupPanelOptions: GroupPanel = this.option('groupPanel');

    this._renderGroupPanelItems($groupPanel, groupColumns);

    if (groupPanelOptions.allowColumnDragging && !groupColumns.length) {
      $('<div>')
        .addClass(CLASSES.groupPanelMessage)
        .text(groupPanelOptions.emptyPanelText ?? '')
        .appendTo($groupPanel);

      $groupPanel.closest(`.${CLASSES.groupPanelContainer}`).addClass(CLASSES.groupPanelLabel);
      $groupPanel.closest(`.${CLASSES.groupPanelLabel}`).css('maxWidth', 'none');
    }
  }

  public allowDragging(column: Column): boolean {
    const groupPanelOptions = this.option('groupPanel');

    return allowDragging(groupPanelOptions, column);
  }

  public getColumnElements(): dxElementWrapper | undefined {
    const $element = this.element();
    return $element?.find(`.${CLASSES.groupPanelItem}`);
  }

  public getColumns(): Column[] {
    return this._columnsController.getGroupColumns();
  }

  public getBoundingRect(): BoundingRect | null {
    const $element = this.element();

    if ($element?.find(`.${CLASSES.groupPanel}`).length) {
      const offset = $element.offset();

      return {
        // @ts-expect-error offset() is typed as possibly undefined
        top: offset.top,
        // @ts-expect-error offset() is typed as possibly undefined
        bottom: offset.top + getHeight($element),
      };
    }
    return null;
  }

  public getName(): string {
    return 'group';
  }

  public hasGroupedColumns(): boolean {
    return this._isGroupPanelVisible() && !!this.getColumns().length;
  }

  public optionChanged(args: OptionChanged | OptionChangedFor<Pick<Properties, 'groupPanel'>>): void {
    if (args.name === 'groupPanel') {
      this._invalidate();
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  public getKeyboardNavigationController(): GroupPanelKeyboardNavigationController {
    return this.getController('groupPanelKeyboardNavigation');
  }

  public isColumnReorderingEnabled(column: Column): boolean {
    return this.allowDragging(column);
  }

  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    let items = super.getContextMenuItems(options);
    const $groupedColumnElement = $(options.targetElement).closest(`.${CLASSES.groupPanelItem}`);

    if (!$groupedColumnElement.length) {
      return undefined;
    }

    options.column = this._columnsController.columnOption(`groupIndex:${$groupedColumnElement.index()}`);

    const groupAndUngroupItems = this.getGroupAndUngroupItems(options);

    if (groupAndUngroupItems?.length) {
      items = items ?? [];
      items.push(...groupAndUngroupItems);
    }

    const moveColumnItems = this.getMoveColumnContextMenuItems(options);

    if (moveColumnItems?.length) {
      items = items ?? [];
      items.push(...moveColumnItems);
    }

    return items;
  }
};

export const GroupingRowsViewExtender = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class RowsViewGroupingExtender extends Base {
  protected declare _dataController: DataController & GroupingDataControllerExtension;

  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    const contextMenuEnabled: Grouping['contextMenuEnabled'] = this.option('grouping.contextMenuEnabled');

    if (!contextMenuEnabled || options.row?.rowType !== 'group') {
      return undefined;
    }

    const columnsController = this._columnsController;
    const column = columnsController.columnOption(`groupIndex:${options.row.groupIndex}`);

    if (!column?.allowGrouping) {
      return undefined;
    }

    const groupingTexts: GroupingTexts = this.option('grouping.texts');
    const onItemClick = (e: ItemClickEvent<GridContextMenuItem>): void => {
      if (e.itemData?.value === 'ungroup') {
        columnsController.columnOption(column.dataField, 'groupIndex', -1);
      } else if (e.itemData?.value === 'ungroupAll') {
        columnsController.clearGrouping();
      }
    };

    return [
      {
        text: groupingTexts.ungroup,
        value: 'ungroup',
        onItemClick,
        icon: CONTEXT_MENU_UNGROUP_COLUMN_ICON_NAME,
      },
      {
        text: groupingTexts.ungroupAll,
        value: 'ungroupAll',
        onItemClick,
        icon: CONTEXT_MENU_UNGROUP_ALL_COLUMNS_ICON_NAME,
      },
    ];
  }

  protected _rowClick(e: ViewRowEvent): void {
    const expandMode: Grouping['expandMode'] = this.option('grouping.expandMode');
    const scrollingMode = this.option('scrolling.mode');
    const isGroupRowStateChanged = scrollingMode !== 'infinite'
      && expandMode === 'rowClick'
      && $(e.event.target).closest(`.${VIEW_CLASSES.groupRow}`).length;
    const isExpandButtonClicked = $(e.event.target).closest(`.${DATAGRID_EXPAND_CLASS}`).length;

    if (isGroupRowStateChanged || isExpandButtonClicked) {
      this._changeGroupRowState(e);
    }

    super._rowClick(e);
  }

  private _changeGroupRowState(e: ViewRowEvent): void {
    const row: ProcessedItem & Partial<Pick<GroupItem, 'groupIndex'>> = this._dataController
      .items()[e.rowIndex];
    const allowCollapsing = this._columnsController.columnOption(`groupIndex:${row.groupIndex}`, 'allowCollapsing');

    if (row.rowType === 'data' || (row.rowType === 'group' && allowCollapsing !== false)) {
      this._dataController.changeRowExpand(row.key, true);
      e.event.preventDefault();
      e.handled = true;
    }
  }
};

export const columnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class GroupingHeadersViewExtender extends Base {
  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    const groupItems: GridContextMenuItem[] = [];
    const contextMenuEnabled: Grouping['contextMenuEnabled'] = this.option('grouping.contextMenuEnabled');
    let items = super.getContextMenuItems(options);
    const rowType = options.row?.rowType;

    if (contextMenuEnabled && (rowType === 'header' || rowType === 'detailAdaptive')) {
      const { column, rowIndex } = options;

      if (
        column
        && !column.command
        && (!isDefined(column.allowGrouping) || column.allowGrouping)
      ) {
        const groupingTexts: GroupingTexts = this.option('grouping.texts');
        const isColumnGrouped = isDefined(column.groupIndex) && column.groupIndex > -1;
        const onItemClick = (e: ItemClickEvent<GridContextMenuItem>): void => {
          onGroupingMenuItemClick(this.getKeyboardNavigationController(), column, rowIndex, e);
        };

        groupItems.push({
          text: groupingTexts.groupByThisColumn,
          value: 'group',
          beginGroup: true,
          disabled: isColumnGrouped,
          onItemClick,
          icon: CONTEXT_MENU_GROUP_BY_COLUMN_ICON_NAME,
        });

        if (column.showWhenGrouped) {
          groupItems.push({
            text: groupingTexts.ungroup,
            value: 'ungroup',
            disabled: !isColumnGrouped,
            onItemClick,
            icon: CONTEXT_MENU_UNGROUP_COLUMN_ICON_NAME,
          });
        }

        groupItems.push({
          text: groupingTexts.ungroupAll,
          value: 'ungroupAll',
          onItemClick,
          icon: CONTEXT_MENU_UNGROUP_ALL_COLUMNS_ICON_NAME,
        });
      }
    }

    if (groupItems.length) {
      items = items ?? [];

      const clearSortingItemIndex = items.findIndex((item) => item.name === 'clearSorting') + 1;

      items.splice(clearSortingItemIndex, 0, ...groupItems);
    }

    return items;
  }

  public allowDragging(column: Column): boolean | undefined {
    const groupPanelOptions = this.option('groupPanel');

    return allowDragging(groupPanelOptions, column) || super.allowDragging(column);
  }
};
