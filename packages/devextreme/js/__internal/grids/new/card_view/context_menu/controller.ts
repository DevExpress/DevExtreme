/* eslint-disable spellcheck/spell-checker */
import type { Item as ContextMenuItem, ItemClickEvent } from '@js/ui/context_menu';

import { ColumnsController } from '../../grid_core/columns_controller/index';
import type { Column, DataRow } from '../../grid_core/columns_controller/types';
import { BaseContextMenuController } from '../../grid_core/context_menu/controller';
import { OptionsController } from '../options_controller';
import type { ContextMenuPreparingEvent, ContextMenuTarget } from '.';

export interface ContextInfo {
  column?: Column;
  columnIndex?: number;
  card?: DataRow;
  cardIndex?: number;
}

export class ContextMenuController
  extends BaseContextMenuController<ContextMenuTarget, ContextInfo> {
  public static dependencies = [ColumnsController, OptionsController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
  ) {
    super();
  }

  public override show(
    event: MouseEvent,
    view: ContextMenuTarget,
    contextInfo: ContextInfo = {},
  ): void {
    super.show(event, view, contextInfo);
  }

  protected override getItems(
    view: ContextMenuTarget,
    targetElement: Element,
    contextInfo: ContextInfo = {},
  ): ContextMenuItem[] | undefined {
    const items: ContextMenuItem[] = [];

    if (view === 'headerPanel' && contextInfo.column) {
      items.push(...this.getSortingItems(contextInfo.column));
    }

    // @ts-expect-error
    const event: ContextMenuPreparingEvent<DataRow> = {
      items: Array.isArray(items) ? items : undefined,
      target: view,
      targetElement: targetElement as HTMLElement,
      columnIndex: undefined,
      card: undefined,
      cardIndex: undefined,
      column: undefined,

      ...contextInfo,
    };

    const callback = this.options.action('onContextMenuPreparing').unreactive_get();

    callback(event);

    return event.items;
  }

  private getSortingItems(column: Column): ContextMenuItem[] {
    const onItemClick = (e: ItemClickEvent): void => {
      this.columnsController.columnOption(column, 'sortOrder', e.itemData?.value);
    };

    return [
      {
        text: this.options.oneWay('sorting.ascendingText').unreactive_get(),
        value: 'asc',
        disabled: column.sortOrder === 'asc',
        icon: 'sortuptext',
        onItemClick,
      },
      {
        text: this.options.oneWay('sorting.descendingText').unreactive_get(),
        value: 'desc',
        disabled: column.sortOrder === 'desc',
        icon: 'sortdowntext',
        onItemClick,
      },
      {
        text: this.options.oneWay('sorting.clearText').unreactive_get(),
        value: undefined,
        disabled: !column.sortOrder,
        icon: 'none',
        onItemClick,
      },
    ] as ContextMenuItem[];
  }
}
