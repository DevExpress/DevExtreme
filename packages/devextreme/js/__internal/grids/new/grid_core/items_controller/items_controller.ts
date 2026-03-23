import { equalByValue } from '@js/core/utils/common';
import formatHelper from '@js/format_helper';
import { computed, signal } from '@ts/core/state_manager/index';
import { ColumnsController } from '@ts/grids/new/grid_core/columns_controller/columns_controller';
import { DataController } from '@ts/grids/new/grid_core/data_controller/data_controller';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import type {
  CardInfo, Column, FieldInfo, VisibleColumn,
} from '../columns_controller/types';
import type { DataObject, Key } from '../data_controller/types';

// NOTE: Column properties that do NOT affect card rendering.
// Changes to these properties trigger data reload via dataController.items,
// so subscribing to them in visibleColumns causes extra re-renders (T1306983, T1309423).
const NON_LAYOUT_COLUMN_KEYS: ReadonlySet<string> = new Set([
  'sortOrder',
  'sortIndex',
  'filterValues',
  'filterType',
]);

const getColumnLayoutKey = (column: VisibleColumn): string => {
  const entries = Object.entries(column)
    .filter(([key]) => !NON_LAYOUT_COLUMN_KEYS.has(key));

  return JSON.stringify(entries);
};

export class ItemsController {
  private readonly selectedCardKeys = signal<Key[]>([]);

  public static dependencies = [
    DataController,
    ColumnsController,
    SearchController,
  ] as const;

  public readonly additionalItems = signal<CardInfo[]>([]);

  // NOTE: Tracks column properties that affect card rendering.
  // Sort/filter properties are excluded — data changes from sort/filter arrive
  // separately via dataController.items, so subscribing to them causes extra re-renders.
  private readonly visibleColumnsLayout = computed(
    () => this.columnsController.visibleColumns.value
      .map(getColumnLayoutKey)
      .join(';'),
  );

  public readonly items = computed(
    () => {
      // NOTE: We should trigger computed by search options change,
      // But all work with these options encapsulated in SearchHighlightTextProcessor
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.searchController.highlightTextOptions.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.visibleColumnsLayout.value;

      return this.dataController.items.value.map(
        (item, itemIndex) => this.createCardInfo(
          item,
          this.columnsController.visibleColumns.peek(),
          itemIndex,
          this.selectedCardKeys.value,
        ),
      ).concat(
        this.additionalItems.value,
      );
    },
  );

  constructor(
    protected readonly dataController: DataController,
    protected readonly columnsController: ColumnsController,
    private readonly searchController: SearchController,
  ) {}

  public setSelectionState(keys: Key[]): void {
    this.selectedCardKeys.value = keys;
  }

  public findItemByKey(items: CardInfo[], key: Key): CardInfo | null {
    return items.find((item) => equalByValue(item.key, key)) ?? null;
  }

  public createCardInfo(
    data: DataObject,
    columns: Column[],
    itemIndex: number,
    selectedCardKeys?: Key[],
    key?: Key,
    visible = true,
  ): CardInfo {
    const itemKey = key ?? this.dataController.getDataKey(data);

    const fields = columns.map((column, index): FieldInfo => {
      const value = column.calculateFieldValue(data);
      const displayValue = column.calculateDisplayValue(data);

      const formattedText = formatHelper.format(
        displayValue as never,
        column.format,
      );
      const text = column.customizeText
        ? column.customizeText({ value: displayValue, valueText: formattedText })
        : formattedText;
      const highlightedText = this.searchController
        .getHighlightedText(text);

      return {
        card: {} as CardInfo, // sets later
        index,
        column,
        value,
        displayValue,
        text,
        highlightedText,
      };
    });

    const card: CardInfo = {
      fields,
      columns,
      values: fields.map((f) => f.value),
      key: itemKey,
      index: itemIndex,
      isSelected: !!selectedCardKeys?.includes(itemKey),
      data,
      visible,
    };

    card.fields.forEach((f) => {
      f.card = card;
    });

    return card;
  }

  // TODO: remove this method, it is duplicated
  public getCardByKey(key: Key): CardInfo | undefined {
    const items = this.items.peek();

    return items.find((item) => equalByValue(item.key, key));
  }
}
