/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { HeaderFilterController } from '@ts/grids/new/grid_core/filtering/header_filter/index';

import type { Column } from '../../grid_core/columns_controller/types';
import { getColumnIndexByName } from '../../grid_core/columns_controller/utils';
import { DataController } from '../../grid_core/data_controller';
import { FilterController } from '../../grid_core/filtering';
import type { PopupState } from '../../grid_core/filtering/header_filter/controller';
import { getDataSourceOptions, getFilterType } from '../../grid_core/filtering/header_filter/legacy_header_filter';
import { SortingController } from '../../grid_core/sorting_controller/sorting_controller';
import { ContextMenuController } from '../context_menu/controller';
import { OptionsController } from '../options_controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [
    DataController,
    FilterController,
    SortingController,
    ColumnsController,
    OptionsController,
    HeaderFilterController,
    ContextMenuController,
  ] as const;

  private readonly popupState = state<PopupState>(null);

  public readonly popupState$: SubsGets<PopupState> = this.popupState;

  constructor(
    private readonly dataController: DataController,
    private readonly filterController: FilterController,
    private readonly sortingController: SortingController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly contextMenuController: ContextMenuController,
  ) {
    super();
  }

  protected override getProps(): SubsGets<HeaderPanelProps> {
    return combined({
      columns: computed(
        (columns) => [...columns].sort((a, b) => a.visibleIndex - b.visibleIndex),
        [this.columnsController.columns],
      ),
      onMove: this.onMove.bind(this),
      onRemove: this.onRemove.bind(this),
      allowColumnReordering: this.columnsController.allowColumnReordering,
      showSortIndexes: this.sortingController.showSortIndexes,
      onSortClick: this.onSortClick.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate') as any,
      onFilterClick: this.onFilterClick.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging') as any,
      showContextMenu: this.showContextMenu.bind(this),
    });
  }

  public onRemove(column: Column): void {
    this.columnsController.columnOption(column, 'visible', false);
  }

  public onMove(column: Column, toIndex: number): void {
    this.columnsController.columnOption(column, 'visible', true);
    this.columnsController.columnOption(column, 'visibleIndex', toIndex);
  }

  public onSortClick(column: Column, e: MouseEvent): void {
    const mode = this.sortingController.mode.unreactive_get();
    switch (mode) {
      case 'none':
        return;
      case 'single':
        this.sortingController.onSingleModeSortClick(column, e);
        return;
      case 'multiple':
        this.sortingController.onMultipleModeSortClick(column, e);
        return;
      default:
        throw new Error('Unsupported sorting state');
    }
  }

  private onFilterClick(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    this.openPopup(element, column, onFilterCloseCallback);
  }

  public openPopup(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    const rootDataSource = this.dataController.dataSource.unreactive_get();
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').unreactive_get();
    const displayFilter = this.filterController.displayFilter.unreactive_get();

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.filterType,
        filterValues: column.headerFilter?.values,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },
      displayFilter,
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupState.update({
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.headerFilter?.values)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? [...column.headerFilter!.values]
          : column.headerFilter?.values,
        apply() {
          // NOTE: Copy array because of mutations in legacy code
          const values = Array.isArray(this.filterValues)
            ? [...this.filterValues]
            : this.filterValues;
          const { filterType } = this;
          colsController.updateColumns(
            (columns) => {
              const index = getColumnIndexByName(columns, column.name);
              const newColumns = [...columns];

              newColumns[index] = {
                ...newColumns[index],
                headerFilter: {
                  ...newColumns[index].headerFilter,
                  values,
                },
                filterType,
              };
              return newColumns;
            },
          );

          onFilterCloseCallback?.();
        },
        hidePopupCallback: () => {
          this.popupState.update(null);
          onFilterCloseCallback?.();
        },
      },
    });
  }

  private showContextMenu(e: MouseEvent, column?: Column, columnIndex?: number): void {
    this.contextMenuController.show(e, 'headerPanel', { column, columnIndex });
  }
}
