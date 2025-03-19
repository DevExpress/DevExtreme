import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';
import { HeaderFilterController } from '@ts/grids/new/grid_core/filtering/header_filter';

import type { Column } from '../../grid_core/columns_controller/types';
import { OptionsController } from '../options_controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  protected component = HeaderPanel;

  public static dependencies = [
    ColumnsController,
    OptionsController,
    HeaderFilterController,
  ] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly headerFilterController: HeaderFilterController,
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
      showSortIndexes: computed(
        (columns) => columns
          .filter(
            (column) => column.sortOrder !== undefined,
          )
          .length > 1,
        [this.columnsController.columns],
      ),
      onSortClick: this.onSortClick.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemTemplate: this.options.template('headerPanel.itemTemplate') as any,
      onFilterClick: this.onFilterClick.bind(this),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draggingOptions: this.options.oneWay('headerPanel.dragging') as any,
    });
  }

  public onRemove(column: Column): void {
    this.columnsController.columnOption(column, 'visible', !column.visible);
  }

  public onMove(column: Column, toIndex: number): void {
    this.columnsController.columnOption(column, 'visible', true);
    this.columnsController.columnOption(column, 'visibleIndex', toIndex);
  }

  public onSortClick(column: Column): void {
    this.columnsController.columnOption(column, 'sortOrder', 'asc');
    this.columnsController.columnOption(column, 'sortIndex', 0);
  }

  private onFilterClick(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ): void {
    this.headerFilterController.openPopup(element, column, onFilterCloseCallback);
  }
}
