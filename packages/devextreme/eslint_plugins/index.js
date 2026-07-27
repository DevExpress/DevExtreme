/* eslint-disable spellcheck/spell-checker */
const noDirectPreactSignalsCoreImport = require('./no_direct_preact_signals_core_import');
const preferSwitchTrue = require('./prefer_switch_true');
const noDeferred = require('./no_deferred');
const jsdocDefaultMatchesType = require('./jsdoc_default_matches_type');

module.exports = {
    rules: {
        'no-direct-preact-signals-core-import': noDirectPreactSignalsCoreImport,
        'prefer-switch-true': preferSwitchTrue,
        'no-deferred': noDeferred,
        'jsdoc-default-matches-type': jsdocDefaultMatchesType,
    },
};
