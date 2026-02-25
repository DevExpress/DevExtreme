import type { SingleMultipleOrNone } from '@js/common';
import messageLocalization from '@js/localization/message';
import type { Item as ContextMenuItem, ItemClickEvent as ContextMenuItemPressedEvent } from '@js/ui/context_menu';

import { ColumnsController } from '../../grid_core/columns_controller/index';
import type { CardInfo, Column } from '../../grid_core/columns_controller/types';
import { BaseContextMenuController } from '../../grid_core/context_menu/controller';
import { SortingController } from '../../grid_core/sorting_controller/index';
import { OptionsController } from '../options_controller';
import type { ContextMenuPreparingEvent, ContextMenuTarget } from '.';

export interface ContextInfo {
  column?: Column;
  columnIndex?: number;
  card?: CardInfo;
  cardIndex?: number;
}

export interface CardViewContextMenuItem extends ContextMenuItem {
  value?: string;
  onItemClick: (event: ContextMenuItemPressedEvent) => void;
}

export class ContextMenuController
  extends BaseContextMenuController<ContextMenuTarget, ContextInfo> {
  public static dependencies = [
    ColumnsController,
    OptionsController,
    SortingController,
  ] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly options: OptionsController,
    private readonly sortingController: SortingController,
  ) {
    super();
  }

  public override show(
    event: KeyboardEvent | MouseEvent,
    view: ContextMenuTarget,
    contextInfo: ContextInfo = {},
    onMenuCloseCallback?: () => void,
  ): void {
    super.show(event, view, contextInfo, onMenuCloseCallback);
  }

  public override getItems(
    view: ContextMenuTarget,
    targetElement: Element,
    contextInfo: ContextInfo = {},
  ): ContextMenuItem[] | undefined {
    const items: ContextMenuItem[] = [];

    if (view === 'headerPanel' && contextInfo.column) {
      items.push(...this.getSortingItems(contextInfo.column));
    }

    // @ts-expect-error
    const event: ContextMenuPreparingEvent<CardInfo> = {
      items: items.length > 0 ? items : undefined,
      target: view,
      targetElement: targetElement as HTMLElement,
      columnIndex: undefined,
      card: undefined,
      cardIndex: undefined,
      column: undefined,

      ...contextInfo,
    };

    const callback = this.options.action('onContextMenuPreparing').peek();

    callback(event);

    return event.items;
  }

  private getSortingItems(column: Column): CardViewContextMenuItem[] {
    const mode = this.sortingController.mode.value;
    const isDisabled = mode === 'none' || !column.allowSorting;
    const onItemClick = (event: ContextMenuItemPressedEvent): void => {
      this.handleSortMenuClick(event, mode, column);
    };

    return [
      {
        text: this.options.oneWay('sorting.ascendingText').peek() ?? messageLocalization.format('dxDataGrid-sortingAscendingText'),
        value: 'asc',
        disabled: isDisabled || column.sortOrder === 'asc',
        icon: 'sortuptext',
        onItemClick,
      },
      {
        text: this.options.oneWay('sorting.descendingText').peek() ?? messageLocalization.format('dxDataGrid-sortingDescendingText'),
        value: 'desc',
        disabled: isDisabled || column.sortOrder === 'desc',
        icon: 'sortdowntext',
        onItemClick,
      },
      {
        text: this.options.oneWay('sorting.clearText').peek() ?? messageLocalization.format('dxDataGrid-sortingClearText'),
        value: undefined,
        disabled: isDisabled || !column.sortOrder,
        icon: 'none',
        onItemClick,
      },
    ];
  }

  private handleSortMenuClick(
    e: ContextMenuItemPressedEvent,
    mode: SingleMultipleOrNone | undefined,
    column: Column,
  ): void {
    const sortOrder = e.itemData?.value;
    switch (mode) {
      case 'single':
        this.sortingController.onSingleModeSortCore(column, true, sortOrder);
        break;
      case 'multiple':
        this.sortingController.onMultipleModeSortCore(column, false, sortOrder);
        break;
      default:
        break;
    }
  }
}
