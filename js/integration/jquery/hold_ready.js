var jQuery = require('jquery'),
    themes_callback = require('../../ui/themes_callback'),
    ready = require('../../core/utils/ready_callbacks').add;

if(jQuery && !themes_callback.fired()) {
    var holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
