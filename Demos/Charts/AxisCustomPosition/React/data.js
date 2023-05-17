export function generateDataSource() {
  let x1; let x2; let y1; let y2; let
    i;
  const ds = [];
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

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const customPositionLabel = { 'aria-label': 'Custom Position' };
export const offsetLabel = { 'aria-label': 'Offset' };
