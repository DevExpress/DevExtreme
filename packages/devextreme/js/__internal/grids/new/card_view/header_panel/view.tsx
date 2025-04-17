/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { KeyboardNavigationController, NavigationStrategyHorizontalList } from '@ts/grids/new/grid_core/keyboard_navigation/index';

import type { Column } from '../../grid_core/columns_controller/types';
import { HeaderFilterViewController } from '../../grid_core/filtering/header_filter/view_controller';
import { SortingController } from '../../grid_core/sorting_controller/sorting_controller';
import { ContextMenuController } from '../context_menu/index';
import { OptionsController } from '../options_controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [
    ContextMenuController,
    SortingController,
    ColumnsController,
    OptionsController,
    HeaderFilterViewController,
    KeyboardNavigationController,
  ] as const;

  private readonly navigationStrategy = new NavigationStrategyHorizontalList();

  constructor(
    private readonly contextMenuController: ContextMenuController,
    private readonly sortingController: SortingController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly headerFilterViewController: HeaderFilterViewController,
    private readonly keyboardNavigationController: KeyboardNavigationController,
  ) {
    super();
  }

  protected override getProps(): SubsGets<HeaderPanelProps> {
    return combined({
      columns: computed(
        (columns) => [...columns].sort((a, b) => a.visibleIndex - b.visibleIndex),
        [this.columnsController.columns],
      ),
      navigationEnabled: this.keyboardNavigationController.enabled,
      navigationStrategy: this.navigationStrategy,
      onMove: this.onMove.bind(this),
      onRemove: this.onRemove.bind(this),
      allowColumnReordering: this.columnsController.allowColumnReordering,
      showSortIndexes: this.sortingController.showSortIndexes,
      onColumnSort: this.onColumnSort.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate') as any,
      onHeaderFilterOpen: this.onHeaderFilterOpen.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging') as any,
      showContextMenu: this.showContextMenu.bind(this),
      onKeyDown: this.keyboardNavigationController
        .onKeyDown.bind(this.keyboardNavigationController),
    });
  }

  public onRemove(column: Column): void {
    this.columnsController.columnOption(column, 'visible', false);
  }

  public onMove(column: Column, toIndex: number): void {
    this.columnsController.columnOption(column, 'visible', true);
    this.columnsController.columnOption(column, 'visibleIndex', toIndex);
  }

  public onColumnSort(column: Column, event: KeyboardEvent | MouseEvent): void {
    const mode = this.sortingController.mode.unreactive_get();
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
