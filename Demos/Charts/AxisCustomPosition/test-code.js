(function (factory) {
  if (window.Promise && window.System) {
    Promise.all([
      System.import("devextreme/viz/chart")
    ]).then(function (args) {
      factory(args[0]);
    });
  } else {
    factory(DevExpress.viz.dxChart);
  }
})(function (dxChart) {
  var dataSource = [
    { x1: 9, y1: 5, x2: undefined, y2: undefined },
    { x1: 14, y1: 9, x2: undefined, y2: undefined },
    { x1: 7, y1: 9, x2: undefined, y2: undefined },
    { x1: 11, y1: 10, x2: undefined, y2: undefined },
    { x1: 8, y1: 11, x2: undefined, y2: undefined },
    { x1: 9, y1: 14, x2: undefined, y2: undefined },
    { x1: 5, y1: 12, x2: undefined, y2: undefined },
    { x1: 12, y1: 12, x2: undefined, y2: undefined },
    { x1: 10, y1: 5, x2: undefined, y2: undefined },
    { x1: 8, y1: 10, x2: undefined, y2: undefined },
    { x1: 14, y1: 5, x2: undefined, y2: undefined },
    { x1: 6, y1: 15, x2: undefined, y2: undefined },
    { x1: 11, y1: 8, x2: undefined, y2: undefined },
    { x1: 13, y1: 7, x2: undefined, y2: undefined },
    { x1: 6, y1: 5, x2: undefined, y2: undefined },
    { x1: 11, y1: 8, x2: undefined, y2: undefined },
    { x1: 10, y1: 6, x2: undefined, y2: undefined },
    { x1: 13, y1: 8, x2: undefined, y2: undefined },
    { x1: 5, y1: 14, x2: undefined, y2: undefined },
    { x1: 14, y1: 8, x2: undefined, y2: undefined },
    { x1: 14, y1: 8, x2: 12, y2: -11 },
    { x1: 14, y1: 8, x2: 12, y2: -14 },
    { x1: 14, y1: 8, x2: 10, y2: -6 },
    { x1: 14, y1: 8, x2: 10, y2: -10 },
    { x1: 14, y1: 8, x2: 15, y2: -8 },
    { x1: 14, y1: 8, x2: 8, y2: -10 },
    { x1: 14, y1: 8, x2: 5, y2: -9 },
    { x1: 14, y1: 8, x2: 15, y2: -11 },
    { x1: 14, y1: 8, x2: 14, y2: -5 },
    { x1: 14, y1: 8, x2: 15, y2: -9 },
    { x1: 14, y1: 8, x2: 8, y2: -15 },
    { x1: 14, y1: 8, x2: 11, y2: -7 },
    { x1: 14, y1: 8, x2: 7, y2: -9 },
    { x1: 14, y1: 8, x2: 6, y2: -12 },
    { x1: 14, y1: 8, x2: 9, y2: -9 },
    { x1: 14, y1: 8, x2: 8, y2: -10 },
    { x1: 14, y1: 8, x2: 11, y2: -8 },
    { x1: 14, y1: 8, x2: 5, y2: -12 },
    { x1: 14, y1: 8, x2: 13, y2: -9 },
    { x1: 14, y1: 8, x2: 12, y2: -7 },
    { x1: 14, y1: 8, x2: -10, y2: 12 },
    { x1: 14, y1: 8, x2: -10, y2: 15 },
    { x1: 14, y1: 8, x2: -14, y2: 8 },
    { x1: 14, y1: 8, x2: -10, y2: 13 },
    { x1: 14, y1: 8, x2: -5, y2: 11 },
    { x1: 14, y1: 8, x2: -11, y2: 15 },
    { x1: 14, y1: 8, x2: -14, y2: 15 },
    { x1: 14, y1: 8, x2: -7, y2: 8 },
    { x1: 14, y1: 8, x2: -7, y2: 8 },
    { x1: 14, y1: 8, x2: -12, y2: 6 },
    { x1: 14, y1: 8, x2: -10, y2: 8 },
    { x1: 14, y1: 8, x2: -15, y2: 10 },
    { x1: 14, y1: 8, x2: -15, y2: 11 },
    { x1: 14, y1: 8, x2: -6, y2: 8 },
    { x1: 14, y1: 8, x2: -11, y2: 12 },
    { x1: 14, y1: 8, x2: -13, y2: 8 },
    { x1: 14, y1: 8, x2: -12, y2: 8 },
    { x1: 14, y1: 8, x2: -9, y2: 7 },
    { x1: 14, y1: 8, x2: -9, y2: 8 },
    { x1: 14, y1: 8, x2: -8, y2: 8 },
    { x1: -12, y1: -9, x2: -8, y2: 8 },
    { x1: -5, y1: -8, x2: -8, y2: 8 },
    { x1: -7, y1: -14, x2: -8, y2: 8 },
    { x1: -9, y1: -6, x2: -8, y2: 8 },
    { x1: -9, y1: -15, x2: -8, y2: 8 },
    { x1: -7, y1: -13, x2: -8, y2: 8 },
    { x1: -14, y1: -8, x2: -8, y2: 8 },
    { x1: -6, y1: -12, x2: -8, y2: 8 },
    { x1: -11, y1: -11, x2: -8, y2: 8 },
    { x1: -11, y1: -10, x2: -8, y2: 8 },
    { x1: -5, y1: -9, x2: -8, y2: 8 },
    { x1: -12, y1: -13, x2: -8, y2: 8 },
    { x1: -6, y1: -15, x2: -8, y2: 8 },
    { x1: -9, y1: -13, x2: -8, y2: 8 },
    { x1: -6, y1: -13, x2: -8, y2: 8 },
    { x1: -15, y1: -15, x2: -8, y2: 8 },
    { x1: -6, y1: -7, x2: -8, y2: 8 },
    { x1: -15, y1: -11, x2: -8, y2: 8 },
    { x1: -15, y1: -14, x2: -8, y2: 8 },
    { x1: -11, y1: -6, x2: -8, y2: 8 },
  ];
  
    var instance = dxChart.getInstance(document.getElementById("chart"));
    instance.option("dataSource", dataSource);
    instance.option = function() { };
});

