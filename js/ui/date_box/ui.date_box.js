"use strict";

var registerComponent = require("../../core/component_registrator"),
    DateBoxMask = require("./ui.date_box.mask");

registerComponent("dxDateBox", DateBoxMask);

module.exports = DateBoxMask;
