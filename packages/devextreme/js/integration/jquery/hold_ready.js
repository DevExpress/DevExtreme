// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import { themeReadyCallback } from '../../ui/themes_callback';
import readyCallbacks from '../../core/utils/ready_callbacks';

if(jQuery && !themeReadyCallback.fired()) {
    const holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themeReadyCallback.add(function() {
        readyCallbacks.add(function() {
            holdReady(false);
        });
    });
}
