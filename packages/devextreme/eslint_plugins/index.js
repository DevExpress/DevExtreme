const noDirectPreactSignalsCoreImport = require('./no_direct_preact_signals_core_import');
const preferSwitchTrue = require('./prefer_switch_true');

module.exports = {
    rules: {
        'no-direct-preact-signals-core-import': noDirectPreactSignalsCoreImport,
        'prefer-switch-true': preferSwitchTrue,
    },
};
