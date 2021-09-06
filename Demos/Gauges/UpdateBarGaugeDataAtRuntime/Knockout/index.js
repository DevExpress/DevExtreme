window.onload = function () {
  const color = ko.observable(colors[0]);
  const values = ko.computed(() => {
    const code = Number(`0x${color().code.slice(1)}`);
    return [
      (code >> 16) & 0xff,
      (code >> 8) & 0xff,
      code & 0xff,
    ];
  });

  ko.applyBindings({
    colors,
    color,
    values,
  }, $('#gauge-demo').get(0));
};
