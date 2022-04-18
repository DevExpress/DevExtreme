export function generateData(count: number): Record<string, unknown>[] {
  return Array.from(Array(count).keys()).map((i) => ({
    id: i,
  }));
}

export function generateRows(count: number): any[] {
  return Array.from(Array(count).keys()).map((i) => ({
    key: i,
    data: { id: i },
    rowType: 'data',
  }));
}

export const columns = ['id'];
