interface DataPoint {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function generateDataSource(): DataPoint[] {
  const b1 = random(-100, 100) / 10;
  const b2 = random(-100, 100) / 10;
  let k1 = random(-100, 100) / 10;
  let k2 = random(-100, 100) / 10;
  const ds: DataPoint[] = [];

  let i: number;
  let x1: number;
  let x2: number;
  let y1: number;
  let y2: number;
  let isNegativeDelta: boolean;
  let delta1: number;
  let delta2: number;

  if (k1 < 0.1 && k1 >= 0) { k1 = 0.1; }
  if (k1 > -0.1 && k1 < 0) { k1 = -0.1; }
  if (k2 < 0.1 && k2 >= 0) { k2 = 0.1; }
  if (k2 > -0.1 && k2 < 0) { k2 = -0.1; }

  const deviation1 = Math.abs(k1 * 8);
  const deviation2 = Math.abs(k2 * 8);
  for (i = 0; i < 30; i += 1) {
    x1 = random(1, 20);
    x2 = random(1, 20);

    isNegativeDelta = random(0, 1) === 0;
    delta1 = deviation1 * Math.random();
    delta2 = deviation2 * Math.random();
    if (isNegativeDelta) {
      delta1 = -delta1;
      delta2 = -delta2;
    }
    y1 = k1 * x1 + b1 + delta1;
    y2 = k2 * x2 + b2 + delta2;

    ds.push({
      x1, y1, x2, y2,
    });
  }
  return ds;
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
