var jQuery = require('jquery');
var compareVersions = require('../core/utils/version').compare;
var errors = require('../core/utils/error');
var useJQuery = require('./jquery/use_jquery')();

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
