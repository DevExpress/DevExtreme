export function generateDataSource() {
  let x1 = 0; let x2 = 0; let y1 = 0; let y2 = 0; let
    i: number;
  const ds: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (i = 0; i < 20; i += 1) {
    x1 = random(5, 15);
    y1 = random(5, 15);

    ds.push({
      x1, y1, x2, y2,
    });
  }
  for (i = 0; i < 20; i += 1) {
    x2 = random(5, 15);
    y2 = random(-15, -5);

    ds.push({
      x1, y1, x2, y2,
    });
  }
  for (i = 0; i < 20; i += 1) {
    x2 = random(-15, -5);
    y2 = random(5, 15);

    ds.push({
      x1, y1, x2, y2,
    });
  }
  for (i = 0; i < 20; i += 1) {
    x1 = random(-15, -5);
    y1 = random(-15, -5);

    ds.push({
      x1, y1, x2, y2,
    });
  }
  return ds;
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
