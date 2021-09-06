const generateData = function (rowCount, columnCount) {
  let i; let
    j;
  const items = [];

  for (i = 0; i < rowCount; i++) {
    const item = {};
    for (j = 0; j < columnCount; j++) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }
    items.push(item);
  }
  return items;
};
