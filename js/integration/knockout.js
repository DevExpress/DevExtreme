// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import errors from '../core/errors';
import { compare as compareVersion } from '../core/utils/version';
// Check availability in global environment
if(ko) {
    if(compareVersion(ko.version, [2, 3]) < 0) {
        throw errors.Error('E0013');
    }
}

import './knockout/component_registrator';
import './knockout/event_registrator';
import './knockout/components';
import './knockout/validation';
import './knockout/variable_wrapper_utils';
import './knockout/clean_node';
import './knockout/clean_node_old';
