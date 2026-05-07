const preferSwitchTrue = require('./prefer_switch_true');
const noDeferred = require('./no_deferred');

module.exports = {
    rules: {
        'prefer-switch-true': preferSwitchTrue,
        'no-deferred': noDeferred,
    },
};
