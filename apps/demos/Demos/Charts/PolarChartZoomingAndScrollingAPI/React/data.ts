function generateData(start: number, end: number, step: number) {
  const data: ({ value: number; originalValue: number; argument: number; })[] = [];
  for (let i = start; i < end; i += step) {
    const originalValue = Math.log(i);
    data.push({
      value: originalValue - ((Math.sin(Math.random() * i) * i) / end) + (1 - Math.random() * 2),
      originalValue,
      argument: i,
    });
  }
  return data;
}

export const dataSource = generateData(0, 360, 0.75);
