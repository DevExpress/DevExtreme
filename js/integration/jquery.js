import jQuery from 'jquery';
import { compare as compareVersions } from '../core/utils/version';
import errors from '../core/utils/error';
import useJQueryMethod from './jquery/use_jquery';

const useJQuery = useJQueryMethod();

if(useJQuery && compareVersions(jQuery.fn.jquery, [1, 10]) < 0) {
    throw errors.Error('E0012');
}

require('./jquery/renderer');
require('./jquery/hooks');
require('./jquery/deferred');
require('./jquery/hold_ready');
require('./jquery/events');
require('./jquery/easing');
require('./jquery/element_data');
require('./jquery/element');
require('./jquery/component_registrator');
require('./jquery/ajax');
