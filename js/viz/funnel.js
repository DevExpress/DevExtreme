"use strict";

var Funnel = require("./funnel/funnel");

Funnel.addPlugin(require("./funnel/label").plugin);
Funnel.addPlugin(require("./core/export").plugin);
Funnel.addPlugin(require("./core/title").plugin);
Funnel.addPlugin(require("./components/legend").plugin);
Funnel.addPlugin(require("./funnel/tracker").plugin);
Funnel.addPlugin(require("./funnel/tooltip").plugin);
Funnel.addPlugin(require("./core/loading_indicator").plugin);

module.exports = Funnel;
