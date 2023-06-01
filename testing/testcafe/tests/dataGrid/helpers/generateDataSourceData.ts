export const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${j}`] = `val_${i}_${j}`;
    }
    items.push(item);
  }

  return items;
};

export const getNumberData = (rowCount: number, colCount: number): Record<string, number>[] => {
  const items: Record<string, number>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, number> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${j}`] = i + j;
    }
    items.push(item);
  }

  return items;
};
