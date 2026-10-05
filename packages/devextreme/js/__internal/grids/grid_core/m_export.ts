interface ExportItem {
  colspan?: number;
  rowspan?: number;
}

type PreparedItem<T extends ExportItem> = T & {
  colspan: number;
  rowspan: number;
};

function prepareItems<T extends ExportItem>(
  items: T[][],
  emptyCell?: Partial<T> & { colspan: number; rowspan: number },
): PreparedItem<T>[][] {
  const defaultSetter = (value: number | undefined): number => (!value ? 1 : value);
  const cloneItem = (item: PreparedItem<T>): PreparedItem<T> => (
    { ...item, ...emptyCell }
  );

  const resultItems: PreparedItem<T>[][] = [];

  const cols = (items[0] ?? []).reduce((sum, item) => sum + defaultSetter(item.colspan), 0);

  const getItem = ((rows: T[][]) => {
    let rowIndex = 0;
    let cellIndex = 0;

    return (): PreparedItem<T> | undefined => {
      const row = rows[rowIndex] ?? [];
      const item = row[cellIndex] as T | undefined;
      cellIndex += 1;
      if (cellIndex >= row.length) {
        rowIndex += 1;
        cellIndex = 0;
      }
      if (item) {
        item.colspan = defaultSetter(item.colspan);
        item.rowspan = defaultSetter(item.rowspan);
      }

      return item as PreparedItem<T> | undefined;
    };
  })(items);

  const addItem = (rowIndex: number, cellIndex: number, item: PreparedItem<T>): void => {
    resultItems[rowIndex] = resultItems[rowIndex] ?? [];
    const row = resultItems[rowIndex];
    row[cellIndex] = item;
    if (item.colspan > 1 || item.rowspan > 1) {
      const clone = cloneItem(item);
      for (let c = 1; c < item.colspan; c += 1) {
        addItem(rowIndex, cellIndex + c, clone);
      }
      for (let r = 1; r < item.rowspan; r += 1) {
        for (let c = 0; c < item.colspan; c += 1) {
          addItem(rowIndex + r, cellIndex + c, clone);
        }
      }
    }
  };

  let item = getItem();
  let rowIndex = 0;

  while (item) {
    for (let cellIndex = 0; cellIndex < cols; cellIndex += 1) {
      if (!item) {
        break;
      }
      if (!resultItems[rowIndex]?.[cellIndex]) {
        addItem(rowIndex, cellIndex, item);

        cellIndex += item.colspan - 1;

        item = getItem();
      }
    }
    rowIndex += 1;
  }

  return resultItems;
}

export { prepareItems };
