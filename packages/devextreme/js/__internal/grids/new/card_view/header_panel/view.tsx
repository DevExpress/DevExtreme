/* eslint-disable spellcheck/spell-checker */
import { computed, type ReadonlySignal } from '@ts/core/state_manager/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { KeyboardNavigationController, NavigationStrategyHorizontalList } from '@ts/grids/new/grid_core/keyboard_navigation/index';

import { ColumnChooserController, ColumnChooserView } from '../../grid_core/column_chooser/index';
import type { Column } from '../../grid_core/columns_controller/types';
import { FilterController } from '../../grid_core/filtering/filter_controller';
import { HeaderFilterViewController } from '../../grid_core/filtering/header_filter/view_controller';
import { SortingController } from '../../grid_core/sorting_controller/index';
import { ContextMenuController } from '../context_menu/index';
import { OptionsController } from '../options_controller';
import type { Props as ColumnSortableProps } from './column_sortable';
import { HeaderPanelController } from './controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [
    HeaderPanelController,
    ContextMenuController,
    SortingController,
    ColumnsController,
    OptionsController,
    HeaderFilterViewController,
    KeyboardNavigationController,
    ColumnChooserController,
    FilterController,
    ColumnChooserView,
  ] as const;

  private readonly navigationStrategy = new NavigationStrategyHorizontalList();

  private readonly showDropzone: ReadonlySignal<boolean>;

  constructor(
    private readonly headerPanelController: HeaderPanelController,
    private readonly contextMenuController: ContextMenuController,
    private readonly sortingController: SortingController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly headerFilterViewController: HeaderFilterViewController,
    private readonly keyboardNavigationController: KeyboardNavigationController,
    private readonly columnChooserController: ColumnChooserController,
    private readonly filterController: FilterController,
    private readonly columnChooserView: ColumnChooserView,
  ) {
    super();

    this.showDropzone = computed((): boolean => {
      const allowReordering = this.columnsController.allowColumnReordering.value;
      const column = this.columnChooserController.draggingItem.value?.column;

      if (!column) {
        return false;
      }

      const allColumnsHidden = this.columnsController.visibleColumns.value.length === 0;
      const canReorder = allowReordering && column.allowReordering;

      return !canReorder || allColumnsHidden;
    });
  }

  protected override getProps(): ReadonlySignal<HeaderPanelProps> {
    return computed(() => ({
      visibleColumns: this.columnsController.visibleColumns.value,
      kbnEnabled: this.keyboardNavigationController.enabled.value,
      navigationStrategy: this.navigationStrategy,
      showSortIndexes: this.sortingController.showSortIndexes.value,
      onColumnSort: this.onColumnSort.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate').value as any,
      onHeaderFilterOpen: this.onHeaderFilterOpen.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass').value,
      visible: this.options.oneWay('headerPanel.visible').value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging').value as any,
      sortableConfig: {
        onColumnMove: this.headerPanelController.onColumnMove,
        showDropzone: this.showDropzone.value,
        isColumnDraggable: this.headerPanelController.isColumnDraggable,
        onPlaceholderPrepared: this.headerPanelController.onPlaceholderPrepared,
      } as Partial<ColumnSortableProps>,
      showContextMenu: this.showContextMenu.bind(this),
      openColumnChooser: (): void => { this.columnChooserView.show(); },
      filterSyncValue: this.filterController.filterSyncValue.value,
    }));
  }

  public onColumnSort(column: Column, event: KeyboardEvent | MouseEvent): void {
    const mode = this.sortingController.mode.peek();
    switch (mode) {
      case 'none':
        return;
      case 'single':
        this.sortingController.onSingleModeSortClick(column, event);
        return;
      case 'multiple':
        this.sortingController.onMultipleModeSortClick(column, event);
        return;
      default:
        throw new Error('Unsupported sorting state');
    }
  }

  private onHeaderFilterOpen(
    element: Element | null,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    if (!element) {
      return;
    }

    this.headerFilterViewController.openPopup(element, column, onFilterCloseCallback);
  }

  private showContextMenu(
    event: KeyboardEvent | MouseEvent,
    column?: Column,
    columnIndex?: number,
    onMenuCloseCallback?: () => void,
  ): void {
    this.contextMenuController.show(
      event,
      'headerPanel',
      { column, columnIndex },
      onMenuCloseCallback,
    );
  }
}
