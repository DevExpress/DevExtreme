function generateData(start, end, step) {
  const data = [];
  for (let i = start; i < end; i += step) {
    const originalValue = Math.sin(i) / i;
    data.push({ value: originalValue + ((0.5 - Math.random()) / 10), originalValue: originalValue, argument: i });
  }
  return data;
}

export const dataSource = generateData(2.5, 12, 0.1);
