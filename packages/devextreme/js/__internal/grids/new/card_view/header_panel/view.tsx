import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import type { Column } from '../../grid_core/columns_controller/types';
import { SortingController } from '../../grid_core/sorting_controller/sorting_controller';
import { OptionsController } from '../options_controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [SortingController, ColumnsController, OptionsController] as const;

  constructor(
    private readonly sortingController: SortingController,
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
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
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging') as any,
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
}
