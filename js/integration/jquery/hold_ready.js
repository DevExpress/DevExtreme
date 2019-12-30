const jQuery = require('jquery');
const themes_callback = require('../../ui/themes_callback');
const ready = require('../../core/utils/ready_callbacks').add;

if(jQuery && !themes_callback.fired()) {
    const holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
