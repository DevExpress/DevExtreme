/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { View } from '@ts/grids/new/grid_core/core/view';

import type { Column } from '../../grid_core/columns_controller/types';
import { OptionsController } from '../options_controller';
import type { HeaderPanelProps } from './header_panel';
import { HeaderPanel } from './header_panel';

export class HeaderPanelView extends View<HeaderPanelProps> {
  // @ts-expect-error
  protected component = HeaderPanel;

  public static dependencies = [ColumnsController, OptionsController] as const;

  constructor(
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
      showSortIndexes: computed(
        (columns) => columns
          .filter(
            (column) => column.sortOrder !== undefined,
          )
          .length > 1,
        [this.columnsController.columns],
      ),
      onSortClick: this.onSortClick.bind(this),
      itemTemplate: this.options.template('headerPanel.itemTemplate'),
      itemCssClass: this.options.oneWay('headerPanel.itemCssClass'),
      visible: this.options.oneWay('headerPanel.visible'),
      draggingOptions: this.options.oneWay('headerPanel.dragging'),
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
}
