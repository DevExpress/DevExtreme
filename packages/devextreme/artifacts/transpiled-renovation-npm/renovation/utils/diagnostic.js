"use strict";

exports.DiagnosticUtils = void 0;
var _window = require("../../core/utils/window");
const DiagnosticUtils = exports.DiagnosticUtils = {
  resolveMap: () => {
    const diagnosticWindow = (0, _window.getWindow)();
    if (!diagnosticWindow.dxDiagnostic) {
      diagnosticWindow.dxDiagnostic = {};
    }
    return diagnosticWindow.dxDiagnostic;
  },
  getDiagnostic: key => {
    const diagnosticMap = DiagnosticUtils.resolveMap();
    if (!diagnosticMap[key]) {
      diagnosticMap[key] = {
        renderCount: 0
      };
    }
    return diagnosticMap[key];
  },
  incrementRenderCount: key => {
    const diagnostic = DiagnosticUtils.getDiagnostic(key);
    diagnostic.renderCount += 1;
  }
};