const dxFunnel = require('./funnel/funnel');

dxFunnel.addPlugin(require('./funnel/label').plugin);
dxFunnel.addPlugin(require('./core/export').plugin);
dxFunnel.addPlugin(require('./core/title').plugin);
dxFunnel.addPlugin(require('./components/legend').plugin);
dxFunnel.addPlugin(require('./funnel/tracker').plugin);
dxFunnel.addPlugin(require('./funnel/tooltip').plugin);
dxFunnel.addPlugin(require('./core/loading_indicator').plugin);

module.exports = dxFunnel;
