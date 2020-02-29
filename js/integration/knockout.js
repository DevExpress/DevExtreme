const ko = require('knockout');

// Check availability in global environment
if(ko) {
    const errors = require('../core/errors');
    const compareVersion = require('../core/utils/version').compare;
    if(compareVersion(ko.version, [2, 3]) < 0) {
        throw errors.Error('E0013');
    }

    require('./knockout/component_registrator');
    require('./knockout/event_registrator');
    require('./knockout/components');
    require('./knockout/validation');
    require('./knockout/variable_wrapper_utils');
    require('./knockout/clean_node');
    require('./knockout/clean_node_old');
}
