"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTrialPanelComponents = registerTrialPanelComponents;
exports.showTrialPanel = showTrialPanel;
var _trial_panel = require("./trial_panel.client");
function showTrialPanel(buyNowUrl, version, customStyles) {
  if ((0, _trial_panel.isClient)()) {
    (0, _trial_panel.renderTrialPanel)(buyNowUrl, version, customStyles);
  }
}
function registerTrialPanelComponents(customStyles) {
  if ((0, _trial_panel.isClient)()) {
    (0, _trial_panel.registerCustomComponents)(customStyles);
  }
}