/* eslint-disable spellcheck/spell-checker */
import type {
  Column as PublicColumn, ContextMenuPreparingEvent, ContextMenuTarget, DataRow,
} from '@js/ui/card_view';
import type { Item as ContextMenuItem, ItemClickEvent, PositioningEvent } from '@js/ui/context_menu';

import { ColumnsController } from '../../grid_core/columns_controller';
import type { Column } from '../../grid_core/columns_controller/types';
import { BaseContextMenuView } from '../../grid_core/context_menu/view';
import { ItemsController } from '../../grid_core/items_controller/items_controller';
import { ToolbarView } from '../../grid_core/toolbar/view';
import { CLASSES as cardClasses } from '../content_view/content/card/card';
import { ContentView } from '../content_view/view';
import { CLASSES as headerItemClasses } from '../header_panel/item';
import { HeaderPanelView } from '../header_panel/view';
import { OptionsController } from '../options_controller';

export class ContextMenuView extends BaseContextMenuView {
  public static dependencies = [
    ToolbarView,
    HeaderPanelView,
    ContentView,
    ColumnsController,
    ItemsController,
    OptionsController,
  ] as const;

  constructor(
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
    private readonly contentView: ContentView,
    private readonly columnsController: ColumnsController,
    private readonly itemsController: ItemsController,
    private readonly options: OptionsController,
  ) {
    super();
  }

  protected override getItems(e: PositioningEvent): ContextMenuItem[] | undefined {
    const eventTarget = e.event?.target;

    if (!eventTarget) {
      return undefined;
    }

    const targetView = this.getTargetView(eventTarget);

    if (!targetView) {
      return undefined;
    }

    const [column, columnIndex] = this.getColumnInfo(eventTarget, targetView) ?? [];
    const [card, cardIndex] = this.getCardInfo(eventTarget, targetView) ?? [];

    const items: ContextMenuItem[] = [];

    if (targetView === 'headerPanel' && column) {
      items.push(...this.getSortingItems(column));
    }

    // @ts-expect-error
    const event: ContextMenuPreparingEvent = {
      items: items.length ? items : undefined,
      target: targetView,
      targetElement: eventTarget as HTMLElement,
      column: column as PublicColumn,
      columnIndex,
      card,
      cardIndex,
    };

    const callback = this.options.action('onContextMenuPreparing').unreactive_get();

    callback(event);

    return event.items;
  }

  private getTargetView(eventTarget: Element): ContextMenuTarget | undefined {
    const viewsMap = [
      ['toolbar', this.toolbar.containerRef.current],
      ['headerPanel', this.headerPanel.containerRef.current],
      ['content', this.contentView.containerRef.current],
    ] as [ContextMenuTarget, HTMLDivElement][];

    const result = viewsMap.find(([, container]) => container.contains(eventTarget)) ?? [];

    return result[0];
  }

  private getColumnInfo(
    eventTarget: Element,
    targetView: ContextMenuTarget,
  ): [Column, number] | undefined {
    if (targetView === 'headerPanel') {
      const columnElement = eventTarget.closest(`.${headerItemClasses.item}`);

      if (!columnElement) {
        return undefined;
      }

      const siblings = columnElement.parentNode?.children ?? [];
      const columnIndex = Array.from(siblings).indexOf(columnElement);

      const column = this.columnsController.columns.unreactive_get()[columnIndex];

      return [column, columnIndex];
    }

    return undefined;
  }

  private getCardInfo(
    eventTarget: Element,
    targetView: ContextMenuTarget,
  ): [DataRow, number] | undefined {
    if (targetView !== 'content') {
      return undefined;
    }

    const cardElement = eventTarget.closest(`.${cardClasses.card}`);

    if (!cardElement) {
      return undefined;
    }

    const siblings = cardElement.parentNode?.children ?? [];
    const cardIndex = Array.from(siblings).indexOf(cardElement);

    const card = this.itemsController.items.unreactive_get()[cardIndex];

    return [card, cardIndex];
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
