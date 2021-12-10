export function generateData(count: number): Record<string, unknown>[] {
  return Array.from(Array(count).keys()).map((i) => ({
    id: i,
  }));
}

export const columns = ['id'];
