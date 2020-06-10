function generateDataSource() {
  let x1, x2, y1, y2, i;
  const ds = [];
  for (i = 0; i < 20; i++) {
    x1 = random(5, 15);
    y1 = random(5, 15);

    ds.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
  }
  for (i = 0; i < 20; i++) {
    x2 = random(5, 15);
    y2 = random(-15, -5);

    ds.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
  }
  for (i = 0; i < 20; i++) {
    x2 = random(-15, -5);
    y2 = random(5, 15);

    ds.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
  }
  for (i = 0; i < 20; i++) {
    x1 = random(-15, -5);
    y1 = random(-15, -5);

    ds.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
  }
  return ds;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
