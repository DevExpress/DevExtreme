// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import themes_callback from '../../ui/themes_callback';
import { add as ready } from '../../core/utils/ready_callbacks';

if(jQuery && !themes_callback.fired()) {
    const holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
