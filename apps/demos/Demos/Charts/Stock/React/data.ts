export interface StockPrice {
  date: Date;
  l: number;
  h: number;
  o: number;
  c: number;
}

function randomOffset(amplitude: number): number {
  return (Math.random() - 0.5) * amplitude;
}

function generateStockData(startDate: Date, days: number): StockPrice[] {
  const data: StockPrice[] = [];
  const current = new Date(startDate);
  let price = 25;

  while (data.length < days) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      const open = price + randomOffset(1.5);
      const close = open + randomOffset(1.5);
      const high = Math.max(open, close) + Math.random() * 0.8;
      const low = Math.min(open, close) - Math.random() * 0.8;

      data.push({
        date: new Date(current),
        o: +open.toFixed(2),
        h: +high.toFixed(2),
        l: +low.toFixed(2),
        c: +close.toFixed(2),
      });

      price = close;
    }
    current.setDate(current.getDate() + 1);
  }
  return data;
}

export const dataSource = generateStockData(new Date(1994, 3, 1), 65);
