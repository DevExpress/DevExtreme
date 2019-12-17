var jQuery = require('jquery');
var rendererBase = require('../../core/renderer_base');
var useJQuery = require('./use_jquery')();

if(useJQuery) {
    rendererBase.set(jQuery);
}
