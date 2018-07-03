"use strict";

var dxSankey = require("./sankey/sankey"),
    setTooltipCustomOptions = require("./sankey/tooltip").setTooltipCustomOptions;

dxSankey.addPlugin(require("./core/export").plugin);
dxSankey.addPlugin(require("./core/title").plugin);
dxSankey.addPlugin(require("./sankey/tracker").plugin);
dxSankey.addPlugin(require("./core/loading_indicator").plugin);
dxSankey.addPlugin(require("./core/tooltip").plugin);
setTooltipCustomOptions(dxSankey);

module.exports = dxSankey;
