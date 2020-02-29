const jQuery = require('jquery');
const rendererBase = require('../../core/renderer_base');
const useJQuery = require('./use_jquery')();

if(useJQuery) {
    rendererBase.set(jQuery);
}
