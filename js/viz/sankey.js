"use strict";

var dxSankey = require("./sankey/sankey");
dxSankey.addPlugin(require("./core/export").plugin);
dxSankey.addPlugin(require("./core/title").plugin);
dxSankey.addPlugin(require("./sankey/tracker").plugin);
dxSankey.addPlugin(require("./core/tooltip").plugin);
dxSankey.addPlugin(require("./core/loading_indicator").plugin);

module.exports = dxSankey;
