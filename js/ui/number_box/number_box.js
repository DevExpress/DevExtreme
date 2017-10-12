"use strict";

var registerComponent = require("../../core/component_registrator"),
    NumberBoxLdml = require("./number_box.ldml");

registerComponent("dxNumberBox", NumberBoxLdml);

module.exports = NumberBoxLdml;
