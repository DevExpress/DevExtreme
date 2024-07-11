"use strict";

exports.exportGantt = exportGantt;
function exportGantt(options) {
  const component = options.component;
  return component === null || component === void 0 ? void 0 : component.exportToPdf(options);
}