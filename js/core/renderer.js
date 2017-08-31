"use strict";

var rendererBase = require("./renderer_base");
require("../integration/jquery/renderer");
require("../integration/jquery/component_registrator");
require("../integration/jquery/events");

module.exports = rendererBase.get();
