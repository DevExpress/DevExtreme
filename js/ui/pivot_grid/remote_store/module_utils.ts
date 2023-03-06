export const forEachGroup = function (data, callback, level?) {
  data = data || [];
  level = level || 0;

  for (let i = 0; i < data.length; i += 1) {
    const group = data[i];
    callback(group, level);
    if (group && group.items && group.items.length) {
      forEachGroup(group.items, callback, level + 1);
    }
  }
};
