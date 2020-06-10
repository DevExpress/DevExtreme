export const generateData = function(rowCount, columnCount) {
  var i, j;
  var items = [];

  for (i = 0; i < rowCount; i++) {
    var item = {};
    for (j = 0; j < columnCount; j++) {
      item[`field${ j + 1}`] = `${i + 1 }-${ j + 1}`;
    }
    items.push(item);
  }
  return items;
};
